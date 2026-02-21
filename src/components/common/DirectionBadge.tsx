import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { Direction } from '../../types/protocol';

interface DirectionBadgeProps {
  direction: Direction;
}

export default function DirectionBadge({ direction }: DirectionBadgeProps) {
  const isPlcToSmc = direction === 'PLC_TO_SMC';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
        isPlcToSmc
          ? 'bg-blue-500/15 text-blue-400'
          : 'bg-amber-500/15 text-amber-400'
      }`}
    >
      {isPlcToSmc ? (
        <>
          PLC <ArrowRight className="h-3 w-3" /> SMC
        </>
      ) : (
        <>
          SMC <ArrowLeft className="h-3 w-3" /> PLC
        </>
      )}
    </span>
  );
}
