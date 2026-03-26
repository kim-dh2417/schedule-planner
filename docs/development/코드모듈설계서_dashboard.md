# 코드 모듈 설계서
- 문서상태: 초안
- 작성일: 2026-03-25
- 최종수정일: 2026-03-25
- 작성자: 개발자 에이전트

## 변경이력
| 날짜 | 상태 | 변경 내용 |
|---|---|---|
| 2026-03-25 | 초안 | React 기준 컴포넌트/모듈 책임 분리 초안 작성 |

## 목적

이 문서는 메인 대시보드 구현을 React 컴포넌트와 기능 모듈로 어떻게 나눌지 정리한다.

## 모듈 분리 원칙

- 화면 조립과 데이터 계산을 분리한다.
- 캘린더, 일정, 팀, 집중 블록은 각자 책임을 가진다.
- 재사용 가능한 UI는 공통 컴포넌트로 분리한다.

## 제안 컴포넌트

- `App`
- `DashboardShell`
- `HeroCard`
- `SummaryCard`
- `MonthlyCalendar`
- `CalendarCell`
- `TodayBoard`
- `QuickDraft`
- `TeamPulse`
- `FocusBlocks`
- `StatusChip`
- `ToolbarChip`
- `LoadBar`

## 기능 모듈

- `calendar` 모듈: 월간 캘린더 계산, 날짜 선택, 이벤트 표시
- `schedules` 모듈: 일정 생성/수정/삭제, 충돌 검사
- `team` 모듈: 팀원 부하 계산, 참여자 목록
- `focusBlocks` 모듈: 집중 시간 정책, 겹침 검사
- `dashboard` 모듈: 요약 카드와 패널 조합

## 책임 분리

### UI 컴포넌트

- 외형과 레이아웃만 담당한다.
- 가능한 한 상태 계산은 받기만 한다.

### 기능 모듈

- 날짜 계산, 충돌 판단, 부하 계산 같은 도메인 로직을 담당한다.
- UI에서 재사용 가능한 순수 함수 위주로 작성한다.

### 상태 계층

- 현재 MVP는 단일 페이지 상태로 시작한다.
- 추후에는 store 또는 API cache 계층으로 옮길 수 있게 단순하게 유지한다.

## 파일 구조 초안

```text
src/
  App.jsx
  styles.css
  components/
  features/
    dashboard/
    schedules/
    team/
    focusBlocks/
  data/
  services/
  utils/
```

## 비고

- 처음에는 파일 수를 과하게 늘리지 않고, 화면 단위로 점진 분리한다.
- 문서상 `Dashboard`는 메인 대시보드 화면을 의미한다.
