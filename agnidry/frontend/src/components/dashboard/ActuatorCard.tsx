import React from 'react';
import { Wind, Flame, Compass, CheckCircle2, CircleOff } from 'lucide-react';
import { HonestyTag } from '../common/HonestyTag';

interface ActuatorCardProps {
  fanStatus: boolean;
  heaterStatus: boolean;
  ventStatus: boolean;
}

export const ActuatorCard: React.FC<ActuatorCardProps> = ({
  fanStatus,
  heaterStatus,
  ventStatus,
}) => {
  const actuators = [
    {
      name: 'Exhaust Fan',
      status: fanStatus,
      statusLabel: fanStatus ? 'RUNNING' : 'STANDBY',
      icon: Wind,
      activeDesc: 'Expelling humid vapor from chamber',
      inactiveDesc: 'Circulation idle (humidity within safe band)',
      activeColor: 'bg-sky-500 text-white',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      name: 'Aux Heater',
      status: heaterStatus,
      statusLabel: heaterStatus ? 'ACTIVE' : 'OFF',
      icon: Flame,
      activeDesc: 'Auxiliary electric heat supplementing solar',
      inactiveDesc: 'Off (Solar thermal energy is sufficient)',
      activeColor: 'bg-amber-500 text-white',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      name: 'Exhaust Vent',
      status: ventStatus,
      statusLabel: ventStatus ? 'OPEN' : 'CLOSED',
      icon: Compass,
      activeDesc: 'Flaps open: Fresh air intake & damp outflow',
      inactiveDesc: 'Flaps sealed: Heat retention inside chamber',
      activeColor: 'bg-emerald-600 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <div className="artisan-card p-5 border border-[#EAE5DC] bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Chamber Actuators (Local Control)</h3>
          <p className="text-xs text-slate-500">Autonomous relay & servo status controlled by ESP32</p>
        </div>
        <HonestyTag type="FACT" className="text-[10px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actuators.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.name}
              className={`p-3.5 rounded-xl border transition-all ${
                act.status
                  ? 'bg-slate-50/90 border-slate-300 shadow-xs'
                  : 'bg-white border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      act.status ? act.activeColor : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-900 text-xs">{act.name}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    act.status
                      ? act.badgeBg
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {act.statusLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {act.status ? act.activeDesc : act.inactiveDesc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
