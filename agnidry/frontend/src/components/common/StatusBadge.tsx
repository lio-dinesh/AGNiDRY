import React from 'react';
import { BatchStatus, SealStatus } from '../../types';

interface StatusBadgeProps {
  status: BatchStatus | SealStatus | 'ONLINE' | 'OFFLINE' | 'SIMULATED';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'DRYING':
      color = 'bg-amber-50 text-amber-800 border-amber-300';
      dotColor = 'bg-amber-500 animate-pulse';
      break;
    case 'COMPLETED':
    case 'SUCCESS':
    case 'ONLINE':
      color = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      dotColor = 'bg-emerald-500';
      break;
    case 'READY':
      color = 'bg-blue-50 text-blue-800 border-blue-200';
      dotColor = 'bg-blue-500';
      break;
    case 'PAUSED':
    case 'PENDING':
      color = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-400';
      break;
    case 'FAILED':
    case 'OFFLINE':
    case 'CANCELLED':
      color = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-500';
      break;
    case 'SIMULATED':
      color = 'bg-purple-50 text-purple-800 border-purple-300';
      dotColor = 'bg-purple-500';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${sizeClasses[size]} ${color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
