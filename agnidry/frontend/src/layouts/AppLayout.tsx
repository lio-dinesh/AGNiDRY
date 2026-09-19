import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Global Brand Header */}
      <Header />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Artisan Friendly Footer */}
      <footer className="bg-white border-t border-[#EAE5DC] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>AgniDry</strong> — Smart Solar Drying & Compact Packaging • SIH 2026 Team Nano Thinkers (SIH26022)
          </span>
          <span className="text-amber-800 font-medium">
            Ministry of MSME • Rural Women Agarbatti Artisans
          </span>
        </div>
      </footer>
    </div>
  );
};
