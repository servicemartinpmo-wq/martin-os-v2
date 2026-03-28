import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import BrainConsole from "@/components/BrainConsole";

const mockSubmitBrainRequest = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/lib/brainClient", () => ({
  submitBrainRequest: (...args: unknown[]) => mockSubmitBrainRequest(...args),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("BrainConsole reliability UX", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUseAuth.mockReturnValue({ user: { id: "user-1" } });
  });

  it("hides technical details for standard users", async () => {
    mockSubmitBrainRequest.mockResolvedValue({
      state: "completed",
      operator_view: { message: "Done" },
      machine_view: { decision: { route: "diagnostic_workflow", confidence_score: 0.82 }, outcome: { action_results: [] } },
    });

    render(<BrainConsole title="Tech-Ops Troubleshooting Console" adminOnlyTechnicalDetails />);
    fireEvent.change(screen.getByPlaceholderText(/Describe the issue/i), { target: { value: "API returns 500" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));

    await screen.findByText("Done");
    expect(screen.queryByText(/Show technical details/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Technical traces are hidden for standard users/i)).toBeInTheDocument();
  });

  it("supports quick prompt chips and onResult callback", async () => {
    const onResult = vi.fn();
    mockSubmitBrainRequest.mockResolvedValue({
      state: "completed",
      operator_view: { message: "Processed" },
      machine_view: { decision: { route: "diagnostic_workflow", confidence_score: 0.91 }, outcome: { action_results: [] } },
    });

    render(
      <BrainConsole
        title="Tech-Ops Troubleshooting Console"
        quickPrompts={["Customers see 500 errors"]}
        onResult={onResult}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Customers see 500 errors" }));
    fireEvent.click(screen.getByRole("button", { name: "Run" }));

    await screen.findByText("Processed");
    await waitFor(() => expect(onResult).toHaveBeenCalledTimes(1));
  });
});

