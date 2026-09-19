import React from 'react';
import { Loader2, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Connecting to AgniDry sensors...' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
    <p className="text-sm font-medium text-slate-700">{message}</p>
    <p className="text-xs text-slate-400 mt-1">Reading real-time load cell and ambient telemetry</p>
  </div>
);

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300">
    <div className="p-3 bg-amber-50 text-amber-700 rounded-full mb-3">
      {icon || <Inbox className="w-6 h-6" />}
    </div>
    <h3 className="text-base font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 max-w-sm mt-1">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Sensor Communication Notice',
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 rounded-2xl border border-rose-200">
    <div className="p-3 bg-rose-100 text-rose-700 rounded-full mb-3">
      <AlertTriangle className="w-6 h-6" />
    </div>
    <h3 className="text-base font-bold text-rose-950">{title}</h3>
    <p className="text-sm text-rose-800 max-w-md mt-1">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Connection
      </button>
    )}
  </div>
);
