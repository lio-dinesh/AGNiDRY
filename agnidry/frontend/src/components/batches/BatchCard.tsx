import React from 'react';
import { Package, Clock, Scale, ArrowRight, Play, Pause, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Batch, BatchStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatWeight, calculateWeightLossPct, formatDateTime, calculateElapsedTime } from '../../utils/formatters';

interface BatchCardProps {
  batch: Batch;
  onStatusChange: (batchId: string, newStatus: BatchStatus) => void;
  onInspect: (batch: Batch) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, onStatusChange, onInspect }) => {
  const weightReductionPct = calculateWeightLossPct(
    batch.initial_weight,
    batch.final_weight !== null ? batch.final_weight : batch.current_weight
  );

  return (
    <div className="artisan-card p-5 border border-[#EAE5DC] bg-white artisan-card-hover flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {batch.batch_id}
          </span>
          <StatusBadge status={batch.status} size="sm" />
        </div>

        <h3 className="text-base font-bold text-slate-900 line-clamp-1">{batch.product_type}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{batch.notes || 'No batch notes added.'}</p>
      </div>

      {/* Metric Row */}
      <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-100 text-center">
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Initial</div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 metric-value mt-0.5">
            {formatWeight(batch.initial_weight)}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">
            {batch.status === 'COMPLETED' ? 'Final' : 'Current'}
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-900 metric-value mt-0.5">
            {formatWeight(batch.final_weight !== null ? batch.final_weight : batch.current_weight)}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Loss %</div>
          <div className="text-xs sm:text-sm font-bold text-terracotta-700 metric-value mt-0.5">
            -{weightReductionPct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Timing and Actions */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {batch.duration || calculateElapsedTime(batch.start_time, batch.end_time)}
        </span>
        <span>{formatDateTime(batch.start_time).split(',')[0]}</span>
      </div>

      {/* State Transitions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onInspect(batch)}
          className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors text-center"
        >
          Details
        </button>

        {batch.status === 'READY' && (
          <button
            onClick={() => onStatusChange(batch.batch_id, 'DRYING')}
            className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            Start
          </button>
        )}

        {batch.status === 'DRYING' && (
          <>
            <button
              onClick={() => onStatusChange(batch.batch_id, 'PAUSED')}
              className="py-1.5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold transition-colors"
              title="Pause Drying"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onStatusChange(batch.batch_id, 'COMPLETED')}
              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </button>
          </>
        )}

        {batch.status === 'PAUSED' && (
          <button
            onClick={() => onStatusChange(batch.batch_id, 'DRYING')}
            className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            Resume
          </button>
        )}

        {batch.status === 'COMPLETED' && (
          <Link
            to="/packaging"
            className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <span>Package</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
