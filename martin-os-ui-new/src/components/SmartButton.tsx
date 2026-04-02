"use client";

import { useActionExecutor } from "../hooks/useActionExecutor";
import { ACTIONS } from "../config/actionRegistry";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

type SmartButtonProps = {
  actionId: string;
  payload?: any;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSuccess?: (data: any) => void;
  disabled?: boolean;
  title?: string;
};

export default function SmartButton({
  actionId,
  payload,
  className,
  children,
  variant = 'default',
  onClick,
  onSuccess,
  disabled,
  title,
}: SmartButtonProps) {
  const { run, loading, error, requestId } = useActionExecutor();
  const actionDef = ACTIONS[actionId];

  if (!actionDef) {
    return (
      <button 
        disabled 
        className={cn("opacity-50 cursor-not-allowed px-4 py-2 text-xs font-bold uppercase border border-dashed border-slate-300 rounded-xl", className)}
        title={title || `Action ${actionId} not implemented`}
      >
        Coming soon: {actionId}
      </button>
    );
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick(e);
    }

    if (actionDef.kind === 'navigate' && actionDef.route) {
      window.location.href = actionDef.route;
      return;
    }

    if (actionDef.kind === 'open_modal') {
      toast.info(`Opening ${actionDef.label}...`);
      onSuccess?.(null);
      return;
    }

    const result = await run(actionId, payload);
    
    if (result.ok) {
      toast.success(result.result?.message || `${actionDef.label} completed`);
      onSuccess?.(result.result);
    } else {
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="font-bold">Action Failed</div>
          <div className="text-xs">{result.error}</div>
          {result.requestId && <div className="text-[10px] opacity-70 font-mono">ID: {result.requestId}</div>}
        </div>
      );
    }
  };

  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 rounded-xl";
  
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
    ghost: "hover:bg-slate-800 hover:text-slate-100 text-slate-300",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={loading || disabled}
      className={cn(baseStyles, variants[variant], className)}
      title={title || actionDef.label}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : null}
      {children || actionDef.label}
    </button>
  );
}
