/* =========================================================================
   templates.js — 공용 렌더 엔진
   조립본(doc) 하나를 받아 템플릿별 완성 HTML 문서(문자열)를 반환.
   studio 미리보기 / view.html 공개뷰 / 정적 내보내기가 모두 이걸 사용.
   ========================================================================= */
(function (root) {
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const has = a => Array.isArray(a) && a.length > 0;
  const FONT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">';

  /* ---------- shared bits ---------- */
  const contactInline = p => [
    p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : "",
    p.phone ? `<span>${esc(p.phone)}</span>` : "",
    p.location ? `<span>${esc(p.location)}</span>` : "",
    ...(p.links || []).filter(l => !/pdf/i.test(l.label)).map(l => `<a href="${esc(l.url)}">${esc(l.label)}</a>`)
  ].filter(Boolean);

  /* ====================== 1) 원티드형 (A4) ====================== */
  function renderWanted(d) {
    const p = d.profile || {};
    const css = `
:root{--ink:#18181b;--sub:#52525b;--faint:#8a8a94;--line:#e5e5ea;--accent:#2f6fed;--font:"Inter",ui-sans-serif,system-ui,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}
*{box-sizing:border-box}body{margin:0;background:#f4f5f7;color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
.page{width:210mm;min-height:297mm;margin:24px auto;background:#fff;padding:18mm 16mm 16mm;box-shadow:0 10px 40px -12px rgba(0,0,0,.25)}
.mono{font-variant-numeric:tabular-nums}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding-bottom:16px;border-bottom:2px solid var(--ink)}
.name{font-size:30px;font-weight:800;letter-spacing:-.02em}.name span{color:var(--faint);font-weight:600;font-size:19px;margin-left:6px}
.role{font-size:14px;color:var(--accent);font-weight:600;margin-top:5px}
.contact{font-size:12px;color:var(--sub);text-align:right;line-height:1.9}.contact a{color:var(--sub);text-decoration:none}
.intro{font-size:13px;color:var(--sub);margin:16px 0 4px;line-height:1.7}
.axline{font-size:12.5px;color:#2f2f36;margin-bottom:5px;line-height:1.55}.axline b{color:var(--ink)}
section{margin-top:22px}.slabel{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);padding-bottom:7px;margin-bottom:12px;border-bottom:1px solid var(--line)}
.exp{margin-bottom:16px}.exp:last-child{margin-bottom:0}.exp .r1{display:flex;align-items:baseline;gap:8px}
.exp .co{font-size:15px;font-weight:700}.exp .rl{font-size:12.5px;color:var(--sub)}.exp .dt{margin-left:auto;font-size:12px;color:var(--faint)}
.exp .sm{font-size:12.5px;color:var(--sub);margin:4px 0 2px;font-style:italic}.exp ul{margin:6px 0 0;padding-left:16px}.exp li{font-size:12.5px;color:#2f2f36;margin-bottom:3px;line-height:1.55}
.tags{margin-top:7px;font-size:11px;color:var(--faint)}
.prj{margin-bottom:14px}.prj .r1{display:flex;align-items:baseline;gap:8px}.prj .nm{font-size:14px;font-weight:700}
.prj .kind{font-size:10.5px;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:1px 7px}.prj .dt{margin-left:auto;font-size:11.5px;color:var(--faint)}
.prj .rl{font-size:12px;color:var(--sub);margin-top:3px}.prj .ds{font-size:12.5px;color:#2f2f36;margin:5px 0 5px;line-height:1.55}.prj .kp{font-size:11.5px;color:var(--sub)}.prj .kp b{color:var(--ink)}.prj .st{font-size:11px;color:var(--faint);margin-top:4px}
.skrow{display:flex;gap:10px;font-size:12.5px;margin-bottom:7px}.skrow .g{min-width:120px;font-weight:600}.skrow .v{color:var(--sub)}
.li2{display:flex;justify-content:space-between;font-size:12.5px;padding:5px 0;border-bottom:1px dashed var(--line)}.li2 .r{color:var(--faint)}
@media print{@page{size:A4;margin:14mm}body{background:#fff}.page{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}.exp,.prj,section{break-inside:avoid}}`;
    const body = `
<div class="page">
  <div class="head">
    <div><div class="name">${esc(p.nameKo)}<span>${esc(p.nameEn)}</span></div><div class="role">${esc(p.title)}</div></div>
    <div class="contact">${contactInline(p).map(x => `<div>${x}</div>`).join("")}</div>
  </div>
  ${d.summaryOn !== false && p.summary ? `<div class="intro">${esc(p.summary)}</div>` : ""}
  ${has(d.ax) ? `<section><div class="slabel">AX 경험 · AI 활용</div>${d.ax.map((a, i) => `<div class="axline"><b>${i + 1}. ${esc(a.title)}</b> — ${esc(a.description || a.desc || "")}</div>`).join("")}</section>` : ""}
  ${has(d.experiences) ? `<section><div class="slabel">경력사항 · Experience</div>${d.experiences.map(e => `
    <div class="exp"><div class="r1"><span class="co">${esc(e.company)}</span><span class="rl">${esc(e.role)}</span><span class="dt mono">${esc(e.period)}</span></div>
    ${e.summary ? `<div class="sm">${esc(e.summary)}</div>` : ""}
    ${has(e.bullets) ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    ${has(e.tags) ? `<div class="tags">${e.tags.map(esc).join(" · ")}</div>` : ""}</div>`).join("")}</section>` : ""}
  ${has(d.projects) ? `<section><div class="slabel">프로젝트 · Projects</div>${d.projects.map(pr => `
    <div class="prj"><div class="r1"><span class="nm">${esc(pr.name)}</span>${pr.kind ? `<span class="kind">${esc(pr.kind)}</span>` : ""}<span class="dt mono">${esc(pr.period)}</span></div>
    ${pr.role ? `<div class="rl">${esc(pr.role)}</div>` : ""}<div class="ds">${esc(pr.desc)}</div>
    ${has(pr.kpis) ? `<div class="kp">${pr.kpis.map(k => `<b>${esc(k.n)}</b> ${esc(k.l)}`).join("&nbsp;&nbsp;·&nbsp;&nbsp;")}</div>` : ""}
    ${has(pr.stack) ? `<div class="st">${pr.stack.map(esc).join(" · ")}</div>` : ""}</div>`).join("")}</section>` : ""}
  ${has(d.skills) ? `<section><div class="slabel">스킬 · Skills</div>${d.skills.map(s => `<div class="skrow"><span class="g">${esc(s.group)}</span><span class="v">${(s.items || []).map(esc).join(" · ")}</span></div>`).join("")}</section>` : ""}
  ${has(d.awards) ? `<section><div class="slabel">기타활동 · 수상</div>${d.awards.map(a => `<div class="li2"><span>${esc(a.title)} <span style="color:var(--faint)">· ${esc(a.org)}</span></span><span class="r mono">${esc(a.date)}</span></div>`).join("")}</section>` : ""}
  ${has(d.education) ? `<section><div class="slabel">학력 · Education</div>${d.education.map(e => `<div class="li2"><span>${esc(e.school)} · ${esc(e.degree)}</span><span class="r mono">${esc(e.period)}</span></div>`).join("")}</section>` : ""}
</div>`;
    return doc(`${esc(p.nameKo)} — 원티드형`, css, body);
  }

  /* ====================== 2) 리멤버형 (A4) ====================== */
  function renderRemember(d) {
    const p = d.profile || {};
    const css = `
:root{--ink:#1b1c1f;--sub:#55565b;--faint:#8b8c92;--line:#e8e8ec;--brand:#1f5fdb;--soft:#eef3fd;--font:"Inter",ui-sans-serif,system-ui,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}
*{box-sizing:border-box}body{margin:0;background:#eceef1;color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
.page{width:210mm;min-height:297mm;margin:24px auto;background:#fff;padding:0 0 16mm;box-shadow:0 10px 40px -12px rgba(0,0,0,.25);overflow:hidden}
.mono{font-variant-numeric:tabular-nums}
.hero{background:var(--soft);padding:22mm 16mm 16px;border-bottom:1px solid var(--line)}
.hn{font-size:28px;font-weight:800;letter-spacing:-.02em}.hn span{font-size:16px;color:var(--faint);font-weight:600;margin-left:8px}
.hr{font-size:14px;color:var(--brand);font-weight:600;margin-top:6px}
.pills{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.pill{font-size:11.5px;background:#fff;border:1px solid #d7e2f8;color:var(--brand);border-radius:999px;padding:3px 11px;font-weight:600}
.hc{margin-top:12px;font-size:12px;color:var(--sub);display:flex;flex-wrap:wrap;gap:14px}.hc a{color:var(--sub);text-decoration:none}
.body{padding:20px 16mm 0}
.sec{display:grid;grid-template-columns:130px 1fr;gap:16px;padding:18px 0;border-bottom:1px solid var(--line)}.sec:last-child{border-bottom:none}
.lab{font-size:13px;font-weight:700}.lab small{display:block;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-top:3px}
.about{font-size:13px;color:var(--sub);line-height:1.75}
.exp{margin-bottom:15px}.exp:last-child{margin-bottom:0}.exp .r1{display:flex;align-items:baseline;gap:8px}.exp .co{font-size:14.5px;font-weight:700}.exp .dt{margin-left:auto;font-size:11.5px;color:var(--faint)}.exp .rl{font-size:12px;color:var(--brand);font-weight:600;margin-top:2px}.exp ul{margin:6px 0 0;padding-left:16px}.exp li{font-size:12.5px;color:#2f2f36;margin-bottom:3px;line-height:1.55}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{font-size:11.5px;background:#f3f4f6;border-radius:6px;padding:3px 9px;color:var(--sub)}
.li2{display:flex;justify-content:space-between;font-size:12.5px;padding:5px 0}.li2 .r{color:var(--faint)}.grp{font-size:12px;font-weight:600;margin:10px 0 5px}.grp:first-child{margin-top:0}
@media print{@page{size:A4;margin:0}body{background:#fff}.page{width:auto;min-height:0;margin:0;padding:0 0 12mm;box-shadow:none}.hero{padding:16mm 16mm 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.body{padding:16px 16mm 0}.sec,.exp{break-inside:avoid}}`;
    const body = `
<div class="page">
  <div class="hero">
    <div class="hn">${esc(p.nameKo)}<span>${esc(p.nameEn)}</span></div>
    <div class="hr">${esc(p.title)}</div>
    <div class="pills">${p.totalYears ? `<span class="pill">총 경력 ${esc(p.totalYears)}</span>` : ""}${(d.roleTags || []).slice(0, 5).map(t => `<span class="pill">${esc(t)}</span>`).join("")}</div>
    <div class="hc">${contactInline(p).join("")}</div>
  </div>
  <div class="body">
    ${d.summaryOn !== false && p.summary ? `<div class="sec"><div class="lab">자기소개<small>About</small></div><div class="about">${esc(p.summary)}</div></div>` : ""}
    ${has(d.experiences) ? `<div class="sec"><div class="lab">경력<small>Career</small></div><div>${d.experiences.map(e => `<div class="exp"><div class="r1"><span class="co">${esc(e.company)}</span><span class="dt mono">${esc(e.period)}</span></div><div class="rl">${esc(e.role)}</div>${has(e.bullets) ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div></div>` : ""}
    ${has(d.projects) ? `<div class="sec"><div class="lab">주요 프로젝트<small>Projects</small></div><div>${d.projects.map(pr => `<div class="exp"><div class="r1"><span class="co">${esc(pr.name)}</span><span class="dt mono">${esc(pr.period)}${pr.kind ? " · " + esc(pr.kind) : ""}</span></div>${pr.role ? `<div class="rl">${esc(pr.role)}</div>` : ""}<ul><li>${esc(pr.desc)}</li>${has(pr.kpis) ? `<li>${pr.kpis.map(k => esc(k.n) + " " + esc(k.l)).join(", ")}</li>` : ""}</ul></div>`).join("")}</div></div>` : ""}
    ${has(d.skills) ? `<div class="sec"><div class="lab">스킬<small>Skills</small></div><div>${d.skills.map(s => `<div class="grp">${esc(s.group)}</div><div class="chips">${(s.items || []).map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>`).join("")}</div></div>` : ""}
    ${has(d.education) ? `<div class="sec"><div class="lab">학력<small>Education</small></div><div>${d.education.map(e => `<div class="li2"><span>${esc(e.school)} · ${esc(e.degree)}</span><span class="r mono">${esc(e.period)}</span></div>`).join("")}</div></div>` : ""}
    ${has(d.awards) ? `<div class="sec"><div class="lab">수상<small>Awards</small></div><div>${d.awards.map(a => `<div class="li2"><span>${esc(a.title)} <span style="color:var(--faint)">· ${esc(a.org)}</span></span><span class="r mono">${esc(a.date)}</span></div>`).join("")}</div></div>` : ""}
  </div>
</div>`;
    return doc(`${esc(p.nameKo)} — 리멤버형`, css, body);
  }

  /* ====================== 3) 웹 · 미니멀 원페이지 ====================== */
  function renderWeb(d) {
    const p = d.profile || {};
    const css = `
:root{--bg:oklch(1 0 0);--fg:oklch(0.145 0 0);--mut:oklch(0.556 0 0);--card:oklch(1 0 0);--bd:oklch(0.922 0 0);--acc:oklch(0.205 0 0);--sft:oklch(0.97 0 0);--font:"Inter",ui-sans-serif,system-ui,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}
@media(prefers-color-scheme:dark){:root{--bg:oklch(0.145 0 0);--fg:oklch(0.985 0 0);--mut:oklch(0.708 0 0);--card:oklch(0.205 0 0);--bd:oklch(1 0 0 / 12%);--acc:oklch(0.922 0 0);--sft:oklch(0.269 0 0)}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.65;-webkit-font-smoothing:antialiased;letter-spacing:-.011em}
.wrap{max-width:720px;margin:0 auto;padding:72px 24px 96px}
h1{font-size:clamp(30px,6vw,46px);font-weight:800;letter-spacing:-.03em;margin:0}
.eb{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:10px}
.lead{font-size:17px;color:var(--mut);margin:18px 0 22px}.lead b{color:var(--fg);font-weight:600}
.contact{display:flex;flex-wrap:wrap;gap:14px;font-size:13px}.contact a{color:var(--mut);text-decoration:none;border-bottom:1px solid var(--bd);padding-bottom:1px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:18px;margin:34px 0;padding:24px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd)}
.stats .n{font-size:24px;font-weight:700;letter-spacing:-.03em}.stats .l{font-size:12px;color:var(--mut);margin-top:3px}
h2{font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);margin:44px 0 16px}
.item{padding:16px 0;border-bottom:1px solid var(--bd)}.item .t{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}.item .co{font-size:16px;font-weight:650}.item .rl{font-size:13px;color:var(--mut)}.item .dt{margin-left:auto;font-size:12.5px;color:var(--mut);font-variant-numeric:tabular-nums}
.item ul{margin:8px 0 0;padding-left:18px}.item li{font-size:13.5px;color:var(--mut);margin-bottom:4px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.chip{font-size:11.5px;color:var(--mut);background:var(--sft);border-radius:6px;padding:3px 9px}
.axb{border:1px solid var(--bd);border-radius:12px;padding:18px;margin-bottom:12px}.axb h3{margin:0 0 6px;font-size:15px}.axb p{margin:0;font-size:13.5px;color:var(--mut)}`;
    const body = `
<div class="wrap">
  <div class="eb">${esc(p.tagline || p.title)}</div>
  <h1>${esc(p.nameKo)} · <span style="color:var(--mut)">${esc(p.nameEn)}</span></h1>
  ${d.summaryOn !== false && p.summary ? `<p class="lead">${esc(p.summary)}</p>` : ""}
  <div class="contact">${contactInline(p).join("")}</div>
  ${has(d.highlights) ? `<div class="stats">${d.highlights.map(h => `<div><div class="n">${esc(h.value || h.n)}</div><div class="l">${esc(h.label || h.l)}</div></div>`).join("")}</div>` : ""}
  ${has(d.ax) ? `<h2>AX 하이라이트</h2>${d.ax.map(a => `<div class="axb"><h3>${esc(a.title)}</h3><p>${esc(a.description || a.desc || "")}</p></div>`).join("")}` : ""}
  ${has(d.experiences) ? `<h2>경력</h2>${d.experiences.map(e => `<div class="item"><div class="t"><span class="co">${esc(e.company)}</span><span class="rl">${esc(e.role)}</span><span class="dt">${esc(e.period)}</span></div>${has(e.bullets) ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`).join("")}` : ""}
  ${has(d.projects) ? `<h2>프로젝트</h2>${d.projects.map(pr => `<div class="item"><div class="t"><span class="co">${esc(pr.name)}</span><span class="rl">${esc(pr.kind || "")}</span><span class="dt">${esc(pr.period)}</span></div><ul><li>${esc(pr.desc)}</li></ul>${has(pr.stack) ? `<div class="chips">${pr.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>` : ""}</div>`).join("")}` : ""}
  ${has(d.skills) ? `<h2>스킬</h2>${d.skills.map(s => `<div class="item"><div class="co" style="font-size:14px">${esc(s.group)}</div><div class="chips">${(s.items || []).map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div></div>`).join("")}` : ""}
</div>`;
    return doc(`${esc(p.nameKo)} — 웹 포트폴리오`, css, body);
  }

  /* ====================== 4) 포트폴리오 페이지 (웹) ====================== */
  // 포트폴리오 = 케이스 스터디 스타일 (성과수치 forward). pfStyle로 확장 가능.
  function renderPortfolio(d) { return renderPfCase(d); }
  function renderPfCase(d) {
    const p = d.profile || {};
    const css = `
:root{--blue:#3182F6;--blue-weak:#EAF2FE;--ink:#191F28;--sub:#4E5968;--faint:#8B95A1;--bg:#FFFFFF;--panel:#F9FAFB;--border:#E5E8EB;
  --font:-apple-system,BlinkMacSystemFont,"Pretendard","Apple SD Gothic Neo",system-ui,Roboto,"Segoe UI","Malgun Gothic",sans-serif}
@media(prefers-color-scheme:dark){:root{--blue:#4593FC;--blue-weak:rgba(69,147,252,.16);--ink:#ECEFF3;--sub:#A7AEB8;--faint:#6B7280;--bg:#141619;--panel:#1E2127;--border:rgba(255,255,255,.10)}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased;letter-spacing:-.02em}
.pf{max-width:920px;margin:0 auto;padding:0 22px 90px}
.pfhero{padding:66px 0 20px}
.cover{height:220px;border-radius:22px;background-size:cover;background-position:center;margin-bottom:30px;background-color:var(--panel)}
.pfeyebrow{font-size:13px;font-weight:700;color:var(--blue);margin-bottom:12px;letter-spacing:.01em}
.pfhero h1{font-size:clamp(32px,6vw,52px);font-weight:800;letter-spacing:-.035em;margin:0;text-wrap:balance}
.pfhero .sub{font-size:19px;color:var(--sub);margin:16px 0 0;font-weight:500}
.pfhero .intro{font-size:15px;color:var(--sub);margin:18px 0 0;max-width:660px;white-space:pre-wrap}
.pfcount{margin:34px 0 26px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);border-top:1px solid var(--border);padding-top:22px}
.pfmain{display:flex;flex-direction:column;gap:26px}
.cs{border:1px solid var(--border);border-radius:20px;overflow:hidden;background:var(--panel)}
.cs-banner{height:220px;background-size:cover;background-position:center;background-color:var(--blue-weak);display:grid;place-items:center;color:var(--blue);font-weight:800;font-size:16px}
.cs-body{padding:26px 28px}
.cs-top{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.cs-top .cat{font-size:12px;font-weight:700;color:var(--blue);background:var(--blue-weak);border-radius:7px;padding:4px 10px}
.cs-top .meta{font-size:12.5px;color:var(--faint);font-variant-numeric:tabular-nums}
.cs h3{font-size:23px;font-weight:800;margin:0 0 14px;letter-spacing:-.025em;text-wrap:balance}
.cs-metrics{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px}
.cs-metric{background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:12px 16px;min-width:96px}
.cs-metric .v{font-size:24px;font-weight:800;color:var(--blue);letter-spacing:-.02em;line-height:1.1}
.cs-metric .l{font-size:11.5px;color:var(--sub);margin-top:3px}
.cs .sum{font-size:15px;color:var(--ink);margin:0 0 8px;font-weight:500;white-space:pre-wrap}
.cs .dt{font-size:14px;color:var(--sub);margin:0;white-space:pre-wrap}
.cs-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:16px}
.cs-gallery img{width:100%;height:110px;object-fit:cover;border-radius:10px;border:1px solid var(--border)}
.cs .links{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.cs .links a{font-size:12.5px;font-weight:600;color:var(--blue);text-decoration:none;border:1px solid var(--border);border-radius:9px;padding:7px 13px;background:var(--bg)}
.cs .links a:hover{border-color:var(--blue);background:var(--blue-weak)}
.pffoot{margin-top:44px;padding-top:22px;border-top:1px solid var(--border);font-size:12.5px;color:var(--faint)}
@media(max-width:560px){.cs-banner{height:160px}}`;
    const csCard = w => {
      const imgs = (w.images || []).filter(Boolean);
      const banner = imgs[0] || "";
      const gallery = imgs.slice(1);
      const metrics = (w.metrics || []).filter(m => m.value || m.label).map(m => `<div class="cs-metric"><div class="v">${esc(m.value || "")}</div><div class="l">${esc(m.label || "")}</div></div>`).join("");
      const links = (w.links || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || "링크")} ↗</a>`).join("");
      return `<article class="cs">
        ${banner ? `<div class="cs-banner" style="background-image:url('${esc(banner)}')"></div>` : ""}
        <div class="cs-body">
          <div class="cs-top">${w.category ? `<span class="cat">${esc(w.category)}</span>` : ""}<span class="meta">${esc(w.company || "")}${w.period ? " · " + esc(w.period) : ""}</span></div>
          <h3>${esc(w.title)}</h3>
          ${metrics ? `<div class="cs-metrics">${metrics}</div>` : ""}
          ${w.summary ? `<p class="sum">${esc(w.summary)}</p>` : ""}
          ${w.detail ? `<p class="dt">${esc(w.detail)}</p>` : ""}
          ${gallery.length ? `<div class="cs-gallery">${gallery.map(u => `<img src="${esc(u)}" alt="">`).join("")}</div>` : ""}
          ${links ? `<div class="links">${links}</div>` : ""}
        </div></article>`;
    };
    const works = d.works || [];
    const body = `<div class="pf">
      <header class="pfhero">
        ${d.cover ? `<div class="cover" style="background-image:url('${esc(d.cover)}')"></div>` : ""}
        <div class="pfeyebrow">${esc(p.nameKo || "")}${p.title ? " · " + esc(p.title) : ""}</div>
        <h1>${esc(d.title || "포트폴리오")}</h1>
        ${d.subtitle ? `<p class="sub">${esc(d.subtitle)}</p>` : ""}
        ${d.intro ? `<p class="intro">${esc(d.intro)}</p>` : ""}
      </header>
      ${works.length ? `<div class="pfcount">Case Studies · ${works.length}</div>` : ""}
      <main class="pfmain">${works.map(csCard).join("") || '<p style="color:var(--faint)">담긴 작업이 없습니다.</p>'}</main>
      <footer class="pffoot">© ${esc(p.nameKo || "")}${p.email ? " · " + esc(p.email) : ""}</footer>
    </div>`;
    return doc(`${esc(d.title || "포트폴리오")} — ${esc(p.nameKo || "")}`, css, body);
  }

  /* ---------- doc wrapper ---------- */
  function doc(title, css, body) {
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${FONT}<style>${css}</style></head><body>${body}</body></html>`;
  }

  const TEMPLATES = {
    list: [
      { id: "wanted", name: "원티드형", desc: "경력기술 A4", kind: "resume" },
      { id: "remember", name: "리멤버형", desc: "프로필 A4", kind: "resume" },
      { id: "web", name: "웹 · 미니멀", desc: "원페이지", kind: "web" }
    ],
    render(d) {
      if (!d || !d.profile) return doc("빈 문서", "", "<p style='font-family:sans-serif;padding:40px;color:#888'>내용이 없습니다.</p>");
      if (d.template === "portfolio") return renderPortfolio(d);
      if (d.template === "remember") return renderRemember(d);
      if (d.template === "web") return renderWeb(d);
      return renderWanted(d);
    }
  };
  root.TEMPLATES = TEMPLATES;
})(window);
