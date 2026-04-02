import { jsonFetch } from '@/lib/api/http'

export async function fetchGoalsDashboard() {
  return jsonFetch('/api/goals')
}

export async function fetchTechOpsDashboard() {
  return jsonFetch('/api/techops')
}

export async function fetchMiiddleDashboard() {
  return jsonFetch('/api/miiddle')
}
