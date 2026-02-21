// 패킷 방향
export type Direction = 'PLC_TO_SMC' | 'SMC_TO_PLC';

// 데이터 타입 문자
export type DataTypeChar = 'H' | 'S' | 'D' | 'A' | 'R';

// 포트 번호
export type PortNumber = 3000 | 3001 | 3002;

// 소터 상태: 0=정지, 1=운전, 2=에러
export type SorterStatus = 0 | 1 | 2;

// 인덕션 상태: 0=정지, 1=운전, 2=에러
export type InductionStatus = 0 | 1 | 2;

// 인덕션 모드: 0=BCR, 1=타건
export type InductionMode = 0 | 1;

// 제어 요청값
export type SorterControlRequest = 0 | 1 | 2; // 0=정지, 1=가동, 2=구분완료시 정지
export type InductionControlRequest = 0 | 1 | 2 | 3; // 0=정지, 1=가동, 2=알람해제, 3=타건재요청

// 응답 상태: 0=Ok, 1=Error, 2=Blocked
export type AckStatus = 0 | 1 | 2;

// 구분 상태 (ItemSortedConfirm)
export type SortStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

// 리셋 모듈: 1=Sorter, 2=Conveyor
export type ResetModule = 1 | 2;
