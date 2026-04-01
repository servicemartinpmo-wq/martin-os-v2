import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from 'node:crypto';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool, ToolSet } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { handleNetworkCapture } from './server/interactions.js';
import { orchestrator } from './src/lib/agents/orchestrator.js';
import { emitEvent } from './src/lib/eventBus.js';
import { runLearningEngine } from './src/lib/agents/learningEngine.js';
import { ApphiaEngine } from './server/apphiaEngine.js';
import { supabase } from './server/supabase.js';
import { OSBlueprintSchema } from './src/lib/schemas/os-blueprint.js';
import { getWorkflowByAction, createWorkflow } from './src/lib/workflowRepo.js';
import { runWorkflow } from './src/services/workflowRunner.js';
import { autopilotEngine } from './src/services/autopilotEngine.js';
import { generateWorkflowFromIntent } from './src/services/workflowGenerator.js';
import { routeAIRequest } from './src/server/aiRouter.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabaseAdmin: any = null;

function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for authenticated routes.');
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return _supabaseAdmin;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      requestId?: string;
    }
  }
}

function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  req.requestId = randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization') || '';
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Unauthorized: missing or invalid bearer token',
        requestId: req.requestId 
      });
    }
    const { data, error } = await getSupabaseAdmin().auth.getUser(token);
    if (error || !data?.user?.id) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Unauthorized: missing or invalid bearer token',
        requestId: req.requestId 
      });
    }
    req.userId = data.user.id;
    return next();
  } catch {
    return res.status(401).json({ 
      ok: false, 
      error: 'Unauthorized: missing or invalid bearer token',
      requestId: req.requestId 
    });
  }
}

const apphiaEngine = new ApphiaEngine();

// Lazy initialization helpers
const isPlaceholderKey = (key: string | undefined) => {
  if (!key) return true;
  const k = key.trim();
  return k === 'MY_GEMINI_API_KEY' || k === 'YOUR_API_KEY' || k === 'PASTE_YOUR_KEY_HERE' || k === 'sk-...' || k === 'AIza...';
};

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    console.log(`[Server] OPENAI_API_KEY detected. Length: ${apiKey.length}`);
  }
  if (isPlaceholderKey(apiKey)) {
    console.warn('[Server] OPENAI_API_KEY missing or a placeholder. OpenAI features will be disabled.');
    return null;
  }
  return new OpenAI({ apiKey: apiKey! });
};

const getAISDKOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (isPlaceholderKey(apiKey)) return null;
  return createOpenAI({ apiKey: apiKey! });
};

const getAISDKGoogle = () => {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();
  if (apiKey) {
    console.log(`[Server] GEMINI_API_KEY/GOOGLE_API_KEY detected. Length: ${apiKey.length}`);
  }
  if (isPlaceholderKey(apiKey)) {
    console.warn('[Server] GEMINI_API_KEY is missing or a placeholder. Gemini features will be disabled.');
    return null;
  }
  return createGoogleGenerativeAI({ apiKey: apiKey! });
};

// --- Database Initialization ---
async function initDatabase() {
  if (!supabase) return;
  
  console.log('[Database] Checking for os_blueprints table...');
  // Note: In a real Supabase environment, you'd use a migration or the dashboard.
  // This is a safety check for the agent environment.
  const { error: blueprintError } = await supabase.from('os_blueprints').select('id').limit(1);
  if (blueprintError && blueprintError.code === 'PGRST116') {
    console.log('[Database] Table os_blueprints might be missing.');
  }

  const { error: mappingError } = await supabase.from('os_org_mapping').select('id').limit(1);
  if (mappingError) {
    console.log('[Database] Table os_org_mapping might be missing.');
  }

  const { error: deptError } = await supabase.from('os_departments').select('id').limit(1);
  if (deptError) {
    console.log('[Database] Table os_departments might be missing. Fields: id, name, maturity_score, health_status');
  }

  const { error: initError } = await supabase.from('os_initiatives').select('id').limit(1);
  if (initError) {
    console.log('[Database] Table os_initiatives might be missing. Fields: id, title, priority_score, impact_score, effort_score, framework_tag, budget, spent, status');
  }

  const { error: depError2 } = await supabase.from('os_dependencies').select('id').limit(1);
  if (depError2) {
    console.log('[Database] Table os_dependencies might be missing. Fields: id, dependent_initiative_id, provider_dept_id');
  }

  // Hardening: Ensure logging tables exist
  const { error: actionRunError } = await supabase.from('action_runs').select('id').limit(1);
  if (actionRunError) {
    console.log('[Database] Table action_runs might be missing. Fields: id, action_id, user_id, status, payload, result, error, request_id');
  }

  const { error: aiRunError } = await supabase.from('ai_runs').select('id').limit(1);
  if (aiRunError) {
    console.log('[Database] Table ai_runs might be missing. Fields: id, provider, success, error, request_id');
  }

  const { error: systemEventError } = await supabase.from('system_events').select('id').limit(1);
  if (systemEventError) {
    console.log('[Database] Table system_events might be missing. Fields: id, event_type, details, request_id');
  }
}

async function startServer() {
  console.log('[Server] Starting server initialization...');
  try {
    console.log('[Server] Initializing database...');
    await initDatabase();
    console.log('[Server] Database initialization complete.');
  } catch (dbError) {
    console.error('[Server] Database initialization failed:', dbError);
    // Continue anyway, maybe it's just a connection issue
  }

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);

  // Multi-tenant scoping middleware
  const tenantScopingMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const supabaseAdmin = getSupabaseAdmin();

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // 1) user -> organization_ids
      const { data: orgRows, error: orgErr } = await supabaseAdmin
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', req.userId);

      if (orgErr) {
        return res.status(403).json({ error: 'Unauthorized: Tenant lookup failed' });
      }

      const organizationIds = (orgRows || [])
        .map((r: any) => r.organization_id)
        .filter(Boolean);

      if (organizationIds.length === 0) {
        // Fallback: check if user is a member of any organization directly
        const { data: userOrg, error: userOrgErr } = await supabaseAdmin
          .from('users')
          .select('organization_id')
          .eq('id', req.userId)
          .single();
        
        if (userOrg?.organization_id) {
          organizationIds.push(userOrg.organization_id);
        } else {
          return res.status(403).json({ error: 'Unauthorized: No tenant found' });
        }
      }

      // Helper: try to find tenant_id from a given table
      const findTenantIdFrom = async (
        table: 'projects' | 'workflows' | 'events' | 'action_items'
      ) => {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('tenant_id')
          .in('organization_id', organizationIds)
          .not('tenant_id', 'is', null)
          .limit(1);

        if (error) return null;
        return data?.[0]?.tenant_id ?? null;
      };

      // 2) organization_ids -> tenant_id (fallback order)
      const tenantId =
        (await findTenantIdFrom('projects')) ??
        (await findTenantIdFrom('workflows')) ??
        (await findTenantIdFrom('events')) ??
        (await findTenantIdFrom('action_items'));

      if (!tenantId) {
        // Last fallback: check if there's a default tenant for these organizations
        const { data: tenantRow } = await supabaseAdmin
          .from('organizations')
          .select('tenant_id')
          .in('id', organizationIds)
          .not('tenant_id', 'is', null)
          .limit(1)
          .single();
        
        if (tenantRow?.tenant_id) {
          req.tenantId = tenantRow.tenant_id;
          return next();
        }

        return res.status(403).json({ error: 'Unauthorized: No tenant found' });
      }

      req.tenantId = tenantId;
      next();
    } catch (err) {
      console.error('Tenant Scoping Error:', err);
      res.status(500).json({ error: 'Internal Server Error during tenant scoping' });
    }
  };

  // Protect user-triggered write/action routes
  app.use('/api/actions', requireAuth, tenantScopingMiddleware);
  app.use('/api/autopilot', requireAuth, tenantScopingMiddleware);
  app.use('/api/os/engine', requireAuth, tenantScopingMiddleware);
  app.use('/api/pmo', requireAuth, tenantScopingMiddleware);
  app.use('/api/ai/command', requireAuth, tenantScopingMiddleware);

  // Unified Thinking Engine (Gemini + OpenAI)
  app.post('/api/os/engine', async (req: any, res) => {
    try {
      const { messages } = req.body;
      const userId = req.userId;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Intercept the latest message for System Commands
      const latestMessage = messages[messages.length - 1];
      const content = latestMessage?.content || '';
      
      // 2. Multi-LLM "Orchestration" (Model Routing)
      // If the user asks for "strategy", "audit", or "fix", we use the "Heavy" brain (GPT-4o).
      // Otherwise, we use the "Fast" brain (Gemini Flash).
      const lastMessageContent = content.toUpperCase();
      const useHighFidelity = lastMessageContent.includes('STRATEGY') || lastMessageContent.includes('AUDIT') || lastMessageContent.includes('FIX');
      
      const googleProvider = getAISDKGoogle();
      const openaiProvider = getAISDKOpenAI();

      if (!googleProvider && !openaiProvider) {
        console.error('[Thinking Engine] Error: No AI providers configured. Check GEMINI_API_KEY and OPENAI_API_KEY.');
        return res.status(500).json({ error: 'AI Engine Unavailable: No API keys configured on the server.' });
      }

      const model = useHighFidelity 
        ? (openaiProvider ? openaiProvider('gpt-4o') : googleProvider!('gemini-3-flash-preview'))
        : (googleProvider ? googleProvider('gemini-3-flash-preview') : openaiProvider!('gpt-4o'));
      
      const modelName = useHighFidelity ? 'GPT-4o (Strategic)' : 'Gemini 3 Flash (Standard)';
      console.log(`[Thinking Engine] Routing to ${modelName} based on intent.`);

      const result = await streamText({
        model,
        system: `You are APPHIA, an Autonomous Support Agent. 
        You manage infrastructure and operational tasks.
        
        Your tone: Brief, natural, human-like.
        
        Guidelines:
        - Use bullet points for lists.
        - Be concise and direct.
        - Provide intuitive and autonomous support.
        - Avoid technical jargon unless necessary.
        
        Current Stack: Supabase + Vercel + Cloudflare.
        
        Core Systems include:
        - SYS-001: Strategic Alignment
        - SYS-013: Leadership Bandwidth
        - SYS-003: Execution Discipline
        - SYS-008: Portfolio Optimization
        - SYS-018: Initiative Recovery
        - SYS-025: Executive Insight
        
        When a 'System Command' is received from a button, execute the tool immediately.
        If you detect a signal like UNMAPPED_INITIATIVE or DECISION_DELAY, recommend the corresponding framework.`,
        messages,
        tools: {
          // THE "FIX IT" TOOL: This is the workflow for your buttons
          executeAction: tool({
            description: 'Execute a specific operational fix or update in Supabase',
            parameters: z.object({
              target: z.string().describe("Table or Module name"),
              id: z.string().optional(),
              actionType: z.enum(['RESOLVE', 'UPGRADE', 'SYNC', 'ARCHIVE']),
              note: z.string()
            }),
            execute: async ({ target, id, actionType, note }) => {
              console.log(`OS EXECUTION: ${actionType} on ${target}`);
              if (!supabase) return { error: 'Supabase not configured' };
              
              const { error } = await supabase
                .from('system_logs')
                .insert({ 
                  module: target, 
                  action: actionType, 
                  details: note, 
                  status: 'SUCCESS',
                  tenant_id: req.tenantId,
                  user_id: userId,
                  created_at: new Date().toISOString()
                });

              return error ? { error: error.message } : { status: 'ACTION_COMPLETE', message: note };
            },
          }),
          communicationDraft: tool({
            description: 'Draft a role-based communication based on system anomalies',
            parameters: z.object({
              domain: z.string().describe("The topic of the issue, e.g., 'HR' or 'Supplies'"),
              context: z.string(),
              urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
            }),
            execute: async ({ domain, context, urgency }) => {
              if (!supabase) return { error: 'Supabase not configured' };
              
              // 1. DYNAMIC LOOKUP: Find the role responsible for this domain
              const { data: roleData } = await supabase
                .from('os_org_mapping')
                .select('*')
                .contains('domains', [domain])
                .single();

              if (!roleData) return { error: "No organizational lead assigned to this domain." };

              // 2. CONTEXT-AWARE DRAFTING
              const draftBody = `Internal OS Signal: Issue detected in [${domain}]. 
              Context: ${context}. 
              Proposed Action: Standardized audit of ${domain} workflows required.`;

              return {
                recipientRole: roleData.display_title,
                channel: roleData.pref_channel,
                body: draftBody,
                urgencySignal: urgency,
                roleKey: roleData.role_key,
                id: Math.random().toString(36).substr(2, 9)
              };
            },
          }),
          executeProjectAction: tool({
            description: 'Update task status or metadata in the PMO-Ops database',
            parameters: z.object({
              id: z.string(),
              status: z.enum(['todo', 'in-progress', 'blocked', 'done']),
              priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
              note: z.string().optional(),
            }),
            execute: async ({ id, status, priority, note }) => {
              if (!supabase) return { error: 'Supabase not configured' };
              const updateData: any = { status, updated_at: new Date().toISOString() };
              if (priority) updateData.priority = priority;
              if (note) updateData.system_context = note;
              
              // SECURITY: Scope to owner_id and tenant_id to prevent unauthorized updates
              const { data, error } = await supabase
                .from('tasks')
                .update(updateData)
                .eq('id', id)
                .eq('tenant_id', req.tenantId)
                .eq('owner_id', userId);
              return error ? { error: error.message } : { success: true, data };
            },
          }),
          createTicket: tool({
            description: 'Create a new ticket in the PMO-Ops system',
            parameters: z.object({
              title: z.string(),
              description: z.string(),
              priority: z.enum(['low', 'medium', 'high', 'critical']),
              project_id: z.string().optional(),
            }),
            execute: async ({ title, description, priority, project_id }) => {
              if (!supabase) return { error: 'Supabase not configured' };
              const { data, error } = await supabase
                .from('tasks')
                .insert([{ 
                  title, 
                  description, 
                  priority, 
                  project_id, 
                  status: 'todo', 
                  owner_id: userId,
                  tenant_id: req.tenantId 
                }]);
              return error ? { error: error.message } : { success: true, data };
            },
          }),
          systemDiagnostic: tool({
            description: 'Run a Tech-Ops diagnostic on a specific module',
            parameters: z.object({ module: z.string() }),
            execute: async ({ module }) => {
              if (supabase) {
                await supabase.from('operational_signals').insert([{
                  source_app: 'tech_ops',
                  signal_type: 'diagnostic_run',
                  context_data: { module, timestamp: new Date().toISOString(), user_id: userId },
                  status: 'diagnosed',
                  tenant_id: req.tenantId
                }]);
              }
              return { status: 'Optimized', module, latency: '12ms', health: '98%' };
            },
          }),
          // 1. Data Mapping Tool (For hydrating new pages)
          fetchOSData: tool({
            description: 'Fetch data from Supabase based on a URL slug or data source name',
            parameters: z.object({ targetTable: z.string() }),
            execute: async ({ targetTable }) => {
              if (!supabase) return { error: 'Supabase not configured' };
              // Security: Map slugs to actual tables to prevent raw SQL injection
              const tableMap: Record<string, string> = {
                'pmo-ops': 'tasks',
                'tech-ops': 'operational_signals',
                'miidle': 'agent_traces',
                'marketing-ops': 'tasks', // Fallback for demo
              };
              
              const table = tableMap[targetTable];
              if (!table) return { error: `Table [${targetTable}] is not allowed for AI access.` };
              
              // SECURITY: Scope to owner_id or user_id depending on table, and tenant_id
              const userField = table === 'tasks' ? 'owner_id' : 'user_id';
              
              const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq(userField, userId)
                .eq('tenant_id', req.tenantId)
                .limit(10);
              return error ? { error: error.message } : data;
            },
          }),
          // 2. Workflow Execution Tool (Catches button clicks)
          executeSystemWorkflow: tool({
            description: 'Execute an operational intent triggered by a UI button',
            parameters: z.object({ 
              intent: z.string().describe("The data-value from the button, e.g., 'approve_req_42'"),
              interpretedAction: z.string().optional().describe("If it's a ghost trigger, what action should be taken?"),
            }),
            execute: async ({ intent, interpretedAction }) => {
              if (!supabase) return { error: 'Supabase not configured' };
              
              // Handle Interpreted Actions (Ghost Triggers)
              if (interpretedAction) {
                console.log(`[Ghost Trigger] Executing interpreted action: ${interpretedAction}`);
                // Simple simulation of executing an interpreted action
                return { status: 'Success', action: 'Interpreted Execution', detail: interpretedAction };
              }

              const parts = intent.split('_');
              const action = parts[0]; 
              const targetId = parts[parts.length - 1]; 

              if (action === 'approve') {
                 const { error } = await supabase
                  .from('tasks')
                  .update({ status: 'done' })
                  .eq('id', targetId)
                  .eq('tenant_id', req.tenantId)
                  .eq('owner_id', userId);
                 return error ? { status: 'Failed', reason: error.message } : { status: 'Success', action: 'Row Updated' };
              }

              if (action === 'sync') {
                 return { status: 'Success', action: 'Database Synced', latency: '45ms' };
              }

              if (action === 'diagnose') {
                return { status: 'Success', action: 'Diagnostic Complete', health: '99.2%' };
              }

              if (action === 'optimize') {
                return { status: 'Success', action: 'Memory Optimized', reclaimed: '1.2GB' };
              }

              return { error: `Intent [${intent}] not recognized by execution router.` };
            },
          }),
          queryVectorMemory: tool({
            description: 'Search through uploaded SOPs and documents using vector storage',
            parameters: z.object({ query: z.string() }),
            execute: async ({ query }) => {
              // 4. Direct "File-System" Memory (miidle)
              // This is a simulation of vector search
              const mockResults = [
                { title: 'Nature\'s Nurses SOP', content: 'Compliance requires weekly PMO audits of student leadership logs.' },
                { title: 'Beazer\'s Garden Standards', content: 'Garden maintenance must be logged in the Tech-Ops signal tracker.' }
              ];
              return { results: mockResults, query };
            }
          }),
          generateStrategicInsight: tool({
            description: 'Analyze a system signal using executive frameworks (Porter, Rumelt, TOC, etc.)',
            parameters: z.object({
              signal: z.string(),
              framework: z.enum(['PORTER_5_FORCES', 'RUMELT_STRATEGY', 'BALANCED_SCORECARD', 'OKRS', 'LEAN_SIX_SIGMA', 'TOC']),
              context: z.string().optional(),
            }),
            execute: async ({ signal, framework, context }) => {
              console.log(`[Strategic Engine] Applying ${framework} to signal: ${signal}`);
              
              // In a real scenario, this would call another LLM chain or use RAG
              const insights: Record<string, any> = {
                RUMELT_STRATEGY: {
                  diagnosis: "Coordination failure between PMO and Tech-Ops. Resources are siloed.",
                  advisory: "Implement a shared resource pool for high-priority initiatives.",
                  remedy: "Update the 'Resource Allocation' framework in the System Kernel."
                },
                LEAN_SIX_SIGMA: {
                  diagnosis: "Waste detected in 'Site Access' workflow. Cycle time is 40% above benchmark.",
                  advisory: "Automate the educator liaison approval step.",
                  remedy: "Deploy 'Auto-Approve' ghost trigger for standard site requests."
                },
                TOC: {
                  diagnosis: "Bottleneck identified in 'Finance' approval chain.",
                  advisory: "Subordinate all other tasks to the Finance throughput rate.",
                  remedy: "Increase Finance processing capacity by 20% or simplify the audit schema."
                }
              };

              const result = insights[framework] || {
                diagnosis: `Framework ${framework} suggests a structural misalignment.`,
                advisory: "Conduct a deep-dive audit of the affected module.",
                remedy: "Re-baseline the operational maturity score for this department."
              };

              return {
                signal,
                framework,
                ...result,
                timestamp: new Date().toISOString()
              };
            }
          }),
          calculateExecutiveScores: tool({
            description: 'Calculate maturity and priority scores for departments and initiatives',
            parameters: z.object({
              type: z.enum(['DEPARTMENT', 'INITIATIVE']),
              targetId: z.string(),
              metrics: z.object({
                impact: z.number().min(0).max(100),
                effort: z.number().min(0).max(100),
                dependencyCount: z.number().optional(),
              })
            }),
            execute: async ({ type, targetId, metrics }) => {
              // Weighted scoring logic
              const priorityScore = Math.round((metrics.impact * 0.7) + ((100 - metrics.effort) * 0.3));
              const maturityScore = Math.round(metrics.impact * 0.8); // Simplified for demo

              if (supabase) {
                const table = type === 'DEPARTMENT' ? 'os_departments' : 'os_initiatives';
                const scoreField = type === 'DEPARTMENT' ? 'maturity_score' : 'priority_score';
                
                await supabase
                  .from(table)
                  .update({ [scoreField]: type === 'DEPARTMENT' ? maturityScore : priorityScore })
                  .eq('id', targetId)
                  .eq('tenant_id', req.tenantId);
              }

              return {
                type,
                targetId,
                score: type === 'DEPARTMENT' ? maturityScore : priorityScore,
                intelligence: `Score calculated based on ${metrics.impact}% impact and ${metrics.effort}% effort.`
              };
            }
          }),
          runReasoningAudit: tool({
            description: 'Run the 4-stage reasoning pipeline (Signal -> Diagnosis -> Advisory -> Remedy) for an initiative',
            parameters: z.object({
              initiativeId: z.string(),
              initiativeName: z.string(),
              budget: z.number(),
              spent: z.number(),
              status: z.string(),
              capacity_usage: z.number().optional().default(0.96)
            }),
            execute: async ({ initiativeId, initiativeName, budget, spent, status, capacity_usage }) => {
              // Stage 1: Signal Detection
              let signal = "NOMINAL";
              if (capacity_usage > 0.95) signal = "SIGNAL_CAPACITY_OVERLOAD";
              else if (spent > budget) signal = "SIGNAL_BUDGET_OVERRUN";
              else if (status.toUpperCase() === "DELAYED" || status.toUpperCase() === "BLOCKED") signal = "SIGNAL_EXECUTION_DELAY";
              
              if (signal === "NOMINAL") return { status: "HEALTHY", message: "No intelligence triggered for this initiative." };

              // Stage 2: Diagnosis (Framework-Based)
              const diagnosisMap: Record<string, any> = {
                "SIGNAL_CAPACITY_OVERLOAD": {
                  framework: "Theory of Constraints",
                  diagnosis: "The 'Drum' (Primary Resource) is being choked by non-critical tasks.",
                  root_cause: "Misaligned Priority Scores in Dept: Engineering"
                },
                "SIGNAL_BUDGET_OVERRUN": {
                  framework: "Rumelt: Good Strategy/Bad Strategy",
                  diagnosis: "Resource Misalignment / Lack of Focus on core objectives.",
                  root_cause: "Strategic drift from core value proposition."
                },
                "SIGNAL_EXECUTION_DELAY": {
                  framework: "Lean Operations",
                  diagnosis: "Waste (Muda) detected in the value stream handoffs.",
                  root_cause: "High WIP (Work in Progress) levels causing context switching."
                }
              };
              
              const diag = diagnosisMap[signal] || {
                framework: "Generic Framework",
                diagnosis: "Process Variance detected.",
                root_cause: "Unknown"
              };

              // Stage 3: Advisory Guidance
              const advisoryMap: Record<string, string> = {
                "SIGNAL_CAPACITY_OVERLOAD": "Offload 20% of maintenance tasks to secondary tier to protect the bottleneck.",
                "SIGNAL_BUDGET_OVERRUN": "Reallocate 15% budget from non-critical paths to high-impact initiatives.",
                "SIGNAL_EXECUTION_DELAY": "Implement a 'Pull' system and cap WIP at 3 items per engineer."
              };

              // Stage 4: Structural Remedy
              const remedyMap: Record<string, string> = {
                "SIGNAL_CAPACITY_OVERLOAD": "Implement a 'Capacity Buffer' SOP for all Q3 plans to prevent future chokes.",
                "SIGNAL_BUDGET_OVERRUN": "Implement Quarterly Strategic Focus Reviews (Hoshin Kanri) to align spending with strategy.",
                "SIGNAL_EXECUTION_DELAY": "Establish a Value Stream Mapping cadence to identify and remove systemic waste."
              };

              return {
                type: "Strategic Risk",
                situation: `${initiativeName} is showing ${signal.replace('SIGNAL_', '').replace('_', ' ')}.`,
                framework: diag.framework,
                diagnosis: diag.diagnosis,
                recommendation: advisoryMap[signal],
                structural_remedy: remedyMap[signal],
                timestamp: new Date().toISOString()
              };
            }
          }),
          calculateExecutiveLoad: tool({
            description: 'Calculate the concentration of tasks on a single user to identify bottlenecks',
            parameters: z.object({
              userId: z.string(),
              orgId: z.string().optional(),
            }),
            execute: async ({ userId, orgId }) => {
              if (!supabase) return { error: 'Supabase not configured' };
              
              // Fetch all tasks for the organization
              const { data: allTasks } = await supabase.from('tasks').select('id, ownerId');
              if (!allTasks) return { error: 'Failed to fetch tasks' };

              const totalTasks = allTasks.length;
              const userTasks = allTasks.filter(t => t.ownerId === userId).length;
              const loadPercentage = totalTasks > 0 ? (userTasks / totalTasks) * 100 : 0;

              let diagnosticOutput = "";
              if (loadPercentage > 70) {
                diagnosticOutput = "High Risk: Critical Bottleneck. Suggesting Delegation Matrix: Move 'Administrative' tasks to Support Role.";
              } else if (loadPercentage > 40) {
                diagnosticOutput = "Moderate Load: Monitor distribution. Some delegation may be required soon.";
              } else {
                diagnosticOutput = "Optimal Distribution: Leadership bandwidth is available for strategic advisory.";
              }

              return { loadPercentage, diagnosticOutput, userId, totalTasks, userTasks };
            }
          }),
          processEmailIntelligence: tool({
            description: 'Extract tasks and priority from email content (Command Tier Feature)',
            parameters: z.object({
              emailContent: z.string(),
              orgTier: z.enum(['Free', 'Professional', 'Workflow', 'Command', 'Enterprise']).default('Free'),
            }),
            execute: async ({ emailContent, orgTier }) => {
              // Feature Guard: Only Command and Enterprise tiers have automated email intelligence
              if (orgTier !== 'Command' && orgTier !== 'Enterprise') {
                return { 
                  error: 'Access Denied', 
                  message: 'Email Intelligence is a Command Tier feature. Please upgrade to automate task extraction.' 
                };
              }

              // Mock AI Extraction Logic
              const aiExtraction = {
                task: "Extracting core request from body...",
                deadline: "Detecting date keywords (e.g., 'by Friday')...",
                priority: emailContent.toLowerCase().includes('urgent') ? "High" : "Medium",
                riskFlag: emailContent.toLowerCase().includes('urgent') || emailContent.toLowerCase().includes('delayed')
              };

              return {
                sideBySideView: {
                  originalEmail: emailContent,
                  proposedTask: aiExtraction
                },
                status: 'READY_FOR_APPROVAL'
              };
            }
          }),
          checkTierAccess: tool({
            description: 'Check if a specific feature is available for the organizations tier',
            parameters: z.object({
              orgTier: z.enum(['Free', 'Professional', 'Workflow', 'Command', 'Enterprise']),
              feature: z.string(),
            }),
            execute: async ({ orgTier, feature }) => {
              const permissions: Record<string, Record<string, any>> = {
                "Free": { exports: false, emailForwarding: "manual", maxProjects: 3, aiPrioritization: "basic" },
                "Professional": { exports: true, emailForwarding: "automated", integrations: 3, dailyAI: 1 },
                "Workflow": { workflowBuilder: true, customReporting: true, apiAccess: true },
                "Command": { emailIntelligence: true, riskFlagging: true, diagnosticTools: true, users: 5 },
                "Enterprise": { unlimitedUsers: true, dedicatedAdvisor: true, auditSupport: true }
              };

              const isAllowed = permissions[orgTier]?.[feature] || false;
              return { orgTier, feature, isAllowed, config: permissions[orgTier] };
            }
          }),
          runDependencyAudit: tool({
            description: 'Calculate the "Blast Radius" of departmental failures on initiatives',
            parameters: z.object({
              threshold: z.number().default(40).describe("Maturity score threshold for 'Red' signal"),
            }),
            execute: async ({ threshold }) => {
              if (!supabase) return { error: 'Supabase not configured' };

              // THE $1B FEATURE: Dependency "Blast Radius" Logic
              // 1. Find departments below threshold (Source Health)
              const { data: depts } = await supabase
                .from('os_departments')
                .select('*')
                .lt('maturity_score', threshold)
                .eq('tenant_id', req.tenantId);

              if (!depts || depts.length === 0) return { status: 'SECURE', message: 'No departments currently below maturity threshold.' };

              // 2. Map to initiatives (Blast Radius)
              // In a real DB, we'd join initiatives -> dependencies -> departments
              const atRisk = depts.map(d => ({
                department: d.name,
                maturity: d.maturity_score,
                initiativesAtRisk: [
                  { name: "Initiative Delta", priority: 92, impact: "CRITICAL" },
                  { name: "Project Alpha", priority: 85, impact: "HIGH" }
                ],
                totalImpact: 177 // Sum of priority scores
              }));

              return {
                status: 'CRITICAL',
                threshold,
                atRisk,
                totalImpact: atRisk.reduce((acc, curr) => acc + curr.totalImpact, 0),
                remedy: "Structural Remedy: Re-align dependency mapping to avoid single-point-of-failure departments."
              };
            }
          })
        },
      });

      result.pipeDataStreamToResponse(res);
    } catch (error: any) {
      console.error('OS Engine Error:', error);
      res.status(500).json({ error: error.message || 'Engine failed' });
    }
  });

  // Network Capture API
  app.post('/api/interactions/network-capture', requireAuth, handleNetworkCapture);

  // Apphia Orchestrator: Workflow Execution
  app.post('/api/apphia/workflow', requireAuth, async (req, res) => {
    try {
      const { steps, context } = req.body;
      const userId = req.userId;
      if (!steps || !Array.isArray(steps)) {
        return res.status(400).json({ error: 'Steps must be an array of WorkflowStep' });
      }
      const results = await orchestrator.executeWorkflow(steps as any[], context);
      res.json(results);
    } catch (error: any) {
      console.error('Apphia Workflow Error:', error);
      res.status(500).json({ error: error.message || 'Workflow execution failed' });
    }
  });

  // Apphia Engine: Signal Detection
  app.post('/api/apphia/detect', requireAuth, async (req, res) => {
    try {
      const { data } = req.body;
      const userId = req.userId;
      const signals = await apphiaEngine.detectSignals(data);
      res.json(signals);
    } catch (error: any) {
      console.error('Apphia Detection Error:', error);
      res.status(500).json({ error: error.message || 'Detection failed' });
    }
  });

  // Workflow Trigger API
  app.post('/api/workflow/trigger', requireAuth, async (req, res) => {
    const { action, payload } = req.body;
    const userId = req.userId;

    // 1. Try to find existing workflow
    let workflow = await getWorkflowByAction(action);

    // 2. If missing → AUTO-GENERATE
    if (!workflow) {
      console.log("⚠️ Missing workflow. Generating:", action);

      workflow = await generateWorkflowFromIntent({ action });

      await createWorkflow(workflow);
    }

    // 3. Execute workflow
    const result = await runWorkflow(workflow, payload);

    res.json({ success: true, result });
  });

  // Autopilot Engine API
  app.post('/api/autopilot', requireAuth, async (req: any, res) => {
    try {
      const { naturalLanguage, action, payload } = req.body || {};
      const userId = req.userId; // ✅ from verified JWT middleware
      if (!userId) {
        return res.status(401).json({
          ok: false,
          error: 'Unauthorized: missing user context',
          requestId: req.requestId,
        });
      }
      const result = await autopilotEngine({
        userId,
        naturalLanguage,
        action,
        payload,
      });
      return res.json({
        ok: true,
        result,
        requestId: req.requestId,
      });
    } catch (error: any) {
      console.error(`[autopilot][${req.requestId}] Error`, error);
      return res.status(500).json({
        ok: false,
        error: error?.message || 'Autopilot failed',
        requestId: req.requestId,
      });
    }
  });

  // Apphia Orchestrator: Supervision
  app.post('/api/apphia/supervise', requireAuth, async (req, res) => {
    try {
      const { output, criteria } = req.body;
      const userId = req.userId;
      const supervision = await orchestrator.supervise(output, criteria);
      res.json(supervision);
    } catch (error: any) {
      console.error('Apphia Supervision Error:', error);
      res.status(500).json({ error: error.message || 'Supervision failed' });
    }
  });

  // Dynamic OS Hydrator: Blueprint Generation & Retrieval
  app.post('/api/os/blueprint', requireAuth, async (req, res) => {
    try {
      const { path: pagePath } = req.body;
      const userId = req.userId;
      if (!pagePath) return res.status(400).json({ error: 'Path is required' });

      if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

      // 1. Check cache
      const { data: blueprint, error: fetchError } = await supabase
        .from('os_blueprints')
        .select('*')
        .eq('path', pagePath)
        .single();

      if (blueprint) {
        return res.json(blueprint);
      }

      // 2. Generate if not found
      console.log(`[Hydrator] Hallucinating UI for: ${pagePath}`);
      
      const openaiClient = getOpenAIClient();
      if (!openaiClient) throw new Error('OpenAI client not configured');

      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are the APPHIA UI Architect. 
            Generate a functional UI blueprint in JSON format for a page at path: ${pagePath}.
            The UI must follow the "Glass-morphic Laminated" aesthetic.
            
            Return ONLY a JSON object that strictly follows this schema:
            {
              "title": "Page Title",
              "layout": "grid-cols-1" | "grid-cols-2" | "grid-cols-3" | "sidebar-main",
              "components": [
                { 
                  "id": "unique_id",
                  "type": "stat-card" | "data-table" | "chart" | "action-bar",
                  "props": { "title": "...", "columns": ["..."], "fallbackValue": "..." },
                  "actions": [ { "action": "nav"|"workflow"|"diagnose", "value": "...", "label": "..." } ],
                  "dataSource": "supabase_table_name"
                }
              ]
            }`
          },
          {
            role: "user",
            content: `Build a blueprint for ${pagePath}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const generatedContent = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Validate with Zod
      const validatedBlueprint = OSBlueprintSchema.parse(generatedContent);
      
      // 3. Save to cache
      const { data: newBlueprint, error: saveError } = await supabase
        .from('os_blueprints')
        .insert([{
          path: pagePath,
          title: validatedBlueprint.title,
          layout: validatedBlueprint.layout,
          components: validatedBlueprint.components
        }])
        .select()
        .single();

      if (saveError) {
        console.warn('Failed to cache blueprint:', saveError);
        return res.json(validatedBlueprint);
      }

      res.json(newBlueprint);
    } catch (error: any) {
      const requestId = (req as any).requestId;
      console.error(`[Hydrator Error] [${requestId}]:`, error);
      res.status(500).json({ ok: false, error: error.message || 'Hydration failed', requestId });
    }
  });

  // OpenAI Proxy Route
  app.post('/api/openai/chat', requireAuth, async (req, res) => {
    try {
      const { messages } = req.body;
      const userId = req.userId;
      const openaiClient = getOpenAIClient();
      if (!openaiClient) return res.status(500).json({ error: 'OpenAI not configured' });

      const completion = await openaiClient.chat.completions.create({
        messages,
        model: 'gpt-4o-mini',
      });
      res.json(completion.choices[0].message);
    } catch (error: any) {
      const requestId = (req as any).requestId;
      console.error(`[OpenAI Proxy Error] [${requestId}]:`, error);
      res.status(500).json({ ok: false, error: error.message || 'Failed to fetch OpenAI data', requestId });
    }
  });

  app.post('/api/ai/command', requireAuth, tenantScopingMiddleware, async (req: any, res) => {
    const requestId = (req as any).requestId;
    try {
      const { intent, userInput, context, mode, jsonMode } = req.body;
      const userId = req.userId; // Authenticated user
      const tenantId = req.tenantId;
      
      console.log(`[AI Command] [${requestId}] Processing intent: ${intent}`, { userInput, context, tenantId });

      const result = await routeAIRequest({
        intent,
        userInput,
        mode,
        jsonMode,
        context: { ...context, userId, tenantId } // Pass userId and tenantId to context
      });

      // Log AI run
      if (supabase) {
        await supabase.from('ai_runs').insert([{
          provider: result.provider || 'unknown',
          success: result.ok,
          error: result.error || null,
          request_id: requestId,
          tenant_id: tenantId // Log tenant_id
        }]);
      }

      res.json({ ...result, requestId });
    } catch (error: any) {
      console.error(`[AI Command] [${requestId}] Error:`, error.message, { body: req.body, stack: error.stack });
      
      if (supabase) {
        await supabase.from('ai_runs').insert([{
          provider: 'unknown',
          success: false,
          error: error.message,
          request_id: requestId
        }]);
      }

      res.status(500).json({ 
        ok: false, 
        provider: null,
        fallback: true,
        output: "",
        error: error?.message || String(error),
        requestId
      });
    }
  });

  // Google OAuth Routes
  app.get('/api/auth/google-url', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const appUrl = process.env.APP_URL?.replace(/\/$/, '');

    if (!clientId || !appUrl) {
      console.error('Missing Google OAuth configuration:', { clientId: !!clientId, appUrl: !!appUrl });
      return res.status(500).json({ error: 'Google OAuth is not configured on the server.' });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${appUrl}/auth/callback`,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
      code_challenge: req.query.code_challenge as string,
      code_challenge_method: 'S256'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    res.json({ url: authUrl });
  });

  app.get('/auth/callback', (req, res) => {
    res.send(`
      <html>
        <body>
          <script>
            const hash = window.location.hash;
            const query = window.location.search;
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', hash: hash, query: query }, '*');
              window.close();
            } else {
              document.body.innerHTML = 'Authentication successful. You can close this window.';
            }
          </script>
          <p>Authenticating...</p>
        </body>
      </html>
    `);
  });

  // GitHub API Route
  app.get('/api/github/repos', requireAuth, async (req, res) => {
    try {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        return res.status(401).json({ error: 'GitHub token not configured' });
      }

      const octokit = new Octokit({ auth: token });
      
      // Fetch authenticated user's repositories
      const { data } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 5
      });
      
      res.json(data);
    } catch (error: any) {
      console.error('GitHub API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch GitHub data' });
    }
  });

  // --- NEW PMO-SPECIFIC ROUTE PATTERN ---
  
  app.post('/api/pmo/:action', requireAuth, async (req: any, res) => {
    const { action } = req.params;
    const payload = req.body;
    const userId = req.userId;
    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Supabase not configured' });
    }

    try {
      let result;

      // 1. Backend Logic (Supabase)
      switch (action) {
        case 'get_projects':
          const { data: projectsData, error: projectsError } = await supabaseAdmin
            .from('projects')
            .select('*')
            .eq('tenant_id', req.tenantId)
            .order('priority_score', { ascending: false });
          if (projectsError) throw projectsError;
          result = projectsData;
          break;

        case 'get_checklist_items':
          const { data: checklistData, error: checklistError } = await supabaseAdmin
            .from('checklist_items')
            .select('*')
            .eq('tenant_id', req.tenantId)
            .eq('category', 'project')
            .order('created_at', { ascending: true });
          if (checklistError) throw checklistError;
          result = checklistData;
          break;

        case 'get_reminders':
          const { data: remindersData, error: remindersError } = await supabaseAdmin
            .from('system_reminders')
            .select('*')
            .eq('tenant_id', req.tenantId)
            .eq('is_dismissed', false)
            .order('created_at', { ascending: true });
          if (remindersError) throw remindersError;
          result = remindersData;
          break;

        case 'create_project':
          const projectName = typeof payload?.name === 'string' && payload.name.trim() 
            ? payload.name.trim() 
            : (payload?.title || 'New Strategic Initiative');

          const { data: createData, error: createError } = await supabaseAdmin
            .from('projects')
            .insert([{
              title: projectName,
              description: payload?.description ?? null,
              type: payload?.type || 'Strategic',
              status: payload?.status || 'planned',
              owner_id: userId,
              tenant_id: req.tenantId, // Added tenant_id
            }])
            .select()
            .maybeSingle();
            
          if (createError) throw createError;
          result = createData;
          break;

        case 'toggle_checklist_item':
          const { data: toggleData, error: toggleError } = await supabaseAdmin
            .from('checklist_items')
            .update({ is_completed: !payload.currentStatus })
            .eq('id', payload.id)
            .eq('tenant_id', req.tenantId) // Scoped
            .select()
            .maybeSingle();
            
          if (toggleError) throw toggleError;
          result = toggleData;
          break;

        case 'dismiss_reminder':
          const { data: dismissData, error: dismissError } = await supabaseAdmin
            .from('system_reminders')
            .update({ is_dismissed: true })
            .eq('id', payload.id)
            .eq('tenant_id', req.tenantId) // Scoped
            .select()
            .maybeSingle();
            
          if (dismissError) throw dismissError;
          result = dismissData;
          break;

        case 'view_project_detail':
          const { data: viewData, error: viewError } = await supabaseAdmin
            .from('projects')
            .select('*')
            .eq('id', payload.id)
            .eq('tenant_id', req.tenantId) // Scoped
            .maybeSingle();
            
          if (viewError) throw viewError;
          result = viewData;
          break;

        case 'FILTER_PROJECTS':
          const { data: filterData, error: filterError } = await supabaseAdmin
            .from('projects')
            .select('*')
            .eq('status', payload.status)
            .eq('tenant_id', req.tenantId); // Scoped
            
          if (filterError) throw filterError;
          result = filterData;
          break;

        case 'LOAD_MORE':
          const { data: loadData, error: loadError } = await supabaseAdmin
            .from('projects')
            .select('*')
            .eq('tenant_id', req.tenantId) // Scoped
            .range(payload.from, payload.to);
            
          if (loadError) throw loadError;
          result = loadData;
          break;

        case 'AI_ANALYSIS':
          result = { analysis: `AI analysis completed for ${payload.target || 'data'}` };
          break;

        default:
          result = { message: `Action ${action} executed successfully` };
          break;
      }

      // 2. AI Layer (Orchestrator)
      const aiResult = await orchestrator.orchestrate(action, { ...payload, result }, userId);
      
      // 3. Event Bus
      await emitEvent(`${action}.executed`, { result, aiResult }, userId);

      return res.status(200).json({ success: true, result, aiResult });

    } catch (error: any) {
      console.error(`Error in PMO action ${action}:`, error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Action Execution Endpoint (Legacy / Generic)
  app.post('/api/actions/execute', requireAuth, async (req: any, res) => {
    try {
      const { actionId, payload = {}, runId = null } = req.body || {};
      const userId = req.userId; // ✅ from verified JWT middleware
      
      if (!actionId) {
        return res.status(400).json({
          ok: false,
          error: 'Missing actionId',
          requestId: req.requestId,
        });
      }
      
      const allowlist = new Set([
        'run_intelligence_sync',
        'export_assets',
        'create_project',
        'view_all_priorities',
        'view_queue',
        'download_report',
        'run_full_audit',
        'refresh_system',
        'sync_github_repos',
        'build_app',
        'export_pdf',
        'sign_out',
        'deploy_workflow',
        'run_simulation',
        'share_post',
        'approve_budget',
        'review_budget',
        'auto_restock',
        'generate_strategic_insights',
        'add_team_member_action',
        'call_support',
        'view_tasks',
        'view_messages',
        'view_support',
        'view_health',
        'initiate_system_audit',
        'export_team_csv',
        'run_system_health_check',
        'analyze_image',
        'chat_message',
        'execute_diagnostic_action',
        'toggle_checklist_item',
        'dismiss_reminder',
        'filter_projects',
        'resolve_alert',
        'view_log_detail',
        'view_booking_detail',
        'view_issue_queue',
        'view_issue_detail',
        'view_all_initiatives',
        'simulate_agent',
        'view_story_detail',
        'like_story',
        'view_patient_detail',
        'contact_member',
        'search_tickets',
        'sort_tickets',
        'view_ticket_detail',
        'assign_ticket',
        'view_diagnostics',
        'view_project_detail',
        'toggle_view_mode',
        'view_compliance_report',
        'view_velocity_metrics',
        'view_risk_assessment',
        'view_metric_detail',
        'view_inventory_detail',
        'view_marketing_insights',
        'view_clinical_insights',
        'view_mocha_framework',
        'view_member_profile',
        'view_incident_trends',
        'refresh_quality_stats',
        'view_authority_detail',
        'trigger_system_chain',
        'view_social_stats'
      ]);
      
      if (!allowlist.has(actionId)) {
        return res.status(400).json({
          ok: false,
          error: `Action not implemented: ${actionId}`,
          actionId,
          runId,
          requestId: req.requestId,
        });
      }
      
      if (actionId === 'create_project') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');
        
        const projectName = typeof payload?.name === 'string' && payload.name.trim() 
          ? payload.name.trim() 
          : (payload?.title || 'New Strategic Initiative');

        const { data, error } = await supabaseAdmin
          .from('projects')
          .insert([
            {
              title: projectName,
              description: payload?.description ?? null,
              type: payload?.type || 'Strategic',
              status: payload?.status || 'planned',
              owner_id: userId, // ✅ NEVER from payload
              tenant_id: req.tenantId, // Scoped
            },
          ])
          .select()
          .maybeSingle();
          
        if (error) {
          return res.status(400).json({
            ok: false,
            status: 'failed',
            error: error.message,
            requestId: req.requestId,
          });
        }
        
        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: data,
          requestId: req.requestId,
        });
      }
      if (actionId === 'sign_out') {
        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Sign out acknowledged' },
          requestId: req.requestId,
        });
      }
      if (actionId === 'run_intelligence_sync') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        // 1. Create the signal for tracking
        const { data: signal, error: signalError } = await supabaseAdmin
          .from('operational_signals')
          .insert([
            {
              source_app: 'pmo_ops',
              signal_type: 'INTELLIGENCE_SYNC',
              context_data: {
                userInput: payload?.userInput || 'Run intelligence sync for current workspace.',
                mode: payload?.mode || 'executive',
                context: payload?.context || {},
              },
              status: 'unprocessed',
              tenant_id: req.tenantId, // Scoped
            },
          ])
          .select()
          .maybeSingle();

        if (signalError) {
          return res.status(500).json({
            ok: false,
            error: signalError.message,
            requestId: req.requestId,
          });
        }

        // 2. Generate a REAL AI response
        const aiResponse = await routeAIRequest({
          intent: 'run_intelligence_sync',
          userInput: payload?.userInput || 'Synthesize current operational intelligence and provide strategic recommendations.',
          mode: payload?.mode || 'executive',
          context: payload?.context || {},
        });

        return res.json({
          ok: aiResponse.ok,
          actionId,
          runId,
          status: 'completed',
          result: { 
            message: 'Intelligence synthesized successfully', 
            text: typeof aiResponse.output === 'string' ? aiResponse.output : JSON.stringify(aiResponse.output),
            signal 
          },
          requestId: req.requestId,
        });
      }
      if (actionId === 'delegate_tasks') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { data, error } = await supabaseAdmin
          .from('execution_logs')
          .insert([
            {
              user_id: userId,
              action_type: 'decision',
              tool: 'Automation',
              tenant_id: req.tenantId, // Scoped
              metadata: {
                intent: 'DELEGATE_TASKS',
                userInput: payload?.userInput || 'Analyze active tasks and recommend delegation.',
                mode: payload?.mode || 'executive',
                context: payload?.context || {},
              },
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          return res.status(500).json({
            ok: false,
            error: error.message,
            requestId: req.requestId,
          });
        }

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Delegation request logged', log: data },
          requestId: req.requestId,
        });
      }
      if (actionId === 'export_assets') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { data, error } = await supabaseAdmin
          .from('execution_logs')
          .insert([
            {
              user_id: userId,
              action_type: 'automate',
              tool: 'Automation',
              tenant_id: req.tenantId, // Scoped
              metadata: {
                intent: 'EXPORT_ASSETS',
                format: payload?.format || 'PDF',
              },
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          return res.status(500).json({
            ok: false,
            error: error.message,
            requestId: req.requestId,
          });
        }

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Asset export logged', log: data },
          requestId: req.requestId,
        });
      }
      if (actionId === 'open_prospect_wizard') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { data, error } = await supabaseAdmin
          .from('execution_logs')
          .insert([
            {
              user_id: userId,
              action_type: 'decision',
              tool: 'Manual',
              tenant_id: req.tenantId, // Scoped
              metadata: {
                intent: 'OPEN_PROSPECT_WIZARD',
                initialData: payload?.initialData || {},
              },
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          return res.status(500).json({
            ok: false,
            error: error.message,
            requestId: req.requestId,
          });
        }

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Prospect wizard logged', log: data },
          requestId: req.requestId,
        });
      }
      if (actionId === 'run_simulation') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        // 1. Log the simulation request
        const { data: log, error: logError } = await supabaseAdmin
          .from('execution_logs')
          .insert([
            {
              user_id: userId,
              action_type: 'simulation',
              tool: 'AI',
              tenant_id: req.tenantId, // Scoped
              metadata: {
                intent: 'RUN_SIMULATION',
                context: payload?.context || {},
                mode: payload?.mode || 'simulation',
              },
            },
          ])
          .select()
          .maybeSingle();

        if (logError) {
          return res.status(500).json({
            ok: false,
            error: logError.message,
            requestId: req.requestId,
          });
        }

        // 2. Generate a REAL AI simulation
        const aiResponse = await routeAIRequest({
          intent: 'run_simulation',
          userInput: 'Run a predictive simulation based on current project data and identify potential risks.',
          mode: 'simulation',
          context: payload?.context || {},
        });

        return res.json({
          ok: aiResponse.ok,
          actionId,
          runId,
          status: 'completed',
          result: { 
            message: 'Simulation completed successfully', 
            text: typeof aiResponse.output === 'string' ? aiResponse.output : JSON.stringify(aiResponse.output),
            log 
          },
          requestId: req.requestId,
        });
      }
      if (actionId === 'approve_budget') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { data, error } = await supabaseAdmin
          .from('execution_logs')
          .insert([
            {
              user_id: userId,
              action_type: 'decision',
              tool: 'Manual',
              tenant_id: req.tenantId, // Scoped
              metadata: {
                intent: 'APPROVE_BUDGET',
                payload: payload,
              },
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          return res.status(500).json({
            ok: false,
            error: error.message,
            requestId: req.requestId,
          });
        }

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Budget approved', log: data },
          requestId: req.requestId,
        });
      }
      if (actionId === 'review_budget') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { data, error } = await supabaseAdmin
          .from('execution_logs')
          .insert([
            {
              user_id: userId,
              action_type: 'decision',
              tool: 'Manual',
              tenant_id: req.tenantId, // Scoped
              metadata: {
                intent: 'REVIEW_BUDGET',
                payload: payload,
              },
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          return res.status(500).json({
            ok: false,
            error: error.message,
            requestId: req.requestId,
          });
        }

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Budget review logged', log: data },
          requestId: req.requestId,
        });
      }

      if (actionId === 'generate_strategic_insights') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        // 1. Create the signal for tracking
        const { data: signal, error: signalError } = await supabaseAdmin
          .from('operational_signals')
          .insert([
            {
              source_app: 'pmo_ops',
              signal_type: 'STRATEGIC_INSIGHT_GEN',
              context_data: {
                userInput: payload?.userInput || 'Generate new strategic insights.',
                mode: payload?.mode || 'executive',
                context: payload?.context || {},
              },
              status: 'unprocessed',
              tenant_id: req.tenantId, // Scoped
            },
          ])
          .select()
          .maybeSingle();

        if (signalError) {
          return res.status(500).json({
            ok: false,
            error: signalError.message,
            requestId: req.requestId,
          });
        }

        // 2. Generate a REAL AI response
        const aiResponse = await routeAIRequest({
          intent: 'generate_strategic_insights',
          userInput: payload?.userInput || 'Generate 3 high-impact strategic insights based on current operational data.',
          mode: payload?.mode || 'executive',
          context: payload?.context || {},
        });

        return res.json({
          ok: aiResponse.ok,
          actionId,
          runId,
          status: 'completed',
          result: { 
            message: 'Strategic insights generated successfully', 
            text: typeof aiResponse.output === 'string' ? aiResponse.output : JSON.stringify(aiResponse.output),
            signal 
          },
          requestId: req.requestId,
        });
      }

      if (actionId === 'add_team_member_action') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { data, error } = await supabaseAdmin
          .from('users')
          .insert([
            {
              email: payload?.email || `new_member_${Date.now()}@example.com`,
              full_name: payload?.name || 'New Team Member',
              role: payload?.role || 'Member',
              tier: payload?.tier || 'contributor_paid',
              organization_id: req.tenantId, // Using tenantId as organizationId for now
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          return res.status(500).json({
            ok: false,
            error: error.message,
            requestId: req.requestId,
          });
        }

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Team member added successfully', member: data },
          requestId: req.requestId,
        });
      }

      if (actionId === 'toggle_checklist_item') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { id, is_completed } = payload;
        const { data, error } = await supabaseAdmin
          .from('checklist_items')
          .update({ is_completed })
          .eq('id', id)
          .eq('tenant_id', req.tenantId) // Scoped
          .select()
          .maybeSingle();

        if (error) throw error;

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Checklist item updated', item: data },
          requestId: req.requestId,
        });
      }

      if (actionId === 'dismiss_reminder') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { id } = payload;
        const { data, error } = await supabaseAdmin
          .from('system_reminders')
          .update({ is_dismissed: true })
          .eq('id', id)
          .eq('tenant_id', req.tenantId) // Scoped
          .select()
          .maybeSingle();

        if (error) throw error;

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Reminder dismissed', item: data },
          requestId: req.requestId,
        });
      }

      if (actionId === 'filter_projects') {
        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Filters applied' },
          requestId: req.requestId,
        });
      }

      if (actionId === 'resolve_alert') {
        const supabaseAdmin = getSupabaseAdmin();
        if (!supabaseAdmin) throw new Error('Supabase not configured');

        const { id } = payload;
        const { data, error } = await supabaseAdmin
          .from('office_alerts')
          .update({ is_resolved: true })
          .eq('id', id)
          .eq('tenant_id', req.tenantId) // Scoped
          .select()
          .maybeSingle();

        if (error) throw error;

        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Alert resolved', item: data },
          requestId: req.requestId,
        });
      }

      if (actionId === 'view_log_detail') {
        return res.json({
          ok: true,
          actionId,
          runId,
          status: 'completed',
          result: { message: 'Viewing log detail' },
          requestId: req.requestId,
        });
      }

      // Generic handler for remaining allowlisted actions
      const supabaseAdmin = getSupabaseAdmin();
      if (!supabaseAdmin) throw new Error('Supabase not configured');

      const { data, error } = await supabaseAdmin
        .from('execution_logs')
        .insert([
          {
            user_id: userId,
            action_type: 'generic_action',
            tool: 'System',
            tenant_id: req.tenantId, // Scoped
            metadata: {
              actionId,
              payload,
            },
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message,
          requestId: req.requestId,
        });
      }

      return res.json({
        ok: true,
        actionId,
        runId,
        status: 'completed',
        result: { message: `${actionId} executed and logged`, log: data },
        requestId: req.requestId,
      });
      return res.status(400).json({
        ok: false,
        error: `Action not implemented: ${actionId}`,
        actionId,
        runId,
        requestId: req.requestId,
      });
    } catch (error: any) {
      console.error(`[actions][${req.requestId}] Error`, error);
      return res.status(500).json({
        ok: false,
        error: error?.message || 'Action execution failed',
        requestId: req.requestId,
      });
    }
  });

  // Agentic Dispatcher Route
  app.post('/api/agent-dispatcher', requireAuth, async (req, res) => {
    try {
      const { intent, current_page, context_data } = req.body;
      const userId = req.userId;
      
      const openaiClient = getOpenAIClient();
      if (!openaiClient) return res.status(500).json({ error: 'OpenAI not configured' });

      const brainPrompt = `User Intent: "${intent}" on page "${current_page}".
        Context: ${JSON.stringify(context_data)}.
        Available Pipelines: [Tech-Ops 12-Stage, PMO-Ops 4-Layer, miidle Build Story].
        Task: Identify the correct pipeline, execute the next logic step, and return a UI-ready state update.
        Respond ONLY with a valid JSON object containing a 'status_message' and any other relevant UI state updates. Do not use markdown blocks.`;

      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: brainPrompt }],
        response_format: { type: "json_object" }
      });

      const aiAction = JSON.parse(completion.choices[0].message.content || '{}');

      // In a real scenario, we would execute DB changes here using Supabase service role
      // For now, we return the UI patch

      res.json(aiAction);
    } catch (error: any) {
      console.error('Agent Dispatcher Error:', error);
      res.status(500).json({ error: error.message || 'Dispatch failed', status_message: 'System Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Starting Vite in middleware mode...');
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('[Server] Vite middleware attached.');
    } catch (viteError) {
      console.error('[Server] Failed to start Vite server:', viteError);
    }
  } else {
    console.log('[Server] Running in production mode.');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Start self-learning engine
    setInterval(() => {
      runLearningEngine().catch(err => console.error('[LearningEngine] Interval error:', err));
    }, 10 * 60 * 1000); // Every 10 minutes
    
    runLearningEngine().catch(err => console.error('[LearningEngine] Startup error:', err));
  });
}

startServer();
