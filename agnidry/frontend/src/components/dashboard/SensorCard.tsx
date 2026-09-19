import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  subtext: string;
  trend?: 'up' | 'down' | 'stable';
  colorTheme: 'amber' | 'blue' | 'emerald' | 'purple';
  isSimulated?: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  subtext,
  colorTheme,
}) => {
  const themeClasses = {
    amber: {
      bg: 'bg-amber-50/50',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-800',
      textAccent: 'text-amber-950',
    },
    blue: {
      bg: 'bg-sky-50/50',
      border: 'border-sky-200/80',
      iconBg: 'bg-sky-100 text-sky-800',
      textAccent: 'text-sky-950',
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-800',
      textAccent: 'text-emerald-950',
    },
    purple: {
      bg: 'bg-purple-50/50',
      border: 'border-purple-200/80',
      iconBg: 'bg-purple-100 text-purple-800',
      textAccent: 'text-purple-950',
    },
  };

  const theme = themeClasses[colorTheme];

  return (
    <div
      className={`artisan-card p-5 border ${theme.border} ${theme.bg} artisan-card-hover flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${theme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="my-3 flex items-baseline gap-1.5">
        <span className={`text-4xl sm:text-5xl font-extrabold metric-value ${theme.textAccent}`}>
          {value}
        </span>
        <span className="text-sm sm:text-base font-semibold text-slate-500">{unit}</span>
      </div>

      <div className="text-xs text-slate-600 font-medium pt-2 border-t border-slate-200/60 flex items-center justify-between">
        <span>{subtext}</span>
      </div>
    </div>
  );
};
