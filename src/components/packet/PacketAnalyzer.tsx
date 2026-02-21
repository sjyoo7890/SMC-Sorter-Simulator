import { useState, useMemo } from 'react';
import { FileText, Binary, Table } from 'lucide-react';
import { useLogStore } from '../../stores/useLogStore';
import PacketHeader from './PacketHeader';
import HexDumpView from './HexDumpView';
import DecodedView from './DecodedView';
import { buildFieldRanges } from './fieldRanges';

type ViewTab = 'hex' | 'decoded';

export default function PacketAnalyzer() {
  const selectedLog = useLogStore((s) =>
    s.selectedLogId ? s.logs.find((l) => l.id === s.selectedLogId) ?? null : null,
  );

  const [activeTab, setActiveTab] = useState<ViewTab>('hex');
  const [hoveredFieldIndex, setHoveredFieldIndex] = useState<number | null>(null);

  const fieldRanges = useMemo(() => {
    if (!selectedLog || selectedLog.rawBytes.length === 0) return [];
    return buildFieldRanges(selectedLog.telegramNo, selectedLog.rawBytes);
  }, [selectedLog]);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Packet Analyzer
        </h2>
      </div>

      {!selectedLog ? (
        <div className="flex h-48 items-center justify-center p-4">
          <div className="text-center text-[var(--color-text-secondary)]">
            <FileText className="mx-auto mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">▶ 시뮬레이션을 시작하거나, 제어 패널에서 텔레그램을 수동 전송하세요</p>
            <p className="mt-1 text-xs opacity-60">타임라인에서 항목을 클릭하면 패킷 구조가 표시됩니다</p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          {/* Packet header summary */}
          <PacketHeader log={selectedLog} />

          {/* Tabs */}
          <div className="mt-3 flex border-b border-[var(--color-border)]">
            <TabButton
              active={activeTab === 'hex'}
              icon={<Binary className="h-3.5 w-3.5" />}
              label="Hex Dump"
              onClick={() => setActiveTab('hex')}
            />
            <TabButton
              active={activeTab === 'decoded'}
              icon={<Table className="h-3.5 w-3.5" />}
              label="Decoded"
              onClick={() => setActiveTab('decoded')}
            />
          </div>

          {/* Content */}
          <div className="mt-3">
            {activeTab === 'hex' ? (
              <HexDumpView
                rawBytes={selectedLog.rawBytes}
                fieldRanges={fieldRanges}
                hoveredFieldIndex={hoveredFieldIndex}
                onHoverField={setHoveredFieldIndex}
              />
            ) : (
              <DecodedView
                log={selectedLog}
                fieldRanges={fieldRanges}
                hoveredFieldIndex={hoveredFieldIndex}
                onHoverField={setHoveredFieldIndex}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors ${
        active
          ? 'text-[var(--color-plc-to-smc)]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      {icon}
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-[var(--color-plc-to-smc)]" />
      )}
    </button>
  );
}
