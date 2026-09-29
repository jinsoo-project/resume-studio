/* Catalog(상품 피드) · 검색광고 키워드 API · NAVER SA 빌더 — 전부 가상 데이터, 외부 호출 없음 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, won = NW.won, ic = NW.ic, md = NW.md, store = NW.store, dstr = NW.dstr, TODAY = NW.TODAY, fld = NW.fld, uid = NW.uid, grad = NW.grad, D = NW.D;
  var hhmm = function () { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };

  /* ── 1. Catalog — 상품 카탈로그 피드 ─────────────────── */
  var ISSUES = ["이미지 해상도 부족 (최소 600×600)", "설명 5,000자 초과", "가격 형식 오류", "랜딩 URL 응답 지연", "재고 0 · 품절 처리 필요"];
  var ITEMS = D.listings.filter(function (l) { return l.operation_status === "PUBLISHED"; }).map(function (l) {
    var r = NW.hashRng("cat" + l.type_id), x = r(), st = x < .78 ? "ok" : x < .92 ? "warn" : "err";
    return { id: "NW-" + l.type_id, title: l.branch_name + " · " + l.roomtype_name, price: l.weekly_rent, stock: l.unit_count, sido: l.sido, seg: l.seg, st: st, issue: st === "ok" ? "" : ISSUES[Math.floor(r() * ISSUES.length)], at: l.registered_at };
  });
  var CF = store.get("cat-f", { feed: "meta", st: "all" });
  var FEED = { meta: ["Meta 카탈로그", "Advantage+ 카탈로그 광고 · 다이내믹 리타게팅"], google: ["Google 머천트 센터", "PMax · 쇼핑 광고"], naver: ["네이버 쇼핑", "쇼핑검색 광고 · EP 피드"] };
  var ST = { ok: ["승인", "p-em"], warn: ["경고", "p-amber"], err: ["오류", "p-red"] };
  function catalog() {
    var list = ITEMS.filter(function (i) { return CF.st === "all" || i.st === CF.st; }), n = function (s) { return ITEMS.filter(function (i) { return i.st === s; }).length; };
    var sync = store.get("cat-sync", "오늘 06:00");
    var xml = ITEMS.slice(0, 3).map(function (i) { return '&lt;item&gt;\n  &lt;id&gt;' + i.id + '&lt;/id&gt;\n  &lt;title&gt;' + esc(i.title) + '&lt;/title&gt;\n  &lt;price&gt;' + i.price + ' KRW&lt;/price&gt;\n  &lt;availability&gt;' + (i.stock ? "in stock" : "out of stock") + '&lt;/availability&gt;\n  &lt;link&gt;https://demo.example/rooms/' + i.id + '&lt;/link&gt;\n  &lt;custom_label_0&gt;' + i.seg + '&lt;/custom_label_0&gt;\n&lt;/item&gt;'; }).join("\n");
    return NW.hero("catalog", "대시보드 · 상품 피드", "Catalog", "게시 중인 룸타입이 광고 매체의 상품 카탈로그로 자동 동기화돼요. 매체별 승인·경고·오류를 한 화면에서 보고 고쳐요.", '<button class="btn" data-cat-sync>' + ic("refresh") + '지금 동기화 <span style="color:var(--faint);font-weight:400">· 마지막 ' + sync + '</span></button>')
      + '<div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + NW.segHtml(Object.keys(FEED).map(function (k) { return [k, FEED[k][0]]; }), CF.feed, "data-cat-feed", true) + '<span class="fl-note" style="margin-left:8px">' + FEED[CF.feed][1] + '</span></div>'
      + '<div class="kg" style="margin-top:14px">' + NW.kpi("피드 상품", ko(ITEMS.length) + "개", "게시 중 룸타입 = 피드 1:1") + NW.kpi("승인", ko(n("ok")) + "개", ((n("ok") / ITEMS.length) * 100).toFixed(1) + "%", "acc") + NW.kpi("경고", ko(n("warn")) + "개", "노출은 되지만 품질 저하") + NW.kpi("오류", ko(n("err")) + "개", "노출 중단 — 우선 수정", "bad") + NW.kpi("동기화 주기", "매일 06:00", "가격·재고 변경 시 즉시") + '</div>'
      + '<div class="fline">' + NW.segHtml([["all", "전체"], ["ok", "승인"], ["warn", "경고"], ["err", "오류"]], CF.st, "data-cat-st") + '<span class="fl-note">행을 누르면 피드 필드와 광고 미리보기가 열려요</span></div>'
      + '<div class="g2 cat-g"><div class="card tw"><table class="t" style="min-width:720px"><thead><tr><th></th><th>상품 ID</th><th>상품명</th><th class="r">주간 가격</th><th class="r">재고(호실)</th><th>지역</th><th>상태</th><th>문제</th></tr></thead><tbody>'
      + list.slice(0, 60).map(function (i) { return '<tr class="clk" data-cat="' + i.id + '"><td><span class="cth" style="background:' + grad(i.id) + '"></span></td><td class="mono">' + i.id + '</td><td><b>' + esc(i.title) + '</b></td><td class="r tnum">' + won(i.price) + '</td><td class="r tnum">' + i.stock + '</td><td>' + i.sido + '</td><td><span class="pill sm ' + ST[i.st][1] + '">' + ST[i.st][0] + '</span></td><td class="ell faint" title="' + esc(i.issue) + '">' + esc(i.issue || "—") + '</td></tr>'; }).join("") + '</tbody></table>' + (list.length > 60 ? '<div class="faint" style="padding:10px 12px">상위 60개 표시 · 전체 ' + list.length + '개</div>' : '') + '</div>'
      + '<div class="card" style="padding:16px;align-self:start"><div class="lbl2" style="margin:0 0 10px">피드 미리보기 · XML <small>상위 3개</small></div><pre class="code-b">' + xml + '</pre></div></div>';
  }
  function openCat(id) {
    var i = ITEMS.filter(function (x) { return x.id === id; })[0];
    var kv = [["id", i.id], ["title", i.title], ["price", i.price + " KRW / 주"], ["availability", i.stock ? "in stock" : "out of stock"], ["inventory", i.stock], ["link", "https://demo.example/rooms/" + i.id], ["image_link", "(가상 이미지)"], ["custom_label_0", i.seg], ["custom_label_1", i.sido]];
    NW.drawer(esc(i.title), '<div class="kv2">' + kv.map(function (r) { return '<span class="mono">' + r[0] + '</span><b class="mono">' + esc(r[1]) + '</b>'; }).join("") + '</div>'
      + (i.issue ? '<div class="warn"><b>⚠ ' + ST[i.st][0] + '</b><div>' + esc(i.issue) + '</div></div>' : '<div class="okb">✓ 모든 매체에서 승인됐어요</div>')
      + '<div class="lbl2">카탈로그 광고 미리보기 (캐러셀 한 칸)</div><div class="fb" style="max-width:260px"><div class="fb-img" style="background:' + grad(i.id) + '"></div><div class="fb-c"><div><b>' + esc(i.title) + '</b><span>주 ' + won(i.price) + '</span></div></div></div>',
      (i.issue ? '<button class="btn btn-p" data-cat-fix="' + i.id + '">자동 수정 요청</button>' : '') + '<button class="btn" data-close>닫기</button>', 500);
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-cat-feed]"))) { CF.feed = b.getAttribute("data-cat-feed"); store.set("cat-f", CF); NW.rerender(); return; }
    if ((b = e.target.closest("[data-cat-st]"))) { CF.st = b.getAttribute("data-cat-st"); store.set("cat-f", CF); NW.rerender(); return; }
    if ((b = e.target.closest("tr[data-cat]"))) { openCat(b.getAttribute("data-cat")); return; }
    if ((b = e.target.closest("[data-cat-fix]"))) { var it = ITEMS.filter(function (x) { return x.id === b.getAttribute("data-cat-fix"); })[0]; it.st = "ok"; it.issue = ""; NW.closeLayer(); NW.rerender(); NW.toast("수정 반영 → 다음 동기화에 재심사돼요 (데모)"); return; }
    if (e.target.closest("[data-cat-sync]")) { store.set("cat-sync", "오늘 " + hhmm()); NW.rerender(); NW.toast("피드 동기화 완료 — 변경 " + ((Date.now() / 1000 | 0) % 7 + 2) + "건 (데모)"); return; }
  });

  /* ── 2. 검색광고 키워드 API — 키워드 도구 + 예상실적 ─────── */
  var SK = store.get("skw", { seed: "단기임대", sel: {}, bid: 900 });
  var SUF = ["", " 가격", " 추천", " 서울", " 한달", " 후기", " 풀옵션", " 대학가", " 보증금없는", " 1주", " 외국인", " 계약"];
  function kwRows(seed) {
    return SUF.map(function (s, i) {
      var k = (seed + s).trim(), r = NW.hashRng("sa" + k), pc = Math.round((i ? 1 : 3.2) * (r() * 2600 + 180)), mo = Math.round(pc * (2.2 + r() * 3)), ctr = +(0.6 + r() * 2.8).toFixed(2), clk = Math.round((pc + mo) * ctr / 100 * .35), bid = Math.round((300 + r() * 2200) / 10) * 10;
      return { kw: k, pc: pc, mo: mo, clk: clk, ctr: ctr, comp: r() < .4 ? "높음" : r() < .75 ? "중간" : "낮음", ads: Math.round(4 + r() * 11), bid: bid, cac: Math.round(bid / (0.02 + r() * .05)) };
    });
  }
  function searchKw() {
    var rows = kwRows(SK.seed), nsel = Object.keys(SK.sel).filter(function (k) { return SK.sel[k]; }).length;
    var bid = SK.bid, base = rows[0], imp = Math.round((base.pc + base.mo) * Math.min(1, .15 + bid / 2600)), ctr = Math.min(6, base.ctr * (0.7 + bid / 2000)), clicks = Math.round(imp * ctr / 100), cost = clicks * Math.round(bid * .78), conv = Math.round(clicks * .031), cac = conv ? cost / conv : 0;
    var bids = [300, 500, 700, 900, 1100, 1300, 1600, 2000, 2500], sim = bids.map(function (b) { var im = (base.pc + base.mo) * Math.min(1, .15 + b / 2600), c = im * Math.min(6, base.ctr * (0.7 + b / 2000)) / 100; return Math.round(c); });
    return NW.hero("skw", "마케팅 · 검색광고", "검색광고 키워드 API", "시드 키워드를 넣으면 연관 키워드의 검색량·클릭·경쟁도·예상 입찰가를 가져와요. 고른 키워드는 NAVER SA 광고그룹으로 바로 보낼 수 있어요. (API 응답 대신 가상 데이터)")
      + '<div class="fbar"><span class="btn" style="pointer-events:none">' + ic("search") + '시드</span><input class="inp" style="width:220px" data-skw-seed value="' + esc(SK.seed) + '" placeholder="키워드 입력 후 Enter">'
      + ["단기임대", "한달살기", "원룸", "유학생 숙소"].map(function (s) { return '<button class="chip2' + (s === SK.seed ? ' on' : '') + '" data-skw-s="' + s + '">' + s + '</button>'; }).join("") + '<span class="sp"></span><button class="btn btn-p" data-skw-send' + (nsel ? '' : ' disabled style="opacity:.45"') + '>선택 ' + nsel + '개 → NAVER SA 그룹에 추가</button></div>'
      + '<div class="card tw" style="margin-top:16px"><table class="t" style="min-width:980px"><thead><tr><th class="c"><input type="checkbox" data-skw-all' + (nsel === rows.length ? ' checked' : '') + '></th><th>키워드</th><th class="r">월간 검색(PC)</th><th class="r">월간 검색(모바일)</th><th class="r">월평균 클릭</th><th class="r">클릭률</th><th>경쟁 정도</th><th class="r">노출 광고 수</th><th class="r">예상 입찰가(1위)</th><th class="r">키워드 CAC</th></tr></thead><tbody>'
      + rows.map(function (r) { return '<tr><td class="c"><input type="checkbox" data-skw-k="' + esc(r.kw) + '"' + (SK.sel[r.kw] ? ' checked' : '') + '></td><td><b>' + esc(r.kw) + '</b></td><td class="r tnum">' + ko(r.pc) + '</td><td class="r tnum">' + ko(r.mo) + '</td><td class="r tnum">' + ko(r.clk) + '</td><td class="r tnum">' + r.ctr + '%</td><td><span class="pill sm ' + (r.comp === "높음" ? "p-red" : r.comp === "중간" ? "p-amber" : "p-em") + '">' + r.comp + '</span></td><td class="r tnum">' + r.ads + '</td><td class="r tnum">' + won(r.bid) + '</td><td class="r tnum">' + won(r.cac) + '</td></tr>'; }).join("") + '</tbody></table></div>'
      + '<div class="sec-h" style="margin-top:28px"><span class="code">SIM</span><h2>예상실적 시뮬레이터</h2><span class="hint">‘' + esc(base.kw) + '’ 기준 · 입찰가를 움직여 보세요</span></div>'
      + '<div class="g2"><div class="card" style="padding:18px;display:flex;flex-direction:column;gap:14px"><label class="fld"><span>입찰가 <b class="tnum" style="color:var(--text)">' + won(bid) + '</b></span><input type="range" min="300" max="2500" step="100" value="' + bid + '" data-skw-bid style="accent-color:var(--accent)"></label>'
      + '<div class="kg">' + NW.kpi("예상 노출", ko(imp), "월") + NW.kpi("예상 클릭", ko(clicks), "CTR " + ctr.toFixed(2) + "%") + NW.kpi("예상 비용", won(cost), "월") + NW.kpi("예상 CAC", won(cac), "전환율 3.1% 가정") + '</div></div>'
      + NW.chartCard("입찰가별 예상 클릭", { labels: bids.map(function (b) { return ko(b); }), h: 220, series: [{ name: "예상 클릭", color: "var(--accent)", values: sim }] }, "입찰가를 올릴수록 클릭은 늘지만 한계 효율은 떨어져요") + '</div>';
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-skw-s]"))) { SK.seed = b.getAttribute("data-skw-s"); SK.sel = {}; store.set("skw", SK); NW.rerender(); return; }
    if ((b = e.target.closest("[data-skw-k]"))) { SK.sel[b.getAttribute("data-skw-k")] = b.checked; store.set("skw", SK); NW.rerender(); return; }
    if ((b = e.target.closest("[data-skw-all]"))) { kwRows(SK.seed).forEach(function (r) { SK.sel[r.kw] = b.checked; }); store.set("skw", SK); NW.rerender(); return; }
    if ((b = e.target.closest("[data-skw-send]"))) {
      var picked = kwRows(SK.seed).filter(function (r) { return SK.sel[r.kw]; }); if (!picked.length) return;
      var g = NS.camps[0].groups[0]; picked.forEach(function (r) { if (!g.keywords.some(function (k) { return k.kw === r.kw; })) g.keywords.push({ kw: r.kw, bid: r.bid }); });
      NS.sel = g.id; saveNS(); SK.sel = {}; store.set("skw", SK); NW.toast(picked.length + "개 키워드를 ‘" + g.name + "’ 그룹에 넣었어요"); location.hash = "#/naver-sa"; return;
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.hasAttribute && e.target.hasAttribute("data-skw-seed") && !e.isComposing && e.target.value.trim()) { SK.seed = e.target.value.trim(); SK.sel = {}; store.set("skw", SK); NW.rerender(); } });
  document.addEventListener("input", function (e) { if (e.target.hasAttribute && e.target.hasAttribute("data-skw-bid")) { SK.bid = +e.target.value; store.set("skw", SK); clearTimeout(SK._t); SK._t = setTimeout(function () { NW.rerender(); var n = NW.$("[data-skw-bid]"); if (n) n.focus(); }, 60); } });

  /* ── 3. NAVER SA 빌더 — 캠페인 › 광고그룹(키워드) › 소재 ──── */
  var CTYPE = ["파워링크", "쇼핑검색", "브랜드검색", "플레이스"];
  function newAdN(n) { return { id: uid(), name: "소재 " + n, title: "1주부터 풀옵션 단기임대", desc: "보증금 부담 없이 원하는 기간만. 가구·가전 모두 포함, 계약은 3분이면 끝.", disp: "demo.example", url: "https://demo.example/stay?utm_source=naver&utm_medium=cpc" }; }
  function newGroup(n) { return { id: uid(), name: "광고그룹 " + n, bid: 700, device: ["PC", "모바일"], keywords: [{ kw: "단기임대", bid: 900 }], ads: [newAdN(1)] }; }
  function seedNS() { var g1 = newGroup(1); g1.name = "단기임대 · 일반"; g1.keywords = [{ kw: "단기임대", bid: 1100 }, { kw: "단기임대 서울", bid: 900 }, { kw: "원룸 단기", bid: 700 }]; g1.ads.push(newAdN(2)); g1.ads[1].title = "보증금 없는 한 달 살기"; var g2 = newGroup(2); g2.name = "한달살기 · 비용"; g2.keywords = [{ kw: "한달살기", bid: 800 }, { kw: "한달살기 비용", bid: 600 }]; return { camps: [{ id: uid(), name: "파워링크 — 단기임대", type: "파워링크", daily: 80000, groups: [g1, g2] }], sel: null, made: [] }; }
  var NS = store.get("naver-sa", null) || seedNS(); if (!NS.sel) NS.sel = NS.camps[0].id;
  function saveNS() { store.set("naver-sa", NS); }
  function nfind(id) { var r = null; NS.camps.forEach(function (c) { if (c.id === id) r = { t: "c", o: c, c: c }; c.groups.forEach(function (g) { if (g.id === id) r = { t: "g", o: g, c: c }; g.ads.forEach(function (a) { if (a.id === id) r = { t: "a", o: a, c: c, g: g }; }); }); }); return r; }
  function ntotals() { var g = 0, k = 0, a = 0, bud = 0; NS.camps.forEach(function (c) { bud += +c.daily || 0; c.groups.forEach(function (x) { g++; k += x.keywords.length; a += x.ads.length; }); }); return "캠페인 " + NS.camps.length + " · 그룹 " + g + " · 키워드 " + k + " · 소재 " + a + " · 일 예산 " + won(bud); }
  function ntree() {
    var row = function (lvl, id, icon, label, sub) { return '<div class="tr' + (NS.sel === id ? ' on' : '') + '" tabindex="0" role="button" data-nsel="' + id + '" style="padding-left:' + (10 + lvl * 18) + 'px"><span class="tr-i">' + icon + '</span><div class="tr-t"><b data-ntl="' + id + '">' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div><span class="tr-a"><button class="ib" data-ndel="' + id + '" title="삭제">' + ic("x") + '</button></span></div>'; };
    var add = function (lvl, attr, id, t) { return '<button class="tadd" style="margin-left:' + (10 + lvl * 18) + 'px" ' + attr + '="' + id + '">＋ ' + t + '</button>'; };
    return NS.camps.map(function (c) { return row(0, c.id, "▤", c.name, c.type + " · 일 " + won(c.daily)) + c.groups.map(function (g) { return row(1, g.id, "▣", g.name, "키워드 " + g.keywords.length + " · 기본 " + won(g.bid)) + g.ads.map(function (a) { return row(2, a.id, "▢", a.name, a.title); }).join("") + add(2, "data-nadd-a", g.id, "소재 추가"); }).join("") + add(1, "data-nadd-g", c.id, "광고그룹 추가"); }).join("") + '<button class="tadd" style="margin:6px 10px 0" data-nadd-c>＋ 캠페인 추가</button>';
  }
  function serp(a) { return '<div class="serp"><div class="serp-q">' + ic("search") + '단기임대</div><div class="serp-ad"><small>광고 · <span data-npv="disp">' + esc(a.disp) + '</span></small><b data-npv="title">' + esc(a.title) + '</b><p data-npv="desc">' + esc(a.desc) + '</p></div><div class="serp-ad dim"><small>광고 · 다른 광고주</small><b>가나 스테이 단기임대</b><p>역세권 원룸, 지금 예약하면 첫 주 할인.</p></div></div>'; }
  function neditor() {
    var f = nfind(NS.sel); if (!f) { NS.sel = NS.camps[0] ? NS.camps[0].id : ""; f = nfind(NS.sel); }
    if (!f) return '<div class="card empty"><b>캠페인이 없어요</b><p>왼쪽에서 ＋ 캠페인 추가를 눌러 시작하세요.</p></div>';
    var o = f.o, inp = function (k, l, type, max) { return fld(l + (max ? ' <small data-ncnt="' + k + '">' + String(o[k]).length + '/' + max + '</small>' : ''), '<input class="inp" data-nf="' + k + '" type="' + (type || "text") + '" value="' + esc(o[k]) + '"' + (max ? ' data-max="' + max + '"' : '') + '>'); };
    var top = '<div class="sheet-top"><div><b>' + (f.t === "c" ? "캠페인" : f.t === "g" ? "광고그룹" : "소재") + '</b><small>' + (f.t === "c" ? esc(o.name) : f.t === "g" ? esc(f.c.name) + " › " + esc(o.name) : esc(f.c.name) + " › " + esc(f.g.name) + " › " + esc(o.name)) + '</small></div></div>', body;
    if (f.t === "c") body = '<section class="bsec"><h3>캠페인 설정</h3>' + inp("name", "캠페인 이름") + fld("유형", NW.segHtml(CTYPE.map(function (x) { return [x, x]; }), o.type, "data-ntype", true)) + inp("daily", "하루 예산(원)", "number") + '</section>';
    else if (f.t === "g") body = '<section class="bsec"><h3>광고그룹</h3><div class="g2x">' + inp("name", "그룹 이름") + inp("bid", "기본 입찰가(원)", "number") + '</div>'
      + fld("매체", '<div class="mchips">' + ["PC", "모바일"].map(function (d) { return '<button type="button" class="chip2' + (o.device.indexOf(d) > -1 ? ' on' : '') + '" data-ndev="' + d + '">' + d + '</button>'; }).join("") + '</div>')
      + '<div class="fld"><span>키워드 <small>' + o.keywords.length + '개 · 입찰가를 비우면 기본 입찰가</small> <a class="lnk" href="#/search-kw" style="margin-left:auto">키워드 도구에서 가져오기 →</a></span><div class="card tw"><table class="t"><thead><tr><th>키워드</th><th class="r">입찰가</th><th class="r">예상 순위</th><th></th></tr></thead><tbody>'
      + o.keywords.map(function (k, i) { var b = +k.bid || +o.bid, rk = Math.max(1, Math.round(9 - b / 170)); return '<tr><td><b>' + esc(k.kw) + '</b></td><td class="r"><input class="inp" style="width:100px;text-align:right;padding:5px 8px" type="number" data-nkb="' + i + '" value="' + esc(k.bid) + '"></td><td class="r tnum">' + rk + '위</td><td class="r"><button class="ib" data-nkx="' + i + '">' + ic("x") + '</button></td></tr>'; }).join("") + '</tbody></table></div><div class="tagin"><input placeholder="키워드 입력 후 Enter" data-nkin></div></div></section>';
    else body = '<div class="badl"><section class="bsec"><h3>소재</h3>' + inp("name", "소재 이름") + inp("title", "제목", "text", 15) + fld("설명 <small data-ncnt=\"desc\">" + o.desc.length + "/45</small>", '<textarea class="inp" rows="2" data-nf="desc" data-max="45">' + esc(o.desc) + '</textarea>') + '<div class="g2x">' + inp("disp", "표시 URL") + inp("url", "연결 URL") + '</div></section><div class="bprev"><div class="lbl2" style="margin-top:0">실시간 미리보기 · 검색 결과</div>' + serp(o) + '</div></div>';
    return '<div class="card sheet">' + top + body + '</div>';
  }
  function naverSa() {
    return NW.hero("nsa", "Ads builder · NAVER SA", "NAVER SA 캠페인 빌더", "캠페인 → 광고그룹(키워드) → 소재를 트리로 짜고 오른쪽에서 바로 고쳐요. 키워드는 ‘검색광고 키워드 API’ 화면에서 골라 넣을 수 있어요. ‘생성’은 로컬 목록에만 저장돼요.")
      + '<div class="bld"><aside class="card btree"><label class="fld"><span>광고 계정</span><select class="inp"><option>데모 검색광고 계정</option></select></label><div class="tree">' + ntree() + '</div>'
      + (NS.made.length ? '<div class="made"><div class="lbl2">생성 기록 <small>로컬</small></div>' + NS.made.slice(0, 4).map(function (m) { return '<div><span class="pill sm p-em">생성됨</span> ' + esc(m.name) + ' <small class="tnum">' + m.at + '</small></div>'; }).join("") + '</div>' : '') + '</aside><div style="min-width:0">' + neditor() + '</div></div>'
      + '<div class="ctab"><span id="nSum" class="tnum">' + ntotals() + '</span><div style="display:flex;gap:8px"><button class="btn" data-nsave>초안 저장</button><button class="btn btn-p" data-nreview>검토 후 생성</button></div></div>';
  }
  function nreview() {
    var warn = [];
    NS.camps.forEach(function (c) { if (!(+c.daily > 0)) warn.push(c.name + " — 하루 예산이 비어 있어요"); c.groups.forEach(function (g) { if (!g.keywords.length) warn.push(g.name + " — 키워드가 없어요"); if (!g.ads.length) warn.push(g.name + " — 소재가 없어요"); g.ads.forEach(function (a) { if (a.title.length > 15) warn.push(a.name + " — 제목 15자 초과 (" + a.title.length + "자)"); if (a.desc.length > 45) warn.push(a.name + " — 설명 45자 초과"); }); }); });
    var tr = NS.camps.map(function (c) { return '<div class="rv0">▤ <b>' + esc(c.name) + '</b> <small>' + c.type + '</small></div>' + c.groups.map(function (g) { return '<div class="rv1">▣ ' + esc(g.name) + ' <small>' + g.keywords.map(function (k) { return k.kw; }).join(" · ") + '</small></div>' + g.ads.map(function (a) { return '<div class="rv2">▢ ' + esc(a.title) + '</div>'; }).join(""); }).join(""); }).join("");
    NW.layer('<div class="ov"><div class="md sm"><div class="md-h"><div class="tt"><b>검토 후 생성</b><span>' + ntotals() + '</span></div><button class="xb" data-close>' + ic("x") + '</button></div><div class="md-b" style="padding:16px 20px">' + (warn.length ? '<div class="warn"><b>⚠ 확인이 필요해요 ' + warn.length + '건</b>' + warn.map(function (w) { return '<div>· ' + esc(w) + '</div>'; }).join("") + '</div>' : '<div class="okb">✓ 빠진 값이 없어요</div>') + '<div class="lbl2">만들어질 구조</div><div class="rv">' + tr + '</div></div><div class="md-f"><button class="btn" data-close>돌아가기</button><button class="btn btn-p" data-nmake>확인 — 생성 (일시중지 상태)</button></div></div></div>');
  }
  function nRe() { saveNS(); NW.rerender(); }
  document.addEventListener("click", function (e) {
    var b, t = e.target, f = nfind(NS.sel);
    if ((b = t.closest("[data-ndel]"))) { e.stopPropagation(); var y = nfind(b.getAttribute("data-ndel")), ar = y.t === "c" ? NS.camps : y.t === "g" ? y.c.groups : y.g.ads; if (y.t !== "a" && !confirm("하위 항목까지 함께 삭제할까요?")) return; ar.splice(ar.indexOf(y.o), 1); NS.sel = y.t === "a" ? y.g.id : y.t === "g" ? y.c.id : (NS.camps[0] || {}).id; nRe(); return; }
    if ((b = t.closest("[data-nsel]"))) { NS.sel = b.getAttribute("data-nsel"); nRe(); return; }
    if ((b = t.closest("[data-nadd-a]"))) { var g = nfind(b.getAttribute("data-nadd-a")).o, a = newAdN(g.ads.length + 1); g.ads.push(a); NS.sel = a.id; nRe(); return; }
    if ((b = t.closest("[data-nadd-g]"))) { var c = nfind(b.getAttribute("data-nadd-g")).o, ng = newGroup(c.groups.length + 1); c.groups.push(ng); NS.sel = ng.id; nRe(); return; }
    if (t.closest("[data-nadd-c]")) { var nc = { id: uid(), name: "새 캠페인", type: "파워링크", daily: 50000, groups: [newGroup(1)] }; NS.camps.push(nc); NS.sel = nc.id; nRe(); return; }
    if (t.closest("[data-nsave]")) { saveNS(); NW.toast("초안을 저장했어요 (이 브라우저)"); return; }
    if (t.closest("[data-nreview]")) { nreview(); return; }
    if (t.closest("[data-nmake]")) { NS.camps.forEach(function (c) { NS.made.unshift({ name: c.name, at: md(dstr(TODAY)) + " " + hhmm() }); }); NS.made = NS.made.slice(0, 12); NW.closeLayer(); nRe(); NW.toast("일시중지 상태로 로컬 목록에 생성했어요 (데모)"); return; }
    if (!f) return;
    if ((b = t.closest("[data-ntype]"))) { f.o.type = b.getAttribute("data-ntype"); nRe(); return; }
    if ((b = t.closest("[data-ndev]"))) { var L = f.o.device, d = b.getAttribute("data-ndev"), i = L.indexOf(d); if (i > -1) L.splice(i, 1); else L.push(d); nRe(); return; }
    if ((b = t.closest("[data-nkx]"))) { f.o.keywords.splice(+b.getAttribute("data-nkx"), 1); nRe(); return; }
  });
  document.addEventListener("keydown", function (e) {
    var t = e.target; if (!t.hasAttribute) return;
    if ((e.key === "Enter" || e.key === " ") && t.hasAttribute("data-nsel")) { e.preventDefault(); NS.sel = t.getAttribute("data-nsel"); nRe(); var n = NW.$('[data-nsel="' + NS.sel + '"]'); if (n) n.focus(); }
    if (e.key === "Enter" && t.hasAttribute("data-nkin") && !e.isComposing && t.value.trim()) { nfind(NS.sel).o.keywords.push({ kw: t.value.trim(), bid: "" }); nRe(); var m = NW.$("[data-nkin]"); if (m) m.focus(); }
  });
  document.addEventListener("input", function (e) {
    var t = e.target, k = t.dataset && t.dataset.nf, f;
    if (k) { f = nfind(NS.sel); f.o[k] = t.type === "number" ? +t.value : t.value; saveNS(); var pv = NW.$('[data-npv="' + k + '"]'); if (pv) pv.textContent = t.value; var tl = NW.$('[data-ntl="' + f.o.id + '"]'); if (tl && k === "name") tl.textContent = t.value; var cn = NW.$('[data-ncnt="' + k + '"]'); if (cn) { cn.textContent = t.value.length + "/" + t.dataset.max; cn.style.color = t.value.length > +t.dataset.max ? "var(--danger)" : ""; } var sm = document.getElementById("nSum"); if (sm) sm.textContent = ntotals(); return; }
    if (t.dataset && t.dataset.nkb != null) { f = nfind(NS.sel); f.o.keywords[+t.dataset.nkb].bid = t.value === "" ? "" : +t.value; saveNS(); }
  });
  document.addEventListener("change", function (e) { var d = e.target.dataset || {}; if (d.nf === "name" || d.nkb != null || d.nf === "bid" || d.nf === "daily") NW.rerender(); });

  NW.PAGES["catalog"] = { render: catalog };
  NW.PAGES["search-kw"] = { render: searchKw };
  NW.PAGES["naver-sa"] = { render: naverSa };
})(window.NW);
