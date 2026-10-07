/* AX-MKT 콘솔 · 개요 탭 — 이 콘솔이 대신해 주는 마케팅 업무 5가지(제목 · 한 줄 · 화면 하나) + 이 콘솔을 AI(Claude Code)로 어떻게 만들고 배포했는지(AX 방식).
   업무 화면의 수치는 모두 예시예요. 'AX 방식'의 커밋 수 등은 저장소 실제 기록(2026-10 기준)이에요. */
(function (NW) {
  "use strict";
  var D = NW.D;

  /* 라인 아이콘 (이모지 대신) */
  var IC = {
    dash: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    ads: '<path d="M3 11v2a2 2 0 0 0 2 2h1l4 4V5L6 9H5a2 2 0 0 0-2 2Z"/><path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14"/>',
    content: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    intel: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
    collab: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>'
  };
  var svg = function (k, sz) { return '<svg viewBox="0 0 24 24" width="' + (sz || 22) + '" height="' + (sz || 22) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; };

  var WORK = [
    { id: "ov-dash", ic: "dash", en: "DASHBOARD", t: "대시보드", s: "흩어진 성과를 한 장으로", h: "흩어진 성과를<br><span class=\"ov-gt\">한 장으로</span>", p: "매체별 리포트를 엑셀로 합치던 일을 없앴어요.", tags: ["매출 · ROAS · CAC", "채널 자동 판정", "목표 진척"], demo: ["total-dashboard", "대시보드 열어 보기"] },
    { id: "ov-ads", ic: "ads", en: "AD AUTOMATION", t: "광고 자동화", s: "세팅부터 감시까지 자동", h: "세팅은 버튼 한 번,<br><span class=\"ov-gt\">감시는 규칙이</span>", p: "META · 네이버 집행부터 예산 조정까지 자동으로.", tags: ["캠페인 빌더", "API 집행", "가드레일 6종"], demo: ["meta-ads", "광고 빌더 열어 보기"] },
    { id: "ov-content", ic: "content", en: "CONTENT", t: "콘텐츠 자동화", s: "키워드에서 발행까지", h: "키워드에서 발행까지,<br><span class=\"ov-gt\">9단계 자동화</span>", p: "블로그 한 사이클을 파이프라인으로 돌려요.", tags: ["키워드 추천", "AI 초안 · 검수", "성과 재활용"], demo: ["blog-journey", "파이프라인 열어 보기"] },
    { id: "ov-intel", ic: "intel", en: "MARKET", t: "시장 트래킹", s: "경쟁사 · 검색 수요 추적", h: "감 대신<br><span class=\"ov-gt\">시장 데이터로</span>", p: "경쟁사 광고와 키워드 검색량을 꾸준히 모아요.", tags: ["경쟁사 소재", "검색량 · 입찰가", "트렌드"], demo: ["search-kw", "키워드 도구 열어 보기"] },
    { id: "ov-collab", ic: "collab", en: "COLLABORATION", t: "협업 · 기록", s: "요청 · 회의를 한 곳에", h: "요청 · 회의 · 기록을<br><span class=\"ov-gt\">한 곳에</span>", p: "흩어지던 협업 기록이 콘솔 안에 남아요.", tags: ["요청 보드", "회의 캘린더", "UTM 생성기"], demo: ["ad-requests", "요청 보드 열어 보기"] }
  ];
  var TOC = WORK.map(function (w) { return [w.id, w.t]; }).concat([["ov-how", "AX 방식"]]);
  var go = function (d) { return '<a class="ow-go" href="#/' + d[0] + '">' + d[1] + ' <span>→</span></a>'; };
  var term = function (id, name, cls) { return '<div class="term' + (cls ? " " + cls : "") + '"><div class="term-h"><i></i><i></i><i></i><span id="' + id + 'N">' + name + '</span></div><div class="term-b" id="' + id + '"></div></div>'; };
  var badge = function (txt, cls) { return '<div class="ov-fb' + (cls ? " " + cls : "") + '">' + txt + '</div>'; };

  /* ── 업무별 오른쪽 화면 (예시) ── */
  function visDash() {
    var by = {}; D.contracts.forEach(function (c) { if (c.status === "COMPLETED" && c.completed_at) by[c.completed_at] = (by[c.completed_at] || 0) + (c.commission || 0); });
    var days = Object.keys(by).sort().slice(-30), v = days.map(function (d) { return by[d]; });
    var sm = v.map(function (_, i) { var a = v.slice(Math.max(0, i - 2), i + 1); return a.reduce(function (t, x) { return t + x; }, 0) / a.length; });
    var rev = v.reduce(function (t, x) { return t + x; }, 0), from = days[0] || "", spend = D.ads.filter(function (a) { return a.date >= from; }).reduce(function (t, a) { return t + a.spend; }, 0);
    var pay = D.contracts.filter(function (c) { return c.status === "COMPLETED" && c.completed_at >= from; }).reduce(function (t, c) { return t + c.paid_amount; }, 0);
    var W = 400, H = 120, mx = Math.max.apply(null, sm.concat([1])), mn = Math.min.apply(null, sm.concat([mx]));
    var pts = sm.map(function (y, i) { return [(i / Math.max(1, sm.length - 1) * W).toFixed(1), (H - 8 - (y - mn) / Math.max(1, mx - mn) * (H - 24)).toFixed(1)]; });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ");
    var wS = function (x) { return x >= 1e8 ? (x / 1e8).toFixed(1) + "억" : Math.round(x / 1e4).toLocaleString("ko-KR") + "만"; };
    var mk = function (l, x) { return '<div class="ov-mk"><small>' + l + '</small><b class="tnum">' + x + '</b></div>'; };
    return '<div class="mc"><div class="mc-h">Total Dashboard <small>최근 30일 · 예시</small></div><div class="mk3">' + mk("결제금액", wS(pay) + "원") + mk("매출", wS(rev) + "원") + mk("광고비", wS(spend) + "원") + '</div>'
      + '<svg class="mch" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ovG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3182f6" stop-opacity=".22"/><stop offset="1" stop-color="#3182f6" stop-opacity="0"/></linearGradient></defs><path d="' + line + ' L' + W + ' ' + H + ' L0 ' + H + 'Z" fill="url(#ovG)"/><path d="' + line + '" fill="none" stroke="#3182f6" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg>'
      + '<div class="mch-x"><span>30일 전</span><span>일별 매출</span><span>오늘</span></div></div>'
      + badge('<i class="ov-up">▲</i> ROAS <b>' + (spend ? rev / spend * 100 : 0).toFixed(0) + '%</b>', "tr");
  }
  var AUTO = [
    '<span class="run">●</span> ROAS <span class="cmd">2.7x</span> &lt; 3.0x · 3일 → 예산 <span class="cmd">−20%</span>',
    '<span class="run">●</span> CAC <span class="cmd">₩48,200</span> &gt; 상한 → 세트 B <span class="run">일시중지</span>',
    '<span class="ok">●</span> 성과 재수집 · 전환 <span class="cmd">+12건</span> 반영',
    '<span class="run">●</span> CTR −28% → 소재 <span class="cmd">교체 요청</span>',
    '<span class="ok">●</span> 규칙 6개 <span class="ok">정상</span> <span class="dim">· 다음 점검 60s</span>'
  ];
  function visAds() {
    return '<div class="mc"><div class="mc-h">자동화 규칙 <small>켜짐 3 · 예시</small></div>' + [["ROAS 3.0x 미만 · 3일", "예산 −20%"], ["CAC ₩45,000 초과", "세트 일시중지"], ["CTR 25% 하락", "소재 교체"]].map(function (r) { return '<div class="ar-row"><div><b>' + r[0] + '</b><span>→ ' + r[1] + '</span></div><i class="tg" aria-hidden="true"></i></div>'; }).join("") + '</div>'
      + term("ovA", "automation.log", "sm") + badge('<i class="dot"></i>세트 B 자동 일시중지', "tr");
  }
  var CS = ["키워드", "아이데이션", "브리프", "제작", "검수", "관리", "발행", "성과", "재활용"];
  function visContent() {
    return '<div class="mc"><div class="mc-h">블로그 파이프라인 <small id="csN">01 / 09</small></div><div class="cs-bar"><i id="csB"></i></div><div class="cs">' + CS.map(function (s, i) { return '<a class="cs-t" href="#/blog-0' + (i + 1) + '"><small>0' + (i + 1) + '</small><b>' + s + '</b></a>'; }).join("") + '</div></div>'
      + badge('자동 <b>6</b> · 반자동 <b>3</b>', "tr");
  }
  function visIntel() {
    return '<div class="mc"><div class="mc-h">키워드 검색량 <small>월간 · 예시</small></div>' + [["한달살기", 48200, "+12%", 1], ["단기임대", 31500, "+4%", 1], ["원룸 단기", 9800, "−3%", 0]].map(function (k) { return '<div class="mkw"><b>' + k[0] + '</b><span class="mkw-b"><i style="width:' + (k[1] / 482) + '%"></i></span><em class="tnum">' + k[1].toLocaleString("ko-KR") + '</em><span class="' + (k[3] ? "ov-up" : "ov-dn") + '">' + k[2] + '</span></div>'; }).join("") + '</div>'
      + '<div class="fad"><div class="fad-i"><b>한달살기<br>첫 계약 10%</b></div><div class="fad-t"><b>경쟁사 A</b><span>집행 21일째 · 소구 가격</span></div></div>';
  }
  function visCollab() {
    return '<div class="mc ml"><div class="mc-h">오늘의 기록 <small>예시</small></div>' + [["10:12", "디", "#3182f6", "광고 소재 요청", "스토리 3종 · 코멘트 2"], ["11:00", "마", "#7c5cff", "주간 성과 회의", "할 일 3건 자동 등록"], ["14:30", "김", "#00b8a9", "UTM 생성", "summer_promo · meta"], ["16:05", "디", "#3182f6", "소재 승인 · 집행", "META 세트 B 연결"]].map(function (t) { return '<div class="ml-r"><em class="tnum">' + t[0] + '</em><i style="--a:' + t[2] + '">' + t[1] + '</i><div><b>' + t[3] + '</b><span>' + t[4] + '</span></div></div>'; }).join("") + '</div>'
      + badge('<i class="dot ok"></i>할 일 3건 자동 등록', "br");
  }
  var VIS = { "ov-dash": visDash, "ov-ads": visAds, "ov-content": visContent, "ov-intel": visIntel, "ov-collab": visCollab };

  function workSec(w, i) {
    return '<section class="ov-sec ow' + (i % 2 ? ' rev' : '') + '" id="' + w.id + '"><div class="ow-in"><div class="ow-txt ov-rv">'
      + '<div class="ow-k"><span class="ow-ic">' + svg(w.ic, 18) + '</span><span class="ov-mono">0' + (i + 1) + ' — ' + w.en + '</span></div><h2>' + w.h + '</h2><p>' + w.p + '</p>'
      + '<div class="ow-tags">' + w.tags.map(function (t) { return '<span>' + t + '</span>'; }).join("") + '</div>' + go(w.demo) + '</div>'
      + '<div class="ow-vis ov-rv"><div class="ow-stage">' + VIS[w.id]() + '</div></div></div></section>';
  }

  /* ── AX 방식: 이 콘솔을 AI(Claude Code)로 만들고 배포한 방법 — 수치는 저장소 실제 기록(2026-10-07 기준) ── */
  var AX_STAT = [["300", "", "커밋", "2026.08.09 첫 커밋부터"], ["87", "%", "AI 공동 작성 커밋", "300개 중 260개"], ["114", "", "브랜치 머지", "작업 1개 = 브랜치 1개"], ["14", "", "데모 화면", "이 콘솔의 메뉴"]];
  var FLOW = [["요청", "한국어 한 줄로"], ["탐색", "코드 · 메모리 읽고 계획"], ["구현", "작업 브랜치에서 수정"], ["검증", "로컬 서버 · 화면 캡처"], ["배포", "main 머지 → Vercel"], ["확인", "라이브 대조 → 반영 완료"]];
  var KIT = [
    ["CLI", "Claude Code", "터미널에서 대화로 코드를 읽고, 고치고, 실행해요."],
    ["PARALLEL", "병렬 세션", "로컬 · 클라우드 세션을 작업별로 동시에 돌려요."],
    ["SUBAGENT", "서브에이전트", "넓은 코드 탐색 · 리뷰는 별도 에이전트에 나눠요."],
    ["MEMORY", "메모리 · 규칙", "작업 규칙 · 배포 좌표를 기억해 세션이 바뀌어도 그대로."],
    ["MCP", "도구 연결", "브라우저 · GitHub · DB를 AI가 직접 다뤄요."],
    ["VERIFY", "화면 검증", "헤드리스 크롬으로 데스크톱 · 모바일을 캡처해 대조해요."],
    ["REVIEW", "코드 리뷰", "머지 전에 버그 · 중복 코드를 한 번 더 걸러요."],
    ["ROUTINE", "예약 루틴", "매주 월요일 09:00, DB가 잠들지 않게 자동 실행."]
  ];
  var RULES = [["push로 끝내지 않기", "라이브 화면까지 확인한 뒤에 '반영 완료'"], ["로컬 문서는 커밋 금지", "파일을 지정해서 add · 제외 목록 유지"], ["남의 작업 덮어쓰기 금지", "작업 전 git fetch로 최신부터"], ["비밀값은 서버에만", "공개 저장소에 키 · 비밀번호 0"]];
  var LANES = [["로컬 · 맥", "AX 개요 개편", "ov-polish"], ["클라우드 A", "프로젝트 카드 정리", "projects-card"], ["클라우드 B", "이력서 서비스 토글", "exp-toggle"]];
  var SC = [
    ["AX 개요 개편", ['<span class="dim">~/resume-studio</span> <span class="cmd">$ claude</span>', '<b>&gt;</b> /ax 개요를 마케팅 업무별로 쉽게 바꿔줘', '<span class="run">●</span> 메모리 확인 <span class="dim">— 배포 규칙 · 프로젝트 좌표</span>', '<span class="run">●</span> Read <span class="cmd">mkt-console/overview.js</span>', '<span class="run">●</span> Edit <span class="cmd">overview.js · ax.css</span>', '<span class="run">●</span> 캡처 확인 <span class="dim">— 1360px · 500px</span>', '<span class="run">●</span> git merge --no-ff → <span class="cmd">push origin main</span>', '<span class="run">●</span> 라이브 해시 = main <span class="ok">✓</span> <span class="dim">32초</span>', '<span class="ok">✓ 반영 완료</span> <span class="dim">— 화면까지 확인했어요</span>']],
    ["병렬 작업", ['<span class="dim">cloud-session-A</span> <span class="cmd">$ claude</span>', '<b>&gt;</b> 프로젝트 카드를 세로 2:3으로 바꿔줘', '<span class="run">●</span> git fetch <span class="dim">— main이 3커밋 앞서 있음 → 최신으로</span>', '<span class="run">●</span> 브랜치 <span class="cmd">projects-card</span> 생성', '<span class="run">●</span> 서브에이전트 <span class="dim">— 영향 받는 화면 탐색</span>', '<span class="run">●</span> Edit <span class="cmd">templates.js</span>', '<span class="run">●</span> 전 · 후 캡처 비교', '<span class="run">●</span> push → Vercel 배포 <span class="dim">≈40초</span>', '<span class="ok">✓ 반영 완료</span>']]
  ];
  function axSec() {
    return '<section class="ax-sec" id="ov-how"><div class="ax-in">'
      + '<div class="ax-head ov-rv"><div class="ow-k"><span class="ov-mono">06 — HOW IT\'S BUILT · AX</span></div><h2>개발자 없이,<br><span class="ov-gt">AI와 둘이서</span> 만들고 배포했어요</h2><p>Claude Code(CLI)를 개발 파트너로 두고, 요청 한 줄에서 라이브 확인까지 한 흐름으로 돌렸어요.</p></div>'
      + '<div class="ax-stats ov-rv">' + AX_STAT.map(function (s) { return '<div><b class="tnum" data-ov-n="' + s[0] + '" data-ov-u="' + s[1] + '">' + s[0] + s[1] + '</b><span>' + s[2] + '</span><small>' + s[3] + '</small></div>'; }).join("") + '</div><p class="ax-src">저장소 실제 기록 · 2026년 10월 기준</p>'
      + '<div class="ax-blk ov-rv"><div class="ax-lb"><span class="ov-mono">WORKFLOW</span>요청 한 줄이 라이브가 되기까지</div><ol class="ax-flow">' + FLOW.map(function (f, i) { return '<li><i class="ov-mono">0' + (i + 1) + '</i><b>' + f[0] + '</b><span>' + f[1] + '</span></li>'; }).join("") + '</ol></div>'
      + '<div class="ax-two ov-rv"><div><div class="ax-lb"><span class="ov-mono">CLI</span>실제 작업은 이렇게 흘러가요</div>' + term("ovT", "claude — AX 개요 개편", "ax-term") + '</div>'
      + '<div><div class="ax-lb"><span class="ov-mono">PARALLEL</span>여러 작업을 동시에</div><div class="lanes">' + LANES.map(function (l, i) { return '<div class="lane" style="--d:' + (i * 0.9) + 's"><div class="lane-h"><b>' + l[1] + '</b><span>' + l[0] + '</span></div><div class="lane-t"><i></i></div><code>' + l[2] + '</code></div>'; }).join("") + '<div class="lane-m"><i></i><b>main</b><span>머지 → Vercel 자동 배포</span></div></div></div></div>'
      + '<div class="ax-blk ov-rv"><div class="ax-lb"><span class="ov-mono">TOOLKIT</span>쓴 도구와 방식</div><div class="kit">' + KIT.map(function (k) { return '<div><span class="ov-mono">' + k[0] + '</span><b>' + k[1] + '</b><p>' + k[2] + '</p></div>'; }).join("") + '</div></div>'
      + '<div class="ax-blk ov-rv"><div class="ax-lb"><span class="ov-mono">GUARDRAILS</span>AI에게 준 규칙</div><div class="ax-rules">' + RULES.map(function (r, i) { return '<div><i class="ov-mono">0' + (i + 1) + '</i><b>' + r[0] + '</b><span>' + r[1] + '</span></div>'; }).join("") + '</div></div>'
      + '</div></section>';
  }

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
      + '<section class="ov-hero" id="ov-intro"><div class="ow-k ov-rv"><span class="ov-mono">AX-MKT CONSOLE</span></div><h1 class="ov-rv">마케터가 매일 하는 일을,<br>한 화면에서 <span class="ov-gt">자동으로</span></h1><p class="ov-sub ov-rv">성과 확인부터 광고 · 콘텐츠 · 협업까지, 직접 만들어 운영한 마케팅 콘솔</p>'
      + '<div class="wm ov-rv">' + WORK.map(function (w, i) { return '<button class="wm-c" type="button" data-ov-to="' + w.id + '"><span class="wm-ic">' + svg(w.ic) + '</span><small class="ov-mono">0' + (i + 1) + '</small><b>' + w.t + '</b><span>' + w.s + '</span><i class="wm-go" aria-hidden="true">↓</i></button>'; }).join("") + '</div></section>'
      + WORK.map(workSec).join("")
      + axSec()
      + '<div class="ov-end ov-rv"><div><b>데모 콘솔에서 직접 눌러 보세요</b><span>대시보드 · 광고 빌더 · 콘텐츠 자동화까지 모두 동작해요</span></div><a class="btn btn-p lg" href="#/total-dashboard">데모 콘솔 열기 →</a></div>'
      + '<footer class="ov-foot">업무 화면의 수치는 모두 예시 · 가상 데이터예요</footer></div>';
  }

  /* 목차 = 헤더 아래 고정 바로가기 칩 줄 + 오른쪽 '데모 콘솔 열기' */
  function jump() {
    return '<nav class="ov-jump" aria-label="목차"><div class="ov-jump-in"><div class="ov-jcs">'
      + TOC.map(function (t) { return '<button class="ov-jc" type="button" data-ov-to="' + t[0] + '">' + t[1] + '</button>'; }).join("")
      + '</div><a class="ov-jdemo" href="#/total-dashboard">데모 콘솔 열기 <span aria-hidden="true">→</span></a></div></nav>';
  }
  var topOff = function () { var j = document.querySelector(".ov-jump"), h = document.querySelector(".gh2"); return (h ? h.offsetHeight : 0) + (j ? j.offsetHeight : 0) + 12; }; // 고정 헤더 + 바로가기 줄 아래로

  /* 애니메이션 · 스크롤 스파이 (탭을 떠나면 모두 정리) */
  var timers = [], onScroll = null, reveal = null;
  var every = function (fn, ms) { timers.push(setInterval(fn, ms)); }, later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  function unmount() { timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = []; clearTimeout(shipT); if (onScroll) { removeEventListener("scroll", onScroll); onScroll = null; } }
  function typeLine(box, html) { var d = document.createElement("div"); d.className = "tln"; d.innerHTML = html + ' <span class="caret"></span>'; NW.$$(".caret", box).forEach(function (c) { c.remove(); }); box.appendChild(d); box.scrollTop = box.scrollHeight; }
  var si = 0, li = 0, shipT = null;
  function shipStep() {
    var box = document.getElementById("ovT"); if (!box) return;
    var sc = SC[si];
    if (li === 0) { box.innerHTML = ""; document.getElementById("ovTN").textContent = "claude — " + sc[0]; }
    typeLine(box, sc[1][li]);
    li++;
    if (li >= sc[1].length) { li = 0; shipT = setTimeout(function () { si = (si + 1) % SC.length; shipStep(); }, 3600); return; }
    shipT = setTimeout(shipStep, li === 1 ? 700 : 900);
  }
  function countUp(el) { var n = +el.getAttribute("data-ov-n"), u = el.getAttribute("data-ov-u") || "", t0 = performance.now(); (function tick(t) { var p = Math.min(1, ((t || performance.now()) - t0) / 1400); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + u; if (p < 1) requestAnimationFrame(tick); })(); }
  function mount() {
    unmount();
    var st = document.querySelector(".ovs"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (st) { if (reduce) st.classList.add("ld", "sw"); else { later(function () { st.classList.add("ld"); }, 500); later(function () { st.classList.add("sw"); }, 4200); } }
    if (NW.EMBED) NW.$$('.ovw a[href^="#/"]').forEach(function (a) { a.href = "/ax" + a.getAttribute("href"); a.target = "_blank"; a.rel = "noopener"; });
    /* 스크롤하면 하나씩 떠오르기 · 숫자 카운트업 — IntersectionObserver 대신 위치 검사(숨은 창 · 임베드에서도 확실히 보이게) */
    var rv = NW.$$(".ovw .ov-rv");
    reveal = function () { var h = innerHeight * 0.92; rv = rv.filter(function (el) { if (!reduce && el.getBoundingClientRect().top > h) return true; el.classList.add("in"); NW.$$("[data-ov-n]", el).forEach(countUp); return false; }); };
    reveal(); every(function () { if (rv.length) reveal(); }, 500); // 스크롤 이벤트가 늦게 와도(숨은 창 · 빠른 점프) 놓치지 않게
    /* 콘텐츠 9단계 순환 */
    var ci = 0, tiles = NW.$$(".cs-t"), csN = document.getElementById("csN"), csB = document.getElementById("csB");
    var csTick = function () { tiles.forEach(function (t, k) { t.classList.toggle("hot", k === ci); t.classList.toggle("done", k < ci); }); if (csN) csN.textContent = "0" + (ci + 1) + " / 09"; if (csB) csB.style.width = ((ci + 1) / 9 * 100) + "%"; ci = (ci + 1) % tiles.length; };
    csTick(); if (!reduce) every(csTick, 1100);
    var ai = 0, abox = document.getElementById("ovA");
    (function aStep() { if (!document.getElementById("ovA")) return; if (ai === 0) abox.innerHTML = ""; typeLine(abox, AUTO[ai]); ai++; if (ai >= AUTO.length) { ai = 0; later(aStep, 3400); } else later(aStep, 1150); })();
    si = 0; li = 0; shipStep();
    var links = NW.$$(".ov-jump [data-ov-to]"), last = "";
    onScroll = function () {
      if (rv.length) reveal();
      var y = topOff(), cur = ""; TOC.forEach(function (t) { var el = document.getElementById(t[0]); if (el && el.getBoundingClientRect().top < y + 40) cur = t[0]; });
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
