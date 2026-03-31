import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const ACTION_CREATE_PROJECT = 'create_project'

function jsonWithRequestId(body, status, requestId) {
  return Response.json(
    { ...body, requestId },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'x-request-id': requestId,
      },
    },
  )
}

function getSupabaseClient() {
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

async function resolveUserIdFromBearer(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) return null
  const token = authorizationHeader.slice('Bearer '.length).trim()
  if (!token) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user?.id) return null
  return data.user.id
}

export async function POST(request) {
  const requestId = randomUUID()
  const userId = await resolveUserIdFromBearer(request.headers.get('authorization'))

  if (!userId) {
    return jsonWithRequestId(
      { ok: false, error: 'Unauthorized: missing or invalid bearer token' },
      401,
      requestId,
    )
  }

  let body = {}
  try {
    body = await request.json()
  } catch {
    return jsonWithRequestId({ ok: false, error: 'Invalid JSON body' }, 400, requestId)
  }

  const actionId = typeof body?.actionId === 'string' ? body.actionId : ''
  const payload = body?.payload && typeof body.payload === 'object' ? body.payload : {}

  if (!actionId) {
    return jsonWithRequestId({ ok: false, error: 'Missing actionId' }, 400, requestId)
  }

  if (actionId !== ACTION_CREATE_PROJECT) {
    return jsonWithRequestId(
      { ok: false, error: `Action not implemented: ${actionId}` },
      400,
      requestId,
    )
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return jsonWithRequestId(
      {
        ok: false,
        status: 'failed',
        error: 'Supabase is not configured in environment',
      },
      500,
      requestId,
    )
  }

  const projectName =
    typeof payload?.name === 'string' && payload.name.trim() ? payload.name.trim() : 'Untitled project'

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: userId,
        name: projectName,
      })
      .select('id,owner_id,name,created_at')
      .maybeSingle()

    if (error) {
      return jsonWithRequestId(
        {
          ok: false,
          status: 'failed',
          error: error.message,
        },
        400,
        requestId,
      )
    }

    return jsonWithRequestId(
      {
        ok: true,
        status: 'completed',
        result: data ?? null,
      },
      200,
      requestId,
    )
  } catch (error) {
    return jsonWithRequestId(
      {
        ok: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown action execution error',
      },
      500,
      requestId,
    )
  }
}
