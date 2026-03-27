import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  handleCorsPreflight,
  jsonResponse,
  restInsert,
} from "../_shared/brain.ts";

type MilestoneLike = {
  id?: string;
  profile_id?: string;
  initiative_id?: string;
  project_id?: string;
  title?: string;
  status?: string;
  completed?: boolean;
  due_date?: string;
};

const SIGNAL_CODES = new Set([
  "missed_deadline",
  "milestone_delay",
  "backlog_growth",
]);

function daysOverdue(dueDate: string, now = new Date()): number {
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 0;
  const diffMs = now.getTime() - due.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function computeSeverity(signalCode: string, payload: Record<string, unknown>): number {
  if (signalCode === "missed_deadline") {
    const overdueDays = Number(payload.overdue_days ?? 0);
    return Math.min(100, Math.max(0, overdueDays * 8 + 20));
  }
  if (signalCode === "milestone_delay") {
    const delayDays = Number(payload.delay_days ?? 0);
    return Math.min(100, Math.max(0, delayDays * 6 + 15));
  }
  if (signalCode === "backlog_growth") {
    const growthPct = Number(payload.backlog_growth_percent ?? 0);
    return Math.min(100, Math.max(0, growthPct));
  }
  return 50;
}

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const body = await req.json();
    const requestId = String(body?.request_id ?? "");
    const workflowRunId = body?.workflow_run_id ? String(body.workflow_run_id) : null;
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    const initiativeId = body?.initiative_id ? String(body.initiative_id) : null;
    const domain = String(body?.domain ?? "pmo_ops");
    const milestone = (body?.milestone ?? {}) as MilestoneLike;
    const backlogGrowthPercent = Number(body?.backlog_growth_percent ?? 0);

    if (!requestId || !profileId) {
      return jsonResponse({ error: "request_id and profile_id are required" }, 400);
    }

    const emitted: Array<Record<string, unknown>> = [];
    const nowIso = new Date().toISOString();

    const normalizedStatus = String(milestone.status ?? "").toLowerCase();
    const completed = Boolean(milestone.completed ?? false) || normalizedStatus === "completed";
    const dueDate = milestone.due_date ? String(milestone.due_date) : "";
    const overdueDays = dueDate ? daysOverdue(dueDate) : 0;

    if (!completed && overdueDays > 0) {
      emitted.push({
        signal_code: "missed_deadline",
        payload: {
          overdue_days: overdueDays,
          due_date: dueDate,
          milestone_id: milestone.id ?? null,
          milestone_title: milestone.title ?? null,
        },
      });
    }

    if (!completed && overdueDays >= 3) {
      emitted.push({
        signal_code: "milestone_delay",
        payload: {
          delay_days: overdueDays,
          milestone_id: milestone.id ?? null,
          milestone_title: milestone.title ?? null,
        },
      });
    }

    if (backlogGrowthPercent >= 20) {
      emitted.push({
        signal_code: "backlog_growth",
        payload: {
          backlog_growth_percent: backlogGrowthPercent,
          source: "initiative_queue",
        },
      });
    }

    if (emitted.length === 0) {
      return jsonResponse({
        profile_id: profileId,
        initiative_id: initiativeId,
        emitted_count: 0,
        signals: [],
      });
    }

    const insertedSignals: Array<Record<string, unknown>> = [];
    for (const event of emitted) {
      const signalCode = String(event.signal_code);
      if (!SIGNAL_CODES.has(signalCode)) continue;
      const payload = (event.payload ?? {}) as Record<string, unknown>;
      const signalId = crypto.randomUUID();
      const severity = computeSeverity(signalCode, payload);
      const confidence = signalCode === "backlog_growth" ? 0.82 : 0.9;

      await restInsert("public.ai_worker_signals", {
        id: signalId,
        request_id: requestId,
        workflow_run_id: workflowRunId,
        profile_id: profileId,
        organization_id: organizationId,
        domain,
        entity_type: "initiative",
        entity_id: initiativeId,
        signal_type: "operational",
        signal_code: signalCode,
        severity,
        confidence_score: confidence,
        reason_codes: [signalCode],
        evidence: payload,
        status: "new",
        processed: false,
        triggered_at: nowIso,
      });

      insertedSignals.push({
        id: signalId,
        signal_code: signalCode,
        severity,
        confidence_score: confidence,
        evidence: payload,
      });
    }

    return jsonResponse({
      profile_id: profileId,
      initiative_id: initiativeId,
      emitted_count: insertedSignals.length,
      signals: insertedSignals,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
