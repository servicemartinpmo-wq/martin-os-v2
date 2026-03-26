import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

function mockFetchOnce(payload: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => payload,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).fetch = fetchMock;
  return fetchMock;
}

describe("Tech-Ops microfrontend embed", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("builds iframe src from service-status baseUrl + path", async () => {
    const fetchMock = mockFetchOnce({
      connected: true,
      baseUrl: "https://tech-ops.example.com",
    });

    const mod = await import("@/components/TechOpsEmbed/TechOpsMicrofrontend");
    const TechOpsMicrofrontend = mod.default as React.FC<{
      path?: string;
      title?: string;
    }>;

    render(<TechOpsMicrofrontend path="/dashboard" title="Tech-Ops Add-on" />);

    const iframe = await waitFor(() => screen.getByTitle("Tech-Ops Add-on"));
    expect(iframe).toHaveAttribute(
      "src",
      "https://tech-ops.example.com/dashboard"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/techops/service-status",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("shows a warning banner but still embeds when service-status is disconnected", async () => {
    mockFetchOnce({ connected: false, baseUrl: "https://tech-ops.example.com" });

    const mod = await import("@/components/TechOpsEmbed/TechOpsMicrofrontend");
    const TechOpsMicrofrontend = mod.default as React.FC<{ path?: string }>;

    render(<TechOpsMicrofrontend path="/dashboard" />);

    const iframe = await waitFor(() => screen.getByTitle("Tech-Ops"));
    expect(iframe).toHaveAttribute("src", "https://tech-ops.example.com/dashboard");
    expect(await screen.findByRole("status")).toHaveTextContent(/Could not confirm Tech-Ops health/i);
  });

  it("fetches service-status on each mount (no cross-instance cache)", async () => {
    const fetchMock = mockFetchOnce({
      connected: true,
      baseUrl: "https://tech-ops.example.com",
    });

    const mod = await import("@/components/TechOpsEmbed/TechOpsMicrofrontend");
    const TechOpsMicrofrontend = mod.default as React.FC<{ path?: string }>;

    render(<TechOpsMicrofrontend path="/dashboard" />);

    const iframe1 = await waitFor(() => screen.getByTitle("Tech-Ops"));
    expect(iframe1).toHaveAttribute("src", "https://tech-ops.example.com/dashboard");

    render(<TechOpsMicrofrontend path="/cases" />);

    await waitFor(() => {
      const iframes = screen.getAllByTitle("Tech-Ops");
      expect(iframes.some((el) => el.getAttribute("src") === "https://tech-ops.example.com/cases")).toBe(true);
    });

    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});

