import React from 'react';
import { Settings, Shield, Database, Activity, Lock, Users, HelpCircle } from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface SystemsPageProps {
  mode: AppMode;
}

export default function SystemsPage({ mode }: SystemsPageProps) {
  const isAssisted = mode === 'Assisted';
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
      return data;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'Founder/SMB': return 'Business Infrastructure';
      case 'Executive': return 'Organizational Governance';
      case 'Healthcare': return 'Security & Compliance Settings';
      case 'Assisted': return 'System Settings';
      default: return 'Systems Configuration';
    }
  };

  const getItems = () => {
    const baseItems = [
      { id: 'authority', icon: Shield, title: 'Authority Matrix', desc: 'Define decision-making rights and approval workflows.' },
      { id: 'integration', icon: Database, title: 'Data Integration', desc: 'Connect G-Suite, Microsoft Office, and other external tools.' },
      { id: 'signals', icon: Activity, title: 'Signal Detection', desc: 'Configure sensitivity thresholds for automated alerts.' },
      { id: 'access', icon: Lock, title: 'Access & Roles', desc: 'Manage user permissions and security protocols.' },
      { id: 'profile', icon: Users, title: 'Organization Profile', desc: 'Update company structure, departments, and strategic goals.' },
      { id: 'engine', icon: Settings, title: 'Engine Settings', desc: 'Fine-tune AI reasoning models and knowledge base indexing.' },
    ];

    if (mode === 'Founder/SMB') {
      return [
        { id: 'revenue', icon: Database, title: 'Revenue Connectors', desc: 'Sync your bank accounts and sales platforms.' },
        { id: 'risk', icon: Shield, title: 'Risk Oversight', desc: 'Set up automated alerts for operational surprises.' },
        ...baseItems.slice(2)
      ];
    }

    if (mode === 'Healthcare') {
      return [
        { id: 'hipaa', icon: Lock, title: 'HIPAA Compliance', desc: 'Manage data encryption and access logs.' },
        { id: 'privacy', icon: Shield, title: 'Patient Data Privacy', desc: 'Configure anonymization and sharing protocols.' },
        ...baseItems.slice(2)
      ];
    }

    if (isAssisted) {
      return [
        { id: 'help', icon: HelpCircle, title: 'Get Help', desc: 'Talk to a human for technical support.' },
        { id: 'simple', icon: Settings, title: 'Simple Settings', desc: 'Change your text size and colors.' },
        { id: 'account', icon: Lock, title: 'My Account', desc: 'Manage your login and security.' },
      ];
    }

    return baseItems;
  };

  const items = getItems();

  return (
    <div className={cn(
      "p-8 space-y-8 max-w-7xl mx-auto transition-all duration-500",
      isAssisted && "p-12 space-y-12"
    )}>
      <header>
        <h2 className={cn(
          "font-bold text-slate-900 tracking-tight",
          isAssisted ? "text-6xl" : "text-3xl"
        )}>{getTitle()}</h2>
        <p className={cn(
          "text-slate-500 mt-1",
          isAssisted ? "text-2xl mt-4" : "text-base"
        )}>
          {isAssisted ? "Adjust how your workspace behaves." : "Configure the Apphia engine and manage organizational infrastructure."}
        </p>
      </header>

      <div className={cn(
        "grid grid-cols-1 gap-6",
        !isAssisted && "md:grid-cols-2"
      )}>
        {items.map((item) => (
          <div 
            key={item.title} 
            className={cn(
              "bg-white border border-slate-200 shadow-sm hover:border-cyan-200 transition-all cursor-pointer group",
              isAssisted ? "p-10 rounded-[3rem] border-4" : "p-6 rounded-2xl"
            )}
            onClick={() => handleAction('view_system_settings', { id: item.id })}
          >
            <div className={cn(
              "flex gap-4",
              isAssisted && "flex-col items-center text-center gap-8"
            )}>
              <div className={cn(
                "bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors",
                isAssisted ? "w-32 h-32 rounded-[2rem] border-4 border-slate-100" : "w-12 h-12 rounded-xl"
              )}>
                <item.icon className={isAssisted ? "w-16 h-16" : "w-6 h-6"} />
              </div>
              <div>
                <h3 className={cn(
                  "font-bold text-slate-900 group-hover:text-cyan-600 transition-colors",
                  isAssisted ? "text-4xl" : "text-lg"
                )}>{item.title}</h3>
                <p className={cn(
                  "text-slate-500 mt-1 leading-relaxed",
                  isAssisted ? "text-2xl mt-4" : "text-sm"
                )}>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
