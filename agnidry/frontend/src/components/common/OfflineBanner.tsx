import React from 'react';
import { WifiOff, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAgniDry } from '../../context/AgniDryContext';
import { HonestyTag } from './HonestyTag';
import { formatDateTime } from '../../utils/formatters';

export const OfflineBanner: React.FC = () => {
  const { device, toggleDeviceOnline, currentSensors } = useAgniDry();

  if (device.status !== 'OFFLINE') {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-900 rounded-lg shrink-0 mt-0.5 sm:mt-0">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-amber-950">
                Device Offline — ESP32 Autonomous Safety Active
              </h4>
              <HonestyTag type="FACT" />
            </div>
            <p className="text-sm text-amber-900/90 mt-1">
              Wi-Fi telemetry link is interrupted. The on-board ESP32 controller continues 
              autonomous thermal regulation, fan cycling, and safety cutoffs independently.
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-amber-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Hardware Fail-Safe: Running
              </span>
              <span>Last Sync: {formatDateTime(currentSensors.timestamp)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleDeviceOnline}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Simulate Reconnect
        </button>
      </div>
    </div>
  );
};
