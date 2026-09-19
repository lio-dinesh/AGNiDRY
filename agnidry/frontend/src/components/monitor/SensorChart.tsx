import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Thermometer, Droplets, Scale, Clock, Filter, AlertCircle, WifiOff } from 'lucide-react';
import { SensorData } from '../../types';
import { formatTimeOnly, formatTemp, formatHumidity, formatWeight } from '../../utils/formatters';
import { HonestyTag } from '../common/HonestyTag';

interface SensorChartProps {
  telemetry: SensorData[];
  isOffline: boolean;
  batchDuration: string;
}

type MetricFilter = 'ALL' | 'TEMPERATURE' | 'HUMIDITY' | 'WEIGHT';
type TimeWindow = '30M' | '1H' | '3H' | 'CURRENT_BATCH';

export const SensorChart: React.FC<SensorChartProps> = ({
  telemetry,
  isOffline,
  batchDuration,
}) => {
  const [metricFilter, setMetricFilter] = useState<MetricFilter>('ALL');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('CURRENT_BATCH');

  // Filter points based on chosen window
  const getFilteredPoints = () => {
    if (!telemetry || telemetry.length === 0) return [];
    if (timeWindow === 'CURRENT_BATCH') return telemetry;

    const count =
      timeWindow === '30M' ? 5 : timeWindow === '1H' ? 10 : 18;
    return telemetry.slice(-count);
  };

  const chartData = getFilteredPoints().map((d) => ({
    time: formatTimeOnly(d.timestamp),
    rawTime: d.timestamp,
    temperature: d.temperature,
    humidity: d.humidity,
    weight: d.weight,
    fan: d.fan_status ? 1 : 0,
    heater: d.heater_status ? 1 : 0,
    vent: d.vent_status ? 1 : 0,
  }));

  const latest = telemetry[telemetry.length - 1] || null;

  return (
    <div className="artisan-card p-5 sm:p-6 border border-[#EAE5DC] bg-white">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-slate-900">Synchronized Drying Curves</h3>
            <HonestyTag type="DEMO DATA" className="text-[10px]" />
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <WifiOff className="w-3 h-3" />
                Live Telemetry Paused (Offline)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time correlation of heat, relative vapor humidity, and load-cell weight delta.
          </p>
        </div>

        {/* Time Window Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {(['30M', '1H', '3H', 'CURRENT_BATCH'] as TimeWindow[]).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeWindow === tw
                    ? 'bg-amber-500 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tw === 'CURRENT_BATCH' ? 'Current Batch' : tw}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {(['ALL', 'TEMPERATURE', 'HUMIDITY', 'WEIGHT'] as MetricFilter[]).map((mf) => (
              <button
                key={mf}
                onClick={() => setMetricFilter(mf)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metricFilter === mf
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mf === 'ALL' ? 'All Metrics' : mf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Indicator Pill Strip */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Current Temp</div>
              <div className="text-sm font-bold text-amber-950">{formatTemp(latest.temperature)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-lg">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Chamber RH</div>
              <div className="text-sm font-bold text-sky-950">{formatHumidity(latest.humidity)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Stick Weight</div>
              <div className="text-sm font-bold text-emerald-950">{formatWeight(latest.weight)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Batch Duration</div>
              <div className="text-sm font-bold text-purple-950">{batchDuration}</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="h-[320px] sm:h-[380px] w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No telemetry points recorded yet for this window.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE9" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickMargin={8} />
              
              {/* Primary Y Axis for Temp & Humidity */}
              <YAxis
                yAxisId="left"
                stroke="#64748B"
                fontSize={11}
                domain={[20, 90]}
                unit="°C / %"
                tickMargin={6}
              />
              
              {/* Secondary Y Axis for Weight in kg */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#059669"
                fontSize={11}
                domain={[0.5, 3.5]}
                unit=" kg"
                tickMargin={6}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />

              {(metricFilter === 'ALL' || metricFilter === 'TEMPERATURE') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}

              {(metricFilter === 'ALL' || metricFilter === 'HUMIDITY') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (% RH)"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}

              {(metricFilter === 'ALL' || metricFilter === 'WEIGHT') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
