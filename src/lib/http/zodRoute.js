export function badRequest(message, details) {
  return Response.json(
    {
      error: message,
      details: details ?? null,
    },
    { status: 400 },
  )
}

export function internalError(message) {
  return Response.json(
    {
      error: message,
    },
    { status: 500 },
  )
}

export async function parseJsonBody(request, schema) {
  let body = {}
  try {
    body = await request.json()
  } catch {
    return { ok: false, response: badRequest('Invalid JSON') }
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return {
      ok: false,
      response: badRequest('Invalid request payload', parsed.error.flatten()),
    }
  }
  return { ok: true, data: parsed.data }
}

export function validateResponse(payload, schema) {
  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    return { ok: false, response: internalError('Response contract validation failed') }
  }
  return { ok: true, data: parsed.data }
}

export function jsonRoute({ requestSchema, responseSchema, handler }) {
  return async function routeHandler(request) {
    const parsed = await parseJsonBody(request, requestSchema)
    if (!parsed.ok) return parsed.response

    try {
      const payload = await handler({ body: parsed.data, request })
      const validated = validateResponse(payload, responseSchema)
      if (!validated.ok) return validated.response
      return Response.json(validated.data)
    } catch {
      return internalError('Unhandled route error')
    }
  }
}
