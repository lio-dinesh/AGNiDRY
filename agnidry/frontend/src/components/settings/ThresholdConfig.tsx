import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, Check, RefreshCw, Cpu } from 'lucide-react';
import { useAgniDry } from '../../context/AgniDryContext';
import { HonestyTag } from '../common/HonestyTag';

export const ThresholdConfig: React.FC = () => {
  const { thresholds, updateThresholds, device } = useAgniDry();

  const [maxSafeTemp, setMaxSafeTemp] = useState(thresholds.maxSafeTemp);
  const [targetDryingTemp, setTargetDryingTemp] = useState(thresholds.targetDryingTemp);
  const [maxHumidityVent, setMaxHumidityVent] = useState(thresholds.maxHumidityVentThreshold);
  const [minBattery, setMinBattery] = useState(thresholds.minBatteryCutoff);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds({
      maxSafeTemp,
      targetDryingTemp,
      maxHumidityVentThreshold: maxHumidityVent,
      minBatteryCutoff: minBattery,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setMaxSafeTemp(52);
    setTargetDryingTemp(46);
    setMaxHumidityVent(65);
    setMinBattery(20);
    updateThresholds({
      maxSafeTemp: 52,
      targetDryingTemp: 46,
      maxHumidityVentThreshold: 65,
      minBatteryCutoff: 20,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Important Scientific Disclaimer Banner */}
      <div className="p-4 bg-amber-500/10 border-l-4 border-amber-600 rounded-r-xl text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Scientific & Engineering Notice:</span>
          <HonestyTag type="PROTOTYPE CONFIGURATION" />
        </div>
        <p className="leading-relaxed text-amber-900/90">
          Prototype configuration – validate experimentally. Actual temperature and moisture thresholds
          depend on specific binder resins (jigget/gum), bamboo core thickness, and essential oil volatility.
          Autonomous hardware safety cutoffs are continuously enforced on the physical ESP32.
        </p>
      </div>

      {/* Threshold Config Form */}
      <div className="artisan-card p-6 border border-[#EAE5DC] bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Configurable Safety Thresholds</h3>
              <p className="text-xs text-slate-500">
                Calibrate temperature and humidity limits for local climate and stick dough type.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Max Safe Chamber Temp */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Maximum Safe Temperature (°C)
                </label>
                <span className="text-xs font-bold text-amber-700">{maxSafeTemp}°C</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Emergency vent opening triggers if heat exceeds this limit to protect fragrance.
              </p>
              <input
                type="range"
                min="40"
                max="65"
                step="1"
                value={maxSafeTemp}
                onChange={(e) => setMaxSafeTemp(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>40°C (Mild)</span>
                <span>52°C (Proto default)</span>
                <span>65°C (High)</span>
              </div>
            </div>

            {/* Target Drying Temp */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Optimal Target Drying Temp (°C)
                </label>
                <span className="text-xs font-bold text-emerald-700">{targetDryingTemp}°C</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Solar collector and auxiliary heater regulate around this setpoint.
              </p>
              <input
                type="range"
                min="35"
                max="55"
                step="1"
                value={targetDryingTemp}
                onChange={(e) => setTargetDryingTemp(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>35°C</span>
                <span>46°C (Proto default)</span>
                <span>55°C</span>
              </div>
            </div>

            {/* Max Humidity Venting Threshold */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Exhaust Vent Humidity Trigger (% RH)
                </label>
                <span className="text-xs font-bold text-sky-700">{maxHumidityVent}%</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Exhaust fan and airflow flaps actuate automatically when chamber humidity peaks.
              </p>
              <input
                type="range"
                min="50"
                max="85"
                step="1"
                value={maxHumidityVent}
                onChange={(e) => setMaxHumidityVent(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50%</span>
                <span>65% (Proto default)</span>
                <span>85%</span>
              </div>
            </div>

            {/* Min Battery Cutoff */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Low Battery Cutoff Threshold (%)
                </label>
                <span className="text-xs font-bold text-purple-700">{minBattery}%</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Disables auxiliary electric heater to protect 12V LiFePO4 / Lead-acid battery life.
              </p>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={minBattery}
                onChange={(e) => setMinBattery(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10%</span>
                <span>20% (Proto default)</span>
                <span>40%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Prototype Defaults
            </button>

            <div className="flex items-center gap-2">
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Thresholds Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Hardware & Microcontroller Information */}
      <div className="artisan-card p-6 border border-[#EAE5DC] bg-white">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <div className="p-2 bg-slate-900 text-white rounded-lg">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Embedded Hardware Details</h3>
            <p className="text-xs text-slate-500">Controller specifications & firmware identification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Device Identifier:</span>
            <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{device.device_id}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Firmware Version:</span>
            <span className="font-mono font-semibold text-slate-800 text-sm mt-0.5 block">{device.firmware_version}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Microcontroller:</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">ESP32-S3 (Dual-Core 240MHz)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Communication:</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">Local REST / Wi-Fi Mesh</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Chamber Volume:</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">120 Liters (5 Trays)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Local SoftAP / IP:</span>
            <span className="font-mono font-semibold text-slate-800 text-sm mt-0.5 block">{device.local_ip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
