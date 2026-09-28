/* 콘텐츠 파이프라인 · 블로그 — 여정 맵 + 01~09 단계 (한 흐름으로 이어지는 자동화 데모) — 전부 가상 데이터 */
(function (NW) {
  "use strict";
  var esc = NW.esc, ko = NW.ko, ic = NW.ic, md = NW.md, store = NW.store, ri = NW.ri, pick = NW.pick, dstr = NW.dstr, addD = NW.addD, TODAY = NW.TODAY, av = NW.av, AG = NW.AG;

  /* [번호, 이름, 담당 에이전트, 하는 일, 산출물, 자동 여부] */
  var STEPS = [
    ["01", "키워드 트렌드", "서치", "검색 추이·연관어에서 후보 키워드를 뽑아요", "키워드 후보", "자동"],
    ["02", "아이데이션", "스트래", "후보 키워드를 글 주제로 묶고 우선순위를 매겨요", "주제안", "반자동"],
    ["03", "브리프", "플래니", "타깃·검색 의도·목차·CTA 를 한 장으로", "브리프", "자동"],
    ["04", "제작", "하루", "브리프대로 초안을 쓰고 이미지를 붙여요", "초안", "반자동"],
    ["05", "검수", "서치", "SEO 체크리스트 · 사실 확인 · 톤", "검수 리포트", "자동"],
    ["06", "관리", "플래니", "발행 일정 · 담당 · 버전을 관리해요", "발행 예약", "반자동"],
    ["07", "발행", "하루", "블로그 발행 + 채널별 요약 배포", "발행 기록", "자동"],
    ["08", "성과", "퍼포", "유입·체류·전환을 글 단위로 집계", "성과 리포트", "자동"],
    ["09", "자동화", "케어", "잘 된 글은 CRM·뉴스레터로 재활용", "자동화 룰", "자동"]
  ];
  var SLUG = function (i) { return "blog-0" + (i + 1); };
  var role = function (n) { return (AG.filter(function (a) { return a[0] === n; })[0] || ["", ""])[1]; };
  var T = ["단기임대 계약 전 체크리스트 7가지", "한달살기 비용 현실 정리", "대학가 원룸 vs 단기임대 비교", "외국인 유학생 방 구하기 가이드", "보증금 없는 방 구하는 법", "이사 전 꼭 확인할 관리비 항목", "워케이션 하기 좋은 동네", "첫 자취 준비물 리스트", "출장 한 달, 숙소 고르는 기준", "풀옵션 원룸의 진짜 옵션", "단기임대 후기 읽는 법", "학기 단위 계약 팁"];
  var POSTS = T.map(function (t, i) { var st = Math.min(9, Math.max(1, 9 - Math.floor(i * .8) - ri(0, 1))); return { id: "p" + i, title: t, kw: pick(["단기임대", "한달살기", "원룸 단기", "자취", "유학생 숙소", "보증금 없는 방"]), step: st, due: dstr(addD(TODAY, ri(-3, 21))), views: st >= 8 ? ri(300, 4200) : 0, stay: ri(95, 260), cta: ri(12, 140), conv: ri(1, 18), rank: ri(1, 18) }; });
  var cnt = function (i) { return POSTS.filter(function (p) { return p.step === i + 1; }).length; };

  /* 공통: 단계 스테퍼(9단계를 한 줄로 — 어디서든 앞뒤 단계로 이동) */
  function stepper(cur) {
    return '<div class="stp">' + '<a class="stp-i' + (cur < 0 ? ' on' : '') + '" href="#/blog-journey"><b>MAP</b><span>여정 맵</span></a>' + STEPS.map(function (s, i) {
      return '<a class="stp-i' + (i === cur ? ' on' : i < cur ? ' done' : '') + '" href="#/' + SLUG(i) + '"><b>' + s[0] + '</b><span>' + s[1] + '</span></a>';
    }).join("") + '</div>';
  }
  function flowCard(i) {
    var s = STEPS[i], prev = i ? STEPS[i - 1][4] : "검색 데이터 (가상)", next = i < 8 ? STEPS[i + 1][1] : "01 키워드 트렌드 (다음 사이클)";
    return '<div class="card pflow"><div class="pf"><small>입력</small><b>' + prev + '</b><span>' + (i ? "이전 단계 산출물이 자동으로 넘어와요" : "검색량 · 연관어 · 경쟁 글") + '</span></div><i>→</i>'
      + '<div class="pf ag">' + av(s[2], 34) + '<div><small>담당 에이전트 · ' + s[5] + '</small><b>' + s[2] + ' <em>' + role(s[2]) + '</em></b><span>' + s[3] + '</span></div></div><i>→</i>'
      + '<div class="pf"><small>산출물</small><b>' + s[4] + ' <em class="tnum">' + cnt(i) + '</em></b><span>다음: ' + next + '</span></div></div>';
  }
  function term(id, name) { return '<div class="term"><div class="term-h"><i></i><i></i><i></i><span>' + name + '</span></div><div class="term-b" id="' + id + '"><div class="tln dim">▶ 실행 버튼을 누르면 로그가 여기에 쌓여요</div></div></div>'; }
  function head(i, extra) {
    var s = STEPS[i];
    return NW.hero("blog" + i, "콘텐츠 파이프라인 · 블로그 · " + s[0], s[0] + " " + s[1], s[3] + ". 앞 단계 산출물을 받아 처리하고, 다음 단계로 자동으로 넘겨요.",
      '<button class="btn" data-prun="' + i + '">' + '▶ 이 단계 자동 실행</button>' + (i < 8 ? '<a class="btn btn-p" href="#/' + SLUG(i + 1) + '">다음 단계 ' + STEPS[i + 1][0] + ' →</a>' : '<a class="btn btn-p" href="#/blog-journey">여정 맵으로 →</a>'))
      + stepper(i) + flowCard(i) + (extra || "");
  }

  /* ── 여정 맵 ─────────────────────────────────────── */
  var CYCLE = [
    "키워드 <b>'한달살기 비용'</b> 검색량 <span class=ok>+18%</span> 감지 → 후보 등록",
    "주제안 <b>'한달살기 비용 현실 정리'</b> 우선순위 92점 → <span class=ok>채택</span>",
    "브리프 생성 — H2 6개 · CTA '지점 둘러보기' · 내부 링크 3",
    "초안 <b>2,480자</b> · 이미지 5 · 표 1 작성",
    "SEO 점검 <span class=ok>94점 ✓</span> — 제목 키워드 · H2 구조 · 메타 설명",
    "발행 예약 — 내일 09:00 · 담당 하루",
    "블로그 발행 <span class=ok>✓</span> · 인스타 요약 카드 3장 · 뉴스레터 후보 등록",
    "7일 성과 — 유입 <b>1,284</b> · 체류 3:12 · CTA 클릭 86",
    "규칙 <b>'유입 1,000↑ → 뉴스레터 편성'</b> 실행 <span class=ok>✓</span> · 리라이트 알림 D+30 예약"
  ];
  function journey() {
    var pub = POSTS.filter(function (p) { return p.step >= 7; }).length;
    return NW.hero("pipe", "콘텐츠 파이프라인 · 블로그", "블로그 파이프라인 — 여정 맵", "키워드에서 자동화까지 9단계가 한 흐름으로 이어져요. 단계마다 담당 에이전트가 산출물을 다음 단계로 넘기고, 사람은 채택·검수만 확인해요.",
      '<button class="btn btn-p" data-pcycle>▶ 자동화 한 사이클 실행</button>')
      + stepper(-1)
      + '<div class="kg" style="margin-top:16px">' + NW.kpi("이번 달 발행", pub + "편", "목표 8편") + NW.kpi("진행 중", (POSTS.length - pub) + "편", "01~06 단계") + NW.kpi("평균 리드타임", "9.4일", "키워드 → 발행") + NW.kpi("자동 단계", "6 / 9", "사람 확인: 02 · 04 · 06") + '</div>'
      + '<div class="sec-h" style="margin-top:28px"><span class="code">MAP</span><h2>여정 맵</h2><span class="hint">카드를 누르면 그 단계 화면으로 가요</span></div>'
      + '<div class="jm" id="jmap">' + STEPS.map(function (s, i) {
        var c = cnt(i), state = c ? "진행중" : i < 3 ? "완료" : "대기";
        return '<a class="jstep" data-ji="' + i + '" href="#/' + SLUG(i) + '"><div class="js-n"><span>' + s[0] + '</span>' + (i < 8 ? '<i></i>' : '') + '</div><div class="js-c"><div class="js-h"><b>' + s[1] + '</b><span class="pill sm ' + (state === "진행중" ? "p-sky" : state === "완료" ? "p-em" : "p-gray") + '">' + state + '</span></div>'
          + '<div class="js-ag">' + av(s[2], 26) + '<div><b>' + s[2] + '</b><small>' + role(s[2]) + ' · ' + s[5] + '</small></div></div><p>' + s[3] + '</p><div class="js-o"><span>산출물</span><b>' + s[4] + ' <em class="tnum">' + c + '</em></b></div></div></a>';
      }).join("") + '</div>'
      + '<div class="sec-h" style="margin-top:22px"><span class="code">RUN</span><h2>자동화 실행 로그</h2><span class="hint">글 한 편이 01 → 09 를 지나가는 과정</span></div>' + term("plog", "pipeline — blog.log")
      + '<div class="sec-h" style="margin-top:28px"><span class="code">NOW</span><h2>진행 중인 글</h2><span class="hint">' + POSTS.length + '편 · 행을 누르면 그 단계로</span></div><div class="card tw"><table class="t" style="min-width:860px"><thead><tr><th>제목</th><th>키워드</th><th>단계</th><th>담당</th><th>마감</th><th class="r">조회</th></tr></thead><tbody>'
      + POSTS.slice().sort(function (a, b) { return a.step - b.step; }).map(function (p) { var s = STEPS[p.step - 1]; return '<tr class="clk" data-go="' + SLUG(p.step - 1) + '"><td><b>' + esc(p.title) + '</b></td><td><span class="pill sm p-gray">' + esc(p.kw) + '</span></td><td><div class="prog">' + STEPS.map(function (_, k) { return '<i class="' + (k < p.step - 1 ? 'd' : k === p.step - 1 ? 'c' : '') + '"></i>'; }).join("") + '<span>' + s[0] + ' ' + s[1] + '</span></div></td><td>' + av(s[2], 20) + ' ' + s[2] + '</td><td class="tnum' + (p.due < dstr(TODAY) && p.step < 7 ? ' danger' : '') + '">' + md(p.due) + '</td><td class="r tnum">' + (p.views ? ko(p.views) : "—") + '</td></tr>'; }).join("") + '</tbody></table></div>';
  }
  var runTok = 0;
  function logLine(box, i, html) { var d = document.createElement("div"); d.className = "tln"; d.innerHTML = '<span class="tm">' + new Date().toTimeString().slice(0, 8) + '</span><span class="st">' + STEPS[i][0] + '</span>' + av(STEPS[i][2], 16) + ' <b>' + STEPS[i][2] + '</b> · ' + html; box.appendChild(d); box.scrollTop = box.scrollHeight; }
  function runCycle() {
    var tok = ++runTok, box = document.getElementById("plog"); if (!box) return; box.innerHTML = "";
    NW.$$("#jmap .jstep").forEach(function (x) { x.classList.remove("run", "ok"); });
    var i = 0;
    (function tick() {
      if (tok !== runTok || !document.getElementById("plog")) return;
      var cards = NW.$$("#jmap .jstep"); cards.forEach(function (x, k) { x.classList.toggle("run", k === i); if (k < i) x.classList.add("ok"); });
      logLine(box, i, CYCLE[i]);
      if (++i < STEPS.length) setTimeout(tick, 850);
      else setTimeout(function () { cards.forEach(function (x) { x.classList.remove("run"); x.classList.add("ok"); }); var d = document.createElement("div"); d.className = "tln ok"; d.textContent = "✓ 한 사이클 완료 — 사람 확인 3번(채택·초안·예약)만으로 발행과 재활용까지 끝났어요"; box.appendChild(d); NW.toast("자동화 한 사이클 완료 (데모)"); }, 700);
    })();
  }
  var STEP_LOG = [
    ["검색량 수집 — 후보 키워드 42개", "경쟁 글 상위 10개 수집", "점수 계산 → 상위 12개 후보 등록"],
    ["후보 12개 → 주제 6개로 묶음", "검색 의도 분류(정보형 4 · 비교형 2)", "우선순위 점수 → 상위 3개 채택 요청"],
    ["주제 '한달살기 비용 현실 정리' 브리프 생성", "목차 H2 6개 · CTA 1 · 내부 링크 3", "브리프 → 04 제작으로 전달"],
    ["브리프 불러오기", "초안 2,480자 작성 · 이미지 5장 배치", "초안 → 05 검수로 전달"],
    ["SEO 체크 12항목 실행", "사실 확인 2건 · 톤 수정 1건", "검수 94점 → 06 관리로 전달"],
    ["발행 슬롯 확인 — 내일 09:00 비어 있음", "담당 하루 배정 · 버전 v2 기록", "예약 완료 → 07 발행 대기"],
    ["블로그 발행 ✓", "인스타 요약 카드 3장 생성 · 예약", "뉴스레터 후보 등록 ✓"],
    ["7일 성과 수집 — 유입 · 체류 · 전환", "상위 5편 리포트 생성", "개선 제안 2건 → 09 자동화로"],
    ["규칙 6개 평가", "'유입 1,000↑ → 뉴스레터 편성' 실행 ✓", "'순위 하락 → 리라이트 알림' 1건 예약"]
  ];
  function runStep(i) {
    var tok = ++runTok, box = document.getElementById("slog"); if (!box) return; box.innerHTML = ""; var k = 0;
    (function tick() { if (tok !== runTok || !document.getElementById("slog")) return; logLine(box, i, STEP_LOG[i][k]); if (++k < 3) setTimeout(tick, 700); else { var d = document.createElement("div"); d.className = "tln ok"; d.textContent = "✓ " + STEPS[i][1] + " 완료 — 산출물을 다음 단계로 넘겼어요"; box.appendChild(d); } })();
  }

  /* ── 단계별 화면 ───────────────────────────────────── */
  var S = store.get("pipe", { sent: {}, pick: {}, rules: { r1: 1, r2: 1, r3: 1, r4: 0, r5: 1, r6: 1 } });
  var saveS = function () { store.set("pipe", S); };
  var KWS = ["한달살기 비용", "단기임대 계약", "대학가 원룸", "유학생 숙소", "보증금 없는 방", "풀옵션 원룸", "워케이션 숙소", "출장 숙소 한달", "자취 준비물", "관리비 항목", "단기임대 후기", "학기 단위 계약"].map(function (k) { var r = NW.hashRng(k); return { kw: k, vol: Math.round(r() * 9000 + 800), d4: Math.round((r() - .3) * 40), comp: r() < .35 ? "높음" : r() < .7 ? "중간" : "낮음", score: Math.round(55 + r() * 44) }; }).sort(function (a, b) { return b.score - a.score; });
  var logBox = function () { return '<div style="margin-top:12px">' + term("slog", "pipeline — step.log") + '</div>'; };
  var BODY = [
    function () {
      return '<div class="sec-h" style="margin-top:22px"><span class="code">01</span><h2>키워드 후보</h2><span class="hint">점수 = 검색량 × 증감 × (1 − 경쟁)</span></div><div class="card tw"><table class="t" style="min-width:760px"><thead><tr><th>키워드</th><th class="r">월간 검색</th><th class="r">4주 증감</th><th>경쟁</th><th class="r">점수</th><th></th></tr></thead><tbody>'
        + KWS.map(function (k) { var sent = S.sent[k.kw]; return '<tr><td><b>' + esc(k.kw) + '</b></td><td class="r tnum">' + ko(k.vol) + '</td><td class="r tnum"><span class="dlt ' + (k.d4 >= 0 ? 'up' : 'dn') + '">' + (k.d4 >= 0 ? '▲' : '▼') + Math.abs(k.d4) + '%</span></td><td><span class="pill sm ' + (k.comp === "높음" ? "p-red" : k.comp === "중간" ? "p-amber" : "p-em") + '">' + k.comp + '</span></td><td class="r tnum"><b>' + k.score + '</b></td><td class="r"><button class="btn sm' + (sent ? '' : ' btn-p') + '" data-psend="' + esc(k.kw) + '">' + (sent ? '✓ 02로 보냄' : '주제로 보내기 →') + '</button></td></tr>'; }).join("") + '</tbody></table></div>' + logBox();
    },
    function () {
      var topics = [["한달살기 비용 현실 정리", ["한달살기 비용", "관리비 항목"], "정보형", 92], ["대학가 원룸 vs 단기임대", ["대학가 원룸", "학기 단위 계약"], "비교형", 86], ["보증금 없는 방 구하는 법", ["보증금 없는 방", "단기임대 계약"], "정보형", 81], ["유학생 방 구하기 가이드", ["유학생 숙소"], "정보형", 77], ["워케이션 하기 좋은 동네", ["워케이션 숙소"], "탐색형", 64], ["풀옵션 원룸의 진짜 옵션", ["풀옵션 원룸", "자취 준비물"], "비교형", 58]];
      return '<div class="sec-h" style="margin-top:22px"><span class="code">02</span><h2>주제안</h2><span class="hint">채택하면 03 브리프가 자동으로 만들어져요</span></div><div class="tgrid">' + topics.map(function (t, i) { var on = S.pick[t[0]] != null ? S.pick[t[0]] : i < 3; return '<div class="card topic' + (on ? ' on' : '') + '"><div class="tp-h"><span class="pill sm p-vio">' + t[2] + '</span><b class="tnum">' + t[3] + '점</b></div><h4>' + esc(t[0]) + '</h4><div class="bar"><i style="width:' + t[3] + '%"></i></div><div class="mchips">' + t[1].map(function (k) { return '<span class="tag">' + esc(k) + '</span>'; }).join("") + '</div><button class="btn sm' + (on ? ' btn-p' : '') + '" data-ppick="' + esc(t[0]) + '">' + (on ? '✓ 채택됨' : '채택하기') + '</button></div>'; }).join("") + '</div>' + logBox();
    },
    function () {
      var b = [["타깃", "첫 한 달 살 곳을 찾는 20~30대 · 비용이 제일 궁금한 사람"], ["검색 의도", "정보형 — '실제로 얼마 드는지' 항목별 합계"], ["핵심 메시지", "보증금 없이 1주 단위로 — 숨은 비용까지 계산해 보면 오히려 가볍다"], ["CTA", "지점 둘러보기 (가격 필터 적용된 목록)"], ["내부 링크", "보증금 없는 방 구하는 법 · 관리비 항목 · 단기임대 후기 읽는 법"]];
      var h2 = ["한달살기, 얼마면 될까 — 결론부터", "항목별 비용: 임대료 · 관리비 · 청소비", "보증금이 없으면 달라지는 것", "지역별 평균 (가상 예시)", "숨은 비용 체크리스트", "자주 묻는 질문"];
      return '<div class="g2" style="margin-top:22px"><div class="card bdoc"><div class="doc-h"><span class="pill sm p-sky">브리프 v1</span><b>한달살기 비용 현실 정리</b><small>02 채택 → 자동 생성 · 플래니</small></div>' + b.map(function (x) { return '<div class="doc-r"><span>' + x[0] + '</span><p>' + x[1] + '</p></div>'; }).join("") + '</div><div class="card bdoc"><div class="doc-h"><b>목차 (H2)</b><small>검색 상위 글 구조 참고</small></div><ol class="toc">' + h2.map(function (x) { return '<li>' + x + '</li>'; }).join("") + '</ol></div></div>' + logBox();
    },
    function () {
      return '<div class="draft-g" style="margin-top:22px"><article class="card draft"><small class="faint">초안 v2 · 하루 · 2,480자</small><h2>한달살기, 얼마면 될까 — 결론부터</h2><p>한 달 살 곳을 구할 때 가장 먼저 막히는 건 ‘보증금’이에요. 1주 단위 계약이면 이야기가 달라져요. 임대료·관리비·청소비를 모두 더해도, 첫 달 목돈이 크게 줄어요.</p><div class="dimg" style="background:' + NW.grad("draft1") + '">이미지 1 · 지점 전경</div><h3>항목별 비용: 임대료 · 관리비 · 청소비</h3><p>주간 임대료 × 주 수가 기본이에요. 관리비는 5~10만 원, 청소비는 퇴실 때 한 번만 내요. (수치는 가상 예시)</p><div class="dimg" style="background:' + NW.grad("draft2") + '">표 1 · 항목별 비용 비교</div></article>'
        + '<div style="display:flex;flex-direction:column;gap:10px">' + NW.kpi("글자 수", "2,480자", "목표 2,000자 이상 ✓") + NW.kpi("이미지 · 표", "5 · 1", "브리프 기준 충족") + NW.kpi("키워드 밀도", "1.8%", "권장 1~2.5%") + '<button class="btn" data-toast="AI 초안을 다시 썼어요 (데모)">↻ AI 초안 다시 쓰기</button></div></div>' + logBox();
    },
    function () {
      var chk = [["제목에 핵심 키워드", 1], ["H2 구조 6개", 1], ["메타 설명 80~120자", 1], ["이미지 alt 텍스트", 1], ["내부 링크 3개", 1], ["외부 출처 표기", 0], ["문단 길이 (모바일)", 1], ["금지 표현 없음", 1], ["사실 확인", 1], ["톤 가이드", 1], ["CTA 위치", 1], ["표 캡션", 0]];
      var ok = chk.filter(function (c) { return c[1]; }).length, sc = Math.round(ok / chk.length * 100);
      return '<div class="g2" style="margin-top:22px"><div class="card score"><div class="ring" style="--p:' + sc + '"><b class="tnum">' + sc + '</b><small>SEO 점수</small></div><p>' + ok + ' / ' + chk.length + ' 통과 · 경고 ' + (chk.length - ok) + '건은 수정 제안으로 04 제작에 되돌려요</p></div><div class="card chk2">' + chk.map(function (c) { return '<div><span class="' + (c[1] ? 'ok' : 'wn') + '">' + (c[1] ? '✓' : '!') + '</span>' + c[0] + '</div>'; }).join("") + '</div></div>' + logBox();
    },
    function () {
      var col = function (t, list, tone) { return '<div class="kcol"><div class="kcol-h"><span class="pill sm ' + tone + '">' + t + '</span><em class="tnum">' + list.length + '</em></div>' + list.map(function (p, i) { return '<div class="kcard"><b>' + esc(p.title) + '</b><small>' + av(STEPS[5][2], 16) + ' ' + md(dstr(addD(TODAY, i + 1))) + ' 09:00 · v' + (i % 2 + 1) + '</small></div>'; }).join("") + '</div>'; };
      return '<div class="kan" style="margin-top:22px">' + col("검수 완료", POSTS.slice(0, 3), "p-sky") + col("발행 예약", POSTS.slice(3, 6), "p-amber") + col("발행됨", POSTS.slice(6, 9), "p-em") + '</div>' + logBox();
    },
    function () {
      var ch = [["블로그 본문", "발행됨", "p-em", "09:00"], ["인스타 요약 카드 3장", "예약됨", "p-amber", "12:00"], ["뉴스레터 후보", "등록됨", "p-sky", "—"], ["카카오 채널 소식", "대기", "p-gray", "18:00"]];
      return '<div class="sec-h" style="margin-top:22px"><span class="code">07</span><h2>채널 배포</h2><span class="hint">블로그 한 편 → 채널별 형태로 자동 변환</span></div><div class="card tw"><table class="t"><thead><tr><th>채널</th><th>상태</th><th>시간</th><th>형태</th></tr></thead><tbody>' + ch.map(function (c) { return '<tr><td><b>' + c[0] + '</b></td><td><span class="pill sm ' + c[2] + '">' + c[1] + '</span></td><td class="tnum">' + c[3] + '</td><td class="faint">' + (c[0].indexOf("인스타") > -1 ? "본문 요약 → 카드 3장 자동 생성" : c[0].indexOf("뉴스") > -1 ? "08 성과가 좋으면 09 규칙으로 편성" : "원문") + '</td></tr>'; }).join("") + '</tbody></table></div>' + logBox();
    },
    function () {
      var pub = POSTS.filter(function (p) { return p.step >= 8; }).sort(function (a, b) { return b.views - a.views; });
      var labels = []; for (var w = 7; w >= 0; w--) labels.push(md(dstr(addD(NW.monday(TODAY), -7 * w))));
      var ser = pub.slice(0, 3).map(function (p, i) { var r = NW.hashRng(p.id); return { name: p.title.slice(0, 12) + "…", type: "line", color: ["#3b82f6", "#f97316", "#10b981"][i], values: labels.map(function (_, k) { return Math.round(p.views / 8 * (0.4 + k * .18) * (0.8 + r() * .4)); }) }; });
      return '<div style="margin-top:22px">' + NW.chartCard("주간 유입 · 상위 3편", { labels: labels, h: 220, series: ser }) + '</div><div class="card tw" style="margin-top:12px"><table class="t" style="min-width:760px"><thead><tr><th>글</th><th class="r">유입</th><th class="r">평균 체류</th><th class="r">CTA 클릭</th><th class="r">전환</th><th class="r">검색 순위</th></tr></thead><tbody>' + pub.map(function (p) { return '<tr><td><b>' + esc(p.title) + '</b></td><td class="r tnum">' + ko(p.views) + '</td><td class="r tnum">' + Math.floor(p.stay / 60) + ':' + ("0" + p.stay % 60).slice(-2) + '</td><td class="r tnum">' + p.cta + '</td><td class="r tnum">' + p.conv + '</td><td class="r tnum">' + p.rank + '위</td></tr>'; }).join("") + '</tbody></table></div>' + logBox();
    },
    function () {
      var R = [["r1", "유입 1,000↑ (7일)", "뉴스레터 다음 호에 편성", 4], ["r2", "검색 순위 5계단↓", "리라이트 알림 → 04 제작", 2], ["r3", "CTA 클릭률 3%↑", "같은 주제로 인스타 시리즈 요청", 3], ["r4", "체류 1분↓", "도입부 재작성 제안", 0], ["r5", "전환 5건↑", "광고 소재 후보로 요청 보드에 등록", 1], ["r6", "발행 30일 경과", "최신 정보 점검 할일 생성 → 회의 캘린더", 6]];
      return '<div class="sec-h" style="margin-top:22px"><span class="code">09</span><h2>자동화 규칙</h2><span class="hint">조건이 맞으면 다른 화면(뉴스레터·요청 보드·캘린더)으로 자동 연결</span></div><div class="rules2">' + R.map(function (r) { var on = !!S.rules[r[0]]; return '<div class="card rule' + (on ? '' : ' off') + '"><div class="ru-t"><span class="pill sm p-gray">IF</span><b>' + r[1] + '</b></div><div class="ru-t"><span class="pill sm p-em">THEN</span><span>' + r[2] + '</span></div><div class="ru-f"><small class="faint">최근 30일 실행 ' + r[3] + '회</small><button class="tgl' + (on ? ' on' : '') + '" data-prule="' + r[0] + '" aria-label="켜기/끄기"><i></i></button></div></div>'; }).join("") + '</div>' + logBox();
    }
  ];
  STEPS.forEach(function (_, i) { NW.PAGES[SLUG(i)] = { render: function () { return head(i) + BODY[i](); } }; });
  NW.PAGES["blog-journey"] = { render: journey };

  document.addEventListener("click", function (e) {
    var b;
    if (e.target.closest("[data-pcycle]")) { runCycle(); return; }
    if ((b = e.target.closest("[data-prun]"))) { runStep(+b.getAttribute("data-prun")); return; }
    if ((b = e.target.closest("tr[data-go]"))) { location.hash = "#/" + b.getAttribute("data-go"); return; }
    if ((b = e.target.closest("[data-psend]"))) { var k = b.getAttribute("data-psend"); S.sent[k] = !S.sent[k]; saveS(); NW.rerender(); if (S.sent[k]) NW.toast("‘" + k + "’ → 02 아이데이션으로 넘겼어요"); return; }
    if ((b = e.target.closest("[data-ppick]"))) { var t = b.getAttribute("data-ppick"), cur = b.textContent.indexOf("✓") > -1; S.pick[t] = !cur; saveS(); NW.rerender(); if (!cur) NW.toast("채택 → 03 브리프가 자동으로 만들어져요"); return; }
    if ((b = e.target.closest("[data-prule]"))) { var id = b.getAttribute("data-prule"); S.rules[id] = S.rules[id] ? 0 : 1; saveS(); NW.rerender(); return; }
  });
})(window.NW);
