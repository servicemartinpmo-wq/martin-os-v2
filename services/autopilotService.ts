import { supabase } from '../lib/supabase';
import { PMO_SYSTEMS, PMOSystem } from '../lib/pmo-systems';
import { apphiaOrchestrator, WorkflowStep } from './apphiaOrchestrator';

// Define workflow steps for each system
const WORKFLOW_MAP: Record<string, WorkflowStep[]> = {
  'Strategic Alignment': [
    { id: 'step1', description: 'Analyze KPI conflict', agent: 'gemini', prompt: 'Analyze the KPI conflict and suggest alignment strategies.' },
    { id: 'step2', description: 'Update project status', agent: 'gemini', prompt: 'Update the project status based on the analysis.' }
  ],
  'Execution Discipline': [
    { id: 'step1', description: 'Analyze milestone miss', agent: 'gemini', prompt: 'Analyze the milestone miss and suggest corrective actions.' }
  ]
};

/**
 * AutopilotService
 * Listens to the 'signals' table in Supabase and triggers workflows
 * based on the PMO_SYSTEMS definition.
 */
export const startAutopilotService = () => {
  console.log('Starting Autopilot Service...');

  // Subscribe to changes in the 'signals' table
  const channel = supabase
    .channel('signals-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'signals' },
      (payload) => {
        console.log('New signal detected:', payload.new);
        handleSignal(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Handles a detected signal by finding the corresponding system/workflow
 */
const handleSignal = async (signal: any) => {
  const signalType = signal.type; // Assuming signal has a 'type' field

  // Find the system that handles this signal
  const systemId = Object.keys(PMO_SYSTEMS).find((key) =>
    PMO_SYSTEMS[key].signals.includes(signalType)
  );

  if (systemId) {
    const system = PMO_SYSTEMS[systemId];
    console.log(`Triggering workflow for system: ${system.name}`);
    
    // Trigger the workflow
    await triggerWorkflow(system, signal);
  } else {
    console.warn(`No system found for signal type: ${signalType}`);
  }
};

/**
 * Executes the workflow logic using Apphia Orchestrator
 */
const triggerWorkflow = async (system: PMOSystem, signal: any) => {
  console.log(`Executing workflow for ${system.name} with signal: ${signal.id}`);
  
  try {
    // 1. Log the workflow execution
    await supabase.from('workflow_runs').insert({
      system_id: system.id,
      signal_id: signal.id,
      status: 'running',
      started_at: new Date().toISOString()
    });

    // 2. Get workflow steps
    const steps = WORKFLOW_MAP[system.name];
    if (!steps) {
      throw new Error(`No workflow steps defined for ${system.name}`);
    }

    // 3. Execute workflow via Apphia Orchestrator
    await apphiaOrchestrator.executeWorkflow(steps, { signal });

    // 4. Update status to completed
    await supabase.from('workflow_runs')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('signal_id', signal.id);

  } catch (error) {
    console.error(`Error executing workflow for ${system.name}:`, error);
    await supabase.from('workflow_runs')
      .update({ status: 'failed', error: error instanceof Error ? error.message : String(error) })
      .eq('signal_id', signal.id);
  }
};


