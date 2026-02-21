import { telegramMeta } from '../../constants/telegramMeta';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { HEADER_SIZE } from '../../core/protocol/packet';
import { getFieldColorClass } from '../../core/protocol/utils';

export interface PacketFieldRange {
  start: number;
  end: number;       // exclusive
  colorClass: string;
  label: string;
  labelKo: string;
  type: 'header' | 'data';
}

const dataFieldColors = [
  'text-green-400 bg-green-900/30',
  'text-teal-400 bg-teal-900/30',
  'text-emerald-400 bg-emerald-900/30',
  'text-lime-400 bg-lime-900/30',
  'text-green-300 bg-green-900/20',
  'text-teal-300 bg-teal-900/20',
  'text-emerald-300 bg-emerald-900/20',
  'text-lime-300 bg-lime-900/20',
  'text-green-500 bg-green-900/40',
  'text-teal-500 bg-teal-900/40',
];

export function buildFieldRanges(telegramNo: number, rawBytes: number[]): PacketFieldRange[] {
  const ranges: PacketFieldRange[] = [];

  // Header fields
  ranges.push({
    start: 0, end: 1,
    colorClass: getFieldColorClass('stx'),
    label: 'STX', labelKo: '패킷 시작', type: 'header',
  });
  ranges.push({
    start: 1, end: 2,
    colorClass: getFieldColorClass('dataType'),
    label: 'DataType', labelKo: '데이터 타입', type: 'header',
  });
  ranges.push({
    start: 2, end: 8,
    colorClass: getFieldColorClass('machineId'),
    label: 'MachineID', labelKo: '모듈 ID', type: 'header',
  });
  ranges.push({
    start: 8, end: 10,
    colorClass: getFieldColorClass('telegramNo'),
    label: 'TelegramNo', labelKo: '텔레그램 번호', type: 'header',
  });
  ranges.push({
    start: 10, end: 12,
    colorClass: getFieldColorClass('dataLength'),
    label: 'DataLength', labelKo: '데이터 길이', type: 'header',
  });

  // Data fields
  const meta = telegramMeta[telegramNo];
  if (meta) {
    const isRepeating =
      telegramNo === TelegramNumber.InductionStatus ||
      telegramNo === TelegramNumber.InductionMode;

    if (isRepeating) {
      buildRepeatingDataRanges(ranges, telegramNo, rawBytes);
    } else {
      let offset = HEADER_SIZE;
      meta.fields.forEach((field, i) => {
        ranges.push({
          start: offset,
          end: offset + field.byteSize,
          colorClass: dataFieldColors[i % dataFieldColors.length],
          label: field.name,
          labelKo: field.nameKo,
          type: 'data',
        });
        offset += field.byteSize;
      });
    }
  }

  // ETX
  if (rawBytes.length > 0) {
    ranges.push({
      start: rawBytes.length - 1, end: rawBytes.length,
      colorClass: getFieldColorClass('etx'),
      label: 'ETX', labelKo: '패킷 종료', type: 'header',
    });
  }

  return ranges;
}

function buildRepeatingDataRanges(
  ranges: PacketFieldRange[],
  telegramNo: number,
  rawBytes: number[],
) {
  const isStatus = telegramNo === TelegramNumber.InductionStatus;
  let offset = HEADER_SIZE;
  let colorIdx = 0;

  // InductionCount (2 bytes)
  ranges.push({
    start: offset, end: offset + 2,
    colorClass: dataFieldColors[colorIdx++ % dataFieldColors.length],
    label: 'InductionCount', labelKo: '인덕션 수', type: 'data',
  });

  const count = rawBytes.length >= offset + 2
    ? (rawBytes[offset] << 8) | rawBytes[offset + 1]
    : 0;
  offset += 2;

  for (let i = 0; i < count; i++) {
    ranges.push({
      start: offset, end: offset + 2,
      colorClass: dataFieldColors[colorIdx++ % dataFieldColors.length],
      label: `InductionNo_${i}`, labelKo: `인덕션 번호 ${i + 1}`, type: 'data',
    });
    offset += 2;

    const valLabel = isStatus ? `InductionStatus_${i}` : `InductionMode_${i}`;
    const valLabelKo = isStatus ? `인덕션 상태 ${i + 1}` : `인덕션 모드 ${i + 1}`;
    ranges.push({
      start: offset, end: offset + 2,
      colorClass: dataFieldColors[colorIdx++ % dataFieldColors.length],
      label: valLabel, labelKo: valLabelKo, type: 'data',
    });
    offset += 2;
  }
}
