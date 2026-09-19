import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Boxes,
  PackageCheck,
  BarChart3,
  BellRing,
  Sliders,
  Sun,
  Shield
} from 'lucide-react';
import { useAgniDry } from '../../context/AgniDryContext';

export const Sidebar: React.FC = () => {
  const { alerts } = useAgniDry();
  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/monitor', label: 'Drying Monitor', icon: LineChart },
    { to: '/batches', label: 'Batches', icon: Boxes },
    { to: '/packaging', label: 'Packaging', icon: PackageCheck },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/alerts', label: 'Alerts', icon: BellRing, badge: unreadAlerts > 0 ? unreadAlerts : null },
    { to: '/settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-[#EAE5DC] flex flex-col shrink-0">
      {/* Artisan Identity Badge */}
      <div className="p-4 border-b border-[#EAE5DC] hidden md:block">
        <div className="flex items-center gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
          <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            AS
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">Artisan Workstation</div>
            <div className="text-[11px] text-amber-900/80">Self-Help Group Unit #1</div>
          </div>
        </div>
      </div>

      {/* Nav Link List */}
      <nav className="p-2 md:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-amber-50/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Solar & Safety Guarantee Note */}
      <div className="mt-auto p-4 border-t border-[#EAE5DC] hidden md:block text-xs text-slate-500">
        <div className="flex items-center gap-2 text-amber-700 font-semibold mb-1">
          <Sun className="w-4 h-4" />
          <span>Solar-First Architecture</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Local ESP32 microcontroller ensures autonomous drying safety even when Wi-Fi is disconnected.
        </p>
      </div>
    </aside>
  );
};
