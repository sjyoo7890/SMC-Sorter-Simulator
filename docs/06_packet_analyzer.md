# Prompt 6: 패킷 분석기 패널

## 목표
타임라인에서 선택된 텔레그램의 바이트 구조를 시각적으로 분석하는 패킷 분석기를 구현한다.

## 작업 내용

### 1. PacketAnalyzer (`src/components/packet/PacketAnalyzer.tsx`)
- useLogStore의 selectedLogId를 구독하여 선택된 로그를 표시
- 선택된 로그가 없으면 "타임라인에서 텔레그램을 선택하세요" 안내 메시지 표시
- 상단: 텔레그램 요약 헤더 (PacketHeader)
- 중앙: 두 개의 뷰를 탭으로 전환
  - "Hex Dump" 탭: 바이트 레벨 뷰 (HexDumpView)
  - "Decoded" 탭: 필드별 디코딩 뷰 (DecodedView)
- 두 뷰 간 필드 호버가 연동됨 (하나에서 호버하면 다른 쪽도 하이라이트)

### 2. PacketHeader (`src/components/packet/PacketHeader.tsx`)
- 표시 정보:
  - 텔레그램명 + 번호 (예: "ItemInducted (#20)")
  - 방향 뱃지 (DirectionBadge)
  - 포트 번호 (예: "Port 3002")
  - 타임스탬프 (예: "2025-02-20 14:32:15.123")
  - 총 패킷 크기 (예: "31 bytes")
  - DataType 문자 (예: "Type: D (Data)")

### 3. HexDumpView (`src/components/packet/HexDumpView.tsx`)
- rawBytes를 hex dump 형태로 표시:
  ```
  Offset   Hex                                          ASCII
  0000     02 44 50 53 4D 30 30 31 00 14 00 16 00 02   .DPSM001......
  000E     00 00 00 00 27 10 00 01 00 01 00 00 00 00   ....'..........
  001C     00 00 00 00 03                               .....
  ```
- 좌측: 오프셋 (hex)
- 중앙: hex 바이트 (각 필드별 다른 배경 색상)
- 우측: ASCII 표현 (출력 가능 문자만, 나머지는 '.')
- 필드별 색상 구분:
  - STX/ETX: 빨간색 계열 배경
  - DataType: 보라색 계열
  - MachineID: 시안 계열
  - TelegramNo: 파란색 계열
  - DataLength: 노란색 계열
  - Data 영역 각 필드: 녹색 계열 (톤 변화로 필드 간 구분)
- 마우스 호버 시:
  - 해당 바이트가 속한 필드 전체 강조 하이라이트
  - 툴팁으로 필드명, 값, 설명 표시
  - `onHoverField` 콜백으로 DecodedView 연동

### 4. DecodedView (`src/components/packet/DecodedView.tsx`)
- 디코딩된 필드를 테이블 형태로 표시:
  ```
  필드명              크기      Hex값          Decimal값      설명
  ─────────────────────────────────────────────────────────────
  STX                 1 byte   02             -              패킷 시작
  DataType            1 byte   44             'D'            Data
  MachineID           6 bytes  50534D303031   PSM001         모듈ID
  TelegramNo          2 bytes  0014           20             ItemInducted
  DataLength          2 bytes  0016           22             데이터 길이
  ─── Data Fields ────────────────────────────────────────────
  CellIndexNo         2 bytes  0002           2              캐리어(셀) 번호
  CellCount           2 bytes  0000           0              캐리어 사용 개수
  PID                 4 bytes  00002710       10000          소포 내부ID
  InductionNo         2 bytes  0001           1              공급부 번호
  Mode                2 bytes  0001           1              수동
  MainDestination     2 bytes  0000           0              메인 목적지 (없음)
  Destination1        2 bytes  0000           0              목적지1 (없음)
  Destination2        2 bytes  0000           0              목적지2 (없음)
  Destination3        2 bytes  0000           0              목적지3 (없음)
  Destination4        2 bytes  0000           0              목적지4 (없음)
  ─────────────────────────────────────────────────────────────
  ETX                 1 byte   03             -              패킷 종료
  ```
- 각 행은 해당 필드의 색상으로 좌측 보더 표시 (HexDumpView 색상과 동일)
- 호버 시 해당 행 하이라이트 + HexDumpView 연동
- Data Fields는 시각적으로 구분되는 영역으로 표시 (약간 들여쓰기 + 구분선)
- 값의 의미가 있는 필드는 Description 열에 한글 설명 표시:
  - SorterStatus 값 1 → "운전"
  - Mode 값 0 → "자동(BCR)"
  - AckStatus 값 2 → "Blocked"
  - SortStatus 값 7 → "목적지 없음 (No Destination)"

### 5. 필드 호버 연동 로직
- PacketAnalyzer 내부에서 `hoveredFieldIndex` 상태 관리
- HexDumpView와 DecodedView 양쪽에 전달하여 동기화
- 한쪽에서 호버 시 양쪽 모두 해당 필드 하이라이트

### 확인
- 더미 로그 데이터로 HexDump와 Decoded 뷰가 올바르게 표시되는지 확인
- 필드 색상이 양쪽 뷰에서 일관되는지 확인
- 호버 연동이 자연스럽게 동작하는지 확인
- 모든 18종 텔레그램에 대해 Decoded 뷰가 정확하게 필드를 표시하는지 확인
