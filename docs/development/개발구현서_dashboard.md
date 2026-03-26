# 개발구현서_dashboard

- 문서상태: 초안
- 작성일: 2026-03-25
- 최종수정일: 2026-03-25
- 작성자: 개발자 에이전트

## 변경이력
| 날짜 | 상태 | 변경 내용 |
|---|---|---|
| 2026-03-25 | 초안 | calendar-first 레이아웃 기준으로 구현 범위와 반영 사항 갱신 |
| 2026-03-25 | 초안 | 일정 추가 모달이 선택일 드로어 뒤로 가려지던 레이어 순서 문제 수정 |
| 2026-03-25 | 초안 | 업무일지, 주간보고, 브라우저 알림 중심 제품 방향으로 화면과 상태 구조를 재구성 |

## 구현 목표

최신 기획 문서를 기준으로 기존 개인 일정관리 캘린더를 `업무일지 기반 주간보고 캘린더`로 전환한다. 메인 화면은 월간 달력을 유지하되, 선택일 드로어에서 일정과 업무일지를 함께 확인하고, 주간보고와 알림 설정은 별도 모달로 제공한다.

## 반영 범위

- 상단 헤더 카피와 요약 지표를 업무일지 중심으로 재구성
- 메인 콘텐츠를 월간 달력 단일 중심 구조로 유지
- 선택일 드로어에서 일정 목록과 업무일지 요약을 함께 표시
- 일정 추가/수정 모달에 알림 시점 설정 추가
- 업무일지 작성 모달 추가
- 주간보고 자동 요약 모달 추가
- 브라우저/PC 알림 설정 모달 추가
- 기존 localStorage 기반 저장 흐름을 일정, 업무일지, 알림 설정까지 확장

## 변경 파일

- [App.jsx](C:/dev/schedule-planner/src/App.jsx)
- [styles.css](C:/dev/schedule-planner/src/styles.css)
- [기획안_mvp.md](C:/dev/schedule-planner/docs/planning/기획안_mvp.md)
- [요구사항정의서_mvp.md](C:/dev/schedule-planner/docs/planning/요구사항정의서_mvp.md)
- [기능명세서_mvp.md](C:/dev/schedule-planner/docs/planning/기능명세서_mvp.md)
- [유저스토리_mvp.md](C:/dev/schedule-planner/docs/planning/유저스토리_mvp.md)
- [시나리오_mvp.md](C:/dev/schedule-planner/docs/planning/시나리오_mvp.md)
- [정책정의서_mvp.md](C:/dev/schedule-planner/docs/planning/정책정의서_mvp.md)
- [화면흐름도_dashboard.md](C:/dev/schedule-planner/docs/planning/화면흐름도_dashboard.md)
- [개발구현서_dashboard.md](C:/dev/schedule-planner/docs/development/개발구현서_dashboard.md)

## 구현 메모

### 화면 구조

- 메인 화면은 여전히 달력 카드 하나가 대부분의 면적을 차지한다.
- 선택일 일정과 업무일지는 같은 드로어에서 확인하도록 묶었다.
- 일정 등록과 수정은 동일한 모달 폼을 공유한다.
- 주간보고와 알림 설정은 별도 모달로 분리했다.

### 상태 관리

- 일정 데이터의 단일 소스는 `events` 상태다.
- 업무일지는 `workLogs` 상태로 날짜 단위 저장한다.
- 알림 설정은 `reminderSettings` 상태로 관리한다.
- 일정, 업무일지, 알림 설정은 각각 localStorage에 지속화한다.
- 브라우저 알림은 권한 허용과 활성화 상태를 모두 만족할 때만 동작한다.

### 구현된 핵심 기능

- 날짜 선택
- 일정 추가
- 일정 수정
- 일정 삭제
- 날짜별 업무일지 작성 및 수정
- 주간보고 자동 요약 생성
- 브라우저 알림 권한 요청
- 일정별 알림 시점 설정
- 일정 충돌 계산
- 선택일/주간 요약 갱신

## 실행 및 검증

- 실행 명령: `cmd /c npm run build`
- 검증 결과: 빌드 성공
- 미리보기 URL: `http://127.0.0.1:5173/`

## 남은 리스크

- 일정과 업무일지는 여전히 브라우저 localStorage 기반이므로 사용자/기기 간 동기화가 없다.
- 브라우저 알림은 페이지가 열려 있어야 하고 권한이 허용된 경우에만 동작한다.
- 이메일 알림은 백엔드가 없어 아직 구현하지 않았다.
- 주간보고는 규칙 기반 자동 정리이며, AI 수준의 자연어 요약은 차기 범위다.
- App 컴포넌트가 여전히 큰 편이라 이후 컴포넌트 분리가 필요하다.
