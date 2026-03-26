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
    expect(fetchMock).toHaveBeenCalledWith("/api/techops/service-status", expect.anything());
  });

  it("shows an offline banner when service-status is disconnected", async () => {
    mockFetchOnce({ connected: false, baseUrl: "https://tech-ops.example.com" });

    const mod = await import("@/components/TechOpsEmbed/TechOpsMicrofrontend");
    const TechOpsMicrofrontend = mod.default as React.FC<{ path?: string }>;

    render(<TechOpsMicrofrontend path="/dashboard" />);

    expect(await screen.findByText(/Tech-Ops is offline/i)).toBeInTheDocument();
  });

  it("caches service-status to avoid repeated fetches", async () => {
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

    // The second mount should use cached status instead of fetching again.
    await waitFor(() => {
      const iframe2 = screen.getByTitle("Tech-Ops");
      expect(iframe2).toHaveAttribute("src", "https://tech-ops.example.com/cases");
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

