import { describe, it, expect } from 'vitest';
import {
  encodeHeartBeat,
  encodeItemInducted,
  encodeItemDischarged,
  encodeItemSortedConfirm,
  encodeSetControlSorterAck,
  encodeInductionStatus,
} from '../encoder';
import { decodeTelegram } from '../decoder';
import { STX, ETX } from '../packet';

const MACHINE_ID = 'PSM001';

describe('HeartBeat round-trip', () => {
  it('should encode and decode HeartBeat with activeStatus=1', () => {
    const bytes = encodeHeartBeat(MACHINE_ID, 1);

    // 기본 구조 검증
    expect(bytes[0]).toBe(STX);
    expect(bytes[bytes.length - 1]).toBe(ETX);
    expect(String.fromCharCode(bytes[1])).toBe('H');

    const decoded = decodeTelegram(bytes);
    expect(decoded.telegramNo).toBe(1);
    expect(decoded.machineId).toBe(MACHINE_ID);
    expect(decoded.dataTypeChar).toBe('H');
    expect(decoded.fields['ActiveStatus'].value).toBe(1);
    expect(decoded.fields['ActiveStatus'].description).toBe('Active');
  });
});

describe('ItemInducted round-trip', () => {
  it('should encode and decode ItemInducted', () => {
    const bytes = encodeItemInducted(MACHINE_ID, {
      cellIndexNo: 2,
      cellCount: 1,
      pid: 10000,
      inductionNo: 1,
      mode: 1,
      mainDestination: 0,
      destination1: 0,
      destination2: 0,
      destination3: 0,
      destination4: 0,
    });

    expect(bytes[0]).toBe(STX);
    expect(bytes[bytes.length - 1]).toBe(ETX);

    const decoded = decodeTelegram(bytes);
    expect(decoded.telegramNo).toBe(20);
    expect(decoded.fields['CellIndexNo'].value).toBe(2);
    expect(decoded.fields['CellCount'].value).toBe(1);
    expect(decoded.fields['PID'].value).toBe(10000);
    expect(decoded.fields['InductionNo'].value).toBe(1);
    expect(decoded.fields['Mode'].value).toBe(1);
    expect(decoded.fields['Mode'].description).toBe('타건');
    expect(decoded.fields['MainDestination'].value).toBe(0);
  });
});

describe('ItemDischarged round-trip', () => {
  it('should encode and decode ItemDischarged', () => {
    const bytes = encodeItemDischarged(MACHINE_ID, {
      cellIndexNo: 2,
      inductionNo: 1,
      mode: 1,
      pid: 10000,
      chuteNumber: 22,
      recirculationCount: 0,
    });

    const decoded = decodeTelegram(bytes);
    expect(decoded.telegramNo).toBe(21);
    expect(decoded.fields['CellIndexNo'].value).toBe(2);
    expect(decoded.fields['InductionNo'].value).toBe(1);
    expect(decoded.fields['PID'].value).toBe(10000);
    expect(decoded.fields['ChuteNumber'].value).toBe(22);
    expect(decoded.fields['RecirculationCount'].value).toBe(0);
  });
});

describe('ItemSortedConfirm round-trip', () => {
  it('should encode and decode with status=1 (정상구분)', () => {
    const bytes = encodeItemSortedConfirm(MACHINE_ID, {
      cellIndexNo: 2,
      inductionNo: 1,
      mode: 0,
      pid: 10000,
      chuteNumber: 22,
      recirculationCount: 0,
      status: 1,
    });

    const decoded = decodeTelegram(bytes);
    expect(decoded.telegramNo).toBe(22);
    expect(decoded.fields['Status'].value).toBe(1);
    expect(decoded.fields['Status'].description).toContain('정상 구분');
  });
});

describe('SetControlSorterAck round-trip', () => {
  it('should encode and decode with request=1, status=0', () => {
    const bytes = encodeSetControlSorterAck(MACHINE_ID, 1, 0);

    const decoded = decodeTelegram(bytes);
    expect(decoded.telegramNo).toBe(101);
    expect(decoded.fields['Request'].value).toBe(1);
    expect(decoded.fields['Request'].description).toBe('가동');
    expect(decoded.fields['Status'].value).toBe(0);
    expect(decoded.fields['Status'].description).toBe('Ok');
  });
});

describe('InductionStatus (repeating fields) round-trip', () => {
  it('should encode and decode 3 inductions', () => {
    const bytes = encodeInductionStatus(MACHINE_ID, [
      { no: 1, status: 1 },
      { no: 2, status: 0 },
      { no: 3, status: 2 },
    ]);

    const decoded = decodeTelegram(bytes);
    expect(decoded.telegramNo).toBe(11);
    expect(decoded.fields['InductionCount'].value).toBe(3);
    expect(decoded.fields['InductionNo_0'].value).toBe(1);
    expect(decoded.fields['InductionStatus_0'].value).toBe(1);
    expect(decoded.fields['InductionStatus_0'].description).toBe('운전');
    expect(decoded.fields['InductionNo_2'].value).toBe(3);
    expect(decoded.fields['InductionStatus_2'].value).toBe(2);
    expect(decoded.fields['InductionStatus_2'].description).toBe('에러');
  });
});
