# API 명세서
- 문서상태: 초안
- 작성일: 2026-03-25
- 최종수정일: 2026-03-25
- 작성자: 개발자 에이전트

## 변경이력
| 날짜 | 상태 | 변경 내용 |
|---|---|---|
| 2026-03-25 | 초안 | 프론트 MVP 기준 예상 API 초안 작성 |

## 목적

이 문서는 일정관리 앱 MVP의 API 경계를 초안으로 정리한다. 현재는 실제 백엔드가 없는 프론트 MVP 단계이므로, 우선 호출 구조와 데이터 모양을 합의하고 이후 서버 구현으로 연결한다.

## 전제

- 현재 단계는 프론트 중심 MVP이다.
- 실제 서버가 없으므로 아래 API는 `예상 엔드포인트` 초안이다.
- 초기 구현에서는 더미 데이터, 로컬 상태, 또는 mock adapter로 대체 가능하다.

## 핵심 리소스

- `schedules`: 일정 데이터
- `participants`: 참여자 데이터
- `teams`: 팀 데이터
- `focus-blocks`: 집중 시간 블록
- `dashboard-summary`: 대시보드 요약 데이터

## 예상 엔드포인트

### 일정

- `GET /api/schedules`
- `GET /api/schedules/{scheduleId}`
- `POST /api/schedules`
- `PATCH /api/schedules/{scheduleId}`
- `DELETE /api/schedules/{scheduleId}`

### 참여자

- `GET /api/participants`
- `POST /api/participants`

### 팀

- `GET /api/teams`
- `GET /api/teams/{teamId}`

### 집중 블록

- `GET /api/focus-blocks`
- `POST /api/focus-blocks`
- `PATCH /api/focus-blocks/{focusBlockId}`

### 대시보드 요약

- `GET /api/dashboard-summary?date=YYYY-MM-DD`

## 공통 응답 초안

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "string",
    "timestamp": "string"
  }
}
```

## 일정 객체 초안

```json
{
  "id": "sch_001",
  "title": "주간 기획 회의",
  "startAt": "2026-03-25T09:30:00+09:00",
  "endAt": "2026-03-25T10:30:00+09:00",
  "type": "meeting",
  "status": "confirmed",
  "participants": ["u_001", "u_002"],
  "teamId": "team_001",
  "notes": "초기안",
  "hasConflict": false
}
```

## 상태 규칙

- `confirmed`: 확정된 일정
- `draft`: 작성 중인 일정
- `tentative`: 임시 일정
- `conflict`: 충돌이 감지된 일정

## 예외 처리 초안

- 일정 시간이 겹치면 `hasConflict: true` 반환을 우선 고려한다.
- 필수 값이 누락되면 `400` 계열 에러를 사용한다.
- 식별자가 없으면 `404`를 사용한다.
- 서버가 없는 MVP에서는 API 실패 대신 로컬 검증 메시지로 대체할 수 있다.

## 비고

- 실제 백엔드 도입 시 인증, 권한, 페이징, 정렬, 필터는 별도 문서로 추후 확정한다.
- 이 문서는 프론트 구현을 위한 계약 초안이다.
