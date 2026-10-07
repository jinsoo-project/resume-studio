/* AX-MKT 콘솔 · 개요 탭 — 이 콘솔이 대신해 주는 마케팅 업무 5가지를 핵심만 보여 줘요(업무마다 제목 한 줄 · 설명 한 줄 · 화면 하나).
   이 페이지의 수치는 모두 예시예요. 업무마다 데모 화면으로 가는 링크(#/…)가 있어요. */
(function (NW) {
  "use strict";
  var D = NW.D, inR = NW.inR;

  var WORK = [
    { id: "ov-dash", t: "대시보드", s: "흩어진 성과를 한 장으로", h: "흩어진 성과를<br>한 장으로", p: "매체별 리포트를 엑셀로 합치던 일을 없앴어요.", demo: ["total-dashboard", "대시보드 열어 보기"] },
    { id: "ov-ads", t: "광고 자동화", s: "세팅부터 감시까지 자동", h: "세팅은 버튼 한 번,<br>감시는 규칙이", p: "META · 네이버 집행부터 예산 조정까지 자동으로.", demo: ["meta-ads", "광고 빌더 열어 보기"] },
    { id: "ov-content", t: "콘텐츠 자동화", s: "키워드에서 발행까지", h: "키워드에서 발행까지,<br>9단계 자동화", p: "블로그 한 사이클을 파이프라인으로 돌려요.", demo: ["blog-journey", "파이프라인 열어 보기"] },
    { id: "ov-intel", t: "시장 트래킹", s: "경쟁사 · 검색 수요 추적", h: "감 대신<br>시장 데이터로", p: "경쟁사 광고와 키워드 검색량을 꾸준히 모아요.", demo: ["search-kw", "키워드 도구 열어 보기"] },
    { id: "ov-collab", t: "협업 · 기록", s: "요청 · 회의를 한 곳에", h: "요청 · 회의 · 기록을<br>한 곳에", p: "흩어지던 협업 기록이 콘솔 안에 남아요.", demo: ["ad-requests", "요청 보드 열어 보기"] }
  ];
  var TOC = WORK.map(function (w) { return [w.id, w.t]; }).concat([["ov-how", "만든 방식"]]);
  var go = function (d) { return '<a class="ow-go" href="#/' + d[0] + '">' + d[1] + ' <span>→</span></a>'; };
  var term = function (id, name) { return '<div class="term"><div class="term-h"><i></i><i></i><i></i><span id="' + id + 'N">' + name + '</span></div><div class="term-b" id="' + id + '"></div></div>'; };

  /* 업무별 오른쪽 화면 (예시) */
  function visDash() {
    var r = NW.rangeOf("30"), paid = D.contracts.filter(function (c) { return c.status === "COMPLETED" && inR(c.completed_at, r); });
    var pay = paid.reduce(function (t, c) { return t + c.paid_amount; }, 0), rev = paid.reduce(function (t, c) { return t + (c.commission || 0); }, 0), spend = D.ads.filter(function (a) { return inR(a.date, r); }).reduce(function (t, a) { return t + a.spend; }, 0);
    var wS = function (v) { return v >= 1e8 ? (v / 1e8).toFixed(1) + "억" : Math.round(v / 1e4).toLocaleString("ko-KR") + "만"; };
    var mk = function (l, v, on) { return '<div class="mk' + (on ? ' on' : '') + '"><small>' + l + '</small><b class="tnum">' + v + '</b></div>'; };
    return '<div class="mc mk4">' + mk("결제금액", wS(pay) + "원") + mk("매출", wS(rev) + "원") + mk("광고비", wS(spend) + "원") + mk("ROAS", (spend ? rev / spend * 100 : 0).toFixed(0) + "%", 1) + '</div>';
  }
  var AUTO = [
    '<span class="run">●</span> ROAS <span class="cmd">2.7x</span> &lt; 목표 3.0x → 예산 <span class="cmd">₩50k → ₩40k</span>',
    '<span class="run">●</span> CAC <span class="cmd">₩48,200</span> &gt; 상한 → 세트 <span class="run">일시중지</span>',
    '<span class="ok">●</span> 성과 재수집 · 전환 <span class="cmd">+12건</span> 반영',
    '<span class="run">●</span> 소재 피로도 · CTR −28% → <span class="cmd">교체 요청</span>',
    '<span class="ok">●</span> 규칙 6개 <span class="ok">정상</span> <span class="dim">· 다음 점검 60s</span>'
  ];
  function visAds() { return term("ovA", "automation.log"); }
  var CS = ["키워드", "아이데이션", "브리프", "제작", "검수", "관리", "발행", "성과", "재활용"];
  function visContent() { return '<div class="cs">' + CS.map(function (s, i) { return '<a class="cs-t" href="#/blog-0' + (i + 1) + '"><small>0' + (i + 1) + '</small><b>' + s + '</b></a>'; }).join("") + '</div>'; }
  function visIntel() {
    return '<div class="mc"><div class="mc-h">키워드 검색량 <small>월간 · 예시</small></div>' + [["한달살기", 48200, "+12%", 1], ["단기임대", 31500, "+4%", 1], ["원룸 단기", 9800, "−3%", 0]].map(function (k) { return '<div class="mkw"><b>' + k[0] + '</b><span class="mkw-b"><i style="width:' + (k[1] / 482) + '%"></i></span><em class="tnum">' + k[1].toLocaleString("ko-KR") + '</em><span class="' + (k[3] ? "up" : "dn") + '">' + k[2] + '</span></div>'; }).join("") + '</div>';
  }
  function visCollab() {
    return '<div class="mc ml">' + [["10:12", "광고 소재 요청", "스토리 3종 · 코멘트 2"], ["11:00", "주간 성과 회의", "할 일 3건 자동 등록"], ["14:30", "UTM 생성", "히스토리에 저장"]].map(function (t) { return '<div class="ml-r"><em class="tnum">' + t[0] + '</em><div><b>' + t[1] + '</b><span>' + t[2] + '</span></div></div>'; }).join("") + '</div>';
  }
  var VIS = { "ov-dash": visDash, "ov-ads": visAds, "ov-content": visContent, "ov-intel": visIntel, "ov-collab": visCollab };

  function workSec(w, i) {
    return '<section class="ov-sec ow' + (i % 2 ? ' rev' : '') + '" id="' + w.id + '"><div class="ow-in"><div class="ow-txt">'
      + '<div class="ow-k">0' + (i + 1) + '  ' + w.t + '</div><h2>' + w.h + '</h2><p>' + w.p + '</p>' + go(w.demo) + '</div>'
      + '<div class="ow-vis">' + VIS[w.id]() + '</div></div></section>';
  }

  var SC = [
    ["기능 추가", ['<span class="cmd">$</span> "채널별 확대 · 축소 자동 판정 추가"', '<span class="run">●</span> AI 코딩 <span class="dim">· 파일 4</span>', '<span class="run">●</span> 자동 검증 <span class="ok">통과</span>', '<span class="run">●</span> AI 코드리뷰 → 코멘트 반영', '<span class="ok">●</span> 머지 <span class="cmd">PR #418</span>', '<span class="ok">✓</span> 배포 완료 <span class="dim">· 요청부터 38분</span>']],
    ["화면 추가", ['<span class="cmd">$</span> "레퍼럴 퍼널 화면 추가"', '<span class="run">●</span> AI 코딩 <span class="dim">· 파일 7</span>', '<span class="run">●</span> 자동 검증 <span class="ok">통과</span>', '<span class="run">●</span> AI 코드리뷰 → 빈 상태 UI 추가', '<span class="ok">●</span> 머지 <span class="cmd">PR #421</span>', '<span class="ok">✓</span> 배포 완료 <span class="dim">· 2분 09초</span>']]
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
      + '<section class="ov-hero" id="ov-intro"><div class="ow-k">AX-MKT 콘솔</div><h1>마케터가 매일 하는 일을,<br>한 화면에서 자동으로</h1>'
      + '<div class="wm">' + WORK.map(function (w, i) { return '<button class="wm-c" type="button" data-ov-to="' + w.id + '"><small>0' + (i + 1) + '</small><b>' + w.t + '</b><span>' + w.s + '</span></button>'; }).join("") + '</div></section>'
      + WORK.map(workSec).join("")
      + '<section class="ov-sec ow" id="ov-how"><div class="ow-in"><div class="ow-txt"><div class="ow-k">만든 방식</div><h2>마케터가 AI로<br>직접 만들었어요</h2><p>필요한 화면을 프롬프트로 만들고, AI 리뷰와 자동 검증을 거쳐 배포해요.</p></div>'
      + '<div class="ow-vis">' + term("ovT", "delivery.log") + '</div></div></section>'
      + '<div class="ov-end"><div><b>데모 콘솔에서 직접 눌러 보세요</b></div><a class="btn btn-p lg" href="#/total-dashboard">데모 콘솔 열기 →</a></div>'
      + '<footer class="ov-foot">모든 수치는 예시 · 가상 데이터예요</footer></div>';
  }

  /* 목차 = 헤더 아래 고정 바로가기 칩 줄 + 오른쪽 '데모 콘솔 열기' */
  function jump() {
    return '<nav class="ov-jump" aria-label="목차"><div class="ov-jump-in"><div class="ov-jcs">'
      + TOC.map(function (t) { return '<button class="ov-jc" type="button" data-ov-to="' + t[0] + '">' + t[1] + '</button>'; }).join("")
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
    var sc = SC[si];
    if (li === 0) { box.innerHTML = ""; document.getElementById("ovTN").textContent = "delivery.log — " + sc[0]; }
    typeLine(box, sc[1][li]);
    li++;
    if (li >= sc[1].length) { li = 0; shipT = setTimeout(function () { si = (si + 1) % SC.length; shipStep(); }, 3600); return; }
    shipT = setTimeout(shipStep, 1000);
  }
  function mount() {
    unmount();
    var st = document.querySelector(".ovs"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (st) { if (reduce) st.classList.add("ld", "sw"); else { later(function () { st.classList.add("ld"); }, 500); later(function () { st.classList.add("sw"); }, 4200); } }
    if (NW.EMBED) NW.$$('.ovw a[href^="#/"]').forEach(function (a) { a.href = "/ax" + a.getAttribute("href"); a.target = "_blank"; a.rel = "noopener"; });
    var ci = 0, tiles = NW.$$(".cs-t"); if (!reduce) every(function () { tiles.forEach(function (t, k) { t.classList.toggle("hot", k === ci); }); ci = (ci + 1) % tiles.length; }, 1100);
    var ai = 0, abox = document.getElementById("ovA");
    (function aStep() { if (!document.getElementById("ovA")) return; if (ai === 0) abox.innerHTML = ""; typeLine(abox, AUTO[ai]); ai++; if (ai >= AUTO.length) { ai = 0; later(aStep, 3400); } else later(aStep, 1150); })();
    si = 0; li = 0; shipStep();
    var links = NW.$$(".ov-jump [data-ov-to]"), last = "";
    onScroll = function () {
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
