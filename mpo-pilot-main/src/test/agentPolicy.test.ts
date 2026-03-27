import { describe, expect, it } from "vitest";
import {
  buildAgentPolicyPayload,
  buildOperationalAutomationMap,
  buildOperationalAutomationPlan,
  normalizeDomainHint,
  selectPrimaryAgent,
  toClassifierDomain,
} from "../../supabase/functions/_shared/agentPolicy";

describe("brain layer agent policy routing", () => {
  it("routes technical incidents to Tech-Ops support agent", () => {
    const selected = selectPrimaryAgent("Our API returns 500 after deploy", {
      type: "ticket",
      domain: "tech",
    });
    expect(selected.primary.id).toBe("tech_ops_support_agent");
  });

  it("routes strategy and capacity signals to PMO advisory", () => {
    const selected = selectPrimaryAgent(
      "Our maturity score keeps dropping and capacity overload is growing",
      { type: "question", domain: "pmo" },
    );
    expect(selected.primary.id).toBe("pmo_ops_advisory_agent");
  });

  it("routes compliance-sensitive requests to governance agent", () => {
    const selected = selectPrimaryAgent("Check GDPR and SOX compliance gaps", {
      type: "action",
      domain: "general",
    });
    expect(selected.primary.id).toBe("structural_remedy_governance_agent");
  });

  it("builds plain-English protocol and section order contract", () => {
    const payload = buildAgentPolicyPayload(
      "Create a build story for this sprint output",
      { type: "action", domain: "ops" },
      normalizeDomainHint("miidle"),
    );
    expect(
      ((payload.selected_agent as Record<string, unknown>).id as string),
    ).toBe("miidle_content_build_story_agent");
    expect(Array.isArray(payload.section_order)).toBe(true);
    expect(payload.section_order).toHaveLength(7);
    expect(
      (payload.plain_english_protocol as Record<string, unknown>)
        .problem_summary,
    ).toBeTruthy();
  });

  it("maps normalized domains to classifier domains", () => {
    expect(toClassifierDomain(normalizeDomainHint("tech_ops")!)).toBe("tech");
    expect(toClassifierDomain(normalizeDomainHint("pmo_ops")!)).toBe("pmo");
    expect(toClassifierDomain(normalizeDomainHint("miidle")!)).toBe("ops");
    expect(toClassifierDomain(normalizeDomainHint("general")!)).toBe("general");
  });

  it("exposes 24/7 automation map with event and scheduled audits", () => {
    const map = buildOperationalAutomationMap();
    expect(map.operating_mode).toBe("24x7_continuous_operations");
    expect(map.event_automations.length).toBeGreaterThan(0);
    expect(map.scheduled_audits.length).toBeGreaterThan(0);
  });

  it("builds operational plan with event match and collaboration stages", () => {
    const plan = buildOperationalAutomationPlan(
      "Trigger a 24/7 workflow and deploy all features",
      "tech_ops_support_agent",
      "tech_ops",
    );
    expect(plan.mode).toBe("24x7_continuous_operations");
    expect(plan.collaboration_stages.length).toBeGreaterThan(0);
    expect(Array.isArray(plan.event_matches)).toBe(true);
    expect(Array.isArray(plan.scheduled_audits)).toBe(true);
  });
});
