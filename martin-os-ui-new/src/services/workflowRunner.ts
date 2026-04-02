import { supabase } from "../../server/supabase.js";

export async function runWorkflow(workflow: any, payload: any) {
  let context: any = { payload };

  if (!supabase) return context;

  for (const step of workflow.steps) {
    switch (step.type) {
      case "db_insert":
        await supabase.from(step.config.table).insert(payload);
        break;

      case "db_update":
        await supabase
          .from(step.config.table)
          .update(payload)
          .eq("id", payload.id);
        break;

      case "find_best_user":
        const { data: users } = await supabase.from("users").select("*");
        context.assignee = users?.[0]; // upgrade later with scoring
        break;

      case "log_action":
        console.log(step.config.message);
        break;

      default:
        console.warn("Unknown step:", step.type);
    }
  }

  return context;
}
