/* Ads builder · 콘텐츠 파이프라인 · SEO · PARTNERSHIP 화면 — 전부 가상 데이터 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, won = NW.won, ic = NW.ic, md = NW.md, store = NW.store, ri = NW.ri, pick = NW.pick, chance = NW.chance, dstr = NW.dstr, addD = NW.addD, TODAY = NW.TODAY;
  var av = NW.av, grad = NW.grad, drawer = NW.drawer, fld = NW.fld, uid = NW.uid, AG = NW.AG, AGN = NW.AGN;

  /* ── 1. META Ads 캠페인 빌더 ──────────────────────────── */
  var OBJ = ["인지도", "트래픽", "참여", "잠재 고객", "앱 홍보", "판매"], CTA = ["더 알아보기", "지금 예약하기", "가입하기", "문의하기"];
  var REG = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "제주"], PLACE = ["피드", "스토리", "릴스", "탐색", "메신저", "오디언스 네트워크"];
  function newAd(n) { return { id: uid(), name: "광고 " + n, media: "image", body: "보증금 부담 없이, 1주부터 시작하는 내 방.", title: "풀옵션 단기임대", cta: "더 알아보기", link: "https://nestwell.example/stay?utm_source=meta&utm_medium=paid_social" }; }
  function newSet(n) { return { id: uid(), name: "광고세트 " + n, daily: 30000, start: dstr(addD(TODAY, 1)), end: dstr(addD(TODAY, 30)), age: [20, 34], gender: "all", regions: ["서울", "경기"], interests: ["자취", "이사"], place: ["피드", "스토리", "릴스"], ads: [newAd(1)] }; }
  function seedB() {
    var s1 = newSet(1); s1.name = "20~34 · 대학가"; s1.interests = ["대학생", "자취", "이사"]; s1.ads.push(newAd(2)); s1.ads[1].media = "video"; s1.ads[1].name = "룸 투어 릴스"; s1.ads[1].body = "캐리어만 들고 오세요. 가구·가전 다 있어요.";
    var s2 = newSet(2); s2.name = "25~39 · 직장인 수도권"; s2.age = [25, 39]; s2.interests = ["직장인", "출장", "한달살기"]; s2.ads.push(newAd(2));
    var s3 = newSet(1); s3.name = "지난 30일 조회 · 미결제"; s3.regions = []; s3.interests = ["리타게팅"]; s3.ads[0].title = "보던 방, 아직 비어 있어요"; s3.ads[0].cta = "지금 예약하기";
    return { acct: "데모 광고 계정 01", camps: [{ id: uid(), name: "가을 이사철 — 판매", obj: "판매", budgetAt: "campaign", budget: 150000, sets: [s1, s2] }, { id: uid(), name: "리타게팅 — 트래픽", obj: "트래픽", budgetAt: "set", budget: 0, sets: [s3] }], sel: null, made: [] };
  }
  var B = store.get("builder", null) || seedB();
  if (!B.sel) B.sel = { t: "c", id: B.camps[0].id };
  var saveB = function () { store.set("builder", B); };
  function find(id) { var r = null; B.camps.forEach(function (c) { if (c.id === id) r = { t: "c", o: c, c: c }; c.sets.forEach(function (s) { if (s.id === id) r = { t: "s", o: s, c: c, s: s }; s.ads.forEach(function (a) { if (a.id === id) r = { t: "a", o: a, c: c, s: s }; }); }); }); return r; }
  function totals() { var s = 0, a = 0, bud = 0; B.camps.forEach(function (c) { if (c.budgetAt === "campaign") bud += +c.budget || 0; c.sets.forEach(function (x) { s++; a += x.ads.length; if (c.budgetAt === "set") bud += +x.daily || 0; }); }); return "캠페인 " + B.camps.length + " · 세트 " + s + " · 소재 " + a + " · 일 예산 합계 " + won(bud); }
  function tree() {
    var row = function (lvl, id, icon, label, sub, acts) { var on = B.sel.id === id; return '<div class="tr' + (on ? ' on' : '') + '" tabindex="0" role="button" data-bsel="' + id + '" style="padding-left:' + (10 + lvl * 18) + 'px"><span class="tr-i">' + icon + '</span><div class="tr-t"><b data-tl="' + id + '">' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div><span class="tr-a"><button class="ib" data-bdup="' + id + '" title="복제">' + ic("copy") + '</button><button class="ib" data-bdel="' + id + '" title="삭제">' + ic("x") + '</button></span></div>'; };
    var add = function (lvl, attr, id, t) { return '<button class="tadd" style="margin-left:' + (10 + lvl * 18) + 'px" ' + attr + '="' + id + '">＋ ' + t + '</button>'; };
    return B.camps.map(function (c) {
      return row(0, c.id, "▤", c.name, c.obj + " · " + (c.budgetAt === "campaign" ? "캠페인 예산 " + won(c.budget) : "세트 예산")) + c.sets.map(function (s) {
        return row(1, s.id, "▣", s.name, s.age[0] + "~" + s.age[1] + "세 · " + (s.regions.join("·") || "전국")) + s.ads.map(function (a) { return row(2, a.id, a.media === "video" ? "▶" : "▢", a.name, a.cta); }).join("") + add(2, "data-badd-a", s.id, "광고 추가");
      }).join("") + add(1, "data-badd-s", c.id, "광고세트 추가");
    }).join("") + '<button class="tadd" style="margin:6px 10px 0" data-badd-c>＋ 캠페인 추가</button>';
  }
  function chips(list, on, attr) { return '<div class="mchips">' + list.map(function (x) { return '<button type="button" class="chip2' + (on.indexOf(x) > -1 ? ' on' : '') + '" ' + attr + '="' + esc(x) + '">' + esc(x) + '</button>'; }).join("") + '</div>'; }
  function adPreview(a) {
    return '<div class="fb"><div class="fb-h"><span class="fb-av">N</span><div><b>' + NW.BRAND + '</b><small>광고 · 🌐</small></div></div><div class="fb-t" data-pv="body">' + esc(a.body) + '</div>'
      + '<div class="fb-img" style="background:' + grad(a.id) + '">' + (a.media === "video" ? '<span class="play">▶</span>' : '') + '</div>'
      + '<div class="fb-c"><div><small>NESTWELL.EXAMPLE</small><b data-pv="title">' + esc(a.title) + '</b></div><button type="button" data-pv="cta">' + esc(a.cta) + '</button></div><div class="fb-a"><span>♡ 좋아요</span><span>💬 댓글</span><span>➤ 공유</span><span style="margin-left:auto">🔖</span></div></div>';
  }
  function editor() {
    var f = find(B.sel.id); if (!f) { B.sel = { t: "c", id: B.camps[0] ? B.camps[0].id : "" }; f = find(B.sel.id); }
    if (!f) return '<div class="card empty"><b>캠페인이 없어요</b><p>왼쪽에서 ＋ 캠페인 추가를 눌러 시작하세요.</p></div>';
    var o = f.o, inp = function (k, l, type) { return fld(l, '<input class="inp" data-bf="' + k + '" type="' + (type || "text") + '" value="' + esc(o[k]) + '">'); };
    var top = '<div class="sheet-top"><div><b>' + (f.t === "c" ? "캠페인" : f.t === "s" ? "광고세트" : "광고(소재)") + '</b><small>' + (f.t === "c" ? esc(o.name) : f.t === "s" ? esc(f.c.name) + " › " + esc(o.name) : esc(f.c.name) + " › " + esc(f.s.name) + " › " + esc(o.name)) + '</small></div></div>';
    var body;
    if (f.t === "c") body = '<section class="bsec"><h3>캠페인 설정</h3>' + inp("name", "캠페인 이름") + fld("목표", NW.segHtml(OBJ.map(function (x) { return [x, x]; }), o.obj, "data-bobj", true))
      + fld("예산 위치 <small>캠페인·세트 중 한 곳만 쓸 수 있어요 ⛔</small>", NW.segHtml([["campaign", "캠페인 예산(CBO)"], ["set", "광고세트 예산"]], o.budgetAt, "data-bbat", true))
      + (o.budgetAt === "campaign" ? inp("budget", "캠페인 일 예산(원)", "number") : '<p class="faint">예산은 각 광고세트에서 정해요.</p>') + '</section>';
    else if (f.t === "s") body = '<section class="bsec"><h3>광고세트</h3>' + inp("name", "세트 이름")
      + '<div class="g2x">' + (f.c.budgetAt === "set" ? inp("daily", "일 예산(원)", "number") : fld("일 예산", '<input class="inp" disabled value="캠페인 예산 사용 중">')) + '<div class="g2x">' + inp("start", "시작", "date") + inp("end", "종료", "date") + '</div></div>'
      + fld("연령 <b class='tnum' id='bAge'>" + o.age[0] + " ~ " + o.age[1] + "세</b>", '<div class="rng2"><input type="range" min="18" max="65" value="' + o.age[0] + '" data-bage="0"><input type="range" min="18" max="65" value="' + o.age[1] + '" data-bage="1"></div>')
      + fld("성별", NW.segHtml([["all", "전체"], ["m", "남성"], ["f", "여성"]], o.gender, "data-bgen"))
      + fld("지역 <small>비우면 전국</small>", chips(REG, o.regions, "data-breg"))
      + fld("관심사", '<div class="tagin">' + o.interests.map(function (x, i) { return '<span class="tag">' + esc(x) + '<button data-bint-x="' + i + '">×</button></span>'; }).join("") + '<input placeholder="입력 후 Enter" data-bint></div>')
      + fld("노출 위치", chips(PLACE, o.place, "data-bpl")) + '</section>';
    else body = '<div class="bad"><section class="bsec"><h3>소재</h3>' + inp("name", "광고 이름") + fld("형식", NW.segHtml([["image", "이미지"], ["video", "영상"]], o.media, "data-bmed"))
      + '<div class="thumb1" style="background:' + grad(o.id) + '">' + (o.media === "video" ? '<span class="play">▶</span>' : ic("image")) + '<button class="btn sm" data-toast="데모에서는 가상 썸네일을 써요">교체</button></div>'
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
    if ((b = t.closest("[data-bmed]"))) { f.o.media = b.getAttribute("data-bmed"); bRe(); return; }
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

  /* ── 2. 콘텐츠 파이프라인 — 블로그 여정 맵 ──────────────── */
  var STEPS = [["01", "키워드 트렌드", "서치", "검색 추이·연관어에서 후보 키워드를 뽑아요", "키워드 후보"], ["02", "아이데이션", "스트래", "후보 키워드를 글 주제로 묶고 우선순위를 매겨요", "주제안"], ["03", "브리프", "플래니", "타깃·검색 의도·목차·CTA 를 한 장으로", "브리프"], ["04", "제작", "하루", "브리프대로 초안을 쓰고 이미지를 붙여요", "초안"], ["05", "검수", "서치", "SEO 체크리스트 · 사실 확인 · 톤", "검수 완료"], ["06", "관리", "플래니", "발행 일정 · 담당 · 버전을 관리해요", "발행 대기"], ["07", "발행", "하루", "블로그 발행 + 채널별 요약 배포", "발행"], ["08", "성과", "퍼포", "유입·체류·전환을 글 단위로 집계", "성과 리포트"], ["09", "자동화", "케어", "잘 된 글은 CRM·뉴스레터로 재활용", "자동화 룰"]];
  var POSTS = (function () { var T = ["단기임대 계약 전 체크리스트 7가지", "한달살기 비용 현실 정리", "대학가 원룸 vs 단기임대 비교", "외국인 유학생 방 구하기 가이드", "보증금 없는 방 구하는 법", "이사 전 꼭 확인할 관리비 항목", "워케이션 하기 좋은 동네", "첫 자취 준비물 리스트", "출장 한 달, 숙소 고르는 기준", "풀옵션 원룸의 진짜 옵션", "단기임대 후기 읽는 법", "학기 단위 계약 팁"], o = []; for (var i = 0; i < T.length; i++) { var st = Math.min(9, Math.max(1, 9 - Math.floor(i * .8) - ri(0, 1))); o.push({ id: "p" + i, title: T[i], kw: pick(["단기임대", "한달살기", "원룸", "자취", "유학생 숙소", "보증금 없는 방"]), step: st, due: dstr(addD(TODAY, ri(-3, 21))), views: st >= 8 ? ri(300, 4200) : 0 }); } return o; })();
  function pipeline() {
    var cnt = STEPS.map(function (s, i) { return POSTS.filter(function (p) { return p.step === i + 1; }).length; });
    var pub = POSTS.filter(function (p) { return p.step >= 7; }).length;
    return NW.hero("pipe", "콘텐츠 파이프라인 · 블로그", "블로그 파이프라인 — 여정 맵", "키워드에서 자동화까지 9단계. 단계마다 담당 에이전트가 산출물을 넘겨 줘요. 단계를 누르면 무슨 일을 하는지 볼 수 있어요.")
      + '<div class="kg" style="margin-top:20px">' + NW.kpi("이번 달 발행", pub + "편", "목표 8편") + NW.kpi("진행 중", (POSTS.length - pub) + "편", "01~06 단계") + NW.kpi("평균 리드타임", "9.4일", "키워드 → 발행") + NW.kpi("자동화 단계", "3 / 9", "05 · 08 · 09 자동") + '</div>'
      + '<div class="sec-h" style="margin-top:28px"><span class="code">MAP</span><h2>여정 맵</h2><span class="hint">가로로 넘겨 보세요</span></div>'
      + '<div class="jm">' + STEPS.map(function (s, i) {
        var agc = AG.filter(function (a) { return a[0] === s[2]; })[0], state = cnt[i] ? "진행중" : i < 3 ? "완료" : "대기";
        return '<button class="jstep" data-step="' + i + '"><div class="js-n"><span>' + s[0] + '</span>' + (i < 8 ? '<i></i>' : '') + '</div><div class="js-c"><div class="js-h"><b>' + s[1] + '</b><span class="pill sm ' + (state === "진행중" ? "p-sky" : state === "완료" ? "p-em" : "p-gray") + '">' + state + '</span></div>'
          + '<div class="js-ag">' + av(s[2], 26) + '<div><b>' + s[2] + '</b><small>' + agc[1] + '</small></div></div><p>' + s[3] + '</p><div class="js-o"><span>산출물</span><b>' + s[4] + ' <em class="tnum">' + cnt[i] + '</em></b></div></div></button>';
      }).join("") + '</div>'
      + '<div class="sec-h" style="margin-top:28px"><span class="code">NOW</span><h2>진행 중인 글</h2><span class="hint">' + POSTS.length + '편</span></div><div class="card tw"><table class="t" style="min-width:860px"><thead><tr><th>제목</th><th>키워드</th><th>단계</th><th>담당</th><th>마감</th><th class="r">조회</th></tr></thead><tbody>'
      + POSTS.slice().sort(function (a, b) { return a.step - b.step; }).map(function (p) { var s = STEPS[p.step - 1]; return '<tr class="clk" data-step="' + (p.step - 1) + '"><td><b>' + esc(p.title) + '</b></td><td><span class="pill sm p-gray">' + esc(p.kw) + '</span></td><td><div class="prog">' + STEPS.map(function (_, k) { return '<i class="' + (k < p.step - 1 ? 'd' : k === p.step - 1 ? 'c' : '') + '"></i>'; }).join("") + '<span>' + s[0] + ' ' + s[1] + '</span></div></td><td>' + av(s[2], 20) + ' ' + s[2] + '</td><td class="tnum' + (p.due < dstr(TODAY) && p.step < 7 ? ' danger' : '') + '">' + md(p.due) + '</td><td class="r tnum">' + (p.views ? ko(p.views) : "—") + '</td></tr>'; }).join("") + '</tbody></table></div>';
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-step]"); if (!b) return;
    var i = +b.getAttribute("data-step"), s = STEPS[i], ps = POSTS.filter(function (p) { return p.step === i + 1; });
    var CHK = [["최근 12주 검색량 추이", "연관어 30개 수집", "경쟁 글 상위 10개 확인"], ["주제 12개로 묶기", "검색 의도 분류", "우선순위 점수"], ["타깃 · 의도 · 목차", "CTA 1개", "내부 링크 3개"], ["초안 2,000자 이상", "이미지 5장", "표 1개"], ["제목에 키워드", "H2 구조", "사실 확인 · 톤"], ["발행일 확정", "담당 배정", "버전 기록"], ["블로그 발행", "인스타 요약 카드", "뉴스레터 후보 등록"], ["유입 · 체류 · 전환", "상위 5편 리포트", "개선 제안"], ["CRM 시나리오 연결", "뉴스레터 재활용", "리라이트 알림"]][i];
    drawer(s[0] + " · " + s[1], '<div class="js-ag big">' + av(s[2], 40) + '<div><b>' + s[2] + '</b><small>' + AG.filter(function (a) { return a[0] === s[2]; })[0][1] + ' 에이전트</small></div></div><div class="note">' + s[3] + '</div>'
      + '<div class="lbl2">체크리스트</div><div class="chk">' + CHK.map(function (c, k) { return '<label><input type="checkbox"' + (k < 2 ? ' checked' : '') + '> ' + c + '</label>'; }).join("") + '</div>'
      + '<div class="lbl2">이 단계에 있는 글 <small>' + ps.length + '</small></div>' + (ps.length ? ps.map(function (p) { return '<div class="dl"><div class="dl-t"><b>' + esc(p.title) + '</b><small>키워드 ' + esc(p.kw) + ' · 마감 ' + md(p.due) + '</small></div></div>'; }).join("") : '<p class="faint">지금은 없어요.</p>')
      + '<div class="demo-note">데모에서는 여정 맵만 열려 있어요 — 단계별 상세 화면(01~09)은 비활성화돼 있어요.</div>', '<button class="btn" data-close>닫기</button>', 480);
  });

  /* ── 3. SEO · Keyword Trend ───────────────────────── */
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

  /* ── 4. 입점사 & 공급사 현황 ─────────────────────────── */
  var STAGE = [["리서치", "#94a3b8"], ["컨택", "#0ea5e9"], ["미팅", "#6366f1"], ["제안", "#8b5cf6"], ["협상", "#f59e0b"], ["계약", "#10b981"], ["온보딩", "#14b8a6"], ["운영", "#16a34a"]];
  var PT = store.get("partners", null) || (function () {
    var o = [], P = ["가나", "다온", "라온", "마루", "바른", "새길", "온누리", "한빛", "푸른", "하람", "누리", "새봄"], S = ["부동산", "공인중개", "하우징", "리빙", "스테이", "자산관리", "임대관리"], CH = ["트래블", "캠퍼스 커뮤니티", "이사 앱", "중개 플랫폼", "워케이션 클럽", "유학 커뮤니티", "기업 복지몰", "여행 카페"];
    for (var i = 0; i < 44; i++) { var ch = i >= 28, st = ri(1, 8), nm = ch ? pick(P) + " " + CH[i % CH.length] : pick(P) + " " + pick(S), logs = []; for (var k = 0; k < ri(0, 4); k++) logs.push({ id: uid(), at: dstr(addD(TODAY, -ri(1, 90))), text: pick(["첫 통화 — 관심 있음", "소개서 메일 발송", "미팅 일정 조율 중", "수수료 조건 문의", "계약서 초안 전달", "온보딩 가이드 공유", "월간 정산 확인"]) }); logs.sort(function (a, b) { return a.at < b.at ? 1 : -1; }); o.push({ id: uid(), kind: ch ? "channel" : "vendor", name: nm, region: pick(["서울", "경기", "인천", "부산", "대전", "온라인"]), stage: st, owner: pick(["스트래", "플래니", "케어", "나"]), last: logs[0] ? logs[0].at : "", contact: { name: pick(["김", "이", "박", "최", "정"]) + "담당", email: "partner" + (100 + i) + "@example.com", phone: "010-0000-" + (1000 + i) }, rooms: ch ? 0 : ri(3, 60), logs: logs }); }
    return o;
  })();
  var savePT = function () { store.set("partners", PT); };
  var PS = store.get("pt-s", { tab: "vendor", sort: ["last", -1], q: "", st: 0 });
  function stBadge(p) { var s = STAGE[p.stage - 1]; return '<button class="stb" data-pt-st="' + p.id + '" style="--c:' + s[1] + '" title="눌러서 다음 단계로"><i></i>' + p.stage + ' ' + s[0] + '</button>'; }
  function partners() {
    var rows = PT.filter(function (p) { return p.kind === PS.tab && (!PS.st || p.stage === PS.st) && (!PS.q || (p.name + p.contact.name + p.region).indexOf(PS.q) > -1); });
    var k = PS.sort[0], dir = PS.sort[1]; rows.sort(function (a, b) { var x = a[k], y = b[k]; return (x > y ? 1 : x < y ? -1 : 0) * dir; });
    var all = PT.filter(function (p) { return p.kind === PS.tab; });
    var th = function (key, l, cls) { return '<th class="srt ' + (cls || "") + '" data-pt-sort="' + key + '">' + l + (k === key ? (dir > 0 ? " ▲" : " ▼") : "") + '</th>'; };
    return NW.hero("pt", "PARTNERSHIP · CRM", "입점사 & 공급사 현황", "입점 파트너와 판매 채널을 8단계로 관리해요. 단계 배지를 누르면 다음 단계로, 행을 누르면 연락처·소통 기록이 열려요. (업체명·연락처는 전부 가상)")
      + '<div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + NW.segHtml([["vendor", "입점사", null, PT.filter(function (p) { return p.kind === "vendor"; }).length], ["channel", "판매채널", null, PT.filter(function (p) { return p.kind === "channel"; }).length]], PS.tab, "data-pt-tab", true) + '<span class="sp" style="flex:1"></span><input class="inp" style="width:220px" placeholder="이름·지역 검색" data-pt-q value="' + esc(PS.q) + '"></div>'
      + '<div class="stages">' + STAGE.map(function (s, i) { var n = all.filter(function (p) { return p.stage === i + 1; }).length; return '<button class="' + (PS.st === i + 1 ? 'on' : '') + '" data-pt-f="' + (i + 1) + '" style="--c:' + s[1] + '"><small>' + (i + 1) + '</small><b>' + s[0] + '</b><em class="tnum">' + n + '</em></button>'; }).join("") + '</div>'
      + '<div class="card tw"><table class="t" style="min-width:860px"><thead><tr>' + th("name", "이름") + th("region", "지역") + th("stage", "단계") + (PS.tab === "vendor" ? th("rooms", "매물 수", "r") : "") + th("owner", "담당") + th("last", "최근 컨택일") + '<th>담당자</th><th class="c">기록</th></tr></thead><tbody>'
      + (rows.length ? rows.map(function (p) { return '<tr class="clk" data-pt="' + p.id + '"><td title="' + esc(p.name) + '"><b>' + esc(p.name) + '</b></td><td>' + p.region + '</td><td>' + stBadge(p) + '</td>' + (PS.tab === "vendor" ? '<td class="r tnum">' + p.rooms + '</td>' : '') + '<td>' + av(p.owner, 20) + ' ' + esc(p.owner) + '</td><td class="tnum">' + (p.last || '<span class="faint">—</span>') + '</td><td>' + esc(p.contact.name) + '</td><td class="c tnum">' + p.logs.length + '</td></tr>'; }).join("") : '<tr><td colspan="8"><div class="empty"><b>조건에 맞는 파트너가 없어요</b><p>검색어나 단계 필터를 지워 보세요.</p></div></td></tr>') + '</tbody></table></div>';
  }
  function openPt(id) {
    var p = PT.filter(function (x) { return x.id === id; })[0];
    var body = '<div class="kvg"><span>구분</span><b>' + (p.kind === "vendor" ? "입점사" : "판매채널") + '</b><span>지역</span><b>' + p.region + '</b><span>담당</span><b>' + av(p.owner, 18) + ' ' + esc(p.owner) + '</b><span>최근 컨택</span><b class="tnum">' + (p.last || "—") + (p.last ? ' <button class="lnk" data-pt-clr="' + p.id + '">비우기</button>' : '') + '</b></div>'
      + '<div class="lbl2">단계</div><div class="stpick">' + STAGE.map(function (s, i) { return '<button class="' + (p.stage === i + 1 ? 'on' : i + 1 < p.stage ? 'past' : '') + '" style="--c:' + s[1] + '" data-pt-set="' + (i + 1) + '" data-id="' + p.id + '">' + s[0] + '</button>'; }).join("") + '</div>'
      + '<div class="lbl2">연락처</div><div class="ct">' + [["담당자", p.contact.name], ["이메일", p.contact.email], ["전화", p.contact.phone]].map(function (r) { return '<div><span>' + r[0] + '</span><b class="mono">' + esc(r[1]) + '</b><button class="ib" data-copy="' + esc(r[1]) + '" title="복사">' + ic("copy") + '</button></div>'; }).join("") + '</div>'
      + '<div class="lbl2">소통 기록 <small>' + p.logs.length + '</small></div><div class="cm-in"><input class="inp" placeholder="예) 소개서 메일 발송 (Enter)" data-pt-log="' + p.id + '"><button class="btn" data-pt-logb="' + p.id + '">추가</button></div>'
      + '<div class="tl">' + (p.logs.length ? p.logs.map(function (l) { return '<div class="tl-i"><i></i><div><small class="tnum">' + l.at + '</small><p>' + esc(l.text) + '</p></div><button class="ib" data-pt-ldel="' + l.id + '" data-id="' + p.id + '" title="삭제">🗑</button></div>'; }).join("") : '<p class="faint">아직 기록이 없어요.</p>') + '</div>';
    drawer(esc(p.name), body, '<button class="btn" data-close>닫기</button>', 500);
  }
  function addLog(id) { var inp = NW.$('[data-pt-log="' + id + '"]'), p = PT.filter(function (x) { return x.id === id; })[0]; if (!inp.value.trim()) return; p.logs.unshift({ id: uid(), at: dstr(TODAY), text: inp.value.trim() }); p.last = dstr(TODAY); savePT(); openPt(id); NW.rerender(true); var n = NW.$('[data-pt-log="' + id + '"]'); if (n) n.focus(); }
  document.addEventListener("click", function (e) {
    var b, byId = function (id) { return PT.filter(function (x) { return x.id === id; })[0]; };
    if ((b = e.target.closest("[data-pt-st]"))) { e.stopPropagation(); var p = byId(b.getAttribute("data-pt-st")); p.stage = p.stage % 8 + 1; savePT(); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-pt-tab]"))) { PS.tab = b.getAttribute("data-pt-tab"); PS.st = 0; store.set("pt-s", PS); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-pt-f]"))) { var v = +b.getAttribute("data-pt-f"); PS.st = PS.st === v ? 0 : v; store.set("pt-s", PS); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-pt-sort]"))) { var key = b.getAttribute("data-pt-sort"); PS.sort = [key, PS.sort[0] === key ? -PS.sort[1] : 1]; store.set("pt-s", PS); NW.rerender(true); return; }
    if ((b = e.target.closest("tr[data-pt]"))) { openPt(b.getAttribute("data-pt")); return; }
    if ((b = e.target.closest("[data-pt-set]"))) { byId(b.getAttribute("data-id")).stage = +b.getAttribute("data-pt-set"); savePT(); openPt(b.getAttribute("data-id")); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-pt-clr]"))) { byId(b.getAttribute("data-pt-clr")).last = ""; savePT(); openPt(b.getAttribute("data-pt-clr")); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-pt-logb]"))) { addLog(b.getAttribute("data-pt-logb")); return; }
    if ((b = e.target.closest("[data-pt-ldel]"))) { var q = byId(b.getAttribute("data-id")); q.logs = q.logs.filter(function (l) { return l.id !== b.getAttribute("data-pt-ldel"); }); savePT(); openPt(q.id); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-copy]"))) { NW.copy(b.getAttribute("data-copy")); return; }
  });
  document.addEventListener("keydown", function (e) { var t = e.target; if (e.key === "Enter" && t.dataset && t.dataset.ptLog && !e.isComposing) addLog(t.dataset.ptLog); });
  document.addEventListener("input", function (e) { if (e.target.hasAttribute("data-pt-q")) { PS.q = e.target.value; store.set("pt-s", PS); clearTimeout(PS._t); PS._t = setTimeout(function () { NW.rerender(true); var n = NW.$("[data-pt-q]"); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 250); } });

  /* ── 5. 소개서 & 제안서 관리 ──────────────────────────── */
  var CAT = [["univ", "대학교", "#2563eb", "🎓"], ["estate", "부동산", "#16a34a", "🏢"], ["vendor", "입점", "#ea580c", "🏠"], ["channel", "공급채널", "#7c3aed", "🔗"], ["client", "고객제휴", "#db2777", "🤝"]];
  var DOCS = store.get("docs", null) || (function () {
    var o = [], T = { univ: ["유학생 숙소 제휴 제안서", "학기 단위 기숙 대안 소개서"], estate: ["공실 해결 파트너십 제안서", "위탁 운영 소개서"], vendor: ["호스트 입점 안내서", "입점 수수료 · 정산 가이드"], channel: ["판매 채널 연동 제안서", "제휴 상품 구성안"], client: ["기업 출장 숙소 제휴안", "임직원 복지 제휴 소개서"] };
    CAT.forEach(function (c) { T[c[0]].forEach(function (t) { var n = ri(1, 3); for (var v = 1; v <= n; v++) o.push({ id: uid(), cat: c[0], title: t, ver: "v1." + (v - 1), at: dstr(addD(TODAY, -ri(0, 40) - (n - v) * 20)), pages: ri(8, 24), latest: v === n, by: pick(["스트래", "플래니", "픽셀"]) }); }); });
    return o;
  })();
  var DC = store.get("docs-cat", "all");
  function proposals() {
    var list = DOCS.filter(function (d) { return DC === "all" || d.cat === DC; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var cat = function (k) { return CAT.filter(function (c) { return c[0] === k; })[0]; };
    return NW.hero("docs", "PARTNERSHIP · 자료", "소개서 & 제안서 관리", "대상별 소개서·제안서를 버전과 함께 모아 둬요. ★ 는 최신 버전이에요.", '<button class="btn btn-p" data-doc-up>' + ic("plus") + '업로드</button>')
      + '<div class="catp"><button class="' + (DC === "all" ? 'on' : '') + '" data-doc-cat="all"><span class="ce">📁</span><b>전체</b><em>' + DOCS.length + '</em></button>' + CAT.map(function (c) { return '<button class="' + (DC === c[0] ? 'on' : '') + '" data-doc-cat="' + c[0] + '" style="--c:' + c[2] + '"><span class="ce">' + c[3] + '</span><b>' + c[1] + '</b><em>' + DOCS.filter(function (d) { return d.cat === c[0]; }).length + '</em></button>'; }).join("") + '</div>'
      + '<div class="dgal">' + list.map(function (d) { var c = cat(d.cat); return '<button class="doc" data-doc="' + d.id + '"><div class="doc-th" style="--c:' + c[2] + '"><div class="pg"><i></i><i></i><i></i><i></i></div><span class="pill sm" style="background:' + c[2] + ';color:#fff">' + c[1] + '</span>' + (d.latest ? '<span class="star" title="최신">★</span>' : '') + '</div><div class="doc-b"><b>' + esc(d.title) + '</b><small><span class="mono">' + d.ver + '</span> · ' + d.pages + 'p · ' + md(d.at) + ' · ' + esc(d.by) + '</small></div></button>'; }).join("") + '</div>';
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-doc-cat]"))) { DC = b.getAttribute("data-doc-cat"); store.set("docs-cat", DC); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-doc]"))) {
      var d = DOCS.filter(function (x) { return x.id === b.getAttribute("data-doc"); })[0], c = CAT.filter(function (x) { return x[0] === d.cat; })[0], vers = DOCS.filter(function (x) { return x.title === d.title; }).sort(function (a, b2) { return a.ver < b2.ver ? 1 : -1; });
      NW.layer('<div class="ov"><div class="md sm"><div class="md-h"><div class="tt"><b>' + esc(d.title) + ' <span class="mono" style="font-weight:500;color:var(--faint)">' + d.ver + '</span></b><span>' + c[1] + ' · ' + d.pages + '페이지 · ' + d.at + ' · ' + esc(d.by) + '</span></div><button class="xb" data-close>' + ic("x") + '</button></div><div class="md-b" style="padding:18px 20px">'
        + '<div class="pages">' + [1, 2, 3].map(function (n) { return '<div class="pgv" style="--c:' + c[2] + '"><i></i><i></i><i></i><i></i><i></i><small>' + n + '</small></div>'; }).join("") + '</div>'
        + '<div class="lbl2">버전</div>' + vers.map(function (v) { return '<div class="dl"><span class="mono">' + v.ver + '</span><div class="dl-t"><b>' + (v.latest ? '★ 최신' : '이전 버전') + '</b><small>' + v.at + ' · ' + esc(v.by) + '</small></div></div>'; }).join("")
        + '</div><div class="md-f"><button class="btn" data-close>닫기</button><button class="btn btn-p" data-toast="다운로드 (데모 — 실제 파일은 없어요)">다운로드</button></div></div></div>');
      return;
    }
    if (e.target.closest("[data-doc-up]")) {
      NW.layer('<div class="ov"><div class="md sm"><div class="md-h"><div class="tt"><b>소개서 · 제안서 업로드</b><span>데모: 파일은 올라가지 않고 목록에만 추가돼요</span></div><button class="xb" data-close>' + ic("x") + '</button></div><div class="md-b" style="padding:18px 20px;display:flex;flex-direction:column;gap:14px">'
        + fld("대상", '<select class="inp" id="docC">' + CAT.map(function (c) { return '<option value="' + c[0] + '"' + (DC === c[0] ? ' selected' : '') + '>' + c[3] + ' ' + c[1] + '</option>'; }).join("") + '</select>') + fld("제목", '<input class="inp" id="docT" placeholder="예) 유학생 숙소 제휴 제안서">') + fld("버전", '<input class="inp mono" id="docV" value="v1.0">') + '<label class="dz">PDF 를 끌어다 놓거나 눌러서 선택<input type="file" accept=".pdf" id="docF" hidden></label></div><div class="md-f"><button class="btn" data-close>취소</button><button class="btn btn-p" data-doc-save>추가</button></div></div></div>');
      return;
    }
    if (e.target.closest("[data-doc-save]")) {
      var t = document.getElementById("docT").value.trim(), f = document.getElementById("docF"); if (!t && f.files[0]) t = f.files[0].name.replace(/\.pdf$/i, ""); if (!t) { document.getElementById("docT").focus(); return; }
      DOCS.forEach(function (x) { if (x.title === t) x.latest = false; });
      DOCS.unshift({ id: uid(), cat: document.getElementById("docC").value, title: t, ver: document.getElementById("docV").value || "v1.0", at: dstr(TODAY), pages: ri(6, 20), latest: true, by: "나" }); store.set("docs", DOCS); NW.closeLayer(); NW.rerender(true); NW.toast("추가했어요"); return;
    }
  });
  document.addEventListener("change", function (e) { if (e.target.id === "docF" && e.target.files[0]) { var dz = e.target.closest(".dz"); dz.firstChild.textContent = "📄 " + e.target.files[0].name + " "; } });

  NW.PAGES["meta-ads"] = { render: metaAds };
  NW.PAGES["blog-journey"] = { render: pipeline };
  NW.PAGES["keyword-trend"] = { render: kwTrend };
  NW.PAGES["partners"] = { render: partners };
  NW.PAGES["proposals"] = { render: proposals };
})(window.NW);
