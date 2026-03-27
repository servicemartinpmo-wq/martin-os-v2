import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";

const MiiddleMicrofrontend = lazy(() =>
  import("@/components/MiiddleEmbed/MiiddleMicrofrontend")
);

export default function MiiddleAddOn() {
  const { pathname } = useLocation();

  const relative = pathname.replace(/^\/miiddle\/?/, "");
  const microPath = relative ? `/${relative}` : "/dashboard";

  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full min-h-[520px] flex items-center justify-center border rounded-lg bg-card">
            <div className="text-xs text-muted-foreground">Loading Miiddle…</div>
          </div>
        }
      >
        <MiiddleMicrofrontend path={microPath} title="Miiddle Add-on" />
      </Suspense>
    </div>
  );
}
