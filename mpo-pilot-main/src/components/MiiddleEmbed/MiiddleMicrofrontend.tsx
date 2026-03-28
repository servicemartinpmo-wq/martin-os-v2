import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type MiiddleServiceStatus = {
  connected: boolean;
  status?: string;
  baseUrl?: string;
  error?: string;
};

const DEFAULT_MIIDDLE_BASE_URL = "http://localhost:5010";

function envMiiddleBaseUrl(): string | undefined {
  const raw = import.meta.env.VITE_MIIDDLE_BASE_URL;
  if (!raw || typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t ? t.replace(/\/$/, "") : undefined;
}

function normalizeMiiddlePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function joinBaseAndPath(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/$/, "");
  const p = normalizeMiiddlePath(path);
  return `${base}${p}`;
}

export interface MiiddleMicrofrontendProps {
  /**
   * Miiddle internal route (e.g. "/" | "/dashboard" | "/settings").
   * Mapped to the iframe src by prefixing the resolved base URL.
   */
  path?: string;
  className?: string;
  title?: string;
}

/**
 * Embeds Miiddle in an iframe. Always loads the embed so users can interact
 * when `/api/miiddle/service-status` fails. A warning banner is shown when
 * the health check does not report connected.
 */
export default function MiiddleMicrofrontend({
  path = "/",
  className,
  title = "Miiddle",
}: MiiddleMicrofrontendProps) {
  const fallbackBase = envMiiddleBaseUrl() ?? DEFAULT_MIIDDLE_BASE_URL;
  const [baseUrl, setBaseUrl] = useState(fallbackBase);
  const [healthNote, setHealthNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/miiddle/service-status", {
      credentials: "include",
      signal: AbortSignal.timeout(8000),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: MiiddleServiceStatus) => {
        if (cancelled) return;
        if (d.baseUrl) setBaseUrl(String(d.baseUrl).replace(/\/$/, ""));
        if (!d.connected) {
          setHealthNote(
            d.error?.trim() ||
              "Could not confirm Miiddle health — loading embed from the configured URL. If this stays blank, set VITE_MIIDDLE_BASE_URL or MIIDDLE_BASE_URL and run the Miiddle app (e.g. port 5010).",
          );
        } else {
          setHealthNote(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setHealthNote(
          "Miiddle status check failed — loading embed anyway. Ensure the API server is running (so /api proxies work) and MIIDDLE_BASE_URL is correct.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const src = useMemo(() => joinBaseAndPath(baseUrl, path), [baseUrl, path]);

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {healthNote && (
        <div
          className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100/90"
          role="status"
        >
          {healthNote}
        </div>
      )}
      <div className="w-full h-full min-h-[520px] bg-card rounded-lg overflow-hidden border border-border">
        <iframe
          title={title}
          className="w-full h-[calc(100vh-220px)] md:h-[calc(100vh-240px)] min-h-[480px] border-0"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
        />
      </div>
    </div>
  );
}
