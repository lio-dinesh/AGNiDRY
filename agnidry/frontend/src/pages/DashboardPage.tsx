import React, { useState } from 'react';
import { Thermometer, Droplets, Scale, BatteryCharging, Sparkles } from 'lucide-react';
import { useAgniDry } from '../context/AgniDryContext';
import { SensorCard } from '../components/dashboard/SensorCard';
import { EnergyStatusCard } from '../components/dashboard/EnergyStatusCard';
import { ActuatorCard } from '../components/dashboard/ActuatorCard';
import { CurrentBatchCard } from '../components/dashboard/CurrentBatchCard';
import { QuickActionGrid } from '../components/dashboard/QuickActionGrid';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { CreateBatchModal } from '../components/batches/CreateBatchModal';
import { HonestyTag } from '../components/common/HonestyTag';
import { formatTemp, formatHumidity, formatWeight } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    currentSensors,
    activeBatch,
    batches,
    createBatch,
    updateBatchStatus,
    device,
    isDemoMode,
  } = useAgniDry();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Offline Alert Banner (appears if Wi-Fi simulated drop) */}
      <OfflineBanner />

      {/* Top Welcome / Operating State Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Artisan Operating Dashboard
            </h2>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/10 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-600" />
                DEMO MODE
              </span>
            )}
            <HonestyTag type="DEMO DATA" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time telemetry and autonomous climate regulation for home agarbatti artisan units.
          </p>
        </div>
      </div>

      {/* Primary 4 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          label="Chamber Temperature"
          value={currentSensors.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          subtext="Optimal drying band: 42°C - 50°C"
          colorTheme="amber"
        />

        <SensorCard
          label="Chamber Humidity"
          value={currentSensors.humidity.toFixed(1)}
          unit="% RH"
          icon={Droplets}
          subtext="Exhaust auto-vents above 65%"
          colorTheme="blue"
        />

        <SensorCard
          label="Incense Stick Weight"
          value={currentSensors.weight.toFixed(2)}
          unit="kg"
          icon={Scale}
          subtext={
            activeBatch
              ? `Started at ${formatWeight(activeBatch.initial_weight)}`
              : 'Continuous load cell reading'
          }
          colorTheme="emerald"
        />

        <SensorCard
          label="Battery Reserve"
          value={currentSensors.battery_percentage}
          unit="%"
          icon={BatteryCharging}
          subtext={`Terminal: ${currentSensors.battery_voltage.toFixed(1)}V • Safe Cutoff >20%`}
          colorTheme="purple"
        />
      </div>

      {/* Active Batch Summary Card */}
      <CurrentBatchCard
        batch={activeBatch}
        onStatusChange={(status) => {
          if (activeBatch) {
            updateBatchStatus(activeBatch.batch_id, status);
          }
        }}
      />

      {/* Actuator & Energy Double Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActuatorCard
          fanStatus={currentSensors.fan_status}
          heaterStatus={currentSensors.heater_status}
          ventStatus={currentSensors.vent_status}
        />

        <EnergyStatusCard
          solarStatus={currentSensors.solar_status}
          batteryPercentage={currentSensors.battery_percentage}
          batteryVoltage={currentSensors.battery_voltage}
        />
      </div>

      {/* Quick Action Artisan Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
          Quick Artisan Operations
        </h3>
        <QuickActionGrid onNewBatchClick={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Create Batch Modal */}
      <CreateBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createBatch}
        existingBatchCount={batches.length}
      />
    </div>
  );
};
