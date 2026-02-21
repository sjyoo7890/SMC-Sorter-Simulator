import type { Scenario } from './types';
import { TelegramNumber } from '../../../constants/telegramNumbers';

export const normalSortCycle: Scenario = {
  id: 'normal-sort-cycle',
  name: 'Normal Sort Cycle',
  nameKo: '정상 구분 사이클',
  description: '화물이 투입되어 정상적으로 목적지에 배출되는 전체 사이클',
  steps: [
    {
      delay: 0,
      telegramNo: TelegramNumber.HeartBeat,
      direction: 'PLC_TO_SMC',
      fields: { ActiveStatus: 1 },
      description: 'HeartBeat 수신 (Active)',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.SorterStatus,
      direction: 'PLC_TO_SMC',
      fields: { SorterStatus: 1 },
      description: '소터 상태: 운전 중',
    },
    {
      delay: 1000,
      telegramNo: TelegramNumber.InductionStatus,
      direction: 'PLC_TO_SMC',
      fields: {
        InductionCount: 2,
        InductionNo_0: 1, InductionStatus_0: 1,
        InductionNo_1: 2, InductionStatus_1: 1,
      },
      description: '인덕션 상태: IN1, IN2 운전 중',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.ItemInducted,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 15, CellCount: 1, PID: 100001,
        InductionNo: 1, Mode: 0,
        MainDestination: 0, Destination1: 0, Destination2: 0, Destination3: 0, Destination4: 0,
      },
      description: '화물 투입: PID=100001, IN1, 자동모드',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.DestinationRequest,
      direction: 'SMC_TO_PLC',
      fields: {
        ItemNo: '100001', CellIndexNo: 15, InductionNo: 1,
        MainDestination: 25, Destination1: 26, Destination2: 0, Destination3: 0, Destination4: 0,
      },
      description: '목적지 설정: Chute #25, 보조 #26',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.ItemDischarged,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 15, InductionNo: 1, Mode: 0,
        PID: 100001, ChuteNumber: 25, RecirculationCount: 0,
      },
      description: '화물 배출: Chute #25, 재순환 0회',
    },
    {
      delay: 300,
      telegramNo: TelegramNumber.ItemSortedConfirm,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 15, InductionNo: 1, Mode: 0,
        PID: 100001, ChuteNumber: 25, RecirculationCount: 0, Status: 1,
      },
      description: '구분 확인: 정상 구분 (Status=1)',
    },
  ],
};
