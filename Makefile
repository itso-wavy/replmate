# Replmate Frontend - Makefile

-include .env

# Infisical 환경변수
export INFISICAL_TOKEN
export INFISICAL_PROJECT_ID

.PHONY: deploy.local deploy.dev deploy.stg deploy.prod \
	down.local down.dev down.stg down.prod \
	logs logs.local logs.dev logs.stg logs.prod \
	install status

# Deploy
deploy.local:
	@echo "Deploying frontend (local)..."
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=dev \
		-- docker compose -f ./deploy/docker-compose.local.yml build --no-cache && \
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=dev \
		-- docker compose -f ./deploy/docker-compose.local.yml up

deploy.dev:
	@echo "Deploying frontend (dev)..."
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=dev \
		-- docker compose -f ./deploy/docker-compose.dev.yml build --no-cache && \
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=dev \
		-- docker compose -f ./deploy/docker-compose.dev.yml up -d
	@infisical run --projectId=$(INFISICAL_PROJECT_ID) --env=dev -- \
		bash -c 'VERSION=$$(git describe --tags --abbrev=0 2>/dev/null || echo "unknown"); curl -s -X POST $$SLACK_WEBHOOK_URL -H "Content-Type: application/json" -d "{\"text\":\":rocket: [DEV] replmate-frontend $$VERSION 배포 완료\"}"' > /dev/null || true

deploy.stg:
	@echo "Deploying frontend (staging)..."
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=staging \
		-- docker compose -f ./deploy/docker-compose.stg.yml build --no-cache && \
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=staging \
		-- docker compose -f ./deploy/docker-compose.stg.yml up -d
	@infisical run --projectId=$(INFISICAL_PROJECT_ID) --env=staging -- \
		bash -c 'VERSION=$$(git describe --tags --abbrev=0 2>/dev/null || echo "unknown"); curl -s -X POST $$SLACK_WEBHOOK_URL -H "Content-Type: application/json" -d "{\"text\":\":rocket: [STG] replmate-frontend $$VERSION 배포 완료\"}"' > /dev/null || true

deploy.prod:
	@echo "Deploying frontend (prod)..."
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=prod \
		-- docker compose -f ./deploy/docker-compose.prod.yml build --no-cache && \
	infisical run \
		--projectId=$(INFISICAL_PROJECT_ID) \
		--env=prod \
		-- docker compose -f ./deploy/docker-compose.prod.yml up -d
	@infisical run --projectId=$(INFISICAL_PROJECT_ID) --env=prod -- \
		bash -c 'VERSION=$$(git describe --tags --abbrev=0 2>/dev/null || echo "unknown"); curl -s -X POST $$SLACK_WEBHOOK_URL -H "Content-Type: application/json" -d "{\"text\":\":rocket: [PROD] replmate-frontend $$VERSION 배포 완료\"}"' > /dev/null || true

# Down
down.local:
	docker compose -f ./deploy/docker-compose.local.yml down

down.dev:
	docker compose -f ./deploy/docker-compose.dev.yml down

down.stg:
	docker compose -f ./deploy/docker-compose.stg.yml down

down.prod:
	docker compose -f ./deploy/docker-compose.prod.yml down

# Install
install:
	pnpm install

# Logs (환경별)
logs: logs.local
logs.local:
	docker compose -f ./deploy/docker-compose.local.yml logs -f
logs.dev:
	docker compose -f ./deploy/docker-compose.dev.yml logs -f
logs.stg:
	docker compose -f ./deploy/docker-compose.stg.yml logs -f
logs.prod:
	docker compose -f ./deploy/docker-compose.prod.yml logs -f

# Status
status:
	@docker ps -a --filter "name=rm-front" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
