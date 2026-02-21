import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores/useToastStore';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
  error: 'border-red-500/40 bg-red-500/15 text-red-400',
  info: 'border-blue-500/40 bg-blue-500/15 text-blue-400',
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-lg backdrop-blur-sm ${colorMap[toast.type]}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
