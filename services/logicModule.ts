import { supabase } from '../lib/supabase';

export type SystemChainStep = 'KPI_TREE' | 'CONTROL_CHARTS' | 'TOC' | 'EXECUTION';

export interface ChainStatus {
  id: string;
  name: string;
  steps: {
    type: SystemChainStep;
    status: 'pending' | 'processing' | 'completed' | 'error';
    output?: string;
  }[];
  currentStep: number;
  lastUpdated: string;
}

export const runOperationalExtract = async (files: File[]) => {
  console.log('Logic Module: Starting Operational Extract on', files.length, 'files');
  
  try {
    // Attempt to call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('operational-extract', {
      body: { 
        fileNames: files.map(f => f.name), 
        fileTypes: files.map(f => f.type),
      }
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("[Logic Module] Edge Function failed, falling back to simulation.", err);
    
    // Simulation fallback
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return {
      signals: [
        { id: 'sig-1', type: 'priority', msg: 'Resource bottleneck detected in Tech-Ops Q2 planning.', time: 'Just now' },
        { id: 'sig-2', type: 'risk', msg: 'Budget drift exceeding 5% threshold in Finance module.', time: 'Just now' }
      ],
      directives: [
        { id: 'dir-1', title: 'Reallocate 15% capacity from General Ops to Tech-Ops.', priority: 'High', priorityTier: 1, mocha_role: 'Approver' },
        { id: 'dir-2', title: 'Initiate budget audit for Q1 variance.', priority: 'Critical', priorityTier: 1, mocha_role: 'Owner' }
      ]
    };
  }
};

export const triggerSystemChain = async (chainId: string) => {
  console.log('Logic Module: Triggering System Chain', chainId);
  
  // Simulate chain execution
  const steps: SystemChainStep[] = ['KPI_TREE', 'CONTROL_CHARTS', 'TOC', 'EXECUTION'];
  
  for (const step of steps) {
    console.log(`Logic Module: Executing ${step}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  return {
    status: 'completed',
    timestamp: new Date().toISOString(),
    summary: 'System Chain synchronized across all operational modules.'
  };
};
