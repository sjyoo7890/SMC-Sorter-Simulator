import { STX, ETX, MACHINE_ID_LENGTH } from './packet';
import { intToBytes, stringToBytes } from './utils';
import { telegramMeta } from '../../constants/telegramMeta';
import { TelegramNumber } from '../../constants/telegramNumbers';

/**
 * 공통 패킷 래퍼: STX + DataType + MachineID + TelegramNo + DataLength + Data + ETX
 */
function wrapPacket(
  dataTypeChar: string,
  machineId: string,
  telegramNo: number,
  data: number[],
): number[] {
  const mid = stringToBytes(machineId.padEnd(MACHINE_ID_LENGTH, ' ').slice(0, MACHINE_ID_LENGTH));
  return [
    STX,
    dataTypeChar.charCodeAt(0),
    ...mid,
    ...intToBytes(telegramNo, 2),
    ...intToBytes(data.length, 2),
    ...data,
    ETX,
  ];
}

// ---------------------------------------------------------------------------
// 필드값을 바이트 배열로 인코딩하는 헬퍼
// ---------------------------------------------------------------------------

function encodeFieldValue(
  value: number | string,
  byteSize: number,
  dataType: string,
): number[] {
  if (dataType === 'string') {
    const str = String(value).padEnd(byteSize, ' ').slice(0, byteSize);
    return stringToBytes(str);
  }
  return intToBytes(Number(value), byteSize);
}

// ---------------------------------------------------------------------------
// 범용 인코딩: 반복 필드가 없는 텔레그램
// ---------------------------------------------------------------------------

/**
 * 범용 인코더 – 텔레그램 메타에 따라 fields 객체를 바이트로 직렬화
 */
export function encodeTelegram(
  telegramNo: number,
  machineId: string,
  fields: Record<string, number | string>,
): number[] {
  const meta = telegramMeta[telegramNo];
  if (!meta) throw new Error(`Unknown telegram: ${telegramNo}`);

  // 반복 필드가 있는 텔레그램은 전용 인코더로 분기
  if (
    telegramNo === TelegramNumber.InductionStatus ||
    telegramNo === TelegramNumber.InductionMode
  ) {
    return encodeRepeatingTelegram(telegramNo, machineId, fields);
  }

  const data: number[] = [];
  for (const field of meta.fields) {
    const value = fields[field.name] ?? 0;
    data.push(...encodeFieldValue(value, field.byteSize, field.dataType));
  }

  return wrapPacket(meta.dataTypeChar, machineId, telegramNo, data);
}

// ---------------------------------------------------------------------------
// 반복 필드 텔레그램 (InductionStatus / InductionMode)
// ---------------------------------------------------------------------------

function encodeRepeatingTelegram(
  telegramNo: number,
  machineId: string,
  fields: Record<string, number | string>,
): number[] {
  const meta = telegramMeta[telegramNo];
  const count = Number(fields['InductionCount'] ?? 0);
  const data: number[] = [...intToBytes(count, 2)];

  const isStatus = telegramNo === TelegramNumber.InductionStatus;
  const valueFieldName = isStatus ? 'InductionStatus' : 'InductionMode';

  for (let i = 0; i < count; i++) {
    const no = Number(fields[`InductionNo_${i}`] ?? (i + 1));
    const val = Number(fields[`${valueFieldName}_${i}`] ?? 0);
    data.push(...intToBytes(no, 2));
    data.push(...intToBytes(val, 2));
  }

  return wrapPacket(meta.dataTypeChar, machineId, telegramNo, data);
}

// ---------------------------------------------------------------------------
// 편의 래퍼 함수
// ---------------------------------------------------------------------------

export function encodeHeartBeat(machineId: string, activeStatus: number): number[] {
  return encodeTelegram(TelegramNumber.HeartBeat, machineId, { ActiveStatus: activeStatus });
}

export function encodeSorterStatus(machineId: string, sorterStatus: number): number[] {
  return encodeTelegram(TelegramNumber.SorterStatus, machineId, { SorterStatus: sorterStatus });
}

export function encodeInductionStatus(
  machineId: string,
  inductions: Array<{ no: number; status: number }>,
): number[] {
  const fields: Record<string, number> = { InductionCount: inductions.length };
  inductions.forEach((ind, i) => {
    fields[`InductionNo_${i}`] = ind.no;
    fields[`InductionStatus_${i}`] = ind.status;
  });
  return encodeTelegram(TelegramNumber.InductionStatus, machineId, fields);
}

export function encodeInductionMode(
  machineId: string,
  inductions: Array<{ no: number; mode: number }>,
): number[] {
  const fields: Record<string, number> = { InductionCount: inductions.length };
  inductions.forEach((ind, i) => {
    fields[`InductionNo_${i}`] = ind.no;
    fields[`InductionMode_${i}`] = ind.mode;
  });
  return encodeTelegram(TelegramNumber.InductionMode, machineId, fields);
}

export function encodeItemInducted(
  machineId: string,
  data: {
    cellIndexNo: number;
    cellCount: number;
    pid: number;
    inductionNo: number;
    mode: number;
    mainDestination: number;
    destination1: number;
    destination2: number;
    destination3: number;
    destination4: number;
  },
): number[] {
  return encodeTelegram(TelegramNumber.ItemInducted, machineId, {
    CellIndexNo: data.cellIndexNo,
    CellCount: data.cellCount,
    PID: data.pid,
    InductionNo: data.inductionNo,
    Mode: data.mode,
    MainDestination: data.mainDestination,
    Destination1: data.destination1,
    Destination2: data.destination2,
    Destination3: data.destination3,
    Destination4: data.destination4,
  });
}

export function encodeItemDischarged(
  machineId: string,
  data: {
    cellIndexNo: number;
    inductionNo: number;
    mode: number;
    pid: number;
    chuteNumber: number;
    recirculationCount: number;
  },
): number[] {
  return encodeTelegram(TelegramNumber.ItemDischarged, machineId, {
    CellIndexNo: data.cellIndexNo,
    InductionNo: data.inductionNo,
    Mode: data.mode,
    PID: data.pid,
    ChuteNumber: data.chuteNumber,
    RecirculationCount: data.recirculationCount,
  });
}

export function encodeItemSortedConfirm(
  machineId: string,
  data: {
    cellIndexNo: number;
    inductionNo: number;
    mode: number;
    pid: number;
    chuteNumber: number;
    recirculationCount: number;
    status: number;
  },
): number[] {
  return encodeTelegram(TelegramNumber.ItemSortedConfirm, machineId, {
    CellIndexNo: data.cellIndexNo,
    InductionNo: data.inductionNo,
    Mode: data.mode,
    PID: data.pid,
    ChuteNumber: data.chuteNumber,
    RecirculationCount: data.recirculationCount,
    Status: data.status,
  });
}

export function encodeDestinationRequest(
  machineId: string,
  data: {
    itemNo: string;
    cellIndexNo: number;
    inductionNo: number;
    mainDestination: number;
    destination1: number;
    destination2: number;
    destination3: number;
    destination4: number;
  },
): number[] {
  return encodeTelegram(TelegramNumber.DestinationRequest, machineId, {
    ItemNo: data.itemNo,
    CellIndexNo: data.cellIndexNo,
    InductionNo: data.inductionNo,
    MainDestination: data.mainDestination,
    Destination1: data.destination1,
    Destination2: data.destination2,
    Destination3: data.destination3,
    Destination4: data.destination4,
  });
}

export function encodeSetControlSorter(machineId: string, request: number): number[] {
  return encodeTelegram(TelegramNumber.SetControlSorter, machineId, { Request: request });
}

export function encodeSetControlSorterAck(machineId: string, request: number, status: number): number[] {
  return encodeTelegram(TelegramNumber.SetControlSorterAck, machineId, { Request: request, Status: status });
}

export function encodeSetControlInduction(machineId: string, inductionNo: number, request: number): number[] {
  return encodeTelegram(TelegramNumber.SetControlInduction, machineId, { InductionNo: inductionNo, Request: request });
}

export function encodeSetControlInductionAck(machineId: string, inductionNo: number, request: number, status: number): number[] {
  return encodeTelegram(TelegramNumber.SetControlInductionAck, machineId, { InductionNo: inductionNo, Request: request, Status: status });
}

export function encodeSetInductionMode(machineId: string, inductionNo: number, mode: number): number[] {
  return encodeTelegram(TelegramNumber.SetInductionMode, machineId, { InductionNo: inductionNo, Mode: mode });
}

export function encodeSetInductionModeAck(machineId: string, inductionNo: number, mode: number, reason: number): number[] {
  return encodeTelegram(TelegramNumber.SetInductionModeAck, machineId, { InductionNo: inductionNo, Mode: mode, Reason: reason });
}

export function encodeSetOverflowConfiguration(machineId: string, chute1: number, chute2: number, maxRecirc: number): number[] {
  return encodeTelegram(TelegramNumber.SetOverflowConfiguration, machineId, { OverflowChute1: chute1, OverflowChute2: chute2, MaxRecirculation: maxRecirc });
}

export function encodeSetOverflowConfigurationAck(machineId: string, chute1: number, chute2: number, maxRecirc: number, reason: number): number[] {
  return encodeTelegram(TelegramNumber.SetOverflowConfigurationAck, machineId, { OverflowChute1: chute1, OverflowChute2: chute2, MaxRecirculation: maxRecirc, Reason: reason });
}

export function encodeSetResetRequest(machineId: string, resetModule: number): number[] {
  return encodeTelegram(TelegramNumber.SetResetRequest, machineId, { ResetModule: resetModule });
}

export function encodeSetResetRequestAck(machineId: string, resetModule: number, reason: number): number[] {
  return encodeTelegram(TelegramNumber.SetResetRequestAck, machineId, { ResetModule: resetModule, Reason: reason });
}
