import React, { useState } from 'react';
import {
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Flame,
  QrCode,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Batch, PackageType, SealStatus, PackagingRecord } from '../../types';
import { HonestyTag } from '../common/HonestyTag';

interface PackagingWizardProps {
  batches: Batch[];
  onComplete: (record: Omit<PackagingRecord, 'id'>) => PackagingRecord;
  onOpenQr: (record: PackagingRecord) => void;
}

export const PackagingWizard: React.FC<PackagingWizardProps> = ({
  batches,
  onComplete,
  onOpenQr,
}) => {
  // Step 1: Batch, Step 2: Weight & Quantity, Step 3: Package Type, Step 4: Heat Seal, Step 5: Complete
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const completedOrDryingBatches = batches.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'DRYING'
  );
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    completedOrDryingBatches[0]?.batch_id || ''
  );
  const [packageType, setPackageType] = useState<PackageType>('BOX_100G');
  const [quantity, setQuantity] = useState<number>(50);
  const [packageWeight, setPackageWeight] = useState<number>(100);
  const [material, setMaterial] = useState<string>('Recycled Kraft Paper Box');
  const [artisanName, setArtisanName] = useState<string>('Lakshmi Devi (SHG #1)');
  const [notes, setNotes] = useState<string>('');

  // Sealer Emulation State
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [sealStatus, setSealStatus] = useState<SealStatus>('PENDING');
  const [generatedRecord, setGeneratedRecord] = useState<PackagingRecord | null>(null);

  const selectedBatch = batches.find((b) => b.batch_id === selectedBatchId);

  // Packaging Presets
  const handleTypeSelect = (type: PackageType) => {
    setPackageType(type);
    if (type === 'POUCH_50G') {
      setPackageWeight(50);
      setQuantity(25);
      setMaterial('Bio-Polymer Moisture Barrier Pouch');
    } else if (type === 'BOX_100G') {
      setPackageWeight(100);
      setQuantity(50);
      setMaterial('Recycled Kraft Paper Box');
    } else if (type === 'BUNDLE_250G') {
      setPackageWeight(250);
      setQuantity(120);
      setMaterial('Eco-Craft Paper Sleeve');
    } else if (type === 'BULK_1KG') {
      setPackageWeight(1000);
      setQuantity(500);
      setMaterial('Heavy Duty Corrugated Carton');
    }
  };

  // Trigger Physical Sealer Emulation (2.5s cycle)
  const handleTriggerSeal = () => {
    setIsSealing(true);
    setSealStatus('PENDING');

    setTimeout(() => {
      setIsSealing(false);
      setSealStatus('SUCCESS');

      const nextId = `PKG-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newRecord = onComplete({
        package_id: nextId,
        batch_id: selectedBatchId,
        product_name: selectedBatch?.product_type || 'AgniDry Premium Agarbatti',
        package_type: packageType,
        quantity: quantity,
        package_weight: packageWeight,
        material: material,
        seal_status: 'SUCCESS',
        start_time: new Date(Date.now() - 30000).toISOString(),
        completion_time: new Date().toISOString(),
        notes: notes || 'Standard impulse heat-seal operation.',
        artisan_name: artisanName,
      });

      setGeneratedRecord(newRecord);
      setCurrentStep(5);
    }, 2400);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSealStatus('PENDING');
    setGeneratedRecord(null);
  };

  return (
    <div className="artisan-card p-6 border border-[#EAE5DC] bg-white shadow-xs">
      {/* Wizard Header & Stepper */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Compact Packaging Station</h2>
            <HonestyTag type="FACT" className="text-[10px]" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step artisan packing, impulse heat-sealing, and digital QR traceability.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 text-xs">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === currentStep
                  ? 'bg-amber-500 text-white shadow-xs'
                  : step < currentStep
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Batch */}
      {currentStep === 1 && (
        <div className="py-6 space-y-4 max-w-lg mx-auto">
          <h3 className="font-bold text-slate-900 text-sm">
            Step 1: Select Dried Batch to Package
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Available Solar Dried Batches:
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-500"
            >
              {completedOrDryingBatches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_id} — {b.product_type} ({b.status})
                </option>
              ))}
            </select>
          </div>

          {selectedBatch && (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-950">
              <div className="font-bold">{selectedBatch.product_type}</div>
              <div>Current weight available: {selectedBatch.final_weight || selectedBatch.current_weight} kg</div>
              <div>Batch status: {selectedBatch.status}</div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedBatchId}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Continue to Sizing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Sizing & Packaging Format */}
      {currentStep === 2 && (
        <div className="py-6 space-y-5 max-w-lg mx-auto">
          <h3 className="font-bold text-slate-900 text-sm">
            Step 2: Select Package Format & Sizing
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'BOX_100G', label: 'Box 100g', desc: '50 sticks • Retail standard' },
              { type: 'POUCH_50G', label: 'Pouch 50g', desc: '25 sticks • Foil barrier' },
              { type: 'BUNDLE_250G', label: 'Bundle 250g', desc: '120 sticks • Co-op bulk' },
              { type: 'BULK_1KG', label: 'Bulk 1kg', desc: '500 sticks • Wholesale' },
            ].map((preset) => (
              <button
                key={preset.type}
                type="button"
                onClick={() => handleTypeSelect(preset.type as PackageType)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  packageType === preset.type
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{preset.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{preset.desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sticks per Pack (Qty)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Net Pack Weight (grams)
              </label>
              <input
                type="number"
                value={packageWeight}
                onChange={(e) => setPackageWeight(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-slate-600 text-sm font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Artisan & Material Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Material & Artisan Details */}
      {currentStep === 3 && (
        <div className="py-6 space-y-4 max-w-lg mx-auto">
          <h3 className="font-bold text-slate-900 text-sm">
            Step 3: Packaging Material & Artisan Attribution
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Packaging Material
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Artisan Operator / SHG Unit
            </label>
            <input
              type="text"
              value={artisanName}
              onChange={(e) => setArtisanName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Packaging Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Moisture barrier validated, sealed at 145°C."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-slate-600 text-sm font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Proceed to Heat Sealer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Physical Heat Sealer Emulation */}
      {currentStep === 4 && (
        <div className="py-8 space-y-5 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <Flame className={`w-8 h-8 ${isSealing ? 'animate-bounce text-terracotta-600' : ''}`} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isSealing ? 'Clamping & Heat Sealing...' : 'Ready for Impulse Heat Sealer'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isSealing
                ? 'Applying 145°C impulse thermal bar across packaging pouch lips (2.2s dwell time).'
                : 'Insert package into the compact sealer jaws and press the foot lever or button below.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1 text-slate-700 max-w-xs mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Batch:</span>
              <span className="font-bold">{selectedBatchId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pack Format:</span>
              <span className="font-semibold">{packageType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Weight:</span>
              <span className="font-semibold">{packageWeight} g</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTriggerSeal}
              disabled={isSealing}
              className={`px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all ${
                isSealing
                  ? 'bg-amber-400 text-slate-900 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-terracotta-600 hover:from-amber-600 hover:to-terracotta-700 text-white'
              }`}
            >
              {isSealing ? 'Sealing in Progress...' : 'Perform Heat Seal (Simulate Sealer)'}
            </button>
          </div>

          <div className="flex justify-start pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              disabled={isSealing}
              className="px-4 py-2 text-slate-500 text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Adjust Details
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Completed & QR Generation */}
      {currentStep === 5 && generatedRecord && (
        <div className="py-6 space-y-5 max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase">
              Packaging & Seal Validated: SUCCESS
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              Package ID: {generatedRecord.package_id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Traceability record linked to batch {generatedRecord.batch_id}. Ready for retail dispatch.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs text-left space-y-1.5 text-emerald-950">
            <div className="flex justify-between font-medium">
              <span>Product:</span>
              <span className="font-bold">{generatedRecord.product_name}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Quantity:</span>
              <span>{generatedRecord.quantity} sticks ({generatedRecord.package_weight}g)</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Material:</span>
              <span>{generatedRecord.material}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Artisan:</span>
              <span>{generatedRecord.artisan_name}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onOpenQr(generatedRecord)}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>View & Print Traceability QR</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Package Next Unit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
