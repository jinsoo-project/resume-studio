/* =========================================================================
   resume-manage.js — 이력서 관리 탭용 (제공 양식 그대로 + 영문 번역본)
   window.RESUME_DOC = { css, ko, en } — studio가 iframe srcdoc으로 렌더/편집/인쇄
   ========================================================================= */
window.RESUME_DOC = {
  css: `
  :root{ --ink:#1a1a1a; --sub:#6b7280; --line:#e5e7eb; --accent:#2d3748; --chip:#f3f4f6; --maxw:820px; }
  *{box-sizing:border-box;}
  body{ margin:0; background:#f7f7f8; color:var(--ink);
    font-family:"Pretendard","Apple SD Gothic Neo","Malgun Gothic",system-ui,-apple-system,sans-serif;
    line-height:1.65; -webkit-font-smoothing:antialiased; }
  .page{max-width:var(--maxw); margin:32px auto; background:#fff; padding:56px 60px;
    border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,.06),0 10px 30px rgba(0,0,0,.04);}
  header.resume-head{border-bottom:2px solid var(--ink); padding-bottom:20px; margin-bottom:32px;}
  header.resume-head h1{font-size:34px; margin:0 0 8px; letter-spacing:-.5px;}
  header.resume-head .contact{color:var(--sub); font-size:14px;}
  header.resume-head .contact span{margin-right:14px;}
  section{margin-bottom:38px;}
  h2.sec{font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
    color:var(--accent); border-bottom:1px solid var(--line); padding-bottom:8px; margin:0 0 18px;}
  .intro p{margin:0 0 14px; font-size:15px; color:#333;}
  .note{color:var(--sub); font-size:13px; border-left:3px solid var(--line); padding:2px 0 2px 12px; margin:16px 0;}
  .ax-list{margin:14px 0 0; padding-left:20px;}
  .ax-list li{margin-bottom:8px; font-size:14.5px;}
  .job{margin-bottom:28px;}
  .job-head{display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:4px;}
  .job-head .co{font-size:18px; font-weight:700;}
  .applogo{width:24px; height:24px; border-radius:6px; vertical-align:-6px; margin-right:9px; object-fit:cover; border:1px solid #ececec; display:inline-block; background:#fff;}
  .job-head .role{color:var(--sub); font-weight:500; font-size:14px; margin-left:8px;}
  .job-head .period{color:var(--sub); font-size:13.5px; white-space:nowrap;}
  .proj{margin:16px 0 0; padding-left:2px;}
  .proj .pj-title{font-weight:600; font-size:15px; margin-bottom:2px;}
  .proj .pj-period{color:var(--sub); font-size:12.5px; margin-bottom:6px;}
  .proj ul{margin:6px 0 0; padding-left:18px;}
  .proj ul li{margin-bottom:5px; font-size:14px; color:#333;}
  .proj p.lead{margin:6px 0; font-size:14px; color:#333;}
  .edu .co{font-size:17px; font-weight:700;}
  .awards li{margin-bottom:8px; font-size:14px;}
  .awards b{font-weight:600;}
  .awards .yr{color:var(--sub); font-size:12.5px; margin-left:4px;}
  .skills{display:flex; flex-wrap:wrap; gap:8px;}
  .skills .chip{background:var(--chip); border-radius:999px; padding:5px 12px; font-size:13px; color:#374151;}
  .links a{color:#2563eb; text-decoration:none; font-size:14px; word-break:break-all;}
  .links li{margin-bottom:6px;}
  .links .lbl{font-weight:600; color:var(--ink); margin-right:6px;}
  body{outline:none}
  [contenteditable]:focus{outline:2px solid #93c5fd; outline-offset:2px; border-radius:3px}
  @media print{ body{background:#fff;} .page{box-shadow:none; margin:0; max-width:100%; border-radius:0;}
    [contenteditable]:focus{outline:none} }
  @media(max-width:640px){ .page{padding:32px 22px; margin:0;} header.resume-head h1{font-size:28px;} }
  `,

  ko: `<div class="page">
  <header class="resume-head">
    <h1>김진수</h1>
    <div class="contact"><span>010.9214.0450</span><span>steadyant@naver.com</span></div>
  </header>
  <section class="intro">
    <h2 class="sec">간단 소개</h2>
    <p>안녕하세요. 김진수입니다.</p>
    <p>콘텐츠 기획·제작부터 브랜딩 캠페인, 퍼포먼스 마케팅, 커머스까지 인하우스 마케팅 전 과정을 경험한 풀스택 마케터입니다.</p>
    <p>매체·캠페인별 KPI와 목적에 맞춰 성과 지향의 방법론을 분석·적용하며 퍼포먼스 마케팅에 깊게 관여해 왔습니다.</p>
    <p>MCP 활용과 기획을 결합한 AX(AI 전환)로 퍼포먼스 마케팅부터 마케팅 전반의 반복 업무 및 흩어진 데이터의 집계 자동화를 통한 성과 대시보드와 AI 마케팅 에이전트를 사내 도구로 구축한 것도 그 일환입니다.</p>
    <p>이렇게 확보한 여력으로 마케팅 본연의 영역에는 더 깊이 파고들고, 마케팅과 맞닿은 분야들과는 더 효과적이고 효율적으로 협업하는 것을 지향합니다. 목표를 디테일하게 정의하고 '더 나은 방법은 없을지' 끊임없이 고민하며, 숫자를 신뢰할 수 있게 만드는 데이터 기반의 일하기를 추구합니다.</p>
    <p>감사합니다.</p>
    <div class="pj-title" style="font-weight:700;margin-top:20px;">[AX 경험]</div>
    <ol class="ax-list">
      <li><b>MCP 활용</b> — 에어브릿지 MCP, 메타 등 MCP로 데이터·툴을 AI에 직접 연결하여 마케팅 데이터 조회·분석·실행까지 자동화 사이클링</li>
      <li><b>성과 대시보드 자동화 (매체 API 연동)</b> — Airbridge부터 메타, 네이버 검색광고·Google Ads 등 API를 연결해 광고 성과·매출·퍼널을 자동 집계·대시보드화</li>
      <li><b>콘텐츠 생성 자동화</b> — SEO·카피·퍼포먼스 AI 마케팅 에이전트로 콘텐츠 초안 생성·검수 자동화 (경쟁사 브랜드 누출 자동 검사 포함)</li>
      <li><b>Spec 주도 · Git 병렬 개발</b> — 가이드라인·스펙 기반으로 AI와 협업, git worktree 병렬 작업으로 여러 기능 동시 개발·배포</li>
      <li><b>멀티 AI 활용</b> — Anthropic·OpenAI·Google·Vertex를 설정으로 스위칭하고 전 실행을 로그로 관리하는 프로바이더 추상화</li>
    </ol>
  </section>
  <section class="careers">
    <h2 class="sec">경력 · 8년 7개월</h2>
    <div class="job">
      <div class="job-head"><div><span class="co">핸디즈</span><span class="role">마케팅&amp;기획 · LEAD</span></div><div class="period">2025.06 – 재직 중 (1년 3개월) · 정규직</div></div>
      <div class="proj"><div class="pj-title">플라트라이프 AX 마케팅&amp;기획 도입 및 구체화</div><div class="pj-period">2026.03 – 2026.08</div>
        <p class="lead">① 사내 마케팅 실무 대시보드 · 단독 기획·운영</p>
        <ul><li>흩어져 있던 마케팅 데이터(GA4·광고 성과·매출·KPI)를 한 화면에 통합, 데이터 기반 의사결정 환경 마련. 요구사항 정의부터 운영까지 단독 수행, 수작업 리포트 자동화. SEO·카피·퍼포먼스 AI 마케팅 에이전트와 광고·리드·뉴스레터 운영 기능을 포함한 20+ 기능 실무 도구 구축.</li></ul>
        <p class="lead">② Plott Life 마케팅·콘텐츠 운영 · 마케팅 도메인 담당</p>
        <ul><li>마케터가 개발 도움 없이 직접 콘텐츠를 발행·관리하는 블로그 운영 체계(CMS) 구축. GA4·GTM 이벤트 체계와 네이버 전환추적 설계로 광고 성과·사용자 퍼널 측정 기반 마련. SEO·구조화 데이터 적용으로 검색 유입 기반 확보.</li></ul>
        <p class="lead">③ Urbanstay × wavve 제휴 협업 · 제휴 랜딩 단독 구현</p>
        <ul><li>제휴 마케팅 프로젝트에서 협업 가이드·랜딩페이지 단독 기획·구현. 제휴사 커뮤니케이션과 브랜드 톤·서비스 정책 반영. 라이브 서비스 흐름·컨벤션을 준수한 안정적 페이지 배포.</li></ul>
      </div>
      <div class="proj"><div class="pj-title">어반스테이 앱서비스 세일즈 퍼포먼스 마케팅 최적화 <span class="role">· 퍼포먼스 마케팅 · 매니져</span></div><div class="pj-period">2025.06 – 2026.03</div>
        <ul><li>Meta·Google 광고 운영 및 최적화, 타겟 확장과 CPC 절감을 위한 메시지/소구 테스트 주도</li><li>Airbridge–Meta 연동, 구매·뷰 이벤트 구조 설계 및 MMP 데이터 검증</li><li>Apps Script·SQL(Redash/Metabase) 기반 예약·매출·재구매 코호트·LTV·퍼널 자동 집계·대시보드화</li><li>외부 API(Redash, Airbridge 등) → 시트 적재 → 로그 관리 자동화 파이프라인 구축</li><li>단기 프로모션형 커머스(호텔·여행) 특성에 맞춘 성과 분석·운영 전략 설계</li><li>광고 소재(영상/이미지) 직접 제작 및 퍼포먼스 개선 실험 병행</li></ul>
      </div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">와그(WAUG)</span><span class="role">퍼포먼스 마케팅</span></div><div class="period">2022.10 – 2025.05 (2년 8개월) · 정규직</div></div>
      <div class="proj"><div class="pj-title">전사&amp;마케팅 지표 운영 및 관리</div><div class="pj-period">2022.10 – 2024.12</div><ul><li>전사 KPI &amp; 마케팅 지표 관련 대시보드 구축</li><li>DB 데이터 연동 및 자동화 업데이트 세팅</li></ul></div>
      <div class="proj"><div class="pj-title">마케팅 매체별 예산관리 및 성과 효율화</div><div class="pj-period">2022.10 – 2024.12</div><ul><li>마케팅&amp;매체별 대시보드 통한 예산-성과 효율 모니터링</li><li>MMP 데이터 연동을 통한 자동화 세팅 및 성과·리소스 효율화</li></ul></div>
      <div class="proj"><div class="pj-title">Self-serve 광고 집행 및 운영 : A/B테스트 + 성과 효율화</div><div class="pj-period">2022.10 – 2024.12</div><ul><li>메타-구글 광고 캠페인 기획 및 제작 (DA소재 - 영상/이미지)</li><li>타겟 및 설치/전환 목적에 따른 숏폼 기획&amp;제작</li><li>평균 CPI 및 인앱 이벤트 지표 개선</li><li>성과테스팅 → 제작 템플릿화로 소재 업데이트·제작 리소스 개선</li><li>월 최대 1억 예산 운영, 리포트 자동화를 통한 성과 효율화</li></ul></div>
      <div class="proj"><div class="pj-title">어트리뷰션 툴 관리 및 최적화 운영 (Amplitude, Airbridge)</div><div class="pj-period">2023.06 – 2024.12</div><ul><li>이벤트 텍소노미 및 QA 진행</li><li>주요 서비스 &amp; 마케팅 데이터 퍼널 구축 및 성과 모니터링·분석</li></ul></div>
      <div class="proj"><div class="pj-title">제휴사 세일즈 프로모션 기획 및 전개</div><div class="pj-period">2023.12 – 2024.12</div><ul><li>와그 l 유니버셜 스튜디오 재팬 협업 캠페인 전개</li><li>크로스&amp;업 셀링 목적의 기획 - 페이지&amp;광고소재 제작 - 운영</li><li>선착순 티켓수량 목표 대비 조기 소진</li><li>인플루언서 협업을 통한 KOLs 마케팅 (숏폼영상 2차활용)</li></ul></div>
      <div class="proj"><div class="pj-title">네이버쇼핑 최적화 관리 및 운영</div><div class="pj-period">2024.01 – 2024.12</div><ul><li>상품 카테고리 및 상품명 클린업 작업</li><li>피드 URL 로직 및 노출 페이지 기획·커스텀 운영</li><li>유지·보수 대응시간 단축, 클린위반 이슈 정상화</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">온디맨드랩</span><span class="role">퍼포먼스 마케터 · 매니저</span></div><div class="period">2022.07 – 2022.08 (2개월) · 정규직</div></div>
      <div class="proj"><div class="pj-title">self-serve 매체 광고집행 및 예산 운영·관리</div><div class="pj-period">2022.07 – 2022.08</div><ul><li>구글애즈 UAC 캠페인 / 애플서치애드 집행</li></ul></div>
      <div class="proj"><div class="pj-title">매체 광고를 위한 콘텐츠 제작 및 집행</div><div class="pj-period">2022.07 – 2022.08</div><ul><li>이미지 / 동영상 광고 제작</li></ul></div>
      <div class="proj"><div class="pj-title">성과 분석을 위한 마케팅 지표 작업</div><div class="pj-period">2022.07 – 2022.08</div><ul><li>자동화 대시보드 세팅</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">에이블리블랙</span></div><div class="period">2021.12 – 2022.03 (4개월) · 정규직</div></div>
      <div class="proj"><div class="pj-title">self-serve 매체 광고 집행 및 운영</div><div class="pj-period">2021.12 – 2022.03</div><ul><li>월 최대 5억 paid 매체별 예산 운영 및 광고관리 — FBIG / Google Ads / Kakao moment / NAVER GFA / Criteo / Apple Search Ads</li><li>트래킹 툴 활용한 매체별 효율측정 — 에어브릿지 &amp; 앰플리튜드</li></ul></div>
      <div class="proj"><div class="pj-title">콘텐츠 기획 및 제작</div><div class="pj-period">2021.12 – 2022.03</div><ul><li>설치 및 클릭유도 퍼포먼스형 콘텐츠 제작 (이미지+카탈로그, 영상)</li></ul></div>
      <div class="proj"><div class="pj-title">앱 푸시 + 카카오 플친 온드매체 운영</div><div class="pj-period">2021.12 – 2022.03</div><ul><li>리타게팅 목적 앱푸시·플친 운영, 유저 세그별 메시지 차별화로 앱 유입 최대화</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">바비톡</span></div><div class="period">2019.04 – 2021.12 (2년 9개월) · 정규직</div></div>
      <div class="proj"><div class="pj-title">바비톡 퍼포먼스형 콘텐츠 제작 및 광고운영</div><div class="pj-period">2019.06 – 2021.12</div><ul><li>설치·클릭유도 퍼포먼스형 콘텐츠 제작 (이미지·카탈로그·영상 다수), 매체별 효율측정(애드저스트·앰플리튜드)</li><li>모델 '박나래' 활용 콘텐츠 A to Z (대리수술 안심존·부작용 위험성·1분닥터 인지 콘텐츠)</li></ul></div>
      <div class="proj"><div class="pj-title">바비톡 브랜딩캠페인 파트</div><div class="pj-period">2021.04 – 2021.12</div><ul><li>'바비톡하다' 캠페인 콘텐츠 아이데이션·제작</li><li>퍼플라이 기부런 캠페인: 굿즈 기획~판매 A to Z, 1,000개 3분 완판, 2,000만원 강동경희대병원 기부</li><li>부작용 알리기 캠페인 (재건 지원·위험성 인지)</li></ul></div>
      <div class="proj"><div class="pj-title">바비톡 커머스팀 - [바비톡 특가]</div><div class="pj-period">2020.07 – 2021.06</div><ul><li>명품 화장품+타사 제휴 특가, 주1회 총 36회, 매주 단시간 완판·재고소진</li></ul></div>
      <div class="proj"><div class="pj-title">커머스팀 - 뷰티기기 [앱솔브랩 갈바닉]</div><div class="pj-period">2019.09 – 2020.05</div><ul><li>3,000개 재고소진, 네이버쇼핑 뷰티 핫딜 1위, 티몬·위메프 특가, 킥오프 8개월 소진</li></ul></div>
      <div class="proj"><div class="pj-title">뷰티 유튜브채널 [쎄뷰리] 운영</div><div class="pj-period">2019.04 – 2019.10</div><ul><li>'세상의 모든 뷰티제품 리뷰' 컨셉, 6개월 구독 1,000명, 일 평균 조회 2,000회 유지</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">레드브릭스</span></div><div class="period">2017.08 – 2019.01 (1년 6개월) · 정규직</div></div>
      <div class="proj"><div class="pj-title">기획/촬영/제작 전반 업무</div><div class="pj-period">2017.08 – 2019.01</div><ul><li>클라이언트 요구에 따른 기획·영상촬영·편집</li><li>담당 클라이언트: LG Display, 다이소, 본죽&amp;본도시락, KOTRA, 창의재단 등</li></ul></div>
    </div>
  </section>
  <section class="edu">
    <h2 class="sec">학력</h2>
    <div class="job-head"><div><span class="co">수원대학교</span><span class="role">언론정보학과</span></div><div class="period">2011.03 – 2017.06 · 졸업</div></div>
    <ul class="proj" style="padding-left:18px;margin-top:8px;"><li>미디어 산업 이론과목 이수</li><li>영상 제작 기본 스킬 학습</li><li>졸업작품 위원장 역임</li></ul>
  </section>
  <section class="awards">
    <h2 class="sec">수상 / 자격증 / 기타</h2>
    <ul style="padding-left:18px;margin:0;">
      <li><b>2015 연수구 시월애 공모전</b> <span class="yr">2015.08</span><br>연수구 홍보영상 공모전 · 대상 수상</li>
      <li><b>KBS인재개발원 방송프로듀서 실무과정</b> <span class="yr">2015.03</span></li>
      <li><b>언론정보학과 졸업작품전</b> <span class="yr">2016.05</span><br>페이크 다큐 출품 · 우수상 수상</li>
      <li><b>크리노베이션</b> <span class="yr">2016.09</span><br>미디어인재역량강화 프로젝트 영상전 · 대상 수상</li>
    </ul>
  </section>
  <section class="skills-sec">
    <h2 class="sec">스킬</h2>
    <div class="skills"><span class="chip">광고 운영</span><span class="chip">광고 관리</span><span class="chip">Meta Ads</span><span class="chip">Google Ads</span><span class="chip">GA4</span><span class="chip">SQL</span><span class="chip">Amplitude</span><span class="chip">Airbridge</span><span class="chip">마케팅 전략</span><span class="chip">마케팅 분석</span><span class="chip">콘텐츠 제작</span><span class="chip">After Effects</span><span class="chip">Premiere</span><span class="chip">Photoshop</span><span class="chip">Illustrator</span><span class="chip">Figma</span><span class="chip">Notion</span><span class="chip">Slack</span><span class="chip">Jira</span><span class="chip">Excel</span></div>
  </section>
  <section class="links">
    <h2 class="sec">링크</h2>
    <ul style="list-style:none;padding:0;margin:0;">
      <li><span class="lbl">포트폴리오 - PDF</span><a href="https://drive.google.com/file/d/1YxzbtL0FN8Ymq-4ODHXVgxPeCHnKSo6j/view?usp=sharing">Google Drive</a></li>
      <li><span class="lbl">포트폴리오 - 노션</span><a href="https://jinxxsoo.notion.site/KIM-JIN-SOO-e1051ab37b114258aa3fb6e86c5b15d3">Notion</a></li>
    </ul>
  </section>
  </div>`,

  en: `<div class="page">
  <header class="resume-head">
    <h1>Kim Jinsoo</h1>
    <div class="contact"><span>+82 10.9214.0450</span><span>steadyant@naver.com</span></div>
  </header>
  <section class="intro">
    <h2 class="sec">About</h2>
    <p>Hello, I'm Kim Jinsoo.</p>
    <p>A full-stack marketer who has experienced the entire in-house marketing process — from content planning and production to branding campaigns, performance marketing, and commerce.</p>
    <p>I have been deeply engaged in performance marketing, analyzing and applying results-oriented methodologies tailored to the KPIs and goals of each channel and campaign.</p>
    <p>Through AX (AI transformation) that combines MCP with planning, I have automated repetitive marketing work and the aggregation of scattered data — building an internal performance dashboard and AI marketing agents as company tools.</p>
    <p>With the capacity this creates, I aim to dig deeper into the core of marketing and collaborate more effectively and efficiently with adjacent fields. I define goals in detail, constantly ask "is there a better way," and pursue a data-driven way of working that makes numbers trustworthy.</p>
    <p>Thank you.</p>
    <div class="pj-title" style="font-weight:700;margin-top:20px;">[AX Experience]</div>
    <ol class="ax-list">
      <li><b>MCP Utilization</b> — Connected data and tools directly to AI via MCP (Airbridge MCP, Meta, etc.), automating the query–analysis–execution cycle for marketing data.</li>
      <li><b>Performance Dashboard Automation (media API integration)</b> — Connected APIs (Airbridge, Meta, Naver Search Ads, Google Ads) to auto-aggregate ad performance, revenue, and funnels into dashboards.</li>
      <li><b>Content Generation Automation</b> — Automated content drafting and review with SEO/copy/performance AI marketing agents (including automatic competitor-brand leak checks).</li>
      <li><b>Spec-driven · Parallel Git Development</b> — Collaborated with AI based on guidelines/specs, developing and shipping multiple features in parallel via git worktree.</li>
      <li><b>Multi-AI Orchestration</b> — Provider abstraction that switches between Anthropic, OpenAI, Google, and Vertex by config and logs every execution.</li>
    </ol>
  </section>
  <section class="careers">
    <h2 class="sec">Experience · 8 yrs 7 mos</h2>
    <div class="job">
      <div class="job-head"><div><span class="co">Handys</span><span class="role">Marketing &amp; Planning · Lead</span></div><div class="period">Jun 2025 – Present (1 yr 3 mos) · Full-time</div></div>
      <div class="proj"><div class="pj-title">Plott Life — AX Marketing &amp; Planning Adoption</div><div class="pj-period">Mar 2026 – Aug 2026</div>
        <p class="lead">① In-house marketing operations dashboard · Sole planning &amp; operation</p>
        <ul><li>Unified scattered marketing data (GA4, ad performance, revenue, KPIs) onto one screen for data-driven decisions. Owned the work end-to-end from requirements to operation, automating manual reports. Built a 20+ feature internal tool including SEO/copy/performance AI marketing agents and ad/lead/newsletter operations.</li></ul>
        <p class="lead">② Plott Life marketing &amp; content operations · Marketing domain owner</p>
        <ul><li>Built a blog CMS letting marketers publish/manage content without dev help. Designed GA4/GTM event schema and Naver conversion tracking to measure ad performance and user funnels. Applied SEO and structured data to secure organic search inflow.</li></ul>
        <p class="lead">③ Urbanstay × wavve partnership · Sole landing-page implementation</p>
        <ul><li>Solely planned and built the collaboration guide and landing page for the partnership campaign, reflecting partner communication, brand tone, and service policy. Shipped a stable page adhering to live-service flow and conventions.</li></ul>
      </div>
      <div class="proj"><div class="pj-title">Urbanstay app — Sales performance marketing optimization <span class="role">· Performance Marketing · Manager</span></div><div class="pj-period">Jun 2025 – Mar 2026</div>
        <ul><li>Ran and optimized Meta/Google ads; led message/appeal testing for audience expansion and CPC reduction.</li><li>Airbridge–Meta integration, purchase/view event structure design, and MMP data validation.</li><li>Auto-aggregated booking/revenue/repurchase cohorts, LTV, and funnel data via Apps Script and SQL (Redash/Metabase) and built dashboards.</li><li>Built an automation pipeline: external APIs (Redash, Airbridge) → sheet ingestion → log management.</li><li>Designed performance analysis and operating strategy tailored to short-term promotional commerce (hotel/travel).</li><li>Produced ad creative (video/image) directly while running performance-improvement experiments.</li></ul>
      </div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">WAUG</span><span class="role">Performance Marketing</span></div><div class="period">Oct 2022 – May 2025 (2 yrs 8 mos) · Full-time</div></div>
      <div class="proj"><div class="pj-title">Company-wide &amp; marketing metrics operation</div><div class="pj-period">Oct 2022 – Dec 2024</div><ul><li>Built dashboards for company-wide KPIs and marketing metrics.</li><li>Set up DB data integration and automated updates.</li></ul></div>
      <div class="proj"><div class="pj-title">Media budget management &amp; performance efficiency</div><div class="pj-period">Oct 2022 – Dec 2024</div><ul><li>Monitored budget-vs-performance efficiency via per-channel dashboards.</li><li>Automated updates via MMP data integration, improving performance and resource efficiency.</li></ul></div>
      <div class="proj"><div class="pj-title">Self-serve ad operation: A/B testing + efficiency</div><div class="pj-period">Oct 2022 – Dec 2024</div><ul><li>Planned and produced Meta/Google ad campaigns (DA creative — video/image).</li><li>Planned/produced short-form by audience and install/conversion goals.</li><li>Improved average CPI and in-app event metrics.</li><li>Templatized creative from performance testing, improving update and production efficiency.</li><li>Operated up to ₩100M/month budget; drove efficiency through report automation.</li></ul></div>
      <div class="proj"><div class="pj-title">Attribution tool management &amp; optimization (Amplitude, Airbridge)</div><div class="pj-period">Jun 2023 – Dec 2024</div><ul><li>Event taxonomy and QA.</li><li>Built key service/marketing data funnels and executed performance monitoring and analysis.</li></ul></div>
      <div class="proj"><div class="pj-title">Partner sales promotion planning &amp; execution</div><div class="pj-period">Dec 2023 – Dec 2024</div><ul><li>Ran the WAUG × Universal Studios Japan collaboration campaign.</li><li>Cross/up-selling planning — page &amp; ad creative production — operation.</li><li>Sold out first-come ticket quota ahead of target.</li><li>KOL marketing via influencer collaboration (short-form video repurposing).</li></ul></div>
      <div class="proj"><div class="pj-title">Naver Shopping optimization &amp; operation</div><div class="pj-period">Jan 2024 – Dec 2024</div><ul><li>Cleaned up product categories and product names.</li><li>Planned feed-URL logic and exposure pages with custom operation.</li><li>Reduced maintenance response time; resolved policy-violation issues.</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">Ondemandlab</span><span class="role">Performance Marketer · Manager</span></div><div class="period">Jul 2022 – Aug 2022 (2 mos) · Full-time</div></div>
      <div class="proj"><div class="pj-title">Self-serve media buying &amp; budget operation</div><div class="pj-period">Jul 2022 – Aug 2022</div><ul><li>Ran Google Ads UAC campaigns / Apple Search Ads.</li></ul></div>
      <div class="proj"><div class="pj-title">Creative production &amp; execution for media ads</div><div class="pj-period">Jul 2022 – Aug 2022</div><ul><li>Produced image / video ads.</li></ul></div>
      <div class="proj"><div class="pj-title">Marketing metrics for performance analysis</div><div class="pj-period">Jul 2022 – Aug 2022</div><ul><li>Set up an automated dashboard.</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">Ably Black</span></div><div class="period">Dec 2021 – Mar 2022 (4 mos) · Full-time</div></div>
      <div class="proj"><div class="pj-title">Self-serve media buying &amp; operation</div><div class="pj-period">Dec 2021 – Mar 2022</div><ul><li>Operated up to ₩500M/month paid budget across channels — FBIG / Google Ads / Kakao Moment / NAVER GFA / Criteo / Apple Search Ads.</li><li>Measured per-channel efficiency with tracking tools — Airbridge &amp; Amplitude.</li></ul></div>
      <div class="proj"><div class="pj-title">Content planning &amp; production</div><div class="pj-period">Dec 2021 – Mar 2022</div><ul><li>Produced install/click-driving performance content (image + catalog, video).</li></ul></div>
      <div class="proj"><div class="pj-title">App push + Kakao channel owned-media operation</div><div class="pj-period">Dec 2021 – Mar 2022</div><ul><li>Ran retargeting app-push and Kakao channel with per-segment message differentiation to maximize app inflow.</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">Babitalk</span></div><div class="period">Apr 2019 – Dec 2021 (2 yrs 9 mos) · Full-time</div></div>
      <div class="proj"><div class="pj-title">Performance content production &amp; ad operation</div><div class="pj-period">Jun 2019 – Dec 2021</div><ul><li>Produced install/click-driving performance content (many image, catalog, video); measured per-channel efficiency (Adjust, Amplitude).</li><li>End-to-end content with model 'Park Na-rae' (surrogate-surgery safe-zone, side-effect awareness, '1-minute doctor' service content).</li></ul></div>
      <div class="proj"><div class="pj-title">Branding campaign part</div><div class="pj-period">Apr 2021 – Dec 2021</div><ul><li>Ideated/produced the 'Babitalk-hada' campaign content.</li><li>Purfly charity run: goods planning to sales A-to-Z, 1,000 units sold out in 3 minutes, ₩20M donated to Kyung Hee University Hospital at Gangdong.</li><li>Side-effect awareness campaign (reconstruction support, risk awareness).</li></ul></div>
      <div class="proj"><div class="pj-title">Commerce team — [Babitalk Deals]</div><div class="pj-period">Jul 2020 – Jun 2021</div><ul><li>Luxury cosmetics + partner deals, weekly for 36 sessions, selling out quickly each week.</li></ul></div>
      <div class="proj"><div class="pj-title">Commerce team — beauty device [Absorb Lab Galvanic]</div><div class="pj-period">Sep 2019 – May 2020</div><ul><li>Cleared 3,000 units, #1 Naver Shopping beauty hot-deal, Tmon/Wemakeprice deals, sold through in ~8 months from kickoff.</li></ul></div>
      <div class="proj"><div class="pj-title">Beauty YouTube channel [Sseburi] operation</div><div class="pj-period">Apr 2019 – Oct 2019</div><ul><li>'Reviews of every beauty product' concept; 1,000 subscribers in 6 months; sustained ~2,000 daily views with no extra resources.</li></ul></div>
    </div>
    <div class="job">
      <div class="job-head"><div><span class="co">Redbricks</span></div><div class="period">Aug 2017 – Jan 2019 (1 yr 6 mos) · Full-time</div></div>
      <div class="proj"><div class="pj-title">End-to-end planning / filming / production</div><div class="pj-period">Aug 2017 – Jan 2019</div><ul><li>Planning, video shooting, and editing per client needs.</li><li>Clients: LG Display, Daiso, Bonjuk &amp; Bonif, KOTRA, KOFAC, etc.</li></ul></div>
    </div>
  </section>
  <section class="edu">
    <h2 class="sec">Education</h2>
    <div class="job-head"><div><span class="co">Suwon University</span><span class="role">Media &amp; Communication</span></div><div class="period">Mar 2011 – Jun 2017 · Graduated</div></div>
    <ul class="proj" style="padding-left:18px;margin-top:8px;"><li>Completed core media-industry theory courses.</li><li>Learned fundamental video production skills.</li><li>Served as chair of the graduation exhibition.</li></ul>
  </section>
  <section class="awards">
    <h2 class="sec">Awards / Certifications / Other</h2>
    <ul style="padding-left:18px;margin:0;">
      <li><b>Yeonsu-gu Siwolae Contest — Grand Prize</b> <span class="yr">Aug 2015</span><br>Yeonsu-gu promotional video contest.</li>
      <li><b>KBS HRD — TV Producer Practical Course</b> <span class="yr">Mar 2015</span></li>
      <li><b>Graduation Exhibition — Excellence Award</b> <span class="yr">May 2016</span><br>Fake-documentary submission.</li>
      <li><b>Crinovation</b> <span class="yr">Sep 2016</span><br>Media talent program video exhibition · Grand Prize.</li>
    </ul>
  </section>
  <section class="skills-sec">
    <h2 class="sec">Skills</h2>
    <div class="skills"><span class="chip">Ad Operations</span><span class="chip">Ad Management</span><span class="chip">Meta Ads</span><span class="chip">Google Ads</span><span class="chip">GA4</span><span class="chip">SQL</span><span class="chip">Amplitude</span><span class="chip">Airbridge</span><span class="chip">Marketing Strategy</span><span class="chip">Marketing Analytics</span><span class="chip">Content Production</span><span class="chip">After Effects</span><span class="chip">Premiere</span><span class="chip">Photoshop</span><span class="chip">Illustrator</span><span class="chip">Figma</span><span class="chip">Notion</span><span class="chip">Slack</span><span class="chip">Jira</span><span class="chip">Excel</span></div>
  </section>
  <section class="links">
    <h2 class="sec">Links</h2>
    <ul style="list-style:none;padding:0;margin:0;">
      <li><span class="lbl">Portfolio — PDF</span><a href="https://drive.google.com/file/d/1YxzbtL0FN8Ymq-4ODHXVgxPeCHnKSo6j/view?usp=sharing">Google Drive</a></li>
      <li><span class="lbl">Portfolio — Notion</span><a href="https://jinxxsoo.notion.site/KIM-JIN-SOO-e1051ab37b114258aa3fb6e86c5b15d3">Notion</a></li>
    </ul>
  </section>
  </div>`
};
