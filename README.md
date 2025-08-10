# Backend boiler-plate

TypeScript + Express + Prisma + PostgreSQL + Docker로 구성된 백엔드 보일러플레이트입니다.

## 🚀 빠른 시작

### 1. Docker로 실행 (권장)

```bash
# 빌드 & 실행
docker compose up -d --build

# 헬스체크
curl http://localhost:8000/health
# 응답: {"ok":true}
```

### 2. API 테스트

```bash
# 사용자 생성
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "name":"홍길동"}'

# 사용자 목록 조회
curl http://localhost:8000/users
```

## 🛠️ 개발 환경 설정

### 로컬 개발 (Docker 없이)

```bash
# 환경변수 설정
cp .env.example .env

# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 개발 서버 실행
npm run dev
```

## 📊 Prisma 명령어 가이드

### 기본 명령어

| 명령어 | 설명 | 사용 시점 |
|--------|------|-----------|
| `npx prisma generate` | Prisma 클라이언트 생성/업데이트 | schema.prisma 수정 후 |
| `npx prisma db push` | 스키마를 DB에 직접 반영 | 개발 중 빠른 테스트 |
| `npx prisma migrate dev` | 마이그레이션 생성 및 적용 | 프로덕션 준비용 스키마 변경 |
| `npx prisma studio` | 데이터베이스 GUI 열기 | 데이터 확인/편집 |

### 상황별 사용법

#### 1. 스키마 파일(`schema.prisma`) 수정 후
```bash
# 1단계: 클라이언트 재생성 (필수)
npx prisma generate

# 2단계: 데이터베이스 반영 (둘 중 하나 선택)
# 개발용 (빠름, 히스토리 없음)
npx prisma db push

# 또는 프로덕션용 (마이그레이션 파일 생성)
npx prisma migrate dev --name "설명"
```

#### 2. 새로운 환경에서 프로젝트 시작
```bash
npm install
npx prisma generate
npx prisma migrate deploy  # 또는 npx prisma db push
```

#### 3. Docker 컨테이너에서 스키마 변경 반영
```bash
# 컨테이너 내부에서 실행
docker compose exec api npx prisma db push

# 또는 컨테이너 재시작 (CMD에서 자동 실행됨)
docker compose restart api
```

#### 4. 데이터베이스 초기화
```bash
# 모든 데이터 삭제 후 스키마 재적용
npx prisma migrate reset

# 확인용 GUI 열기
npx prisma studio
```

#### 5. 시드 데이터 관리

시드 데이터를 사용하여 개발 및 테스트용 샘플 데이터를 쉽게 생성할 수 있습니다.

```bash
# 시드 데이터 실행 (기본 10명의 사용자 생성)
npm run seed

# 또는 Prisma 직접 명령어
npm run prisma:seed
```

**주의사항:**
- 시드 실행 시 기존 User 데이터가 모두 삭제됩니다
- 개발 환경에서만 사용하는 것을 권장합니다
- 프로덕션 환경에서는 신중하게 사용하세요

### 마이그레이션 vs DB Push

| `migrate dev` | `db push` |
|---------------|-----------|
| ✅ 마이그레이션 히스토리 보존 | ❌ 히스토리 없음 |
| ✅ 프로덕션 배포 가능 | ❌ 개발용만 |
| ✅ 팀 협업 시 안전 | ✅ 빠른 프로토타이핑 |
| ❌ 속도 느림 | ✅ 속도 빠름 |

## 🗃️ 데이터베이스 스키마

현재 User 모델이 정의되어 있습니다:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🐳 Docker 명령어

```bash
# 서비스 시작
docker compose up -d

# 로그 확인
docker compose logs -f api

# 컨테이너 재시작
docker compose restart api

# 서비스 중지
docker compose down

# 볼륨까지 삭제 (데이터 초기화)
docker compose down -v
```

## 📁 프로젝트 구조

```
backend-boiler-plate/
├── src/
│   ├── app.ts           # Express 앱 설정
│   ├── index.ts         # 서버 진입점
│   ├── lib/prisma.ts    # Prisma 클라이언트
│   └── routes/users.ts  # 사용자 API 라우트
├── prisma/
│   └── schema.prisma    # 데이터베이스 스키마
├── Dockerfile           # API 컨테이너 설정
├── docker-compose.yml   # 전체 서비스 구성
└── package.json         # 의존성 및 스크립트
```

## 🔗 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/health` | 헬스체크 |
| GET | `/users` | 사용자 목록 조회 |
| POST | `/users` | 사용자 생성 |

### 사용자 생성 요청 예시
```json
{
  "email": "user@example.com",
  "name": "사용자명"
}
```

## 🌱 시드 데이터 가이드

### 시드 데이터란?

시드 데이터는 개발 및 테스트를 위해 데이터베이스에 미리 삽입하는 초기 데이터입니다. 이 프로젝트에는 10명의 사용자 샘플 데이터가 포함되어 있습니다.

### 시드 데이터 실행 방법

#### 1. 기본 실행

```bash
# 시드 데이터 실행
npm run seed
```

#### 2. Docker 환경에서 실행

```bash
# Docker 컨테이너가 실행 중일 때
docker compose exec api npm run seed

# 또는 로컬에서 Docker DB에 연결하여 실행
npm run seed
```

#### 3. 데이터베이스 초기화와 함께 실행

```bash
# 모든 데이터 삭제 후 스키마 재적용 + 시드 실행
npx prisma migrate reset
```

### 포함된 시드 데이터

현재 다음 10명의 사용자가 생성됩니다:

| 이름 | 이메일 |
|------|--------|
| 김철수 | john.doe@example.com |
| 이영희 | jane.smith@example.com |
| 박민수 | mike.johnson@example.com |
| 최지연 | sarah.wilson@example.com |
| 정다윗 | david.brown@example.com |
| 김리사 | lisa.kim@example.com |
| 이준호 | tom.lee@example.com |
| 박안나 | anna.park@example.com |
| 최재민 | james.choi@example.com |
| 정엠마 | emma.jung@example.com |

### 시드 데이터 커스터마이징

시드 데이터를 수정하려면 `prisma/seed.ts` 파일을 편집하세요:

```typescript
// prisma/seed.ts
const users = [
  {
    email: 'custom@example.com',
    name: '커스텀 사용자',
  },
  // 더 많은 사용자 추가...
]
```

### 시드 관련 NPM 스크립트

| 스크립트 | 명령어 | 설명 |
|----------|--------|------|
| `npm run seed` | `npm run prisma:seed` | 시드 데이터 실행 |
| `npm run prisma:seed` | `ts-node prisma/seed.ts` | Prisma 시드 직접 실행 |

### 주의사항 및 모범 사례

⚠️ **중요한 주의사항:**
- 시드 실행 시 기존 User 테이블의 모든 데이터가 삭제됩니다
- 프로덕션 환경에서는 절대 실행하지 마세요
- 백업이 필요한 데이터가 있다면 시드 실행 전에 백업하세요

✅ **권장 사용법:**
- 새로운 기능 개발 시 테스트 데이터로 활용
- 팀원들과 동일한 테스트 환경 구성
- 데모 또는 프레젠테이션용 샘플 데이터로 활용
- CI/CD 파이프라인에서 테스트 데이터 구성

### 문제 해결

#### 환경변수 오류
```bash
Error: Environment variable not found: DATABASE_URL
```
**해결방법:** `.env` 파일에 `DATABASE_URL` 설정을 확인하세요.

#### 데이터베이스 연결 오류
```bash
Error: P1001: Can't reach database server
```
**해결방법:** 
1. 데이터베이스가 실행 중인지 확인: `docker compose up -d db`
2. 포트 매핑 확인: `docker-compose.yml`에서 `ports: ["5432:5432"]` 설정 확인

#### TypeScript 컴파일 오류
```bash
Error: Cannot find module '@prisma/client'
```
**해결방법:**
```bash
npm install
npx prisma generate
npm run seed
```


