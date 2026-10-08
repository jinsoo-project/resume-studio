/* Catalog(상품 피드) · 검색광고 키워드 API · NAVER SA 빌더 — 전부 가상 데이터, 외부 호출 없음 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, won = NW.won, ic = NW.ic, md = NW.md, store = NW.store, dstr = NW.dstr, TODAY = NW.TODAY, fld = NW.fld, uid = NW.uid, grad = NW.grad, D = NW.D;
  var hhmm = function () { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };

  /* ── 1. Catalog — 상품 카탈로그 광고 ────────────────────
     흐름: 운영 DB 게시 룸타입 → 피드 편집(이미지·제목·설명·라벨·제외) → 피드 파일(URL) → 매체 수집(Meta 매시 · Google 매일 · 네이버 EP)
          → 매체 심사 → 상품 세트 → META 빌더 카탈로그 광고(초안 생성 후 빌더로 이동). 편집은 이 브라우저에만 저장돼요. */
  var ISSUES = ["이미지 해상도 부족 (최소 600×600)", "설명 5,000자 초과", "가격 형식 오류", "랜딩 URL 응답 지연", "재고 0 · 품절 처리 필요"];
  var MEDIA = { meta: { n: "Meta 카탈로그", d: "Advantage+ 카탈로그 광고 · 다이내믹 리타게팅", f: "XML (RSS 2.0)", sch: "매시 정각 예약 수집" }, google: { n: "Google 머천트 센터", d: "PMax · 쇼핑 광고", f: "XML (RSS 2.0)", sch: "매일 06:00 예약 수집" }, naver: { n: "네이버 쇼핑", d: "쇼핑검색 광고 · EP 3.0", f: "EP 3.0 (TSV)", sch: "전체 매일 04:00 · 요약 매시" } };
  var ST = { ok: ["승인", "p-em"], warn: ["경고", "p-amber"], err: ["오류", "p-red"] };
  var IMGL = ["대표", "침실", "주방 · 거실", "건물 외관"];
  var band = function (p) { return p <= 300000 ? "주 30만 이하" : p <= 500000 ? "주 30~50만" : "주 50만 이상"; };
  var ITEMS = D.listings.filter(function (l) { return l.operation_status === "PUBLISHED"; }).map(function (l) {
    var r = NW.hashRng("cat" + l.type_id), st = {}; ["meta", "google", "naver"].forEach(function (m) { var x = r(); st[m] = x < .8 ? "ok" : x < .93 ? "warn" : "err"; });
    var bad = ["meta", "google", "naver"].filter(function (m) { return st[m] !== "ok"; });
    return { id: "NW-" + l.type_id, base: l.branch_name + " · " + l.roomtype_name, branch: l.branch_name, room: l.roomtype_name, price: l.weekly_rent, stock: l.unit_count, sido: l.sido, seg: l.seg, st: st, issue: bad.length ? ISSUES[Math.floor(r() * ISSUES.length)] : "", seen: r() < .22, at: l.registered_at };
  });
  var EDIT = store.get("cat-edit", {});
  var CF = store.get("cat-f", { tab: "items", feed: "meta", st: "all", q: "all" });
  if (!CF.tab) CF.tab = "items"; if (!CF.q) CF.q = "all";
  var LOG = store.get("cat-log", []), BUILT = store.get("cat-built", "06:00");
  var ed = function (i) { return EDIT[i.id] || {}; };
  var titleOf = function (i) { return ed(i).title || i.base; };
  var descOf = function (i) { return ed(i).desc || (i.branch + " " + i.room + " — 가구·가전 풀옵션, 1주부터 계약. 보증금 부담 없이 " + i.sido + "에서 바로 입주할 수 있어요."); };
  var imgOf = function (i) { return ed(i).img || 0; };
  var inFeed = function (i) { return !ed(i).excl; };
  var edited = function (i) { var e = ed(i); return !!(e.title || e.desc || e.img || e.lab || e.excl); };
  var thumb = function (i, k) { return grad(i.id + ":" + (k == null ? imgOf(i) : k)); };
  var fmtW = function (v) { return v >= 10000 ? (v / 10000).toLocaleString("ko-KR") + "만" : ko(v); };
  /* 상품 세트 = 피드 상품을 조건으로 묶은 것 → 카탈로그 광고의 대상 */
  var SETS = [
    { id: "ps-all", name: "전체 상품", rule: ["피드 포함 상품 전체"], f: function () { return true; }, aud: "브로드 · Advantage+ 오디언스" },
    { id: "ps-seoul", name: "서울 · 주 50만 이하", rule: ["custom_label_1 = 서울", "price ≤ 500,000"], f: function (i) { return i.sido === "서울" && i.price <= 500000; }, aud: "서울 · 20~34세 · 자취 · 이사" },
    { id: "ps-direct", name: "직영 지점", rule: ["custom_label_0 = 직영"], f: function (i) { return i.seg === "직영"; }, aud: "브로드 · Advantage+ 오디언스" },
    { id: "ps-rt", name: "리타게팅 · 지난 14일 조회", rule: ["ViewContent 14일", "Purchase 제외"], f: function (i) { return i.seen; }, aud: "리타게팅 · 지난 14일 조회 · 미결제", rt: true }
  ];
  var setItems = function (sid) { var s = SETS.filter(function (x) { return x.id === sid; })[0] || SETS[0]; return ITEMS.filter(function (i) { return inFeed(i) && s.f(i); }); };
  NW.CAT = { sets: SETS, items: setItems, title: titleOf, thumb: thumb, price: function (i) { return "주 " + won(i.price); } };

  function xmlOf(i, hi) {
    var e = ed(i), h = function (k, v) { return (hi && e[k] ? '<mark>' : '') + v + (hi && e[k] ? '</mark>' : ''); };
    var lab = [i.seg, i.sido, band(i.price)].concat(e.lab ? [e.lab] : []);
    return '&lt;item&gt;\n  &lt;g:id&gt;' + i.id + '&lt;/g:id&gt;\n  &lt;g:title&gt;' + h("title", esc(titleOf(i))) + '&lt;/g:title&gt;\n  &lt;g:description&gt;' + h("desc", esc(descOf(i).slice(0, 38)) + '…') + '&lt;/g:description&gt;\n  &lt;g:image_link&gt;' + h("img", 'https://demo.example/img/' + i.id + '_' + imgOf(i) + '.jpg') + '&lt;/g:image_link&gt;\n  &lt;g:price&gt;' + i.price + ' KRW&lt;/g:price&gt;\n  &lt;g:availability&gt;' + (i.stock ? "in stock" : "out of stock") + '&lt;/g:availability&gt;\n  &lt;g:link&gt;https://demo.example/rooms/' + i.id + '&lt;/g:link&gt;\n'
      + lab.map(function (v, k) { return '  &lt;g:custom_label_' + k + '&gt;' + (k === 3 ? h("lab", esc(v)) : esc(v)) + '&lt;/g:custom_label_' + k + '&gt;'; }).join("\n") + '\n&lt;/item&gt;';
  }
  /* 수집 기록: 오늘 정각마다 Meta, 06:00 Google, 04:00 네이버 + 편집 저장 기록 */
  function pulls() {
    var h = new Date().getHours(), out = [], n = ITEMS.filter(inFeed).length;
    for (var k = h; k >= Math.max(0, h - 6); k--) out.push({ t: ("0" + k).slice(-2) + ":00", m: "meta", ok: k % 5 !== 2, n: n, ch: (k * 7) % 5 });
    if (h >= 6) out.push({ t: "06:00", m: "google", ok: true, n: n, ch: 4 });
    if (h >= 4) out.push({ t: "04:00", m: "naver", ok: true, n: n, ch: 6 });
    return LOG.slice(0, 6).map(function (l) { return { t: l.t, m: "edit", ok: true, n: n, ch: 1, txt: l.txt }; }).concat(out.sort(function (a, b) { return a.t < b.t ? 1 : -1; }));
  }

  function flow() {
    var all = ITEMS.length, inF = ITEMS.filter(inFeed).length, nEd = ITEMS.filter(edited).length, nEx = all - inF, m = CF.feed, ok = ITEMS.filter(function (i) { return inFeed(i) && i.st[m] === "ok"; }).length, err = ITEMS.filter(function (i) { return inFeed(i) && i.st[m] === "err"; }).length;
    var made = (store.get("builder", null) || { camps: [] }).camps.filter(function (c) { return c.catalog; }).length;
    var S = [["items", "운영 DB", "게시 룸타입 " + all + "개", "매시 정각 동기화"], ["items", "피드 편집", "수정 " + nEd + " · 제외 " + nEx, "이미지 · 제목 · 설명 · 라벨"], ["file", "피드 파일", "상품 " + inF + "개 · 3종", "마지막 생성 " + BUILT], ["file", "매체 수집", "Meta 매시 · Google 매일", "네이버 EP 매일 04:00"], ["diag", "매체 심사", "승인 " + (inF ? Math.round(ok / inF * 100) : 0) + "%", "오류 " + err + "개 · " + MEDIA[m].n.split(" ")[0]], ["sets", "상품 세트 → 광고", "세트 " + SETS.length + " · 광고 " + made, "META 빌더로 초안 생성"]];
    return '<ol class="cf">' + S.map(function (s, k) { return '<li><button type="button" class="cf-s' + (CF.tab === s[0] ? ' on' : '') + '" data-cat-tab="' + s[0] + '"><i>' + (k + 1) + '</i><b>' + s[1] + '</b><span class="tnum">' + s[2] + '</span><small>' + s[3] + '</small></button></li>'; }).join("") + '</ol>';
  }
  function tabItems() {
    var q = CF.q, list = ITEMS.filter(function (i) { return q === "all" || (q === "ed" && edited(i)) || (q === "ex" && !inFeed(i)) || (q === "bad" && i.issue); });
    var dot = function (i, m) { return '<i class="cf-dot d-' + i.st[m] + '" title="' + MEDIA[m].n + ' · ' + ST[i.st[m]][0] + '"></i>'; };
    return '<div class="fline">' + NW.segHtml([["all", "전체 " + ITEMS.length], ["ed", "수정됨 " + ITEMS.filter(edited).length], ["ex", "제외 " + ITEMS.filter(function (i) { return !inFeed(i); }).length], ["bad", "문제 " + ITEMS.filter(function (i) { return i.issue; }).length]], q, "data-cat-q") + '<span class="fl-note">행을 누르면 피드 편집기가 열려요 · 저장하면 피드 파일에 바로 반영돼요</span></div>'
      + '<div class="card tw"><table class="t cf-t" style="min-width:860px"><thead><tr><th></th><th>상품 ID</th><th>피드 제목</th><th class="r">주간 가격</th><th class="r">재고</th><th>라벨</th><th>Meta · Google · 네이버</th><th>피드 포함</th></tr></thead><tbody>'
      + list.slice(0, 60).map(function (i) { return '<tr class="clk' + (inFeed(i) ? '' : ' cf-ex') + '" data-cat="' + i.id + '"><td><span class="cth" style="background:' + thumb(i) + '"></span></td><td class="mono">' + i.id + '</td><td><b>' + esc(titleOf(i)) + '</b>' + (edited(i) && inFeed(i) ? ' <span class="pill sm p-sky">수정됨</span>' : '') + '</td><td class="r tnum">' + won(i.price) + '</td><td class="r tnum">' + i.stock + '</td><td><span class="faint">' + i.seg + ' · ' + i.sido + (ed(i).lab ? ' · ' + esc(ed(i).lab) : '') + '</span></td><td>' + dot(i, "meta") + dot(i, "google") + dot(i, "naver") + '</td><td><button type="button" class="tgl' + (inFeed(i) ? ' on' : '') + '" data-cat-inc="' + i.id + '" aria-label="피드 포함"><i></i></button></td></tr>'; }).join("")
      + '</tbody></table>' + (list.length > 60 ? '<div class="faint" style="padding:10px 12px">상위 60개 표시 · 전체 ' + list.length + '개</div>' : '') + '</div>';
  }
  function tabFile() {
    var n = ITEMS.filter(inFeed).length, sample = ITEMS.filter(inFeed).sort(function (a, b) { return edited(b) - edited(a); }).slice(0, 2);
    return '<div class="card tw"><table class="t" style="min-width:820px"><thead><tr><th>매체</th><th>형식</th><th>피드 URL</th><th class="r">상품</th><th>수집 일정</th><th>마지막 생성</th></tr></thead><tbody>'
      + Object.keys(MEDIA).map(function (m) { var u = "https://demo.example/api/catalog/feed" + (m === "naver" ? ".tsv" : ".xml") + "?ch=" + m; return '<tr><td><b>' + MEDIA[m].n + '</b><div class="faint" style="font-size:12px">' + MEDIA[m].d + '</div></td><td>' + MEDIA[m].f + '</td><td><button type="button" class="cf-url mono" data-copy="' + u + '" title="복사">' + u + '</button></td><td class="r tnum">' + n + '</td><td>' + MEDIA[m].sch + '</td><td class="tnum">오늘 ' + BUILT + '</td></tr>'; }).join("") + '</tbody></table></div>'
      + '<div class="g2 cf-g"><div><div class="lbl2">수집 기록 <small>오늘</small></div><div class="card tw"><table class="t"><thead><tr><th>시각</th><th>내용</th><th class="r">상품</th><th class="r">변경</th><th>결과</th></tr></thead><tbody>'
      + pulls().map(function (p) { return '<tr' + (p.m === "edit" ? ' class="cf-new"' : '') + '><td class="tnum">' + p.t + '</td><td>' + (p.m === "edit" ? '<b>피드 재생성</b> · ' + esc(p.txt) : MEDIA[p.m].n + ' 예약 수집') + '</td><td class="r tnum">' + p.n + '</td><td class="r tnum">' + p.ch + '</td><td><span class="pill sm ' + (p.ok ? "p-em" : "p-amber") + '">' + (p.m === "edit" ? "반영" : p.ok ? "성공" : "경고 2") + '</span></td></tr>'; }).join("") + '</tbody></table></div></div>'
      + '<div><div class="lbl2">피드 미리보기 · XML <small>수정한 칸은 노란색</small></div><div class="card" style="padding:14px"><pre class="code-b cf-xml">&lt;rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"&gt;\n&lt;channel&gt;\n' + sample.map(function (i) { return xmlOf(i, true); }).join("\n") + '\n…\n&lt;/channel&gt;</pre></div></div></div>';
  }
  function tabDiag() {
    var m = CF.feed, F = ITEMS.filter(inFeed), n = function (s) { return F.filter(function (i) { return i.st[m] === s; }).length; };
    var list = F.filter(function (i) { return (CF.st === "all" ? i.st[m] !== "ok" : i.st[m] === CF.st); });
    return '<div class="fline">' + NW.segHtml(Object.keys(MEDIA).map(function (k) { return [k, MEDIA[k].n]; }), m, "data-cat-feed", true) + '<span class="fl-note">' + MEDIA[m].d + '</span></div>'
      + '<div class="kg">' + NW.kpi("심사 대상", ko(F.length) + "개", "피드 포함 상품") + NW.kpi("승인", ko(n("ok")) + "개", (F.length ? (n("ok") / F.length * 100).toFixed(1) : 0) + "%", "acc") + NW.kpi("경고", ko(n("warn")) + "개", "노출은 되지만 품질 저하") + NW.kpi("오류", ko(n("err")) + "개", "노출 중단 — 우선 수정", "bad") + '</div>'
      + '<div class="fline">' + NW.segHtml([["all", "문제 전체"], ["warn", "경고"], ["err", "오류"]], CF.st, "data-cat-st") + '<span class="fl-note">편집기에서 고친 뒤 저장하면 다음 수집 때 다시 심사돼요</span></div>'
      + '<div class="card tw"><table class="t" style="min-width:700px"><thead><tr><th></th><th>상품 ID</th><th>피드 제목</th><th>상태</th><th>문제</th><th></th></tr></thead><tbody>'
      + (list.length ? list.slice(0, 40).map(function (i) { return '<tr class="clk" data-cat="' + i.id + '"><td><span class="cth" style="background:' + thumb(i) + '"></span></td><td class="mono">' + i.id + '</td><td><b>' + esc(titleOf(i)) + '</b></td><td><span class="pill sm ' + ST[i.st[m]][1] + '">' + ST[i.st[m]][0] + '</span></td><td class="faint">' + esc(i.issue) + '</td><td><button class="btn sm" data-cat-fix="' + i.id + '">자동 수정 요청</button></td></tr>'; }).join("") : '<tr><td colspan="6" class="faint" style="padding:18px">이 매체에 남은 문제가 없어요</td></tr>') + '</tbody></table></div>';
  }
  function tabSets() {
    var camps = (store.get("builder", null) || { camps: [] }).camps;
    return '<p class="fl-note" style="margin:0 0 12px">상품 세트는 피드 상품을 라벨 · 가격 · 행동 조건으로 묶은 거예요. 세트를 고르면 META 빌더에 <b>카탈로그 광고 초안</b>(캠페인 · 세트 · 다이내믹 소재)이 만들어지고 빌더로 넘어가요.</p>'
      + '<div class="cf-sets">' + SETS.map(function (s) {
        var its = setItems(s.id), used = camps.filter(function (c) { return c.catalog === s.id; });
        return '<div class="card cf-set"><div class="cf-set-h"><b>' + esc(s.name) + '</b><span class="tnum">' + its.length + '개 상품</span></div><div class="mchips">' + s.rule.map(function (r) { return '<span class="tag mono">' + esc(r) + '</span>'; }).join("") + '</div>'
          + '<div class="cf-strip">' + its.slice(0, 6).map(function (i) { return '<span style="background:' + thumb(i) + '" title="' + esc(titleOf(i)) + '"></span>'; }).join("") + (its.length > 6 ? '<em>+' + (its.length - 6) + '</em>' : '') + '</div>'
          + '<div class="cf-set-f"><small>' + (used.length ? '연결된 광고 ' + used.length + '개 · <a href="#/meta-ads">빌더에서 보기</a>' : '아직 연결된 광고 없음') + '</small><button class="btn btn-p sm" data-cat-ad="' + s.id + '">이 세트로 카탈로그 광고 만들기 →</button></div></div>';
      }).join("") + '</div>';
  }
  function catalog() {
    var body = CF.tab === "file" ? tabFile() : CF.tab === "diag" ? tabDiag() : CF.tab === "sets" ? tabSets() : tabItems();
    return NW.hero("catalog", "대시보드 · 상품 카탈로그 광고", "Catalog", "운영 DB의 게시 룸타입이 피드가 되어 Meta · Google · 네이버 상품광고로 넘어가는 과정을 한 화면에서 관리해요. 단계를 누르면 그 화면으로 가요.", '<button class="btn" data-cat-build>' + ic("refresh") + '피드 다시 만들기 <span style="color:var(--faint);font-weight:400">· 오늘 ' + BUILT + '</span></button>')
      + flow()
      + '<div class="cf-tabs">' + NW.segHtml([["items", "피드 상품"], ["file", "피드 파일 · 수집"], ["diag", "매체 심사"], ["sets", "상품 세트 · 광고"]], CF.tab, "data-cat-tab", true) + '</div>' + body;
  }

  /* 피드 편집기 */
  var DR = null;
  function preview(i, d) {
    return '<div class="fb cf-fb"><div class="fb-h"><span class="fb-av">김</span><div><b>' + NW.BRAND + '</b><small>광고 · 카탈로그</small></div></div><div class="fb-t">지금 비어 있는 방, 1주부터 계약해요.</div><div class="cf-car">'
      + [i].concat(ITEMS.filter(function (x) { return x.id !== i.id && inFeed(x) && x.sido === i.sido; }).slice(0, 2)).map(function (x, k) { var me = !k; return '<div class="cf-card"><div class="cf-ci" style="background:' + (me ? grad(i.id + ":" + d.img) : thumb(x)) + '"></div><b data-cf-pt="' + (me ? 1 : 0) + '">' + esc(me ? (d.title || i.base) : titleOf(x)) + '</b><span>주 ' + fmtW(x.price) + '원</span><button type="button">지금 예약하기</button></div>'; }).join("") + '</div></div>';
  }
  function openCat(id) {
    var i = ITEMS.filter(function (x) { return x.id === id; })[0], e = ed(i);
    DR = { id: id, img: e.img || 0, title: e.title || "", desc: e.desc || "", lab: e.lab || "", excl: !!e.excl };
    var cnt = function (k, max) { return '<small class="tnum cf-cnt" id="cfc-' + k + '">' + ((DR[k] || (k === "title" ? i.base : descOf(i))).length) + ' / ' + max + '</small>'; };
    NW.drawer("피드 편집 · " + esc(i.id), '<div class="cf-ed"><div>'
      + '<div class="lbl2" style="margin-top:0">이미지 선택 <small>매체에 나갈 대표 이미지 · 1080×1080 이상</small></div><div class="cf-imgs">' + IMGL.map(function (l, k) { return '<button type="button" class="cf-img' + (DR.img === k ? ' on' : '') + '" data-cf-img="' + k + '" style="background:' + grad(i.id + ":" + k) + '"><span>' + l + '</span></button>'; }).join("") + '</div>'
      + fld("피드 제목 " + cnt("title", 150), '<input class="inp" data-cf="title" maxlength="150" placeholder="' + esc(i.base) + '" value="' + esc(DR.title) + '">') + '<p class="cf-hint">검색어를 앞에 두면 클릭률이 올라가요 — 예) 선릉역 1분 · 풀옵션 스튜디오</p>'
      + fld("설명 " + cnt("desc", 5000), '<textarea class="inp" rows="4" data-cf="desc" maxlength="5000" placeholder="' + esc(descOf(i)) + '">' + esc(DR.desc) + '</textarea>')
      + '<div class="lbl2">커스텀 라벨 <small>상품 세트를 나눌 때 써요</small></div><div class="cf-labs"><span class="tag mono">0 · ' + i.seg + '</span><span class="tag mono">1 · ' + i.sido + '</span><span class="tag mono">2 · ' + band(i.price) + '</span><input class="inp" data-cf="lab" placeholder="3 · 직접 입력 (예: 가을 프로모션)" value="' + esc(DR.lab) + '"></div>'
      + '<label class="cf-ex-row"><span><b>피드에서 제외</b><small>체크하면 모든 매체 피드에서 빠지고 광고에 안 나가요</small></span><button type="button" class="tgl' + (DR.excl ? ' on' : '') + '" data-cf-ex><i></i></button></label>'
      + '</div><div><div class="lbl2" style="margin-top:0">광고 미리보기 · Meta 카탈로그 캐러셀</div><div id="cfPrev">' + preview(i, DR) + '</div>'
      + '<div class="lbl2">피드에 나갈 값</div><div class="kv2"><span class="mono">g:id</span><b class="mono">' + i.id + '</b><span class="mono">g:price</span><b class="mono">' + i.price + ' KRW</b><span class="mono">g:availability</span><b class="mono">' + (i.stock ? "in stock" : "out of stock") + '</b><span class="mono">매체 상태</span><b>' + Object.keys(MEDIA).map(function (m) { return '<span class="pill sm ' + ST[i.st[m]][1] + '">' + MEDIA[m].n.split(" ")[0] + ' ' + ST[i.st[m]][0] + '</span>'; }).join(" ") + '</b></div>'
      + (i.issue ? '<div class="warn" style="margin-top:12px"><b>⚠ ' + esc(i.issue) + '</b><div>고쳐서 저장하면 다음 수집 때 다시 심사돼요</div></div>' : '') + '</div></div>',
      '<button class="btn" data-cf-reset>원래대로</button><span style="flex:1"></span><button class="btn" data-close>닫기</button><button class="btn btn-p" data-cf-save>저장 → 피드 반영</button>', 980, '<span class="pill sm p-gray" style="margin-left:8px">' + esc(i.base) + '</span>');
  }
  function stamp(txt) { BUILT = hhmm(); store.set("cat-built", BUILT); LOG.unshift({ t: BUILT, txt: txt }); LOG = LOG.slice(0, 20); store.set("cat-log", LOG); }
  document.addEventListener("input", function (e) {
    var k = e.target.dataset && e.target.dataset.cf; if (!k || !DR) return;
    DR[k] = e.target.value; var c = document.getElementById("cfc-" + k); if (c) c.textContent = (e.target.value || e.target.placeholder).length + c.textContent.slice(c.textContent.indexOf(" /"));
    if (k === "title") { var pt = NW.$('[data-cf-pt="1"]'); if (pt) pt.textContent = e.target.value || e.target.placeholder; }
  });
  document.addEventListener("click", function (e) {
    var b, i;
    if ((b = e.target.closest("[data-cat-tab]"))) { CF.tab = b.getAttribute("data-cat-tab"); store.set("cat-f", CF); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cat-q]"))) { CF.q = b.getAttribute("data-cat-q"); store.set("cat-f", CF); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cat-feed]"))) { CF.feed = b.getAttribute("data-cat-feed"); store.set("cat-f", CF); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cat-st]"))) { CF.st = b.getAttribute("data-cat-st"); store.set("cat-f", CF); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cat-inc]"))) { e.stopPropagation(); var id = b.getAttribute("data-cat-inc"), x = EDIT[id] || {}; x.excl = !x.excl; EDIT[id] = x; store.set("cat-edit", EDIT); stamp(id + (x.excl ? " 피드 제외" : " 피드 포함")); NW.rerender(true); NW.toast(x.excl ? "피드에서 뺐어요 — 다음 수집부터 광고에 안 나가요 (데모)" : "피드에 다시 넣었어요 (데모)"); return; }
    if ((b = e.target.closest("[data-copy]"))) { NW.copy(b.getAttribute("data-copy")); return; }
    if ((b = e.target.closest("tr[data-cat]")) && !e.target.closest("[data-cat-fix]")) { openCat(b.getAttribute("data-cat")); return; }
    if ((b = e.target.closest("[data-cf-img]")) && DR) { DR.img = +b.getAttribute("data-cf-img"); NW.$$("[data-cf-img]").forEach(function (x) { x.classList.toggle("on", x === b); }); i = ITEMS.filter(function (x) { return x.id === DR.id; })[0]; document.getElementById("cfPrev").innerHTML = preview(i, DR); return; }
    if ((b = e.target.closest("[data-cf-ex]")) && DR) { DR.excl = !DR.excl; b.classList.toggle("on", DR.excl); return; }
    if (e.target.closest("[data-cf-reset]") && DR) { delete EDIT[DR.id]; store.set("cat-edit", EDIT); var rid = DR.id; NW.closeLayer(); NW.rerender(true); openCat(rid); NW.toast("원래 값으로 되돌렸어요"); return; }
    if (e.target.closest("[data-cf-save]") && DR) {
      var o = {}; if (DR.img) o.img = DR.img; if (DR.title.trim()) o.title = DR.title.trim(); if (DR.desc.trim()) o.desc = DR.desc.trim(); if (DR.lab.trim()) o.lab = DR.lab.trim(); if (DR.excl) o.excl = true;
      if (Object.keys(o).length) EDIT[DR.id] = o; else delete EDIT[DR.id]; store.set("cat-edit", EDIT);
      stamp(DR.id + " " + (o.excl ? "제외" : "수정")); NW.closeLayer(); DR = null; NW.rerender(true);
      NW.toast("저장 → 피드 파일에 바로 반영했어요 · Meta는 다음 정각 수집 때 업데이트 (데모)"); return;
    }
    if ((b = e.target.closest("[data-cat-fix]"))) { e.stopPropagation(); i = ITEMS.filter(function (x) { return x.id === b.getAttribute("data-cat-fix"); })[0]; i.st[CF.feed] = "ok"; if (!["meta", "google", "naver"].some(function (m) { return i.st[m] !== "ok"; })) i.issue = ""; NW.closeLayer(); stamp(i.id + " 자동 수정"); NW.rerender(true); NW.toast("수정 반영 → 다음 수집 때 재심사돼요 (데모)"); return; }
    if (e.target.closest("[data-cat-build]")) { stamp("수동 재생성 · 상품 " + ITEMS.filter(inFeed).length + "개"); NW.rerender(true); NW.toast("피드 3종을 다시 만들었어요 (데모)"); return; }
    if ((b = e.target.closest("[data-cat-ad]"))) { var s = SETS.filter(function (x) { return x.id === b.getAttribute("data-cat-ad"); })[0]; if (NW.metaCatalog) { NW.metaCatalog(s); NW.toast("META 빌더에 ‘" + s.name + "’ 카탈로그 광고 초안을 만들었어요"); location.hash = "#/meta-ads"; } return; }
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
