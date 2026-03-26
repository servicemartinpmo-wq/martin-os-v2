import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import TechOpsAddOn from "@/pages/TechOpsAddOn";

vi.mock("@/components/TechOpsEmbed/TechOpsMicrofrontend", () => ({
  default: ({ path }: { path: string }) => <div data-testid="techops-microfrontend">micro:{path}</div>,
}));

vi.mock("@/components/BrainConsole", () => ({
  default: ({ onResult }: { onResult?: (result: Record<string, unknown>) => void }) => (
    <div>
      <div>Mock Brain Console</div>
      <button
        onClick={() =>
          onResult?.({
            machine_view: { decision: { route: "diagnostic_workflow", confidence_score: 0.88 } },
          })
        }
      >
        Emit Result
      </button>
    </div>
  ),
}));

describe("TechOpsAddOn page behaviors", () => {
  it("keeps advanced workspace collapsed by default and toggles open", async () => {
    render(
      <MemoryRouter initialEntries={["/tech-ops"]}>
        <TechOpsAddOn />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("techops-microfrontend")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Advanced Tech-Ops workspace/i }));
    expect(await screen.findByTestId("techops-microfrontend")).toHaveTextContent("micro:/dashboard");
  });

  it("updates incident panel from latest run output", async () => {
    render(
      <MemoryRouter initialEntries={["/tech-ops"]}>
        <TechOpsAddOn />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Emit Result" }));
    expect(await screen.findByText(/Latest run route: diagnostic_workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/Model confidence: 0.88/i)).toBeInTheDocument();
  });
});

