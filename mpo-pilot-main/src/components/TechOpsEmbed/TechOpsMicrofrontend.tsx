import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TechOpsServiceStatus = {
  connected: boolean;
  status?: string;
  baseUrl?: string;
  error?: string;
};

const DEFAULT_TECH_OPS_BASE_URL = "https://tech-ops.replit.app";
const TECH_OPS_STATUS_TTL_MS = 60_000;

// Cache the service status for the lifetime of the SPA tab.
// This avoids repeated roundtrips on re-renders/navigation.
let cachedStatus: TechOpsServiceStatus | null = null;
let cachedStatusExpiresAt = 0;

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
   * This is mapped to the iframe src by prefixing `TECH_OPS_BASE_URL`.
   */
  path?: string;
  className?: string;
  title?: string;
}

export default function TechOpsMicrofrontend({
  path = "/",
  className,
  title = "Tech-Ops",
}: TechOpsMicrofrontendProps) {
  const [status, setStatus] = useState<TechOpsServiceStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    const now = Date.now();
    if (cachedStatus && now < cachedStatusExpiresAt) {
      setStatus(cachedStatus);
      return;
    }

    fetch("/api/techops/service-status", { signal: AbortSignal.timeout(5000) })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const next = d as TechOpsServiceStatus;
        cachedStatus = next;
        cachedStatusExpiresAt = Date.now() + TECH_OPS_STATUS_TTL_MS;
        setStatus(next);
      })
      .catch(() => {
        if (cancelled) return;
        const next = { connected: false } satisfies TechOpsServiceStatus;
        cachedStatus = next;
        cachedStatusExpiresAt = Date.now() + TECH_OPS_STATUS_TTL_MS;
        setStatus(next);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const src = useMemo(() => {
    const baseUrl = status?.baseUrl ?? DEFAULT_TECH_OPS_BASE_URL;
    return joinBaseAndPath(baseUrl, path);
  }, [path, status]);

  if (status === null) {
    return (
      <div
        className={cn(
          "w-full min-h-[520px] flex items-center justify-center bg-[#0d1117] border border-white/10 rounded-lg",
          className
        )}
      >
        <div className="flex flex-col items-center gap-3 p-8">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-white/60">Loading {title}…</div>
        </div>
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div
        className={cn(
          "w-full min-h-[520px] flex items-center justify-center bg-[#0d1117] border border-red-500/20 rounded-lg",
          className
        )}
      >
        <div className="text-center p-8">
          <div className="text-xs font-semibold text-red-200">Tech-Ops is offline</div>
          <div className="text-xs text-white/50 mt-2">
            Please check the Tech-Ops service URL and ensure it’s reachable.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full min-h-[520px] bg-[#0d1117] rounded-lg overflow-hidden", className)}>
      <iframe
        title={title}
        className="w-full h-[calc(100vh-220px)] md:h-[calc(100vh-240px)] border-0"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
      />
    </div>
  );
}

