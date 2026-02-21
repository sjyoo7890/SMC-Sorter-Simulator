# Prompt 0: 프로젝트 초기 설정

## 목표
SMC-Sorter PLC 인터페이스 시뮬레이터 프로젝트의 기본 구조를 생성한다.

## 작업 내용

### 1. 프로젝트 생성
- Vite + React + TypeScript로 프로젝트를 생성해줘.
- 프로젝트 이름: `smc-sorter-simulator`

### 2. 의존성 설치
```
tailwindcss, @tailwindcss/vite, recharts, zustand, lucide-react, date-fns
```

### 3. 디렉토리 구조
```
src/
├── components/          # UI 컴포넌트
│   ├── timeline/        # 타임라인 패널
│   ├── packet/          # 패킷 분석기
│   ├── dashboard/       # 상태 대시보드
│   ├── control/         # 제어 패널
│   ├── statistics/      # 통계 패널
│   └── common/          # 공통 컴포넌트 (Badge, Button, Card 등)
├── core/                # 핵심 로직
│   ├── protocol/        # 프로토콜 정의 및 파싱
│   ├── simulator/       # 시뮬레이션 엔진
│   └── generator/       # 텔레그램 생성기
├── stores/              # Zustand 상태 관리
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수
└── constants/           # 상수 정의
```

### 4. Tailwind CSS 설정
- `@import "tailwindcss";` 방식으로 Tailwind을 설정해줘.
- 다크 테마 기반 산업용 모니터링 UI 느낌의 색상 팔레트를 CSS 변수로 정의:
  - 배경: `#0f1419` (매우 어두운 남색)
  - 카드 배경: `#1a2332`
  - 보더: `#2a3a4e`
  - PLC→SMC 방향 색상: `#3b82f6` (파란색 계열)
  - SMC→PLC 방향 색상: `#f59e0b` (황색 계열)
  - 성공: `#10b981`, 에러: `#ef4444`, 경고: `#f59e0b`
  - 텍스트 주색: `#e2e8f0`, 보조: `#94a3b8`

### 5. 기본 레이아웃 (App.tsx)
- 상단 헤더: 프로젝트 타이틀 "SMC-Sorter PLC Interface Simulator", 연결 상태 인디케이터, 시뮬레이션 시작/정지 버튼
- 좌측: 타임라인 패널 (전체 높이의 좌측 영역, 너비 약 40%)
- 우측 상단: 상태 대시보드
- 우측 중앙: 패킷 분석기
- 우측 하단: 제어 패널 / 통계 탭 전환
- 각 영역에는 우선 placeholder 컴포넌트만 배치

### 6. 확인
- `npm run dev`로 개발 서버가 정상 실행되는지 확인
- 다크 테마 레이아웃이 올바르게 표시되는지 확인
