import { useUIStore } from '../store/useUIStore';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg shadow-black/20 min-w-[250px] animate-in slide-in-from-top-2 fade-in duration-300",
            toast.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : '',
            toast.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : '',
            toast.type === 'info' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500' : ''
          )}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          
          <p className="font-medium text-sm flex-1">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/10 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
