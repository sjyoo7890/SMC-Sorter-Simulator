import { TelegramNumber } from '../../constants/telegramNumbers';
import { sortStatusCodes } from '../../constants/sortStatusCodes';

type Fields = Record<string, { value: number | string; description?: string }>;

function v(fields: Fields, name: string): number | string {
  return fields[name]?.value ?? '';
}

function n(fields: Fields, name: string): number {
  return Number(fields[name]?.value ?? 0);
}

function sorterStatusText(val: number): string {
  switch (val) {
    case 0: return '정지';
    case 1: return '운전';
    case 2: return '에러';
    default: return `Unknown(${val})`;
  }
}

function inductionStatusText(val: number): string {
  switch (val) {
    case 0: return '정지';
    case 1: return '운전';
    case 2: return '에러';
    default: return `Unknown(${val})`;
  }
}

function modeText(val: number): string {
  return val === 0 ? 'BCR' : val === 1 ? '타건' : `Unknown(${val})`;
}

function requestTextSorter(val: number): string {
  switch (val) {
    case 0: return '정지';
    case 1: return '가동';
    case 2: return '구분완료시 정지';
    default: return `Unknown(${val})`;
  }
}

function requestTextInduction(val: number): string {
  switch (val) {
    case 0: return '정지';
    case 1: return '가동';
    case 2: return '알람해제';
    case 3: return '타건재요청';
    default: return `Unknown(${val})`;
  }
}

function ackText(val: number): string {
  switch (val) {
    case 0: return 'Ok';
    case 1: return 'Error';
    case 2: return 'Blocked';
    default: return `Unknown(${val})`;
  }
}

function resetModuleText(val: number): string {
  return val === 1 ? 'Sorter' : val === 2 ? 'Conveyor' : `Unknown(${val})`;
}

export function getTelegramSummary(telegramNo: number, fields: Fields): string {
  switch (telegramNo) {
    case TelegramNumber.HeartBeat:
      return `Active: ${n(fields, 'ActiveStatus') === 1 ? '○' : '✕'}`;

    case TelegramNumber.SorterStatus:
      return sorterStatusText(n(fields, 'SorterStatus'));

    case TelegramNumber.InductionStatus: {
      const count = n(fields, 'InductionCount');
      const parts: string[] = [];
      for (let i = 0; i < count; i++) {
        const no = n(fields, `InductionNo_${i}`);
        const st = n(fields, `InductionStatus_${i}`);
        parts.push(`IN${no}:${inductionStatusText(st)}`);
      }
      return parts.join(' ');
    }

    case TelegramNumber.InductionMode: {
      const count = n(fields, 'InductionCount');
      const parts: string[] = [];
      for (let i = 0; i < count; i++) {
        const no = n(fields, `InductionNo_${i}`);
        const m = n(fields, `InductionMode_${i}`);
        parts.push(`IN${no}:${modeText(m)}`);
      }
      return parts.join(' ');
    }

    case TelegramNumber.ItemInducted:
      return `PID:${v(fields, 'PID')} Cell:${v(fields, 'CellIndexNo')} IN:${v(fields, 'InductionNo')}`;

    case TelegramNumber.ItemDischarged:
      return `PID:${v(fields, 'PID')} Chute:${v(fields, 'ChuteNumber')} Recirc:${v(fields, 'RecirculationCount')}`;

    case TelegramNumber.ItemSortedConfirm: {
      const status = n(fields, 'Status');
      const code = sortStatusCodes[status];
      return `PID:${v(fields, 'PID')} Status:${code?.nameKo ?? `Unknown(${status})`}`;
    }

    case TelegramNumber.DestinationRequest:
      return `Item:${v(fields, 'ItemNo')} Cell:${v(fields, 'CellIndexNo')} Dest:${v(fields, 'MainDestination')}`;

    case TelegramNumber.SetControlSorter:
      return `요청:${requestTextSorter(n(fields, 'Request'))}`;

    case TelegramNumber.SetControlSorterAck:
      return `요청:${requestTextSorter(n(fields, 'Request'))} 응답:${ackText(n(fields, 'Status'))}`;

    case TelegramNumber.SetControlInduction:
      return `IN:${v(fields, 'InductionNo')} 요청:${requestTextInduction(n(fields, 'Request'))}`;

    case TelegramNumber.SetControlInductionAck:
      return `IN:${v(fields, 'InductionNo')} 요청:${requestTextInduction(n(fields, 'Request'))} 응답:${ackText(n(fields, 'Status'))}`;

    case TelegramNumber.SetInductionMode:
      return `IN:${v(fields, 'InductionNo')} 모드:${modeText(n(fields, 'Mode'))}`;

    case TelegramNumber.SetInductionModeAck:
      return `IN:${v(fields, 'InductionNo')} 모드:${modeText(n(fields, 'Mode'))} 응답:${ackText(n(fields, 'Reason'))}`;

    case TelegramNumber.SetOverflowConfiguration:
      return `Chute1:${v(fields, 'OverflowChute1')} Chute2:${v(fields, 'OverflowChute2')} MaxRecirc:${v(fields, 'MaxRecirculation')}`;

    case TelegramNumber.SetOverflowConfigurationAck:
      return `Chute1:${v(fields, 'OverflowChute1')} Chute2:${v(fields, 'OverflowChute2')} 응답:${ackText(n(fields, 'Reason'))}`;

    case TelegramNumber.SetResetRequest:
      return `모듈:${resetModuleText(n(fields, 'ResetModule'))}`;

    case TelegramNumber.SetResetRequestAck:
      return `모듈:${resetModuleText(n(fields, 'ResetModule'))} 응답:${ackText(n(fields, 'Reason'))}`;

    default:
      return '';
  }
}
