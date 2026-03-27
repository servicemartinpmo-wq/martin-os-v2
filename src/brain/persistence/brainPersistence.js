import { supabase } from '../../lib/supabaseClient'
import { toSpectatorContract } from '../contracts/spectatorContract'

const LOCAL_KEY = 'martin-os-brain-cache'
const QUEUE_KEY = 'martin-os-brain-queue'
const PROJECT_KEY = 'martin-os-project-id'
const USER_KEY = 'martin-os-user-id'
let syncIntervalId = null

function getOrCreateLocalUuid(storageKey) {
  if (typeof window === 'undefined') return '00000000-0000-4000-8000-000000000000'
  const existing = window.localStorage.getItem(storageKey)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.localStorage.setItem(storageKey, id)
  return id
}

async function getActorContext() {
  const fallbackUserId = getOrCreateLocalUuid(USER_KEY)
  const projectId = getOrCreateLocalUuid(PROJECT_KEY)

  if (!supabase) {
    return { userId: fallbackUserId, projectId, canWriteRemote: false }
  }

  try {
    const { data } = await supabase.auth.getUser()
    const userId = data?.user?.id
    if (userId) {
      window.localStorage.setItem(USER_KEY, userId)
      return { userId, projectId, canWriteRemote: true }
    }
    return { userId: fallbackUserId, projectId, canWriteRemote: false }
  } catch {
    return { userId: fallbackUserId, projectId, canWriteRemote: false }
  }
}

function readLocalCache() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(LOCAL_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeLocalCache(next) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
}

function readQueue() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(QUEUE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeQueue(queue) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

function buildStoryPayload({ proof, recommendation, activeModule, events }) {
  const moduleName = activeModule || 'flow'
  const recent = events.slice(-40)
  const retries = recent.filter((event) => event.type === 'intent_hover_commit').length
  const awakenCount = recent.filter((event) => event.type === 'signature_awaken').length
  return {
    title: `${moduleName} build story`,
    narrative: `Focused on ${moduleName}, iterated through ${retries} intent checkpoints, and reached Proof ${proof.proofOfWork}.`,
    outcome_summary: recommendation?.message || `System IQ moved to ${proof.systemIQ}.`,
    awakenCount,
  }
}

async function persistRemote({
  proof,
  outcomes,
  curiosityFragments,
  recommendation,
  activeModule,
  lastSignal,
  events,
  userId,
  projectId,
}) {
  const nowIso = new Date().toISOString()

  await supabase.from('user_metrics').insert({
    user_id: userId,
    execution_score: proof.execution,
    efficiency_score: proof.efficiency,
    impact_score: proof.impact,
    system_iq_score: proof.systemIQ,
    last_updated: nowIso,
  })

  await supabase.from('project_metrics').insert({
    project_id: projectId,
    execution_score: proof.execution,
    efficiency_score: proof.efficiency,
    impact_score: proof.impact,
    proof_of_work_score: proof.proofOfWork,
    last_updated: nowIso,
  })

  await supabase.from('system_metrics').insert({
    user_id: userId,
    redundancy_score: Math.max(0, 100 - proof.efficiency),
    automation_score: proof.execution,
    dependency_clarity_score: proof.systemIQ,
    system_iq_score: proof.systemIQ,
  })

  if (outcomes[0]) {
    await supabase.from('outcomes').insert({
      user_id: userId,
      outcome_type: outcomes[0].label,
      outcome_value: outcomes[0].value,
      proof_context: {
        proof_of_work: proof.proofOfWork,
        system_iq: proof.systemIQ,
      },
    })
  }

  const feedRows = curiosityFragments.slice(0, 2).map((fragment) => ({
    fragment,
    novelty_score: proof.impact / 10,
    replay_score: proof.execution / 10,
    outcome_score: proof.efficiency / 10,
  }))

  if (feedRows.length) {
    await supabase.from('feed_items').insert(feedRows)
  }

  if (lastSignal === 'signature_awaken') {
    const storyPayload = buildStoryPayload({
      proof,
      recommendation,
      activeModule,
      events,
    })

    const { data: story } = await supabase
      .from('build_stories')
      .insert({
        user_id: userId,
        title: storyPayload.title,
        narrative: storyPayload.narrative,
        outcome_summary: storyPayload.outcome_summary,
      })
      .select('*')
      .single()

    if (story) {
      await supabase.from('feed_items').insert({
        source_story_id: story.id,
        fragment: `${story.title} • ${story.outcome_summary}`,
        novelty_score: proof.impact / 9,
        replay_score: proof.execution / 9,
        outcome_score: proof.efficiency / 9,
      })
    }
  }
}

function persistLocal({ proof, outcomes, curiosityFragments, recommendation, activeModule, lastSignal, events }) {
  const cache = readLocalCache() || {
    user_metrics: [],
    project_metrics: [],
    system_metrics: [],
    outcomes: [],
    build_stories: [],
    feed_items: [],
  }

  const now = Date.now()
  cache.user_metrics.push({
    user_id: getOrCreateLocalUuid(USER_KEY),
    execution_score: proof.execution,
    efficiency_score: proof.efficiency,
    impact_score: proof.impact,
    system_iq_score: proof.systemIQ,
    last_updated: now,
  })
  cache.project_metrics.push({
    project_id: getOrCreateLocalUuid(PROJECT_KEY),
    execution_score: proof.execution,
    efficiency_score: proof.efficiency,
    impact_score: proof.impact,
    proof_of_work_score: proof.proofOfWork,
    last_updated: now,
  })
  cache.system_metrics.push({
    user_id: getOrCreateLocalUuid(USER_KEY),
    redundancy_score: Math.max(0, 100 - proof.efficiency),
    automation_score: proof.execution,
    dependency_clarity_score: proof.systemIQ,
    system_iq_score: proof.systemIQ,
    created_at: now,
  })

  if (outcomes[0]) {
    cache.outcomes.push({
      outcome_type: outcomes[0].label,
      outcome_value: outcomes[0].value,
      proof_context: { proof_of_work: proof.proofOfWork, system_iq: proof.systemIQ },
      created_at: now,
    })
  }

  curiosityFragments.slice(0, 2).forEach((fragment) => {
    cache.feed_items.push({
      fragment,
      novelty_score: proof.impact / 10,
      replay_score: proof.execution / 10,
      outcome_score: proof.efficiency / 10,
      created_at: now,
    })
  })

  if (lastSignal === 'signature_awaken') {
    const storyPayload = buildStoryPayload({
      proof,
      recommendation,
      activeModule,
      events,
    })
    const storyId = `story-${now}`
    cache.build_stories.unshift({
      id: storyId,
      title: storyPayload.title,
      narrative: storyPayload.narrative,
      outcome_summary: storyPayload.outcome_summary,
      created_at: now,
    })
    cache.feed_items.unshift({
      source_story_id: storyId,
      fragment: `${storyPayload.title} • ${storyPayload.outcome_summary}`,
      novelty_score: proof.impact / 9,
      replay_score: proof.execution / 9,
      outcome_score: proof.efficiency / 9,
      created_at: now,
    })
  }

  cache.feed_items = cache.feed_items.slice(-80)
  cache.build_stories = cache.build_stories.slice(0, 20)
  writeLocalCache(cache)
}

export async function persistBrainSnapshot(payload) {
  persistLocal(payload)
  const queue = readQueue()
  queue.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    payload,
  })
  writeQueue(queue.slice(-40))
  await flushBrainSyncQueue()
}

export async function flushBrainSyncQueue() {
  const queue = readQueue()
  if (!queue.length) return
  const actor = await getActorContext()
  if (!actor.canWriteRemote || !supabase) return

  const remaining = []
  for (const item of queue) {
    try {
      await persistRemote({ ...item.payload, userId: actor.userId, projectId: actor.projectId })
    } catch {
      remaining.push(item)
    }
  }
  writeQueue(remaining)
}

export function startBrainSyncWorker() {
  if (typeof window === 'undefined') return
  if (syncIntervalId) return
  syncIntervalId = window.setInterval(() => {
    void flushBrainSyncQueue()
  }, 8000)
  window.addEventListener('online', flushBrainSyncQueue)
}

export function stopBrainSyncWorker() {
  if (typeof window === 'undefined') return
  if (syncIntervalId) {
    window.clearInterval(syncIntervalId)
    syncIntervalId = null
  }
  window.removeEventListener('online', flushBrainSyncQueue)
}

export async function fetchSpectatorContract(proof) {
  if (supabase) {
    try {
      const [{ data: feedItems }, { data: stories }] = await Promise.all([
        supabase.from('feed_items').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('build_stories').select('*').order('created_at', { ascending: false }).limit(3),
      ])
      return toSpectatorContract({
        feedItems: feedItems || [],
        stories: stories || [],
        proof,
      })
    } catch {
      // fall through to local cache
    }
  }

  const cache = readLocalCache()
  return toSpectatorContract({
    feedItems: cache?.feed_items || [],
    stories: cache?.build_stories || [],
    proof,
  })
}
