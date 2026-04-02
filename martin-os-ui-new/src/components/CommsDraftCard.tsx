import React from 'react';
import { toast } from 'sonner';

export default function CommsDraftCard({ draft }: { draft: any }) {
  const copyToClipboard = () => {
    if (!draft.body) return;
    navigator.clipboard.writeText(draft.body);
    toast.success('Draft copied to clipboard for transmission.');
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden group animate-in fade-in zoom-in duration-300">
      {/* Visual Identity for Recipient */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/40 text-[10px] font-bold text-blue-400">
          {draft.recipientRole ? draft.recipientRole[0] : 'R'}
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">{draft.recipientRole}</h4>
          <p className="text-[10px] text-slate-500 uppercase">{draft.roleKey}</p>
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-4">
        <p className="text-xs text-slate-300 italic leading-relaxed">"{draft.body}"</p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 text-white"
        >
          Copy to {draft.channel || 'Clipboard'}
        </button>
        <button 
          data-action="workflow" 
          data-value={`archive_draft_${draft.id}`}
          className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-[10px] text-slate-400 uppercase tracking-widest"
        >
          Archive
        </button>
      </div>
    </div>
  );
}
