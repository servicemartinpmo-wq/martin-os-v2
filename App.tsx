/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './components/auth/Auth';
import LandingPage from './components/landing/LandingPage';
import AboutPage from './components/landing/pages/AboutPage';
import ContactPage from './components/landing/pages/ContactPage';
import BlogPage from './components/landing/pages/BlogPage';
import DiscoveryCallPage from './components/landing/pages/DiscoveryCallPage';
import Sidebar from './components/layout/Sidebar';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard';
import InitiativesPage from './components/initiatives/InitiativesPage';
import TeamPage from './components/team/TeamPage';
import AdvisoryDesk from './components/advisory/AdvisoryDesk';
import ReportsPage from './components/reports/ReportsPage';
import SystemsPage from './components/systems/SystemsPage';
import TechDashboard from './components/tech-ops/TechDashboard';
import TicketsPage from './components/tech-ops/TicketsPage';
import MiidleFeed from './components/miidle/MiidleFeed';
import WorkGraph from './components/miidle/WorkGraph';
import CreativePortfolio from './components/creative/CreativePortfolio';
import AssistedDashboard from './components/assisted/AssistedDashboard';
import ProjectHub from './components/project/ProjectHub';
import FreelanceHub from './components/freelance/FreelanceHub';
import HealthcareDashboard from './components/healthcare/HealthcareDashboard';
import OfficeDashboard from './components/admin/OfficeDashboard';
import FounderDashboard from './components/founder/FounderDashboard';
import DiagnosticsPage from './components/tech-ops/DiagnosticsPage';
import { Toaster } from 'sonner';
import { AIProvider } from './context/AIContext';
const OSInterface = lazy(() => import('./components/OSInterface'));
const DynamicOSPage = lazy(() => import('./components/DynamicOSPage'));
import ErrorBoundary from './components/shared/ErrorBoundary';
import { apiFetch } from './lib/api';

// New Dashboards
import ExecutiveCommandCenter from './components/dashboard/ExecutiveCommandCenter';
import ApphiaEngineDashboard from './components/shared/ApphiaEngineDashboard';
import InitiativeDashboard from './components/dashboard/InitiativeDashboard';
import OrganizationalMap from './components/dashboard/OrganizationalMap';
import ResourceHub from './components/dashboard/ResourceHub';
import KnowledgeSuperbase from './components/dashboard/KnowledgeSuperbase';
const CoreSystemShell = lazy(() => import('./components/dashboard/CoreSystemShell'));

const IntelligenceAdvisoryLayer = lazy(() => import('./components/shared/IntelligenceAdvisoryLayer'));
const BehavioralEngine = lazy(() => import('./components/BehavioralEngine'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const CompanyIntelligence = lazy(() => import('./components/shared/CompanyIntelligence'));
const ConsultingInABox = lazy(() => import('./components/shared/ConsultingInABox'));
const OneClickDiagnostics = lazy(() => import('./components/shared/OneClickDiagnostics'));
const ProjectWorkManagement = lazy(() => import('./components/shared/ProjectWorkManagement'));
const DecisionMemorySystem = lazy(() => import('./components/shared/DecisionMemorySystem'));
const KPIAnalyticsEngine = lazy(() => import('./components/shared/KPIAnalyticsEngine'));
const WorkflowAutomation = lazy(() => import('./components/shared/WorkflowAutomation'));
const DataOperatingSystem = lazy(() => import('./components/shared/DataOperatingSystem'));
const MarketingIntelligence = lazy(() => import('./components/shared/MarketingIntelligence'));
const AdminControlPanel = lazy(() => import('./components/shared/AdminControlPanel'));
const AssistedOnboarding = lazy(() => import('./components/shared/AssistedOnboarding'));
const PersonalizationEngine = lazy(() => import('./components/shared/PersonalizationEngine'));
const UserEngagementSystem = lazy(() => import('./components/shared/UserEngagementSystem'));
const UniversalConnectivity = lazy(() => import('./components/shared/UniversalConnectivity'));
const ActionItems = lazy(() => import('./components/shared/ActionItems'));
const Preferences = lazy(() => import('./components/shared/Preferences'));
const CRM = lazy(() => import('./components/shared/CRM'));
const Marketing = lazy(() => import('./components/shared/Marketing'));
const LockscreenBanner = lazy(() => import('./components/dashboard/LockscreenBanner'));
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Settings as SettingsIcon, Info, Loader2 } from 'lucide-react';
import { AppMode, AppType, CoreSystemId } from './types';
import { cn } from './lib/utils';

const AIAssistant = lazy(() => import('./components/shared/AIAssistant'));

export default function App() {
  console.log("App.tsx: App component rendering");
  const [session, setSession] = useState<Session | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentApp, setCurrentApp] = useState<AppType>('PMO-OPs');
  const [currentMode, setCurrentMode] = useState<AppMode>('Executive');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dynamicPath, setDynamicPath] = useState<string | null>(null);
  const [showHealthcareDisclaimer, setShowHealthcareDisclaimer] = useState(true);
  const [landingPage, setLandingPage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      console.log("App.tsx: Supabase not configured");
      return;
    }

    console.log("App.tsx: Checking supabase session");
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("App.tsx: Error getting session", error);
      } else {
        console.log("App.tsx: Session retrieved", session);
        setSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("App.tsx: Auth state changed", _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    console.log("App.tsx: Checking onboarding state for session", session);
    if (session?.user) {
      supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("App.tsx: Error checking onboarding state", error);
          } else if (data) {
            console.log("App.tsx: User is onboarded", data);
            setIsOnboarded(true);
          } else {
            console.log("App.tsx: User not found in users table");
          }
        });
    } else {
      console.log("App.tsx: No session user to check onboarding");
    }
  }, [session]);

  // Reset active tab and dynamic path when switching apps
  // Reset active tab when mode or app changes
  useEffect(() => {
    setDynamicPath(null);
    if (currentApp === 'PMO-OPs') {
      setActiveTab('dashboard');
    } else if (currentApp === 'TECH-OPs') {
      setActiveTab('tech-dashboard');
    } else if (currentApp === 'miidle') {
      setActiveTab('feed');
    } else {
      setActiveTab('dashboard');
    }
  }, [currentMode, currentApp]);

  const renderContent = () => {
    console.log("App.tsx: renderContent called", { isOnboarded, currentApp, activeTab });
    if (!isOnboarded) {
      console.log("App.tsx: Rendering OnboardingFlow");
      return <OnboardingFlow onComplete={(data) => {
        console.log("App.tsx: Onboarding complete", data);
        setIsOnboarded(true);
        setCurrentMode(data.mode as AppMode);
      }} />;
    }
    console.log("Rendering Content", { activeTab, currentApp, currentMode, dynamicPath });

    // Handle Dynamic OS Paths
    if (currentApp === 'UnifiedOS' && dynamicPath) {
      return <DynamicOSPage path={dynamicPath} onBack={() => setDynamicPath(null)} />;
    }

    // Shared components mapping for all apps and modes
    const sharedComponents: Record<string, React.ReactNode> = {
      // Main Dashboards
      'executive-command-center': <ExecutiveCommandCenter mode={currentMode} />,
      'apphia-engine': <ApphiaEngineDashboard />,
      'initiative-dashboard': <InitiativeDashboard mode={currentMode} />,
      'organizational-map': <OrganizationalMap mode={currentMode} />,
      'resource-hub': <ResourceHub mode={currentMode} />,
      'knowledge-superbase': <KnowledgeSuperbase mode={currentMode} />,

      // Core Systems (25)
      'strategic-alignment': <CoreSystemShell systemId="strategic-alignment" mode={currentMode} />,
      'initiative-health': <CoreSystemShell systemId="initiative-health" mode={currentMode} />,
      'execution-discipline': <CoreSystemShell systemId="execution-discipline" mode={currentMode} />,
      'dependency-intelligence': <CoreSystemShell systemId="dependency-intelligence" mode={currentMode} />,
      'org-capacity': <CoreSystemShell systemId="org-capacity" mode={currentMode} />,
      'bottleneck-detection': <CoreSystemShell systemId="bottleneck-detection" mode={currentMode} />,
      'risk-escalation': <CoreSystemShell systemId="risk-escalation" mode={currentMode} />,
      'portfolio-optimization': <CoreSystemShell systemId="portfolio-optimization" mode={currentMode} />,
      'org-health-scoring': <CoreSystemShell systemId="org-health-scoring" mode={currentMode} />,
      'process-improvement': <CoreSystemShell systemId="process-improvement" mode={currentMode} />,
      'strategic-risk-forecasting': <CoreSystemShell systemId="strategic-risk-forecasting" mode={currentMode} />,
      'resource-allocation': <CoreSystemShell systemId="resource-allocation" mode={currentMode} />,
      'leadership-bandwidth': <CoreSystemShell systemId="leadership-bandwidth" mode={currentMode} />,
      'cross-dept-coordination': <CoreSystemShell systemId="cross-dept-coordination" mode={currentMode} />,
      'execution-velocity': <CoreSystemShell systemId="execution-velocity" mode={currentMode} />,
      'opportunity-detection': <CoreSystemShell systemId="opportunity-detection" mode={currentMode} />,
      'decision-support': <CoreSystemShell systemId="decision-support" mode={currentMode} />,
      'initiative-recovery': <CoreSystemShell systemId="initiative-recovery" mode={currentMode} />,
      'strategic-planning': <CoreSystemShell systemId="strategic-planning" mode={currentMode} />,
      'innovation-pipeline': <CoreSystemShell systemId="innovation-pipeline" mode={currentMode} />,
      'change-management': <CoreSystemShell systemId="change-management" mode={currentMode} />,
      'performance-benchmarking': <CoreSystemShell systemId="performance-benchmarking" mode={currentMode} />,
      'knowledge-intelligence': <CoreSystemShell systemId="knowledge-intelligence" mode={currentMode} />,
      'predictive-analytics': <CoreSystemShell systemId="predictive-analytics" mode={currentMode} />,
      'executive-insight': <CoreSystemShell systemId="executive-insight" mode={currentMode} />,
      'admin': <AdminDashboard />,

      // Legacy/Shared
      'intelligence-advisory': <IntelligenceAdvisoryLayer mode={currentMode} workspaceId="default-workspace" />,
      'company-intel': <CompanyIntelligence mode={currentMode} />,
      'consulting': <ConsultingInABox mode={currentMode} />,
      'diagnostics': <OneClickDiagnostics mode={currentMode} />,
      'project-mgmt': <ProjectWorkManagement mode={currentMode} />,
      'decision-mem': <DecisionMemorySystem mode={currentMode} />,
      'kpi-analytics': <KPIAnalyticsEngine mode={currentMode} />,
      'automation': <WorkflowAutomation mode={currentMode} />,
      'data-os': <DataOperatingSystem mode={currentMode} />,
      'marketing': <MarketingIntelligence mode={currentMode} />,
      'admin-control': <AdminControlPanel mode={currentMode} />,
      'onboarding': <AssistedOnboarding mode={currentMode} />,
      'personalization': <PersonalizationEngine mode={currentMode} />,
      'engagement': <UserEngagementSystem mode={currentMode} />,
      'connectivity': <UniversalConnectivity mode={currentMode} />,
      'preferences': <Preferences />,
      'crm': <CRM />,
      'marketing-hub': <Marketing />,
      'actions': <ActionItems mode={currentMode} app={currentApp} />,
    };

    // If the active tab is a shared component, render it
    if (sharedComponents[activeTab]) {
      return <div className="p-8">{sharedComponents[activeTab]}</div>;
    }

    // If TECH-OPs is selected
    if (currentApp === 'TECH-OPs') {
      switch (activeTab) {
        case 'tech-dashboard': return <TechDashboard mode={currentMode} />;
        case 'diagnostics': return <DiagnosticsPage mode={currentMode} />;
        case 'tickets': return <TicketsPage mode={currentMode} />;
        case 'settings': return <SystemsPage mode={currentMode} />;
        default: return <TechDashboard mode={currentMode} />;
      }
    }

    // If UnifiedOS is selected
    if (currentApp === 'UnifiedOS') {
      return <OSInterface />;
    }

    if (currentApp === 'miidle') {
      switch (activeTab) {
        case 'feed': return <MiidleFeed mode={currentMode} />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'graph': return <WorkGraph />;
        case 'settings': return <SystemsPage mode={currentMode} />;
        default: return <MiidleFeed mode={currentMode} />;
      }
    }

    // PMO-OPs (Default) - Uses the 8 modes
    if (currentMode === 'Founder/SMB') {
      switch (activeTab) {
        case 'dashboard': return <FounderDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'team': return <TeamPage />;
        case 'reports': return <ReportsPage />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Executive Tabs
    if (currentMode === 'Executive') {
      switch (activeTab) {
        case 'dashboard': return <ExecutiveDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'reporting': return <ReportsPage />;
        case 'team-mgmt': return <TeamPage />;
        case 'strategy': return <InitiativesPage />;
        case 'advisory': return <AdvisoryDesk />;
        case 'behavior': return <BehavioralEngine />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Startup/Project Tabs
    if (currentMode === 'Startup/Project') {
      switch (activeTab) {
        case 'dashboard': return <ProjectHub />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'team': return <TeamPage />;
        case 'reporting': return <ReportsPage />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Admin/Office Tabs
    if (currentMode === 'Admin/Office') {
      switch (activeTab) {
        case 'dashboard': return <OfficeDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'team': return <TeamPage />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Freelance Tabs
    if (currentMode === 'Freelance') {
      switch (activeTab) {
        case 'dashboard': return <FreelanceHub />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Creative Tabs
    if (currentMode === 'Creative') {
      switch (activeTab) {
        case 'dashboard': return <CreativePortfolio />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'projections': return <ReportsPage />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Healthcare Tabs
    if (currentMode === 'Healthcare') {
      switch (activeTab) {
        case 'dashboard': return <HealthcareDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Assisted Tabs
    if (currentMode === 'Assisted') {
      switch (activeTab) {
        case 'dashboard': return <AssistedDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold">?</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
        <p className="max-w-xs mt-2">The {activeTab} module is currently being optimized by the Apphia engine.</p>
      </div>
    );
  };

  const handleWorkflowTrigger = async (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const trigger = target.closest('[data-workflow]') as HTMLElement;
    if (!trigger) return;

    const workflowType = trigger.dataset.workflow;
    
    // High-performance trigger logic
    console.log(`Executing Workflow: ${workflowType}`);
    
    // Add an "Optimistic" visual feedback immediately
    trigger.classList.add('scale-95', 'opacity-50');
    setTimeout(() => trigger.classList.remove('scale-95', 'opacity-50'), 150);

    try {
      const data = await apiFetch('/api/workflow/trigger', {
        method: 'POST',
        body: JSON.stringify({ action: workflowType, payload: {} })
      });
      console.log('Workflow result:', data);
    } catch (error) {
      console.error('Workflow execution failed:', error);
    }
  };

  return (
    <AIProvider>
      <Toaster position="top-right" richColors theme="dark" />
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#010409]"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>}>
          {!session ? (
            <div className="relative min-h-screen">
              {landingPage === 'product' ? (
              <div className="min-h-screen bg-[#010409] text-white p-20">
                <button onClick={() => setLandingPage(null)} className="mb-4 text-slate-400 hover:text-white">← Back</button>
                <h1 className="text-4xl font-bold mb-6">Product</h1>
                <p className="text-slate-400">Our product is designed for leaders to act with confidence.</p>
              </div>
            ) : landingPage === 'pricing' ? (
              <div className="min-h-screen bg-[#010409] text-white p-20">
                <button onClick={() => setLandingPage(null)} className="mb-4 text-slate-400 hover:text-white">← Back</button>
                <h1 className="text-4xl font-bold mb-6">Pricing</h1>
                <p className="text-slate-400">Choose the plan that fits your leadership needs.</p>
              </div>
            ) : landingPage === 'about' ? (
              <AboutPage />
            ) : landingPage === 'contact' ? (
              <ContactPage />
            ) : landingPage === 'blog' ? (
              <BlogPage />
            ) : landingPage === 'discovery' ? (
              <DiscoveryCallPage />
            ) : landingPage === 'signin' ? (
              <div className="min-h-screen bg-[#010409] text-white p-20 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <button onClick={() => setLandingPage(null)} className="mb-4 text-slate-400 hover:text-white">← Back</button>
                  <Auth 
                    onSignInSuccess={() => setLandingPage(null)} 
                    onSignUpSuccess={() => setLandingPage(null)} 
                  />
                </div>
              </div>
            ) : (
              <LandingPage 
                onInitialize={() => {
                  setIsOnboarded(false);
                  setLandingPage(null);
                }} 
                onExplore={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} 
                onNavigate={(page) => setLandingPage(page)}
              />
            )}
          </div>
        ) : (
          <div onClick={handleWorkflowTrigger} className={cn(
            "flex h-screen bg-white font-sans text-black overflow-hidden",
            currentMode === 'Assisted' && "text-lg"
          )}>
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              currentMode={currentMode} 
              setMode={setCurrentMode} 
              currentApp={currentApp}
              setApp={setCurrentApp}
            />
            
            <main className="flex-1 overflow-y-auto bg-white relative">
              {currentMode === 'Healthcare' && showHealthcareDisclaimer && (
                <div className="sticky top-14 z-30 bg-amber-50 border-b border-amber-200 px-8 py-2 flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-3 text-amber-800">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <p className="text-[10px] font-bold tracking-widest uppercase">
                      <span className="font-black">REGULATORY DISCLAIMER:</span> This interface is for administrative and operational oversight only. Clinical decisions must be made by licensed professionals. All data is HIPAA-compliant and encrypted.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowHealthcareDisclaimer(false)}
                    className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest px-2">Dismiss</span>
                  </button>
                </div>
              )}
              {/* Top Bar / Global Alerts */}
              <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace:</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-tighter">Martin-OS</span>
                  <div className="h-3 w-[1px] bg-slate-200 mx-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-tighter",
                    "bg-green-50 text-green-600 border-green-100"
                  )}>
                    Optimized
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentMode}-${activeTab}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>
            <Suspense fallback={null}>
              <AIAssistant />
            </Suspense>
          </div>
        )}
        </Suspense>
      </ErrorBoundary>
    </AIProvider>
  );
}

