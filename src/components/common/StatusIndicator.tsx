type IndicatorStatus = 'online' | 'offline' | 'error';

interface StatusIndicatorProps {
  status: IndicatorStatus;
  label: string;
}

const statusConfig: Record<IndicatorStatus, { color: string; pulse: boolean }> = {
  online:  { color: 'bg-emerald-400', pulse: true },
  offline: { color: 'bg-gray-500',    pulse: false },
  error:   { color: 'bg-red-400',     pulse: true },
};

export default function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const { color, pulse } = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${color}`} />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
      </span>
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
    </div>
  );
}
