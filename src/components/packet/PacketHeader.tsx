import { format } from 'date-fns';
import type { TelegramLog } from '../../types/log';
import { telegramMeta } from '../../constants/telegramMeta';
import DirectionBadge from '../common/DirectionBadge';

const dataTypeLabels: Record<string, string> = {
  H: 'Heartbeat', S: 'Status', D: 'Data', A: 'Action', R: 'Request',
};

interface PacketHeaderProps {
  log: TelegramLog;
}

export default function PacketHeader({ log }: PacketHeaderProps) {
  const meta = telegramMeta[log.telegramNo];
  const ts = format(log.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS');
  const typeLabel = dataTypeLabels[log.dataTypeChar] ?? log.dataTypeChar;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md bg-[var(--color-bg-primary)] px-4 py-2.5">
      {/* Name + Number */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          {meta?.name ?? `Telegram`}
        </span>
        <span className="rounded bg-[var(--color-bg-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-text-secondary)]">
          #{log.telegramNo}
        </span>
      </div>

      {/* Direction */}
      <DirectionBadge direction={log.direction} />

      {/* Port */}
      <span className="font-mono text-xs text-[var(--color-text-secondary)]">
        Port {log.port}
      </span>

      {/* DataType */}
      <span className="text-xs text-[var(--color-text-secondary)]">
        Type: <span className="font-mono font-semibold text-purple-400">{log.dataTypeChar}</span>
        <span className="ml-0.5 text-[var(--color-text-secondary)]">({typeLabel})</span>
      </span>

      {/* Packet size */}
      <span className="font-mono text-xs text-[var(--color-text-secondary)]">
        {log.rawBytes.length} bytes
      </span>

      {/* Timestamp */}
      <span className="ml-auto font-mono text-xs text-[var(--color-text-secondary)]">
        {ts}
      </span>
    </div>
  );
}
