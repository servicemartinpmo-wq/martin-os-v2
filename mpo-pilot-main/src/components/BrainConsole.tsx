import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { submitBrainRequest } from "@/lib/brainClient";

type Json = Record<string, unknown>;

interface BrainConsoleProps {
  title: string;
  placeholder?: string;
  defaultInput?: string;
  adminOnlyTechnicalDetails?: boolean;
  quickPrompts?: string[];
  onResult?: (result: Json, input: string) => void;
}

export default function BrainConsole({
  title,
  placeholder = "Describe the issue or request...",
  defaultInput = "",
  adminOnlyTechnicalDetails = false,
  quickPrompts = [],
  onResult,
}: BrainConsoleProps) {
  const { user } = useAuth();
  const [input, setInput] = useState(defaultInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Json | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const canViewTechnical =
    !adminOnlyTechnicalDetails ||
    (typeof window !== "undefined" && window.localStorage.getItem("apphia_creator_unlocked") === "true");

  async function runBrain() {
    const text = input.trim();
    if (!text) return;
    if (!user?.id) {
      setError("You must be signed in to run the brain layer.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await submitBrainRequest({
        request_id: crypto.randomUUID(),
        profile_id: user.id,
        input: text,
        started_at: new Date().toISOString(),
        actions: [],
      });
      const parsed = response as unknown as Json;
      setResult(parsed);
      onResult?.(parsed, text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="rounded-2xl border p-4 md:p-5 space-y-3"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <button
          onClick={runBrain}
          disabled={loading}
          className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-md border bg-background/60 p-3 text-sm outline-none"
        style={{ borderColor: "hsl(var(--border))" }}
      />
      {quickPrompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className="rounded-full border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Result</p>

          <div className="rounded-md border bg-background/60 p-3 space-y-2">
            <p className="text-sm font-semibold">
              {String(
                (result.operator_view as Json | undefined)?.message ??
                  "Request completed.",
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border p-2">
                <div className="text-muted-foreground">Status</div>
                <div className="font-semibold">{String(result.state ?? "unknown")}</div>
              </div>
              <div className="rounded border p-2">
                <div className="text-muted-foreground">Route</div>
                <div className="font-semibold">
                  {String(
                    ((result.machine_view as Json | undefined)?.decision as Json | undefined)?.route ??
                      "n/a",
                  )}
                </div>
              </div>
              <div className="rounded border p-2">
                <div className="text-muted-foreground">Confidence</div>
                <div className="font-semibold">
                  {String(
                    ((result.machine_view as Json | undefined)?.decision as Json | undefined)?.confidence_score ??
                      "n/a",
                  )}
                </div>
              </div>
            </div>
          </div>

          {Array.isArray(
            ((result.machine_view as Json | undefined)?.outcome as Json | undefined)?.action_results,
          ) && (
            <div className="rounded-md border bg-background/60 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Recommended next steps
              </p>
              <ul className="space-y-1 text-sm">
                {(
                  (((result.machine_view as Json | undefined)?.outcome as Json | undefined)
                    ?.action_results as unknown[]) ?? []
                )
                  .slice(0, 5)
                  .map((r, idx) => {
                    const row = r as Json;
                    const action = (row.action as Json | undefined) ?? {};
                    const instruction = String(
                      row.operator_instruction ?? action.operator_instruction ?? row.tool_name ?? "Action",
                    );
                    return <li key={idx}>- {instruction}</li>;
                  })}
              </ul>
            </div>
          )}

          {canViewTechnical ? (
            <>
              <button
                onClick={() => setShowTechnical((v) => !v)}
                className="text-xs underline text-muted-foreground"
              >
                {showTechnical ? "Hide technical details" : "Show technical details"}
              </button>
              {showTechnical && (
                <pre className="max-h-80 overflow-auto rounded-md border bg-background/70 p-3 text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Technical traces are hidden for standard users.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
