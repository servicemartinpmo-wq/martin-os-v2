import React, { useState } from 'react';
import { Blocks, Search, CheckCircle2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner';

const INTEGRATIONS = [
  { category: 'Design & Creative', apps: ['Adobe Creative Cloud', 'Canva'] },
  { category: 'Project Management', apps: ['Jira', 'Asana', 'Trello', 'MS Project', 'Click-Up', 'Monday.com'] },
  { category: 'Data & Analytics', apps: ['Tableau', 'Google Analytics'] },
  { category: 'Website & CMS', apps: ['SquareSpace', 'Wix', 'WordPress'] },
  { category: 'Marketing & CRM', apps: ['Hootsuite', 'HubSpot', 'Mailchimp', 'ActiveCampaign', 'Salesforce'] },
  { category: 'Productivity & Docs', apps: ['Google Workspace (G Suite)', 'Microsoft Office 365', 'DocuSign'] },
  { category: 'Finance & Expenses', apps: ['SAP Concur', 'Navan', 'Expensify'] },
  { category: 'Communication & Support', apps: ['Slack', 'Zendesk'] },
  { category: 'Identity & Security', apps: ['Okta'] },
  { category: 'Other Enterprise Tools', apps: ['Workday', 'ServiceNow', 'Notion', 'Figma'] }
];

export default function IntegrationsPage() {
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter text-white">Connected Systems</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Manage your organization's tool stack and data pipelines
          </p>
        </div>
        <button 
          onClick={() => handleAction('add_integration')}
          disabled={actionLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connection Status Overview */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-6">
          <div className="cinematic-panel flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Syncs</p>
                <p className="text-2xl font-black text-white">24</p>
              </div>
            </div>
          </div>
          <div className="cinematic-panel flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <RefreshCw className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Auth</p>
                <p className="text-2xl font-black text-white">3</p>
              </div>
            </div>
          </div>
          <div className="cinematic-panel flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Failed Connections</p>
                <p className="text-2xl font-black text-white">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {INTEGRATIONS.map((category, idx) => (
          <div key={idx} className="cinematic-panel space-y-4">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              <Blocks className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">{category.category}</h3>
            </div>
            <div className="space-y-2">
              {category.apps.map((app, appIdx) => (
                <div key={appIdx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-slate-300">{app}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
