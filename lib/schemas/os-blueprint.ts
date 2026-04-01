import { z } from 'zod';

// 1. Define the allowed component types
const ComponentType = z.enum(['stat-card', 'data-table', 'action-bar', 'alert-banner', 'chart']);

// 2. Define the schema for a single interactive element
const ActionIntent = z.object({
  action: z.enum(['nav', 'workflow', 'diagnose', 'query']),
  value: z.string().describe("The payload sent to the Thinking Engine (e.g., 'approve_req_42' or 'run_pmo_audit')"),
  label: z.string(),
});

// 3. Define the full component structure
const UIComponent = z.object({
  id: z.string(),
  type: ComponentType,
  props: z.record(z.string(), z.any()).describe("Tailwind overrides or specific display data"),
  actions: z.array(ActionIntent).optional().describe("Buttons or triggers attached to this component"),
  dataSource: z.string().optional().describe("The Supabase table or RPC function to pull live data from"),
});

// 4. The final schema the AI must return
export const OSBlueprintSchema = z.object({
  title: z.string(),
  layout: z.enum(['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'sidebar-main']),
  components: z.array(UIComponent),
});

export type OSBlueprint = z.infer<typeof OSBlueprintSchema>;
export type UIAction = z.infer<typeof ActionIntent>;
