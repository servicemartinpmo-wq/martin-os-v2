import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import Projects from "@/pages/Projects";
import Knowledge from "@/pages/Knowledge";
import CRM from "@/pages/CRM";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "owner@example.com" },
    profile: { id: "user-1", userName: "Owner" },
  }),
}));

vi.mock("@/lib/supabaseDataService", () => ({
  getProjects: vi.fn().mockResolvedValue([]),
  upsertProject: vi.fn(),
}));

vi.mock("@/lib/tierSystem", () => ({
  useTierAccess: () => ({
    effectiveTier: "free",
    atLeast: () => true,
    limits: { members: 1 },
    usage: { members: 0 },
    canInviteMembers: true,
  }),
}));

describe("Empty state CTA paths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/members")) return { ok: true, json: async () => [] };
      if (url.includes("/api/crm/companies")) return { ok: true, json: async () => [] };
      if (url.includes("/api/crm/contacts")) return { ok: true, json: async () => [] };
      return { ok: true, json: async () => ({}) };
    });
  });

  it("projects shows and executes clear search CTA", async () => {
    render(<Projects />);
    const searchInput = await screen.findByPlaceholderText(/Search projects/i);
    fireEvent.change(searchInput, { target: { value: "nothing" } });
    expect(await screen.findByText(/No projects found/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Clear search/i }));
    expect((searchInput as HTMLInputElement).value).toBe("");
  });

  it("knowledge documents tab has browse and starter CTAs", async () => {
    render(<Knowledge />);
    fireEvent.click(screen.getByRole("button", { name: /Documents/i }));
    expect(await screen.findByRole("button", { name: /Browse Templates/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open Starter Template/i })).toBeInTheDocument();
  });

  it("crm free-tier lock state has pricing CTA", async () => {
    render(
      <MemoryRouter>
        <CRM />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("link", { name: /View Plans/i })).toBeInTheDocument();
  });
});

