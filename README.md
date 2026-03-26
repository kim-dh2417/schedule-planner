# Schedule Planner

업무일지 기반 주간보고 캘린더 MVP입니다. 일정, 업무일지, 주간보고 흐름을 하나의 화면 구조로 다루는 React + Vite 프로젝트입니다.

## 개발 환경 고정 기준

- Node.js: `24.14.0`
- npm: `11.9.0`
- 패키지 설치: `npm ci`
- 로컬 권장 버전 파일: `.nvmrc`
- Docker 개발 환경: `compose.yaml`
- CI 검증: `.github/workflows/ci.yml`

## 로컬 실행

```bash
nvm use
npm ci
npm run dev
```

브라우저 기본 주소는 `http://127.0.0.1:5173` 입니다.

## Docker로 개발 서버 실행

```bash
docker compose up --build web
```

- 개발 서버 주소: `http://127.0.0.1:5173`
- 소스 변경은 bind mount로 컨테이너에 반영됩니다.

## Docker로 배포용 미리보기 실행

```bash
docker compose --profile production up --build web-prod
```

- 미리보기 주소: `http://127.0.0.1:8080`
- `dist` 빌드 결과를 Nginx로 서빙합니다.

## 수동 빌드 확인

```bash
npm run build
```

## GitHub Actions

`main` 브랜치 push 및 PR 생성 시 아래 검증이 자동 실행됩니다.

- `npm ci`
- `npm run build`

## 관련 문서

- `docs/planning/PRD_mvp.md`
- `docs/planning/요구사항정의서_mvp.md`
- `docs/planning/기획안_mvp.md`
