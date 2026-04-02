function buildUrl(path) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (base && /^https?:\/\//.test(base)) {
    return `${base.replace(/\/+$/, '')}${path}`
  }
  return path
}

export async function apiFetch(path, init = {}) {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || `${init.method || 'GET'} ${path} failed (${response.status})`
    throw new Error(message)
  }

  return payload
}
