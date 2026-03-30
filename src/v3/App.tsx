/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
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
import ErrorBoundary from './components/shared/ErrorBoundary';

// New Dashboards
import ExecutiveCommandCenter from './components/dashboard/ExecutiveCommandCenter';
import InitiativeDashboard from './components/dashboard/InitiativeDashboard';
import OrganizationalMap from './components/dashboard/OrganizationalMap';
import ResourceHub from './components/dashboard/ResourceHub';
import KnowledgeSuperbase from './components/dashboard/KnowledgeSuperbase';
import CoreSystemShell from './components/dashboard/CoreSystemShell';

import IntelligenceAdvisoryLayer from './components/shared/IntelligenceAdvisoryLayer';
import CompanyIntelligence from './components/shared/CompanyIntelligence';
import ConsultingInABox from './components/shared/ConsultingInABox';
import OneClickDiagnostics from './components/shared/OneClickDiagnostics';
import ProjectWorkManagement from './components/shared/ProjectWorkManagement';
import DecisionMemorySystem from './components/shared/DecisionMemorySystem';
import KPIAnalyticsEngine from './components/shared/KPIAnalyticsEngine';
import WorkflowAutomation from './components/shared/WorkflowAutomation';
import DataOperatingSystem from './components/shared/DataOperatingSystem';
import MarketingIntelligence from './components/shared/MarketingIntelligence';
import AdminControlPanel from './components/shared/AdminControlPanel';
import AssistedOnboarding from './components/shared/AssistedOnboarding';
import PersonalizationEngine from './components/shared/PersonalizationEngine';
import UserEngagementSystem from './components/shared/UserEngagementSystem';
import UniversalConnectivity from './components/shared/UniversalConnectivity';
import ActionItems from './components/shared/ActionItems';
import Preferences from './components/shared/Preferences';
import CRM from './components/shared/CRM';
import Marketing from './components/shared/Marketing';
import LockscreenBanner from './components/dashboard/LockscreenBanner';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Settings as SettingsIcon } from 'lucide-react';
import { AppMode, AppType, CoreSystemId } from './types';
import { cn } from './lib/utils';
import { V3NavProvider } from './context/V3NavContext';

export default function App() {
  const [currentApp, setCurrentApp] = useState<AppType>('PMO-OPs');
  const [currentMode, setCurrentMode] = useState<AppMode>('Executive');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showHealthcareDisclaimer, setShowHealthcareDisclaimer] = useState(true);

  // Reset active tab when switching apps
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentApp]);

  // Reset active tab when mode or app changes
  useEffect(() => {
    if (currentApp === 'PMO-OPs') {
      setActiveTab('dashboard');
    } else if (currentApp === 'TECH-OPs') {
      setActiveTab('tech-dashboard');
    } else if (currentApp === 'miidle') {
      setActiveTab('feed');
    }
  }, [currentMode, currentApp]);

  const renderContent = () => {
    // Shared components mapping for all apps and modes
    const sharedComponents: Record<string, React.ReactNode> = {
      // Main Dashboards
      'executive-command-center': <ExecutiveCommandCenter mode={currentMode} />,
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

      // Legacy/Shared
      'intelligence-advisory': <IntelligenceAdvisoryLayer mode={currentMode} />,
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

    // If miidle is selected
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
        case 'finances': return <div className="p-8 text-slate-500">Finance Oversight & Cashflow</div>;
        case 'operations': return <div className="p-8 text-slate-500">Day-to-Day Operations</div>;
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
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Startup/Project Tabs
    if (currentMode === 'Startup/Project') {
      switch (activeTab) {
        case 'dashboard': return <ProjectHub />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'tasks': return <div className="p-8 text-slate-500">Jira/Asana Style Task Management</div>;
        case 'compliance': return <div className="p-8 text-slate-500">Compliance & Regulatory Tracking</div>;
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
        case 'finances': return <div className="p-8 text-slate-500">Office Budget & Expenses</div>;
        case 'inventory': return <div className="p-8 text-slate-500">Inventory & Asset Management</div>;
        case 'team': return <TeamPage />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Freelance Tabs
    if (currentMode === 'Freelance') {
      switch (activeTab) {
        case 'dashboard': return <FreelanceHub />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'crm': return <div className="p-8 text-slate-500">CRM & Marketing Optimization</div>;
        case 'appointments': return <div className="p-8 text-slate-500">Appointment Bookings</div>;
        case 'finances': return <div className="p-8 text-slate-500">Freelance Invoicing & Expenses</div>;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Creative Tabs
    if (currentMode === 'Creative') {
      switch (activeTab) {
        case 'dashboard': return <CreativePortfolio />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'appointments': return <div className="p-8 text-slate-500">Creative Appointments</div>;
        case 'marketing': return <div className="p-8 text-slate-500">Contacts & Marketing Data</div>;
        case 'social': return <div className="p-8 text-slate-500">Social Media Monitor & Projections</div>;
        case 'projections': return <ReportsPage />;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Healthcare Tabs
    if (currentMode === 'Healthcare') {
      switch (activeTab) {
        case 'dashboard': return <HealthcareDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'practice': return <div className="p-8 text-slate-500">Practice Management</div>;
        case 'accounting': return <div className="p-8 text-slate-500">Healthcare Accounting</div>;
        case 'patients': return <div className="p-8 text-slate-500">Patient Records (Secure)</div>;
        case 'compliance': return <div className="p-8 text-slate-500">HIPAA Compliance Audit</div>;
        case 'settings': return <SystemsPage mode={currentMode} />;
      }
    }

    // Assisted Tabs
    if (currentMode === 'Assisted') {
      switch (activeTab) {
        case 'dashboard': return <AssistedDashboard />;
        case 'actions': return <ActionItems mode={currentMode} app={currentApp} />;
        case 'help': return <div className="p-12 text-slate-900 text-2xl font-bold">Need help? Click here.</div>;
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

  return (
    <ErrorBoundary>
      <V3NavProvider
        value={{
          currentApp,
          currentMode,
          activeTab,
          setCurrentApp,
          setCurrentMode,
          setActiveTab,
        }}
      >
        <div
          className={cn(
            "flex h-screen bg-white font-sans text-slate-900 overflow-hidden",
            currentMode === 'Assisted' && "text-lg"
          )}
        >
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
                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded border border-green-100 uppercase tracking-tighter">Optimized</span>
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
        </div>
      </V3NavProvider>
    </ErrorBoundary>
  );
}

