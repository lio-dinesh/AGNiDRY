import React from 'react';
import { X, Package, Clock, Scale, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { Batch } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { HonestyTag } from '../common/HonestyTag';
import { formatWeight, calculateWeightLossPct, formatDateTime } from '../../utils/formatters';

interface BatchDetailsModalProps {
  batch: Batch | null;
  onClose: () => void;
}

export const BatchDetailsModal: React.FC<BatchDetailsModalProps> = ({ batch, onClose }) => {
  if (!batch) return null;

  const lossPct = calculateWeightLossPct(
    batch.initial_weight,
    batch.final_weight !== null ? batch.final_weight : batch.current_weight
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="artisan-card w-full max-w-lg bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {batch.batch_id}
              </span>
              <StatusBadge status={batch.status} size="sm" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{batch.product_type}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Weight Delta Card */}
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Initial Weight</div>
              <div className="text-base font-bold text-slate-900 metric-value mt-1">
                {formatWeight(batch.initial_weight)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">
                {batch.status === 'COMPLETED' ? 'Final Weight' : 'Current Weight'}
              </div>
              <div className="text-base font-bold text-emerald-950 metric-value mt-1">
                {formatWeight(batch.final_weight !== null ? batch.final_weight : batch.current_weight)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Loss Percentage</div>
              <div className="text-base font-bold text-terracotta-700 metric-value mt-1">
                -{lossPct.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Timing details */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-slate-700 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Chamber Device:</span>
              <span className="font-semibold">{batch.device_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Started At:</span>
              <span className="font-semibold">{formatDateTime(batch.start_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Completed At:</span>
              <span className="font-semibold">{formatDateTime(batch.end_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Duration:</span>
              <span className="font-semibold">{batch.duration || 'In progress'}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <span className="text-slate-500 font-semibold text-xs block mb-1">Artisan Batch Notes:</span>
            <p className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
              {batch.notes || 'Standard artisanal rolling procedure.'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Created: {formatDateTime(batch.created_at)}</span>
            <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[10px]" />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
