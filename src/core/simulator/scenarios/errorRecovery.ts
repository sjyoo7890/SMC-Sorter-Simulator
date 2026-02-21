import type { Scenario } from './types';
import { TelegramNumber } from '../../../constants/telegramNumbers';

export const errorRecovery: Scenario = {
  id: 'error-recovery',
  name: 'Error & Recovery',
  nameKo: '에러 및 복구',
  description: '소터에 에러가 발생하고 리셋을 통해 복구하는 과정',
  steps: [
    {
      delay: 0,
      telegramNo: TelegramNumber.SorterStatus,
      direction: 'PLC_TO_SMC',
      fields: { SorterStatus: 1 },
      description: '소터 상태: 운전 중',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.SorterStatus,
      direction: 'PLC_TO_SMC',
      fields: { SorterStatus: 2 },
      description: '소터 상태: 에러 발생!',
    },
    {
      delay: 3000,
      telegramNo: TelegramNumber.SetResetRequest,
      direction: 'SMC_TO_PLC',
      fields: { ResetModule: 1 },
      description: '소터 리셋 요청',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.SetResetRequestAck,
      direction: 'PLC_TO_SMC',
      fields: { ResetModule: 1, Reason: 0 },
      description: '소터 리셋 응답: Accepted',
    },
    {
      delay: 2000,
      telegramNo: TelegramNumber.SorterStatus,
      direction: 'PLC_TO_SMC',
      fields: { SorterStatus: 1 },
      description: '소터 상태: 복구 완료, 운전 중',
    },
  ],
};
