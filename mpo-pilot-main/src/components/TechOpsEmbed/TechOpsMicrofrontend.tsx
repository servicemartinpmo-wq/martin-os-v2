import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TechOpsServiceStatus = {
  connected: boolean;
  status?: string;
  baseUrl?: string;
  error?: string;
};

const DEFAULT_TECH_OPS_BASE_URL = "https://tech-ops.replit.app";

function envTechOpsBaseUrl(): string | undefined {
  const raw = import.meta.env.VITE_TECH_OPS_BASE_URL;
  if (!raw || typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t ? t.replace(/\/$/, "") : undefined;
}

function normalizeTechOpsPath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function joinBaseAndPath(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/$/, "");
  const p = normalizeTechOpsPath(path);
  return `${base}${p}`;
}

export interface TechOpsMicrofrontendProps {
  /**
   * Tech-Ops internal route path (e.g. "/" | "/dashboard" | "/cases").
   * This is mapped to the iframe src by prefixing the resolved base URL.
   */
  path?: string;
  className?: string;
  title?: string;
}

/**
 * Embeds the Tech-Ops app in an iframe. Always loads the embed so users can interact
 * even when `/api/techops/service-status` fails (firewall, remote down, etc.).
 * A warning banner is shown when the health check does not report connected.
 */
export default function TechOpsMicrofrontend({
  path = "/",
  className,
  title = "Tech-Ops",
}: TechOpsMicrofrontendProps) {
  const fallbackBase = envTechOpsBaseUrl() ?? DEFAULT_TECH_OPS_BASE_URL;
  const [baseUrl, setBaseUrl] = useState(fallbackBase);
  const [healthNote, setHealthNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/techops/service-status", {
      credentials: "include",
      signal: AbortSignal.timeout(8000),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: TechOpsServiceStatus) => {
        if (cancelled) return;
        if (d.baseUrl) setBaseUrl(String(d.baseUrl).replace(/\/$/, ""));
        if (!d.connected) {
          setHealthNote(
            d.error?.trim() ||
              "Could not confirm Tech-Ops health — loading embed from the configured URL. If this stays blank, set VITE_TECH_OPS_BASE_URL or TECH_OPS_BASE_URL.",
          );
        } else {
          setHealthNote(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setHealthNote(
          "Tech-Ops status check failed — loading embed anyway. Ensure the API server is running (so /api proxies work) and TECH_OPS_BASE_URL is correct.",
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
