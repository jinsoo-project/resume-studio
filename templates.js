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
@media(prefers-color-scheme:dark){:root{--blue:#4593FC;--blue-weak:rgba(69,147,252,.16);--ink:#ECEFF3;--sub:#A7AEB8;--faint:#6B7280;--bg:#141619;--panel:#1E2127;--border:#2b303a}}
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

  /* ====================== 5) AX 마케터 포트폴리오 (SPA · DB주도) ====================== */
  // AX Marketer Portfolio.dc 레이아웃을 순수 바닐라로 이식. 데이터는 window.__AX(=DB)로 주입.
  function axData(d) {
    const p = d.profile || {};
    const co2period = co => co.periodText || [co.startDate, co.endDate || "현재"].filter(Boolean).join(" — ");
    const dispName = co => co.useService ? (co.serviceKo || co.serviceEn || co.nameKo || co.nameEn || "") : (co.nameKo || co.nameEn || "");
    const companies = (d.companies || []).map(co => ({
      name: dispName(co), period: co2period(co), role: co.role || "", summary: co.summary || "", logo: co.logo || "",
      metrics: (co.metrics || []).map(m => ({ v: m.v != null ? m.v : m.value, k: m.k != null ? m.k : m.label })),
      projects: (co.works || []).map(w => ({
        num: w.code || "", title: w.title || "", desc: w.detail || w.summary || "",
        problem: w.problem || "", action: w.action || "", result: w.result || "",
        tags: w.tags || [],
        metrics: (w.metrics || []).map(m => ({ v: m.value != null ? m.value : m.v, k: m.label != null ? m.label : m.k })),
        links: (w.links || []).map(l => ({ label: l.label || "", url: l.url || "" })),
        media: (w.media || []).map(m => ({ type: m.type || "image", url: m.url || "", title: m.title || "" }))
      }))
    }));
    const heroStats = (d.highlights || []).slice(0, 3).map(h => ({ v: h.value, k: h.label }));
    return {
      brand: (p.nameKo ? p.nameKo + " " : "") + "AX & 마케팅 포트폴리오",
      navOrder: (p.navOrder && p.navOrder.length) ? p.navOrder : ["home", "cases", "resume", "ax"],
      heroKicker: p.tagline ? "" : "",
      headline: p.heroHeadline || "데이터로 설계하고,",
      rotWords: (p.rotWords && p.rotWords.length) ? p.rotWords : ["AI 자동화", "트래킹 설계", "CRM 시나리오", "매체 최적화", "콘텐츠 실험"],
      lede: p.summary || "매체 운영부터 트래킹 설계, CRM, 콘텐츠 제작까지 퍼널 전 구간을 직접 다룹니다.",
      heroStats,
      companies,
      capabilities: (d.capabilities || []).filter(c => c.visible !== false).map(c => ({ label: c.label || "", desc: c.description || "" })),
      pipeline: (d.pipeline || []).filter(x => x.visible !== false).map(x => ({ step: x.step || "", title: x.title || "", desc: x.description || "", tools: x.tools || [] })),
      flow: (d.flow || []).filter(x => x.visible !== false).map(x => ({ num: x.num || "", title: x.title || "", sub: x.sub || "", caption: x.caption || "" })),
      axLoop: (d.axLoop || []).filter(x => x.visible !== false).map(x => ({ num: x.num || "", title: x.title || "", items: x.items || [] })),
      axScreens: (d.axScreens || []).filter(x => x.visible !== false).map(x => ({ category: x.category || "기타", name: x.name || "", code: x.code || "", badge: x.badge || "", description: x.description || "", source: x.source || "", chips: x.chips || [] })),
      axNotes: (d.axNotes || []).filter(x => x.visible !== false).map(x => ({ section: x.section || "principle", title: x.title || "", body: x.body || "" })),
      stack: (p.stack || []).map(s => ({ area: s.area || "", title: s.title || "", desc: s.desc || "" })),
      resumeName: p.nameKo || p.nameEn || "",
      resumeRole: p.title || "",
      email: p.email || "", location: p.location || "",
      links: p.links || [],
      resumeSkills: (d.capabilities || []).filter(c => c.visible !== false).map(c => c.label)
    };
  }

  function renderAX(d) {
    const data = axData(d);
    const title = (data.resumeName ? data.resumeName + " — " : "") + "AX 마케터 포트폴리오";
    const head = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">';
    const GOTHIC = "'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',sans-serif";
    const POINT = "'IBM Plex Mono','Pretendard Variable',Pretendard,ui-monospace,monospace";
    const css = ":root{--bg:#05060d;--pagebg:radial-gradient(1200px 760px at 10% -10%,rgba(47,86,255,.20),transparent 58%),radial-gradient(1100px 820px at 102% 6%,rgba(150,90,255,.16),transparent 55%),radial-gradient(900px 700px at 50% 120%,rgba(30,200,170,.10),transparent 60%),#05060d;--surface:#0b0e18;--card:rgba(255,255,255,.03);--card2:rgba(255,255,255,.02);--cardhover:rgba(255,255,255,.055);--ink:#f5f7ff;--txt:#e9edfb;--sub:rgba(255,255,255,.62);--substrong:rgba(255,255,255,.72);--sub2:rgba(255,255,255,.55);--mut:rgba(255,255,255,.46);--faint:rgba(255,255,255,.34);--faint2:rgba(255,255,255,.42);--line:rgba(255,255,255,.10);--line2:rgba(255,255,255,.08);--line3:rgba(255,255,255,.18);--line4:rgba(255,255,255,.14);--line5:rgba(255,255,255,.12);--lstrong:rgba(255,255,255,.22);--chip:rgba(255,255,255,.06);--panel:rgba(255,255,255,.04);--accent:#7c9bff;--accent2:#6f9bff;--accentweak:#c8d6ff;--badgetx:#b9c9ff;--accentbd:rgba(120,150,255,.30);--accentbg:rgba(90,120,255,.12);--navbg:rgba(6,8,16,.72);--navactive:rgba(255,255,255,.12);--badgeinner:#0a0c16;--linkhover:#8aa9ff;--sel:#7c5cff;--grad:linear-gradient(120deg,#6f9bff,#b07bff 55%,#54e0c6);--cat-perf:#6f9bff;--cat-brand:#ff6f9a;--cat-commerce:#2fd9b8;--cat-growth:#a98bff}" +
      ":root[data-theme=light]{--bg:#ffffff;--pagebg:#ffffff;--surface:#ffffff;--card:#ffffff;--card2:#ffffff;--cardhover:#f7f8fb;--ink:#0a0f24;--txt:#0a0f24;--sub:#4b5268;--substrong:#2b3350;--sub2:#4b5268;--mut:#8b91a7;--faint:#9aa2b3;--faint2:#9aa2b3;--line:#e8eaf2;--line2:#eef0f5;--line3:#d7deea;--line4:#e2e6f0;--line5:#e6e8ef;--lstrong:#d7deea;--chip:#eef1f8;--panel:#f6f7fb;--accent:#335cff;--accent2:#335cff;--accentweak:#2440c8;--badgetx:#2440c8;--accentbd:#dfe6ff;--accentbg:#eef2ff;--navbg:rgba(255,255,255,.85);--navactive:#0a0f24;--badgeinner:#ffffff;--linkhover:#335cff;--sel:#0a0f24;--grad:linear-gradient(120deg,#335cff,#7c5cff 55%,#0fbf9f);--cat-perf:#335cff;--cat-brand:#e0436a;--cat-commerce:#0f9e8e;--cat-growth:#7c5cff}" +
      "html,body{margin:0;padding:0;background:var(--bg);overflow-x:clip}" +
      "body{font-family:" + GOTHIC + ";color:var(--txt);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;font-feature-settings:'ss01','cv11';letter-spacing:-0.003em;line-height:1.5}" +
      "h1,h2,h3,h4{font-family:" + GOTHIC + ";word-break:keep-all;text-wrap:pretty;color:var(--ink)}" +
      "a{color:var(--txt);text-decoration:none}a:hover{color:var(--linkhover)}::selection{background:var(--sel);color:#ffffff}" +
      "::-webkit-scrollbar{width:11px;height:11px}::-webkit-scrollbar-thumb{background:var(--line4);border-radius:8px;border:3px solid transparent;background-clip:content-box}::-webkit-scrollbar-track{background:transparent}" +
      ".axmono{font-family:" + POINT + ";font-feature-settings:'zero','tnum';font-variant-numeric:tabular-nums slashed-zero}" +
      "@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}" +
      ".axgrad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}" +
      ".axcard{transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s,border-color .22s}.axcard:hover{transform:translateY(-3px);box-shadow:0 22px 44px -18px rgba(70,100,255,.5)}" +
      ".axmchip{transition:transform .2s,border-color .2s,color .2s}.axmchip:hover{transform:translateY(-2px);border-color:var(--accentbd);color:var(--accentweak)}" +
      ".pcard{position:relative;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:18px;padding:14px;background:var(--card2);cursor:pointer;text-align:left;transition:transform .28s cubic-bezier(.2,.8,.2,1),border-color .28s,background .28s,box-shadow .28s}.pcard:hover{background:var(--cardhover);border-color:var(--lstrong);transform:translateY(-4px);box-shadow:0 28px 60px -30px rgba(90,120,255,.6)}.pcard:hover .pcta{color:var(--accentweak)}.pcard:hover .pcta span{transform:translateX(4px)}.pthumb{position:relative;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:#0b1020}.pthumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.8,.2,1)}.pcard:hover .pthumb img{transform:scale(1.06)}.pcta span{display:inline-block;transition:transform .28s}.pgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,1.5vw,20px)}@media(max-width:900px){.pgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.pgrid{grid-template-columns:1fr}}" +
      ".axgridbg{background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:52px 52px;-webkit-mask-image:radial-gradient(60% 65% at 30% 20%,#000 20%,transparent 100%);mask-image:radial-gradient(60% 65% at 30% 20%,#000 20%,transparent 100%)}" +
      ".cocards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,1.6vw,22px);margin-top:28px}@media(max-width:920px){.cocards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.cocards{grid-template-columns:1fr}}.catgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;align-items:start}@media(max-width:820px){.catgrid{grid-template-columns:1fr}}.projrow{transition:background .15s}.projrow:hover{background:var(--panel)}.cathero{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(20px,3vw,40px);align-items:center}@media(max-width:760px){.cathero{grid-template-columns:1fr;gap:22px}}.projwrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}@media(max-width:900px){.projwrap{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.projwrap{grid-template-columns:1fr}}@keyframes axfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.edrow{transition:padding-left .35s cubic-bezier(.2,.8,.2,1)}.edrow:hover{padding-left:12px}.edrow .edttl,.edrow .edidx{transition:color .25s}.edrow[data-cat=perf]:hover .edttl,.edrow[data-cat=perf]:hover .edidx{color:var(--accent)}.edrow[data-cat=brand]:hover .edttl,.edrow[data-cat=brand]:hover .edidx{color:#e0436a}.edrow[data-cat=commerce]:hover .edttl,.edrow[data-cat=commerce]:hover .edidx{color:#0f9e8e}.edrow[data-cat=growth]:hover .edttl,.edrow[data-cat=growth]:hover .edidx{color:#7c5cff}.edgroup .edrow:first-child{border-top:0}.edthumb{transition:transform .3s cubic-bezier(.2,.8,.2,1)}.edrow:hover .edthumb{transform:translateY(-3px)}@media(max-width:760px){.edrow{grid-template-columns:40px 1fr!important;gap:16px!important}.edrow .edthumb{grid-column:2;margin-top:14px;max-width:300px}}.board{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}@media(max-width:720px){.board{grid-template-columns:1fr}}.bp{border:1px solid var(--line);border-radius:14px;padding:19px 21px;display:flex;flex-direction:column}.bpr{display:flex;align-items:center;gap:12px;padding:10px 6px;border:0;border-top:1px solid var(--line2);background:transparent;cursor:pointer;border-radius:8px;transition:background .15s;width:100%;text-align:left}.bpr:hover{background:#f7f8fb}.axtab{transition:all .2s}";
    const dataJson = JSON.stringify(data).replace(/</g, "\\u003c");
    return "<!doctype html><html lang=\"ko\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + esc(title) + "</title>" + head + "<style>" + css + "</style></head><body>" +
      '<div id="scroll-progress" style="position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#335cff,#7c5cff,#0fbf9f);z-index:99"></div>' +
      '<div style="min-height:100vh;background:var(--pagebg);overflow-x:clip"><div style="max-width:1720px;margin:0 auto;padding:0 clamp(24px,5vw,96px)"><div id="ax-root"></div></div></div>' +
      '<div id="ax-modal" style="position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;background:rgba(13,13,15,.9);padding:clamp(16px,4vw,48px)"><button id="ax-modal-close" aria-label="닫기" style="position:absolute;top:18px;right:22px;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:var(--line2);color:#fff;font-size:20px;cursor:pointer;line-height:1">✕</button><div id="ax-modal-body" style="display:flex;align-items:center;justify-content:center;width:100%;max-width:min(1120px,94vw);max-height:90vh"></div></div>' +
      "<script>window.__AX=" + dataJson + ";(" + axRuntime.toString() + ")();<\/script>" +
      "</body></html>";
  }

  // 브라우저(iframe srcdoc) 안에서 실행되는 바닐라 런타임. window.__AX만 의존.
  function axRuntime() {
    var D = window.__AX || {};
    var INK = "#eef1ff", BLUE = "#5b8cff", VIOLET = "#a074ff", MINT = "#2fd9b8", CORAL = "#ff6f8b", MUT = "#8b91a7", LINE = "rgba(255,255,255,.12)";
    var GRAD = "linear-gradient(120deg,#4f7cff,#a56bff 60%,#54e0c6)";
    function curTheme() { return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"; }
    function applyThemeVars() { var l = curTheme() === "light"; INK = l ? "#0a0f24" : "#eef1ff"; LINE = l ? "#e8eaf2" : "rgba(255,255,255,.12)"; BLUE = l ? "#335cff" : "#5b8cff"; }
    function setTheme(mode) { if (mode === "light") document.documentElement.setAttribute("data-theme", "light"); else document.documentElement.removeAttribute("data-theme"); try { localStorage.setItem("axtheme", mode); } catch (e) {} applyThemeVars(); var b = document.getElementById("ax-theme-btn"); if (b) b.textContent = mode === "light" ? "🌙" : "☀️"; }
    var st = { view: "home", companyIdx: 0, pipeIdx: 0, active: null, rotIdx: 0, statT: 0, sliding: false, loopIdx: 0, axCat: null, caseFilter: null, projCat: null };
    var root = document.getElementById("ax-root");
    var e = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
    var mono = "font-family:'IBM Plex Mono','Pretendard Variable',Pretendard,monospace";

    function animNum(str) {
      var m = String(str).match(/[\d.]+/); if (!m) return e(str);
      var n = parseFloat(m[0]); var cur = st.statT >= 1 ? m[0] : String(Math.round(n * st.statT));
      return e(String(str).replace(m[0], cur));
    }
    function tagCount(label) { var c = 0; (D.companies || []).forEach(function (co) { (co.projects || []).forEach(function (p) { if ((p.tags || []).indexOf(label) >= 0) c++; }); }); return c; }

    function nav() {
      var LB = { home: "홈", cases: "프로젝트", resume: "이력서", ax: "AX" };
      var order = (D.navOrder && D.navOrder.length ? D.navOrder : ["home", "cases", "resume", "ax"]).filter(function (k) { return LB[k]; });
      ["home", "cases", "resume", "ax"].forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); });
      var tabs = order.map(function (k) { return [k, LB[k]]; });
      var btns = tabs.map(function (t) {
        var on = st.view === t[0];
        return '<button data-ax-view="' + t[0] + '" style="font-size:14.5px;font-weight:600;padding:9px 18px;border:none;border-radius:999px;cursor:pointer;background:' + (on ? "var(--navactive)" : "transparent") + ';color:' + (on ? "#ffffff" : "var(--sub2)") + ';transition:all .3s">' + e(t[1]) + '</button>';
      }).join("");
      return '<nav style="position:sticky;top:0;z-index:60;background:var(--navbg);backdrop-filter:saturate(160%) blur(14px);-webkit-backdrop-filter:saturate(160%) blur(12px);display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--line2);flex-wrap:wrap"><div style="font-size:clamp(17px,1.55vw,19.5px);font-weight:800;letter-spacing:-.02em;color:var(--ink);line-height:1;display:flex;align-items:center">' + e(D.brand) + '</div><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + btns + '<button id="ax-theme-btn" data-ax-theme="1" title="라이트/다크 전환" aria-label="테마 전환" style="font-size:15px;line-height:1;width:38px;height:38px;border-radius:999px;border:1px solid var(--line3);background:transparent;color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:2px">' + (curTheme() === "light" ? "🌙" : "☀️") + '</button><a href="#contact" style="font-size:14.5px;font-weight:700;padding:9px 20px;border-radius:999px;border:none;margin-left:8px;color:#fff;background:linear-gradient(120deg,#2f6bff,#9b5cff);box-shadow:0 10px 24px -10px rgba(90,120,255,.7)">Contact</a></div></nav>';
    }

    function home() {
      var rw = D.rotWords[st.rotIdx % (D.rotWords.length || 1)] || "";
      var rotSpan = '<span id="ax-rot" class="axgrad" style="display:inline-block;transition:opacity .32s,transform .32s">' + e(rw) + '</span>';
      var hl = D.headline || "";
      var headlineHtml = hl.indexOf("{rot}") >= 0
        ? e(hl).replace(/\n/g, "<br>").split("{rot}").join(rotSpan)
        : e(hl) + '<br>' + rotSpan + '로 증명하는<br>풀스택 마케터.';
      var stats = (D.heroStats || []).map(function (s, i) {
        var col = i === 1 ? "var(--accent)" : i === 2 ? "var(--cat-growth)" : i === 3 ? "var(--cat-commerce)" : "var(--ink)";
        return '<div><div class="ax-stat" data-raw="' + e(s.v) + '" style="font-size:clamp(28px,2.4vw,38px);font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:' + col + '">' + animNum(s.v) + '</div><div class="axmono" style="font-size:12px;letter-spacing:.1em;color:var(--mut);margin-top:6px">' + e(s.k) + '</div></div>';
      }).join("");
      var marItems = (D.capabilities || []).map(function (c) { return c.label; });
      var mar = marItems.concat(marItems).map(function (w) { return '<span class="axmono axmchip" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;letter-spacing:.04em;padding:8px 16px;margin-right:10px;white-space:nowrap;background:var(--panel);border:1px solid var(--line);border-radius:999px;color:var(--sub)"><span style="color:var(--accent)">✦</span>' + e(w) + '</span>'; }).join("");
      var flowRows = (D.flow || []).map(function (f, i) {
        return '<div data-flow-step="' + i + '" style="display:flex;align-items:baseline;gap:16px;padding:13px 0;border-top:1px solid var(--line)"><span class="axmono" style="font-size:11px;letter-spacing:.12em;color:var(--faint)">' + e(f.num) + '</span><span data-flow-title="1" style="font-size:16.5px;font-weight:700;color:var(--mut)">' + e(f.title) + '</span><span class="axmono" style="font-size:10.5px;color:var(--line3);margin-left:auto">' + e(f.sub) + '</span></div>';
      }).join("");
      var chips = (D.capabilities || []).map(function (c, i) {
        var on = st.active === c.label;
        return '<button data-ax-chip="' + e(c.label) + '" class="axcard" style="text-align:left;padding:22px 22px;border:1px solid ' + (on ? "rgba(120,150,255,.55)" : "var(--line)") + ';background:' + (on ? "rgba(90,120,255,.14)" : "var(--card)") + ';box-shadow:' + (on ? "0 20px 44px -18px rgba(90,120,255,.55)" : "none") + ';cursor:pointer;border-radius:16px;transition:all .25s;display:flex;flex-direction:column;gap:10px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span class="axmono" style="font-size:11px;letter-spacing:.12em;color:' + (on ? "var(--accent)" : "var(--accent)") + '">' + String(i + 1).padStart(2, "0") + '</span><span class="axmono" style="font-size:11px;color:' + (on ? "var(--sub2)" : "var(--faint)") + '">' + tagCount(c.label) + ' CASES</span></div><div style="font-size:17px;font-weight:700;color:var(--ink)">' + e(c.label) + '</div><p style="margin:0;font-size:13.5px;line-height:1.62;color:' + (on ? "var(--faint)" : "var(--mut)") + '">' + e(c.desc) + '</p></button>';
      }).join("");
      return '<header style="position:relative;padding:clamp(56px,8vw,96px) 0 72px;border-bottom:1px solid var(--line)">' +
        '<div class="axmono" style="display:inline-flex;align-items:center;gap:9px;font-size:12.5px;letter-spacing:.14em;color:var(--badgetx);background:var(--accentbg);border:1px solid var(--accentbd);padding:8px 15px;border-radius:999px;margin-bottom:26px"><span style="width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 2.2s infinite"></span>SENIOR MARKETER · AI-NATIVE</div>' +
        '<h1 style="margin:0 0 32px;font-size:clamp(30px,4.4vw,50px);line-height:1.08;font-weight:800;letter-spacing:-.035em">' + headlineHtml + '</h1>' +
        '<p style="margin:0;font-size:clamp(15px,1.4vw,17.5px);line-height:1.7;color:var(--sub);max-width:680px">' + e(D.lede) + '</p>' +
        '<div style="display:flex;gap:clamp(28px,5vw,48px);margin-top:56px;flex-wrap:wrap">' + stats + '</div></header>' +
        '<div style="margin:0 calc(clamp(24px,5vw,96px) * -1);background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:16px 0"><div style="display:flex;width:max-content;animation:marquee 26s linear infinite">' + mar + '</div></div>' +
        '<section style="padding:80px 0;border-bottom:1px solid var(--line)"><div style="display:grid;grid-template-columns:minmax(280px,5fr) minmax(0,7fr);gap:clamp(32px,5vw,88px);align-items:center"><div><div class="axmono" style="font-size:13px;letter-spacing:.16em;color:var(--accent);margin-bottom:20px">FULL-FUNNEL COVERAGE</div><h2 style="margin:0 0 20px;font-size:clamp(22px,2vw,31px);font-weight:800;letter-spacing:-.025em">영상 제작부터 대시보드까지, 전 구간을 직접.</h2><p style="margin:0 0 36px;font-size:15.5px;line-height:1.7;color:var(--mut)">한 구간의 전문가가 아니라, 구간과 구간을 잇는 사람입니다.</p><div style="display:flex;flex-direction:column">' + flowRows + '</div></div><div style="min-width:0"><canvas id="ax-flow" style="display:block;width:100%"></canvas></div></div></section>' +
        '<section style="padding:72px 0;border-bottom:1px solid var(--line)"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:32px;flex-wrap:wrap;margin-bottom:44px"><h2 style="margin:0;font-size:clamp(22px,2vw,31px);font-weight:800;letter-spacing:-.025em">역량 ' + (D.capabilities || []).length + '</h2><p style="margin:0;font-size:15px;color:var(--mut)">카드를 누르면 해당 역량이 쓰인 프로젝트가 강조됩니다.</p></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-bottom:28px">' + chips + '</div><div style="display:flex;gap:12px;flex-wrap:wrap"><button data-ax-view="cases" style="font-size:15px;font-weight:700;padding:14px 28px;border-radius:999px;border:none;background:linear-gradient(120deg,#2f6bff,#9b5cff);color:#fff;cursor:pointer;box-shadow:0 14px 30px -10px rgba(90,120,255,.6)">프로젝트 보기 →</button><button data-ax-view="ax" style="font-size:15px;font-weight:700;padding:14px 28px;border-radius:999px;border:1px solid var(--line3);background:transparent;color:var(--ink);cursor:pointer">AX 역량 보기 →</button></div></section>';
    }

    function ytId(u) { if (!u) return null; var m = String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([\w-]{6,})/); return m ? m[1] : null; }
    function mediaGrid(links, mediaArr) {
      var cards = [];
      (links || []).forEach(function (l) {
        var yt = ytId(l.url);
        if (yt) cards.push('<div data-ax-video="' + yt + '" title="' + e(l.label) + '" style="position:relative;display:block;border-radius:10px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/9;background:#0d0d0f;cursor:pointer"><img src="https://img.youtube.com/vi/' + yt + '/hqdefault.jpg" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;opacity:.94"><span style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.55),transparent 55%)"></span><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center"><span style="border-left:15px solid #0a0f24;border-top:9px solid transparent;border-bottom:9px solid transparent;margin-left:4px"></span></span><span style="position:absolute;left:10px;right:10px;bottom:9px;font-size:11.5px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + e(l.label) + '</span></div>');
      });
      (mediaArr || []).forEach(function (m) {
        if (m.url && (m.type === "image" || !m.type)) cards.push('<div data-ax-img="' + e(m.url) + '" title="' + e(m.title || "") + '" style="position:relative;display:block;border-radius:10px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/9;background:var(--chip);cursor:zoom-in"><img src="' + e(m.url) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"><span style="position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;background:rgba(23,24,26,.6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px">⤢</span></div>');
      });
      var others = (links || []).filter(function (l) { return !ytId(l.url); });
      var chips = others.map(function (l) { return '<a href="' + e(l.url) + '" target="_blank" rel="noopener" class="axmono" style="font-size:11.5px;padding:6px 12px;border-radius:999px;border:1px solid var(--line3);color:var(--sub);display:inline-flex;align-items:center;gap:5px">↗ ' + e(l.label) + '</a>'; }).join("");
      var grid = cards.length ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-top:18px">' + cards.join("") + '</div>' : "";
      var chipRow = chips ? '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">' + chips + '</div>' : "";
      return grid + chipRow;
    }
    function cases() {
      var cos = D.companies || []; if (!cos.length) return '<section style="padding:80px 0;color:var(--mut)">등록된 회사가 없습니다.</section>';
      var n = cos.length, idx = ((st.companyIdx % n) + n) % n, co = cos[idx];
      var tabs = cos.map(function (c, i) { return '<button data-ax-co-idx="' + i + '" class="axmono" style="font-size:13px;padding:14px 20px;border:none;background:transparent;cursor:pointer;white-space:nowrap;color:' + (i === idx ? INK : "var(--mut)") + ';border-bottom:2px solid ' + (i === idx ? INK : "transparent") + ';margin-bottom:-1px">' + e(c.name) + '</button>'; }).join("");
      var coMetrics = (co.metrics || []).map(function (m) { return '<div><div class="axgrad" style="font-size:28px;font-weight:800;letter-spacing:-.02em;display:inline-block">' + e(m.v) + '</div><div style="font-size:13px;color:var(--mut);margin-top:2px">' + e(m.k) + '</div></div>'; }).join("");
      var projs = (co.projects || []).map(function (p) {
        var dim = st.active && (p.tags || []).indexOf(st.active) < 0 ? 0.25 : 1;
        var pms = (p.metrics || []).map(function (m) { return '<span class="axmono" style="font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:999px;border:1px solid #cdd7ff;background:#f4f6ff;color:var(--badgetx)">' + e(m.v) + ' ' + e(m.k) + '</span>'; }).join("");
        var tgs = (p.tags || []).map(function (t) { return '<span class="axmono" style="font-size:11.5px;padding:5px 12px;border-radius:999px;background:var(--chip);color:var(--sub)">' + e(t) + '</span>'; }).join("");
        var par = (p.problem || p.action || p.result) ? '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:20px"><div style="background:#fff1f4;border:1px solid #ffdde5;border-radius:14px;padding:16px 18px"><div class="axmono" style="font-size:11px;letter-spacing:.12em;color:#e0436a;margin-bottom:8px">PROBLEM</div><p style="margin:0;font-size:13.5px;line-height:1.65;color:var(--sub)">' + e(p.problem) + '</p></div><div style="background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px"><div class="axmono" style="font-size:11px;letter-spacing:.12em;color:#7c5cff;margin-bottom:8px">ACTION</div><p style="margin:0;font-size:13.5px;line-height:1.65;color:var(--sub)">' + e(p.action) + '</p></div><div style="background:var(--accentbg);border:1px solid var(--accentbd);border-radius:14px;padding:16px 18px"><div class="axmono" style="font-size:11px;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">RESULT</div><p style="margin:0;font-size:13.5px;line-height:1.65;color:#0a0f24;font-weight:600">' + e(p.result) + '</p></div></div>' : "";
        return '<article style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(24px,3vw,44px);padding:40px 0;border-top:1px solid var(--line);opacity:' + dim + ';transition:opacity .2s;align-items:start"><div><div style="display:flex;align-items:baseline;gap:16px;margin-bottom:12px"><span class="axmono" style="font-size:13px;color:var(--mut)">' + e(p.num) + '</span><h4 style="margin:0;font-size:clamp(18px,1.6vw,23px);font-weight:700;letter-spacing:-.02em">' + e(p.title) + '</h4></div><p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:var(--sub)">' + e(p.desc) + '</p>' + par + '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + pms + tgs + '</div>' + mediaGrid(p.links, p.media) + '</div></article>';
      }).join("");
      return '<section id="cases" style="padding:72px 0;border-bottom:1px solid var(--line)"><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:36px;gap:16px;flex-wrap:wrap"><h2 style="margin:0;font-size:clamp(22px,2vw,31px);font-weight:800;letter-spacing:-.025em">프로젝트 — 회사별</h2><div style="display:flex;align-items:center;gap:16px"><div class="axmono" style="font-size:13px;color:var(--mut)">' + String(idx + 1).padStart(2, "0") + ' / ' + String(n).padStart(2, "0") + '</div><div style="display:flex;gap:8px"><button data-ax-co="prev" style="width:40px;height:40px;border-radius:50%;border:1px solid var(--line3);background:transparent;cursor:pointer;font-size:16px">←</button><button data-ax-co="next" style="width:40px;height:40px;border-radius:50%;border:1px solid var(--line3);background:transparent;cursor:pointer;font-size:16px">→</button></div></div></div><div style="display:flex;border-bottom:1px solid var(--line);margin-bottom:44px;overflow-x:auto">' + tabs + '</div><div style="display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:clamp(28px,3.5vw,56px);align-items:start;opacity:' + (st.sliding ? 0 : 1) + ';transition:opacity .35s"><div>' + (co.logo ? '<div style="height:56px;margin-bottom:20px;display:flex;align-items:center"><img src="' + e(co.logo) + '" alt="' + e(co.name) + '" loading="lazy" style="max-height:56px;max-width:170px;object-fit:contain;display:block"></div>' : '') + '<div class="axmono" style="font-size:12px;letter-spacing:.12em;color:var(--accent);margin-bottom:14px">' + e(co.period) + '</div><h3 style="margin:0 0 10px;font-size:clamp(23px,2.2vw,32px);font-weight:800;letter-spacing:-.025em">' + e(co.name) + '</h3><div style="font-size:15px;font-weight:600;color:var(--sub);margin-bottom:18px">' + e(co.role) + '</div><p style="margin:0;font-size:14.5px;line-height:1.7;color:var(--mut)">' + e(co.summary) + '</p><div style="display:flex;flex-direction:column;gap:16px;margin-top:32px;border-left:2px solid #0a0f24;padding-left:20px">' + coMetrics + '</div></div><div style="display:flex;flex-direction:column">' + projs + '</div></div></section>';
    }

    function resume() {
      var skills = (D.resumeSkills || []).map(function (s) { return '<span class="axmono" style="font-size:12px;padding:7px 14px;border-radius:999px;border:1px solid var(--line3);color:var(--sub)">' + e(s) + '</span>'; }).join("");
      var entries = (D.companies || []).map(function (co) {
        var bullets = (co.projects || []).map(function (p) { var mm = (p.metrics || []).map(function (m) { return m.k + " " + m.v; }).join(", "); return '<div style="display:flex;gap:10px;font-size:14px;color:var(--sub);line-height:1.6"><span style="color:var(--accent)">—</span><span>' + e(p.title) + (mm ? " (" + e(mm) + ")" : "") + '</span></div>'; }).join("");
        return '<div style="display:grid;grid-template-columns:180px 1fr;gap:32px;padding:32px 0;border-bottom:1px solid var(--line)"><div class="axmono" style="font-size:13px;color:var(--mut);padding-top:4px">' + e(co.period) + '</div><div><div style="font-size:20px;font-weight:700">' + e(co.name) + '</div><div style="font-size:14.5px;color:var(--accent);font-weight:600;margin:4px 0 12px">' + e(co.role) + '</div><p style="margin:0 0 12px;font-size:14.5px;line-height:1.7;color:var(--sub)">' + e(co.summary) + '</p><div style="display:flex;flex-direction:column;gap:6px">' + bullets + '</div></div></div>';
      }).join("");
      var contact = [D.email ? '<span>' + e(D.email) + '</span>' : "", D.location ? '<span>' + e(D.location) + '</span>' : ""].filter(Boolean).join("");
      return '<section style="padding:72px 0;border-bottom:1px solid var(--line)"><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:56px"><h2 style="margin:0;font-size:clamp(22px,2vw,31px);font-weight:800;letter-spacing:-.025em">이력서</h2><div class="axmono" style="font-size:13px;color:var(--mut)">RESUME</div></div><div style="display:grid;grid-template-columns:340px 1fr;gap:clamp(32px,5vw,72px);align-items:start"><div style="display:flex;flex-direction:column;gap:40px"><div><div style="font-size:clamp(26px,2.4vw,34px);font-weight:800;letter-spacing:-.025em;margin-bottom:8px">' + e(D.resumeName) + '</div><div style="font-size:16px;color:var(--sub);font-weight:600">' + e(D.resumeRole) + '</div><div style="display:flex;flex-direction:column;gap:6px;margin-top:20px;font-size:14px;color:var(--mut)">' + contact + '</div></div><div><div class="axmono" style="font-size:12px;letter-spacing:.12em;color:var(--accent);margin-bottom:16px">CAPABILITIES</div><div style="display:flex;flex-wrap:wrap;gap:8px">' + skills + '</div></div></div><div style="display:flex;flex-direction:column"><div class="axmono" style="font-size:12px;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">EXPERIENCE</div>' + entries + '</div></div></section>';
    }

    function ax() {
      var CAT = { "성과·매출":"#0f766e", "광고 집행":"#b45309", "콘텐츠·CRM":"#7c3aed", "영업·파트너십":"#0369a1", "시장·공급":"#4d7c0f" };
      var catColor = function (c) { return CAT[c] || "#334155"; };
      // intro
      var intro = '<section style="padding:80px 0 52px;border-bottom:1px solid var(--line)"><div class="axmono" style="font-size:13px;letter-spacing:.16em;color:var(--accent);margin-bottom:22px">AX — AI TRANSFORMATION</div><h2 style="margin:0 0 22px;font-size:clamp(28px,3.2vw,52px);font-weight:800;letter-spacing:-.03em;line-height:1.16">하나의 마케팅 콘솔 안에서<br>수집 → 측정 → 실행 → 영업이 전부 연결돼 돌아갑니다.</h2><p style="margin:0;font-size:17px;line-height:1.7;color:var(--sub);max-width:720px">모든 화면은 AI 페어로 설계·구축·운영되고, 요청에서 배포까지 보통 반나절 — 화면 30여 개·PR 600건 규모로 누적된 스택입니다.</p></section>';
      // 운영 루프
      var loop = D.axLoop || [], loopSection = "";
      if (loop.length) {
        var li = ((st.loopIdx % loop.length) + loop.length) % loop.length;
        var stages = loop.map(function (s, i) { var on = i === li; return '<button data-ax-loop="' + i + '" style="text-align:left;padding:15px 14px;border:1px solid ' + (on ? INK : "var(--line)") + ';background:' + (on ? INK : "#fff") + ';color:' + (on ? "#ffffff" : INK) + ';cursor:pointer;border-radius:10px;transition:all .25s"><div class="axmono" style="font-size:11px;letter-spacing:.1em;opacity:.6;margin-bottom:6px">' + e(s.num) + '</div><div style="font-size:14.5px;font-weight:700">' + e(s.title) + '</div></button>'; }).join("");
        var la = loop[li]; var litems = (la.items || []).map(function (x) { return '<div style="display:flex;gap:9px;font-size:14.5px;color:#0a0f24;line-height:1.6;padding:3px 0"><span style="color:var(--accent)">—</span><span>' + e(x) + '</span></div>'; }).join("");
        loopSection = '<section style="padding:60px 0;border-bottom:1px solid var(--line)"><div class="axmono" style="font-size:13px;letter-spacing:.16em;color:var(--accent);margin-bottom:12px">OPERATING LOOP</div><h2 style="margin:0 0 8px;font-size:clamp(24px,2.4vw,38px);font-weight:800;letter-spacing:-.025em">데이터 수집부터 영업까지, 한 콘솔의 루프</h2><p style="margin:0 0 26px;font-size:15px;color:var(--mut)">단계를 누르면 그 단계에서 하는 일이 아래에 나옵니다 · 측정과 실행이 같은 화면군이라 루프가 짧습니다.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:10px;margin-bottom:20px">' + stages + '</div><div style="background:var(--accentbg);border-radius:12px;padding:24px 28px"><div class="axmono" style="font-size:12px;letter-spacing:.12em;color:var(--accent);margin-bottom:12px">' + e(la.num) + ' · ' + e(la.title) + '</div>' + litems + '</div></section>';
      }
      // 사상
      var principles = (D.axNotes || []).filter(function (n) { return n.section === "principle"; }), prinSection = "";
      if (principles.length) {
        var pc = principles.map(function (n, i) { return '<div style="background:#ffffff;border:1px solid var(--line);border-radius:12px;padding:20px"><div class="axmono" style="font-size:12px;color:var(--accent);margin-bottom:8px">0' + (i + 1) + '</div><div style="font-size:16px;font-weight:700;margin-bottom:7px">' + e(n.title) + '</div><p style="margin:0;font-size:13.5px;line-height:1.65;color:var(--sub)">' + e(n.body) + '</p></div>'; }).join("");
        prinSection = '<section style="padding:56px 0;border-bottom:1px solid var(--line)"><h2 style="margin:0 0 20px;font-size:clamp(22px,2.2vw,34px);font-weight:800;letter-spacing:-.025em">운영 사상</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">' + pc + '</div></section>';
      }
      // 화면 카탈로그
      var screens = D.axScreens || [], catSection = "";
      if (screens.length) {
        var cats = []; screens.forEach(function (s) { if (cats.indexOf(s.category) < 0) cats.push(s.category); });
        var ac = st.axCat;
        var filters = '<button data-ax-cat="__all" class="axmono" style="font-size:12px;padding:7px 14px;border-radius:999px;border:1px solid ' + (ac ? "var(--accentbd)" : INK) + ';background:' + (ac ? "transparent" : INK) + ';color:' + (ac ? "var(--sub)" : "#ffffff") + ';cursor:pointer">전체</button>' + cats.map(function (c) { var on = ac === c, col = catColor(c); return '<button data-ax-cat="' + e(c) + '" class="axmono" style="font-size:12px;padding:7px 14px;border-radius:999px;border:1px solid ' + (on ? col : "var(--accentbd)") + ';background:' + (on ? col : "transparent") + ';color:' + (on ? "#fff" : "var(--sub)") + ';cursor:pointer">' + e(c) + '</button>'; }).join("");
        var shown = ac ? screens.filter(function (s) { return s.category === ac; }) : screens;
        var sc = shown.map(function (s) { var col = catColor(s.category);
          var chips = (s.chips || []).map(function (ch) { return '<span class="axmono" style="font-size:10.5px;padding:2px 8px;border-radius:6px;background:var(--chip);color:var(--sub)">' + e(ch) + '</span>'; }).join("");
          return '<div style="background:#fff;border:1px solid var(--line);border-left:4px solid ' + col + ';border-radius:12px;padding:16px 18px"><div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><span style="font-size:14.5px;font-weight:700">' + e(s.name) + '</span>' + (s.code ? '<code class="axmono" style="font-size:10px;color:var(--faint)">' + e(s.code) + '</code>' : '') + (s.badge ? '<span class="axmono" style="margin-left:auto;font-size:10px;font-weight:700;padding:2px 9px;border-radius:999px;background:' + col + '1f;color:' + col + '">' + e(s.badge) + '</span>' : '') + '</div>' + (s.description ? '<p style="margin:6px 0 0;font-size:13px;line-height:1.6;color:var(--sub)">' + e(s.description) + '</p>' : '') + (s.source ? '<div class="axmono" style="margin-top:8px;font-size:10.5px;color:#a8a29e">' + e(s.source) + '</div>' : '') + (chips ? '<div style="margin-top:9px;display:flex;flex-wrap:wrap;gap:5px">' + chips + '</div>' : '') + '</div>'; }).join("");
        catSection = '<section style="padding:56px 0;border-bottom:1px solid var(--line)"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:6px"><h2 style="margin:0;font-size:clamp(22px,2.2vw,34px);font-weight:800;letter-spacing:-.025em">화면 카탈로그</h2><span class="axmono" style="font-size:12px;color:var(--mut)">' + screens.length + ' SCREENS</span></div><p style="margin:0 0 18px;font-size:15px;color:var(--mut)">카테고리를 눌러 필터 · 모든 탭이 같은 숫자 정의를 공유합니다.</p><div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px">' + filters + '</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">' + sc + '</div></section>';
      }
      // 공통 정의
      var defs = (D.axNotes || []).filter(function (n) { return n.section === "definition"; }), defSection = "";
      if (defs.length) {
        var dr = defs.map(function (n) { return '<div style="padding:12px 0;border-top:1px solid var(--line)"><span style="font-weight:700;font-size:13.5px">' + e(n.title) + '</span> <span style="font-size:13px;color:var(--sub);line-height:1.65">' + e(n.body) + '</span></div>'; }).join("");
        defSection = '<section style="padding:56px 0;border-bottom:1px solid var(--line)"><h2 style="margin:0 0 8px;font-size:clamp(22px,2.2vw,34px);font-weight:800;letter-spacing:-.025em">공통 정의 — AX의 실체</h2><p style="margin:0 0 14px;font-size:15px;color:var(--mut)">숫자·보안·UI 규격을 전 화면이 공유합니다.</p><div style="background:#ffffff;border:1px dashed #d6d3d1;border-radius:12px;padding:8px 20px 16px">' + dr + '</div></section>';
      }
      // stack
      var stack = (D.stack || []).map(function (s) { return '<div style="background:#ffffff;padding:28px"><div class="axmono" style="font-size:12px;letter-spacing:.1em;color:var(--accent);margin-bottom:12px">' + e(s.area) + '</div><div style="font-size:18.5px;font-weight:700;margin-bottom:8px">' + e(s.title) + '</div><p style="margin:0;font-size:14px;line-height:1.65;color:var(--sub)">' + e(s.desc) + '</p></div>'; }).join("");
      var stackSection = (D.stack || []).length ? '<section style="padding:56px 0;border-bottom:1px solid var(--line)"><h2 style="margin:0 0 16px;font-size:clamp(22px,2.2vw,34px);font-weight:800;letter-spacing:-.025em">AI · 자동화 스택</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)">' + stack + '</div></section>' : "";
      // AX 탭 = 독립 마케팅 콘솔 페이지(/ax)를 임베드 모드로 풀블리드 iframe 삽입 (헤더는 기존 SPA nav 유지)
      return '<div style="width:100vw;margin-left:calc(50% - 50vw)"><iframe id="ax-embed-frame" src="/ax?embed=1" title="AX 마케팅 콘솔" scrolling="no" style="width:100%;border:0;display:block;min-height:3000px;background:var(--bg)"></iframe></div>';
    }

    function footer() {
      var links = (D.links || []).map(function (l) { return '<a href="' + e(l.url) + '" style="color:var(--mut)">' + e(l.label) + '</a>'; }).join("");
      return '<footer id="contact" style="padding:96px 0 80px"><div class="axmono" style="font-size:13px;letter-spacing:.16em;color:var(--accent);margin-bottom:24px">CONTACT</div><h2 style="margin:0 0 32px;font-size:clamp(26px,3.2vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.15">퍼널 전체를 맡길 수 있는<br>마케터를 찾고 계신가요?</h2><div style="display:flex;gap:32px;font-size:16px;flex-wrap:wrap">' + (D.email ? '<a href="mailto:' + e(D.email) + '" style="border-bottom:2px solid var(--accent);padding-bottom:3px;font-weight:600;color:var(--ink)">' + e(D.email) + '</a>' : "") + links + '</div><div class="axmono" style="margin-top:72px;padding-top:24px;border-top:1px solid var(--line);font-size:12px;color:var(--faint);display:flex;justify-content:space-between"><span>© ' + new Date().getFullYear() + ' ' + e(D.resumeName) + '</span><span>' + e(D.location) + '</span></div></footer>';
    }

    function coMets(co) { if (co.metrics && co.metrics.length) return co.metrics.slice(0, 3); var m = []; (co.projects || []).some(function (p) { if ((p.metrics || []).length) { m = p.metrics; return true; } }); return m.slice(0, 3); }
    function coAccent(co, ci) {
      var map = { "핸디즈": ["#5b6cff", "#3730c4"], "와그": ["#12b5a3", "#0a6f78"], "매일새옷": ["#9a6bff", "#5b3fc0"], "멜리즈": ["#ff5c8a", "#c62f6a"], "바비톡": ["#3b82f6", "#1e40af"], "레드브릭스": ["#ff7a4a", "#c0432f"] };
      var pal = [["#5b6cff", "#3730c4"], ["#12b5a3", "#0a6f78"], ["#9a6bff", "#5b3fc0"], ["#ff5c8a", "#c62f6a"], ["#3b82f6", "#1e40af"], ["#ff7a4a", "#c0432f"]];
      return map[co.name] || pal[ci % pal.length];
    }
    function companyThumb(co, acc) {
      var dot = 'width:8px;height:8px;border-radius:50%;display:inline-block';
      return '<div style="aspect-ratio:16/10;background:linear-gradient(150deg,' + acc[0] + ',' + acc[1] + ');display:flex;align-items:flex-end;justify-content:center;padding:26px 26px 0;overflow:hidden">' +
        '<div style="width:80%;background:#fff;border-radius:13px 13px 0 0;box-shadow:0 22px 45px -20px rgba(8,12,30,.55);overflow:hidden">' +
        '<div style="display:flex;gap:6px;padding:10px 13px;border-bottom:1px solid var(--line2)">' +
        '<span style="' + dot + ';background:#ff5f57"></span><span style="' + dot + ';background:#febc2e"></span><span style="' + dot + ';background:#28c840"></span>' +
        '</div>' +
        '<div style="padding:26px 18px 30px;text-align:center">' +
        '<div style="font-size:22px;font-weight:800;letter-spacing:-.02em;color:#0a0f24">' + e(co.name) + '</div>' +
        '<div style="width:32px;height:3px;border-radius:2px;background:' + acc[0] + ';margin:10px auto 0"></div>' +
        '</div></div></div>';
    }
    function companyCard(co, ci) {
      var acc = coAccent(co, ci);
      var mets = coMets(co).map(function (m) { return '<div><div style="font-size:22px;font-weight:800;letter-spacing:-.02em;color:' + acc[0] + '">' + e(m.v) + '</div><div style="font-size:11.5px;color:var(--mut);margin-top:1px">' + e(m.k) + '</div></div>'; }).join("");
      var np = (co.projects || []).length;
      return '<button data-ax-company="' + ci + '" class="axcard" style="text-align:left;background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:0 6px 20px -12px rgba(20,28,70,.12);display:flex;flex-direction:column;padding:0">' + companyThumb(co, acc) + '<div style="padding:18px 20px;display:flex;flex-direction:column;gap:12px;flex:1"><div><div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px"><span style="font-size:17px;font-weight:800;letter-spacing:-.02em;color:#0a0f24">' + e(co.name) + '</span><span class="axmono" style="font-size:11px;color:var(--mut);white-space:nowrap">프로젝트 ' + np + '</span></div><div style="font-size:12.5px;color:var(--sub);margin-top:3px">' + e(co.role || "") + '</div></div>' + (mets ? '<div style="display:flex;gap:22px;flex-wrap:wrap">' + mets + '</div>' : '') + '<div style="margin-top:auto;padding-top:4px;font-size:12.5px;font-weight:700;color:' + acc[0] + '">사례 자세히 보기 →</div></div></button>';
    }
    function companyModalHtml(ci) {
      var co = (D.companies || [])[ci]; if (!co) return "";
      var acc = coAccent(co, ci);
      var mets = coMets(co).map(function (m) { return '<div><div style="font-size:30px;font-weight:800;letter-spacing:-.03em;color:#fff">' + e(m.v) + '</div><div style="font-size:12.5px;color:var(--substrong);margin-top:2px">' + e(m.k) + '</div></div>'; }).join("");
      var pb = function (en, kr, col, txt) { return txt ? '<div style="background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px"><div class="axmono" style="font-size:10.5px;letter-spacing:.1em;color:' + col + ';margin-bottom:6px;font-weight:700">' + en + ' · ' + kr + '</div><p style="margin:0;font-size:13.5px;line-height:1.65;color:var(--substrong)">' + e(txt) + '</p></div>' : ''; };
      var projs = (co.projects || []).map(function (p) {
        var pms = (p.metrics || []).map(function (m) { return '<span class="axmono" style="font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;border:1px solid var(--line4);background:var(--panel);color:' + acc[1] + '">' + e(m.v) + ' ' + e(m.k) + '</span>'; }).join("");
        var tgs = (p.tags || []).map(function (t) { return '<span class="axmono" style="font-size:11px;padding:4px 10px;border-radius:999px;background:var(--chip);color:var(--sub)">' + e(t) + '</span>'; }).join("");
        var par = (p.problem || p.action || p.result) ? '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin:14px 0">' + pb('CHALLENGE', '과제', '#e0436a', p.problem) + pb('SOLUTION', '실행', acc[0], p.action) + pb('RESULTS', '성과', '#1f8f6f', p.result) + '</div>' : '';
        var media = mediaGrid(p.links, p.media);
        return '<div style="padding:26px 0;border-top:1px solid var(--line)"><div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px">' + (p.num ? '<span class="axmono" style="font-size:12px;color:' + acc[0] + ';font-weight:700">' + e(p.num) + '</span>' : '') + '<h3 style="margin:0;font-size:clamp(18px,1.8vw,23px);font-weight:800;letter-spacing:-.02em">' + e(p.title) + '</h3></div>' + (p.desc ? '<p style="margin:0;font-size:14.5px;line-height:1.7;color:var(--sub)">' + e(p.desc) + '</p>' : '') + par + ((pms || tgs) ? '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center' + (media ? ';margin-bottom:12px' : '') + '">' + pms + tgs + '</div>' : '') + media + '</div>';
      }).join("");
      return '<div style="background:#fff;border-radius:18px;max-width:min(900px,94vw);max-height:88vh;overflow:hidden;box-shadow:0 30px 80px rgba(10,16,40,.5);text-align:left;display:flex;flex-direction:column">' +
        '<div style="background:linear-gradient(150deg,' + acc[0] + ',' + acc[1] + ');color:#fff;padding:30px clamp(22px,4vw,42px) 26px">' +
        '<div class="axmono" style="font-size:11px;letter-spacing:.16em;color:var(--substrong);margin-bottom:12px">CASE STUDY</div>' +
        '<div style="font-size:clamp(24px,3vw,32px);font-weight:800;letter-spacing:-.025em">' + e(co.name) + '</div>' +
        '<div style="font-size:13px;color:var(--substrong);margin-top:4px">' + e(co.role || "") + (co.period ? ' · ' + e(co.period) : '') + '</div>' +
        (co.summary ? '<p style="margin:14px 0 0;font-size:14.5px;line-height:1.7;color:rgba(255,255,255,.92);max-width:64ch">' + e(co.summary) + '</p>' : '') +
        (mets ? '<div style="display:flex;flex-wrap:wrap;gap:clamp(22px,4vw,44px);margin-top:22px;padding-top:20px;border-top:1px solid var(--lstrong)">' + mets + '</div>' : '') +
        '</div>' +
        '<div style="padding:8px clamp(22px,4vw,42px) 34px;overflow-y:auto;flex:1 1 auto;min-height:0">' + projs + '</div>' +
        '</div>';
    }
    var CATS = [
      { key: "perf", no: "01", name: "퍼포먼스 마케팅", desc: "UA·매체 운영·예산 배분·전환 최적화", acc: ["#3f6bff", "#7c5cff"] },
      { key: "brand", no: "02", name: "브랜드 · 콘텐츠 · 세일즈", desc: "캠페인·프로모션·콘텐츠·영상 기획 제작", acc: ["#ff5c7a", "#c62f6a"] },
      { key: "commerce", no: "03", name: "커머스 · SEO", desc: "네이버쇼핑·커머스·특가 운영과 노출 최적화", acc: ["#0fbf9f", "#0a8f78"] },
      { key: "growth", no: "04", name: "그로스 · 데이터 · 자동화", desc: "지표 체계·데이터 파이프라인·어트리뷰션·AX 자동화", acc: ["#7c5cff", "#5b3fc0"] }
    ];
    function catOf(key) { for (var i = 0; i < CATS.length; i++) { if (CATS[i].key === key) return CATS[i]; } return CATS[0]; }
    function projCategory(p) {
      if (p.category) return p.category;
      var t = p.title || "";
      if (/마켓플레이스|그로스|데이터|파이프라인|어트리뷰션|지표\s*(운영|관리|세팅)|자동화|Taxonomy|텍소노미|CRM|푸시|플친|\bAX\b/.test(t)) return "growth";
      if (/네이버\s*쇼핑|쇼핑|커머스|특가|갈바닉|핫딜|SEO/.test(t)) return "commerce";
      if (/기부런|부작용|소비자\s*조사|USJ|유니버설|제휴|영상|유튜브|쎄뷰리|브랜딩|프로모션/.test(t)) return "brand";
      return "perf";
    }
    function coBrand(co, ci) {
      var map = { "핸디즈": ["#eceffe", "#4655d6"], "와그": ["#e2f6f2", "#0e9c8c"], "온디맨드랩": ["#f0ebff", "#7a54e6"], "매일새옷": ["#f0ebff", "#7a54e6"], "에이블리블랙": ["#fdeaf1", "#d83f68"], "앨리즈": ["#fdeaf1", "#d83f68"], "에일리즈": ["#fdeaf1", "#d83f68"], "바비톡": ["#e8f0fe", "#2563eb"], "레드브릭스": ["#ffece3", "#e0562f"] };
      var pal = [["#eceffe", "#4655d6"], ["#e2f6f2", "#0e9c8c"], ["#f0ebff", "#7a54e6"], ["#fdeaf1", "#d83f68"], ["#e8f0fe", "#2563eb"], ["#ffece3", "#e0562f"]];
      return map[co.name] || pal[ci % pal.length];
    }
    function firstMediaImg(p) {
      var img = null;
      (p.media || []).some(function (m) { if (m.url && (m.type === "image" || !m.type)) { img = m.url; return true; } });
      if (!img) (p.links || []).some(function (l) { var y = ytId(l.url); if (y) { img = "https://img.youtube.com/vi/" + y + "/hqdefault.jpg"; return true; } });
      return img;
    }
    function caseThumbEd(co, ci, p) {
      var b = coBrand(co, ci), img = firstMediaImg(p);
      var base = 'aspect-ratio:4/3;border-radius:10px;overflow:hidden;';
      if (img) return '<div class="edthumb" style="' + base + 'background:' + b[0] + '"><img src="' + e(img) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></div>';
      return '<div class="edthumb" style="' + base + 'background:' + b[0] + ';display:flex;align-items:center;justify-content:center;padding:16px"><span style="font-size:clamp(15px,1.5vw,19px);font-weight:700;letter-spacing:-.02em;color:' + b[1] + '">' + e(co.name) + '</span></div>';
    }
    function catColor(key) { return { perf: "var(--cat-perf)", brand: "var(--cat-brand)", commerce: "var(--cat-commerce)", growth: "var(--cat-growth)" }[key] || "var(--cat-perf)"; }
    function catEn(key) { return { perf: "Performance", brand: "Brand · Sales", commerce: "Commerce · SEO", growth: "Growth · Automation" }[key] || ""; }
    function categoryHeaderHtml(cat, count) {
      return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin:56px 0 18px">' +
        '<div style="display:flex;align-items:baseline;gap:13px;flex-wrap:wrap">' +
        '<h3 style="margin:0;font-size:clamp(18px,1.9vw,24px);font-weight:700;letter-spacing:-.025em;color:#0a0f24">' + e(cat.name) + '</h3>' +
        '<span class="axmono" style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:' + catColor(cat.key) + ';font-weight:600">' + catEn(cat.key) + '</span>' +
        '</div>' +
        '<span class="axmono" style="font-size:12px;color:var(--mut);font-variant-numeric:tabular-nums;white-space:nowrap">' + (count < 10 ? "0" : "") + count + ' Projects</span>' +
        '</div>';
    }
    function editorialRow(it, n) {
      var co = it.co, p = it.p, ci = it.ci;
      var idx = (n < 10 ? "0" : "") + n;
      var mets = (p.metrics || []).slice(0, 3).map(function (m) { return '<div><span style="font-size:18px;font-weight:700;letter-spacing:-.02em;color:#0a0f24">' + e(m.v) + '</span> <span style="font-size:11.5px;color:var(--mut)">' + e(m.k) + '</span></div>'; }).join("");
      return '<button class="edrow" data-cat="' + it.cat + '" data-ax-proj="' + ci + '-' + it.pi + '" style="display:grid;grid-template-columns:46px 1fr 232px;gap:clamp(20px,3vw,40px);align-items:start;width:100%;text-align:left;border:0;border-top:1px solid var(--line);background:transparent;cursor:pointer;padding:30px 0">' +
        '<div class="edidx" style="font-size:14px;font-weight:500;color:#a3a1a8;font-variant-numeric:tabular-nums;padding-top:6px">' + idx + '</div>' +
        '<div style="min-width:0">' +
        '<div class="edttl" style="font-size:clamp(19px,2.1vw,26px);font-weight:600;letter-spacing:-.03em;line-height:1.24;color:#0a0f24">' + e(p.title) + '</div>' +
        '<div style="margin-top:10px;font-size:12.5px;color:var(--mut)"><span style="color:#0a0f24;font-weight:600">' + e(co.name) + '</span>' + (co.role ? ' · ' + e(co.role) : '') + '</div>' +
        (p.desc ? '<p style="margin:13px 0 0;font-size:13.5px;line-height:1.68;color:var(--sub);max-width:52ch">' + e(p.desc) + '</p>' : '') +
        (mets ? '<div style="margin-top:15px;display:flex;flex-wrap:wrap;gap:22px">' + mets + '</div>' : '') +
        '</div>' +
        caseThumbEd(co, ci, p) +
        '</button>';
    }
    function projectModalHtml(ci, pi) {
      var co = (D.companies || [])[ci]; if (!co) return "";
      var p = (co.projects || [])[pi]; if (!p) return "";
      var cat = catOf(projCategory(p)), acc = cat.acc;
      var hm = (p.metrics || []).slice(0, 4).map(function (m) { return '<div><div style="font-size:26px;font-weight:800;letter-spacing:-.03em;color:#fff">' + e(m.v) + '</div><div style="font-size:12px;color:var(--substrong);margin-top:2px">' + e(m.k) + '</div></div>'; }).join("");
      var pb = function (en, kr, col, txt) { return txt ? '<div style="background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:15px 17px"><div class="axmono" style="font-size:10.5px;letter-spacing:.1em;color:' + col + ';margin-bottom:6px;font-weight:700">' + en + ' · ' + kr + '</div><p style="margin:0;font-size:14px;line-height:1.65;color:var(--substrong)">' + e(txt) + '</p></div>' : ''; };
      var par = (p.problem || p.action || p.result) ? '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px;margin:0 0 18px">' + pb('CHALLENGE', '과제', '#e0436a', p.problem) + pb('SOLUTION', '실행', acc[0], p.action) + pb('RESULTS', '성과', '#1f8f6f', p.result) + '</div>' : '';
      var tgs = (p.tags || []).map(function (t) { return '<span class="axmono" style="font-size:11.5px;padding:5px 11px;border-radius:999px;background:var(--chip);color:var(--sub)">' + e(t) + '</span>'; }).join("");
      var media = mediaGrid(p.links, p.media);
      var body = par + (tgs ? '<div style="display:flex;flex-wrap:wrap;gap:6px' + (media ? ';margin-bottom:14px' : '') + '">' + tgs + '</div>' : '') + media;
      var bodyPad = 'padding:22px clamp(22px,4vw,40px) 32px;overflow-y:auto;flex:1 1 auto;min-height:0';
      var bodyHtml = body.replace(/\s/g, "") ? '<div style="' + bodyPad + '">' + body + '</div>' : ((p.desc || hm) ? '' : '<div style="' + bodyPad + '"><p style="margin:0;font-size:13.5px;color:var(--mut)">상세 케이스는 준비 중입니다.</p></div>');
      return '<div style="background:var(--surface);border:1px solid var(--line);border-radius:18px;max-width:min(860px,94vw);max-height:88vh;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.7);text-align:left;display:flex;flex-direction:column">' +
        '<div style="background:linear-gradient(150deg,' + acc[0] + ',' + acc[1] + ');color:#fff;padding:28px clamp(22px,4vw,40px) 26px">' +
        '<div class="axmono" style="font-size:11px;letter-spacing:.16em;color:rgba(255,255,255,.78);margin-bottom:12px">' + e(cat.name) + '</div>' +
        '<div style="font-size:clamp(20px,2.6vw,28px);font-weight:800;letter-spacing:-.02em;line-height:1.28">' + e(p.title) + '</div>' +
        '<div style="font-size:12.5px;color:rgba(255,255,255,.85);margin-top:7px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span style="font-weight:700">' + e(co.name) + '</span>' + (co.role ? '<span style="opacity:.6">·</span><span>' + e(co.role) + '</span>' : '') + (p.period ? '<span style="opacity:.6">·</span><span>' + e(p.period) + '</span>' : '') + '</div>' +
        (p.desc ? '<p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:rgba(255,255,255,.92);max-width:64ch">' + e(p.desc) + '</p>' : '') +
        (hm ? '<div style="display:flex;flex-wrap:wrap;gap:clamp(20px,4vw,40px);margin-top:20px;padding-top:18px;border-top:1px solid var(--lstrong)">' + hm + '</div>' : '') +
        '</div>' +
        bodyHtml +
        '</div>';
    }
    function boardPanel(cat, its) {
      var col = catColor(cat.key);
      var sm = [];
      its.forEach(function (it) { var m = (it.p.metrics || [])[0]; if (m && sm.length < 3) sm.push(m); });
      if (sm.length < 3) its.forEach(function (it) { (it.p.metrics || []).slice(1).forEach(function (m) { if (sm.length < 3) sm.push(m); }); });
      var metsHtml = sm.map(function (m) { return '<div><div style="font-size:19px;font-weight:800;letter-spacing:-.03em;color:' + col + '">' + e(m.v) + '</div><div style="font-size:10.5px;color:var(--mut);margin-top:1px">' + e(m.k) + '</div></div>'; }).join("");
      var rows = its.slice(0, 4).map(function (it) { var p = it.p, m0 = (p.metrics || [])[0]; return '<button class="bpr" data-ax-proj="' + it.ci + '-' + it.pi + '"><span style="flex:1;min-width:0;font-size:13.5px;font-weight:600;color:#0a0f24;line-height:1.4">' + e(p.title) + '</span><span style="font-size:11.5px;color:var(--mut);white-space:nowrap">' + e(it.co.name) + '</span>' + (m0 ? '<span style="font-size:13px;font-weight:700;color:' + col + ';white-space:nowrap">' + e(m0.v) + '</span>' : '') + '</button>'; }).join("");
      var more = its.length > 4 ? '<button data-ax-projcat="' + cat.key + '" style="margin-top:11px;align-self:flex-start;font-size:12.5px;font-weight:700;color:' + col + ';background:transparent;border:0;cursor:pointer;padding:2px 0">+ ' + (its.length - 4) + '개 더 · 전체 보기 →</button>' : '';
      return '<div class="bp"><div style="display:flex;align-items:baseline;gap:10px;margin-bottom:2px"><span style="font-size:16px;font-weight:700;letter-spacing:-.02em;color:#0a0f24">' + e(cat.name) + '</span><span class="axmono" style="font-size:10px;letter-spacing:.13em;color:' + col + ';font-weight:600">' + catEn(cat.key) + '</span><span class="axmono" style="font-size:11.5px;color:var(--mut);margin-left:auto">' + its.length + '</span></div>' + (metsHtml ? '<div style="display:flex;gap:18px;padding:8px 0 12px;border-bottom:1px solid var(--line2);margin-bottom:4px">' + metsHtml + '</div>' : '') + rows + more + '</div>';
    }
    var CAM = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
    var PLAYIC = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="display:block"><path d="M8 5v14l11-7z"></path></svg>';
    function caseThumb(co, ci, p) {
      var imgFromMedia = null; (p.media || []).some(function (m) { if (m.url && (m.type === "image" || !m.type)) { imgFromMedia = m.url; return true; } });
      var ytFirst = null; if (!imgFromMedia) (p.links || []).some(function (l) { var y = ytId(l.url); if (y) { ytFirst = y; return true; } });
      var img = imgFromMedia || (ytFirst ? "https://img.youtube.com/vi/" + ytFirst + "/hqdefault.jpg" : null);
      var isVideo = !imgFromMedia && !!ytFirst;
      var imgN = 0; (p.media || []).forEach(function (m) { if (m.url && (m.type === "image" || !m.type)) imgN++; });
      var vidN = 0; (p.links || []).forEach(function (l) { if (ytId(l.url)) vidN++; });
      var total = imgN + vidN;
      var ic = (vidN && !imgN) ? PLAYIC : CAM;
      var word = (vidN && !imgN) ? "clips" : (imgN && !vidN) ? "photos" : "media";
      var badge = total > 0 ? '<div style="position:absolute;top:10px;left:10px;z-index:3;display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;background:rgba(0,0,0,.6);color:#fff;font-size:11px;font-weight:600">' + ic + '<span>' + total + ' ' + word + '</span></div>' : '';
      var play = isVideo ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:3"><span style="width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.35)"><span style="border-left:14px solid #fff;border-top:9px solid transparent;border-bottom:9px solid transparent;margin-left:4px"></span></span></div>' : '';
      if (img) return '<div class="pthumb">' + badge + play + '<span style="position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(5,6,13,.5),transparent 55%)"></span><img src="' + e(img) + '" loading="lazy" alt=""></div>';
      var acc = coAccent(co, ci);
      return '<div class="pthumb" style="background:linear-gradient(150deg,' + acc[0] + ',' + acc[1] + ')">' + badge + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center"><span style="font-size:clamp(16px,1.7vw,21px);font-weight:800;letter-spacing:-.02em;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.35)">' + e(co.name) + '</span></div></div>';
    }
    function projectCard(it) {
      var co = it.co, p = it.p, cc = catColor(it.cat);
      var mets = (p.metrics || []).slice(0, 2).map(function (m) { return '<span class="axmono" style="font-size:11px;padding:4px 10px;border-radius:999px;border:1px solid var(--line4);background:var(--panel);color:' + cc + ';white-space:nowrap">' + e(m.v) + ' <span style="color:var(--sub)">' + e(m.k) + '</span></span>'; }).join("");
      return '<button class="pcard" data-ax-proj="' + it.ci + '-' + it.pi + '">' +
        caseThumb(co, it.ci, p) +
        '<div style="padding:16px 8px 8px;display:flex;flex-direction:column">' +
        '<div class="pcta axmono" style="display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;margin-bottom:12px">' +
        '<span style="color:' + cc + ';font-weight:600">' + e(catEn(it.cat)) + '</span>' +
        '<span style="color:var(--mut);font-weight:600">VIEW CASE STUDY <span>&rarr;</span></span>' +
        '</div>' +
        '<div style="font-size:19px;font-weight:700;letter-spacing:-.02em;line-height:1.32;color:var(--ink)">' + e(p.title) + '</div>' +
        '<div style="margin-top:8px;font-size:12.5px;color:var(--sub)"><span style="color:var(--substrong);font-weight:600">' + e(co.name) + '</span>' + (co.role ? ' · ' + e(co.role) : '') + '</div>' +
        (p.desc ? '<p style="margin:12px 0 0;font-size:13px;line-height:1.65;color:var(--sub);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + e(p.desc) + '</p>' : '') +
        (mets ? '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:14px">' + mets + '</div>' : '') +
        '</div></button>';
    }
    function cases2() {
      var cos = D.companies || [];
      var items = [];
      cos.forEach(function (co, ci) { (co.projects || []).forEach(function (p, pi) { items.push({ co: co, ci: ci, p: p, pi: pi, cat: projCategory(p) }); }); });
      if (!items.length) return '<section style="padding:80px 0;color:var(--mut)">등록된 프로젝트가 없습니다.</section>';
      var ncomp = cos.filter(function (c) { return (c.projects || []).length; }).length;
      var avail = CATS.filter(function (cat) { return items.some(function (it) { return it.cat === cat.key; }); });
      var activeKey = (st.projCat && avail.some(function (c) { return c.key === st.projCat; })) ? st.projCat : "__all";
      var tabDefs = [{ key: "__all", name: "전체" }].concat(avail.map(function (c) { return { key: c.key, name: c.name }; }));
      var tabs = tabDefs.map(function (td) {
        var on = td.key === activeKey;
        return '<button class="axtab" data-ax-projcat="' + td.key + '" style="font-size:13.5px;font-weight:600;padding:9px 17px;border-radius:999px;cursor:pointer;' + (on ? 'background:linear-gradient(120deg,#2f6bff,#9b5cff);color:#fff;border:1px solid transparent;box-shadow:0 10px 24px -12px rgba(90,120,255,.7)' : 'background:var(--panel);color:var(--sub);border:1px solid var(--line5)') + '">' + e(td.name) + '</button>';
      }).join("");
      var shown = activeKey === "__all" ? items : items.filter(function (it) { return it.cat === activeKey; });
      var cards = shown.map(function (it) { return projectCard(it); }).join("");
      var badge = '<div style="display:inline-flex;padding:2px;border-radius:12px 26px 26px 12px;background:linear-gradient(to right,rgba(47,107,255,.55),rgba(155,92,255,.55));margin-bottom:22px"><span style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:10px 24px 24px 10px;background:var(--badgeinner);font-size:13px;font-weight:600;color:var(--ink)">My Work <span style="font-size:14px">🚀</span></span></div>';
      return '<section id="cases" style="padding:44px 0 96px">' +
        '<div style="max-width:1200px;margin:0 auto">' +
        badge +
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap">' +
        '<h2 style="margin:0;font-size:clamp(30px,4.2vw,52px);font-weight:800;letter-spacing:-.03em;line-height:1.02;color:var(--ink)">진행한 프로젝트<span style="color:var(--accent)">.</span></h2>' +
        '<div class="axmono" style="text-align:right;font-size:12px;color:var(--faint2);line-height:1.7;white-space:nowrap">2017 — 현재<br>' + items.length + ' Projects · ' + ncomp + ' Companies</div>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 32px">' + tabs + '</div>' +
        '<div class="pgrid" style="animation:axfade .35s">' + cards + '</div>' +
        '</div></section>';
    }

    function view() { return st.view === "cases" ? cases2() : st.view === "resume" ? resume() : st.view === "ax" ? ax() : home(); }

    function render() {
      root.innerHTML = nav() + view() + footer();
      if (st.view === "home") { startStats(); startFlow(); }
      if (st.view === "ax") { syncAxFrame(); }
    }

    function syncAxFrame() {
      var f = document.getElementById("ax-embed-frame"); if (!f) return;
      var maxH = 0, tries = 0;
      function fit() {
        if (!document.body.contains(f)) return;
        try {
          var d = f.contentWindow && f.contentWindow.document;
          var h = d ? Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0) : 0;
          if (h > maxH) { maxH = h; f.style.height = h + "px"; }
        } catch (e) {}
        if (++tries < 140) setTimeout(fit, 400);
      }
      f.addEventListener("load", function () { tries = 0; fit(); });
      fit();
    }

    // ---- animations ----
    function startStats() {
      st.statT = 0; var start = performance.now(), dur = 1300;
      function tick(now) { var t = Math.min(1, (now - start) / dur); st.statT = 1 - Math.pow(1 - t, 3); document.querySelectorAll(".ax-stat").forEach(function (el) { el.textContent = animNum(el.getAttribute("data-raw")); }); if (t < 1) requestAnimationFrame(tick); }
      requestAnimationFrame(tick);
    }
    var flowRAF = null;
    function startFlow() {
      var el = document.getElementById("ax-flow"); if (!el) return; if (flowRAF) cancelAnimationFrame(flowRAF);
      var ctx = el.getContext("2d");
      function fit() { var w = el.parentNode ? el.parentNode.clientWidth : 640, h = Math.max(280, Math.min(360, w * 0.5)); var dpr = window.devicePixelRatio || 1; el.width = w * dpr; el.height = h * dpr; el.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); el._w = w; el._h = h; }
      fit(); window.addEventListener("resize", fit);
      var FL = D.flow || [];
      function draw(now) {
        var W = el._w, H = el._h, time = now / 1000; ctx.clearRect(0, 0, W, H); var _l = curTheme() === "light", CIL = _l ? "#d7deea" : "rgba(255,255,255,.18)", CLB = _l ? "#9aa2b3" : "rgba(255,255,255,.34)";
        var Nn = Math.max(2, FL.length), T = 13, pt = (time % T) / T, stage = Math.min(Nn - 1, Math.floor(pt * Nn));
        var m = Math.max(36, W * 0.04), baseY = H - 60, xs = []; for (var i = 0; i < Nn; i++) xs.push(m + i * (W - 2 * m) / (Nn - 1 || 1));
        ctx.lineWidth = 2; ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(xs[0], baseY); ctx.lineTo(xs[Nn - 1], baseY); ctx.stroke();
        var px = m + pt * (W - 2 * m); ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(xs[0], baseY); ctx.lineTo(px, baseY); ctx.stroke();
        ctx.save(); ctx.shadowColor = "rgba(58,86,212,.65)"; ctx.shadowBlur = 14; ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(px, baseY, 5.5, 0, 7); ctx.fill(); ctx.restore();
        ctx.textAlign = "center";
        for (var j = 0; j < Nn; j++) { var on = j === stage, done = j < stage; if (on) { var r = 9 + 3 * Math.sin(time * 4); ctx.strokeStyle = "rgba(58,86,212,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(xs[j], baseY, r + 4, 0, 7); ctx.stroke(); } ctx.fillStyle = on ? BLUE : done ? INK : (_l ? "#ffffff" : "#0b1020"); ctx.strokeStyle = on ? BLUE : done ? INK : CIL; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(xs[j], baseY, 6, 0, 7); ctx.fill(); ctx.stroke(); ctx.font = "600 10px 'IBM Plex Mono',monospace"; ctx.fillStyle = on ? BLUE : CLB; ctx.fillText((FL[j] && FL[j].num) || "", xs[j], baseY + 24); }
        var big = FL[stage] || {}; ctx.globalAlpha = 0.06; ctx.font = "700 clamp(40px,7vw,84px) 'IBM Plex Mono',monospace"; ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText((big.title || "").slice(0, 14), W / 2, H / 2); ctx.globalAlpha = 1;
        document.querySelectorAll("[data-flow-step]").forEach(function (fe) { var on2 = Number(fe.dataset.flowStep) === stage; fe.style.borderTopColor = on2 ? BLUE : LINE; var t = fe.querySelector("[data-flow-title]"); if (t) t.style.color = on2 ? INK : "var(--mut)"; });
        flowRAF = requestAnimationFrame(draw);
      }
      flowRAF = requestAnimationFrame(draw);
    }
    // rotating hero word
    setInterval(function () { if (st.view !== "home") return; var el = document.getElementById("ax-rot"); if (!el) return; el.style.opacity = "0"; el.style.transform = "translateY(12px)"; setTimeout(function () { st.rotIdx = (st.rotIdx + 1) % (D.rotWords.length || 1); el.textContent = D.rotWords[st.rotIdx] || ""; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, 320); }, 2600);
    // scroll progress
    (function loop() { var b = document.body, dd = document.documentElement; var el = document.getElementById("scroll-progress"); if (el) { var top = b.scrollTop || dd.scrollTop || window.scrollY; var max = Math.max(dd.scrollHeight - dd.clientHeight, 1); el.style.width = (top / max * 100).toFixed(2) + "%"; } requestAnimationFrame(loop); })();

    // ---- interactions (event delegation) ----
    document.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-ax-view],[data-ax-co],[data-ax-co-idx],[data-ax-chip],[data-ax-pipe],[data-ax-loop],[data-ax-cat],[data-ax-company],[data-ax-proj],[data-ax-projcat],[data-ax-theme]"); if (!t) return;
      if (t.hasAttribute("data-ax-view")) { st.view = t.getAttribute("data-ax-view"); st.active = null; window.scrollTo(0, 0); render(); }
      else if (t.hasAttribute("data-ax-co")) { var n = (D.companies || []).length || 1; st.sliding = true; render(); var dir = t.getAttribute("data-ax-co") === "next" ? 1 : -1; setTimeout(function () { st.companyIdx = ((st.companyIdx + dir) % n + n) % n; st.sliding = false; render(); }, 200); }
      else if (t.hasAttribute("data-ax-co-idx")) { st.companyIdx = +t.getAttribute("data-ax-co-idx"); render(); }
      else if (t.hasAttribute("data-ax-chip")) { var lb = t.getAttribute("data-ax-chip"); st.active = st.active === lb ? null : lb; if (st.view === "home") st.view = "cases"; render(); }
      else if (t.hasAttribute("data-ax-pipe")) { st.pipeIdx = +t.getAttribute("data-ax-pipe"); render(); }
      else if (t.hasAttribute("data-ax-loop")) { st.loopIdx = +t.getAttribute("data-ax-loop"); render(); }
      else if (t.hasAttribute("data-ax-cat")) { var cv = t.getAttribute("data-ax-cat"); st.axCat = cv === "__all" ? null : cv; render(); }
      else if (t.hasAttribute("data-ax-company")) { modalOpen(companyModalHtml(+t.getAttribute("data-ax-company"))); }
      else if (t.hasAttribute("data-ax-proj")) { var pp = t.getAttribute("data-ax-proj").split("-"); modalOpen(projectModalHtml(+pp[0], +pp[1])); }
      else if (t.hasAttribute("data-ax-projcat")) { st.projCat = t.getAttribute("data-ax-projcat"); render(); }
      else if (t.hasAttribute("data-ax-theme")) { setTheme(curTheme() === "light" ? "dark" : "light"); }
    });

    // ---- media modal (영상 임베드 / 이미지 라이트박스) ----
    function modalOpen(html) { var m = document.getElementById("ax-modal"), b = document.getElementById("ax-modal-body"); if (!m || !b) return; b.innerHTML = html; m.style.display = "flex"; document.body.style.overflow = "hidden"; }
    function modalClose() { var m = document.getElementById("ax-modal"), b = document.getElementById("ax-modal-body"); if (!m) return; m.style.display = "none"; if (b) b.innerHTML = ""; document.body.style.overflow = ""; }
    document.addEventListener("click", function (ev) {
      var v = ev.target.closest("[data-ax-video]"), im = ev.target.closest("[data-ax-img]");
      if (v) { modalOpen('<div style="position:relative;width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 20px 60px rgba(0,0,0,.5)"><iframe src="https://www.youtube.com/embed/' + v.getAttribute("data-ax-video") + '?autoplay=1&rel=0" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay;encrypted-media;fullscreen" allowfullscreen></iframe></div>'); return; }
      if (im) { var it = im.getAttribute("title") || ""; modalOpen('<figure style="margin:0;background:var(--surface);border:1px solid var(--line5);border-radius:16px;padding:16px 16px 12px;box-shadow:0 24px 70px rgba(0,0,0,.7);max-width:min(1040px,92vw);max-height:88vh;display:flex;flex-direction:column;align-items:center"><img src="' + im.getAttribute("data-ax-img") + '" style="display:block;max-width:100%;max-height:78vh;width:auto;height:auto;object-fit:contain;border-radius:9px">' + (it ? '<figcaption class="axmono" style="text-align:center;font-size:12px;color:var(--sub);margin-top:11px;max-width:100%">' + e(it) + '</figcaption>' : '') + '</figure>'); return; }
      if (ev.target.id === "ax-modal" || ev.target.id === "ax-modal-close") modalClose();
    });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") modalClose(); });

    try { if (localStorage.getItem("axtheme") === "light") document.documentElement.setAttribute("data-theme", "light"); } catch (e) {}
    applyThemeVars();
    render();
  }

  /* ====================== 6) Klio 마케팅 포트폴리오 (원페이지 · DB주도) ====================== */
  // klio.framer.website UI. draft-f-klio.html 디자인을 데이터 주도로. 데이터는 renderAX와 동일한 doc(d) 사용.
  function renderKlio(d) {
    var P = d.profile || {};
    var fmt = function (s) { return s ? String(s).slice(0, 7).replace("-", ".") : ""; };
    var wPeriod = function (w) { var a = fmt(w.startDate), b = w.endDate ? fmt(w.endDate) : "현재"; return a ? (a + " – " + b) : (w.endDate ? b : ""); };
    var coPeriod = function (co) { if (co.periodText) return co.periodText; var a = fmt(co.startDate), b = co.endDate ? fmt(co.endDate) : "재직중"; return a ? (a + " — " + b) : (co.endDate ? b : ""); };
    var dispName = function (co) { return co.useService ? (co.serviceKo || co.serviceEn || co.nameKo || co.nameEn || "") : (co.nameKo || co.nameEn || ""); };
    var yearOf = function (w) { return String(w.endDate || w.startDate || "").slice(0, 4); };

    var companies = d.companies || [];
    var works = [];
    companies.forEach(function (co) { (co.works || []).forEach(function (w) { works.push({ co: co, w: w }); }); });

    var PAL = ["var(--mint)", "var(--beige)", "var(--sand)", "var(--lav)", "var(--coral)"];
    var CATMETA = {
      "퍼포먼스": { en: "Performance", c: "var(--lav)" }, "성과": { en: "Data", c: "var(--mint)" },
      "브랜딩": { en: "Branding", c: "var(--coral)", dark: true }, "커머스": { en: "Commerce", c: "var(--sand)" },
      "콘텐츠": { en: "Content", c: "var(--beige)" }, "그로스": { en: "Growth", c: "var(--mint)" },
      "영상": { en: "Film", c: "var(--beige)" }, "CRM": { en: "CRM", c: "var(--lav)" },
      "제휴": { en: "Partnership", c: "var(--sand)" }, "AX": { en: "AX", c: "var(--coral)", dark: true }
    };
    var catMeta = function (cat) { if (CATMETA[cat]) return CATMETA[cat]; var i = 0, s = String(cat || ""); for (var k = 0; k < s.length; k++) i += s.charCodeAt(k); return { en: (cat || "Work"), c: PAL[i % PAL.length] }; };
    var catIcon = function (cat) {
      var cm = catMeta(cat), m = cm.en, st = cm.dark ? "#fff" : "#222";
      var S = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="' + st + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
      if (/Performance|Growth/.test(m)) return S('<path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6"/>');
      if (/Data|CRM/.test(m)) return S('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>');
      if (/Content|Film/.test(m)) return S('<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M10 9.5l5 2.5-5 2.5z"/>');
      if (/Commerce/.test(m)) return S('<path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M8.5 8V6.8a3.5 3.5 0 0 1 7 0V8"/>');
      if (/Branding/.test(m)) return S('<path d="M12 20s-7-4.6-9.2-9C1.2 7.6 3.6 4.5 6.8 4.5c2 0 3.7 1.2 5.2 3 1.5-1.8 3.2-3 5.2-3 3.2 0 5.6 3.1 4 6.5C19 15.4 12 20 12 20z"/>');
      if (/AX/.test(m)) return S('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>');
      if (/Partnership/.test(m)) return S('<path d="M9 12a3 3 0 0 1 0-4l2-2a3 3 0 0 1 4 4M15 12a3 3 0 0 1 0 4l-2 2a3 3 0 0 1-4-4"/>');
      return S('<path d="M12 3l2.4 5.6L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-.4z"/>');
    };

    // ── HOME
    var nameEn = P.nameEn || P.nameKo || "";
    var initials = (nameEn.split(/\s+/).map(function (x) { return x[0] || ""; }).join("") || "JK").slice(0, 2).toUpperCase();
    var siteUrl = "https://kimjinsoo-mkt-ax.vercel.app";
    var orbit = (nameEn.toUpperCase() + " · MARKETER · ").replace(/ /g, "&#160;");
    var sents = (P.summary || "").split(/(?<=다\.)\s+/).filter(Boolean);
    var tagline = P.tagline || P.title || "";
    var mainH1 = "저는 " + esc(P.nameKo || nameEn) + " — " + esc(tagline) + (/[.。]$/.test(tagline) ? "" : ".");
    var dimH1 = esc(sents[0] || "");
    var home = '<header class="home" id="home">'
      + '<div class="rv"><div class="sig">' + esc(nameEn) + '</div>'
      + '<div class="meta"><span>' + esc(P.location || "Seoul, Korea") + '</span>'
      + (P.email ? '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>' : '')
      + '<a href="' + siteUrl + '" target="_blank" rel="noopener">' + siteUrl.replace(/^https?:\/\//, "") + '</a></div></div>'
      + '<div class="cnt"><div class="photo rv" style="--d:80ms"><div class="card"><b>' + esc(initials) + '</b></div>'
      + '<svg class="orbit" viewBox="0 0 150 150" aria-hidden="true"><defs><path id="orb" d="M75,75 m-63,0 a63,63 0 1,1 126,0 a63,63 0 1,1 -126,0"/></defs><text><textPath href="#orb">' + orbit + '</textPath></text></svg></div>'
      + '<h1 class="rv" style="--d:160ms">' + mainH1 + ' <span class="dim">' + dimH1 + '</span></h1></div></header>';

    // ── ABOUT
    var half = Math.ceil(sents.length / 2);
    var ab1 = esc(sents.slice(0, half).join(" ")), ab2 = esc(sents.slice(half).join(" "));
    var about = '<section class="row" id="about"><h2 class="rv">About</h2><div class="cnt about">'
      + '<p class="rv">' + ab1 + '</p>' + (ab2 ? '<p class="g rv">' + ab2 + '</p>' : '') + '</div></section>';

    // ── PROJECTS (모자이크 — 대표작 5)
    var feat = works.filter(function (x) { return x.w.featured; });
    var featM = feat.filter(function (x) { return (x.w.metrics || []).length; });
    var pick = (featM.length >= 5 ? featM : feat.length ? feat : works).slice(0, 5);
    var mosaic = pick.map(function (x, i) {
      var w = x.w, co = x.co, cm = catMeta(w.category);
      var span = i === 1 ? " tall" : (i === 3 || i === 4) ? " wide" : "";
      var dark = cm.dark ? " dark" : "";
      var m0 = (w.metrics || [])[0];
      var kp = m0 ? '<span class="kp">' + esc(m0.value || m0.label || "") + '</span>' : '';
      var icon = (span === " wide")
        ? '<span class="duo" aria-hidden="true">' + catIcon(w.category) + '<i' + (cm.dark ? '' : ' style="background:rgba(34,34,34,.3)"') + '></i>' + catIcon(w.category) + '</span>'
        : catIcon(w.category);
      return '<div class="tile' + span + dark + ' rv" style="background:' + cm.c + '">' + icon + kp
        + '<span class="lb"><b>' + esc(w.title) + '</b><span>' + esc(cm.en) + ' · ' + esc(dispName(co)) + ' ' + esc(yearOf(w)) + '</span></span></div>';
    }).join("");
    var projects = '<section class="row" id="projects"><h2 class="rv">Projects</h2><div class="cnt"><div class="mosaic">' + mosaic + '</div></div></section>';

    // ── EXPERIENCE (+ 스탯)
    var expSorted = companies.filter(function (c) { return (c.works || []).length; }).slice()
      .sort(function (a, b) { return String(b.startDate || "").localeCompare(String(a.startDate || "")); });
    var exp = expSorted.map(function (co) {
      var svc = (co.serviceKo || co.serviceEn) ? " — " + esc(co.serviceKo || co.serviceEn) : "";
      return '<div class="ent rv"><h3>' + esc(co.role || dispName(co)) + '</h3>'
        + '<p class="sub">' + esc(co.nameKo || co.nameEn) + svc + '<br>' + esc(coPeriod(co)) + '</p>'
        + (co.summary ? '<p class="d">' + esc(co.summary) + '</p>' : '') + '</div>';
    }).join("");
    var hs = (d.highlights || []).slice(0, 3).map(function (h) {
      return '<div class="dcard"><h4 data-count="' + esc(String(h.value).replace(/[^0-9]/g, "")) + '">' + esc(h.value) + '</h4><p>' + esc(h.label) + '</p></div>';
    }).join("");
    var experience = '<section class="row" id="experience"><h2 class="rv">Experience</h2><div class="cnt">' + exp
      + (hs ? '<div class="cards3 mt rv">' + hs + '</div>' : '') + '</div></section>';

    // ── ARCHIVE (전체 작업)
    var CATORDER = ["AX", "그로스", "성과", "퍼포먼스", "콘텐츠", "영상", "브랜딩", "커머스", "제휴", "CRM"];
    var arSorted = works.slice().sort(function (a, b) {
      var ca = CATORDER.indexOf(a.w.category), cb = CATORDER.indexOf(b.w.category);
      if (ca < 0) ca = 99; if (cb < 0) cb = 99;
      if (ca !== cb) return ca - cb;
      return String(b.w.startDate || "").localeCompare(String(a.w.startDate || ""));
    });
    var arch = arSorted.map(function (x) {
      var w = x.w, co = x.co, cm = catMeta(w.category);
      var links = (w.links || []).map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || "link") + '</a>'; }).join("");
      var desc = w.detail || w.summary || "";
      return '<div class="ent rv"><h3>' + esc(w.title) + '</h3><p class="sub">' + esc(cm.en) + ' · ' + esc(dispName(co)) + ' — ' + esc(wPeriod(w)) + '</p>'
        + (desc ? '<p class="d">' + esc(desc) + '</p>' : '') + (links ? '<div class="links">' + links + '</div>' : '') + '</div>';
    }).join("");
    var archive = '<section class="row arch" id="archive"><h2 class="rv">Archive</h2><div class="cnt">' + arch + '</div></section>';

    // ── TECHSTACK (마퀴 3행)
    var toolset = []; works.forEach(function (x) { (x.w.stack || []).forEach(function (t) { if (t && toolset.indexOf(t) < 0) toolset.push(t); }); });
    var stitles = (P.stack || []).map(function (s) { return s.title; });
    var caps = (d.capabilities || []).filter(function (c) { return c.visible !== false; }).map(function (c) { return c.label; });
    var allTech = toolset.concat(stitles).concat(caps);
    var mqRow = function (items, rev) {
      if (!items.length) return "";
      var one = items.map(function (t, i) { return '<span class="' + (i % 2 ? "on" : "") + '">' + esc(t) + '</span>'; }).join("");
      var dup = items.map(function (t, i) { return '<span class="dup ' + (i % 2 ? "on" : "") + '">' + esc(t) + '</span>'; }).join("");
      return '<div class="mq' + (rev ? " rev" : "") + '"><div class="tk">' + one + dup + '</div></div>';
    };
    var t3 = Math.ceil(allTech.length / 3) || 1;
    var techstack = '<section class="row" id="techstack"><h2 class="rv">Techstack</h2><div class="cnt stack-rows rv">'
      + mqRow(allTech.slice(0, t3), false) + mqRow(allTech.slice(t3, t3 * 2), true) + mqRow(allTech.slice(t3 * 2), false) + '</div></section>';

    // ── SKILLS (역량별 프로젝트 수)
    var catCount = {}; works.forEach(function (x) { var c = x.w.category || "기타"; catCount[c] = (catCount[c] || 0) + 1; });
    var catArr = Object.keys(catCount).map(function (k) { return { cat: k, n: catCount[k] }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 6);
    var skRows = "";
    for (var si = 0; si < catArr.length; si += 3) {
      skRows += '<div class="cards3 rv">' + catArr.slice(si, si + 3).map(function (o) {
        var cm = catMeta(o.cat);
        return '<div class="dcard"><h4 data-count="' + o.n + '">' + o.n + '</h4><p>' + esc(o.cat) + '<br>' + esc(cm.en) + '</p></div>';
      }).join("") + '</div>';
    }
    var skills = '<section class="row" id="skills"><h2 class="rv">Skills</h2><div class="cnt">' + skRows + '</div></section>';

    // ── CONTACT
    var contact = '<section class="row contact" id="contact"><h2 class="rv">Contact</h2><div class="cnt">'
      + '<h3 class="rv">새 프로젝트나 협업, 채용 문의가 있다면 편하게 연락 주세요.</h3>'
      + '<div class="meta rv"><span>' + esc(P.location || "Seoul, Korea") + '</span>'
      + (P.email ? '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>' : '')
      + (P.phone ? '<a href="tel:' + esc(String(P.phone).replace(/[^0-9]/g, "")) + '">' + esc(P.phone) + '</a>' : '') + '</div>'
      + '<div class="avail rv"><i></i>Available for work</div>'
      + '<div class="socials rv">'
      + (P.email ? '<a href="mailto:' + esc(P.email) + '" aria-label="이메일"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></a>' : '')
      + '<a href="' + siteUrl + '" target="_blank" rel="noopener" aria-label="포트폴리오 사이트"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.7 8.2 12s1.3 6.4 3.8 9"/></svg></a>'
      + (P.phone ? '<a href="tel:' + esc(String(P.phone).replace(/[^0-9]/g, "")) + '" aria-label="전화"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>' : '')
      + '</div></div></section>';

    var dock = '<nav class="dock" aria-label="섹션 이동">'
      + '<a href="#home" data-sec="home">Home</a><a href="#about" data-sec="about">About</a>'
      + '<a href="#projects" data-sec="projects">Projects</a><a href="#experience" data-sec="experience">Experience</a>'
      + '<a href="#archive" data-sec="archive">Archive</a><a href="#techstack" data-sec="techstack">Stack</a>'
      + '<a href="#skills" data-sec="skills">Skills</a><a href="#contact" data-sec="contact">Contact</a></nav>';

    var KCSS = ':root{--ink:#222;--ink50:rgba(34,34,34,.55);--gray:#909090;--light:#d6d6d6;--bd:rgba(144,144,144,.2);--bd2:rgba(144,144,144,.1);--mint:#abdcd1;--beige:#e6e1d5;--sand:#eae6da;--coral:#dd8e6e;--lav:#c3cde4;--font:"Figtree","Pretendard Variable",Pretendard,-apple-system,system-ui,"Apple SD Gothic Neo",sans-serif;--ez:cubic-bezier(.25,.6,.3,1)}'
      + '*,*::before,*::after{box-sizing:border-box}html{scroll-behavior:smooth;overflow-x:clip;-webkit-text-size-adjust:100%;scroll-padding-top:40px}'
      + 'body{margin:0;background:#fff;color:var(--ink);font-family:var(--font);font-size:16px;font-weight:500;line-height:170%;letter-spacing:-.02em;-webkit-font-smoothing:antialiased;overflow-x:clip}'
      + 'h1,h2,h3,h4{margin:0;font-weight:600;letter-spacing:-.02em}p{margin:0}a{color:inherit;text-decoration:none}::selection{background:var(--mint);color:var(--ink)}:focus-visible{outline:2px solid var(--ink);outline-offset:3px}'
      + '.js .rv{opacity:0;transform:translateY(22px);transition:opacity .8s var(--ez),transform .8s var(--ez);transition-delay:var(--d,0ms)}.js .rv.in{opacity:1;transform:none}'
      + '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.js .rv{opacity:1;transform:none;transition:none}}'
      + '.page{max-width:880px;margin:0 auto;padding:0 24px 180px}.row{display:grid;grid-template-columns:1fr 1fr;margin-top:150px}.row>h2{font-size:14px;font-weight:600;line-height:130%}.cnt{max-width:440px}'
      + '@media(max-width:920px){.row{grid-template-columns:1fr;margin-top:104px}.row>h2{margin-bottom:22px}}'
      + '.home{display:grid;grid-template-columns:1fr 1fr;padding-top:88px}.sig{font-family:"Caveat",cursive;font-size:34px;font-weight:600;line-height:1;color:var(--ink)}'
      + '.meta{margin-top:34px;display:flex;flex-direction:column;gap:4px}.meta span,.meta a{font-size:13px;font-weight:500;line-height:160%}.meta a{text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}.meta a:hover{color:var(--gray)}'
      + '.photo{position:relative;width:196px;height:260px}.photo .card{width:196px;height:260px;border-radius:24px;background:var(--mint);display:grid;place-items:center;overflow:hidden}.photo .card b{font-size:56px;font-weight:700;letter-spacing:-.04em;color:var(--ink);transform:translateX(-14px)}'
      + '.photo .orbit{position:absolute;top:50%;right:-98px;width:150px;height:150px;margin-top:-75px;animation:spin 26s linear infinite;pointer-events:none}.photo .orbit text{font-family:var(--font);font-size:12px;font-weight:600;letter-spacing:.42em;fill:var(--ink);text-transform:uppercase}'
      + '@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.photo .orbit{animation:none}}'
      + '.home h1{margin-top:40px;font-size:20px;line-height:150%;max-width:360px}.home h1 .dim{color:var(--gray)}@media(max-width:920px){.home{grid-template-columns:1fr;padding-top:64px}.home .cnt{margin-top:52px}}'
      + '.about p{font-size:16px;line-height:175%}.about p+p{margin-top:22px}.about p.g{color:var(--ink50);font-size:14px}'
      + '.mosaic{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:201px;gap:12px}.tile{position:relative;border-radius:24px;overflow:hidden;display:grid;place-items:center;transition:transform .35s var(--ez)}.tile:hover{transform:translateY(-3px)}.tile.tall{grid-row:span 2}.tile.wide{grid-column:span 2}.tile svg{width:46px;height:46px}.tile.wide svg{width:42px;height:42px}'
      + '.tile .duo{display:flex;align-items:center;gap:26px}.tile .duo i{width:1px;height:44px;background:rgba(255,255,255,.5)}'
      + '.tile .lb{position:absolute;left:18px;bottom:14px;right:18px;line-height:140%}.tile .lb b{display:block;font-size:13px;font-weight:600;letter-spacing:-.01em}.tile .lb span{display:block;font-size:11px;font-weight:500;color:var(--ink50)}.tile.dark .lb b{color:#fff}.tile.dark .lb span{color:rgba(255,255,255,.72)}'
      + '.tile .kp{position:absolute;right:16px;top:14px;font-size:11px;font-weight:600;background:rgba(255,255,255,.72);border-radius:999px;padding:5px 10px;line-height:1}@media(max-width:520px){.mosaic{grid-auto-rows:168px}}'
      + '.ent{padding:44px 0}.ent+.ent{border-top:1px solid var(--bd)}.ent:first-child{padding-top:0}.ent h3{font-size:20px;line-height:130%}.ent .sub{margin-top:6px;font-size:12px;line-height:150%;color:var(--gray)}.ent p.d{margin-top:22px;font-size:14px;line-height:175%;color:var(--ink50)}'
      + '.ent .links{margin-top:12px;display:flex;gap:4px 16px;flex-wrap:wrap}.ent .links a{font-size:12px;font-weight:500;color:var(--ink);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}.ent .links a:hover{color:var(--gray)}'
      + '.arch .ent{padding:30px 0}.arch .ent h3{font-size:17px}.arch .ent p.d{margin-top:12px}'
      + '.cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.cards3.mt{margin-top:64px}.cards3+.cards3{margin-top:16px}.dcard{background:var(--ink);border-radius:32px;min-height:144px;padding:20px;display:flex;flex-direction:column;justify-content:space-between}.dcard h4{font-size:32px;font-weight:600;line-height:1;color:#fff}.dcard p{font-size:12px;line-height:145%;color:var(--light)}@media(max-width:520px){.cards3{grid-template-columns:1fr 1fr}}'
      + '.stack-rows{display:flex;flex-direction:column;gap:26px}.mq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}.mq .tk{display:flex;align-items:center;gap:34px;width:max-content;animation:mqL 34s linear infinite}.mq.rev .tk{animation-name:mqR}.mq:hover .tk{animation-play-state:paused}@keyframes mqL{to{transform:translateX(-50%)}}@keyframes mqR{from{transform:translateX(-50%)}to{transform:translateX(0)}}.mq .tk span{flex-shrink:0;font-size:16px;font-weight:500;color:var(--gray);white-space:nowrap}.mq .tk span.on{color:var(--ink);font-weight:600}'
      + '@media(prefers-reduced-motion:reduce){.mq .tk,.mq.rev .tk{animation:none;flex-wrap:wrap;width:auto}.mq{mask-image:none;-webkit-mask-image:none}.mq .dup{display:none}}'
      + '.contact h3{font-size:20px;line-height:150%;max-width:380px}.contact .meta{margin-top:26px}.avail{margin-top:34px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}.avail i{width:8px;height:8px;border-radius:50%;background:var(--mint)}'
      + '.socials{margin-top:16px;display:flex;gap:10px}.socials a{width:30px;height:30px;border:1px solid var(--bd);border-radius:9px;display:grid;place-items:center;color:var(--ink);transition:.2s}.socials a:hover{background:var(--bd2)}.socials svg{width:15px;height:15px}.foot{margin-top:130px;text-align:center;font-size:12px;color:var(--gray)}'
      + '.dock{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:100;display:flex;gap:3px;padding:7px;border-radius:18px;background:rgba(34,34,34,.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 12px 32px -12px rgba(0,0,0,.4);max-width:calc(100vw - 20px);overflow-x:auto;scrollbar-width:none}.dock::-webkit-scrollbar{display:none}'
      + '.dock a{font-size:12px;font-weight:600;line-height:1;letter-spacing:-.01em;color:rgba(255,255,255,.6);padding:11px 13px;border-radius:11px;white-space:nowrap;transition:.2s var(--ez)}.dock a:hover{color:#fff}.dock a[aria-current="true"]{color:#fff;background:rgba(255,255,255,.16)}';

    var KJS = '(function(){"use strict";var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;'
      + 'var rvs=document.querySelectorAll(".rv");if("IntersectionObserver" in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.05,rootMargin:"9999px 0px -5% 0px"});rvs.forEach(function(el){io.observe(el);});}else{rvs.forEach(function(el){el.classList.add("in");});}'
      + 'var links=document.querySelectorAll(".dock a[data-sec]");if("IntersectionObserver" in window){var nio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.setAttribute("aria-current",a.dataset.sec===e.target.id?"true":"false");});}});},{rootMargin:"-35% 0px -55% 0px"});links.forEach(function(a){var s=document.getElementById(a.dataset.sec);if(s)nio.observe(s);});}'
      + 'function countUp(el){var target=parseInt(el.dataset.count,10);if(!target||reduce)return;var tpl=el.innerHTML,t0=null,dur=900;function step(t){if(!t0)t0=t;var k=Math.min((t-t0)/dur,1);k=1-Math.pow(1-k,3);el.innerHTML=tpl.replace(String(target),String(Math.round(target*k)));if(k<1)requestAnimationFrame(step);else el.innerHTML=tpl;}requestAnimationFrame(step);}'
      + 'if("IntersectionObserver" in window){var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);sio.unobserve(e.target);}});},{threshold:.6});document.querySelectorAll("[data-count]").forEach(function(s){sio.observe(s);});}})();';

    return '<!doctype html><html lang="ko"><head><script>document.documentElement.classList.add("js")<\/script>'
      + '<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>'
      + '<title>' + esc(P.nameKo || nameEn || "포트폴리오") + ' — Marketing Portfolio</title>'
      + '<meta name="description" content="' + esc((tagline || "").replace(/"/g, "")) + '"/><meta name="theme-color" content="#ffffff"/><link rel="icon" href="data:,"/>'
      + '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Caveat:wght@600&display=swap">'
      + '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"/>'
      + '<style>' + KCSS + '</style></head><body>'
      + '<div class="page">' + home + about + projects + experience + archive + techstack + skills + contact
      + '<p class="foot">© ' + new Date().getFullYear() + ' — ' + esc(nameEn || P.nameKo || "") + ', Marketing Portfolio</p></div>'
      + dock + '<script>' + KJS + '<\/script></body></html>';
  }

  /* ---------- doc wrapper ---------- */
  function doc(title, css, body) {
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${FONT}<style>${css}</style></head><body>${body}</body></html>`;
  }

  const TEMPLATES = {
    list: [
      { id: "wanted", name: "원티드형", desc: "경력기술 A4", kind: "resume" },
      { id: "remember", name: "리멤버형", desc: "프로필 A4", kind: "resume" },
      { id: "web", name: "웹 · 미니멀", desc: "원페이지", kind: "web" },
      { id: "ax", name: "AX 마케터", desc: "풀스택·AX 원페이지 SPA", kind: "web" },
      { id: "klio", name: "마케팅 · Klio", desc: "클리오형 원페이지(라벨 레일·모자이크)", kind: "web" }
    ],
    render(d) {
      if (!d || !d.profile) return doc("빈 문서", "", "<p style='font-family:sans-serif;padding:40px;color:#888'>내용이 없습니다.</p>");
      if (d.template === "ax") return renderAX(d);
      if (d.template === "klio") return renderKlio(d);
      if (d.template === "portfolio") return renderPortfolio(d);
      if (d.template === "remember") return renderRemember(d);
      if (d.template === "web") return renderWeb(d);
      return renderWanted(d);
    }
  };
  root.TEMPLATES = TEMPLATES;
})(window);
