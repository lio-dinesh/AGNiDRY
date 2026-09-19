import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Flame, Droplets, BatteryWarning, Wind } from 'lucide-react';
import { useAgniDry } from '../context/AgniDryContext';
import { AlertCard } from '../components/alerts/AlertCard';
import { HonestyTag } from '../components/common/HonestyTag';
import { AlertSeverity, AlertType } from '../types';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, triggerAlert, device } = useAgniDry();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const handleSimulateAlert = (type: AlertType, severity: AlertSeverity, message: string) => {
    triggerAlert({
      alert_id: `ALT-${Date.now().toString().slice(-4)}`,
      device_id: device.device_id,
      batch_id: 'AG-2026-001',
      type,
      severity,
      message,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Safety Alerts & System Diagnostics
            </h2>
            <HonestyTag type="PROTOTYPE CONFIGURATION" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hardware fail-safes and environmental anomaly logs monitored locally by the ESP32.
          </p>
        </div>

        {unacknowledgedCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            {unacknowledgedCount} Unacknowledged Alert{unacknowledgedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Threshold Scientific Notice */}
      <div className="p-4 bg-amber-500/10 border-l-4 border-amber-600 rounded-r-xl text-xs text-amber-950">
        <span className="font-bold">Prototype Safety Architecture:</span> Immediate chamber safety
        (fan thermal runaway cutoffs and emergency vent flap actuators) executes autonomously in the
        ESP32 firmware loop in &lt;50ms. Telemetry alerts notify the artisan via this interface.
      </div>

      {/* Test / SIH Demonstration Triggers */}
      <div className="artisan-card p-4 border border-slate-200 bg-white">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>Interactive Prototype Fault Simulation:</span>
          <HonestyTag type="DEMO DATA" className="text-[9px]" />
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() =>
              handleSimulateAlert(
                'HIGH_TEMPERATURE',
                'CRITICAL',
                'Chamber temperature reached 53.2°C (exceeding 52°C threshold). Autonomous cooling vent opened.'
              )
            }
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-medium flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            Simulate High Temp
          </button>

          <button
            onClick={() =>
              handleSimulateAlert(
                'HIGH_HUMIDITY',
                'WARNING',
                'Moisture spike: Chamber RH at 78.4%. Exhaust extraction fan active.'
              )
            }
            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg font-medium flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            Simulate Humidity Peak
          </button>

          <button
            onClick={() =>
              handleSimulateAlert(
                'LOW_BATTERY',
                'WARNING',
                'Battery level at 18.5% (cutoff threshold: 20%). Auxiliary heating turned off.'
              )
            }
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-medium flex items-center gap-1.5"
          >
            <BatteryWarning className="w-3.5 h-3.5 text-amber-600" />
            Simulate Low Battery
          </button>

          <button
            onClick={() =>
              handleSimulateAlert(
                'FAN_FAILURE',
                'CRITICAL',
                'Tachometer reported zero RPM on exhaust fan #1 during active drying cycle.'
              )
            }
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg font-medium flex items-center gap-1.5"
          >
            <Wind className="w-3.5 h-3.5 text-purple-600" />
            Simulate Fan Anomaly
          </button>
        </div>
      </div>

      {/* Severity Filter Strip */}
      <div className="flex items-center gap-2">
        {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              severityFilter === sev
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {sev} ({sev === 'ALL' ? alerts.length : alerts.filter((a) => a.severity === sev).length})
          </button>
        ))}
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id || alert.alert_id}
            alert={alert}
            onAcknowledge={acknowledgeAlert}
          />
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active alerts for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
