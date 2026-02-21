# Prompt 9: 통계 패널

## 목표
텔레그램 송수신 통계를 차트와 수치로 시각화하는 통계 패널을 구현한다.

## 작업 내용

### 1. StatisticsPanel (`src/components/statistics/StatisticsPanel.tsx`)
- 제어 패널과 탭으로 전환되는 구조 (Prompt 8에서 만든 ControlPanel과 함께)
- 상단: 요약 카운터 카드 (SummaryCards)
- 중앙: 차트 영역 (탭 전환)
- 하단: 내보내기 버튼

### 2. SummaryCards (`src/components/statistics/SummaryCards.tsx`)
- 4개의 미니 카드를 가로로 배치:
  - "총 송신" — totalSent 수치, 위쪽 화살표 아이콘, 황색
  - "총 수신" — totalReceived 수치, 아래쪽 화살표 아이콘, 파란색
  - "에러" — errorCount 수치, 경고 아이콘, 빨간색
  - "처리 화물" — itemStats.confirmed 수치, 체크 아이콘, 초록색
- 각 카드는 숫자가 크게, 레이블이 작게 표시

### 3. TelegramDistributionChart (`src/components/statistics/TelegramDistributionChart.tsx`)
- Recharts BarChart 사용
- X축: 텔레그램 이름 (짧은 약어 사용)
- Y축: 건수
- 각 바: sent(황색), received(파란색) 스택 또는 그룹
- 다크 테마에 맞는 색상
- 툴팁: 텔레그램 전체 이름 + 정확한 건수

### 4. ThroughputChart (`src/components/statistics/ThroughputChart.tsx`)
- Recharts AreaChart 또는 LineChart 사용
- X축: 시간 (최근 60초)
- Y축: 초당 처리량 (건/초)
- useStatsStore의 recentThroughput 배열 사용
- 영역 아래 그라데이션 채우기
- 실시간 업데이트 (1초마다 갱신)

### 5. ItemProcessingChart (`src/components/statistics/ItemProcessingChart.tsx`)
- Recharts PieChart 사용
- 화물 처리 현황:
  - 투입 (inducted): 노란색
  - 배출 (discharged): 파란색
  - 확인 (confirmed): 초록색
  - 에러 (errors): 빨간색
- 도넛 차트 스타일, 중앙에 총 건수 표시
- 범례 포함

### 6. ExportButton (`src/components/statistics/ExportButton.tsx`)
- "CSV 내보내기" 및 "JSON 내보내기" 버튼
- 클릭 시 useLogStore.exportLogs() 호출
- CSV 형식: timestamp, direction, telegramNo, telegramName, machineId, port, decodedFields(JSON)
- JSON 형식: 전체 로그 배열
- 브라우저 다운로드 트리거 (Blob + URL.createObjectURL + a.click())

### 확인
- 더미 통계 데이터로 각 차트가 올바르게 렌더링되는지 확인
- 다크 테마에서 차트 색상이 잘 보이는지 확인
- 내보내기 기능이 정상 동작하는지 확인
- 실시간 데이터 업데이트 시 차트가 자연스럽게 갱신되는지 확인
