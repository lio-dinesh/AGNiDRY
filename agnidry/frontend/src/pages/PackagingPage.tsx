import React, { useState } from 'react';
import { PackageCheck, QrCode, Sparkles, Layers } from 'lucide-react';
import { useAgniDry } from '../context/AgniDryContext';
import { PackagingWizard } from '../components/packaging/PackagingWizard';
import { PackagingRecordCard } from '../components/packaging/PackagingRecordCard';
import { QrTraceabilityModal } from '../components/packaging/QrTraceabilityModal';
import { HonestyTag } from '../components/common/HonestyTag';
import { PackagingRecord } from '../types';

export const PackagingPage: React.FC = () => {
  const { batches, packagingRecords, addPackagingRecord } = useAgniDry();

  const [activeQrModalRecord, setActiveQrModalRecord] = useState<PackagingRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Compact Packaging & Traceability Station
            </h2>
            <HonestyTag type="FACT" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            MSME rural packaging workflow: batch selection, impulse sealing, weight verification, and consumer QR traceability.
          </p>
        </div>
      </div>

      {/* Guided 5-Step Packaging Wizard */}
      <PackagingWizard
        batches={batches}
        onComplete={addPackagingRecord}
        onOpenQr={(record) => setActiveQrModalRecord(record)}
      />

      {/* Packaging Records History Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Completed Packaging Inventory
            </h3>
            <p className="text-xs text-slate-500">
              Hermetically sealed retail packages ready for village co-operative dispatch.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {packagingRecords.length} units packaged
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packagingRecords.map((record) => (
            <PackagingRecordCard
              key={record.id || record.package_id}
              record={record}
              onViewQr={(r) => setActiveQrModalRecord(r)}
            />
          ))}
        </div>
      </div>

      {/* QR Traceability Modal */}
      <QrTraceabilityModal
        packageRecord={activeQrModalRecord}
        onClose={() => setActiveQrModalRecord(null)}
      />
    </div>
  );
};
