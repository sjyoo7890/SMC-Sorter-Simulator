import { useState } from 'react';

export interface FieldRange {
  start: number;
  end: number;   // exclusive
  color: string; // tailwind classes e.g. 'text-red-400 bg-red-900/30'
  label: string;
}

interface HexViewProps {
  bytes: number[];
  fieldRanges?: FieldRange[];
  onHoverField?: (fieldIndex: number | null) => void;
}

export default function HexView({ bytes, fieldRanges = [], onHoverField }: HexViewProps) {
  const [hoveredField, setHoveredField] = useState<number | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{ label: string; x: number; y: number } | null>(null);

  function getFieldIndex(byteIndex: number): number | null {
    for (let i = 0; i < fieldRanges.length; i++) {
      if (byteIndex >= fieldRanges[i].start && byteIndex < fieldRanges[i].end) {
        return i;
      }
    }
    return null;
  }

  function getFieldStyle(byteIndex: number): string {
    const fi = getFieldIndex(byteIndex);
    if (fi === null) return '';
    const range = fieldRanges[fi];
    const isHovered = hoveredField === fi;
    return `${range.color} ${isHovered ? 'ring-1 ring-white/30' : ''}`;
  }

  function handleMouseEnter(byteIndex: number, e: React.MouseEvent) {
    const fi = getFieldIndex(byteIndex);
    setHoveredField(fi);
    onHoverField?.(fi);
    if (fi !== null) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltipInfo({ label: fieldRanges[fi].label, x: rect.left, y: rect.top - 28 });
    }
  }

  function handleMouseLeave() {
    setHoveredField(null);
    onHoverField?.(null);
    setTooltipInfo(null);
  }

  return (
    <div className="relative">
      {/* Offset header */}
      <div className="mb-1 flex gap-[3px] font-mono text-[10px] text-[var(--color-text-secondary)]/50">
        {bytes.map((_, i) => (
          <span key={i} className="w-[22px] text-center">
            {i.toString().padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Hex bytes */}
      <div className="flex flex-wrap gap-[3px] font-mono text-xs">
        {bytes.map((b, i) => (
          <span
            key={i}
            className={`inline-block w-[22px] cursor-default rounded px-0.5 text-center transition-colors ${getFieldStyle(i)}`}
            onMouseEnter={(e) => handleMouseEnter(i, e)}
            onMouseLeave={handleMouseLeave}
          >
            {b.toString(16).padStart(2, '0').toUpperCase()}
          </span>
        ))}
      </div>

      {/* Field legend */}
      {fieldRanges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {fieldRanges.map((range, i) => (
            <span
              key={i}
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${range.color} ${
                hoveredField === i ? 'ring-1 ring-white/40' : ''
              }`}
            >
              {range.label}
            </span>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {tooltipInfo && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-gray-800 px-2 py-1 text-[10px] text-white shadow-lg"
          style={{ left: tooltipInfo.x, top: tooltipInfo.y }}
        >
          {tooltipInfo.label}
        </div>
      )}
    </div>
  );
}
