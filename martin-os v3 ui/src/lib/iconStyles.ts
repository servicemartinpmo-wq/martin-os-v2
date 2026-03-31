import { AppMode } from "../types";
import { cn } from "./utils";

export const getIconStyle = (mode: AppMode, isActive: boolean = false) => {
  const base = "w-9 h-9 flex items-center justify-center transition-all duration-500 relative overflow-hidden";

  switch (mode) {
    case 'Executive': // Chrome/Glass 3D Style
      return {
        containerClass: cn(
          base,
          "rounded-xl border border-white/40 backdrop-blur-md",
          isActive 
            ? "bg-white/90 text-slate-900 shadow-[0_15px_30px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,1),0_0_20px_rgba(255,255,255,0.4)] scale-110 -rotate-2" 
            : "bg-slate-800/40 text-slate-400 shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:bg-indigo-950 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.4),inset_0_0_10px_rgba(255,255,255,0.1)]"
        ),
        iconClass: isActive ? "drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] scale-110" : ""
      };
    case 'Creative': // Iridescent/Glass Style
      return {
        containerClass: cn(
          base,
          "rounded-2xl rotate-6 group-hover:rotate-0 border border-white/30",
          isActive 
            ? "bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 text-white shadow-[0_15px_35px_rgba(139,92,246,0.6),inset_0_2px_10px_rgba(255,255,255,0.4)] scale-110 -rotate-6" 
            : "bg-slate-800/80 text-slate-500 group-hover:bg-purple-950 group-hover:text-white group-hover:scale-110"
        ),
        iconClass: isActive ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" : ""
      };
    case 'Healthcare': // Soft Glass/Embossed Style
      return {
        containerClass: cn(
          base,
          "rounded-[1.25rem] border border-cyan-400/20",
          isActive 
            ? "bg-cyan-500 text-white shadow-[0_12px_24px_rgba(6,182,212,0.4),inset_0_2px_4px_rgba(255,255,255,0.5)] scale-110" 
            : "bg-slate-800/60 text-slate-500 group-hover:bg-cyan-950 group-hover:text-cyan-400 group-hover:scale-110"
        ),
        iconClass: isActive ? "scale-110 drop-shadow-md" : ""
      };
    case 'Startup/Project': // Cyber-Chrome Style
      return {
        containerClass: cn(
          base,
          "rounded-md border-2",
          isActive 
            ? "bg-slate-950 border-cyan-400 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.8),inset_0_0_15px_rgba(6,182,212,0.5)] scale-110" 
            : "bg-slate-900 border-slate-700 text-slate-600 group-hover:border-cyan-600 group-hover:text-cyan-400 group-hover:bg-slate-950 group-hover:scale-110"
        ),
        iconClass: isActive ? "drop-shadow-[0_0_8px_rgba(6,182,212,1)]" : ""
      };
    case 'Founder/SMB': // Gold/Premium Style
      return {
        containerClass: cn(
          base,
          "rounded-xl border-2",
          isActive 
            ? "bg-amber-50 border-amber-500 text-amber-700 shadow-[0_10px_20px_rgba(245,158,11,0.3),inset_0_2px_4px_rgba(255,255,255,1)] scale-110" 
            : "bg-slate-800 border-transparent text-slate-500 group-hover:bg-amber-950 group-hover:text-amber-400 group-hover:border-amber-900 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] group-hover:scale-110"
        ),
        iconClass: isActive ? "stroke-[2.5px] drop-shadow-sm" : "stroke-[2px]"
      };
    case 'Admin/Office': // Minimalist Chrome Style
      return {
        containerClass: cn(
          base,
          "rounded-none border-2 border-slate-900",
          isActive 
            ? "bg-slate-100 text-slate-900 shadow-[8px_8px_0_rgba(0,0,0,1),inset_0_2px_4px_rgba(255,255,255,1)] scale-105 translate-x-[-4px] translate-y-[-4px]" 
            : "bg-slate-800 border-slate-700 text-slate-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-800 group-hover:shadow-[4px_4px_0_rgba(255,255,255,0.1)] group-hover:scale-110"
        ),
        iconClass: "stroke-[3px]"
      };
    case 'Freelance': // Textured/Hand-drawn Style
      return {
        containerClass: cn(
          base,
          "rounded-[40%_60%_70%_30%/50%_40%_60%_50%] border-2 border-dashed",
          isActive 
            ? "bg-orange-100 border-orange-500 text-orange-600 shadow-[0_8px_16px_rgba(234,88,12,0.2),inset_0_2px_4px_rgba(255,255,255,1)] scale-110 rotate-3" 
            : "bg-slate-800 border-slate-700 text-slate-500 group-hover:bg-orange-950 group-hover:border-orange-900 group-hover:text-orange-400 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] group-hover:scale-110 group-hover:rotate-3"
        ),
        iconClass: isActive ? "rotate-[-3deg]" : ""
      };
    case 'Assisted': // Soft Glow/Glass Style
      return {
        containerClass: cn(
          base,
          "rounded-full border border-white/20 backdrop-blur-sm",
          isActive 
            ? "bg-blue-500 text-white shadow-[0_12px_24px_rgba(59,130,246,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] scale-110" 
            : "bg-slate-800/40 text-slate-500 group-hover:bg-blue-500/20 group-hover:text-blue-400"
        ),
        iconClass: isActive ? "animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : ""
      };
    default:
      return {
        containerClass: cn(base, "bg-slate-800 rounded-lg"),
        iconClass: "text-slate-400"
      };
  }
};
