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

    render(<MiiddleMicrofrontend path="/dashboard" title="Miiddle Add-on" />);

    const iframe = await waitFor(() => screen.getByTitle("Miiddle Add-on"));
    expect(iframe).toHaveAttribute(
      "src",
      "https://miiddle.example.com/dashboard"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/miiddle/service-status",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("shows a warning banner but still embeds when service-status is disconnected", async () => {
    mockFetchOnce({ connected: false, baseUrl: "https://miiddle.example.com" });

    const mod = await import("@/components/MiiddleEmbed/MiiddleMicrofrontend");
    const MiiddleMicrofrontend = mod.default as React.FC<{ path?: string }>;

    render(<MiiddleMicrofrontend path="/dashboard" />);

    const iframe = await waitFor(() => screen.getByTitle("Miiddle"));
    expect(iframe).toHaveAttribute("src", "https://miiddle.example.com/dashboard");
    expect(await screen.findByRole("status")).toHaveTextContent(/Could not confirm Miiddle health/i);
  });

  it("fetches service-status on each mount (no cross-instance cache)", async () => {
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
      expect(iframes.some((el) => el.getAttribute("src") === "https://miiddle.example.com/settings")).toBe(true);
    });

    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
