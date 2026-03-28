/**
 * Domain-specific dashboard configurations
 * TechOpsHUD and PmoDashboard layouts
 */

export const DOMAIN_DASHBOARDS = {
  TECH_OPS: {
    id: 'TECH_OPS',
    name: 'Tech Ops HUD',
    description: 'Real-time operations monitoring dashboard',
    defaultLayout: 'COMMAND_CENTER',
    defaultTheme: 'industrial-command',
    panels: [
      {
        id: 'alerts-panel',
        title: 'Live Alerts',
        icon: 'alert-triangle',
        size: 'medium',
        position: 'top-right',
        collapsible: true,
        defaultExpanded: true,
      },
      {
        id: 'incidents-panel',
        title: 'Active Incidents',
        icon: 'alert-octagon',
        size: 'medium',
        position: 'top-right',
        collapsible: true,
        defaultExpanded: true,
      },
      {
        id: 'metrics-panel',
        title: 'System Metrics',
        icon: 'activity',
        size: 'large',
        position: 'top-right',
        collapsible: false,
      },
      {
        id: 'logs-panel',
        title: 'Live Logs',
        icon: 'terminal',
        size: 'large',
        position: 'bottom-right',
        collapsible: true,
        defaultExpanded: false,
      },
      {
        id: 'deployments-panel',
        title: 'Deployments',
        icon: 'git-branch',
        size: 'small',
        position: 'bottom-right',
        collapsible: true,
      },
    ],
    widgets: [
      {
        id: 'uptime-widget',
        type: 'metric-card',
        title: 'System Uptime',
        metric: 'uptime',
        format: 'percentage',
        trend: true,
        alertThreshold: 99.5,
      },
      {
        id: 'response-time-widget',
        type: 'metric-card',
        title: 'Avg Response Time',
        metric: 'response_time',
        format: 'duration',
        trend: true,
        alertThreshold: 500,
      },
      {
        id: 'error-rate-widget',
        type: 'metric-card',
        title: 'Error Rate',
        metric: 'error_rate',
        format: 'percentage',
        trend: true,
        alertThreshold: 0.01,
      },
      {
        id: 'incident-count-widget',
        type: 'counter',
        title: 'Active Incidents',
        metric: 'incident_count',
        severity: true,
      },
      {
        id: 'deployment-status-widget',
        type: 'status-list',
        title: 'Deployments',
        metric: 'deployments',
        showRecent: 5,
      },
    ],
    aiIntegration: {
      enabled: true,
      position: 'bottom-left',
      states: ['idle', 'processing', 'typing'],
      capabilities: [
        'incident-analysis',
        'log-search',
        'root-cause-detection',
        'auto-mitigation',
      ],
    },
  },
  PMO: {
    id: 'PMO',
    name: 'PMO Dashboard',
    description: 'Project management and strategic oversight dashboard',
    defaultLayout: 'SIDEBAR_COMMAND',
    defaultTheme: 'founder-command',
    sidebar: {
      sections: [
        {
          id: 'main',
          title: 'Main',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
            { id: 'initiatives', label: 'Initiatives', icon: 'target' },
            { id: 'departments', label: 'Departments', icon: 'building-2' },
            { id: 'reports', label: 'Reports', icon: 'bar-chart-2' },
          ],
        },
        {
          id: 'operations',
          title: 'Operations',
          items: [
            { id: 'diagnostics', label: 'Diagnostics', icon: 'activity' },
            { id: 'action-items', label: 'Action Items', icon: 'check-square' },
            { id: 'knowledge', label: 'Knowledge Base', icon: 'database' },
          ],
        },
        {
          id: 'settings',
          title: 'Settings',
          items: [
            { id: 'team', label: 'Team', icon: 'users' },
            { id: 'integrations', label: 'Integrations', icon: 'plug' },
            { id: 'admin', label: 'Admin', icon: 'settings' },
          ],
        },
      ],
    },
    widgets: [
      {
        id: 'initiative-progress-widget',
        type: 'progress-tracker',
        title: 'Initiative Progress',
        metric: 'initiative_progress',
        showDetails: true,
      },
      {
        id: 'health-score-widget',
        type: 'metric-card',
        title: 'Organization Health',
        metric: 'health_score',
        format: 'score',
        trend: true,
      },
      {
        id: 'capacity-widget',
        type: 'capacity-gauge',
        title: 'Team Capacity',
        metric: 'capacity',
        breakdownBy: 'department',
      },
      {
        id: 'risk-feed-widget',
        type: 'feed',
        title: 'Risk Alerts',
        metric: 'risks',
        maxItems: 5,
        severity: true,
      },
      {
        id: 'next-actions-widget',
        type: 'action-list',
        title: 'Next Actions',
        metric: 'actions',
        maxItems: 5,
        priority: true,
      },
    ],
    aiIntegration: {
      enabled: true,
      position: 'sidebar-bottom',
      states: ['idle', 'processing', 'typing'],
      capabilities: [
        'strategic-analysis',
        'risk-assessment',
        'resource-optimization',
        'insight-generation',
      ],
    },
  },
  MIIDLE: {
    id: 'MIIDLE',
    name: 'Miiddle Workspace',
    description: 'Workflow automation and knowledge management',
    defaultLayout: 'CREATIVE_ASYMMETRIC',
    defaultTheme: 'creator-nightshift',
    widgets: [
      {
        id: 'workflows-widget',
        type: 'workflow-grid',
        title: 'Active Workflows',
        metric: 'workflows',
        showStatus: true,
      },
      {
        id: 'knowledge-widget',
        type: 'knowledge-cards',
        title: 'Knowledge Base',
        metric: 'knowledge',
        featured: true,
      },
      {
        id: 'automation-stats-widget',
        type: 'stats-grid',
        title: 'Automation Stats',
        metrics: ['automations_run', 'time_saved', 'efficiency_gain'],
      },
      {
        id: 'recent-activities-widget',
        type: 'activity-feed',
        title: 'Recent Activities',
        metric: 'activities',
        maxItems: 10,
      },
    ],
    aiIntegration: {
      enabled: true,
      position: 'floating',
      states: ['idle', 'processing', 'typing'],
      capabilities: [
        'workflow-automation',
        'knowledge-retrieval',
        'process-optimization',
      ],
    },
  },
}

/**
 * Get dashboard configuration by domain
 */
export function getDashboardByDomain(domain) {
  return DOMAIN_DASHBOARDS[domain]
}

/**
 * Get default layout mode for domain
 */
export function getDefaultLayoutModeForDomain(domain) {
  const dashboard = getDashboardByDomain(domain)
  return dashboard?.defaultLayout || 'SIDEBAR_COMMAND'
}

/**
 * Get default theme preset for domain
 */
export function getDefaultThemeForDomain(domain) {
  const dashboard = getDashboardByDomain(domain)
  return dashboard?.defaultTheme || 'founder-command'
}

/**
 * Get panels for domain
 */
export function getPanelsForDomain(domain) {
  const dashboard = getDashboardByDomain(domain)
  return dashboard?.panels || []
}

/**
 * Get widgets for domain
 */
export function getWidgetsForDomain(domain) {
  const dashboard = getDashboardByDomain(domain)
  return dashboard?.widgets || []
}

/**
 * Get AI integration config for domain
 */
export function getAIIntegrationForDomain(domain) {
  const dashboard = getDashboardByDomain(domain)
  return dashboard?.aiIntegration || null
}
