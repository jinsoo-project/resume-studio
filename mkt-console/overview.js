/* AX-MKT 콘솔 · 구조·개요 탭 — 콘솔을 왜·어떻게 만들었는지(목적·구조)를 데모와 같은 디자인으로 보여 줘요.
   이 페이지의 수치는 모두 예시예요. 데모 화면으로 가는 링크(#/…)가 곳곳에 연결돼 있어요. */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, won = NW.won, D = NW.D, inR = NW.inR;

  var TOC = [["ov-top", "한눈에 보기"], ["ov-loop", "운영 루프"], ["ov-core", "핵심 기능"], ["ov-unit", "유닛 이코노믹스"], ["ov-auto", "퍼포먼스 자동화"], ["ov-intel", "시장 트래킹"], ["ov-arch", "설계 구조"], ["ov-ship", "배포 파이프라인"], ["ov-guide", "데모 둘러보기"]];
  var go = function (slug, label) { return '<a class="ov-go" href="#/' + slug + '">' + label + ' <span>→</span></a>'; };
  var sec = function (id, n, kick, title, desc, body) { return '<section class="ov-sec" id="' + id + '"><div class="ov-sh"><span class="code">' + n + '</span><span class="ov-kick">' + kick + '</span></div><h2>' + title + '</h2>' + (desc ? '<p class="ov-desc">' + desc + '</p>' : '') + body + '</section>'; };
  var impact = function (rows) { return '<div class="ov-imp"><div class="ov-imp-h"><small>IMPACT</small><b>핵심 효과</b></div>' + rows.map(function (r) { return '<div><b><i>' + r[0] + '</i>' + r[1] + '</b><span>' + r[2] + '</span></div>'; }).join("") + '</div>'; };
  var term = function (id, name) { return '<div class="term"><div class="term-h"><i></i><i></i><i></i><span id="' + id + 'N">' + name + '</span></div><div class="term-b" id="' + id + '"></div></div>'; };

  /* 기능 맵 — 데모에 있는 건 바로가기 */
  var FEAT = [["🎨 소재 → 캠페인 자동 매핑", "ad-requests"], ["🚀 캠페인 API 집행", "meta-ads"], ["🔎 키워드 수요 트래킹", "search-kw"], ["🕵️ 경쟁사 소재 트래킹", "competitor-ads"], ["📊 매출 정합 대시보드", "total-dashboard"], ["🎯 CAC · CPA · ROAS", "paid-dashboard"], ["📈 LTV : CAC 트래커", "paid-dashboard"], ["🛡 자동화 가드레일", "#ov-auto"], ["🔀 예산 재배분", "#ov-auto"], ["🧬 이벤트 택소노미", "ga4"], ["🛍 상품 카탈로그 피드", "catalog"], ["🧪 코호트 퍼널", "total-dashboard"], ["✍️ 콘텐츠 자동화", "blog-journey"], ["🗓 회의 · 할일 히스토리", "meetings"]];

  function demoKpis() {
    var r = NW.rangeOf("30"), paid = D.contracts.filter(function (c) { return c.status === "COMPLETED" && inR(c.completed_at, r); });
    var pay = paid.reduce(function (t, c) { return t + c.paid_amount; }, 0), spend = D.ads.filter(function (a) { return inR(a.date, r); }).reduce(function (t, a) { return t + a.spend; }, 0);
    return '<div class="kg">' + NW.kpi("결제금액 · 최근 30일", won(pay), "데모 데이터") + NW.kpi("결제완료", ko(paid.length) + "건", "데모 데이터") + NW.kpi("광고비", won(spend), "4개 매체 합") + NW.kpi("ROAS", (spend ? pay / spend : 0).toFixed(2) + "x", "결제금액 ÷ 광고비") + '</div>';
  }
  var CORE = [
    { n: "01", t: "통합 대시보드", tag: "의사결정 · 측정 신뢰", h: "서비스지표와 마케팅지표를 한 판에서", p: "지표마다 기준이 다르고 화면이 흩어져 있으면, 마케팅이 매출에 얼마나 기여하는지 매번 다시 맞춰봐야 합니다. 두 축을 같은 정의로 한 곳에 모으고, 이벤트 택소노미까지 고정해 어느 화면이든 같은 숫자로 비교·결정하도록 했습니다.", pts: ["거래액 3레이어", "채널별 CAC·ROAS", "지표 사전 통일", "GTM·GA4 계측"], bf: "화면마다 기준이 달라 매번 대사", af: "한 판에서 같은 정의로 바로 결정", demo: [["total-dashboard", "Total Dashboard"], ["paid-dashboard", "Paid Dashboard"], ["ga4", "GA4 대시보드"], ["kpi-okr", "KPI & OKR"]], kpis: true },
    { n: "02", t: "마케팅 자동화", tag: "집행 효율 · 운영 자동화", h: "기획·집행·최적화를 화면 안에서 자동으로", p: "광고관리자의 반복 세팅은 느리고 실수를 부릅니다. 소재 문구가 그대로 빌더로 흐르게 하고, 자주 쓰는 세팅은 템플릿으로 굳혀 버튼 한 번에 집행합니다. 라이브 이후는 가드레일과 알림이 대신 지켜봅니다.", pts: ["소재→빌더 자동 매핑", "버튼 한 번 API 집행", "ROAS·CAC 가드레일", "콘텐츠 9단계 자동화"], bf: "매번 새로 세팅·사람이 계속 감시", af: "템플릿 집행·규칙이 24시간 자동", demo: [["meta-ads", "META Ads 빌더"], ["naver-sa", "NAVER SA 빌더"], ["search-kw", "검색광고 키워드 API"], ["blog-journey", "블로그 파이프라인"]] },
    { n: "03", t: "히스토리 워크플로우", tag: "업무 효율", h: "요청·회의·기록이 저절로 쌓인다", p: "요청·회의·제안이 흩어지면 소통 기록을 찾는 데만 시간이 듭니다. 요청은 보드에서 세트·코멘트까지 한 번에 주고받고, 할 일·회의·배포 이력은 자동으로 타임라인에 남도록 만들었습니다.", pts: ["요청 보드 · 코멘트", "회의 · 할일 캘린더", "UTM 규칙 · 히스토리", "자동 기록 타임라인"], bf: "흩어진 기록을 찾아 헤맴", af: "한 보드에 저절로 쌓이는 기록", demo: [["ad-requests", "광고 & 디자인 요청"], ["meetings", "회의 캘린더"], ["utm", "UTM 생성기"], ["competitor-ads", "경쟁사 광고"]] }
  ];
  var cur = +NW.store.get("ov-core", 0) || 0;
  function corePanel() {
    var c = CORE[cur];
    return '<div class="card ov-cp"><div class="ov-cp-l"><span class="pill p-blue">' + c.tag + '</span><h3>' + c.h + '</h3><p>' + c.p + '</p><div class="mchips">' + c.pts.map(function (x) { return '<span class="tag">' + x + '</span>'; }).join("") + '</div></div>'
      + '<div class="ov-ba"><div><small>이전</small><b>' + c.bf + '</b></div><i>↓</i><div class="af"><small>이후</small><b>' + c.af + '</b></div></div></div>'
      + (c.kpis ? '<div style="margin-top:12px">' + demoKpis() + '</div>' : '')
      + '<div class="ov-demo"><span>데모 콘솔에서 확인</span>' + c.demo.map(function (d) { return go(d[0], d[1]); }).join("") + '</div>';
  }

  var AUTO = [
    '<span class="run">⟳</span> 실질 ROAS <span class="cmd">2.7x</span> &lt; 목표 3.0x <span class="dim">3일 지속</span> → 세트 B 예산 <span class="cmd">₩50k → ₩40k</span>',
    '<span class="dim">⏸</span> 구매 CAC <span class="cmd">₩48,200</span> &gt; ₩45,000 → 유사타겟 세트 <span class="run">일시중지</span> · 알림 전송',
    '<span class="ok">↻</span> 매시 재수집 — 간접전환 <span class="cmd">+12건</span> 소급 반영 <span class="dim">2.4s</span>',
    '<span class="run">🎨</span> 소재 offer_story · 빈도 3.4 · CTR −28% → <span class="cmd">로테이션 요청</span>',
    '<span class="ok">🔀</span> LTV:CAC 상위 브랜드 키워드로 <span class="cmd">₩120k</span> 재배분 <span class="dim">제안</span>',
    '<span class="ok">✓</span> 가드레일 6종 <span class="ok">정상 순회</span> <span class="dim">다음 평가 60s</span>'
  ];
  var RAIL = ["프롬프트 · 정의", "AI 코딩", "환경변수 · 시크릿", "자동 검증", "AI 코드리뷰 · 게이트", "코멘트 반영", "자동 게이트 통과", "머지", "배포 · 적용 보고"];
  var SC = [
    { name: "🧩 기능 추가", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"채널 LTV:CAC 3.0x↓ 축소 · 4.0x↑ 확대 자동 분류"</span>', '<span class="run">⚙</span> AI 코딩 — 판정 로직 · 배지 컴포넌트 <span class="dim">(파일 4)</span>', '<span class="dim">🔑</span> 환경변수 — 변경 없음 <span class="dim">(내부 로직)</span>', '<span class="run">⟳</span> 자동 검증 — 타입 <span class="ok">✓</span> 린트 <span class="ok">✓</span> 빌드 <span class="ok">✓</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"임계값은 상수로 빼자"</span> 코멘트 1', '<span class="run">✎</span> 코멘트 반영 — <span class="cmd">THRESHOLD</span> 분리 · 재검증 <span class="ok">✓</span>', '<span class="ok">✓</span> 자동 리뷰 게이트 통과 — <span class="ok">approved</span>', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #418</span> <span class="dim">(기능 1 = PR 1)</span>', '<span class="ok">✓</span> 배포 → 적용 보고 <span class="cmd">"적용되었어요"</span> <span class="dim">· 요청부터 38분</span>'] },
    { name: "🖥 화면 추가", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"레퍼럴 초대→가입→첫결제 퍼널 화면 추가"</span>', '<span class="run">⚙</span> AI 코딩 — 라우트 · 쿼리 · 차트 <span class="dim">(파일 7)</span>', '<span class="run">🔑</span> 환경변수 — <span class="cmd">REFERRAL_API_BASE</span> 추가 <span class="dim">(서버 시크릿)</span>', '<span class="run">⟳</span> 자동 검증 — 타입 · 린트 · 빌드 <span class="ok">통과</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"빈 상태 UI 필요"</span> 코멘트 1', '<span class="run">✎</span> 코멘트 반영 — empty-state · 로딩 스켈레톤 추가', '<span class="ok">✓</span> 자동 리뷰 게이트 통과', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #421</span>', '<span class="ok">✓</span> 배포 감시 <span class="dim">(2분 09초)</span> → 적용 보고'] },
    { name: "🎯 마케팅 배포", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"9:16 스토리 소재 자동 검수 (비율 · 용량 · 안전영역)"</span>', '<span class="run">⚙</span> AI 코딩 — 소재 밸리데이터 · 카탈로그 피드 매핑 <span class="dim">(파일 5)</span>', '<span class="run">🔑</span> 환경변수 — <span class="cmd">CATALOG_TOKEN</span> 로테이션 <span class="dim">(값 노출 X)</span>', '<span class="run">⟳</span> 자동 검증 — 빌드 <span class="ok">통과</span> · 시크릿 스캔 <span class="ok">✓</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"검수 실패 사유를 로그로"</span> 코멘트', '<span class="run">✎</span> 코멘트 반영 — 실패 케이스 로깅 추가', '<span class="ok">✓</span> 자동 리뷰 게이트 통과', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #424</span>', '<span class="ok">✓</span> 배포 → 카탈로그 피드 반영 → 적용 보고'] },
    { name: "🔑 환경변수 · 시크릿", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"검색광고 API 키 로테이션 · 무중단"</span>', '<span class="run">⚙</span> AI 코딩 — 키 참조가 서버 전용인지 확인 <span class="dim">(파일 2)</span>', '<span class="run">🔑</span> 환경변수 — <span class="cmd">SA_SECRET</span> 교체 <span class="dim">· 화면 · 레포 · 대화 노출 0</span>', '<span class="run">⟳</span> 자동 검증 — 빌드 <span class="ok">통과</span> · 시크릿 스캔 <span class="ok">✓</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"롤백 플랜 명시"</span> 코멘트', '<span class="run">✎</span> 코멘트 반영 — 롤백 절차 · 헬스체크 추가', '<span class="ok">✓</span> 자동 리뷰 게이트 통과', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #427</span>', '<span class="ok">✓</span> 배포 → 헬스체크 <span class="ok">✓</span> → 적용 보고'] }
  ];
  var GUIDE = [
    ["DASHBOARD", "지표를 한 판에서", [["total-dashboard", "Total Dashboard", "거래액·계약·가입을 같은 정의로 — 숫자를 누르면 행 목록"], ["kpi-okr", "KPI & OKR Tracker", "실측 페이스 + 목표 역산 슬라이더"], ["catalog", "Catalog", "게시 룸타입 → 매체별 상품 피드 상태"]]],
    ["MKT", "측정 · 협업", [["paid-dashboard", "Paid Dashboard", "광고비·CAC·ROAS·LTV"], ["ga4", "GA4 대시보드", "유입·활성 사용자·이벤트"], ["ad-requests", "광고 & 디자인 요청", "세트별 소재·코멘트 보드"], ["utm", "UTM 생성기", "규칙대로 만들고 히스토리 저장"], ["competitor-ads", "경쟁사 광고 모니터링", "소구·톤·CTA 분석"], ["search-kw", "검색광고 키워드 API", "검색량·입찰가·예상실적"], ["meetings", "회의 캘린더", "회의·할일·미팅 한 달 보기"]]],
    ["Ads builder", "집행", [["meta-ads", "META Ads", "캠페인 → 세트 → 소재 트리 빌더"], ["naver-sa", "NAVER SA", "캠페인 → 그룹(키워드) → 소재"]]],
    ["SEO · 콘텐츠", "콘텐츠 자동화", [["keyword-trend", "Keyword Trend", "검색 상대지수 · 연관어"], ["blog-journey", "블로그 파이프라인", "01 키워드 → 09 자동화, 한 사이클 실행"]]]
  ];

  function render() {
    var embed = NW.EMBED;
    return '<div class="ovw">'
      + '<section class="ov-hero" id="ov-top"><div class="eyebrow">AX PROJECT · MARKETING CONSOLE <span class="demo-pill"><i></i>모든 수치는 예시 · 가상 데이터</span></div>'
      + '<h1>흩어진 도구와 지표를,<br><em>하나의 마케팅 콘솔</em>로</h1>'
      + '<p class="ov-lede">지표가 흩어지면 판단이 느려지고, 반복되는 세팅은 실행을 늦춥니다.<br>그 사이를 구조로 메워 — 콘텐츠 기획부터 광고 집행·측정·협업까지 직접 만들어 운영합니다.<br><span class="faint">이 페이지는 구조와 목적을, 위 <b>데모 콘솔</b> 탭은 실제 화면을 가상 데이터로 보여 줘요.</span></p>'
      + '<div class="ov-cta"><a class="btn btn-p lg" href="#/total-dashboard">데모 콘솔 열기 →</a><button class="btn lg" data-ov-to="ov-loop">구조부터 보기 ↓</button><span class="ov-rot">현재 운영 중 — <b id="ovRot">전환 대시보드</b></span></div>'
      + '<div class="kg ov-stats">' + [["30", "+", "운영 중인 화면 · 도구"], ["600", "+", "누적 배포 횟수"], ["8", "", "자동 데이터 파이프라인"], ["½", "일", "요청 → 배포 리드타임"]].map(function (s) { return '<div class="kpi"><div class="kl">' + s[2] + '</div><div class="kv tnum"' + (/^\d+$/.test(s[0]) ? ' data-ov-n="' + s[0] + '"' : '') + '>' + s[0] + s[1] + '</div><div class="ks">예시 수치</div></div>'; }).join("") + '</div>'
      + '<div class="ov-feat">' + FEAT.map(function (f) { return f[1].charAt(0) === "#" ? '<button class="chip2" data-ov-to="' + f[1].slice(1) + '">' + f[0] + '</button>' : '<a class="chip2" href="#/' + f[1] + '">' + f[0] + ' <span class="faint">↗</span></a>'; }).join("") + '</div></section>'

      + sec("ov-loop", "01", "GROWTH LOOP", "운영 구조 — 다섯 단계가 하나의 루프로", "도구가 흩어져 있으면, 그 사이를 사람이 복사와 붙여넣기로 메우게 됩니다. 그래서 다섯 단계를 하나의 루프로 묶었습니다. 성과 확인과 다음 실행 사이가 짧아지도록.",
        '<div class="ov-loop">' + [["① 수집", "DB 웹훅 · 광고 API · 메일"], ["② 정규화", "일별 스냅샷 · PII 해시"], ["③ 측정", "CAC · ROAS · 퍼널"], ["④ 집행", "캠페인 빌더 · 피드"], ["⑤ 세일즈", "파이프라인 · CRM"]].map(function (n, i) { return '<div class="ov-node" data-ln="' + i + '"><b>' + n[0] + '</b><span>' + n[1] + '</span></div>' + (i < 4 ? '<i class="ov-arr">→</i>' : ''); }).join("") + '</div><div class="ov-back">↺ Growth Loop — 성과 → 소재 · 입찰 · 컨택으로 다시 돌아가요</div>'
        + '<div class="ov-g3">' + [["DESIGN PRINCIPLE 01", "지표 정합을 먼저 확보", "지표는 원장 데이터와 원 단위까지 대사한 뒤에 화면에 반영합니다. 확정 매출과 현금 흐름의 축을 분리해, 취소·환불이 발생해도 지난 기간의 수치가 변하지 않는 구조로 설계했습니다."], ["DESIGN PRINCIPLE 02", "수기 이관 구간 제거", "사내 DB는 웹훅으로 밀어내고, 광고 성과는 롤링 재수집으로 갱신됩니다. 간접전환의 소급 반영까지 고려해 수집 구간을 항상 겹쳐서 덮어씁니다."], ["DESIGN PRINCIPLE 03", "측정과 집행의 통합", "성과 화면과 집행 화면이 같은 콘솔에 있습니다. 기획된 소재 문구는 캠페인 빌더로 자동 매핑되고, 빌더는 매체 API로 집행하며, 결과는 다시 성과 화면으로 돌아옵니다."]].map(function (p) { return '<div class="card ov-card"><small>' + p[0] + '</small><b>' + p[1] + '</b><p>' + p[2] + '</p></div>'; }).join("") + '</div>'
        + impact([["↓", "운영 리소스 절감", "도구 사이 복사·붙여넣기 이관 제거 — 반복 취합에 쓰던 시간을 회수합니다."], ["≡", "지표 해석 통일", "전 화면이 같은 지표 사전 — 탭마다 다른 숫자로 대사하는 일이 사라집니다."], ["↺", "측정 → 실행 단축", "성과 확인과 다음 실행 사이의 왕복이 짧아집니다."]]))

      + sec("ov-core", "02", "CORE CAPABILITIES", "콘솔 핵심 기능 — 관점과 실화면", "세 가지 핵심 기능을 왜 이렇게 만들었는지(관점)와 함께 보고, 데모 콘솔에서 실제 화면으로 확인해요.",
        NW.segHtml(CORE.map(function (c, i) { return [String(i), c.n + " " + c.t]; }), String(cur), "data-ov-core", true) + '<div id="ovCore" style="margin-top:12px">' + corePanel() + '</div>')

      + sec("ov-unit", "03", "UNIT ECONOMICS", "유저 단위로 보는 LTV · CAC 트래커", "채널마다 얼마를 써서 데려오고(CAC), 그 유저가 얼마를 남기는지(LTV)를 코호트로 추적합니다. 회수 기간과 LTV:CAC로 채널별 예산의 상한을 정합니다.",
        '<div class="kg">' + NW.kpi("블렌디드 CAC", "₩38,400", "▼ 6.1% 개선") + NW.kpi("12개월 LTV · 공헌이익", "₩142,000", "▲ 4.9%") + NW.kpi("LTV : CAC", "3.7x", "목표 3.0x 상회", "acc") + NW.kpi("회수 기간", "4.2개월", "목표 6개월 이내") + NW.kpi("공헌이익률", "62%", "변동비 차감 후") + '</div>'
        + '<div class="card tw" style="margin-top:12px"><table class="t" style="min-width:760px"><thead><tr><th>채널</th><th>LTV : CAC</th><th class="r">광고비</th><th class="r">신규</th><th class="r">CAC</th><th class="r">12M LTV</th><th class="r">회수</th><th>판정</th></tr></thead><tbody>'
        + [["검색 · 브랜드 키워드", 11.9, "₩310,000", 24, "₩12,900", "₩154,000", "1.6개월", "확대"], ["레퍼럴 · 추천 리워드", 15.4, "₩420,000", 50, "₩8,400", "₩129,000", "1.2개월", "확대"], ["검색 · 일반 키워드", 3.6, "₩720,000", 18, "₩40,000", "₩144,000", "5.0개월", "유지"], ["소셜 · 관심사 전환", 3.4, "₩2,100,000", 51, "₩41,200", "₩140,000", "5.2개월", "유지"], ["소셜 · 유사 · 리타겟", 2.4, "₩1,160,000", 20, "₩58,000", "₩139,000", "8.1개월", "축소"]].map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td><span class="ov-bar"><i style="width:' + Math.min(100, r[1] / 16 * 100) + '%"></i></span><b class="tnum">' + r[1] + 'x</b></td><td class="r tnum">' + r[2] + '</td><td class="r tnum">' + r[3] + '</td><td class="r tnum">' + r[4] + '</td><td class="r tnum">' + r[5] + '</td><td class="r tnum">' + r[6] + '</td><td><span class="pill sm ' + (r[7] === "확대" ? "p-em" : r[7] === "축소" ? "p-red" : "p-gray") + '">' + r[7] + '</span></td></tr>'; }).join("") + '</tbody></table></div>'
        + '<p class="ov-note">LTV:CAC 3.0x 미만은 축소, 4.0x 이상은 확대 후보로 자동 분류 — 아래 퍼포먼스 자동화의 예산 재배분과 연결돼요.</p>'
        + '<div class="ov-demo"><span>데모 콘솔에서 확인</span>' + go("paid-dashboard", "Paid Dashboard · CAC · ROAS · LTV") + go("kpi-okr", "KPI & OKR") + '</div>')

      + sec("ov-auto", "04", "PERFORMANCE AUTOMATION", "규칙이 돌아가는 퍼포먼스 자동화", "성과를 보고 매번 손대는 대신, 가드레일을 규칙으로 걸어 둡니다. 임계치를 넘으면 예산을 줄이고, 소재를 돌리고, 데이터를 다시 당겨옵니다.",
        '<div class="ov-flow">' + [["신호 수집", "CAC · ROAS · 빈도 · 전환"], ["규칙 평가", "임계치 · 지속시간"], ["가드레일 액션", "예산 · 일시중지 · 로테이션"], ["로그 · 알림", "메신저 · 타임라인"]].map(function (f, i) { return '<div><b>' + f[0] + '</b><small>' + f[1] + '</small></div>' + (i < 3 ? '<i>→</i>' : ''); }).join("") + '</div>'
        + '<div class="ov-g3" style="margin-top:12px">' + [["🛡", "ROAS 가드레일", "실질 ROAS가 목표선 아래로 3일 지속되면 일 예산을 자동으로 낮추고, 회복되면 되돌립니다.", "실질 ROAS < 3.0x", "예산 −20%"], ["⏸", "CAC 상한 · 자동 정지", "구매 CAC가 상한을 넘는 광고세트는 일시중지하고 담당에게 알립니다.", "CAC > ₩45,000", "세트 일시중지"], ["↻", "롤링 재수집", "매시 정각 광고 성과를 겹쳐 upsert — 간접전환 소급분까지 자동 반영합니다.", "매시 스케줄", "소급 겹침 upsert"], ["🎨", "소재 피로도 로테이션", "노출 빈도가 오르고 CTR이 꺾이면 로테이션을 요청하고 대기 소재를 올립니다.", "빈도 3.0↑ · CTR −25%", "소재 교체"], ["🔀", "예산 재배분", "LTV:CAC 상위 채널로 소진분을 이관하도록 제안합니다. 실행은 사람이 확인합니다.", "LTV:CAC 상위", "이관 제안"], ["🚨", "이상 감지", "스펜드는 도는데 전환이 0이면 픽셀·이벤트 유실을 의심하고 점검 알림을 보냅니다.", "전환 0 · 스펜드 진행", "계측 점검 알림"]].map(function (c) { return '<div class="card ov-card"><b><span class="ov-ic">' + c[0] + '</span>' + c[1] + '</b><p>' + c[2] + '</p><div class="mchips"><span class="tag">' + c[3] + '</span><span class="tag on">→ ' + c[4] + '</span></div></div>'; }).join("") + '</div>'
        + '<div class="ov-g2x"><div class="card ov-rail"><div class="lbl2" style="margin:0 0 8px">가드레일 상태 — 지금 걸려 있는 규칙</div>' + [["ok", "ROAS 가드레일 · 정상"], ["run", "CAC 상한 · 세트 1건 정지"], ["ok", "롤링 재수집 · 매시"], ["run", "소재 피로도 · 로테이션 대기"], ["", "예산 재배분 · 제안 1건"], ["ok", "이상 감지 · 정상"]].map(function (r) { return '<div class="rl ' + r[0] + '"><i>' + (r[0] === "ok" ? "✓" : r[0] === "run" ? "!" : "·") + '</i>' + r[1] + '</div>'; }).join("") + '</div>' + term("ovA", "console — automation.log") + '</div>'
        + impact([["↓", "모니터링 리소스 절감", "사람이 매번 안 봐도 규칙이 24시간 감시 — 반복 점검·조정을 대체합니다."], ["◆", "나쁜 지출 조기 차단", "CAC·ROAS 가드레일이 임계 초과를 자동 정지 — 손실을 하루 안에 끊습니다."], ["✓", "계측 안정성", "전환 0·스펜드 진행을 감지해 픽셀·이벤트 유실을 조기에 발견합니다."]]))

      + sec("ov-intel", "05", "TRACKING INTELLIGENCE", "시장 트래킹 — 경쟁사와 검색 수요", "경쟁사의 라이브 소재와 시장의 검색 수요를 상시 수집합니다. 소재 방향과 예산 배분을 감이 아니라 데이터로 정하기 위해 만든 장치입니다.",
        '<div class="ov-g3">' + [["🕵️", "경쟁사 광고 트래킹", "경쟁사의 집행 중인 소재를 주기적으로 수집하고, 소구점과 오퍼 구조 분석을 AI에게 맡깁니다. 소재 기획의 비교 기준입니다.", ["소재 아카이브", "AI 소구 분석", "집행 기간 추적"], "competitor-ads", "경쟁사 광고 모니터링"], ["🔎", "키워드 트래킹 · 예상실적", "키워드별 수요·경쟁도·예상 성과를 시뮬레이션하고, 키워드 단위 CAC와 노출순위까지 추적합니다. 예산 배분의 근거가 됩니다.", ["키워드 단위 CAC", "예상 입찰가", "검색 추이"], "search-kw", "검색광고 키워드 API"], ["🛍", "상품 · 피드 모니터링", "자사 상품의 노출 상태와 가격 분포, 매체별 카탈로그 피드 승인·오류까지 하나의 화면으로 모았습니다.", ["피드 승인률", "가격 · 재고 동기화", "오류 자동 수정 요청"], "catalog", "Catalog"]].map(function (c) { return '<div class="card ov-card"><b><span class="ov-ic">' + c[0] + '</span>' + c[1] + '</b><p>' + c[2] + '</p><div class="mchips">' + c[3].map(function (x) { return '<span class="tag">' + x + '</span>'; }).join("") + '</div>' + go(c[4], c[5] + " 데모") + '</div>'; }).join("") + '</div>')

      + sec("ov-arch", "06", "SYSTEM ARCHITECTURE", "콘솔 설계 구조", "빨리 만드는 것보다 무너지지 않게 만드는 데 공을 들였습니다. 같은 일을 다루는 흔한 방식과 비교하면 차이가 분명합니다.",
        '<div class="card ov-vs">' + [["채널별 리포트를 내려받아 스프레드시트에서 손으로 취합합니다.", "원장과 원 단위로 대사한 지표 사전 하나를 전 화면이 공유합니다. 어느 탭을 열어도 같은 숫자입니다."], ["광고관리자에서 수동으로 세팅하고, 성과는 다른 창에서 따로 봅니다.", "성과 화면 옆에서 API로 직접 집행합니다. 소재 문구는 자동 매핑되고, 생성은 항상 일시중지 상태입니다."], ["메일 · 메신저 · 회의록이 각자 흩어져 히스토리를 찾는 데 시간이 듭니다.", "요청 · 회의 · 할 일 · 배포 이력이 자동으로 타임라인에 남습니다. 찾는 시간이 없습니다."], ["API 키를 공유 문서나 코드 어딘가에 복사해 둡니다.", "키는 서버 시크릿 전용입니다. 화면 · 저장소 · AI와의 대화 어디에도 값이 남지 않도록 설계했습니다."]].map(function (r) { return '<div class="ov-vr"><div><small>보통은</small>' + r[0] + '</div><i>→</i><div class="on"><small>이 콘솔은</small>' + r[1] + '</div></div>'; }).join("") + '</div>'
        + '<div class="ov-stack"><div class="ov-lyrs">' + [["EXECUTE", "실행층", "#f59e0b", ["캠페인 빌더 (API 직집행)", "카탈로그 피드", "발송 · CRM 액션"]], ["VIEW", "화면층", "#8b5cf6", ["대시보드 30여 개", "공용 프레임 · 기간 필터", "지표 사전 임포트"]], ["DATA", "데이터층", "#3b82f6", ["일별 raw 스냅샷 (불변)", "원장 원 단위 대사", "확정 · 현금흐름 축 분리", "PII 해시"]], ["INGEST", "수집층", "#10b981", ["운영 DB 웹훅", "광고 API 롤링 수집", "웹 분석 배치", "메일 (위임 계정)"]]].map(function (l) { return '<div class="ov-lyr" style="--c:' + l[2] + '"><span><b>' + l[0] + '</b><small>' + l[1] + '</small></span><div class="mchips">' + l[3].map(function (x) { return '<span class="tag">' + x + '</span>'; }).join("") + '</div></div>'; }).join("") + '</div>'
        + '<aside class="ov-sec-band"><b>SECURITY · 전 층 공통</b>' + ["키 = 서버 시크릿 전용", "노출 제로 (화면 · 레포 · 대화)", "최소 권한 스코프", "집행 안전핀 (일시중지 생성)", "PR 게이트 통과만 반영"].map(function (x) { return '<div>' + x + '</div>'; }).join("") + '</aside></div>')

      + sec("ov-ship", "07", "DELIVERY PIPELINE", "요청 한 줄에서 배포까지 — 프롬프트로 코딩하고, 리뷰하고, 머지한다", "기능 추가 · 화면 추가 · 마케팅 배포 · 환경변수 교체까지 전부 같은 파이프라인을 지납니다. 시나리오를 눌러보세요.",
        '<div id="ovScen">' + NW.segHtml(SC.map(function (s, i) { return [String(i), s.name]; }), "0", "data-ov-sc", true) + '</div>'
        + '<div class="ov-g2x"><div class="card ov-rail" id="ovRail"><div class="lbl2" style="margin:0 0 8px" id="ovRailH">지금 실행 중 — 기능 추가</div>' + RAIL.map(function (r, i) { return '<div class="rl"><i>' + (i + 1) + '</i>' + r + '</div>'; }).join("") + '</div>' + term("ovT", "console — delivery.log") + '</div>'
        + impact([["⚡", "리드타임 단축", "요청 → 배포가 반나절 — 실험과 개선의 주기가 빨라집니다."], ["↓", "재작업·사고 감소", "정의 우선 + AI 코드리뷰·자동 게이트 + 검증으로 되돌리는 일을 줄입니다."], ["🔒", "보안 리스크 최소화", "키는 서버 시크릿 전용·노출 0, 롤백·헬스체크를 상비합니다."]]))

      + sec("ov-guide", "08", "DEMO GUIDE", "데모 콘솔 둘러보기", "위 구조가 실제로 어떤 화면이 되는지, 가상 브랜드 " + NW.BRAND + " 의 가상 데이터로 직접 눌러 볼 수 있어요. 회색 메뉴는 원래 운영하던 화면이고, 데모에서는 닫아 뒀어요.",
        '<div class="ov-guide">' + GUIDE.map(function (g) { return '<div class="card ov-gd"><div class="ov-gd-h"><b>' + g[0] + '</b><small>' + g[1] + '</small></div>' + g[2].map(function (p) { return '<a href="#/' + p[0] + '"><b>' + p[1] + '</b><span>' + p[2] + '</span><i>→</i></a>'; }).join("") + '</div>'; }).join("") + '</div>'
        + '<div class="ov-end"><div><b>이제 데모 콘솔에서 직접 눌러 보세요</b><span>숫자 클릭 · 드로어 · 빌더 · 자동화 실행까지 모두 동작해요 (가상 데이터 · 이 브라우저에만 저장)</span></div><a class="btn btn-p lg" href="#/total-dashboard">데모 콘솔 열기 →</a></div>')
      + '<footer class="ov-foot">김진수 · Marketing &amp; AX — 이 페이지와 데모의 수치는 모두 예시이며 실제 데이터가 아닙니다</footer></div>';
  }

  /* 사이드바 대신 쓰는 목차 */
  function toc() {
    return '<aside class="sb ov-toc"><nav class="sb-nav"><div class="sb-sec">목차</div>'
      + TOC.map(function (t, i) { return '<button class="sb-l' + (i ? '' : ' act') + '" data-ov-to="' + t[0] + '"><span class="ov-tn">' + ("0" + i).slice(-2) + '</span>' + t[1] + '</button>'; }).join("")
      + '</nav><div class="sb-foot"><a class="btn btn-p" style="width:100%;justify-content:center" href="#/total-dashboard">데모 콘솔 열기 →</a></div></aside>';
  }

  /* 애니메이션 · 스크롤 스파이 (탭을 떠나면 모두 정리) */
  var timers = [], onScroll = null;
  var every = function (fn, ms) { timers.push(setInterval(fn, ms)); }, later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  function unmount() { timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = []; clearTimeout(shipT); if (onScroll) { removeEventListener("scroll", onScroll); onScroll = null; } }
  function typeLine(box, html) { var d = document.createElement("div"); d.className = "tln"; d.innerHTML = html + ' <span class="caret"></span>'; NW.$$(".caret", box).forEach(function (c) { c.remove(); }); box.appendChild(d); box.scrollTop = box.scrollHeight; }
  var si = 0, li = 0, shipT = null;
  function shipStep() {
    var box = document.getElementById("ovT"); if (!box) return;
    var sc = SC[si], rows = NW.$$("#ovRail .rl");
    if (li === 0) { box.innerHTML = ""; rows.forEach(function (r) { r.className = "rl"; }); document.getElementById("ovRailH").textContent = "지금 실행 중 — " + sc.name.replace(/^\S+\s/, ""); NW.$$("#ovScen [data-ov-sc]").forEach(function (b, k) { b.classList.toggle("on", k === si); }); }
    rows.forEach(function (r, k) { r.classList.toggle("ok", k < li || li === 8); r.classList.toggle("run", k === li && li < 8); });
    typeLine(box, sc.s[li]);
    li++;
    if (li >= sc.s.length) { li = 0; shipT = setTimeout(function () { si = (si + 1) % SC.length; shipStep(); }, 3600); return; }
    shipT = setTimeout(shipStep, 1000);
  }
  function mount() {
    unmount();
    if (NW.EMBED) NW.$$('.ovw a[href^="#/"]').forEach(function (a) { a.href = "/ax" + a.getAttribute("href"); a.target = "_blank"; a.rel = "noopener"; });
    var words = ["전환 대시보드", "LTV·CAC 트래커", "캠페인 빌더", "콘텐츠 파이프라인", "퍼포먼스 자동화", "키워드 트래커", "경쟁사 소재 아카이브", "상품 카탈로그 피드"], wi = 0, rot = document.getElementById("ovRot");
    every(function () { if (!rot) return; rot.classList.add("out"); later(function () { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove("out"); }, 250); }, 2600);
    NW.$$("[data-ov-n]").forEach(function (el) { var n = +el.getAttribute("data-ov-n"), t0 = performance.now(); (function tick(t) { var p = Math.min(1, ((t || performance.now()) - t0) / 1200); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + "+"; if (p < 1) requestAnimationFrame(tick); })(); });
    var ln = 0; every(function () { NW.$$(".ov-node").forEach(function (n, i) { n.classList.toggle("hot", i === ln); }); ln = (ln + 1) % 5; }, 1600);
    var ai = 0, abox = document.getElementById("ovA");
    (function aStep() { if (!document.getElementById("ovA")) return; if (ai === 0) abox.innerHTML = ""; typeLine(abox, AUTO[ai]); ai++; if (ai >= AUTO.length) { ai = 0; later(aStep, 3400); } else later(aStep, 1150); })();
    si = 0; li = 0; shipStep();
    var links = NW.$$(".ov-toc [data-ov-to]");
    onScroll = function () { var y = 90, cur = TOC[0][0]; TOC.forEach(function (t) { var el = document.getElementById(t[0]); if (el && el.getBoundingClientRect().top < y + 40) cur = t[0]; }); links.forEach(function (l) { l.classList.toggle("act", l.getAttribute("data-ov-to") === cur); }); };
    addEventListener("scroll", onScroll, { passive: true });
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-ov-to]"))) { var el = document.getElementById(b.getAttribute("data-ov-to")); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 64, behavior: "smooth" }); return; }
    if ((b = e.target.closest("[data-ov-core]"))) { cur = +b.getAttribute("data-ov-core"); NW.store.set("ov-core", cur); NW.$$("[data-ov-core]").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("ovCore").innerHTML = corePanel(); if (NW.EMBED) mountLinks(); return; }
    if ((b = e.target.closest("[data-ov-sc]"))) { clearTimeout(shipT); si = +b.getAttribute("data-ov-sc"); li = 0; shipStep(); return; }
  });
  function mountLinks() { NW.$$('#ovCore a[href^="#/"]').forEach(function (a) { a.href = "/ax" + a.getAttribute("href"); a.target = "_blank"; }); }

  NW.OVERVIEW = { render: render, toc: toc, mount: mount, unmount: unmount };
})(window.NW);
