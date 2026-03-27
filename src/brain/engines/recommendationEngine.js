export function recommendNext(scores, activeModule) {
  if (scores.systemIQ < 55) {
    return {
      type: 'complexity-collapse',
      message: 'Simplify one noisy workflow and capture a before/after story.',
    }
  }

  if (scores.impact > 70) {
    return {
      type: 'build-story',
      message: 'Convert this momentum into a cinematic build story fragment.',
    }
  }

  return {
    type: 'remix',
    message: `Remix ${activeModule || 'your current flow'} into a reusable template.`,
  }
}
