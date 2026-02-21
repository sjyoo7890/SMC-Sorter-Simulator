# Prompt 11: 사전 정의 시나리오

## 목표
PRD에 정의된 5가지 시뮬레이션 시나리오를 구현하고, 시나리오 선택 UI를 만든다.

## 작업 내용

### 1. 시나리오 정의 인터페이스 (`src/core/simulator/scenarios/types.ts`)

```typescript
interface ScenarioStep {
  delay: number;              // 이전 단계 대비 지연 시간 (ms)
  telegramNo: number;
  direction: Direction;
  fields: Record<string, number | string>;
  description: string;        // 이 단계의 한글 설명
}

interface Scenario {
  id: string;
  name: string;
  nameKo: string;
  description: string;        // 시나리오 설명
  steps: ScenarioStep[];
}
```

### 2. 시나리오 1: 정상 구분 사이클 (`src/core/simulator/scenarios/normalSortCycle.ts`)
- 설명: "화물이 투입되어 정상적으로 목적지에 배출되는 전체 사이클"
- 단계:
  1. [0ms] HeartBeat(1) PLC→SMC: ActiveStatus=1
  2. [500ms] SorterStatus(10) PLC→SMC: Status=1(운전)
  3. [1000ms] InductionStatus(11) PLC→SMC: IN1=운전, IN2=운전
  4. [2000ms] ItemInducted(20) PLC→SMC: PID=100001, Cell=15, IN=1, Mode=0(자동), Dest 모두 0
  5. [500ms] DestinationRequest(30) SMC→PLC: ItemNo=100001, Cell=15, IN=1, MainDest=25, Dest1=26, Dest2=0, Dest3=0, Dest4=0
  6. [2000ms] ItemDischarged(21) PLC→SMC: PID=100001, Cell=15, Chute=25, Recirc=0
  7. [300ms] ItemSortedConfirm(22) PLC→SMC: PID=100001, Chute=25, Recirc=0, Status=1(정상구분)

### 3. 시나리오 2: 시스템 기동 (`src/core/simulator/scenarios/systemStartup.ts`)
- 설명: "소터 및 인덕션을 순차적으로 기동하는 과정"
- 단계:
  1. [0ms] HeartBeat(1) PLC→SMC: ActiveStatus=1
  2. [1000ms] SetControlSorter(100) SMC→PLC: Request=1(가동)
  3. [500ms] SetControlSorterAck(101) PLC→SMC: Request=1, Status=0(Ok)
  4. [500ms] SorterStatus(10) PLC→SMC: Status=1(운전)
  5. [1000ms] SetControlInduction(110) SMC→PLC: IN=1, Request=1(가동)
  6. [500ms] SetControlInductionAck(111) PLC→SMC: IN=1, Request=1, Status=0(Ok)
  7. [1000ms] SetControlInduction(110) SMC→PLC: IN=2, Request=1(가동)
  8. [500ms] SetControlInductionAck(111) PLC→SMC: IN=2, Request=1, Status=0(Ok)
  9. [500ms] InductionStatus(11) PLC→SMC: IN1=운전, IN2=운전
  10. [500ms] InductionMode(12) PLC→SMC: IN1=BCR, IN2=BCR

### 4. 시나리오 3: 오버플로 처리 (`src/core/simulator/scenarios/overflowHandling.ts`)
- 설명: "화물이 목적지 배출에 실패하여 재순환 후 오버플로 슈트로 배출"
- 단계:
  1. [0ms] ItemInducted(20) PLC→SMC: PID=200001, Cell=42, IN=2, Mode=0, Dest=0
  2. [500ms] DestinationRequest(30) SMC→PLC: MainDest=30, Dest1=31
  3. [2000ms] ItemDischarged(21) PLC→SMC: Chute=30, Recirc=1 (1회차 실패, 재순환)
  4. [300ms] ItemSortedConfirm(22) PLC→SMC: Status=2(슈트만재)
  5. [3000ms] ItemDischarged(21) PLC→SMC: Chute=31, Recirc=2 (2회차 실패, 재순환)
  6. [300ms] ItemSortedConfirm(22) PLC→SMC: Status=3(슈트블록)
  7. [3000ms] ItemDischarged(21) PLC→SMC: Chute=200, Recirc=3 (최대회전 초과 → 오버플로 슈트)
  8. [300ms] ItemSortedConfirm(22) PLC→SMC: Status=1(정상구분 — 오버플로 슈트로)

### 5. 시나리오 4: 에러 및 복구 (`src/core/simulator/scenarios/errorRecovery.ts`)
- 설명: "소터에 에러가 발생하고 리셋을 통해 복구하는 과정"
- 단계:
  1. [0ms] SorterStatus(10) PLC→SMC: Status=1(운전)
  2. [2000ms] SorterStatus(10) PLC→SMC: Status=2(에러)
  3. [3000ms] SetResetRequest(140) SMC→PLC: ResetModule=1(Sorter)
  4. [500ms] SetResetRequestAck(141) PLC→SMC: ResetModule=1, Reason=0(Accepted)
  5. [2000ms] SorterStatus(10) PLC→SMC: Status=1(운전) — 복구 완료

### 6. 시나리오 5: 모드 변경 (`src/core/simulator/scenarios/modeChange.ts`)
- 설명: "인덕션 1번의 모드를 BCR에서 타건으로 변경"
- 단계:
  1. [0ms] InductionMode(12) PLC→SMC: IN1=BCR(0)
  2. [1000ms] SetInductionMode(120) SMC→PLC: IN=1, Mode=1(타건)
  3. [500ms] SetInductionModeAck(121) PLC→SMC: IN=1, Mode=1, Reason=0(Accepted)
  4. [500ms] InductionMode(12) PLC→SMC: IN1=타건(1)
  5. [2000ms] ItemInducted(20) PLC→SMC: IN=1, Mode=1(수동), PID=115001, MainDest=50, Dest1=51 (수동모드이므로 목적지 포함)
  6. [2000ms] ItemDischarged(21) PLC→SMC: PID=115001, Chute=50, Recirc=0
  7. [300ms] ItemSortedConfirm(22) PLC→SMC: Status=1(정상구분)

### 7. 시나리오 실행 엔진 (`src/core/simulator/scenarioRunner.ts`)
```typescript
class ScenarioRunner {
  private scenario: Scenario;
  private currentStep: number;
  private timeoutId: NodeJS.Timer | null;
  
  constructor(scenario: Scenario);
  start(): void;           // 시나리오 실행 시작
  stop(): void;            // 실행 중단
  isRunning(): boolean;
  getCurrentStep(): number;
  getTotalSteps(): number;
}
```
- 각 step을 delay에 맞춰 순차 실행
- 각 step 실행 시:
  1. encoder로 패킷 생성
  2. decoder로 디코딩
  3. TelegramLog 생성 → useLogStore.addLog()
  4. useStatsStore 기록
  5. 필요 시 useSystemStore 상태 업데이트
- 모든 step 완료 시 useSimStore의 scenario를 null로 리셋

### 8. ScenarioSelector UI (`src/components/control/ScenarioSelector.tsx`)
- 시나리오 목록을 카드 형태로 표시
- 각 카드: 시나리오 이름(한글), 설명, 단계 수, 예상 소요시간
- 카드 클릭 시 시나리오 실행
- 실행 중: 프로그레스 바 표시 (현재 단계 / 전체 단계)
- 중단 버튼
- 제어 패널 상단에 배치

### 확인
- 각 시나리오가 올바른 순서로 실행되는지 확인
- 타임라인에 시나리오 단계들이 순서대로 표시되는지 확인
- 패킷 분석기에서 시나리오에서 생성된 텔레그램 구조가 올바른지 확인
- 대시보드 상태가 시나리오 진행에 따라 갱신되는지 확인
- 시나리오 중단이 정상 동작하는지 확인
