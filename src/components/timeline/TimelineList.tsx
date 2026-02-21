import { useRef, useEffect, useState, useCallback } from 'react';
import { useLogStore } from '../../stores/useLogStore';
import TimelineItem from './TimelineItem';
import { ArrowDownToLine } from 'lucide-react';
import type { TelegramLog } from '../../types/log';

const ITEM_HEIGHT = 68;
const OVERSCAN = 5;

interface TimelineListProps {
  filteredLogs: TelegramLog[];
}

export default function TimelineList({ filteredLogs }: TimelineListProps) {
  const selectedLogId = useLogStore((s) => s.selectedLogId);
  const selectLog = useLogStore((s) => s.selectLog);
  const logsLength = useLogStore((s) => s.logs.length);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const prevLogsLengthRef = useRef(logsLength);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-scroll on new logs
  useEffect(() => {
    if (autoScroll && logsLength > prevLogsLengthRef.current) {
      const el = containerRef.current;
      if (el) el.scrollTop = 0;
    }
    prevLogsLengthRef.current = logsLength;
  }, [logsLength, autoScroll]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  // Virtual scroll calculations
  const totalItems = filteredLogs.length;
  const totalHeight = totalItems * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + OVERSCAN * 2;
  const endIndex = Math.min(totalItems, startIndex + visibleCount);

  const visibleItems = filteredLogs.slice(startIndex, endIndex);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Auto-scroll toggle */}
      <div className="absolute right-3 top-2 z-10">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          title={autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
          className={`rounded-full p-1.5 transition-colors ${
            autoScroll
              ? 'bg-[var(--color-plc-to-smc)] text-white'
              : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
          }`}
        >
          <ArrowDownToLine className="h-3 w-3" />
        </button>
      </div>

      {/* Scrollable area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {totalItems === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-sm text-[var(--color-text-secondary)]">
            No telegram logs yet
          </div>
        ) : (
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: startIndex * ITEM_HEIGHT,
                left: 0,
                right: 0,
              }}
            >
              {visibleItems.map((log) => (
                <div key={log.id} style={{ height: ITEM_HEIGHT }}>
                  <TimelineItem
                    log={log}
                    isSelected={selectedLogId === log.id}
                    onClick={() => selectLog(log.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
