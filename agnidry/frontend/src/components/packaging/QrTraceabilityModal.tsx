import React from 'react';
import { X, QrCode, Printer, CheckCircle2, ShieldCheck, Calendar, User, Package } from 'lucide-react';
import { PackagingRecord } from '../../types';
import { generateSvgQrDataUri, formatDateTime } from '../../utils/formatters';
import { HonestyTag } from '../common/HonestyTag';

interface QrTraceabilityModalProps {
  packageRecord: PackagingRecord | null;
  onClose: () => void;
}

export const QrTraceabilityModal: React.FC<QrTraceabilityModalProps> = ({
  packageRecord,
  onClose,
}) => {
  if (!packageRecord) return null;

  // Build secure, sanitized traceability payload (strictly business metadata, zero personal credentials)
  const qrPayload = JSON.stringify({
    system: 'AgniDry-SIH26022',
    package_id: packageRecord.package_id,
    batch_id: packageRecord.batch_id,
    product: packageRecord.product_name,
    weight_g: packageRecord.package_weight,
    artisan_unit: packageRecord.artisan_name,
    seal: packageRecord.seal_status,
    packed_on: packageRecord.completion_time,
  });

  const qrUri = generateSvgQrDataUri(qrPayload);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="artisan-card w-full max-w-md bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Package Traceability</h3>
              <p className="text-xs text-slate-500">AgniDry Digital Verification Certificate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card */}
        <div className="my-4 p-5 bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border border-amber-200 text-center">
          {/* QR Code Container */}
          <div className="w-44 h-44 mx-auto p-2 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
            <img
              src={qrUri}
              alt={`QR code for ${packageRecord.package_id}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-3">
            <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              {packageRecord.package_id}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 mt-2">
            {packageRecord.product_name}
          </h4>

          {/* Traceability Metadata Grid */}
          <div className="mt-4 pt-3 border-t border-amber-200/60 text-left text-xs space-y-2 text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-amber-700" />
                Batch Origin:
              </span>
              <span className="font-mono font-bold text-slate-900">{packageRecord.batch_id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                Artisan Producer:
              </span>
              <span className="font-semibold text-slate-900">{packageRecord.artisan_name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-700" />
                Packaging Date:
              </span>
              <span className="font-medium text-slate-900">
                {formatDateTime(packageRecord.completion_time)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                Heat Seal Verification:
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {packageRecord.seal_status}
              </span>
            </div>
          </div>
        </div>

        {/* Transparency note */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="text-[11px]">Consumer Scannable (No App Needed)</span>
          <HonestyTag type="FACT" className="text-[10px]" />
        </div>

        {/* Print / Done Actions */}
        <div className="mt-4 flex items-center gap-2 justify-end">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Label
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
