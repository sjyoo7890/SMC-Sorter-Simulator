import type { Scenario } from './types';
import { TelegramNumber } from '../../../constants/telegramNumbers';

export const overflowHandling: Scenario = {
  id: 'overflow-handling',
  name: 'Overflow Handling',
  nameKo: '오버플로 처리',
  description: '화물이 목적지 배출에 실패하여 재순환 후 오버플로 슈트로 배출',
  steps: [
    {
      delay: 0,
      telegramNo: TelegramNumber.ItemInducted,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, CellCount: 1, PID: 200001,
        InductionNo: 2, Mode: 0,
        MainDestination: 0, Destination1: 0, Destination2: 0, Destination3: 0, Destination4: 0,
      },
      description: '화물 투입: PID=200001, IN2, 자동모드',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.DestinationRequest,
      direction: 'SMC_TO_PLC',
      fields: {
        ItemNo: '200001', CellIndexNo: 42, InductionNo: 2,
        MainDestination: 30, Destination1: 31, Destination2: 0, Destination3: 0, Destination4: 0,
      },
      description: '목적지 설정: Chute #30, 보조 #31',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.ItemDischarged,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, InductionNo: 2, Mode: 0,
        PID: 200001, ChuteNumber: 30, RecirculationCount: 1,
      },
      description: '1회차 배출 실패 → 재순환 (Recirc=1)',
    },
    {
      delay: 300,
      telegramNo: TelegramNumber.ItemSortedConfirm,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, InductionNo: 2, Mode: 0,
        PID: 200001, ChuteNumber: 30, RecirculationCount: 1, Status: 2,
      },
      description: '구분 확인: 슈트 만재 (Status=2)',
    },
    {
      delay: 3000,
      telegramNo: TelegramNumber.ItemDischarged,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, InductionNo: 2, Mode: 0,
        PID: 200001, ChuteNumber: 31, RecirculationCount: 2,
      },
      description: '2회차 배출 실패 → 재순환 (Recirc=2)',
    },
    {
      delay: 300,
      telegramNo: TelegramNumber.ItemSortedConfirm,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, InductionNo: 2, Mode: 0,
        PID: 200001, ChuteNumber: 31, RecirculationCount: 2, Status: 3,
      },
      description: '구분 확인: 슈트 블록 (Status=3)',
    },
    {
      delay: 3000,
      telegramNo: TelegramNumber.ItemDischarged,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, InductionNo: 2, Mode: 0,
        PID: 200001, ChuteNumber: 200, RecirculationCount: 3,
      },
      description: '최대 재순환 초과 → 오버플로 슈트 #200 배출',
    },
    {
      delay: 300,
      telegramNo: TelegramNumber.ItemSortedConfirm,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 42, InductionNo: 2, Mode: 0,
        PID: 200001, ChuteNumber: 200, RecirculationCount: 3, Status: 1,
      },
      description: '구분 확인: 정상 구분 (오버플로 슈트)',
    },
  ],
};
