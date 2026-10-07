/* AX-MKT 콘솔 · 개요 탭 — 에디토리얼 레이아웃(왼쪽 작은 라벨 · 오른쪽 본문, 가는 구분선, 단색 배경 위 실제 데모 화면 캡처).
   업무 5가지 + 이 콘솔을 AI(Claude Code)로 만든 방식. 화면 이미지는 /pf-img/ax/*.jpg(데모 콘솔 실제 캡처 · 가상 데이터),
   'AX 방식'의 커밋 수 등은 저장소 실제 기록(2026-10-07 기준)이에요. */
(function (NW) {
  "use strict";

  var WORK = [
    { id: "ov-dash", t: "대시보드", s: "흩어진 성과를 한 장으로", h: "흩어진 성과를 *한 장으로*", p: "매체별 리포트를 내려받아 엑셀로 합치던 일을 없앴어요. 결제 · 매출 · 광고비를 같은 기준으로 보고, 채널마다 확대 · 유지 · 축소를 자동으로 판정해요.", img: "total-dashboard", cap: "Total Dashboard — 최근 30일 스냅샷", bg: "#e3e6df", demo: ["total-dashboard", "Total Dashboard"] },
    { id: "ov-ads", t: "광고 자동화", s: "세팅은 버튼 한 번, 감시는 규칙이", h: "세팅은 *버튼 한 번*, 감시는 *규칙이*", p: "캠페인 → 세트 → 소재를 트리로 짜고 META · 네이버에 바로 집행해요. 라이브 이후엔 ROAS · CAC 규칙이 예산을 줄이거나 세트를 멈춰요.", img: "meta-ads", cap: "META Ads 캠페인 빌더", bg: "#ebe5da", demo: ["meta-ads", "META Ads 빌더"] },
    { id: "ov-content", t: "콘텐츠 자동화", s: "키워드에서 발행까지 9단계", h: "키워드에서 발행까지, *9단계*", p: "블로그 한 편을 키워드 · 기획 · 브리프 · 제작 · 검수 · 발행 · 성과 · 재활용까지 아홉 단계로 나눠, 단계마다 담당 에이전트가 이어받아요.", img: "blog-journey", cap: "블로그 파이프라인 — 여정 맵", bg: "#dfe4ea", demo: ["blog-journey", "블로그 파이프라인"] },
    { id: "ov-intel", t: "시장 트래킹", s: "감 대신 검색 수요와 경쟁사로", h: "감 대신, *검색 수요*와 *경쟁사*로", p: "키워드 검색 추이와 경쟁사가 지금 돌리는 광고를 꾸준히 모아요. 소재 방향과 키워드 예산을 정할 때 근거로 써요.", img: "keyword-trend", cap: "Keyword Trend — 주간 검색 상대지수", bg: "#e8e1e3", demo: ["keyword-trend", "Keyword Trend"], demo2: ["competitor-ads", "경쟁사 광고"] },
    { id: "ov-collab", t: "협업 · 기록", s: "요청 · 회의 · 기록을 한 곳에", h: "요청 · 회의 · 기록을 *한 곳에*", p: "광고 · 디자인 요청은 한 표에서 소재와 코멘트까지 주고받고, 회의 · 할 일 · UTM 기록이 콘솔 안에 남아요.", img: "ad-requests", cap: "광고 & 디자인 요청 보드", bg: "#e4e3dd", demo: ["ad-requests", "요청 보드"], demo2: ["meetings", "회의 캘린더"] }
  ];
  var TOC = WORK.map(function (w) { return [w.id, w.t]; }).concat([["ov-how", "AX 방식"]]);
  var n2 = function (i) { return "0" + (i + 1); };
  var em = function (t) { return t.replace(/\*([^*]+)\*/g, "<strong>$1</strong>"); };
  var hd = function (t) { return '<h2 class="ed-h" data-rv><span>' + em(t) + '</span></h2>'; }; // 줄 단위로 아래에서 올라오는 제목
  var rule = '<i class="ed-rule" data-rv aria-hidden="true"></i>';
  var lnk = function (d) { return '<a class="ed-link" href="#/' + d[0] + '">' + d[1] + ' <span aria-hidden="true">↗</span></a>'; };

  function workSec(w, i) {
    return '<section class="ed-sec" id="' + w.id + '">' + rule + '<div class="ed-row"><div class="ed-lab"><span>(' + n2(i) + ')</span>' + w.t + '</div>'
      + '<div class="ed-main">' + hd(w.h) + '<p data-rv style="--d:.12s">' + w.p + '</p><div class="ed-links" data-rv style="--d:.2s">' + lnk(w.demo) + (w.demo2 ? lnk(w.demo2) : '') + '</div></div></div>'
      + '<figure class="ed-fig"><a class="ed-stage" data-rv data-cur="열어 보기" href="#/' + w.demo[0] + '" style="--bg:' + w.bg + '" aria-label="' + w.cap + ' 데모 열기"><img src="/pf-img/ax/' + w.img + '.jpg" alt="' + w.cap + ' 화면" loading="lazy" decoding="async"></a>'
      + '<figcaption><span>그림 ' + (i + 1) + ' · ' + w.cap + '</span><span>데모 콘솔 실제 화면 · 가상 데이터</span></figcaption></figure></section>';
  }

  /* AX 방식 — 저장소 실제 기록(2026-10-07): 커밋 300 · Claude 공동 작성 260 · 머지 114 · 첫 커밋 2026-08-09 */
  var FACTS = [["300", "커밋", "2026년 8월 9일 첫 커밋부터"], ["87%", "AI와 함께 쓴 커밋", "300개 중 260개"], ["114", "브랜치 머지", "작업 하나에 브랜치 하나"], ["2개월", "만든 기간", "포트폴리오 · 이력서 · 이 콘솔까지"]];
  var FLOW = [["요청", "하고 싶은 걸 한국어 한 줄로 말해요."], ["탐색", "AI가 코드와 메모리(작업 규칙 · 배포 주소)를 읽고 계획을 세워요."], ["구현", "작업마다 브랜치를 따로 만들어 그 안에서만 고쳐요."], ["검증", "로컬 서버를 띄우고 데스크톱 · 모바일 화면을 캡처해 눈으로 확인해요."], ["배포", "main에 머지하고 push하면 Vercel이 자동으로 배포해요."], ["확인", "라이브 파일이 main과 같은지 대조하고, 화면까지 본 뒤에 '반영 완료'라고 보고해요."]];
  var TOOLS = [["Claude Code", "터미널에서 대화로 코드를 읽고, 고치고, 실행하는 개발 파트너"], ["병렬 세션", "맥 로컬과 클라우드 세션을 작업별로 동시에 — 머지 전 git fetch로 충돌을 막아요"], ["서브에이전트", "넓은 코드 탐색이나 리뷰는 별도 에이전트에 나눠 맡겨요"], ["메모리", "작업 규칙 · 배포 좌표 · 디자인 취향을 기억해, 세션이 바뀌어도 그대로 이어가요"], ["MCP 연결", "브라우저 · GitHub · DB를 AI가 직접 열고 확인해요"], ["헤드리스 캡처", "크롬을 화면 없이 띄워 데스크톱 · 모바일 폭으로 찍고 비교해요"], ["코드 리뷰", "머지 전에 버그와 중복 코드를 한 번 더 걸러요"], ["예약 루틴", "매주 월요일 09:00, 무료 DB가 잠들지 않게 자동으로 깨워요"]];
  var RULES = [["push로 끝내지 않는다", "라이브 화면까지 확인해야 끝"], ["로컬 문서는 올리지 않는다", "파일을 하나씩 지정해서 커밋"], ["남의 작업을 덮어쓰지 않는다", "작업 전에 항상 최신부터"], ["비밀값은 서버에만 둔다", "공개 저장소에 키 · 비밀번호 0"]];
  var SESSION = [
    ['p', '~/resume-studio', '$ claude'],
    ['u', '›', '/ax 개요를 마케팅 업무별로 쉽게 바꿔줘'],
    ['a', '●', '메모리 확인 — 배포 규칙, 프로젝트 좌표, 디자인 취향'],
    ['a', '●', 'Read mkt-console/overview.js'],
    ['a', '●', 'git checkout -b ov-easy-work-areas'],
    ['a', '●', 'Edit overview.js, ax.css'],
    ['a', '●', '헤드리스 크롬 캡처 — 1360px · 500px'],
    ['a', '●', 'git merge --no-ff → push origin main'],
    ['a', '●', '라이브 해시 = main  ✓  (16초)'],
    ['k', '✓', '반영 완료 — 화면까지 확인했어요']
  ];
  function axSec() {
    var row = function (lab, body) { return '<div class="ed-row ed-sub"><div class="ed-lab">' + lab + '</div><div class="ed-main">' + body + '</div></div>'; };
    return '<section class="ed-sec ed-ax" id="ov-how">' + rule + '<div class="ed-row"><div class="ed-lab"><span>(06)</span>AX 방식</div><div class="ed-main">' + hd("개발자 없이, *AI와 둘이서* 만들었어요") + '<p data-rv style="--d:.12s">Claude Code를 개발 파트너로 두고, 요청 한 줄에서 라이브 확인까지 한 흐름으로 돌렸어요. 아래 숫자는 이 콘솔이 들어 있는 포트폴리오 저장소의 실제 기록이에요.</p></div></div>'
      + '<dl class="ed-facts">' + FACTS.map(function (f, i) { var m = /^(\d+)(.*)$/.exec(f[0]); return '<div data-rv style="--d:' + (i * 0.08) + 's"><dt>' + f[1] + '</dt><dd><b class="tnum"><span data-cnt="' + m[1] + '">' + m[1] + '</span><small>' + m[2] + '</small></b><span>' + f[2] + '</span></dd></div>'; }).join("") + '</dl>'
      + row("작업 흐름", '<ol class="ed-list ed-flow">' + FLOW.map(function (f, i) { return '<li data-rv style="--d:' + (i * 0.06) + 's"><i>' + n2(i) + '</i><b>' + f[0] + '</b><span>' + f[1] + '</span></li>'; }).join("") + '</ol>')
      + row("실제 세션", '<div class="ed-term" data-rv data-type role="img" aria-label="Claude Code 작업 세션 예시">' + SESSION.map(function (l) { return '<div class="t-' + l[0] + '"><i>' + l[1] + '</i>' + l[2] + '</div>'; }).join("") + '</div><p class="ed-note">이 페이지를 고칠 때의 세션을 옮겨 적었어요.</p>')
      + row("쓴 도구", '<dl class="ed-list ed-tools">' + TOOLS.map(function (t, i) { return '<div data-rv style="--d:' + (i * 0.05) + 's"><dt>' + t[0] + '</dt><dd>' + t[1] + '</dd></div>'; }).join("") + '</dl>')
      + row("지킨 규칙", '<ol class="ed-list ed-flow">' + RULES.map(function (r, i) { return '<li data-rv style="--d:' + (i * 0.06) + 's"><i>' + n2(i) + '</i><b>' + r[0] + '</b><span>' + r[1] + '</span></li>'; }).join("") + '</ol>')
      + '</section>';
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
    return '<div class="ovw ed">' + stage() + (embed ? '' : jump())
      + '<section class="ed-sec ed-intro" id="ov-intro"><div class="ed-row"><div class="ed-lab"><span>AX-MKT 콘솔</span>2026 · 설계 · 개발 · 운영</div>'
      + '<div class="ed-main"><p class="ed-state" id="edState"><strong>마케터가 매일 하는 일을 한 화면에서.</strong> ' + "성과 확인, 광고 집행, 콘텐츠 발행, 시장 조사, 협업 기록까지 — 흩어진 도구 대신 직접 만든 콘솔로 운영했어요.".split(" ").map(function (w) { return '<span class="w">' + w + '</span>'; }).join(" ") + '</p>'
      + '<ol class="ed-index">' + WORK.map(function (w, i) { return '<li data-rv style="--d:' + (i * 0.06) + 's"><button type="button" data-ov-to="' + w.id + '" data-peek="/pf-img/ax/' + w.img + '.jpg"><i>' + n2(i) + '</i><b>' + w.t + '</b><span>' + w.s + '</span><em aria-hidden="true">↓</em></button></li>'; }).join("")
      + '<li data-rv style="--d:.3s"><button type="button" data-ov-to="ov-how"><i>06</i><b>AX 방식</b><span>AI와 함께 만들고 배포한 방법</span><em aria-hidden="true">↓</em></button></li></ol></div></div></section>'
      + WORK.map(workSec).join("")
      + axSec()
      + '<section class="ed-sec ed-end">' + rule + '<div class="ed-row"><div class="ed-lab"><span>(07)</span>데모</div><div class="ed-main">' + hd("직접 *눌러 보세요*") + '<p data-rv style="--d:.12s">숫자를 누르면 목록이 열리고, 광고 빌더와 콘텐츠 자동화도 실제로 돌아가요. 데이터는 전부 가상이고 이 브라우저에만 저장돼요.</p><a class="ed-btn" data-rv style="--d:.2s" href="#/total-dashboard">데모 콘솔 열기 <span aria-hidden="true">→</span></a></div></div></section>'
      + '<div class="ed-peek" aria-hidden="true"><img alt=""></div><div class="ed-cur" aria-hidden="true"><span></span></div>'
      + '<footer class="ov-foot ed-foot"><span>김진수 · Marketing &amp; AX</span><span>화면 속 수치는 모두 가상 데이터예요</span></footer></div>';
  }

  /* 목차 = 헤더 아래 고정 바로가기 줄 + 오른쪽 '데모 콘솔 열기' */
  function jump() {
    return '<nav class="ov-jump" aria-label="목차"><div class="ov-jump-in"><div class="ov-jcs">'
      + TOC.map(function (t) { return '<button class="ov-jc" type="button" data-ov-to="' + t[0] + '">' + t[1] + '</button>'; }).join("")
      + '</div><a class="ov-jdemo" href="#/total-dashboard">데모 콘솔 열기 <span aria-hidden="true">→</span></a></div></nav>';
  }
  var topOff = function () { var j = document.querySelector(".ov-jump"), h = document.querySelector(".gh2"); return (h ? h.offsetHeight : 0) + (j ? j.offsetHeight : 0) + 12; }; // 고정 헤더 + 바로가기 줄 아래로

  /* 모션: 등장(위치 검사 — 숨은 창에서도 확실히) · 소개 문장 단어 진해짐 · 그림 시차 · 숫자 카운트업 · 세션 타이핑
     목차 미리보기 · '열어 보기' 커서. 탭을 떠나면 모두 정리 */
  var timers = [], onScroll = null, offs = [];
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); }, every = function (fn, ms) { timers.push(setInterval(fn, ms)); };
  var on = function (el, ev, fn, o) { el.addEventListener(ev, fn, o); offs.push(function () { el.removeEventListener(ev, fn, o); }); };
  function unmount() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; if (onScroll) { removeEventListener("scroll", onScroll); onScroll = null; } offs.forEach(function (f) { f(); }); offs = []; document.documentElement.classList.remove("ed-js"); }
  function countUp(el) { var n = +el.getAttribute("data-cnt"), t0 = performance.now(); (function tick() { var p = Math.min(1, (performance.now() - t0) / 1500); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 4))); if (p < 1) later(tick, 16); })(); }
  function typeTerm(el) { NW.$$("div", el).forEach(function (l, i) { later(function () { l.classList.add("on"); }, 250 + i * 260); }); }
  function mount() {
    unmount();
    var st = document.querySelector(".ovs"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (st) { if (reduce) st.classList.add("ld", "sw"); else { later(function () { st.classList.add("ld"); }, 500); later(function () { st.classList.add("sw"); }, 4200); } }
    if (NW.EMBED) NW.$$('.ovw a[href^="#/"]').forEach(function (a) { a.href = "/ax" + a.getAttribute("href"); a.target = "_blank"; a.rel = "noopener"; });
    if (!reduce) document.documentElement.classList.add("ed-js");
    var rv = NW.$$(".ed [data-rv]"), words = NW.$$("#edState .w"), stateEl = document.getElementById("edState"), figs = NW.$$(".ed-stage img");
    var show = function (el) { el.classList.add("on"); NW.$$("[data-cnt]", el).forEach(reduce ? function () {} : countUp); if (el.hasAttribute("data-type")) reduce ? NW.$$("div", el).forEach(function (l) { l.classList.add("on"); }) : typeTerm(el); };
    var reveal = function () { var h = innerHeight * 0.9; rv = rv.filter(function (el) { if (el.getBoundingClientRect().top > h) return true; show(el); return false; }); };
    var motion = function () {
      if (reduce) return;
      var vh = innerHeight;
      if (stateEl && words.length) { var r = stateEl.getBoundingClientRect(), p = Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (vh * 0.45))), k = Math.round(p * words.length); words.forEach(function (w, i) { w.classList.toggle("on", i < k); }); }
      figs.forEach(function (im) { var r = im.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; var c = (r.top + r.height / 2 - vh / 2) / vh; im.style.setProperty("--py", (c * 36).toFixed(1) + "px"); });
    };
    reveal(); motion(); every(function () { if (rv.length) reveal(); motion(); }, 400); // 스크롤 이벤트가 늦게 와도(숨은 창 · 앵커 이동) 따라잡게
    var links = NW.$$(".ov-jump [data-ov-to]"), last = "";
    onScroll = function () {
      if (rv.length) reveal(); motion();
      var y = topOff(), cur = ""; TOC.forEach(function (t) { var el = document.getElementById(t[0]); if (el && el.getBoundingClientRect().top < y + 40) cur = t[0]; });
      if (cur === last) return; last = cur;
      links.forEach(function (l) { var on = l.getAttribute("data-ov-to") === cur; l.classList.toggle("on", on); if (on && l.parentNode.scrollWidth > l.parentNode.clientWidth) l.parentNode.scrollTo({ left: l.offsetLeft - 24, behavior: "smooth" }); });
    };
    addEventListener("scroll", onScroll, { passive: true });
    /* 마우스 따라다니는 목차 미리보기 · '열어 보기' 커서 (마우스 환경에서만) */
    if (!fine || reduce) return;
    var peek = document.querySelector(".ed-peek"), pimg = peek && peek.querySelector("img"), cur = document.querySelector(".ed-cur"), clab = cur && cur.querySelector("span");
    var mx = 0, my = 0, px = 0, py = 0, cx = 0, cy = 0, run = false;
    var loop = function () { px += (mx - px) * 0.16; py += (my - py) * 0.16; cx += (mx - cx) * 0.3; cy += (my - cy) * 0.3; if (peek) peek.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)"; if (cur) cur.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)"; if (run) requestAnimationFrame(loop); };
    var start = function () { if (!run) { run = true; requestAnimationFrame(loop); } }, stop = function () { if (!peek.classList.contains("on") && !cur.classList.contains("on")) run = false; };
    on(window, "pointermove", function (e) { mx = e.clientX; my = e.clientY; });
    NW.$$(".ed-index [data-peek]").forEach(function (b) {
      on(b, "pointerenter", function (e) { pimg.src = b.getAttribute("data-peek"); if (!run) { px = mx = e.clientX; py = my = e.clientY; } peek.classList.add("on"); start(); });
      on(b, "pointerleave", function () { peek.classList.remove("on"); later(stop, 400); });
    });
    NW.$$(".ed [data-cur]").forEach(function (a) {
      on(a, "pointerenter", function (e) { clab.textContent = a.getAttribute("data-cur"); if (!run) { cx = mx = e.clientX; cy = my = e.clientY; } cur.classList.add("on"); start(); });
      on(a, "pointerleave", function () { cur.classList.remove("on"); later(stop, 400); });
    });
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-ov-to]"))) { var el = document.getElementById(b.getAttribute("data-ov-to")); if (el) window.scrollTo({ top: el.id === "ov-top" ? 0 : el.getBoundingClientRect().top + scrollY - topOff(), behavior: "smooth" }); return; }
  });

  NW.OVERVIEW = { render: render, mount: mount, unmount: unmount };
})(window.NW);
