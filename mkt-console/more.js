/* Ads builder(META) · SEO 화면 — 전부 가상 데이터 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, won = NW.won, ic = NW.ic, md = NW.md, store = NW.store, ri = NW.ri, pick = NW.pick, chance = NW.chance, dstr = NW.dstr, addD = NW.addD, TODAY = NW.TODAY;
  var av = NW.av, grad = NW.grad, drawer = NW.drawer, fld = NW.fld, uid = NW.uid, AG = NW.AG, AGN = NW.AGN;

  /* ── 1. META Ads 캠페인 빌더 ──────────────────────────── */
  var OBJ = ["인지도", "트래픽", "참여", "잠재 고객", "앱 홍보", "판매"], CTA = ["더 알아보기", "지금 예약하기", "가입하기", "문의하기"];
  var REG = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "제주"], PLACE = ["피드", "스토리", "릴스", "탐색", "메신저", "오디언스 네트워크"];
  function newAd(n) { return { id: uid(), name: "광고 " + n, media: "image", body: "보증금 부담 없이, 1주부터 시작하는 내 방.", title: "풀옵션 단기임대", cta: "더 알아보기", link: "https://demo.example/stay?utm_source=meta&utm_medium=paid_social" }; }
  function newSet(n) { return { id: uid(), name: "광고세트 " + n, daily: 30000, start: dstr(addD(TODAY, 1)), end: dstr(addD(TODAY, 30)), age: [20, 34], gender: "all", regions: ["서울", "경기"], interests: ["자취", "이사"], place: ["피드", "스토리", "릴스"], ads: [newAd(1)] }; }
  function seedB() {
    var s1 = newSet(1); s1.name = "20~34 · 대학가"; s1.interests = ["대학생", "자취", "이사"]; s1.ads.push(newAd(2)); s1.ads[1].media = "video"; s1.ads[1].name = "룸 투어 릴스"; s1.ads[1].body = "캐리어만 들고 오세요. 가구·가전 다 있어요.";
    var s2 = newSet(2); s2.name = "25~39 · 직장인 수도권"; s2.age = [25, 39]; s2.interests = ["직장인", "출장", "한달살기"]; s2.ads.push(newAd(2));
    var s3 = newSet(1); s3.name = "지난 30일 조회 · 미결제"; s3.regions = []; s3.interests = ["리타게팅"]; s3.ads[0].title = "보던 방, 아직 비어 있어요"; s3.ads[0].cta = "지금 예약하기";
    return { acct: "데모 광고 계정 01", camps: [{ id: uid(), name: "가을 이사철 — 판매", obj: "판매", budgetAt: "campaign", budget: 150000, sets: [s1, s2] }, { id: uid(), name: "리타게팅 — 트래픽", obj: "트래픽", budgetAt: "set", budget: 0, sets: [s3] }], sel: null, made: [] };
  }
  var B = store.get("builder", null) || seedB();
  var catSet = function (a) { return NW.CAT.sets.filter(function (s) { return s.id === a.pset; })[0] || NW.CAT.sets[0]; };
  /* 카탈로그 화면 '이 세트로 카탈로그 광고 만들기' → 판매 캠페인 · 세트 · 다이내믹 소재 초안 */
  NW.metaCatalog = function (s) {
    var set = newSet(1), ad = newAd(1);
    set.name = s.aud; set.interests = s.rt ? ["리타게팅 · ViewContent 14일", "Purchase 제외"] : ["Advantage+ 오디언스"]; set.regions = s.id === "ps-seoul" ? ["서울"] : []; set.place = ["피드", "스토리", "릴스"];
    ad.name = "카탈로그 · " + s.name; ad.media = "catalog"; ad.pset = s.id; ad.title = "{{product.name}}"; ad.body = s.rt ? "보던 방, 아직 비어 있어요. 1주부터 계약할 수 있어요." : "가구 · 가전 다 있는 방, 1주부터 바로 입주."; ad.cta = "지금 예약하기"; ad.link = "{{product.link}}?utm_source=meta&utm_medium=paid_social&utm_campaign=catalog_" + s.id;
    set.ads = [ad];
    var c = { id: uid(), name: "카탈로그 — " + s.name, obj: "판매", budgetAt: "campaign", budget: 100000, catalog: s.id, sets: [set] };
    B.camps.unshift(c); B.sel = { id: ad.id }; saveB();
  };
  if (!B.sel) B.sel = { t: "c", id: B.camps[0].id };
  var saveB = function () { store.set("builder", B); };
  function find(id) { var r = null; B.camps.forEach(function (c) { if (c.id === id) r = { t: "c", o: c, c: c }; c.sets.forEach(function (s) { if (s.id === id) r = { t: "s", o: s, c: c, s: s }; s.ads.forEach(function (a) { if (a.id === id) r = { t: "a", o: a, c: c, s: s }; }); }); }); return r; }
  function totals() { var s = 0, a = 0, bud = 0; B.camps.forEach(function (c) { if (c.budgetAt === "campaign") bud += +c.budget || 0; c.sets.forEach(function (x) { s++; a += x.ads.length; if (c.budgetAt === "set") bud += +x.daily || 0; }); }); return "캠페인 " + B.camps.length + " · 세트 " + s + " · 소재 " + a + " · 일 예산 합계 " + won(bud); }
  function tree() {
    var row = function (lvl, id, icon, label, sub, acts) { var on = B.sel.id === id; return '<div class="tr' + (on ? ' on' : '') + '" tabindex="0" role="button" data-bsel="' + id + '" style="padding-left:' + (10 + lvl * 18) + 'px"><span class="tr-i">' + icon + '</span><div class="tr-t"><b data-tl="' + id + '">' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div><span class="tr-a"><button class="ib" data-bdup="' + id + '" title="복제">' + ic("copy") + '</button><button class="ib" data-bdel="' + id + '" title="삭제">' + ic("x") + '</button></span></div>'; };
    var add = function (lvl, attr, id, t) { return '<button class="tadd" style="margin-left:' + (10 + lvl * 18) + 'px" ' + attr + '="' + id + '">＋ ' + t + '</button>'; };
    return B.camps.map(function (c) {
      return row(0, c.id, "▤", c.name, c.obj + " · " + (c.budgetAt === "campaign" ? "캠페인 예산 " + won(c.budget) : "세트 예산")) + c.sets.map(function (s) {
        return row(1, s.id, "▣", s.name, s.age[0] + "~" + s.age[1] + "세 · " + (s.regions.join("·") || "전국")) + s.ads.map(function (a) { return row(2, a.id, a.media === "video" ? "▶" : a.media === "catalog" ? "▦" : "▢", a.name, a.media === "catalog" ? "카탈로그 · " + catSet(a).name : a.cta); }).join("") + add(2, "data-badd-a", s.id, "광고 추가");
      }).join("") + add(1, "data-badd-s", c.id, "광고세트 추가");
    }).join("") + '<button class="tadd" style="margin:6px 10px 0" data-badd-c>＋ 캠페인 추가</button>';
  }
  function chips(list, on, attr) { return '<div class="mchips">' + list.map(function (x) { return '<button type="button" class="chip2' + (on.indexOf(x) > -1 ? ' on' : '') + '" ' + attr + '="' + esc(x) + '">' + esc(x) + '</button>'; }).join("") + '</div>'; }
  function adPreview(a) {
    return '<div class="fb"><div class="fb-h"><span class="fb-av">김</span><div><b>' + NW.BRAND + '</b><small>광고 · 🌐</small></div></div><div class="fb-t" data-pv="body">' + esc(a.body) + '</div>'
      + (a.media === "catalog" ? '<div class="cf-car">' + NW.CAT.items(catSet(a).id).slice(0, 3).map(function (x) { return '<div class="cf-card"><div class="cf-ci" style="background:' + NW.CAT.thumb(x) + '"></div><b>' + esc(a.title.indexOf("{{product.name}}") > -1 ? a.title.replace("{{product.name}}", NW.CAT.title(x)) : a.title) + '</b><span>' + NW.CAT.price(x) + '</span><button type="button">' + esc(a.cta) + '</button></div>'; }).join("") + '</div><div class="fb-a"><span>♡ 좋아요</span><span>💬 댓글</span><span>➤ 공유</span><span style="margin-left:auto">🔖</span></div></div>' : '')
      + (a.media === "catalog" ? '' : '<div class="fb-img" style="background:' + grad(a.id) + '">' + (a.media === "video" ? '<span class="play">▶</span>' : '') + '</div>'
      + '<div class="fb-c"><div><small>DEMO.EXAMPLE</small><b data-pv="title">' + esc(a.title) + '</b></div><button type="button" data-pv="cta">' + esc(a.cta) + '</button></div><div class="fb-a"><span>♡ 좋아요</span><span>💬 댓글</span><span>➤ 공유</span><span style="margin-left:auto">🔖</span></div></div>');
  }
  function editor() {
    var f = find(B.sel.id); if (!f) { B.sel = { t: "c", id: B.camps[0] ? B.camps[0].id : "" }; f = find(B.sel.id); }
    if (!f) return '<div class="card empty"><b>캠페인이 없어요</b><p>왼쪽에서 ＋ 캠페인 추가를 눌러 시작하세요.</p></div>';
    var o = f.o, inp = function (k, l, type) { return fld(l, '<input class="inp" data-bf="' + k + '" type="' + (type || "text") + '" value="' + esc(o[k]) + '">'); };
    var top = '<div class="sheet-top"><div><b>' + (f.t === "c" ? "캠페인" : f.t === "s" ? "광고세트" : "광고(소재)") + '</b><small>' + (f.t === "c" ? esc(o.name) : f.t === "s" ? esc(f.c.name) + " › " + esc(o.name) : esc(f.c.name) + " › " + esc(f.s.name) + " › " + esc(o.name)) + '</small></div></div>';
    var body;
    if (f.t === "c") body = '<section class="bsec"><h3>캠페인 설정</h3>' + inp("name", "캠페인 이름") + fld("목표", NW.segHtml(OBJ.map(function (x) { return [x, x]; }), o.obj, "data-bobj", true))
      + fld("예산 위치 <small>캠페인·세트 중 한 곳만 쓸 수 있어요 ⛔</small>", NW.segHtml([["campaign", "캠페인 예산(CBO)"], ["set", "광고세트 예산"]], o.budgetAt, "data-bbat", true))
      + (o.budgetAt === "campaign" ? inp("budget", "캠페인 일 예산(원)", "number") : '<p class="faint">예산은 각 광고세트에서 정해요.</p>')
      + (o.catalog ? '<div class="cf-link"><b>카탈로그 연결</b><span>데모 카탈로그 · 상품 세트 ‘' + esc(catSet({ pset: o.catalog }).name) + '’ (' + NW.CAT.items(o.catalog).length + '개)</span><a href="#/catalog" data-cat-tab="sets">카탈로그에서 보기 ←</a></div>' : '') + '</section>';
    else if (f.t === "s") body = '<section class="bsec"><h3>광고세트</h3>' + inp("name", "세트 이름")
      + '<div class="g2x">' + (f.c.budgetAt === "set" ? inp("daily", "일 예산(원)", "number") : fld("일 예산", '<input class="inp" disabled value="캠페인 예산 사용 중">')) + '<div class="g2x">' + inp("start", "시작", "date") + inp("end", "종료", "date") + '</div></div>'
      + fld("연령 <b class='tnum' id='bAge'>" + o.age[0] + " ~ " + o.age[1] + "세</b>", '<div class="rng2"><input type="range" min="18" max="65" value="' + o.age[0] + '" data-bage="0"><input type="range" min="18" max="65" value="' + o.age[1] + '" data-bage="1"></div>')
      + fld("성별", NW.segHtml([["all", "전체"], ["m", "남성"], ["f", "여성"]], o.gender, "data-bgen"))
      + fld("지역 <small>비우면 전국</small>", chips(REG, o.regions, "data-breg"))
      + fld("관심사", '<div class="tagin">' + o.interests.map(function (x, i) { return '<span class="tag">' + esc(x) + '<button data-bint-x="' + i + '">×</button></span>'; }).join("") + '<input placeholder="입력 후 Enter" data-bint></div>')
      + fld("노출 위치", chips(PLACE, o.place, "data-bpl")) + '</section>';
    else body = '<div class="badl"><section class="bsec"><h3>소재</h3>' + inp("name", "광고 이름") + fld("형식", NW.segHtml([["image", "이미지"], ["video", "영상"], ["catalog", "카탈로그"]], o.media, "data-bmed"))
      + (o.media === "catalog" ? fld("상품 세트 <small>카탈로그 화면에서 만든 세트</small>", NW.segHtml(NW.CAT.sets.map(function (s) { return [s.id, s.name]; }), catSet(o).id, "data-bpset")) + '<div class="cf-dyn"><b>다이내믹 필드</b><span>{{product.name}} · {{product.price}} · {{product.link}} 가 상품마다 피드 값으로 바뀌어요</span><a href="#/catalog" data-cat-tab="items">피드 편집 →</a></div>'
        : '<div class="thumb1" style="background:' + grad(o.id) + '">' + (o.media === "video" ? '<span class="play">▶</span>' : ic("image")) + '<button class="btn sm" data-toast="데모에서는 가상 썸네일을 써요">교체</button></div>')
      + fld("기본 문구", '<textarea class="inp" rows="3" data-bf="body">' + esc(o.body) + '</textarea>') + inp("title", "제목") + fld("CTA", NW.segHtml(CTA.map(function (x) { return [x, x]; }), o.cta, "data-bcta")) + inp("link", "링크") + '</section>'
      + '<div class="bprev"><div class="lbl2" style="margin-top:0">실시간 미리보기 · 피드</div>' + adPreview(o) + '</div></div>';
    return '<div class="card sheet">' + top + body + '</div>';
  }
  function metaAds() {
    return NW.hero("meta", "Ads builder · META", "META Ads 캠페인 빌더", "캠페인 → 광고세트 → 광고를 트리로 짜고, 오른쪽에서 바로 고쳐요. ‘생성’은 이 브라우저의 로컬 목록에만 저장돼요.")
      + '<div class="bld"><aside class="card btree"><label class="fld"><span>광고 계정</span><select class="inp"><option>' + esc(B.acct) + '</option><option disabled>데모 광고 계정 02</option></select></label><div class="tree">' + tree() + '</div>'
      + (B.made.length ? '<div class="made"><div class="lbl2">생성 기록 <small>로컬</small></div>' + B.made.slice(0, 4).map(function (m) { return '<div><span class="pill sm p-em">생성됨</span> ' + esc(m.name) + ' <small class="tnum">' + m.at + '</small></div>'; }).join("") + '</div>' : '') + '</aside>'
      + '<div style="min-width:0">' + editor() + '</div></div>'
      + '<div class="ctab"><span id="bSum" class="tnum">' + totals() + '</span><div style="display:flex;gap:8px"><button class="btn" data-bsave>초안 저장</button><button class="btn btn-p" data-breview>검토 후 생성</button></div></div>';
  }
  function review() {
    var warn = [];
    B.camps.forEach(function (c) {
      if (c.budgetAt === "campaign" && !(+c.budget > 0)) warn.push(c.name + " — 캠페인 예산이 비어 있어요");
      if (!c.sets.length) warn.push(c.name + " — 광고세트가 없어요");
      c.sets.forEach(function (s) { if (c.budgetAt === "set" && !(+s.daily > 0)) warn.push(s.name + " — 일 예산이 비어 있어요"); if (!s.ads.length) warn.push(s.name + " — 광고가 없어요"); if (!s.place.length) warn.push(s.name + " — 노출 위치를 하나 이상 골라 주세요"); s.ads.forEach(function (a) { if (!a.body.trim() || !a.title.trim()) warn.push(a.name + " — 문구·제목을 채워 주세요"); }); });
    });
    var tr = B.camps.map(function (c) { return '<div class="rv0">▤ <b>' + esc(c.name) + '</b> <small>' + c.obj + '</small></div>' + c.sets.map(function (s) { return '<div class="rv1">▣ ' + esc(s.name) + ' <small>' + s.age[0] + '~' + s.age[1] + '세 · ' + (s.regions.join("·") || "전국") + ' · ' + s.place.join("·") + '</small></div>' + s.ads.map(function (a) { return '<div class="rv2">' + (a.media === "video" ? "▶" : "▢") + ' ' + esc(a.name) + ' <small>' + esc(a.cta) + '</small></div>'; }).join(""); }).join(""); }).join("");
    NW.layer('<div class="ov"><div class="md sm"><div class="md-h"><div class="tt"><b>검토 후 생성</b><span>' + totals() + '</span></div><button class="xb" data-close>' + ic("x") + '</button></div><div class="md-b" style="padding:16px 20px">'
      + (warn.length ? '<div class="warn"><b>⚠ 확인이 필요해요 ' + warn.length + '건</b>' + warn.map(function (w) { return '<div>· ' + esc(w) + '</div>'; }).join("") + '</div>' : '<div class="okb">✓ 빠진 값이 없어요</div>')
      + '<div class="lbl2">만들어질 구조</div><div class="rv">' + tr + '</div></div><div class="md-f"><button class="btn" data-close>돌아가기</button><button class="btn btn-p" data-bmake' + (warn.length ? ' title="경고가 있어도 데모에서는 생성돼요"' : '') + '>확인 — 생성</button></div></div></div>');
  }
  function bRe() { saveB(); NW.rerender(true); }
  document.addEventListener("click", function (e) {
    var b, t = e.target, f = B.sel && find(B.sel.id);
    if ((b = t.closest("[data-bdup]"))) { e.stopPropagation(); var x = find(b.getAttribute("data-bdup")), cp = JSON.parse(JSON.stringify(x.o)); cp.id = uid(); cp.name += " 사본"; (function re(o) { (o.sets || []).forEach(function (s) { s.id = uid(); re(s); }); (o.ads || []).forEach(function (a) { a.id = uid(); }); })(cp); var arr = x.t === "c" ? B.camps : x.t === "s" ? x.c.sets : x.s.ads; arr.splice(arr.indexOf(x.o) + 1, 0, cp); B.sel = { id: cp.id }; bRe(); return; }
    if ((b = t.closest("[data-bdel]"))) { e.stopPropagation(); var y = find(b.getAttribute("data-bdel")), ar = y.t === "c" ? B.camps : y.t === "s" ? y.c.sets : y.s.ads; if ((y.t !== "a") && !confirm("하위 항목까지 함께 삭제할까요?")) return; ar.splice(ar.indexOf(y.o), 1); B.sel = { id: y.t === "a" ? y.s.id : y.t === "s" ? y.c.id : (B.camps[0] || {}).id }; bRe(); return; }
    if ((b = t.closest("[data-bsel]"))) { B.sel = { id: b.getAttribute("data-bsel") }; bRe(); return; }
    if ((b = t.closest("[data-badd-a]"))) { var s = find(b.getAttribute("data-badd-a")).o, a = newAd(s.ads.length + 1); s.ads.push(a); B.sel = { id: a.id }; bRe(); return; }
    if ((b = t.closest("[data-badd-s]"))) { var c = find(b.getAttribute("data-badd-s")).o, ns = newSet(c.sets.length + 1); c.sets.push(ns); B.sel = { id: ns.id }; bRe(); return; }
    if (t.closest("[data-badd-c]")) { var nc = { id: uid(), name: "새 캠페인", obj: "트래픽", budgetAt: "campaign", budget: 50000, sets: [newSet(1)] }; B.camps.push(nc); B.sel = { id: nc.id }; bRe(); return; }
    if (!f) return;
    if ((b = t.closest("[data-bobj]"))) { f.o.obj = b.getAttribute("data-bobj"); bRe(); return; }
    if ((b = t.closest("[data-bbat]"))) { f.o.budgetAt = b.getAttribute("data-bbat"); bRe(); return; }
    if ((b = t.closest("[data-bgen]"))) { f.o.gender = b.getAttribute("data-bgen"); bRe(); return; }
    if ((b = t.closest("[data-bmed]"))) { f.o.media = b.getAttribute("data-bmed"); if (f.o.media === "catalog" && !f.o.pset) f.o.pset = NW.CAT.sets[0].id; bRe(); return; }
    if ((b = t.closest("[data-bpset]"))) { f.o.pset = b.getAttribute("data-bpset"); bRe(); return; }
    if ((b = t.closest("[data-bcta]"))) { f.o.cta = b.getAttribute("data-bcta"); bRe(); return; }
    if ((b = t.closest("[data-breg]")) || (b = t.closest("[data-bpl]"))) { var key = b.hasAttribute("data-breg") ? "regions" : "place", v = b.getAttribute(key === "regions" ? "data-breg" : "data-bpl"), L = f.o[key], i = L.indexOf(v); if (i > -1) L.splice(i, 1); else L.push(v); bRe(); return; }
    if ((b = t.closest("[data-bint-x]"))) { f.o.interests.splice(+b.getAttribute("data-bint-x"), 1); bRe(); return; }
    if (t.closest("[data-bsave]")) { saveB(); NW.toast("초안을 저장했어요 (이 브라우저)"); return; }
    if (t.closest("[data-breview]")) { review(); return; }
    if (t.closest("[data-bmake]")) { B.camps.forEach(function (c) { B.made.unshift({ name: c.name, at: md(dstr(TODAY)) + " " + ("0" + new Date().getHours()).slice(-2) + ":" + ("0" + new Date().getMinutes()).slice(-2) }); }); B.made = B.made.slice(0, 12); NW.closeLayer(); bRe(); NW.toast("로컬 목록에 생성했어요 (데모 — 실제 광고 계정에는 안 올라가요)"); return; }
  });
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if ((e.key === "Enter" || e.key === " ") && t.hasAttribute && t.hasAttribute("data-bsel")) { e.preventDefault(); B.sel = { id: t.getAttribute("data-bsel") }; bRe(); var n = NW.$('[data-bsel="' + B.sel.id + '"]'); if (n) n.focus(); }
    if (e.key === "Enter" && t.hasAttribute && t.hasAttribute("data-bint") && !e.isComposing && t.value.trim()) { find(B.sel.id).o.interests.push(t.value.trim()); bRe(); var m = NW.$("[data-bint]"); if (m) m.focus(); }
  });
  document.addEventListener("input", function (e) {
    var t = e.target, k = t.dataset && t.dataset.bf, f;
    if (k) { f = find(B.sel.id); f.o[k] = t.type === "number" ? +t.value : t.value; saveB(); var pv = NW.$('[data-pv="' + k + '"]'); if (pv) pv.textContent = t.value; var tl = NW.$('[data-tl="' + f.o.id + '"]'); if (tl && k === "name") tl.textContent = t.value; var sm = document.getElementById("bSum"); if (sm) sm.textContent = totals(); return; }
    if (t.dataset && t.dataset.bage != null) { f = find(B.sel.id); var i = +t.dataset.bage, v = +t.value; f.o.age[i] = v; if (f.o.age[0] > f.o.age[1]) { f.o.age[1 - i] = v; NW.$('[data-bage="' + (1 - i) + '"]').value = v; } saveB(); document.getElementById("bAge").textContent = f.o.age[0] + " ~ " + f.o.age[1] + "세"; }
  });
  document.addEventListener("change", function (e) { if (e.target.dataset && (e.target.dataset.bf === "name" || e.target.dataset.bage != null)) NW.rerender(true); });

  /* ── 2. SEO · Keyword Trend ───────────────────────── */
  var KW = store.get("kw", { list: ["단기임대", "한달살기", "원룸 단기"], period: "26", src: "naver" });
  var KC = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899"];
  function series(k, n, src) { var r = NW.hashRng(k + src), base = 30 + r() * 40, tr = (r() - .35) * .9, out = []; for (var i = 0; i < 52; i++) { var sea = Math.sin((i + r() * 3) / 52 * Math.PI * 4) * 9; out.push(Math.max(2, base + tr * i + sea + (r() - .5) * 10)); } var mx = Math.max.apply(null, out); return out.slice(52 - n).map(function (v) { return Math.round(v / mx * 100); }); }
  function related(k) { var r = NW.hashRng("rel" + k), suf = ["가격", "후기", "추천", "계약", "서울", "대학가", "풀옵션", "보증금", "1주", "외국인"]; return suf.slice(0, 5 + Math.floor(r() * 3)).map(function (s) { var pc = Math.round(r() * 3000 + 200), mo = Math.round(pc * (2 + r() * 4)); return { kw: k + " " + s, base: k, pc: pc, mo: mo, comp: r() < .33 ? "높음" : r() < .66 ? "중간" : "낮음", sp: Array.apply(null, Array(12)).map(function () { return r(); }) }; }); }
  function spark(v) { var w = 80, h = 22, p = v.map(function (y, i) { return (i ? "L" : "M") + (i / (v.length - 1) * w).toFixed(1) + " " + (h - y * h).toFixed(1); }).join(" "); return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><path d="' + p + '" fill="none" stroke="var(--accent)" stroke-width="1.5"/></svg>'; }
  function kwTrend() {
    var n = +KW.period, mon = NW.monday(TODAY), labels = []; for (var i = n - 1; i >= 0; i--) labels.push(md(dstr(addD(mon, -7 * i))));
    var ser = KW.list.map(function (k, i) { return { name: k, type: "line", color: KC[i % KC.length], values: series(k, n, KW.src) }; });
    var rel = []; KW.list.forEach(function (k) { rel = rel.concat(related(k)); });
    return NW.hero("kw", "SEO · 검색 추이", "Keyword Trend", "키워드를 넣으면 주간 검색 상대지수(최고점 = 100)와 연관어를 보여줘요. 수치는 전부 가상이에요.", NW.refreshBtn())
      + '<div class="fbar"><div class="tagin kw">' + KW.list.map(function (k, i) { return '<span class="tag" style="border-color:' + KC[i % KC.length] + '"><i class="dt" style="background:' + KC[i % KC.length] + '"></i>' + esc(k) + '<button data-kw-x="' + i + '">×</button></span>'; }).join("") + (KW.list.length < 5 ? '<input placeholder="키워드 추가 (Enter · 최대 5개)" data-kw-in>' : '') + '</div><span class="sp"></span>'
      + NW.segHtml([["naver", "네이버"], ["google", "구글"]], KW.src, "data-kw-src") + NW.segHtml([["12", "3개월"], ["26", "6개월"], ["52", "12개월"]], KW.period, "data-kw-p") + '</div>'
      + '<div class="kg" style="margin-top:16px">' + ser.map(function (s) { var v = s.values, a = v.slice(-4).reduce(function (t, x) { return t + x; }, 0) / 4, p = v.slice(-8, -4).reduce(function (t, x) { return t + x; }, 0) / 4, dl = p ? (a - p) / p * 100 : 0; return '<div class="kpi"><div class="kl"><i class="tdot" style="background:' + s.color + '"></i>' + esc(s.name) + '</div><div class="kv tnum">' + Math.round(a) + '</div><div class="ks">최근 4주 평균 지수 <span class="dlt ' + (dl >= 0 ? 'up' : 'dn') + '">' + (dl >= 0 ? "▲" : "▼") + Math.abs(dl).toFixed(1) + '%</span></div></div>'; }).join("") + '</div>'
      + '<div style="margin-top:12px">' + NW.chartCard((KW.src === "naver" ? "네이버" : "구글") + " 검색 상대지수 · 주간", { labels: labels, h: 280, max: 100, fmt: function (v) { return Math.round(v); }, series: ser }) + '</div>'
      + '<div class="sec-h" style="margin-top:28px"><span class="code">REL</span><h2>연관 키워드</h2><span class="hint">행을 누르면 비교에 추가돼요</span></div><div class="card tw"><table class="t"><thead><tr><th>연관 키워드</th><th>기준</th><th class="r">월간 검색(PC)</th><th class="r">월간 검색(모바일)</th><th>경쟁</th><th>12개월 추이</th></tr></thead><tbody>'
      + rel.map(function (r) { return '<tr class="clk" data-kw-add="' + esc(r.kw) + '"><td><b>' + esc(r.kw) + '</b></td><td>' + esc(r.base) + '</td><td class="r tnum">' + ko(r.pc) + '</td><td class="r tnum">' + ko(r.mo) + '</td><td><span class="pill sm ' + (r.comp === "높음" ? "p-red" : r.comp === "중간" ? "p-amber" : "p-em") + '">' + r.comp + '</span></td><td>' + spark(r.sp) + '</td></tr>'; }).join("") + '</tbody></table></div>';
  }
  function kwSave() { store.set("kw", KW); NW.rerender(true); }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-kw-x]"))) { if (KW.list.length > 1) KW.list.splice(+b.getAttribute("data-kw-x"), 1); kwSave(); return; }
    if ((b = e.target.closest("[data-kw-src]"))) { KW.src = b.getAttribute("data-kw-src"); kwSave(); return; }
    if ((b = e.target.closest("[data-kw-p]"))) { KW.period = b.getAttribute("data-kw-p"); kwSave(); return; }
    if ((b = e.target.closest("[data-kw-add]"))) { var k = b.getAttribute("data-kw-add"); if (KW.list.indexOf(k) > -1) return; if (KW.list.length >= 5) { NW.toast("비교는 최대 5개까지예요"); return; } KW.list.push(k); kwSave(); NW.toast("‘" + k + "’ 를 비교에 추가했어요"); return; }
  });
  document.addEventListener("keydown", function (e) { var t = e.target; if (e.key === "Enter" && t.hasAttribute && t.hasAttribute("data-kw-in") && !e.isComposing && t.value.trim()) { if (KW.list.indexOf(t.value.trim()) < 0) KW.list.push(t.value.trim()); kwSave(); var n = NW.$("[data-kw-in]"); if (n) n.focus(); } });

  NW.PAGES["meta-ads"] = { render: metaAds };
  NW.PAGES["keyword-trend"] = { render: kwTrend };
})(window.NW);
