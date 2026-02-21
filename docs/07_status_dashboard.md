# Prompt 7: 상태 대시보드 패널

## 목표
소터 시스템의 실시간 상태를 한눈에 파악할 수 있는 대시보드를 구현한다.

## 작업 내용

### 1. StatusDashboard (`src/components/dashboard/StatusDashboard.tsx`)
- useSystemStore를 구독하여 실시간 상태 표시
- 그리드 레이아웃으로 다음 카드들을 배치

### 2. SorterStatusCard (`src/components/dashboard/SorterStatusCard.tsx`)
- 소터 운전 상태 표시
- 큰 아이콘 + 상태 텍스트:
  - 0 (정지): 회색 아이콘, "정지" 텍스트
  - 1 (운전): 초록 아이콘 + pulse 애니메이션, "운전 중" 텍스트
  - 2 (에러): 빨강 아이콘 + pulse 애니메이션, "에러" 텍스트
- 하단에 마지막 상태 변경 시각 표시

### 3. HeartbeatCard (`src/components/dashboard/HeartbeatCard.tsx`)
- HeartBeat 연결 상태 표시
- 심박수 모니터 스타일의 간단한 시각화:
  - 가로로 늘어선 작은 점들이 3초마다 한 번씩 "펄스" 애니메이션
  - 마지막 수신 시각 표시
  - active=true면 초록, false(3초 이상 미수신)면 빨강
- "마지막 수신: 14:32:15" / "연결 끊김" 텍스트

### 4. InductionStatusCard (`src/components/dashboard/InductionStatusCard.tsx`)
- 4개의 인덕션 상태를 격자로 표시
- 각 인덕션:
  - 번호 (IN1, IN2, IN3, IN4)
  - 상태 뱃지 (정지/운전/에러)
  - 모드 뱃지 (BCR/타건)
  - 모드에 따라 아이콘 변경 (BCR: 바코드 아이콘, 타건: 키보드 아이콘)
- 2×2 그리드 레이아웃

### 5. OverflowConfigCard (`src/components/dashboard/OverflowConfigCard.tsx`)
- 현재 오버플로 설정 표시:
  - 오버플로 슈트 1 번호
  - 오버플로 슈트 2 번호
  - 최대 회전수
- 아이콘 + 값 형태, 간결하게 표시

### 6. ActiveItemsCard (`src/components/dashboard/ActiveItemsCard.tsx`)
- 현재 트랙 위의 활성 화물 목록 (최대 최근 10건)
- 각 화물: PID, Cell번호, 상태(투입됨/목적지설정/배출됨/확인), 인덕션번호
- 상태별 색상 구분:
  - inducted: 노란색
  - destination_set: 파란색
  - discharged: 초록색
  - confirmed: 회색 (완료)
- 총 활성 화물 수 표시

### 확인
- useSystemStore에 더미 데이터를 넣어서 각 카드가 올바르게 표시되는지 확인
- 상태 변경 시 실시간으로 UI가 갱신되는지 확인
- 반응형 레이아웃이 올바르게 동작하는지 확인
