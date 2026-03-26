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

describe("Miiddle microfrontend embed", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("builds iframe src from service-status baseUrl + path", async () => {
    const fetchMock = mockFetchOnce({
      connected: true,
      baseUrl: "https://miiddle.example.com",
    });

    const mod = await import("@/components/MiiddleEmbed/MiiddleMicrofrontend");
    const MiiddleMicrofrontend = mod.default as React.FC<{
      path?: string;
      title?: string;
    }>;

    render(<MiiddleMicrofrontend path="/dashboard" title="Miiddle" />);

    const iframe = await waitFor(() => screen.getByTitle("Miiddle"));
    expect(iframe).toHaveAttribute(
      "src",
      "https://miiddle.example.com/dashboard"
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/miiddle/service-status", expect.anything());
  });

  it("shows an offline banner when service-status is disconnected", async () => {
    mockFetchOnce({ connected: false, baseUrl: "https://miiddle.example.com" });

    const mod = await import("@/components/MiiddleEmbed/MiiddleMicrofrontend");
    const MiiddleMicrofrontend = mod.default as React.FC<{ path?: string }>;

    render(<MiiddleMicrofrontend path="/dashboard" />);

    expect(await screen.findByText(/Miiddle is offline/i)).toBeInTheDocument();
  });

  it("caches service-status to avoid repeated fetches", async () => {
    const fetchMock = mockFetchOnce({
      connected: true,
      baseUrl: "https://miiddle.example.com",
    });

    const mod = await import("@/components/MiiddleEmbed/MiiddleMicrofrontend");
    const MiiddleMicrofrontend = mod.default as React.FC<{ path?: string }>;

    render(<MiiddleMicrofrontend path="/dashboard" />);

    const iframe1 = await waitFor(() => screen.getByTitle("Miiddle"));
    expect(iframe1).toHaveAttribute("src", "https://miiddle.example.com/dashboard");

    render(<MiiddleMicrofrontend path="/settings" />);

    await waitFor(() => {
      const iframes = screen.getAllByTitle("Miiddle");
      const last = iframes[iframes.length - 1];
      expect(last).toHaveAttribute("src", "https://miiddle.example.com/settings");
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
