# Julian Kim — 프로젝트 포트폴리오

> 핸디즈(Handys) · Plott Life / Urbanstay 프로덕트 · 2026.04 ~ 현재
>
> <!-- TODO(Julian): 한 줄 자기소개를 직접 써주세요. 예: "마케팅 도메인 지식과 프론트엔드 개발을 잇는 그로스 엔지니어" -->

---

## 한눈에 보기

| 프로젝트 | 성격 | 기간 | 역할 | 규모 (본인 기여) |
|---|---|---|---|---|
| **sandbox-mkt** (Life 마케팅 대시보드) | 사내 실운영 웹앱 | 2026.04 ~ 2026.08 | **단독 개발** (기획+개발+운영) | 764커밋 100% · 약 73,000줄 |
| **plott-life-frontend** | 프로덕션 서비스 모노레포 | 2026.04 ~ 2026.07 | 팀 내 기여자 (마케팅/콘텐츠 도메인 담당) | 71커밋 / 전체 2,537커밋 |
| **plott-stay-client** (Urbanstay) | 프로덕션 하이브리드 앱 | 2026.04 ~ | 참여 (온보딩 + 부분 기여) | 2커밋 / 전체 8,660커밋 |

**공통 기술 기반**: TypeScript · Next.js (15/16, App Router & Pages Router) · React (18/19) · Tailwind v4 / Emotion · Supabase(Postgres) · GA4/BigQuery · AI SDK (Anthropic/OpenAI/Google)

---

# 1. sandbox-mkt — Plott Life 마케팅 대시보드

**마케팅팀이 직접 만들어 실운영 중인 사내 마케팅 실무 플랫폼. 기획부터 개발, 데이터 파이프라인, 배포, 운영까지 전 과정 단독 수행.**

- **기간**: 2026.04 ~ 2026.08 (약 4개월, 월 피크 309커밋)
- **역할**: 1인 개발 — 요구사항 정의, 아키텍처 설계, 데이터 파이프라인 구축, UI 구현, 배포/운영 전부
- **출발점**: AI 마케팅 에이전트 + 블로그 자동화 도구 → **KPI·리서치·리드·뉴스레터·광고·모델링까지 20+ 기능 탭의 사내 웹앱으로 성장**, ERP(HQMS) 흡수 로드맵까지 문서화

### 기술 스택

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Recharts · Leaflet · Supabase(Postgres, RLS) · Auth.js v5 + Keycloak SSO · Anthropic/OpenAI/Google GenAI SDK · GitHub Actions → Vercel

### 규모

- `src/` TypeScript **313개 파일 / 약 73,100줄**, App Router 페이지 28개 + API 라우트 41개
- 기능 탭 컴포넌트 51개, 도메인 모듈 31개, **Supabase SQL 마이그레이션 65개**
- Conventional Commits(`feat(scope):`) + PR 405개, `claude/*` 피처 브랜치 60+ (git worktree 병렬 작업)

### 핵심 작업 1 — 데이터 파이프라인 설계 (GA4 · Metabase · Supabase)

사내에 흩어진 데이터 소스를 대시보드 하나로 모으는 4계층 파이프라인을 직접 설계·구축:

1. **Metabase(사내 prod MySQL) → Alert 웹훅 → Supabase Edge Function → 스냅샷 테이블** — 매시 자동 적재. Metabase API로 notification을 직접 생성하고, 질문명 기반 entity 자동 인식 로직 구현
2. **BigQuery GA4 export → 집계 SQL → Edge Function 적재** — `events_*` 와일드카드 + `_TABLE_SUFFIX` 기반 DAU/WAU/MAU 셀프조인, 일별×첫유입 소스별 결제·매출 집계
3. **Metabase 프로덕션 SQL 5종 직접 작성** (raw_listing / raw_host / raw_guest / raw_conversion / raw_view) — MySQL CTE·상관 서브쿼리, 직영/일반 세그먼트를 브랜드 REGEXP 매칭으로 재설계(검증 결과 오탐 0)
4. **PII 보호를 SQL 레벨에서 설계** — SHA2 솔트 해시 키(`host_key`/`guest_key`), 일반 호스트 실명 NULL 처리. 전 테이블 RLS 활성화, service_role 서버 전용 접근

### 핵심 작업 2 — 데이터 품질 이슈 발견 및 보정

- **GA4 purchase 이벤트 중복 발화 발견**: 결제 1건당 정상 + 빈 이벤트(`transaction_id = '(not set)'`) 2회 발화 → 필터 설계로 **831건 → 413건 보정**
- **GA4 `transaction_id` ↔ DB `contract.id` 매칭 전수 검증** (12건 100% 일치) 후, GA4 revenue가 취소 계약을 포함하므로 유효 매출은 DB 계약상태 기준이어야 함을 규칙으로 문서화
- BigQuery intraday 테이블 중복 집계 함정, 네이버 검색광고 UTM 위생 이슈(`medium="4"`) 등을 발견해 매체 분류 룰에 반영
- **운영 장애 직접 진단·해결**: KPI 스냅샷 무제한 select가 114MB로 커져 대시보드 백화 → 엔티티별 최신 1건 조회로 수정

### 핵심 작업 3 — 확장 가능한 탭 아키텍처

- 단일 동적 라우트(`custom/[id]`)가 51개 기능 화면을 렌더링 — **"탭 추가 = 컴포넌트 1개 + 매칭 함수 1개"** 규약으로 신규 기능 추가 비용 최소화
- 사이드바 탭을 DB(`nav_settings`)로 관리, 라벨 키워드 fallback 매칭으로 **비개발자도 탭 생성 가능**
- ERP 통합 시 모듈 레지스트리로 승격 가능하도록 설계 문서화

### 핵심 작업 4 — 외부 연동 & 자동화

- **네이버 검색광고 API**: 전환 성과 대시보드(CAC/CPA/ROAS 일별 적재). 공식 문서 스펙과 다른 AD 리포트 컬럼 구조를 실측으로 확정(14열, 비용=index 11)
- **Meta/Google 동적 리마케팅 카탈로그 피드** 자체 서빙 (`/api/google-catalog/feed`) + 인라인 편집 관리 화면
- **Google Sheets 양방향 동기화**: Apps Script 웹앱으로 화면 수정 → 시트 upsert, 시트 가져오기 시 5단계(신규/보완/충돌/동일/오류) 미리보기 병합
- **Stibee 뉴스레터 실발송 연동** (7개 탭), Slack 회의 캘린더 연동
- 자체 크론 스케줄러(cron-parser + Vercel cron) + 원클릭 전체 파이프라인 실행
- **AI 멀티 프로바이더 추상화**: Anthropic/OpenAI/Google/Vertex를 DB 설정으로 스위칭, 전 실행 로그 기록, AI 에이전트 8종(SEO/카피/퍼포먼스 등) 운영. AI 생성 콘텐츠의 경쟁사 브랜드 누출 자동 검사 스크립트 포함

### 핵심 작업 5 — 보안 설계

1인 개발이지만 사내 프로덕션 데이터를 다루는 만큼 보안을 아키텍처 단계에서 설계:

- **시크릿 제로 노출 원칙**: 모든 API 키·DB 자격증명은 서버 전용. 클라이언트에 노출되는 환경변수는 앱 URL 단 1개. DB/AI 호출은 전부 API 라우트를 경유하고, `import "server-only"`로 민감 모듈의 클라이언트 번들 유입을 빌드 타임에 차단
- **DB 접근 통제**: Supabase 전 테이블 RLS(Row Level Security) 활성화, 공개 정책 없음 — service_role을 통한 서버 전용 접근만 허용
- **PII 보호를 SQL 레벨에서 처리**: 개인 식별 정보는 SHA2 솔트 해시 키로 치환, 일반 호스트 실명은 NULL 처리해 대시보드에 원본 PII가 도달하지 않는 구조
- **인증 위임**: 사내 표준 Keycloak SSO(PKCE)에 통합 — 자체 사용자 DB·비밀번호 저장 없이 JWT 세션으로 처리

### 성과

<!-- TODO(Julian): 정량 성과를 직접 채워주세요. 여기가 포트폴리오에서 가장 힘 있는 부분입니다. 예시:
- 대시보드 사용 인원/팀, 주간 사용 빈도
- 수작업 리포트 작성 시간 절감 (주 N시간 → N분)
- purchase 이벤트 보정으로 마케팅 의사결정에 미친 영향
- 네이버 광고 CAC 개선 등 실제 지표 변화
-->

---

# 2. plott-life-frontend — Plott Life 프론트엔드 모노레포

**장기체류 임대 플랫폼 Plott Life의 프로덕션 모노레포(게스트 web · 호스트 host · 운영 admin 3개 Next.js 앱). 마케팅/콘텐츠/트래킹 도메인을 담당하며 4개월간 71커밋 기여.**

- **기간**: 2026.04 ~ 2026.07 (프로젝트 전체: 2025.09 ~ 진행 중, 2,537커밋 / 기여자 6+명)
- **역할**: 팀 내 기여자 — 블로그 CMS, GA4 트래킹 체계, 네이버 전환추적, SEO, 마케팅 랜딩 담당
- **개발 문화**: `feature/PM-XXX` 브랜치 전략 + 코드리뷰 사이클 (리뷰 반영 커밋 이력 다수)

### 프로젝트 기술 환경

Yarn 4 workspaces + Turborepo · Next.js 16 (App Router) · React 19 · Tailwind v4 · Radix UI · SWR · zod · 토스페이먼츠 · Sendbird · Strapi CMS · Redis 세션 · GCP (Cloud Run + Cloud Build + Terraform IaC) · 5개 언어 i18n 자동 번역 파이프라인

전체 규모: 워크스페이스 10개(앱 3 + 패키지 7), TS/TSX 644파일 · 약 96,000줄, 페이지 113개

### 본인 기여 1 — 블로그 콘텐츠 관리 시스템 구축 (PM-57, 약 25커밋)

웹 노출 + 어드민 편집을 아우르는 블로그 CMS를 처음부터 구축:

- **TipTap 기반 리치 에디터**: 본문 이미지 드래그 리사이즈, 2열/3열 그리드, 커스텀 노드를 React 컴포넌트 + Tailwind JSX로 전환
- 썸네일 업로드를 사내 이미지 API/CDN과 통합, 웹 홈 블로그 섹션 ↔ 어드민 섹션 관리 연동
- **저장소를 4단계로 점진 마이그레이션**: localStorage → IndexedDB → Admin API → Supabase 공유 저장소 (프로토타입 → 프로덕션 승격 과정), 마지막에 Supabase 키를 서버사이드 전용으로 전환해 클라이언트 노출 제거
- 담당 코드 영역: `apps/admin/(auth)/julian/**` 31개 파일 (에디터, AI 콘텐츠 모달, 홈 섹션 매니저, CTA 블록 5종 등)

### 본인 기여 2 — GA4 이벤트 택소노미 관리 도구 (PM-6, 약 10커밋)

- GA4 이벤트 전체 현황을 어드민에서 관리하는 자체 도구 개발 — 출처별 매핑, ON/OFF 토글, 수집화면 모달
- 퍼널별 주요 이벤트 파라미터 보강, 중복 발화 정리 — **트래킹 스펙을 코드와 함께 버전 관리**하는 체계 도입
- `apps/web/lib/ga.ts` / `gtm.ts` 트래킹 레이어 담당

### 본인 기여 3 — 네이버 CTS 전환추적 구현 (PM-84, 9커밋)

- 구현 계획서 + GTM 세팅 가이드 문서화부터 시작해 wcs PV 로더, 게스트 `sign_up`/`purchase`, 호스트 `host_sign_up`/`host_room_register` 전환 발화까지 엔드투엔드 구현
- 스크립트 로딩 순서 이슈로 인한 PV 미수집 버그를 `onLoad` 실행 보장으로 해결

### 본인 기여 4 — SEO & 마케팅 랜딩

- **Schema.org 구조화 데이터** 적용 (RealEstateListing / FAQPage / BreadcrumbList)
- 대학 국제처 제휴 신청 페이지(`/university/partnership`) 신규 개발 — 리뷰 반영으로 직접 DOM 조작 제거·React화·SEO 메타 보강
- 호스트 랜딩 페이지 리뉴얼 (스크롤 트리거 의존 제거로 마퀴 멈춤 버그 해결)

### 성과

<!-- TODO(Julian): 예: 블로그 발행 건수/유입 기여, 네이버 CTS 도입 후 전환 측정 가능해진 광고비 규모, SEO 적용 후 검색 노출 변화 등 -->

---

# 3. plott-stay-client — Urbanstay 하이브리드 앱

**숙박 브랜드 Urbanstay의 고객용 클라이언트 — 웹 + iOS + Android를 하나의 저장소에서 운영하는 WebView 하이브리드 구조. 3년 이상 운영된 대규모 프로덕션 코드베이스(8,660커밋, 기여자 20여 명)에 참여.**

- **기간**: 2026.04 ~ / **역할**: 참여 기여자 (wavve 협업 가이드 페이지 개발 등)
- 참여 프로젝트로서, 아래 아키텍처 설명은 개인 성과가 아닌 **프로젝트 이해도**를 보여주는 맥락입니다

<!-- TODO(Julian): 이 프로젝트에서의 실제 역할을 직접 정리해주세요.
커밋 기록상으로는 wavve-guide 페이지 2건입니다. 만약 커밋 외 기여(AI 협업 문서/워크플로 정비, 기획 협업, 웨이브 제휴 프로젝트 리드 등)가 있다면 그것을 중심으로 쓰는 게 정확합니다.
없다면 "대규모 레거시 코드베이스의 컨벤션을 학습하고 그 규약 안에서 기능을 배포해 본 경험"으로 짧게 가져가는 걸 권장합니다. -->

### 프로젝트 기술 환경

Next.js 15 (Pages Router) · React 18 · Emotion 11 · Zustand + React Query · 토스페이먼츠 위젯 v2 · next-i18next(ko/en) · Sentry · Amplitude/Airbridge · AWS ECR/ECS 배포 · iOS(Swift/WKWebView) + Android(Kotlin) 네이티브 셸

전체 규모: `webview/src` 646파일 · 약 90,700줄, 페이지 132개, 컴포넌트 336개

### 참여하며 학습한 아키텍처 포인트

- **하이브리드 브릿지 설계**: `abstract class NativeService` → Webkit/Android/Browser 3개 구현 (웹에서는 no-op 폴백), 네이티브 콜백의 Promise화 — 30여 종 브릿지 액션(소셜로그인, FCM, 진동, 모바일 도어키 등)
- **멀티 PG 결제 아키텍처**: API 라우트 26개 중 11개가 결제 콜백, 지점(branchId)별 결제 키를 서버에서 동적 조회해 지점마다 다른 PG 계약을 코드 변경 없이 수용
- **IoT 연동**: Airfob Space SDK(BLE) 기반 모바일 도어키
- 외국인 전용 예약 플로우(본인인증 대체 경로), Partytown/Workbox 성능 최적화, Sentry 3-런타임 관측성

### 본인 작업

- `/wavve-guide` 페이지 신규 개발 및 구조 리팩터링 (wavve 제휴 프로젝트) — 대규모 코드베이스의 라우팅/컴포넌트/스타일 컨벤션을 준수하며 배포

---

## 종합 — 이 포트폴리오가 보여주는 것

1. **풀사이클 1인 개발 역량** (sandbox-mkt): 기획 → 데이터 모델링 → SQL/파이프라인 → UI → 배포 → 장애 대응까지 4개월간 단독 수행, 실사용 중인 프로덕트로 유지
2. **데이터 신뢰성에 대한 집요함**: GA4 중복 이벤트 발견·보정, transaction_id 전수 검증, 세그먼트 정의 재설계(오탐 0 검증) — "숫자를 믿을 수 있게 만드는" 작업 반복
3. **마케팅 도메인 × 엔지니어링 교차 역량**: GA4/GTM/네이버 CTS/검색광고 API/카탈로그 피드/UTM — 마케터의 문제를 코드로 해결
4. **팀 개발 프로세스 경험**: 모노레포·브랜치 전략·코드리뷰 사이클 안에서의 기여 (plott-life-frontend), 대규모 레거시 컨벤션 준수 (plott-stay-client)
5. **AI 협업 개발 워크플로**: AI 에이전트 기반 개발(git worktree 병렬 작업, MCP 데이터 소스 연동, 스펙 주도 개발)을 실무에 정착
6. **보안을 기본값으로**: 시크릿 서버 전용 관리, RLS 전면 적용, PII 해시 처리, SSO 위임 — 1인 개발 프로젝트에서도 프로덕션 수준의 보안 대비책을 아키텍처에 내장

<!-- TODO(Julian): 링크 섹션 — 사내 프로젝트라 공개 저장소 링크는 없을 가능성이 높습니다. 배포 URL(사내), 스크린샷, 데모 영상 등 공개 가능한 자료를 확인 후 추가하세요. -->

---

*작성일: 2026-08-09 · 수치는 각 저장소 코드/git 히스토리 실측 기준 (node_modules 등 제외)*
