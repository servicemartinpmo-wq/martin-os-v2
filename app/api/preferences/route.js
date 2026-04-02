import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const DEFAULT_PROFILE_KEY = 'default'
const replayCache = new Map()
const MAX_REPLAY_CACHE = 500

function sanitizeProfileKey(input) {
  if (typeof input !== 'string') return DEFAULT_PROFILE_KEY
  const trimmed = input.trim()
  if (!trimmed) return DEFAULT_PROFILE_KEY
  // Constrain to a safe identifier for both storage and logs.
  const safe = trimmed.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
  return safe || DEFAULT_PROFILE_KEY
}

function getSupabaseServerClient() {
  // Prefer server env when available; fall back to NEXT_PUBLIC for local/demo.
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function trimReplayCache() {
  while (replayCache.size > MAX_REPLAY_CACHE) {
    const firstKey = replayCache.keys().next().value
    replayCache.delete(firstKey)
  }
}

function getIdempotencyKey(request, body) {
  const headerKey = request.headers.get('x-idempotency-key')
  if (headerKey && headerKey.trim()) return headerKey.trim()
  if (typeof body?.idempotencyKey === 'string' && body.idempotencyKey.trim()) {
    return body.idempotencyKey.trim()
  }
  return null
}

function writeFingerprint(body, profileKey) {
  return JSON.stringify({
    profileKey,
    userMode: body.userMode ?? null,
    themePresetId: body.themePresetId ?? null,
    layoutMode: body.layoutMode ?? null,
    industryId: body.industryId ?? null,
    reducedMotion: typeof body.reducedMotion === 'boolean' ? body.reducedMotion : null,
    brandProfile: body.brandProfile ?? null,
    overrideFlags: body.overrideFlags ?? null,
  })
}

function fallbackProfile(profileKey) {
  return {
    id: `fallback-${profileKey}`,
    profileKey,
    userMode: null,
    themePresetId: null,
    layoutMode: null,
    industryId: null,
    reducedMotion: null,
    brandProfile: null,
    overrideFlags: null,
    source: 'fallback',
  }
}

export async function GET(request) {
  const profileKey = sanitizeProfileKey(
    new URL(request.url).searchParams.get('profileKey'),
  )
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return Response.json({ profile: fallbackProfile(profileKey), source: 'fallback' })
  }

  try {
    const { data, error } = await supabase
      .from('experience_profiles')
      .select(
        'id,profile_key,user_mode,theme_preset_id,layout_mode,industry_id,reduced_motion,brand_profile,override_flags',
      )
      .eq('profile_key', profileKey)
      .maybeSingle()

    if (error || !data) {
      return Response.json({
        profile: fallbackProfile(profileKey),
        source: 'fallback',
        error: error?.message ?? null,
      })
    }

    return Response.json({
      profile: {
        id: data.id,
        profileKey: data.profile_key,
        userMode: data.user_mode,
        themePresetId: data.theme_preset_id,
        layoutMode: data.layout_mode,
        industryId: data.industry_id,
        reducedMotion: data.reduced_motion,
        brandProfile: data.brand_profile,
        overrideFlags: data.override_flags,
      },
      source: 'supabase',
    })
  } catch (error) {
    return Response.json({
      profile: fallbackProfile(profileKey),
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown preference read error',
    })
  }
}

export async function POST(request) {
  const supabase = getSupabaseServerClient()
  const body = await request.json().catch(() => ({}))
  const profileKey = sanitizeProfileKey(body.profileKey)
  const idempotencyKey = getIdempotencyKey(request, body)
  const requestFingerprint = writeFingerprint(body, profileKey)

  if (idempotencyKey && replayCache.has(idempotencyKey)) {
    const cached = replayCache.get(idempotencyKey)
    if (cached.requestFingerprint !== requestFingerprint) {
      return Response.json(
        { ok: false, error: 'Idempotency key reuse with different payload' },
        { status: 409 },
      )
    }
    return Response.json(
      { ...cached.payload, idempotentReplay: true },
      { status: cached.status, headers: { 'x-idempotent-replay': '1' } },
    )
  }

  if (!supabase) {
    const payload = {
      ok: false,
      persisted: false,
      source: 'fallback',
      profile: fallbackProfile(profileKey),
    }
    if (idempotencyKey) {
      replayCache.set(idempotencyKey, {
        requestFingerprint,
        status: 200,
        payload,
      })
      trimReplayCache()
    }
    return Response.json(payload)
  }

  try {
    const upsertPayload = {
      profile_key: profileKey,
      user_mode: body.userMode ?? null,
      theme_preset_id: body.themePresetId ?? null,
      layout_mode: body.layoutMode ?? null,
      industry_id: body.industryId ?? null,
      reduced_motion: typeof body.reducedMotion === 'boolean' ? body.reducedMotion : null,
      brand_profile: body.brandProfile ?? null,
      override_flags: body.overrideFlags ?? null,
    }

    const { data, error } = await supabase
      .from('experience_profiles')
      .upsert(upsertPayload, { onConflict: 'profile_key' })
      .select('id,profile_key')
      .maybeSingle()

    if (error) {
      return Response.json({
        ok: false,
        persisted: false,
        source: 'fallback',
        error: error.message,
      })
    }

    const responsePayload = {
      ok: true,
      persisted: true,
      source: 'supabase',
      profile: {
        id: data?.id ?? null,
        profileKey: data?.profile_key ?? profileKey,
      },
    }
    if (idempotencyKey) {
      replayCache.set(idempotencyKey, {
        requestFingerprint,
        status: 200,
        payload: responsePayload,
      })
      trimReplayCache()
    }
    return Response.json(responsePayload)
  } catch (error) {
    return Response.json({
      ok: false,
      persisted: false,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown preference write error',
    })
  }
}
