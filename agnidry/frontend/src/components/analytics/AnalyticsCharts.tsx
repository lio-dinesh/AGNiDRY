import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Batch, PackagingRecord } from '../../types';
import { HonestyTag } from '../common/HonestyTag';
import { calculateWeightLossPct } from '../../utils/formatters';

interface AnalyticsChartsProps {
  batches: Batch[];
  packagingRecords: PackagingRecord[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ batches, packagingRecords }) => {
  // Duration & Weight Loss per Batch data
  const batchComparisonData = batches.map((b) => {
    const lossPct = calculateWeightLossPct(
      b.initial_weight,
      b.final_weight !== null ? b.final_weight : b.current_weight
    );

    // Approximate numeric duration in hours
    let hours = 2.5;
    if (b.duration.includes('h')) {
      const match = b.duration.match(/(\d+)h/);
      if (match) hours = parseFloat(match[1]);
    }

    return {
      name: b.batch_id,
      product: b.product_type,
      initialKg: b.initial_weight,
      finalKg: b.final_weight !== null ? b.final_weight : b.current_weight,
      weightLossPct: parseFloat(lossPct.toFixed(1)),
      durationHours: hours,
    };
  });

  // Packaging summary data
  const packagingTypeCounts: Record<string, { success: number; failed: number }> = {};
  packagingRecords.forEach((p) => {
    const key = p.package_type.replace('_', ' ');
    if (!packagingTypeCounts[key]) {
      packagingTypeCounts[key] = { success: 0, failed: 0 };
    }
    if (p.seal_status === 'SUCCESS') {
      packagingTypeCounts[key].success += 1;
    } else {
      packagingTypeCounts[key].failed += 1;
    }
  });

  const packagingChartData = Object.entries(packagingTypeCounts).map(([type, counts]) => ({
    type,
    success: counts.success,
    failed: counts.failed,
  }));

  return (
    <div className="space-y-6">
      {/* Chart 1: Weight Loss & Duration per Batch */}
      <div className="artisan-card p-5 sm:p-6 border border-[#EAE5DC] bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Batch Weight Loss & Drying Duration Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Correlating final moisture drop percentage with chamber residence time.
            </p>
          </div>
          <HonestyTag type="DEMO DATA" className="text-[10px]" />
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={batchComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE9" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis
                yAxisId="left"
                stroke="#D97706"
                fontSize={11}
                unit="%"
                domain={[0, 50]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#2563EB"
                fontSize={11}
                unit="h"
                domain={[0, 8]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={32} />
              <Bar
                yAxisId="left"
                dataKey="weightLossPct"
                name="Weight Loss (%)"
                fill="#F59E0B"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="durationHours"
                name="Drying Duration (Hours)"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Packaging Outcomes */}
      <div className="artisan-card p-5 sm:p-6 border border-[#EAE5DC] bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Packaging Format & Seal Quality Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of successful impulse seals across pouch, box, and bundle packages.
            </p>
          </div>
          <HonestyTag type="DEMO DATA" className="text-[10px]" />
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packagingChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE9" />
              <XAxis dataKey="type" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={32} />
              <Bar
                dataKey="success"
                name="Successful Hermetic Seals"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="failed"
                name="Failed / Incomplete Seals"
                fill="#EF4444"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
