# DB 설계서
- 문서상태: 초안
- 작성일: 2026-03-25
- 최종수정일: 2026-03-25
- 작성자: 개발자 에이전트

## 변경이력
| 날짜 | 상태 | 변경 내용 |
|---|---|---|
| 2026-03-25 | 초안 | MVP 기준 핵심 엔티티와 테이블 정의 초안 작성 |

## 목적

이 문서는 일정관리 앱 MVP의 핵심 데이터 모델을 정리한다. 현재는 프론트 우선 MVP이므로 실제 DB 생성 전 단계의 ERD/테이블 정의 초안으로 사용한다.

## ERD 초안

- Team 1 : N Schedule
- Team 1 : N Participant
- Schedule N : M Participant
- Team 1 : N FocusBlock
- Schedule 1 : N ScheduleNote

## 핵심 엔티티

- `teams`
- `participants`
- `schedules`
- `schedule_participants`
- `focus_blocks`
- `dashboard_snapshots` 또는 요약 캐시 테이블

## 테이블 정의 초안

### teams

- `id` PK
- `name`
- `color_token`
- `created_at`
- `updated_at`

### participants

- `id` PK
- `team_id` FK
- `name`
- `role`
- `avatar_url`
- `load_level`
- `created_at`
- `updated_at`

### schedules

- `id` PK
- `team_id` FK
- `title`
- `start_at`
- `end_at`
- `schedule_type`
- `status`
- `notes`
- `has_conflict`
- `created_at`
- `updated_at`

### schedule_participants

- `id` PK
- `schedule_id` FK
- `participant_id` FK
- `participation_role`
- `created_at`

### focus_blocks

- `id` PK
- `team_id` FK
- `title`
- `start_at`
- `end_at`
- `note`
- `status`
- `created_at`
- `updated_at`

### dashboard_snapshots

- `id` PK
- `team_id` FK
- `snapshot_date`
- `summary_json`
- `created_at`

## 인덱스 초안

- `schedules(team_id, start_at)`
- `participants(team_id, load_level)`
- `focus_blocks(team_id, start_at)`
- `dashboard_snapshots(team_id, snapshot_date)`

## 상태값 초안

- `draft`
- `confirmed`
- `tentative`
- `conflict`
- `inactive`

## 비고

- 실제 DB는 백엔드 구축 시 확정한다.
- MVP 단계에서는 로컬 상태나 mock 데이터 구조와 1:1로 대응되도록 설계한다.
