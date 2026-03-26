/**
 * Structured excerpt from Feature Masterlist: Martin OS — maps product narrative to in-app routes.
 * Full spec lives in the PDF; this file is the navigable surface in PMO-Ops.
 */

export const ENGINE_LOOP = [
  { id: "data", label: "Data", desc: "Single source of truth (initiatives, KPIs, risks, decisions)" },
  { id: "signals", label: "Signals", desc: "Triggers from rules, schedules, and anomaly detection" },
  { id: "diagnosis", label: "Diagnosis", desc: "AI + frameworks → root cause and confidence" },
  { id: "action", label: "Action", desc: "Recommendations, workflows, assignments" },
  { id: "learning", label: "Learning", desc: "Outcome memory → smarter future outputs" },
] as const;

/** Full Org Intelligence Model (15D) — diagnostic dimensions from masterlist */
export const ORG_DIMENSIONS_15 = [
  { id: "strategy", label: "Strategy", href: "/diagnostics" },
  { id: "operations", label: "Operations", href: "/workflows" },
  { id: "finance", label: "Finance", href: "/expenses" },
  { id: "product", label: "Product", href: "/projects" },
  { id: "team", label: "Team", href: "/team" },
  { id: "risk", label: "Risk", href: "/diagnostics" },
  { id: "growth", label: "Growth", href: "/marketing" },
  { id: "brand", label: "Brand / Market", href: "/marketing" },
  { id: "cx", label: "Customer Experience", href: "/crm" },
  { id: "data", label: "Data Maturity", href: "/reports" },
  { id: "tech", label: "Tech Stack Health", href: "/tech-ops" },
  { id: "sales", label: "Sales Effectiveness", href: "/crm" },
  { id: "innovation", label: "Innovation", href: "/knowledge" },
  { id: "scale", label: "Operational Scalability", href: "/departments" },
  { id: "leadership", label: "Leadership", href: "/decisions" },
] as const;

export type MasterlistModule = {
  title: string;
  summary: string;
  href: string;
  tag?: string;
};

export const MASTERLIST_MODULES: MasterlistModule[] = [
  {
    title: "AI Advisory Layer",
    summary: "Consultant engine: frameworks → logic, data → signals, AI → recommendations.",
    href: "/advisory",
    tag: "AI",
  },
  {
    title: "Company Intelligence",
    summary: "Executive dashboards, segment views, and KPI storytelling (analytics-grade).",
    href: "/reports",
    tag: "Intel",
  },
  {
    title: "Diagnostics & Scoring",
    summary: "Org health, maturity tiers, and expanded diagnostic dimensions.",
    href: "/diagnostics",
    tag: "Signals",
  },
  {
    title: "Workflow Orchestrator",
    summary: "Signal → workflow → run; automation brain for 100+ playbooks.",
    href: "/workflows",
    tag: "Automation",
  },
  {
    title: "Knowledge Graph",
    summary: "Entities and relationships: KPIs, problems, actions, frameworks.",
    href: "/graph",
    tag: "Graph",
  },
  {
    title: "Execution Layer",
    summary: "Assign, track, and re-evaluate — close the loop beyond insights.",
    href: "/action-items",
    tag: "Execution",
  },
  {
    title: "Tech-Ops & integrations",
    summary: "Universal connector strategy: productivity, CRM, ERP, HR, finance, devops, healthcare, retail — stack health and backups (add-on ready).",
    href: "/integrations",
    tag: "Platform",
  },
  {
    title: "Resource Hub",
    summary: "Frameworks, templates, and institutional memory.",
    href: "/knowledge",
    tag: "Knowledge",
  },
];

export const META_SYSTEMS = [
  { name: "Consultant Engine", points: ["Frameworks → logic", "Data → signals", "AI → recommendations", "Actions → execution"] },
  { name: "Knowledge Graph", points: ["Nodes: company, KPIs, frameworks, problems, actions", "Edges: affects, predicts, triggers, solves"] },
  { name: "Signal Pipeline", points: ["Ingestion", "Scoring", "Triggers", "AI insights", "Action generation"] },
] as const;
