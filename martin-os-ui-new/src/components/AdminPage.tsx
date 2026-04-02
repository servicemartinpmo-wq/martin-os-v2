import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { extractPalette } from '../lib/theme';
import { toast } from 'sonner';

const AdminPage = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogoProcess = async () => {
    if (!logoUrl) return;
    setIsProcessing(true);
    const colors = await extractPalette(logoUrl);
    setIsProcessing(false);
    if (colors) {
      toast.success('System Branding Updated', {
        description: 'New palette extracted and applied to the Mission Control interface.'
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter text-white">System Administration</h2>
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
          Tier: COMMAND
        </span>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Branding & Identity</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your organization's logo to automatically extract a custom palette and skin the MARTIN OS interface.
          </p>
          <div className="space-y-4">
            <div className="relative">
              <input 
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter Logo URL (e.g., https://example.com/logo.png)" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-16 outline-none focus:border-blue-500/50 transition-all text-sm"
              />
              <button 
                onClick={handleLogoProcess}
                disabled={isProcessing || !logoUrl}
                className="absolute right-2 top-2 p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <RefreshCw className="w-5 h-5 text-white" />}
              </button>
            </div>
            {logoUrl && (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                <img src={logoUrl} alt="Logo Preview" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logo Preview</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Security & Access</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-slate-300">Multi-Factor Authentication</span>
              <div className="w-10 h-5 bg-emerald-500/20 border border-emerald-500/40 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-slate-300">Audit Logging</span>
              <div className="w-10 h-5 bg-emerald-500/20 border border-emerald-500/40 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
