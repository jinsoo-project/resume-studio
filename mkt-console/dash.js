/* DASHBOARD · MKT 대시보드 화면 (Total · Paid · GA4 · KPI & OKR) — 전부 가상 데이터 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, won = NW.won, pct = NW.pct, D = NW.D, F = NW.F, ic = NW.ic, TONE = NW.TONE, inR = NW.inR, md = NW.md;

  /* ── 공통 필터 바 ───────────────────────────────────── */
  function filterBar(opts) {
    opts = opts || {};
    var r = NW.rangeOf(F.range);
    var chips = NW.RANGES.map(function (x) { var on = F.range === x[0], rr = NW.rangeOf(x[0]); return [x[0], x[1], null, on ? (rr.s === rr.e ? md(rr.s) : md(rr.s) + "~" + md(rr.e)) : ""]; });
    return '<div class="fbar"><span class="btn" title="기간: ' + r.s + ' ~ ' + r.e + '">' + ic("calendar") + r.days + '일</span>'
      + NW.segHtml(chips, F.range, "data-f-range")
      + (opts.gran === false ? '' : NW.segHtml([["day", "일"], ["week", "주"], ["month", "월"]], F.gran, "data-f-gran"))
      + (opts.seg === false ? '' : NW.segHtml([["all", "전체"], ["direct", "직영", TONE.direct], ["private", "일반", TONE.private]], F.seg, "data-f-seg"))
      + '<span class="sp"></span>' + (opts.right || '') + '</div>';
  }
  NW.filterBar = filterBar;

  /* ── 집계 ─────────────────────────────────────────── */
  function calc(r) {
    var C = D.contracts.filter(NW.segOk);
    var paid = C.filter(function (c) { return c.status === "COMPLETED" && inR(c.completed_at, r); });
    var cohort = C.filter(function (c) { return inR(c.created_at, r); });
    var sum = function (a, k) { return a.reduce(function (t, x) { return t + (typeof k === "function" ? k(x) : x[k]); }, 0); };
    var st = function (s) { return cohort.filter(function (c) { return c.status === s; }); };
    var hostsIn = D.hosts.filter(function (h) { return !h.branchAcct && NW.segOk(h); });
    var listIn = D.listings.filter(NW.segOk);
    return {
      paid: paid, cohort: cohort,
      gmv: sum(paid, "gmv"), pay: sum(paid, "paid_amount"), dep: sum(paid, "deposit"), cnt: paid.length, rev: sum(paid, "commission"),
      rent: sum(paid, function (c) { return c.rent_fee - c.rent_discount; }), disc: sum(paid, "rent_discount"), mgmt: sum(paid, "management_fee"), clean: sum(paid, "cleaning_fee"),
      req: cohort.length, rej: st("REJECTED"), expA: st("EXPIRED_APPROVAL"), appr: cohort.filter(function (c) { return c.approved_at; }), cPre: st("CANCELED_NOPAY_PRE"), cPost: st("CANCELED_NOPAY"), expP: st("EXPIRED"), cAfter: st("CANCELED"), done: st("COMPLETED"), pendA: st("REQUESTED"), pendP: st("APPROVED"),
      gNew: D.guests.filter(function (g) { return inR(g.joined_at, r); }), gCum: D.guests.filter(function (g) { return g.joined_at <= r.e; }).length,
      hNew: hostsIn.filter(function (h) { return inR(h.joined_at, r); }), hCum: hostsIn.filter(function (h) { return h.joined_at <= r.e; }).length,
      lNew: listIn.filter(function (l) { return inR(l.registered_at, r); }), lCum: listIn.filter(function (l) { return l.registered_at <= r.e && l.operation_status === "PUBLISHED"; })
    };
  }
  var units = function (a) { return a.reduce(function (t, l) { return t + l.unit_count; }, 0); };

  /* ── BigKpi · DetailBox ─────────────────────────────── */
  var eok = function (n) { return n >= 1e8 ? [(n / 1e8).toFixed(2), "억원"] : n >= 1e4 ? [ko(n / 1e4), "만원"] : [ko(n), "원"]; };
  function bigKpi(o) {
    return '<div class="bk" data-open="' + (o.open || "") + '"><div class="bk-h">' + (o.tone ? '<i class="tdot" style="background:' + TONE[o.tone] + '"></i>' : '') + esc(o.name) + '</div>'
      + '<div class="bk-parts">' + o.parts.map(function (p) { return '<div class="bk-part"><div class="bk-v tnum' + (p.sm ? " mid" : "") + '"><span class="nclk" data-open="' + (p.open || o.open || "") + '"' + (p.full ? ' title="' + p.full + '"' : '') + '>' + p.v + '</span><small>' + esc(p.u || "") + '</small></div><div class="bk-l"><span class="chip">' + (p.tone ? '<i class="tdot" style="background:' + TONE[p.tone] + '"></i>' : '') + esc(p.l) + '</span></div></div>'; }).join("") + '</div>'
      + '<div class="bk-sub">' + esc(o.sub || "") + '</div>' + (o.extra ? '<div class="bk-x">' + o.extra + '</div>' : '<div style="height:12px"></div>') + '</div>';
  }
  var dbOpen = NW.store.get("db-open", {});
  function detailBox(key, title, rows, foot) {
    var open = dbOpen[key] !== false;
    return '<div class="db"><button type="button" class="db-h" data-db="' + key + '"><span>' + esc(title) + '</span><span>' + (open ? "▴ 숨김" : "▾ 펼침 · " + rows.length + "항목") + '</span></button>'
      + (open ? '<div class="db-rows">' + rows.map(function (r) {
        return '<div class="db-r' + (r.strong ? " strong" : "") + (r.open ? " clk" : "") + '"' + (r.open ? ' data-open="' + r.open + '"' : '') + (r.hint ? ' title="' + esc(r.hint) + '"' : '') + '><span class="l"><i style="background:' + (r.color || "var(--faint)") + '"></i><span>' + (r.who ? '<b>' + esc(r.who) + '</b> ' : '') + esc(r.l) + '</span></span>'
          + '<span class="v tnum">' + (r.p != null ? '<em>' + r.p + '</em>' : '') + '<strong style="' + (r.neg ? "color:var(--danger)" : r.faint ? "color:var(--faint)" : r.tint ? "color:" + r.color : "") + '">' + (r.neg ? "−" : "") + ko(r.v) + '</strong><small>' + esc(r.u || "원") + '</small></span></div>';
      }).join("") + (foot ? '<div class="db-foot">' + esc(foot) + '</div>' : '') + '</div>' : '') + '</div>';
  }

  /* 클릭된 숫자 → 행 모달 (키로 행 집합을 고름) */
  var OPEN = {};
  function reg(key, title, rows, sumKey, summary) { OPEN[key] = function () { NW.rowsModal(title, rows, sumKey ? function (a) { return a.reduce(function (t, x) { return t + x[sumKey]; }, 0); } : null, summary); }; return key; }

  /* ── Total Dashboard ───────────────────────────────── */
  var TD = NW.store.get("td", { tab: "snap", mode: "simple" });
  function totalDashboard() {
    var r = NW.rangeOf(F.range), K = calc(r);
    var tabs = NW.segHtml([["snap", "스냅샷"], ["mkt", "마케팅 성과"], ["sum", "요약"], ["all", "전체 현황"], ["host", "호스트"], ["guest", "게스트"]], TD.tab, "data-td-tab", true);
    var head = NW.hero("total", "대시보드 · " + NW.BRAND, "Total Dashboard", "거래·매출·광고비·획득 채널을 한 화면에서 — 전체 성과 중 마케팅이 만든 몫까지 같은 정의로 봐요. 숫자를 누르면 그 숫자를 만든 행 목록이 열려요.", NW.refreshBtn());
    var body = TD.tab === "snap" ? snapshot(r, K) : TD.tab === "mkt" ? paidBody(r, K) : TD.tab === "all" ? overview(r, K) : TD.tab === "host" ? hostTab(r, K) : TD.tab === "guest" ? guestTab(r, K) : summaryTab(r, K);
    return head + filterBar({ right: tabs }) + body;
  }
  function snapshot(r, K) {
    var sumBar = '<div style="display:flex;align-items:center;gap:10px;margin-top:18px">' + NW.segHtml([["simple", "간편보기"], ["detail", "자세히 보기"]], TD.mode, "data-td-mode") + '<span style="font-size:11.5px;color:var(--faint)">숫자 밑 점선 = 누르면 행 목록</span></div>';
    var feeRate = K.pay ? (K.rev / K.pay * 100).toFixed(1) : "0";
    reg("gmv", "거래액 · 결제완료 계약", K.paid, "gmv", '<div class="tnum" style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px"><span class="chip">결제금액 ' + won(K.pay) + '</span>+<span class="chip">보증금 ' + won(K.dep) + '</span>=<span class="chip" style="color:var(--text)">거래액 ' + won(K.gmv) + '</span></div>');
    reg("cnt", "결제건수 · 결제완료 계약", K.paid, "paid_amount"); reg("rev", "매출(게스트 수수료) · 결제완료 계약", K.paid, "commission");
    reg("req", "계약신청 · 기간 내 신청 코호트", K.cohort, null);
    ["rej", "expA", "appr", "expP", "cPre", "cPost", "cAfter"].forEach(function (k) { reg("st-" + k, "계약신청 상태 · " + { rej: "호스트 계약 거절", expA: "호스트 승인기한 만료", appr: "호스트 계약 승인", expP: "게스트 결제기한 만료", cPre: "게스트 계약취소(승인 전)", cPost: "게스트 계약취소(승인 후)", cAfter: "게스트 결제 후 취소" }[k], K[k], null); });
    reg("lnew", "신규 룸타입", [], null);
    var gmvBox = detailBox("gmv", "거래액 구성 디테일", [
      { l: "임대료(할인 반영)", v: K.rent, color: "var(--comp-rent)", p: pct(K.rent, K.gmv) }, { l: "관리비", v: K.mgmt, color: "var(--comp-mgmt)", p: pct(K.mgmt, K.gmv) }, { l: "퇴거청소비", v: K.clean, color: "var(--comp-clean)", p: pct(K.clean, K.gmv) },
      { l: "게스트 수수료", v: K.rev, color: "var(--comp-fee)", p: pct(K.rev, K.gmv) }, { l: "결제금액 소계", v: K.pay, color: "var(--accent)", strong: true, open: "cnt" }, { l: "보증금", v: K.dep, color: "var(--comp-dep)", p: pct(K.dep, K.gmv) }], "할인 " + won(K.disc) + " 반영 · 비중 = 거래액 대비");
    var revBox = detailBox("rev", "매출 디테일", [{ l: "게스트 수수료", v: K.rev, color: "var(--good)", strong: true, open: "rev" }, { l: "호스트 수수료(동일 가정)", v: K.rev, color: "var(--faint)", faint: true, hint: "가정치 · 실적 아님" }, { l: "합계(가정) ×2", v: K.rev * 2, color: "var(--faint)", faint: true }], "가정치는 실적이 아님");
    var stRows = [["rej", "호스트", "계약 거절", "danger"], ["expA", "호스트", "승인기한 만료", "amber"], ["appr", "호스트", "계약 승인", "good"], ["expP", "게스트", "결제기한 만료", "amber"], ["cPre", "게스트", "계약취소(승인 전)", "danger"], ["cPost", "게스트", "계약취소(승인 후)", "danger"], ["cAfter", "게스트", "결제 후 취소", "danger"]].map(function (x) { return { who: x[1], l: x[2], v: K[x[0]].length, u: "건", color: TONE[x[3]], tint: true, open: "st-" + x[0] }; });
    var reqBox = detailBox("req", "계약신청 상태값 디테일", stRows, "진행 중: 승인 대기 " + K.pendA.length + "건 · 결제 대기 " + K.pendP.length + "건");
    var cards = [
      bigKpi({ name: "거래액 / 결제건수", tone: "accent", open: "gmv", parts: [{ v: eok(K.gmv)[0], u: eok(K.gmv)[1], l: "거래액", open: "gmv", full: won(K.gmv) }, { v: ko(K.cnt), u: "건", l: "결제건수", sm: true, open: "cnt" }], sub: "거래액 = 결제금액 + 보증금", extra: gmvBox }),
      bigKpi({ name: "매출", tone: "good", open: "rev", parts: [{ v: eok(K.rev)[0], u: eok(K.rev)[1], l: "게스트 수수료", full: won(K.rev) }], sub: "결제금액의 " + feeRate + "% · 실적", extra: revBox }),
      bigKpi({ name: "계약신청", tone: "danger", open: "req", parts: [{ v: ko(K.req), u: "건", l: "기간 내 신청" }], sub: "아래 = 신청분의 현재 상태", extra: reqBox }),
      bigKpi({ name: "게스트 회원가입", open: "", parts: [{ v: ko(K.gNew.length), u: "명", l: "해당 기간" }, { v: ko(K.gCum), u: "명", l: "누적", sm: true }], sub: "누적 = 기간 끝 시점" }),
      bigKpi({ name: "호스트 회원가입", parts: [{ v: ko(K.hNew.length), u: "명", l: "해당 기간" }, { v: ko(K.hCum), u: "명", l: "누적", sm: true }], sub: "지점 계정 제외" }),
      bigKpi({ name: "신규 룸타입 / 객실수", parts: [{ v: ko(K.lNew.length), u: "개", l: "룸타입" }, { v: ko(units(K.lNew)), u: "개", l: "객실수", sm: true }], sub: "등록일 기준" }),
      bigKpi({ name: "누적 룸타입 / 객실수", parts: [{ v: ko(K.lCum.length), u: "개", l: "룸타입" }, { v: ko(units(K.lCum)), u: "개", l: "객실수", sm: true }], sub: "게시 중 · 주말 실측" })
    ];
    var title = F.range === "all" ? "전체" : NW.RANGES.filter(function (x) { return x[0] === F.range; })[0][1];
    var panel = '<section class="card gp" style="margin-top:12px"><div class="gp-h"><b>📌 해당 기간 · ' + esc(title) + ' (' + md(r.s) + '~' + md(r.e) + ')</b><span>' + r.days + '일 · 결제 = 완료일 기준 확정(취소 제외) · 매출 = 결제금액에 포함된 게스트 수수료 · 계약 = 기간 내 신청 코호트</span></div><div class="g7">' + cards.join("") + '</div></section>';
    if (TD.mode === "detail") panel = detailView(r, K);
    return sumBar + panel + mktTrack(r, K) + weeks4();
  }
  function detailView(r, K) {
    var ap = K.appr.length, dn = K.done.length + K.cAfter.length;
    var flow = '<div class="flow"><div class="fnode"><div class="t">계약요청 (전체)</div><div class="v tnum"><span class="nclk" data-open="req">' + ko(K.req) + '</span>건</div><div class="eq"><span>승인→<b>' + ko(ap) + '</b></span><span>거절 <b>' + K.rej.length + '</b></span><span>승인만료 <b>' + K.expA.length + '</b></span><span>승인 전 취소 <b>' + K.cPre.length + '</b></span><span>진행중·심사중 <b>' + K.pendA.length + '</b></span></div></div><div class="farr">→</div>'
      + '<div class="fnode"><div class="t">호스트 승인 거친 건</div><div class="v tnum"><span class="nclk" data-open="st-appr">' + ko(ap) + '</span>건</div><div class="r">요청 대비 ' + pct(ap, K.req) + '</div><div class="eq"><span>결제완료→<b>' + ko(dn) + '</b></span><span>결제만료 <b>' + K.expP.length + '</b></span><span>승인 후 취소 <b>' + K.cPost.length + '</b></span><span>진행중·결제대기 <b>' + K.pendP.length + '</b></span></div></div><div class="farr">→</div>'
      + '<div class="fnode"><div class="t">결제완료</div><div class="v tnum">' + ko(dn) + '건</div><div class="r">승인 대비 ' + pct(dn, ap) + '</div><div class="eq"><span>이후 취소·환불 <b>' + K.cAfter.length + '</b></span></div></div></div>';
    var met = function (l, v, s, tone, open) { return '<div class="met"><div class="kl">' + (tone ? '<i class="tdot" style="background:' + TONE[tone] + '"></i>' : '') + esc(l) + '</div><div class="kv tnum"' + (open ? ' ><span class="nclk" data-open="' + open + '">' + v + '</span>' : '>' + v) + '</div><div class="ks">' + esc(s || "") + '</div></div>'; };
    var gp = function (t, d, inner) { return '<section class="card gp" style="margin-top:12px"><div class="gp-h"><b>📌 ' + t + '</b><span>' + d + '</span></div>' + inner + '</section>'; };
    return gp("거래", "결제 = 완료일 기준 확정(취소 제외)", '<div class="mg">' + met("거래액", ko(K.gmv), "결제금액 + 보증금", "accent", "gmv") + met("결제금액", ko(K.pay), "임대료·관리비·청소비·수수료", null, "cnt") + met("보증금", ko(K.dep), "거래액에 포함") + met("결제건수", ko(K.cnt) + "건", "") + met("매출", ko(K.rev), "게스트 수수료 · 실적", "good", "rev") + met("건당 결제금액", ko(K.cnt ? K.pay / K.cnt : 0), "평균") + '</div>')
      + gp("계약", "기간 내 신청 코호트 → 현재 상태", flow)
      + gp("가입 · 매물", "누적 = 기간 끝 시점", '<div class="mg">' + met("게스트 가입", ko(K.gNew.length) + "명", "누적 " + ko(K.gCum)) + met("호스트 가입", ko(K.hNew.length) + "명", "누적 " + ko(K.hCum) + " · 지점 계정 제외") + met("신규 룸타입", ko(K.lNew.length) + "개", "객실 " + ko(units(K.lNew))) + met("누적 룸타입", ko(K.lCum.length) + "개", "객실 " + ko(units(K.lCum))) + '</div>');
  }
  function weeks4() {
    var mon = NW.monday(NW.TODAY), W = [0, 1, 2, 3].map(function (k) { var s = NW.addD(mon, -7 * (3 - k)); return { s: NW.dstr(s), e: NW.dstr(NW.addD(s, 6)), cur: k === 3 }; });
    var cols = [["거래액", function (r) { return calc(r).gmv; }, "원"], ["매출", function (r) { return calc(r).rev; }, "원"], ["계약신청", function (r) { return calc(r).req; }, "건"], ["게스트 가입", function (r) { return calc(r).gNew.length; }, "명"], ["호스트 가입", function (r) { return calc(r).hNew.length; }, "명"], ["신규 룸타입", function (r) { return calc(r).lNew.length; }, "개"], ["누적 룸타입", function (r) { return calc(r).lCum.length; }, "개"]];
    var open = NW.store.get("w4", false);
    return '<details class="w4"' + (open ? " open" : "") + ' data-w4><summary>최근 4주 보기</summary><section class="card gp"><div class="g7">' + cols.map(function (c) {
      var vals = W.map(function (w) { return c[1](w); }), mx = Math.max.apply(null, vals) || 1;
      return '<div class="w4c"><div class="hd">' + c[0] + '</div><div class="mbars">' + vals.map(function (v, k) { return '<i class="' + (W[k].cur ? "cur" : "") + '" style="height:' + Math.max(4, v / mx * 100) + '%" title="' + ko(v) + c[2] + '"></i>'; }).join("") + '</div>'
        + W.map(function (w, k) { var d = k ? vals[k] - vals[k - 1] : null; return '<div class="w4r"><span>' + md(w.s) + '~' + md(w.e) + (w.cur ? ' · 진행 중' : '') + '</span>' + (d == null ? '<span class="dlt eq">—</span>' : d === 0 ? '<span class="dlt eq">변화 없음</span>' : '<span class="dlt ' + (d > 0 ? "up" : "dn") + '">' + (d > 0 ? "▲ +" : "▼ ") + ko(d) + '</span>') + '<b class="tnum">' + ko(vals[k]) + '</b></div>'; }).reverse().join("") + '</div>';
    }).join("") + '</div></section></details>';
  }
  function overview(r, K) {
    var B = NW.buckets(r, F.gran), C = D.contracts.filter(NW.segOk);
    var inB = function (b) { return C.filter(function (c) { return c.status === "COMPLETED" && inR(c.completed_at, b); }); };
    var payS = B.map(function (b) { return inB(b).reduce(function (t, c) { return t + c.paid_amount; }, 0); }), depS = B.map(function (b) { return inB(b).reduce(function (t, c) { return t + c.deposit; }, 0); }), cntS = B.map(function (b) { return inB(b).length; });
    var comp = [["임대료", "var(--comp-rent)", function (c) { return c.rent_fee - c.rent_discount; }], ["관리비", "var(--comp-mgmt)", function (c) { return c.management_fee; }], ["청소비", "var(--comp-clean)", function (c) { return c.cleaning_fee; }], ["게스트 수수료", "var(--comp-fee)", function (c) { return c.commission; }], ["보증금", "var(--comp-dep)", function (c) { return c.deposit; }]];
    var bar = function (w, color) { return '<i style="width:' + w + '%;background:' + color + '"></i>'; };
    var pays = '<div class="card" style="padding:16px"><div style="font-size:12px;font-weight:600;color:var(--subtle)">거래액 (확정)</div><div class="tnum" style="font-size:26px;font-weight:800;letter-spacing:-.03em;margin-top:4px"><span class="nclk" data-open="gmv">' + won(K.gmv) + '</span></div>'
      + '<div style="display:flex;height:14px;border-radius:4px;overflow:hidden;margin:12px 0 10px">' + comp.map(function (x) { var v = K.paid.reduce(function (t, c) { return t + x[2](c); }, 0); return bar(K.gmv ? v / K.gmv * 100 : 0, x[1]); }).join("") + '</div>'
      + comp.map(function (x) { var v = K.paid.reduce(function (t, c) { return t + x[2](c); }, 0); return '<div class="db-r"><span class="l"><i style="background:' + x[1] + '"></i>' + x[0] + '</span><span class="v tnum"><em>' + pct(v, K.gmv) + '</em><strong>' + ko(v) + '</strong><small>원</small></span></div>'; }).join("")
      + '<div class="db-r strong"><span class="l"><i style="background:var(--accent)"></i>결제건수</span><span class="v tnum"><strong>' + ko(K.cnt) + '</strong><small>건</small></span></div></div>';
    var ch1 = NW.chartCard("결제금액·건수 추이", { labels: B.map(function (b) { return b.label; }), tipLabels: B.map(function (b) { return b.s + " ~ " + b.e; }), stacked: true, right: true, labelsOn: B.length <= 12, h: 250, series: [{ name: "결제금액", color: "var(--comp-rent)", values: payS }, { name: "보증금", color: "var(--comp-dep)", values: depS }, { name: "건수", type: "line", color: "var(--seg-private)", values: cntS }], fmt2: function (v) { return Math.round(v) + "건"; }, tipFmt: won });
    var ch2 = NW.chartCard("구성 추이", { labels: B.map(function (b) { return b.label; }), stacked: true, h: 250, tipFmt: won, series: comp.map(function (x) { return { name: x[0], color: x[1], values: B.map(function (b) { return inB(b).reduce(function (t, c) { return t + x[2](c); }, 0); }) }; }) });
    // O2 6단계
    var t = NW.dstr(NW.TODAY), stage = function (c) { if (c.status === "APPROVED" || c.status === "REQUESTED") return 0; if (c.status === "CANCELED") return 4; if (c.status !== "COMPLETED") return 5; if (c.start_at > t) return 1; if (c.end_at >= t) return 2; return 3; };
    var ST = ["결제대기", "입주 전", "이용 중", "퇴실", "환불", "무산"], coh = D.contracts.filter(function (c) { return inR(c.created_at, r); });
    var rowsFor = function (seg) { return coh.filter(function (c) { return !seg || c.seg === seg; }); };
    var mat = '<div class="card tw"><table class="t tnum"><thead><tr><th></th>' + ST.map(function (s) { return '<th class="r">' + s + '</th>'; }).join("") + '<th class="r">합계</th></tr></thead><tbody>' + [["합계", null], ["직영", "직영"], ["일반", "일반"]].map(function (row) {
      var rr = rowsFor(row[1]);
      return '<tr><td><b>' + row[0] + '</b></td>' + ST.map(function (s, i) { var sub = rr.filter(function (c) { return stage(c) === i; }), k = reg("o2-" + row[0] + i, "6단계 · " + row[0] + " · " + s, sub, "gmv"); return '<td class="r"><span class="nclk" data-open="' + k + '">' + ko(sub.length) + '</span></td>'; }).join("") + '<td class="r"><b>' + ko(rr.length) + '</b></td></tr>';
    }).join("") + '</tbody></table></div>';
    // O5 취소·환불
    var REASONS = ["일정 변경", "다른 매물 선택", "가격 부담", "호스트 응답 지연", "입주 조건 불일치", "기타"], canc = coh.filter(function (c) { return /CANCEL/.test(c.status); });
    var rc = REASONS.map(function (x, i) { return canc.filter(function (c) { return c.contract_id % 7 === i || (i === 5 && c.contract_id % 7 === 6); }).length; }), rmax = Math.max.apply(null, rc) || 1;
    var o5 = '<div class="g2"><div class="card mg">' + '<div class="met"><div class="kl"><i class="tdot" style="background:var(--danger)"></i>취소율</div><div class="kv tnum">' + pct(canc.length, coh.length) + '</div><div class="ks">취소 ' + ko(canc.length) + '건 / 신청 ' + ko(coh.length) + '건</div></div><div class="met"><div class="kl"><i class="tdot" style="background:var(--amber)"></i>환불률</div><div class="kv tnum">' + pct(K.cAfter.length, K.cnt + K.cAfter.length) + '</div><div class="ks">결제 후 취소 기준</div></div></div>'
      + '<div class="card" style="padding:14px 16px"><div style="font-size:12.5px;font-weight:600;margin-bottom:8px">취소 사유</div>' + REASONS.map(function (x, i) { return '<div style="display:flex;align-items:center;gap:10px;padding:3px 0"><span style="width:84px;flex:none;font-size:11.5px;color:var(--subtle)">' + x + '</span><div style="flex:1;height:10px;border-radius:3px;background:var(--surface2)"><div style="height:100%;width:' + rc[i] / rmax * 100 + '%;border-radius:3px;background:var(--danger);opacity:.75"></div></div><b class="tnum" style="width:40px;text-align:right;font-size:12px">' + rc[i] + '</b></div>'; }).join("") + '</div></div>';
    var sec = function (code, t, hint, inner) { return '<div class="sec"><div class="sec-h"><span class="code">' + code + '</span><h2>' + t + '</h2><span class="hint">' + hint + '</span></div>' + inner + '</div>'; };
    return sec("O1", "확정 거래(명목)", "완료일 기준 · 취소 제외", '<div style="display:grid;gap:12px;grid-template-columns:minmax(0,1fr)" class="o1">' + '<div class="g3" style="grid-template-columns:minmax(260px,.8fr) 1.2fr 1fr">' + pays + ch1 + ch2 + '</div></div>')
      + sec("O2", "6단계 매트릭스", "기간 내 신청 코호트의 현재 단계 · 셀 클릭 = 행 목록", mat)
      + sec("O5", "취소·환불", "사유는 데모 분류", o5)
      + sec("O6", "기준 설명", "", '<div class="card" style="padding:14px 18px;font-size:12px;color:var(--subtle);line-height:1.9">· 거래액 = 결제금액 + 보증금 · 결제금액 = 임대료(할인 후) + 관리비 + 퇴거청소비 + 게스트 수수료<br>· 확정 = 결제 완료일이 기간 안 · 결제 후 취소 제외<br>· 계약 코호트 = 신청일이 기간 안인 계약의 현재 상태<br>· 모든 수치는 데모용 가상 데이터예요.</div>');
  }
  function catBars(title, pairs, color) { var mx = Math.max.apply(null, pairs.map(function (p) { return p[1]; })) || 1; return '<div class="card" style="padding:14px 16px"><div style="font-size:12.5px;font-weight:600;margin-bottom:8px">' + title + '</div>' + pairs.map(function (p) { return '<div style="display:flex;align-items:center;gap:10px;padding:3px 0"><span style="width:84px;flex:none;font-size:11.5px;color:var(--subtle)">' + esc(p[0]) + '</span><div style="flex:1;height:10px;border-radius:3px;background:var(--surface2)"><div style="height:100%;width:' + p[1] / mx * 100 + '%;border-radius:3px;background:' + (color || "var(--accent)") + '"></div></div><b class="tnum" style="width:44px;text-align:right;font-size:12px">' + ko(p[1]) + '</b></div>'; }).join("") + '</div>'; }
  NW.catBars = catBars;
  function kpi(l, v, s, cls, tone) { return '<div class="kpi ' + (cls || "") + '"><div class="kl">' + (tone ? '<i class="tdot" style="background:' + TONE[tone] + '"></i>' : '') + esc(l) + '</div><div class="kv tnum">' + v + '</div><div class="ks">' + (s || "") + '</div></div>'; }
  NW.kpi = kpi;
  function summaryTab(r, K) {
    var B = NW.buckets(r, F.gran);
    return '<div class="kg" style="margin-top:18px">' + kpi("누적 게스트", ko(K.gCum) + "명", "기간 끝 시점", "big") + kpi("누적 호스트", ko(K.hCum) + "명", "지점 계정 제외") + kpi("게시 룸타입", ko(K.lCum.length) + "개", "객실 " + ko(units(K.lCum))) + kpi("결제완료", ko(K.cnt) + "건", "해당 기간", "acc") + kpi("매출", won(K.rev), "게스트 수수료") + '</div>'
      + '<div class="g2" style="margin-top:12px">' + NW.chartCard("누적 게스트 추이", { labels: B.map(function (b) { return b.label; }), h: 220, series: [{ name: "누적 게스트", type: "line", color: "var(--guest)", values: B.map(function (b) { return D.guests.filter(function (g) { return g.joined_at <= b.e; }).length; }) }] }) + NW.chartCard("게시 룸타입 추이", { labels: B.map(function (b) { return b.label; }), h: 220, series: [{ name: "게시 룸타입", type: "line", color: "var(--host)", values: B.map(function (b) { return D.listings.filter(function (l) { return NW.segOk(l) && l.registered_at <= b.e && l.operation_status === "PUBLISHED"; }).length; }) }] }) + '</div>';
  }
  function hostTab(r, K) {
    var reg2 = {}; D.listings.filter(NW.segOk).forEach(function (l) { reg2[l.sido] = (reg2[l.sido] || 0) + 1; });
    var rt = {}; D.listings.filter(NW.segOk).forEach(function (l) { rt[l.roomtype_name] = (rt[l.roomtype_name] || 0) + 1; });
    var sup = {}; D.listings.forEach(function (l) { sup[l.host_key] = 1; });
    var newL = K.lNew.slice(0, 12);
    return '<div class="kg" style="margin-top:18px">' + kpi("누적 호스트", ko(K.hCum) + "명", "지점 계정 제외", "big") + kpi("신규 호스트", ko(K.hNew.length) + "명", "해당 기간", "acc") + kpi("공급 호스트", ko(Object.keys(sup).length) + "명", "매물 보유 기준") + kpi("신규 룸타입", ko(K.lNew.length) + "개", "객실 " + ko(units(K.lNew))) + '</div>'
      + '<div class="g2" style="margin-top:12px">' + catBars("지역별 룸타입", Object.keys(reg2).map(function (k) { return [k, reg2[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 10), "var(--host)") + catBars("룸타입 분포", Object.keys(rt).map(function (k) { return [k, rt[k]]; }).sort(function (a, b) { return b[1] - a[1]; }), "var(--host)") + '</div>'
      + '<div class="lbl">신규 등록 매물</div><div class="card tw"><table class="t tnum"><thead><tr><th>등록일</th><th>지점</th><th>룸타입</th><th>구분</th><th>지역</th><th class="r">객실</th><th class="r">주간 임대료</th></tr></thead><tbody>' + (newL.map(function (l) { return '<tr><td>' + md(l.registered_at) + '</td><td>' + esc(l.branch_name) + '</td><td>' + esc(l.roomtype_name) + '</td><td>' + l.seg + '</td><td>' + l.sido + '</td><td class="r">' + l.unit_count + '</td><td class="r">' + won(l.weekly_rent) + '</td></tr>'; }).join("") || '<tr><td colspan="7" style="text-align:center;color:var(--faint)">해당 기간 신규 매물이 없어요</td></tr>') + '</tbody></table></div>';
  }
  function guestTab(r, K) {
    var B = NW.buckets(r, F.gran), nat = {}; K.gNew.forEach(function (g) { nat[g.nationality] = (nat[g.nationality] || 0) + 1; });
    var NATN = { KR: "한국", US: "미국", CN: "중국", JP: "일본", VN: "베트남", FR: "프랑스", DE: "독일" };
    return '<div class="kg" style="margin-top:18px">' + kpi("신규 게스트", ko(K.gNew.length) + "명", "해당 기간", "big acc") + kpi("누적 게스트", ko(K.gCum) + "명", "기간 끝 시점") + kpi("외국인 비중", pct(K.gNew.filter(function (g) { return g.nationality !== "KR"; }).length, K.gNew.length), "해당 기간 가입 기준") + kpi("재계약률", (18 + (K.gNew.length % 9)).toFixed(1) + "%", "데모 가정치") + '</div>'
      + '<div class="g2" style="margin-top:12px">' + NW.chartCard("가입 추이", { labels: B.map(function (b) { return b.label; }), h: 230, labelsOn: B.length <= 12, series: [{ name: "게스트 가입", color: "var(--guest)", values: B.map(function (b) { return D.guests.filter(function (g) { return inR(g.joined_at, b); }).length; }) }] }) + catBars("국적 분포", Object.keys(nat).map(function (k) { return [NATN[k] || k, nat[k]]; }).sort(function (a, b) { return b[1] - a[1]; }), "var(--guest)") + '</div>';
  }

  /* ── Paid Dashboard ─────────────────────────────────── */
  var CH = { meta: "Meta", google: "Google", naver: "Naver", kakao: "Kakao" }, CHC = { meta: "#4c6ab0", google: "#1baf7a", naver: "#0ca30c", kakao: "#d4a106" };
  function paidDashboard() { TD.tab = "mkt"; NW.store.set("td", TD); return totalDashboard(); }
  function paidBody(r, K) {
    var B = NW.buckets(r, F.gran), margin = NW.store.get("margin", 18);
    var ads = D.ads.filter(function (a) { return inR(a.date, r); }), spend = ads.reduce(function (t, a) { return t + a.spend; }, 0);
    var gs = K.gNew.length, hs = K.hNew.length, ls = K.lNew.length, roas = spend ? K.rev / spend : 0, REVK = K.pay ? K.rev / K.pay : 0, roi = spend ? (K.rev - spend) / spend : 0;
    var ltv = K.cnt ? K.rev / K.cnt * 1.32 : 0, cac = gs ? spend / gs : 0, lc = cac ? ltv / cac : 0;
    var right = '<button class="btn" data-spend-add>' + ic("plus") + '광고비 수기 입력</button>';
    var A = attrib(r), pctN = function (a, b) { return b ? (a / b * 100).toFixed(1) + "%" : "—"; };
    var attrRow = '<div class="mk-head"><div><b>광고 기여 요약</b><span>전체 거래 중 광고(페이드)가 만든 몫 · 채널 귀속은 라스트 클릭 가정(데모)</span></div><div style="display:flex;gap:8px">' + right + '</div></div>'
      + '<div class="kg">' + kpi("전체 거래액", wS(K.gmv), "결제금액 + 보증금", "big") + kpi("광고 기여 거래액", wS(A.pGmv), "전체의 " + pctN(A.pGmv, K.gmv), "acc", "accent") + kpi("자연·추천·직접 거래액", wS(K.gmv - A.pGmv), "전체의 " + pctN(K.gmv - A.pGmv, K.gmv)) + kpi("광고비 ÷ 매출", pctN(A.spend, K.rev), "매출(수수료) " + wS(K.rev) + " 대비", A.spend > K.rev ? "bad" : "") + kpi("페이드 ROAS", (A.spend ? A.pRev / A.spend * 100 : 0).toFixed(0) + "%", "광고 기여 매출 ÷ 광고비") + kpi("신규 게스트 광고 획득", pctN(A.gPaid, A.gAll), ko(A.gPaid) + " / " + ko(A.gAll) + "명") + '</div>';
    var grid = '<div class="lbl">퍼포먼스 지표</div><div class="kg">' + [
      kpi("총 광고비", wS(spend), "4개 채널 합계", "big"), kpi("게스트 가입 CAC", won(cac), "광고비 ÷ 가입 " + ko(gs) + "명"), kpi("호스트 가입 CAC", won(hs ? spend / hs : 0), "광고비 ÷ 가입 " + ko(hs) + "명"), kpi("방등록 CPA", won(ls ? spend / ls : 0), "광고비 ÷ 신규 룸타입 " + ko(ls)), kpi("결제 CPA", won(K.cnt ? spend / K.cnt : 0), "광고비 ÷ 결제 " + ko(K.cnt) + "건"),
      kpi("결제금액", wS(K.pay), "확정 · 보증금 제외", "acc", "accent"), kpi("ROAS", (roas * 100).toFixed(0) + "%", "매출(수수료) ÷ 광고비", "acc"), kpi("ROI", (roi * 100).toFixed(0) + "%", "(매출 − 광고비) ÷ 광고비", roi >= 0 ? "acc" : "bad"), kpi("게스트 LTV", wS(ltv), "건당 매출(수수료) × 재계약 1.32 (가정)"), kpi("LTV : CAC", lc.toFixed(1) + " : 1", lc >= 3 ? "건강" : lc < 1 ? "⚠ 손실 구간" : "관찰", lc >= 3 ? "acc" : lc < 1 ? "bad" : "")].join("") + '</div>';
    var sB = B.map(function (b) { return D.ads.filter(function (a) { return inR(a.date, b); }).reduce(function (t, a) { return t + a.spend; }, 0); });
    var pB = B.map(function (b) { return D.contracts.filter(function (c) { return NW.segOk(c) && c.status === "COMPLETED" && inR(c.completed_at, b); }).reduce(function (t, c) { return t + c.paid_amount; }, 0); });
    var gB = B.map(function (b) { return D.guests.filter(function (g) { return inR(g.joined_at, b); }).length; });
    var labels = B.map(function (b) { return b.label; }), pc = function (v) { return Math.round(v) + "%"; };
    var charts = '<div class="lbl">추이</div><div class="g2">'
      + NW.chartCard("광고비 vs 매출(수수료)", { labels: labels, h: 230, tipFmt: won, series: [{ name: "광고비", color: "var(--c2)", values: sB }, { name: "매출(수수료)", type: "line", color: "var(--accent)", values: pB.map(function (v) { return v * REVK; }) }] })
      + NW.chartCard("게스트 CAC 추이", { labels: labels, h: 230, tipFmt: won, series: [{ name: "CAC", type: "line", color: "var(--guest)", values: sB.map(function (s, i) { return gB[i] ? s / gB[i] : 0; }) }] })
      + NW.chartCard("ROAS · ROI", { labels: labels, h: 230, fmt: pc, series: [{ name: "ROAS", type: "line", color: "var(--accent)", values: sB.map(function (s, i) { return s ? pB[i] * REVK / s * 100 : 0; }) }, { name: "ROI", type: "line", color: "var(--seg-private)", dash: true, values: sB.map(function (s, i) { return s ? (pB[i] * REVK - s) / s * 100 : 0; }) }] })
      + NW.chartCard("채널별 광고비", { labels: labels, h: 230, stacked: true, tipFmt: won, series: Object.keys(CH).map(function (k) { return { name: CH[k], color: CHC[k], values: B.map(function (b) { return D.ads.filter(function (a) { return a.channel === k && inR(a.date, b); }).reduce(function (t, a) { return t + a.spend; }, 0); }) }; }) }) + '</div>';
    var share = { meta: .38, google: .3, naver: .22, kakao: .1 }, eff = { meta: 1.05, google: 1.15, naver: .95, kakao: .7 };
    var rows = Object.keys(CH).map(function (k) { var sp = ads.filter(function (a) { return a.channel === k; }).reduce(function (t, a) { return t + a.spend; }, 0), g = Math.round(gs * share[k] * eff[k] / 1.03), pay = K.pay * share[k] * eff[k] / 1.03; return { k: k, sp: sp, clk: ads.filter(function (a) { return a.channel === k; }).reduce(function (t, a) { return t + a.clicks; }, 0), g: g, n: Math.round(K.cnt * share[k] * eff[k] / 1.03), pay: pay }; });
    var srt = NW.store.get("paid-sort", ["sp", -1]); rows.sort(function (a, b) { var va = srt[0] === "cac" ? (a.g ? a.sp / a.g : 1e12) : srt[0] === "roas" ? (a.sp ? a.pay / a.sp : 0) : a[srt[0]], vb = srt[0] === "cac" ? (b.g ? b.sp / b.g : 1e12) : srt[0] === "roas" ? (b.sp ? b.pay / b.sp : 0) : b[srt[0]]; return (va - vb) * srt[1]; });
    var th = function (k, l) { return '<th class="r srt" data-psort="' + k + '">' + l + (srt[0] === k ? (srt[1] < 0 ? " ▼" : " ▲") : "") + '</th>'; };
    var table = '<div class="lbl">채널</div><div class="card tw"><table class="t tnum"><thead><tr><th>채널</th>' + th("sp", "광고비") + th("clk", "클릭") + th("g", "가입") + th("n", "결제") + th("cac", "CAC") + th("roas", "ROAS") + '</tr></thead><tbody>' + rows.map(function (x) { return '<tr><td><i class="tdot" style="display:inline-block;margin-right:8px;background:' + CHC[x.k] + '"></i><b>' + CH[x.k] + '</b></td><td class="r">' + won(x.sp) + '</td><td class="r">' + ko(x.clk) + '</td><td class="r">' + ko(x.g) + '명</td><td class="r">' + ko(x.n) + '건</td><td class="r">' + won(x.g ? x.sp / x.g : 0) + '</td><td class="r"><b>' + (x.sp ? (x.pay * REVK / x.sp * 100).toFixed(0) : 0) + '%</b></td></tr>'; }).join("") + '</tbody></table></div>';
    var sh = B.map(function (b) { var aa = attrib(b); return aa.gmv ? aa.pGmv / aa.gmv * 100 : 0; });
    var shareCh = NW.chartCard("광고 기여 비중 추이", { labels: labels, h: 200, max: 100, fmt: pc, series: [{ name: "거래액 중 광고 기여 %", type: "line", color: "var(--accent)", values: sh }, { name: "신규 게스트 중 광고 획득 %", type: "line", dash: true, color: "var(--guest)", values: B.map(function (b) { var aa = attrib(b); return aa.gAll ? aa.gPaid / aa.gAll * 100 : 0; }) }] }, "두 선이 같이 오르면 광고가 규모를 키우는 중 · 따로 놀면 채널 효율 점검");
    return '<div style="margin-top:18px">' + attrRow + '</div><div style="margin-top:12px">' + shareCh + '</div>' + grid + charts + table;
  }

  /* ── 획득 채널 귀속(데모 가정: 계약·가입 id 해시로 채널 배정 — 라스트 클릭 가정) ── */
  var ACH = ["meta", "google", "naver", "kakao", "organic", "referral", "direct"], AW = [.2, .15, .11, .05, .24, .1, .15];
  var ACHN = { meta: "Meta", google: "Google", naver: "Naver", kakao: "Kakao", organic: "자연 검색·SNS", referral: "추천·제휴", direct: "직접 방문" };
  var ACHC = { meta: "#4c6ab0", google: "#1baf7a", naver: "#0ca30c", kakao: "#d4a106", organic: "#8b5cf6", referral: "#ec4899", direct: "#94a3b8" };
  var PAID = { meta: 1, google: 1, naver: 1, kakao: 1 };
  function chOf(n) { var x = ((n * 2654435761) >>> 0) % 1000 / 1000, a = 0; for (var i = 0; i < ACH.length; i++) { a += AW[i]; if (x < a) return ACH[i]; } return "direct"; }
  var cCh = function (c) { return c._ch || (c._ch = chOf(c.contract_id)); }, gCh = function (g) { return g._ch || (g._ch = chOf(parseInt(String(g.guest_key).slice(1), 10) * 7 + g.joined_at.length)); };
  var wS = function (v) { var a = Math.abs(v); return a >= 1e8 ? (v / 1e8).toFixed(a >= 1e10 ? 0 : 1) + "억원" : a >= 1e4 ? Math.round(v / 1e4).toLocaleString("ko-KR") + "만원" : won(v); };
  function attrib(r) {
    var paid = D.contracts.filter(function (c) { return NW.segOk(c) && c.status === "COMPLETED" && inR(c.completed_at, r); });
    var o = { gmv: 0, pGmv: 0, pay: 0, pPay: 0, rev: 0, pRev: 0, by: {}, spend: 0, gAll: 0, gPaid: 0, gBy: {} };
    ACH.forEach(function (k) { o.by[k] = 0; o.gBy[k] = 0; });
    paid.forEach(function (c) { var k = cCh(c); o.gmv += c.gmv; o.pay += c.paid_amount; o.rev += c.commission; o.by[k] += c.gmv; if (PAID[k]) { o.pGmv += c.gmv; o.pPay += c.paid_amount; o.pRev += c.commission; } });
    D.ads.forEach(function (a) { if (inR(a.date, r)) o.spend += a.spend; });
    D.guests.forEach(function (g) { if (inR(g.joined_at, r)) { var k = gCh(g); o.gAll++; o.gBy[k]++; if (PAID[k]) o.gPaid++; } });
    return o;
  }
  NW.attrib = attrib;
  function mktTrack(r, K) {
    var A = attrib(r), B = NW.buckets(r, F.gran), labels = B.map(function (b) { return b.label; });
    var P = function (a, b) { return b ? (a / b * 100).toFixed(1) + "%" : "—"; };
    var prevR = { s: NW.dstr(NW.addD(NW.parseD(r.s), -r.days)), e: NW.dstr(NW.addD(NW.parseD(r.s), -1)) }, A0 = attrib(prevR);
    var dlt = function (a, b, inv) { if (!b) return '<span class="dlt eq">—</span>'; var d = (a - b) / b * 100, good = inv ? d < 0 : d > 0; return '<span class="dlt ' + (Math.abs(d) < .05 ? "eq" : good ? "up" : "dn") + '">' + (d >= 0 ? "▲" : "▼") + Math.abs(d).toFixed(1) + '%</span>'; };
    var roas = A.spend ? A.pRev / A.spend : 0, roas0 = A0.spend ? A0.pRev / A0.spend : 0, cac = A.gPaid ? A.spend / A.gPaid : 0, cac0 = A0.gPaid ? A0.spend / A0.gPaid : 0;
    var kk = function (l, v, s, d, tone) { return '<div class="kpi"><div class="kl">' + (tone ? '<i class="tdot" style="background:' + tone + '"></i>' : '') + esc(l) + '</div><div class="kv tnum">' + v + '</div><div class="ks">' + s + ' ' + (d || "") + '</div></div>'; };
    var krow = '<div class="kg">'
      + kk("광고 기여 거래액", wS(A.pGmv), "전체의 " + P(A.pGmv, A.gmv), dlt(A.pGmv, A0.pGmv), "var(--accent)")
      + kk("광고 기여 비중", P(A.pGmv, A.gmv), "직전 기간 " + P(A0.pGmv, A0.gmv), "", "var(--accent)")
      + kk("광고비", wS(A.spend), "4개 매체 합", dlt(A.spend, A0.spend, true), "#4c6ab0")
      + kk("광고비 ÷ 매출", P(A.spend, K.rev), "마케팅 비용률", "", "#f59e0b")
      + kk("페이드 ROAS", (roas * 100).toFixed(0) + "%", "광고 기여 매출 ÷ 광고비", dlt(roas, roas0), "#10b981")
      + kk("신규 게스트 광고 획득", P(A.gPaid, A.gAll), ko(A.gPaid) + "명 / " + ko(A.gAll) + "명", "", "#b95d18")
      + kk("페이드 CAC", wS(cac), "광고비 ÷ 광고 획득 가입", dlt(cac, cac0, true), "#ec4899")
      + kk("건당 거래액", wS(K.cnt ? K.gmv / K.cnt : 0), "결제 " + ko(K.cnt) + "건", "", "#94a3b8") + '</div>';
    var paidB = [], orgB = [], spB = [];
    B.forEach(function (b) { var a = attrib(b); paidB.push(a.pGmv); orgB.push(a.gmv - a.pGmv); spB.push(a.spend); });
    var ch1 = NW.chartCard("거래액 구성 추이 — 광고 기여 vs 그 외", { labels: labels, h: 240, stacked: true, right: true, tipFmt: won, fmt2: NW.short, series: [{ name: "광고 기여 거래액", color: "var(--accent)", values: paidB }, { name: "자연·추천·직접", color: "var(--c1)", values: orgB }, { name: "광고비 (오른쪽 축)", type: "line", color: "#f59e0b", values: spB }] }, "막대 = 거래액(광고 기여 + 그 외) · 선 = 광고비");
    var gSer = [["paid", "광고 (Meta·Google·Naver·Kakao)", "var(--accent)"], ["organic", "자연 검색·SNS", "#8b5cf6"], ["referral", "추천·제휴", "#ec4899"], ["direct", "직접 방문", "var(--c1)"]].map(function (x) {
      return { name: x[1], color: x[2], values: B.map(function (b) { var a = attrib(b); return x[0] === "paid" ? a.gPaid : a.gBy[x[0]]; }) };
    });
    var ch2 = NW.chartCard("신규 게스트 획득 채널 믹스", { labels: labels, h: 240, stacked: true, fmt: function (v) { return Math.round(v); }, series: gSer }, "가입 시점의 유입 채널(라스트 클릭 가정)");
    // 퍼널
    var ga = D.ga4.filter(function (g) { return inR(g.date, r); }), sum = function (k) { return ga.reduce(function (t, g) { return t + g[k]; }, 0); };
    var steps = [["페이지 조회", sum("page_view")], ["상세 조회", sum("view_item")], ["계약 신청", K.req], ["호스트 승인", K.appr.length], ["결제 완료", K.cnt]];
    var fun = '<div class="card mk-card"><div class="mk-ct"><b>전환 퍼널</b><span>GA4 × 계약 데이터 연결</span></div>' + steps.map(function (st, i) {
      var w = steps[0][1] ? Math.max(3, Math.sqrt(st[1] / steps[0][1]) * 100) : 0;
      return '<div class="fn-r"><span class="fn-l">' + st[0] + '</span><div class="fn-b"><i style="width:' + w + '%"></i></div><b class="tnum">' + ko(st[1]) + '</b><em class="tnum">' + (i ? P(st[1], steps[i - 1][1]) : "") + '</em></div>';
    }).join("") + '<p class="mk-note">오른쪽 % = 바로 앞 단계 대비 전환율 · 막대는 규모 차이가 커서 제곱근 스케일</p></div>';
    // 채널 기여
    var tot = A.gmv || 1, chs = ACH.slice().sort(function (a, b) { return A.by[b] - A.by[a]; });
    var cc = '<div class="card mk-card"><div class="mk-ct"><b>채널별 거래액 기여</b><span>광고 ' + P(A.pGmv, A.gmv) + ' · 그 외 ' + P(A.gmv - A.pGmv, A.gmv) + '</span></div><div class="mk-stack">' + chs.map(function (k) { return '<i style="width:' + (A.by[k] / tot * 100) + '%;background:' + ACHC[k] + '" title="' + ACHN[k] + ' ' + P(A.by[k], tot) + '"></i>'; }).join("") + '</div>'
      + chs.map(function (k) { return '<div class="mk-li"><span><i style="background:' + ACHC[k] + '"></i>' + ACHN[k] + (PAID[k] ? ' <em>광고</em>' : '') + '</span><b class="tnum">' + NW.short(A.by[k]) + '원</b><em class="tnum">' + P(A.by[k], tot) + '</em></div>'; }).join("") + '</div>';
    // 목표 대비
    var goalG = Math.round(A0.gmv * 1.12 / 1e6) * 1e6 || 1, budget = Math.round(A0.spend * 1.05 / 1e5) * 1e5 || 1;
    var bar = function (l, v, g, fmt, note, warn) { var q = Math.min(1.2, v / g); return '<div class="gl-r"><div class="gl-h"><span>' + l + '</span><b class="tnum">' + fmt(v) + ' <em>/ ' + fmt(g) + '</em></b></div><div class="gl-b"><i style="width:' + Math.min(100, q * 100) + '%;background:' + (warn && q > 1 ? "var(--danger)" : q >= 1 ? "#10b981" : "var(--accent)") + '"></i></div><div class="gl-n"><span>' + (q * 100).toFixed(0) + '% 달성</span><span>' + note + '</span></div></div>'; };
    var goals = '<div class="card mk-card"><div class="mk-ct"><b>목표 대비</b><span>직전 기간 기준 자동 목표(데모)</span></div>'
      + bar("거래액", A.gmv, goalG, function (v) { return NW.short(v) + "원"; }, "직전 +12%")
      + bar("광고비 소진", A.spend, budget, function (v) { return NW.short(v) + "원"; }, "예산 = 직전 +5%", true)
      + bar("페이드 ROAS", roas * 100, 300, function (v) { return Math.round(v) + "%"; }, "목표 300%")
      + bar("광고 기여 비중", A.gmv ? A.pGmv / A.gmv * 100 : 0, 50, function (v) { return v.toFixed(1) + "%"; }, "목표 50%") + '</div>';
    return '<section class="mk"><div class="mk-head"><div><b>마케팅 기여 트래킹</b><span>전체 성과 중 광고가 만든 몫 · 획득 채널 · 전환 퍼널 · 목표 — 직전 같은 기간 대비 ▲▼</span></div><button class="btn" data-td-tab="mkt">마케팅 성과 탭 자세히 →</button></div>'
      + krow + '<div class="g2" style="margin-top:12px">' + ch1 + ch2 + '</div><div class="mk-g3">' + fun + cc + goals + '</div></section>';
  }

  /* ── GA4 대시보드 ──────────────────────────────────── */
  function ga4() {
    var r = NW.rangeOf(F.range), B = NW.buckets(r, F.gran), G = D.ga4.filter(function (g) { return inR(g.date, r); });
    var s = function (k) { return G.reduce(function (t, g) { return t + g[k]; }, 0); }, avg = function (k) { return G.length ? s(k) / G.length : 0; }, last = G[G.length - 1] || {};
    var labels = B.map(function (b) { return b.label; }), bAvg = function (k) { return B.map(function (b) { var a = D.ga4.filter(function (g) { return inR(g.date, b); }); return a.length ? a.reduce(function (t, g) { return t + g[k]; }, 0) / a.length : 0; }); }, bSum = function (k) { return B.map(function (b) { return D.ga4.filter(function (g) { return inR(g.date, b); }).reduce(function (t, g) { return t + g[k]; }, 0); }); };
    var SRC = [["Organic Search", .34], ["Paid Social", .22], ["Direct", .18], ["Paid Search", .14], ["Referral", .08], ["Email", .04]], users = s("dau");
    return NW.hero("ga4", "MKT · 방문", "GA4 대시보드", "방문·가입·상세 조회·결제를 일 단위로 모아요. (데모 · 가상 수치)", NW.refreshBtn()) + filterBar({ seg: false })
      + '<div class="kg" style="margin-top:18px">' + kpi("DAU (평균)", ko(avg("dau")), "일 평균 활성 사용자", "big") + kpi("WAU", ko(last.wau), "기간 마지막 날") + kpi("MAU", ko(last.mau), "기간 마지막 날") + kpi("회원가입", ko(s("sign_up")), "sign_up 이벤트", "acc", "accent") + kpi("상세페이지 뷰", ko(s("view_item")), "view_item") + kpi("계약(결제)", ko(s("purchase")), "purchase") + kpi("페이지뷰", ko(s("page_view")), "page_view") + '</div>'
      + '<div style="margin-top:12px">' + NW.chartCard("방문자 추이 (DAU · WAU · MAU)", { labels: labels, h: 250, series: [{ name: "DAU", type: "line", color: "var(--accent)", values: bAvg("dau") }, { name: "WAU", type: "line", color: "var(--host)", values: bAvg("wau") }, { name: "MAU", type: "line", color: "var(--guest)", values: bAvg("mau") }] }, "구간 평균") + '</div>'
      + '<div class="g3" style="margin-top:12px">' + NW.chartCard("회원가입", { labels: labels, h: 200, labelsOn: labels.length <= 12, series: [{ name: "sign_up", color: "var(--accent)", values: bSum("sign_up") }] }) + NW.chartCard("상세페이지 뷰", { labels: labels, h: 200, series: [{ name: "view_item", color: "var(--c2)", values: bSum("view_item") }] }) + NW.chartCard("계약(결제)", { labels: labels, h: 200, labelsOn: labels.length <= 12, series: [{ name: "purchase", color: "var(--good)", values: bSum("purchase") }] }) + '</div>'
      + '<div class="lbl">첫 유입 매체별</div><div class="card tw"><table class="t tnum"><thead><tr><th>채널</th><th class="r">사용자</th><th class="r">비중</th><th class="r">가입</th><th class="r">가입률</th><th class="r">결제</th></tr></thead><tbody>' + SRC.map(function (x, i) { var u = Math.round(users * x[1]), su = Math.round(s("sign_up") * x[1] * (1 + (2 - i) * .08)); return '<tr><td><b>' + x[0] + '</b></td><td class="r">' + ko(u) + '</td><td class="r">' + (x[1] * 100).toFixed(1) + '%</td><td class="r">' + ko(su) + '</td><td class="r">' + pct(su, u) + '</td><td class="r">' + ko(Math.round(s("purchase") * x[1])) + '</td></tr>'; }).join("") + '</tbody></table></div>';
  }

  /* ── KPI & OKR Tracker ──────────────────────────────────
     현황판(KR 카드 · 기간별 추이 일/주/월 · 광고 효율 채널별) · 분석(왜 움직였나: 원인 후보 · 요인/채널 기여도 · 퍼널) · 목표 역산(시뮬레이터).
     지표는 전부 데모 데이터로 계산. 목표 = 분기 직전 30일 값에서 15% 개선(이하 지표는 15% 낮게). */
  var OK = NW.store.get("okr", { tab: "board", weeks: 26 });
  if (OK.tab === "real") OK.tab = "board";
  var KS = NW.store.get("kr", { gran: "week", view: "table", more: false, kr: "dcac" });
  var HSH = 0.25; // 광고비 중 호스트 모집 캠페인 비중(가정)
  var PASSED = { APPROVED: 1, COMPLETED: 1, EXPIRED: 1, CANCELED_NOPAY: 1, CANCELED: 1 };
  var hCh = function (h) { return h._ch || (h._ch = chOf(parseInt(String(h.host_key).slice(1), 10) * 13 + 3)); };
  var PCH = ["meta", "google", "naver", "kakao"];
  function mets(r) {
    var o = { spend: 0, sp: {}, imp: {}, clk: {}, g: 0, gp: 0, gBy: {}, h: 0, hp: 0, hBy: {}, view: 0, req: 0, appr: 0, payC: 0, pc: 0, pcBy: {}, rev: 0, revBy: {}, seg: { "직영": { req: 0, appr: 0, pay: 0 }, "일반": { req: 0, appr: 0, pay: 0 } } };
    ACH.forEach(function (k) { o.sp[k] = 0; o.imp[k] = 0; o.clk[k] = 0; o.gBy[k] = 0; o.hBy[k] = 0; o.pcBy[k] = 0; o.revBy[k] = 0; });
    D.ads.forEach(function (a) { if (inR(a.date, r)) { o.spend += a.spend; o.sp[a.channel] += a.spend; o.imp[a.channel] += a.impressions; o.clk[a.channel] += a.clicks; } });
    D.guests.forEach(function (g) { if (inR(g.joined_at, r)) { var k = gCh(g); o.g++; o.gBy[k]++; if (PAID[k]) o.gp++; } });
    D.hosts.forEach(function (h) { if (inR(h.joined_at, r)) { var k = hCh(h); o.h++; o.hBy[k]++; if (PAID[k]) o.hp++; } });
    D.ga4.forEach(function (x) { if (inR(x.date, r)) o.view += x.view_item; });
    D.contracts.forEach(function (c) {
      if (inR(c.created_at, r)) { var s = o.seg[c.seg] || o.seg["일반"]; o.req++; s.req++; if (PASSED[c.status]) { o.appr++; s.appr++; } if (c.status === "COMPLETED") { o.payC++; s.pay++; } }
      if (c.status === "COMPLETED" && inR(c.completed_at, r)) { var k = cCh(c); o.pcBy[k]++; o.revBy[k] += c.commission; if (PAID[k]) { o.pc++; o.rev += c.commission; } }
    });
    var q = function (a, b, m) { return b ? a / b * (m || 1) : null; };
    o.v = { dcac: q(o.spend * (1 - HSH), o.gp), scac: q(o.spend * HSH, o.hp), cpa: q(o.spend, o.pc), roas: q(o.rev, o.spend, 100), v2r: q(o.req, o.view, 100), r2p: q(o.payC, o.req, 100), appr: q(o.appr, o.req, 100), pay: q(o.payC, o.appr, 100) };
    return o;
  }
  var wonR = function (v) { return v == null ? "—" : won(Math.round(v / 100) * 100); };
  var KR = [
    { k: "dcac", n: "수요 확보 CAC", s: "게스트 1명을 데려오는 광고비", f: "게스트 대상 광고비(75%) ÷ 광고로 가입한 게스트", low: 1, fmt: wonR, grp: "획득" },
    { k: "scac", n: "공급 확보 CAC", s: "호스트 1명을 데려오는 광고비", f: "호스트 모집 광고비(25%) ÷ 광고로 가입한 호스트", low: 1, fmt: wonR, grp: "획득" },
    { k: "cpa", n: "결제 CPA", s: "광고 기여 결제 1건당 광고비", f: "광고비 ÷ 광고 기여 결제 건수", low: 1, fmt: wonR, grp: "획득" },
    { k: "roas", n: "페이드 ROAS", s: "광고비 대비 광고 기여 매출", f: "광고 기여 매출(수수료) ÷ 광고비", fmt: function (v) { return v == null ? "—" : v.toFixed(0) + "%"; }, grp: "효율" },
    { k: "v2r", n: "상세 조회 → 신청율", s: "상세를 본 사람 중 계약 신청", f: "계약 신청 ÷ 상세페이지 조회(view_item)", fmt: function (v) { return v == null ? "—" : v.toFixed(2) + "%"; }, grp: "전환" },
    { k: "r2p", n: "신청 → 결제율", s: "기간에 들어온 신청 중 결제 완료", f: "결제 완료 ÷ 계약 신청 = 승인율 × 결제율", fmt: function (v) { return v == null ? "—" : v.toFixed(1) + "%"; }, grp: "전환" }
  ];
  var SUP = [{ k: "appr", n: "승인율", fmt: function (v) { return v == null ? "—" : v.toFixed(1) + "%"; } }, { k: "pay", n: "결제율", fmt: function (v) { return v == null ? "—" : v.toFixed(1) + "%"; } }];
  var dR = function (a, b) { return { s: NW.dstr(a), e: NW.dstr(b) }; };
  var T = NW.TODAY, L30 = dR(NW.addD(T, -29), T), P30 = dR(NW.addD(T, -59), NW.addD(T, -30));
  var QS = new Date(T.getFullYear(), Math.floor(T.getMonth() / 3) * 3, 1), QE = new Date(QS.getFullYear(), QS.getMonth() + 3, 0), BASE = dR(NW.addD(QS, -30), NW.addD(QS, -1));
  var QN = Math.floor(QS.getMonth() / 3) + 1;
  var _cache = {}; function M(r) { var k = r.s + r.e; return _cache[k] || (_cache[k] = mets(r)); }
  function targets() {
    var b = M(BASE).v, t = {};
    KR.forEach(function (x) { var v = b[x.k] || 0; t[x.k] = x.low ? Math.round(v * .85 / 1000) * 1000 : x.k === "v2r" ? Math.round(v * 1.15 * 100) / 100 : Math.round(v * 1.15 * 10) / 10; });
    SUP.forEach(function (x) { t[x.k] = Math.min(95, Math.round((b[x.k] || 0) * 1.08 * 10) / 10); });
    return t;
  }
  var lowK = function (k) { return KR.some(function (x) { return x.k === k && x.low; }); };
  var better = function (k, a, b) { return a != null && b != null && (lowK(k) ? a < b : a > b); };
  var meets = function (k, v, t) { return v != null && (lowK(k) ? v <= t : v >= t); };
  function status(k, cur, start, tg) {
    if (meets(k, cur, tg)) return ["달성", "p-em", "ok"];
    if (better(k, cur, start)) return ["순항", "p-sky", "go"];
    var gap = start ? Math.abs(cur - start) / start : 0;
    return gap > .15 ? ["미달 위험", "p-red", "bad"] : ["주의", "p-amber", "warn"];
  }
  function isoW(d) { var t = new Date(d); t.setHours(0, 0, 0, 0); t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7); var w1 = new Date(t.getFullYear(), 0, 4); return 1 + Math.round(((t - w1) / 864e5 - 3 + (w1.getDay() + 6) % 7) / 7); }
  function periods() {
    var g = KS.gran, n = g === "day" ? 14 : g === "week" ? 10 : 6, from = g === "day" ? NW.addD(T, -13) : g === "week" ? NW.addD(NW.monday(T), -63) : new Date(T.getFullYear(), T.getMonth() - 5, 1);
    return NW.buckets(dR(from, T), g).slice(-n).reverse().map(function (b) {
      var s = NW.parseD(b.s), e = NW.parseD(b.e), live = e >= T;
      var lab = g === "day" ? md(b.s) + " (" + "일월화수목금토"[s.getDay()] + ")" : g === "week" ? "W" + isoW(s) + " (" + md(b.s) + "~" + md(b.e) + ")" : (s.getMonth() + 1) + "월";
      return { r: { s: b.s, e: live ? NW.dstr(T) : b.e }, lab: lab, live: live };
    });
  }
  var cls = function (k, v, tg, st) { return v == null ? "" : meets(k, v, tg) ? "kr-g" : better(k, st, v) ? "kr-r" : ""; };

  function board() {
    var tg = targets(), cur = M(L30).v, st = M(BASE).v, P = periods(), qProg = Math.round((T - QS) / (QE - QS) * 100);
    var card = function (x, i) {
      var s = status(x.k, cur[x.k], st[x.k], tg[x.k]), span = tg[x.k] - st[x.k], p = span ? Math.max(0, Math.min(1, (cur[x.k] - st[x.k]) / span)) : 0;
      return '<div class="card kr"><div class="kr-h"><span class="kr-no">KR' + (i + 1) + '</span><b>' + x.n + '</b><span class="pill sm ' + s[1] + '">' + s[0] + '</span></div>'
        + '<div class="kr-t"><span class="tnum">' + x.fmt(tg[x.k]) + '</span><small>' + (x.low ? "이하" : "목표") + '</small></div>'
        + '<div class="kr-c"><span>지금 · 최근 30일</span><b class="tnum ' + (s[2] === "ok" ? "kr-g" : s[2] === "bad" ? "kr-r" : "") + '">' + x.fmt(cur[x.k]) + '</b><small class="tnum">시작 ' + x.fmt(st[x.k]) + '</small></div>'
        + '<div class="kr-bar"><i class="' + s[2] + '" style="width:' + Math.max(3, p * 100).toFixed(0) + '%"></i><em style="left:' + qProg + '%" title="분기 경과 ' + qProg + '%"></em></div>'
        + '<p class="kr-f">' + x.f + '</p></div>';
    };
    var cols = KR.concat(SUP);
    var row = function (lab, v, cl, live) { return '<tr class="' + cl + '"><td>' + lab + (live ? ' <small class="kr-live">진행 중</small>' : '') + '</td>' + cols.map(function (x) { var val = v[x.k]; return '<td class="r tnum ' + (cl === "kr-tg" ? "" : cls(x.k, val, tg[x.k], st[x.k])) + '">' + x.fmt(val) + (cl === "kr-tg" && x.low ? ' <small>이하</small>' : '') + '</td>'; }).join("") + '</tr>'; };
    var shown = KS.more ? P : P.slice(0, 6);
    var table = '<div class="card tw"><table class="t kr-tb" style="min-width:1100px"><thead><tr><th>기간</th>' + cols.map(function (x) { return '<th class="r">' + x.n + '</th>'; }).join("") + '</tr></thead><tbody>'
      + row("목표", tg, "kr-tg") + row("최근 30일 (" + md(L30.s) + "~" + md(L30.e) + ")", cur, "kr-now") + shown.map(function (p) { return row(p.lab, M(p.r).v, "", p.live); }).join("") + '</tbody></table>'
      + (P.length > 6 ? '<button class="kr-more" data-kr-more>' + (KS.more ? "접기" : "더보기 (" + (P.length - 6) + "개 더)") + '</button>' : '') + '</div>';
    var chr = P.slice().reverse();
    var graphs = '<div class="g3">' + KR.map(function (x) { return NW.chartCard(x.n, { labels: chr.map(function (p) { return p.lab.split(" (")[0]; }), h: 170, fmt: function (v) { return x.fmt(v); }, series: [{ name: "실적", type: "line", color: "var(--accent)", values: chr.map(function (p) { return M(p.r).v[x.k] || 0; }) }, { name: "목표", type: "line", dash: true, color: "#e8590c", values: chr.map(function () { return tg[x.k]; }) }] }); }).join("") + '</div>';
    /* 광고 효율 · 채널별 (최근 30일 vs 직전 30일) */
    var A = M(L30), B = M(P30);
    var dlt = function (a, b, low) { if (a == null || b == null || !b) return ''; var d = (a - b) / b * 100, good = low ? d < 0 : d > 0; return ' <span class="dlt ' + (Math.abs(d) < .5 ? "eq" : good ? "up" : "dn") + '">' + (d >= 0 ? "▲" : "▼") + Math.abs(d).toFixed(0) + '%</span>'; };
    var ch = function (o, k) { var sp = o.sp[k]; return { sp: sp, ctr: o.imp[k] ? o.clk[k] / o.imp[k] * 100 : null, cpc: o.clk[k] ? sp / o.clk[k] : null, g: o.gBy[k], cac: o.gBy[k] ? sp * (1 - HSH) / o.gBy[k] : null, pc: o.pcBy[k], cpa: o.pcBy[k] ? sp / o.pcBy[k] : null, roas: sp ? o.revBy[k] / sp * 100 : null }; };
    var adT = '<div class="card tw"><table class="t" style="min-width:980px"><thead><tr><th>채널</th><th class="r">광고비</th><th class="r">CTR</th><th class="r">CPC</th><th class="r">광고 가입</th><th class="r">CAC</th><th class="r">광고 결제</th><th class="r">CPA</th><th class="r">ROAS</th></tr></thead><tbody>'
      + PCH.map(function (k) { var a = ch(A, k), b = ch(B, k); return '<tr><td><i class="tdot" style="display:inline-block;margin-right:8px;background:' + ACHC[k] + '"></i><b>' + ACHN[k] + '</b></td><td class="r tnum">' + won(a.sp) + dlt(a.sp, b.sp) + '</td><td class="r tnum">' + (a.ctr == null ? "—" : a.ctr.toFixed(2) + "%") + dlt(a.ctr, b.ctr) + '</td><td class="r tnum">' + (a.cpc == null ? "—" : won(Math.round(a.cpc))) + dlt(a.cpc, b.cpc, 1) + '</td><td class="r tnum">' + ko(a.g) + '명</td><td class="r tnum ' + cls("dcac", a.cac, tg.dcac, st.dcac) + '">' + wonR(a.cac) + dlt(a.cac, b.cac, 1) + '</td><td class="r tnum">' + ko(a.pc) + '건</td><td class="r tnum ' + cls("cpa", a.cpa, tg.cpa, st.cpa) + '">' + wonR(a.cpa) + dlt(a.cpa, b.cpa, 1) + '</td><td class="r tnum ' + cls("roas", a.roas, tg.roas, st.roas) + '">' + (a.roas == null ? "—" : a.roas.toFixed(0) + "%") + dlt(a.roas, b.roas) + '</td></tr>'; }).join("")
      + '</tbody></table></div>';
    return '<div class="kr-o"><span class="kr-ob">O</span><div><b>' + T.getFullYear() % 100 + 'Q' + QN + ' · 광고 효율을 지키면서 매달 결제를 늘린다</b><small>KR 6개 · 분기 ' + qProg + '% 지남 · 목표 ' + md(NW.dstr(QE)) + ' · 시작값 = 분기 직전 30일 (' + md(BASE.s) + '~' + md(BASE.e) + ')</small></div></div>'
      + '<div class="kr-grid">' + KR.map(card).join("") + '</div>'
      + '<div class="sec-h" style="margin-top:28px"><h2>기간별 추이</h2><span class="hint">초록 = 목표 달성 · 빨강 = 시작값보다 나쁨 · 주 = 월~일</span><span style="margin-left:auto;display:flex;gap:8px">' + NW.segHtml([["day", "일"], ["week", "주"], ["month", "월"]], KS.gran, "data-kr-gran") + NW.segHtml([["table", "표"], ["graph", "그래프"]], KS.view, "data-kr-view") + '</span></div>'
      + (KS.view === "graph" ? graphs : table)
      + '<div class="sec-h" style="margin-top:28px"><h2>광고 효율 · 채널별</h2><span class="hint">최근 30일 · 괄호 안 화살표 = 직전 30일 대비 · CAC/CPA/ROAS 색은 KR 목표 기준</span></div>' + adT;
  }

  /* 분석 · 왜 움직였나 — 최근 30일 vs 직전 30일. 비율 지표(분자/분모)를 요인·채널별 '그대로였다면' 값으로 나눠 기여도를 계산 */
  function parts(k, o) {
    if (k === "dcac") return { n: o.spend * (1 - HSH), d: o.gp, nC: function (c) { return o.sp[c] * (1 - HSH); }, dC: function (c) { return o.gBy[c]; }, nN: "광고비", dN: "광고 가입 게스트" };
    if (k === "scac") return { n: o.spend * HSH, d: o.hp, nC: function (c) { return o.sp[c] * HSH; }, dC: function (c) { return o.hBy[c]; }, nN: "호스트 모집 광고비", dN: "광고 가입 호스트" };
    if (k === "cpa") return { n: o.spend, d: o.pc, nC: function (c) { return o.sp[c]; }, dC: function (c) { return o.pcBy[c]; }, nN: "광고비", dN: "광고 기여 결제" };
    if (k === "roas") return { n: o.rev * 100, d: o.spend, nC: function (c) { return o.revBy[c] * 100; }, dC: function (c) { return o.sp[c]; }, nN: "광고 기여 매출", dN: "광고비" };
    if (k === "v2r") return { n: o.req * 100, d: o.view, nN: "계약 신청", dN: "상세 조회" };
    return { n: o.payC * 100, d: o.req, nN: "결제 완료", dN: "계약 신청" };
  }
  function drivers(k) {
    var a = M(L30), b = M(P30), pa = parts(k, a), pb = parts(k, b), v1 = pa.d ? pa.n / pa.d : 0, v0 = pb.d ? pb.n / pb.d : 0, out = [];
    var cf = function (n, d) { return d ? n / d : v1; };
    out.push({ nm: pa.nN, a: pa.n, b: pb.n, imp: v1 - cf(pb.n, pa.d), kind: "n" }, { nm: pa.dN, a: pa.d, b: pb.d, imp: v1 - cf(pa.n, pb.d), kind: "d" });
    if (pa.nC) PCH.forEach(function (c) { out.push({ nm: ACHN[c], ch: c, a: pa.dC(c) ? pa.nC(c) / pa.dC(c) : null, b: pb.dC(c) ? pb.nC(c) / pb.dC(c) : null, imp: v1 - cf(pa.n - pa.nC(c) + pb.nC(c), pa.d - pa.dC(c) + pb.dC(c)), kind: "c" }); });
    if (k === "r2p") { out.push({ nm: "승인율", a: a.v.appr, b: b.v.appr, imp: (a.v.appr - b.v.appr) * (b.v.pay || 0) / 100, kind: "s" }, { nm: "결제율", a: a.v.pay, b: b.v.pay, imp: (a.v.pay - b.v.pay) * (a.v.appr || 0) / 100, kind: "s" });
      ["직영", "일반"].forEach(function (s) { var x = a.seg[s], y = b.seg[s]; out.push({ nm: s + " 지점", a: x.req ? x.pay / x.req * 100 : null, b: y.req ? y.pay / y.req * 100 : null, imp: v1 - cf(a.payC * 100 - x.pay * 100 + y.pay * 100, a.req - x.req + y.req), kind: "c" }); }); }
    var X = KR.filter(function (z) { return z.k === k; })[0], p1 = function (v) { return v == null ? "—" : v.toFixed(1) + "%"; };
    out.forEach(function (r) {
      var f = r.kind === "c" ? (k === "r2p" ? p1 : X.fmt) : r.kind === "s" ? p1 : /광고비|매출/.test(r.nm) ? function (v) { return won(v / (k === "roas" && r.kind === "n" ? 100 : 1)); } : function (v) { return ko(v / ((k === "v2r" || k === "r2p") && r.kind === "n" ? 100 : 1)); };
      r.tb = f(r.b); r.ta = f(r.a);
    });
    return { v1: v1, v0: v0, list: out };
  }
  var LINK = { meta: ["#/meta-ads", "META 빌더에서 소재 · 타겟 점검"], naver: ["#/naver-sa", "NAVER SA에서 키워드 입찰 점검"], google: ["#/search-kw", "키워드 도구에서 검색 수요 확인"], kakao: ["#/ad-requests", "소재 교체 요청 만들기"] };
  function causes() {
    var out = [];
    KR.forEach(function (x) {
      var d = drivers(x.k), ch = d.v1 - d.v0; if (!d.v0 || Math.abs(ch) / d.v0 < .02) return;
      var bad = lowK(x.k) ? ch > 0 : ch < 0;
      var same = d.list.filter(function (r) { return r.kind === "c" && r.ch && Math.sign(r.imp) === Math.sign(ch); }), tot = same.reduce(function (t, r) { return t + Math.abs(r.imp); }, 0);
      same.sort(function (p, q) { return Math.abs(q.imp) - Math.abs(p.imp); }).slice(0, 1).forEach(function (r) {
        var share = tot ? Math.abs(r.imp) / tot * 100 : 0, up = r.a > r.b;
        out.push({ w: Math.abs(ch) / d.v0 * share, bad: bad, kr: x, txt: '<b>' + ACHN[r.ch] + '</b> 채널의 ' + ({ dcac: "게스트 CAC", scac: "호스트 CAC", cpa: "CPA", roas: "ROAS" }[x.k]) + '가 ' + (up ? "올라" : "내려") + ' ' + x.n + '를 ' + (bad ? "목표에서 밀어낸" : "목표 쪽으로 당긴") + ' 가장 큰 요인이에요 <span class="faint">(같은 방향 영향 중 <b class="tnum">' + share.toFixed(0) + '%</b>)</span>', ev: [x.fmt(r.b) + " → " + x.fmt(r.a)], link: LINK[r.ch] });
      });
      if (x.k === "r2p") { var s = d.list.filter(function (r) { return r.kind === "s"; }).sort(function (p, q) { return Math.abs(q.imp) - Math.abs(p.imp); })[0]; if (s) out.push({ w: Math.abs(ch) / d.v0 * 80, bad: bad, kr: x, txt: '<b>' + s.nm + '</b>이 ' + (s.a > s.b ? "올라" : "떨어져") + ' 신청 → 결제율이 ' + (ch > 0 ? "좋아졌어요" : "나빠졌어요"), ev: [s.b.toFixed(1) + "% → " + s.a.toFixed(1) + "%"], link: s.nm === "승인율" ? ["#/total-dashboard", "호스트 탭에서 응답 지연 확인"] : ["#/total-dashboard", "결제 대기 건 확인"] }); }
      if (x.k === "v2r") { var vw = d.list[1], rq = d.list[0], gv = vw.b ? (vw.a - vw.b) / vw.b * 100 : 0, gr = rq.b ? (rq.a - rq.b) / rq.b * 100 : 0; out.push({ w: Math.abs(ch) / d.v0 * 70, bad: bad, kr: x, txt: '계약 신청 증가율이 상세 조회 증가율보다 ' + (gr > gv ? "높아" : "낮아") + ' 상세 조회 → 신청율이 ' + (ch > 0 ? "올랐어요" : "떨어졌어요"), ev: ["조회 " + (gv >= 0 ? "+" : "") + gv.toFixed(1) + "%", "신청 " + (gr >= 0 ? "+" : "") + gr.toFixed(1) + "%"], link: ["#/catalog", "카탈로그 · 상세 정보 품질 점검"] }); }
    });
    return out.sort(function (p, q) { return (q.bad - p.bad) || (q.w - p.w); }).slice(0, 5);
  }
  function why() {
    var tg = targets(), x = KR.filter(function (k) { return k.k === KS.kr; })[0] || KR[0], d = drivers(x.k), ch = d.v1 - d.v0, bad = lowK(x.k) ? ch > 0 : ch < 0, C = causes();
    var mx = Math.max.apply(null, d.list.map(function (r) { return Math.abs(r.imp); }).concat([1e-9]));
    var bar = function (r) { var good = lowK(x.k) ? r.imp < 0 : r.imp > 0, w = Math.abs(r.imp) / mx * 50; return '<div class="kd-row"><span class="kd-n">' + r.nm + '</span><span class="kd-v tnum">' + r.tb + ' → ' + r.ta + '</span><span class="kd-bar"><i class="' + (good ? "g" : "r") + '" style="' + (r.imp < 0 ? "right:50%" : "left:50%") + ';width:' + w.toFixed(1) + '%"></i></span><span class="kd-i tnum ' + (good ? "kr-g" : "kr-r") + '">' + (r.imp >= 0 ? "+" : "−") + x.fmt(Math.abs(r.imp)).replace("—", "0") + '</span></div>'; };
    var A = M(L30), B = M(P30);
    var fun = [["상세 조회", A.view, B.view], ["계약 신청", A.req, B.req], ["승인", A.appr, B.appr], ["결제 완료", A.payC, B.payC]];
    return '<div class="kr-cause"><div class="sec-h" style="margin-top:0"><h2>원인 후보</h2><span class="hint">최근 30일 (' + md(L30.s) + '~' + md(L30.e) + ') vs 직전 30일 · 목표에서 멀어지게 한 것부터</span></div>'
      + (C.length ? '<ol class="kc">' + C.map(function (c, i) { return '<li class="' + (c.bad ? "bad" : "good") + '"><i>' + (i + 1) + '</i><div><span class="kc-kr">' + c.kr.n + ' · ' + (c.bad ? "목표에서 멀어짐" : "목표에 가까워짐") + '</span><p>' + c.txt + '</p><div class="mchips">' + c.ev.map(function (e) { return '<span class="tag tnum">' + e + '</span>'; }).join("") + '</div></div>' + (c.link ? '<a class="ov-go" href="' + c.link[0] + '">' + c.link[1] + ' <span>→</span></a>' : '') + '</li>'; }).join("") + '</ol>' : '<p class="faint">직전 30일과 비교해 크게 움직인 지표가 없어요.</p>') + '</div>'
      + '<div class="sec-h" style="margin-top:28px"><h2>KR별로 쪼개 보기</h2><span class="hint">막대 = 그 요인만 직전 30일 값이었다면 KR이 얼마나 달랐을지</span></div>'
      + '<div style="margin-bottom:12px">' + NW.segHtml(KR.map(function (k) { return [k.k, k.n]; }), x.k, "data-kr-pick", true) + '</div>'
      + '<div class="g2 kd-g"><div class="card kd"><div class="kd-top"><div><small>' + x.n + ' · 직전 30일 → 최근 30일</small><b class="tnum">' + x.fmt(d.v0) + ' → ' + x.fmt(d.v1) + '</b></div><span class="pill ' + (bad ? "p-red" : "p-em") + '">' + (bad ? "목표에서 멀어짐" : "목표에 가까워짐") + '</span></div>'
      + '<div class="kd-sec">요인</div>' + d.list.filter(function (r) { return r.kind === "n" || r.kind === "d" || r.kind === "s"; }).map(bar).join("")
      + (d.list.some(function (r) { return r.kind === "c"; }) ? '<div class="kd-sec">' + (x.k === "r2p" ? "지점 유형별" : "채널별") + '</div>' + d.list.filter(function (r) { return r.kind === "c"; }).map(bar).join("") : '')
      + '<p class="kr-f" style="margin-top:12px">' + x.f + ' · 목표 ' + x.fmt(tg[x.k]) + (x.low ? " 이하" : "") + '</p></div>'
      + '<div class="card kd"><div class="kd-top"><div><small>퍼널 · 직전 30일 → 최근 30일</small><b>어디서 새고 있나</b></div></div>'
      + fun.map(function (f, i) { var r1 = i ? f[1] / fun[i - 1][1] * 100 : 100, r0 = i ? f[2] / fun[i - 1][2] * 100 : 100, w = f[1] / fun[0][1] * 100; return '<div class="kf"><div class="kf-h"><b>' + f[0] + '</b><span class="tnum">' + ko(f[1]) + '</span>' + (i ? '<em class="tnum ' + (r1 >= r0 ? "kr-g" : "kr-r") + '">전 단계의 ' + r1.toFixed(i === 1 ? 2 : 1) + '% (' + (r1 >= r0 ? "▲" : "▼") + Math.abs(r1 - r0).toFixed(i === 1 ? 2 : 1) + '%p)</em>' : '') + '</div><div class="kf-b"><i style="width:' + Math.max(1.5, Math.sqrt(w) * 10).toFixed(1) + '%"></i></div></div>'; }).join("") + '</div></div>';
  }

  function model() {
    var W = OK.weeks, mon = NW.monday(NW.TODAY), wk = []; for (var i = W - 1; i >= 0; i--) { var s = NW.addD(mon, -7 * i); wk.push({ s: NW.dstr(s), e: NW.dstr(NW.addD(s, 6)), label: md(NW.dstr(s)) }); }
    var pub = wk.map(function (w) { return D.listings.filter(function (l) { return l.registered_at <= w.e && l.operation_status === "PUBLISHED"; }).length; }), net = pub.map(function (v, i) { return i ? v - pub[i - 1] : 0; });
    var avgNet = net.slice(-8).reduce(function (t, v) { return t + v; }, 0) / 8, acc = (net.slice(-4).reduce(function (t, v) { return t + v; }, 0) - net.slice(-8, -4).reduce(function (t, v) { return t + v; }, 0)) / 4;
    var M2 = NW.store.get("okr-model", null) || { net: +avgNet.toFixed(1), acc: +acc.toFixed(1), reqR: 2.1, appr: 74, payR: 64, goal: 60, goalDate: NW.dstr(NW.addD(NW.TODAY, 180)) };
    var weeksLeft = Math.max(1, Math.round((NW.parseD(M2.goalDate) - NW.TODAY) / (7 * 864e5))), P = pub[pub.length - 1], proj = [], cur = P, n = M2.net;
    for (var k = 0; k < weeksLeft; k++) { n += M2.acc / 4; cur += Math.max(0, n); proj.push(cur); }
    var need = M2.goal / Math.max(.0001, M2.reqR * 4.3 / 10 * (M2.appr / 100) * (M2.payR / 100));
    var sl = function (k2, l, min, max, step, u) { return '<label class="fld"><span>' + l + ' <b class="tnum" style="color:var(--text)">' + M2[k2] + u + '</b></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + M2[k2] + '" data-okr-m="' + k2 + '" style="accent-color:var(--accent)"></label>'; };
    var chip = function (t, v, kind) { return '<span class="pill ' + (kind === "var" ? "p-blue" : kind === "fix" ? "p-gray" : "p-em") + '">' + t + ' <b class="tnum">' + v + '</b></span>'; };
    return '<p class="fl-note" style="margin:0 0 12px">실측 페이스(게시 룸카드 순증 · 신청률 · 승인율 · 결제율)로 목표 월 결제를 언제 달성할지 역산해요. 슬라이더를 움직이면 바로 다시 계산돼요.</p><div style="display:grid;gap:12px;grid-template-columns:minmax(260px,340px) 1fr"><div class="card" style="padding:16px;display:flex;flex-direction:column;gap:14px">'
      + sl("net", "주간 순증", 0, 20, .1, "개") + sl("acc", "가속(주당 변화)", -3, 3, .1, "") + sl("reqR", "방당 월 신청률", .5, 5, .1, "건/10개") + sl("appr", "승인율", 30, 100, 1, "%") + sl("payR", "결제율", 30, 100, 1, "%")
      + '<button class="btn" data-okr-reset style="align-self:flex-start">' + ic("refresh") + '전부 실측으로</button><hr style="border:0;border-top:1px solid var(--border);margin:0">'
      + '<label class="fld"><span>목표일</span><input class="inp" type="date" value="' + M2.goalDate + '" data-okr-m="goalDate"></label><label class="fld"><span>목표 월 결제(건)</span><input class="inp" type="number" value="' + M2.goal + '" data-okr-m="goal"></label></div>'
      + '<div style="display:flex;flex-direction:column;gap:12px"><div class="card" style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:8px">' + chip("목표일까지", weeksLeft + "주", "fix") + chip("예상 룸카드", ko(cur) + "개", "var") + chip("목표 달성에 필요한 룸카드", ko(need) + "개", "meas") + chip("판정", cur >= need ? "달성 가능 ✓" : "부족 " + ko(need - cur) + "개", cur >= need ? "meas" : "var") + '</div>'
      + NW.chartCard("룸카드 예상 경로", { labels: proj.map(function (v, i) { return md(NW.dstr(NW.addD(mon, 7 * (i + 1)))); }), h: 260, series: [{ name: "예상 룸카드", type: "line", color: "var(--accent)", values: proj }, { name: "필요 룸카드", type: "line", dash: true, color: "var(--danger)", values: proj.map(function () { return need; }) }] }, "파란 칩 = 조정값 · 회색 = 고정 · 초록 = 실측 기반") + '</div></div>';
  }
  function okr() {
    _cache = {};
    var head = NW.hero("okr", "DASHBOARD · 목표", "KPI & OKR Tracker", "분기 목표(OKR) 대비 지금 어디쯤인지, 왜 움직였는지를 일 · 주 · 월로 봐요. 광고 CAC · CPA · ROAS와 전환 퍼널을 같은 기준으로 묶었어요.");
    var tabs = '<div class="kr-tabs">' + [["board", "현황판"], ["why", "분석 · 왜 움직였나"], ["model", "목표 역산"]].map(function (t) { return '<button type="button" class="' + (OK.tab === t[0] ? "on" : "") + '" data-okr-tab="' + t[0] + '">' + t[1] + '</button>'; }).join("") + '</div>';
    return head + tabs + (OK.tab === "why" ? why() : OK.tab === "model" ? model() : board());
  }

  /* ── 이벤트 ─────────────────────────────────────────── */
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-open]")) && b.getAttribute("data-open") && OPEN[b.getAttribute("data-open")]) { e.stopPropagation(); OPEN[b.getAttribute("data-open")](); return; }
    if ((b = e.target.closest("[data-db]"))) { e.stopPropagation(); var k = b.getAttribute("data-db"); dbOpen[k] = dbOpen[k] === false; NW.store.set("db-open", dbOpen); NW.rerender(); return; }
    if ((b = e.target.closest("[data-f-range]"))) { F.range = b.getAttribute("data-f-range"); NW.store.set("filters", F); NW.rerender(); return; }
    if ((b = e.target.closest("[data-f-gran]"))) { F.gran = b.getAttribute("data-f-gran"); NW.store.set("filters", F); NW.rerender(); return; }
    if ((b = e.target.closest("[data-f-seg]"))) { F.seg = b.getAttribute("data-f-seg"); NW.store.set("filters", F); NW.rerender(); return; }
    if ((b = e.target.closest("[data-td-tab]"))) { TD.tab = b.getAttribute("data-td-tab"); NW.store.set("td", TD); NW.rerender(); return; }
    if ((b = e.target.closest("[data-td-mode]"))) { TD.mode = b.getAttribute("data-td-mode"); NW.store.set("td", TD); NW.rerender(); return; }
    if ((b = e.target.closest("[data-psort]"))) { var s = NW.store.get("paid-sort", ["sp", -1]), key = b.getAttribute("data-psort"); NW.store.set("paid-sort", [key, s[0] === key ? -s[1] : -1]); NW.rerender(); return; }
    if ((b = e.target.closest("[data-margin]"))) { NW.layer('<div class="ov"><div class="md sm"><div class="md-h"><div class="tt"><b>실마진율 설정</b><span>ROI(실마진) = (결제금액 × 마진율 − 광고비) ÷ 광고비</span></div><button class="xb" data-close>' + ic("x") + '</button></div><div style="padding:18px 20px"><label class="fld"><span>마진율(%)</span><input class="inp" type="number" id="nwMargin" value="' + NW.store.get("margin", 18) + '"></label></div><div class="md-f"><button class="btn" data-close>취소</button><button class="btn-p" data-margin-save>저장</button></div></div></div>'); return; }
    if ((b = e.target.closest("[data-margin-save]"))) { NW.store.set("margin", Math.max(0, +document.getElementById("nwMargin").value || 0)); NW.closeLayer(); NW.rerender(); NW.toast("마진율을 저장했어요"); return; }
    if ((b = e.target.closest("[data-spend-add]"))) { NW.layer('<div class="dw"><div class="bd"></div><aside><div class="dw-h"><b>광고비 수기 입력</b><button class="xb" data-close>' + ic("x") + '</button></div><div class="dw-b"><label class="fld"><span>날짜</span><input class="inp" type="date" value="' + NW.dstr(NW.TODAY) + '"></label><label class="fld"><span>채널</span><select class="inp"><option>Meta</option><option>Google</option><option>Naver</option><option>Kakao</option><option>기타</option></select></label><label class="fld"><span>금액(원)</span><input class="inp" type="number" placeholder="예: 350000"></label><p style="margin:0;font-size:11.5px;color:var(--faint)">데모에서는 저장되지 않아요.</p></div><div class="dw-f"><button class="btn" data-close>닫기</button><button class="btn-p" data-close onclick="NW.toast(\'데모: 입력 내용은 저장되지 않아요\')">행 추가</button></div></aside></div>'); return; }
    if ((b = e.target.closest("[data-okr-tab]"))) { OK.tab = b.getAttribute("data-okr-tab"); NW.store.set("okr", OK); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-okr-w]"))) { OK.weeks = +b.getAttribute("data-okr-w"); NW.store.set("okr", OK); NW.rerender(); return; }
    if ((b = e.target.closest("[data-kr-gran]"))) { KS.gran = b.getAttribute("data-kr-gran"); KS.more = false; NW.store.set("kr", KS); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-kr-view]"))) { KS.view = b.getAttribute("data-kr-view"); NW.store.set("kr", KS); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-kr-pick]"))) { KS.kr = b.getAttribute("data-kr-pick"); NW.store.set("kr", KS); NW.rerender(true); return; }
    if (e.target.closest("[data-kr-more]")) { KS.more = !KS.more; NW.store.set("kr", KS); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-okr-reset]"))) { NW.store.set("okr-model", null); NW.rerender(); return; }
    if ((b = e.target.closest("[data-w4]")) && e.target.tagName === "SUMMARY") { setTimeout(function () { NW.store.set("w4", b.open); }, 0); }
  });
  document.addEventListener("input", function (e) {
    var t = e.target; if (!t.dataset || !t.dataset.okrM) return;
    var M = NW.store.get("okr-model", null); if (!M) { var cur = document.querySelectorAll("[data-okr-m]"); M = {}; cur.forEach(function (x) { M[x.dataset.okrM] = x.type === "date" ? x.value : +x.value; }); }
    M[t.dataset.okrM] = t.type === "date" ? t.value : +t.value; NW.store.set("okr-model", M);
    clearTimeout(t._tm); t._tm = setTimeout(function () { var y = scrollY; NW.rerender(); scrollTo(0, y); var n = document.querySelector('[data-okr-m="' + t.dataset.okrM + '"]'); if (n && n.type === "range") n.focus(); }, t.type === "range" ? 60 : 400);
  });

  NW.PAGES["total-dashboard"] = { render: totalDashboard };
  NW.PAGES["paid-dashboard"] = { render: function () { setTimeout(function () { history.replaceState(null, "", "#/total-dashboard"); }, 0); return paidDashboard(); } };
  NW.PAGES["ga4"] = { render: ga4 };
  NW.PAGES["kpi-okr"] = { render: okr };
})(window.NW);
