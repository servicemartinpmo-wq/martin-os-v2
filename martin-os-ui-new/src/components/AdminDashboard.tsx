import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GeminiChat } from './shared/GeminiChat';
import { ImageAnalyzer } from './shared/ImageAnalyzer';
import { AIResultModal } from './shared/AIResultModal';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      
      handleResult(data);
      toast.success(`Action ${actionName} completed`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'service.martinpmo@gmail.com') {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);

  const handleResult = (result: any) => {
    setSearchResult(result?.result || 'No status report generated.');
    setIsModalOpen(true);
  };

  if (!isAdmin) return <div>Access Denied</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">System Health & Search</h2>
          <button 
            onClick={() => handleAction('run_system_health_check')}
            disabled={actionLoading}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Run System Health Check (with Search)
          </button>
        </div>

        <ImageAnalyzer />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Gemini Brain Chat</h2>
        <GeminiChat systemInstruction="You are the system administrator assistant for MARTIN OS. Be concise and helpful." />
      </div>

      <AIResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="System Health Check"
        content={searchResult}
        loading={loading}
      />
    </div>
  );
};
