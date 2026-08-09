/* =========================================================================
   resume.data.js — 단일 원본 (Single Source of Truth)
   이 파일 하나만 수정하면 index / wanted / remember 세 페이지가 모두 갱신됩니다.
   TODO(진수): [작성필요] 표시된 곳(정량 성과 등)을 채워주세요.
   ========================================================================= */
window.RESUME = {
  profile: {
    nameKo: "김진수",
    nameEn: "Jinsoo Kim",
    title: "마케팅 × AI 프로덕트 빌더",
    tagline: "마케팅의 문제를 AI와 코드로 푸는 그로스 빌더",
    totalYears: "9년+",
    email: "steadyant@naver.com",      // TODO: 공개용 이메일 확정
    phone: "010-9214-0450",            // 이력서(PDF)에만 노출, 웹에서는 숨김
    location: "Seoul, KR",
    avatar: "",                        // 프로필 이미지 URL (또는 업로드) — 스튜디오에서 입력
    links: [
      { label: "이력서 PDF", url: "김진수_이력서.pdf" }
      // TODO: GitHub / LinkedIn / 노션 등 추가 { label:"GitHub", url:"https://..." }
    ],
    // 웹 히어로 & 이력서 상단 소개글 (원티드 후킹 문단)
    summary:
      "8년 이상 퍼포먼스 마케팅을 해오며 매체 운영·데이터 분석·브랜딩 캠페인까지 마케팅 전반을 경험했고, " +
      "지금은 마케팅 실무를 직접 제품으로 만드는 그로스 빌더로 일합니다. " +
      "AI 에이전트·데이터 파이프라인·사내 대시보드를 기획부터 배포까지 단독으로 구축하며, " +
      "‘숫자를 신뢰할 수 있게 만드는’ 데이터 정합성 작업과 마케팅 도메인 지식을 코드로 잇는 일을 잘합니다."
  },

  // 웹 히어로 상단 지표
  highlights: [
    { n: "9년+", l: "마케팅 경력" },
    { n: "5억", l: "월 최대 광고예산 운영" },
    { n: "764", l: "단독개발 커밋 (sandbox-mkt)" },
    { n: "AI 8종", l: "멀티프로바이더 에이전트 운영" }
  ],

  // AX 스토리 카드 (웹 전용)
  ax: [
    {
      title: "AI 에이전트 8종 운영",
      desc: "SEO·카피·퍼포먼스 등 마케팅 에이전트를 실무에 배치. Anthropic/OpenAI/Google/Vertex를 DB 설정으로 스위칭하는 멀티프로바이더 추상화 + 전 실행 로그 기록."
    },
    {
      title: "4계층 데이터 파이프라인",
      desc: "GA4(BigQuery)·Metabase·네이버 광고 API를 Supabase로 모으는 자동 적재 구조를 직접 설계. 매시 스냅샷·PII 해시·RLS까지 SQL 레벨에서 처리."
    },
    {
      title: "데이터를 믿게 만드는 집요함",
      desc: "GA4 purchase 중복 발화 발견·보정(831→413건), transaction_id 전수 검증, 세그먼트 재정의(오탐 0). 숫자를 신뢰할 수 있게 만드는 작업을 반복."
    },
    {
      title: "Spec 주도 AI 협업 개발",
      desc: "git worktree 병렬 작업, MCP 데이터소스 연동, 스펙 주도 개발 워크플로를 실무에 정착. AI 생성 콘텐츠의 경쟁사 브랜드 누출 자동 검사까지."
    }
  ],

  experiences: [
    {
      company: "핸디즈 (Handys)",
      role: "퍼포먼스 마케팅 매니저 · 마케팅 엔지니어링",
      period: "2025.06 – 현재",
      summary: "Plott Life / Urbanstay 프로덕트의 퍼포먼스 마케팅과, 마케팅 실무를 제품화하는 사내 대시보드 개발을 병행.",
      bullets: [
        "Meta·Google 광고 운영/최적화 — 타겟 확장·CPC 절감을 위한 소구/메시지 테스트 주도",
        "Airbridge–Meta 연동, 구매·뷰 이벤트 구조 설계 및 MMP 데이터 검증",
        "Apps Script·SQL(Redash/Metabase)로 예약·매출·재구매 코호트·LTV·퍼널 자동 집계 + 대시보드화",
        "외부 API(Redash·Airbridge) → 시트 적재 → 로그 관리 자동화 파이프라인 구축",
        "사내 마케팅 대시보드 sandbox-mkt를 기획·개발·데이터파이프라인·배포·운영까지 단독 수행"
      ],
      tags: ["Meta/Google Ads", "Airbridge", "GA4/BigQuery", "SQL", "Next.js", "Supabase"]
    },
    {
      company: "바비톡 (Babitalk)",
      role: "퍼포먼스 · 브랜딩 · 커머스 마케팅",
      period: "2019.06 – 2024.12",
      summary: "월 최대 5억 규모 매체 예산을 운영하며 퍼포먼스·브랜딩·신사업 커머스를 아우름.",
      bullets: [
        "월 최대 5억 paid 매체 예산 운영 (Meta/Google/Kakao Moment/NAVER GFA/Criteo/Apple Search Ads)",
        "어트리뷰션(Amplitude·Airbridge) 이벤트 택소노미·QA, 퍼널 구축 및 성과 분석·모니터링",
        "브랜딩 캠페인 기획·제작 (모델 협업, 부작용 알리기·기부런 등) — 굿즈 1,000개 3분 완판, 기부 2,000만원",
        "제휴 세일즈 프로모션(와그×유니버설 스튜디오 재팬 등) 기획·운영, 조기 완판",
        "신사업 커머스(뷰티기기·특가전) A to Z — 네이버쇼핑 핫딜 1위, 재고 소진",
        "대시보드 자동화·매체별 예산-성과 효율화, 숏폼 소재 기획·제작 템플릿화"
      ],
      tags: ["퍼포먼스", "브랜딩", "커머스", "Amplitude", "Airbridge", "네이버쇼핑"]
    },
    {
      company: "영상 제작 (Agency)",
      role: "기획 · 촬영 · 편집",
      period: "2017.08 – 2019.01",
      summary: "클라이언트 요구에 따른 영상 기획·촬영·편집 전반.",
      bullets: [
        "LG Display, 다이소, 본죽&본도시락, KOTRA, 창의재단 등 클라이언트 영상 제작",
        "기획–촬영–편집 전 과정 담당"
      ],
      tags: ["영상기획", "촬영", "편집"]
    }
  ],

  projects: [
    {
      name: "sandbox-mkt",
      kind: "단독 개발",
      period: "2026.04 – 2026.08",
      role: "1인 개발 (기획·개발·데이터·배포·운영)",
      desc:
        "마케팅팀이 직접 만들어 실운영 중인 사내 마케팅 플랫폼. AI 마케팅 에이전트 + 블로그 자동화에서 출발해 " +
        "KPI·리서치·리드·뉴스레터·광고·모델링까지 20+ 기능 탭의 웹앱으로 성장. 전 과정 단독 수행.",
      kpis: [
        { n: "313", l: "TS 파일 · ~73,100줄" },
        { n: "65", l: "Supabase SQL 마이그레이션" },
        { n: "41", l: "API 라우트 · 28 페이지" },
        { n: "405", l: "PR · 60+ 피처 브랜치" }
      ],
      stack: ["Next.js 16 (RSC)", "React 19", "TypeScript", "Tailwind v4", "shadcn/ui", "Supabase(RLS)", "Auth.js + Keycloak SSO", "GA4 / BigQuery", "GenAI SDK", "Vercel"],
      links: []
    },
    {
      name: "plott-life-frontend",
      kind: "팀 기여",
      period: "2026.04 – 2026.07",
      role: "마케팅/콘텐츠/트래킹 도메인 담당 (71커밋)",
      desc:
        "장기체류 임대 플랫폼 Plott Life의 프로덕션 모노레포(게스트·호스트·어드민 3개 앱). " +
        "블로그 CMS 구축, GA4 이벤트 택소노미 도구, 네이버 CTS 전환추적, SEO·마케팅 랜딩을 담당.",
      kpis: [
        { n: "CMS", l: "TipTap 리치에디터 구축" },
        { n: "GA4", l: "트래킹 스펙 코드 버전관리" },
        { n: "CTS", l: "네이버 전환추적 E2E" }
      ],
      stack: ["Turborepo", "Next.js 16", "React 19", "Radix UI", "SWR · zod", "Strapi CMS", "GCP (Cloud Run)", "i18n 5개 언어"],
      links: []
    },
    {
      name: "plott-stay-client · Urbanstay",
      kind: "참여",
      period: "2026.04 – 현재",
      role: "wavve 제휴 가이드 페이지 개발 등",
      desc:
        "숙박 브랜드 Urbanstay의 고객용 클라이언트 — 웹+iOS+Android를 하나의 저장소에서 운영하는 WebView 하이브리드. " +
        "3년+ 운영된 대규모 코드베이스(8,660커밋)에서 컨벤션을 준수하며 신규 페이지를 배포.",
      kpis: [],
      stack: ["Next.js 15 (Pages)", "React 18", "Emotion", "Zustand · React Query", "멀티 PG 결제", "Native Bridge", "AWS ECS"],
      links: []
    }
  ],

  skills: [
    { group: "마케팅 & 데이터", items: ["Meta / Google Ads", "네이버 검색광고 API", "GA4 · GTM", "BigQuery", "Amplitude · Airbridge", "Metabase · Redash", "UTM 설계"] },
    { group: "프론트엔드", items: ["TypeScript", "Next.js 15/16", "React 18/19", "Tailwind v4 · Emotion", "shadcn/ui · Radix", "Recharts"] },
    { group: "데이터 · AI", items: ["Supabase (Postgres·RLS)", "SQL / Edge Functions", "Anthropic · OpenAI · Google", "AI SDK · MCP", "Vertex AI"] },
    { group: "인프라 · 협업", items: ["Vercel · GitHub Actions", "Auth.js · Keycloak SSO", "git worktree", "Conventional Commits", "모노레포 · 코드리뷰"] }
  ],

  education: [
    { school: "언론정보학과", degree: "학사 졸업", period: "~ 2016" } // TODO: 학교명/전공/연도 확정
  ],

  awards: [
    { title: "연수구 시월애 공모전 — 대상", org: "연수구 홍보영상 공모전", date: "2015.08" },
    { title: "졸업작품전 — 우수상", org: "언론정보학과 (페이크 다큐 출품)", date: "2016.05" },
    { title: "크리노베이션 영상전 — 대상", org: "미디어인재역량강화 프로젝트", date: "2016.09" },
    { title: "방송프로듀서 실무과정 수료", org: "KBS인재개발원", date: "2015.03" }
  ]
};
