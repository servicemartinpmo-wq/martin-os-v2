export const PLATFORM_FEATURES = [
  {
    id: 'modes',
    name: 'Operating modes',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
    notes: 'Founder, Executive, Assisted, Project, Freelance, Creative, Healthcare',
  },
  {
    id: 'ai_advisory',
    name: 'AI Advisory Layer',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'company_intelligence',
    name: 'Company Intelligence System',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'consulting_modules',
    name: 'Consulting-in-a-box modules',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'one_click_diagnostics',
    name: 'One-click diagnostics',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'project_work_mgmt',
    name: 'Project & work management',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'decision_memory',
    name: 'Decision & memory system',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'kpi_analytics',
    name: 'KPI & analytics engine',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'recommendation_system',
    name: 'Recommendation system',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'workflow_automation',
    name: 'Workflow automation',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'data_os',
    name: 'Data Operating System',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'universal_connectivity',
    name: 'Universal connectivity',
    category: 'Core Platform',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'import_migration',
    name: 'Import / migration engine',
    category: 'Growth',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'community_network',
    name: 'Community & network',
    category: 'Growth',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'industry_advisors',
    name: 'Industry-specific advisors',
    category: 'Growth',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'marketing_intel',
    name: 'Marketing intelligence engine',
    category: 'Growth',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'assist_accessibility',
    name: 'Accessibility / assist mode',
    category: 'UX',
    required: { ui: true, middle: true, backend: false },
  },
  {
    id: 'personalization',
    name: 'Personalization engine',
    category: 'UX',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'notifications',
    name: 'Notifications system',
    category: 'UX',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'engagement',
    name: 'User engagement system',
    category: 'UX',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'admin_panel',
    name: 'Admin control panel',
    category: 'Admin',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'system_health',
    name: 'System health & monitoring',
    category: 'Admin',
    required: { ui: true, middle: true, backend: true },
  },
  {
    id: 'security',
    name: 'Security layer',
    category: 'Admin',
    required: { ui: true, middle: true, backend: true },
  },
]

export const IMPLEMENTATION_INDEX = {
  modes: {
    ui: ['/settings', '/'],
    middle: ['src/context/MartinOsProvider.jsx', 'src/layouts/LayoutOrchestrator.jsx'],
    backend: ['app/api/preferences/route.js'],
  },
  ai_advisory: {
    ui: ['/pmo-ops/briefing', '/pmo-ops/diagnostics', '/tech-ops/diagnostics'],
    middle: ['core/knowledge-engine.ts', 'core/context-engine.ts'],
    backend: ['app/api/ai/route.js'],
  },
  company_intelligence: {
    ui: ['/pmo-ops/command-center', '/reports/weekly'],
    middle: ['src/features/data/operationalData.js'],
    backend: ['app/api/logs/route.js'],
  },
  consulting_modules: {
    ui: ['/pmo-ops/frameworks'],
    middle: ['src/registry/frameworkRegistry.js'],
    backend: [],
  },
  one_click_diagnostics: {
    ui: ['/pmo-ops/diagnostics', '/tech-ops/diagnostics'],
    middle: ['src/components/pmo/DiagnosticEngine.jsx'],
    backend: ['app/api/ai/route.js'],
  },
  project_work_mgmt: {
    ui: ['/pmo-ops/initiatives', '/tech-ops/tickets', '/tech-ops/workflows'],
    middle: ['core/knowledge-engine.ts', 'src/lib/pmoInitiativeShape.js'],
    backend: ['app/api/learning/route.js'],
  },
  decision_memory: {
    ui: ['/pmo-ops/decisions'],
    middle: ['src/brain/memoryStore.js'],
    backend: ['app/api/memory/route.js'],
  },
  kpi_analytics: {
    ui: ['/pmo-ops/reports', '/pmo-dashboard'],
    middle: ['src/features/pmo/usePmoOrgDashboardData.js'],
    backend: ['app/api/logs/route.js'],
  },
  recommendation_system: {
    ui: ['/pmo-ops/briefing'],
    middle: ['core/response-builder.ts'],
    backend: ['app/api/ai/route.js'],
  },
  workflow_automation: {
    ui: ['/knowledge/workflows', '/tech-ops/workflows'],
    middle: ['agents/k2w-workflow-assembler.ts', 'core/execution-engine.ts'],
    backend: ['app/api/cron/techops-heartbeat/route.js'],
  },
  data_os: {
    ui: ['/ontology'],
    middle: ['core/context-table.ts', 'src/lib/ontologyRegistry.js'],
    backend: ['app/api/preferences/route.js'],
  },
  universal_connectivity: {
    ui: ['/import', '/tech-ops/connectors'],
    middle: ['src/lib/importConnectors.js'],
    backend: ['app/api/import/sync/route.js'],
  },
  import_migration: {
    ui: ['/import'],
    middle: ['src/lib/importConnectors.js'],
    backend: ['app/api/import/sync/route.js'],
  },
  community_network: {
    ui: ['/community/playbooks'],
    middle: ['src/features/data/operationalData.js'],
    backend: [],
  },
  industry_advisors: {
    ui: ['/settings', '/pmo-ops/frameworks'],
    middle: ['src/lib/industryMatrix.js'],
    backend: [],
  },
  marketing_intel: {
    ui: ['/miidle', '/miidle/story-engine'],
    middle: ['src/components/miiddle/StoryEngine.jsx'],
    backend: ['app/api/ai/route.js'],
  },
  assist_accessibility: {
    ui: ['/settings'],
    middle: ['src/components/assist/ExplainThis.jsx', 'src/components/assist/VoiceCommandsStub.jsx'],
    backend: [],
  },
  personalization: {
    ui: ['/settings'],
    middle: ['src/store/useMartinStore.js', 'src/context/MartinOsProvider.jsx'],
    backend: ['app/api/preferences/route.js'],
  },
  notifications: {
    ui: ['/settings'],
    middle: ['src/components/shell/ToastContainer.jsx', 'src/components/signals/SignalFeed.jsx'],
    backend: ['app/api/logs/route.js'],
  },
  engagement: {
    ui: ['/settings', '/miidle'],
    middle: ['src/components/signals/SignalFeed.jsx'],
    backend: [],
  },
  admin_panel: {
    ui: ['/settings'],
    middle: ['src/lib/featureFlags.js'],
    backend: ['app/api/preferences/route.js'],
  },
  system_health: {
    ui: ['/tech-ops/diagnostics', '/tech-ops-hud'],
    middle: ['src/components/LiveLogs.jsx'],
    backend: ['app/api/logs/route.js', 'app/api/cron/techops-heartbeat/route.js'],
  },
  security: {
    ui: ['/settings'],
    middle: ['src/lib/supabase/client.js'],
    backend: ['app/api/preferences/route.js'],
  },
}
