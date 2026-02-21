# Prompt 1: 타입 정의 및 프로토콜 상수

## 목표
프로토콜 문서에 정의된 모든 텔레그램의 타입과 상수를 TypeScript로 정의한다.

## 작업 내용

### 1. 기본 타입 정의 (`src/types/protocol.ts`)

```typescript
// 패킷 방향
type Direction = 'PLC_TO_SMC' | 'SMC_TO_PLC';

// 데이터 타입 문자
type DataTypeChar = 'H' | 'S' | 'D' | 'A' | 'R';

// 포트 번호
type PortNumber = 3000 | 3001 | 3002;

// 소터 상태
type SorterStatus = 0 | 1 | 2;  // 0:정지, 1:운전, 2:에러

// 인덕션 상태
type InductionStatus = 0 | 1 | 2;  // 0:정지, 1:운전, 2:에러

// 인덕션 모드
type InductionMode = 0 | 1;  // 0:BCR, 1:타건

// 제어 요청값
type SorterControlRequest = 0 | 1 | 2;  // 0:정지, 1:가동, 2:구분완료시 정지
type InductionControlRequest = 0 | 1 | 2 | 3;  // 0:정지, 1:가동, 2:알람해제, 3:타건재요청

// 응답 상태
type AckStatus = 0 | 1 | 2;  // 0:Ok, 1:Error, 2:Blocked

// 구분 상태 (ItemSortedConfirm)
type SortStatus = 1|2|3|4|5|6|7|8|9|10|11|12|13|14;

// 리셋 모듈
type ResetModule = 1 | 2;  // 1:Sorter, 2:Conveyor
```

### 2. 텔레그램 번호 enum (`src/constants/telegramNumbers.ts`)
```
1: HeartBeat
10: SorterStatus
11: InductionStatus
12: InductionMode
20: ItemInducted
21: ItemDischarged
22: ItemSortedConfirm
30: DestinationRequest
100: SetControlSorter
101: SetControlSorterAck
110: SetControlInduction
111: SetControlInductionAck
120: SetInductionMode
121: SetInductionModeAck
130: SetOverflowConfiguration
131: SetOverflowConfigurationAck
140: SetResetRequest
141: SetResetRequestAck
```

### 3. 텔레그램 메타데이터 정의 (`src/constants/telegramMeta.ts`)
각 텔레그램 번호에 대해 다음 정보를 가지는 맵을 만들어줘:
- `name`: 영문 텔레그램명
- `nameKo`: 한글 설명
- `direction`: 방향
- `dataTypeChar`: 패킷 종류 문자 (H/S/D/A/R)
- `port`: 포트 번호
- `fields`: 데이터 필드 배열 (각 필드는 `{ name, nameKo, byteSize, dataType, description }`)

프로토콜 문서에 정의된 모든 필드를 빠짐없이 포함해야 한다. 특히:

**HeartBeat(1)**: ActiveStatus(2)
**SorterStatus(10)**: SorterStatus(2)
**InductionStatus(11)**: InductionCount(2), [InductionNo(2), InductionStatus(2)] × count
**InductionMode(12)**: InductionCount(2), [InductionNo(2), InductionMode(2)] × count
**ItemInducted(20)**: CellIndexNo(2), CellCount(2), PID(4), InductionNo(2), Mode(2), MainDestination(2), Destination1~4(각 2)
**ItemDischarged(21)**: CellIndexNo(2), InductionNo(2), Mode(2), PID(4), ChuteNumber(2), RecirculationCount(2)
**ItemSortedConfirm(22)**: CellIndexNo(2), InductionNo(2), Mode(2), PID(4), ChuteNumber(2), RecirculationCount(2), Status(2)
**DestinationRequest(30)**: ItemNo(6), CellIndexNo(2), InductionNo(2), MainDestination(2), Destination1~4(각 2)
**SetControlSorter(100)**: Request(2)
**SetControlSorterAck(101)**: Request(2), Status(2)
**SetControlInduction(110)**: InductionNo(2), Request(2)
**SetControlInductionAck(111)**: InductionNo(2), Request(2), Status(2)
**SetInductionMode(120)**: InductionNo(2), Mode(2)
**SetInductionModeAck(121)**: InductionNo(2), Mode(2), Reason(2)
**SetOverflowConfiguration(130)**: OverflowChute1(2), OverflowChute2(2), MaxRecirculation(2)
**SetOverflowConfigurationAck(131)**: OverflowChute1(2), OverflowChute2(2), MaxRecirculation(2), Reason(2)
**SetResetRequest(140)**: ResetModule(2)
**SetResetRequestAck(141)**: ResetModule(2), Reason(2)

### 4. SortStatus 코드 맵 (`src/constants/sortStatusCodes.ts`)
```
1: 정상 구분 (Sorting Done)
2: 슈트 만재 (Chute Full)
3: 슈트 블록 (Chute Blocked)
4: 캐리어 비활성화 (Carrier Disabled)
5: 배출 에러 (Discharge Error)
6: 데이터 로스 (Data Loss)
7: 목적지 없음 (No Destination)
8: 목적지 이상 (Wrong Destination)
9: 다중 캐리어 목적지 다름 (Multi Destination)
10: 소포미감지
11: 비정상배출
12: 자동블록
13: 소포 위치 이상
14: 투입 에러
```

### 5. PID 생성 범위 상수 (`src/constants/pidRanges.ts`)
```
SPS: 10001 ~ 50000
인덕션 1: 자동 100001~115000, 수동 115001~130000
인덕션 2: 자동 200001~215000, 수동 215001~230000
인덕션 3: 자동 300001~315000, 수동 315001~330000
인덕션 4: 자동 400001~415000, 수동 415001~430000
```

### 6. 텔레그램 로그 타입 (`src/types/log.ts`)
```typescript
interface TelegramLog {
  id: string;             // 고유 ID (uuid 또는 auto-increment)
  timestamp: Date;
  direction: Direction;
  telegramNo: number;
  telegramName: string;
  machineId: string;
  port: PortNumber;
  rawBytes: number[];     // 원본 바이트 배열
  decodedFields: Record<string, { value: number | string; description: string }>;
  dataTypeChar: DataTypeChar;
}
```

### 7. 시스템 상태 타입 (`src/types/system.ts`)
```typescript
interface SystemState {
  sorterStatus: SorterStatus;
  inductions: Array<{ no: number; status: InductionStatus; mode: InductionMode }>;
  heartbeat: { lastReceived: Date | null; active: boolean };
  overflowConfig: { chute1: number; chute2: number; maxRecirculation: number };
  activeItems: Map<number, ActiveItem>;  // PID → 화물 정보
}

interface ActiveItem {
  pid: number;
  cellIndexNo: number;
  inductionNo: number;
  mode: number;
  destinations: number[];
  inductedAt: Date;
  status: 'inducted' | 'destination_set' | 'discharged' | 'confirmed';
}
```

### 확인
- 모든 타입 파일이 정상 컴파일되는지 `npx tsc --noEmit`로 확인
- 상수 파일에서 export가 올바르게 되어 있는지 확인
