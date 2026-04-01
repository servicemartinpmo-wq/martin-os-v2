import { supabase } from "../../server/supabase.js";

export async function getWorkflowByAction(action: string) {
  console.log(`[WorkflowRepo] Fetching workflow for: ${action}`);
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("action", action)
    .single();

  if (error) {
    console.error(`[WorkflowRepo] Error fetching workflow: ${error.message}`);
    return null;
  }
  return data;
}

export async function createWorkflow(workflow: any) {
  console.log(`[WorkflowRepo] Creating workflow: ${workflow.action}`);
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from("workflows")
    .insert([workflow])
    .select()
    .single();

  if (error) {
    console.error(`[WorkflowRepo] Error creating workflow: ${error.message}`);
    throw error;
  }
  return data;
}
