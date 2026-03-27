function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function scoreFromEvents(events) {
  const recent = events.slice(-200)
  if (!recent.length) {
    return {
      execution: 42,
      efficiency: 46,
      impact: 40,
      proofOfWork: 43,
      systemIQ: 44,
    }
  }

  const hoverIntent = recent.filter((event) => event.type === 'intent_hover_commit').length
  const awakenMoments = recent.filter((event) => event.type === 'signature_awaken').length
  const curiosityOpens = recent.filter((event) => event.type === 'artifact_open').length
  const cursorBursts = recent.filter(
    (event) => event.type === 'cursor_energy' && (event.payload?.intensity || 0) > 0.62
  ).length

  const execution = clamp(48 + hoverIntent * 3 + awakenMoments * 4, 0, 100)
  const efficiency = clamp(45 + (hoverIntent - cursorBursts) * 2 + curiosityOpens * 3, 0, 100)
  const impact = clamp(40 + awakenMoments * 8 + curiosityOpens * 4, 0, 100)
  const proofOfWork = clamp(
    Math.round(execution * 0.42 + efficiency * 0.24 + impact * 0.34),
    0,
    100
  )
  const systemIQ = clamp(
    Math.round(efficiency * 0.45 + impact * 0.2 + execution * 0.35),
    0,
    100
  )

  return { execution, efficiency, impact, proofOfWork, systemIQ }
}
