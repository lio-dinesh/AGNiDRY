import React from 'react';
import {
  Boxes,
  CheckCircle2,
  Clock,
  Scale,
  PackageCheck,
  ShieldAlert,
  Sun,
  TrendingDown,
} from 'lucide-react';
import { Batch, PackagingRecord, Alert } from '../../types';
import { HonestyTag } from '../common/HonestyTag';
import { formatWeight } from '../../utils/formatters';

interface MetricsSummaryProps {
  batches: Batch[];
  packagingRecords: PackagingRecord[];
  alerts: Alert[];
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  batches,
  packagingRecords,
  alerts,
}) => {
  const totalBatches = batches.length;
  const completedBatches = batches.filter((b) => b.status === 'COMPLETED').length;
  const failedBatches = batches.filter((b) => b.status === 'FAILED').length;

  // Average Initial Weight
  const avgInitialWeight =
    batches.length > 0
      ? batches.reduce((acc, b) => acc + b.initial_weight, 0) / batches.length
      : 0;

  // Average Final/Current Weight
  const avgFinalWeight =
    batches.length > 0
      ? batches.reduce(
          (acc, b) => acc + (b.final_weight !== null ? b.final_weight : b.current_weight),
          0
        ) / batches.length
      : 0;

  // Average Weight Loss %
  const avgWeightLossPct =
    avgInitialWeight > 0 ? ((avgInitialWeight - avgFinalWeight) / avgInitialWeight) * 100 : 0;

  // Packaging Success Rate
  const totalPacks = packagingRecords.length;
  const successPacks = packagingRecords.filter((p) => p.seal_status === 'SUCCESS').length;
  const packagingSuccessRate = totalPacks > 0 ? Math.round((successPacks / totalPacks) * 100) : 100;

  // Estimated Solar Operational Share
  const estimatedSolarPct = 87; // Prototype estimated value

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Prototype Operational Metrics</h3>
        <HonestyTag type="DEMO DATA" className="text-[10px]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Batches */}
        <div className="artisan-card p-4 border border-slate-200 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Batches</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 metric-value">{totalBatches}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {completedBatches} completed • {failedBatches} failed
          </div>
        </div>

        {/* Avg Drying Duration */}
        <div className="artisan-card p-4 border border-slate-200 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Avg Drying Time</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 metric-value">2.9h</div>
          <div className="text-[11px] text-slate-500 mt-1">vs 2-3 days open sun</div>
        </div>

        {/* Avg Weight Reduction */}
        <div className="artisan-card p-4 border border-slate-200 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Avg Weight Loss</span>
            <TrendingDown className="w-4 h-4 text-terracotta-600" />
          </div>
          <div className="text-2xl font-extrabold text-terracotta-700 metric-value">
            -{avgWeightLossPct.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {formatWeight(avgInitialWeight)} → {formatWeight(avgFinalWeight)}
          </div>
        </div>

        {/* Packaging Success Rate */}
        <div className="artisan-card p-4 border border-slate-200 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Packaging Seal</span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-950 metric-value">
            {packagingSuccessRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {successPacks} sealed / {totalPacks} recorded
          </div>
        </div>
      </div>

      {/* Solar Percentage Notice */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-950">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-700" />
          <span>
            <strong>Solar Autonomy:</strong> Prototype achieved <strong>{estimatedSolarPct}%</strong> solar thermal + PV operation with minimal auxiliary grid/battery draw.
          </span>
        </div>
        <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[9px]" />
      </div>
    </div>
  );
};
