import React from 'react';
import { BarChart3, Info } from 'lucide-react';
import { useAgniDry } from '../context/AgniDryContext';
import { MetricsSummary } from '../components/analytics/MetricsSummary';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { HonestyTag } from '../components/common/HonestyTag';

export const AnalyticsPage: React.FC = () => {
  const { batches, packagingRecords, alerts } = useAgniDry();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Process Performance & Artisan Analytics
            </h2>
            <HonestyTag type="DEMO DATA" className="text-[10px]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Drying cycle efficiency, stick weight reduction patterns, and packaging seal reliability.
          </p>
        </div>
      </div>

      {/* Honesty Guidance Notice */}
      <div className="p-4 bg-purple-500/10 border-l-4 border-purple-600 rounded-r-xl text-xs text-purple-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Engineering Rigor Notice:</span> Current analytics are calculated from prototype batch simulations and bench tests. No artificial AI model accuracy or inflated financial savings are claimed prior to multi-week rural artisan field pilot validation.
        </div>
      </div>

      {/* KPI Cards Summary */}
      <MetricsSummary
        batches={batches}
        packagingRecords={packagingRecords}
        alerts={alerts}
      />

      {/* Comparative Visual Analytics Charts */}
      <AnalyticsCharts
        batches={batches}
        packagingRecords={packagingRecords}
      />
    </div>
  );
};
