## MT NestJS Boilerplate

NestJS 10 기반의 실무형 보일러플레이트입니다. TypeORM(PostgreSQL), 환경변수 프로파일링(`.env.local/.env.dev/.env.prod`), 전역 유효성 검사, CORS, 요청 로거 미들웨어, ESLint/Prettier, Jest 테스트 구성을 포함합니다.

### 주요 특징

- **NestJS 10 + TypeScript**: 최신 Nest 생태계 기반
- **TypeORM (PostgreSQL)**: 모듈화된 DB 연결 (`synchronize: false` 기본)
- **환경 변수 프로파일링**: `NODE_ENV` 값에 따라 `.env.{env}` 자동 로드
- **전역 ValidationPipe**: `whitelist`, `forbidNonWhitelisted`, `transform` 활성화
- **CORS 기본 활성화**
- **요청 로깅 미들웨어**: 메서드/URL/상태코드/소요시간/UA/IP 기록
- **코드 품질 도구**: ESLint + Prettier
- **테스트**: Jest 구성 및 커버리지 스크립트
- **PM2 배포 템플릿**: `ecosystem.config.js`

### 기술 스택

- **Runtime**: Node.js (권장 18+)
- **Framework**: NestJS 10
- **DB**: PostgreSQL + TypeORM 0.3
- **Validation**: class-validator, class-transformer
- **Config**: @nestjs/config
- **Testing**: Jest, @nestjs/testing

### 디렉터리 구조

```text
mt-nestjs-boilerplate/
  └─ src/
     ├─ common/
     │  └─ middlewares/request-logger.middleware.ts
     ├─ config/
     │  └─ typeorm.config.ts
     ├─ modules/
     ├─ shared/
     │  └─ entities/
     ├─ app.module.ts
     └─ main.ts
```

### 사전 준비

- Node.js 18+ (LTS 권장)
- Yarn
- PostgreSQL 인스턴스

### 설치

```bash
yarn install
```

### 환경 변수 설정

`NODE_ENV` 에 따라 다음 파일이 자동 로드됩니다.

- `local`(기본): `.env.local`
- `dev`: `.env.dev`
- `prod`: `.env.prod`

필요 변수 예시:

```env
APP_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=app
```

설정 동작은 `src/app.module.ts` 에서 `ConfigModule.forRoot` 로 구성되며, DB 옵션은 `src/config/typeorm.config.ts` 의 `TypeOrmConfigService` 에서 제공합니다. 엔티티는 `src/shared/entities` 하위에 선언하고, 빌드 결과(`dist`) 기준 경로로 매핑됩니다.

### 실행

개발/로컬 실행 시 파일 변경을 감지합니다.

```bash
# 로컬 (NODE_ENV=local)
yarn start

# 개발 (NODE_ENV=dev)
yarn start:dev

# 프로덕션 (NODE_ENV=prod)
yarn build && yarn start:prod
```

서버 포트는 `APP_PORT` 환경 변수로 제어합니다. 기본값은 `3000` 입니다.

### PM2 배포

`ecosystem.config.js` 가 포함되어 있어 PM2로 손쉽게 관리할 수 있습니다.

```bash
# 개발 프로파일로 PM2 실행
pm2 start ecosystem.config.js

# 프로덕션 프로파일로 PM2 실행
pm2 start ecosystem.config.js --env production

# 상태/로그 확인
pm2 status
pm2 logs mt-nestjs-boilerplate
```

### 스크립트 요약

- `yarn build`: 컴파일(`dist` 생성)
- `yarn start`: 로컬 프로파일로 개발 서버 시작(watch)
- `yarn start:dev`: dev 프로파일로 개발 서버 시작(watch)
- `yarn start:debug`: 디버그 모드 + watch
- `yarn start:prod`: 프로덕션 서버 시작(`node dist/main`)
- `yarn lint`: ESLint 검사/자동수정
- `yarn test`: 단위 테스트 실행
- `yarn test:watch`: 테스트 watch
- `yarn test:cov`: 커버리지 수집
- `yarn test:e2e`: e2e 테스트 (별도 설정 필요 시 `test/jest-e2e.json` 참고)

### 유효성 검사 및 보안 기본값

전역 `ValidationPipe` 가 활성화되어 있어 DTO 기반의 엄격한 요청 검증이 수행됩니다.

- `whitelist: true`: DTO에 정의되지 않은 필드 제거
- `forbidNonWhitelisted: true`: 허용되지 않는 필드 포함 시 400 에러
- `transform: true`: 요청 페이로드를 DTO 타입으로 변환

또한 기본 CORS가 활성화되어 있으며, 요청/응답 로그는 `RequestLoggerMiddleware` 가 남깁니다.

### 데이터베이스

- 기본 DB는 PostgreSQL 입니다.
- `synchronize: false` 로 설정되어 있어 런타임 스키마 동기화는 수행하지 않습니다.
- 현재 마이그레이션 스크립트는 포함되어 있지 않습니다. 필요 시 프로젝트 정책에 맞춰 추가하세요.
