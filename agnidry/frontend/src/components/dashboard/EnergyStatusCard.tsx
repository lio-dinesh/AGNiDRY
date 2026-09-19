import React from 'react';
import { Sun, Battery, BatteryCharging, Zap } from 'lucide-react';
import { HonestyTag } from '../common/HonestyTag';

interface EnergyStatusCardProps {
  solarStatus: boolean;
  batteryPercentage: number;
  batteryVoltage: number;
}

export const EnergyStatusCard: React.FC<EnergyStatusCardProps> = ({
  solarStatus,
  batteryPercentage,
  batteryVoltage,
}) => {
  const getBatteryColor = (pct: number) => {
    if (pct > 50) return 'bg-emerald-500';
    if (pct > 20) return 'bg-amber-500';
    return 'bg-rose-500 animate-pulse';
  };

  return (
    <div className="artisan-card p-5 border border-[#EAE5DC] bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          Power & Solar Status
        </h3>
        <HonestyTag type="FACT" className="text-[10px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Solar Generation Card */}
        <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/70 flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              solarStatus
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            <Sun className={`w-5 h-5 ${solarStatus ? 'animate-spin-slow' : ''}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Solar Irradiation</div>
            <div className="text-sm font-bold text-slate-900">
              {solarStatus ? 'Active Sunlight (Thermal Gain)' : 'Diffused / Standby'}
            </div>
            <div className="text-[11px] text-amber-800">
              {solarStatus ? 'Collector generating 18.2V' : 'Operating on reserve'}
            </div>
          </div>
        </div>

        {/* Battery Backup Card */}
        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                {solarStatus ? (
                  <BatteryCharging className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Battery className="w-4 h-4 text-emerald-700" />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-500">Battery Reserve</span>
            </div>
            <span className="text-sm font-bold text-emerald-950">{batteryPercentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-1.5 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getBatteryColor(
                batteryPercentage
              )}`}
              style={{ width: `${Math.min(100, Math.max(5, batteryPercentage))}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-500 flex justify-between font-medium">
            <span>Terminal: {batteryVoltage.toFixed(1)} V</span>
            <span>{batteryPercentage > 20 ? 'Safe Cutoff OK' : 'Low Voltage Safe State'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
