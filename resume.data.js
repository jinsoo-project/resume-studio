/* =========================================================================
   resume.data.js — 단일 원본 (v3 정규화 모델)
   회사(국문/영문·시작/종료일) → 작업(날짜) → 성과수치/링크/미디어 배열
   AX경험(회사연결)·핵심지표 분리. experiences/projects는 하단에서 자동 파생.
   ========================================================================= */
window.fmtMonth = s => (s ? String(s).slice(0, 7).replace("-", ".") : "");
window.fmtPeriod = (s, e) => { const a = window.fmtMonth(s); const b = e ? window.fmtMonth(e) : "현재"; return a ? (a + " – " + b) : (e ? b : ""); };

window.RESUME = {
  profile: {
    nameKo: "김진수", nameEn: "Jinsoo Kim",
    title: "마케팅 × AI 프로덕트 빌더",
    tagline: "마케팅의 문제를 AI와 코드로 푸는 그로스 빌더",
    email: "steadyant@naver.com", phone: "010-9214-0450", location: "Seoul, KR",
    avatar: "",
    links: [{ label: "이력서 PDF", url: "김진수_이력서.pdf" }],
    summary:
      "콘텐츠 기획·제작부터 브랜딩 캠페인, 퍼포먼스 마케팅, 커머스까지 인하우스 마케팅 전 과정을 경험한 풀스택 마케터입니다. " +
      "매체·캠페인별 KPI와 목적에 맞춰 성과 지향의 방법론을 분석·적용하며 퍼포먼스 마케팅에 깊게 관여해 왔습니다. " +
      "MCP 활용과 기획을 결합한 AX(AI 전환)로 퍼포먼스 마케팅부터 마케팅 전반의 구조를 이해하고 반복 업무를 자동화하며, " +
      "흩어진 데이터를 직접 집계·자동화하고 성과 대시보드와 AI 마케팅 에이전트를 사내 도구로 구축한 것도 그 일환입니다. " +
      "이렇게 확보한 여력으로 마케팅 본연의 영역에는 더 깊이 파고들고, 마케팅과 맞닿은 분야들과는 더 효과적이고 효율적으로 협업하는 것을 지향합니다. " +
      "목표를 디테일하게 정의하고 ‘더 나은 방법은 없을지’ 끊임없이 고민하며, 숫자를 신뢰할 수 있게 만드는 데이터 기반의 일하기를 추구합니다."
  },

  highlights: [
    { value: "9년+", label: "마케팅 경력" },
    { value: "5억", label: "월 최대 광고예산 운영" },
    { value: "764", label: "단독개발 커밋 (sandbox-mkt)" },
    { value: "AI 8종", label: "멀티프로바이더 에이전트 운영" }
  ],

  // AX 경험 — 회사 연결(companyId)
  ax: [
    { companyId: "handys", title: "MCP 활용", description: "MCP로 데이터·툴을 AI에 직접 연결, 마케팅 데이터 조회·분석·실행을 대화형으로 자동화." },
    { companyId: "handys", title: "성과 대시보드 자동화 (매체 API 연동)", description: "GA4·BigQuery·네이버 검색광고 등 매체 API를 연결해 광고 성과·매출·퍼널을 자동 집계·대시보드화." },
    { companyId: "handys", title: "콘텐츠 생성 자동화", description: "SEO·카피·퍼포먼스 AI 마케팅 에이전트로 콘텐츠 초안 생성·검수 자동화 (경쟁사 브랜드 누출 자동 검사 포함)." },
    { companyId: "handys", title: "Spec 주도 · Git 병렬 개발", description: "가이드라인·스펙 기반으로 AI와 협업, git worktree 병렬 작업으로 여러 기능을 동시에 개발·배포." },
    { companyId: "handys", title: "멀티 AI 오케스트레이션", description: "Anthropic·OpenAI·Google·Vertex를 설정으로 스위칭하고 전 실행을 로그로 관리하는 프로바이더 추상화." }
  ],

  companies: [
    {
      id: "handys", nameKo: "핸디즈", nameEn: "Handys", role: "퍼포먼스 마케팅 매니저 · 마케팅 엔지니어링",
      startDate: "2025-06", endDate: null, logo: "",
      summary: "Plott Life / Urbanstay 프로덕트의 퍼포먼스 마케팅과, 마케팅 실무를 제품화하는 사내 도구 개발을 병행.",
      works: [
        { id: "w-dashboard", title: "사내 마케팅 성과 대시보드", category: "성과", featured: true, startDate: "2026-03", endDate: "2026-08",
          summary: "전사 KPI·매체별 예산-성과 지표를 자동 집계·대시보드화, 데이터 기반 의사결정 환경 마련.",
          detail: "GA4(BigQuery)·Metabase 데이터를 Supabase로 자동 적재, 예약·매출·재구매 코호트·LTV·퍼널을 SQL로 자동 집계.",
          stack: ["SQL", "Metabase", "GA4", "Supabase"], metrics: [{ value: "20+", label: "기능 탭" }], links: [], media: [] },
        { id: "w-sandbox", title: "사내 마케팅 운영 자동화 (AI 에이전트)", category: "운영", featured: true, startDate: "2026-03", endDate: "2026-08",
          summary: "광고·리드·뉴스레터 운영을 자동화하는 사내 도구 단독 제작, AI 마케팅 에이전트 도입.",
          detail: "SEO·카피·퍼포먼스 AI 에이전트, 멀티 프로바이더 추상화, git worktree 병렬 개발.",
          stack: ["Next.js", "AI SDK", "Vercel"], metrics: [{ value: "764", label: "단독 커밋" }], links: [], media: [] },
        { id: "w-plott", title: "Plott Life 마케팅·콘텐츠 기능", category: "서비스", featured: true, startDate: "2026-04", endDate: "2026-07",
          summary: "블로그 콘텐츠 운영(CMS)·SEO·네이버 전환추적 구축.",
          detail: "마케터가 직접 발행하는 블로그 CMS, GA4·GTM 이벤트 체계, 네이버 CTS 전환추적, 구조화 데이터.",
          stack: ["Next.js", "Strapi"], metrics: [], links: [], media: [] },
        { id: "w-wavve", title: "Urbanstay × wavve 제휴 랜딩", category: "제휴", featured: true, startDate: "2026-04", endDate: null,
          summary: "wavve 제휴 랜딩페이지 단독 기획·구현, 제휴 캠페인 랜딩 접점 마련.",
          detail: "제휴사 커뮤니케이션·브랜드 톤 반영, 라이브 서비스 컨벤션 준수 배포.",
          stack: [], metrics: [], links: [], media: [] },
        { id: "w-urban-perf", title: "어반스테이 퍼포먼스 마케팅 최적화", category: "퍼포먼스", featured: false, startDate: "2025-06", endDate: "2026-03",
          summary: "Meta·Google 광고 운영/최적화, Airbridge–Meta 연동·MMP 검증, 예약·매출·LTV 대시보드화.",
          detail: "", stack: ["Meta Ads", "Airbridge"], metrics: [], links: [], media: [] }
      ]
    },
    {
      id: "babitalk", nameKo: "바비톡", nameEn: "Babitalk", role: "퍼포먼스 · 브랜딩 · 커머스 마케팅",
      startDate: "2019-06", endDate: "2024-12", logo: "",
      summary: "월 최대 5억 매체 예산을 운영하며 퍼포먼스·브랜딩·신사업 커머스를 아우름.",
      works: [
        { id: "b-perf-dash", title: "전사·마케팅 성과 대시보드 & 데이터 자동화", category: "성과", featured: true, startDate: "2022-10", endDate: "2024-12",
          summary: "전사 KPI·매체별 예산-성과 대시보드 구축, MMP 연동 자동화, 코호트·LTV·퍼널 성과 집계.",
          detail: "이벤트 택소노미·QA로 데이터 신뢰도 확보, 매체별 예산-성과 비교로 예산 효율화 의사결정 지원.",
          stack: ["Amplitude", "Airbridge", "SQL"], metrics: [{ value: "5억", label: "월 최대 예산" }], links: [], media: [] },
        { id: "b-selfserve", title: "Self-serve 매체 광고 운영·A/B·성과 효율화", category: "퍼포먼스", featured: false, startDate: "2022-10", endDate: "2024-12",
          summary: "메타·구글 캠페인 기획·제작(DA 영상/이미지), 설치·전환 목적 숏폼 제작, CPI·인앱 이벤트 개선, 제작 템플릿화.",
          detail: "성과 테스팅 > 템플릿화로 소재 업데이트·제작 리소스 개선.", stack: ["Meta Ads", "Google Ads"], metrics: [], links: [], media: [] },
        { id: "b-attr", title: "어트리뷰션 툴 관리·최적화 (Amplitude·Airbridge)", category: "성과", featured: false, startDate: "2023-06", endDate: "2024-12",
          summary: "이벤트 택소노미·QA, 주요 서비스·마케팅 데이터 퍼널 구축 및 성과 모니터링·분석 실행.",
          detail: "", stack: ["Amplitude", "Airbridge"], metrics: [], links: [], media: [] },
        { id: "b-wag", title: "와그 × 유니버설스튜디오재팬 제휴 캠페인", category: "제휴", featured: true, startDate: "2023-12", endDate: "2024-12",
          summary: "크로스·업셀링 목적 제휴 캠페인 기획·페이지·소재 제작·운영, 선착순 티켓 목표 대비 조기 소진. KOLs 협업.",
          detail: "숏폼 영상 2차 활용.", stack: [], metrics: [], links: [], media: [] },
        { id: "b-navershop", title: "네이버쇼핑 최적화 관리·운영", category: "커머스", featured: false, startDate: "2024-01", endDate: "2024-12",
          summary: "상품 카테고리·상품명 클린업, 피드 URL 로직·노출 페이지 기획·커스텀 운영, 클린위반 이슈 정상화.",
          detail: "", stack: [], metrics: [], links: [], media: [] },
        { id: "b-paid5", title: "월 5억 매체 예산 운영·통합 광고관리", category: "퍼포먼스", featured: true, startDate: "2021-12", endDate: "2022-03",
          summary: "FBIG·Google·Kakao Moment·NAVER GFA·Criteo·Apple Search Ads 통합 운영, 트래킹 툴 기반 매체별 효율 측정.",
          detail: "에어브릿지·앰플리튜드로 효율 측정.", stack: ["Airbridge", "Amplitude"], metrics: [{ value: "5억", label: "월 최대 예산" }], links: [], media: [] },
        { id: "b-content", title: "퍼포먼스 콘텐츠 기획·제작", category: "콘텐츠", featured: false, startDate: "2021-12", endDate: "2022-03",
          summary: "설치·클릭 유도 퍼포먼스형 콘텐츠(이미지·카탈로그·영상) 제작으로 앱 트래픽 증가·예산 효율화.",
          detail: "", stack: [], metrics: [], links: [], media: [] },
        { id: "b-crm", title: "앱푸시 + 카카오 플친 온드매체 운영", category: "CRM", featured: false, startDate: "2021-12", endDate: "2022-03",
          summary: "리타겟팅 목적 앱푸시·플친 운영, 신규/활성/비활성 유저별 메시지 차별화로 앱 유입 최대화.",
          detail: "", stack: [], metrics: [], links: [], media: [] },
        { id: "b-seo", title: "구글 SEO", category: "SEO", featured: false, startDate: "2022-02", endDate: "2022-03",
          summary: "구글 트래픽 확보를 위한 앱 내 상품 키워드별 구글 노출 작업.",
          detail: "", stack: [], metrics: [], links: [], media: [] },
        { id: "b-babitalk-perf", title: "바비톡 퍼포먼스 콘텐츠·광고 운영", category: "콘텐츠", featured: true, startDate: "2019-06", endDate: "2021-12",
          summary: "모델 '박나래' 활용 콘텐츠 A to Z(아이데이션·제작·집행·운영). 대리수술 안심존·부작용 위험성·1분닥터 인지 콘텐츠.",
          detail: "이미지·카탈로그·영상 다수, 애드저스트·앰플리튜드 효율 측정.", stack: ["Adjust", "Amplitude"], metrics: [],
          links: [{ label: "안심존 ver1", url: "https://youtu.be/itJn_03fUHg" }, { label: "안심존 ver2", url: "https://www.youtube.com/watch?v=V9QOrhaaTrw" }, { label: "부작용 위험성", url: "https://youtu.be/_l1UqZLJToc" }, { label: "1분닥터", url: "https://youtu.be/Sra_bglQYvo" }], media: [] },
        { id: "b-hada", title: "'바비톡하다' 브랜딩 캠페인", category: "브랜딩", featured: false, startDate: "2021-04", endDate: "2021-12",
          summary: "브랜드 캠페인 콘텐츠 아이데이션·제작.", detail: "", stack: [], metrics: [],
          links: [{ label: "YouTube 1", url: "https://youtu.be/76CyIN47pMM" }, { label: "YouTube 2", url: "https://youtu.be/qoYLnpZAP-Q" }], media: [] },
        { id: "b-purfly", title: "퍼플라이 기부런 캠페인", category: "브랜딩", featured: true, startDate: "2021-04", endDate: "2021-12",
          summary: "굿즈 기획~판매 A to Z. 판매 3분 만에 1,000개 완판, 2,000만원 강동경희대병원 기부.",
          detail: "마라톤 굿즈 전액 암환우 기부. 모델 김민경 콘텐츠. 인지 확장·긍정 이미지 형성.",
          stack: [], metrics: [{ value: "3분", label: "1,000개 완판" }, { value: "2천만원", label: "기부" }],
          links: [{ label: "기사", url: "https://www.insight.co.kr/news/361050" }, { label: "YouTube", url: "https://youtu.be/x_hQDxX6DXo" }], media: [] },
        { id: "b-buzak", title: "부작용 알리기 캠페인", category: "브랜딩", featured: false, startDate: "2021-01", endDate: "2021-12",
          summary: "부작용 위험성을 알리고 유저 재건을 돕는 캠페인. 기획·커뮤니케이션·콘텐츠·운영 A to Z, 서비스 신뢰도 제고.",
          detail: "", stack: [], metrics: [], links: [{ label: "YouTube", url: "https://youtu.be/g1jv4YEiVyA" }], media: [] },
        { id: "b-teuga", title: "바비톡 특가 (커머스)", category: "커머스", featured: false, startDate: "2020-07", endDate: "2021-06",
          summary: "명품 화장품+타사 제휴 특가, 주1회 총 36회, 매주 단시간 완판·재고 소진, 앱 체류시간·유입 증가.",
          detail: "", stack: [], metrics: [{ value: "36회", label: "매주 완판" }],
          links: [{ label: "상세", url: "https://babitalk.co.kr/post/hotdeal/21apr_1/index.html" }], media: [] },
        { id: "b-galvanic", title: "앱솔브랩 갈바닉 (신사업 커머스)", category: "커머스", featured: true, startDate: "2019-09", endDate: "2020-05",
          summary: "뷰티기기 커머스 프로젝트, 네이버쇼핑 뷰티 핫딜 1위, 킥오프 8개월 만에 재고 소진. 티몬·위메프 특가 병행.",
          detail: "", stack: [], metrics: [{ value: "1위", label: "네이버쇼핑 핫딜" }],
          links: [{ label: "스토어", url: "https://smartstore.naver.com/absorb_store/products/4641342424" }], media: [] },
        { id: "b-seburi", title: "뷰티 유튜브 채널 [쎄뷰리] 운영", category: "콘텐츠", featured: false, startDate: "2019-04", endDate: "2019-10",
          summary: "'세상의 모든 뷰티제품 리뷰' 컨셉 채널 운영, 6개월 만에 구독 1,000명, 일 평균 조회 2,000회 유지.",
          detail: "인기 콘텐츠·상위 검색 키워드 위주 기획으로 리소스 투입 없이 자연유입 유지.", stack: [], metrics: [{ value: "1,000", label: "구독자(6개월)" }],
          links: [{ label: "YouTube 채널", url: "https://www.youtube.com/channel/UCudCgE-s22Q9HmNE9YQV_nw" }], media: [] },
        { id: "b-dating", title: "소개팅앱(당연시·스윗미·사랑애) 콘텐츠 제작", category: "콘텐츠", featured: false, startDate: "2019-04", endDate: "2019-08",
          summary: "앱 트래픽 증가 목적 설치·클릭 유도 퍼포먼스형 콘텐츠(이미지·카탈로그·영상) 제작, 매체별 효율 측정.",
          detail: "", stack: ["Adjust", "Amplitude"], metrics: [], links: [], media: [] }
      ]
    },
    {
      id: "agency", nameKo: "영상 제작", nameEn: "Agency", role: "기획 · 촬영 · 편집",
      startDate: "2017-08", endDate: "2019-01", logo: "",
      summary: "클라이언트 요구에 따른 영상 기획·촬영·편집.",
      works: [
        { id: "a-video", title: "클라이언트 영상 제작", category: "콘텐츠", featured: false, startDate: "2017-08", endDate: "2019-01",
          summary: "LG Display·다이소·본죽&본도시락·KOTRA 등 클라이언트 영상 기획·제작.",
          detail: "", stack: [], metrics: [], links: [], media: [] }
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
    { school: "언론정보학과", degree: "학사 졸업", field: "언론정보", startDate: "", endDate: "2016-02" }
  ],
  awards: [
    { title: "연수구 시월애 공모전 — 대상", org: "연수구 홍보영상 공모전", date: "2015-08" },
    { title: "졸업작품전 — 우수상", org: "언론정보학과 (페이크 다큐 출품)", date: "2016-05" },
    { title: "크리노베이션 영상전 — 대상", org: "미디어인재역량강화 프로젝트", date: "2016-09" },
    { title: "방송프로듀서 실무과정 수료", org: "KBS인재개발원", date: "2015-03" }
  ],
  roleTags: ["퍼포먼스 마케팅", "마케팅 데이터 분석", "그로스 엔지니어링", "브랜딩/콘텐츠", "프론트엔드"]
};

/* ===== 회사 → experiences / projects 자동 파생 (템플릿용) ===== */
window.deriveFromCompanies = function (R) {
  const per = window.fmtPeriod;
  R.experiences = (R.companies || []).map(c => ({
    company: c.nameKo || c.nameEn || "", role: c.role, period: per(c.startDate, c.endDate), summary: c.summary,
    bullets: (c.works || []).map(w => w.summary).filter(Boolean), tags: []
  }));
  R.projects = [];
  (R.companies || []).forEach(c => (c.works || []).forEach(w => {
    if (w.featured) R.projects.push({
      name: w.title, kind: w.category, period: per(w.startDate, w.endDate), role: "",
      desc: w.detail || w.summary,
      kpis: (w.metrics || []).map(m => ({ n: m.value, l: m.label })),
      stack: w.stack || [], links: w.links || [],
      images: (w.media || []).filter(m => m.type === "image").map(m => m.url),
      cover: w.cover || ""
    });
  }));
  return R;
};
window.deriveFromCompanies(window.RESUME);
