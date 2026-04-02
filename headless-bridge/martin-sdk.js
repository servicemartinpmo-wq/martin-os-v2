/* Martin OS headless bridge SDK (vanilla JS, zero dependencies) */
(function (globalScope) {
  function ensureBaseUrl(baseUrl) {
    if (!baseUrl) return ''
    return String(baseUrl).replace(/\/+$/, '')
  }

  function buildUrl(baseUrl, path) {
    if (!path.startsWith('/')) throw new Error('Path must start with "/"')
    return `${ensureBaseUrl(baseUrl)}${path}`
  }

  async function parseJsonOrThrow(response) {
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const message = payload && payload.error ? payload.error : `HTTP ${response.status}`
      throw new Error(message)
    }
    return payload
  }

  function createClient(config) {
    const settings = Object.assign({ baseUrl: '', headers: {} }, config || {})
    const baseUrl = ensureBaseUrl(settings.baseUrl)
    const defaultHeaders = Object.assign({}, settings.headers)

    async function requestJson(path, options) {
      const response = await fetch(buildUrl(baseUrl, path), Object.assign(
        {
          headers: Object.assign({ 'Content-Type': 'application/json' }, defaultHeaders),
        },
        options || {},
      ))
      return parseJsonOrThrow(response)
    }

    return {
      getHealth: function getHealth() {
        return requestJson('/api/health', { method: 'GET' })
      },
      getGoals: function getGoals() {
        return requestJson('/api/goals', { method: 'GET' })
      },
      getTechOps: function getTechOps() {
        return requestJson('/api/techops', { method: 'GET' })
      },
      getMiiddle: function getMiiddle() {
        return requestJson('/api/miiddle', { method: 'GET' })
      },
      orchestrateAI: function orchestrateAI(input) {
        return requestJson('/api/ai/orchestrate', {
          method: 'POST',
          body: JSON.stringify(input || {}),
        })
      },
      sendBrain: function sendBrain(input) {
        return requestJson('/api/ai', {
          method: 'POST',
          body: JSON.stringify(input || {}),
        })
      },
      getMemory: function getMemory(limit) {
        var safeLimit = Number(limit)
        if (!Number.isFinite(safeLimit)) safeLimit = 100
        safeLimit = Math.max(1, Math.min(300, Math.floor(safeLimit)))
        return requestJson('/api/memory?limit=' + safeLimit, { method: 'GET' })
      },
      pushMemoryEvent: function pushMemoryEvent(input) {
        return requestJson('/api/memory', {
          method: 'POST',
          body: JSON.stringify(input || {}),
        })
      },
      getLearning: function getLearning(limit) {
        var safeLimit = Number(limit)
        if (!Number.isFinite(safeLimit)) safeLimit = 100
        safeLimit = Math.max(1, Math.min(500, Math.floor(safeLimit)))
        return requestJson('/api/learning?limit=' + safeLimit, { method: 'GET' })
      },
      pushLearningEvent: function pushLearningEvent(input) {
        return requestJson('/api/learning', {
          method: 'POST',
          body: JSON.stringify(input || {}),
        })
      },
      getPreferences: function getPreferences(profileKey) {
        var safeProfileKey = typeof profileKey === 'string' && profileKey ? profileKey : 'default'
        return requestJson('/api/preferences?profileKey=' + encodeURIComponent(safeProfileKey), {
          method: 'GET',
        })
      },
      upsertPreferences: function upsertPreferences(input) {
        return requestJson('/api/preferences', {
          method: 'POST',
          body: JSON.stringify(input || {}),
        })
      },
      streamAI: function streamAI(input, handlers) {
        return StreamHandler.stream(
          buildUrl(baseUrl, '/api/ai/orchestrate'),
          Object.assign({ headers: defaultHeaders }, input || {}),
          handlers || {},
        )
      },
    }
  }

  var StreamHandler = {
    stream: async function stream(url, payload, handlers) {
      var onChunk = handlers.onChunk || function () {}
      var onComplete = handlers.onComplete || function () {}
      var onError = handlers.onError || function () {}
      try {
        var response = await fetch(url, {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, payload.headers || {}),
          body: JSON.stringify(Object.assign({}, payload, { stream: true, headers: undefined })),
        })
        if (!response.ok) {
          throw new Error('Streaming request failed: ' + response.status)
        }
        if (!response.body || typeof response.body.getReader !== 'function') {
          throw new Error('ReadableStream is not available')
        }
        var reader = response.body.getReader()
        var decoder = new TextDecoder()
        while (true) {
          var next = await reader.read()
          if (next.done) break
          var chunk = decoder.decode(next.value, { stream: true })
          onChunk(chunk)
        }
        onComplete()
      } catch (error) {
        onError(error)
        throw error
      }
    },
  }

  globalScope.MartinSDK = {
    createClient: createClient,
    StreamHandler: StreamHandler,
  }
})(typeof window !== 'undefined' ? window : globalThis)
