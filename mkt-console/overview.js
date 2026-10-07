/* AX-MKT 콘솔 · 개요 탭 — 이 콘솔이 어떤 마케팅 업무를 대신해 주는지 업무별로(대시보드 · 광고 자동화 · 콘텐츠 · 시장 트래킹 · 협업) 쉽게 보여 줘요.
   이 페이지의 수치는 모두 예시예요. 업무마다 데모 화면으로 가는 링크(#/…)가 붙어 있어요. */
(function (NW) {
  "use strict";
  var ko = NW.ko, D = NW.D, inR = NW.inR;

  var TOC = [["ov-intro", "한눈에 보기"], ["ov-dash", "대시보드"], ["ov-ads", "광고 자동화"], ["ov-content", "콘텐츠 자동화"], ["ov-intel", "시장 트래킹"], ["ov-collab", "협업 · 기록"], ["ov-how", "만든 방식"]];
  var go = function (slug, label) { return '<a class="ov-go" href="#/' + slug + '">' + label + ' <span>→</span></a>'; };
  var term = function (id, name) { return '<div class="term"><div class="term-h"><i></i><i></i><i></i><span id="' + id + 'N">' + name + '</span></div><div class="term-b" id="' + id + '"></div></div>'; };
  var mw = function (title, note, body) { return '<div class="mw"><div class="mw-h"><i></i><i></i><i></i><span>' + title + '</span><em>' + note + '</em></div>' + body + '</div>'; };

  /* 마케팅 업무 5가지 — 한눈에 보기 카드와 아래 업무별 섹션이 같은 데이터를 써요 */
  var WORK = [
    { id: "ov-dash", ic: "📊", c: "#3182f6", t: "대시보드", h: "오늘 성과를 한 장으로", bf: "매체별 리포트를 내려받아 엑셀로 취합", af: "아침에 대시보드 한 장으로 확인",
      lead: "광고 매체마다 화면도 숫자 기준도 달라서, 성과 한 번 보려면 리포트를 모아 엑셀로 맞춰야 했어요. 매출과 광고 성과를 같은 기준으로 한 화면에 모았습니다.",
      pts: ["매출 · 광고비 · ROAS · CAC를 같은 기준으로 한 화면에", "채널마다 '확대 · 유지 · 축소'를 자동으로 판정", "목표 대비 진행률 · 전환 퍼널까지 바로 확인"],
      demo: [["total-dashboard", "Total Dashboard"], ["kpi-okr", "KPI & OKR"], ["ga4", "GA4 대시보드"]] },
    { id: "ov-ads", ic: "🚀", c: "#f97316", t: "광고 자동화", h: "세팅 · 집행 · 감시를 자동으로", bf: "광고관리자에서 매번 새로 세팅하고 계속 지켜보기", af: "버튼 한 번에 집행, 감시는 규칙이 24시간",
      lead: "광고관리자에서 같은 세팅을 반복하면 느리고 실수가 생겨요. 소재 문구가 캠페인 빌더로 그대로 넘어가고, 라이브 이후엔 규칙이 대신 지켜봅니다.",
      pts: ["소재 요청의 문구가 캠페인 빌더로 자동 연결", "META · 네이버 검색광고를 버튼 한 번에 집행 (항상 일시중지 상태로 생성)", "ROAS · CAC가 기준을 넘으면 예산 조정 · 자동 정지 · 알림"],
      demo: [["meta-ads", "META Ads 빌더"], ["naver-sa", "NAVER SA 빌더"], ["catalog", "상품 카탈로그 피드"]] },
    { id: "ov-content", ic: "✍️", c: "#10b981", t: "콘텐츠 자동화", h: "키워드에서 발행 · 성과까지", bf: "주제 찾기부터 발행 · 성과 정리까지 하나하나 손으로", af: "9단계 파이프라인이 한 사이클로",
      lead: "블로그 글 한 편에도 키워드 조사, 기획, 작성, 검수, 발행, 성과 정리까지 손이 많이 가요. 이 과정을 9단계로 나누고 단계마다 자동화했습니다.",
      pts: ["검색 추이에서 쓸 만한 키워드를 자동으로 추천", "브리프 · 초안 · SEO 검수까지 AI가 보조", "잘 된 글은 뉴스레터 · CRM으로 다시 활용"],
      demo: [["blog-journey", "블로그 여정 맵"], ["blog-01", "01 키워드부터 따라가기"], ["keyword-trend", "Keyword Trend"]] },
    { id: "ov-intel", ic: "🔎", c: "#8b5cf6", t: "시장 트래킹", h: "경쟁사와 검색 수요를 데이터로", bf: "감으로 소재 방향 · 예산을 결정", af: "경쟁사 소재 · 검색량 데이터로 결정",
      lead: "소재 방향과 키워드 예산을 감으로 정하면 결과를 설명하기 어려워요. 경쟁사 광고와 검색 수요를 꾸준히 모아 근거로 씁니다.",
      pts: ["경쟁사가 지금 돌리는 광고를 모으고 AI가 소구점 분석", "키워드별 검색량 · 입찰가 · 예상 실적 조회", "검색 트렌드 · 연관어로 다음 콘텐츠 주제 찾기"],
      demo: [["competitor-ads", "경쟁사 광고 모니터링"], ["search-kw", "검색광고 키워드 API"], ["keyword-trend", "Keyword Trend"]] },
    { id: "ov-collab", ic: "🤝", c: "#0ea5e9", t: "협업 · 기록", h: "요청 · 회의 · 기록을 한 곳에", bf: "메일 · 메신저 · 회의록에 흩어진 기록 찾기", af: "요청 · 회의 · UTM이 한 타임라인에",
      lead: "광고 요청, 회의, 링크 관리가 여러 곳에 흩어지면 기록을 찾는 데만 시간이 들어요. 마케팅 협업에 필요한 기록을 콘솔 안에 모았습니다.",
      pts: ["광고 · 디자인 요청을 보드에서 소재 · 코멘트까지 주고받기", "회의 · 할 일을 캘린더 한 달 보기로", "UTM을 규칙대로 만들고 히스토리로 저장"],
      demo: [["ad-requests", "광고 & 디자인 요청"], ["meetings", "회의 캘린더"], ["utm", "UTM 생성기"]] }
  ];

  /* 업무별 오른쪽 미리보기 화면 (예시) */
  function visDash() {
    var r = NW.rangeOf("30"), paid = D.contracts.filter(function (c) { return c.status === "COMPLETED" && inR(c.completed_at, r); });
    var pay = paid.reduce(function (t, c) { return t + c.paid_amount; }, 0), rev = paid.reduce(function (t, c) { return t + (c.commission || 0); }, 0), spend = D.ads.filter(function (a) { return inR(a.date, r); }).reduce(function (t, a) { return t + a.spend; }, 0);
    var wS = function (v) { return v >= 1e8 ? (v / 1e8).toFixed(1) + "억원" : Math.round(v / 1e4).toLocaleString("ko-KR") + "만원"; };
    var mk = function (l, v, s) { return '<div class="mk"><small>' + l + '</small><b class="tnum">' + v + '</b><span>' + s + '</span></div>'; };
    var JD = [["검색 · 브랜드 키워드", 11.9, "확대", "p-em"], ["소셜 · 관심사 전환", 3.4, "유지", "p-gray"], ["소셜 · 리타겟", 2.4, "축소", "p-red"]];
    return mw("Total Dashboard", "최근 30일 · 예시", '<div class="mw-b"><div class="mk4">' + mk("결제금액", wS(pay), "결제완료 " + ko(paid.length) + "건") + mk("매출(수수료)", wS(rev), "확정 기준") + mk("광고비", wS(spend), "4개 매체 합") + mk("ROAS", (spend ? rev / spend * 100 : 0).toFixed(0) + "%", "매출 ÷ 광고비") + '</div></div>'
      + '<div class="mw-b"><div class="mw-st">채널별 판정 <small>LTV : CAC 기준 · 자동</small></div>' + JD.map(function (j) { return '<div class="mj"><b>' + j[0] + '</b><span class="ov-bar"><i style="width:' + Math.min(100, j[1] / 12 * 100) + '%"></i></span><em class="tnum">' + j[1] + 'x</em><span class="pill sm ' + j[3] + '">' + j[2] + '</span></div>'; }).join("") + '</div>');
  }
  var AUTO = [
    '<span class="run">⟳</span> 실질 ROAS <span class="cmd">2.7x</span> &lt; 목표 3.0x <span class="dim">3일 지속</span> → 세트 B 예산 <span class="cmd">₩50k → ₩40k</span>',
    '<span class="dim">⏸</span> 구매 CAC <span class="cmd">₩48,200</span> &gt; ₩45,000 → 유사타겟 세트 <span class="run">일시중지</span> · 알림 전송',
    '<span class="ok">↻</span> 매시 재수집 — 간접전환 <span class="cmd">+12건</span> 소급 반영 <span class="dim">2.4s</span>',
    '<span class="run">🎨</span> 소재 offer_story · 빈도 3.4 · CTR −28% → <span class="cmd">로테이션 요청</span>',
    '<span class="ok">🔀</span> LTV:CAC 상위 브랜드 키워드로 <span class="cmd">₩120k</span> 재배분 <span class="dim">제안</span>',
    '<span class="ok">✓</span> 가드레일 6종 <span class="ok">정상 순회</span> <span class="dim">다음 평가 60s</span>'
  ];
  function visAds() {
    return mw("광고 자동화", "예시", '<div class="mflow">' + [["🎨", "소재 요청"], ["🧩", "캠페인 빌더"], ["🚀", "API 집행"], ["🛡", "규칙이 감시"]].map(function (f, i) { return '<div><span>' + f[0] + '</span><b>' + f[1] + '</b></div>' + (i < 3 ? '<i>→</i>' : ''); }).join("") + '</div>' + term("ovA", "automation.log — 지금 걸려 있는 규칙"));
  }
  var CS = [["키워드 트렌드", "자동"], ["아이데이션", "반자동"], ["브리프", "자동"], ["제작", "반자동"], ["검수", "자동"], ["관리", "반자동"], ["발행", "자동"], ["성과", "자동"], ["자동화", "자동"]];
  function visContent() {
    return mw("블로그 파이프라인", "한 사이클 · 예시", '<div class="cs">' + CS.map(function (s, i) { return '<a class="cs-t" href="#/blog-0' + (i + 1) + '"><small>0' + (i + 1) + '</small><b>' + s[0] + '</b><span class="' + (s[1] === "자동" ? "a" : "") + '">' + s[1] + '</span></a>'; }).join("") + '</div><div class="cs-f">↺ 09 자동화 → 다시 01 키워드로 — 잘 된 글이 다음 주제를 만들어요</div>');
  }
  function visIntel() {
    return mw("시장 트래킹", "예시", '<div class="mi"><div class="mw-b mad"><div class="mad-h"><i>A</i><b>경쟁사 A</b><small>· 집행 21일째</small></div><div class="mad-img"><b>한달살기,<br>첫 계약 10% 할인</b></div><div class="mw-st" style="margin-top:12px">AI 분석</div><div class="mchips"><span class="tag">소구 · 가격</span><span class="tag">톤 · 긴급</span><span class="tag">CTA · 지금 예약</span></div></div>'
      + '<div class="mw-b"><div class="mw-st">키워드 수요 <small>월간 검색량</small></div>' + [["한달살기", "48,200", "▲ 12%", 1], ["단기임대", "31,500", "▲ 4%", 1], ["원룸 단기", "9,800", "▼ 3%", 0]].map(function (k) { return '<div class="mkw"><b>' + k[0] + '</b><em class="tnum">' + k[1] + '</em><span class="' + (k[3] ? "up" : "dn") + '">' + k[2] + '</span></div>'; }).join("") + '<div class="mw-st" style="margin-top:14px">예상 CPC</div><div class="mkw"><b>한달살기</b><em class="tnum">₩640</em><span>노출 2위</span></div></div></div>');
  }
  function visCollab() {
    return mw("타임라인", "오늘 · 예시", '<div class="mw-b ml">' + [["10:12", "🎨", "광고 소재 요청", "세트 B · 9:16 스토리 3종 — 코멘트 2"], ["11:00", "🗓", "주간 성과 회의", "할 일 3건이 캘린더에 자동 등록"], ["14:30", "🔗", "UTM 생성", "summer_promo · meta · story — 히스토리 저장"], ["16:05", "✅", "소재 승인 · 집행", "META 세트 B에 소재 연결 완료"]].map(function (t) { return '<div class="ml-r"><em class="tnum">' + t[0] + '</em><i>' + t[1] + '</i><div><b>' + t[2] + '</b><span>' + t[3] + '</span></div></div>'; }).join("") + '</div>');
  }
  var VIS = { "ov-dash": visDash, "ov-ads": visAds, "ov-content": visContent, "ov-intel": visIntel, "ov-collab": visCollab };

  function workSec(w, i) {
    return '<section class="ov-sec ow' + (i % 2 ? ' rev' : '') + '" id="' + w.id + '" style="--c:' + w.c + '"><div class="ow-in"><div class="ow-txt">'
      + '<div class="ow-tag"><i>' + w.ic + '</i>0' + (i + 1) + ' · ' + w.t + '</div><h2>' + w.h + '</h2><p class="ow-lead">' + w.lead + '</p>'
      + '<div class="ow-ba"><div><small>전</small>' + w.bf + '</div><i>→</i><div class="af"><small>후</small>' + w.af + '</div></div>'
      + '<ul class="ow-pts">' + w.pts.map(function (p) { return '<li>' + p + '</li>'; }).join("") + '</ul>'
      + '<div class="ov-demo"><span>데모에서 보기</span>' + w.demo.map(function (d) { return go(d[0], d[1]); }).join("") + '</div></div>'
      + '<div class="ow-vis">' + VIS[w.id]() + '</div></div></section>';
  }

  var RAIL = ["프롬프트 · 정의", "AI 코딩", "환경변수 · 시크릿", "자동 검증", "AI 코드리뷰 · 게이트", "코멘트 반영", "자동 게이트 통과", "머지", "배포 · 적용 보고"];
  var SC = [
    { name: "🧩 기능 추가", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"채널 LTV:CAC 3.0x↓ 축소 · 4.0x↑ 확대 자동 분류"</span>', '<span class="run">⚙</span> AI 코딩 — 판정 로직 · 배지 컴포넌트 <span class="dim">(파일 4)</span>', '<span class="dim">🔑</span> 환경변수 — 변경 없음 <span class="dim">(내부 로직)</span>', '<span class="run">⟳</span> 자동 검증 — 타입 <span class="ok">✓</span> 린트 <span class="ok">✓</span> 빌드 <span class="ok">✓</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"임계값은 상수로 빼자"</span> 코멘트 1', '<span class="run">✎</span> 코멘트 반영 — <span class="cmd">THRESHOLD</span> 분리 · 재검증 <span class="ok">✓</span>', '<span class="ok">✓</span> 자동 리뷰 게이트 통과 — <span class="ok">approved</span>', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #418</span> <span class="dim">(기능 1 = PR 1)</span>', '<span class="ok">✓</span> 배포 → 적용 보고 <span class="cmd">"적용되었어요"</span> <span class="dim">· 요청부터 38분</span>'] },
    { name: "🖥 화면 추가", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"레퍼럴 초대→가입→첫결제 퍼널 화면 추가"</span>', '<span class="run">⚙</span> AI 코딩 — 라우트 · 쿼리 · 차트 <span class="dim">(파일 7)</span>', '<span class="run">🔑</span> 환경변수 — <span class="cmd">REFERRAL_API_BASE</span> 추가 <span class="dim">(서버 시크릿)</span>', '<span class="run">⟳</span> 자동 검증 — 타입 · 린트 · 빌드 <span class="ok">통과</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"빈 상태 UI 필요"</span> 코멘트 1', '<span class="run">✎</span> 코멘트 반영 — empty-state · 로딩 스켈레톤 추가', '<span class="ok">✓</span> 자동 리뷰 게이트 통과', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #421</span>', '<span class="ok">✓</span> 배포 감시 <span class="dim">(2분 09초)</span> → 적용 보고'] },
    { name: "🎯 마케팅 배포", s: ['<span class="cmd">$ 프롬프트</span> <span class="dim">"9:16 스토리 소재 자동 검수 (비율 · 용량 · 안전영역)"</span>', '<span class="run">⚙</span> AI 코딩 — 소재 밸리데이터 · 카탈로그 피드 매핑 <span class="dim">(파일 5)</span>', '<span class="run">🔑</span> 환경변수 — <span class="cmd">CATALOG_TOKEN</span> 로테이션 <span class="dim">(값 노출 X)</span>', '<span class="run">⟳</span> 자동 검증 — 빌드 <span class="ok">통과</span> · 시크릿 스캔 <span class="ok">✓</span>', '<span class="run">👁</span> AI 코드리뷰 — <span class="dim">"검수 실패 사유를 로그로"</span> 코멘트', '<span class="run">✎</span> 코멘트 반영 — 실패 케이스 로깅 추가', '<span class="ok">✓</span> 자동 리뷰 게이트 통과', '<span class="ok">⇄</span> 머지 — <span class="cmd">PR #424</span>', '<span class="ok">✓</span> 배포 → 카탈로그 피드 반영 → 적용 보고'] }
  ];

  /* 맨 위 무대 — 포트폴리오 프로젝트 페이지 첫 화면과 같은 구성: 흐르는 프로젝트 이미지 벽 + 문장 A → 문장 B(진단 · 설계 · 실행) */
  var WALL = ["s16_01", "s19_00", "s20_00", "s21_00", "s10_02", "s12_01", "s14_00", "s23_00", "s24_00", "s26_01", "s27_01", "s28_02", "s18_01", "s18_02", "s19_03", "s20_03", "s21_05", "s14_06", "s29_00", "s12_02", "s10_00", "s18_11"];
  function stage() {
    var img = function (k) { return '<span class="ovs-t"><img src="/pf-img/ppt/' + WALL[k % WALL.length] + '.jpg" alt="" loading="lazy" decoding="async"></span>'; };
    var row = function (off) { var h = ""; for (var q = 0; q < 8; q++) h += img(off + q * 3); return h + h; };
    var A1 = [["콘텐츠·영상,", 1], ["퍼포먼스", 1], ["부터", 0], ["CRM·데이터", 1], ["까지", 0]];
    return '<section class="ovs" id="ov-top" aria-label="진단하고, 설계하고, 실행합니다"><div class="ovs-wall" aria-hidden="true">' + [0, 1, 2].map(function (x) { return '<div class="ovs-row' + (x % 2 ? ' rev' : '') + '" style="--dur:' + [90, 110, 80][x] + 's">' + row(x) + '</div>'; }).join("") + '</div>'
      + '<div class="ovs-c"><h1 class="ovs-h"><span class="ovs-p a" aria-hidden="true"><span class="ovs-l1">' + A1.map(function (w, k) { return '<span class="ovs-w" style="--i:' + k + '">' + (w[1] ? '<b>' + w[0] + '</b>' : w[0]) + '</span>'; }).join(" ") + '</span><span class="ovs-l2" style="--i:' + A1.length + '"><em>AX</em>로 자동화합니다</span></span>'
      + '<span class="ovs-p b">진단하고, 설계하고, 실행합니다</span></h1>'
      + '<div class="ovs-b"><a class="ovs-btn pri" href="#/total-dashboard">데모 콘솔 열기 →</a><button class="ovs-btn" type="button" data-ov-to="ov-intro">무엇을 하는지 보기 ↓</button></div></div>'
      + '<button class="ovs-cue" type="button" data-ov-to="ov-intro" aria-label="아래로"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></section>';
  }

  function render() {
    var embed = NW.EMBED;
    return '<div class="ovw">' + stage() + (embed ? '' : jump())
      /* 한눈에 보기 — 왜 만들었는지 한 문장 + 마케팅 업무 5가지 카드 */
      + '<section class="ov-hero" id="ov-intro"><div class="eyebrow">AX PROJECT · MARKETING CONSOLE <span class="demo-pill"><i></i>모든 수치는 예시 · 가상 데이터</span></div>'
      + '<h1>마케터가 매일 하는 일을,<br><em>한 화면에서 자동으로</em></h1>'
      + '<p class="ov-lede">성과 확인 · 광고 세팅 · 콘텐츠 발행 · 시장 조사 · 협업까지 —<br>여러 툴을 오가며 손으로 하던 마케팅 업무를 하나의 콘솔로 묶어 직접 만들고 운영했습니다.</p>'
      + '<div class="wm">' + WORK.map(function (w, i) { return '<button class="wm-c" type="button" data-ov-to="' + w.id + '" style="--c:' + w.c + '"><span class="wm-ic">' + w.ic + '</span><small>0' + (i + 1) + '</small><b>' + w.t + '</b><span class="wm-d">' + w.h + '</span><span class="wm-ba"><s>' + w.bf + '</s><em>' + w.af + '</em></span><i class="wm-go" aria-hidden="true">↓</i></button>'; }).join("") + '</div>'
      + '<p class="wm-hint">카드를 누르면 업무별 설명으로, <a href="#/total-dashboard">데모 콘솔</a>에서는 실제 화면을 가상 데이터로 직접 눌러 볼 수 있어요.</p></section>'

      + WORK.map(workSec).join("")

      /* 만든 방식 — 마케터가 AI로 직접 만들고 배포 */
      + '<section class="ov-sec" id="ov-how"><div class="ov-sh"><span class="code">06</span><span class="ov-kick">HOW IT\'S BUILT</span></div><h2>마케터가 AI로 직접 만들었어요</h2><p class="ov-desc">개발 요청을 기다리지 않고, 필요한 화면을 프롬프트로 만들어 바로 배포합니다. 기능 하나도 AI 코드리뷰 · 자동 검증을 거쳐야만 반영돼요.</p>'
      + '<div class="kg ov-stats">' + [["30", "+", "직접 만든 화면 · 도구"], ["600", "+", "누적 배포"], ["½", "일", "요청 → 배포까지"]].map(function (s) { return '<div class="kpi"><div class="kl">' + s[2] + '</div><div class="kv tnum"' + (/^\d+$/.test(s[0]) ? ' data-ov-n="' + s[0] + '"' : '') + '>' + s[0] + s[1] + '</div><div class="ks">예시 수치</div></div>'; }).join("") + '</div>'
      + '<div class="ov-g2x"><div class="card ov-rail" id="ovRail"><div class="lbl2" style="margin:0 0 8px" id="ovRailH">지금 실행 중 — 기능 추가</div>' + RAIL.map(function (r, i) { return '<div class="rl"><i>' + (i + 1) + '</i>' + r + '</div>'; }).join("") + '</div>' + term("ovT", "delivery.log — 요청 한 줄에서 배포까지") + '</div>'
      + '<div class="ow-rules">' + [["≡", "지표 정의는 하나", "어느 화면을 열어도 같은 기준의 같은 숫자"], ["🔒", "API 키는 서버에만", "화면 · 저장소 · AI 대화 어디에도 값이 남지 않게"], ["⏸", "광고는 일시중지로 생성", "사람이 확인한 뒤에만 라이브"]].map(function (r) { return '<div><i>' + r[0] + '</i><b>' + r[1] + '</b><span>' + r[2] + '</span></div>'; }).join("") + '</div></section>'

      + '<div class="ov-end"><div><b>이제 데모 콘솔에서 직접 눌러 보세요</b><span>대시보드 · 광고 빌더 · 콘텐츠 자동화 실행까지 모두 동작해요 (가상 데이터 · 이 브라우저에만 저장)</span></div><a class="btn btn-p lg" href="#/total-dashboard">데모 콘솔 열기 →</a></div>'
      + '<footer class="ov-foot">김진수 · Marketing &amp; AX — 이 페이지와 데모의 수치는 모두 예시이며 실제 데이터가 아닙니다</footer></div>';
  }

  /* 목차 = 헤더 아래 고정 바로가기 칩 줄(프로젝트 페이지 분야 바로가기와 같은 모양) + 오른쪽 '데모 콘솔 열기' */
  function jump() {
    return '<nav class="ov-jump" aria-label="목차"><div class="ov-jump-in"><div class="ov-jcs">'
      + TOC.map(function (t, i) { return '<button class="ov-jc' + (i ? '' : ' on') + '" type="button" data-ov-to="' + t[0] + '"><i>' + ("0" + i).slice(-2) + '</i>' + t[1] + '</button>'; }).join("")
      + '</div><a class="ov-jdemo" href="#/total-dashboard">데모 콘솔 열기 <span aria-hidden="true">→</span></a></div></nav>';
  }
  var topOff = function () { var j = document.querySelector(".ov-jump"), h = document.querySelector(".gh2"); return (h ? h.offsetHeight : 0) + (j ? j.offsetHeight : 0) + 12; }; // 고정 헤더 + 바로가기 줄 아래로

  /* 애니메이션 · 스크롤 스파이 (탭을 떠나면 모두 정리) */
  var timers = [], onScroll = null;
  var every = function (fn, ms) { timers.push(setInterval(fn, ms)); }, later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  function unmount() { timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = []; clearTimeout(shipT); if (onScroll) { removeEventListener("scroll", onScroll); onScroll = null; } }
  function typeLine(box, html) { var d = document.createElement("div"); d.className = "tln"; d.innerHTML = html + ' <span class="caret"></span>'; NW.$$(".caret", box).forEach(function (c) { c.remove(); }); box.appendChild(d); box.scrollTop = box.scrollHeight; }
  var si = 0, li = 0, shipT = null;
  function shipStep() {
    var box = document.getElementById("ovT"); if (!box) return;
    var sc = SC[si], rows = NW.$$("#ovRail .rl");
    if (li === 0) { box.innerHTML = ""; rows.forEach(function (r) { r.className = "rl"; }); document.getElementById("ovRailH").textContent = "지금 실행 중 — " + sc.name.replace(/^\S+\s/, ""); }
    rows.forEach(function (r, k) { r.classList.toggle("ok", k < li || li === 8); r.classList.toggle("run", k === li && li < 8); });
    typeLine(box, sc.s[li]);
    li++;
    if (li >= sc.s.length) { li = 0; shipT = setTimeout(function () { si = (si + 1) % SC.length; shipStep(); }, 3600); return; }
    shipT = setTimeout(shipStep, 1000);
  }
  function mount() {
    unmount();
    var st = document.querySelector(".ovs"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (st) { if (reduce) st.classList.add("ld", "sw"); else { later(function () { st.classList.add("ld"); }, 500); later(function () { st.classList.add("sw"); }, 4200); } }
    if (NW.EMBED) NW.$$('.ovw a[href^="#/"]').forEach(function (a) { a.href = "/ax" + a.getAttribute("href"); a.target = "_blank"; a.rel = "noopener"; });
    NW.$$("[data-ov-n]").forEach(function (el) { var n = +el.getAttribute("data-ov-n"), t0 = performance.now(); (function tick(t) { var p = Math.min(1, ((t || performance.now()) - t0) / 1200); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + "+"; if (p < 1) requestAnimationFrame(tick); })(); });
    var ci = 0, tiles = NW.$$(".cs-t"); if (!reduce) every(function () { tiles.forEach(function (t, k) { t.classList.toggle("hot", k === ci); }); ci = (ci + 1) % tiles.length; }, 1100);
    var ai = 0, abox = document.getElementById("ovA");
    (function aStep() { if (!document.getElementById("ovA")) return; if (ai === 0) abox.innerHTML = ""; typeLine(abox, AUTO[ai]); ai++; if (ai >= AUTO.length) { ai = 0; later(aStep, 3400); } else later(aStep, 1150); })();
    si = 0; li = 0; shipStep();
    var links = NW.$$(".ov-jump [data-ov-to]"), last = "";
    onScroll = function () {
      var y = topOff(), cur = TOC[0][0]; TOC.forEach(function (t) { var el = document.getElementById(t[0]); if (el && el.getBoundingClientRect().top < y + 40) cur = t[0]; });
      if (cur === last) return; last = cur;
      links.forEach(function (l) { var on = l.getAttribute("data-ov-to") === cur; l.classList.toggle("on", on); if (on && l.parentNode.scrollWidth > l.parentNode.clientWidth) l.parentNode.scrollTo({ left: l.offsetLeft - 24, behavior: "smooth" }); });
    };
    addEventListener("scroll", onScroll, { passive: true });
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-ov-to]"))) { var el = document.getElementById(b.getAttribute("data-ov-to")); if (el) window.scrollTo({ top: el.id === "ov-top" ? 0 : el.getBoundingClientRect().top + scrollY - topOff(), behavior: "smooth" }); return; }
  });

  NW.OVERVIEW = { render: render, mount: mount, unmount: unmount };
})(window.NW);
