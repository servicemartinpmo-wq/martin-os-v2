import { Link } from "react-router-dom";
import {
  ENGINE_LOOP,
  ORG_DIMENSIONS_15,
  MASTERLIST_MODULES,
  META_SYSTEMS,
} from "@/lib/martinOsMasterlist";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, Cpu } from "lucide-react";
import OrgPulseCheckIn from "@/components/OrgPulseCheckIn";
import BrainConsole from "@/components/BrainConsole";

const REF_IMAGES = [
  { src: "/engine/pulse-mood.png", alt: "Pulse check-in reference", caption: "Engagement & pulse UX" },
  { src: "/engine/split-hero-ref.png", alt: "Split hero reference", caption: "High-contrast storytelling" },
  { src: "/engine/analytics-ref.png", alt: "Analytics dashboard reference", caption: "Executive analytics density" },
  { src: "/engine/soft-dashboard-ref.png", alt: "Soft UI dashboard reference", caption: "Card-based intelligence grid" },
] as const;

export default function ApphiaEngine() {
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Split hero — configurator-style */}
      <section className="relative overflow-hidden rounded-b-3xl martin-split-hero">
        <div className="grid lg:grid-cols-2 min-h-[320px] lg:min-h-[380px]">
          <div
            className="flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-14"
            style={{ background: "linear-gradient(180deg, hsl(220 14% 97%) 0%, hsl(220 12% 94%) 100%)" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 w-fit"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
              <Cpu className="w-3 h-3" />
              Feature Masterlist · Martin OS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[0.95]">
              <span className="text-rose">APP</span>
              <span className="text-foreground">HIA</span>
            </h1>
            <p className="mt-2 text-lg font-black tracking-tight text-foreground/90">
              ENGINE
            </p>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              AI-powered enterprise decision system: data → signals → diagnosis → action → learning.
              Dashboards and workflows are modules inside that closed loop.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/diagnostics"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-xs font-bold uppercase tracking-wide hover:opacity-90"
              >
                Run diagnostics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground hover:bg-muted/50"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                Command center
              </Link>
            </div>
          </div>
          <div
            className="relative flex flex-col justify-center px-6 py-10 lg:px-12 text-white"
            style={{
              background: "linear-gradient(165deg, hsl(12 85% 52%) 0%, hsl(28 92% 48%) 45%, hsl(38 90% 42%) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none martin-geo-pattern" aria-hidden />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 relative z-10">
              Configure your operating system
            </p>
            <p className="mt-3 text-2xl sm:text-3xl font-black leading-tight max-w-sm relative z-10">
              Not a PM tool. Not a dashboard alone.
            </p>
            <p className="mt-3 text-sm text-white/85 max-w-md leading-relaxed relative z-10">
              Real-time consulting platform and company intelligence OS — proprietary graph, decision memory,
              and a connector fabric aimed at the major apps and platforms across industries (productivity, CRM, ERP, HR, finance, devops, healthcare, commerce).
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 space-y-12 mt-12">
        {/* Integration posture */}
        <section className="rounded-2xl border p-5 martin-soft-card" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Integration fabric
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            The engine is designed to normalize data from the tools teams already run — not to replace every system, but to read, route, and act across them.
            Use{" "}
            <Link to="/integrations" className="font-semibold text-primary hover:underline">
              Integrations
            </Link>{" "}
            to connect suites and request new connectors as your stack evolves.
          </p>
        </section>

        {/* Visual direction */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Visual direction (references)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REF_IMAGES.map((img) => (
              <figure key={img.src} className="showroom-plinth m-0">
                <div className="showroom-plinth-inner">
                  <div className="aspect-[4/3] bg-muted/40 relative">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover object-top"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="px-3 py-2 text-[11px] font-medium text-muted-foreground border-t bg-card"
                    style={{ borderColor: "hsl(var(--border))" }}>
                    {img.caption}
                    <span className="block text-[10px] text-muted-foreground/80 mt-1">
                      Production: 4K stills or 50–60fps WebM in a laminated showroom frame.
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>

        {/* Engine loop */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Closed loop
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {ENGINE_LOOP.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                <div
                  className="rounded-xl border px-4 py-3 max-w-[200px] martin-soft-card"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-rose">{step.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{step.desc}</p>
                </div>
                {i < ENGINE_LOOP.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Modules → routes */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Masterlist modules
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {MASTERLIST_MODULES.map((m) => (
              <Link
                key={m.title}
                to={m.href}
                className={cn(
                  "group rounded-2xl border p-4 flex flex-col gap-2 transition-all hover:border-primary/30 hover:shadow-elevated martin-soft-card"
                )}
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-foreground">{m.title}</span>
                  {m.tag && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {m.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{m.summary}</p>
                <span className="text-[10px] font-bold uppercase tracking-wide text-primary flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 15D grid */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Full org intelligence (15 dimensions)
          </h2>
          <p className="text-xs text-muted-foreground mb-4 max-w-2xl">
            Expanded diagnostic model from the masterlist. Each tile links to the closest live surface in PMO-Ops today.
          </p>
          <div className="flex flex-wrap gap-2">
            {ORG_DIMENSIONS_15.map((d) => (
              <Link
                key={d.id}
                to={d.href}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border hover:bg-muted/60 transition-colors"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Meta systems */}
        <section className="grid lg:grid-cols-3 gap-4">
          {META_SYSTEMS.map((sys) => (
            <div
              key={sys.name}
              className="rounded-2xl border p-5 martin-soft-card"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <h3 className="text-sm font-bold text-foreground mb-3">{sys.name}</h3>
              <ul className="space-y-2">
                {sys.points.map((p) => (
                  <li key={p} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-rose font-bold flex-shrink-0">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Live pulse widget */}
        <section className="max-w-md">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Try the pulse pattern
          </h2>
          <OrgPulseCheckIn />
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Apphia engine input/output
          </h2>
          <BrainConsole
            title="Run Apphia Engine"
            placeholder="Example: My API is returning 500 errors after deployment. Diagnose and propose next actions."
            adminOnlyTechnicalDetails
          />
        </section>
      </div>
    </div>
  );
}
