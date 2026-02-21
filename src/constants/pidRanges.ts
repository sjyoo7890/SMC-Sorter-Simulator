export interface PidRange {
  label: string;
  min: number;
  max: number;
}

export const pidRanges = {
  sps: { label: 'SPS', min: 10001, max: 50000 },
  induction1Auto:   { label: '인덕션1 자동', min: 100001, max: 115000 },
  induction1Manual: { label: '인덕션1 수동', min: 115001, max: 130000 },
  induction2Auto:   { label: '인덕션2 자동', min: 200001, max: 215000 },
  induction2Manual: { label: '인덕션2 수동', min: 215001, max: 230000 },
  induction3Auto:   { label: '인덕션3 자동', min: 300001, max: 315000 },
  induction3Manual: { label: '인덕션3 수동', min: 315001, max: 330000 },
  induction4Auto:   { label: '인덕션4 자동', min: 400001, max: 415000 },
  induction4Manual: { label: '인덕션4 수동', min: 415001, max: 430000 },
} as const satisfies Record<string, PidRange>;
