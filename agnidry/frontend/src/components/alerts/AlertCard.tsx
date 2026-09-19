import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Cpu,
  Flame,
  Droplets,
  BatteryWarning,
  WifiOff,
} from 'lucide-react';
import { Alert } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { HonestyTag } from '../common/HonestyTag';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge }) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'HIGH_TEMPERATURE':
      case 'HEATER_FAILURE':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'HIGH_HUMIDITY':
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case 'LOW_BATTERY':
        return <BatteryWarning className="w-5 h-5 text-amber-600" />;
      case 'DEVICE_OFFLINE':
      case 'INTERNET_DISCONNECTED':
        return <WifiOff className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  const severityClasses = {
    CRITICAL: {
      border: 'border-rose-300 bg-rose-50/40',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    WARNING: {
      border: 'border-amber-300 bg-amber-50/40',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    INFO: {
      border: 'border-sky-300 bg-sky-50/40',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
    },
  };

  const sevClass = severityClasses[alert.severity];

  return (
    <div
      className={`artisan-card p-4 sm:p-5 border ${sevClass.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all`}
    >
      <div className="flex items-start gap-3.5 flex-1">
        <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0 mt-0.5">
          {getAlertIcon(alert.type)}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {alert.alert_id}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${sevClass.badge}`}
            >
              {alert.severity}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {alert.type.replace('_', ' ')}
            </span>
            <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[9px]" />
          </div>

          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {alert.message}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateTime(alert.timestamp)}
            </span>
            {alert.device_id && (
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Cpu className="w-3 h-3" />
                {alert.device_id}
              </span>
            )}
            {alert.batch_id && (
              <span className="font-mono text-[11px] text-amber-800">
                Batch: {alert.batch_id}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="shrink-0 w-full sm:w-auto flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
        {alert.acknowledged ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Acknowledged
          </span>
        ) : (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="w-full sm:w-auto px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};
