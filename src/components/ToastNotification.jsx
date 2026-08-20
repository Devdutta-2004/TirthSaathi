import React from 'react';
import { useYatra } from '../context/YatraContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toasts, removeToast } = useYatra();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-white border-yatra-blue/20 text-navy-800';
        let icon = <Info className="w-5 h-5 text-yatra-bright flex-shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-50 border-emerald-300 text-emerald-950';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        } else if (toast.type === 'emergency' || toast.type === 'danger') {
          bg = 'bg-red-50 border-red-300 text-red-950';
          icon = <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 animate-bounce" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-50 border-amber-300 text-amber-950';
          icon = <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-float backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bg}`}
          >
            {icon}
            <div className="flex-1">
              <h4 className="font-semibold text-sm leading-snug">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
