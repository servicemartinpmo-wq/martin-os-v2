import pmoAppIcon from "@/assets/pmo-logo-ops.png";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import AppLayout from "./components/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import VoiceCommand from "./components/VoiceCommand";
import ApphiaPanel from "./components/ApphiaPanel";
import FeedbackPopup from "./components/FeedbackPopup";
import CommandPalette from "./components/CommandPalette";
import TopStatusBar from "./components/TopStatusBar";
import OnboardingWizard from "./components/OnboardingWizard";
import CollaboratorView from "./pages/CollaboratorView";
import AuthPage from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { useAuth } from "./hooks/useAuth";
import { applyAccentColor, applyFont, applyDensity, applyFontSize, saveProfile, loadProfile, isDemoMode, DEMO_PROFILE } from "./lib/companyStore";
import { seedUserData } from "./lib/supabaseDataService";
import { useRealtimeSync } from "./hooks/useLiveData";
import type { CompanyProfile } from "./lib/companyStore";

const Index = lazy(() => import("./pages/Index"));
const Initiatives = lazy(() => import("./pages/Initiatives"));
const Diagnostics = lazy(() => import("./pages/Diagnostics"));
const Departments = lazy(() => import("./pages/Departments"));
const Reports = lazy(() => import("./pages/Reports"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ActionItems = lazy(() => import("./pages/ActionItems"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Workflows = lazy(() => import("./pages/Workflows"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Advisory = lazy(() => import("./pages/Advisory"));
const Team = lazy(() => import("./pages/Team"));
const Members = lazy(() => import("./pages/Members"));
const CreatorLab = lazy(() => import("./pages/CreatorLab"));
const Projects = lazy(() => import("./pages/Projects"));
const Decisions = lazy(() => import("./pages/Decisions"));
const Pricing = lazy(() => import("./pages/Pricing"));
const CRM = lazy(() => import("./pages/CRM"));
const Agile = lazy(() => import("./pages/Agile"));
const Marketing = lazy(() => import("./pages/Marketing"));
const GraphView = lazy(() => import("./pages/GraphView"));
const FallbackMode = lazy(() => import("./pages/FallbackMode"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Meetings = lazy(() => import("./pages/Meetings"));
const Compliance = lazy(() => import("./pages/Compliance"));
const TechOpsAddOn = lazy(() => import("./pages/TechOpsAddOn"));
const MiiddleAddOn = lazy(() => import("./pages/MiiddleAddOn"));
const MigrateHub = lazy(() => import("./pages/MigrateHub"));
const NoteTaker = lazy(() => import("./pages/NoteTaker"));

function RouteFallback() {
  return (
    <div className="w-full min-h-[320px] flex items-center justify-center text-sm text-muted-foreground">
      Loading page...
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function AppRoutes() {
  const { user, profile, loading, updateProfile } = useAuth();
  const [seeded, setSeeded] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  useRealtimeSync(user?.id);

  // Apply theme from DB profile whenever it changes.
  // In demo mode, fall back to the locally-stored demo profile for theme.
  useEffect(() => {
    if (profile) {
      applyAccentColor(profile.accentHue ?? 210);
      applyFont((profile.font as "inter" | "mono" | "rounded") ?? "inter");
      applyDensity((profile.density as "compact" | "comfortable" | "spacious") ?? "comfortable");
      applyFontSize((profile.fontSize as "small" | "medium" | "large") ?? "medium");
    } else if (isDemoMode()) {
      const local = loadProfile();
      applyAccentColor(local.accentHue ?? 215);
      applyFont(local.font ?? "inter");
      applyDensity(local.density ?? "comfortable");
      applyFontSize(local.fontSize ?? "medium");
    }
  }, [profile]);

  // Seed initial pmoData for new users after onboarding
  useEffect(() => {
    if (user && profile?.onboardingComplete && !seeded) {
      setSeeded(true);
      seedUserData(user.id).catch(console.error);
    }
  }, [user, profile?.onboardingComplete, seeded]);

  if (loading && !isDemoMode()) {
    return (
      <div className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0c1117" }}>
        <div className="flex flex-col items-center gap-4">
          <img src="/pmo-logo-ops.png" alt="PMO-Ops"
            className="w-24 h-24 rounded-3xl object-contain"
            style={{ boxShadow: "0 0 48px rgba(59,130,246,0.35)" }} />
          <div className="w-7 h-7 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(59,130,246,0.18)", borderTopColor: "#3b82f6" }} />
        </div>
      </div>
    );
  }

  // Collaborator portal — always accessible without sign-in
  if (window.location.pathname.startsWith("/collab/")) {
    return (
      <Routes>
        <Route path="/collab/:token" element={<CollaboratorView />} />
      </Routes>
    );
  }

  // Not logged in — redirect to auth unless demo mode is active
  if (!user && !isDemoMode()) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Read local profile once — used both to gate onboarding and as a null-safe fallback.
  const localProfile = loadProfile();

  // Show onboarding only when DB profile is incomplete AND local storage also says not done.
  // This prevents re-triggering onboarding for existing users when DB is slow.
  if (!onboardingDone && (!profile || !profile.onboardingComplete) && !localProfile.onboardingComplete) {
    const handleOnboardingComplete = (p: CompanyProfile) => {
      saveProfile(p);
      setOnboardingDone(true); // immediately navigate to the app
      updateProfile({
        userName: p.userName,
        orgName: p.orgName,
        orgType: p.orgType,
        industry: p.industry,
        teamSize: p.teamSize,
        revenueRange: p.revenueRange,
        currentState: p.currentState,
        futureState: p.futureState,
        departments: p.departments,
        hasSops: p.hasSops,
        accentHue: p.accentHue,
        font: p.font,
        density: p.density,
        onboardingComplete: true,
      }).catch(console.error);
    };
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // profile may still be null for a moment after onboardingDone fires (async DB write).
  // Use the locally-saved profile from companyStore as a reliable fallback.
  const profileSource = profile ?? localProfile;

  const legacyProfile: CompanyProfile = {
    userName:          profileSource.userName ?? "",
    orgName:           profileSource.orgName ?? "",
    orgType:           profileSource.orgType ?? "",
    industry:          profileSource.industry ?? "",
    teamSize:          profileSource.teamSize ?? "",
    revenueRange:      profileSource.revenueRange ?? "",
    currentState:      profileSource.currentState ?? "",
    futureState:       profileSource.futureState ?? "",
    departments:       profileSource.departments ?? [],
    hasSops:           profileSource.hasSops ?? false,
    accentHue:         profileSource.accentHue ?? 210,
    font:              (profileSource.font as "inter" | "mono" | "rounded") ?? "inter",
    density:           (profileSource.density as "compact" | "comfortable" | "spacious") ?? "comfortable",
    analyticsEnabled:  true,
    onboardingComplete: profileSource.onboardingComplete ?? false,
  };
  const withFallback = (node: ReactNode) => (
    <Suspense fallback={<RouteFallback />}>{node}</Suspense>
  );

  return (
    <>
      <TopStatusBar onOpenCommandPalette={openCmd} />
      <CommandPalette open={cmdOpen} onClose={closeCmd} />
      <Routes>
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/*" element={
        <AppLayout profile={legacyProfile} onProfileUpdate={async (p) => {
          saveProfile(p);
          await updateProfile({
            accentHue: p.accentHue,
            font: p.font,
            density: p.density,
          });
        }}>
          <Routes>
            <Route path="/" element={withFallback(<Index />)} />
            <Route path="/initiatives" element={withFallback(<Initiatives />)} />
            <Route path="/diagnostics" element={withFallback(<Diagnostics />)} />
            <Route path="/departments" element={withFallback(<Departments />)} />
            <Route path="/reports" element={withFallback(<Reports />)} />
            <Route path="/action-items" element={withFallback(<ActionItems />)} />
            <Route path="/knowledge" element={withFallback(<Knowledge />)} />
            <Route path="/workflows" element={withFallback(<Workflows />)} />
            <Route path="/integrations" element={withFallback(<Integrations />)} />
            <Route path="/advisory" element={withFallback(<Advisory />)} />
            <Route path="/team" element={withFallback(<Team />)} />
            <Route path="/members" element={withFallback(<Members />)} />
            <Route path="/organizations/:id/members" element={withFallback(<Members />)} />
            <Route path="/admin" element={withFallback(<Admin />)} />
            <Route path="/creator-panel" element={withFallback(<CreatorLab />)} />
            <Route path="/projects" element={withFallback(<Projects />)} />
            <Route path="/decisions" element={withFallback(<Decisions />)} />
            <Route path="/pricing" element={withFallback(<Pricing />)} />
            <Route path="/crm" element={withFallback(<CRM />)} />
            <Route path="/agile" element={withFallback(<Agile />)} />
            <Route path="/marketing" element={withFallback(<Marketing />)} />
            <Route path="/graph" element={withFallback(<GraphView />)} />
            <Route path="/fallback" element={withFallback(<FallbackMode />)} />
            <Route path="/expenses" element={withFallback(<Expenses />)} />
            <Route path="/meetings" element={withFallback(<Meetings />)} />
            <Route path="/compliance" element={withFallback(<Compliance />)} />
            <Route path="/tech-ops/*" element={withFallback(<TechOpsAddOn />)} />
            <Route path="/miiddle/*" element={withFallback(<MiiddleAddOn />)} />
            <Route path="/migrate" element={withFallback(<MigrateHub />)} />
            <Route path="/migrate-hub" element={withFallback(<MigrateHub />)} />
            <Route path="/note-taker" element={withFallback(<NoteTaker />)} />
            <Route path="/engine" element={<Navigate to="/tech-ops" replace />} />
            <Route path="*" element={withFallback(<NotFound />)} />
          </Routes>
        </AppLayout>
      } />
    </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="bottom-right" />
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
          <ApphiaPanel />
          <VoiceCommand />
          <FeedbackPopup />
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
