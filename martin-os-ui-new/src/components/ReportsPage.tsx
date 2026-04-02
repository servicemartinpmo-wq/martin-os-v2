import React, { useState } from 'react';
import { FileText, Download, ChevronRight, BarChart2, PieChart, TrendingUp, Calendar, Upload, Image, Type, File, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { runOperationalExtract } from '../services/logicModule';
import { toast } from 'sonner';

const IntakeEngine = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
  };

  const handleExtract = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    toast.promise(runOperationalExtract(files), {
      loading: 'Logic Module: Running Operational Extract...',
      success: (data) => {
        setIsProcessing(false);
        setFiles([]);
        return `Operational Extract Complete: ${data.signals.length} signals detected.`;
      },
      error: 'Operational Extract failed. Check system logs.',
    });
  };

  return (
    <div className="space-y-6">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative p-8 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-4 group cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
        )}
      >
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8 text-blue-400" />
        </div>
        <div className="text-center">
          <h4 className="text-sm font-bold text-white mb-1">Intake Engine</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Drop Text, Files, or Images for Analysis</p>
        </div>
        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])} />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 group">
              <div className="flex items-center gap-3 overflow-hidden">
                {file.type.startsWith('image/') ? <Image className="w-4 h-4 text-purple-400" /> : 
                 file.type === 'text/plain' ? <Type className="w-4 h-4 text-blue-400" /> : 
                 <File className="w-4 h-4 text-emerald-400" />}
                <span className="text-[10px] font-bold text-slate-300 truncate">{file.name}</span>
              </div>
              <button 
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-3 h-3 text-slate-500 hover:text-rose-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button 
          onClick={handleExtract}
          disabled={isProcessing}
          className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Run Operational Extract
        </button>
      )}
    </div>
  );
};

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter text-white">Executive Reports</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all">Generate New Report</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="cinematic-panel space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <BarChart2 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Performance Metrics</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Avg. Maturity Score', value: '84%', trend: '+4%' },
              { label: 'Executive Load', value: '72%', trend: '-2%' },
              { label: 'Task Completion', value: '91%', trend: '+1%' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-300">{stat.label}</span>
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">{stat.trend} Trend</span>
                </div>
                <span className="text-2xl font-black text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cinematic-panel col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Recent Reports</h3>
            </div>
            <button className="text-xs text-blue-400 underline hover:text-blue-300 transition-all">View All Reports</button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Q1 Operational Audit', date: 'Mar 25, 2026', type: 'PDF' },
              { name: 'Monthly Maturity Review', date: 'Mar 01, 2026', type: 'XLSX' },
              { name: 'Executive Load Analysis', date: 'Feb 28, 2026', type: 'PDF' },
              { name: 'Departmental Efficiency Report', date: 'Feb 15, 2026', type: 'PDF' },
            ].map((report, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{report.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{report.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{report.type}</span>
                  <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <Download className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="cinematic-panel space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Report Intake</h3>
          </div>
          <IntakeEngine />
        </div>

        <div className="cinematic-panel space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Maturity Growth Trend</h3>
          <div className="h-48 flex items-end gap-2">
            {[30, 45, 40, 55, 65, 60, 75, 84].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500/20 rounded-t-lg hover:bg-blue-500 transition-all cursor-pointer group relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 border border-white/10 rounded text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                    {h}% Maturity
                  </div>
                </div>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Month {i+1}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cinematic-panel space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Allocation</h3>
          <div className="space-y-4">
            {[
              { label: 'Operations', value: 45, color: 'bg-blue-500' },
              { label: 'Tech-Ops', value: 30, color: 'bg-cyan-500' },
              { label: 'Finance', value: 15, color: 'bg-purple-500' },
              { label: 'Legal', value: 10, color: 'bg-slate-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
