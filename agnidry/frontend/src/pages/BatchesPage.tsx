import React, { useState } from 'react';
import { PlusCircle, Filter, Boxes } from 'lucide-react';
import { useAgniDry } from '../context/AgniDryContext';
import { BatchCard } from '../components/batches/BatchCard';
import { CreateBatchModal } from '../components/batches/CreateBatchModal';
import { BatchDetailsModal } from '../components/batches/BatchDetailsModal';
import { HonestyTag } from '../components/common/HonestyTag';
import { Batch, BatchStatus } from '../types';

export const BatchesPage: React.FC = () => {
  const { batches, createBatch, updateBatchStatus } = useAgniDry();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [inspectingBatch, setInspectingBatch] = useState<Batch | null>(null);

  const filteredBatches = batches.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  const filterOptions: { label: string; value: string }[] = [
    { label: 'All Batches', value: 'ALL' },
    { label: 'Drying Now', value: 'DRYING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Ready', value: 'READY' },
    { label: 'Paused', value: 'PAUSED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Drying Batch Operations
            </h2>
            <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track individual artisan batches from raw paste loading through verified weight reduction.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Load & Start New Batch</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === opt.value
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {opt.label} ({opt.value === 'ALL' ? batches.length : batches.filter((b) => b.status === opt.value).length})
          </button>
        ))}
      </div>

      {/* Batch Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map((batch) => (
          <BatchCard
            key={batch.batch_id}
            batch={batch}
            onStatusChange={(id, newStatus) => updateBatchStatus(id, newStatus)}
            onInspect={(b) => setInspectingBatch(b)}
          />
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <Boxes className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No batches match this filter.</p>
        </div>
      )}

      {/* Modals */}
      <CreateBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createBatch}
        existingBatchCount={batches.length}
      />

      <BatchDetailsModal
        batch={inspectingBatch}
        onClose={() => setInspectingBatch(null)}
      />
    </div>
  );
};
