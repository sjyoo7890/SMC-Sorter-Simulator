import type { Scenario } from './types';
import { TelegramNumber } from '../../../constants/telegramNumbers';

export const modeChange: Scenario = {
  id: 'mode-change',
  name: 'Mode Change',
  nameKo: '모드 변경',
  description: '인덕션 1번의 모드를 BCR에서 타건으로 변경',
  steps: [
    {
      delay: 0,
      telegramNo: TelegramNumber.InductionMode,
      direction: 'PLC_TO_SMC',
      fields: {
        InductionCount: 1,
        InductionNo_0: 1, InductionMode_0: 0,
      },
      description: '인덕션 모드: IN1=BCR',
    },
    {
      delay: 1000,
      telegramNo: TelegramNumber.SetInductionMode,
      direction: 'SMC_TO_PLC',
      fields: { InductionNo: 1, Mode: 1 },
      description: '인덕션 1 모드 변경 요청: 타건',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.SetInductionModeAck,
      direction: 'PLC_TO_SMC',
      fields: { InductionNo: 1, Mode: 1, Reason: 0 },
      description: '인덕션 1 모드 변경 응답: Accepted',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.InductionMode,
      direction: 'PLC_TO_SMC',
      fields: {
        InductionCount: 1,
        InductionNo_0: 1, InductionMode_0: 1,
      },
      description: '인덕션 모드: IN1=타건',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.ItemInducted,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 30, CellCount: 1, PID: 115001,
        InductionNo: 1, Mode: 1,
        MainDestination: 50, Destination1: 51, Destination2: 0, Destination3: 0, Destination4: 0,
      },
      description: '화물 투입: PID=115001, IN1, 수동모드 (목적지 포함)',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.ItemDischarged,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 30, InductionNo: 1, Mode: 1,
        PID: 115001, ChuteNumber: 50, RecirculationCount: 0,
      },
      description: '화물 배출: Chute #50',
    },
    {
      delay: 300,
      telegramNo: TelegramNumber.ItemSortedConfirm,
      direction: 'PLC_TO_SMC',
      fields: {
        CellIndexNo: 30, InductionNo: 1, Mode: 1,
        PID: 115001, ChuteNumber: 50, RecirculationCount: 0, Status: 1,
      },
      description: '구분 확인: 정상 구분',
    },
  ],
};
