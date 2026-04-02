import React, { useEffect, useState } from 'react';
import { ArrowLeft, GitBranch, ListTodo, Workflow, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface InitiativeDetailViewProps {
  initiative: any;
  onBack: () => void;
}

export default function InitiativeDetailView({ initiative, onBack }: InitiativeDetailViewProps) {
  const [subItems, setSubItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubItems = async () => {
      try {
        const { data, error } = await supabase
          .from('project_tasks')
          .select('*')
          .eq('project_id', initiative.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setSubItems(data || []);
      } catch (err) {
        console.error('Error fetching sub-items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubItems();
  }, [initiative.id]);

  const toggleSubItem = async (item: any) => {
    const newStatus = !item.completed;
    
    // Optimistic update
    setSubItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, completed: newStatus } : i
    ));

    try {
      // 1. Update task status
      const { error: updateError } = await supabase
        .from('project_tasks')
        .update({ completed: newStatus })
        .eq('id', item.id);
      
      if (updateError) throw updateError;

      // 2. If completed, log to action_items or decision_logs
      if (newStatus) {
        const logEntry = {
          title: `Completed: ${item.title}`,
          description: `Initiative: ${initiative.title}`,
          created_at: new Date().toISOString(),
          type: 'action_item' // or 'decision_log' based on item type
        };

        const { error: logError } = await supabase
          .from('action_items')
          .insert([logEntry]);
        
        if (logError) console.error('Error logging completion:', logError);
      }
    } catch (err) {
      console.error('Error updating sub-item:', err);
      // Rollback on error
      setSubItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, completed: item.completed } : i
      ));
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Initiatives
      </button>

      <header>
        <h2 className="text-4xl font-bold text-slate-900">{initiative.title}</h2>
        <p className="text-slate-500 mt-2">{initiative.description || 'No description provided.'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-cyan-500" />
              Sub-items
            </h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
              </div>
            ) : (
              <div className="space-y-2">
                {subItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => toggleSubItem(item)}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                    <span className={item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-500" />
              Mini-Workflow Visualization
            </h3>
            <p className="text-slate-500">Workflow visualization would go here.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-500" />
              Dependencies
            </h3>
            <p className="text-slate-500">Dependencies list would go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
