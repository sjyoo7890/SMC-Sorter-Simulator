# Prompt 5: 타임라인 패널

## 목표
PLC↔SMC 간 송수신되는 텔레그램을 시간순으로 표시하는 타임라인 패널을 구현한다.

## 작업 내용

### 1. TimelinePanel (`src/components/timeline/TimelinePanel.tsx`)
- 전체 좌측 영역을 차지하는 메인 패널
- 상단: 필터 바 (FilterBar 컴포넌트)
- 중앙: 스크롤 가능한 타임라인 목록 (TimelineList)
- 하단: 로그 카운트 표시 (예: "표시 중: 152 / 전체: 1,204")

### 2. FilterBar (`src/components/timeline/FilterBar.tsx`)
- 방향 필터: "전체" | "PLC→SMC" | "SMC→PLC" 토글 버튼 그룹
- 텔레그램 종류 필터: 드롭다운 멀티 셀렉트 (텔레그램 번호+이름 목록)
- 검색: 텍스트 입력 (machineId, PID 등으로 검색)
- 초기화 버튼
- 필터 변경 시 useLogStore의 setFilter 호출

### 3. TimelineList (`src/components/timeline/TimelineList.tsx`)
- useLogStore의 getFilteredLogs() 결과를 렌더링
- 가상 스크롤 적용 (대량 로그 성능 최적화) — 직접 구현하거나 간단한 windowing 로직 사용
- 새 로그 추가 시 자동 스크롤 (autoscroll 토글 가능)
- 각 로그 항목은 TimelineItem으로 렌더링

### 4. TimelineItem (`src/components/timeline/TimelineItem.tsx`)
- 시퀀스 다이어그램 스타일의 레이아웃:
  - 좌측: PLC 측 (파란색 세로 라인)
  - 중앙: 화살표 및 텔레그램 정보
  - 우측: SMC 측 (황색 세로 라인)
- 방향에 따라:
  - PLC→SMC: 좌→우 화살표, 파란색 계열
  - SMC→PLC: 우→좌 화살표, 황색 계열
- 화살표 위에 표시할 정보:
  - 텔레그램명 (예: "ItemInducted")
  - 텔레그램 번호 (예: "#20")
  - 핵심 데이터 요약 (예: "PID:10000 Cell:2 Chute:22")
- 화살표 아래: 타임스탬프 (HH:mm:ss.SSS)
- 선택 상태: 클릭 시 배경 하이라이트, useLogStore.selectLog() 호출
- 현재 선택된 항목은 밝은 보더 + 약간 밝은 배경

### 5. 텔레그램별 요약 텍스트 로직 (`src/components/timeline/telegramSummary.ts`)
각 텔레그램 번호에 대해 decodedFields에서 핵심 정보만 추출하여 짧은 요약 텍스트를 생성:
- HeartBeat(1): "Active: ○" 또는 "Active: ✕"
- SorterStatus(10): "운전" / "정지" / "에러"
- InductionStatus(11): "IN1:운전 IN2:정지 ..."
- InductionMode(12): "IN1:BCR IN2:타건 ..."
- ItemInducted(20): "PID:10000 Cell:2 IN:1"
- ItemDischarged(21): "PID:10000 Chute:22 Recirc:0"
- ItemSortedConfirm(22): "PID:10000 Status:정상구분"
- DestinationRequest(30): "Item:101230 Cell:43 Dest:12"
- SetControlSorter(100): "요청:가동"
- SetControlSorterAck(101): "요청:가동 응답:Ok"
- SetControlInduction(110): "IN:1 요청:가동"
- SetControlInductionAck(111): "IN:1 요청:가동 응답:Ok"
- SetInductionMode(120): "IN:1 모드:타건"
- SetInductionModeAck(121): "IN:1 모드:타건 응답:Accepted"
- SetOverflowConfiguration(130): "Chute1:200 Chute2:202 MaxRecirc:2"
- SetOverflowConfigurationAck(131): "Chute1:200 Chute2:202 응답:Accepted"
- SetResetRequest(140): "모듈:Sorter"
- SetResetRequestAck(141): "모듈:Sorter 응답:Accepted"

### 확인
- 시뮬레이션 없이 더미 로그 데이터 10건 정도를 useLogStore에 넣어서 타임라인이 올바르게 표시되는지 확인
- PLC→SMC와 SMC→PLC 방향이 시각적으로 명확히 구분되는지 확인
- 필터 동작 확인
- 항목 클릭 시 선택 상태 변경 확인
