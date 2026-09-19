import React from 'react';
import { LineChart, Wind, Flame, Compass, Sun, Battery, Wifi, WifiOff, Clock } from 'lucide-react';
import { useAgniDry } from '../context/AgniDryContext';
import { SensorChart } from '../components/monitor/SensorChart';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { HonestyTag } from '../components/common/HonestyTag';
import { formatTimeOnly, formatTemp, formatHumidity, formatWeight } from '../utils/formatters';

export const DryingMonitorPage: React.FC = () => {
  const { telemetryHistory, currentSensors, device, activeBatch } = useAgniDry();

  const isOffline = device.status === 'OFFLINE';

  return (
    <div className="space-y-6">
      <OfflineBanner />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Live Drying Chamber Telemetry
            </h2>
            <HonestyTag type="DEMO DATA" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synchronized tracking of temperature, relative humidity, and incense stick moisture reduction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isOffline
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {isOffline ? 'Offline (Local Safe)' : 'Telemetry Stream: Active'}
          </span>
        </div>
      </div>

      {/* Primary Recharts Visualization */}
      <SensorChart
        telemetry={telemetryHistory}
        isOffline={isOffline}
        batchDuration={activeBatch?.duration || '2h 15m'}
      />

      {/* Real-time Hardware & Ambient State Strip */}
      <div className="artisan-card p-5 border border-[#EAE5DC] bg-white">
        <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
          Chamber Environmental & Actuator Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Exhaust Fan:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
              <Wind
                className={`w-4 h-4 ${
                  currentSensors.fan_status ? 'text-sky-600 animate-spin-slow' : 'text-slate-400'
                }`}
              />
              <span>{currentSensors.fan_status ? 'RUNNING' : 'OFF'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Auxiliary Heater:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
              <Flame
                className={`w-4 h-4 ${
                  currentSensors.heater_status ? 'text-amber-600' : 'text-slate-400'
                }`}
              />
              <span>{currentSensors.heater_status ? 'HEATING' : 'STANDBY'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Air Vent Flaps:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
              <Compass
                className={`w-4 h-4 ${
                  currentSensors.vent_status ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <span>{currentSensors.vent_status ? 'OPEN' : 'SEALED'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Solar Collector:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
              <Sun
                className={`w-4 h-4 ${
                  currentSensors.solar_status ? 'text-amber-500' : 'text-slate-400'
                }`}
              />
              <span>{currentSensors.solar_status ? 'ACTIVE SUN' : 'DIFFUSED'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Battery Voltage:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
              <Battery className="w-4 h-4 text-purple-600" />
              <span>{currentSensors.battery_voltage.toFixed(1)} V ({currentSensors.battery_percentage}%)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Active Batch:</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mt-1 font-mono">
              <span>{activeBatch ? activeBatch.batch_id : 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Log Table */}
      <div className="artisan-card p-5 sm:p-6 border border-[#EAE5DC] bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Telemetry Samples</h3>
            <p className="text-xs text-slate-500">Periodic readings transmitted from ESP32 local controller</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing last {telemetryHistory.length} data frames
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Temperature</th>
                <th className="py-2.5 px-3">Humidity</th>
                <th className="py-2.5 px-3">Stick Weight</th>
                <th className="py-2.5 px-3">Battery</th>
                <th className="py-2.5 px-3">Actuators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {telemetryHistory.slice(-8).reverse().map((reading, idx) => (
                <tr key={reading.id || idx} className="hover:bg-amber-50/30">
                  <td className="py-2 px-3 font-mono text-slate-600">
                    {formatTimeOnly(reading.timestamp)}
                  </td>
                  <td className="py-2 px-3 font-semibold text-amber-950">
                    {formatTemp(reading.temperature)}
                  </td>
                  <td className="py-2 px-3 font-semibold text-sky-950">
                    {formatHumidity(reading.humidity)}
                  </td>
                  <td className="py-2 px-3 font-semibold text-emerald-950 font-mono">
                    {formatWeight(reading.weight)}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    {reading.battery_percentage}% ({reading.battery_voltage.toFixed(1)}V)
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          reading.fan_status
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        FAN
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          reading.vent_status
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        VENT
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          reading.heater_status
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        HEAT
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
