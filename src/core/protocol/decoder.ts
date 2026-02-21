import { STX, ETX, HEADER_SIZE, MACHINE_ID_LENGTH } from './packet';
import { bytesToInt, bytesToString } from './utils';
import { telegramMeta } from '../../constants/telegramMeta';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sortStatusCodes } from '../../constants/sortStatusCodes';

export interface DecodedField {
  name: string;
  nameKo: string;
  rawBytes: number[];
  value: number | string;
  description: string;
}

export interface DecodedTelegram {
  telegramNo: number;
  machineId: string;
  dataTypeChar: string;
  fields: Record<string, DecodedField>;
}

/**
 * 바이트 배열을 구조화된 텔레그램 객체로 디코딩
 */
export function decodeTelegram(rawBytes: number[]): DecodedTelegram {
  // STX/ETX 검증
  if (rawBytes[0] !== STX) {
    throw new Error(`Invalid STX: expected 0x${STX.toString(16)}, got 0x${rawBytes[0]?.toString(16)}`);
  }
  if (rawBytes[rawBytes.length - 1] !== ETX) {
    throw new Error(`Invalid ETX: expected 0x${ETX.toString(16)}, got 0x${rawBytes[rawBytes.length - 1]?.toString(16)}`);
  }

  // 헤더 파싱
  const dataTypeChar = String.fromCharCode(rawBytes[1]);
  const machineId = bytesToString(rawBytes.slice(2, 2 + MACHINE_ID_LENGTH)).trim();
  const telegramNo = bytesToInt(rawBytes.slice(8, 10));
  const dataLength = bytesToInt(rawBytes.slice(10, 12));

  // Data 영역
  const dataBytes = rawBytes.slice(HEADER_SIZE, HEADER_SIZE + dataLength);

  // 메타 검색
  const meta = telegramMeta[telegramNo];
  if (!meta) {
    throw new Error(`Unknown telegram number: ${telegramNo}`);
  }

  // 반복 필드 처리 분기
  let fields: Record<string, DecodedField>;
  if (
    telegramNo === TelegramNumber.InductionStatus ||
    telegramNo === TelegramNumber.InductionMode
  ) {
    fields = decodeRepeatingFields(telegramNo, dataBytes);
  } else {
    fields = decodeFixedFields(telegramNo, dataBytes);
  }

  return { telegramNo, machineId, dataTypeChar, fields };
}

// ---------------------------------------------------------------------------
// 고정 필드 디코딩
// ---------------------------------------------------------------------------

function decodeFixedFields(telegramNo: number, data: number[]): Record<string, DecodedField> {
  const meta = telegramMeta[telegramNo];
  const fields: Record<string, DecodedField> = {};
  let offset = 0;

  for (const fieldMeta of meta.fields) {
    const raw = data.slice(offset, offset + fieldMeta.byteSize);
    let value: number | string;

    if (fieldMeta.dataType === 'string') {
      value = bytesToString(raw).trim();
    } else {
      value = bytesToInt(raw);
    }

    fields[fieldMeta.name] = {
      name: fieldMeta.name,
      nameKo: fieldMeta.nameKo,
      rawBytes: raw,
      value,
      description: getFieldDescription(telegramNo, fieldMeta.name, value),
    };

    offset += fieldMeta.byteSize;
  }

  return fields;
}

// ---------------------------------------------------------------------------
// 반복 필드 디코딩 (InductionStatus / InductionMode)
// ---------------------------------------------------------------------------

function decodeRepeatingFields(telegramNo: number, data: number[]): Record<string, DecodedField> {
  const isStatus = telegramNo === TelegramNumber.InductionStatus;
  const fields: Record<string, DecodedField> = {};

  const countRaw = data.slice(0, 2);
  const count = bytesToInt(countRaw);
  fields['InductionCount'] = {
    name: 'InductionCount',
    nameKo: '인덕션 수',
    rawBytes: countRaw,
    value: count,
    description: `${count}개`,
  };

  let offset = 2;
  for (let i = 0; i < count; i++) {
    const noRaw = data.slice(offset, offset + 2);
    const no = bytesToInt(noRaw);
    fields[`InductionNo_${i}`] = {
      name: `InductionNo_${i}`,
      nameKo: `인덕션 번호 ${i + 1}`,
      rawBytes: noRaw,
      value: no,
      description: `인덕션 #${no}`,
    };
    offset += 2;

    const valRaw = data.slice(offset, offset + 2);
    const val = bytesToInt(valRaw);
    const valFieldName = isStatus ? `InductionStatus_${i}` : `InductionMode_${i}`;
    const valFieldNameKo = isStatus ? `인덕션 상태 ${i + 1}` : `인덕션 모드 ${i + 1}`;
    fields[valFieldName] = {
      name: valFieldName,
      nameKo: valFieldNameKo,
      rawBytes: valRaw,
      value: val,
      description: isStatus
        ? describeInductionStatus(val)
        : describeInductionMode(val),
    };
    offset += 2;
  }

  return fields;
}

// ---------------------------------------------------------------------------
// 필드값 → 한글 설명
// ---------------------------------------------------------------------------

function getFieldDescription(telegramNo: number, fieldName: string, value: number | string): string {
  const v = Number(value);

  switch (fieldName) {
    case 'ActiveStatus':
      return v === 1 ? 'Active' : 'Inactive';

    case 'SorterStatus':
      return describeSorterStatus(v);

    case 'InductionStatus':
      return describeInductionStatus(v);

    case 'InductionMode':
    case 'Mode':
      return describeInductionMode(v);

    case 'Request':
      return describeRequest(telegramNo, v);

    case 'Status':
      if (telegramNo === TelegramNumber.ItemSortedConfirm) {
        const code = sortStatusCodes[v];
        return code ? `${code.nameKo} (${code.name})` : `Unknown(${v})`;
      }
      return describeAckStatus(v);

    case 'Reason':
      return describeAckStatus(v);

    case 'ResetModule':
      return v === 1 ? 'Sorter' : v === 2 ? 'Conveyor' : `Unknown(${v})`;

    case 'PID':
      return `PID ${value}`;

    case 'CellIndexNo':
      return `Cell #${v}`;

    case 'CellCount':
      return `${v}셀`;

    case 'ChuteNumber':
      return `Chute #${v}`;

    case 'RecirculationCount':
      return `${v}회`;

    case 'InductionNo':
      return `인덕션 #${v}`;

    case 'InductionCount':
      return `${v}개`;

    case 'MainDestination':
    case 'Destination1':
    case 'Destination2':
    case 'Destination3':
    case 'Destination4':
      return v === 0 ? '미지정' : `Chute #${v}`;

    case 'OverflowChute1':
    case 'OverflowChute2':
      return v === 0 ? '미설정' : `Chute #${v}`;

    case 'MaxRecirculation':
      return `최대 ${v}회`;

    case 'ItemNo':
      return String(value);

    default:
      return String(value);
  }
}

function describeSorterStatus(v: number): string {
  switch (v) {
    case 0: return '정지';
    case 1: return '운전';
    case 2: return '에러';
    default: return `Unknown(${v})`;
  }
}

function describeInductionStatus(v: number): string {
  switch (v) {
    case 0: return '정지';
    case 1: return '운전';
    case 2: return '에러';
    default: return `Unknown(${v})`;
  }
}

function describeInductionMode(v: number): string {
  switch (v) {
    case 0: return 'BCR';
    case 1: return '타건';
    default: return `Unknown(${v})`;
  }
}

function describeRequest(telegramNo: number, v: number): string {
  if (
    telegramNo === TelegramNumber.SetControlSorter ||
    telegramNo === TelegramNumber.SetControlSorterAck
  ) {
    switch (v) {
      case 0: return '정지';
      case 1: return '가동';
      case 2: return '구분완료시 정지';
      default: return `Unknown(${v})`;
    }
  }
  // InductionControl
  switch (v) {
    case 0: return '정지';
    case 1: return '가동';
    case 2: return '알람해제';
    case 3: return '타건재요청';
    default: return `Unknown(${v})`;
  }
}

function describeAckStatus(v: number): string {
  switch (v) {
    case 0: return 'Ok';
    case 1: return 'Error';
    case 2: return 'Blocked';
    default: return `Unknown(${v})`;
  }
}
