'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeConfig: Record<ToastType, { icon: typeof CheckCircle2; borderColor: string; iconColor: string }> = {
  success: { icon: CheckCircle2,    borderColor: 'border-success-600', iconColor: 'text-success-600' },
  error:   { icon: AlertCircle,     borderColor: 'border-error-600',   iconColor: 'text-error-600'   },
  warning: { icon: AlertTriangle,   borderColor: 'border-warning-600', iconColor: 'text-warning-600' },
  info:    { icon: Info,            borderColor: 'border-info-600',    iconColor: 'text-info-600'    },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const { icon: Icon, borderColor, iconColor } = typeConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={[
        'flex items-start gap-3 max-w-[380px] w-full bg-white rounded-md shadow-lg',
        'border-l-4 p-4 animate-toast-in',
        borderColor,
      ].join(' ')}
      role="alert"
    >
      <Icon className={['h-5 w-5 mt-0.5 shrink-0', iconColor].join(' ')} />
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-semibold text-neutral-900">{toast.title}</p>
        {toast.message && (
          <p className="text-body-sm text-neutral-500 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-0.5 text-neutral-400 hover:text-neutral-700 transition-colors"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...opts, id }]);
  }, []);

  const value: ToastContextValue = {
    toast:   add,
    success: (title, message) => add({ type: 'success', title, message }),
    error:   (title, message) => add({ type: 'error',   title, message }),
    warning: (title, message) => add({ type: 'warning', title, message }),
    info:    (title, message) => add({ type: 'info',    title, message }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
