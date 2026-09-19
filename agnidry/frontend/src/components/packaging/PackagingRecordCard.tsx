import React from 'react';
import { Package, QrCode, Clock, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import { PackagingRecord } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

interface PackagingRecordCardProps {
  record: PackagingRecord;
  onViewQr: (record: PackagingRecord) => void;
}

export const PackagingRecordCard: React.FC<PackagingRecordCardProps> = ({ record, onViewQr }) => {
  return (
    <div className="artisan-card p-4 border border-[#EAE5DC] bg-white artisan-card-hover flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
            {record.package_id}
          </span>
          <StatusBadge status={record.seal_status} size="sm" />
        </div>

        <h4 className="font-bold text-slate-900 text-sm">{record.product_name}</h4>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <span>Batch: <strong className="font-mono text-amber-900">{record.batch_id}</strong></span>
          <span>•</span>
          <span>{record.package_type.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="my-3 py-2.5 bg-slate-50 rounded-xl px-3 text-xs space-y-1 text-slate-700">
        <div className="flex justify-between">
          <span className="text-slate-500">Units / Weight:</span>
          <span className="font-semibold">{record.quantity} sticks ({record.package_weight}g)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Material:</span>
          <span className="truncate max-w-[160px]">{record.material}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <User className="w-3 h-3" />
            {record.artisan_name}
          </span>
          <span className="text-slate-400">{formatDateTime(record.completion_time).split(',')[0]}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => onViewQr(record)}
          className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-700" />
          <span>Inspect QR Certificate</span>
        </button>
      </div>
    </div>
  );
};
