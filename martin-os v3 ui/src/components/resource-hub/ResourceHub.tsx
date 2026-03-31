import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Workflow, 
  Download, 
  ExternalLink,
  Search,
  Grid,
  List as ListIcon
} from 'lucide-react';
import { frameworks } from '../../data/mockData';
import { cn } from '../../lib/utils';

const categories = ['All', 'Strategy', 'Operations', 'Performance', 'Risk', 'Change Management'];

export default function ResourceHub() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Resource Hub</h2>
        <p className="text-slate-500 mt-1">Access management frameworks, templates, and automated workflows.</p>
      </header>

      {/* Tabs & Search */}
      <div className="flex flex-wrap gap-6 items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-8">
          {['Frameworks', 'Templates', 'Workflows'].map((tab, i) => (
            <button 
              key={tab} 
              className={cn(
                "pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative",
                i === 0 ? "text-cyan-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
              {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button className="p-2 bg-slate-50 text-slate-600 border-r border-slate-200"><Grid className="w-4 h-4" /></button>
            <button className="p-2 bg-white text-slate-400 hover:text-slate-600"><ListIcon className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat, i) => (
          <button 
            key={cat}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              i === 0 ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameworks.map((fw) => (
          <div key={fw.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{fw.name}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{fw.notes}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Execution</span>
                <span className="text-slate-700 font-medium">{fw.executionModule}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Temporal</span>
                <span className="text-slate-700 font-medium">{fw.temporalContext}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {fw.outputsTo.map(out => (
                <span key={out} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest">
                  {out}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Placeholder for Templates/Workflows */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-100 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Workflow className="w-6 h-6 text-slate-400" />
          </div>
          <h4 className="font-bold text-slate-900">Add Custom Framework</h4>
          <p className="text-sm text-slate-500 mt-1">Upload your own organizational methodologies.</p>
        </div>
      </div>
    </div>
  );
}
