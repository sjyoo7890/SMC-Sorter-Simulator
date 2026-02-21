import type { TelegramLog } from '../../types/log';
import type { PacketFieldRange } from './fieldRanges';
import { bytesToInt, bytesToString } from '../../core/protocol/utils';

interface DecodedViewProps {
  log: TelegramLog;
  fieldRanges: PacketFieldRange[];
  hoveredFieldIndex: number | null;
  onHoverField: (index: number | null) => void;
}

export default function DecodedView({
  log,
  fieldRanges,
  hoveredFieldIndex,
  onHoverField,
}: DecodedViewProps) {
  const headerRanges = fieldRanges.filter((r) => r.type === 'header');
  const dataRanges = fieldRanges.filter((r) => r.type === 'data');

  return (
    <div className="overflow-x-auto font-mono text-xs">
      <table className="w-full">
        <thead>
          <tr className="text-[10px] uppercase text-[var(--color-text-secondary)]/60">
            <th className="w-3 px-0 py-1" />
            <th className="px-2 py-1 text-left">Field</th>
            <th className="px-2 py-1 text-center">Size</th>
            <th className="px-2 py-1 text-left">Hex</th>
            <th className="px-2 py-1 text-left">Value</th>
            <th className="px-2 py-1 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {/* Header fields */}
          {headerRanges
            .filter((r) => r.label !== 'ETX')
            .map((range) => {
              const globalIdx = fieldRanges.indexOf(range);
              return (
                <FieldRow
                  key={range.label}
                  range={range}
                  rawBytes={log.rawBytes}
                  isHovered={hoveredFieldIndex === globalIdx}
                  onMouseEnter={() => onHoverField(globalIdx)}
                  onMouseLeave={() => onHoverField(null)}
                />
              );
            })}

          {/* Separator */}
          {dataRanges.length > 0 && (
            <tr>
              <td colSpan={6} className="py-1">
                <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]/50">
                  <span className="h-px flex-1 bg-[var(--color-border)]" />
                  Data Fields
                  <span className="h-px flex-1 bg-[var(--color-border)]" />
                </div>
              </td>
            </tr>
          )}

          {/* Data fields */}
          {dataRanges.map((range) => {
            const globalIdx = fieldRanges.indexOf(range);
            const decodedField = log.decodedFields[range.label];
            return (
              <FieldRow
                key={`${range.label}-${range.start}`}
                range={range}
                rawBytes={log.rawBytes}
                isHovered={hoveredFieldIndex === globalIdx}
                onMouseEnter={() => onHoverField(globalIdx)}
                onMouseLeave={() => onHoverField(null)}
                description={decodedField?.description}
                indent
              />
            );
          })}

          {/* ETX */}
          {headerRanges
            .filter((r) => r.label === 'ETX')
            .map((range) => {
              const globalIdx = fieldRanges.indexOf(range);
              return (
                <FieldRow
                  key="ETX"
                  range={range}
                  rawBytes={log.rawBytes}
                  isHovered={hoveredFieldIndex === globalIdx}
                  onMouseEnter={() => onHoverField(globalIdx)}
                  onMouseLeave={() => onHoverField(null)}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function FieldRow({
  range,
  rawBytes,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  description,
  indent,
}: {
  range: PacketFieldRange;
  rawBytes: number[];
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  description?: string;
  indent?: boolean;
}) {
  const bytes = rawBytes.slice(range.start, range.end);
  const hexStr = bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join('');
  const size = range.end - range.start;

  // Compute display value
  let displayValue: string;
  if (range.label === 'STX') displayValue = '-';
  else if (range.label === 'ETX') displayValue = '-';
  else if (range.label === 'DataType') displayValue = `'${String.fromCharCode(bytes[0])}'`;
  else if (range.label === 'MachineID') displayValue = bytesToString(bytes).trim();
  else if (size <= 4 && range.type === 'header') displayValue = String(bytesToInt(bytes));
  else if (size === 6) displayValue = bytesToString(bytes).trim(); // ItemNo
  else displayValue = String(bytesToInt(bytes));

  // Compute description
  let desc = description ?? '';
  if (range.label === 'STX') desc = '패킷 시작';
  else if (range.label === 'ETX') desc = '패킷 종료';
  else if (range.label === 'DataType') desc = range.labelKo;
  else if (range.label === 'MachineID') desc = '모듈 ID';
  else if (range.label === 'TelegramNo') desc = range.labelKo;
  else if (range.label === 'DataLength') desc = '데이터 길이';

  return (
    <tr
      className={`transition-colors ${isHovered ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Color indicator */}
      <td className="px-0 py-1">
        <span className={`inline-block h-4 w-1 rounded-full ${range.colorClass.split(' ')[1] ?? range.colorClass}`} />
      </td>

      {/* Field name */}
      <td className={`px-2 py-1 ${indent ? 'pl-4' : ''}`}>
        <span className={range.colorClass.split(' ')[0]}>
          {range.label}
        </span>
        <span className="ml-1.5 text-[10px] text-[var(--color-text-secondary)]/50">
          {range.labelKo}
        </span>
      </td>

      {/* Size */}
      <td className="px-2 py-1 text-center text-[var(--color-text-secondary)]">
        {size} {size === 1 ? 'byte' : 'bytes'}
      </td>

      {/* Hex */}
      <td className="px-2 py-1 text-[var(--color-text-secondary)]">
        {hexStr}
      </td>

      {/* Value */}
      <td className="px-2 py-1 text-[var(--color-text-primary)]">
        {displayValue}
      </td>

      {/* Description */}
      <td className="px-2 py-1 text-[var(--color-text-secondary)]">
        {desc}
      </td>
    </tr>
  );
}
