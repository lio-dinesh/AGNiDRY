import React from 'react';
import { Package, Clock, Scale, ArrowDownRight, CheckCircle2, PauseCircle, PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Batch } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { HonestyTag } from '../common/HonestyTag';
import { formatWeight, calculateWeightLossPct, calculateElapsedTime, formatDateTime } from '../../utils/formatters';

interface CurrentBatchCardProps {
  batch: Batch | undefined;
  onStatusChange?: (status: 'DRYING' | 'PAUSED' | 'COMPLETED') => void;
}

export const CurrentBatchCard: React.FC<CurrentBatchCardProps> = ({ batch, onStatusChange }) => {
  if (!batch) {
    return (
      <div className="artisan-card p-6 border border-[#EAE5DC] bg-white text-center">
        <Package className="w-8 h-8 text-amber-600 mx-auto mb-2 opacity-60" />
        <h3 className="font-bold text-slate-800 text-sm">No Active Drying Batch</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Load new raw incense sticks into the solar drying chamber and register a batch to start monitoring.
        </p>
        <Link
          to="/batches"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Load & Register Batch
        </Link>
      </div>
    );
  }

  const weightReductionPct = calculateWeightLossPct(batch.initial_weight, batch.current_weight);
  const elapsedTime = calculateElapsedTime(batch.start_time, batch.end_time);

  // Prototype drying progress calculation towards target 36% weight drop
  const targetPct = batch.target_moisture_loss_pct || 36.0;
  const progressRatio = Math.min(100, Math.round((weightReductionPct / targetPct) * 100));

  return (
    <div className="artisan-card p-5 sm:p-6 border border-amber-200/90 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 shadow-sm">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900/70">
              Active Drying Operation
            </span>
            <StatusBadge status={batch.status} size="sm" />
            <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[10px]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <span>{batch.batch_id}</span>
            <span className="text-base font-normal text-slate-500">• {batch.product_type}</span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {batch.status === 'DRYING' && onStatusChange && (
            <button
              onClick={() => onStatusChange('PAUSED')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              Pause
            </button>
          )}

          {batch.status === 'PAUSED' && onStatusChange && (
            <button
              onClick={() => onStatusChange('DRYING')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Resume
            </button>
          )}

          {batch.status === 'DRYING' && onStatusChange && (
            <button
              onClick={() => onStatusChange('COMPLETED')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Complete
            </button>
          )}

          {batch.status === 'COMPLETED' && (
            <Link
              to="/packaging"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Package This Batch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        <div className="p-3 bg-white rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Initial Weight</span>
          </div>
          <div className="text-xl font-bold text-slate-900 metric-value mt-1">
            {formatWeight(batch.initial_weight)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Loaded fresh paste</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Current Weight</span>
          </div>
          <div className="text-xl font-bold text-emerald-950 metric-value mt-1">
            {formatWeight(batch.current_weight)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Live load cell reading</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Weight Loss</span>
          </div>
          <div className="text-xl font-bold text-terracotta-700 metric-value mt-1">
            -{weightReductionPct.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Target: ~{targetPct}%</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Elapsed Time</span>
          </div>
          <div className="text-xl font-bold text-slate-900 metric-value mt-1">
            {elapsedTime}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Started: {formatDateTime(batch.start_time).split(',')[1]}</div>
        </div>
      </div>

      {/* Explicit Prototype Drying Progress Indicator */}
      <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-amber-950 flex items-center gap-1.5">
            Prototype drying progress indicator
            <span className="text-[10px] text-amber-700 font-normal">
              (Calculated from load-cell weight delta, NOT actual lab moisture %)
            </span>
          </span>
          <span className="font-bold text-amber-900">{progressRatio}%</span>
        </div>
        <div className="w-full bg-amber-200/70 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressRatio}%` }}
          />
        </div>
      </div>
    </div>
  );
};
