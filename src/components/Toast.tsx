import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  onUndo?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 text-amber-100 border-amber-500/40 shadow-amber-950/50'
              : 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/50'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-indigo-400" />
            )}
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-bold">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-white/80 mt-0.5">{toast.message}</p>
            )}
            {toast.onUndo && (
              <button
                onClick={() => {
                  toast.onUndo && toast.onUndo();
                  onDismiss(toast.id);
                }}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 underline cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>تراجع عن الإجراء</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white p-1 rounded-lg shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
