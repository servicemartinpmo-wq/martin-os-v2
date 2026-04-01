import { supabase } from '../lib/supabase';

export async function runAutoConfigEngine(userId: string, intakeData: any, assessmentData: any) {
  if (!supabase) {
    console.warn('Supabase not configured. Skipping auto-config engine and returning mock workspace.');
    return { id: 'demo-workspace', name: 'Demo Workspace', company_id: 'demo-company' };
  }

  // 1. Create Company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({ name: intakeData.companyName, industry: intakeData.industry })
    .select()
    .single();
  if (companyError) throw companyError;

  // 2. Create Workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({ company_id: company.id, mode: intakeData.role === 'Founder' ? 'Founder' : 'SMB' })
    .select()
    .single();
  if (workspaceError) throw workspaceError;

  // 3. Create Workflows based on pain points
  const workflows = assessmentData.painPoints.map((pp: string) => ({
    workspace_id: workspace.id,
    type: pp,
    status: 'active'
  }));
  
  const { error: workflowError } = await supabase
    .from('workflows')
    .insert(workflows);
  if (workflowError) throw workflowError;

  // 4. Save Intake Response
  const { error: intakeError } = await supabase
    .from('intake_responses')
    .insert({
      user_id: userId,
      pain_points: assessmentData.painPoints,
      tools: assessmentData.tools,
      goals: intakeData.goals,
      maturity_score: 50 // Simplified
    });
  if (intakeError) throw intakeError;

  return workspace;
}
