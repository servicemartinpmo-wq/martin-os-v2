/**
 * Ontology + connector registry (v1 stubs).
 * Real connectors: OAuth, vault credentials, rate limits, security review per source.
 */

/** @typedef {{ id: string, label: string, category: string, status: 'planned' | 'stub' | 'beta' }} OntologyType */
/** @typedef {{ id: string, label: string, transport: string, status: 'stub' }} ConnectorStub */

/** @type {OntologyType[]} */
export const ONTOLOGY_ENTITY_TYPES = [
  { id: 'customer', label: 'Customer / account', category: 'revenue', status: 'stub' },
  { id: 'order', label: 'Order / contract', category: 'revenue', status: 'stub' },
  { id: 'project', label: 'Project / initiative', category: 'delivery', status: 'stub' },
  { id: 'task', label: 'Task / work item', category: 'delivery', status: 'stub' },
  { id: 'kpi', label: 'KPI / metric', category: 'performance', status: 'stub' },
  { id: 'employee', label: 'Contributor', category: 'people', status: 'stub' },
]

/** @type {ConnectorStub[]} */
export const ONTOLOGY_CONNECTORS = [
  { id: 'postgres', label: 'PostgreSQL', transport: 'sql', status: 'stub' },
  { id: 'rest', label: 'REST API', transport: 'https', status: 'stub' },
  { id: 'csv', label: 'CSV / files', transport: 'upload', status: 'stub' },
  { id: 'erp', label: 'ERP (generic)', transport: 'partner', status: 'planned' },
]
