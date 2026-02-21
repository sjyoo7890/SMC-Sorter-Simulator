import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { format } from 'date-fns';
import { useSystemStore } from '../../stores/useSystemStore';

const TIMEOUT_MS = 3000;
const DOT_COUNT = 12;

export default function HeartbeatCard() {
  const heartbeat = useSystemStore((s) => s.heartbeat);
  const [now, setNow] = useState(Date.now());
  const [pulseIndex, setPulseIndex] = useState(0);

  // Tick every second to check timeout
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Pulse animation
  useEffect(() => {
    if (!heartbeat.active) return;
    const id = setInterval(() => {
      setPulseIndex((i) => (i + 1) % DOT_COUNT);
    }, 250);
    return () => clearInterval(id);
  }, [heartbeat.active]);

  const isAlive =
    heartbeat.active &&
    heartbeat.lastReceived != null &&
    now - heartbeat.lastReceived.getTime() < TIMEOUT_MS;

  const color = isAlive ? 'text-emerald-400' : 'text-red-400';
  const bg = isAlive ? 'bg-emerald-500/15' : 'bg-red-500/15';
  const dotActive = isAlive ? 'bg-emerald-400' : 'bg-red-400';
  const dotInactive = 'bg-gray-700';

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Heartbeat
      </div>

      <div className="flex items-center gap-3">
        <div className={`relative flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
          {isAlive && (
            <span className={`absolute inset-0 animate-ping rounded-lg ${bg} opacity-40`} />
          )}
          <Heart className={`h-5 w-5 ${color}`} />
        </div>

        <div>
          {/* Pulse dots */}
          <div className="mb-1 flex gap-0.5">
            {Array.from({ length: DOT_COUNT }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-150 ${
                  isAlive && i === pulseIndex ? dotActive : dotInactive
                }`}
              />
            ))}
          </div>

          <span className={`text-xs ${color}`}>
            {isAlive && heartbeat.lastReceived
              ? `마지막 수신: ${format(heartbeat.lastReceived, 'HH:mm:ss')}`
              : '연결 끊김'}
          </span>
        </div>
      </div>
    </div>
  );
}
