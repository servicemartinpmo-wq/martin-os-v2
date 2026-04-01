import React from 'react';
import { 
  Link2,
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  BarChart3,
  Terminal,
  Share2,
  Cpu,
  History,
  Activity,
  Briefcase,
  DollarSign,
  ClipboardList,
  Rocket,
  ShieldAlert,
  Kanban,
  UserPlus,
  Calendar,
  Palette,
  Globe,
  Stethoscope,
  HeartPulse,
  Accessibility,
  HelpCircle,
  Building2,
  Package,
  Megaphone,
  Search,
  Zap,
  Cpu as CpuIcon,
  Database as DatabaseIcon,
  Workflow as WorkflowIcon,
  Layers as LayersIcon,
  Network as NetworkIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  RefreshCw as RefreshCwIcon,
  Import as ImportIcon,
  LayoutGrid as LayoutGridIcon,
  Palette as PaletteIcon,
  Trophy as TrophyIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Volume2 as Volume2Icon,
  Mic as MicIcon,
  TrendingUp as TrendingUpIcon,
  UserCheck,
  FastForward,
  Flame,
  Shuffle,
  Award,
  Brain,
  LineChart,
  Eye,
  Box,
  Layout,
  GitBranch,
  Lightbulb,
  Activity as ActivityIcon,
  ShieldAlert as ShieldAlertIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getIconStyle } from '../../lib/iconStyles';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import AppSwitcher from './AppSwitcher';
import { AppMode, AppType } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  currentApp: AppType;
  setApp: (app: AppType) => void;
}

const navConfigs: Record<AppMode, { id: string; label: string; icon: any }[]> = {
  'Founder/SMB': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'operations', label: 'Operations', icon: Activity },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'crm', label: 'CRM', icon: UserPlus },
    { id: 'marketing-hub', label: 'Marketing', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Executive': [
    { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'team-mgmt', label: 'Team Management', icon: Users },
    { id: 'crm', label: 'CRM', icon: UserPlus },
    { id: 'marketing-hub', label: 'Marketing', icon: Megaphone },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'advisory', label: 'Advisory', icon: MessageSquare },
    { id: 'behavior', label: 'Behavioral Engine', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Startup/Project': [
    { id: 'dashboard', label: 'Dashboard', icon: Rocket },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'tasks', label: 'Tasks (Jira)', icon: Kanban },
    { id: 'compliance', label: 'PMBOK/Compliance', icon: ShieldAlert },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'crm', label: 'CRM', icon: UserPlus },
    { id: 'marketing-hub', label: 'Marketing', icon: Megaphone },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Admin/Office': [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'crm', label: 'CRM', icon: UserPlus },
    { id: 'marketing-hub', label: 'Marketing', icon: Megaphone },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Freelance': [
    { id: 'dashboard', label: 'Dashboard', icon: Kanban },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'crm', label: 'CRM/Marketing', icon: UserPlus },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Creative': [
    { id: 'dashboard', label: 'Dashboard', icon: Palette },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'marketing', label: 'Marketing/CRM', icon: Globe },
    { id: 'social', label: 'Social Monitor', icon: Share2 },
    { id: 'projections', label: 'Projections', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Healthcare': [
    { id: 'dashboard', label: 'Dashboard', icon: Stethoscope },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'practice', label: 'Practice Mgmt', icon: HeartPulse },
    { id: 'accounting', label: 'Accounting', icon: DollarSign },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'compliance', label: 'Compliance', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  'Assisted': [
    { id: 'dashboard', label: 'Dashboard', icon: Search },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'help', label: 'Help/Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]
};

const techNavConfigs: Record<AppMode, { id: string; label: string; icon: any }[]> = {
  'Founder/SMB': [
    { id: 'tech-dashboard', label: 'Infrastructure ROI', icon: Terminal },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Ops Tickets', icon: CheckSquare },
    { id: 'settings', label: 'Systems', icon: Settings },
  ],
  'Executive': [
    { id: 'tech-dashboard', label: 'Org Uptime', icon: ShieldCheck },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Critical Issues', icon: ShieldAlert },
    { id: 'settings', label: 'Governance', icon: Settings },
  ],
  'Startup/Project': [
    { id: 'tech-dashboard', label: 'DevOps Hub', icon: Rocket },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Sprint Tasks', icon: Kanban },
    { id: 'settings', label: 'Stack Config', icon: Settings },
  ],
  'Admin/Office': [
    { id: 'tech-dashboard', label: 'Office Tech', icon: Building2 },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Support Queue', icon: CheckSquare },
    { id: 'settings', label: 'Inventory', icon: Package },
  ],
  'Freelance': [
    { id: 'tech-dashboard', label: 'Client Stack', icon: UserPlus },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Project Tasks', icon: Kanban },
    { id: 'settings', label: 'Tools', icon: Settings },
  ],
  'Creative': [
    { id: 'tech-dashboard', label: 'Creative Engine', icon: Palette },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Asset Pipeline', icon: Package },
    { id: 'settings', label: 'Workflow', icon: Settings },
  ],
  'Healthcare': [
    { id: 'tech-dashboard', label: 'HIPAA Systems', icon: Stethoscope },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Security Audit', icon: ShieldAlert },
    { id: 'settings', label: 'Compliance', icon: ShieldCheck },
  ],
  'Assisted': [
    { id: 'tech-dashboard', label: 'System Help', icon: Search },
    { id: 'actions', label: 'Need your attention', icon: CheckSquare },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'tickets', label: 'Fixes', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
};

const miidleNavConfigs: Record<AppMode, { id: string; label: string; icon: any }[]> = {
  'Founder/SMB': [
    { id: 'feed', label: 'ROI Stories', icon: Share2 },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Value Chain', icon: Globe },
    { id: 'settings', label: 'Strategy', icon: Settings },
  ],
  'Executive': [
    { id: 'feed', label: 'Strategic Build', icon: Target },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Org Network', icon: Users },
    { id: 'settings', label: 'Governance', icon: Settings },
  ],
  'Startup/Project': [
    { id: 'feed', label: 'Sprint Stories', icon: Rocket },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Project Graph', icon: Kanban },
    { id: 'settings', label: 'Roadmap', icon: Settings },
  ],
  'Admin/Office': [
    { id: 'feed', label: 'Office Culture', icon: Building2 },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Team Directory', icon: Users },
    { id: 'settings', label: 'Policy', icon: Settings },
  ],
  'Freelance': [
    { id: 'feed', label: 'Client Success', icon: UserPlus },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Network', icon: Globe },
    { id: 'settings', label: 'Marketing', icon: Settings },
  ],
  'Creative': [
    { id: 'feed', label: 'Portfolio Feed', icon: Palette },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Inspiration', icon: Globe },
    { id: 'settings', label: 'Archive', icon: Settings },
  ],
  'Healthcare': [
    { id: 'feed', label: 'Patient Outcomes', icon: HeartPulse },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'Care Network', icon: Users },
    { id: 'settings', label: 'HIPAA Logs', icon: ShieldCheck },
  ],
  'Assisted': [
    { id: 'feed', label: 'My Stories', icon: Search },
    { id: 'actions', label: 'Suggestions & Connections', icon: CheckSquare },
    { id: 'graph', label: 'My People', icon: Users },
    { id: 'settings', label: 'Help', icon: HelpCircle },
  ],
};

const pmoCoreSystems = [
  {
    label: 'Strategic Intelligence',
    systems: [
      { title: 'Strategic Alignment', icon: Target, id: 'strategic-alignment' },
      { title: 'Strategic Planning', icon: Layout, id: 'strategic-planning' },
      { title: 'Strategic Risk Forecasting', icon: BarChart3, id: 'strategic-risk-forecasting' },
      { title: 'Portfolio Optimization', icon: LayersIcon, id: 'portfolio-optimization' },
      { title: 'Innovation Pipeline', icon: Flame, id: 'innovation-pipeline' },
      { title: 'SOP Library', icon: BookOpen, id: 'sop-library' },
    ]
  },
  {
    label: 'Operational Excellence',
    systems: [
      { title: 'Execution Discipline', icon: Zap, id: 'execution-discipline' },
      { title: 'Execution Velocity', icon: FastForward, id: 'execution-velocity' },
      { title: 'Process Improvement', icon: Settings, id: 'process-improvement' },
      { title: 'Bottleneck Detection', icon: ShieldAlertIcon, id: 'bottleneck-detection' },
      { title: 'Initiative Health', icon: ActivityIcon, id: 'initiative-health' },
      { title: 'Initiative Recovery', icon: RefreshCwIcon, id: 'initiative-recovery' },
      { title: 'Action Items', icon: CheckSquare, id: 'action-items' },
    ]
  },
  {
    label: 'Organizational Intelligence',
    systems: [
      { title: 'Org Capacity', icon: Users, id: 'org-capacity' },
      { title: 'Org Health Scoring', icon: TrendingUpIcon, id: 'org-health-scoring' },
      { title: 'Leadership Bandwidth', icon: UserCheck, id: 'leadership-bandwidth' },
      { title: 'Cross-Dept Coordination', icon: GitBranch, id: 'cross-dept-coordination' },
      { title: 'Change Management', icon: Shuffle, id: 'change-management' },
      { title: 'Department/Team Health', icon: HeartPulse, id: 'dept-team-health' },
    ]
  }
];

const techCoreSystems = [
  {
    label: 'Infrastructure & Systems',
    systems: [
      { title: 'System Architecture', icon: CpuIcon, id: 'system-architecture' },
      { title: 'Database Health', icon: DatabaseIcon, id: 'database-health' },
      { title: 'Network Topology', icon: NetworkIcon, id: 'network-topology' },
      { title: 'Cloud Infrastructure', icon: Globe, id: 'cloud-infrastructure' },
      { title: 'Uptime Monitoring', icon: ActivityIcon, id: 'uptime-monitoring' },
    ]
  },
  {
    label: 'Security & Compliance',
    systems: [
      { title: 'Threat Detection', icon: ShieldAlertIcon, id: 'threat-detection' },
      { title: 'Access Control', icon: LockIcon, id: 'access-control' },
      { title: 'Compliance Audit', icon: ShieldCheck, id: 'compliance-audit' },
      { title: 'Vulnerability Scan', icon: Search, id: 'vulnerability-scan' },
      { title: 'Security Logs', icon: History, id: 'security-logs' },
    ]
  },
  {
    label: 'DevOps & Automation',
    systems: [
      { title: 'CI/CD Pipeline', icon: GitBranch, id: 'cicd-pipeline' },
      { title: 'Deployment Velocity', icon: FastForward, id: 'deployment-velocity' },
      { title: 'Automation Scripts', icon: Terminal, id: 'automation-scripts' },
      { title: 'Container Registry', icon: Box, id: 'container-registry' },
      { title: 'Workflow Engine', icon: WorkflowIcon, id: 'workflow-engine' },
    ]
  }
];

const miidleCoreSystems = [
  {
    label: 'Network Intelligence',
    systems: [
      { title: 'Value Chain Mapping', icon: Globe, id: 'value-chain' },
      { title: 'Relationship Graph', icon: Share2, id: 'relationship-graph' },
      { title: 'Community Health', icon: HeartPulse, id: 'community-health' },
      { title: 'Influence Mapping', icon: Zap, id: 'influence-mapping' },
    ]
  },
  {
    label: 'Cultural Dynamics',
    systems: [
      { title: 'Culture Scoring', icon: TrendingUpIcon, id: 'culture-scoring' },
      { title: 'Sentiment Analysis', icon: MessageSquare, id: 'sentiment-analysis' },
      { title: 'Internal Comms', icon: Megaphone, id: 'internal-comms' },
      { title: 'Event Pipeline', icon: Calendar, id: 'event-pipeline' },
    ]
  }
];


import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentMode, 
  setMode,
  currentApp,
  setApp
}: SidebarProps) {
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    fetchUserRole();
  }, []);

  console.log("Sidebar Rendered", { activeTab, isAdmin });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const getOrgMapName = (mode: AppMode) => {
    if (['Admin/Office', 'Healthcare'].includes(mode)) return 'Employee Directory';
    if (['Creative', 'Freelance', 'Startup/Project'].includes(mode)) return 'Team Directory';
    return 'Organizational Map';
  };

  const dashboards = React.useMemo(() => {
    const base = [
      { title: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
      { title: getOrgMapName(currentMode), icon: NetworkIcon, id: 'organizational-map' },
      { title: 'Resource Hub', icon: BookOpen, id: 'resource-hub' },
      { title: 'CRM', icon: UserPlus, id: 'crm' },
      { title: 'Marketing Hub', icon: Megaphone, id: 'marketing-hub' },
      { title: 'Integrations', icon: Link2, id: 'connectivity' },
      { title: 'Preferences', icon: Palette, id: 'preferences' },
    ];

    if (currentApp === 'PMO-OPs') {
      return [
        ...base,
        { title: 'Executive Command Center', icon: Layout, id: 'executive-command-center' },
      ];
    }

    if (currentApp === 'TECH-OPs') {
      return base.filter(item => item.id !== 'organizational-map');
    }
    
    return base;
  }, [currentMode, currentApp]);

  const coreSystemCategories = React.useMemo(() => {
    if (currentApp === 'TECH-OPs') return techCoreSystems;
    if (currentApp === 'miidle') return miidleCoreSystems;
    return pmoCoreSystems;
  }, [currentApp]);

  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (coreSystemCategories.length > 0) {
      setExpandedCategories([coreSystemCategories[0].label]);
    }
  }, [coreSystemCategories]);
  const [pinnedTabs, setPinnedTabs] = React.useState<string[]>(['strategic-alignment', 'initiative-health']);

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPinnedTabs(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleCategory = (label: string) => {
    setExpandedCategories(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const getWorkspaceName = (mode: AppMode) => {
    const names: Record<AppMode, string> = {
      'Founder/SMB': 'Founder OS',
      'Executive': 'Executive OS',
      'Startup/Project': 'Team OS',
      'Admin/Office': 'Office OS',
      'Freelance': 'Freelance OS',
      'Creative': 'Creative OS',
      'Healthcare': 'Healthcare OS',
      'Assisted': 'Admin OS',
    };
    return names[mode] || 'Apphia';
  };


  const getWorkspaceStats = () => {
    const labels: Record<AppMode, { health: string; capacity: string }> = {
      'Founder/SMB': { health: 'Org Health', capacity: 'Team Capacity' },
      'Executive': { health: 'Org Health', capacity: 'Team Capacity' },
      'Startup/Project': { health: 'Project Health', capacity: 'Sprint Capacity' },
      'Admin/Office': { health: 'Office Health', capacity: 'Staff Capacity' },
      'Freelance': { health: 'Client Health', capacity: 'My Capacity' },
      'Creative': { health: 'Studio Health', capacity: 'Creative Bandwidth' },
      'Healthcare': { health: 'Practice Health', capacity: 'Provider Capacity' },
      'Assisted': { health: 'System Health', capacity: 'Support Capacity' },
    };

    const currentLabels = labels[currentMode];

    return (
      <div className="px-3 py-4 space-y-3 border-t border-slate-800">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currentLabels.health}</span>
            <span className="text-[10px] font-black text-emerald-500">94%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[94%]" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currentLabels.capacity}</span>
            <span className="text-[10px] font-black text-blue-500">82%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[82%]" />
          </div>
        </div>
      </div>
    );
  };

  const navItems = React.useMemo(() => {
    let baseItems = [];
    if (currentApp === 'PMO-OPs') baseItems = navConfigs[currentMode];
    else if (currentApp === 'TECH-OPs') baseItems = techNavConfigs[currentMode];
    else if (currentApp === 'miidle') baseItems = miidleNavConfigs[currentMode];
    
    return baseItems || [];
  }, [currentApp, currentMode]);

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 space-y-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(6,182,212,0.3)]">
            <img src="/src/assets/pmo-ops-logo.png" alt="PMO-Ops Logo" className="w-8 h-8 rounded-lg" />
          </div>
          <h1 className="font-bold text-white text-lg leading-tight">
            APPHIA<br />
            <span className="text-cyan-500 text-sm font-medium tracking-tighter uppercase">{getWorkspaceName(currentMode)}</span>
          </h1>
        </div>

        {getWorkspaceStats()}
        
        <AppSwitcher currentApp={currentApp} setApp={setApp} />

        <div className="pt-2 border-t border-slate-800">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Perspective Mode</p>
          <WorkspaceSwitcher currentMode={currentMode} setMode={setMode} />
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto scrollbar-hide pb-20">
        {pinnedTabs.length > 0 && (
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pinned Systems</p>
            {coreSystemCategories.flatMap(c => c.systems).filter(s => pinnedTabs.includes(s.id)).map((item) => {
              const { containerClass, iconClass } = getIconStyle(currentMode, activeTab === item.id);
              return (
                <button
                  key={`pinned-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group mb-1",
                    activeTab === item.id 
                      ? "bg-white/10 text-white" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className={containerClass}>
                    <item.icon className={cn(
                      "w-4 h-4 transition-all duration-300",
                      iconClass,
                      activeTab === item.id ? "text-white scale-110" : "text-slate-400 group-hover:text-white"
                    )} />
                  </div>
                  <span className="font-bold flex-1 text-left text-xs uppercase tracking-tight">{item.title}</span>
                  <StarIcon 
                    onClick={(e) => togglePin(e, item.id)}
                    className="w-3 h-3 text-amber-500 fill-amber-500 opacity-50 hover:opacity-100 transition-opacity" 
                  />
                </button>
              );
            })}
          </div>
        )}

        <div>
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dashboards</p>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group mb-1",
                activeTab === 'admin' 
                  ? "bg-white/10 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0 bg-red-900/20 rounded-lg">
                <ShieldAlertIcon className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-bold flex-1 text-left text-xs uppercase tracking-tight">Admin Dashboard</span>
            </button>
          )}
          {dashboards.map((item) => {
            const { containerClass, iconClass } = getIconStyle(currentMode, activeTab === item.id);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group mb-1",
                  activeTab === item.id 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className={containerClass}>
                  <item.icon className={cn(
                    "w-4 h-4 transition-all duration-300",
                    iconClass,
                    activeTab === item.id ? "text-white scale-110" : "text-slate-400 group-hover:text-white"
                  )} />
                </div>
                <span className="font-bold flex-1 text-left text-xs uppercase tracking-tight">{item.title}</span>
                {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>

        <div>
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</p>
          {navItems.filter(item => item.id !== 'dashboard').map((item) => {
            const { containerClass, iconClass } = getIconStyle(currentMode, activeTab === item.id);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group mb-1",
                  activeTab === item.id 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className={containerClass}>
                  <item.icon className={cn(
                    "w-4 h-4 transition-all duration-300",
                    iconClass,
                    activeTab === item.id ? "text-white scale-110" : "text-slate-400 group-hover:text-white"
                  )} />
                </div>
                <span className="font-bold flex-1 text-left text-xs uppercase tracking-tight">{item.label}</span>
                {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Systems</p>
          <div className="space-y-2">
            {coreSystemCategories.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <button
                  onClick={() => toggleCategory(cat.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                  {cat.label}
                  <ChevronRight className={cn("w-3 h-3 transition-transform duration-300", expandedCategories.includes(cat.label) && "rotate-90")} />
                </button>
                
                {expandedCategories.includes(cat.label) && (
                  <div className="space-y-1 ml-2 border-l border-slate-800 pl-2">
                    {cat.systems.map((item) => {
                      const { containerClass, iconClass } = getIconStyle(currentMode, activeTab === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-300 group",
                            activeTab === item.id 
                              ? "bg-white/5 text-white" 
                              : "text-slate-500 hover:bg-slate-800 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={cn("w-6 h-6 flex items-center justify-center shrink-0", containerClass)}>
                              <item.icon className={cn("w-3 h-3 transition-all duration-300", iconClass)} />
                            </div>
                            <span className="font-bold flex-1 text-left text-[10px] uppercase tracking-tight">{item.title}</span>
                          </div>
                          <StarIcon 
                            onClick={(e) => togglePin(e, item.id)}
                            className={cn(
                              "w-2.5 h-2.5 transition-all duration-300",
                              pinnedTabs.includes(item.id) 
                                ? "text-amber-500 fill-amber-500 opacity-100" 
                                : "text-slate-700 opacity-0 group-hover:opacity-100 hover:text-amber-500"
                            )} 
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 flex-shrink-0">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-widest">CEO / Founder</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400 transition-colors" />
        </button>
      </div>
    </aside>
  );
}
