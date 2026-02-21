import type { TelegramLog } from '../types/log';
import { telegramMeta } from '../constants/telegramMeta';
import { TelegramNumber } from '../constants/telegramNumbers';
import {
  encodeHeartBeat,
  encodeSorterStatus,
  encodeInductionStatus,
  encodeSetControlSorter,
  encodeSetControlSorterAck,
  encodeItemInducted,
  encodeDestinationRequest,
  encodeItemDischarged,
  encodeItemSortedConfirm,
  encodeSetOverflowConfiguration,
  encodeSetOverflowConfigurationAck,
} from '../core/protocol/encoder';

let idCounter = 0;
function nextId(): string {
  return String(++idCounter).padStart(6, '0');
}

const MID = 'PSM001';

function makeLog(
  telegramNo: number,
  rawBytes: number[],
  decodedFields: Record<string, { value: number | string; description: string }>,
  offsetMs: number = 0,
): TelegramLog {
  const meta = telegramMeta[telegramNo];
  return {
    id: nextId(),
    timestamp: new Date(Date.now() - offsetMs),
    direction: meta.direction,
    telegramNo,
    telegramName: meta.name,
    machineId: MID,
    port: meta.port,
    rawBytes,
    decodedFields,
    dataTypeChar: meta.dataTypeChar,
  };
}

export function generateDummyLogs(): TelegramLog[] {
  return [
    makeLog(TelegramNumber.HeartBeat,
      encodeHeartBeat(MID, 1),
      { ActiveStatus: { value: 1, description: 'Active' } },
      10000),

    makeLog(TelegramNumber.SorterStatus,
      encodeSorterStatus(MID, 1),
      { SorterStatus: { value: 1, description: '운전' } },
      9000),

    makeLog(TelegramNumber.InductionStatus,
      encodeInductionStatus(MID, [{ no: 1, status: 1 }, { no: 2, status: 0 }]),
      {
        InductionCount: { value: 2, description: '2개' },
        InductionNo_0: { value: 1, description: '인덕션 #1' },
        InductionStatus_0: { value: 1, description: '운전' },
        InductionNo_1: { value: 2, description: '인덕션 #2' },
        InductionStatus_1: { value: 0, description: '정지' },
      },
      8000),

    makeLog(TelegramNumber.SetControlSorter,
      encodeSetControlSorter(MID, 1),
      { Request: { value: 1, description: '가동' } },
      7000),

    makeLog(TelegramNumber.SetControlSorterAck,
      encodeSetControlSorterAck(MID, 1, 0),
      { Request: { value: 1, description: '가동' }, Status: { value: 0, description: 'Ok' } },
      6500),

    makeLog(TelegramNumber.ItemInducted,
      encodeItemInducted(MID, {
        cellIndexNo: 42, cellCount: 1, pid: 100001, inductionNo: 1,
        mode: 0, mainDestination: 15, destination1: 0, destination2: 0, destination3: 0, destination4: 0,
      }),
      {
        CellIndexNo: { value: 42, description: 'Cell #42' },
        CellCount: { value: 1, description: '1셀' },
        PID: { value: 100001, description: 'PID 100001' },
        InductionNo: { value: 1, description: '인덕션 #1' },
        Mode: { value: 0, description: 'BCR' },
        MainDestination: { value: 15, description: 'Chute #15' },
        Destination1: { value: 0, description: '미지정' },
        Destination2: { value: 0, description: '미지정' },
        Destination3: { value: 0, description: '미지정' },
        Destination4: { value: 0, description: '미지정' },
      },
      5000),

    makeLog(TelegramNumber.DestinationRequest,
      encodeDestinationRequest(MID, {
        itemNo: 'ABC123', cellIndexNo: 42, inductionNo: 1,
        mainDestination: 15, destination1: 20, destination2: 0, destination3: 0, destination4: 0,
      }),
      {
        ItemNo: { value: 'ABC123', description: 'ABC123' },
        CellIndexNo: { value: 42, description: 'Cell #42' },
        InductionNo: { value: 1, description: '인덕션 #1' },
        MainDestination: { value: 15, description: 'Chute #15' },
        Destination1: { value: 20, description: 'Chute #20' },
        Destination2: { value: 0, description: '미지정' },
        Destination3: { value: 0, description: '미지정' },
        Destination4: { value: 0, description: '미지정' },
      },
      4000),

    makeLog(TelegramNumber.ItemDischarged,
      encodeItemDischarged(MID, {
        cellIndexNo: 42, inductionNo: 1, mode: 0, pid: 100001, chuteNumber: 15, recirculationCount: 0,
      }),
      {
        CellIndexNo: { value: 42, description: 'Cell #42' },
        InductionNo: { value: 1, description: '인덕션 #1' },
        Mode: { value: 0, description: 'BCR' },
        PID: { value: 100001, description: 'PID 100001' },
        ChuteNumber: { value: 15, description: 'Chute #15' },
        RecirculationCount: { value: 0, description: '0회' },
      },
      3000),

    makeLog(TelegramNumber.ItemSortedConfirm,
      encodeItemSortedConfirm(MID, {
        cellIndexNo: 42, inductionNo: 1, mode: 0, pid: 100001, chuteNumber: 15, recirculationCount: 0, status: 1,
      }),
      {
        CellIndexNo: { value: 42, description: 'Cell #42' },
        InductionNo: { value: 1, description: '인덕션 #1' },
        Mode: { value: 0, description: 'BCR' },
        PID: { value: 100001, description: 'PID 100001' },
        ChuteNumber: { value: 15, description: 'Chute #15' },
        RecirculationCount: { value: 0, description: '0회' },
        Status: { value: 1, description: '정상 구분' },
      },
      2000),

    makeLog(TelegramNumber.SetOverflowConfiguration,
      encodeSetOverflowConfiguration(MID, 200, 202, 2),
      {
        OverflowChute1: { value: 200, description: 'Chute #200' },
        OverflowChute2: { value: 202, description: 'Chute #202' },
        MaxRecirculation: { value: 2, description: '최대 2회' },
      },
      1000),

    makeLog(TelegramNumber.SetOverflowConfigurationAck,
      encodeSetOverflowConfigurationAck(MID, 200, 202, 2, 0),
      {
        OverflowChute1: { value: 200, description: 'Chute #200' },
        OverflowChute2: { value: 202, description: 'Chute #202' },
        MaxRecirculation: { value: 2, description: '최대 2회' },
        Reason: { value: 0, description: 'Ok' },
      },
      500),
  ];
}
