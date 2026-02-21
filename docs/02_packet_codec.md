# Prompt 2: 패킷 인코딩/디코딩 엔진

## 목표
프로토콜 문서에 정의된 패킷 구조를 바이트 배열로 인코딩하고, 바이트 배열을 구조화된 객체로 디코딩하는 엔진을 구현한다.

## 작업 내용

### 1. 패킷 공통 구조 (`src/core/protocol/packet.ts`)

모든 패킷의 공통 구조:
```
[STX(1)] [DataType(1)] [MachineID(6)] [TelegramNo(2)] [DataLength(2)] [Data(가변)] [ETX(1)]
```

- STX: 0x02
- ETX: 0x03
- DataType: ASCII 문자 1바이트 ('H', 'S', 'D', 'A', 'R')
- MachineID: ASCII 문자 6바이트 (예: "PSM001")
- TelegramNo: 2바이트 Integer (Big Endian)
- DataLength: 2바이트 Integer - Data 영역의 바이트 길이
- Data: 텔레그램별 가변 데이터

### 2. 인코딩 함수 (`src/core/protocol/encoder.ts`)

`encodeTelegram(telegramNo, machineId, fields)` 함수를 구현:
- 입력: 텔레그램 번호, 머신ID, 필드값 객체
- 출력: `number[]` (바이트 배열)
- `src/constants/telegramMeta.ts`에 정의된 메타데이터를 참조하여 각 필드를 올바른 바이트 크기로 인코딩
- Integer 필드는 Big Endian 2바이트 또는 4바이트(PID)로 인코딩
- Char 필드는 ASCII로 인코딩
- InductionStatus(11), InductionMode(12)처럼 반복 필드가 있는 텔레그램은 InductionCount에 따라 동적으로 반복 인코딩

각 텔레그램별 인코딩 예시:
- `encodeHeartBeat(machineId, activeStatus)` → STX + 'H' + machineId + 1 + 2 + activeStatus(2bytes) + ETX
- `encodeItemInducted(machineId, { cellIndexNo, cellCount, pid, inductionNo, mode, mainDest, dest1~4 })` → 전체 31바이트
- `encodeItemDischarged(...)` → 전체 25바이트
- 나머지 16종 텔레그램도 모두 구현

### 3. 디코딩 함수 (`src/core/protocol/decoder.ts`)

`decodeTelegram(rawBytes)` 함수를 구현:
- 입력: `number[]` (바이트 배열)
- 출력: `{ telegramNo, machineId, dataTypeChar, fields: Record<string, DecodedField> }`
- STX/ETX 검증
- DataType, MachineID, TelegramNo, DataLength 파싱
- 텔레그램 번호에 따라 Data 영역을 해당 텔레그램의 필드 구조에 맞게 파싱
- 각 DecodedField는 `{ name, nameKo, rawBytes: number[], value: number|string, description: string }`
  - description은 값의 의미를 한글로 설명 (예: SorterStatus 값이 1이면 "운전")
  - rawBytes는 해당 필드의 원본 바이트

### 4. 유틸리티 함수 (`src/core/protocol/utils.ts`)
- `bytesToHexString(bytes)`: 바이트 배열 → "02 48 50 53 ..." 형태
- `bytesToInt(bytes)`: Big Endian 바이트 → 정수
- `intToBytes(value, size)`: 정수 → Big Endian 바이트 배열
- `stringToBytes(str)`: 문자열 → ASCII 바이트 배열
- `bytesToString(bytes)`: ASCII 바이트 → 문자열
- `getFieldColorClass(fieldType)`: 필드 타입별 CSS 클래스 반환
  - stx/etx → 'text-red-400 bg-red-900/30'
  - dataType → 'text-purple-400 bg-purple-900/30'  
  - machineId → 'text-cyan-400 bg-cyan-900/30'
  - telegramNo → 'text-blue-400 bg-blue-900/30'
  - dataLength → 'text-yellow-400 bg-yellow-900/30'
  - data → 'text-green-400 bg-green-900/30'

### 5. 테스트 (`src/core/protocol/__tests__/codec.test.ts`)
주요 텔레그램에 대해 인코딩 → 디코딩 라운드트립 테스트를 작성:
- HeartBeat: activeStatus=1
- ItemInducted: cellIndexNo=2, pid=10000, inductionNo=1, mode=1, mainDest=0, dest1~4=0
- ItemDischarged: cellIndexNo=2, inductionNo=1, mode=1, pid=10000, chuteNumber=22, recirculationCount=0
- ItemSortedConfirm: status=1(정상구분)
- SetControlSorterAck: request=1, status=0

### 확인
- `npx tsc --noEmit` 통과
- 테스트 실행하여 라운드트립 검증 통과
- 프로토콜 문서의 Example Data 값과 대조하여 인코딩 결과가 일치하는지 확인
