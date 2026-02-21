# Prompt 8: 제어 패널

## 목표
사용자가 수동으로 텔레그램을 전송할 수 있는 제어 패널을 구현한다. SMC→PLC 방향의 제어 명령과 PLC→SMC 방향의 데이터 메시지를 모두 수동으로 생성/전송할 수 있어야 한다.

## 작업 내용

### 1. ControlPanel (`src/components/control/ControlPanel.tsx`)
- 탭으로 구분:
  - "SMC → PLC 제어" — SMC 측 명령 전송
  - "PLC → SMC 수동 전송" — PLC 측 데이터 수동 생성
- 각 탭 내에서 텔레그램 종류별 폼을 아코디언 또는 카드 형태로 배치

### 2. SMC→PLC 제어 탭

#### SorterControlForm
- SetControlSorter(100) 전송 폼
- Request 선택: 드롭다운 (0:정지, 1:가동, 2:구분완료시 정지)
- "전송" 버튼 클릭 시:
  1. encodeTelegram(100, ...) 으로 패킷 생성
  2. useLogStore.addLog()로 타임라인에 추가
  3. useStatsStore.recordSent(100) 기록
  4. 자동으로 1초 후 SetControlSorterAck(101) 응답 생성 및 추가
  5. useSystemStore.updateSorterStatus() 상태 반영

#### InductionControlForm
- SetControlInduction(110) 전송 폼
- InductionNo 선택: 드롭다운 (1~4)
- Request 선택: 드롭다운 (0:정지, 1:가동, 2:인덕션 알람 해제, 3:타건 재요청)
- 전송 시 Ack(111) 자동 응답 + 상태 반영

#### InductionModeForm
- SetInductionMode(120) 전송 폼
- InductionNo 선택: 드롭다운 (1~4)
- Mode 선택: 드롭다운 (0:BCR, 1:타건)
- 전송 시 Ack(121) 자동 응답 + 상태 반영

#### OverflowConfigForm
- SetOverflowConfiguration(130) 전송 폼
- Overflow Chute 1: 숫자 입력 (기본값 200)
- Overflow Chute 2: 숫자 입력 (기본값 202)
- Max Recirculation: 숫자 입력 (기본값 2)
- 전송 시 Ack(131) 자동 응답 + 설정 반영

#### ResetRequestForm
- SetResetRequest(140) 전송 폼
- Reset Module 선택: 드롭다운 (1:Sorter Reset, 2:Conveyor Reset)
- 전송 시 Ack(141) 자동 응답

#### DestinationRequestForm
- DestinationRequest(30) 전송 폼
- ItemNo: 숫자 입력 (6자리)
- CellIndexNo: 숫자 입력
- InductionNo: 드롭다운 (1~4)
- Main Destination: 숫자 입력
- Destination 1~4: 숫자 입력 (각각, 0이면 없음)
- 전송 시 로그 추가

### 3. PLC→SMC 수동 전송 탭

#### ManualItemInductedForm
- ItemInducted(20) 수동 생성
- CellIndexNo, CellCount, PID (자동생성 또는 수동입력 토글), InductionNo, Mode, MainDestination, Destination1~4
- PID 자동생성 시 pidRanges 상수에 따라 인덕션 번호와 모드에 맞는 범위에서 순차 생성

#### ManualItemDischargedForm
- ItemDischarged(21) 수동 생성
- CellIndexNo, InductionNo, Mode, PID, ChuteNumber, RecirculationCount

#### ManualSorterStatusForm
- SorterStatus(10) 수동 생성
- Status 선택: 0:정지, 1:운전, 2:에러

#### ManualInductionStatusForm
- InductionStatus(11) 수동 생성
- 인덕션 개수(1~4) 선택 → 각각의 번호, 상태 입력

### 4. Ack 응답 생성 로직
- 제어 명령 전송 시 Ack 응답의 Status 값을 사용자가 선택할 수 있는 옵션 제공:
  - "자동 (정상 응답)" — 기본값, Status=0(Ok) 또는 Reason=0(Accepted)
  - "에러 응답" — Status=1(Error)
  - "블록 응답" — Status=2(Blocked) (해당되는 경우만)
- 이를 통해 에러 시나리오도 테스트 가능

### 5. 공통 동작
- 모든 전송 폼은 전송 버튼 클릭 시:
  1. 입력값 검증
  2. encoder로 바이트 배열 생성
  3. decoder로 디코딩하여 decodedFields 생성
  4. TelegramLog 객체 생성하여 useLogStore.addLog()
  5. useStatsStore 기록
  6. 필요 시 useSystemStore 상태 업데이트
- 전송 성공 시 짧은 토스트 알림 (예: "SetControlSorter 전송됨")

### 확인
- 각 폼이 올바르게 렌더링되는지 확인
- 전송 버튼 클릭 시 타임라인에 로그가 추가되는지 확인
- Ack 응답이 자동으로 생성되는지 확인
- 패킷 분석기에서 수동 전송한 텔레그램의 구조가 올바르게 표시되는지 확인
