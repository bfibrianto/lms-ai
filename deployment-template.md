# Deployment Template — Docker Compose + GitLab CI/CD

Template reusable untuk deploy project ke VPS production dengan Docker Compose + Caddy reverse proxy + GitLab CI/CD auto-deploy.

---

## Daftar Isi

1. [docker-compose.prod.yml Templates](#1-docker-composeprodyml-templates)
2. [.gitlab-ci.yml Template](#2-gitlab-ciyml-template)
3. [.env Template](#3-env-template)
4. [Customization Guide](#4-customization-guide)
5. [CI/CD Variables Checklist](#5-cicd-variables-checklist)
6. [VPS Setup Checklist](#6-vps-setup-checklist)

---

## 1. docker-compose.prod.yml Templates

Pilih salah satu sesuai arsitektur project.

### 1A. Single App (Monolith — Next.js, Express, dll)

Untuk project dengan 1 image saja (contoh: Next.js, Express, NestJS).

```yaml
# ============================================
# Docker Compose - Production
# ============================================

services:
  app:
    image: ${IMAGE_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG:-latest}
    container_name: ${CONTAINER_NAME}
    restart: unless-stopped
    networks:
      - default
      - proxy
      - database
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      # Tambahkan env var project di sini
    labels:
      caddy: http://${CADDY_DOMAIN}
      caddy.reverse_proxy: "{{upstreams ${APP_PORT:-3000}}}"
      caddy.reverse_proxy.header_up: "X-Forwarded-Proto https"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:${APP_PORT:-3000}"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

networks:
  default:
    driver: bridge
  proxy:
    external: true
  database:
    external: true
```

### 1B. Multi-Service (Backend API + Frontend)

Untuk project dengan backend dan frontend terpisah (contoh: Go/Gin API + React/Vite frontend).

```yaml
# ============================================
# Docker Compose - Production
# ============================================

services:
  # ------------------------------------------
  # Backend API
  # ------------------------------------------
  api:
    image: ${IMAGE_REGISTRY}/${IMAGE_NAME_BACKEND}:${IMAGE_TAG:-latest}
    container_name: ${CONTAINER_NAME_BACKEND}
    restart: unless-stopped
    networks:
      - default
      - proxy
      - database
    environment:
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=${DB_PORT}
      - REDIS_ADDR=${REDIS_ADDR:-redis:6379}
      - JWT_SECRET=${JWT_SECRET}
      # Tambahkan env var backend di sini
    labels:
      caddy: http://${CADDY_DOMAIN_API}
      caddy.reverse_proxy: "{{upstreams ${API_PORT:-8080}}}"
      caddy.reverse_proxy.header_up: "X-Forwarded-Proto https"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:${API_PORT:-8080}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

  # ------------------------------------------
  # Frontend (nginx serving static files)
  # ------------------------------------------
  frontend:
    image: ${IMAGE_REGISTRY}/${IMAGE_NAME_FRONTEND}:${IMAGE_TAG:-latest}
    container_name: ${CONTAINER_NAME_FRONTEND}
    restart: unless-stopped
    networks:
      - default
      - proxy
    labels:
      caddy: http://${CADDY_DOMAIN_FRONTEND}
      caddy.reverse_proxy: "{{upstreams 80}}"
      caddy.reverse_proxy.header_up: "X-Forwarded-Proto https"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

  # ------------------------------------------
  # Redis (opsional — hapus jika tidak perlu)
  # ------------------------------------------
  redis:
    image: redis:7-alpine
    container_name: ${CONTAINER_NAME}-redis
    restart: unless-stopped
    networks:
      - default
    volumes:
      - redis_data:/data
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

networks:
  default:
    driver: bridge
  proxy:
    external: true
  database:
    external: true

volumes:
  redis_data:
```

### 1C. Multi-Service + Worker (Backend API + Worker + Frontend)

Untuk project dengan background worker (contoh: Go API + Asynq Worker + React frontend).

```yaml
# ============================================
# Docker Compose - Production
# ============================================

services:
  # ------------------------------------------
  # Backend API
  # ------------------------------------------
  api:
    image: ${IMAGE_REGISTRY}/${IMAGE_NAME_BACKEND}:${IMAGE_TAG:-latest}
    container_name: ${CONTAINER_NAME_BACKEND}
    restart: unless-stopped
    command: ["/app/api"]
    networks:
      - default
      - proxy
      - database
    environment:
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=${DB_PORT}
      - REDIS_ADDR=${REDIS_ADDR:-redis:6379}
      - JWT_SECRET=${JWT_SECRET}
    labels:
      caddy: http://${CADDY_DOMAIN_API}
      caddy.reverse_proxy: "{{upstreams ${API_PORT:-8080}}}"
      caddy.reverse_proxy.header_up: "X-Forwarded-Proto https"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:${API_PORT:-8080}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

  # ------------------------------------------
  # Worker (same image as API, different command)
  # ------------------------------------------
  worker:
    image: ${IMAGE_REGISTRY}/${IMAGE_NAME_BACKEND}:${IMAGE_TAG:-latest}
    container_name: ${CONTAINER_NAME_WORKER}
    restart: unless-stopped
    command: ["/app/worker"]
    networks:
      - default
      - database
    environment:
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=${DB_PORT}
      - REDIS_ADDR=${REDIS_ADDR:-redis:6379}
      - JWT_SECRET=${JWT_SECRET}
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

  # ------------------------------------------
  # Frontend (nginx serving static files)
  # ------------------------------------------
  frontend:
    image: ${IMAGE_REGISTRY}/${IMAGE_NAME_FRONTEND}:${IMAGE_TAG:-latest}
    container_name: ${CONTAINER_NAME_FRONTEND}
    restart: unless-stopped
    networks:
      - default
      - proxy
    labels:
      caddy: http://${CADDY_DOMAIN_FRONTEND}
      caddy.reverse_proxy: "{{upstreams 80}}"
      caddy.reverse_proxy.header_up: "X-Forwarded-Proto https"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

  # ------------------------------------------
  # Redis (untuk queue/cache)
  # ------------------------------------------
  redis:
    image: redis:7-alpine
    container_name: ${CONTAINER_NAME}-redis
    restart: unless-stopped
    networks:
      - default
    volumes:
      - redis_data:/data
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true

networks:
  default:
    driver: bridge
  proxy:
    external: true
  database:
    external: true

volumes:
  redis_data:
```

---

## 2. .gitlab-ci.yml Template

Template CI/CD dengan 3 stage: development (optional), build (DinD), dan deploy:prod (SSH).

```yaml
stages:
  - development
  - build
  - deploy:prod

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: ""
  IMAGE_TAG: $CI_COMMIT_SHORT_SHA

# ============================================
# DEVELOPMENT (optional — deploy ke dev server)
# Hapus section ini jika tidak ada dev server
# ============================================
development:
  stage: development
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY_DEV" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh && chmod 700 ~/.ssh
    - echo "$SSH_KNOWN_HOSTS_DEV" >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - |
      ssh ${DEV_USERNAME}@${DEV_IP} GITLAB_TOKEN="${GITLAB_TOKEN}" bash -s << 'EOF'
        set -e

        REPO_DIR="/home/apps/builds/${CI_PROJECT_PATH}"
        REPO_URL="https://apps:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"

        # Clone if first time
        if [ ! -d "$REPO_DIR" ]; then
          git clone --branch development "$REPO_URL" "$REPO_DIR"
        fi

        cd "$REPO_DIR"
        git remote set-url origin "$REPO_URL"
        git fetch --all
        git checkout development
        git reset --hard origin/development

        docker compose -f docker-compose.dev.yml up -d \
          --force-recreate \
          --build

        echo "Dev deploy finished at $(date)"
      EOF
  tags:
    - new-runner-guaca
  only:
    - development

# ============================================
# BUILD (production — build & push images)
# Multi-style: 1 job per image, atau 1 job untuk single image
# ============================================

# --- OPTION A: Single image build ---
# Uncomment jika project hanya punya 1 Dockerfile di root
#
# build:
#   stage: build
#   image: docker:24-dind
#   services:
#     - docker:24-dind
#   variables:
#     DOCKER_HOST: tcp://docker:2375
#   before_script:
#     - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
#   script:
#     - docker build -t $CI_REGISTRY_IMAGE:${IMAGE_TAG} .
#     - docker tag $CI_REGISTRY_IMAGE:${IMAGE_TAG} $CI_REGISTRY_IMAGE:latest
#     - docker push $CI_REGISTRY_IMAGE:${IMAGE_TAG}
#     - docker push $CI_REGISTRY_IMAGE:latest
#   tags:
#     - new-runner-guaca
#   only:
#     - master

# --- OPTION B: Multi-image build (backend + frontend) ---
# Uncomment jika project punya backend/ dan frontend/ terpisah

build:backend:
  stage: build
  image: docker:24-dind
  services:
    - docker:24-dind
  variables:
    DOCKER_HOST: tcp://docker:2375
  before_script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
  script:
    - echo "Building backend image $CI_REGISTRY_IMAGE/backend:${IMAGE_TAG}"
    - docker build -t $CI_REGISTRY_IMAGE/backend:${IMAGE_TAG} ./backend
    - docker tag $CI_REGISTRY_IMAGE/backend:${IMAGE_TAG} $CI_REGISTRY_IMAGE/backend:latest
    - docker push $CI_REGISTRY_IMAGE/backend:${IMAGE_TAG}
    - docker push $CI_REGISTRY_IMAGE/backend:latest
    - echo "Backend image pushed successfully"
  tags:
    - new-runner-guaca
  only:
    - master

build:frontend:
  stage: build
  image: docker:24-dind
  services:
    - docker:24-dind
  variables:
    DOCKER_HOST: tcp://docker:2375
  before_script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
  script:
    - echo "Building frontend image $CI_REGISTRY_IMAGE/frontend:${IMAGE_TAG}"
    # Tambahkan --build-arg untuk env yang di-embed saat build time (mis: VITE_API_URL, NEXT_PUBLIC_*)
    - docker build --build-arg VITE_API_URL=$PROD_API_URL -t $CI_REGISTRY_IMAGE/frontend:${IMAGE_TAG} ./frontend
    - docker tag $CI_REGISTRY_IMAGE/frontend:${IMAGE_TAG} $CI_REGISTRY_IMAGE/frontend:latest
    - docker push $CI_REGISTRY_IMAGE/frontend:${IMAGE_TAG}
    - docker push $CI_REGISTRY_IMAGE/frontend:latest
    - echo "Frontend image pushed successfully"
  tags:
    - new-runner-guaca
  only:
    - master

# ============================================
# DEPLOY PRODUCTION (auto-deploy on merge to master)
# ============================================

# --- OPTION A: Deploy untuk single image ---
# Uncomment jika project hanya punya 1 image
#
# deploy:production:
#   stage: deploy:prod
#   image: alpine:latest
#   before_script:
#     - apk add --no-cache openssh-client
#     - eval $(ssh-agent -s)
#     - echo "$SSH_PRIVATE_KEY_PROD" | tr -d '\r' | ssh-add -
#     - mkdir -p ~/.ssh
#     - chmod 700 ~/.ssh
#     - ssh-keyscan -H $PROD_IP >> ~/.ssh/known_hosts
#   script:
#     - |
#       ssh $PROD_USERNAME@$PROD_IP CI_REGISTRY_USER="$CI_REGISTRY_USER" CI_REGISTRY_PASSWORD="$CI_REGISTRY_PASSWORD" GITLAB_TOKEN="$GITLAB_TOKEN" bash -s << 'EOF'
#         set -e
#
#         REPO_DIR="/home/apps/builds/${CI_PROJECT_PATH}"
#         REPO_URL="https://apps:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"
#
#         # Clone if first time
#         if [ ! -d "$REPO_DIR/.git" ]; then
#           if [ -d "$REPO_DIR" ]; then
#             TMP_DIR=$(mktemp -d)
#             git clone --branch master "$REPO_URL" "$TMP_DIR"
#             cp -a "$TMP_DIR/.git" "$REPO_DIR/"
#             rm -rf "$TMP_DIR"
#           else
#             git clone --branch master "$REPO_URL" "$REPO_DIR"
#           fi
#         fi
#
#         cd "$REPO_DIR"
#         git fetch --all
#         git checkout master 2>/dev/null || true
#         git reset --hard origin/master
#
#         echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
#         docker compose -f docker-compose.prod.yml pull
#         docker compose -f docker-compose.prod.yml up -d --force-recreate
#         docker image prune -f
#         echo "Production deploy finished at $(date)"
#       EOF
#   tags:
#     - new-runner-guaca
#   only:
#     - master
#   needs:
#     - build

# --- OPTION B: Deploy untuk multi-image ---
deploy:production:
  stage: deploy:prod
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY_PROD" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan -H $PROD_IP >> ~/.ssh/known_hosts
  script:
    - |
      ssh $PROD_USERNAME@$PROD_IP CI_REGISTRY_USER="$CI_REGISTRY_USER" CI_REGISTRY_PASSWORD="$CI_REGISTRY_PASSWORD" GITLAB_TOKEN="$GITLAB_TOKEN" bash -s << 'EOF'
        set -e

        REPO_DIR="/home/apps/builds/${CI_PROJECT_PATH}"
        REPO_URL="https://apps:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"

        # Clone if first time (check .git, not just directory — .env may exist)
        if [ ! -d "$REPO_DIR/.git" ]; then
          if [ -d "$REPO_DIR" ]; then
            TMP_DIR=$(mktemp -d)
            git clone --branch master "$REPO_URL" "$TMP_DIR"
            cp -a "$TMP_DIR/.git" "$REPO_DIR/"
            rm -rf "$TMP_DIR"
          else
            git clone --branch master "$REPO_URL" "$REPO_DIR"
          fi
        fi

        cd "$REPO_DIR"
        git fetch --all
        git checkout master 2>/dev/null || true
        git reset --hard origin/master

        echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
        docker compose -f docker-compose.prod.yml pull
        docker compose -f docker-compose.prod.yml up -d --force-recreate
        docker image prune -f
        echo "Production deploy finished at $(date)"
      EOF
  tags:
    - new-runner-guaca
  only:
    - master
  needs:
    - build:backend
    - build:frontend
```

---

## 3. .env Template

Buat file `.env` di VPS di dalam folder project (`/home/apps/builds/<group>/<project>/.env`).

### 3A. Single App

```env
# ============================================
# Production Environment Variables
# ============================================

# Image
IMAGE_REGISTRY=gitlab.vascomm.co.id:4567/<group>/<project>
IMAGE_NAME=<project-name>
IMAGE_TAG=latest

# Container
CONTAINER_NAME=<project-name>
APP_PORT=3000

# Caddy Domain
CADDY_DOMAIN=<domain>.sitamoto.ai

# Database
DATABASE_URL=postgresql://<user>:<password>@<postgres_container>:5432/<db_name>

# JWT (generate: openssl rand -hex 32)
JWT_SECRET=

# Tambahkan env var project di sini
```

### 3B. Multi-Service (Backend + Frontend)

```env
# ============================================
# Production Environment Variables
# ============================================

# Image
IMAGE_REGISTRY=gitlab.vascomm.co.id:4567/<group>/<project>
IMAGE_NAME_BACKEND=backend
IMAGE_NAME_FRONTEND=frontend
IMAGE_TAG=latest

# Container Names
CONTAINER_NAME_BACKEND=<project>_api
CONTAINER_NAME_FRONTEND=<project>_frontend
CONTAINER_NAME_WORKER=<project>_worker

# Ports (internal container ports)
API_PORT=8080

# Caddy Domains
CADDY_DOMAIN_API=<api-domain>.sitamoto.ai
CADDY_DOMAIN_FRONTEND=<app-domain>.sitamoto.ai

# Database
DB_HOST=<postgres_container_name>
DB_USER=<db_user>
DB_PASSWORD=<db_password>
DB_NAME=<db_name>
DB_PORT=5432

# Redis (default: redis container, atau set ke external host:port)
REDIS_ADDR=redis:6379

# JWT (generate: openssl rand -hex 32)
JWT_SECRET=

# Tambahkan env var project di sini
```

---

## 4. Customization Guide

### 4.1 docker-compose.prod.yml — Yang Perlu Diubah

| Item | Dimana | Contoh |
|------|--------|--------|
| Jumlah services | Root `services:` | Hapus `worker` jika tidak ada worker |
| `image:` path | Setiap service | `${IMAGE_REGISTRY}/${IMAGE_NAME_BACKEND}` |
| `command:` | Jika worker/executable berbeda | `["/app/worker"]`, `["node", "server.js"]` |
| `environment:` | Setiap service | Sesuaikan dengan env var project |
| `caddy` label | Services yang butuh domain | `http://<domain>.sitamoto.ai` |
| `caddy.reverse_proxy` upstream port | Services yang butuh domain | `"{{upstreams 3000}}"` — sesuaikan port |
| Healthcheck `test` | Setiap service | `http://127.0.0.1:<port>/health` |
| Networks | Setiap service | Worker tidak butuh `proxy` (no HTTP) |
| Redis service | Root `services:` | Hapus jika tidak perlu queue/cache |
| `volumes:` | Bottom of file | Hapus `redis_data:` jika tidak ada Redis |

### 4.2 .gitlab-ci.yml — Yang Perlu Diubah

| Item | Dimana | Contoh |
|------|--------|--------|
| Build jobs | `build:` section | Single vs multi-image (uncomment yang sesuai) |
| Build args | `docker build` command | `--build-arg VITE_API_URL=$PROD_API_URL` atau `NEXT_PUBLIC_*` |
| Deploy job | `deploy:production:` | `needs:` — sesuaikan dengan nama build jobs |
| Build context path | `docker build` command | `./backend`, `./frontend`, atau `.` (root) |
| Dev stage | `development:` | Hapus jika tidak ada dev server |
| Runner tag | `tags:` | `new-runner-guaca` atau tag runner lain |

### 4.3 Dockerfile — Best Practices

**Backend (Go):**
```dockerfile
FROM golang:alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/api ./cmd/api
# Build worker juga jika ada
# RUN CGO_ENABLED=0 GOOS=linux go build -o /app/worker ./cmd/worker

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/api /app/api
# COPY --from=builder /app/worker /app/worker
CMD ["/app/api"]
```

**Frontend (Vite/React):**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf (SPA routing):**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;
}
```

---

## 5. CI/CD Variables Checklist

Set di GitLab → **Settings → CI/CD → Variables**. Set semua sebagai **Protected** (hanya berlaku di protected branch).

### Variables untuk Production Deploy

| Variable | Value | Masked | Keterangan |
|----------|-------|--------|------------|
| `SSH_PRIVATE_KEY_PROD` | Private key SSH untuk VPS prod | Yes | `ssh-keygen -t ed25519` |
| `PROD_USERNAME` | SSH user VPS (mis. `apps`) | No | |
| `PROD_IP` | IP VPS production | No | |
| `PROD_API_URL` | URL API untuk build frontend | No | Mis: `https://api.domain.com/api` |
| `GITLAB_TOKEN` | Token untuk git clone di VPS | Yes | Personal Access Token dengan `read_repository` |

### Variables untuk Development (opsional)

| Variable | Value | Masked | Keterangan |
|----------|-------|--------|------------|
| `SSH_PRIVATE_KEY_DEV` | Private key SSH untuk dev server | Yes | |
| `SSH_KNOWN_HOSTS_DEV` | Output `ssh-keyscan -H <DEV_IP>` | No | |
| `DEV_USERNAME` | SSH user dev server | No | |
| `DEV_IP` | IP dev server | No | |

### Built-in Variables (otomatis dari GitLab)

| Variable | Value | Keterangan |
|----------|-------|------------|
| `$CI_REGISTRY` | `gitlab.vascomm.co.id:4567` | Registry URL |
| `$CI_REGISTRY_IMAGE` | `gitlab.vascomm.co.id:4567/<group>/<project>` | Project image path |
| `$CI_REGISTRY_USER` | `gitlab-ci-token` | Auto username |
| `$CI_REGISTRY_PASSWORD` | Job token | Auto password (valid selama job) |
| `$CI_COMMIT_SHORT_SHA` | Short commit hash | Untuk image tag |
| `$CI_PROJECT_PATH` | `<group>/<project>` | Untuk repo dir di VPS |
| `$CI_SERVER_HOST` | `gitlab.vascomm.co.id` | GitLab host |

---

## 6. VPS Setup Checklist

Prasyarat yang harus ada di VPS production sebelum first deploy:

### Docker & Networks
- [ ] Docker & Docker Compose v2 terinstall
- [ ] `docker network create proxy` (untuk Caddy)
- [ ] `docker network create database` (untuk PostgreSQL)

### Caddy Reverse Proxy
- [ ] Caddy running dengan caddy-docker-proxy image
- [ ] Docker socket mounted ke Caddy (`/var/run/docker.sock:/var/run/docker.sock`)
- [ ] Caddy di network `proxy`
- [ ] Port 80 & 443 terbuka di firewall

**Contoh Caddy docker-compose.yml:**
```yaml
services:
  caddy:
    image: lucaslorentz/caddy-docker-proxy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - proxy

networks:
  proxy:
    external: true

volumes:
  caddy_data:
  caddy_config:
```

**Contoh Caddyfile (global config):**
```
{
    auto_https off
    email admin@sitamoto.ai
}
```

> `auto_https off` berarti semua site harus pakai `http://` prefix di Caddy label.
> Jika ingin auto-HTTPS, hapus `auto_https off` dan hapus `http://` prefix dari labels.

### PostgreSQL
- [ ] PostgreSQL running di network `database`
- [ ] Database untuk project sudah dibuat
- [ ] PostgreSQL container terhubung ke network `database`

### Project Deploy Directory
- [ ] Repo di-clone ke `/home/apps/builds/<group>/<project>`
- [ ] File `.env` dibuat di dalam folder repo
- [ ] `.env` berisi semua variables dengan values yang benar
- [ ] `chmod 600 .env`

### DNS
- [ ] Domain API → VPS IP (jika ada API)
- [ ] Domain Frontend → VPS IP
- [ ] DNS sudah resolve (`dig <domain> +short`)

### GitLab
- [ ] Container Registry di-enable
- [ ] CI/CD Variables ditambahkan
- [ ] Master branch di-protect
- [ ] Runner active & support DinD (privileged)

---

## Quick Reference: Flow CI/CD

```
Developer push ke development branch
    │
    └──► development job (SSH ke dev server, docker compose up --build)

Merge development → master
    │
    ├──► build:backend  (DinD, docker build & push ke GitLab Registry)
    ├──► build:frontend (DinD, docker build & push ke GitLab Registry)
    │        (parallel)
    │
    └──► deploy:production (menunggu build selesai)
              │
              ├── SSH ke VPS production
              ├── git pull (dapatkan docker-compose.prod.yml terbaru)
              ├── docker login ke GitLab Registry
              ├── docker compose pull (pull latest images)
              └── docker compose up -d --force-recreate
```

---

## Quick Reference: Caddy Label Patterns

| Pattern | Kapan Dipakai |
|---------|---------------|
| `caddy: http://<domain>` | HTTP only (`auto_https off` di Caddy) |
| `caddy: <domain>` | HTTPS (Caddy auto-provision TLS, butuh `auto_https on`) |
| `caddy.reverse_proxy: "{{upstreams 3000}}"` | Proxy ke container port 3000 |
| `caddy.reverse_proxy.header_up: "X-Forwarded-Proto https"` | Set header X-Forwarded-Proto |

---

## Quick Reference: Common Ports

| Service | Internal Port |
|---------|---------------|
| Next.js | 3000 |
| Express/Node.js | 3000 |
| Go/Gin | 8080 |
| Python/FastAPI | 8000 |
| nginx (frontend) | 80 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| MySQL | 3306 |
| MongoDB | 27017 |
