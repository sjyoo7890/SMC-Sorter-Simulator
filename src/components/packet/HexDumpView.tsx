import type { PacketFieldRange } from './fieldRanges';

const BYTES_PER_ROW = 16;

interface HexDumpViewProps {
  rawBytes: number[];
  fieldRanges: PacketFieldRange[];
  hoveredFieldIndex: number | null;
  onHoverField: (index: number | null) => void;
}

export default function HexDumpView({
  rawBytes,
  fieldRanges,
  hoveredFieldIndex,
  onHoverField,
}: HexDumpViewProps) {
  const rows: number[][] = [];
  for (let i = 0; i < rawBytes.length; i += BYTES_PER_ROW) {
    rows.push(rawBytes.slice(i, i + BYTES_PER_ROW));
  }

  function getFieldIndex(byteIdx: number): number | null {
    for (let i = 0; i < fieldRanges.length; i++) {
      if (byteIdx >= fieldRanges[i].start && byteIdx < fieldRanges[i].end) return i;
    }
    return null;
  }

  function getAsciiChar(b: number): string {
    return b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.';
  }

  return (
    <div className="overflow-x-auto font-mono text-xs">
      {/* Column headers */}
      <div className="mb-1 flex text-[10px] text-[var(--color-text-secondary)]/40">
        <span className="w-12 shrink-0">Offset</span>
        <span className="flex-1">
          {Array.from({ length: BYTES_PER_ROW }, (_, i) =>
            i.toString(16).toUpperCase().padStart(2, '0'),
          ).join('  ')}
        </span>
        <span className="ml-4 w-[17ch]">ASCII</span>
      </div>

      {/* Rows */}
      {rows.map((row, rowIdx) => {
        const rowOffset = rowIdx * BYTES_PER_ROW;
        return (
          <div key={rowIdx} className="flex leading-6">
            {/* Offset */}
            <span className="w-12 shrink-0 text-[var(--color-text-secondary)]/50">
              {rowOffset.toString(16).toUpperCase().padStart(4, '0')}
            </span>

            {/* Hex bytes */}
            <div className="flex flex-1 gap-0">
              {row.map((b, colIdx) => {
                const byteIdx = rowOffset + colIdx;
                const fi = getFieldIndex(byteIdx);
                const range = fi !== null ? fieldRanges[fi] : null;
                const isHovered = fi !== null && fi === hoveredFieldIndex;

                return (
                  <span
                    key={colIdx}
                    className={`inline-block w-[3ch] cursor-default rounded-sm text-center transition-colors ${
                      range ? range.colorClass : ''
                    } ${isHovered ? 'ring-1 ring-white/40 brightness-125' : ''}`}
                    onMouseEnter={() => onHoverField(fi)}
                    onMouseLeave={() => onHoverField(null)}
                    title={range ? `${range.label} (${range.labelKo})` : undefined}
                  >
                    {b.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                );
              })}
              {/* Padding for incomplete row */}
              {row.length < BYTES_PER_ROW &&
                Array.from({ length: BYTES_PER_ROW - row.length }, (_, i) => (
                  <span key={`pad-${i}`} className="inline-block w-[3ch]" />
                ))}
            </div>

            {/* ASCII */}
            <div className="ml-4 flex w-[17ch]">
              {row.map((b, colIdx) => {
                const byteIdx = rowOffset + colIdx;
                const fi = getFieldIndex(byteIdx);
                const range = fi !== null ? fieldRanges[fi] : null;
                const isHovered = fi !== null && fi === hoveredFieldIndex;

                return (
                  <span
                    key={colIdx}
                    className={`inline-block w-[1ch] cursor-default text-center ${
                      range ? range.colorClass : 'text-[var(--color-text-secondary)]/40'
                    } ${isHovered ? 'brightness-125' : ''}`}
                    onMouseEnter={() => onHoverField(fi)}
                    onMouseLeave={() => onHoverField(null)}
                  >
                    {getAsciiChar(b)}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-2">
        {fieldRanges.map((r, i) => (
          <span
            key={i}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${r.colorClass} ${
              hoveredFieldIndex === i ? 'ring-1 ring-white/40' : ''
            }`}
            onMouseEnter={() => onHoverField(i)}
            onMouseLeave={() => onHoverField(null)}
          >
            {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}
