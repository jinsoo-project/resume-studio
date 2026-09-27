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
    var tabs = NW.segHtml([["snap", "스냅샷"], ["sum", "요약"], ["all", "전체 현황"], ["host", "호스트"], ["guest", "게스트"]], TD.tab, "data-td-tab", true);
    var head = NW.hero("total", "대시보드 · " + NW.BRAND, "Total Dashboard", "거래·계약·가입·매물을 한 화면에서 봐요. 모든 숫자를 누르면 그 숫자를 만든 행 목록이 열려요.", NW.refreshBtn());
    var body = TD.tab === "snap" ? snapshot(r, K) : TD.tab === "all" ? overview(r, K) : TD.tab === "host" ? hostTab(r, K) : TD.tab === "guest" ? guestTab(r, K) : summaryTab(r, K);
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
    return sumBar + panel + weeks4();
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
  function paidDashboard() {
    var r = NW.rangeOf(F.range), K = calc(r), B = NW.buckets(r, F.gran), margin = NW.store.get("margin", 18);
    var ads = D.ads.filter(function (a) { return inR(a.date, r); }), spend = ads.reduce(function (t, a) { return t + a.spend; }, 0);
    var gs = K.gNew.length, hs = K.hNew.length, ls = K.lNew.length, roas = spend ? K.pay / spend : 0, roi = spend ? (K.pay * margin / 100 - spend) / spend : 0;
    var ltv = K.cnt ? K.pay / K.cnt * 1.32 : 0, cac = gs ? spend / gs : 0, lc = cac ? ltv / cac : 0;
    var right = '<button class="btn" data-margin>실마진율 ' + margin + '%</button><button class="btn" data-spend-add>' + ic("plus") + '광고비 수기 입력</button>';
    var grid = '<div class="kg" style="margin-top:18px">' + [
      kpi("총 광고비", won(spend), "4개 채널 합계", "big"), kpi("게스트 가입 CAC", won(cac), "광고비 ÷ 가입 " + ko(gs) + "명"), kpi("호스트 가입 CAC", won(hs ? spend / hs : 0), "광고비 ÷ 가입 " + ko(hs) + "명"), kpi("방등록 CPA", won(ls ? spend / ls : 0), "광고비 ÷ 신규 룸타입 " + ko(ls)), kpi("결제 CPA", won(K.cnt ? spend / K.cnt : 0), "광고비 ÷ 결제 " + ko(K.cnt) + "건"),
      kpi("결제금액", won(K.pay), "확정 · 보증금 제외", "acc", "accent"), kpi("ROAS", (roas * 100).toFixed(0) + "%", "결제금액 ÷ 광고비", "acc"), kpi("ROI (실마진)", (roi * 100).toFixed(0) + "%", "마진율 " + margin + "% 가정", roi >= 0 ? "acc" : "bad"), kpi("게스트 LTV", won(ltv), "건당 결제금액 × 재계약 1.32 (가정)"), kpi("LTV : CAC", lc.toFixed(1) + " : 1", lc >= 3 ? "건강" : lc < 1 ? "⚠ 손실 구간" : "관찰", lc >= 3 ? "acc" : lc < 1 ? "bad" : "")].join("") + '</div>';
    var sB = B.map(function (b) { return D.ads.filter(function (a) { return inR(a.date, b); }).reduce(function (t, a) { return t + a.spend; }, 0); });
    var pB = B.map(function (b) { return D.contracts.filter(function (c) { return NW.segOk(c) && c.status === "COMPLETED" && inR(c.completed_at, b); }).reduce(function (t, c) { return t + c.paid_amount; }, 0); });
    var gB = B.map(function (b) { return D.guests.filter(function (g) { return inR(g.joined_at, b); }).length; });
    var labels = B.map(function (b) { return b.label; }), pc = function (v) { return Math.round(v) + "%"; };
    var charts = '<div class="lbl">추이</div><div class="g2">'
      + NW.chartCard("광고비 vs 결제금액", { labels: labels, h: 230, tipFmt: won, series: [{ name: "광고비", color: "var(--c2)", values: sB }, { name: "결제금액", type: "line", color: "var(--accent)", values: pB }] })
      + NW.chartCard("게스트 CAC 추이", { labels: labels, h: 230, tipFmt: won, series: [{ name: "CAC", type: "line", color: "var(--guest)", values: sB.map(function (s, i) { return gB[i] ? s / gB[i] : 0; }) }] })
      + NW.chartCard("ROAS · ROI", { labels: labels, h: 230, fmt: pc, series: [{ name: "ROAS", type: "line", color: "var(--accent)", values: sB.map(function (s, i) { return s ? pB[i] / s * 100 : 0; }) }, { name: "ROI(실마진)", type: "line", color: "var(--seg-private)", dash: true, values: sB.map(function (s, i) { return s ? (pB[i] * margin / 100 - s) / s * 100 : 0; }) }] })
      + NW.chartCard("채널별 광고비", { labels: labels, h: 230, stacked: true, tipFmt: won, series: Object.keys(CH).map(function (k) { return { name: CH[k], color: CHC[k], values: B.map(function (b) { return D.ads.filter(function (a) { return a.channel === k && inR(a.date, b); }).reduce(function (t, a) { return t + a.spend; }, 0); }) }; }) }) + '</div>';
    var share = { meta: .38, google: .3, naver: .22, kakao: .1 }, eff = { meta: 1.05, google: 1.15, naver: .95, kakao: .7 };
    var rows = Object.keys(CH).map(function (k) { var sp = ads.filter(function (a) { return a.channel === k; }).reduce(function (t, a) { return t + a.spend; }, 0), g = Math.round(gs * share[k] * eff[k] / 1.03), pay = K.pay * share[k] * eff[k] / 1.03; return { k: k, sp: sp, clk: ads.filter(function (a) { return a.channel === k; }).reduce(function (t, a) { return t + a.clicks; }, 0), g: g, n: Math.round(K.cnt * share[k] * eff[k] / 1.03), pay: pay }; });
    var srt = NW.store.get("paid-sort", ["sp", -1]); rows.sort(function (a, b) { var va = srt[0] === "cac" ? (a.g ? a.sp / a.g : 1e12) : srt[0] === "roas" ? (a.sp ? a.pay / a.sp : 0) : a[srt[0]], vb = srt[0] === "cac" ? (b.g ? b.sp / b.g : 1e12) : srt[0] === "roas" ? (b.sp ? b.pay / b.sp : 0) : b[srt[0]]; return (va - vb) * srt[1]; });
    var th = function (k, l) { return '<th class="r srt" data-psort="' + k + '">' + l + (srt[0] === k ? (srt[1] < 0 ? " ▼" : " ▲") : "") + '</th>'; };
    var table = '<div class="lbl">채널</div><div class="card tw"><table class="t tnum"><thead><tr><th>채널</th>' + th("sp", "광고비") + th("clk", "클릭") + th("g", "가입") + th("n", "결제") + th("cac", "CAC") + th("roas", "ROAS") + '</tr></thead><tbody>' + rows.map(function (x) { return '<tr><td><i class="tdot" style="display:inline-block;margin-right:8px;background:' + CHC[x.k] + '"></i><b>' + CH[x.k] + '</b></td><td class="r">' + won(x.sp) + '</td><td class="r">' + ko(x.clk) + '</td><td class="r">' + ko(x.g) + '명</td><td class="r">' + ko(x.n) + '건</td><td class="r">' + won(x.g ? x.sp / x.g : 0) + '</td><td class="r"><b>' + (x.sp ? (x.pay / x.sp * 100).toFixed(0) : 0) + '%</b></td></tr>'; }).join("") + '</tbody></table></div>';
    return NW.hero("paid", "MKT · 퍼포먼스", "Paid Dashboard", "광고비·CAC·ROAS·LTV를 한 줄로. 채널 귀속은 데모 가정 비율이에요.", right + NW.refreshBtn()) + filterBar() + grid + charts + table;
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

  /* ── KPI & OKR Tracker ──────────────────────────────── */
  var OK = NW.store.get("okr", { tab: "real", weeks: 26 });
  function okr() {
    var W = OK.weeks, mon = NW.monday(NW.TODAY), wk = []; for (var i = W - 1; i >= 0; i--) { var s = NW.addD(mon, -7 * i); wk.push({ s: NW.dstr(s), e: NW.dstr(NW.addD(s, 6)), label: md(NW.dstr(s)) }); }
    var pub = wk.map(function (w) { return D.listings.filter(function (l) { return l.registered_at <= w.e && l.operation_status === "PUBLISHED"; }).length; }), net = pub.map(function (v, i) { return i ? v - pub[i - 1] : 0; });
    var req = wk.map(function (w) { return D.contracts.filter(function (c) { return inR(c.created_at, w); }).length; }), pay = wk.map(function (w) { return D.contracts.filter(function (c) { return c.status === "COMPLETED" && inR(c.completed_at, w); }).length; });
    var avgNet = net.slice(-8).reduce(function (t, v) { return t + v; }, 0) / 8, acc = (net.slice(-4).reduce(function (t, v) { return t + v; }, 0) - net.slice(-8, -4).reduce(function (t, v) { return t + v; }, 0)) / 4;
    var labels = wk.map(function (w) { return w.label; });
    var head = NW.hero("okr", "DASHBOARD · 목표", "KPI & OKR Tracker", "실측 페이스로 목표 달성 시점을 역산해요. 슬라이더를 움직이면 바로 다시 계산돼요.", NW.segHtml([["real", "실측 추이"], ["model", "모델"]], OK.tab, "data-okr-tab", true));
    if (OK.tab === "real") {
      return head + '<div style="margin-top:18px;display:flex;gap:8px">' + NW.segHtml([["12", "12주"], ["26", "26주"], ["52", "52주"]], String(W), "data-okr-w") + '</div>'
        + '<div style="display:grid;gap:12px;margin-top:12px;grid-template-columns:minmax(220px,280px) 1fr">' + '<div style="display:flex;flex-direction:column;gap:10px">' + kpi("현재 게시 룸카드", ko(pub[pub.length - 1]) + "개", "이번 주 기준", "big") + kpi("주간 평균 순증", avgNet.toFixed(1) + "개", "최근 8주") + kpi("가속도", (acc >= 0 ? "+" : "") + acc.toFixed(1) + "개/주", "최근 4주 − 이전 4주", acc >= 0 ? "acc" : "bad") + '</div>'
        + '<div class="g2">' + NW.chartCard("룸카드 추이", { labels: labels, h: 190, series: [{ name: "게시 룸카드", type: "line", color: "var(--accent)", values: pub }] }) + NW.chartCard("주간 순증", { labels: labels, h: 190, series: [{ name: "순증", color: "var(--host)", values: net }] }) + NW.chartCard("계약신청", { labels: labels, h: 190, series: [{ name: "신청", color: "var(--c2)", values: req }] }) + NW.chartCard("결제", { labels: labels, h: 190, series: [{ name: "결제", color: "var(--good)", values: pay }] }) + '</div></div>';
    }
    var M = NW.store.get("okr-model", null) || { net: +avgNet.toFixed(1), acc: +acc.toFixed(1), reqR: 2.1, appr: 74, payR: 64, goal: 60, goalDate: NW.dstr(NW.addD(NW.TODAY, 180)) };
    var weeksLeft = Math.max(1, Math.round((NW.parseD(M.goalDate) - NW.TODAY) / (7 * 864e5))), P = pub[pub.length - 1], proj = [], cur = P, n = M.net;
    for (var k = 0; k < weeksLeft; k++) { n += M.acc / 4; cur += Math.max(0, n); proj.push(cur); }
    var monthPay = cur * M.reqR * 4.3 / 10 * (M.appr / 100) * (M.payR / 100) * 10 / 4.3 * 4.3 / 10 * 10;
    var need = M.goal / Math.max(.0001, M.reqR * 4.3 / 10 * (M.appr / 100) * (M.payR / 100));
    var sl = function (k2, l, min, max, step, u) { return '<label class="fld"><span>' + l + ' <b class="tnum" style="color:var(--text)">' + M[k2] + u + '</b></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + M[k2] + '" data-okr-m="' + k2 + '" style="accent-color:var(--accent)"></label>'; };
    var chip = function (t, v, kind) { return '<span class="pill ' + (kind === "var" ? "p-blue" : kind === "fix" ? "p-gray" : "p-em") + '">' + t + ' <b class="tnum">' + v + '</b></span>'; };
    return head + '<div style="display:grid;gap:12px;margin-top:18px;grid-template-columns:minmax(260px,340px) 1fr"><div class="card" style="padding:16px;display:flex;flex-direction:column;gap:14px">'
      + sl("net", "주간 순증", 0, 20, .1, "개") + sl("acc", "가속(주당 변화)", -3, 3, .1, "") + sl("reqR", "방당 월 신청률", .5, 5, .1, "건/10개") + sl("appr", "승인율", 30, 100, 1, "%") + sl("payR", "결제율", 30, 100, 1, "%")
      + '<button class="btn" data-okr-reset style="align-self:flex-start">' + ic("refresh") + '전부 실측으로</button><hr style="border:0;border-top:1px solid var(--border);margin:0">'
      + '<label class="fld"><span>목표일</span><input class="inp" type="date" value="' + M.goalDate + '" data-okr-m="goalDate"></label><label class="fld"><span>목표 월 결제(건)</span><input class="inp" type="number" value="' + M.goal + '" data-okr-m="goal"></label></div>'
      + '<div style="display:flex;flex-direction:column;gap:12px"><div class="card" style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:8px">' + chip("목표일까지", weeksLeft + "주", "fix") + chip("예상 룸카드", ko(cur) + "개", "var") + chip("목표 달성에 필요한 룸카드", ko(need) + "개", "meas") + chip("판정", cur >= need ? "달성 가능 ✓" : "부족 " + ko(need - cur) + "개", cur >= need ? "meas" : "var") + '</div>'
      + NW.chartCard("룸카드 예상 경로", { labels: proj.map(function (v, i) { return md(NW.dstr(NW.addD(mon, 7 * (i + 1)))); }), h: 260, series: [{ name: "예상 룸카드", type: "line", color: "var(--accent)", values: proj }, { name: "필요 룸카드", type: "line", dash: true, color: "var(--danger)", values: proj.map(function () { return need; }) }] }, "파란 칩 = 조정값 · 회색 = 고정 · 초록 = 실측 기반") + '</div></div>';
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
    if ((b = e.target.closest("[data-okr-tab]"))) { OK.tab = b.getAttribute("data-okr-tab"); NW.store.set("okr", OK); NW.rerender(); return; }
    if ((b = e.target.closest("[data-okr-w]"))) { OK.weeks = +b.getAttribute("data-okr-w"); NW.store.set("okr", OK); NW.rerender(); return; }
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
  NW.PAGES["paid-dashboard"] = { render: paidDashboard };
  NW.PAGES["ga4"] = { render: ga4 };
  NW.PAGES["kpi-okr"] = { render: okr };
})(window.NW);
