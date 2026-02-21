# Prompt 3: Zustand 상태 관리 스토어

## 목표
시뮬레이터의 전체 상태를 관리하는 Zustand 스토어들을 구현한다.

## 작업 내용

### 1. 텔레그램 로그 스토어 (`src/stores/useLogStore.ts`)

관리 상태:
- `logs: TelegramLog[]` — 전체 텔레그램 로그 배열 (최대 10,000건, 초과 시 오래된 것부터 삭제)
- `selectedLogId: string | null` — 현재 선택된 로그의 ID
- `filter` — 필터 조건 객체:
  - `direction: Direction | 'ALL'`
  - `telegramNos: number[]` (빈 배열이면 전체)
  - `searchText: string`

액션:
- `addLog(log)` — 새 로그 추가 (상단에 추가, 10,000건 초과 시 하단 제거)
- `selectLog(id)` — 특정 로그 선택
- `setFilter(filter)` — 필터 설정
- `clearLogs()` — 전체 로그 초기화
- `getFilteredLogs()` — 필터 적용된 로그 반환 (getter/computed)
- `exportLogs(format: 'csv' | 'json')` — 로그 내보내기

### 2. 시스템 상태 스토어 (`src/stores/useSystemStore.ts`)

관리 상태:
- `sorterStatus: SorterStatus` (초기값: 0 정지)
- `inductions: Array<{ no: number; status: InductionStatus; mode: InductionMode }>` (인덕션 4개, 초기: 모두 정지/BCR)
- `heartbeat: { lastReceived: Date | null; active: boolean }` (초기: null/false)
- `overflowConfig: { chute1: number; chute2: number; maxRecirculation: number }` (초기: 200, 202, 2)
- `activeItems: Map<number, ActiveItem>` — PID 기반 활성 화물 추적

액션:
- `updateSorterStatus(status)` — 소터 상태 업데이트
- `updateInductionStatus(no, status)` — 특정 인덕션 상태 업데이트
- `updateInductionMode(no, mode)` — 특정 인덕션 모드 업데이트
- `updateHeartbeat()` — 하트비트 수신 시각 갱신
- `updateOverflowConfig(config)` — 오버플로 설정 갱신
- `addActiveItem(item)` — 화물 투입
- `updateItemStatus(pid, status)` — 화물 상태 변경
- `removeActiveItem(pid)` — 화물 제거 (구분 완료)
- `resetAll()` — 전체 상태 초기화

### 3. 시뮬레이션 제어 스토어 (`src/stores/useSimStore.ts`)

관리 상태:
- `isRunning: boolean` — 시뮬레이션 실행 여부
- `speed: number` — 시뮬레이션 속도 배율 (0.5x, 1x, 2x, 5x)
- `scenario: string | null` — 현재 실행 중인 시나리오 이름
- `elapsedTime: number` — 경과 시간 (초)

액션:
- `start()` — 시뮬레이션 시작
- `stop()` — 시뮬레이션 정지
- `pause()` — 일시정지
- `setSpeed(speed)` — 속도 변경
- `setScenario(name)` — 시나리오 선택
- `tick()` — 경과 시간 1초 증가

### 4. 통계 스토어 (`src/stores/useStatsStore.ts`)

관리 상태:
- `totalSent: number` — 총 송신 건수
- `totalReceived: number` — 총 수신 건수
- `byTelegram: Record<number, { sent: number; received: number }>` — 텔레그램별 카운트
- `errorCount: number` — 에러 응답 건수
- `itemStats: { inducted: number; discharged: number; confirmed: number; errors: number }` — 화물 처리 통계
- `recentThroughput: number[]` — 최근 60초간 초당 처리량 (차트용)

액션:
- `recordSent(telegramNo)` — 송신 기록
- `recordReceived(telegramNo)` — 수신 기록
- `recordError()` — 에러 기록
- `recordItemEvent(type)` — 화물 이벤트 기록
- `updateThroughput(count)` — 처리량 업데이트
- `resetStats()` — 통계 초기화

### 확인
- 각 스토어가 독립적으로 동작하는지 확인
- 타입 체크 통과
- 개발자 도구에서 스토어 상태 변경이 정상적으로 이루어지는지 확인
