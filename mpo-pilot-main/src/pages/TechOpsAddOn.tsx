import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";

const TechOpsMicrofrontend = lazy(() =>
  import("@/components/TechOpsEmbed/TechOpsMicrofrontend")
);

export default function TechOpsAddOn() {
  const { pathname } = useLocation();

  // Host route is `/tech-ops/*`, but the embedded Tech-Ops UI expects paths like `/dashboard`, `/cases`, etc.
  const relative = pathname.replace(/^\/tech-ops\/?/, "");
  const microPath = relative ? `/${relative}` : "/dashboard";

  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full min-h-[520px] flex items-center justify-center bg-[#0d1117] border border-white/10 rounded-lg">
            <div className="text-xs text-white/60">Loading Tech-Ops…</div>
          </div>
        }
      >
        <TechOpsMicrofrontend path={microPath} title="Tech-Ops Add-on" />
      </Suspense>
    </div>
  );
}

