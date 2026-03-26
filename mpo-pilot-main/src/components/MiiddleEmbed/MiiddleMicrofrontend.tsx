import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type MiiddleServiceStatus = {
  connected: boolean;
  status?: string;
  baseUrl?: string;
  error?: string;
};

const DEFAULT_MIIDDLE_BASE_URL = import.meta.env.VITE_MIIDDLE_BASE_URL || "http://localhost:5010";
const MIIDDLE_STATUS_TTL_MS = 60_000;

let cachedStatus: MiiddleServiceStatus | null = null;
let cachedStatusExpiresAt = 0;

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
  /** Miiddle internal route (e.g. "/" | "/dashboard"). */
  path?: string;
  className?: string;
  title?: string;
}

export default function MiiddleMicrofrontend({
  path = "/",
  className,
  title = "Miiddle",
}: MiiddleMicrofrontendProps) {
  const [status, setStatus] = useState<MiiddleServiceStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    const now = Date.now();
    if (cachedStatus && now < cachedStatusExpiresAt) {
      setStatus(cachedStatus);
      return;
    }

    fetch("/api/miiddle/service-status", { signal: AbortSignal.timeout(5000) })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const next = d as MiiddleServiceStatus;
        cachedStatus = next;
        cachedStatusExpiresAt = Date.now() + MIIDDLE_STATUS_TTL_MS;
        setStatus(next);
      })
      .catch(() => {
        if (cancelled) return;
        const next = { connected: false } satisfies MiiddleServiceStatus;
        cachedStatus = next;
        cachedStatusExpiresAt = Date.now() + MIIDDLE_STATUS_TTL_MS;
        setStatus(next);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const src = useMemo(() => {
    const baseUrl = status?.baseUrl ?? DEFAULT_MIIDDLE_BASE_URL;
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
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
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
          <div className="text-xs font-semibold text-red-200">Miiddle is offline</div>
          <div className="text-xs text-white/50 mt-2">
            Run the Miiddle dev server (port 5010) or set MIIDDLE_BASE_URL / VITE_MIIDDLE_BASE_URL to your deploy URL.
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
