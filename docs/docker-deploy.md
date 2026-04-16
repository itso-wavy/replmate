# Docker 배포

환경별 Docker Compose 파일과 Makefile을 통해 배포합니다. 시크릿은 [Infisical](https://infisical.com)로 주입하며, 배포 완료 시 Slack 알림이 전송됩니다.

## 사전 준비

`.env` 파일에 아래 값을 설정합니다:

```env
INFISICAL_TOKEN=<your-token>
INFISICAL_PROJECT_ID=<your-project-id>
```

## 환경별 포트

| 환경 | 컨테이너 | 호스트 포트 | 비고 |
|---|---|---|---|
| local | rm-front-local | 3000 (기본값, `PORT` 환경변수로 변경 가능) | hot reload 지원 |
| dev | rm-front-dev | 3002 | standalone 빌드 |
| stg | rm-front-stg | 3001 | standalone 빌드 |
| prod | rm-front-prod | 3000 | standalone 빌드 |

모든 환경의 컨테이너 내부 포트는 `3000`입니다.

## 배포 명령어

| 명령어 | 설명 |
|---|---|
| `make deploy.local` | 로컬 환경 배포 (포그라운드) |
| `make deploy.dev` | 개발 환경 배포 |
| `make deploy.stg` | 스테이징 환경 배포 |
| `make deploy.prod` | 프로덕션 환경 배포 |
| `make down.<env>` | 환경별 컨테이너 종료 |
| `make logs` | 로컬 로그 확인 |
| `make status` | 컨테이너 상태 확인 |
