import SorterStatusCard from './SorterStatusCard';
import HeartbeatCard from './HeartbeatCard';
import InductionStatusCard from './InductionStatusCard';
import OverflowConfigCard from './OverflowConfigCard';
import ActiveItemsCard from './ActiveItemsCard';

export default function DashboardPanel() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="border-b border-[var(--color-border)] px-4 py-2.5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Status Dashboard
        </h2>
      </div>

      <div className="p-4">
        {/* Row 1: Sorter + Heartbeat + Overflow */}
        <div className="mb-3 grid grid-cols-3 gap-3">
          <SorterStatusCard />
          <HeartbeatCard />
          <OverflowConfigCard />
        </div>

        {/* Row 2: Inductions + Active Items */}
        <div className="grid grid-cols-2 gap-3">
          <InductionStatusCard />
          <ActiveItemsCard />
        </div>
      </div>
    </div>
  );
}
