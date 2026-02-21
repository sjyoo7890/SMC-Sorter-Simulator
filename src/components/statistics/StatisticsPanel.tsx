import { useState } from 'react';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import SummaryCards from './SummaryCards';
import TelegramDistributionChart from './TelegramDistributionChart';
import ThroughputChart from './ThroughputChart';
import ItemProcessingChart from './ItemProcessingChart';
import ExportButton from './ExportButton';

type ChartTab = 'distribution' | 'throughput' | 'items';

const chartTabs: { key: ChartTab; label: string; icon: typeof BarChart3 }[] = [
  { key: 'distribution', label: '텔레그램 분포', icon: BarChart3 },
  { key: 'throughput', label: '처리량', icon: TrendingUp },
  { key: 'items', label: '화물 처리', icon: PieChartIcon },
];

export default function StatisticsPanel() {
  const [chartTab, setChartTab] = useState<ChartTab>('distribution');

  return (
    <div className="space-y-3">
      {/* Summary Cards */}
      <SummaryCards />

      {/* Chart Area */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-4 py-2">
          {chartTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setChartTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  chartTab === tab.key
                    ? 'bg-[var(--color-plc-to-smc)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {chartTab === 'distribution' && <TelegramDistributionChart />}
          {chartTab === 'throughput' && <ThroughputChart />}
          {chartTab === 'items' && <ItemProcessingChart />}
        </div>
      </div>

      {/* Export */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3">
        <span className="text-xs text-[var(--color-text-secondary)]">
          로그 데이터 내보내기
        </span>
        <ExportButton />
      </div>
    </div>
  );
}
