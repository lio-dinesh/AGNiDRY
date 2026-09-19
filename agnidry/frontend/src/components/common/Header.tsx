import React from 'react';
import { Sun, Wifi, WifiOff, Bell, Package, Sparkles, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAgniDry } from '../../context/AgniDryContext';
import { StatusBadge } from './StatusBadge';

export const Header: React.FC = () => {
  const { device, toggleDeviceOnline, activeBatch, alerts, isDemoMode, backendConnected } = useAgniDry();

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className="bg-white border-b border-[#EAE5DC] px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Title and Rural Artisan Purpose */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-terracotta-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                AgniDry
                <span className="text-xs font-normal text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                  SIH26022 • MSME
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Smart Solar-Powered Drying & Compact Packaging System
            </p>
          </div>
        </div>

        {/* Right: Device status, Batch tag, and Alert indicator */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Active Batch Chip */}
          {activeBatch && (
            <Link
              to="/batches"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold">{activeBatch.batch_id}</span>
              <span className="text-amber-600">•</span>
              <span>{activeBatch.status}</span>
            </Link>
          )}

          {/* SQLite Database Connection Chip */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              backendConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title={backendConnected ? "SQLite local backend connected & persisting" : "Operating in standalone local fallback mode"}
          >
            <Database className={`w-3.5 h-3.5 ${backendConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline font-semibold">SQLite:</span>
            <span>{backendConnected ? 'Live' : 'Offline'}</span>
          </span>

          {/* Device Online/Offline Toggle Chip */}
          <button
            onClick={toggleDeviceOnline}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              device.status === 'ONLINE'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
            title="Click to toggle simulated ESP32 Wi-Fi connectivity"
          >
            {device.status === 'ONLINE' ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className="font-semibold">{device.device_id}</span>:
            <span>{device.status}</span>
          </button>

          {/* Alert Bell */}
          <Link
            to="/alerts"
            className="relative p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            title="View system safety alerts"
          >
            <Bell className="w-4 h-4" />
            {unacknowledgedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unacknowledgedAlerts}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
