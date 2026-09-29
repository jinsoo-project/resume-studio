/* 김진수 마케팅 콘솔 — Agent Dashboard (데모)
   모든 수치는 시드 고정 RNG로 만든 가상 데이터예요. 외부 API·키·실데이터 없음.
   화면 편집(제목·상태 등)은 이 브라우저 localStorage 에만 저장돼요. */
(function () {
  "use strict";
  var BRAND = "김진수 마케팅 콘솔";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ko = function (n) { return Math.round(n || 0).toLocaleString("ko-KR"); };
  var won = function (n) { return Math.round(n || 0).toLocaleString("ko-KR") + "원"; };
  var pct = function (a, b) { return b ? (a / b * 100).toFixed(1) + "%" : "—"; };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("nw-demo:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("nw-demo:" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ── 시드 고정 RNG ───────────────────────────────────── */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var R = mulberry32(20260901);
  var rnd = function (a, b) { return a + (b - a) * R(); };
  var ri = function (a, b) { return Math.floor(rnd(a, b + 1)); };
  var pick = function (arr) { return arr[Math.floor(R() * arr.length)]; };
  var chance = function (p) { return R() < p; };

  /* ── 날짜 ─────────────────────────────────────────────── */
  var DAY = 864e5;
  var TODAY = (function () { var d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  var dstr = function (d) { var x = new Date(d); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); };
  var md = function (s) { return String(s).slice(5, 10).replace("-", "."); };
  var addD = function (d, n) { return new Date(+d + n * DAY); };
  var parseD = function (s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var monday = function (d) { var x = new Date(d); var w = (x.getDay() + 6) % 7; return addD(x, -w); };

  /* ── 가상 데이터 생성기 ─────────────────────────────────── */
  var AREAS = ["성수", "합정", "연남", "신촌", "왕십리", "건대", "선릉", "역삼", "문래", "사당", "노원", "수원역", "판교", "분당", "인천송도", "부산서면", "해운대", "대전둔산", "광주상무", "대구동성로", "전주", "청주", "천안", "제주"];
  var SIDO = { "성수": "서울", "합정": "서울", "연남": "서울", "신촌": "서울", "왕십리": "서울", "건대": "서울", "선릉": "서울", "역삼": "서울", "문래": "서울", "사당": "서울", "노원": "서울", "수원역": "경기", "판교": "경기", "분당": "경기", "인천송도": "인천", "부산서면": "부산", "해운대": "부산", "대전둔산": "대전", "광주상무": "광주", "대구동성로": "대구", "전주": "전북", "청주": "충북", "천안": "충남", "제주": "제주" };
  var RT = ["원룸 A", "원룸 B", "투룸", "스튜디오", "복층 로프트", "쉐어 1인실", "쉐어 2인실", "테라스 원룸", "오피스텔형", "리빙룸형"];
  var D = { listings: [], hosts: [], guests: [], contracts: [], ga4: [], ads: [] };
  (function gen() {
    var i, d;
    for (i = 0; i < 64; i++) D.hosts.push({ host_key: "H" + (1000 + i), name: pick(["가나", "다온", "라온", "마루", "바람", "새봄", "아라", "자람", "하늘", "누리"]) + " " + pick(["하우스", "스테이", "리빙", "홈즈", "레지던스"]), seg: i < 14 ? "직영" : "일반", joined_at: dstr(addD(TODAY, -ri(20, 900))), region: pick(AREAS) });
    for (i = 0; i < 156; i++) {
      var seg = i < 39 ? "직영" : "일반", area = pick(AREAS), h = seg === "직영" ? D.hosts[ri(0, 13)] : D.hosts[ri(14, 63)];
      D.listings.push({ type_id: 5000 + i, branch_name: area + (seg === "직영" ? " 직영점" : " " + pick(["스테이", "하우스", "레지던스"])), roomtype_name: pick(RT), seg: seg, registered_at: dstr(addD(TODAY, -ri(0, 420))), operation_status: chance(.92) ? "PUBLISHED" : "DRAFT", unit_count: ri(1, 6), weekly_rent: ri(25, 90) * 10000, sido: SIDO[area], host_key: h.host_key });
    }
    var cid = 90000;
    for (d = 365; d >= 0; d--) {
      var day = addD(TODAY, -d), mo = (365 - d) / 30, dow = day.getDay(), dom = day.getDate();
      var base = 9.5 * Math.pow(1.045, mo) * (dow === 0 || dow === 6 ? .8 : 1.08) * (dom <= 5 ? 1.18 : 1);
      var n = Math.max(0, Math.round(base + rnd(-3, 3)));
      for (i = 0; i < n; i++) {
        var L = pick(D.listings), created = addD(day, 0), weeks = ri(2, 26), rent = L.weekly_rent * weeks;
        var disc = chance(.3) ? Math.round(rent * rnd(0, .15) / 100) * 100 : 0, mgmt = ri(5, 10) * 10000, clean = ri(5, 12) * 10000;
        var comm = Math.round((rent - disc + mgmt + clean) * rnd(.05, .09) / 10) * 10, dep = ri(3, 10) * 100000;
        var r = R(), st;
        if (r < .07) st = "REJECTED"; else if (r < .15) st = "EXPIRED_APPROVAL"; else if (r < .23) st = "CANCELED_NOPAY_PRE"; else if (r < .37) st = "CANCELED_NOPAY"; else if (r < .43) st = "EXPIRED"; else if (r < .49) st = "CANCELED"; else st = "COMPLETED";
        var age = d; if (age < 2 && chance(.6)) st = age < 1 ? "REQUESTED" : "APPROVED";
        var approved = /REJECTED|EXPIRED_APPROVAL|CANCELED_NOPAY_PRE|REQUESTED/.test(st) ? null : dstr(addD(created, ri(0, 2)));
        var completed = st === "COMPLETED" || st === "CANCELED" ? dstr(addD(created, ri(1, 4))) : null;
        if (completed && parseD(completed) > TODAY) completed = dstr(TODAY);
        var start = addD(parseD(completed || dstr(created)), ri(3, 30)), end = addD(start, weeks * 7);
        var paid = rent - disc + mgmt + clean + comm;
        D.contracts.push({ contract_id: cid++, seg: L.seg, branch_name: L.branch_name, roomtype_name: L.roomtype_name, host_key: L.host_key, guest_key: "G" + ri(10000, 99999), status: st, created_at: dstr(created), approved_at: approved, completed_at: completed, canceled_at: st === "CANCELED" ? dstr(addD(parseD(completed), ri(1, 10))) : null, start_at: dstr(start), end_at: dstr(end), nights: weeks * 7, gmv: paid + dep, deposit: dep, rent_fee: rent, rent_discount: disc, management_fee: mgmt, cleaning_fee: clean, commission: comm, paid_amount: paid, cancel_refund: st === "CANCELED" ? Math.round(paid * rnd(.5, 1)) : null });
      }
      var gs = ri(2, 8) + Math.round(mo * .25);
      for (i = 0; i < gs; i++) D.guests.push({ guest_key: "G" + ri(10000, 99999), joined_at: dstr(day), nationality: pick(["KR", "KR", "KR", "KR", "US", "CN", "JP", "VN", "FR", "DE"]), lang: pick(["ko", "ko", "ko", "en", "zh", "ja"]) });
      var dau = Math.round((150 + mo * 32) * (dow === 0 || dow === 6 ? .82 : 1.08) * rnd(.85, 1.15));
      D.ga4.push({ date: dstr(day), dau: dau, wau: Math.round(dau * rnd(3.7, 4.3)), mau: Math.round(dau * rnd(9.4, 10.6)), sign_up: Math.round(dau * rnd(.012, .018)), view_item: Math.round(dau * rnd(1.8, 2.6)), purchase: 0, page_view: Math.round(dau * rnd(4.2, 5.8)) });
      ["meta", "google", "naver", "kakao"].forEach(function (ch) {
        var k = { meta: 1.2, google: 1, naver: .75, kakao: .4 }[ch], sp = Math.round(rnd(5, 40) * 10000 * k * (0.75 + mo * .03) / 1000) * 1000;
        D.ads.push({ date: dstr(day), channel: ch, spend: sp, clicks: Math.round(sp / rnd(380, 900)), impressions: Math.round(sp / rnd(4, 9)) });
      });
    }
    // 가입 호스트(일 0~2명)
    for (d = 365; d >= 0; d--) { var hn = chance(.55) ? ri(0, 2) : 0; for (i = 0; i < hn; i++) D.hosts.push({ host_key: "H" + (2000 + D.hosts.length), name: "신규 호스트", seg: chance(.2) ? "직영" : "일반", joined_at: dstr(addD(TODAY, -d)), region: pick(AREAS), branchAcct: chance(.12) }); }
    var byDate = {}; D.contracts.forEach(function (c) { if (c.completed_at && c.status !== "CANCELED") byDate[c.completed_at] = (byDate[c.completed_at] || 0) + 1; });
    D.ga4.forEach(function (g) { g.purchase = byDate[g.date] || 0; });
  })();

  /* ── 기간 · 필터 ─────────────────────────────────────── */
  var RANGES = [["all", "전체"], ["today", "오늘"], ["yday", "어제"], ["tw", "이번주"], ["lw", "지난주"], ["lm", "지난달"], ["30", "최근 30일"]];
  function rangeOf(k) {
    var s, e = TODAY;
    if (k === "all") s = addD(TODAY, -365);
    else if (k === "today") s = TODAY;
    else if (k === "yday") { s = addD(TODAY, -1); e = s; }
    else if (k === "tw") s = monday(TODAY);
    else if (k === "lw") { s = addD(monday(TODAY), -7); e = addD(s, 6); }
    else if (k === "lm") { s = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1); e = new Date(TODAY.getFullYear(), TODAY.getMonth(), 0); }
    else s = addD(TODAY, -(+k - 1));
    return { s: dstr(s), e: dstr(e), days: Math.round((e - s) / DAY) + 1 };
  }
  var inR = function (d, r) { return d && d >= r.s && d <= r.e; };
  var F = store.get("filters", { range: "30", gran: "week", seg: "all" });
  var segOk = function (x) { return F.seg === "all" || x.seg === (F.seg === "direct" ? "직영" : "일반"); };

  /* ── 공통 UI 조각 ─────────────────────────────────────── */
  var ICON = {
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    chart: '<path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3"/>',
    heart: '<path d="M12 20s-7-4.4-9-8.6C1.6 8.3 3.7 5 7 5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.3 0 5.4 3.3 4 6.4C19 15.6 12 20 12 20z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.7 8.2 12s1.3 6.4 3.8 9"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    base: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
  };
  var ic = function (n, cls) { return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[n] || "") + '</svg>'; };
  var TONE = { accent: "var(--accent)", good: "var(--good)", danger: "var(--danger)", amber: "var(--amber)", direct: "var(--seg-direct)", private: "var(--seg-private)" };
  function segHtml(opts, val, attr, lg) { return '<div class="seg' + (lg ? " lg" : "") + '">' + opts.map(function (o) { return '<button type="button" ' + attr + '="' + o[0] + '" class="' + (o[0] === val ? "on" : "") + '">' + (o[2] ? '<i class="dt" style="background:' + o[2] + '"></i>' : "") + esc(o[1]) + (o[3] ? '<small>' + esc(o[3]) + '</small>' : "") + '</button>'; }).join("") + '</div>'; }
  function toast(t) { var el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2000); }

  /* 편집 가능한 히어로: 제목·설명 클릭 → 입력 (localStorage) */
  function hero(key, eyebrow, title, desc, right) {
    var H = store.get("hero:" + key, {});
    return '<div class="hero"><div style="min-width:0;flex:1"><div class="eyebrow">' + esc(eyebrow) + ' <span class="demo-pill"><i></i>데모 · 가상 데이터</span></div>'
      + '<h1 class="h-title" data-hero="' + key + ':title" data-def="' + esc(title) + '" title="클릭해서 제목 바꾸기">' + esc(H.title || title) + '</h1>'
      + '<p class="h-desc" data-hero="' + key + ':desc" data-def="' + esc(desc) + '" title="클릭해서 설명 바꾸기">' + esc(H.desc || desc) + '</p></div>'
      + '<div class="hero-r">' + (right || "") + '</div></div>';
  }
  function refreshBtn() { var t = store.get("refreshed", ""); return '<button class="btn" data-refresh>' + ic("refresh") + '새로고침' + (t ? '<span style="color:var(--faint);font-weight:400">· 마지막 갱신 ' + t + '</span>' : '') + '</button>'; }

  /* ── 모달 · 드로어 ───────────────────────────────────── */
  var openLayer = null;
  function closeLayer() { if (openLayer) { openLayer.remove(); openLayer = null; document.body.style.overflow = ""; } }
  function layer(html, cls) {
    closeLayer();
    var el = document.createElement("div"); el.innerHTML = html; el = el.firstElementChild; document.body.appendChild(el); openLayer = el; document.body.style.overflow = "hidden";
    el.addEventListener("click", function (e) { if (e.target === el || e.target.classList.contains("bd") || e.target.closest("[data-close]")) closeLayer(); });
    return el;
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLayer(); });
  var STATUS_KO = { REQUESTED: "신청", APPROVED: "승인", REJECTED: "호스트 거절", EXPIRED_APPROVAL: "승인기한 만료", CANCELED_NOPAY_PRE: "승인 전 취소", CANCELED_NOPAY: "승인 후 취소", EXPIRED: "결제기한 만료", COMPLETED: "결제완료", CANCELED: "결제 후 취소" };
  var STATUS_TONE = { REQUESTED: "p-gray", APPROVED: "p-sky", REJECTED: "p-red", EXPIRED_APPROVAL: "p-amber", CANCELED_NOPAY_PRE: "p-red", CANCELED_NOPAY: "p-red", EXPIRED: "p-amber", COMPLETED: "p-em", CANCELED: "p-red" };
  /* 숫자 클릭 → 그 숫자를 만든 행 목록 */
  function rowsModal(title, rows, sumFn, summary) {
    var shown = rows.slice(0, 300), total = sumFn ? sumFn(rows) : null;
    var body = '<table class="t tnum"><thead><tr><th>계약 ID</th><th>구분</th><th>지점</th><th>룸타입</th><th>상태</th><th>신청일</th><th>결제일</th><th class="r">결제금액</th><th class="r">보증금</th><th class="r">거래액</th><th class="r">게스트 수수료</th><th class="r">박수</th></tr></thead><tbody>'
      + shown.map(function (c) { return '<tr><td>#' + c.contract_id + '</td><td><span class="pill sm" style="background:' + (c.seg === "직영" ? "var(--seg-direct-soft)" : "var(--seg-private-soft)") + ';color:' + (c.seg === "직영" ? "var(--seg-direct)" : "var(--seg-private)") + '">' + c.seg + '</span></td><td>' + esc(c.branch_name) + '</td><td>' + esc(c.roomtype_name) + '</td><td><span class="pill sm ' + STATUS_TONE[c.status] + '">' + STATUS_KO[c.status] + '</span></td><td>' + md(c.created_at) + '</td><td>' + (c.completed_at ? md(c.completed_at) : '—') + '</td><td class="r">' + won(c.paid_amount) + '</td><td class="r">' + won(c.deposit) + '</td><td class="r">' + won(c.gmv) + '</td><td class="r">' + won(c.commission) + '</td><td class="r">' + c.nights + '</td></tr>'; }).join("")
      + '</tbody></table>';
    layer('<div class="ov"><div class="md"><div class="md-h"><div class="tt"><b>' + esc(title) + '</b><span>' + ko(rows.length) + '건' + (total != null ? ' · 합계 ' + won(total) : '') + (rows.length > 300 ? ' · 상위 300건 표시' : '') + '</span></div><button class="xb" data-close aria-label="닫기">' + ic("x") + '</button></div>'
      + (summary ? '<div class="md-s">' + summary + '</div>' : '') + '<div class="md-b">' + (rows.length ? body : '<div class="empty"><b>해당 행이 없어요</b><p>기간이나 구분을 바꿔 보세요.</p></div>') + '</div></div></div>');
  }

  /* ── SVG 차트 (막대·선·스택·복합) ──────────────────────── */
  var charts = [];
  function chart(spec) { var id = "ch" + charts.length; charts.push({ id: id, spec: spec }); return '<div class="chart" id="' + id + '" style="height:' + (spec.h || 220) + 'px"></div>'; }
  function niceMax(v) { if (v <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
  var short = function (v) { var a = Math.abs(v); return a >= 1e8 ? (v / 1e8).toFixed(a >= 1e9 ? 0 : 1) + "억" : a >= 1e4 ? Math.round(v / 1e4).toLocaleString() + "만" : Math.round(v).toLocaleString(); };
  function drawChart(c) {
    var el = document.getElementById(c.id); if (!el) return;
    var s = c.spec, W = el.clientWidth || 600, H = s.h || 220, pl = 46, pr = s.right ? 46 : 12, pt = 16, pb = 26, iw = W - pl - pr, ih = H - pt - pb, n = s.labels.length;
    var bars = s.series.filter(function (x) { return x.type !== "line"; }), lines = s.series.filter(function (x) { return x.type === "line"; });
    var maxB = 0, maxL = 0, i;
    for (i = 0; i < n; i++) { var st = 0; bars.forEach(function (b) { st = s.stacked ? st + (b.values[i] || 0) : Math.max(st, b.values[i] || 0); }); maxB = Math.max(maxB, st); lines.forEach(function (l) { if (!s.right) maxB = Math.max(maxB, l.values[i] || 0); else maxL = Math.max(maxL, l.values[i] || 0); }); }
    maxB = s.max || niceMax(maxB * 1.08); maxL = niceMax(maxL * 1.1);
    var y = function (v) { return pt + ih - v / maxB * ih; }, y2 = function (v) { return pt + ih - v / maxL * ih; }, bw = iw / n, x = function (k) { return pl + bw * k + bw / 2; };
    var fmt = s.fmt || short, out = '<svg viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '">';
    for (i = 0; i <= 4; i++) { var gv = maxB / 4 * i, gy = y(gv); out += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + gy + '" y2="' + gy + '"' + (i ? ' stroke-dasharray="3 4"' : '') + '/><text class="ax" x="' + (pl - 6) + '" y="' + (gy + 3.5) + '" text-anchor="end">' + fmt(gv) + '</text>'; if (s.right) out += '<text class="ax" x="' + (W - pr + 6) + '" y="' + (gy + 3.5) + '">' + (s.fmt2 || short)(maxL / 4 * i) + '</text>'; }
    var step = Math.ceil(n / Math.max(2, Math.floor(iw / 58)));
    for (i = 0; i < n; i += step) out += '<text class="ax" x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(s.labels[i]) + '</text>';
    var gw = Math.max(2, Math.min(34, bw * (s.stacked || bars.length < 2 ? .62 : .8 / bars.length)));
    for (i = 0; i < n; i++) {
      var acc = 0;
      bars.forEach(function (b, bi) { var v = b.values[i] || 0; if (!v) return; var bx = s.stacked || bars.length < 2 ? x(i) - gw / 2 : x(i) - gw * bars.length / 2 + gw * bi; var top = s.stacked ? y(acc + v) : y(v), bot = s.stacked ? y(acc) : y(0); out += '<rect x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + gw.toFixed(1) + '" height="' + Math.max(0, bot - top).toFixed(1) + '" rx="' + Math.min(3, gw / 3) + '" fill="' + b.color + '"/>'; acc += v; });
      if (s.labelsOn && bars.length && n <= 16) { var tv = s.stacked ? acc : Math.max.apply(null, bars.map(function (b) { return b.values[i] || 0; })); if (tv) out += '<text class="vl" x="' + x(i) + '" y="' + (y(tv) - 5) + '" text-anchor="middle">' + fmt(tv) + '</text>'; }
    }
    lines.forEach(function (l) { var yy = s.right ? y2 : y, dpath = l.values.map(function (v, k) { return (k ? "L" : "M") + x(k).toFixed(1) + " " + yy(v || 0).toFixed(1); }).join(" "); out += '<path d="' + dpath + '" fill="none" stroke="' + l.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"' + (l.dash ? ' stroke-dasharray="5 4"' : '') + '/>'; if (n <= 40) l.values.forEach(function (v, k) { out += '<circle cx="' + x(k).toFixed(1) + '" cy="' + yy(v || 0).toFixed(1) + '" r="2.6" fill="var(--surface)" stroke="' + l.color + '" stroke-width="1.6"/>'; }); if (s.labelsOn && n <= 16) l.values.forEach(function (v, k) { out += '<text class="vl" x="' + x(k) + '" y="' + (yy(v || 0) - 8) + '" text-anchor="middle" style="fill:' + l.color + '">' + (s.right ? (s.fmt2 || short) : fmt)(v || 0) + '</text>'; }); });
    out += '<rect class="hz" x="' + pl + '" y="' + pt + '" width="' + iw + '" height="' + ih + '" fill="transparent"/></svg><div class="tip"></div>';
    el.innerHTML = out;
    var tip = el.querySelector(".tip"), hz = el.querySelector(".hz");
    hz.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect(), k = Math.max(0, Math.min(n - 1, Math.floor((e.clientX - r.left - pl) / bw)));
      tip.innerHTML = '<b>' + esc(s.tipLabels ? s.tipLabels[k] : s.labels[k]) + '</b>' + s.series.map(function (sr) { return '<div><span><i style="background:' + sr.color + '"></i>' + esc(sr.name) + '</span><strong class="tnum">' + (sr.type === "line" && s.right ? (s.fmt2 || short) : (s.tipFmt || fmt))(sr.values[k] || 0) + '</strong></div>'; }).join("");
      var tx = x(k) + 14; if (tx + 180 > W) tx = x(k) - 190; tip.style.left = tx + "px"; tip.style.top = "8px"; tip.style.opacity = 1;
    });
    hz.addEventListener("mouseleave", function () { tip.style.opacity = 0; });
  }
  function drawCharts() { charts.forEach(drawChart); }
  var rsz; window.addEventListener("resize", function () { clearTimeout(rsz); rsz = setTimeout(drawCharts, 120); });
  function legend(series) { return '<div class="lg">' + series.map(function (s) { return '<span><i style="background:' + s.color + (s.type === "line" ? ";height:3px;border-radius:2px" : "") + '"></i>' + esc(s.name) + '</span>'; }).join("") + '</div>'; }
  function chartCard(title, spec, note, extra) { return '<div class="card cc"><div class="cc-h"><b>' + esc(title) + '</b>' + legend(spec.series) + (extra || "") + '</div>' + (note ? '<div class="cc-n">' + esc(note) + '</div>' : '') + chart(spec) + '</div>'; }

  /* 기간 버킷(일/주/월) */
  function buckets(r, gran) {
    var out = [], s = parseD(r.s), e = parseD(r.e), cur;
    if (gran === "day") for (cur = s; cur <= e; cur = addD(cur, 1)) out.push({ s: dstr(cur), e: dstr(cur), label: md(dstr(cur)) });
    else if (gran === "week") for (cur = monday(s); cur <= e; cur = addD(cur, 7)) out.push({ s: dstr(cur), e: dstr(addD(cur, 6)), label: md(dstr(cur)) + "~" });
    else for (cur = new Date(s.getFullYear(), s.getMonth(), 1); cur <= e; cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)) out.push({ s: dstr(cur), e: dstr(new Date(cur.getFullYear(), cur.getMonth() + 1, 0)), label: (cur.getMonth() + 1) + "월" });
    return out;
  }
  function sumBy(arr, key, dateKey, b) { var t = 0; arr.forEach(function (x) { if (inR(x[dateKey], b)) t += typeof key === "function" ? key(x) : (key ? x[key] : 1); }); return t; }

  window.NW = { $: $, $$: $$, esc: esc, ko: ko, won: won, pct: pct, store: store, R: R, rnd: rnd, ri: ri, pick: pick, chance: chance, TODAY: TODAY, dstr: dstr, md: md, addD: addD, parseD: parseD, monday: monday, D: D, BRAND: BRAND,
    RANGES: RANGES, rangeOf: rangeOf, inR: inR, F: F, segOk: segOk, ic: ic, TONE: TONE, segHtml: segHtml, toast: toast, hero: hero, refreshBtn: refreshBtn, layer: layer, closeLayer: closeLayer,
    rowsModal: rowsModal, STATUS_KO: STATUS_KO, STATUS_TONE: STATUS_TONE, chart: chart, chartCard: chartCard, legend: legend, charts: charts, drawCharts: drawCharts, short: short, buckets: buckets, sumBy: sumBy, PAGES: {} };
})();
