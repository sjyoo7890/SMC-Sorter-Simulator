import type { Direction, DataTypeChar, PortNumber } from '../types/protocol';
import { TelegramNumber } from './telegramNumbers';

export interface TelegramField {
  name: string;
  nameKo: string;
  byteSize: number;
  dataType: 'uint16' | 'uint32' | 'string';
  description: string;
}

export interface TelegramMeta {
  name: string;
  nameKo: string;
  direction: Direction;
  dataTypeChar: DataTypeChar;
  port: PortNumber;
  fields: TelegramField[];
}

export const telegramMeta: Record<number, TelegramMeta> = {
  [TelegramNumber.HeartBeat]: {
    name: 'HeartBeat',
    nameKo: '하트비트',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'H',
    port: 3000,
    fields: [
      { name: 'ActiveStatus', nameKo: '활성 상태', byteSize: 2, dataType: 'uint16', description: '1=Active' },
    ],
  },

  [TelegramNumber.SorterStatus]: {
    name: 'SorterStatus',
    nameKo: '소터 상태',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'S',
    port: 3000,
    fields: [
      { name: 'SorterStatus', nameKo: '소터 상태', byteSize: 2, dataType: 'uint16', description: '0=정지, 1=운전, 2=에러' },
    ],
  },

  [TelegramNumber.InductionStatus]: {
    name: 'InductionStatus',
    nameKo: '인덕션 상태',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'S',
    port: 3000,
    fields: [
      { name: 'InductionCount', nameKo: '인덕션 수', byteSize: 2, dataType: 'uint16', description: '인덕션 개수' },
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '인덕션 번호 (반복)' },
      { name: 'InductionStatus', nameKo: '인덕션 상태', byteSize: 2, dataType: 'uint16', description: '0=정지, 1=운전, 2=에러 (반복)' },
    ],
  },

  [TelegramNumber.InductionMode]: {
    name: 'InductionMode',
    nameKo: '인덕션 모드',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'S',
    port: 3000,
    fields: [
      { name: 'InductionCount', nameKo: '인덕션 수', byteSize: 2, dataType: 'uint16', description: '인덕션 개수' },
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '인덕션 번호 (반복)' },
      { name: 'InductionMode', nameKo: '인덕션 모드', byteSize: 2, dataType: 'uint16', description: '0=BCR, 1=타건 (반복)' },
    ],
  },

  [TelegramNumber.ItemInducted]: {
    name: 'ItemInducted',
    nameKo: '화물 투입',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'D',
    port: 3001,
    fields: [
      { name: 'CellIndexNo', nameKo: '셀 인덱스', byteSize: 2, dataType: 'uint16', description: '셀 인덱스 번호' },
      { name: 'CellCount', nameKo: '셀 수', byteSize: 2, dataType: 'uint16', description: '점유 셀 수' },
      { name: 'PID', nameKo: 'PID', byteSize: 4, dataType: 'uint32', description: '화물 고유 ID' },
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '투입 인덕션 번호' },
      { name: 'Mode', nameKo: '모드', byteSize: 2, dataType: 'uint16', description: '0=BCR, 1=타건' },
      { name: 'MainDestination', nameKo: '주 목적지', byteSize: 2, dataType: 'uint16', description: '메인 목적지 슈트' },
      { name: 'Destination1', nameKo: '목적지1', byteSize: 2, dataType: 'uint16', description: '보조 목적지 1' },
      { name: 'Destination2', nameKo: '목적지2', byteSize: 2, dataType: 'uint16', description: '보조 목적지 2' },
      { name: 'Destination3', nameKo: '목적지3', byteSize: 2, dataType: 'uint16', description: '보조 목적지 3' },
      { name: 'Destination4', nameKo: '목적지4', byteSize: 2, dataType: 'uint16', description: '보조 목적지 4' },
    ],
  },

  [TelegramNumber.ItemDischarged]: {
    name: 'ItemDischarged',
    nameKo: '화물 배출',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'D',
    port: 3001,
    fields: [
      { name: 'CellIndexNo', nameKo: '셀 인덱스', byteSize: 2, dataType: 'uint16', description: '셀 인덱스 번호' },
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '투입 인덕션 번호' },
      { name: 'Mode', nameKo: '모드', byteSize: 2, dataType: 'uint16', description: '0=BCR, 1=타건' },
      { name: 'PID', nameKo: 'PID', byteSize: 4, dataType: 'uint32', description: '화물 고유 ID' },
      { name: 'ChuteNumber', nameKo: '슈트 번호', byteSize: 2, dataType: 'uint16', description: '배출 슈트 번호' },
      { name: 'RecirculationCount', nameKo: '재순환 횟수', byteSize: 2, dataType: 'uint16', description: '재순환 카운트' },
    ],
  },

  [TelegramNumber.ItemSortedConfirm]: {
    name: 'ItemSortedConfirm',
    nameKo: '구분 확인',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'D',
    port: 3001,
    fields: [
      { name: 'CellIndexNo', nameKo: '셀 인덱스', byteSize: 2, dataType: 'uint16', description: '셀 인덱스 번호' },
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '투입 인덕션 번호' },
      { name: 'Mode', nameKo: '모드', byteSize: 2, dataType: 'uint16', description: '0=BCR, 1=타건' },
      { name: 'PID', nameKo: 'PID', byteSize: 4, dataType: 'uint32', description: '화물 고유 ID' },
      { name: 'ChuteNumber', nameKo: '슈트 번호', byteSize: 2, dataType: 'uint16', description: '배출 슈트 번호' },
      { name: 'RecirculationCount', nameKo: '재순환 횟수', byteSize: 2, dataType: 'uint16', description: '재순환 카운트' },
      { name: 'Status', nameKo: '구분 상태', byteSize: 2, dataType: 'uint16', description: '구분 결과 상태 코드' },
    ],
  },

  [TelegramNumber.DestinationRequest]: {
    name: 'DestinationRequest',
    nameKo: '목적지 요청',
    direction: 'SMC_TO_PLC',
    dataTypeChar: 'R',
    port: 3001,
    fields: [
      { name: 'ItemNo', nameKo: '아이템 번호', byteSize: 6, dataType: 'string', description: '바코드/아이템 번호' },
      { name: 'CellIndexNo', nameKo: '셀 인덱스', byteSize: 2, dataType: 'uint16', description: '셀 인덱스 번호' },
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '투입 인덕션 번호' },
      { name: 'MainDestination', nameKo: '주 목적지', byteSize: 2, dataType: 'uint16', description: '메인 목적지 슈트' },
      { name: 'Destination1', nameKo: '목적지1', byteSize: 2, dataType: 'uint16', description: '보조 목적지 1' },
      { name: 'Destination2', nameKo: '목적지2', byteSize: 2, dataType: 'uint16', description: '보조 목적지 2' },
      { name: 'Destination3', nameKo: '목적지3', byteSize: 2, dataType: 'uint16', description: '보조 목적지 3' },
      { name: 'Destination4', nameKo: '목적지4', byteSize: 2, dataType: 'uint16', description: '보조 목적지 4' },
    ],
  },

  [TelegramNumber.SetControlSorter]: {
    name: 'SetControlSorter',
    nameKo: '소터 제어',
    direction: 'SMC_TO_PLC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'Request', nameKo: '요청', byteSize: 2, dataType: 'uint16', description: '0=정지, 1=가동, 2=구분완료시 정지' },
    ],
  },

  [TelegramNumber.SetControlSorterAck]: {
    name: 'SetControlSorterAck',
    nameKo: '소터 제어 응답',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'Request', nameKo: '요청', byteSize: 2, dataType: 'uint16', description: '0=정지, 1=가동, 2=구분완료시 정지' },
      { name: 'Status', nameKo: '상태', byteSize: 2, dataType: 'uint16', description: '0=Ok, 1=Error, 2=Blocked' },
    ],
  },

  [TelegramNumber.SetControlInduction]: {
    name: 'SetControlInduction',
    nameKo: '인덕션 제어',
    direction: 'SMC_TO_PLC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '인덕션 번호' },
      { name: 'Request', nameKo: '요청', byteSize: 2, dataType: 'uint16', description: '0=정지, 1=가동, 2=알람해제, 3=타건재요청' },
    ],
  },

  [TelegramNumber.SetControlInductionAck]: {
    name: 'SetControlInductionAck',
    nameKo: '인덕션 제어 응답',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '인덕션 번호' },
      { name: 'Request', nameKo: '요청', byteSize: 2, dataType: 'uint16', description: '0=정지, 1=가동, 2=알람해제, 3=타건재요청' },
      { name: 'Status', nameKo: '상태', byteSize: 2, dataType: 'uint16', description: '0=Ok, 1=Error, 2=Blocked' },
    ],
  },

  [TelegramNumber.SetInductionMode]: {
    name: 'SetInductionMode',
    nameKo: '인덕션 모드 설정',
    direction: 'SMC_TO_PLC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '인덕션 번호' },
      { name: 'Mode', nameKo: '모드', byteSize: 2, dataType: 'uint16', description: '0=BCR, 1=타건' },
    ],
  },

  [TelegramNumber.SetInductionModeAck]: {
    name: 'SetInductionModeAck',
    nameKo: '인덕션 모드 설정 응답',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'InductionNo', nameKo: '인덕션 번호', byteSize: 2, dataType: 'uint16', description: '인덕션 번호' },
      { name: 'Mode', nameKo: '모드', byteSize: 2, dataType: 'uint16', description: '0=BCR, 1=타건' },
      { name: 'Reason', nameKo: '사유', byteSize: 2, dataType: 'uint16', description: '응답 사유 코드' },
    ],
  },

  [TelegramNumber.SetOverflowConfiguration]: {
    name: 'SetOverflowConfiguration',
    nameKo: '오버플로우 설정',
    direction: 'SMC_TO_PLC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'OverflowChute1', nameKo: '오버플로우 슈트1', byteSize: 2, dataType: 'uint16', description: '오버플로우 슈트 1 번호' },
      { name: 'OverflowChute2', nameKo: '오버플로우 슈트2', byteSize: 2, dataType: 'uint16', description: '오버플로우 슈트 2 번호' },
      { name: 'MaxRecirculation', nameKo: '최대 재순환', byteSize: 2, dataType: 'uint16', description: '최대 재순환 횟수' },
    ],
  },

  [TelegramNumber.SetOverflowConfigurationAck]: {
    name: 'SetOverflowConfigurationAck',
    nameKo: '오버플로우 설정 응답',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'OverflowChute1', nameKo: '오버플로우 슈트1', byteSize: 2, dataType: 'uint16', description: '오버플로우 슈트 1 번호' },
      { name: 'OverflowChute2', nameKo: '오버플로우 슈트2', byteSize: 2, dataType: 'uint16', description: '오버플로우 슈트 2 번호' },
      { name: 'MaxRecirculation', nameKo: '최대 재순환', byteSize: 2, dataType: 'uint16', description: '최대 재순환 횟수' },
      { name: 'Reason', nameKo: '사유', byteSize: 2, dataType: 'uint16', description: '응답 사유 코드' },
    ],
  },

  [TelegramNumber.SetResetRequest]: {
    name: 'SetResetRequest',
    nameKo: '리셋 요청',
    direction: 'SMC_TO_PLC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'ResetModule', nameKo: '리셋 모듈', byteSize: 2, dataType: 'uint16', description: '1=Sorter, 2=Conveyor' },
    ],
  },

  [TelegramNumber.SetResetRequestAck]: {
    name: 'SetResetRequestAck',
    nameKo: '리셋 요청 응답',
    direction: 'PLC_TO_SMC',
    dataTypeChar: 'A',
    port: 3002,
    fields: [
      { name: 'ResetModule', nameKo: '리셋 모듈', byteSize: 2, dataType: 'uint16', description: '1=Sorter, 2=Conveyor' },
      { name: 'Reason', nameKo: '사유', byteSize: 2, dataType: 'uint16', description: '응답 사유 코드' },
    ],
  },
};
