import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, PackageCheck, LineChart, ShieldAlert } from 'lucide-react';

interface QuickActionGridProps {
  onNewBatchClick: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ onNewBatchClick }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <button
        onClick={onNewBatchClick}
        className="artisan-card p-4 border border-amber-200 bg-white hover:bg-amber-50/60 transition-all text-left group flex flex-col justify-between"
      >
        <div className="p-2.5 bg-amber-500 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="font-bold text-slate-900 text-sm">New Drying Batch</div>
          <p className="text-xs text-slate-500 mt-0.5">Load raw sticks & start timer</p>
        </div>
      </button>

      <Link
        to="/packaging"
        className="artisan-card p-4 border border-emerald-200 bg-white hover:bg-emerald-50/60 transition-all text-left group flex flex-col justify-between"
      >
        <div className="p-2.5 bg-emerald-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
          <PackageCheck className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="font-bold text-slate-900 text-sm">Compact Packaging</div>
          <p className="text-xs text-slate-500 mt-0.5">Seal & generate QR trace</p>
        </div>
      </Link>

      <Link
        to="/monitor"
        className="artisan-card p-4 border border-sky-200 bg-white hover:bg-sky-50/60 transition-all text-left group flex flex-col justify-between"
      >
        <div className="p-2.5 bg-sky-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
          <LineChart className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="font-bold text-slate-900 text-sm">Drying Curves</div>
          <p className="text-xs text-slate-500 mt-0.5">Live temp, humidity & weight</p>
        </div>
      </Link>

      <Link
        to="/alerts"
        className="artisan-card p-4 border border-rose-200 bg-white hover:bg-rose-50/60 transition-all text-left group flex flex-col justify-between"
      >
        <div className="p-2.5 bg-rose-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="font-bold text-slate-900 text-sm">Safety Status</div>
          <p className="text-xs text-slate-500 mt-0.5">ESP32 automated safeguards</p>
        </div>
      </Link>
    </div>
  );
};
