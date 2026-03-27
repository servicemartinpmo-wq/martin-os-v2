export const documentContracts = {
  techOpsBuild: {
    name: 'Tech-OPS BUILD (1).pdf',
    domain: 'tech-ops',
    requirements: [
      'Four-layer architecture: data, logic, AI, workflow',
      'Ticket + diagnostics + knowledge tables',
      'Confidence-based tier routing',
      'Escalation and activity logging',
      'RLS-ready support boundaries',
    ],
  },
  pmoBusinessPlan: {
    name: 'PMO-Ops_Business_Operations_Plan.md.pdf',
    domain: 'pmo-ops',
    requirements: [
      'Command dashboard as source of truth',
      'Finance + initiative coupling',
      'Decision/action traceability',
      'Advisory guidance for operators',
      'Onboarding path by business stage',
    ],
  },
  pmoEngine: {
    name: 'PMO-OPS Code - engine.docx.pdf',
    domain: 'pmo-ops',
    requirements: [
      'Moduleized engine structure',
      'Knowledge-base and framework linkage',
      'Scoring and dependency context',
    ],
  },
  miidlePlan: {
    name: 'miidle – Master Build & Business Plan.pdf',
    domain: 'miidle',
    requirements: [
      'Execution capture and work graph',
      'Build-story generation',
      'Spectator and builder experiences',
      'Proof-of-work / portfolio output',
      'PMO/Ops/Tech integrations',
    ],
  },
  geminiBuild: {
    name: 'Gemini_GPT Build (1).pdf',
    domain: 'cross-app',
    requirements: [
      'Deterministic input classification',
      'Context builder and routing',
      'Workflow state contracts',
      'Supabase-ready schema contracts',
      'Frontend response payload standards',
    ],
  },
}

export function getContractsForDomain(domain) {
  return Object.values(documentContracts).filter((contract) => contract.domain === domain || contract.domain === 'cross-app')
}
