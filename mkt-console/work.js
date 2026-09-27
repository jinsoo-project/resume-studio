/* MKT 협업 화면 (광고 & 디자인 요청 · UTM · 경쟁사 광고 · 회의 캘린더) — 전부 가상 데이터 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, ic = NW.ic, md = NW.md, store = NW.store, ri = NW.ri, pick = NW.pick, chance = NW.chance, dstr = NW.dstr, addD = NW.addD, TODAY = NW.TODAY;

  /* ── 공통: 가상 에이전트 · 드로어 · 해시 RNG ───────────── */
  var AG = [["하루", "콘텐츠 마케터", "#F97316"], ["서치", "SEO", "#3B82F6"], ["퍼포", "퍼포먼스", "#8B5CF6"], ["케어", "CRM · 리텐션", "#EC4899"], ["플래니", "서비스 기획", "#10B981"], ["스트래", "마케팅 기획", "#F59E0B"], ["픽셀", "UI/UX 디자인", "#6366F1"]];
  var AGC = {}; AG.forEach(function (a) { AGC[a[0]] = a[2]; }); AGC["나"] = "var(--accent)";
  var AGN = AG.map(function (a) { return a[0]; });
  function av(n, sz) { return '<span class="av" style="background:' + (AGC[n] || "#999") + (sz ? ';width:' + sz + 'px;height:' + sz + 'px;font-size:' + Math.round(sz * .42) + 'px' : '') + '" title="' + esc(n) + '">' + esc(n === "나" ? "나" : n.slice(0, 1)) + '</span>'; }
  function hashRng(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } var a = h >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function grad(seed) { var r = hashRng(String(seed)), h1 = Math.floor(r() * 360), h2 = (h1 + 40 + Math.floor(r() * 80)) % 360; return "linear-gradient(135deg,hsl(" + h1 + " 62% 72%),hsl(" + h2 + " 58% 52%))"; }
  function drawer(title, body, foot, w, sub) {
    return NW.layer('<div class="dw"><div class="bd"></div><aside' + (w ? ' style="max-width:' + w + 'px"' : '') + '><div class="dw-h"><b>' + title + '</b>' + (sub || '') + '<button class="xb" data-close aria-label="닫기">' + ic("x") + '</button></div><div class="dw-b">' + body + '</div>' + (foot ? '<div class="dw-f">' + foot + '</div>' : '') + '</aside></div>');
  }
  function fld(label, inner) { return '<label class="fld"><span>' + label + '</span>' + inner + '</label>'; }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function copy(t) { try { navigator.clipboard.writeText(t).then(function () { NW.toast("복사했어요"); }, function () { NW.toast("복사했어요"); }); } catch (e) { NW.toast("복사했어요"); } }
  var hhmm = function () { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };
  NW.AG = AG; NW.AGN = AGN; NW.av = av; NW.hashRng = hashRng; NW.grad = grad; NW.drawer = drawer; NW.fld = fld; NW.uid = uid; NW.copy = copy;

  /* ── 매체 × 캠페인 유형 × 소재 가이드 (정적 스펙) ─────── */
  var MEDIA = {
    meta: { l: "Meta", c: "#1877F2", t: ["트래픽", "전환", "앱 설치", "리드"], g: ["1080×1080 (피드) · 1080×1920 (스토리·릴스)", "기본 문구 125자 · 제목 40자 · 설명 30자", "이미지 속 텍스트는 짧게 — 핵심 1줄"] },
    google: { l: "Google", c: "#EA4335", t: ["검색", "PMax", "디스플레이", "YouTube"], g: ["1200×628 · 1200×1200 · 로고 1200×1200", "광고 제목 30자 × 최대 15 · 설명 90자 × 최대 4", "반응형 — 조합이 많을수록 유리"] },
    naver: { l: "Naver", c: "#03C75A", t: ["파워링크", "브랜드검색", "쇼핑검색", "GFA"], g: ["GFA 1200×628 · 342×228", "제목 15자 · 설명 45자", "브랜드검색은 상표 확인 필요"] },
    kakao: { l: "Kakao", c: "#E5C800", t: ["비즈보드", "디스플레이", "메시지"], g: ["비즈보드 1029×222 · 오브젝트 315×258", "메인 카피 18자 · 서브 카피 20자", "오브젝트는 배경 투명 PNG"] },
    tiktok: { l: "TikTok", c: "#111111", t: ["인피드", "탑뷰", "스파크 애즈"], g: ["1080×1920 · 9:16 영상 9~15초", "광고 문구 100자", "첫 2초 안에 훅"] },
    etc: { l: "기타", c: "#8a8a8a", t: ["제휴", "오프라인", "기타"], g: ["협의", "협의", "요청 내용에 사양을 적어 주세요"] }
  };
  var MKEYS = Object.keys(MEDIA);
  function mchip(k, on, attr) { var m = MEDIA[k]; return '<button type="button" class="mchip' + (on ? " on" : "") + '" ' + attr + '="' + k + '"><i style="background:' + m.c + '">' + m.l.slice(0, 1) + '</i>' + m.l + '</button>'; }
  function guideBox(k) { var g = MEDIA[k].g; return '<div class="guide"><b>소재 가이드 · ' + MEDIA[k].l + '</b><div><span>사이즈</span>' + g[0] + '</div><div><span>텍스트</span>' + g[1] + '</div><div><span>메모</span>' + g[2] + '</div></div>'; }
  NW.MEDIA = MEDIA;

  /* ── 1. 광고 & 디자인 요청 보드 ───────────────────────── */
  var RQ_ST = [["requested", "요청", "p-amber"], ["in_progress", "진행중", "p-sky"], ["done", "완료", "p-em"]];
  var RQ_KIND = { ad: "광고", text: "텍스트", etc: "기타" };
  var RQ_TITLES = ["가을 이사철 단기임대 프로모션", "한달살기 리타게팅 소재", "신규 지점 오픈 알림", "대학가 개강 캠페인", "이번 주 특가 룸 소개", "호스트 모집 리드폼", "앱 설치 유도 릴스", "브랜드검색 소재 교체", "연휴 숙소 기획전", "외국인 게스트 영문 소재", "재방문 쿠폰 안내", "직영점 후기 카드뉴스", "워케이션 테마 기획전", "학기 단위 장기 할인", "블로그 유입 배너", "장기 투숙 혜택 배너", "첫 계약 할인 푸시 문구", "지점 소개 숏폼"];
  var TARGETS = ["20~34 · 대학가 반경 3km", "25~39 · 직장인 · 수도권", "외국인 · 영어권", "이사 관심사 · 전국", "앱 미설치 · 웹 방문자", "지난 30일 조회 · 미결제"];
  var BODY = ["보증금 부담 없이, 1주부터 시작하는 내 방.", "이번 주만, 첫 계약 2주 할인.", "가구·가전 다 있는 방, 캐리어만 들고 오세요.", "학교 앞 풀옵션 원룸, 학기 단위로 가볍게."];
  function seedBoard() {
    var out = [];
    for (var i = 0; i < 26; i++) {
      var med = i % 5 === 4 ? pick(["kakao", "tiktok", "etc"]) : pick(["meta", "meta", "google", "naver"]), kind = i % 7 === 3 ? "text" : i % 9 === 5 ? "etc" : "ad";
      var sets = [], ns = kind === "ad" ? ri(1, 3) : 1;
      for (var s = 0; s < ns; s++) sets.push({ id: uid(), name: "세트 " + (s + 1), media: ri(0, 4), body: pick(BODY), title: pick(["풀옵션 단기임대", "1주부터 계약 가능", "학교 앞 원룸", "캐리어만 들고 오세요"]), desc: pick(["지금 예약하면 첫 주 할인", "보증금 부담 없이", "후기 4.8점"]), memo: chance(.5) ? "첫 컷에 방 전경, 두 번째 컷에 가격" : "" });
      var cm = [], nc = ri(0, 3);
      for (var c = 0; c < nc; c++) cm.push({ by: pick(AGN), at: dstr(addD(TODAY, -ri(0, 20))), text: pick(["@픽셀 첫 컷 밝기만 조금 올려 주세요", "카피 A/B 두 개로 가볼게요", "사이즈 1080×1920 추가 부탁해요", "확인했어요 👍", "@퍼포 세트 예산 확인 부탁"]) });
      out.push({ id: uid(), kind: kind, title: RQ_TITLES[i % RQ_TITLES.length], medium: med, ctype: pick(MEDIA[med].t), target: pick(TARGETS), owner: pick(["픽셀", "픽셀", "하루", "퍼포"]), status: pick(["requested", "in_progress", "in_progress", "done", "done"]), created_at: dstr(addD(TODAY, -Math.floor(i * 2.2) - ri(0, 2))), creator: chance(.3) ? "나" : pick(["스트래", "퍼포", "케어", "하루"]), content: "메인 메시지: " + pick(BODY) + "\n참고 레퍼런스: 지난 캠페인 소재 톤 유지", sets: sets, comments: cm });
    }
    return out;
  }
  var BOARD = store.get("board", null) || seedBoard();
  var saveBoard = function () { store.set("board", BOARD); };
  var BF = store.get("board-f", { st: { requested: true, in_progress: true, done: true }, kind: "all" });
  var rqById = function (id) { return BOARD.filter(function (x) { return x.id === id; })[0]; };

  function adRequests() {
    var rows = BOARD.filter(function (r) { return BF.st[r.status] && (BF.kind === "all" || r.kind === BF.kind); }).sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; });
    var cnt = {}; BOARD.forEach(function (r) { cnt[r.status] = (cnt[r.status] || 0) + 1; });
    var wk = dstr(addD(TODAY, -7));
    return '<div style="max-width:1400px;margin:0 auto">' + NW.hero("board", "협업 · 광고 제작", "광고 & 디자인 요청", "광고 소재·디자인·문구 요청을 한 표에서 주고받아요. 행을 누르면 세트별 소재와 코멘트가 열려요.", '<button class="btn btn-p" data-rq-new>' + ic("plus") + '요청 생성</button>')
      + '<div class="fline">' + RQ_ST.map(function (s) { return '<button class="pill ' + s[2] + (BF.st[s[0]] ? '' : ' dim') + '" data-rq-f="' + s[0] + '">' + s[1] + ' <b class="tnum">' + (cnt[s[0]] || 0) + '</b></button>'; }).join("")
      + '<span class="vsep"></span>' + NW.segHtml([["all", "전체"], ["ad", "광고"], ["text", "텍스트"], ["etc", "기타"]], BF.kind, "data-rq-kind") + '<span class="fl-note"><span class="new">NEW</span> 최근 7일 · 다른 사람이 만든 요청</span></div>'
      + '<div class="card tw"><table class="t" style="min-width:1180px"><thead><tr><th>생성일</th><th>구분</th><th>제목</th><th>매체·종류</th><th>캠페인 유형</th><th class="c">세트</th><th>타겟</th><th>담당</th><th>상태</th><th class="c">소재</th><th class="c">코멘트</th><th>생성자</th><th></th></tr></thead><tbody>'
      + (rows.length ? rows.map(function (r) {
        var st = RQ_ST.filter(function (s) { return s[0] === r.status; })[0], m = MEDIA[r.medium], nm = r.sets.reduce(function (t, s) { return t + s.media; }, 0);
        return '<tr class="clk grp" data-rq="' + r.id + '"><td class="tnum">' + md(r.created_at) + '</td><td><span class="pill sm p-gray">' + RQ_KIND[r.kind] + '</span></td><td class="ttl" title="' + esc(r.title) + '"><b>' + esc(r.title) + '</b>' + (r.created_at >= wk && r.creator !== "나" ? '<span class="new">NEW</span>' : '') + '</td>'
          + '<td><span class="mdot" style="background:' + m.c + '"></span>' + m.l + '</td><td>' + esc(r.ctype) + '</td><td class="c tnum">' + r.sets.length + '</td><td class="ell" title="' + esc(r.target) + '">' + esc(r.target) + '</td><td>' + av(r.owner, 20) + ' ' + esc(r.owner) + '</td>'
          + '<td><button class="pill sm ' + st[2] + '" data-rq-st="' + r.id + '" title="눌러서 다음 상태로">' + st[1] + '</button></td><td class="c tnum">📎 ' + nm + '</td><td class="c tnum">💬 ' + r.comments.length + '</td><td>' + esc(r.creator) + '</td>'
          + '<td class="r"><span class="hov"><button class="ib" data-rq-edit="' + r.id + '" title="수정">✎</button><button class="ib" data-rq-dup="' + r.id + '" title="복사">' + ic("copy") + '</button><button class="ib" data-rq-del="' + r.id + '" title="삭제">🗑</button></span></td></tr>';
      }).join("") : '<tr><td colspan="13"><div class="empty"><b>조건에 맞는 요청이 없어요</b><p>상태 배지를 눌러 필터를 켜 보세요.</p></div></td></tr>') + '</tbody></table></div></div>';
  }

  function fbPreview(r, s) {
    var m = s.media ? '<div class="fb-img" style="background:' + grad(r.id + s.id) + '"><span>' + esc(s.title) + '</span></div>' : '<div class="fb-img empty-img">' + ic("image") + '</div>';
    return '<div class="fb"><div class="fb-h"><span class="fb-av">N</span><div><b>' + NW.BRAND + '</b><small>광고 · 🌐</small></div></div><div class="fb-t" data-pv="body">' + esc(s.body) + '</div>' + m
      + '<div class="fb-c"><div><small>NESTWELL.EXAMPLE</small><b data-pv="title">' + esc(s.title) + '</b><span data-pv="desc">' + esc(s.desc) + '</span></div><button type="button">더 알아보기</button></div>'
      + '<div class="fb-a"><span>♡ 좋아요</span><span>💬 댓글</span><span>➤ 공유</span><span style="margin-left:auto">🔖</span></div></div>';
  }
  var rqSet = {};
  function openReq(id) {
    var r = rqById(id); if (!r) return;
    var si = Math.min(rqSet[id] || 0, r.sets.length - 1), s = r.sets[si], m = MEDIA[r.medium], st = RQ_ST.filter(function (x) { return x[0] === r.status; })[0];
    var info = '<div class="kvg"><span>구분</span><b>' + RQ_KIND[r.kind] + '</b><span>매체</span><b><span class="mdot" style="background:' + m.c + '"></span>' + m.l + ' · ' + esc(r.ctype) + '</b><span>타겟</span><b>' + esc(r.target) + '</b><span>담당</span><b>' + av(r.owner, 18) + ' ' + esc(r.owner) + '</b><span>요청자</span><b>' + esc(r.creator) + '</b><span>생성일</span><b class="tnum">' + r.created_at + '</b><span>상태</span><b><button class="pill sm ' + st[2] + '" data-rq-st="' + r.id + '" data-in-dw>' + st[1] + '</button></b></div>';
    var setP = '<div class="setbar">' + r.sets.map(function (x, i) { return '<button class="chip2' + (i === si ? ' on' : '') + '" data-rq-set="' + i + '" data-id="' + r.id + '">' + esc(x.name) + '</button>'; }).join("") + '<button class="chip2 add" data-rq-addset="' + r.id + '">＋ 세트</button></div>'
      + '<div class="setp"><div class="lbl2">미디어 <small>' + s.media + '개</small><span class="sp"></span><button class="lnk" data-rq-media="' + r.id + '">＋ 업로드</button>' + (s.media ? '<button class="lnk" data-rq-dl>선택 다운로드</button>' : '') + '</div>'
      + (s.media ? '<div class="thumbs">' + Array.apply(null, Array(s.media)).map(function (_, k) { return '<label class="th" style="background:' + grad(r.id + s.id + k) + '"><input type="checkbox"><span>' + (k % 2 ? "1080×1920" : "1080×1080") + '</span></label>'; }).join("") + '</div>' : '<div class="dz">파일을 끌어다 놓거나 ＋ 업로드 (데모: 가상 썸네일이 추가돼요)</div>')
      + fld("기본 문구 <small>" + (s.body || "").length + "/125</small>", '<textarea class="inp" rows="3" data-rq-f2="body">' + esc(s.body) + '</textarea>')
      + fld("제목 <small>" + (s.title || "").length + "/40</small>", '<input class="inp" data-rq-f2="title" value="' + esc(s.title) + '">')
      + fld("설명", '<input class="inp" data-rq-f2="desc" value="' + esc(s.desc) + '">')
      + fld("기획 메모", '<textarea class="inp" rows="2" data-rq-f2="memo" placeholder="촬영 컷 순서, 톤 등">' + esc(s.memo) + '</textarea>')
      + (r.medium === "meta" ? '<div class="lbl2">FB · IG 노출 미리보기</div>' + fbPreview(r, s) : '') + '</div>';
    var cm = '<div class="lbl2">코멘트 <small>' + r.comments.length + '</small></div><div class="cmts">' + (r.comments.length ? r.comments.map(function (c) { return '<div class="cmt">' + av(c.by, 24) + '<div><b>' + esc(c.by) + '</b> <small>' + md(c.at) + '</small><p>' + esc(c.text).replace(/@(\S+)/g, '<em>@$1</em>') + '</p></div></div>'; }).join("") : '<p class="faint">아직 코멘트가 없어요.</p>') + '</div>'
      + '<div class="cm-in"><input class="inp" placeholder="코멘트 · @이름 으로 멘션 (Enter)" data-rq-cm="' + r.id + '"><button class="btn" data-rq-cmb="' + r.id + '">등록</button></div>';
    drawer(esc(r.title), info + '<div class="lbl2">요청 내용</div><div class="note">' + esc(r.content).replace(/\n/g, "<br>") + '</div>' + guideBox(r.medium) + '<div class="lbl2">세트</div>' + setP + cm, '<button class="btn" data-close>닫기</button>', 520).setAttribute("data-rq-open", r.id);
  }
  function newReq(d) {
    d = d || { kind: "ad", title: "", medium: "meta", ctype: "트래픽", target: "", content: "", owner: "픽셀", creator: "나" };
    var body = fld("요청 구분", NW.segHtml([["ad", "광고"], ["text", "텍스트"], ["etc", "기타"]], d.kind, "data-nr-kind", true))
      + fld("제목", '<input class="inp" data-nr="title" value="' + esc(d.title) + '" placeholder="예) 가을 이사철 단기임대 프로모션">')
      + '<div class="fld"><span>매체</span><div class="mchips">' + MKEYS.map(function (k) { return mchip(k, k === d.medium, "data-nr-med"); }).join("") + '</div></div>'
      + '<div class="fld"><span>캠페인 유형</span><div class="mchips">' + MEDIA[d.medium].t.map(function (t) { return '<button type="button" class="chip2' + (t === d.ctype ? ' on' : '') + '" data-nr-ct="' + esc(t) + '">' + esc(t) + '</button>'; }).join("") + '</div></div>'
      + guideBox(d.medium)
      + fld("타겟", '<input class="inp" data-nr="target" value="' + esc(d.target) + '" placeholder="예) 20~34 · 대학가 반경 3km">')
      + fld("요청 내용", '<textarea class="inp" rows="4" data-nr="content" placeholder="메인 메시지, 레퍼런스, 마감 등">' + esc(d.content) + '</textarea>')
      + '<div class="g2x">' + fld("담당", '<select class="inp" data-nr="owner">' + AGN.map(function (n) { return '<option' + (n === d.owner ? ' selected' : '') + '>' + n + '</option>'; }).join("") + '</select>') + fld("요청자", '<input class="inp" data-nr="creator" value="' + esc(d.creator) + '">') + '</div>';
    drawer("요청 생성", body, '<button class="btn" data-close>취소</button><button class="btn btn-p" data-nr-save>요청 만들기</button>', 500);
    NW._nr = d;
  }
  function readNr() { var d = NW._nr; NW.$$("[data-nr]").forEach(function (el) { d[el.getAttribute("data-nr")] = el.value; }); return d; }

  document.addEventListener("click", function (e) {
    var b, t = e.target;
    if ((b = t.closest("[data-rq-st]"))) { e.stopPropagation(); var r = rqById(b.getAttribute("data-rq-st")), k = RQ_ST.map(function (x) { return x[0]; }); r.status = k[(k.indexOf(r.status) + 1) % 3]; saveBoard(); if (b.hasAttribute("data-in-dw")) openReq(r.id); NW.rerender(true); return; }
    if ((b = t.closest("[data-rq-f]"))) { var s = b.getAttribute("data-rq-f"); BF.st[s] = !BF.st[s]; store.set("board-f", BF); NW.rerender(true); return; }
    if ((b = t.closest("[data-rq-kind]"))) { BF.kind = b.getAttribute("data-rq-kind"); store.set("board-f", BF); NW.rerender(true); return; }
    if ((b = t.closest("[data-rq-del]"))) { e.stopPropagation(); if (!confirm("이 요청을 삭제할까요?")) return; BOARD = BOARD.filter(function (x) { return x.id !== b.getAttribute("data-rq-del"); }); saveBoard(); NW.rerender(true); NW.toast("삭제했어요"); return; }
    if ((b = t.closest("[data-rq-dup]"))) { e.stopPropagation(); var o = JSON.parse(JSON.stringify(rqById(b.getAttribute("data-rq-dup")))); o.id = uid(); o.title += " (복사)"; o.created_at = dstr(TODAY); o.creator = "나"; o.status = "requested"; o.comments = []; BOARD.unshift(o); saveBoard(); NW.rerender(true); NW.toast("복사했어요"); return; }
    if ((b = t.closest("[data-rq-edit]"))) { e.stopPropagation(); openReq(b.getAttribute("data-rq-edit")); return; }
    if ((b = t.closest("tr[data-rq]"))) { openReq(b.getAttribute("data-rq")); return; }
    if ((b = t.closest("[data-rq-set]"))) { rqSet[b.getAttribute("data-id")] = +b.getAttribute("data-rq-set"); openReq(b.getAttribute("data-id")); return; }
    if ((b = t.closest("[data-rq-addset]"))) { var r2 = rqById(b.getAttribute("data-rq-addset")); r2.sets.push({ id: uid(), name: "세트 " + (r2.sets.length + 1), media: 0, body: "", title: "", desc: "", memo: "" }); rqSet[r2.id] = r2.sets.length - 1; saveBoard(); openReq(r2.id); NW.rerender(true); return; }
    if ((b = t.closest("[data-rq-media]"))) { var r3 = rqById(b.getAttribute("data-rq-media")); r3.sets[rqSet[r3.id] || 0].media++; saveBoard(); openReq(r3.id); NW.rerender(true); return; }
    if ((b = t.closest("[data-rq-dl]"))) { var n = NW.$$(".thumbs input:checked").length; NW.toast(n ? n + "개 파일 다운로드 (데모)" : "먼저 썸네일을 선택해 주세요"); return; }
    if ((b = t.closest("[data-rq-cmb]"))) { addCm(b.getAttribute("data-rq-cmb")); return; }
    if ((b = t.closest("[data-rq-new]"))) { newReq(); return; }
    if ((b = t.closest("[data-nr-kind]"))) { readNr().kind = b.getAttribute("data-nr-kind"); newReq(NW._nr); return; }
    if ((b = t.closest("[data-nr-med]"))) { var d = readNr(); d.medium = b.getAttribute("data-nr-med"); d.ctype = MEDIA[d.medium].t[0]; newReq(d); return; }
    if ((b = t.closest("[data-nr-ct]"))) { readNr().ctype = b.getAttribute("data-nr-ct"); newReq(NW._nr); return; }
    if ((b = t.closest("[data-nr-save]"))) {
      var d2 = readNr(); if (!d2.title.trim()) { NW.$('[data-nr="title"]').focus(); NW.toast("제목을 적어 주세요"); return; }
      BOARD.unshift({ id: uid(), kind: d2.kind, title: d2.title.trim(), medium: d2.medium, ctype: d2.ctype, target: d2.target || "—", owner: d2.owner, status: "requested", created_at: dstr(TODAY), creator: d2.creator || "나", content: d2.content || "", sets: [{ id: uid(), name: "세트 1", media: 0, body: "", title: "", desc: "", memo: "" }], comments: [] });
      saveBoard(); NW.closeLayer(); NW.rerender(true); NW.toast("요청을 만들었어요"); return;
    }
  });
  function addCm(id) { var inp = NW.$('[data-rq-cm="' + id + '"]'); if (!inp || !inp.value.trim()) return; rqById(id).comments.push({ by: "나", at: dstr(TODAY), text: inp.value.trim() }); saveBoard(); openReq(id); NW.rerender(true); var n = NW.$('[data-rq-cm="' + id + '"]'); if (n) n.focus(); }
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.dataset && e.target.dataset.rqCm && !e.isComposing) { e.preventDefault(); addCm(e.target.dataset.rqCm); } });
  document.addEventListener("input", function (e) {
    var t = e.target, f = t.dataset && t.dataset.rqF2; if (!f) return;
    var dw = t.closest("[data-rq-open]"), r = rqById(dw.getAttribute("data-rq-open")), s = r.sets[rqSet[r.id] || 0];
    s[f] = t.value; saveBoard();
    var pv = dw.querySelector('[data-pv="' + f + '"]'); if (pv) pv.textContent = t.value;
    var sm = t.parentNode.querySelector("small"); if (sm && (f === "body" || f === "title")) sm.textContent = t.value.length + "/" + (f === "body" ? 125 : 40);
  });

  /* ── 2. UTM 생성기 ────────────────────────────────── */
  var PRESET = [["Meta 피드", "meta", "paid_social", "feed"], ["Meta 스토리", "meta", "paid_social", "story"], ["Google 검색", "google", "cpc", ""], ["Naver 파워링크", "naver", "cpc", "powerlink"], ["카카오 비즈보드", "kakao", "display", "bizboard"], ["뉴스레터", "newsletter", "email", ""], ["인스타 프로필", "instagram", "social", "bio"]];
  var UTM = store.get("utm-cur", { url: "https://nestwell.example/stay", source: "meta", medium: "paid_social", campaign: "fall_move_2026", content: "feed", term: "" });
  function utmUrl(u) { var q = ["source", "medium", "campaign", "content", "term"].filter(function (k) { return u[k]; }).map(function (k) { return "utm_" + k + "=" + encodeURIComponent(u[k].trim().replace(/\s+/g, "_")); }).join("&"); return (u.url || "") + (q ? ((u.url || "").indexOf("?") > -1 ? "&" : "?") + q : ""); }
  var UTMH = store.get("utm-hist", null) || (function () { var h = []; for (var i = 0; i < 12; i++) { var p = PRESET[i % PRESET.length]; h.push({ id: uid(), at: dstr(addD(TODAY, -i * 3 - ri(0, 2))), by: pick(["퍼포", "하루", "케어", "나"]), url: "https://nestwell.example/" + pick(["stay", "event/fall", "host/join", "rooms"]), source: p[1], medium: p[2], campaign: pick(["fall_move_2026", "semester_start", "host_recruit", "longstay_promo", "retarget_30d"]), content: p[3], term: "" }); } return h; })();
  function utm() {
    var inp = function (k, l, ph) { return fld(l, '<input class="inp mono" data-utm="' + k + '" value="' + esc(UTM[k]) + '" placeholder="' + ph + '">'); };
    return '<div style="max-width:1440px;margin:0 auto">' + NW.hero("utm", "마케팅 · 트래킹", "UTM 생성기", "링크에 붙일 UTM 을 규칙대로 만들고, 만든 링크는 히스토리에 남겨요.")
      + '<div class="utm-g"><div class="card" style="padding:18px;display:flex;flex-direction:column;gap:14px"><div class="lbl2" style="margin:0">프리셋</div><div class="mchips">' + PRESET.map(function (p, i) { return '<button class="chip2" data-utm-p="' + i + '">' + p[0] + '</button>'; }).join("") + '</div>'
      + inp("url", "랜딩 URL", "https://") + '<div class="g2x">' + inp("source", "utm_source", "meta") + inp("medium", "utm_medium", "paid_social") + '</div>' + inp("campaign", "utm_campaign", "fall_move_2026") + '<div class="g2x">' + inp("content", "utm_content", "feed") + inp("term", "utm_term", "(선택)") + '</div></div>'
      + '<div class="card" style="padding:18px;display:flex;flex-direction:column;gap:12px"><div class="lbl2" style="margin:0">결과 URL</div><div class="utm-out mono" id="utmOut">' + esc(utmUrl(UTM)) + '</div><div style="display:flex;gap:8px"><button class="btn btn-p" data-utm-copy>' + ic("copy") + '복사</button><button class="btn" data-utm-save>히스토리에 저장</button></div>'
      + '<div class="rules"><b>규칙</b><div>· 소문자 · 공백은 _ 로 자동 변환</div><div>· campaign 은 <span class="mono">주제_시기</span> 형태</div><div>· 같은 캠페인의 소재 구분은 content 로</div></div></div></div>'
      + '<div class="sec-h" style="margin-top:28px"><h2>히스토리</h2><span class="hint">' + UTMH.length + '건</span></div><div class="card tw"><table class="t"><thead><tr><th>생성일</th><th>만든 사람</th><th>source</th><th>medium</th><th>campaign</th><th>content</th><th>URL</th></tr></thead><tbody>'
      + UTMH.map(function (h) { return '<tr class="clk" data-utm-h="' + h.id + '"><td class="tnum">' + md(h.at) + '</td><td>' + esc(h.by) + '</td><td class="mono">' + esc(h.source) + '</td><td class="mono">' + esc(h.medium) + '</td><td class="mono">' + esc(h.campaign) + '</td><td class="mono">' + esc(h.content || "—") + '</td><td class="mono ell" style="max-width:360px" title="' + esc(utmUrl(h)) + '">' + esc(utmUrl(h)) + '</td></tr>'; }).join("") + '</tbody></table></div></div>';
  }
  document.addEventListener("input", function (e) { var k = e.target.dataset && e.target.dataset.utm; if (!k) return; UTM[k] = e.target.value; store.set("utm-cur", UTM); var o = document.getElementById("utmOut"); if (o) o.textContent = utmUrl(UTM); });
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-utm-p]"))) { var p = PRESET[+b.getAttribute("data-utm-p")]; UTM.source = p[1]; UTM.medium = p[2]; UTM.content = p[3]; store.set("utm-cur", UTM); NW.rerender(true); return; }
    if (e.target.closest("[data-utm-copy]")) { copy(utmUrl(UTM)); return; }
    if (e.target.closest("[data-utm-save]")) { if (!UTM.url || !UTM.source || !UTM.campaign) { NW.toast("URL · source · campaign 은 꼭 채워 주세요"); return; } var h = JSON.parse(JSON.stringify(UTM)); h.id = uid(); h.at = dstr(TODAY); h.by = "나"; UTMH.unshift(h); store.set("utm-hist", UTMH); NW.rerender(true); NW.toast("히스토리에 저장했어요"); return; }
    if ((b = e.target.closest("[data-utm-h]"))) {
      var x = UTMH.filter(function (h) { return h.id === b.getAttribute("data-utm-h"); })[0];
      var kv = [["생성일", x.at], ["만든 사람", x.by], ["랜딩 URL", x.url], ["utm_source", x.source], ["utm_medium", x.medium], ["utm_campaign", x.campaign], ["utm_content", x.content || "—"], ["utm_term", x.term || "—"]];
      drawer("UTM 상세", '<div class="kv2">' + kv.map(function (r) { return '<span>' + r[0] + '</span><b class="mono">' + esc(r[1]) + '</b>'; }).join("") + '</div><div class="lbl2">전체 URL</div><div class="utm-out mono">' + esc(utmUrl(x)) + '</div>', '<button class="btn" data-utm-load="' + x.id + '">이 값으로 새로 만들기</button><button class="btn btn-p" data-utm-cp="' + x.id + '">' + ic("copy") + '복사</button>', 520);
      return;
    }
    if ((b = e.target.closest("[data-utm-cp]"))) { copy(utmUrl(UTMH.filter(function (h) { return h.id === b.getAttribute("data-utm-cp"); })[0])); return; }
    if ((b = e.target.closest("[data-utm-load]"))) { var y = UTMH.filter(function (h) { return h.id === b.getAttribute("data-utm-load"); })[0];["url", "source", "medium", "campaign", "content", "term"].forEach(function (k) { UTM[k] = y[k] || ""; }); store.set("utm-cur", UTM); NW.closeLayer(); NW.rerender(true); scrollTo(0, 0); return; }
  });

  /* ── 3. 경쟁사 광고 모니터링 ───────────────────────── */
  var BRANDS = ["가나 스테이", "다온 리빙", "라온 하우스", "마루 룸즈", "바람 레지던스"];
  var APPEAL = [["가격", "첫 달 할인 · 보증금 0원"], ["편의", "풀옵션 · 캐리어만"], ["위치", "역세권 · 학교 앞"], ["신뢰", "후기 · 인증 매물"], ["유연성", "1주 단위 계약"], ["감성", "인테리어 · 라이프스타일"]];
  var TONES = ["친근한", "정보형", "긴급형(한정)", "감성형", "후기형"], CTAS = ["지금 예약하기", "더 알아보기", "쿠폰 받기", "앱 설치", "문의하기"];
  var COMP = (function () { var o = []; for (var i = 0; i < 30; i++) { var a = pick(APPEAL), a2 = pick(APPEAL); o.push({ id: "ad" + i, brand: pick(BRANDS), plat: pick(["fb", "ig", "both", "both"]), target: pick(["guest", "guest", "host"]), date: dstr(addD(TODAY, -ri(0, 60))), text: a[1] + " — " + pick(["이번 주만 특가", "지금 확인해 보세요", "신규 지점 오픈 기념", "학기 시작 전에 미리", "호스트님, 공실 걱정 끝"]) + ". " + pick(["가구·가전 모두 포함, 계약은 앱에서 3분.", "보증금 부담 없이 원하는 기간만.", "실제 투숙 후기 4.8점.", "첫 계약 시 청소비 무료."]), tags: a[0] === a2[0] ? [a[0]] : [a[0], a2[0]], tone: pick(TONES), cta: pick(CTAS), runDays: ri(3, 60), fmt: pick(["이미지", "캐러셀", "릴스"]) }); } return o.sort(function (a, b) { return a.date < b.date ? 1 : -1; }); })();
  var CF = store.get("comp-f", { target: "all", plat: "all", brand: "all" });
  function competitor() {
    var list = COMP.filter(function (a) { return (CF.target === "all" || a.target === CF.target) && (CF.plat === "all" || a.plat === CF.plat || (CF.plat !== "both" && a.plat === "both")) && (CF.brand === "all" || a.brand === CF.brand); });
    var pl = function (p) { return (p !== "ig" ? '<i class="pl fb">f</i>' : '') + (p !== "fb" ? '<i class="pl ig">◎</i>' : ''); };
    return NW.hero("comp", "마케팅 · 리서치", "경쟁사 광고 모니터링", "경쟁 브랜드가 지금 집행 중인 광고를 모아 보고, 소구 포인트·톤·CTA 를 비교해요. (브랜드명은 전부 가상)", NW.refreshBtn())
      + '<div class="fstack"><div><span>타겟</span>' + NW.segHtml([["all", "전체"], ["guest", "게스트"], ["host", "호스트"]], CF.target, "data-cf-target") + '</div><div><span>매체</span>' + NW.segHtml([["all", "전체"], ["fb", "Facebook"], ["ig", "Instagram"], ["both", "둘 다"]], CF.plat, "data-cf-plat") + '</div><div><span>브랜드</span>' + NW.segHtml([["all", "전체"]].concat(BRANDS.map(function (b) { return [b, b]; })), CF.brand, "data-cf-brand") + '</div></div>'
      + '<div class="sec-h" style="margin-top:20px"><h2>광고 ' + list.length + '개</h2><span class="hint">최근 60일 · 게시일 순</span></div>'
      + (list.length ? '<div class="gal">' + list.map(function (a) { return '<button class="adc" data-comp="' + a.id + '"><div class="adc-img" style="background:' + grad(a.brand + a.id) + '"><div class="pls">' + pl(a.plat) + '</div>' + ic("image") + '<span class="fmt">' + a.fmt + '</span></div><div class="adc-b"><div class="adc-m"><b>' + esc(a.brand) + '</b><small class="tnum">' + md(a.date) + '</small></div><p>' + esc(a.text) + '</p></div></button>'; }).join("") + '</div>' : '<div class="card empty"><b>조건에 맞는 광고가 없어요</b><p>필터를 넓혀 보세요.</p></div>');
  }
  document.addEventListener("click", function (e) {
    var b;
    ["target", "plat", "brand"].forEach(function (k) { if ((b = e.target.closest("[data-cf-" + k + "]"))) { CF[k] = b.getAttribute("data-cf-" + k); store.set("comp-f", CF); NW.rerender(true); } });
    if ((b = e.target.closest("[data-comp]"))) {
      var a = COMP.filter(function (x) { return x.id === b.getAttribute("data-comp"); })[0];
      drawer("소구 분석", '<div class="adc-img big" style="background:' + grad(a.brand + a.id) + '">' + ic("image") + '<span class="fmt">' + a.fmt + '</span></div>'
        + '<div class="kvg"><span>브랜드</span><b>' + esc(a.brand) + '</b><span>게시일</span><b class="tnum">' + a.date + ' · ' + a.runDays + '일째 집행</b><span>매체</span><b>' + (a.plat === "both" ? "Facebook · Instagram" : a.plat === "fb" ? "Facebook" : "Instagram") + '</b><span>타겟</span><b>' + (a.target === "host" ? "호스트" : "게스트") + '</b></div>'
        + '<div class="lbl2">본문</div><div class="note">' + esc(a.text) + '</div>'
        + '<div class="lbl2">소구 태그</div><div class="mchips">' + a.tags.map(function (t) { return '<span class="pill p-vio">#' + t + '</span>'; }).join("") + '</div>'
        + '<div class="g2x"><div class="card2 mini"><small>톤</small><b>' + a.tone + '</b></div><div class="card2 mini"><small>CTA</small><b>' + a.cta + '</b></div></div>'
        + '<div class="lbl2">우리 쪽 시사점 <small>에이전트 스트래 · 자동 요약(가상)</small></div><div class="note">' + (a.tags[0] === "가격" ? "가격 소구가 반복돼요 — 우리는 ‘보증금 부담’ 대신 ‘유연한 기간’으로 차별화." : a.tags[0] === "신뢰" ? "후기 소구가 늘고 있어요 — 직영점 실후기 카드뉴스 요청을 추천해요." : "같은 소구가 " + a.runDays + "일째 집행 중 — 성과가 나는 소재일 가능성이 높아요. A/B 레퍼런스로 저장해 두세요.") + '</div>',
        '<button class="btn" data-close>닫기</button><button class="btn btn-p" data-close data-toast="요청 보드에 레퍼런스로 담았어요 (데모)">레퍼런스로 담기</button>', 480);
    }
  });

  /* ── 4. 회의 캘린더 ─────────────────────────────────── */
  var KIND = { meeting: ["회의", "#3b82f6", "p-blue"], task: ["할일", "#10b981", "p-em"], external: ["미팅", "#8b5cf6", "p-vio"] };
  var CAL = store.get("cal-ev", null) || (function () {
    var o = [], T = ["주간 퍼포먼스 리뷰", "콘텐츠 캘린더 싱크", "소재 검수", "월간 리포트 작성", "파트너 제안 미팅", "UTM 규칙 정리", "신규 지점 오픈 준비", "뉴스레터 발송", "대학 제휴 미팅", "KPI 점검", "랜딩 A/B 결과 공유", "블로그 발행", "광고 예산 재배분", "호스트 인터뷰"];
    for (var i = 0; i < 84; i++) { var k = i % 3 === 0 ? "task" : i % 4 === 1 ? "external" : "meeting", d = addD(TODAY, ri(-30, 38)); var multi = k === "task" && chance(.18); o.push({ id: uid(), kind: k, title: pick(T), date: dstr(d), end: multi ? dstr(addD(d, ri(1, 3))) : "", time: k === "task" ? "" : pick(["09:30", "10:00", "11:00", "14:00", "15:30", "16:00"]), who: pick(AGN), done: d < TODAY && chance(.75), memo: "" }); }
    return o;
  })();
  var saveCal = function () { store.set("cal-ev", CAL); };
  var CS = store.get("cal-s", { off: {}, who: "all" }); var CM = null;
  function evOn(ev, ds) { return ev.date === ds || (ev.end && ev.date <= ds && ev.end >= ds); }
  function evVisible(ev) { return !CS.off[ev.kind] && (CS.who === "all" || ev.who === CS.who); }
  function meetings() {
    if (!CM) CM = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    var first = CM, start = addD(first, -first.getDay()), last = new Date(first.getFullYear(), first.getMonth() + 1, 0), weeks = Math.ceil((first.getDay() + last.getDate()) / 7), td = dstr(TODAY), cells = "";
    for (var i = 0; i < weeks * 7; i++) {
      var d = addD(start, i), ds = dstr(d), out = d.getMonth() !== first.getMonth(), evs = CAL.filter(function (e) { return evOn(e, ds) && evVisible(e); }).sort(function (a, b) { return (a.time || "00") < (b.time || "00") ? -1 : 1; });
      cells += '<div class="cell' + (out ? ' out' : '') + (ds === td ? ' today' : '') + '" data-cal-d="' + ds + '"><div class="cd"><span>' + d.getDate() + '</span></div>' + evs.map(function (e) {
        var K = KIND[e.kind], od = e.kind === "task" && !e.done && (e.end || e.date) < td, cont = e.end && e.date !== ds;
        return '<div class="ev ' + K[2] + (e.done ? ' done' : '') + (e.end ? ' multi' : '') + '" title="' + esc(e.title) + '"><i style="background:' + K[1] + '"></i>' + (cont ? '↳ ' : '<b>' + esc(e.who) + '</b>' + (e.time ? '<span class="tnum">' + e.time + '</span>' : '')) + esc(e.title) + (od ? ' ⚠' : '') + '</div>';
      }).join("") + '</div>';
    }
    return NW.hero("cal", "협업 · 일정", "회의 캘린더", "회의·할일·외부 미팅을 한 달 단위로 봐요. 날짜를 누르면 그날 일정과 빠른 추가가 열려요.")
      + '<div class="calh"><button class="btn ico" data-cal-mv="-1">' + ic("left") + '</button><b class="tnum">' + first.getFullYear() + '년 ' + (first.getMonth() + 1) + '월</b><button class="btn ico" data-cal-mv="1">' + ic("chev") + '</button><button class="btn" data-cal-today>오늘</button><span class="vsep"></span>'
      + Object.keys(KIND).map(function (k) { return '<button class="pill ' + KIND[k][2] + (CS.off[k] ? ' dim' : '') + '" data-cal-k="' + k + '"><i class="dt" style="background:' + KIND[k][1] + '"></i>' + KIND[k][0] + '</button>'; }).join("")
      + '<span class="sp"></span><select class="inp sel" data-cal-who><option value="all">담당 전체</option>' + AGN.map(function (n) { return '<option' + (CS.who === n ? ' selected' : '') + '>' + n + '</option>'; }).join("") + '</select><button class="btn btn-p" data-cal-add>' + ic("plus") + '</button></div>'
      + '<div class="card cal"><div class="cal-w">' + ["일", "월", "화", "수", "목", "금", "토"].map(function (w) { return '<div>' + w + '</div>'; }).join("") + '</div><div class="cal-g">' + cells + '</div></div>';
  }
  function dateDrawer(ds, kind) {
    kind = kind || "meeting";
    var evs = CAL.filter(function (e) { return evOn(e, ds); }), d = NW.parseD(ds);
    var times = ['<option value="">종일</option>']; for (var h = 8; h <= 20; h++) ["00", "30"].forEach(function (m) { var v = ("0" + h).slice(-2) + ":" + m; times.push('<option' + (v === "10:00" && kind !== "task" ? ' selected' : '') + '>' + v + '</option>'); });
    var list = evs.length ? evs.map(function (e) { var K = KIND[e.kind]; return '<div class="dl' + (e.done ? ' done' : '') + '"><input type="checkbox"' + (e.done ? ' checked' : '') + ' data-cal-done="' + e.id + '"><span class="pill sm ' + K[2] + '">' + K[0] + '</span><div class="dl-t"><b>' + esc(e.title) + '</b><small>' + (e.time || "종일") + ' · ' + esc(e.who) + (e.end ? ' · ~' + md(e.end) : '') + (e.memo ? ' · ' + esc(e.memo) : '') + '</small></div><button class="ib" data-cal-del="' + e.id + '" data-ds="' + ds + '" title="삭제">🗑</button></div>'; }).join("") : '<p class="faint">이날 일정이 없어요.</p>';
    drawer((d.getMonth() + 1) + "월 " + d.getDate() + "일 (" + "일월화수목금토"[d.getDay()] + ")", '<div class="dls">' + list + '</div><div class="addbox"><div class="lbl2" style="margin:0">빠른 추가</div><div class="kc">' + Object.keys(KIND).map(function (k) { return '<button class="' + (k === kind ? 'on' : '') + '" data-cal-kc="' + k + '" data-ds="' + ds + '"><i style="background:' + KIND[k][1] + '"></i>' + KIND[k][0] + '</button>'; }).join("") + '</div>'
      + '<input class="inp" id="calT" placeholder="제목 (Enter 로 추가)"><div class="g2x"><select class="inp" id="calTm">' + times.join("") + '</select><select class="inp" id="calW">' + AGN.map(function (n) { return '<option>' + n + '</option>'; }).join("") + '</select></div><input class="inp" id="calM" placeholder="메모 (선택)"><button class="btn btn-p" data-cal-save="' + ds + '" data-kind="' + kind + '" style="align-self:flex-end">추가</button></div>', null, 480).querySelector("aside").classList.add("gray");
  }
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-cal-mv]"))) { CM = new Date(CM.getFullYear(), CM.getMonth() + +b.getAttribute("data-cal-mv"), 1); NW.rerender(true); return; }
    if (e.target.closest("[data-cal-today]")) { CM = null; NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cal-k]"))) { var k = b.getAttribute("data-cal-k"); CS.off[k] = !CS.off[k]; store.set("cal-s", CS); NW.rerender(true); return; }
    if (e.target.closest("[data-cal-add]")) { dateDrawer(dstr(TODAY)); return; }
    if ((b = e.target.closest("[data-cal-d]"))) { dateDrawer(b.getAttribute("data-cal-d")); return; }
    if ((b = e.target.closest("[data-cal-kc]"))) { dateDrawer(b.getAttribute("data-ds"), b.getAttribute("data-cal-kc")); return; }
    if ((b = e.target.closest("[data-cal-done]"))) { var ev = CAL.filter(function (x) { return x.id === b.getAttribute("data-cal-done"); })[0]; ev.done = b.checked; saveCal(); b.closest(".dl").classList.toggle("done", ev.done); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cal-del]"))) { CAL = CAL.filter(function (x) { return x.id !== b.getAttribute("data-cal-del"); }); saveCal(); dateDrawer(b.getAttribute("data-ds")); NW.rerender(true); return; }
    if ((b = e.target.closest("[data-cal-save]"))) { calSave(b.getAttribute("data-cal-save"), b.getAttribute("data-kind")); return; }
  });
  function calSave(ds, kind) { var t = document.getElementById("calT"); if (!t.value.trim()) { t.focus(); return; } CAL.push({ id: uid(), kind: kind, title: t.value.trim(), date: ds, end: "", time: document.getElementById("calTm").value, who: document.getElementById("calW").value, done: false, memo: document.getElementById("calM").value.trim() }); saveCal(); dateDrawer(ds, kind); NW.rerender(true); NW.toast("일정을 추가했어요"); var n = document.getElementById("calT"); if (n) n.focus(); }
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.id === "calT" && !e.isComposing) { var b = NW.$("[data-cal-save]"); calSave(b.getAttribute("data-cal-save"), b.getAttribute("data-kind")); } });
  document.addEventListener("change", function (e) { if (e.target.matches("[data-cal-who]")) { CS.who = e.target.value; store.set("cal-s", CS); NW.rerender(true); } });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-toast]"); if (b) NW.toast(b.getAttribute("data-toast")); });

  NW.PAGES["ad-requests"] = { render: adRequests };
  NW.PAGES["utm"] = { render: utm };
  NW.PAGES["competitor-ads"] = { render: competitor };
  NW.PAGES["meetings"] = { render: meetings };
})(window.NW);
