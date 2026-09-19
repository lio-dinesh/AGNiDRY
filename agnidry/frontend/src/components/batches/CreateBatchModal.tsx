import React, { useState } from 'react';
import { X, PlusCircle, Scale, Sparkles } from 'lucide-react';
import { Batch } from '../../types';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (batch: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) => void;
  existingBatchCount: number;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingBatchCount,
}) => {
  const nextIdNum = String(existingBatchCount + 1).padStart(3, '0');
  const [batchId, setBatchId] = useState(`AG-2026-${nextIdNum}`);
  const [productType, setProductType] = useState('Mogra Agarbatti (Classic Floral)');
  const [initialWeight, setInitialWeight] = useState('2.00');
  const [notes, setNotes] = useState('');
  const [targetLoss, setTargetLoss] = useState('36.0');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(initialWeight) || 2.0;
    const targetLossNum = parseFloat(targetLoss) || 36.0;

    onCreate({
      batch_id: batchId,
      device_id: 'AGNI-001',
      product_type: productType,
      initial_weight: weightNum,
      current_weight: weightNum,
      final_weight: null,
      start_time: new Date().toISOString(),
      end_time: null,
      duration: '0m',
      status: 'DRYING',
      notes: notes || 'Freshly loaded into solar chamber by artisan.',
      target_moisture_loss_pct: targetLossNum,
    });

    onClose();
  };

  const productOptions = [
    'Mogra Agarbatti (Classic Floral)',
    'Sandalwood Premium Agarbatti',
    'Rose Petal Agarbatti',
    'Natural Sambrani Dhoop Sticks',
    'Lavender Calming Incense',
    'Kewra Forest Essence',
    'Custom Artisan Formulation',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="artisan-card w-full max-w-lg bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Register New Drying Batch</h3>
              <p className="text-xs text-slate-500">AgniDry Solar Chamber Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Batch Identifier</label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm font-bold bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Type / Fragrance</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
            >
              {productOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Wet Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0.2"
                  max="10.0"
                  value={initialWeight}
                  onChange={(e) => setInitialWeight(e.target.value)}
                  required
                  className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                />
                <span className="absolute right-3 top-2 text-slate-400 font-medium">kg</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Weight Loss (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="20"
                  max="50"
                  value={targetLoss}
                  onChange={(e) => setTargetLoss(e.target.value)}
                  required
                  className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                />
                <span className="absolute right-3 top-2 text-slate-400 font-medium">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Artisan Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Rolled with organic bamboo core, natural gum binder..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-bold">Artisan Guide:</span> Once loaded, place sticks horizontally
            on the perforated wire mesh rack. The ESP32 load cell will zero-calibrate and begin
            autonomous drying.
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-sm transition-colors"
            >
              Start Drying Cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
