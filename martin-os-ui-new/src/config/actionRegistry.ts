export type ActionKind =
  | 'navigate'
  | 'open_modal'
  | 'api_call'
  | 'ai_command';

export type ActionDef = {
  id: string;
  label: string;
  kind: ActionKind;
  route?: string;
  endpoint?: string;
  payloadBuilder?: (ctx: any) => any;
};

export const ACTIONS: Record<string, ActionDef> = {
  run_intelligence_sync: {
    id: 'run_intelligence_sync',
    label: 'Run Intelligence Sync',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_all_priorities: {
    id: 'view_all_priorities',
    label: 'View All',
    kind: 'navigate',
    route: '/pmo-ops/initiatives'
  },
  delegate_tasks: {
    id: 'delegate_tasks',
    label: 'Delegate Tasks',
    kind: 'ai_command',
    endpoint: '/api/ai/command',
    payloadBuilder: (ctx: any) => ({
      intent: 'delegate_tasks',
      userInput: ctx.userInput || '',
      context: ctx.context || {}
    })
  },
  export_assets: {
    id: 'export_assets',
    label: 'Export Assets',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  create_project: {
    id: 'create_project',
    label: 'Create Project',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  project_options: {
    id: 'project_options',
    label: 'Project Options',
    kind: 'open_modal'
  },
  view_queue: {
    id: 'view_queue',
    label: 'View Queue',
    kind: 'navigate',
    route: '/tech-ops/queue'
  },
  download_report: {
    id: 'download_report',
    label: 'Download Report',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  run_full_audit: {
    id: 'run_full_audit',
    label: 'Run Full Audit',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  need_help: {
    id: 'need_help',
    label: 'I Need Help',
    kind: 'open_modal'
  },
  refresh_system: {
    id: 'refresh_system',
    label: 'Refresh System',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  sync_github_repos: {
    id: 'sync_github_repos',
    label: 'Sync Repositories',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  build_app: {
    id: 'build_app',
    label: 'Build & Deploy',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  create_directive: {
    id: 'create_directive',
    label: 'Create Directive',
    kind: 'open_modal'
  },
  export_pdf: {
    id: 'export_pdf',
    label: 'Export PDF',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  report_builder: {
    id: 'report_builder',
    label: 'Report Builder',
    kind: 'open_modal'
  },
  view_security_audit: {
    id: 'view_security_audit',
    label: 'View Security Audit',
    kind: 'open_modal'
  },
  sign_out: {
    id: 'sign_out',
    label: 'Sign Out',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  publish_story: {
    id: 'publish_story',
    label: 'Publish New Story',
    kind: 'open_modal'
  },
  deploy_workflow: {
    id: 'deploy_workflow',
    label: 'Deploy Workflow',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  run_simulation: {
    id: 'run_simulation',
    label: 'Run Simulation',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  share_post: {
    id: 'share_post',
    label: 'Share Post',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  approve_budget: {
    id: 'approve_budget',
    label: 'Approve Budget',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  review_budget: {
    id: 'review_budget',
    label: 'Review Budget',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  new_lead: {
    id: 'new_lead',
    label: 'New Lead',
    kind: 'open_modal'
  },
  view_calendar: {
    id: 'view_calendar',
    label: 'View Calendar',
    kind: 'navigate',
    route: '/freelance/calendar'
  },
  find_patient: {
    id: 'find_patient',
    label: 'Find Patient',
    kind: 'open_modal'
  },
  new_encounter: {
    id: 'new_encounter',
    label: 'New Encounter',
    kind: 'open_modal'
  },
  new_request: {
    id: 'new_request',
    label: 'New Request',
    kind: 'open_modal'
  },
  order_supplies: {
    id: 'order_supplies',
    label: 'Order Supplies',
    kind: 'open_modal'
  },
  auto_restock: {
    id: 'auto_restock',
    label: 'Auto-Restock All',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  generate_strategic_insights: {
    id: 'generate_strategic_insights',
    label: 'Generate New Insights',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  new_action: {
    id: 'new_action',
    label: 'New Action',
    kind: 'ai_command',
    endpoint: '/api/ai/command',
    payloadBuilder: (ctx: any) => ({
      intent: 'suggest_new_action',
      context: ctx.context || {}
    })
  },
  add_team_member_action: {
    id: 'add_team_member_action',
    label: 'Add Team Member',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  call_support: {
    id: 'call_support',
    label: 'Call Support',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  get_help: {
    id: 'get_help',
    label: 'Get Help',
    kind: 'open_modal'
  },
  view_tasks: {
    id: 'view_tasks',
    label: 'View Tasks',
    kind: 'navigate',
    route: '/assisted/tasks'
  },
  view_messages: {
    id: 'view_messages',
    label: 'View Messages',
    kind: 'navigate',
    route: '/assisted/messages'
  },
  view_support: {
    id: 'view_support',
    label: 'View Support',
    kind: 'navigate',
    route: '/assisted/support'
  },
  view_health: {
    id: 'view_health',
    label: 'View Health',
    kind: 'navigate',
    route: '/assisted/health'
  },
  initiate_system_audit: {
    id: 'initiate_system_audit',
    label: 'Initiate System Audit',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  update_permissions: {
    id: 'update_permissions',
    label: 'Update Permissions',
    kind: 'open_modal'
  },
  view_logic: {
    id: 'view_logic',
    label: 'View Logic',
    kind: 'open_modal'
  },
  export_team_csv: {
    id: 'export_team_csv',
    label: 'Export CSV',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  filter_team: {
    id: 'filter_team',
    label: 'Filter Team',
    kind: 'open_modal'
  },
  send_shoutout: {
    id: 'send_shoutout',
    label: 'Send Shoutout',
    kind: 'open_modal'
  },
  add_integration: {
    id: 'add_integration',
    label: 'Add Integration',
    kind: 'open_modal'
  },
  run_system_health_check: {
    id: 'run_system_health_check',
    label: 'Run System Health Check',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  analyze_image: {
    id: 'analyze_image',
    label: 'Analyze Image',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  chat_message: {
    id: 'chat_message',
    label: 'Chat Message',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  execute_diagnostic_action: {
    id: 'execute_diagnostic_action',
    label: 'Execute Diagnostic Action',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  toggle_checklist_item: {
    id: 'toggle_checklist_item',
    label: 'Toggle Checklist Item',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  dismiss_reminder: {
    id: 'dismiss_reminder',
    label: 'Dismiss Reminder',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  filter_projects: {
    id: 'filter_projects',
    label: 'Filter Projects',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  resolve_alert: {
    id: 'resolve_alert',
    label: 'Resolve Alert',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_log_detail: {
    id: 'view_log_detail',
    label: 'View Log Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_booking_detail: {
    id: 'view_booking_detail',
    label: 'View Booking Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_issue_queue: {
    id: 'view_issue_queue',
    label: 'View Issue Queue',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_issue_detail: {
    id: 'view_issue_detail',
    label: 'View Issue Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_all_initiatives: {
    id: 'view_all_initiatives',
    label: 'View All Initiatives',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  simulate_agent: {
    id: 'simulate_agent',
    label: 'Simulate Agent',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_story_detail: {
    id: 'view_story_detail',
    label: 'View Story Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  like_story: {
    id: 'like_story',
    label: 'Like Story',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  share_story: {
    id: 'share_story',
    label: 'Share Story',
    kind: 'open_modal'
  },
  view_patient_detail: {
    id: 'view_patient_detail',
    label: 'View Patient Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  patient_options: {
    id: 'patient_options',
    label: 'Patient Options',
    kind: 'open_modal'
  },
  team_member_options: {
    id: 'team_member_options',
    label: 'Team Member Options',
    kind: 'open_modal'
  },
  contact_member: {
    id: 'contact_member',
    label: 'Contact Member',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_system_settings: {
    id: 'view_system_settings',
    label: 'View System Settings',
    kind: 'open_modal'
  },
  new_ticket: {
    id: 'new_ticket',
    label: 'New Ticket',
    kind: 'open_modal'
  },
  search_tickets: {
    id: 'search_tickets',
    label: 'Search Tickets',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  filter_tickets: {
    id: 'filter_tickets',
    label: 'Filter Tickets',
    kind: 'open_modal'
  },
  sort_tickets: {
    id: 'sort_tickets',
    label: 'Sort Tickets',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_ticket_detail: {
    id: 'view_ticket_detail',
    label: 'View Ticket Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  assign_ticket: {
    id: 'assign_ticket',
    label: 'Assign Ticket',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_diagnostics: {
    id: 'view_diagnostics',
    label: 'View Diagnostics',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_project_detail: {
    id: 'view_project_detail',
    label: 'View Project Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  toggle_view_mode: {
    id: 'toggle_view_mode',
    label: 'Toggle View Mode',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_compliance_report: {
    id: 'view_compliance_report',
    label: 'View Compliance Report',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_velocity_metrics: {
    id: 'view_velocity_metrics',
    label: 'View Velocity Metrics',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_risk_assessment: {
    id: 'view_risk_assessment',
    label: 'View Risk Assessment',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_metric_detail: {
    id: 'view_metric_detail',
    label: 'View Metric Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_inventory_detail: {
    id: 'view_inventory_detail',
    label: 'View Inventory Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_marketing_insights: {
    id: 'view_marketing_insights',
    label: 'View Marketing Insights',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_clinical_insights: {
    id: 'view_clinical_insights',
    label: 'View Clinical Insights',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_mocha_framework: {
    id: 'view_mocha_framework',
    label: 'View MOCHA Framework',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_member_profile: {
    id: 'view_member_profile',
    label: 'View Member Profile',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_incident_trends: {
    id: 'view_incident_trends',
    label: 'View Incident Trends',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  refresh_quality_stats: {
    id: 'refresh_quality_stats',
    label: 'Refresh Quality Stats',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_authority_detail: {
    id: 'view_authority_detail',
    label: 'View Authority Detail',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  trigger_system_chain: {
    id: 'trigger_system_chain',
    label: 'Trigger System Chain',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  },
  view_social_stats: {
    id: 'view_social_stats',
    label: 'View Social Stats',
    kind: 'api_call',
    endpoint: '/api/actions/execute'
  }
};
