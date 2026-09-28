/* 앱 셸 — 상단 탭(구조·개요 | 데모 콘솔) · 사이드바 · 라우터 · 히어로 편집 · 새로고침 · 다크 모드
   /ax 한 주소에서 #/overview = 구조·개요, 그 밖의 #/… = 데모 콘솔 화면이에요.
   데모에서 쓰는 메뉴만 열려 있고, 나머지는 회색(비활성)으로 원래 자리에 남겨 둬요. */
(function (NW) {
  "use strict";
  var esc = NW.esc, ic = NW.ic, store = NW.store, $ = NW.$;
  var OFF_TIP = "데모에서는 비활성화된 메뉴예요";
  NW.EMBED = /[?&]embed=1\b/.test(location.search);
  if (NW.EMBED) document.documentElement.classList.add("embed");

  /* [slug | null(비활성), 라벨] · {sub: 하위 그룹} */
  var BLOG = [["blog-journey", "여정 맵"], ["blog-01", "01 키워드 트렌드"], ["blog-02", "02 아이데이션"], ["blog-03", "03 브리프"], ["blog-04", "04 제작"], ["blog-05", "05 검수"], ["blog-06", "06 관리"], ["blog-07", "07 발행"], ["blog-08", "08 성과"], ["blog-09", "09 자동화"]];
  var NAV = [
    { g: "DASHBOARD", ic: "folder", kids: [["total-dashboard", "Total Dashboard"], [null, "Open API Dashboard"], ["kpi-okr", "KPI & OKR Tracker"], [null, "Live Roomtype"], [null, "Coupon / Point"], [null, "Referral"], ["catalog", "Catalog"], [null, "Brand table"], [null, "LTV · KPI Logic"]] },
    { g: "MKT", ic: "chart", kids: [["paid-dashboard", "Paid Dashboard"], ["ga4", "GA4 대시보드"], ["ad-requests", "광고 & 디자인 요청"], ["utm", "UTM 생성기"], [null, "UTM-LOGIC"], ["competitor-ads", "경쟁사 광고 모니터링"], ["search-kw", "검색광고 키워드 API"], ["meetings", "회의 캘린더"], [null, "제휴 채널 통합 리포팅"], [null, "리포트 DB"], [null, "GA4 Taxonomy"]] },
    { g: "Ads builder", ic: "heart", kids: [["meta-ads", "META Ads"], ["naver-sa", "NAVER SA"]] },
    { g: "SEO", ic: "chart", kids: [["keyword-trend", "Keyword Trend"], [null, "NAVER Trend"], [null, "GOOGLE Trend"], [null, "Competitor Trend"]] },
    { g: "NEWS LETTER", ic: "star", off: true },
    { g: "FRAME WORK", ic: "star", off: true },
    { g: "콘텐츠 파이프라인", ic: "base", kids: [{ sub: "블로그 파이프라인", kids: BLOG }, { sub: "인스타 파이프라인", off: true }] },
    { g: "OPEN-API-TEST", ic: "globe", off: true }
  ];
  var FOOT = [["image", "이미지 업로드"], ["home", "Agent List"], ["gear", "탭 설정"]];
  var OV = "overview", DEF = "total-dashboard";
  var route = function () { if (NW.EMBED) return OV; var h = location.hash.replace(/^#\/?/, ""); return h === OV || !h ? OV : NW.PAGES[h] ? h : DEF; };
  var OPEN = store.get("sb-open2", null) || { "DASHBOARD": 1, "MKT": 1, "Ads builder": 1, "SEO": 1, "콘텐츠 파이프라인": 1 };
  var COL = !!store.get("sidebar-collapsed", false);

  function leaf(k, sub) {
    var cur = route();
    if (!k[0]) return '<span class="sb-l off' + (sub ? ' sub' : '') + '" aria-disabled="true" title="' + OFF_TIP + '">' + esc(k[1]) + '</span>';
    return '<a class="sb-l' + (sub ? ' sub' : '') + (k[0] === cur ? ' act' : '') + '" href="#/' + k[0] + '">' + esc(k[1]) + '</a>';
  }
  function hasCur(kids) { var cur = route(); return (kids || []).some(function (k) { return k.sub ? hasCur(k.kids) : k[0] === cur; }); }
  function firstLive(kids) { for (var i = 0; i < (kids || []).length; i++) { var k = kids[i]; if (k.sub) { var f = firstLive(k.kids); if (f) return f; } else if (k[0]) return k[0]; } return null; }
  function sidebar(variant) {
    var nav = NAV.map(function (g) {
      if (g.off) return '<button class="sb-g off" aria-disabled="true" title="' + OFF_TIP + '">' + ic(g.ic, "sb-ic") + '<span class="sb-lbl">' + esc(g.g) + '</span>' + ic("chev", "sb-chev") + '</button>';
      var open = !!OPEN[g.g] || hasCur(g.kids), act = hasCur(g.kids);
      return '<button class="sb-g' + (act ? ' act' : '') + '" aria-expanded="' + open + '" data-sb-g="' + esc(g.g) + '" data-first="' + firstLive(g.kids) + '" title="' + esc(g.g) + '">' + ic(g.ic, "sb-ic") + '<span class="sb-lbl">' + esc(g.g) + '</span>' + ic("chev", "sb-chev") + '</button>'
        + (open ? '<div class="sb-kids">' + g.kids.map(function (k) {
          if (!k.sub) return leaf(k);
          if (k.off) return '<span class="sb-sub off" aria-disabled="true" title="' + OFF_TIP + '">' + ic("chev", "") + esc(k.sub) + '</span>';
          return '<span class="sb-sub">' + ic("chev", "rot") + esc(k.sub) + '</span>' + k.kids.map(function (x) { return leaf(x, true); }).join("");
        }).join("") + '</div>' : '');
    }).join("");
    return '<aside class="sb' + (variant === "desktop" && COL ? ' col' : '') + '">'
      + (variant === "desktop" ? '<button class="sb-tog" data-sb-col aria-label="사이드바 접기">' + ic("left") + '</button>' : '')
      + '<div class="sb-logo"><div class="sb-mark">' + ic("user") + '</div><div class="sb-t"><h1>' + NW.BRAND + ' MKT</h1><p>Agent Dashboard · 데모</p></div></div>'
      + '<nav class="sb-nav">' + nav + '</nav>'
      + '<div class="sb-foot">' + FOOT.map(function (f) { return '<button class="sb-g off" aria-disabled="true" title="' + OFF_TIP + '">' + ic(f[0], "sb-ic") + '<span class="sb-lbl">' + f[1] + '</span></button>'; }).join("")
      + '<div class="sb-user"><span class="sb-av">DM</span><span class="sb-foot-t" style="flex:1;min-width:0"><b style="display:block;font-size:12.5px">데모 사용자</b><small style="color:var(--muted-foreground);font-size:11px">편집 내용은 이 브라우저에만 저장</small></span></div></div>'
      + '<div class="sb-live"><span class="pulse"></span><span class="sb-foot-t">7명 에이전트 활동 중</span></div></aside>';
  }
  function topbar() {
    var r = route(), onOv = r === OV, dark = document.documentElement.classList.contains("dark");
    return '<header class="tb">' + (onOv ? '' : '<button class="xb tb-menu" data-mnav aria-label="메뉴 열기">' + ic("menu") + '</button>')
      + '<a class="tb-brand" href="#/overview"><span class="sb-mark">' + ic("base") + '</span><span><b>AX-MKT 콘솔</b><small>김진수 · Marketing &amp; AX</small></span></a>'
      + '<nav class="tb-tabs" role="tablist"><a role="tab" class="' + (onOv ? 'on' : '') + '" href="#/overview">구조 · 개요</a><a role="tab" class="' + (onOv ? '' : 'on') + '" href="#/' + (store.get("last", DEF)) + '">데모 콘솔</a></nav>'
      + '<span class="tb-sp"></span><span class="demo-pill tb-pill"><i></i>모든 수치는 예시 · 가상 데이터</span>'
      + '<button class="xb" data-dark title="' + (dark ? "라이트 모드" : "다크 모드") + '">' + ic("moon") + '</button>'
      + '<a class="btn tb-back" href="/portfolio">포트폴리오 ↗</a></header>';
  }
  function layout() {
    var onOv = route() === OV;
    if (NW.EMBED) { $("#app").innerHTML = '<main id="main"></main>'; return; }
    $("#app").innerHTML = topbar() + '<div class="body">' + (onOv ? NW.OVERVIEW.toc() : sidebar("desktop")) + '<main id="main"></main></div>'
      + (onOv ? '' : '<div class="mdrawer" id="mdrawer"><div class="bd" data-mclose></div>' + sidebar("drawer") + '</div>');
    document.documentElement.classList.toggle("is-ov", onOv);
  }
  function paintNav() {
    var d = $(".body > .sb:not(.ov-toc)"); if (d) d.outerHTML = sidebar("desktop");
    var m = $("#mdrawer .sb"); if (m) m.outerHTML = sidebar("drawer");
    var t = $(".tb"); if (t) t.outerHTML = topbar();
  }
  NW.rerender = function (keep) {
    var y = window.scrollY, main = $("#main"); if (!main) return;
    NW.charts.length = 0;
    if (route() === OV) { main.innerHTML = '<div class="wrap ov-wrap">' + NW.OVERVIEW.render() + '</div>'; NW.OVERVIEW.mount(); }
    else { main.innerHTML = '<div class="wrap">' + NW.PAGES[route()].render() + '</div>'; NW.drawCharts(); }
    if (keep !== false) window.scrollTo(0, y);
  };
  var lastMode = null;
  function go() {
    var r = route(), h = location.hash.replace(/^#\/?/, "");
    if (!NW.EMBED && h !== r) history.replaceState(null, "", "#/" + r);
    NW.OVERVIEW.unmount(); closeM(); NW.closeLayer();
    var mode = r === OV ? "ov" : "con";
    if (mode !== lastMode || !$("#main")) { layout(); lastMode = mode; } else paintNav();
    if (r !== OV) store.set("last", r);
    NW.rerender(false); window.scrollTo(0, 0);
    var name = r === OV ? "구조 · 개요" : null;
    if (!name) (function f(list) { list.forEach(function (k) { if (k.sub) f(k.kids || []); else if (k[0] === r) name = k[1]; }); })([].concat.apply([], NAV.map(function (g) { return g.kids || []; })));
    document.title = (name ? name + " · " : "") + "AX-MKT 콘솔 — 김진수";
  }
  function openM() { var m = $("#mdrawer"); if (!m) return; m.classList.add("on"); document.body.style.overflow = "hidden"; }
  function closeM() { var m = $("#mdrawer"); if (m && m.classList.contains("on")) { m.classList.remove("on"); document.body.style.overflow = ""; } }

  /* 히어로 제목·설명: 클릭 → 입력, Enter/blur 저장, Esc 취소, 빈값 = 기본 */
  function editHero(el) {
    if (el.querySelector("input,textarea")) return;
    var p = el.getAttribute("data-hero").split(":"), key = p[0], f = p[1], H = store.get("hero:" + key, {}), def = el.getAttribute("data-def");
    var isT = f === "title", inp = document.createElement(isT ? "input" : "textarea");
    inp.className = "h-edit"; inp.value = H[f] || def; if (!isT) inp.rows = 2;
    el.textContent = ""; el.appendChild(inp); inp.focus(); inp.select();
    var done = false;
    function fin(save) {
      if (done) return; done = true;
      if (save) { var v = inp.value.trim(); if (!v || v === def) delete H[f]; else H[f] = v; store.set("hero:" + key, H); }
      el.textContent = H[f] || def;
    }
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && (isT || !e.shiftKey) && !e.isComposing) { e.preventDefault(); fin(true); } if (e.key === "Escape") { e.stopPropagation(); fin(false); } });
    inp.addEventListener("blur", function () { fin(true); });
  }

  document.addEventListener("click", function (e) {
    var b, t = e.target;
    if (t.closest("[aria-disabled]")) { e.preventDefault(); return; }
    if ((b = t.closest("[data-sb-g]"))) {
      if (b.closest(".sb.col")) { location.hash = "#/" + b.getAttribute("data-first"); return; }
      var g = b.getAttribute("data-sb-g"); OPEN[g] = b.getAttribute("aria-expanded") === "true" ? 0 : 1; store.set("sb-open2", OPEN); paintNav(); return;
    }
    if (t.closest("[data-sb-col]")) { COL = !COL; store.set("sidebar-collapsed", COL); paintNav(); setTimeout(NW.drawCharts, 220); return; }
    if (t.closest("[data-mnav]")) { openM(); return; }
    if (t.closest("[data-mclose]")) { closeM(); return; }
    if (t.closest("[data-dark]")) { var on = document.documentElement.classList.toggle("dark"); store.set("dark", on); paintNav(); NW.rerender(); return; }
    if ((b = t.closest("[data-hero]"))) { editHero(b); return; }
    if ((b = t.closest("[data-refresh]"))) {
      if (b.classList.contains("spin")) return;
      b.classList.add("spin"); b.innerHTML = ic("refresh") + "불러오는 중…";
      setTimeout(function () { var d = new Date(); store.set("refreshed", ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)); NW.rerender(); NW.toast("최신 데이터로 갱신했어요 (데모)"); }, 700);
      return;
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeM(); });
  window.addEventListener("hashchange", go);

  if (store.get("dark", false)) document.documentElement.classList.add("dark");
  go();
})(window.NW);
