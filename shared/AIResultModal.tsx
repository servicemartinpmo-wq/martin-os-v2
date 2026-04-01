import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, Sparkles, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface AIResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  loading?: boolean;
}

export const AIResultModal = ({ isOpen, onClose, title, content, loading }: AIResultModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI Generated Intelligence
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                  <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Synthesizing Intelligence...</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none prose-sm prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-950 prose-p:font-medium prose-strong:text-black prose-strong:font-black">
                  <Markdown>{content}</Markdown>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
