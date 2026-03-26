import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import BrainConsole from "@/components/BrainConsole";
import { AlertTriangle, Bug, Clock3, Wrench } from "lucide-react";

const TechOpsMicrofrontend = lazy(() =>
  import("@/components/TechOpsEmbed/TechOpsMicrofrontend")
);

export default function TechOpsAddOn() {
  const { pathname } = useLocation();

  // Host route is `/tech-ops/*`, but the embedded Tech-Ops UI expects paths like `/dashboard`, `/cases`, etc.
  const relative = pathname.replace(/^\/tech-ops\/?/, "");
  const microPath = relative ? `/${relative}` : "/dashboard";

  return (
    <div className="w-full h-full space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <section className="xl:col-span-3 rounded-2xl border bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Active Incidents</h3>
          {[
            { title: "API 500 errors", sev: "High", age: "12m", icon: AlertTriangle },
            { title: "Spike in timeout rate", sev: "Medium", age: "26m", icon: Clock3 },
            { title: "Failed auth callbacks", sev: "Low", age: "48m", icon: Bug },
          ].map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.title} className="rounded-xl border p-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm font-semibold">{i.title}</p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{i.sev} severity • {i.age} ago</p>
              </div>
            );
          })}
        </section>

        <section className="xl:col-span-6">
          <BrainConsole
            title="Tech-Ops Troubleshooting Console"
            placeholder="Describe the incident in plain language. Example: Customers see 500 errors when submitting checkout."
            adminOnlyTechnicalDetails
          />
        </section>

        <section className="xl:col-span-3 rounded-2xl border bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Operator Playbook</h3>
          {[
            "Capture logs for last 15 minutes",
            "Check recent deploys and config changes",
            "Correlate spike timing with external dependencies",
            "Create/attach incident ticket and route owner",
          ].map((step, idx) => (
            <div key={step} className="flex items-start gap-2 rounded-xl border p-3">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
              <p className="text-sm">{step}</p>
            </div>
          ))}
          <div className="rounded-xl border p-3 text-xs text-muted-foreground flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5" />
            Actions run only from allowlisted tools for safety.
          </div>
        </section>
      </div>
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

