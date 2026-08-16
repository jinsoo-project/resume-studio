/* =========================================================================
   resume.data.js — 단일 원본 (Single Source of Truth)
   v2: 회사(사업자) 중심 구조. companies[].works[] 가 원본이고,
       experiences / projects 는 맨 아래 deriveFromCompanies()로 자동 파생됩니다.
   ========================================================================= */
window.RESUME = {
  profile: {
    nameKo: "김진수",
    nameEn: "Jinsoo Kim",
    title: "마케팅 × AI 프로덕트 빌더",
    tagline: "마케팅의 문제를 AI와 코드로 푸는 그로스 빌더",
    totalYears: "9년+",
    email: "steadyant@naver.com",
    phone: "010-9214-0450",
    location: "Seoul, KR",
    avatar: "",
    links: [
      { label: "이력서 PDF", url: "김진수_이력서.pdf" }
    ],
    summary:
      "콘텐츠 기획·제작부터 브랜딩 캠페인, 퍼포먼스 마케팅, 커머스까지 인하우스 마케팅 전 과정을 경험한 풀스택 마케터입니다. " +
      "매체·캠페인별 KPI와 목적에 맞춰 성과 지향의 방법론을 분석·적용하며 퍼포먼스 마케팅에 깊게 관여해 왔습니다. " +
      "MCP 활용과 기획을 결합한 AX(AI 전환)로 퍼포먼스 마케팅부터 마케팅 전반의 구조를 이해하고 반복 업무를 자동화하며, " +
      "흩어진 데이터를 직접 집계·자동화하고 성과 대시보드와 AI 마케팅 에이전트를 사내 도구로 구축한 것도 그 일환입니다. " +
      "이렇게 확보한 여력으로 마케팅 본연의 영역에는 더 깊이 파고들고, 마케팅과 맞닿은 분야들과는 더 효과적이고 효율적으로 협업하는 것을 지향합니다. " +
      "목표를 디테일하게 정의하고 ‘더 나은 방법은 없을지’ 끊임없이 고민하며, 숫자를 신뢰할 수 있게 만드는 데이터 기반의 일하기를 추구합니다. " +
      "단기 성과에 그치지 않고 서비스와 구성원이 장기적·안정적으로 성장하는, 더 가치 있는 성과를 만들고자 합니다."
  },

  highlights: [
    { n: "9년+", l: "마케팅 경력" },
    { n: "5억", l: "월 최대 광고예산 운영" },
    { n: "764", l: "단독개발 커밋 (sandbox-mkt)" },
    { n: "AI 8종", l: "멀티프로바이더 에이전트 운영" }
  ],

  ax: [
    { title: "MCP 활용", desc: "MCP로 데이터·툴을 AI에 직접 연결, 마케팅 데이터 조회·분석·실행을 대화형으로 자동화." },
    { title: "성과 대시보드 자동화 (매체 API 연동)", desc: "GA4·BigQuery·네이버 검색광고 등 매체 API를 연결해 광고 성과·매출·퍼널을 자동 집계·대시보드화." },
    { title: "콘텐츠 생성 자동화", desc: "SEO·카피·퍼포먼스 AI 마케팅 에이전트로 콘텐츠 초안 생성·검수를 자동화 (경쟁사 브랜드 누출 자동 검사 포함)." },
    { title: "Spec 주도 · Git 병렬 개발", desc: "가이드라인·스펙 기반으로 AI와 협업, git worktree 병렬 작업으로 여러 기능을 동시에 개발·배포." },
    { title: "멀티 AI 오케스트레이션", desc: "Anthropic·OpenAI·Google·Vertex를 설정으로 스위칭하고 전 실행을 로그로 관리하는 프로바이더 추상화." }
  ],

  /* ===== 회사(사업자) → 작업(works) : 단일 원본 ===== */
  companies: [
    {
      id: "handys",
      name: "핸디즈 (Handys)",
      role: "퍼포먼스 마케팅 매니저 · 마케팅 엔지니어링",
      period: "2025.06 – 현재",
      summary: "Plott Life / Urbanstay 프로덕트의 퍼포먼스 마케팅과, 마케팅 실무를 제품화하는 사내 도구 개발을 병행.",
      works: [
        { id: "w-dashboard", title: "사내 마케팅 성과 대시보드", category: "성과", featured: true, period: "2026",
          summary: "전사 KPI·매체별 예산-성과 지표를 자동 집계·대시보드화, 데이터 기반 의사결정 환경 마련.",
          detail: "GA4(BigQuery)·Metabase 데이터를 Supabase로 자동 적재, 예약·매출·재구매 코호트·LTV·퍼널을 SQL로 자동 집계. 수작업 없이 성과가 갱신되는 구조 확립.",
          metrics: [{ n: "20+", l: "기능 탭" }], stack: ["SQL", "Metabase", "GA4", "Supabase"], links: [], images: [] },
        { id: "w-sandbox", title: "사내 마케팅 운영 자동화 (AI 에이전트)", category: "운영", featured: true, period: "2026.03–08",
          summary: "광고·리드·뉴스레터 운영을 자동화하는 사내 도구 단독 제작, AI 마케팅 에이전트 도입.",
          detail: "SEO·카피·퍼포먼스 AI 에이전트, 멀티 프로바이더 추상화, git worktree 병렬 개발.",
          metrics: [{ n: "764", l: "단독 커밋" }], stack: ["Next.js", "AI SDK", "Vercel"], links: [], images: [] },
        { id: "w-plott", title: "Plott Life 마케팅·콘텐츠 기능", category: "서비스", featured: true, period: "2026.04–07",
          summary: "블로그 콘텐츠 운영(CMS)·SEO·네이버 전환추적 구축.",
          detail: "마케터가 직접 발행하는 블로그 CMS, GA4·GTM 이벤트 체계, 네이버 CTS 전환추적, 구조화 데이터.",
          metrics: [], stack: ["Next.js", "Strapi"], links: [], images: [] },
        { id: "w-wavve", title: "Urbanstay × wavve 제휴 랜딩", category: "제휴", featured: true, period: "2026.04~",
          summary: "wavve 제휴 랜딩페이지 단독 기획·구현, 제휴 캠페인 랜딩 접점 마련.",
          detail: "제휴사 커뮤니케이션·브랜드 톤 반영, 라이브 서비스 컨벤션 준수 배포.",
          metrics: [], stack: [], links: [], images: [] },
        { id: "w-urban-perf", title: "어반스테이 퍼포먼스 마케팅 최적화", category: "퍼포먼스", featured: false, period: "2025.06–2026.03",
          summary: "Meta·Google 광고 운영/최적화, Airbridge–Meta 연동·MMP 검증, 예약·매출·LTV 대시보드화.",
          detail: "", metrics: [], stack: ["Meta Ads", "Airbridge"], links: [], images: [] }
      ]
    },
    {
      id: "babitalk",
      name: "바비톡 (Babitalk)",
      role: "퍼포먼스 · 브랜딩 · 커머스 마케팅",
      period: "2019.06 – 2024.12",
      summary: "월 최대 5억 매체 예산을 운영하며 퍼포먼스·브랜딩·신사업 커머스를 아우름.",
      works: [
        { id: "b-perf-dash", title: "전사·마케팅 성과 대시보드 & 데이터 자동화", category: "성과", featured: true, period: "2022–2024",
          summary: "전사 KPI·매체별 예산-성과 대시보드 구축, MMP 연동 자동화, 코호트·LTV·퍼널 성과 집계.",
          detail: "이벤트 택소노미·QA로 데이터 신뢰도 확보, 매체별 예산-성과 비교로 예산 효율화 의사결정 지원.",
          metrics: [{ n: "5억", l: "월 최대 예산" }], stack: ["Amplitude", "Airbridge", "SQL"], links: [], images: [] },
        { id: "b-purfly", title: "퍼플라이 기부런 캠페인", category: "브랜딩", featured: true, period: "2021",
          summary: "굿즈 기획~판매 A to Z. 판매 3분 만에 1,000개 완판, 2,000만원 기부.",
          detail: "마라톤 굿즈 전액을 암환우에 기부하는 캠페인. 인지 확장·긍정 이미지 형성.",
          metrics: [{ n: "3분", l: "1,000개 완판" }, { n: "2천만원", l: "기부" }],
          stack: [], links: [{ label: "기사", url: "https://www.insight.co.kr/news/361050" }, { label: "YouTube", url: "https://youtu.be/x_hQDxX6DXo" }], images: [] },
        { id: "b-buzak", title: "부작용 알리기 캠페인", category: "브랜딩", featured: false, period: "2021",
          summary: "부작용 위험성을 알리고 유저 재건을 돕는 캠페인. 기획·커뮤니케이션·콘텐츠·운영 A to Z, 서비스 신뢰도 제고.",
          detail: "", metrics: [], stack: [], links: [{ label: "YouTube", url: "https://youtu.be/g1jv4YEiVyA" }], images: [] },
        { id: "b-hada", title: "'바비톡하다' 브랜딩 캠페인", category: "브랜딩", featured: false, period: "2021.04–12",
          summary: "브랜드 캠페인 콘텐츠 아이데이션·제작.",
          detail: "", metrics: [], stack: [],
          links: [{ label: "YouTube 1", url: "https://youtu.be/76CyIN47pMM" }, { label: "YouTube 2", url: "https://youtu.be/qoYLnpZAP-Q" }], images: [] },
        { id: "b-teuga", title: "바비톡 특가 (커머스)", category: "커머스", featured: false, period: "2020.07–2021.06",
          summary: "주1회 특가 총 36회, 매주 단시간 완판·재고 소진, 앱 체류시간·유입 증가.",
          detail: "명품 화장품+타사 제휴 특가.", metrics: [], stack: [],
          links: [{ label: "상세", url: "https://babitalk.co.kr/post/hotdeal/21apr_1/index.html" }], images: [] },
        { id: "b-galvanic", title: "앱솔브랩 갈바닉 (신사업 커머스)", category: "커머스", featured: false, period: "2019.09–2020.05",
          summary: "뷰티기기 커머스 프로젝트, 네이버쇼핑 뷰티 핫딜 1위, 킥오프 8개월 만에 재고 소진.",
          detail: "티몬·위메프 특가 병행.", metrics: [{ n: "1위", l: "네이버쇼핑 핫딜" }], stack: [],
          links: [{ label: "스토어", url: "https://smartstore.naver.com/absorb_store/products/4641342424" }], images: [] },
        { id: "b-wag", title: "와그 × 유니버설스튜디오재팬 제휴 캠페인", category: "제휴", featured: true, period: "2023.12–2024.12",
          summary: "크로스·업셀링 목적 제휴 캠페인 기획·페이지·소재 제작·운영, 선착순 티켓 목표 대비 조기 소진.",
          detail: "인플루언서 KOLs 협업(숏폼 2차 활용).", metrics: [], stack: [], links: [], images: [] },
        { id: "b-navershop", title: "네이버쇼핑 최적화 관리·운영", category: "커머스", featured: false, period: "2024.01–2024.12",
          summary: "상품 카테고리·상품명 클린업, 피드 URL 로직·노출 페이지 기획·커스텀 운영, 클린위반 이슈 정상화.",
          detail: "", metrics: [], stack: [], links: [], images: [] },
        { id: "b-seburi", title: "뷰티 유튜브 채널 [쎄뷰리] 운영", category: "콘텐츠", featured: false, period: "2019.04–2019.10",
          summary: "'세상의 모든 뷰티제품 리뷰' 컨셉 채널 운영, 6개월 만에 구독 1,000명, 일 평균 조회 2,000회 유지.",
          detail: "", metrics: [{ n: "1,000", l: "구독자(6개월)" }], stack: [],
          links: [{ label: "YouTube 채널", url: "https://www.youtube.com/channel/UCudCgE-s22Q9HmNE9YQV_nw" }], images: [] }
      ]
    },
    {
      id: "agency",
      name: "영상 제작 (Agency)",
      role: "기획 · 촬영 · 편집",
      period: "2017.08 – 2019.01",
      summary: "클라이언트 요구에 따른 영상 기획·촬영·편집.",
      works: [
        { id: "a-video", title: "클라이언트 영상 제작", category: "콘텐츠", featured: false, period: "2017–2019",
          summary: "LG Display·다이소·본죽&본도시락·KOTRA 등 클라이언트 영상 기획·제작.",
          detail: "", metrics: [], stack: [], links: [], images: [] }
      ]
    }
  ],

  skills: [
    { group: "마케팅 & 데이터", items: ["Meta / Google Ads", "네이버 검색광고 API", "GA4 · GTM", "BigQuery", "Amplitude · Airbridge", "Metabase · Redash", "UTM 설계"] },
    { group: "프론트엔드", items: ["TypeScript", "Next.js 15/16", "React 18/19", "Tailwind v4 · Emotion", "shadcn/ui · Radix", "Recharts"] },
    { group: "데이터 · AI", items: ["Supabase (Postgres·RLS)", "SQL / Edge Functions", "Anthropic · OpenAI · Google", "AI SDK · MCP", "Vertex AI"] },
    { group: "인프라 · 협업", items: ["Vercel · GitHub Actions", "Auth.js · Keycloak SSO", "git worktree", "Conventional Commits", "모노레포 · 코드리뷰"] }
  ],

  education: [
    { school: "언론정보학과", degree: "학사 졸업", period: "~ 2016" }
  ],

  awards: [
    { title: "연수구 시월애 공모전 — 대상", org: "연수구 홍보영상 공모전", date: "2015.08" },
    { title: "졸업작품전 — 우수상", org: "언론정보학과 (페이크 다큐 출품)", date: "2016.05" },
    { title: "크리노베이션 영상전 — 대상", org: "미디어인재역량강화 프로젝트", date: "2016.09" },
    { title: "방송프로듀서 실무과정 수료", org: "KBS인재개발원", date: "2015.03" }
  ],

  roleTags: ["퍼포먼스 마케팅", "마케팅 데이터 분석", "그로스 엔지니어링", "브랜딩/콘텐츠", "프론트엔드"]
};

/* ===== 회사 → experiences / projects 자동 파생 =====
   companies[].works[] 를 이력서용 배열로 변환. 회사=경력, featured 작업=프로젝트. */
window.deriveFromCompanies = function (R) {
  R.experiences = (R.companies || []).map(function (c) {
    return {
      company: c.name, role: c.role, period: c.period, summary: c.summary,
      bullets: (c.works || []).map(function (w) { return w.summary; }).filter(Boolean),
      tags: []
    };
  });
  R.projects = [];
  (R.companies || []).forEach(function (c) {
    (c.works || []).forEach(function (w) {
      if (w.featured) R.projects.push({
        name: w.title, kind: w.category, period: w.period, role: "",
        desc: w.detail || w.summary, kpis: w.metrics || [], stack: w.stack || [],
        links: w.links || [], images: w.images || []
      });
    });
  });
  return R;
};
window.deriveFromCompanies(window.RESUME);
