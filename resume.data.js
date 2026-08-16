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
      id: "ondemand", nameKo: "온디맨드랩 (매일새옷)", nameEn: "Ondemandlab", role: "마케팅팀 책임 · 브랜딩·콘텐츠·퍼포먼스",
      startDate: "2022-10", endDate: null, logo: "",
      summary: "매일새옷 앱 마케팅 전반(브랜딩·콘텐츠·퍼포먼스) 기획·관리, paid 매체 운영·예산 관리.",
      works: [
        { id: "od-creative", title: "광고소재 제작 (구글 UAC)", category: "콘텐츠", featured: false, startDate: "2022-10", endDate: null,
          summary: "앱 내 트래픽 증가를 위한 구글 UAC 디스플레이·동영상 소재 제작.",
          detail: "디스플레이 소재 + 동영상 소재 제작.", stack: ["Google UAC"], metrics: [],
          links: [{ label: "동영상1", url: "https://youtu.be/HESk1Znuchs" }, { label: "동영상2", url: "https://youtu.be/dTRSxn6_Qec" }, { label: "동영상3", url: "https://youtu.be/Ffdbo_9U7kw" }], media: [] },
        { id: "od-metrics", title: "마케팅 지표 세팅", category: "성과", featured: false, startDate: "2022-10", endDate: null,
          summary: "마케팅 성과 지표 세팅·관리.", detail: "", stack: [], metrics: [], links: [], media: [] }
      ]
    },
    {
      id: "meliz", nameKo: "에이블리블랙 (멜리즈)", nameEn: "MELIZ", role: "퍼포먼스 · 콘텐츠 마케터",
      startDate: "2022-07", endDate: "2022-08", logo: "",
      summary: "멜리즈(MELIZ) 앱 퍼포먼스·콘텐츠 마케팅. 월 5억 예산 운영, 소재 제작, 온드미디어 운영.",
      works: [
        { id: "mz-creative", title: "광고소재 제작", category: "퍼포먼스", featured: true, startDate: "2022-01", endDate: "2022-03",
          summary: "광고 소재(영상·이미지) 제작으로 설치·리텐션 견인. 급상승 순위 1–2위 유지.",
          detail: "모바일인덱스 기준 12~3월 MAU 약 110% 상승, 신규 설치 약 55만 건, Day 리텐션 평균 35% 유지.",
          stack: [], metrics: [{ value: "+110%", label: "MAU 상승" }, { value: "55만", label: "신규 설치" }, { value: "35%", label: "D-리텐션" }], links: [], media: [] },
        { id: "mz-media", title: "매체 운영 및 예산관리", category: "퍼포먼스", featured: true, startDate: "2021-12", endDate: "2022-03",
          summary: "매체별 예산 분배 및 월 5억 예산 소진, 예산 거대화에 따른 CPI 단가 증가 최소화.",
          detail: "성수기-비성수기·평일-주말에 따른 예산 변경·효율 분배. (FBIG/Google Ads/Kakao Moment/Naver GFA/Criteo)",
          stack: ["FBIG", "Google Ads", "Kakao Moment", "GFA", "Criteo"], metrics: [{ value: "5억", label: "월 예산" }], links: [], media: [] },
        { id: "mz-crm", title: "앱 푸시 & 플친 메시지", category: "CRM", featured: false, startDate: "2021-12", endDate: "2022-03",
          summary: "이탈 유저 활성화 온드미디어 운영. 세그별 메시지 차별화·A/B 테스트.",
          detail: "월 평균 약 35만명 앱 유입, 비활성 유저(1주·3주 미접속) 약 6.5만명 재유입, 2개월간 카카오 플친 3만명 달성.",
          stack: [], metrics: [{ value: "35만", label: "월 유입" }, { value: "3만", label: "플친 달성" }], links: [], media: [] }
      ]
    },
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
      id: "waug", nameKo: "와그 (WAUG)", nameEn: "WAUG", role: "마케팅팀 · 퍼포먼스 · 데이터 · 제휴",
      startDate: "2022-10", endDate: "2024-12", logo: "",
      summary: "전사·마케팅 지표와 데이터 파이프라인을 운영하며 퍼포먼스·제휴·커머스 마케팅을 담당.",
      works: [
        { id: "wg-dashboard", title: "전사·마케팅 지표 운영 및 관리", category: "성과", featured: true, startDate: "2022-10", endDate: "2024-12",
          summary: "전사 KPI·매체별 예산-성과 대시보드 구축·운영으로 데이터 기반 의사결정 환경 마련.",
          detail: "MMP 데이터 연동 자동화, 매체별 예산-성과 효율 모니터링.", stack: ["SQL", "Redash", "Metabase"], metrics: [], links: [], media: [] },
        { id: "wg-pipeline", title: "전사 데이터 파이프라인 구축", category: "성과", featured: true, startDate: "2022-10", endDate: "2024-12",
          summary: "외부 API(Redash·Airbridge 등) → 시트 적재 → 로그 관리 자동화 파이프라인 구축.",
          detail: "Apps Script·SQL 기반 예약·매출·재구매 코호트·LTV·퍼널 자동 집계·대시보드화.", stack: ["Apps Script", "SQL", "Airbridge"], metrics: [], links: [], media: [] },
        { id: "wg-attr", title: "어트리뷰션 툴 관리·최적화 (Amplitude·Airbridge)", category: "성과", featured: false, startDate: "2023-06", endDate: "2024-12",
          summary: "이벤트 택소노미·QA, 서비스·마케팅 데이터 퍼널 구축 및 성과 모니터링·분석.",
          detail: "Airbridge–Meta 연동, 구매·뷰 이벤트 구조 설계 및 MMP 데이터 검증.", stack: ["Amplitude", "Airbridge"], metrics: [], links: [], media: [] },
        { id: "wg-budget", title: "전사 마케팅 매체별 예산관리·성과 효율화", category: "퍼포먼스", featured: false, startDate: "2022-10", endDate: "2024-12",
          summary: "매체별 예산 분배·성과 효율 모니터링, 단기 프로모션형 커머스(호텔·여행) 특성에 맞춘 운영 전략.",
          detail: "Meta·Google 광고 운영·최적화, 타겟 확장·CPC 절감 메시지 테스트 주도.", stack: ["Meta Ads", "Google Ads"], metrics: [], links: [], media: [] },
        { id: "wg-video", title: "광고 캠페인 영상 기획·제작", category: "콘텐츠", featured: false, startDate: "2022-10", endDate: "2024-12",
          summary: "광고 소재(영상·이미지) 직접 기획·제작 및 퍼포먼스 개선 실험 병행.",
          detail: "", stack: [], metrics: [], links: [], media: [] },
        { id: "wg-usj", title: "제휴사 세일즈 프로모션 — 와그 × 유니버설스튜디오재팬", category: "제휴", featured: true, startDate: "2023-12", endDate: "2024-12",
          summary: "크로스·업셀링 목적 제휴 캠페인 기획·페이지·소재 제작·운영, 선착순 티켓 목표 대비 조기 소진.",
          detail: "인플루언서 KOLs 마케팅 전개(동네친구 강나미 × WAUG, 샌드박스네트워크 협업), 숏폼 영상 2차 활용.",
          stack: [], metrics: [{ value: "조기소진", label: "선착순 티켓 목표" }], links: [], media: [] },
        { id: "wg-navershop", title: "네이버쇼핑 최적화 운영", category: "커머스", featured: false, startDate: "2024-01", endDate: "2024-12",
          summary: "상품 카테고리·상품명 클린업, 피드 URL 로직·노출 페이지 기획·커스텀 운영.",
          detail: "클린위반 이슈 정상화, 유지·보수 대응 시간 단축.", stack: [], metrics: [], links: [], media: [] }
      ]
    },
    {
      id: "babitalk", nameKo: "바비톡", nameEn: "Babitalk", role: "브랜딩 · 퍼포먼스 · 커머스 마케팅",
      startDate: "2019-04", endDate: "2021-12", logo: "",
      summary: "브랜딩·퍼포먼스·신사업 커머스를 아우르며 인지 확장과 매출을 견인.",
      works: [
        { id: "b-ad-creative", title: "광고소재 제작 및 운영", category: "퍼포먼스", featured: true, startDate: "2019-04", endDate: "2021-12",
          summary: "앱 설치·인지 2track 목표 콘텐츠 제작·매체 부스팅. 모델 박나래 활용 대리수술안심존·1분닥터.",
          detail: "FBIG 앱설치·도달 캠페인, Google Ads UAC·동영상 캠페인 운영.",
          stack: ["FBIG", "Google Ads"], metrics: [],
          links: [{ label: "대리수술안심존(박나래)", url: "https://youtu.be/iPHT8Q3zGqs" }, { label: "안심존 베리에이션", url: "https://youtube.com/shorts/rt0umjN9M9I" }, { label: "슬롯머신 영상", url: "https://youtu.be/--SENDU3YhQ" }, { label: "1분닥터+박나래", url: "https://youtu.be/LXljX4gaSYQ" }, { label: "1분닥터(Narr)", url: "https://youtu.be/DrcYWciILec" }], media: [] },
        { id: "b-purfly", title: "퍼플라이 기부런 캠페인", category: "브랜딩", featured: true, startDate: "2021-04", endDate: "2021-12",
          summary: "기부런 마라톤 참가비로 조성한 기부금 2,000만원 전액 강동경희대병원 전달. 암환우 가발 구입비 지원.",
          detail: "굿즈 기획·배송·재고관리, 영상 촬영·편집, 커뮤니케이션. 인지 확장·긍정 이미지 형성.",
          stack: [], metrics: [{ value: "2천만원", label: "기부금 전달" }],
          links: [{ label: "기사", url: "https://www.insight.co.kr/news/361050" }, { label: "YouTube", url: "https://youtu.be/x_hQDxX6DXo" }], media: [] },
        { id: "b-buzak", title: "부작용 캠페인", category: "브랜딩", featured: true, startDate: "2021-01", endDate: "2021-12",
          summary: "성형 부작용 경험 유저 재건수술 지원 + 사연 콘텐츠화로 위험성 알리는 브랜딩 캠페인. 기획·운영 전반.",
          detail: "워크플로우 구축(사연자 모집–인터뷰–재건지원–콘텐츠 릴리즈). 타 게시물 대비 조회수 약 30%↑, 업로드 후 부작용 조회 우상향.",
          stack: [], metrics: [{ value: "+30%", label: "조회수" }], links: [{ label: "YouTube", url: "https://youtu.be/g1jv4YEiVyA" }], media: [] },
        { id: "b-research", title: "소비자 조사", category: "브랜딩", featured: false, startDate: "2020-01", endDate: "2021-12",
          summary: "경쟁사 대비 인지도·점유율 확인, 브랜딩 정량 지표 확보. 리서치 업체 커뮤니케이션·조사 방향 정립.",
          detail: "경쟁사 대비 선점/부족 비교 데이터, 유저 서비스 이용 퍼널 정성·정량 확인.", stack: [], metrics: [], links: [], media: [] },
        { id: "b-teuga", title: "화장품 특가 (커머스)", category: "커머스", featured: false, startDate: "2020-07", endDate: "2021-06",
          summary: "유저 전용 '바비톡 특가'. 인기 럭셔리 화장품 최대 50% 할인, 2030 여성 회원 타겟.",
          detail: "광고 운영·기획·매입·배송·재고관리·커뮤니케이션.", stack: [], metrics: [{ value: "-50%", label: "명품 최대 할인" }],
          links: [{ label: "에누리 기사", url: "http://www.enuri.com/knowcom/detail.jsp?kbno=1471850" }, { label: "핫딜", url: "https://babitalk.co.kr/post/hotdeal/21apr_1/index.html" }], media: [] },
        { id: "b-galvanic", title: "앱솔브랩 갈바닉 (신사업 커머스)", category: "커머스", featured: true, startDate: "2019-09", endDate: "2020-05",
          summary: "미용기기 커머스 프로젝트. 네이버쇼핑 뷰티 핫딜 1위, 3,000개 재고 킥오프 약 8개월 만에 소진.",
          detail: "메인 판매 페이지 운영, 티몬(10분어택)·위메프(투데이 특가) 특가 진행. 광고 운영·기획·배송·재고관리·소재 제작.",
          stack: [], metrics: [{ value: "1위", label: "네이버쇼핑 핫딜" }, { value: "3,000개", label: "재고 소진(8개월)" }],
          links: [{ label: "스마트스토어", url: "https://smartstore.naver.com/absorb_store/products/4641342424" }], media: [] },
        { id: "b-seburi", title: "뷰티 유튜브 채널 [쎄뷰리] 운영", category: "콘텐츠", featured: false, startDate: "2019-04", endDate: "2019-10",
          summary: "'세상의 모든 뷰티제품 리뷰' 컨셉 채널. 개설 6개월 후 구독 1,000명, 슈렉팩 리뷰 20만뷰.",
          detail: "18–45 여성 타겟. 인기 콘텐츠·상위 검색 키워드 기획으로 리소스 투입 없이 자연유입 유지(일 평균 2,000회).",
          stack: [], metrics: [{ value: "1,000", label: "구독자(6개월)" }, { value: "20만뷰", label: "슈렉팩 리뷰" }],
          links: [{ label: "YouTube 채널", url: "https://www.youtube.com/channel/UCudCgE-s22Q9HmNE9YQV_nw" }], media: [] }
      ]
    },
    {
      id: "redbricks", nameKo: "레드브릭스", nameEn: "Redbricks", role: "영상 PD (기획 · 촬영 · 편집)",
      startDate: "2017-08", endDate: "2019-01", logo: "",
      summary: "클라이언트 영상 기획·촬영·편집. 고객사 만족도 기반 지속 협업·추가 고객사 확보로 매출 기여.",
      works: [
        { id: "r-video", title: "클라이언트 영상 제작", category: "영상", featured: true, startDate: "2017-08", endDate: "2019-01",
          summary: "프로젝트 1~2명 규모에서 촬영·편집 담당. 결과물 만족도 높아 지속 협업·추가 고객사 확보.",
          detail: "고객사 만족도 기반 매출 기여.", stack: [],
          metrics: [], links: [{ label: "대표영상1", url: "https://youtu.be/ezo3h7MCh0Q" }, { label: "대표영상2", url: "https://youtu.be/WnwBU7E0XcM" }, { label: "대표영상3", url: "https://youtu.be/gjPHdd-u144" }, { label: "대표영상4", url: "https://youtu.be/gGRnh8f_Sa8" }, { label: "대표영상5", url: "https://youtu.be/e3dWRs9S_38" }, { label: "대표영상6", url: "https://youtu.be/zZipEQqG4nc" }], media: [] }
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
