# Prompt 4: 공통 UI 컴포넌트

## 목표
시뮬레이터 전체에서 재사용되는 공통 UI 컴포넌트를 구현한다. 다크 테마 산업용 모니터링 UI 스타일을 적용한다.

## 디자인 원칙
- 배경: 매우 어두운 남색/회색 계열 (#0f1419, #1a2332)
- 카드: 약간 밝은 어두운 배경 + 미세한 보더
- 텍스트: 밝은 회색 (#e2e8f0), 보조 텍스트는 중간 회색 (#94a3b8)
- 강조: 방향에 따라 파란색(PLC→SMC) / 황색(SMC→PLC)
- 폰트: 데이터 표시 영역은 monospace (font-mono)

## 작업 내용

### 1. Card (`src/components/common/Card.tsx`)
- props: `title`, `children`, `className?`, `headerRight?` (헤더 우측 추가 요소)
- 스타일: 어두운 배경 카드, 상단에 타이틀 바, 미세한 보더
- 타이틀 바 좌측에 작은 컬러 도트 인디케이터 (선택적)

### 2. Badge (`src/components/common/Badge.tsx`)
- props: `variant: 'success' | 'error' | 'warning' | 'info' | 'neutral'`, `children`, `dot?: boolean` (좌측에 애니메이션 점), `size?: 'sm' | 'md'`
- 각 variant별 색상:
  - success: 초록 배경+텍스트 (운전, 정상, Ok)
  - error: 빨강 (에러, Error)
  - warning: 황색 (경고, Blocked)
  - info: 파랑 (정보)
  - neutral: 회색 (정지, 비활성)
- dot=true이면 좌측에 pulse 애니메이션이 있는 작은 원

### 3. DirectionBadge (`src/components/common/DirectionBadge.tsx`)
- props: `direction: Direction`
- PLC→SMC: 파란색 배경 + 화살표 아이콘 + "PLC → SMC"
- SMC→PLC: 황색 배경 + 화살표 아이콘 + "SMC → PLC"
- 작고 컴팩트한 뱃지 형태

### 4. StatusIndicator (`src/components/common/StatusIndicator.tsx`)
- props: `status: 'online' | 'offline' | 'error'`, `label: string`
- 좌측에 색상 원 (online: 초록+pulse, offline: 회색, error: 빨강+pulse)
- 우측에 레이블 텍스트

### 5. HexView (`src/components/common/HexView.tsx`)
- props: `bytes: number[]`, `fieldRanges: Array<{ start, end, color, label }>`, `onHoverField?: (fieldIndex) => void`
- 바이트 배열을 hex 문자열로 표시 (예: "02 48 50 53 4D 30 30 31 ...")
- 각 필드 범위별로 다른 배경 색상 적용
- 바이트 호버 시 해당 필드 하이라이트 + 툴팁 표시
- 상단에 오프셋 번호 표시
- monospace 폰트 사용

### 6. Button (`src/components/common/Button.tsx`)
- props: `variant: 'primary' | 'secondary' | 'danger' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `icon?: ReactNode`, `loading?: boolean`, `children`
- primary: 파란색 배경
- secondary: 어두운 배경 + 보더
- danger: 빨간색 배경
- ghost: 투명 배경, 호버 시 약간 밝아짐

### 7. Select (`src/components/common/Select.tsx`)
- props: `options: Array<{ value, label }>`, `value`, `onChange`, `placeholder?`
- 다크 테마 드롭다운 스타일

### 8. Tabs (`src/components/common/Tabs.tsx`)
- props: `tabs: Array<{ key, label, icon? }>`, `activeTab`, `onTabChange`
- 하단 보더 인디케이터 스타일의 탭

### 확인
- 각 컴포넌트가 독립적으로 렌더링되는지 확인
- 다크 테마 스타일이 일관되게 적용되는지 확인
- App.tsx에서 각 컴포넌트를 임시로 배치하여 시각적으로 확인
