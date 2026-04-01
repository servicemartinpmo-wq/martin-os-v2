import React from 'react';
import { Settings, Shield, Database, Activity, Lock, Users, HelpCircle } from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface SystemsPageProps {
  mode: AppMode;
}

export default function SystemsPage({ mode }: SystemsPageProps) {
  const isAssisted = mode === 'Assisted';

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
      { icon: Shield, title: 'Authority Matrix', desc: 'Define decision-making rights and approval workflows.' },
      { icon: Database, title: 'Data Integration', desc: 'Connect G-Suite, Microsoft Office, and other external tools.' },
      { icon: Activity, title: 'Signal Detection', desc: 'Configure sensitivity thresholds for automated alerts.' },
      { icon: Lock, title: 'Access & Roles', desc: 'Manage user permissions and security protocols.' },
      { icon: Users, title: 'Organization Profile', desc: 'Update company structure, departments, and strategic goals.' },
      { icon: Settings, title: 'Engine Settings', desc: 'Fine-tune AI reasoning models and knowledge base indexing.' },
    ];

    if (mode === 'Founder/SMB') {
      return [
        { icon: Database, title: 'Revenue Connectors', desc: 'Sync your bank accounts and sales platforms.' },
        { icon: Shield, title: 'Risk Oversight', desc: 'Set up automated alerts for operational surprises.' },
        ...baseItems.slice(2)
      ];
    }

    if (mode === 'Healthcare') {
      return [
        { icon: Lock, title: 'HIPAA Compliance', desc: 'Manage data encryption and access logs.' },
        { icon: Shield, title: 'Patient Data Privacy', desc: 'Configure anonymization and sharing protocols.' },
        ...baseItems.slice(2)
      ];
    }

    if (isAssisted) {
      return [
        { icon: HelpCircle, title: 'Get Help', desc: 'Talk to a human for technical support.' },
        { icon: Settings, title: 'Simple Settings', desc: 'Change your text size and colors.' },
        { icon: Lock, title: 'My Account', desc: 'Manage your login and security.' },
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
          <div key={item.title} className={cn(
            "bg-white border border-slate-200 shadow-sm hover:border-cyan-200 transition-all cursor-pointer group",
            isAssisted ? "p-10 rounded-[3rem] border-4" : "p-6 rounded-2xl"
          )}>
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
