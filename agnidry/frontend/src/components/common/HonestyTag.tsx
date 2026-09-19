import React from 'react';
import { HonestyTagType } from '../../types';

interface HonestyTagProps {
  type: HonestyTagType;
  className?: string;
}

export const HonestyTag: React.FC<HonestyTagProps> = ({ type, className = '' }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';

  switch (type) {
    case 'FACT':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'ASSUMPTION':
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-300';
      break;
    case 'PROTOTYPE CONFIGURATION':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'DEMO DATA':
      badgeStyle = 'bg-purple-50 text-purple-800 border-purple-300';
      break;
    case 'RESEARCH REQUIRED':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-300';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border uppercase ${badgeStyle} ${className}`}
      title={`Engineering Honesty Classification: ${type}`}
    >
      [{type}]
    </span>
  );
};
