# Prompt 10: 시뮬레이션 엔진

## 목표
HeartBeat 자동 생성, 화물 처리 사이클 자동 시뮬레이션 등 백그라운드에서 동작하는 시뮬레이션 엔진을 구현한다.

## 작업 내용

### 1. SimulationEngine (`src/core/simulator/SimulationEngine.ts`)

클래스 또는 모듈로 구현. 시뮬레이션 시작/정지를 제어하고, 여러 타이머/인터벌을 관리한다.

```typescript
class SimulationEngine {
  private timers: Map<string, NodeJS.Timer>;
  private speed: number;
  
  start(): void;       // 모든 타이머 시작
  stop(): void;        // 모든 타이머 정지
  pause(): void;       // 일시정지
  resume(): void;      // 재개
  setSpeed(s: number): void;  // 속도 변경 (타이머 간격 조정)
}
```

### 2. HeartBeat 생성기 (`src/core/simulator/heartbeatGenerator.ts`)
- 3초 주기 (speed 배율 적용)로 HeartBeat 텔레그램 자동 생성
- PLC→SMC 방향: HeartBeat(1) 생성 → 로그 추가 → useSystemStore.updateHeartbeat()
- SMC→PLC 방향: HeartBeat(1) 응답 생성 → 로그 추가
- 양방향 모두 ActiveStatus=1(정상)
- useSystemStore의 heartbeat.active를 관리:
  - HeartBeat 수신 시 active=true
  - 3초 × 2 = 6초간 미수신 시 active=false

### 3. 화물 사이클 생성기 (`src/core/simulator/itemCycleGenerator.ts`)
- 설정 가능한 간격(기본 2~5초 랜덤, speed 배율 적용)으로 화물 처리 사이클을 자동 생성
- 한 사이클의 흐름:
  1. **ItemInducted(20)** 생성 (PLC→SMC)
     - InductionNo: 1~4 중 랜덤 (운전 중인 인덕션에서만 선택)
     - Mode: 해당 인덕션의 현재 모드 (0:자동/1:수동)
     - PID: pidRanges에 따라 자동 생성 (인덕션번호+모드에 맞는 범위에서 순차 증가)
     - CellIndexNo: 1~200 중 랜덤
     - Destination 필드: 수동모드이면 MainDestination+Dest1~4에 값 설정, 자동모드이면 모두 0
     - useSystemStore.addActiveItem() 호출
  
  2. **DestinationRequest(30)** 생성 (SMC→PLC) — 자동 모드일 때만
     - 0.5~1초 후
     - ItemNo: PID와 동일
     - MainDestination + Destination1~4: 랜덤 슈트번호 생성 (1~100 범위)
     - useSystemStore.updateItemStatus(pid, 'destination_set') 호출
  
  3. **ItemDischarged(21)** 생성 (PLC→SMC)
     - 1~3초 후
     - 동일 PID, CellIndexNo
     - ChuteNumber: MainDestination 값
     - RecirculationCount: 대부분 0, 가끔 1~2 (5% 확률로 recirculation 시뮬레이션)
     - useSystemStore.updateItemStatus(pid, 'discharged') 호출
  
  4. **ItemSortedConfirm(22)** 생성 (PLC→SMC)
     - 0.3~0.5초 후
     - Status: 대부분 1(정상구분), 가끔 에러 코드 (5% 확률)
     - useSystemStore.updateItemStatus(pid, 'confirmed') 호출
     - 일정 시간 후 useSystemStore.removeActiveItem(pid)

### 4. 상태 변경 생성기 (`src/core/simulator/statusGenerator.ts`)
- 시뮬레이션 시작 시 초기 상태 메시지 전송:
  - SorterStatus(10) → status: 1(운전)
  - InductionStatus(11) → 4개 인덕션 모두 status: 1(운전)
  - InductionMode(12) → 4개 인덕션 모드 전송
- 가끔(30초~1분 랜덤) 상태 변경 이벤트 발생:
  - 특정 인덕션 에러 → InductionStatus 전송 → 자동 복구 (10초 후 운전 복귀)
  - 소터 에러 → SorterStatus 전송 → 자동 복구

### 5. 처리량 트래커 (`src/core/simulator/throughputTracker.ts`)
- 1초마다 useStatsStore.recentThroughput 배열에 현재 초의 처리량 push
- 60초 초과 시 오래된 데이터 shift
- useStatsStore.updateThroughput() 호출

### 6. useSimulation 훅 (`src/hooks/useSimulation.ts`)
- SimulationEngine 인스턴스를 관리하는 React 훅
- useSimStore와 연동
- 시작/정지/일시정지/속도변경 함수 제공
- 컴포넌트 언마운트 시 자동 정리

### 7. App.tsx에 통합
- 헤더의 시작/정지 버튼을 useSimulation 훅에 연결
- 속도 조절 드롭다운 (0.5x, 1x, 2x, 5x)
- 경과 시간 표시

### 확인
- 시뮬레이션 시작 시 HeartBeat가 3초마다 생성되는지 확인
- 화물 사이클이 자동으로 생성되고 타임라인에 표시되는지 확인
- 패킷 분석기에서 자동 생성된 텔레그램의 바이트 구조가 올바른지 확인
- 대시보드 상태가 실시간 갱신되는지 확인
- 통계 차트가 실시간 데이터로 업데이트되는지 확인
- 정지 시 모든 타이머가 정리되는지 확인
- 속도 변경 시 간격이 올바르게 조정되는지 확인
