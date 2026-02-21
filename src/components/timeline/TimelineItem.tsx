import { memo } from 'react';
import { format } from 'date-fns';
import type { TelegramLog } from '../../types/log';
import { getTelegramSummary } from './telegramSummary';

interface TimelineItemProps {
  log: TelegramLog;
  isSelected: boolean;
  onClick: () => void;
}

export default memo(function TimelineItem({ log, isSelected, onClick }: TimelineItemProps) {
  const isPlcToSmc = log.direction === 'PLC_TO_SMC';
  const summary = getTelegramSummary(log.telegramNo, log.decodedFields);
  const ts = format(log.timestamp, 'HH:mm:ss.SSS');

  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-stretch gap-0 rounded-md px-2 py-1.5 text-left transition-colors ${
        isSelected
          ? 'bg-[var(--color-bg-card-hover)] ring-1 ring-[var(--color-plc-to-smc)]/50'
          : 'hover:bg-[var(--color-bg-card-hover)]/50'
      }`}
    >
      {/* PLC column */}
      <div className="flex w-8 shrink-0 flex-col items-center">
        <div className={`h-full w-0.5 ${isPlcToSmc ? 'bg-blue-500' : 'bg-blue-500/30'}`} />
      </div>

      {/* Center: arrow + info */}
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        {/* Arrow row */}
        <div className="flex items-center gap-1.5">
          {isPlcToSmc ? (
            <>
              <ArrowLine direction="right" color="blue" />
              <div className="min-w-0 flex-1">
                <InfoBlock log={log} summary={summary} color="blue" />
              </div>
            </>
          ) : (
            <>
              <div className="min-w-0 flex-1 text-right">
                <InfoBlock log={log} summary={summary} color="amber" align="right" />
              </div>
              <ArrowLine direction="left" color="amber" />
            </>
          )}
        </div>

        {/* Timestamp */}
        <div className={`mt-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]/60 ${isPlcToSmc ? '' : 'text-right'}`}>
          {ts}
        </div>
      </div>

      {/* SMC column */}
      <div className="flex w-8 shrink-0 flex-col items-center">
        <div className={`h-full w-0.5 ${isPlcToSmc ? 'bg-amber-500/30' : 'bg-amber-500'}`} />
      </div>
    </button>
  );
});

function ArrowLine({ direction, color }: { direction: 'right' | 'left'; color: 'blue' | 'amber' }) {
  const lineColor = color === 'blue' ? 'bg-blue-500' : 'bg-amber-500';
  const headColor = color === 'blue' ? 'border-l-blue-500' : 'border-r-amber-500';

  if (direction === 'right') {
    return (
      <div className="flex items-center">
        <div className={`h-[1.5px] w-6 ${lineColor}`} />
        <div className={`h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent ${headColor}`} />
      </div>
    );
  }
  return (
    <div className="flex items-center">
      <div className={`h-0 w-0 border-y-[3px] border-r-[5px] border-y-transparent ${headColor}`} />
      <div className={`h-[1.5px] w-6 ${lineColor}`} />
    </div>
  );
}

function InfoBlock({
  log,
  summary,
  color,
  align = 'left',
}: {
  log: TelegramLog;
  summary: string;
  color: 'blue' | 'amber';
  align?: 'left' | 'right';
}) {
  const nameColor = color === 'blue' ? 'text-blue-400' : 'text-amber-400';
  const badgeBg = color === 'blue' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400';
  const alignClass = align === 'right' ? 'items-end' : 'items-start';

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <div className="flex items-center gap-1.5">
        <span className={`rounded px-1 py-0 text-[10px] font-bold ${badgeBg}`}>
          #{log.telegramNo}
        </span>
        <span className={`text-xs font-semibold ${nameColor}`}>{log.telegramName}</span>
      </div>
      {summary && (
        <span className="mt-0.5 max-w-full truncate font-mono text-[10px] text-[var(--color-text-secondary)]">
          {summary}
        </span>
      )}
    </div>
  );
}
