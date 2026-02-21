import type { Scenario } from './types';
import { TelegramNumber } from '../../../constants/telegramNumbers';

export const systemStartup: Scenario = {
  id: 'system-startup',
  name: 'System Startup',
  nameKo: '시스템 기동',
  description: '소터 및 인덕션을 순차적으로 기동하는 과정',
  steps: [
    {
      delay: 0,
      telegramNo: TelegramNumber.HeartBeat,
      direction: 'PLC_TO_SMC',
      fields: { ActiveStatus: 1 },
      description: 'HeartBeat 수신 (Active)',
    },
    {
      delay: 1000,
      telegramNo: TelegramNumber.SetControlSorter,
      direction: 'SMC_TO_PLC',
      fields: { Request: 1 },
      description: '소터 가동 요청',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.SetControlSorterAck,
      direction: 'PLC_TO_SMC',
      fields: { Request: 1, Status: 0 },
      description: '소터 가동 응답: Ok',
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
      telegramNo: TelegramNumber.SetControlInduction,
      direction: 'SMC_TO_PLC',
      fields: { InductionNo: 1, Request: 1 },
      description: '인덕션 1 가동 요청',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.SetControlInductionAck,
      direction: 'PLC_TO_SMC',
      fields: { InductionNo: 1, Request: 1, Status: 0 },
      description: '인덕션 1 가동 응답: Ok',
    },
    {
      delay: 1000,
      telegramNo: TelegramNumber.SetControlInduction,
      direction: 'SMC_TO_PLC',
      fields: { InductionNo: 2, Request: 1 },
      description: '인덕션 2 가동 요청',
    },
    {
      delay: 500,
      telegramNo: TelegramNumber.SetControlInductionAck,
      direction: 'PLC_TO_SMC',
      fields: { InductionNo: 2, Request: 1, Status: 0 },
      description: '인덕션 2 가동 응답: Ok',
    },
    {
      delay: 500,
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
      delay: 500,
      telegramNo: TelegramNumber.InductionMode,
      direction: 'PLC_TO_SMC',
      fields: {
        InductionCount: 2,
        InductionNo_0: 1, InductionMode_0: 0,
        InductionNo_1: 2, InductionMode_1: 0,
      },
      description: '인덕션 모드: IN1=BCR, IN2=BCR',
    },
  ],
};
