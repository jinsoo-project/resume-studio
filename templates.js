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
  // ── 포트폴리오 PPT(김진수_포트폴리오_통합.pptx, 2026-10-04 사용자 제공) 기준 프로젝트 정리 — 페이지·스튜디오 공용 데이터
  //    hide = 숨길 프로젝트 · companies = 회사 날짜 · works = 프로젝트별 PPT 원문(links = 영상·링크 정리본: 공개 영상만 · 실제 유튜브 제목 · 같은 영상 한 번 · 제목·요약·과제(problem)·담당(action)·성과(result), 줄바꿈 = 글머리표 · cols = 칸 이름 · metrics [값, 이름] · media = /pf-img/ppt/ 이미지)
  //    add = PPT에만 있는 프로젝트(카탈로그 · SEO) · 실험 페이지는 DB에 아직 반영 전(klio.migr.pdf1 없음)이면 그릴 때 pptPatch로 적용, 스튜디오 'PDF 내용 반영' 버튼은 같은 데이터를 DB에 씀
  var PPT_IMG = "https://kimjinsoo-mkt-ax.vercel.app/pf-img/ppt/";
  var PPT_PATCH = {"hide": ["944ff76c-037e-4c72-92ac-81f4dcabb366", "c54a836e-546c-4355-b2ac-213c3d444be2", "fd404ac5-7f46-420b-97dc-a2b8e89bc445", "c90c1643-f38b-4f2d-a668-9e0f3c87094a"], "companies": {"9a240366-d8d0-47b3-a1fd-3259532182b3": {"endDate": "2022-04"}}, "works": {"0a3aea35-ccc9-4018-a7a6-e383c303f928": {"title": "UA & 리타게팅 캠페인 최적화", "startDate": "2023-01", "summary": "웹&앱 트래킹을 MMP로 옮기고, 신규 쿠폰팩·리타게팅으로 UA 캠페인 최적화", "problem": "WEB 지면 트래킹의 부재\n매체 & 캠페인별 플래닝의 부재\n성과 & 효율 체크의 많은 리소스 투입", "action": "웹&앱 트래킹 MMP 이관 (Airbridge)\n퍼포먼스 마케팅 현황 파악 및 미디어 믹스 & 플래닝 수립\n웹&앱 회원가입 유도를 위한 신규회원 전용 쿠폰팩 도입\n메타 & 구글애즈 CAC 최적화 캠페인 집행 — 메타 A+A / 수동 리타게팅, 구글애즈 AC\n설치 및 방문 후 이탈 유저 대상 타겟 확장\n서비스 & 매체별 실시간 성과 대시보드 세팅", "result": "평균 CPC 24% 및 신규 CAC 19% 감소\n구매 전환율 17% 증가 및 평균 주문건 수 0.6회 증가\n타캠페인 대비 D+3 평균 리텐션 5% 증가", "metrics": [["−24%", "평균 CPC"], ["−19%", "신규 CAC"], ["+17%", "구매 전환율"]], "media": ["s10_02", "s10_03", "s10_04", "s10_00", "s10_01", "s10_06", "s10_05"]}, "b0aa1d32-82d9-44bc-897d-b558a425c98c": {"title": "CPI 캠페인 운영", "endDate": "2022-04", "summary": "앱 설치 – 전환 목표의 서비스별 CPI 캠페인 최적화 (바비톡 · 멜리즈 · 와그)", "problem": "서비스 및 캠페인별 최적의 CPI를 찾자\niOS 단가의 기준을 찾자\n분석은 쉽고 명확하게 하자", "action": "앱설치 및 인앱 액션 최대화를 위한 전략 수립, KPI 설정\n최대 월 예산 5억 수준의 CPI 캠페인 집행 — Meta, Google, GFA 등 셀프 서브 매체 위주\nUSP에 따른 소재 다양화 > 단가 확인 > 운영 > 최적화 (최근 대체로 숏폼 소재가 성과 우수)\nAndroid / 오가닉 / SKAN 등의 데이터를 조합해 캠페인 효율에 대한 근거 마련\nMMP를 통한 일단위, 매체별 데이터 분석으로 미디어 운영 최적화 및 고도화\n기준에 따라 변하는 수치의 해석을 명확하게 하도록 매체 통합 대시보드 운영", "result": "평균 CPM 3% · CPC 4% · CPI 10% 감소\n서비스별 평균 신규/재방문 관련 주요지표 효율화 및 최적화\n예산의 효율적 활용 워크플로우 기여\n모니터링 및 분석의 효율화 구축", "metrics": [["월 5억", "최대 매체 예산"], ["−10%", "평균 CPI"], ["−4%", "평균 CPC"]], "media": ["s14_00", "s14_01", "s14_04", "s14_08", "s14_02", "s14_05", "s14_06", "s14_03", "s14_07"]}, "574f26d3-1fff-49fb-a302-b8c12253df61": {"title": "대리수술 안심존 캠페인", "category": "브랜딩", "startDate": "2019-08", "endDate": "2019-11", "summary": "바비톡 서비스 인지 및 앱설치 목적으로 기획 & 박나래 맨파워를 활용한 효과 극대화 전략", "problem": "'성형'을 한다고 했을 때 우리를 이용하는 '포인트'를 찾자\n맨파워를 활용해 서비스 인지도와 신뢰감을 주자", "action": "서비스 목표 설정, 캠페인 기획 – 워크플로우 고민 및 세팅\n캠페인 소재 기획 및 촬영\n소재 제작 및 운영을 통한 추가 소재 발굴 & 베리에이션", "result": "타 광고소재 대비 CPI 40% 감소\n'대리수술 안심존' 마크 여부 관련 내부 키워드 증가, 병원별 '안심존' 마크 발급률 상승\n서비스 USP 소구점 발굴 및 소재 베리에이션 및 광고운영 최적화에 기여", "metrics": [["−40%", "CPI (타 소재 대비)"]], "media": ["s20_00", "s20_01", "s20_02", "s20_03"], "links": [{"label": "대리수술 안심존 — 박나래", "url": "https://youtu.be/iPHT8Q3zGqs"}, {"label": "안심존 베리에이션 (쇼츠)", "url": "https://youtube.com/shorts/rt0umjN9M9I"}, {"label": "슬롯머신 영상", "url": "https://youtu.be/--SENDU3YhQ"}, {"label": "1분닥터 + 박나래", "url": "https://youtu.be/LXljX4gaSYQ"}, {"label": "1분닥터 (내레이션)", "url": "https://youtu.be/DrcYWciILec"}]}, "43ab6811-42cf-4a1f-afca-62bfd67b17f9": {"title": "성형 부작용 알리기 캠페인", "startDate": "2021-09", "endDate": "2021-12", "summary": "성형 부작용에 대한 위험성을 알리면서, 바비톡 브랜드 인지도 향상을 위한 캠페인 기획 및 실행", "problem": "성형에 대한 근본적인 부분인 '부작용'에 대해 알리자\n실제 유저를 대상으로 하여 신뢰도를 높이자", "action": "성형 서비스 긍정적 인지도 향상을 위한 브랜딩 캠페인 기획/진행\n서비스, 유저, 오가닉 분석 등을 통한 캠페인 전략 기획\n서비스 이용에 가장 근본적인 부분을 키포인트로 한 컨셉&메시지 도출 — 성형 부작용, ‘나’에게도 일어날 수 있는 일\n브랜드 인지도를 극대화할 수 있는 콘텐츠 및 소재 기획 제작", "result": "내부 '성형 부작용' 관련 키워드 30% 상승\n타캠페인 대비 CPI 30% 감소, 인앱액션 30% 증가\n서비스 내&외부 브랜딩 캠페인 소재로 발전 및 워크플로우 구축\n오가닉 조회수 23만뷰 집계", "metrics": [["−30%", "CPI (타 캠페인 대비)"], ["+30%", "인앱액션"], ["23만", "오가닉 조회"]], "media": ["s19_00", "s19_01", "s19_02", "s19_03", "s19_04"], "links": [{"label": "코 성형 부작용 사연 — 캠페인 영상", "url": "https://youtu.be/rJv83UTiYvw"}]}, "53845c2b-3618-4e8d-968c-1edfabdf4912": {"title": "기부런 '퍼플라이' 캠페인", "startDate": "2021-04", "endDate": "2021-08", "summary": "바비톡 주최, 마라톤 굿즈 수익금을 암환우에게 기부하는 기부런 프로젝트", "problem": "매스한 프로젝트로 '필요할 때' 바비톡을 떠오르게 하자\n맨파워를 활용해 후킹을 하고 직접 참여를 유도하자", "action": "굿즈 및 판매 페이지 기획&세팅\n바비톡 및 캠페인 홍보 목적의 광고 소재 촬영 및 제작\n캠페인 운영 – 굿즈 제작사 협업 & 스토어 세팅 & 배송 및 재고 관리", "result": "굿즈 페이지 오픈 이후 동시접속자 최대 2만 명\n선주문 완판 및 총 1,000개의 재고소진까지 3분 소요\n캠페인 재개 요청 및 바비톡 키워드 30% 증가", "metrics": [["3분", "굿즈 1,000개 완판"], ["2만", "동시접속 최대"], ["+30%", "바비톡 키워드"]], "media": ["s21_00", "s21_01", "s21_02", "s21_03", "s21_04", "s21_05", "s21_06"], "links": [{"label": "퍼플라이 첫 번째 주자 소개", "url": "https://youtu.be/x_hQDxX6DXo"}, {"label": "김민경님 홍보영상", "url": "https://youtu.be/yPTSQnWt-PA"}, {"label": "인사이트 기사", "url": "https://www.insight.co.kr/news/361050"}]}, "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": {"title": "유니버셜 스튜디오 재팬 협업 캠페인", "startDate": "2024-06", "endDate": "2024-12", "summary": "일본 오사카 지역 유니버셜 스튜디오 재팬 세일즈 부스트업을 위한 마케팅 캠페인 집행", "problem": "프로모션 특성상 리소스 대비 일회성으로 소모되는 부분이 많음\n실제 혜택의 대상이 되는 유저의 ARPPU 및 LTV에 대한 고민", "action": "전환 최대화를 위한 전략 수립, KPI 설정\n총 예산 3억 규모의 미디어믹스 작성, 캠페인 집행, 미디어리포트 작성 — Meta, Google AC, NAVER SA 등\n프로모션 기획 — 타겟에 적합한 혜택, 참여하기 쉬운 구조 (혜택과 콘텐츠는 쉽게)\n인플루언서 릴스 콘텐츠 협업, 이벤트 페이지 / 배너 / 소재 제작 및 카피라이팅\n연계상품 혜택으로 자연스러운 업셀링 & 크로스셀링 유도\nMMP를 통한 일단위, 매체별 데이터 분석으로 미디어 운영 최적화", "result": "예상 판매기간 대비 약 2주 빠르게 KPI 달성 (선착순 1,000장 소진 목표)\n평균 CPC, CPM의 200% 효율 달성\n웹 랜딩 캠페인임에도 CPI 캠페인보다 낮은 단가\n캠페인 영상 KPI(유입) 대비 34% 초과 달성 — Imp. 830만 / Click 28만 / CTR 3.45%\nMeta CTR 5% ▲ · Google UAC CPI 15% ▼ · NAVER SA CPC 5% ▼ · KAKAO PF CTR 3% ▲", "metrics": [["2주", "KPI 조기 달성"], ["830만", "영상 노출"], ["3.45%", "영상 CTR"]], "media": ["s16_01", "s16_02", "s16_03", "s18_07", "s18_08", "s18_09", "s18_05", "s18_06", "s18_01", "s18_02", "s18_03", "s18_00", "s18_04", "s18_10", "s18_12", "s18_11"]}, "4d333686-6daa-4c8e-9cd7-3e8309ef9900": {"title": "네이버 쇼핑 운영 최적화", "startDate": "2024-01", "summary": "네이버 쇼핑 영역 상품 노출 및 운영을 위한 세팅 및 피드 최적화 프로젝트", "problem": "상품별 커스텀 노출이 불가능함에 따른 클린위반 케이스 존재\n피드 송수신 시각에 따른 상품 정보의 늦은 업데이트 주기\n피드 생성 시간이 오래 걸려 100% 상품 노출의 어려움", "action": "네이버 쇼핑 지면 상품 노출을 위한 피드 로직 설정 및 연동\n네이버 쇼핑 전용 세팅 페이지 기획, 칼럼값 로직 세팅\n피드 송수신 시간 단축 조정, 내부 상품 정보 업데이트 시간 개선\n피드 생성&완료 시각 리포팅을 통한 원인 파악 및 생성 시간 단축\n상품별 노출 & 클릭 모니터링 지표 세팅, 신규 & 주요 상품별 네이버 쇼핑 영역 활용 마케팅", "result": "주단위 평균 노출상품수 2배 상승\n주단위 평균 Imp 30만 달성, CTR 25% 기록\n네이버 쇼핑 클린위반 건 수 및 대응기간 최소화", "metrics": [["2배", "노출 상품수"], ["30만", "주 평균 Imp"], ["25%", "CTR"]], "media": ["s23_00", "s23_01", "s23_02", "s23_03"]}, "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": {"title": "전사 지표 정립 및 대시보드 세팅", "startDate": "2022-11", "summary": "사내 데이터 모니터링이 가능한 통합 '자동화 대시보드' 구성 프로젝트", "problem": "추정 매출 & 추정 이익 기준 마련 및 소진 비용에 따른 데일리 분석 필요", "action": "전사 지표 확립 및 모니터링 효율화를 위한 대시보드 구축\n서비스 & 비즈니스 & 마케팅 지표의 구분 및 통일화\n일 단위 / 주 단위 / 월 단위의 성과 관리\n실 DB연동 작업 및 광고데이터 작업 연동 진행 (3rd 파티 분석 툴 연동 포함)", "result": "사내 전사 기준 마련 및 가치 판단 리소스 효율화\n효율적인 전사 지표 통합 관리 가능\n팀 내부 및 타 부서간의 공통의 목표 및 상호 공유", "media": ["s26_00", "s26_01"]}, "8fe4e187-9052-4737-9d1b-d0a158d9e156": {"title": "업무 지표 리포팅 프로젝트", "startDate": "2023-06", "summary": "주요 지표 웹훅 슬랙 자동화 / 대시보드 자동화 연동", "problem": "부서 간 협업에 필요한 주요 지표를 매번 수기로 확인·공유", "action": "내부 업무 효율성 증진을 위한 주요 지표 웹훅 리포팅 구성\n비즈니스 부서 & 마케팅팀 협업 과정에서 필요한 주요 지표 관련 자동화 리포팅\n실DB 데이터를 기반으로 한 스프레드시트 – 앱스크립트 구성", "result": "사내 커뮤니케이션 및 업무 효율화 추진\n효율적인 성과 추이 모니터링 가능 및 가치 판단 효율화\n특이사항 및 이슈 대응 시간 단축", "media": ["s27_01", "s27_03", "s27_00", "s27_02"]}, "199815d6-356c-4959-8219-6c9ea7615102": {"title": "데이터 어트리뷰션 Taxonomy", "startDate": "2023-06", "endDate": "2023-08", "summary": "사내 MMP툴 및 데이터 분석 툴 활용을 위한 텍소노미 및 QA 작업 (Amplitude · Airbridge)", "problem": "부서마다 데이터 이해도와 기준이 달라 커뮤니케이션 리소스가 큼", "action": "내부 마케팅 업무 효율성 증진을 위한 어트리뷰션 툴 텍소노미 작업\n전사 유관 부서 핵심 지표 및 목표 설정 취합을 위한 커뮤니케이션\n부서별 리포트 및 주요 지표 환경 구축\n텍소노미 이슈 확인 및 QA 진행", "result": "부서별 데이터 이해도 및 간극을 최소화\n부서별 연관 데이터 프로세스 구축을 통한 상호 간 커뮤니케이션 리소스 최소화", "media": ["s28_05", "s28_03", "s28_02", "s28_04"]}, "e68c8938-fbb0-4a88-a9a1-dbb3d8c71243": {"title": "VIDEO | 영상촬영 & 편집", "summary": "영상 광고를 위한 자체 영상 촬영 및 편집 스킬 역량 보유", "action": "고객사 요청에 따른 영상 제작에 관련된 모든 업무\n고객사의 니즈에 맞는 시놉시스 및 스토리보드 구상 – 기획\n스케치 / 인플루언서 / 연예인 등 광고 콘텐츠 관련 직접 촬영\n프리미어 & 에프터이펙트를 활용한 기획에 맞는 영상편집", "result": "영상 콘텐츠 관련 리소스 효율화\n자체 제작 및 분석으로 인한 최적화 사이클 단축\n관련 이해도에 따른 타부서 및 대행사 관련 커뮤니케이션 원활", "media": ["s29_00", "s29_01", "s29_02"], "links": [{"label": "LGD Technical Talk 스케치", "url": "https://youtu.be/ezo3h7MCh0Q"}, {"label": "식약처 생리대 위해평가 MCN", "url": "https://youtu.be/WnwBU7E0XcM"}, {"label": "본도시락 홍보영상", "url": "https://youtu.be/gjPHdd-u144"}, {"label": "다이소 할로윈 DIY", "url": "https://youtu.be/gGRnh8f_Sa8"}, {"label": "솜피 광고 A", "url": "https://youtu.be/e3dWRs9S_38"}, {"label": "메디피움 비전선포식", "url": "https://youtu.be/zZipEQqG4nc"}]}, "dff32975-e504-47e3-8ee1-744f2267ac91": {"cols": ["담당 · 전략", "성과"], "action": "상시 매스 캠페인 만성 저효율(ROAS<1) 진단 → 시즌·리타게팅으로 예산 구조 재편\n블랙프라이데이 페이드(Meta·Google) 대조군 운용 — 오퍼·소재·타겟 설계로 승부\n광고 축소 자연실험으로 증분(Incrementality) 규명", "result": "ROAS 0.8 → 1.7 (2배) · 구매당 비용(CPA) 60% 절감\n블프 동기간 대조: ROAS 1.9배 · CPA 55%↓ — 6주에 평시 3개월치 구매 확보\n페이드 실질 기여 ≈ last-touch 측정치의 약 3배 → 증분 기반 재투자 로직 수립"}, "60f3fcee-e8b2-4499-b7d1-71e4f91ad2f5": {"cols": ["담당 · 전략", "성과"], "action": "양면시장 AS-IS 정량 규명 (BigQuery로 실계약·리텐션·경쟁사 실측)\n구글·네이버·메타 전환 스크립트 자체 구현 (GA4/GTM · 네이버 CTS · Meta 픽셀)\n레퍼럴·이벤트·대학교 제휴 페이지 직접 제작·배포\n파트너 파이프라인 (40여 곳 · 상태 8단계 · 제안서 5종)", "result": "측정 인프라를 마케터가 직접 구축 — \"측정 없이 성장 없다\"\n호스트·게스트 획득 채널 실험 설계 (검색광고 2트랙 · 카탈로그 · 플친 A/B)\n네이버 키워드 실측 시뮬레이터로 추정→실측 대체\n브랜드 검색수요 월간 우상향 견인"}, "77afd48a-668b-4ab1-b385-32fa41400211": {"title": "AX — 마케팅 플랫폼 자체 구축 + 프로덕트 협업 개발", "cols": ["자체 구축", "협업 · 자동화"], "action": "AI 협업으로 팀 마케팅 플랫폼 단독 구축 (4개월 · 577커밋 · 534PR · 20+탭)\n스택: Next.js · Supabase · BigQuery · Vercel\n주요 기능(요약): 전사 거래 대시보드 · Paid 성과(CAC·ROAS) · 카탈로그 피드 · 뉴스레터 자동화 · 경쟁사 광고 모니터링 등", "result": "프로덕트 서비스 프론트 PR 개발 (56커밋 · 10티켓 — 네이버 CTS · 랜딩 · GA4)\nMCP·AI 에이전트로 반복 분석 자동화 (Airbridge · Metabase · BigQuery)\n데이터 파이프라인 자동화 — 수기 리포팅 제로화\n일하는 방식 전환: 요청·대기 → 직접 구축·즉시 분석"}}, "add": [{"company": "df04e065-83b0-4fe3-9d89-c08103b1f3fc", "w": {"id": "3080bc75-d773-490f-9a02-35d83886b418", "title": "카탈로그 캠페인 최적화", "category": "퍼포먼스", "startDate": "2023-01", "endDate": "2024-12", "summary": "주요 상품단위 전환 극대화 및 리소스 효율화를 위한 카탈로그 캠페인 운영 (멜리즈 · 와그)", "problem": "많은 상품 개수에 따른 개별 운영에 대한 리소스 부족\n콘텐츠 제작에 대한 리소스 부족\n잦은 상품 정보 변경으로 인한 개별 광고의 어려움", "action": "카탈로그 캠페인을 활용한 광고 상품 수 증가\nA/B테스트를 통한 소재 템플릿화\n구글 시트 연동으로 실시간 상품 정보 업데이트 광고 반영 — 칼럼값 업데이트 자동화 시트 세팅\n카탈로그 상품 리스팅 – 카테고리별 세트 지정\n일단위, 매체별 데이터 분석으로 미디어 운영 최적화 및 고도화", "result": "타캠페인 대비 평균 CPC 15% 감소\n주요 상품에 대한 트래픽 및 구매전환 리소스 최소화로 유지\n카탈로그 캠페인 > 연계상품군으로 확장하여 트래픽 및 전환 집중 프로세스 구축"}, "metrics": [["−15%", "평균 CPC (타 캠페인 대비)"]], "media": ["s12_00", "s12_01", "s12_02", "s12_05", "s12_03", "s12_04"]}, {"company": "df04e065-83b0-4fe3-9d89-c08103b1f3fc", "w": {"id": "e5bb7edf-a48d-4752-a0b4-c05df7903051", "title": "사이트 SEO 최적화 프로젝트", "category": "성과", "startDate": "2024-09", "endDate": "2024-10", "summary": "외부 소비자 탐색 ~ 내부 상품 서칭 단계까지 노출 커버리지 확대를 위한 SEO 최적화 프로젝트", "problem": "외부 포털 탐색부터 내부 상품 서칭까지 노출 커버리지 부족", "action": "소비자 검색 노출 모수 증가를 위한 콘텐츠 SEO & 테크니컬 SEO 개선\n외부 포털 SEO — 콘텐츠·검색 노출 현황 분석, 페이지 디스크립션·키워드 중요도·사이트맵 업데이트 주기 점검\n내부 사이트 SEO — 서칭 키워드별 트렌드 파악, 키워드별 노출 순위 및 중요도 조정\n프로세스 구축 — 상품 어드민 내 SEO 요소(타이틀·디스크립션·키워드)가 실시간 반영되도록 로직 체크\n모니터링 — 주요 상품 노출 순위 체크 대시보드 구축 / 내부 어트리뷰션 툴 리포트 세팅", "result": "구글 포털 4개월 기간 총 노출 수 약 250만 건 증가\n평균 게재 노출 순위 1단계 상승\n평균 CTR 1% 상승"}, "metrics": [["+250만", "구글 노출 (4개월)"], ["1단계↑", "평균 게재 순위"], ["+1%p", "평균 CTR"]], "media": ["s24_00", "s24_01", "s24_02", "s24_03", "s24_04"]}]};
  // PPT 장의 이미지 배치 = 판(쪽 번호별): x·bw = 장에서 판의 왼쪽·폭(%) · ar = 판 가로세로비 · p = 패널(둥근 상자) [x,y,w,h] · i = 이미지 [파일,x,y,w,h,(영상 링크)] · c = 캡션 [x,y,w,h,글] · h = 머리(파랑) (판 기준 %)
  //    영상 링크는 PPT 이미지와 유튜브 썸네일을 대조해 확인한 공개 영상만(부작용 보라 타이틀 = 비공개라 없음 · 영상 PD 모음 이미지 = 영상 2편씩이라 없음, 아래 영상 목록으로)
  //    python-pptx로 그룹 좌표를 풀어 실제 위치로 뽑음 · 폴더 아이콘·로고·장식 문구('뒷장과 연결되는 페이지', '(Click)')는 뺌
  var PPT_BOARD = {"10": {"x": 14.2, "bw": 80.9, "ar": 4.224, "p": [[0.0, 0.0, 32.31, 100.0], [33.83, 0.0, 33.92, 100.0], [69.27, 0.0, 30.73, 100.0]], "h": [], "c": [[3.73, 6.71, 27.73, 10.54, "소재 제작 예시"], [38.06, 6.55, 27.24, 17.14, "웹&앱 캠페인 + 이탈 유저 타겟 리타게팅 캠페인 추가 운영"], [73.29, 6.4, 21.69, 17.14, "캠페인 대시보드 세팅 및 성과 효율 분석"]], "i": [["s10_02", 2.51, 25.28, 8.88, 65.4], ["s10_03", 11.77, 25.28, 8.91, 66.06], ["s10_04", 21.18, 25.28, 8.87, 66.06], ["s10_00", 36.61, 21.37, 7.32, 44.24], ["s10_01", 45.06, 21.08, 12.67, 44.5], ["s10_06", 46.71, 61.27, 18.06, 30.06], ["s10_05", 74.35, 24.96, 21.64, 64.32]]}, "12": {"x": 6.0, "bw": 74.4, "ar": 3.885, "p": [[37.34, 0.0, 27.33, 100.0], [66.59, 0.0, 33.41, 100.0], [0.0, 0.0, 35.13, 100.0]], "h": [], "c": [[41.15, 6.55, 20.06, 17.14, "카탈로그 캠페인 세팅 및 광고 운영"], [71.8, 6.4, 23.59, 17.14, "캠페인 대시보드 세팅 및 성과 효율 분석"], [4.16, 7.47, 30.15, 10.54, "카탈로그 소재 제작 : 영상 & 이미지"]], "i": [["s12_03", 69.17, 25.28, 28.58, 29.19], ["s12_00", 2.92, 31.8, 7.71, 56.24], ["s12_01", 11.09, 31.98, 21.3, 56.08], ["s12_04", 73.28, 42.7, 20.64, 46.21], ["s12_05", 39.55, 74.13, 22.48, 13.1], ["s12_02", 39.59, 22.13, 22.45, 49.2]]}, "14": {"x": 5.7, "bw": 89.3, "ar": 4.216, "p": [[33.78, 25.94, 31.06, 64.36], [67.84, 25.94, 31.06, 64.36]], "h": [], "c": [[33.78, 0.0, 31.06, 11.02, "광고 세팅 & 운영"], [-0.27, 0.0, 30.82, 11.02, "USP 정리 & 소재 제작"], [68.94, 0.0, 31.06, 11.02, "분석 & 디벨롭"], [20.17, 51.68, 13.53, 11.02, "+외 다수"]], "i": [["s14_04", 14.29, 19.34, 9.24, 78.92], ["s14_01", 7.6, 19.65, 6.01, 46.61], ["s14_00", 0.0, 19.34, 7.32, 46.66], ["s14_08", 0.08, 68.74, 13.44, 28.56], ["s14_06", 39.3, 57.19, 20.51, 42.81], ["s14_02", 36.22, 18.98, 16.53, 29.18], ["s14_05", 43.22, 30.85, 21.26, 21.82], ["s14_03", 71.55, 23.74, 24.5, 49.35], ["s14_07", 69.96, 58.62, 27.47, 36.83]]}, "16": {"x": 51.6, "bw": 41.8, "ar": 1.031, "p": [[0.0, 0.0, 100.0, 100.0]], "h": [], "c": [[10.93, 4.83, 35.91, 5.61, "이벤트 페이지 / 배너 (예시)"]], "i": [["s16_01", 9.27, 19.36, 45.76, 67.35], ["s16_02", 58.57, 27.35, 32.44, 11.15], ["s16_03", 58.62, 43.24, 32.39, 38.63]]}, "18": {"x": 4.3, "bw": 92.5, "ar": 2.445, "p": [[0.93, 8.49, 43.98, 89.36], [45.79, 8.49, 26.72, 44.4], [73.28, 8.49, 26.72, 44.4], [45.79, 55.6, 26.72, 44.4], [73.28, 55.6, 26.72, 44.4]], "h": [[0.0, 0.0, 14.55, 5.75, "숏폼 콘텐츠 – KOLs 협업"], [45.79, 0.0, 11.99, 5.75, "기획 &  제작 & 운영"]], "c": [[48.57, 10.8, 7.22, 10.0, "미디어 믹스"], [76.72, 10.43, 7.22, 6.0, "소재 제작"], [48.6, 58.28, 9.85, 10.0, "광고 부스팅/운영"], [76.72, 57.91, 22.5, 6.0, "성과 모니터링"]], "i": [["s18_01", 3.59, 22.39, 19.01, 28.53], ["s18_02", 23.48, 22.46, 19.0, 28.53], ["s18_08", 10.33, 57.54, 7.57, 34.67], ["s18_05", 26.99, 56.94, 7.85, 35.28], ["s18_09", 18.64, 57.54, 7.65, 34.67], ["s18_07", 1.78, 57.4, 8.03, 34.37], ["s18_06", 35.48, 56.81, 7.73, 35.28], ["s18_04", 50.85, 36.87, 18.58, 13.51], ["s18_00", 50.95, 17.43, 18.29, 19.19], ["s18_03", 84.67, 21.69, 14.24, 23.13], ["s18_03", 74.93, 21.68, 9.23, 22.85], ["s18_10", 46.58, 67.17, 24.54, 12.23], ["s18_12", 46.58, 81.28, 24.54, 15.63], ["s18_11", 77.11, 67.01, 19.41, 29.73]]}, "19": {"x": 59.1, "bw": 37.1, "ar": 0.976, "p": [[0.86, 9.79, 99.14, 90.21]], "h": [[0.0, 0.0, 29.35, 5.73, "캠페인 소재 리소스"]], "c": [[60.9, 51.55, 19.62, 12.01, "캠페인 영상"], [5.09, 45.93, 26.85, 6.68, "캠페인 페이지"], [5.09, 12.4, 26.85, 6.68, "캠페인 배너"]], "i": [["s19_00", 7.11, 19.16, 64.67, 22.92], ["s19_02", 30.37, 52.67, 22.52, 42.6], ["s19_01", 7.11, 52.68, 22.24, 42.48], ["s19_04", 62.45, 77.32, 32.65, 17.83, "https://youtu.be/rJv83UTiYvw"], ["s19_03", 62.45, 58.49, 32.65, 17.91]]}, "20": {"x": 59.1, "bw": 37.1, "ar": 0.978, "p": [[0.86, 9.68, 99.14, 90.32]], "h": [[0.0, 0.0, 29.35, 5.73, "캠페인 소재 리소스"]], "c": [[4.4, 56.12, 45.87, 6.69, "소재 베리에이션"], [5.09, 12.42, 39.27, 12.03, "개그우먼 박나래님 캠페인 영상"]], "i": [["s20_00", 12.67, 20.02, 59.82, 32.84, "https://youtu.be/iPHT8Q3zGqs"], ["s20_02", 65.05, 58.34, 26.25, 38.32, "https://youtube.com/shorts/rt0umjN9M9I"], ["s20_01", 74.52, 20.02, 16.66, 32.84], ["s20_03", 12.34, 66.8, 49.98, 25.99, "https://youtu.be/--SENDU3YhQ"]]}, "21": {"x": 59.1, "bw": 37.1, "ar": 0.978, "p": [[0.86, 9.68, 99.14, 90.32]], "h": [[0.0, 0.0, 29.35, 5.73, "캠페인 소재 리소스"]], "c": [[56.49, 48.14, 43.51, 6.7, "개그우먼 김민경님 캠페인 영상"], [5.09, 48.79, 40.23, 6.69, "참여 인증 및 관련 PR"], [5.09, 12.42, 32.54, 6.69, "실제 수익금 기부 사례"], [53.52, 18.3, 32.54, 6.69, "캠페인 굿즈 & 리플렛"]], "i": [["s21_00", 6.85, 19.11, 44.92, 25.03], ["s21_03", 6.85, 56.34, 29.14, 33.96], ["s21_04", 37.54, 56.2, 17.11, 33.96], ["s21_05", 61.11, 56.34, 29.99, 15.65, "https://youtu.be/x_hQDxX6DXo"], ["s21_06", 60.99, 73.48, 30.24, 16.76, "https://youtu.be/yPTSQnWt-PA"], ["s21_01", 55.0, 25.03, 19.57, 19.13], ["s21_02", 76.21, 25.01, 19.57, 19.13]]}, "23": {"x": 51.8, "bw": 37.7, "ar": 0.968, "p": [[0.0, 0.0, 49.58, 79.15], [46.75, 25.37, 53.25, 74.63]], "h": [], "c": [[7.99, 6.13, 42.65, 5.19, "네이버 쇼핑 피드 전용 세팅 페이지"], [7.8, 49.98, 42.65, 5.19, "피드 업데이트 모니터링"], [55.48, 29.87, 42.65, 5.19, "네이버 쇼핑 – 성과 지표 및 대시보드"], [54.99, 77.55, 32.28, 8.43, "클린위반 이슈 대응 신속화"]], "i": [["s23_02", 5.13, 57.07, 37.92, 15.05], ["s23_03", 50.93, 84.51, 44.81, 10.33], ["s23_01", 51.28, 36.78, 44.82, 35.85], ["s23_00", 5.66, 14.42, 37.5, 29.93]]}, "24": {"x": 57.7, "bw": 36.2, "ar": 0.928, "p": [[0.0, 0.0, 100.0, 20.13]], "h": [], "c": [[15.21, 29.42, 47.94, 5.83, "프로젝트를 위한 지표 세팅 예시"]], "i": [["s24_00", 60.36, 1.95, 31.13, 19.09], ["s24_03", 11.63, 70.18, 58.46, 12.87], ["s24_01", 11.63, 37.71, 58.06, 31.13], ["s24_02", 70.97, 37.71, 19.25, 62.15], ["s24_04", 11.63, 84.51, 58.52, 15.49]]}, "26": {"x": 14.1, "bw": 73.2, "ar": 2.895, "p": [[0.0, 0.0, 100.0, 100.0], [8.95, 19.4, 37.02, 64.37], [59.93, 19.4, 32.44, 64.37]], "h": [], "c": [], "i": [["s26_00", 3.35, 9.05, 48.23, 80.96], ["s26_01", 55.07, 8.82, 41.98, 80.46]]}, "27": {"x": 50.0, "bw": 44.0, "ar": 1.198, "p": [[0.0, 0.0, 100.0, 100.0]], "h": [], "c": [], "i": [["s27_01", 10.3, 18.38, 34.53, 33.18], ["s27_03", 10.3, 52.3, 34.76, 32.54], ["s27_00", 45.92, 18.38, 25.89, 66.66], ["s27_02", 55.05, 37.74, 36.75, 26.95]]}, "28": {"x": 12.0, "bw": 73.2, "ar": 2.895, "p": [[0.0, 0.0, 100.0, 100.0], [8.9, 22.78, 33.67, 58.54]], "h": [], "c": [], "i": [["s28_03", 6.53, 25.42, 27.57, 42.67], ["s28_05", 19.41, 38.5, 24.19, 42.27], ["s28_04", 54.12, 30.4, 33.24, 47.65], ["s28_02", 77.15, 22.66, 16.25, 44.26]]}, "29": {"x": 47.0, "bw": 45.4, "ar": 2.671, "p": [], "h": [], "c": [], "i": [["s29_01", 33.64, 0.0, 33.14, 99.5], ["s29_02", 67.16, 0.0, 32.84, 99.5], ["s29_00", 0.0, 0.17, 33.14, 99.83]]}};
  var PPT_BOARDS_OF = { "0a3aea35-ccc9-4018-a7a6-e383c303f928": [10], "3080bc75-d773-490f-9a02-35d83886b418": [12], "b0aa1d32-82d9-44bc-897d-b558a425c98c": [14], "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": [16, 18],
    "43ab6811-42cf-4a1f-afca-62bfd67b17f9": [19], "574f26d3-1fff-49fb-a302-b8c12253df61": [20], "53845c2b-3618-4e8d-968c-1edfabdf4912": [21], "4d333686-6daa-4c8e-9cd7-3e8309ef9900": [23], "e5bb7edf-a48d-4752-a0b4-c05df7903051": [24],
    "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": [26], "8fe4e187-9052-4737-9d1b-d0a158d9e156": [27], "199815d6-356c-4959-8219-6c9ea7615102": [28] }; // 영상 PD(29쪽)는 영상 2편씩 모은 그림이라 판 대신 영상 목록을 크게
  function pptPatch(d) {
    var P = PPT_PATCH, x = JSON.parse(JSON.stringify(d)), byId = {}, n = 0;
    var mets = function (L) { return L.map(function (a) { return { id: "ppt" + (n++), value: a[0], label: a[1] }; }); };
    var media = function (w, names) { w.media = (names || []).map(function (k) { return { id: "ppt-" + k, type: "image", url: PPT_IMG + k + ".jpg" }; }).concat((w.media || []).filter(function (m) { return !/\/pf-img\//.test(m.url || ""); })); };
    (x.companies || []).forEach(function (c) { if (P.companies[c.id]) Object.keys(P.companies[c.id]).forEach(function (k) { c[k] = P.companies[c.id][k]; }); (c.works || []).forEach(function (w) { byId[w.id] = w; }); });
    Object.keys(P.works).forEach(function (id) { var w = byId[id], v = P.works[id]; if (!w) return; Object.keys(v).forEach(function (k) { if (k === "metrics") w.metrics = mets(v.metrics); else if (k === "media") media(w, v.media); else w[k] = v[k]; }); });
    P.add.forEach(function (a) { if (byId[a.w.id]) return; var c = (x.companies || []).filter(function (cc) { return cc.id === a.company; })[0]; if (!c) return; var w = JSON.parse(JSON.stringify(a.w)); w.tags = []; w.links = []; w.stack = []; w.metrics = mets(a.metrics); media(w, a.media); (c.works = c.works || []).push(w); });
    x.klio = x.klio || {}; x.klio.hidden = x.klio.hidden || {}; x.klio.hidden.works = (x.klio.hidden.works || []).concat(P.hide);
    return x;
  }

  function renderKlio(d) {
    if ((d.page === "projects-test" || d.page === "projects-airbridge") && !((d.klio || {}).migr || {}).pdf1) d = pptPatch(d); // PPT 내용 바로 보이게(DB 반영 전)
    var P = d.profile || {};
    var fmt = function (s) { return s ? String(s).slice(0, 7).replace("-", ".") : ""; };
    var wPeriod = function (w) { var a = fmt(w.startDate), b = w.endDate ? fmt(w.endDate) : "현재"; return a ? (a + " – " + b) : (w.endDate ? b : ""); };
    var coPeriod = function (co) { if (co.periodText) return co.periodText; var a = fmt(co.startDate), b = co.endDate ? fmt(co.endDate) : "재직중"; return a ? (a + " — " + b) : (co.endDate ? b : ""); };
    var dispName = function (co) { return co.useService ? (co.serviceKo || co.serviceEn || co.nameKo || co.nameEn || "") : (co.nameKo || co.nameEn || ""); };
    var yearOf = function (w) { return String(w.endDate || w.startDate || "").slice(0, 4); };

    var companies = d.companies || [];
    // klio 표시 설정(스튜디오 편집 → d.klio): text=문구 덮어쓰기 · show=표시 항목 · hidden=개별 숨김(id 목록)
    var K = d.klio || {}, KT = K.text || {}, KS = K.show || {}, KH = K.hidden || null;
    var txt = function (k, def) { var v = KT[k]; return (v != null && String(v).trim() !== "") ? String(v) : def; };
    var shown = function (g, k, def) { var o = KS[g] || {}; return o[k] == null ? def : o[k] !== false; };
    var isHidden = function (b, id) { return !!(KH && id != null && (KH[b] || []).indexOf(id) >= 0); };
    // 글꼴 프리셋(KILO 대시보드 '구성 → 글꼴' = klio.ui.font): editorial(기본 · 큰 제목 세리프 + 본문 Pretendard) · modern · soft(SUIT) · classic(이전 Figtree)
    var PRET = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";
    var SANS_KR = '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    // 좌상단 서명 글씨체(KILO 대시보드 Home → '서명' = klio.ui.sigFont · 크기 klio.ui.sigSize %) — 붓글씨로 써지는 모션은 show.fx.sigDraw
    // fs = 기본 크기(px, 글씨체마다 눈에 보이는 크기를 맞춤) · sw = 붓 굵기(em, 획 폭을 한 번에 덮을 만큼) · y = 기준선(em)
    var SIGFONTS = {
      dafoe: { n: "Mr Dafoe", q: "Mr+Dafoe", fs: 40, w: 400, sw: .3, y: 1.02 },
      qwitcher: { n: "Qwitcher Grypen", q: "Qwitcher+Grypen:wght@700", fs: 54, w: 700, sw: .24, y: 1 },
      kaushan: { n: "Kaushan Script", q: "Kaushan+Script", fs: 36, w: 400, sw: .36, y: 1.08 },
      mashan: { n: "Ma Shan Zheng", q: "Ma+Shan+Zheng", fs: 46, w: 400, sw: .4, y: 1.02 },
      caveat: { n: "Caveat", q: "Caveat:wght@600", fs: 44, w: 600, sw: .26, y: .98 }
    };
    var SKEY = SIGFONTS[(K.ui || {}).sigFont] ? (K.ui || {}).sigFont : "dafoe", SIG = SIGFONTS[SKEY];
    var sigPct = parseFloat((K.ui || {}).sigSize); sigPct = isNaN(sigPct) ? 100 : Math.max(70, Math.min(160, sigPct));
    var sigFs = Math.round(SIG.fs * sigPct / 100);
    var GF = "https://fonts.googleapis.com/css2?family=" + SIG.q;
    var FONTS = {
      editorial: { body: SANS_KR, disp: '"Newsreader","Noto Serif KR",Georgia,serif', w: 400, ls: "-.02em", css: [GF + "&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Noto+Serif+KR:wght@400;500&display=swap", PRET] },
      modern: { body: SANS_KR, disp: SANS_KR, w: 800, ls: "-.05em", css: [GF + "&display=swap", PRET] },
      soft: { body: '"SUIT Variable",' + SANS_KR, disp: '"SUIT Variable",' + SANS_KR, w: 800, ls: "-.045em", css: [GF + "&display=swap", "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css", PRET] },
      classic: { body: '"Figtree",' + SANS_KR, disp: '"Figtree",' + SANS_KR, w: 800, ls: "-.055em", css: [GF + "&family=Figtree:wght@400;500;600;700;800&display=swap", PRET] }
    };
    var FKEY = FONTS[(K.ui || {}).font] ? (K.ui || {}).font : "editorial", FNT = FONTS[FKEY];
    var fontHead = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      + FNT.css.map(function (h) { return '<link rel="stylesheet" href="' + h + '"/>'; }).join("");
    var fontVars = ':root{--font:' + FNT.body + ';--disp:' + FNT.disp + ';--dispw:' + FNT.w + ';--displs:' + FNT.ls + ';--sgf:"' + SIG.n + '",cursive;--sgw:' + SIG.w + ';--sgfs:' + sigFs + 'px;--ssw:' + SIG.sw + 'em}';
    var works = [];
    companies.forEach(function (co) { (co.works || []).forEach(function (w) { if (!isHidden("works", w.id)) works.push({ co: co, w: w }); }); });

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

    // ── 기본값 (draft 큐레이션 + AX 시드) ─ 스튜디오에서 편집/치환
    var CURATED_TECH = [
      { label: "마케팅 · 데이터", items: ["Meta Ads", "Google Ads", "GA4·GTM", "네이버 검색광고 API", "BigQuery", "Amplitude", "Airbridge"] },
      { label: "개발", items: ["TypeScript", "Next.js", "React", "Tailwind", "Supabase", "SQL", "Metabase·Redash"] },
      { label: "AI · 인프라", items: ["Anthropic", "OpenAI", "AI SDK·MCP", "Vertex AI", "Vercel", "GitHub Actions", "git worktree"] }
    ];
    // techstack 행 구성: klio.techstack 우선, 없으면 큐레이션 3행 (+ DB 데이터는 '후보' 행으로 — 화면 미노출, 스튜디오에서 골라 씀)
    var defaultTechRows = function () {
      var rows = CURATED_TECH.map(function (r) { return { label: r.label, items: r.items.slice(), visible: true }; });
      var present = {}; rows.forEach(function (r) { r.items.forEach(function (t) { present[String(t).toLowerCase()] = 1; }); });
      var extras = [], pushEx = function (t) { t = t && String(t).trim(); if (t && !present[t.toLowerCase()]) { present[t.toLowerCase()] = 1; extras.push(t); } };
      works.forEach(function (x) { (x.w.stack || []).forEach(pushEx); });
      (P.stack || []).forEach(function (s) { pushEx(s.title || s.area); });
      (d.capabilities || []).filter(function (c) { return c.visible !== false; }).forEach(function (c) { pushEx(c.label); });
      if (extras.length) rows.push({ label: "후보 · DB (화면 미노출)", items: extras, visible: false });
      return rows;
    };
    // AX 콘솔(/ax) CORE CAPABILITIES 대표 3 — klio에는 이 핵심만, 전체 구조는 콘솔로
    // 전체 프로젝트 페이지 분류 묶음 기본값(KILO 대시보드 '프로젝트 그룹'에서 편집 · studio.html groupsSeed와 동일)
    var DEFAULT_GROUPS = [
      { id: "g-perf", label: "Performance & Growth", cats: ["퍼포먼스", "그로스"], on: true },
      { id: "g-data", label: "Data & AX", cats: ["성과", "CRM", "AX"], on: true },
      { id: "g-brand", label: "Brand & Content", cats: ["브랜딩", "콘텐츠", "영상"], on: true },
      { id: "g-com", label: "Commerce & Partnership", cats: ["커머스", "제휴"], on: true }
    ];
    var DEFAULT_AXCORE = [
      { num: "01", title: "통합 대시보드", desc: "서비스지표와 마케팅지표를 한 판에서, 같은 정의로 비교·결정." },
      { num: "02", title: "마케팅 자동화", desc: "기획·집행·최적화를 화면 안에서 — 반복은 규칙과 알림으로 자동화." },
      { num: "03", title: "히스토리 워크플로우", desc: "메일·회의·배포 기록이 자동으로 남는 업무 구조." }
    ];

    // ── HOME
    // 이름: KILO 대시보드 Home '상단 연락처'의 국문·영문 이름(klio.text.nameKo/nameEn) 우선, 비우면 프로필 값
    var nameKo = txt("nameKo", P.nameKo || "").trim();
    var nameEn = txt("nameEn", P.nameEn || "").trim() || nameKo;
    var initials = txt("initials", (nameEn.split(/\s+/).map(function (x) { return x[0] || ""; }).join("") || "JK").slice(0, 2).toUpperCase());
    var siteUrl = txt("siteUrl", "https://kimjinsoo-mkt-ax.vercel.app");
    var siteHref = /^https?:\/\//i.test(siteUrl) ? siteUrl : "https://" + siteUrl;
    var siteLabel = siteHref.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    var orbit = esc(txt("orbit", nameEn.toUpperCase() + " · MARKETER · ")).replace(/ /g, "&#160;");
    var sents = (P.summary || "").split(/(?<=다\.)\s+/).filter(Boolean);
    var tagline = P.tagline || P.title || "";
    // 첫 문장: KILO 대시보드에서 직접 쓴 문장(klio.text.heroMain)이 있으면 그대로, 없으면 편집칸 값만으로 "{이름} — {대표 문장}."
    // (숨은 고정 문구 없음 · 이름 칸이 문장으로 끝나면 대시 없이 이어 붙임)
    var hName = String(nameKo || nameEn || "").trim(), hJoin = /[.!?。]$/.test(hName) ? " " : " — ";
    var mainH1 = txt("heroMain", "") ? esc(txt("heroMain", ""))
      : (hName ? esc(hName) + (tagline ? hJoin : "") : "") + esc(tagline) + (tagline && !/[.!?。]$/.test(tagline) ? "." : "");
    var dimH1 = esc(txt("heroSub", sents[0] || ""));
    // 프로필 사진 여러 장(KILO 대시보드 Home → 사진 카드 = klio.photos, 첫 장 = 대표 = profile.avatar)
    var PHOTOS = (Array.isArray(K.photos) ? K.photos : [P.avatar]).map(function (u) { return String(u || "").trim(); }).filter(Boolean);
    if (!PHOTOS.length && P.avatar) PHOTOS = [P.avatar];
    var photoOn = shown("home", "photo", false) && PHOTOS.length > 0, multiPh = photoOn && PHOTOS.length > 1;
    var dimRaw = parseFloat((K.ui || {}).photoDim), photoDim = isNaN(dimRaw) ? 0.35 : Math.max(0, Math.min(80, dimRaw)) / 100; // 사진 딤(어둡게) — KILO 대시보드에서 조절
    // 조회수(누적·오늘): 라이브 view.html이 트래커 값을 보내면 표시 = 실제 + KILO 대시보드 보정값(klio.views)
    var KV = K.views || {}, kstToday = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
    var vTa = +KV.totalAdj || 0, vTda = +KV.todayAdj || 0, vTodA = KV.todayDay === kstToday ? vTda : 0;
    var nfmt = function (n) { try { return Number(n).toLocaleString("ko-KR"); } catch (e) { return String(n); } };
    var viewsHtml = shown("home", "views", true) ? '<div class="vw" data-ta="' + vTa + '" data-tda="' + vTda + '" data-tdd="' + esc(KV.todayDay || "") + '"><i class="vw-dot"></i>'
      + '<span>' + esc(txt("viewsTotal", "누적")) + ' <b data-vw="total">' + (vTa ? nfmt(vTa) : "—") + '</b></span><i class="vw-sep"></i>'
      + '<span>' + esc(txt("viewsToday", "오늘")) + ' <b data-vw="today">' + (vTodA ? nfmt(vTodA) : "—") + '</b></span></div>' : '';
    // 모션·효과 (KILO 대시보드 토글) + 사진 딤 방식(bg=배경만·가장자리 / all=사진 전체)
    var FX = { intro: shown("fx", "intro", true), aura: shown("fx", "aura", true), tilt: shown("fx", "tilt", true), progress: shown("fx", "progress", true) };
    var dimMode = (K.ui || {}).photoDimMode === "all" ? "all" : "bg";
    // 단어별 등장 애니메이션용 분리 — 입력한 줄바꿈(= 줄 나눔)과 여러 칸 띄어쓰기는 그대로 살림
    var spaces = function (t) { var n = t.split("\n").length - 1; return n ? new Array(n + 1).join("<br>") : " " + new Array(t.length).join("&#160;"); };
    var wIdx = 0, wrapW = function (s) { return String(s).replace(/\r\n?/g, "\n").split(/(\s+)/).map(function (w) { if (!w) return ""; if (/^\s+$/.test(w)) return spaces(w); return '<span class="w" style="--i:' + (wIdx++) + '">' + w + '</span>'; }).join(""); };
    // 직접 쓴 문구: 줄바꿈·여러 칸 띄어쓰기를 화면에도 그대로
    var tx = function (s) { return esc(String(s).replace(/\r\n?/g, "\n")).replace(/\n/g, "<br>").replace(/ {2,}/g, function (m) { return " " + new Array(m.length).join("&#160;"); }); };
    // 사진 아래 소개 문장(대표 문장 + 회색 보조 문장): 기본 숨김 — 자기소개는 About이 맡음(대표 문장은 About 첫 줄로). KILO 대시보드 Home에서 다시 켤 수 있음
    var introOn = shown("home", "intro", false);
    // 좌상단 서명(붓글씨 SVG): 글자(tspan)마다 굵은 붓 획이 윤곽을 따라 그려지고 글자 모양으로 잘려(clip) 먹이 채워지듯 써짐 — 순서·속도는 런타임이 글자 위치로 맞춤
    var sigTxt = txt("sig", nameEn), sigDraw = FX.intro && shown("fx", "sigDraw", true), sigTag = introOn ? "div" : "h1";
    var sgSpans = sigTxt.split("").map(function (ch, i) { return '<tspan style="--k:' + i + '">' + esc(ch) + '</tspan>'; }).join("");
    var sigHtml = sigTxt ? '<' + sigTag + ' class="sig"' + (sigDraw ? ' data-draw data-sf="' + esc(SIG.n) + '"' : '') + '><span class="sr">' + esc(sigTxt) + '</span>'
      + '<svg class="sg" aria-hidden="true" focusable="false"><defs><clipPath id="sgc"><text class="sg-t" x="2" y="' + SIG.y + 'em">' + sgSpans + '</text></clipPath></defs>'
      + '<text class="sg-t sg-ink" x="2" y="' + SIG.y + 'em" clip-path="url(#sgc)">' + sgSpans + '</text></svg></' + sigTag + '>' : '';
    // 상단 연락처 맨 위: 국문 · 영문 이름 (영문이 국문과 같으면 한 번만)
    var nmHtml = (shown("home", "nameKo", true) && nameKo ? '<b>' + esc(nameKo) + '</b>' : '') + (shown("home", "nameEn", true) && nameEn && nameEn !== nameKo ? '<span>' + esc(nameEn) + '</span>' : '');
    var home = '<header class="home' + (introOn ? '' : ' noh') + '" id="home">'
      + (FX.aura ? '<div class="aura" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>' : '')
      + '<div class="rv">' + sigHtml
      + '<div class="meta">' + (nmHtml ? '<p class="nm">' + nmHtml + '</p>' : '') + (shown("home", "location", true) ? '<span>' + esc(P.location || "Seoul, Korea") + '</span>' : '')
      + (shown("home", "email", true) && P.email ? '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>' : '')
      + (shown("home", "site", true) ? '<a href="' + esc(siteHref) + '" target="_blank" rel="noopener">' + esc(siteLabel) + '</a>' : '') + '</div>' + viewsHtml + '</div>'
      + '<div class="cnt"><div class="photo rv' + (multiPh ? ' multi' : '') + '" style="--d:80ms"' + (multiPh ? ' data-ph="' + PHOTOS.length + '" data-auto="' + (shown("home", "photoAuto", true) ? 1 : 0) + '"' : '') + '>'
      // 여러 장: 뒤에 다음 사진들이 살짝 기울어 겹쳐 보이고(덱) · 앞 카드는 천천히 교차 전환 + 은은한 줌 · 아래 이야기형 진행 막대
      + (multiPh ? '<div class="ph-deck" aria-hidden="true">' + PHOTOS.slice(1, 3).map(function (u, i) { return '<i class="pd' + (i + 1) + '" style="background-image:url(\'' + esc(u) + '\')"></i>'; }).join("") + '</div>' : '')
      + '<div class="card' + (photoOn ? ' img dim-' + dimMode + '" style="' + (multiPh ? '' : 'background-image:url(\'' + esc(PHOTOS[0]) + '\');') + '--dim:' + photoDim + '"' + (multiPh ? ' role="button" tabindex="0" aria-label="다음 사진"' : '') + '>'
        + (multiPh ? PHOTOS.map(function (u, i) { return '<i class="ph' + (i ? '' : ' on') + '" style="background-image:url(\'' + esc(u) + '\')"></i>'; }).join("") : '') : '"><b>' + esc(initials) + '</b>') + '</div>'
      + (multiPh ? '<div class="ph-bars" aria-hidden="true">' + PHOTOS.map(function (u, i) { return '<i' + (i ? '' : ' class="on"') + '><b></b></i>'; }).join("") + '</div>' : '')
      + '<svg class="orbit" viewBox="0 0 150 150" aria-hidden="true"><defs><path id="orb" d="M75,75 m-63,0 a63,63 0 1,1 126,0 a63,63 0 1,1 -126,0"/></defs><text><textPath href="#orb">' + orbit + '</textPath></text></svg></div>'
      + (introOn ? '<h1 class="hero-h">' + wrapW(mainH1) + ' <span class="dim">' + wrapW(dimH1) + '</span></h1>' : '') + '</div></header>';

    // ── ABOUT (포트폴리오 전용 문구가 있으면 그걸로 — 빈 줄=문단 구분, 없으면 요약을 문장 기준 2문단)
    var aboutOv = txt("about", "");
    var aboutParas;
    if (aboutOv) aboutParas = aboutOv.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    else { var half = Math.ceil(sents.length / 2); aboutParas = [sents.slice(0, half).join(" "), sents.slice(half).join(" ")].filter(Boolean); }
    // About 두 문단 = KILO 대시보드 '첫 문장'(검은 글씨) · '회색 보조 문장'(회색 글씨) — 쓰면 그 문장 그대로(줄바꿈 포함)
    if (!introOn) {
      if (String(KT.heroMain || "").trim()) aboutParas[0] = String(KT.heroMain);
      if (String(KT.heroSub || "").trim()) aboutParas[1] = String(KT.heroSub);
      aboutParas = aboutParas.filter(function (x) { return x && String(x).trim(); });
    }
    // About 첫 줄(한 줄 소개): 사진 아래 소개 문장을 숨기면 대표 문장이 여기로 — klio.text.aboutLead(비우면 대표 문장) · 끄기 show.about.lead
    var aboutLead = !introOn && shown("about", "lead", true) ? txt("aboutLead", tagline).trim() : "";
    var aboutInner = '<div class="cnt about rv rv-g">' + (aboutLead ? '<p class="lead" style="--j:0">' + tx(aboutLead) + '</p>' : '') + aboutParas.map(function (p, i) { return '<p' + (i ? ' class="g"' : '') + ' style="--j:' + (i * 2 + (aboutLead ? 1 : 0)) + '">' + tx(p) + '</p>'; }).join("") + '</div>';

    // ── PROJECTS — 대표작 5 모자이크(썸네일 카드) + '전체 프로젝트 보기' → 새 URL /{slug}/projects (큰 상품카드 슬라이드)
    var ytW = function (u) { var m = String(u || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/); return m ? m[1] : null; };
    var mediaOf = function (w) { // 작업의 이미지 + 유튜브 썸네일
      var out = [];
      (w.media || []).forEach(function (m) { if (m && m.url && (m.type === "image" || !m.type)) out.push({ src: m.url, t: m.title || "" }); });
      (w.links || []).forEach(function (l) { var y = ytW(l && l.url); if (y) out.push({ src: "https://img.youtube.com/vi/" + y + "/hqdefault.jpg", yt: y, t: l.label || "", url: l.url }); });
      return out;
    };
    // 메인 ↔ 전체 프로젝트 페이지 경로: 라이브(view.html)가 지금 연 주소 기준으로 넘겨줌(/portfolio, /p/x, /mkt/portfolio…), 없으면 슬러그 기준
    var K0 = d.klio || {};
    var pSlug = d.slug || "portfolio", homeUrl = d.homePath || "/" + encodeURIComponent(pSlug), pjUrl = d.pjPath || homeUrl + "/projects";
    // 상단 큰 메뉴(메인·프로젝트 페이지 공통 헤더, 순서 이력서 · AX · 프로젝트): 이력서 = 메인 · AX = AX-MKT 콘솔 · 프로젝트 = 슬라이드 프로젝트 페이지 · data-gx(스튜디오 미리보기에선 이동 대신 전환/새 탭)
    var tpUrl = d.tpPath || homeUrl + "/projects-test", axUrl = (K0.text || {}).axLink || "https://kimjinsoo-mkt-ax.vercel.app/ax";
    var gtabs = function (cur, dd) { return '<nav class="gtabs" aria-label="메뉴">' + [["resume", "이력서", homeUrl], ["ax", "AX", axUrl], ["projects", "프로젝트", tpUrl]].map(function (x) { var a = '<a class="gt' + (x[0] === cur ? ' on" aria-current="page' : '') + '" href="' + esc(x[2]) + '" target="_top" data-gx="' + x[0] + '">' + x[1] + '</a>'; return x[0] === "resume" && dd ? '<div class="gt-w">' + a + '<div class="gdd">' + dd + '</div></div>' : a; }).join("") + '</nav>'; };
    // 이력서 섹션 목록(헤더 '이력서' 아래) — 메인 밖(프로젝트 페이지)에선 메인 주소#섹션으로
    var secLinks = function (outside) { return (typeof visibleSec !== "undefined" ? visibleSec : []).filter(function (s) { return s.key !== "projects" && s.key !== "ax"; }).map(function (s) { return '<a href="' + (outside ? esc(homeUrl) : '') + '#' + s.key + '"' + (outside ? ' target="_top"' : '') + ' data-sec="' + s.key + '">' + esc(s.label) + '</a>'; }).join(""); };
    // 이미지 없는 프로젝트의 썸네일 일러스트(SVG): 분야별 미니 화면(상승 차트 · 막대+쿠폰 · 앱 자동화 흐름 · 미디어) + 대표 지표
    // 프로젝트 id로 곡선·막대 모양이 조금씩 달라짐. preserveAspectRatio=meet → 어떤 썸네일 비율에서도 잘리지 않고 분야 색 바탕 가운데
    var hashOf = function (s) { var h = 2166136261; s = String(s || ""); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
    var coverArt = function (w, m0) {
      var cm = catMeta(w.category), en = String(cm.en), h = hashOf(w.id || w.title);
      var rnd = function () { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9) >>> 0; return (h % 1000) / 1000; };
      var ink = "#222", soft = "rgba(34,34,34,.12)", val = m0 ? String(m0.value) : "", fs = val.length <= 4 ? 30 : val.length <= 6 ? 25 : 20;
      var head = val
        ? '<text x="34" y="62" font-size="' + fs + '" font-weight="800" letter-spacing="-1" fill="' + ink + '">' + esc(val) + '</text>' + (m0.label ? '<text x="34" y="82" font-size="10.5" font-weight="600" fill="rgba(34,34,34,.5)">' + esc(String(m0.label).slice(0, 24)) + '</text>' : '')
        : '<rect x="34" y="40" width="110" height="12" rx="6" fill="' + ink + '" opacity=".85"/><rect x="34" y="60" width="70" height="8" rx="4" fill="' + ink + '" opacity=".25"/>';
      var body;
      if (/Performance|Growth|Data|CRM/.test(en)) { // 상승 곡선 + 영역 + 끝점
        var pts = [], n = 8;
        for (var i = 0; i < n; i++) { var t = i / (n - 1); pts.push([34 + 252 * t, 184 - 80 * (0.15 + 0.85 * Math.pow(t, 1.3)) + (rnd() - 0.5) * 18 * (1 - t)]); }
        var dd = pts.map(function (p, k) { return (k ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" "), last = pts[n - 1];
        body = '<path d="M34 190H286" stroke="' + soft + '"/><path d="M34 160H286M34 130H286" stroke="' + soft + '" stroke-dasharray="3 5"/>'
          + '<path d="' + dd + ' L286 190 L34 190Z" fill="' + cm.c + '" opacity=".6"/><path class="ln" d="' + dd + '" fill="none" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
          + '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="11" fill="' + ink + '" opacity=".12"/><circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="5.5" fill="' + ink + '"/>'
          + '<rect x="220" y="34" width="66" height="20" rx="6" fill="' + cm.c + '"/><rect x="232" y="42" width="42" height="4" rx="2" fill="' + ink + '" opacity=".35"/>';
      } else if (/Commerce|Partnership/.test(en)) { // 오르는 막대 + 쿠폰(티켓)
        var bars = "";
        for (var j = 0; j < 4; j++) { var bh = 34 + j * 24 + rnd() * 14; bars += '<rect x="' + (150 + j * 34) + '" y="' + (188 - bh).toFixed(1) + '" width="22" height="' + bh.toFixed(1) + '" rx="5" fill="' + (j === 3 ? ink : cm.c) + '"/>'; }
        body = '<path d="M34 190H286" stroke="' + soft + '"/>' + bars
          + '<g transform="translate(34 104)"><rect width="96" height="54" rx="9" fill="' + cm.c + '"/><circle cy="27" r="7" fill="#fff"/><circle cx="96" cy="27" r="7" fill="#fff"/><path d="M68 10V44" stroke="#fff" stroke-width="2" stroke-dasharray="3 4"/><rect x="14" y="14" width="40" height="6" rx="3" fill="' + ink + '" opacity=".5"/><rect x="14" y="28" width="28" height="6" rx="3" fill="' + ink + '" opacity=".25"/></g>';
      } else if (/AX/.test(en)) { // 앱 창 + 자동화 흐름(노드 → 노드 → 완료) + 진행 막대
        body = '<circle cx="238" cy="36" r="4" fill="#e5e5e5"/><circle cx="252" cy="36" r="4" fill="#e5e5e5"/><circle cx="266" cy="36" r="4" fill="#e5e5e5"/>'
          + '<rect x="34" y="100" width="62" height="40" rx="9" fill="#c3cde4"/><rect x="129" y="100" width="62" height="40" rx="9" fill="#abdcd1"/><rect x="224" y="100" width="62" height="40" rx="9" fill="' + ink + '"/>'
          + '<path class="ln" d="M96 120h33M191 120h33" stroke="' + ink + '" stroke-width="2.4" stroke-linecap="round"/><path d="M123 114.5l6 5.5-6 5.5M218 114.5l6 5.5-6 5.5" fill="none" stroke="' + ink + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
          + '<path d="M246 120l6 6 12-13" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
          + '<rect x="34" y="158" width="252" height="10" rx="5" fill="#f1f0ec"/><rect x="34" y="158" width="' + (120 + rnd() * 110).toFixed(0) + '" height="10" rx="5" fill="' + ink + '"/><rect x="34" y="178" width="180" height="8" rx="4" fill="#f1f0ec"/>';
      } else { // 미디어(브랜딩·콘텐츠·영상): 겹친 프레임 + 재생 + 재생 막대
        var pl = 90 + rnd() * 120;
        body = '<rect x="150" y="54" width="118" height="80" rx="10" fill="' + cm.c + '" transform="rotate(' + (6 + rnd() * 4).toFixed(1) + ' 209 94)"/>'
          + '<rect x="132" y="70" width="128" height="88" rx="10" fill="' + ink + '"/><path d="M186 100l22 14-22 14z" fill="#fff"/>'
          + '<rect x="34" y="176" width="252" height="8" rx="4" fill="#f1f0ec"/><rect x="34" y="176" width="' + pl.toFixed(0) + '" height="8" rx="4" fill="' + ink + '" opacity=".75"/><circle cx="' + (34 + pl).toFixed(0) + '" cy="180" r="6" fill="' + ink + '"/>';
      }
      return '<svg class="cv" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="18" y="18" width="284" height="184" rx="16" fill="#fff"/>' + body + head + '</svg>';
    };
    var feat = works.filter(function (x) { return x.w.featured; });
    var featM = feat.filter(function (x) { return (x.w.metrics || []).length; });
    var pick = (featM.length >= 4 ? featM : feat.length ? feat : works).slice(0, 4); // 대표작 4 (작게·세로 길게·작게·가로 길게)
    // 카드 표시값 — KILO 대시보드 카드별 설정(klio.cards: 이름 · 썸네일 번호(-1=색 카드) · 대표 지표 번호(-1=없음))을 메인 타일에도 똑같이
    var KCARD = K.cards || {};
    var cardView = function (w) {
      var CC = KCARD[w.id] || {}, md = mediaOf(w), ti = CC.thumb != null ? +CC.thumb : 0, ki = CC.kpi != null ? +CC.kpi : 0;
      var mets = (w.metrics || []).filter(function (m) { return m && m.value; });
      return { title: (CC.title && String(CC.title).trim()) || w.title || "", main: ti >= 0 ? (md[ti] || md[0] || null) : null, m0: ki >= 0 ? (mets[ki] || mets[0] || null) : null };
    };
    // 썸네일 맞춤(KILO 대시보드 카드 세부 → klio.cards[id]: fit 'contain'(기본·잘림 없음)|'cover', zoom 100~300(%), px·py 0~100(위치 %))
    // <img>로 그림: contain이면 이미지 전체가 칸 안에 들어가고 남는 곳은 같은 이미지를 흐리게 깐 배경(::before, --img)으로 채움
    var fitOf = function (w) {
      var C = KCARD[w.id] || {}, z = +C.zoom;
      return { fit: C.fit === "cover" ? "cover" : "contain", z: z > 100 ? Math.min(300, z) : 100, px: C.px != null && !isNaN(+C.px) ? Math.max(0, Math.min(100, +C.px)) : 50, py: C.py != null && !isNaN(+C.py) ? Math.max(0, Math.min(100, +C.py)) : 50 };
    };
    var thumbImg = function (src, f) {
      return '<img class="th-img" src="' + esc(src) + '" alt="" decoding="async" style="object-fit:' // 흐린 배경(::before)이 같은 이미지를 먼저 받으므로 지연 로딩 안 함 + f.fit + ';object-position:' + f.px + '% ' + f.py + '%'
        + (f.z !== 100 ? ';transform:scale(' + (f.z / 100) + ');transform-origin:' + f.px + '% ' + f.py + '%' : '') + '">';
    };
    // 타일 = 전체 프로젝트 휠과 같은 상품카드: 흰 카드 안 썸네일(작은·세로 타일은 위, 가로 타일은 왼쪽) + 분야 · 제목 · 회사·연도 · 대표 지표
    var tileHtml = function (x, span, j) {
      var w = x.w, co = x.co, cm = catMeta(w.category), v = cardView(w), md = v.main, m0 = v.m0, yr = yearOf(w);
      var th = md
        ? '<span class="pc-th img" style="--img:url(\'' + esc(md.src) + '\')">' + thumbImg(md.src, fitOf(w)) + (md.yt ? '<i class="t-play" aria-hidden="true"></i>' : '') + '</span>'
        : '<span class="pc-th art">' + coverArt(w, m0) + '</span>'; // 이미지 없으면 자동 일러스트
      return '<a class="tile pc' + span + (cm.dark ? ' dk' : '') + '" href="' + tpUrl + '#p-' + esc(w.id || "") + '" target="_top" data-ext style="' + (j != null ? '--j:' + j + ';' : '') + '--c:' + cm.c + '">' + th
        + '<span class="pc-bd"><em class="pc-cat">' + esc(cm.en) + '</em><b class="pc-t">' + esc(v.title) + '</b><span class="pc-m">' + esc(dispName(co)) + (yr ? ' · ' + esc(yr) : '') + '</span>'
        + (m0 ? '<span class="pc-p"><b>' + esc(m0.value) + '</b>' + (m0.label ? ' ' + esc(m0.label) : '') + '</span>' : '') + '</span><span class="t-go" aria-hidden="true">→</span></a>';
    };
    var mosaic = pick.map(function (x, i) {
      var span = i === 1 ? " tall" : i === 3 ? " wide" : "";
      return tileHtml(x, span, i);
    }).join("");
    // 전체 보기 버튼(→ 슬라이드 프로젝트 페이지 /projects-test, 타일도 그 페이지의 해당 장으로): 썸네일 4개 겹침 + 제목/부제 + 화살표 (문구는 KILO 대시보드에서)
    var stackSrc = works.filter(function (x) { return pick.indexOf(x) < 0; }).concat(pick).map(function (x) { return { m: mediaOf(x.w)[0], cm: catMeta(x.w.category), cat: x.w.category }; });
    stackSrc.sort(function (a, b) { return (b.m ? 1 : 0) - (a.m ? 1 : 0); });
    var FAN = [[-10, 7], [-4, 2], [3, 1], [9, 6]]; // 카드 덱 부채꼴(회전°, 내림px) — 호버 시 펼쳐짐
    var stack = stackSrc.slice(0, 4).map(function (s, i) { return '<i style="--r:' + FAN[i][0] + 'deg;--y:' + FAN[i][1] + 'px;' + (s.m ? "background-image:url('" + esc(s.m.src) + "')" : "background:" + s.cm.c) + '">' + (s.m ? '' : catIcon(s.cat)) + '</i>'; }).join("");
    var allCta = '<a class="pj-all rv" href="' + tpUrl + '" target="_top" data-ext><span class="pj-num">' + works.length + '</span>'
      + '<span class="pj-all-t"><b>' + esc(txt("pjAllTitle", "전체 프로젝트 보기")) + '</b><small>' + esc(txt("pjAllSub", "챕터별 슬라이드로 한눈에 보기")) + '</small></span>'
      + '<span class="pj-deck" aria-hidden="true">' + stack + '</span><span class="pj-all-a" aria-hidden="true">→</span></a>';
    var projectsInner = '<div class="cnt pj-cnt">'
      + '<div class="mosaic rv rv-g">' + mosaic + '</div>'
      + (works.length ? allCta : '')
      + '</div>';

    // ── EXPERIENCE — 이력서처럼 회사별 로고 + 텍스트. 순서 = 스튜디오 회사 순서(▲▼), 회사별 노출·표시 항목은 스튜디오에서
    var XS = { logo: shown("exp", "logo", true), role: shown("exp", "role", true), period: shown("exp", "period", true), summary: shown("exp", "summary", true), metrics: shown("exp", "metrics", true), projects: shown("exp", "projects", false), pjPeriod: shown("exp", "pjPeriod", true), stats: shown("exp", "stats", true) };
    var ymOf = function (s) { var m = String(s || "").match(/^(\d{4})-(\d{1,2})/); return m ? { y: +m[1], m: +m[2] } : null; };
    var durOf = function (co) {
      var a = ymOf(co.startDate); if (!a) return "";
      var b = ymOf(co.endDate); if (!b) { var t = new Date(); b = { y: t.getFullYear(), m: t.getMonth() + 1 }; }
      var n = (b.y - a.y) * 12 + (b.m - a.m) + 1; if (n <= 0) return "";
      var y = Math.floor(n / 12), mo = n % 12;
      return (y ? y + "년" : "") + (y && mo ? " " : "") + (mo ? mo + "개월" : "");
    };
    var expCos = companies.filter(function (co) { return (co.nameKo || co.nameEn || co.serviceKo || co.serviceEn) && !isHidden("companies", co.id); });
    var exp = expCos.map(function (co, ei) {
      var nm = dispName(co) || co.nameKo || co.nameEn || "";
      // 이름 옆 작은 글씨: 서비스명으로 표시 중이면 회사명, 아니면 영문명 (이름에 이미 들어 있으면 생략 · 예: '와그 (WAUG)')
      var hasIn = function (a, b) { return String(a).toLowerCase().indexOf(String(b).toLowerCase()) >= 0; };
      var alt = co.useService ? (co.nameKo || co.nameEn || "") : (co.nameEn && co.nameEn !== nm && !hasIn(nm, co.nameEn) ? co.nameEn : "");
      if (alt === nm) alt = "";
      // 회사별 설정(KILO 대시보드): 프로젝트 목록 · 프로젝트 기간 표시 — 없으면 전체 기본값
      var CO = (K.expCo || {})[co.id] || {};
      var showPj = CO.pj != null ? CO.pj !== false : XS.projects, showPjP = CO.pjPeriod != null ? CO.pjPeriod !== false : XS.pjPeriod;
      var coLogo = XS.logo && CO.logo !== false; // 회사별 로고 켜기/끄기(klio.expCo[id].logo) — 표시 항목 '로고'가 켜져 있을 때
      var logo = coLogo ? (co.logo ? '<span class="xp-logo"><img src="' + esc(co.logo) + '" alt="" loading="lazy"></span>'
        : '<span class="xp-logo fb">' + esc(String(nm).slice(0, 1)) + '</span>') : '';
      var per = coPeriod(co), dur = /년|개월/.test(per) ? "" : durOf(co);
      var mets = XS.metrics ? (co.metrics || []).map(function (m) { return { v: m.v != null ? m.v : m.value, k: m.k != null ? m.k : m.label }; })
        .filter(function (m) { return m.v || m.k; }).map(function (m) { return '<span class="xp-met"><b>' + esc(m.v) + '</b>' + esc(m.k) + '</span>'; }).join("") : "";
      // 주요 프로젝트 목록: KILO 대시보드에서 회사별 직접 편집(klio.expPj[회사id]) — 없으면 이 회사 프로젝트에서 자동. 클릭 모달 없음(모달은 Projects 전용)
      var xpj = (K.expPj && Array.isArray(K.expPj[co.id]))
        ? K.expPj[co.id].filter(function (it) { return it && it.visible !== false && String(it.title || "").trim(); })
        : works.filter(function (x) { return x.co === co; }).map(function (x) { return { title: x.w.title, period: wPeriod(x.w) }; });
      var pjs = showPj ? xpj.map(function (it, k) {
        return '<li style="--k:' + k + '"><span class="t">' + esc(it.title) + '</span>' + (showPjP && it.period ? '<span class="p">' + esc(it.period) + '</span>' : '') + '</li>'; }).join("") : "";
      var sum = XS.summary && co.summary ? '<p class="xp-sum">' + esc(co.summary) + '</p>' : '';
      // 서비스 분리(회사별 토글 klio.expCo[id].split): 회사명 아래로 서비스(이름·역할·기간·요약·프로젝트)를 한 단계 더 묶어 표시
      var svs = CO.split && K.expSvc && Array.isArray(K.expSvc[co.id]) ? K.expSvc[co.id].filter(function (sv) { return sv && sv.visible !== false && String(sv.name || sv.role || "").trim(); }) : null;
      if (svs && svs.length) {
        nm = co.nameKo || co.nameEn || nm; alt = co.nameKo && co.nameEn && co.nameEn !== nm && !hasIn(nm, co.nameEn) ? co.nameEn : "";
        var byRole = CO.splitKind === "role"; // 분리 단위: 서비스(앱 로고) · 직책(로고 없이 — 스타일 roleStyle: num 번호 · date 기간 왼쪽 · bar 세로 막대)
        var rs = byRole ? ({ date: "date", bar: "bar" })[CO.roleStyle] || "num" : "";
        // 서비스별 로고 켜기/끄기(sv.logoOff) — 일부만 끄면 글자 줄은 맞춰 둠(빈 자리), 모두 끄면 들여쓰기 없음
        var anyLogo = XS.logo && !byRole && svs.some(function (sv) { return !sv.logoOff; });
        pjs = svs.map(function (sv, si) {
          var sp = showPj ? (sv.projects || []).filter(function (it) { return it && it.visible !== false && String(it.title || "").trim(); }).map(function (it, k) {
            return '<li style="--k:' + k + '"><span class="t">' + esc(it.title) + '</span>' + (showPjP && it.period ? '<span class="p">' + esc(it.period) + '</span>' : '') + '</li>'; }).join("") : "";
          var sl = anyLogo && !sv.logoOff ? (sv.logo ? '<span class="xp-sv-logo"><img src="' + esc(sv.logo) + '" alt="" loading="lazy"></span>'
            : '<span class="xp-sv-logo fb">' + esc(String(sv.name || "").slice(0, 1)) + '</span>') : '';
          var no = rs === "num" ? '<span class="xp-sv-no">' + (si < 9 ? '0' : '') + (si + 1) + '</span>' : rs === "date" && XS.period && sv.period ? '<span class="xp-sv-no">' + esc(sv.period) + '</span>' : '';
          return '<div class="xp-sv' + (rs ? ' r r-' + rs : sl ? '' : anyLogo ? ' blank' : ' nologo') + '" style="--s:' + si + '">' + sl + no + '<div class="xp-sv-hd"><div class="xp-sv-tt"><h4>' + esc(sv.name || "") + '</h4>' + (XS.role && sv.role ? '<p class="xp-sv-role">' + esc(sv.role) + '</p>' : '') + '</div>'
            + (XS.period && sv.period && rs !== "date" ? '<p class="xp-sv-when">' + esc(sv.period) + '</p>' : '') + '</div>'
            + (XS.summary && sv.summary ? '<p class="xp-sv-sum">' + esc(sv.summary) + '</p>' : '')
            + (sp ? '<ul class="xp-pj">' + sp + '</ul>' : '') + '</div>';
        }).join("");
        // 회사 로고(위) + 서비스 로고(아래 · 들여쓴 본문 열) — 크기·위치를 달리해 겹치지 않게 구분
        var clogo = coLogo ? (co.logo ? '<span class="xp-logo"><img src="' + esc(co.logo) + '" alt="" loading="lazy"></span>'
          : '<span class="xp-logo fb">' + esc(String(nm).slice(0, 1)) + '</span>') : '';
        return '<div class="xp xp-split rv' + (clogo ? '' : ' nologo') + '" style="--d:' + (ei * 60) + 'ms"><div class="xp-hd">' + clogo
          + '<div class="xp-tt"><h3>' + esc(nm) + (alt ? '<small>' + esc(alt) + '</small>' : '') + '</h3>' + '' + '</div>'
          + (XS.period && per ? '<p class="xp-when">' + esc(per) + (dur ? '<small>' + esc(dur) + '</small>' : '') + '</p>' : '') + '</div>'
          + '<div class="xp-bd">' + sum + (mets ? '<div class="xp-mets">' + mets + '</div>' : '') + '<div class="xp-svs">' + pjs + '</div></div>'
          + '</div>';
      }
      return '<div class="xp rv' + (logo ? '' : ' nologo') + '" style="--d:' + (ei * 60) + 'ms"><div class="xp-hd">' + logo
        + '<div class="xp-tt"><h3>' + esc(nm) + (alt ? '<small>' + esc(alt) + '</small>' : '') + '</h3>' + (XS.role && co.role ? '<p class="xp-role">' + esc(co.role) + '</p>' : '') + '</div>'
        + (XS.period && per ? '<p class="xp-when">' + esc(per) + (dur ? '<small>' + esc(dur) + '</small>' : '') + '</p>' : '') + '</div>'
        + (sum || mets || pjs ? '<div class="xp-bd">' + sum + (mets ? '<div class="xp-mets">' + mets + '</div>' : '') + (pjs ? '<ul class="xp-pj">' + pjs + '</ul>' : '') + '</div>' : '')
        + '</div>';
    }).join("");
    // 하단 스탯 카드: 스튜디오에서 개별 노출 선택(설정 전엔 앞 3개)
    var hlist = (d.highlights || []).filter(function (h) { return h && (h.value || h.label); });
    var hsArr = KH ? hlist.filter(function (h) { return !isHidden("stats", h.id); }) : hlist.slice(0, 3);
    var hs = XS.stats ? hsArr.map(function (h, j) {
      return '<div class="dcard" style="--j:' + j + '"><h4 data-count="' + esc(String(h.value).replace(/[^0-9]/g, "")) + '">' + esc(h.value) + '</h4><p>' + esc(h.label) + '</p></div>';
    }).join("") : "";
    var experienceInner = '<div class="cnt">' + exp
      + (hs ? '<div class="cards3 mt rv rv-g">' + hs + '</div>' : '') + '</div>';

    // ── AX (예전 Archive 자리) — 핵심만: AX 콘솔 대표 3 기능 + 콘솔로 연결 (전체 구조는 /ax)
    var axNotesArr = (d.axNotes || []).filter(function (x) { return x.visible !== false; });
    var axIntro = (d.klio && d.klio.text && d.klio.text.axIntro) ? d.klio.text.axIntro
      : (((axNotesArr.filter(function (n) { return n.section === "principle"; })[0]) || {}).body
        || "흩어진 도구와 지표를 하나의 마케팅 콘솔로 — 통합 대시보드·자동화·히스토리까지 직접 설계·구축·운영합니다.");
    var axCore = (d.klio && Array.isArray(d.klio.axCore) && d.klio.axCore.length) ? d.klio.axCore : DEFAULT_AXCORE;
    var axCoreArr = axCore.filter(function (x) { return x && x.visible !== false && (x.title || x.desc); });
    // 카드 썸네일: 올린 이미지(axCore[i].img) 또는 기능별 미니 화면 일러스트(대시보드·자동화·히스토리)
    var AXART = {
      dash: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect x="12" y="12" width="136" height="76" rx="9" fill="#fff"/><rect x="20" y="20" width="34" height="16" rx="4" fill="#abdcd1"/><rect x="58" y="20" width="34" height="16" rx="4" fill="#c3cde4"/><rect x="96" y="20" width="44" height="16" rx="4" fill="#eae6da"/><path class="ln" d="M22 74 L40 63 L56 67 L74 52 L92 58 L110 45 L126 49 L140 36" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 80H140" stroke="#222" stroke-opacity=".12"/></svg>',
      auto: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect x="12" y="12" width="136" height="76" rx="9" fill="#fff"/><rect x="112" y="20" width="26" height="13" rx="6.5" fill="#222"/><circle cx="131.5" cy="26.5" r="4.4" fill="#fff"/><rect x="20" y="44" width="34" height="24" rx="7" fill="#c3cde4"/><rect x="63" y="44" width="34" height="24" rx="7" fill="#abdcd1"/><rect x="106" y="44" width="34" height="24" rx="7" fill="#dd8e6e"/><path class="ln" d="M54 56h9M97 56h9" stroke="#222" stroke-width="2.2" stroke-linecap="round"/><path d="M59 52.5l3.5 3.5-3.5 3.5M102 52.5l3.5 3.5-3.5 3.5" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="37" cy="56" r="3.6" fill="#222"/><circle cx="80" cy="56" r="3.6" fill="#222"/><path d="M118 56l3.4 3.4 6-6.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      hist: '<svg viewBox="0 0 160 100" aria-hidden="true"><rect x="12" y="12" width="136" height="76" rx="9" fill="#fff"/><path class="ln" d="M32 26V76" stroke="#222" stroke-opacity=".18" stroke-width="2"/><circle cx="32" cy="28" r="4.4" fill="#222"/><rect x="44" y="23" width="70" height="10" rx="3" fill="#eae6da"/><circle cx="32" cy="51" r="4.4" fill="#dd8e6e"/><rect x="44" y="46" width="90" height="10" rx="3" fill="#c3cde4"/><circle cx="32" cy="74" r="4.4" fill="#abdcd1"/><rect x="44" y="69" width="56" height="10" rx="3" fill="#abdcd1"/></svg>'
    };
    var axPick = function (s) { s = String(s || ""); return /대시보드|지표|dashboard/i.test(s) ? "dash" : /히스토리|기록|워크플로|history|timeline/i.test(s) ? "hist" : /자동|automation|규칙/i.test(s) ? "auto" : ""; };
    var axArtOf = function (c, i) { return axPick(c.title) || axPick(c.desc) || ["dash", "auto", "hist"][i % 3]; }; // 제목 기준 우선
    var axCoreHtml = axCoreArr.map(function (c, i) {
      var art = axArtOf(c, i);
      var th = c.img ? '<span class="ax-th" style="background-image:url(\'' + esc(c.img) + '\')"></span>' : '<span class="ax-th art ax-' + art + '">' + AXART[art] + '</span>';
      return '<div class="ax-core" style="--j:' + (i * 2) + '">' + th + '<div class="ax-ctx"><span class="ax-cno">' + esc(c.num || ("0" + (i + 1))) + '</span><h4>' + esc(c.title) + '</h4>' + (c.desc ? '<p>' + esc(c.desc) + '</p>' : '') + '</div></div>';
    }).join("");
    // AX 콘솔 버튼 = '전체 프로젝트 보기'와 같은 다크 카드(큰 가는 글자 · 제목/보조 문구 · 미니 화면 덱 · 화살표)
    var AXBG = { dash: "var(--mint)", auto: "var(--lav)", hist: "var(--beige)" }, FAN3 = [[-9, 6], [0, 1], [9, 6]];
    var axDeck = (axCoreArr.length ? axCoreArr : DEFAULT_AXCORE).slice(0, 3).map(function (c, i) {
      var art = axArtOf(c, i);
      return '<i class="ax-di" style="--r:' + FAN3[i][0] + 'deg;--y:' + FAN3[i][1] + 'px;' + (c.img ? "background-image:url('" + esc(c.img) + "')" : "background:" + AXBG[art]) + '">' + (c.img ? '' : AXART[art]) + '</i>';
    }).join("");
    // /ax = 구조·개요 + 데모 콘솔 통합 페이지 하나. 예전 기본 문구로 저장돼 있으면 새 기본 문구로 보여줘요.
    var axT = function (k, old, def) { var v = txt(k, def); return v === old ? def : v; };
    var axCta = '<a class="pj-all ax-all rv" href="' + esc(txt("axLink", "https://kimjinsoo-mkt-ax.vercel.app/ax")) + '" target="_blank" rel="noopener"><span class="pj-num">AX</span>'
      + '<span class="pj-all-t"><b>' + esc(axT("axLinkText", "AX 콘솔에서 전체 구조 보기", "AX-MKT 콘솔 보기")) + '</b><small>' + esc(axT("axLinkSub", "대시보드 · 자동화 · 워크플로우 한눈에", "구조 · 개요와 데모 콘솔(가상 데이터)을 한 곳에서")) + '</small></span>'
      + '<span class="pj-deck" aria-hidden="true">' + axDeck + '</span><span class="pj-all-a" aria-hidden="true">→</span></a>';
    var axInner = '<div class="cnt ax-cnt">'
      + '<p class="rv" style="font-size:16px;line-height:1.75;color:var(--ink50);margin-bottom:4px">' + esc(axIntro) + '</p>'
      + (axCoreHtml ? '<div class="ax-cores rv rv-g">' + axCoreHtml + '</div>' : '')
      + (shown("ax", "link", true) ? axCta : '')
      + '</div>';

    // ── TECHSTACK (편집 가능한 행 데이터: klio.techstack, 없으면 큐레이션 3행 + 현재 DB 데이터 전부 덤프)
    var mqRow = function (items, rev, j) {
      if (!items.length) return "";
      var one = items.map(function (t, i) { return '<span class="' + (i % 2 ? "on" : "") + '">' + esc(t) + '</span>'; }).join("");
      var dup = items.map(function (t, i) { return '<span class="dup ' + (i % 2 ? "on" : "") + '">' + esc(t) + '</span>'; }).join("");
      return '<div class="mq' + (rev ? " rev" : "") + '" style="--j:' + (j || 0) + '"><div class="tk">' + one + dup + '</div></div>';
    };
    var techCfg = (d.klio && Array.isArray(d.klio.techstack) && d.klio.techstack.length) ? d.klio.techstack : defaultTechRows();
    var techRows = techCfg.filter(function (r) { return r && r.visible !== false && (r.items || []).filter(Boolean).length; });
    var techstackInner = '<div class="cnt stack-rows rv rv-g">'
      + techRows.map(function (r, ri) { return mqRow((r.items || []).filter(Boolean), ri % 2 === 1, ri * 2); }).join("") + '</div>';

    // ── SKILLS (역량별 프로젝트 수)
    var catCount = {}; works.forEach(function (x) { var c = x.w.category || "기타"; catCount[c] = (catCount[c] || 0) + 1; });
    var catArr = Object.keys(catCount).map(function (k) { return { cat: k, n: catCount[k] }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 6);
    // 스튜디오에서 편집한 카드(klio.skills: 값·라벨·보조·노출)가 있으면 그걸로, 없으면 카테고리별 프로젝트 수
    var skItems = (Array.isArray(K.skills) && K.skills.length)
      ? K.skills.filter(function (s) { return s && s.visible !== false && (s.value || s.label); })
      : catArr.map(function (o) { return { value: String(o.n), label: o.cat, sub: catMeta(o.cat).en }; });
    var skRows = "";
    for (var si = 0; si < skItems.length; si += 3) {
      skRows += '<div class="cards3 rv rv-g">' + skItems.slice(si, si + 3).map(function (s, j) {
        var num = String(s.value == null ? "" : s.value).replace(/[^0-9]/g, "");
        return '<div class="dcard" style="--j:' + j + '"><h4' + (num ? ' data-count="' + num + '"' : '') + '>' + esc(s.value) + '</h4><p>' + esc(s.label || "") + (s.sub ? '<br>' + esc(s.sub) : '') + '</p></div>';
      }).join("") + '</div>';
    }
    var skillsInner = '<div class="cnt">' + skRows + '</div>';

    // ── CONTACT (문구·표시 항목 모두 스튜디오에서)
    var contactIntro = txt("contactIntro", "새 프로젝트나 협업, 채용 문의가 있다면 편하게 연락 주세요.");
    var availLabel = txt("available", "Available for work");
    var cEmail = shown("contact", "email", true) && P.email, cPhone = shown("contact", "phone", true) && P.phone, cSite = shown("contact", "site", true);
    var contactInner = '<div class="cnt rv rv-g">'
      + '<h3 style="--j:0">' + tx(contactIntro) + '</h3>'
      + '<div class="meta" style="--j:2">' + (shown("contact", "location", true) ? '<span>' + esc(P.location || "Seoul, Korea") + '</span>' : '')
      + (cEmail ? '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>' : '')
      + (cPhone ? '<a href="tel:' + esc(String(P.phone).replace(/[^0-9]/g, "")) + '">' + esc(P.phone) + '</a>' : '') + '</div>'
      + (shown("contact", "avail", true) ? '<div class="avail" style="--j:3"><i></i>' + esc(availLabel) + '</div>' : '')
      + '<div class="socials" style="--j:4">'
      + (cEmail ? '<a href="mailto:' + esc(P.email) + '" aria-label="이메일"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></a>' : '')
      + (cSite ? '<a href="' + esc(siteHref) + '" target="_blank" rel="noopener" aria-label="포트폴리오 사이트"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.7 8.2 12s1.3 6.4 3.8 9"/></svg></a>' : '')
      + (cPhone ? '<a href="tel:' + esc(String(P.phone).replace(/[^0-9]/g, "")) + '" aria-label="전화"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>' : '')
      + '</div></div>';

    // ── 섹션 레지스트리 + 사용자 구성(klio.sections: 순서·표시·라벨). 하단 독도 같은 구성 사용.
    var SECDEF = {
      about: { label: "About", cls: "", inner: aboutInner },
      projects: { label: "Projects", cls: "", inner: projectsInner },
      experience: { label: "Experience", cls: "", inner: experienceInner },
      ax: { label: "AX", cls: "", inner: axInner },
      techstack: { label: "Techstack", cls: "", inner: techstackInner },
      skills: { label: "Skills", cls: "", inner: skillsInner },
      contact: { label: "Contact", cls: " contact", inner: contactInner }
    };
    var DEFORDER = ["about", "projects", "experience", "ax", "techstack", "skills", "contact"];
    var kcfg = (d.klio && Array.isArray(d.klio.sections)) ? d.klio.sections : [];
    var seenK = {}, order = [];
    kcfg.forEach(function (s) { if (!s) return; var k = s.key === "archive" ? "ax" : s.key; if (SECDEF[k] && !seenK[k]) { seenK[k] = 1; order.push({ key: k, label: (s.label != null && s.label !== "") ? s.label : SECDEF[k].label, on: s.on !== false }); } });
    DEFORDER.forEach(function (k) { if (!seenK[k]) order.push({ key: k, label: SECDEF[k].label, on: true }); });
    var visibleSec = order.filter(function (s) { return s.on; });
    var sectionsHtml = visibleSec.map(function (s, si) { var def = SECDEF[s.key]; return '<section class="row' + def.cls + '" id="' + s.key + '"><h2 class="rv rv-l"><span class="sn">' + (si < 9 ? "0" : "") + (si + 1) + '</span>' + esc(s.label) + '</h2>' + def.inner + '</section>'; }).join("");
    var dock = '<header class="gh"><div class="gh-in"><a class="gh-nm" href="#home">' + esc(nameEn || nameKo || "Portfolio") + '</a>'
      + gtabs("resume", '<nav class="dock" aria-label="섹션 이동"><span class="dock-pill" aria-hidden="true"></span>' + secLinks(false) + '</nav>') + '</div></header>';

    var KCSS = ':root{--ink:#222;--ink50:rgba(34,34,34,.55);--gray:#909090;--light:#d6d6d6;--bd:rgba(144,144,144,.2);--bd2:rgba(144,144,144,.1);--mint:#abdcd1;--beige:#e6e1d5;--sand:#eae6da;--coral:#dd8e6e;--lav:#c3cde4;--font:"Figtree","Pretendard Variable",Pretendard,-apple-system,system-ui,"Apple SD Gothic Neo",sans-serif;--ez:cubic-bezier(.25,.6,.3,1);--ez2:cubic-bezier(.16,1,.3,1)}'
      + '*,*::before,*::after{box-sizing:border-box}html{scroll-behavior:smooth;overflow-x:clip;-webkit-text-size-adjust:100%;scroll-padding-top:40px}'
      + 'body{margin:0;background:#fff;color:var(--ink);font-family:var(--font);font-size:16px;font-weight:500;line-height:170%;letter-spacing:-.02em;-webkit-font-smoothing:antialiased;word-break:keep-all;overflow-wrap:break-word;overflow-x:clip}'
      + 'h1,h2,h3,h4{margin:0;font-weight:600;letter-spacing:-.02em}p{margin:0}a{color:inherit;text-decoration:none}::selection{background:var(--mint);color:var(--ink)}:focus-visible{outline:2px solid var(--ink);outline-offset:3px}'
      + '.js .rv{opacity:0;transform:translateY(22px);transition:opacity .8s var(--ez),transform .8s var(--ez);transition-delay:var(--d,0ms)}.js .rv.in{opacity:1;transform:none}'
      + '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.js .rv{opacity:1;transform:none;transition:none}}'
      + '.page{max-width:880px;margin:0 auto;padding:0 24px 180px}.row{display:grid;grid-template-columns:1fr 1fr;margin-top:150px}.row>h2{font-size:14px;font-weight:600;line-height:130%}.cnt{max-width:440px}'
      + '@media(max-width:920px){.row{grid-template-columns:1fr;margin-top:104px}.row>h2{margin-bottom:22px}}'
      + '.home{display:grid;grid-template-columns:1fr 1fr;padding-top:88px}.sig{margin:0;font-family:var(--sgf);font-size:var(--sgfs);font-weight:var(--sgw);line-height:1;letter-spacing:0;color:var(--ink)}'
      // 붓글씨 서명: 굵은 붓 획(stroke)을 글자 모양으로 잘라 그림 → 다 쓰면 채움(fill)으로 빈틈 없이. 모션 전엔 숨겼다가 글씨체가 준비되면 .go
      + '.sig .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.sig .sg{display:block;width:100%;height:1.46em;overflow:visible}'
      + '.sg-t{white-space:pre}.sg-ink{fill:currentColor;stroke:currentColor;stroke-width:var(--ssw);stroke-linecap:round;stroke-linejoin:round}'
      + '.js .sig[data-draw]:not(.go) .sg{opacity:0;animation:sgFail 0s 3.4s forwards}@keyframes sgFail{to{opacity:1}}'
      + '.js .sig[data-draw].go .sg-ink tspan{animation:sgDraw .72s cubic-bezier(.45,.05,.3,1) backwards;animation-delay:calc(.2s + var(--k) * .12s)}'
      + '@keyframes sgDraw{from{fill:transparent;stroke-dasharray:9em 90em;stroke-dashoffset:9.6em}to{fill:transparent;stroke-dasharray:9em 90em;stroke-dashoffset:0}}'
      + '.meta .nm{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 9px;margin:0 0 2px}.meta .nm b{font-size:14px;font-weight:700;letter-spacing:.02em}.meta .nm span{font-size:13px;color:var(--ink50)}'
      + '.meta{margin-top:14px;display:flex;flex-direction:column;gap:4px}.meta span,.meta a{font-size:13px;font-weight:500;line-height:160%}.meta a{text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}.meta a:hover{color:var(--gray)}'
      + '.photo{position:relative;width:196px;height:260px}.photo .card{width:196px;height:260px;border-radius:24px;background:var(--mint);display:grid;place-items:center;overflow:hidden}.photo .card b{font-size:56px;font-weight:700;letter-spacing:-.04em;color:var(--ink);transform:translateX(-14px)}'
      + '.photo .orbit{position:absolute;top:50%;right:-98px;width:150px;height:150px;margin-top:-75px;animation:spin 26s linear infinite;pointer-events:none}.photo .orbit text{font-family:var(--font);font-size:12px;font-weight:600;letter-spacing:.42em;fill:var(--ink);text-transform:uppercase}'
      + '@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.photo .orbit{animation:none}}'
      + '.home .hero-h{margin-top:40px;font-size:20px;line-height:150%;max-width:360px}.home .hero-h .dim{color:var(--gray)}@media(max-width:920px){.home{grid-template-columns:1fr;padding-top:64px}.home .cnt{margin-top:52px}}'
      // 사진 아래 소개 문장을 숨기면(.noh) 바로 다음 섹션(About)을 사진 쪽으로 당겨 자기소개가 한 덩어리로 이어지게
      + '.home.noh+.row{margin-top:88px}@media(max-width:920px){.home.noh+.row{margin-top:64px}}'
      + '.about p{font-size:16px;line-height:175%}.about p+p{margin-top:22px}.about p.g{color:var(--ink50);font-size:14px}.about p.lead{font-size:20px;font-weight:600;line-height:150%;letter-spacing:-.025em;text-wrap:balance}'
      + '.mosaic{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:201px;gap:12px}.tile{position:relative;border-radius:24px;overflow:hidden;display:grid;place-items:center;transition:transform .35s var(--ez)}.tile:hover{transform:translateY(-3px)}.tile.tall{grid-row:span 2}.tile.wide{grid-column:span 2}.tile svg{width:46px;height:46px}.tile.wide svg{width:42px;height:42px}'
      + '.tile .lb{position:absolute;left:18px;bottom:14px;right:18px;line-height:140%}.tile .lb b{display:block;font-size:13px;font-weight:600;letter-spacing:-.01em}.tile .lb span{display:block;font-size:11px;font-weight:500;color:var(--ink50)}.tile.dark .lb b{color:#fff}.tile.dark .lb span{color:rgba(255,255,255,.72)}'
      + '.tile .kp{position:absolute;right:16px;top:14px;font-size:11px;font-weight:600;background:rgba(255,255,255,.72);border-radius:999px;padding:5px 10px;line-height:1}@media(max-width:520px){.mosaic{grid-auto-rows:168px}}'
      + '.ent{padding:44px 0}.ent+.ent{border-top:1px solid var(--bd)}.ent:first-child{padding-top:0}.ent h3{font-size:20px;line-height:130%}.ent .sub{margin-top:6px;font-size:12px;line-height:150%;color:var(--gray)}.ent p.d{margin-top:22px;font-size:14px;line-height:175%;color:var(--ink50)}'
      + '.ent .links{margin-top:12px;display:flex;gap:4px 16px;flex-wrap:wrap}.ent .links a{font-size:12px;font-weight:500;color:var(--ink);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}.ent .links a:hover{color:var(--gray)}'
      + '.arch .ent{padding:30px 0}.arch .ent h3{font-size:17px}.arch .ent p.d{margin-top:12px}'
      // Experience: 깔끔한 이력서형 — [로고] 회사명/역할 · 오른쪽 재직기간 / 들여쓴 작은 점 목록 · 회사 사이 얇은 구분선
      + '.xp{padding:28px 0}.xp+.xp{border-top:1px solid var(--bd)}.xp:first-child{padding-top:2px}'
      + '.xp-hd{display:grid;grid-template-columns:40px minmax(0,1fr) auto;column-gap:14px;align-items:start}.xp.nologo .xp-hd{grid-template-columns:minmax(0,1fr) auto}'
      + '.xp-logo{width:40px;height:40px;border-radius:11px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.07);display:grid;place-items:center;font-size:15px;font-weight:700;color:var(--ink)}.xp-logo img{width:100%;height:100%;object-fit:cover;display:block}.xp-logo.fb{background:var(--sand)}'
      + '.xp-tt{min-width:0;padding-top:1px}.xp-tt h3{font-size:16px;font-weight:600;line-height:1.35;letter-spacing:-.02em}.xp-tt h3 small{font-size:12px;font-weight:500;color:var(--gray);margin-left:6px;letter-spacing:0}.xp-role{margin-top:3px;font-size:12.5px;line-height:1.5;color:var(--ink50)}'
      + '.xp-when{padding-top:2px;text-align:right;font-size:12px;font-weight:500;line-height:1.35;color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}.xp-when small{display:block;margin-top:3px;font-size:11px;color:var(--gray)}'
      + '.xp-bd{margin-left:54px}.xp.nologo .xp-bd{margin-left:0}.xp-sum{margin-top:12px;font-size:13.5px;line-height:1.75;color:var(--ink50)}'
      + '.xp-mets{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:10px;font-size:12px;color:var(--ink50)}.xp-met b{color:var(--ink);font-weight:700;margin-right:5px}'
      + '.xp-pj{list-style:none;margin:12px 0 0;padding:0}.xp-pj li{position:relative;display:flex;align-items:baseline;gap:12px;padding:4px 0 4px 13px;font-size:13px;line-height:1.55;color:var(--ink)}'
      + '.xp-pj li::before{content:"";position:absolute;left:1px;top:calc(4px + .775em - 2px);width:4px;height:4px;border-radius:50%;background:var(--ink)}.xp-pj .t{flex:1;min-width:0}.xp-pj .p{flex:none;font-size:11px;color:var(--gray);font-variant-numeric:tabular-nums;white-space:nowrap}'
      + '.xp-split .xp-tt h3{font-size:17px;font-weight:700;letter-spacing:-.025em}.xp-split .xp-tt h3 small{font-size:12.5px}'
      + '.xp-split:not(.nologo) .xp-svs{margin-top:20px;padding-top:18px;border-top:1px solid var(--bd)}.xp-svs{margin-top:18px}.xp-sv{position:relative;padding:0 0 22px 44px;min-height:30px}.xp-sv:last-child{padding-bottom:0}.xp-sv.nologo{padding-left:0}'
      + '.xp-sv-logo{position:absolute;left:0;top:0;width:30px;height:30px;border-radius:9px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.07);display:grid;place-items:center;font-size:12.5px;font-weight:700;color:var(--ink)}.xp-sv-logo img{width:100%;height:100%;object-fit:cover;display:block}.xp-sv-logo.fb{background:var(--sand)}'
      + '.xp-sv::after{content:"";position:absolute;left:15px;top:38px;bottom:8px;width:1px;background:var(--bd)}.xp-sv:last-child::after,.xp-sv.nologo::after,.xp-sv.blank::after{display:none}'
      + '.xp-sv.r{min-height:0;padding:18px 0}.xp-sv.r:first-child{padding-top:0}.xp-sv.r:last-child{padding-bottom:0}.xp-sv.r+.xp-sv.r{border-top:1px solid var(--bd)}.xp-sv.r::after{display:none}.xp-sv.r .xp-sv-hd{padding-top:0}'
      + '.xp-sv-no{position:absolute;left:0;top:20px;font-size:12px;line-height:1.5;font-variant-numeric:tabular-nums;white-space:nowrap}.xp-sv.r:first-child .xp-sv-no{top:2px}'
      + '.xp-sv.r-num{padding-left:36px}.r-num .xp-sv-no{font-weight:600;letter-spacing:.02em;color:var(--gray)}'
      + '.xp-sv.r-date{padding-left:124px}.r-date .xp-sv-no{width:112px;font-weight:500;color:var(--ink);white-space:normal}'
      + '.xp-sv.r-bar{padding:0 0 0 16px;border-left:2px solid var(--ink)}.xp-sv.r-bar+.xp-sv.r-bar{border-top:0;margin-top:22px}'
      + '.xp-sv-hd{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding-top:5px}.xp-sv-tt{min-width:0}'
      + '.xp-sv h4{font-size:14.5px;font-weight:600;line-height:1.4;letter-spacing:-.02em;color:var(--ink)}'
      + '.xp-sv-role{margin-top:2px;font-size:12.5px;line-height:1.5;color:var(--ink50)}.xp-sv-when{flex:none;font-size:11.5px;color:var(--gray);font-variant-numeric:tabular-nums;white-space:nowrap}'
      + '.xp-sv-sum{margin-top:7px;font-size:13px;line-height:1.7;color:var(--ink50)}.xp-sv .xp-pj{margin-top:6px}'
      + '.js .xp-split .xp-sv{opacity:0;transform:translateY(8px);transition:opacity .6s var(--ez),transform .6s var(--ez);transition-delay:calc(var(--d,0ms) + 160ms + var(--s,0) * 80ms)}.js .xp-split.in .xp-sv{opacity:1;transform:none}'
      + '@media(max-width:560px){.xp-sv{padding-left:40px}.xp-sv.r-num{padding-left:30px}.xp-sv.r-date{padding-left:0}.r-date .xp-sv-no{position:static;display:block;width:auto;margin-bottom:3px;color:var(--gray)}.xp-sv-hd{flex-direction:column;gap:2px}}'
      + '@media(prefers-reduced-motion:reduce){.js .xp-split .xp-sv{opacity:1;transform:none;transition:none}}'
      + '@media(max-width:560px){.xp-hd{grid-template-columns:36px minmax(0,1fr)}.xp-logo{width:36px;height:36px;border-radius:10px}.xp-when{grid-column:2;text-align:left;margin-top:6px}.xp-when small{display:inline;margin:0 0 0 6px}.xp.nologo .xp-when{grid-column:1}.xp-bd{margin-left:50px}.xp-pj li{flex-direction:column;gap:0}}'
      + '.js .xp .xp-pj li{opacity:0;transform:translateY(6px);transition:opacity .5s var(--ez),transform .5s var(--ez);transition-delay:calc(var(--d,0ms) + 200ms + var(--k,0) * 45ms)}.js .xp.in .xp-pj li{opacity:1;transform:none}'
      // 조회수 알약 (Home)
      + '.vw{display:inline-flex;align-items:center;gap:9px;margin-top:16px;padding:6px 12px;border-radius:999px;border:1px solid var(--bd);background:rgba(255,255,255,.65);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:11.5px;color:var(--gray);line-height:1}.vw b{color:var(--ink);font-weight:700;font-variant-numeric:tabular-nums;margin-left:3px}'
      + '.vw-dot{position:relative;width:6px;height:6px;border-radius:50%;background:#2fb57a;flex:none}.vw-dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:#2fb57a;animation:ping 1.9s var(--ez) infinite}.vw-sep{width:1px;height:10px;background:var(--bd)}.vw.na{display:none}'
      + '@media(prefers-reduced-motion:reduce){.js .rv-g:not(.in)>*{opacity:1}.js .rv-g.in>*{animation:none}.vw-dot::after{animation:none}}'
      // 사진 딤: 기본은 배경만(가장자리 비네트 — 얼굴은 밝게), 선택 시 사진 전체
      + '.photo .card{position:relative}.photo .card.img{background-size:cover;background-position:center}.photo .card.img::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit}'
      + '.photo .card.img.dim-bg::after{background:radial-gradient(ellipse 62% 54% at 50% 40%,rgba(17,17,20,0) 46%,rgba(17,17,20,var(--dim,.25)) 100%)}.photo .card.img.dim-all::after{background:rgba(17,17,20,var(--dim,.25))}'
      + '.cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.cards3.mt{margin-top:64px}.cards3+.cards3{margin-top:16px}.dcard{background:var(--ink);border-radius:32px;min-height:144px;padding:20px;display:flex;flex-direction:column;justify-content:space-between}.dcard h4{font-size:32px;font-weight:600;line-height:1;color:#fff}.dcard p{font-size:12px;line-height:145%;color:var(--light)}@media(max-width:520px){.cards3{grid-template-columns:1fr 1fr}}'
      + '.stack-rows{display:flex;flex-direction:column;gap:26px}.mq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}.mq .tk{display:flex;align-items:center;gap:34px;width:max-content;animation:mqL 34s linear infinite}.mq.rev .tk{animation-name:mqR}.mq:hover .tk{animation-play-state:paused}@keyframes mqL{to{transform:translateX(-50%)}}@keyframes mqR{from{transform:translateX(-50%)}to{transform:translateX(0)}}.mq .tk span{flex-shrink:0;font-size:16px;font-weight:500;color:var(--gray);white-space:nowrap}.mq .tk span.on{color:var(--ink);font-weight:600}'
      + '@media(prefers-reduced-motion:reduce){.mq .tk,.mq.rev .tk{animation:none;flex-wrap:wrap;width:auto}.mq{mask-image:none;-webkit-mask-image:none}.mq .dup{display:none}}'
      + '.contact h3{font-size:20px;line-height:150%;max-width:380px}.contact .meta{margin-top:26px}.avail{margin-top:34px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}.avail i{width:8px;height:8px;border-radius:50%;background:var(--mint)}'
      + '.socials{margin-top:16px;display:flex;gap:10px}.socials a{width:30px;height:30px;border:1px solid var(--bd);border-radius:9px;display:grid;place-items:center;color:var(--ink);transition:.2s}.socials a:hover{background:var(--bd2)}.socials svg{width:15px;height:15px}.foot{margin-top:130px;text-align:center;font-size:12px;color:var(--gray)}'
      // 하단 바: iOS식 캡슐(바깥·안쪽 알약 동심) + 유리 재질(블러·채도·위쪽 하이라이트)
      + '.dock{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:100;display:flex;gap:2px;padding:5px;border-radius:999px;background:rgba(28,28,30,.76);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 0 .5px rgba(255,255,255,.1),0 18px 40px -16px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.12);max-width:calc(100vw - 20px);overflow-x:auto;scrollbar-width:none}.dock::-webkit-scrollbar{display:none}'
      + '.dock a{flex:none;font-size:12.5px;font-weight:600;line-height:1;letter-spacing:-.01em;color:rgba(255,255,255,.62);padding:11px 15px;border-radius:999px;white-space:nowrap;transition:.2s var(--ez)}.dock a:hover{color:#fff}.dock a[aria-current="true"]{color:#fff;background:rgba(255,255,255,.16)}'
      + '@media(max-width:720px){.dock{bottom:14px;gap:1px;padding:4px;max-width:calc(100vw - 16px)}.dock a{padding:10px 10px;font-size:11.5px}}@media(max-width:400px){.dock a{padding:9px 8px;font-size:11px}}'
      + '[tabindex="-1"]:focus{outline:none}'
      // 상단 고정 헤더(하단 독 대체): 1줄 = 이름 | 큰 메뉴(이력서 · 프로젝트 · AX) · 2줄 = 메인 섹션 이동
      + '.gh{position:fixed;left:0;right:0;top:0;z-index:120;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(16px) saturate(160%);backdrop-filter:blur(16px) saturate(160%);border-bottom:1px solid rgba(144,144,144,.16)}'
      + '.gh-in{display:flex;align-items:center;justify-content:space-between;gap:16px;width:min(832px,calc(100vw - 40px));height:60px;margin:0 auto}.gh-nm{font-size:16px;font-weight:700;letter-spacing:-.02em;color:var(--ink);white-space:nowrap}'
      + '.gtabs{display:flex;align-items:stretch;gap:30px;height:100%}.gt{position:relative;display:flex;align-items:center;font-size:15.5px;font-weight:600;letter-spacing:-.01em;color:#8b95a1;white-space:nowrap;transition:color .2s}.gt:hover,.gt.on{color:#191f28}.gt.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:#191f28}'
      + '.gt-w{position:relative;display:flex}.gdd{position:absolute;top:100%;left:50%;min-width:176px;padding:6px;border:1px solid #eceef1;border-radius:12px;background:#fff;box-shadow:0 12px 32px -12px rgba(0,0,0,.18);opacity:0;visibility:hidden;transform:translate(-50%,-4px);transition:opacity .18s,transform .18s,visibility .18s}.gt-w:hover .gdd,.gt-w:focus-within .gdd,.gt-w.open .gdd{opacity:1;visibility:visible;transform:translate(-50%,0)}'
      + '.gdd .dock,.gdd nav{position:static;left:auto;bottom:auto;transform:none;display:flex;flex-direction:column;gap:0;max-width:none;margin:0;padding:0;border-radius:0;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:none}.gdd .dock-pill{display:none}.gdd a{display:block;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:500;line-height:1.2;color:#4e5968;white-space:nowrap;transition:background .15s,color .15s}.gdd a:hover{background:#f5f6f8;color:#191f28}.gdd a[aria-current="true"]{color:#191f28;font-weight:700}'
      + '.page{padding-top:48px}.prog{top:0;z-index:130}@media(max-width:720px){.gh-in{width:calc(100vw - 32px);height:56px}.gh-nm{font-size:15px}.gtabs{gap:20px}.gt{font-size:15px}.page{padding-top:40px}}'
      + '.ax-cnt{max-width:440px}.ax-cores{display:flex;flex-direction:column;gap:12px;margin:22px 0 20px}'
      // AX 카드: 썸네일(이미지 또는 미니 화면 일러스트) + 번호·제목·설명, 등장 시 그래프 선이 그려짐
      + '.ax-core{display:grid;grid-template-columns:148px minmax(0,1fr);gap:16px;align-items:center;padding:12px 16px 12px 12px;border:1px solid var(--bd);border-radius:18px;background:#fff}.ax-core:hover{border-color:rgba(34,34,34,.26)}'
      + '.ax-th{display:block;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background-size:cover;background-position:center;background-color:var(--sand)}.ax-th.art{display:grid;place-items:center}.ax-th.ax-dash{background:var(--mint)}.ax-th.ax-auto{background:var(--lav)}.ax-th.ax-hist{background:var(--beige)}'
      + '.ax-th svg{width:100%;height:100%;display:block;transition:transform .6s var(--ez)}.ax-core:hover .ax-th svg{transform:scale(1.06)}'
      + '.js .ax-cores.in .ax-core .ax-th .ln{stroke-dasharray:240;animation:axDraw 1.4s var(--ez) backwards;animation-delay:calc(var(--j,0) * 95ms + 450ms)}.js .ax-cores.in .ax-core:hover .ax-th .ln{animation:axDraw2 1.1s var(--ez)}@keyframes axDraw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}@keyframes axDraw2{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}'
      + '.ax-ctx .ax-cno{font-size:11.5px;font-weight:700;letter-spacing:.08em;color:var(--coral)}.ax-ctx h4{font-size:15px;font-weight:600;line-height:1.3;margin-top:3px}.ax-ctx p{font-size:12.5px;line-height:1.6;color:var(--ink50);margin-top:5px}@media(max-width:520px){.ax-core{grid-template-columns:1fr;padding:12px}}'
      + '.ax-console{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#fff;background:var(--ink);border-radius:999px;padding:11px 20px;transition:.2s var(--ez)}.ax-console:hover{opacity:.85}.ax-console span{transition:transform .2s}.ax-console:hover span{transform:translateX(3px)}'
      // Projects 타일: 세로 흐름(카테고리 → 대표 지표 크게 → 제목 2줄·회사) · 이미지 타일은 썸네일 + 아래 그라데이션 + 지표 알약 · 호버 시 → 버튼
      + '.tile{color:var(--ink);display:flex;flex-direction:column;justify-content:space-between;align-items:stretch;padding:16px 18px}.tile.has-img{background-size:cover;background-position:center}.tile.has-img::before{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(12,12,14,.8) 0%,rgba(12,12,14,.25) 50%,rgba(12,12,14,.1) 100%)}'
      + '.t-top{position:relative;z-index:1;display:flex;align-items:center;min-width:0}.t-cat{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(34,34,34,.6);white-space:nowrap}.tile .t-cat svg{width:15px;height:15px;flex:none}'
      + '.tile.dark .t-cat{color:rgba(255,255,255,.86)}.tile.has-img .t-cat{padding:5px 9px 5px 7px;border-radius:999px;background:rgba(0,0,0,.36);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#fff}.tile.has-img .t-cat svg{stroke:#fff}'
      + '.t-kpi{position:relative;z-index:1;display:block;margin:auto 0;padding:8px 0}.t-kpi b{display:block;font-size:clamp(30px,3vw,40px);font-weight:700;letter-spacing:-.045em;line-height:1}.tile.tall .t-kpi b{font-size:clamp(40px,4.4vw,62px)}.tile.wide .t-kpi b{font-size:clamp(34px,3.2vw,44px)}.tile.wide .t-kpi{padding:4px 0}'
      + '.t-kpi small{display:block;margin-top:7px;font-size:11.5px;font-weight:600;color:rgba(34,34,34,.58);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tile.dark .t-kpi b{color:#fff}.tile.dark .t-kpi small{color:rgba(255,255,255,.76)}.tile .t-ic svg{width:40px;height:40px}'
      + '.tile .lb{position:relative;left:auto;right:auto;bottom:auto;z-index:1;padding-right:40px;line-height:1.3}.tile .lb b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:15px;font-weight:700;line-height:1.3;letter-spacing:-.02em}.tile.tall .lb b{font-size:17px}.tile.wide .lb b{font-size:16px}.tile .lb span{margin-top:4px;font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.tile .kp{position:relative;right:auto;top:auto;z-index:1;align-self:flex-start;margin:8px 0 auto;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11.5px;font-weight:500;color:var(--ink50);background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);padding:6px 11px}.tile .kp b{color:var(--ink);font-weight:800;font-size:13px}'
      + '.t-play{position:absolute;left:50%;top:46%;z-index:1;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:rgba(0,0,0,.42);border:1.5px solid rgba(255,255,255,.8);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);transition:transform .35s var(--ez)}.t-play::after{content:"";position:absolute;left:55%;top:50%;transform:translate(-50%,-50%);border-left:15px solid #fff;border-top:9px solid transparent;border-bottom:9px solid transparent}.tile:hover .t-play{transform:scale(1.1)}'
      + '.t-go{position:absolute;right:14px;bottom:14px;z-index:1;width:32px;height:32px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;font-size:14px;font-weight:700;opacity:0;transform:translate(-6px,6px) scale(.8);transition:opacity .35s var(--ez),transform .35s var(--ez);box-shadow:0 6px 16px -8px rgba(0,0,0,.5)}.tile:hover .t-go,.tile:focus-visible .t-go{opacity:1;transform:none}'
      + '@media(max-width:520px){.mosaic{grid-auto-rows:184px}.tile{padding:13px 14px}.t-kpi,.tile.wide .t-kpi{padding:2px 0}.t-kpi b{font-size:28px}.tile.tall .t-kpi b{font-size:38px}.tile.wide .t-kpi b{font-size:32px}.t-kpi small{margin-top:4px;font-size:10.5px}.tile .lb b{font-size:13.5px}.tile.tall .lb b,.tile.wide .lb b{font-size:14.5px}.tile .lb span{margin-top:2px;font-size:11px}}'
      // 전체 프로젝트 보기: 다크 카드 + 큰 개수 + 썸네일 카드 덱(부채꼴 → 호버 시 펼쳐짐) + 빛 스윕 + 화살표
      + '.pj-all{position:relative;display:flex;align-items:center;gap:14px;margin-top:14px;padding:18px 16px 18px 22px;min-height:104px;border-radius:24px;overflow:hidden;color:#fff;background:radial-gradient(130% 170% at 100% 0%,#45454f 0%,#222 58%);transition:box-shadow .35s var(--ez),transform .35s var(--ez)}.pj-all:hover{box-shadow:0 26px 50px -28px rgba(0,0,0,.8);transform:translateY(-2px)}'
      + '.pj-all::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.13) 50%,transparent 65%);transform:translateX(-130%);transition:transform 1s var(--ez)}.pj-all:hover::after{transform:translateX(130%)}'
      + '.pj-num{flex:none;font-size:clamp(38px,3.6vw,50px);font-weight:700;letter-spacing:-.06em;line-height:.9;font-variant-numeric:tabular-nums}'
      + '.pj-all-t{flex:1;min-width:0;line-height:1.35}.pj-all-t b{display:block;font-size:15px;font-weight:700;letter-spacing:-.015em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pj-all-t small{display:block;margin-top:4px;font-size:11.5px;line-height:1.45;color:rgba(255,255,255,.6)}'
      + '.pj-deck{flex:none;display:flex;align-items:center;padding:0 2px 0 6px}.pj-deck i{width:42px;height:56px;border-radius:9px;margin-left:-26px;background-size:cover;background-position:center;border:2px solid #2c2c33;box-shadow:0 10px 20px -10px rgba(0,0,0,.85);display:grid;place-items:center;transform:translateY(var(--y,0)) rotate(var(--r,0));transition:transform .55s var(--ez),margin .55s var(--ez)}.pj-deck i:first-child{margin-left:0}.pj-deck i svg{width:16px;height:16px}'
      + '.pj-all:hover .pj-deck i{margin-left:-8px;transform:translateY(-4px) rotate(0)}.pj-all:hover .pj-deck i:first-child{margin-left:0}'
      + '.pj-all-a{position:relative;z-index:1;flex:none;width:40px;height:40px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;font-size:16px;font-weight:700;transition:transform .35s var(--ez)}.pj-all:hover .pj-all-a{transform:translateX(4px)}'
      + '@media(max-width:520px){.pj-all{gap:12px;padding:16px 14px 16px 18px;min-height:88px}.pj-deck i:nth-child(n+4){display:none}.pj-deck i{width:38px;height:50px;margin-left:-22px}}@media(max-width:400px){.pj-deck{display:none}}'
      // ── 모션 · 인터랙션 (KILO 대시보드 '모션·효과'로 켜고 끔: body.fx-*)
      // 부드러운 등장: 살짝 흐림 → 선명
      + '.js .rv{transform:translate3d(0,44px,0) scale(.985);filter:blur(8px)}.js .rv.rv-l{transform:translate3d(-56px,0,0)}.js .rv.rv-r{transform:translate3d(56px,0,0)}.js .rv.in{opacity:1;transform:none;filter:none}.js .rv,.js .rv.in{transition:opacity 1.1s var(--ez2),transform 1.2s var(--ez2),filter 1s var(--ez2);transition-delay:var(--d,0ms)}'
      // 스크롤 스토리텔링: rv-g = 묶음 트리거(자신은 그대로) → 들어오면 자식들이 순서대로 등장(--j)
      + '.js .rv.rv-g{opacity:1;transform:none;filter:none}.js .rv-g:not(.in)>*{opacity:0}.js .rv-g.in>*{animation:gIn 1.1s var(--ez2) backwards;animation-delay:calc(var(--j,0) * 95ms)}'
      + '.js .stack-rows.rv-g.in>*:nth-child(odd){animation-name:gInL}.js .stack-rows.rv-g.in>*:nth-child(even){animation-name:gInR}'
      + '@keyframes gIn{from{opacity:0;transform:translate3d(0,34px,0) scale(.97);filter:blur(6px)}}@keyframes gInL{from{opacity:0;transform:translate3d(-64px,0,0);filter:blur(4px)}}@keyframes gInR{from{opacity:0;transform:translate3d(64px,0,0);filter:blur(4px)}}'
      // 히어로: 스크롤하면 살짝 떠오르며 옅어짐(다음 섹션으로 이어지는 느낌)
      + '.home .cnt{will-change:transform,opacity}'
      // 배경 오로라 (Home)
      + '.home{position:relative}.aura{position:absolute;left:-14%;right:-14%;top:-130px;height:660px;pointer-events:none;z-index:-1;transform:translate3d(calc(var(--mx,0) * 28px),calc(var(--my,0) * 22px),0);transition:transform 1.2s var(--ez)}'
      + '.aura i{position:absolute;border-radius:50%;filter:blur(64px);opacity:.45;will-change:transform}.aura .a1{width:340px;height:340px;background:var(--mint);left:2%;top:70px;animation:au1 24s ease-in-out infinite alternate}'
      + '.aura .a2{width:300px;height:300px;background:var(--lav);right:0;top:10px;animation:au2 28s ease-in-out infinite alternate}.aura .a3{width:240px;height:240px;background:var(--coral);left:44%;top:270px;opacity:.26;animation:au3 32s ease-in-out infinite alternate}'
      + '@keyframes au1{to{transform:translate(90px,60px) scale(1.18)}}@keyframes au2{to{transform:translate(-80px,90px) scale(.9)}}@keyframes au3{to{transform:translate(-60px,-50px) scale(1.25)}}'
      // 서명 쓰기 · 제목 단어 순서 등장 · 사진 카드 등장
      + '.hero-h .w{display:inline-block}.js .fx-intro .sig:not([data-draw]){animation:sigIn 1.4s .15s var(--ez) backwards}@keyframes sigIn{from{clip-path:inset(-25% 100% -25% -5%)}to{clip-path:inset(-25% -5% -25% -5%)}}'
      + '.js .fx-intro .hero-h .w{animation:wIn .8s var(--ez) backwards;animation-delay:calc(.4s + var(--i) * 45ms)}@keyframes wIn{from{opacity:0;transform:translateY(.55em);filter:blur(6px)}}'
      + '.js .fx-intro .photo .card{animation:cardIn 1.1s .12s var(--ez) backwards}@keyframes cardIn{from{opacity:0;transform:translateY(26px) rotate(-5deg) scale(.94)}}'
      // 사진·타일 3D 기울기 + 빛 반사 (JS가 --gx/--gy, transform 지정)
      + '.photo .card::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:inherit;background:radial-gradient(circle at var(--gx,50%) var(--gy,-20%),rgba(255,255,255,.42),transparent 58%);opacity:0;transition:opacity .35s}.photo .card.tilt::before{opacity:1}'
      + '.tile::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.45) 50%,transparent 65%);transform:translateX(-130%);transition:transform .9s var(--ez)}.tile:hover::after{transform:translateX(130%)}'
      + '.tile .lb,.tile .kp{z-index:1}.tile svg{transition:transform .5s var(--ez)}.tile:hover svg{transform:scale(1.1) rotate(-4deg)}'
      // 스크롤 진행바
      + '.prog{position:fixed;left:0;right:0;top:0;height:3px;z-index:150;pointer-events:none}.prog i{display:block;height:100%;background:linear-gradient(90deg,var(--mint),var(--lav),var(--coral));transform-origin:0 50%;transform:scaleX(var(--p,0))}'
      // 하단 바: 활성 항목으로 미끄러지는 알약
      + '.dock a{position:relative;z-index:1}.dock a[aria-current="true"]{background:transparent}.dock-pill{position:absolute;left:0;top:0;width:0;height:0;border-radius:999px;background:rgba(255,255,255,.17);box-shadow:inset 0 1px 0 rgba(255,255,255,.14);opacity:0;pointer-events:none;transition:transform .5s var(--ez2),width .5s var(--ez2),height .5s var(--ez2),opacity .3s}'
      // 섹션 라벨: 번호 + 스크롤 중 고정(넓은 화면)
      + '.row>h2{display:flex;align-items:baseline;gap:10px;align-self:start;position:sticky;top:44px}.row>h2 .sn{font-size:11px;font-weight:600;color:var(--gray);font-variant-numeric:tabular-nums;letter-spacing:.04em}@media(max-width:920px){.row>h2{position:static}}'
      // 카드 호버 · Available 신호
      + '.dcard{transition:transform .4s var(--ez),box-shadow .4s var(--ez)}.dcard:hover{transform:translateY(-4px);box-shadow:0 20px 40px -24px rgba(0,0,0,.55)}'
      + '.avail i{position:relative}.avail i::after{content:"";position:absolute;inset:0;border-radius:50%;background:var(--mint);animation:ping 1.9s var(--ez) infinite}@keyframes ping{from{transform:scale(1);opacity:.85}to{transform:scale(2.8);opacity:0}}'
      + '@media(prefers-reduced-motion:reduce){.js .rv{filter:none}.aura i,.avail i::after,.js .fx-intro .sig,.js .sig[data-draw]:not(.go) .sg,.js .fx-intro .hero-h .w,.js .fx-intro .photo .card{animation:none}.js .sig[data-draw]:not(.go) .sg{opacity:1}.js .xp .xp-pj li{opacity:1;transform:none;transition:none}.js .xp .xp-pj li::before{transform:none;transition:none}.dock-pill,.tile::after{transition:none}}'
      // 03 Projects 타일 = 상품카드(전체 프로젝트 휠과 같은 구성): 흰 카드 · 썸네일 · 분야 · 제목 · 회사·연도 · 대표 지표 — 크기별 배치
      + '.mosaic{grid-auto-rows:234px}.tile.pc{justify-content:flex-start;padding:7px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 14px 30px -22px rgba(0,0,0,.42)}.tile.pc::after{background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.35) 50%,transparent 65%)}'
      + '.pc-th{position:relative;flex:none;height:41%;border-radius:17px;overflow:hidden;background:var(--c) center/cover no-repeat;display:grid;place-items:center}.pc-th.img{background-color:#f1f0ec}.pc-th.img::before{content:"";position:absolute;inset:-14%;background:var(--img) center/cover no-repeat;filter:blur(18px) saturate(1.15);opacity:.5}.pc-th .th-img{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1}.pc-th .t-play{z-index:2}.tile .pc-th svg{width:30px;height:30px}.tile.tall .pc-th{height:60%}.tile.tall .pc-th svg{width:46px;height:46px}'
      + '.tile.wide{flex-direction:row}.tile.wide .pc-th{height:auto;width:46%;align-self:stretch}.tile.wide .pc-th svg{width:40px;height:40px}.tile.pc .t-play{top:50%}'
      + '.pc-bd{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;padding:11px 9px 5px}.tile.wide .pc-bd{padding:10px 12px 6px 16px}.tile.tall .pc-bd{padding:14px 11px 7px}'
      + '.pc-cat{font-style:normal;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.pc-t{flex:none;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:4px;font-size:14px;font-weight:700;line-height:1.32;letter-spacing:-.025em;color:var(--ink)}.tile.tall .pc-t,.tile.wide .pc-t{font-size:16.5px}'
      + '.pc-m{margin-top:3px;font-size:11.5px;font-weight:500;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.pc-p{margin-top:auto;padding:4px 36px 0 0;font-size:11.5px;font-weight:600;color:var(--ink50);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pc-p b{margin-right:2px;font-size:17px;font-weight:800;letter-spacing:-.035em;color:var(--ink)}.tile.tall .pc-p b,.tile.wide .pc-p b{font-size:22px}'
      + '.tile.pc .t-go{right:10px;bottom:10px;width:30px;height:30px;font-size:13px;background:var(--ink);color:#fff}'
      // 자동 일러스트 썸네일: 칸을 꽉 채우는 SVG(분야 색 바탕 가운데) · 호버 시 살짝 확대 · 등장 시 선 그리기
      + '.tile .pc-th svg.cv{width:100%;height:100%;transform:none;transition:transform .6s var(--ez)}.tile:hover .pc-th svg.cv{transform:scale(1.04)}.pc-th.art{padding:4px}'
      + '.js .mosaic.in .pc-th .cv .ln{stroke-dasharray:420;animation:cvDraw 1.6s var(--ez) backwards;animation-delay:calc(var(--j,0) * 110ms + 380ms)}@keyframes cvDraw{from{stroke-dashoffset:420}to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.js .mosaic.in .pc-th .cv .ln{animation:none}}'
      + '@media(max-width:520px){.mosaic{grid-auto-rows:226px}.pc-t{font-size:13px}.tile.tall .pc-t,.tile.wide .pc-t{font-size:14.5px}.pc-m{font-size:11px}.tile.wide .pc-th{width:42%}.pc-p{padding-right:30px}.pc-p b{font-size:15px}.tile.tall .pc-p b,.tile.wide .pc-p b{font-size:18px}}'
      // 전체 프로젝트 보기의 큰 개수: 애플풍 가는 숫자 + 위→아래 은은한 그라데이션
      + '.ax-all{margin-top:0}.pj-deck .ax-di svg{width:40px;height:40px;display:block}.ax-all .pj-num{letter-spacing:-.04em}'
      + '.pj-num{font-family:var(--font);font-weight:250;font-size:clamp(48px,4.4vw,60px);line-height:.9;letter-spacing:-.06em;font-variant-numeric:tabular-nums;background:linear-gradient(180deg,#fff 35%,rgba(255,255,255,.55));-webkit-background-clip:text;background-clip:text;color:transparent}'
      // 곡률: 알약 대신 애플식 둥근 사각형(누적·오늘 라벨 · 하단 바 · 콘솔 버튼) — 지원 브라우저는 아래에서 연속 곡률로
      + '.vw{border-radius:8px}.dock{border-radius:16px}.dock a,.dock-pill{border-radius:11px}.ax-console{border-radius:12px}'
      // 애플식 곡률: 지원 브라우저(크롬 계열)는 연속 곡률(squircle) + 같은 인상이 나도록 반경을 키움 · 미지원은 위의 둥근 모서리 그대로
      + '@supports (corner-shape:squircle){'
      + '.photo .card,.tile,.pj-all,.pj-deck i,.dcard,.ax-core,.ax-th,.xp-logo,.xp-sv-logo,.socials a,.pc-th,.vw,.dock,.dock a,.dock-pill,.ax-console{corner-shape:squircle}.pc-th{border-radius:33px}.vw{border-radius:12px}.dock{border-radius:26px}.dock a,.dock-pill{border-radius:20px}.ax-console{border-radius:18px}.photo .card::before,.photo .card::after{corner-shape:squircle}'
      + '.photo .card{border-radius:42px}.tile{border-radius:40px}.pj-all{border-radius:40px}.pj-deck i{border-radius:14px}.dcard{border-radius:48px}'
      + '.ax-core{border-radius:30px}.ax-th{border-radius:19px}.xp-logo{border-radius:16px}.xp-sv-logo{border-radius:12px}.socials a{border-radius:13px}'
      + '@media(max-width:560px){.xp-logo{border-radius:15px}}}'
      // 글꼴 프리셋의 제목용 글꼴(--disp): 스킬 카드 값 — 세리프(editorial)는 한 단계 크게
      + '.dcard h4{font-family:var(--disp);font-weight:var(--dispw);letter-spacing:var(--displs)}.ft-editorial .dcard h4{font-size:40px;line-height:.95}'
      // 차분한 톤 레이어(전체 프로젝트 페이지와 같은 잉크·회색): 본문 굵기 낮추고 작은 글씨 키워 가독성↑ · 검은 스탯 카드 → 옅은 웜그레이 · 포인트 색 절제
      + ':root{--ink:#1d1d1f;--ink50:rgba(29,29,31,.64);--gray:#86868b;--bd:rgba(29,29,31,.09)}body{font-weight:400;letter-spacing:-.015em}'
      + '.row>h2{font-size:15px}.row>h2 .sn{font-size:12px}.about p.g{font-size:15px;line-height:1.8}.meta span,.meta a{font-size:13.5px}.meta .nm b{font-size:14.5px}'
      + '.xp-tt h3{font-size:16.5px}.xp-role,.xp-sv-role{font-size:13px}.xp-when{font-size:12.5px}.xp-sum{font-size:14px;line-height:1.75}.xp-pj li{font-size:13.5px}.xp-pj .p,.xp-sv-when,.xp-sv-no{font-size:12px}.xp-sv h4{font-size:15px}.xp-sv-sum{font-size:13.5px}'
      + '.pc-cat{font-size:10.5px}.pc-m,.pc-p{font-size:12px}.ax-ctx .ax-cno{color:var(--gray)}.ax-ctx h4{font-size:16px}.ax-ctx p{font-size:13.5px;line-height:1.65}.foot{font-size:12.5px}'
      + '.dcard{background:#f4f3ef;box-shadow:inset 0 0 0 1px rgba(29,29,31,.05)}.dcard h4{color:var(--ink)}.dcard p{font-size:12.5px;color:var(--ink50)}.dcard:hover{box-shadow:inset 0 0 0 1px rgba(29,29,31,.05),0 18px 36px -26px rgba(0,0,0,.3)}'
      // 프로필 사진 여러 장: 덱(뒤 카드) · 교차 전환 + 줌 · 진행 막대
      + '.photo.multi .card{cursor:pointer;z-index:1}.ph-deck{position:absolute;inset:0;pointer-events:none}.ph-deck i{position:absolute;inset:0;border-radius:24px;background:var(--sand) center/cover;box-shadow:0 18px 36px -22px rgba(0,0,0,.45);transition:transform .9s var(--ez2),opacity .6s}'
      + '.ph-deck .pd1{transform:rotate(-7deg) translate(-14px,10px) scale(.96);opacity:.9}.ph-deck .pd2{transform:rotate(6deg) translate(12px,4px) scale(.93);opacity:.75}'
      + '.photo.multi:hover .ph-deck .pd1{transform:rotate(-11deg) translate(-26px,12px) scale(.96)}.photo.multi:hover .ph-deck .pd2{transform:rotate(10deg) translate(24px,2px) scale(.93)}.ph-deck.flip i{animation:phFlip .7s var(--ez2)}@keyframes phFlip{40%{opacity:.4}}'
      + '.photo .card .ph{position:absolute;inset:0;background:center/cover;opacity:0;transform:scale(1.08);transition:opacity 1.1s var(--ez),transform 6s cubic-bezier(.2,.6,.2,1)}.photo .card .ph.on{opacity:1;transform:scale(1)}'
      + '.ph-bars{position:absolute;left:14px;right:14px;bottom:12px;z-index:3;display:flex;gap:4px;pointer-events:none}.ph-bars i{flex:1;height:2.5px;border-radius:2px;background:rgba(255,255,255,.4);overflow:hidden}.ph-bars b{display:block;height:100%;width:100%;background:#fff;transform-origin:0 50%;transform:scaleX(0)}'
      + '.ph-bars i.done b{transform:scaleX(1)}.ph-bars i.on b{animation:phBar var(--phT,4.8s) linear forwards}.photo.paused .ph-bars i.on b{animation-play-state:paused}@keyframes phBar{to{transform:scaleX(1)}}'
      + '@supports (corner-shape:squircle){.ph-deck i{corner-shape:squircle;border-radius:42px}}'
      + '@media(prefers-reduced-motion:reduce){.photo .card .ph{transform:none;transition:opacity .4s}.ph-deck i,.ph-deck.flip i{transition:none;animation:none}.ph-bars i.on b{animation:none;transform:scaleX(1)}}';

    // 프로필 사진 넘김(여러 장일 때): 자동(가만두면 약 5초) · 카드 클릭/Enter = 다음 · 마우스 올리면 멈춤 · 화면 밖·탭 숨김이면 멈춤
    var phRuntime = function () {
      var box = document.querySelector(".photo.multi"); if (!box) return;
      var card = box.querySelector(".card"), ph = [].slice.call(card.querySelectorAll(".ph")), bars = [].slice.call(box.querySelectorAll(".ph-bars i")), deck = box.querySelector(".ph-deck"), dk = deck ? [].slice.call(deck.querySelectorAll("i")) : [];
      var n = ph.length, cur = 0, T = 4800, auto = box.getAttribute("data-auto") !== "0", reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, hov = false, vis = true, t = 0, left = T, t0 = 0;
      box.style.setProperty("--phT", T / 1000 + "s");
      var urls = ph.map(function (p) { return p.style.backgroundImage; });
      var show = function (i) {
        cur = (i + n) % n;
        ph.forEach(function (p, k) { p.classList.toggle("on", k === cur); });
        var run = auto && !reduce;
        bars.forEach(function (b, k) { b.classList.remove("on"); b.classList.toggle("done", k < cur || (!run && k === cur)); if (k === cur && run) { void b.offsetWidth; b.classList.add("on"); } });
        dk.forEach(function (d, k) { d.style.backgroundImage = urls[(cur + 1 + k) % n]; });
        if (deck) { deck.classList.remove("flip"); void deck.offsetWidth; deck.classList.add("flip"); }
        left = T; schedule();
      };
      var schedule = function () { clearTimeout(t); if (!auto || reduce || hov || !vis || document.hidden) return; t0 = Date.now(); t = setTimeout(function () { show(cur + 1); }, left); };
      var pause = function () { if (t) { clearTimeout(t); t = 0; left = Math.max(300, left - (Date.now() - t0)); } box.classList.add("paused"); };
      var resume = function () { box.classList.remove("paused"); schedule(); };
      card.addEventListener("click", function () { show(cur + 1); });
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); } });
      box.addEventListener("mouseenter", function () { hov = true; pause(); }); box.addEventListener("mouseleave", function () { hov = false; resume(); });
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) resume(); else pause(); }).observe(box);
      document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); else if (!hov) resume(); });
      show(0);
    };
    var KJS = '(function(){"use strict";var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,still=!document.documentElement.classList.contains("js");'
      + 'var rvs=document.querySelectorAll(".rv");if("IntersectionObserver" in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12,rootMargin:"0px 0px -8% 0px"});rvs.forEach(function(el){io.observe(el);});}else{rvs.forEach(function(el){el.classList.add("in");});}'
      // 하단 독: srcdoc iframe(라이브 view.html·스튜디오 미리보기)에선 #앵커가 부모 URL로 해석돼 iframe이 통째로 재로드됨 → JS로 스크롤 처리
      + 'var dock=document.querySelector(".dock"),links=[].slice.call(document.querySelectorAll(".dock a[data-sec]")),navLock=0;'
      + 'function setCur(id){links.forEach(function(a){var on=a.dataset.sec===id;a.setAttribute("aria-current",on?"true":"false");if(on&&dock&&dock.scrollWidth>dock.clientWidth+1){var L=a.offsetLeft-(dock.clientWidth-a.offsetWidth)/2;try{dock.scrollTo({left:L,behavior:reduce?"instant":"smooth"});}catch(_){dock.scrollLeft=L;}}});movePill();}'
      + 'var pill=document.querySelector(".dock-pill");function movePill(){var a=dock&&dock.querySelector("a[aria-current=\'true\']");if(!pill||!a)return;pill.style.width=a.offsetWidth+"px";pill.style.height=a.offsetHeight+"px";pill.style.transform="translate("+a.offsetLeft+"px,"+a.offsetTop+"px)";pill.style.opacity="1";}'
      + 'window.addEventListener("resize",movePill);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(movePill);setTimeout(function(){if(!(dock&&dock.querySelector("a[aria-current=\'true\']"))&&(window.pageYOffset||0)<40)setCur("home");},60);'
      + 'function goSec(id,instant){var el=document.getElementById(id);if(!el)return false;var gh=document.querySelector(".gh"),top=id==="home"?0:Math.max(0,el.getBoundingClientRect().top+(window.pageYOffset||0)-(gh?gh.offsetHeight+16:24));navLock=Date.now();try{window.scrollTo({top:top,behavior:(instant||reduce)?"instant":"smooth"});}catch(_){window.scrollTo(0,top);}setCur(id);if(id!=="home"&&document.body.getAttribute("data-host")!=="studio"){if(!el.hasAttribute("tabindex"))el.setAttribute("tabindex","-1");try{el.focus({preventScroll:true});}catch(_){}}return true;}'
      + 'document.addEventListener("click",function(e){var a=e.target.closest("a[href^=\'#\']");if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var id=a.getAttribute("href").slice(1);if(!id||!document.getElementById(id))return;e.preventDefault();goSec(id,false);try{if(window.parent&&window.parent!==window)window.parent.postMessage({klio:"sec",id:id},"*");}catch(_){}});'
      + 'window.addEventListener("message",function(e){var m=e.data;if(m&&m.klio==="goto"&&typeof m.id==="string")goSec(m.id,!!m.instant);});'
      + 'if("IntersectionObserver" in window){var nio=new IntersectionObserver(function(es){if(Date.now()-navLock<1000)return;es.forEach(function(e){if(e.isIntersecting)setCur(e.target.id);});},{rootMargin:"-35% 0px -55% 0px"});links.forEach(function(a){var s=document.getElementById(a.dataset.sec);if(s)nio.observe(s);});}'
      // ── 모션 · 인터랙션 런타임
      // 스크롤 진행바
      + 'var prog=document.querySelector(".prog");if(prog){var pT=0,pUp=function(){pT=0;var h=document.documentElement.scrollHeight-innerHeight;prog.style.setProperty("--p",h>0?Math.min(1,Math.max(0,(window.pageYOffset||0)/h)).toFixed(4):0);};addEventListener("scroll",function(){if(!pT)pT=requestAnimationFrame(pUp);},{passive:true});addEventListener("resize",pUp);pUp();}'
      // 히어로: 스크롤하면 살짝 떠오르며 옅어짐 → 다음 섹션으로 이어지는 느낌
      // 붓글씨 서명: 글씨체가 준비되면(.go) 글자 위치(x)에 맞춰 붓이 지나가는 순서대로 써 내려감 · 줄인 모션·편집 중 재렌더면 완성된 모습 그대로
      + 'var sig=document.querySelector(".sig[data-draw]");if(sig){var sgGo=function(){if(sig.classList.contains("go"))return;var fs=parseFloat(getComputedStyle(sig).fontSize)||40,x0=null;[].forEach.call(sig.querySelectorAll(".sg-ink tspan"),function(t,i){var x=i*fs*.42;try{x=t.getStartPositionOfChar(0).x;}catch(_){}if(x0==null)x0=x;t.style.animationDelay=(.25+Math.max(0,x-x0)/fs*.28).toFixed(3)+"s";});sig.classList.add("go");};'
      + 'if(reduce||still)sig.removeAttribute("data-draw");else{var sgT=setTimeout(sgGo,2600),sgF=sig.getAttribute("data-sf");if(document.fonts&&document.fonts.load&&sgF)document.fonts.load(Math.round(parseFloat(getComputedStyle(sig).fontSize)||40)+"px \'"+sgF+"\'").then(function(){clearTimeout(sgT);sgGo();},function(){clearTimeout(sgT);sgGo();});else{clearTimeout(sgT);sgGo();}}}'
      + 'var hcnt=document.querySelector(".home .cnt");if(hcnt&&!reduce&&!still&&document.body.classList.contains("fx-intro")){var hT=0,hUp=function(){hT=0;var y=window.pageYOffset||0;if(y>1600)return;var k=Math.min(1,y/700);hcnt.style.transform="translate3d(0,"+(-y*.12).toFixed(1)+"px,0)";hcnt.style.opacity=String(1-k*.55);};addEventListener("scroll",function(){if(!hT)hT=requestAnimationFrame(hUp);},{passive:true});}'
      // 조회수: 부모(라이브 view.html·스튜디오)가 보낸 실제 값 + 보정값(data-ta/tda/tdd) → 카운트업
      + 'var vw=document.querySelector(".vw");function kstD(){return new Date(Date.now()+9*3600e3).toISOString().slice(0,10);}function nf(n){try{return Number(n).toLocaleString("ko-KR");}catch(_){return String(n);}}'
      + 'function vCount(el,to){if(!el)return;var from=parseInt((el.textContent||"").replace(/[^0-9]/g,""),10)||0;if(reduce||still||Math.abs(to-from)<3){el.textContent=nf(to);return;}var t0=null,done=false;function st(t){if(done)return;if(!t0)t0=t;var k=Math.min((t-t0)/1100,1);k=1-Math.pow(1-k,3);el.textContent=nf(Math.round(from+(to-from)*k));if(k<1)requestAnimationFrame(st);else done=true;}requestAnimationFrame(st);setTimeout(function(){done=true;el.textContent=nf(to);},1300);}'
      + 'window.addEventListener("message",function(e){var m=e.data;if(!vw||!m||m.klio!=="views")return;var ta=+vw.dataset.ta||0,tda=vw.dataset.tdd===kstD()?(+vw.dataset.tda||0):0;if(m.total==null&&!ta&&!tda){vw.classList.add("na");return;}vw.classList.remove("na");vCount(vw.querySelector("[data-vw=total]"),Math.max(0,(+m.total||0)+ta));vCount(vw.querySelector("[data-vw=today]"),Math.max(0,(+m.today||0)+tda));});'
      // 오로라: 마우스 따라 살짝 이동
      + 'var fine=matchMedia("(hover: hover) and (pointer: fine)").matches,aura=document.querySelector(".aura");if(aura&&fine&&!reduce){var aT=0,amx=0,amy=0;addEventListener("pointermove",function(e){amx=e.clientX/innerWidth*2-1;amy=e.clientY/innerHeight*2-1;if(!aT)aT=requestAnimationFrame(function(){aT=0;aura.style.setProperty("--mx",amx.toFixed(3));aura.style.setProperty("--my",amy.toFixed(3));});},{passive:true});}'
      // 사진 카드·프로젝트 타일 3D 기울기 + 빛 반사, 버튼 자석 효과
      + 'function tilt(el,max,sc){var R=0,rx=0,ry=0,tm=0;el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;ry=(px-.5)*2*max;rx=(.5-py)*2*max;el.style.setProperty("--gx",(px*100).toFixed(1)+"%");el.style.setProperty("--gy",(py*100).toFixed(1)+"%");el.classList.add("tilt");clearTimeout(tm);if(!R)R=requestAnimationFrame(function(){R=0;el.style.transition="transform .12s ease-out";el.style.transform="perspective(800px) rotateX("+rx.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) scale("+sc+")";});});el.addEventListener("pointerleave",function(){el.classList.remove("tilt");el.style.transition="transform .7s cubic-bezier(.25,.6,.3,1)";el.style.transform="";tm=setTimeout(function(){el.style.transition="";},720);});}'
      + 'function magnet(b){var tm=0;b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/r.width,dy=(e.clientY-(r.top+r.height/2))/r.height;clearTimeout(tm);b.style.transition="transform .2s ease-out,background-color .2s,color .2s,border-color .2s";b.style.transform="translate("+(dx*12).toFixed(1)+"px,"+(dy*10).toFixed(1)+"px)";});b.addEventListener("pointerleave",function(){b.style.transition="transform .6s cubic-bezier(.25,.6,.3,1),background-color .2s,color .2s,border-color .2s";b.style.transform="";tm=setTimeout(function(){b.style.transition="";},620);});}'
      + 'if(fine&&!reduce&&document.body.classList.contains("fx-tilt")){var pcard=document.querySelector(".photo .card");if(pcard)tilt(pcard,9,1.03);[].forEach.call(document.querySelectorAll(".tile"),function(t){tilt(t,6,1.02);});[].forEach.call(document.querySelectorAll(".ax-console,.socials a"),magnet);}'
      + 'function countUp(el){var target=parseInt(el.dataset.count,10);if(!target||reduce||still)return;var tpl=el.innerHTML,t0=null,dur=900;function step(t){if(!t0)t0=t;var k=Math.min((t-t0)/dur,1);k=1-Math.pow(1-k,3);el.innerHTML=tpl.replace(String(target),String(Math.round(target*k)));if(k<1)requestAnimationFrame(step);else el.innerHTML=tpl;}requestAnimationFrame(step);}'
      + 'if("IntersectionObserver" in window){var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);sio.unobserve(e.target);}});},{threshold:.6});document.querySelectorAll("[data-count]").forEach(function(s){sio.observe(s);});}'
      // 스튜디오 미리보기: 타일·전체보기 → 미리보기 안에서 전체 프로젝트 페이지로 전환(부모가 처리)
      + 'document.addEventListener("click",function(e){var w=document.querySelector(".gt-w");if(w&&!e.target.closest(".gt-w"))w.classList.remove("open");var r=e.target.closest("a[data-gx=\'resume\']");if(!r||document.body.getAttribute("data-host")==="studio")return;e.preventDefault();if(matchMedia("(hover: none)").matches&&w){w.classList.toggle("open");return;}try{window.scrollTo({top:0,behavior:reduce?"instant":"smooth"});}catch(_){window.scrollTo(0,0);}});'
      + 'document.addEventListener("click",function(e){var a=e.target.closest(".gdd a");if(a){var w=a.closest(".gt-w");if(w)w.classList.remove("open");}},true);'
      + 'document.addEventListener("click",function(e){var g=e.target.closest("a[data-gx]");if(!g||document.body.getAttribute("data-host")!=="studio")return;e.preventDefault();var k=g.getAttribute("data-gx");if(k==="projects"){try{parent.postMessage({klio:"pp",id:""},"*");}catch(_){}}else if(k==="ax")window.open(g.href,"_blank");else window.scrollTo(0,0);});'
      + 'document.addEventListener("click",function(e){var a=e.target.closest("a[data-ext]");if(!a||document.body.getAttribute("data-host")!=="studio")return;e.preventDefault();var m=(a.getAttribute("href")||"").match(/#p-(.+)$/);try{parent.postMessage({klio:"pp",id:m?decodeURIComponent(m[1]):""},"*");}catch(_){}});'
      + '})();';

    // ── 전체 프로젝트 페이지 (/{slug}/projects) — 원형 휠 캐러셀 ─────────────────────
    // 숨은 큰 원 둘레에 카드가 부채꼴로 펼쳐짐 → 드래그·휠·←/→로 회전, 가만두면 한 장씩 흘러감.
    // 꼭대기 카드 = 선택 → 아치 안쪽에 정보, '자세히 보기' = 상세 시트. 런타임은 실제 함수를 문자열화해 넣음
    var whRuntime = function () {
      "use strict";
      var body = document.body, stage = document.querySelector(".wh"), ring = document.querySelector(".wh-ring");
      var all = [].slice.call(document.querySelectorAll(".wh-card"));
      if (!stage || !ring || !all.length) return;
      var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, still = body.hasAttribute("data-still");
      var dyn = document.querySelector(".wh-dyn"), curEl = document.querySelector("[data-cur]"), totEl = document.querySelector("[data-tot]");
      var sheet = document.querySelector(".wh-sheet"), sbody = document.querySelector(".wh-sbody"), sno = document.querySelector(".wh-sno");
      var cards = all.slice(), N = cards.length, DEG = 180 / Math.PI;
      var W = 0, H = 0, mob = false, R = 800, S = 15, loop = true;
      var rot = 0, vel = 0, target = null, spread = (still || reduce) ? 1 : 0, active = -1, raf = 0;
      var dragging = false, moved = false, px0 = 0, rot0 = 0, samples = [];
      var lastInput = still ? Date.now() : 0, hover = false, sheetOpen = false, ready = false, kbd = false;
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

      // 배치: 카드 크기 · 원 반지름 · 원 중심(화면 아래) · 카드 간 각도
      function layout() {
        W = innerWidth; H = innerHeight; mob = W < 760;
        var cw, top, lift = mob ? 10 : 18;
        if (mob) { cw = clamp(Math.min(W * 0.38, H * 0.18), 112, 160); R = Math.max(W * 1.6, 560); var hb = document.querySelector(".wh-chips"); top = (hb ? hb.getBoundingClientRect().bottom : 180) + 34; }
        else { // 카드 크기 = 화면 폭·높이에 비례(큰 모니터 최대 300px) · 휠 꼭대기는 가운데 머리 문장 바로 아래
          cw = clamp(Math.min(W * 0.15, (H * 0.44 - 17) / 1.32), 160, 320); R = Math.max(W * 0.9, 900);
          var hd = document.querySelector(".wh-head"); top = (hd ? hd.getBoundingClientRect().bottom : H * 0.16) + 26;
        }
        var ch = Math.round(cw * (mob ? 1.4 : 1.32)), hw = cw / 2, hh = ch / 2;
        var apex = top + hh * 1.12 + lift; // 꼭대기 카드는 떠오르고(lift) 커지므로(1.07) 그만큼 아래로
        ring.style.top = Math.round(apex + R) + "px";
        stage.style.setProperty("--cw", Math.round(cw) + "px");
        stage.style.setProperty("--ch", ch + "px");
        S = (cw + (mob ? 14 : 28)) / R * DEG;
        // 정보 패널: 꼭대기 카드 아래 끝과, 패널 폭 안으로 들어오는 옆 카드(±1)의 아래 모서리 중 더 낮은 곳 바로 아래
        var s = S / DEG, cs = Math.cos(s), sn = Math.sin(s), cx = W / 2 + R * sn, cy = apex + R * (1 - cs);
        var n1 = 0.96, blx = cx - hw * n1, bly = cy + hh * n1, brx = cx + hw * n1, bry = bly; // 옆 카드도 똑바로 서 있음(아래 모서리 수평)
        var infoEl = document.querySelector(".wh-info"), xr = W / 2 + ((infoEl && infoEl.offsetWidth) || Math.min(mob ? W - 32 : 560, W - 40)) / 2, edge = 0;
        if (xr > blx) edge = xr >= brx ? bry : bly + (xr - blx) / (brx - blx) * (bry - bly);
        stage.style.setProperty("--info", Math.round(Math.max(apex - lift + hh * 1.12, edge) + (mob ? 22 : 18)) + "px");
        loop = N * S >= 200;
      }
      function wrapA(a) { if (!loop) return a; var T = N * S; return ((a + T / 2) % T + T) % T - T / 2; }
      function limit() { if (loop) return; var mn = -(N - 1) * S; if (rot > 0) { rot = 0; vel = 0; } else if (rot < mn) { rot = mn; vel = 0; } }
      function snapTarget(r) { var t = -Math.round(-r / S) * S; return loop ? t : clamp(t, -(N - 1) * S, 0); }

      function render() {
        var best = -1, bestA = 1e9, lift = mob ? 10 : 18;
        for (var i = 0; i < N; i++) {
          var c = cards[i], a = wrapA(i * S + rot) * spread, aa = Math.abs(a);
          if (aa < bestA) { bestA = aa; best = i; }
          if (aa > 96) { c.style.visibility = "hidden"; continue; }
          var k = Math.max(0, 1 - aa / S); // 꼭대기에 가까울수록 1 → 살짝 떠오르고 커짐
          c.style.visibility = "";
          // 카드는 원 둘레를 따라가되 똑바로 선 채(역회전) — 글씨가 기울지 않아 잘 읽힘 · 가운데에서 멀수록 작고 옅게
          var dn = aa / S, sc = 1 + 0.12 * k - Math.min(dn, 4) * 0.06;
          c.style.transform = "rotate(" + a.toFixed(3) + "deg) translate3d(0," + (-R - lift * k).toFixed(1) + "px,0) rotate(" + (-a).toFixed(3) + "deg) scale(" + sc.toFixed(3) + ")";
          c.style.zIndex = String(300 - Math.round(aa * 2));
          var op = Math.max(0.22, 1 - Math.max(0, dn - 0.5) * 0.26);
          if (aa > 66) op = Math.min(op, Math.max(0, 1 - (aa - 66) / 30));
          c.style.opacity = op < 0.999 ? op.toFixed(3) : "";
        }
        if (best >= 0 && best !== active) setActive(best);
      }
      function setActive(i) {
        active = i; var c = cards[i];
        all.forEach(function (x) { x.classList.toggle("on", x === c); });
        if (curEl) curEl.textContent = pad(i + 1);
        if (totEl) totEl.textContent = pad(N);
        var t = document.getElementById("whi-" + c.getAttribute("data-i"));
        if (dyn && t) { dyn.innerHTML = t.innerHTML; dyn.classList.remove("swap"); void dyn.offsetWidth; dyn.classList.add("swap"); }
        try { // 배경을 선택 카드의 분야 색(--c)으로 아주 옅게
          var hx = getComputedStyle(c).getPropertyValue("--c").trim().match(/^#([0-9a-f]{6})$/i);
          if (hx) { var n = parseInt(hx[1], 16), bg = [n >> 16 & 255, n >> 8 & 255, n & 255], base = [239, 238, 234], mx = function (j) { return Math.round(base[j] + (bg[j] - base[j]) * 0.12); }; body.style.backgroundColor = "rgb(" + mx(0) + "," + mx(1) + "," + mx(2) + ")"; }
        } catch (e) {}
        if (sheetOpen) fillSheet();
        if (ready) { try { if (window.parent && window.parent !== window) window.parent.postMessage({ klio: "card", id: c.getAttribute("data-id") }, "*"); } catch (e) {} }
      }

      // 움직임: 목표 각도로 부드럽게 · 놓으면 관성 → 가장 가까운 카드에 착 붙음
      function kick() { if (!raf) raf = requestAnimationFrame(tick); }
      function tick() {
        raf = 0; var busy = false;
        if (!dragging) {
          if (target != null) { var d = target - rot; if (Math.abs(d) < 0.01) { rot = target; target = null; } else { rot += d * 0.12; busy = true; } }
          else if (vel) { rot += vel; vel *= 0.94; limit(); if (Math.abs(vel) < 0.25) { vel = 0; target = snapTarget(rot); } busy = true; }
        }
        render(); if (busy) kick();
      }
      function go(i, instant) {
        if (i < 0 || i >= N) return;
        var base = -i * S, t = base;
        if (loop) { var T = N * S; t = base + T * Math.round((rot - base) / T); }
        vel = 0;
        if (instant || reduce) { target = null; rot = t; render(); } else { target = t; kick(); }
      }
      function step(dir) {
        var base = target != null ? target : snapTarget(rot), t = base - dir * S;
        if (!loop) t = clamp(t, -(N - 1) * S, 0);
        vel = 0;
        if (reduce) { target = null; rot = t; render(); } else { target = t; kick(); }
      }
      function fan() { // 첫 등장·필터 변경: 한 점에 모인 카드가 부채처럼 펼쳐짐
        var from = spread, t0 = 0, done = false;
        function st(t) { if (done) return; if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400); k = 1 - Math.pow(1 - k, 4); spread = from + (1 - from) * k; render(); if (k < 1) requestAnimationFrame(st); else done = true; }
        requestAnimationFrame(st);
        setTimeout(function () { if (!done) { done = true; spread = 1; render(); } }, 1800); // 화면이 멈춘 환경 대비
      }

      // 상세 시트
      function fillSheet() {
        var c = cards[active]; if (!c || !sbody) return;
        var t = document.getElementById("whd-" + c.getAttribute("data-i"));
        sbody.innerHTML = t ? t.innerHTML : ""; sbody.scrollTop = 0;
        if (sno) sno.textContent = pad(active + 1) + " / " + pad(N);
      }
      function openSheet() { if (active < 0 || !sheet) return; fillSheet(); sheetOpen = true; body.classList.add("sheet-open"); sheet.setAttribute("aria-hidden", "false"); try { sheet.focus({ preventScroll: true }); } catch (_) {} }
      function closeSheet() { if (!sheetOpen) return; sheetOpen = false; body.classList.remove("sheet-open"); sheet.setAttribute("aria-hidden", "true"); lastInput = Date.now(); setTimeout(function () { if (!sheetOpen && sbody) sbody.innerHTML = ""; }, 600); }

      function filter(chip) {
        var f = chip.getAttribute("data-f");
        [].forEach.call(document.querySelectorAll(".wh-chip"), function (c) { c.classList.toggle("on", c === chip); });
        cards = all.filter(function (c) { var on = f === "*" || c.getAttribute("data-grp") === f; c.hidden = !on; return on; });
        N = cards.length; active = -1; rot = 0; target = null; vel = 0; lastInput = Date.now();
        layout();
        if (!reduce && !still) { spread = 0.15; fan(); } else render();
      }

      // 드래그(마우스·터치)
      stage.addEventListener("pointerdown", function (e) {
        kbd = false; moved = false;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        if (e.target.closest(".wh-top,.wh-chips,.wh-info")) return;
        dragging = true; px0 = e.clientX; rot0 = rot; target = null; vel = 0;
        samples = [[performance.now(), rot]]; lastInput = Date.now(); stage.classList.add("grab");
      });
      window.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        var dx = e.clientX - px0; if (Math.abs(dx) > 5) moved = true;
        rot = rot0 + dx / R * DEG * (mob ? 1.2 : 1); limit();
        samples.push([performance.now(), rot]); if (samples.length > 6) samples.shift();
        render();
      }, { passive: true });
      function endDrag() {
        if (!dragging) return; dragging = false; stage.classList.remove("grab"); lastInput = Date.now();
        var a = samples[0], b = samples[samples.length - 1], dt = b[0] - a[0], idle = performance.now() - b[0];
        vel = moved && dt > 0 && idle < 90 ? clamp((b[1] - a[1]) / dt * 16.7, -7, 7) : 0;
        if (Math.abs(vel) < 0.25) { vel = 0; target = snapTarget(rot); }
        kick();
      }
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
      // 휠(마우스·트랙패드) → 회전, 멈추면 가까운 카드로
      var wT = 0;
      stage.addEventListener("wheel", function (e) {
        if (sheetOpen || e.target.closest(".wh-chips")) return;
        var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; if (!d) return;
        e.preventDefault(); if (e.deltaMode === 1) d *= 30;
        target = null; vel = 0; rot -= clamp(d, -160, 160) * 0.11; limit(); lastInput = Date.now(); render();
        clearTimeout(wT); wT = setTimeout(function () { target = snapTarget(rot); kick(); }, 150);
      }, { passive: false });

      document.addEventListener("click", function (e) {
        var t = e.target, b;
        if ((b = t.closest("[data-step]"))) { lastInput = Date.now(); step(+b.getAttribute("data-step")); return; }
        if ((b = t.closest(".wh-card"))) {
          if (moved) { moved = false; return; }
          var i = cards.indexOf(b); if (i < 0) return;
          lastInput = Date.now();
          if (i === active && spread >= 1 && (target == null || Math.abs(target - rot) < S / 2)) openSheet(); else go(i);
          return;
        }
        if (t.closest("[data-open]")) { openSheet(); return; }
        if (t.closest("[data-close]")) { closeSheet(); return; }
        if ((b = t.closest("[data-snav]"))) { lastInput = Date.now(); step(+b.getAttribute("data-snav")); return; }
        if ((b = t.closest(".wh-chip"))) { filter(b); return; }
        if ((b = t.closest(".wd-th"))) { // 상세: 미디어 전환
          var box = b.closest(".wd-media"), main = box && box.querySelector(".wd-main"); if (!main) return;
          [].forEach.call(box.querySelectorAll(".wd-th"), function (x) { x.classList.toggle("on", x === b); });
          var yt = b.getAttribute("data-yt");
          main.innerHTML = yt ? '<span class="wd-play" aria-hidden="true"></span>' : "";
          main.style.backgroundImage = "url('" + b.getAttribute("data-src") + "')";
          main.classList.toggle("img", !yt); // 사진은 잘리지 않게 전체(contain), 영상 썸네일은 꽉 채움
          if (yt) { main.classList.add("yt"); main.setAttribute("data-yt", yt); } else { main.classList.remove("yt"); main.removeAttribute("data-yt"); }
          return;
        }
        if ((b = t.closest(".wd-main.yt"))) { // 상세: 영상은 시트 안에서 재생
          b.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + b.getAttribute("data-yt") + '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
          b.classList.remove("yt"); return;
        }
        var a = t.closest("a[data-ext]");
        if (a && body.getAttribute("data-host") === "studio") { // 스튜디오 미리보기: 돌아가기 = 미리보기를 메인으로
          e.preventDefault();
          if (a.classList.contains("wh-back")) { try { parent.postMessage({ klio: "pp-back" }, "*"); } catch (_) {} } else window.open(a.href, "_blank", "noopener");
        }
      });
      document.addEventListener("keydown", function (e) {
        kbd = true; moved = false;
        if (sheetOpen) { if (e.key === "Escape") closeSheet(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); return; }
        if (e.key === "ArrowRight") { e.preventDefault(); lastInput = Date.now(); step(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); lastInput = Date.now(); step(-1); }
      });
      stage.addEventListener("focusin", function (e) { var b = e.target.closest && e.target.closest(".wh-card"); if (b && kbd) { var i = cards.indexOf(b); if (i >= 0 && i !== active) go(i); } });
      [ring, document.querySelector(".wh-info")].forEach(function (el) { // 마우스를 올려 보는 중엔 자동 넘김 멈춤
        if (!el) return;
        el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hover = true; });
        el.addEventListener("pointerleave", function () { hover = false; });
      });
      window.addEventListener("message", function (e) { // 메인 타일에서 들어온 카드로 바로
        var m = e.data; if (!m || m.klio !== "goto-card" || typeof m.id !== "string") return;
        var c = all.filter(function (x) { return x.getAttribute("data-id") === m.id; })[0]; if (!c) return;
        if (c.hidden) { var allChip = document.querySelector('.wh-chip[data-f="*"]'); if (allChip) filter(allChip); }
        lastInput = Date.now(); go(cards.indexOf(c), true);
      });
      addEventListener("resize", function () { layout(); render(); });
      if (!reduce && !still && stage.getAttribute("data-auto") !== "0") setInterval(function () { // 가만두면 한 장씩 흘러감(KILO 대시보드에서 끌 수 있음)
        if (hover || sheetOpen || dragging || document.hidden || spread < 1 || Date.now() - lastInput < 9000) return;
        if (!loop && active >= N - 1) go(0); else step(1);
      }, 3800);

      layout(); render(); ready = true;
      if (spread < 1) fan();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); render(); });
    };
    function projectsPage() {
      var N = works.length, pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
      var yrs = works.map(function (x) { return yearOf(x.w); }).filter(Boolean).sort();
      var yrTxt = yrs.length ? (yrs[0] === yrs[yrs.length - 1] ? yrs[0] : yrs[0] + " — " + yrs[yrs.length - 1]) : "";
      // 묶음·카드 편집(KILO 대시보드 '전체 프로젝트' 탭)
      //  groups = 분야(카테고리)를 4~5개로 묶음 · groupOf = 카드별 묶음 예외 · cards[id] = {title 카드 이름, off 숨김, kpi 대표 지표 번호(-1 없음), thumb 썸네일 번호(-1 색+아이콘)}
      //  cardOrder = 카드 순서(작업 id 목록). 휠에는 묶음 순서 → 카드 순서로 놓임, 어느 묶음에도 없으면 '기타'
      var GR = (Array.isArray(K.groups) ? K.groups : DEFAULT_GROUPS).filter(function (g) { return g && g.id; });
      var GO = K.groupOf || {}, KC = K.cards || {}, ORD = Array.isArray(K.cardOrder) ? K.cardOrder : [], catG = {}, gIdx = {}, oIdx = {};
      GR.forEach(function (g, gi) { gIdx[g.id] = gi; (g.cats || []).forEach(function (c) { if (!catG[c]) catG[c] = g.id; }); });
      ORD.forEach(function (id, k) { if (oIdx[id] == null) oIdx[id] = k; });
      var gidOf = function (w) { var o = GO[w.id]; if (o && gIdx[o] != null) return o; return catG[w.category || "기타"] || "etc"; };
      var list = works.filter(function (x) { return !(KC[x.w.id] && KC[x.w.id].off); }).map(function (x, o) { return { x: x, g: gidOf(x.w), o: o }; });
      list.sort(function (a, b) {
        var ga = gIdx[a.g] != null ? gIdx[a.g] : 99, gb = gIdx[b.g] != null ? gIdx[b.g] : 99;
        var oa = oIdx[a.x.w.id] != null ? oIdx[a.x.w.id] : 1e4 + a.o, ob = oIdx[b.x.w.id] != null ? oIdx[b.x.w.id] : 1e4 + b.o;
        return ga - gb || oa - ob;
      });
      N = list.length;
      var gCnt = {}; list.forEach(function (y) { gCnt[y.g] = (gCnt[y.g] || 0) + 1; });
      var gChips = GR.filter(function (g) { return g.on !== false && gCnt[g.id]; }).map(function (g) { return '<button class="wh-chip" type="button" data-f="' + esc(g.id) + '">' + esc(g.label || "묶음") + '<i>' + gCnt[g.id] + '</i></button>'; }).join("");
      var chips = '<button class="wh-chip on" type="button" data-f="*">전체<i>' + N + '</i></button>' + gChips
        + (gChips && gCnt.etc ? '<button class="wh-chip" type="button" data-f="etc">기타<i>' + gCnt.etc + '</i></button>' : '');
      var cardsHtml = "", tpls = "", items = [];
      list.forEach(function (y, i) {
        var x = y.x, w = x.w, co = x.co, cm = catMeta(w.category), id = w.id || String(i), CC = KC[w.id] || {};
        var title = (CC.title && String(CC.title).trim()) || w.title || "";
        // 썸네일: 카드별 선택(번호) 우선, -1이면 색+아이콘, 없으면 첫 이미지·영상
        var md = mediaOf(w), ti = CC.thumb != null ? +CC.thumb : 0, main = ti >= 0 && md[ti] ? md[ti] : (ti >= 0 ? md[0] : null);
        if (main && md.indexOf(main) > 0) { md = [main].concat(md.filter(function (m) { return m !== main; })); } // 상세에서도 고른 걸 먼저
        // 대표 지표: 카드별 선택(번호) 우선, -1이면 표시 안 함
        var mets = (w.metrics || []).filter(function (m) { return m && m.value; }), ki = CC.kpi != null ? +CC.kpi : 0;
        var m0 = ki >= 0 ? (mets[ki] || mets[0]) : null;
        if (m0 && mets.indexOf(m0) > 0) mets = [m0].concat(mets.filter(function (m) { return m !== m0; }));
        var per = wPeriod(w), yr = yearOf(w);
        items.push({ i: i, w: w, co: co, cm: cm, title: title, md: md, main: main, m0: m0, mets: mets, per: per, yr: yr, g: y.g, sum: String(CC.sum || "").trim(), why: String(CC.why || "").trim() });
        // 휠 카드 = 상품카드: 위 썸네일(이미지·영상 ▶ / 없으면 분야 색 + 아이콘) · 아래 분야·제목·회사·대표 지표
        var thumb = main
          ? '<span class="wh-th img" style="--img:url(\'' + esc(main.src) + '\')">' + thumbImg(main.src, fitOf(w)) + (main.yt ? '<i class="wh-play" aria-hidden="true"></i>' : '') + '</span>'
          : '<span class="wh-th art">' + coverArt(w, m0) + '</span>'; // 이미지 없으면 자동 일러스트
        var info = '<span class="wh-bd"><em class="wh-cat">' + esc(cm.en) + '</em><b class="wh-t">' + esc(title) + '</b>'
          + '<span class="wh-m">' + esc(dispName(co)) + (yr ? ' · ' + esc(yr) : '') + '</span>'
          + (m0 ? '<span class="wh-p"><b>' + esc(m0.value) + '</b>' + (m0.label ? ' ' + esc(m0.label) : '') + '</span>' : '') + '</span>';
        cardsHtml += '<button class="wh-card' + (cm.dark ? ' dk' : '') + '" type="button" data-i="' + i + '" data-id="' + esc(id) + '" data-cat="' + esc(w.category || "기타") + '" data-grp="' + esc(y.g) + '" style="--c:' + cm.c + '" aria-label="' + esc(title) + '"><span class="wh-face">' + thumb + info + '</span></button>';
        // 선택 카드 정보(휠 아래): 분야·회사·기간 · 제목(큰 화면에서만) · 지표 알약
        var kp = (m0 ? mets : []).slice(0, 3).map(function (m) { return '<span class="wh-kpi"><b>' + esc(m.value) + '</b>' + esc(m.label || "") + '</span>'; }).join("");
        tpls += '<template id="whi-' + i + '"><p class="wh-meta">' + esc(cm.en) + '<span> · ' + esc(dispName(co)) + (per ? ' · ' + esc(per) : '') + '</span></p>'
          + '<h2 class="wh-name">' + esc(title) + '</h2>' + ((w.summary || w.detail) ? '<p class="wh-sum">' + esc(w.summary || w.detail) + '</p>' : '') + (kp ? '<div class="wh-kpis">' + kp + '</div>' : '') + '</template>';
        // 상세 시트
        var media = main
          ? '<div class="wd-main' + (main.yt ? ' yt' : ' img') + '" style="background-image:url(\'' + esc(main.src) + '\')"' + (main.yt ? ' data-yt="' + esc(main.yt) + '"' : '') + '>' + (main.yt ? '<span class="wd-play" aria-hidden="true"></span>' : '') + '</div>'
            + (md.length > 1 ? '<div class="wd-ths">' + md.slice(0, 8).map(function (m, k) { return '<button class="wd-th' + (k ? '' : ' on') + '" type="button" style="background-image:url(\'' + esc(m.src) + '\')" data-src="' + esc(m.src) + '"' + (m.yt ? ' data-yt="' + esc(m.yt) + '"' : '') + ' aria-label="미디어 ' + (k + 1) + '"></button>'; }).join("") + '</div>' : '')
          : '<div class="wd-main art">' + (m0 ? '<span class="wd-ic">' + catIcon(w.category) + '</span><span class="wd-kv"><b>' + esc(m0.value) + '</b>' + (m0.label ? '<span>' + esc(m0.label) + '</span>' : '') + '</span>' : '<span class="wd-big">' + catIcon(w.category) + '</span>') + '</div>';
        var kpis = (w.metrics || []).filter(function (m) { return m && m.value; }).sort(function (a, b) { return (a === m0 ? -1 : 0) - (b === m0 ? -1 : 0); }).slice(0, 4).map(function (m) { return '<div class="wd-kpi"><b>' + esc(m.value) + '</b><span>' + esc(m.label || "") + '</span></div>'; }).join("");
        var par = function (k, v) { return v ? '<div class="wd-par"><em>' + k + '</em><p>' + esc(v) + '</p></div>' : ''; };
        var pars = par("Problem", w.problem) + par("Action", w.action) + par("Result", w.result);
        var tags = (w.tags || []).filter(Boolean).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join("");
        var links = (w.links || []).filter(function (l) { return l && l.url; }).map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || "링크") + ' ↗</a>'; }).join("");
        var desc = w.detail || w.summary || "";
        tpls += '<template id="whd-' + i + '"><div class="wd-media' + (cm.dark ? ' dk' : '') + '" style="--c:' + cm.c + '">' + media + '</div><div class="wd-body">'
          + '<span class="wd-cat' + (cm.dark ? ' dk' : '') + '" style="--c:' + cm.c + '">' + esc(cm.en) + '</span>'
          + '<h2 class="wd-title">' + esc(title) + '</h2>'
          + '<p class="wd-co">' + esc(dispName(co)) + (co.role ? ' · ' + esc(co.role) : '') + (per ? ' · ' + esc(per) : '') + '</p>'
          + (kpis ? '<div class="wd-kpis">' + kpis + '</div>' : '') + (desc ? '<p class="wd-desc">' + esc(desc) + '</p>' : '')
          + (pars ? '<div class="wd-pars">' + pars + '</div>' : '') + (tags ? '<div class="wd-tags">' + tags + '</div>' : '') + (links ? '<div class="wd-links">' + links + '</div>' : '')
          + '</div></template>';
      });
      // 머리 문장(klio.text.ppTitle): 줄바꿈 = 줄 나눔, *단어* = 강조(세리프 글꼴은 기울임 · 그 외는 회색)
      var headTxt = String(txt("ppTitle", "Projects")).trim();
      var headHtml = esc(headTxt).replace(/\*([^*\n]+)\*/g, "<em>$1</em>").replace(/\r?\n/g, "<br>");
      var eyebrow = esc(txt("ppEyebrow", "Selected Projects")) + (yrTxt ? ' · ' + esc(yrTxt) : '');
      // ── 스크롤형 전체 프로젝트(기본 · KILO 대시보드 '전체 프로젝트 → 페이지 모양' = klio.ui.ppLayout, wheel = 원형 휠)
      // 머리 문장 → 묶음마다 [소개 문장 줄 → 대표 프로젝트 큰 패널 → 나머지 3열 카드] 반복 → 누르면 전체 화면 상세(왼쪽 고정 정보 + 오른쪽 큰 이미지 흐름 + 다음 프로젝트)
      if ((K.ui || {}).ppLayout !== "wheel" || d.page === "projects-test" || d.page === "projects-airbridge") {
        // 썸네일: 이미지를 자르지 않고 원래 비율 그대로 띄움(둥근 모서리·그림자) · 유튜브는 16:9 틀(위아래 검은 띠 제거) · 대시보드에서 '꽉 채우기'로 둔 카드는 채움
        var pImg = function (m, alt, cover, f) {
          return m.yt ? '<span class="ytf"><img src="' + esc(m.src) + '" alt="' + esc(alt || "") + '" decoding="async"><i class="ps-play" aria-hidden="true"></i></span>'
            : '<img class="fl" src="' + esc(m.src) + '" alt="' + esc(alt || "") + '" decoding="async"' + (cover && f ? ' style="object-position:' + f.px + '% ' + f.py + '%"' : '') + '>';
        };
        var pMedia = function (it, m, cls) {
          var f = fitOf(it.w), cover = m && m === it.main && f.fit === "cover" && !m.yt;
          return m ? '<span class="' + cls + ' img' + (cover ? ' cover' : '') + '">' + pImg(m, "", cover, f) + '</span>'
            : '<span class="' + cls + ' art">' + coverArt(it.w, it.m0) + '</span>';
        };
        var capOf = function (it) { return esc(it.cm.en) + ' · ' + esc(dispName(it.co)) + (it.yr ? ' · ' + esc(it.yr) : ''); };
        var gOrder = GR.filter(function (g) { return g.on !== false; }).map(function (g) { return { id: g.id, label: g.label || "묶음", desc: g.desc || "", lead: g.lead || "" }; }).concat([{ id: "etc", label: "기타", desc: "" }]);
        var secs = gOrder.map(function (g) { return { g: g, items: items.filter(function (it) { return it.g === g.id; }) }; }).filter(function (s) { return s.items.length; });
        if (!secs.length && items.length) secs = [{ g: { id: "all", label: "Projects", desc: "" }, items: items }];
        // 단어마다 가림 틀(.w) 안에 .wi — 등장할 때 아래에서 올라옴(--i = 순서)
        var maskWords = function (s, i0) { return String(s || "").split(/\s+/).filter(Boolean).map(function (t, k) { return '<span class="w"><span class="wi" style="--i:' + (i0 + k) + '">' + esc(t) + '</span></span>'; }).join(" "); };
        var catsOf = function (its) { var cs = []; its.forEach(function (it) { var c = it.w.category || "기타"; if (cs.indexOf(c) < 0) cs.push(c); }); return cs.join(" · "); };
        var nProj = function (n) { return '<b>' + n + '</b> ' + (n === 1 ? "project" : "projects"); };
        // 섹션 머리: 굵은 선 · 머리글 줄(왼쪽 분야 / 오른쪽 개수) · 회색 번호 + 제목 | 소개 문장 · 대표 성과
        var secHead = function (no, label, left, n, desc, extra) {
          return '<div class="ps-row"><div class="ps-bar"><span>' + esc(left) + '</span><span>' + nProj(n) + '</span></div>'
            + '<div class="ps-hd"><h2 class="ps-lb"><span class="ps-no">' + maskWords(no, 0) + '</span><span class="ps-lt">' + maskWords(label, 1) + '</span></h2></div>'
            + ((desc || extra) ? '<div class="ps-rt">' + (desc ? '<p class="ps-tx">' + esc(desc) + '</p>' : '') + (extra || '') + '</div>' : '') + '</div>';
        };
        var body = secs.map(function (s, si) {
          var its = s.items, lead = (s.g.lead && its.filter(function (it) { return it.w.id === s.g.lead; })[0]) || its.filter(function (it) { return it.main; })[0] || its.filter(function (it) { return it.m0; })[0] || its[0];
          var rest = its.filter(function (it) { return it !== lead; });
          var gtx = String(s.g.desc || "").trim(); // 묶음 소개 문장(대시보드) — 비우면 문장 없이 대표 성과만
          var kfigs = its.filter(function (it) { return it.m0; }).slice(0, 3).map(function (it, q) { return '<button class="ps-kf" type="button" data-open="' + it.i + '" style="--q:' + q + '" title="' + esc(it.title) + '"><b>' + esc(it.m0.value) + '</b><span>' + esc(it.m0.label || it.title) + '</span></button>'; }).join("");
          var side = rest.slice(0, 2), ld = lead.md.length > 2 ? [lead.md[1], lead.md[2]] : null;
          var fan = (ld ? pMedia(lead, ld[0], "ps-f f1") + pMedia(lead, ld[1], "ps-f f3") : side.length === 2 ? pMedia(side[0], side[0].main, "ps-f f1") + pMedia(side[1], side[1].main, "ps-f f3") : '') + pMedia(lead, lead.main, "ps-f f2");
          var panel = '<button class="ps-p rv" type="button" data-open="' + lead.i + '" style="--c:' + lead.cm.c + '" aria-label="' + esc(lead.title) + ' 자세히 보기"><span class="ps-fan">' + fan + '</span>'
            + '<span class="ps-cap"><em>' + capOf(lead) + '</em><b>' + esc(lead.title) + '</b>' + (lead.sum ? '<span class="ps-cs">' + esc(lead.sum) + '</span>' : '') + (lead.m0 ? '<small><strong>' + esc(lead.m0.value) + '</strong> ' + esc(lead.m0.label || "") + '</small>' : '') + '</span>'
            + '<span class="ps-go">' + esc(txt("ppMore", "자세히 보기")) + ' <i>→</i></span></button>';
          var grid = rest.length ? '<div class="ps-grid">' + rest.map(function (it, k) {
              return '<button class="ps-c rv" type="button" data-open="' + it.i + '" style="--d:' + (k % 3 * 80) + 'ms;--c:' + it.cm.c + '">' + pMedia(it, it.main, "ps-th")
                + '<span class="ps-r1"><b>' + esc(it.title) + '</b><em>' + esc(it.cm.en) + '</em></span><span class="ps-r2">' + esc(dispName(it.co)) + (it.yr ? ' · ' + esc(it.yr) : '') + (it.m0 ? ' · <strong>' + esc(it.m0.value) + '</strong> ' + esc(it.m0.label || "") : '') + '</span>' + (it.sum ? '<span class="ps-r3">' + esc(it.sum) + '</span>' : '') + '</button>';
            }).join("") + '</div>' : '';
          return '<section class="ps-sec" id="g-' + esc(s.g.id) + '" data-g="' + esc(s.g.id) + '" data-c="' + esc(lead.cm.c) + '" style="--c:' + esc(lead.cm.c) + '">'
            + secHead(pad2(si + 1), s.g.label, catsOf(its), its.length, gtx, kfigs ? '<div class="ps-kfs">' + kfigs + '</div>' : '') + panel + grid + '</section>';
        }).join("");
        // 상세(전체 화면): 항목마다 template
        var pdT = items.map(function (it, k) {
          var w = it.w, co = it.co, cm = it.cm, nx = items[(k + 1) % items.length];
          var desc = it.sum || w.summary || w.detail || "", more = w.detail && w.detail !== desc ? w.detail : "";
          var meta = [["기간", it.per], ["회사", dispName(co)], ["역할", co.role || ""], ["분야", w.category ? cm.en + " · " + w.category : ""]].filter(function (r) { return r[1]; })
            .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("")
            + ((w.stack || []).length ? '<div class="wide"><dt>도구</dt><dd>' + w.stack.map(esc).join(" · ") + '</dd></div>' : '');
          var acc = [["Problem", w.problem], ["Action", w.action], ["Result", w.result]].filter(function (r) { return r[1]; })
            .map(function (r, j) { return '<details class="pd-acc"' + (j ? '' : ' open') + '><summary>' + r[0] + '<i aria-hidden="true"></i></summary><p>' + esc(r[1]).replace(/\n/g, "<br>") + '</p></details>'; }).join("");
          var tags = (w.tags || []).filter(Boolean).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join("");
          var links = (w.links || []).filter(function (l) { return l && l.url && !ytW(l.url); }).map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || "링크") + ' ↗</a>'; }).join("");
          var panel = function (m, big) {
            return '<div class="pd-p pr' + (big ? ' big' : '') + '" style="--c:' + cm.c + '">' + (m ? '<span class="pd-m img' + (m.yt ? ' yt' : '') + '"' + (m.yt ? ' data-yt="' + esc(m.yt) + '" role="button" tabindex="0" aria-label="영상 재생"' : '') + '>' + pImg(m, m.t || it.title) + '</span>' : '<span class="pd-m art">' + coverArt(w, it.m0) + '</span>') + '</div>';
          };
          var allM = it.main ? [it.main].concat(it.md.filter(function (m) { return m !== it.main; })) : [];
          var slide = function (m, k) { return '<div class="pd-sl' + (k ? '' : ' on') + '" data-k="' + k + '"><span class="pd-m img' + (m.yt ? ' yt' : '') + '"' + (m.yt ? ' data-yt="' + esc(m.yt) + '" role="button" tabindex="0" aria-label="영상 재생"' : '') + '>' + pImg(m, m.t || it.title) + '</span></div>'; };
          var viewer = allM.length
            ? '<div class="pd-p pr big pd-vw" style="--c:' + cm.c + '" data-n="' + allM.length + '"><div class="pd-vs">' + allM.map(slide).join("") + '</div><span class="pd-zh" aria-hidden="true">⤢ 눌러서 크게 보기</span>'
              + (allM.length > 1 ? '<button class="pd-nav prv" type="button" data-vw="-1" aria-label="이전 이미지">‹</button><button class="pd-nav nxt" type="button" data-vw="1" aria-label="다음 이미지">›</button><span class="pd-cnt"><b>1</b> / ' + allM.length + '</span>' : '') + '</div>'
              + (allM.length > 1 ? '<div class="pd-thr" role="tablist" aria-label="이미지 ' + allM.length + '장">' + allM.map(function (m, k) { return '<button class="pd-tb' + (k ? '' : ' on') + (m.yt ? ' yt' : '') + '" type="button" data-vk="' + k + '" style="background-image:url(\'' + esc(m.src) + '\')" aria-label="이미지 ' + (k + 1) + '"></button>'; }).join("") + '</div>' : '')
            : panel(null, true);
          var flow = viewer
            + (it.mets.length ? '<div class="pd-kpis"><h3 class="pd-h">Key results</h3><div class="pd-kr">' + it.mets.slice(0, 4).map(function (m) { return '<div><b>' + esc(m.value) + '</b><span>' + esc(m.label || "") + '</span></div>'; }).join("") + '</div></div>' : '')
            + (more ? '<div class="pd-card"><h3 class="pd-h">Overview</h3><p>' + esc(more).replace(/\n/g, "<br>") + '</p></div>' : '')

          var next = items.length > 1 ? '<button class="pd-next" type="button" data-open="' + nx.i + '" style="--c:' + nx.cm.c + '"><span class="pd-next-t"><small>다음 프로젝트</small><b>' + esc(nx.title) + '</b><em>' + capOf(nx) + '</em></span><span class="pd-next-a" aria-hidden="true">→</span>' + pMedia(nx, nx.main, "pd-next-m") + '</button>' : '';
          return '<template id="pd-' + it.i + '"><div class="pd-main"><aside class="pd-side"><div class="pd-stick"><em class="pd-cat">' + esc(cm.en) + '</em><h1>' + esc(it.title) + '</h1>' + (desc ? '<p class="pd-desc">' + esc(desc) + '</p>' : '')
            + '<dl class="pd-meta">' + meta + '</dl>' + (acc ? '<div class="pd-accs">' + acc + '</div>' : '') + (tags ? '<div class="pd-tags">' + tags + '</div>' : '') + (links ? '<div class="pd-links">' + links + '</div>' : '') + '</div></aside>'
            + '<div class="pd-flow">' + flow + '</div></div>' + next + '</template>';
        }).join("");
        // 첫 화면: 분야 목차(한 줄 표 · 칸마다 번호/개수 · 이름 · 담긴 분야, 올리면 분야 색이 아래에서 차오름 · 누르면 그 분야로) · 썸네일 흐름 · 스크롤 안내
        var gArrow = '<svg class="ps-gc-a" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5v11M3.5 9 8 13.5 12.5 9"/></svg>';
        var gIndex = shown("pp", "gindex", true) && secs.length > 1 ? '<nav class="ps-gi" aria-label="분야 목차" style="--gn:' + secs.length + '">' + secs.map(function (s, si) {
            return '<button class="ps-gc" type="button" data-goto="' + esc(s.g.id) + '" style="--c:' + esc(s.items[0].cm.c) + ';--k:' + si + '"><span class="ps-gc-top"><span class="ps-gc-n">' + pad2(si + 1) + '</span><span>' + s.items.length + (s.items.length === 1 ? ' project' : ' projects') + '</span></span>'
              + '<span class="ps-gc-t">' + esc(s.g.label) + '</span><span class="ps-gc-s"><span>' + esc(catsOf(s.items)) + '</span>' + gArrow + '</span></button>';
          }).join("") + '</nav>' : '';
        var mqItems = items.filter(function (it) { return it.main; }).concat(items.filter(function (it) { return !it.main; })).slice(0, 18);
        var mqTile = function (it) { return '<button class="ps-mt" type="button" data-open="' + it.i + '" style="--c:' + it.cm.c + '" tabindex="-1">' + pMedia(it, it.main, "ps-mth") + '<span class="ps-mtx"><small>' + esc(dispName(it.co)) + '</small><b>' + esc(it.title) + '</b></span></button>'; };
        var mqRow = mqItems.map(mqTile).join("");
        var marquee = shown("pp", "marquee", true) && mqItems.length > 3 ? '<div class="ps-mq" aria-label="프로젝트 미리보기 — 누르면 상세"><div class="ps-mq-t">' + mqRow + mqRow + '</div></div>' : '';
        // 제목 옆 소개 문장(klio.text.ppSub): {y} = 첫 연도 · {n} = 프로젝트 수 · {g} = 분야 수
        var y0 = yrs.length ? yrs[0] : "";
        var subTxt = String(txt("ppSub", "{y}년부터 직접 기획하고 운영한 프로젝트 {n}개를 {g}개 분야로 나눠 정리했습니다.")).replace(/\{y\}년부터\s*/g, y0 ? y0 + "년부터 " : "").replace(/\{y\}/g, y0).replace(/\{n\}/g, N).replace(/\{g\}/g, secs.length);
        var shortHead = !/\n/.test(headTxt) && headTxt.replace(/\*/g, "").length <= 14; // 한 단어·짧은 제목은 크게 + 개수 첨자
        var cue = '<button class="ps-cue" type="button" data-goto="' + esc(secs[0] ? secs[0].g.id : "*") + '"><span>' + esc(txt("ppScroll", "스크롤해서 분야별로 보기")) + '</span><i aria-hidden="true"></i></button>';
        // 전체 목록: 한 줄씩 · 올리면 오른쪽에 미리보기 · 누르면 상세
        var idxList = shown("pp", "index", true) && items.length ? '<section class="ps-idx" id="g-index" data-g="index" data-c="var(--bg)" style="--c:var(--sand)">' + secHead(pad2(secs.length + 1), txt("ppIndexT", "전체 목록"), "Index", N, txt("ppIndexD", "모든 프로젝트를 한 줄로 모았어요. 올리면 미리보기, 누르면 자세히 볼 수 있어요."), "")
          + '<div class="ps-if">' + '<button class="ps-if-b on" type="button" data-if="*">전체</button>' + secs.map(function (s) { return '<button class="ps-if-b" type="button" data-if="' + esc(s.g.id) + '">' + esc(s.g.label) + '</button>'; }).join("") + '</div>'
          + '<div class="ps-ig"><ol class="ps-il">' + items.map(function (it, k) {
              return '<li class="rv" style="--d:' + (k % 8 * 45) + 'ms"><button class="ps-ir" type="button" data-open="' + it.i + '" data-ig="' + esc(it.g) + '" data-pv="' + it.i + '"><span class="ps-in">' + pad2(k + 1) + '</span><b>' + esc(it.title) + '</b><em>' + esc(dispName(it.co)) + '</em><span class="ps-ik">' + (it.m0 ? '<strong>' + esc(it.m0.value) + '</strong> ' + esc(it.m0.label || "") : esc(it.cm.en)) + '</span><span class="ps-iy">' + esc(it.yr || "") + '</span><i class="ps-ia">→</i></button></li>';
            }).join("") + '</ol><div class="ps-ipv rv" aria-hidden="true">' + items.map(function (it) { return '<div class="ps-ipi" data-pvi="' + it.i + '" style="--c:' + it.cm.c + '">' + pMedia(it, it.main, "ps-ipm") + '<p><em>' + esc(it.cm.en) + '</em>' + esc(it.sum || it.w.summary || "") + '</p></div>'; }).join("") + '</div></div></section>' : '';
        var gChipsS = secs.map(function (s) { return '<button class="ps-chip" type="button" data-goto="' + esc(s.g.id) + '">' + esc(s.g.label) + '<i>' + s.items.length + '</i></button>'; }).join("");
        var PSCSS = ':root{--ink:#1d1d1f;--ink60:rgba(29,29,31,.62);--gray:#86868b;--bd:rgba(29,29,31,.1);--bg:#f6f6f5;--mint:#abdcd1;--beige:#e6e1d5;--sand:#eae6da;--coral:#dd8e6e;--lav:#c3cde4;--ez:cubic-bezier(.16,1,.3,1);--sw:min(1344px,calc(100vw - 48px))}'
          + '*,*::before,*::after{box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;overflow-x:clip}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);font-size:16px;line-height:1.6;letter-spacing:-.015em;-webkit-font-smoothing:antialiased;word-break:keep-all;overflow-x:clip}'
          + 'h1,h2,h3,p{margin:0}a{color:inherit;text-decoration:none}button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:inherit}:focus-visible{outline:2px solid var(--ink);outline-offset:3px}'
          + '.js .rv{opacity:0;transform:translateY(26px);filter:blur(6px);transition:opacity 1s var(--ez),transform 1.1s var(--ez),filter 1s var(--ez);transition-delay:var(--d,0ms)}.js .rv.in{opacity:1;transform:none;filter:none}'
          + '.ps-top{position:fixed;left:0;right:0;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;width:var(--sw);margin:0 auto;padding:20px 0;pointer-events:none}.ps-top>*{pointer-events:auto}'
          + '.ps-back{display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 0 0 .5px var(--bd);font-size:13.5px;font-weight:600}.ps-back:hover{background:#fff}'
          + '.ps-cs{font-size:14px;line-height:1.55;color:var(--ink60);margin-top:2px}.ps-r3{margin-top:-4px;font-size:13px;line-height:1.55;color:var(--ink60);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
          + '.ps-mq{width:100vw;margin-top:44px;overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}'
          + '.ps-mq-t{display:flex;gap:14px;width:max-content;padding:10px 0 18px;animation:mq 60s linear infinite}.ps-mq:hover .ps-mq-t{animation-play-state:paused}@keyframes mq{to{transform:translateX(-50%)}}body[data-still] .ps-mq-t{animation:none}'
          + '.ps-mt{flex:none;width:210px;display:flex;flex-direction:column;gap:8px;text-align:left;transition:transform .45s var(--ez)}.ps-mt:hover{transform:translateY(-6px)}.ps-mt>span:last-child{font-size:12.5px;font-weight:600;color:var(--ink60);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
          + '.ps-mth{position:relative;display:grid;place-items:center;height:140px;border-radius:18px;overflow:hidden;background:color-mix(in srgb,var(--c) 30%,#fff)}.ps-mth.art svg{width:92%;height:92%}.ps-mth.img>.fl{max-width:86%;max-height:84%}.ps-mth.img>.ytf{width:86%}.ps-mth.img.cover{padding:0}'
          + '.ps-cue{display:inline-flex;flex-direction:column;align-items:center;gap:10px;margin-top:26px;font-size:12.5px;font-weight:600;color:var(--gray)}.ps-cue i{position:relative;width:22px;height:34px;border-radius:12px;box-shadow:inset 0 0 0 1.5px var(--gray)}.ps-cue i::after{content:"";position:absolute;left:50%;top:7px;width:3px;height:7px;margin-left:-1.5px;border-radius:2px;background:var(--ink);animation:cue 1.8s var(--ez) infinite}@keyframes cue{0%{opacity:0;transform:translateY(-3px)}30%{opacity:1}100%{opacity:0;transform:translateY(12px)}}.ps-cue:hover{color:var(--ink)}'
          + '.ps-idx{width:var(--sw);margin:0 auto;padding-top:140px}.ps-if{display:flex;flex-wrap:wrap;gap:6px;margin:-20px 0 24px}.ps-if-b{height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;color:var(--ink60);box-shadow:inset 0 0 0 1px var(--bd);transition:background .25s,color .25s}.ps-if-b.on{background:var(--ink);color:#fff;box-shadow:none}'
          + '.ps-ig{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:40px;align-items:start}.ps-il{list-style:none;margin:0;padding:0;border-top:1px solid var(--bd)}.ps-il li{border-bottom:1px solid var(--bd)}.ps-il li.hid{display:none}'
          + '.ps-ir{display:grid;grid-template-columns:36px minmax(0,1.6fr) minmax(0,1fr) minmax(0,1.1fr) 48px 20px;align-items:center;gap:14px;width:100%;padding:18px 6px;text-align:left;transition:background .3s,padding .4s var(--ez)}'
          + '.ps-ir:hover,.ps-ir:focus-visible{background:rgba(255,255,255,.7);padding-left:14px}.ps-in{font-size:12px;color:var(--gray);font-variant-numeric:tabular-nums}.ps-ir b{font-size:15.5px;font-weight:600;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
          + '.ps-ir em{font-style:normal;font-size:13px;color:var(--ink60);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ps-ik{font-size:13px;color:var(--ink60);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ps-ik strong{color:var(--ink)}.ps-iy{font-size:12.5px;color:var(--gray);text-align:right}'
          + '.ps-ia{font-style:normal;opacity:0;transform:translateX(-6px);transition:opacity .3s,transform .3s var(--ez)}.ps-ir:hover .ps-ia{opacity:1;transform:none}'
          + '.ps-ipv{position:sticky;top:110px;aspect-ratio:4/4.6;border-radius:28px;overflow:hidden;background:#ebebe9}.ps-ipi{position:absolute;inset:0;display:flex;flex-direction:column;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 34%,#fff),var(--c));opacity:0;transform:scale(1.03);transition:opacity .45s var(--ez),transform .6s var(--ez)}.ps-ipi.on{opacity:1;transform:none}'
          + '.ps-ipm{position:relative;flex:1;display:grid;place-items:center;margin:22px 22px 0}.ps-ipm.art svg{width:92%;height:92%}.ps-ipm.img>.fl{max-width:100%;max-height:100%}.ps-ipm.img>.ytf{width:100%}.ps-ipm.img.cover{border-radius:18px;overflow:hidden}'
          + '.ps-ipi p{padding:16px 22px 22px;font-size:13px;line-height:1.6;color:var(--ink60);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}.ps-ipi p em{display:block;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink60);margin-bottom:4px}'
          + '.ps-top-b{position:fixed;right:clamp(16px,2.4vw,32px);bottom:clamp(16px,2.6vh,26px);z-index:46;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.8);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 0 0 .5px var(--bd),0 10px 24px -12px rgba(0,0,0,.35);font-size:16px;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .35s,transform .35s var(--ez)}.ps-top-b.on{opacity:1;transform:none;pointer-events:auto}body.pd-open .ps-top-b{opacity:0;pointer-events:none}'
          + '@media(max-width:900px){.ps-ig{grid-template-columns:1fr}.ps-ipv{display:none}.ps-ir{grid-template-columns:30px minmax(0,1fr) auto;gap:10px}.ps-ir em,.ps-iy,.ps-ia{display:none}}'
          + 'body.at-hero .ps-chips{opacity:0;pointer-events:none;transform:translate(-50%,14px)}'
          // 스크롤 연동: --hp(첫 화면 지나감 0→1) · --rp(패널 드러남) · --sp(섹션 선 긋기) · --py(카드 시차) · --sk(스크롤 속도 기울기) · --ep(마지막 문장)
          + '.ps-hero>.ps-cue{opacity:calc(1 - var(--hp,0) * 3)}'
          + '.ps-mq{transform:skewX(calc(var(--sk,0) * 1deg)) translateY(calc(var(--hp,0) * -20px));transition:transform .5s var(--ez)}.ps-mq-t{gap:calc(14px + var(--sa,0) * 1px);transition:gap .5s var(--ez)}'
          + ''
          + '.ps-p{clip-path:inset(calc((1 - var(--rp,1)) * 7%) calc((1 - var(--rp,1)) * 9%) round calc(36px + (1 - var(--rp,1)) * 40px))}'
          + '.ps-cap{transform:translateY(calc((1 - var(--rp,1)) * 46px));opacity:calc(var(--rp,1) * 1.3 - .3)}.ps-p>.ps-go{opacity:calc(var(--rp,1) * 1.5 - .5)}'
          + '.ps-f.f2{scale:calc(.9 + var(--rp,1) * .1)}'
          + '.js .ps-c.rv{transform:translateY(70px) rotate(1.4deg) scale(.95)}.js .ps-c.rv.in{transform:none}.js .ps-c.rv.in:hover{transform:translateY(-6px)}'
          + '.js .ps-il li.rv{transform:translateX(-36px);filter:none;transition-delay:var(--d,0ms)}.js .ps-il li.rv.in{transform:none}'
          + '.js .ps-ipv.rv{transform:translateY(40px) scale(.94)}'
          + '.ps-end p{transform:scale(calc(.82 + var(--ep,1) * .18));opacity:calc(.2 + var(--ep,1) * .8);letter-spacing:calc(-.02em + (1 - var(--ep,1)) * .06em)}'
          + '@media(prefers-reduced-motion:reduce){.ps-mq,.ps-c,.ps-p,.ps-cap,.ps-end p{transform:none!important;translate:none!important;clip-path:none!important;opacity:1!important}}'
          + '@media(max-width:600px){.ps-mq{margin-top:28px}.ps-mt{width:160px}.ps-mth{height:108px}.ps-top-b{bottom:74px}}'
          + '@media(prefers-reduced-motion:reduce){.ps-mq-t,.ps-cue i::after{animation:none}}'
          + '@keyframes psIn{from{opacity:0;transform:translateY(18px);filter:blur(8px)}}'
          // ── 첫 화면: 머리글 줄 · 굵은 선 · 큰 제목 + 소개 문장 · 분야 목차(4칸 표) — 가운데 정렬·번짐 배경·유리 카드 없이 선과 그리드로
          + '.ps-hero{position:relative;min-height:max(560px,100svh);display:flex;flex-direction:column;justify-content:center;padding:96px 0 32px}'
          + '.ps-hw{width:var(--sw);margin:0 auto}'
          + '.ps-meta{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding-bottom:14px;font-size:12.5px;font-weight:600;color:var(--ink)}.ps-meta span+span{font-weight:500;color:var(--gray);font-variant-numeric:tabular-nums}'
          + '.ps-hh{position:relative;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:end;gap:48px;padding:clamp(28px,5vh,60px) 0 clamp(30px,5vh,56px)}'
          + '.ps-hh::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ink);transform-origin:0 50%}'
          + '.ps-h1{font-family:var(--disp);font-weight:600;font-size:clamp(38px,4.4vw,72px);line-height:1.04;letter-spacing:-.045em;text-wrap:balance}.ps-h1.big{font-size:clamp(56px,7vw,112px);line-height:.92;letter-spacing:-.055em}'
          + '.ps-h1 em{font-style:normal;color:var(--gray)}.ft-editorial .ps-h1{font-weight:400;letter-spacing:-.03em}.ft-editorial .ps-h1 em{font-style:italic;color:inherit}'
          + '.ps-h1 sup{position:relative;top:.3em;margin-left:.28em;vertical-align:top;font-family:var(--font);font-size:max(13px,.17em);font-weight:500;letter-spacing:0;line-height:1;color:var(--gray);font-variant-numeric:tabular-nums}'
          + '.ps-h1 .w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .06em .14em;margin:0 -.06em -.14em}.ps-h1 .wi{display:inline-block}'
          + '.ps-sub{justify-self:end;max-width:420px;padding-bottom:.35em;font-size:clamp(15px,1.12vw,17px);font-weight:500;line-height:1.7;color:var(--ink60);text-wrap:balance}'
          + '.ps-gi{position:relative;display:grid;grid-template-columns:repeat(var(--gn,4),minmax(0,1fr));border-bottom:1px solid var(--bd)}.ps-gi::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--bd);transform-origin:0 50%}'
          + '.ps-gc{position:relative;display:flex;flex-direction:column;min-width:0;min-height:clamp(150px,19vh,208px);padding:18px 22px 20px;text-align:left;isolation:isolate;overflow:hidden}.ps-gc+.ps-gc{border-left:1px solid var(--bd)}'
          + '.ps-gc::before{content:"";position:absolute;inset:0;z-index:-1;background:color-mix(in srgb,var(--c) 26%,var(--bg));transform:scaleY(0);transform-origin:50% 100%;transition:transform .65s var(--ez)}'
          + '.ps-gc::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .65s var(--ez)}'
          + '.ps-gc:hover::before,.ps-gc:focus-visible::before{transform:none}.ps-gc:hover::after,.ps-gc:focus-visible::after{transform:none}.ps-gc:focus-visible{outline:none}'
          + '.ps-gc-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px;font-size:12.5px;font-weight:500;color:var(--gray);font-variant-numeric:tabular-nums}.ps-gc-n{font-weight:600;color:var(--ink)}'
          + '.ps-gc-t{margin-top:auto;padding-top:26px;font-size:clamp(19px,1.5vw,25px);font-weight:600;line-height:1.16;letter-spacing:-.03em;text-wrap:balance}'
          + '.ps-gc-s{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-top:8px;font-size:13px;line-height:1.45;color:var(--ink60)}.ps-gc-a{flex:none;width:16px;height:16px;transition:transform .45s var(--ez)}.ps-gc:hover .ps-gc-a{transform:translateY(3px)}'
          + '.ps-hero>.ps-mq{margin-top:clamp(28px,4.5vh,48px)}.ps-hero>.ps-cue{align-self:center}'
          // 첫 화면 등장: 선은 왼쪽→오른쪽으로 긋고, 제목은 단어마다 아래에서 올라오고(가림 틀), 나머지는 차례로 떠오름 — 흐림(blur) 없음
          + '@keyframes psLine{from{transform:scaleX(0)}}@keyframes psUp{from{opacity:0;transform:translateY(14px)}}@keyframes psMask{from{transform:translateY(108%)}}@keyframes psFade{from{opacity:0}}'
          + '.js .ps-meta{animation:psFade .9s var(--ez) backwards}.js .ps-hh::before{animation:psLine 1.4s var(--ez) .08s backwards}'
          + '.js .ps-h1 .wi{animation:psMask 1.1s var(--ez) backwards;animation-delay:calc(.18s + var(--i,0) * 70ms)}.js .ps-h1 sup{animation:psFade .9s var(--ez) .7s backwards}'
          + '.js .ps-sub{animation:psUp 1s var(--ez) .42s backwards}.js .ps-gi::before{animation:psLine 1.4s var(--ez) .3s backwards}'
          + '.js .ps-gc>*{animation:psUp .9s var(--ez) backwards;animation-delay:calc(.5s + var(--k,0) * 80ms)}.js .ps-hero>.ps-mq,.js .ps-hero>.ps-cue{animation:psFade 1.2s var(--ez) .8s backwards}'
          + 'body[data-still] .ps-hero *{animation:none!important}'
          + '@media(max-width:900px){.ps-hh{grid-template-columns:1fr;gap:18px}.ps-sub{justify-self:start;max-width:560px}.ps-gi{grid-template-columns:repeat(2,minmax(0,1fr))}.ps-gc+.ps-gc{border-left:0}.ps-gc:nth-child(even){border-left:1px solid var(--bd)}.ps-gc:nth-child(n+3){border-top:1px solid var(--bd)}}'
          + '@media(max-width:600px){.ps-hero{min-height:0;padding:84px 0 24px}.ps-hh{padding:26px 0 30px}.ps-h1.big{font-size:clamp(52px,16vw,76px)}.ps-gc{min-height:136px;padding:14px 14px 16px}.ps-gc-t{padding-top:20px;font-size:17px}.ps-gc-s{font-size:12px}.ps-gc-a{width:14px;height:14px}}'
          // ── 분야 섹션 머리: 굵은 선(긋기) → 머리글 줄(분야 · 개수) → 회색 번호 + 제목(단어마다 가림 틀에서 올라옴) | 소개 · 대표 성과 3칸(선 위 숫자, 숫자 올라가기)
          + '.ps-sec{width:var(--sw);margin:0 auto;padding-top:clamp(120px,17vh,180px)}.ps-sec:first-of-type{padding-top:56px}'
          + '.ps-tx{font-size:clamp(15px,1.15vw,17px);font-weight:500;line-height:1.7;letter-spacing:-.015em;color:var(--ink60);max-width:540px;text-wrap:pretty}'
          + '.ps-p{position:relative;display:block;width:100%;height:clamp(420px,76vh,780px);border-radius:36px;overflow:hidden;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 34%,#fff) 0%,var(--c) 100%);transform:scale(var(--ss,1));transform-origin:50% 0}'
          + '.ps-fan{position:absolute;left:50%;top:44%;width:min(46%,560px);aspect-ratio:4/3;transform:translate(-50%,-50%)}'
          + '.ps-f{position:absolute;inset:0;display:grid;place-items:center;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 40px 80px -40px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.04);transition:transform 1s var(--ez)}.ps-f img{position:relative;width:100%;height:100%;object-fit:contain}'
          + '.ps-f.img::before,.ps-th.img::before,.pd-m.img::before,.pd-next-m.img::before{content:"";position:absolute;inset:-12%;background:var(--img) center/cover;filter:blur(22px) saturate(1.1);opacity:.55}'
          + '.ps-f.art,.ps-th.art{background:color-mix(in srgb,var(--c) 26%,#fff)}.ps-f.art svg,.ps-th.art svg,.pd-m.art svg,.pd-next-m.art svg{width:92%;height:92%}'
          + '.ps-f.f1,.ps-f.f3{width:64%;height:64%;inset:auto;top:18%;opacity:.96}.ps-f.f1{left:-30%;transform:rotate(-8deg)}.ps-f.f3{right:-30%;transform:rotate(8deg)}.ps-f.f2{z-index:2}'
          + '.ps-p:hover .f1{transform:translateX(-14px) rotate(-10deg)}.ps-p:hover .f3{transform:translateX(14px) rotate(10deg)}.ps-p:hover .f2{transform:translateY(-6px)}'
          + '.ps-cap{position:absolute;left:36px;bottom:32px;max-width:min(560px,60%);display:flex;flex-direction:column;gap:4px;text-align:left}.ps-cap em{font-style:normal;font-size:12px;font-weight:600;letter-spacing:.05em;color:var(--ink60)}.ps-cap b{font-size:clamp(20px,2vw,26px);font-weight:600;line-height:1.3;letter-spacing:-.025em}.ps-cap small{font-size:13px;color:var(--ink60)}.ps-cap strong{color:var(--ink)}'
          + '.ps-go{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:var(--ink);color:#fff;font-size:13.5px;font-weight:600;white-space:nowrap}.ps-p>.ps-go{position:absolute;right:36px;bottom:34px;transition:transform .3s var(--ez)}.ps-p:hover>.ps-go{transform:translateX(3px)}'
          + '.ps-play{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:rgba(0,0,0,.45);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.8)}.ps-play::after{content:"";position:absolute;left:22px;top:18px;border-left:16px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent}'
          + '.ps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:44px 32px;margin-top:56px}.ps-c{display:flex;flex-direction:column;gap:12px;min-width:0}'
          + '.ps-th{position:relative;display:grid;place-items:center;aspect-ratio:16/10;border-radius:20px;overflow:hidden;background:#fff}.ps-th img{position:relative;width:100%;height:100%;object-fit:contain;transition:transform .8s var(--ez)}.ps-th svg{transition:transform .8s var(--ez)}.ps-c:hover .ps-th img,.ps-c:hover .ps-th svg{transform:scale(1.035)}'
          + '.ps-r1{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.ps-r1 b{font-size:15px;font-weight:600;line-height:1.4;letter-spacing:-.02em}.ps-r1 em{flex:none;font-style:normal;font-size:13px;color:var(--ink60)}.ps-r2{margin-top:-8px;font-size:13px;color:var(--gray)}.ps-r2 strong{color:var(--ink);font-weight:600}'
          + '.ps-end{width:var(--sw);margin:160px auto 0;padding:0 0 140px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}.ps-end p{font-family:var(--disp);font-size:clamp(24px,2.6vw,34px);letter-spacing:-.02em}'
          + '.ps-chips{position:fixed;left:50%;bottom:clamp(14px,2.6vh,26px);z-index:45;transform:translateX(-50%);display:flex;gap:2px;max-width:calc(100vw - 32px);padding:4px;border-radius:999px;overflow-x:auto;scrollbar-width:none;background:rgba(255,255,255,.76);-webkit-backdrop-filter:blur(16px) saturate(160%);backdrop-filter:blur(16px) saturate(160%);box-shadow:0 0 0 .5px var(--bd),0 10px 30px -14px rgba(0,0,0,.3);transition:opacity .3s,transform .3s}'
          + '.ps-chip{flex:none;height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;color:var(--ink60);white-space:nowrap;transition:background .25s,color .25s}.ps-chip i{font-style:normal;margin-left:5px;font-weight:500;opacity:.6}.ps-chip.on{background:var(--ink);color:#fff}body.pd-open .ps-chips{opacity:0;pointer-events:none;transform:translate(-50%,12px)}'
          // 상세(전체 화면)
          + '.pd{position:fixed;inset:0;z-index:100;overflow-y:auto;overscroll-behavior:contain;background:var(--bg);opacity:0;visibility:hidden;transform:translateY(40px);transition:opacity .5s var(--ez),transform .6s var(--ez),visibility 0s .6s}.pd.on{opacity:1;visibility:visible;transform:none;transition:opacity .5s var(--ez),transform .6s var(--ez)}body.pd-open{overflow:hidden}'
          + '.pd-ttl{font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gray)}.pd-top{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;width:var(--sw);margin:0 auto;padding:20px 0;background:linear-gradient(var(--bg) 60%,rgba(246,246,245,0))}.pd-no{font-size:12.5px;color:var(--gray);font-variant-numeric:tabular-nums;margin-right:12px}'
          + '.pd-x{display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:#fff;box-shadow:0 0 0 .5px var(--bd);font-size:13.5px;font-weight:600}.pd-x:hover{background:#f0f0ee}'
          + '.pd-main{width:var(--sw);margin:20px auto 0;display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:clamp(32px,7vw,120px);align-items:start}'
          + '.pd-stick{position:sticky;top:96px}.pd-cat{font-style:normal;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gray)}'
          + '.pd-side h1{margin-top:10px;font-size:clamp(24px,2.3vw,30px);font-weight:600;line-height:1.3;letter-spacing:-.03em;text-wrap:balance}.pd-desc{margin-top:16px;font-size:15px;line-height:1.75;color:var(--ink60)}'
          + '.pd-meta{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px;margin:26px 0 0}.pd-meta .wide{grid-column:1/-1}.pd-meta dt{font-size:12.5px;font-weight:600}.pd-meta dd{margin:4px 0 0;font-size:13.5px;line-height:1.55;color:var(--ink60)}'
          + '.pd-accs{margin-top:26px;border-top:1px solid var(--bd)}.pd-acc{border-bottom:1px solid var(--bd)}.pd-acc summary{list-style:none;display:flex;align-items:center;justify-content:space-between;padding:16px 0;font-size:14px;font-weight:600;cursor:pointer}.pd-acc summary::-webkit-details-marker{display:none}'
          + '.pd-acc summary i{position:relative;width:12px;height:12px}.pd-acc summary i::before,.pd-acc summary i::after{content:"";position:absolute;left:0;top:5px;width:12px;height:1.6px;background:var(--ink);transition:transform .3s var(--ez)}.pd-acc summary i::after{transform:rotate(90deg)}.pd-acc[open] summary i::after{transform:rotate(0)}.pd-acc p{padding:0 0 18px;font-size:14px;line-height:1.75;color:var(--ink60)}'
          + '.pd-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:22px}.pd-tags span{padding:5px 10px;border-radius:999px;background:#ebebe9;font-size:12px;color:var(--ink60)}.pd-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.pd-links a{display:inline-flex;align-items:center;height:36px;padding:0 14px;border-radius:999px;background:var(--ink);color:#fff;font-size:13px;font-weight:600}'
          + '.pd-flow{display:flex;flex-direction:column;gap:14px;min-width:0}.pd-p{position:relative;aspect-ratio:4/3;border-radius:28px;overflow:hidden;display:grid;place-items:center;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 30%,#fff),var(--c))}.pd-p.big{aspect-ratio:5/4}'
          + '.pd-m{position:relative;width:86%;height:82%;border-radius:18px;overflow:hidden;display:grid;place-items:center;box-shadow:0 40px 80px -40px rgba(0,0,0,.45)}.pd-m.art{width:92%;height:92%;box-shadow:none}.pd-m img{position:relative;width:100%;height:100%;object-fit:contain}.pd-m.yt{cursor:pointer}.pd-m iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
          + '.pd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px}.pd-kpis div{padding:22px;border-radius:24px;background:#ebebe9}.pd-kpis b{display:block;font-size:clamp(28px,3vw,38px);font-weight:700;letter-spacing:-.045em;line-height:1}.pd-kpis span{display:block;margin-top:8px;font-size:13px;color:var(--ink60)}'
          + '.pd-card{max-width:560px;padding:24px 26px;border-radius:24px;background:#ebebe9}.pd-card h3{font-size:14px;font-weight:600}.pd-card p{margin-top:8px;font-size:14px;line-height:1.75;color:var(--ink60)}'
          + '.pd-next{position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:24px;width:var(--sw);min-height:320px;margin:120px auto 100px;padding:40px 48px;border-radius:36px;overflow:hidden;background:linear-gradient(120deg,color-mix(in srgb,var(--c) 30%,#fff),var(--c))}'
          + '.pd-next-t{display:flex;flex-direction:column;gap:6px;align-items:flex-start}.pd-next-t small{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink60)}.pd-next-t b{font-family:var(--disp);font-weight:400;font-size:clamp(26px,3vw,40px);line-height:1.2;letter-spacing:-.02em}.pd-next-t em{font-style:normal;font-size:13.5px;color:var(--ink60)}.pd-next-t .ps-go{margin-top:14px}'
          + '.pd-next-m{position:relative;justify-self:end;width:min(100%,420px);aspect-ratio:4/3;border-radius:20px;overflow:hidden;display:grid;place-items:center;background:#fff;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);transition:transform .8s var(--ez)}.pd-next-m img{position:relative;width:100%;height:100%;object-fit:contain}.pd-next:hover .pd-next-m{transform:translateY(-6px) rotate(-1.5deg)}'
          + '.js .pd.on .pd-main>*{animation:psIn .9s var(--ez) backwards}.js .pd.on .pd-flow{animation-delay:.1s}'
          + '@media(max-width:900px){.ps-row{grid-template-columns:1fr;gap:14px;margin-bottom:28px}.ps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pd-main{grid-template-columns:1fr}.pd-stick{position:static}.pd-next{grid-template-columns:1fr;padding:32px 24px}.pd-next-m{justify-self:stretch;width:100%}}'
          + '@media(max-width:600px){:root{--sw:calc(100vw - 32px)}.ps-top{padding:14px 0}.ps-sec{padding-top:100px}.ps-p{height:min(74vh,600px);border-radius:26px}.ps-fan{width:80%;top:38%}.ps-f.f1,.ps-f.f3{display:none}.ps-cap{left:20px;right:20px;bottom:84px;max-width:none}.ps-p>.ps-go{left:20px;right:auto;bottom:22px}'
          + '.ps-grid{grid-template-columns:1fr;gap:34px;margin-top:40px}.pd-p{border-radius:22px}.pd-p,.pd-p.big{aspect-ratio:4/3.4}.pd-m{width:90%;height:84%}.pd-next{border-radius:26px;margin-bottom:90px}}'
          + '@supports (corner-shape:squircle){.ps-p,.ps-th,.ps-f,.pd-p,.pd-m,.pd-kpis div,.pd-card,.pd-next,.pd-next-m{corner-shape:squircle}.ps-p,.pd-next{border-radius:64px}.ps-th{border-radius:34px}.ps-f{border-radius:38px}.pd-p{border-radius:52px}.pd-m{border-radius:32px}.pd-kpis div,.pd-card{border-radius:44px}.pd-next-m{border-radius:36px}}'
          // 썸네일: 원래 비율 그대로 띄우기
          + '.ps-f.img,.pd-m.img,.pd-next-m.img{background:none!important;box-shadow:none!important;overflow:visible;border-radius:0}.ps-f.img::before,.ps-th.img::before,.pd-m.img::before,.pd-next-m.img::before{display:none}'
          + '.ps-th.img{background:color-mix(in srgb,var(--c) 30%,#fff);padding:7% 9%}.pd-next-m.img{padding:0}'
          + '.fl{display:block;max-width:100%;max-height:100%;width:auto!important;height:auto!important;object-fit:contain;border-radius:14px;box-shadow:0 26px 50px -26px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.05);background:#fff}'
          + '.ps-f .fl,.pd-m .fl{border-radius:18px;box-shadow:0 40px 80px -36px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.05)}'
          + '.ytf{position:relative;display:block;width:100%;max-height:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#111;box-shadow:0 26px 50px -26px rgba(0,0,0,.5)}.ytf img{position:absolute!important;inset:0;width:100%!important;height:100%!important;object-fit:cover;transform:scale(1.34)}.ps-f .ytf,.pd-m .ytf{border-radius:18px}'
          + '.ps-th.img.cover{padding:0}.ps-th.img.cover .fl{width:100%!important;height:100%!important;max-width:none;max-height:none;object-fit:cover;border-radius:0;box-shadow:none}'
          + '.ps-f.f1 .fl,.ps-f.f3 .fl,.ps-f.f1 .ytf,.ps-f.f3 .ytf{box-shadow:0 26px 50px -26px rgba(0,0,0,.4)}'
          // 어떤 비율이든 칸 안에 통째로: 가운데 절대 배치(칸 크기 기준 최대값)
          + '.img>.fl,.img>.ytf{position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%)}.ps-th.img{padding:0}.ps-th.img>.fl{max-width:84%;max-height:82%}.ps-th.img>.ytf{width:84%;max-height:82%}'
          + '.ps-f.img>.fl{max-width:100%;max-height:100%}.ps-f.img>.ytf{width:100%}.pd-m.img{position:absolute!important;inset:8% 7%;width:auto!important;height:auto!important}.pd-m.img>.fl{max-width:100%;max-height:100%}.pd-m.img>.ytf{width:100%;max-height:100%}.pd-next-m.img>.fl{max-width:100%;max-height:100%}.pd-next-m.img>.ytf{width:100%}'
          + '.ps-c:hover .ps-th .fl,.ps-c:hover .ps-th .ytf{transform:translate(-50%,-50%) scale(1.035)}.ps-c:hover .ps-th .ytf img{transform:scale(1.38)}.ps-th .fl,.ps-th .ytf{transition:transform .8s var(--ez)}'
          + '.ps-th.img.cover>.fl{inset:0;left:0;top:0;transform:none;width:100%!important;height:100%!important}.ps-c:hover .ps-th.cover .fl{transform:scale(1.035)}'
          // 인터랙션: 진행바 · 오로라 · 제목 단어 등장 · 커서 '보기' · 패널 3D 기울기·빛 · 스크롤 시차 · 카드 기울기 · 원형으로 열리는 상세 · 숫자 올라가기 · 분야 알약 · 배경 물들임 · 자석 버튼
          + '.ps-prog{position:fixed;left:0;right:0;top:0;height:2px;z-index:60;pointer-events:none}.ps-prog i{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(var(--p,0))}body.pd-open .ps-prog{opacity:0}'
          + 'body{background:color-mix(in srgb,var(--tint,var(--bg)) 16%,var(--bg));transition:background-color 1.2s var(--ez)}'
          + '.ps-p{perspective:1200px}.ps-fan{transform:translate(-50%,-50%) rotateX(calc(var(--ty,0) * -7deg)) rotateY(calc(var(--tx,0) * 9deg));transform-style:preserve-3d;transition:transform .6s var(--ez)}'
          + '.ps-f.f1{transform:translate3d(var(--h1,0px),calc(var(--pk,0) * 46px),0) rotate(var(--r1,-8deg))}.ps-f.f3{transform:translate3d(var(--h3,0px),calc(var(--pk,0) * -46px),0) rotate(var(--r3,8deg))}.ps-f.f2{transform:translate3d(0,calc(var(--pk,0) * -14px + var(--h2,0px)),40px)}'
          + '.ps-p:hover{--h1:-16px;--r1:-11deg;--h3:16px;--r3:11deg;--h2:-6px}.ps-p:hover .f1,.ps-p:hover .f2,.ps-p:hover .f3{transform:none}.ps-p:hover .ps-f.f1{transform:translate3d(var(--h1),calc(var(--pk,0) * 46px),0) rotate(var(--r1))}.ps-p:hover .ps-f.f3{transform:translate3d(var(--h3),calc(var(--pk,0) * -46px),0) rotate(var(--r3))}.ps-p:hover .ps-f.f2{transform:translate3d(0,calc(var(--pk,0) * -14px + var(--h2)),40px)}'
          + '.ps-p::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(600px circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.35),transparent 45%);opacity:0;transition:opacity .4s}.ps-p:hover::after{opacity:1}'
          + '.ps-c{transition:transform .5s var(--ez)}.ps-c:hover{transform:translateY(-6px)}.ps-th{transform:perspective(900px) rotateX(calc(var(--ty,0) * -6deg)) rotateY(calc(var(--tx,0) * 8deg));transition:transform .5s var(--ez),box-shadow .5s var(--ez)}.ps-c:hover .ps-th{box-shadow:0 30px 60px -34px rgba(0,0,0,.45)}'
          + '.ps-chips{isolation:isolate}.ps-chips .ps-chip.on{background:transparent}.ps-pill{position:absolute;left:0;top:4px;z-index:-1;height:34px;width:0;border-radius:999px;background:var(--ink);transform:translateX(var(--px,0));transition:transform .5s var(--ez),width .5s var(--ez);opacity:0}.ps-pill.on{opacity:1}'
          + '.pd{clip-path:circle(0% at var(--ox,50%) var(--oy,50%));transform:none;transition:clip-path .75s cubic-bezier(.7,0,.2,1),visibility 0s .75s;opacity:1}.pd.on{clip-path:circle(150% at var(--ox,50%) var(--oy,50%));transition:clip-path .9s cubic-bezier(.65,0,.15,1)}'
          + '.js .pd.on .pd-stick>*{animation:psIn .8s var(--ez) backwards;animation-delay:calc(.25s + var(--k,0) * 60ms)}.js .pd .pr{opacity:0;transform:translateY(34px) scale(.98);transition:opacity .9s var(--ez),transform 1s var(--ez)}.js .pd .pr.in{opacity:1;transform:none}'
          + '.pd-kpis div{transition:transform .4s var(--ez)}.pd-kpis div:hover{transform:translateY(-4px)}'
          + '.mag{transition:transform .35s var(--ez)}'
          + '@media(prefers-reduced-motion:reduce){.ps-hero *,.js .pd.on .pd-stick>*{animation:none!important}.pd,.pd.on{clip-path:none}.js .pd .pr{opacity:1;transform:none}.ps-fan{transform:translate(-50%,-50%)}}'
          + '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.js .rv{opacity:1;transform:none;filter:none;transition:none}.ps-p{transform:none}.pd,.pd.on{transition:none;transform:none}.js .pd.on .pd-main>*,.js .ps-hero>*{animation:none}}'
          + '.pd-prog{position:sticky;top:0;z-index:4;height:2px;margin-bottom:-2px}.pd-prog i{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(var(--pp,0))}'
          + '.pd-top{transition:padding .4s var(--ez),box-shadow .4s}.pd.sc .pd-top{padding:12px 0}.pd-top::after{content:"";position:absolute;left:50%;bottom:0;width:100vw;height:1px;transform:translateX(-50%);background:var(--bd);opacity:0;transition:opacity .4s}.pd.sc .pd-top::after{opacity:1}'
          + '.js .pd .pd-p.pr{opacity:0;transform:translateY(80px);clip-path:inset(10% 7% round 60px);transition:opacity 1s var(--ez),transform 1.2s var(--ez),clip-path 1.3s var(--ez)}'
          + '.js .pd .pd-p.pr.in{opacity:1;transform:none;clip-path:inset(0 round 28px)}'
          + '.js .pd .pd-p.pr .pd-m{scale:1.12;filter:blur(6px);transition:scale 1.6s var(--ez),filter 1s var(--ez)}.js .pd .pd-p.pr.in .pd-m{scale:1;filter:none}'
          + '.js .pd .pd-kpis.pr{opacity:1;transform:none}.js .pd .pd-kr>div{opacity:0;transform:translateY(40px) scale(.94);transition:opacity .8s var(--ez),transform 1s var(--ez)}.js .pd .pd-kpis.pr.in .pd-kr>div{opacity:1;transform:none}'
          + '.js .pd .pd-kpis.pr.in .pd-kr>div:nth-child(2){transition-delay:.1s}.js .pd .pd-kpis.pr.in .pd-kr>div:nth-child(3){transition-delay:.2s}.js .pd .pd-kpis.pr.in .pd-kr>div:nth-child(4){transition-delay:.3s}'
          + '.js .pd .pd-card.pr{opacity:0;transform:translateX(-40px);transition:opacity .9s var(--ez),transform 1.1s var(--ez)}.js .pd .pd-card.pr.in{opacity:1;transform:none}'
          + '.js .pd .pd-next.pr{opacity:0;transform:translateY(60px) scale(.94);transition:opacity 1s var(--ez),transform 1.2s var(--ez)}.js .pd .pd-next.pr.in{opacity:1;transform:none}.js .pd .pd-next.pr .pd-next-m{transform:translateY(40px) rotate(4deg);transition:transform 1.4s var(--ez) .15s}.js .pd .pd-next.pr.in .pd-next-m{transform:none}.js .pd .pd-next.pr.in:hover .pd-next-m{transform:translateY(-6px) rotate(-1.5deg)}'
          + '.ps-row{position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:end;column-gap:48px;row-gap:0;margin-bottom:clamp(40px,6vh,64px);padding-top:14px}'
          + '.ps-row::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ink);transform-origin:0 50%}'
          + '.ps-bar{grid-column:1/-1;align-self:start;display:flex;justify-content:space-between;align-items:baseline;gap:16px;font-size:12.5px;font-weight:500;color:var(--gray);font-variant-numeric:tabular-nums}.ps-bar b{font-weight:600;color:var(--ink)}'
          + '.ps-hd{min-width:0;padding-top:clamp(30px,4.6vh,52px)}'
          + '.ps-lb{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:.42em;align-items:baseline;font-family:var(--disp);font-weight:600;font-size:clamp(34px,3.8vw,60px);line-height:1.04;letter-spacing:-.045em;text-wrap:balance}'
          + '.ps-no{font-weight:500;color:var(--gray);letter-spacing:-.04em;font-variant-numeric:tabular-nums}.ft-editorial .ps-lb{font-weight:400;letter-spacing:-.03em}'
          + '.ps-lb .w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .06em .14em;margin:0 -.06em -.14em}.ps-lb .wi{display:inline-block}'
          + '.ps-rt{min-width:0;display:flex;flex-direction:column;gap:24px;padding-top:28px}'
          + '.ps-kfs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:20px}'
          + '.ps-kf{position:relative;display:flex;flex-direction:column;gap:6px;min-width:0;padding:14px 0 2px;text-align:left}'
          + '.ps-kf::before,.ps-kf::after{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--bd);transform-origin:0 50%}.ps-kf::after{background:var(--ink);transform:scaleX(0);transition:transform .55s var(--ez)}'
          + '.ps-kf:hover::after,.ps-kf:focus-visible::after{transform:none}.ps-kf:focus-visible{outline:none}'
          + '.ps-kf b{font-size:clamp(24px,2.1vw,34px);font-weight:600;line-height:1.05;letter-spacing:-.04em;white-space:nowrap;font-variant-numeric:tabular-nums}'
          + '.ps-kf span{font-size:12.5px;line-height:1.45;color:var(--ink60);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .3s}.ps-kf:hover span{color:var(--ink)}'
          // 섹션 머리 등장(화면에 들어오면 .on): 선 긋기 → 번호·제목 단어가 가림 틀에서 올라옴 → 소개 → 성과 칸(윗선 긋기 + 숫자 올라가기)
          + '.js .ps-row::before{transform:scaleX(0);transition:transform 1.4s var(--ez)}.js .ps-row.on::before{transform:none}'
          + '.js .ps-bar>*{opacity:0;transition:opacity .9s var(--ez) .3s}.js .ps-row.on .ps-bar>*{opacity:1}'
          + '.js .ps-lb .wi{transform:translateY(108%);transition:transform 1.15s var(--ez);transition-delay:calc(.12s + var(--i,0) * 65ms)}.js .ps-row.on .ps-lb .wi{transform:none}'
          + '.js .ps-row .ps-tx{opacity:0;transform:translateY(14px);transition:opacity .9s var(--ez) .4s,transform 1s var(--ez) .4s}.js .ps-row.on .ps-tx{opacity:1;transform:none}'
          + '.js .ps-kf{opacity:0;transform:translateY(14px);transition:opacity .8s var(--ez),transform .9s var(--ez);transition-delay:calc(.5s + var(--q,0) * 90ms)}.js .ps-row.on .ps-kf{opacity:1;transform:none}'
          + '.js .ps-kf::before{transform:scaleX(0);transition:transform 1.1s var(--ez);transition-delay:calc(.52s + var(--q,0) * 90ms)}.js .ps-row.on .ps-kf::before{transform:none}'
          + 'body[data-still] .ps-row::before,body[data-still] .ps-row *,body[data-still] .ps-row *::before{transition:none!important}'
          + '@media(prefers-reduced-motion:reduce){.js .ps-row::before,.js .ps-bar>*,.js .ps-lb .wi,.js .ps-row .ps-tx,.js .ps-kf,.js .ps-kf::before{opacity:1;transform:none;transition:none}}'
          + '@media(max-width:900px){.ps-row{grid-template-columns:1fr;margin-bottom:32px}.ps-hd{padding-top:26px}.ps-rt{padding-top:18px;gap:20px}.ps-lb{font-size:clamp(30px,7.6vw,44px)}}'
          + '@media(max-width:600px){.ps-kfs{column-gap:14px}.ps-kf b{font-size:22px}.ps-kf span{font-size:12px}}'
          + '.pd-side{align-self:stretch}@media(max-width:900px){.pd-side{align-self:auto}}'
          + '.pd-acc{transition:background .3s}.pd-acc[open] p{animation:psIn .6s var(--ez)}'
          + '@media(prefers-reduced-motion:reduce){.js .pd .pd-p.pr,.js .pd .pd-kr>div,.js .pd .pd-card.pr,.js .pd .pd-next.pr,.js .pd .pd-next.pr .pd-next-m,.js .pd .pd-p.pr .pd-m{opacity:1;transform:none;clip-path:none;scale:1;filter:none;transition:none}}'
          // ── 상세 오른쪽 · 모던 정리(덮어쓰기)
          + '.ps-mtx{display:flex;flex-direction:column;gap:1px;min-width:0}.ps-mtx small{font-size:11px;font-weight:600;letter-spacing:.02em;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ps-mtx b{font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
          + '.pd-flow{gap:28px}.pd-p{border-radius:24px;background:color-mix(in srgb,var(--c) 22%,#fff);box-shadow:inset 0 0 0 1px rgba(0,0,0,.04)}.pd-p.big{aspect-ratio:16/11}'
          + '.pd-h{font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gray);margin:0 0 14px}'
          + '.pd-kpis{display:block;padding:0}.pd-kr{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));border-top:1px solid var(--ink)}'
          + '.pd-kr>div{padding:18px 20px 4px 0;border-radius:0;background:none}.pd-kr>div+div{padding-left:20px;border-left:1px solid var(--bd)}'
          + '.pd-kr b{display:block;font-size:clamp(26px,2.6vw,34px);font-weight:600;letter-spacing:-.04em;line-height:1.05;font-variant-numeric:tabular-nums}.pd-kr span{display:block;margin-top:8px;font-size:12.5px;line-height:1.45;color:var(--ink60)}'
          + '.pd-kpis div:hover{transform:none}'
          + '.pd-kpis .pd-kr{padding:0;border-radius:0;background:none}.pd-x:focus{outline:none}.pd-x:focus-visible{outline:none;box-shadow:0 0 0 1px var(--ink)}'
          + '.pd-card{max-width:none;padding:22px 0 0;border-radius:0;background:none;border-top:1px solid var(--bd);display:grid;grid-template-columns:140px minmax(0,1fr);gap:20px}.pd-card .pd-h{margin:3px 0 0}.pd-card p{margin:0;font-size:15px;line-height:1.8;color:var(--ink)}'
          + '.pd-gal{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pd-gal.one{grid-template-columns:1fr}.pd-gal .pd-p{aspect-ratio:4/3.2;border-radius:20px}.pd-gal.one .pd-p{aspect-ratio:16/10}.pd-gal .pd-m.img{inset:9% 8%}'
          + '.pd-acc summary{padding:18px 0}.pd-acc summary i{width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--bd);flex:none;transition:background .3s,box-shadow .3s}'
          + '.pd-acc summary i::before,.pd-acc summary i::after{left:50%;top:50%;width:10px;height:1.4px;margin:-.7px 0 0 -5px;border-radius:2px;background:var(--ink)}.pd-acc summary i::after{transform:rotate(90deg)}.pd-acc[open] summary i::after{transform:rotate(0)}'
          + '.pd-acc summary:hover i{box-shadow:inset 0 0 0 1px var(--ink)}.pd-acc[open] summary i{background:var(--ink);box-shadow:none}.pd-acc[open] summary i::before,.pd-acc[open] summary i::after{background:#fff}'
          + '.js .pd .pd-card.pr{transform:translateY(24px)}'
          + '@media(max-width:900px){.pd-card{grid-template-columns:1fr;gap:8px}.pd-kr{grid-template-columns:1fr 1fr}.pd-kr>div:nth-child(3){padding-left:0;border-left:0}.pd-kr>div:nth-child(n+3){border-top:1px solid var(--bd)}}'
          + '@media(max-width:600px){.pd-gal{grid-template-columns:1fr}}'
          // ── 상세: 이미지 한 영역(슬라이드) · 한 화면 · 다음 프로젝트 컴팩트
          + '.pd-main{margin-top:8px;gap:clamp(28px,5vw,80px)}.pd-stick{top:84px}.pd-flow{gap:22px}'
          + '.pd-vw{position:relative;aspect-ratio:auto;height:min(54vh,calc((min(1344px,100vw - 48px) - 400px) * .6));min-height:300px;display:block;overflow:hidden}'
          + '.pd-vs{position:absolute;inset:0}.pd-sl{position:absolute;inset:0;opacity:0;transform:translateX(calc(var(--dx,1) * 36px)) scale(.98);transition:opacity .55s var(--ez),transform .7s var(--ez);pointer-events:none}.pd-sl.on{opacity:1;transform:none;pointer-events:auto}'
          + '.pd-vw .pd-m.img{inset:7% 8%}'
          + '.pd-nav{position:absolute;top:50%;z-index:3;width:42px;height:42px;margin-top:-21px;border-radius:50%;background:rgba(255,255,255,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 0 0 .5px var(--bd),0 8px 20px -10px rgba(0,0,0,.35);font-size:22px;line-height:40px;text-align:center;opacity:0;transition:opacity .3s,transform .3s var(--ez)}'
          + '.pd-nav.prv{left:14px}.pd-nav.nxt{right:14px}.pd-vw:hover .pd-nav,.pd-nav:focus-visible{opacity:1}.pd-nav:hover{transform:scale(1.06)}@media(hover:none){.pd-nav{opacity:1}}'
          + '.pd-cnt{position:absolute;right:14px;bottom:12px;z-index:3;padding:4px 10px;border-radius:999px;background:rgba(29,29,31,.72);color:#fff;font-size:12px;font-variant-numeric:tabular-nums}.pd-cnt b{font-weight:600}'
          + '.pd-thr{display:flex;gap:8px;margin-top:-10px;overflow-x:auto;scrollbar-width:none;padding:2px}.pd-thr::-webkit-scrollbar{display:none}'
          + '.pd-tb{position:relative;flex:none;width:64px;height:46px;border-radius:10px;background:#ebebe9 center/cover;opacity:.55;box-shadow:0 0 0 1px var(--bd);transition:opacity .25s,box-shadow .25s,transform .3s var(--ez)}.pd-tb:hover{opacity:.85}.pd-tb.on{opacity:1;box-shadow:0 0 0 2px var(--ink)}'
          + '.pd-tb.yt::after{content:"";position:absolute;left:50%;top:50%;margin:-6px 0 0 -4px;border-left:10px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}'
          + '.pd-kr>div{padding-top:14px}.pd-kr b{font-size:clamp(22px,2.2vw,30px)}.pd-card{padding-top:16px}.pd-card p{font-size:14px;line-height:1.7}'
          + '.pd-next{display:flex;align-items:center;gap:18px;min-height:0;margin:56px auto 64px;padding:14px 22px 14px 14px;border-radius:22px;background:color-mix(in srgb,var(--c) 26%,#fff);box-shadow:inset 0 0 0 1px rgba(0,0,0,.04);transition:background .3s,transform .4s var(--ez)}'
          + '.pd-next:hover{background:color-mix(in srgb,var(--c) 42%,#fff);transform:translateY(-2px)}'
          + '.pd-next .pd-next-m{order:-1;flex:none;justify-self:auto;width:120px;aspect-ratio:4/3;border-radius:14px;box-shadow:none;background:#fff}.pd-next:hover .pd-next-m{transform:none}'
          + '.pd-next-t{flex:1;min-width:0;flex-direction:row;flex-wrap:wrap;align-items:baseline;column-gap:14px;row-gap:2px}.pd-next-t small{flex-basis:100%;font-size:11px}.pd-next-t b{font-family:var(--font);font-weight:600;font-size:clamp(17px,1.6vw,21px);letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.pd-next-t em{font-size:12.5px}'
          + '.pd-next-t .ps-go{margin:0 0 0 auto;height:38px;padding:0 16px;font-size:13px;order:3}'
          + '.js .pd .pd-next.pr{transform:translateY(24px)}.js .pd .pd-next.pr .pd-next-m{transform:none}'
          + '@media(max-width:900px){.pd-vw{height:min(46vh,62vw)}.pd-next{margin:40px auto 56px}}'
          + '@media(max-width:600px){.pd-next{padding:12px}.pd-next .pd-next-m{width:84px}.pd-next-t .ps-go{display:none}.pd-thr{margin-top:-8px}.pd-tb{width:54px;height:40px}}'
          // ── 확대 보기(라이트박스) · 다음 프로젝트 컴팩트 카드
          + '.pd-vw .pd-sl .pd-m.img:not(.yt){cursor:zoom-in}.pd-vw .pd-sl .pd-m.img:not(.yt) .fl{transition:transform .5s var(--ez)}.pd-vw:hover .pd-sl.on .pd-m.img:not(.yt) .fl{transform:translate(-50%,-50%) scale(1.02)}'
          + '.pd-zh{position:absolute;left:14px;top:12px;z-index:3;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.88);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 0 0 .5px var(--bd);font-size:11.5px;font-weight:600;opacity:0;transform:translateY(-4px);transition:opacity .3s,transform .3s var(--ez);pointer-events:none}.pd-vw:hover .pd-zh{opacity:1;transform:none}@media(hover:none){.pd-zh{opacity:1;transform:none}}'
          + '.lb{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:rgba(18,18,20,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:opacity .35s var(--ez),visibility 0s .35s}.lb.on{opacity:1;visibility:visible;transition:opacity .35s var(--ez)}'
          + '.lb-st{position:relative;width:min(92vw,1600px);height:84vh;overflow:hidden;display:grid;place-items:center;transform:scale(.92);transition:transform .5s var(--ez)}.lb.on .lb-st{transform:none}'
          + '.lb-img{max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 30px 80px -30px rgba(0,0,0,.7);cursor:zoom-in;transition:transform .45s var(--ez),opacity .3s;user-select:none;-webkit-user-drag:none}.lb-img.sw{opacity:0}'
          + '.lb.z .lb-img{transform:scale(2.2);cursor:zoom-out;transition:transform .45s var(--ez),transform-origin .12s linear}'
          + '.lb-b{position:absolute;z-index:2;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:24px;line-height:46px;text-align:center;transition:background .25s,transform .25s var(--ez)}.lb-b:hover{background:rgba(255,255,255,.24);transform:scale(1.06)}'
          + '.lb-x{right:20px;top:20px;font-size:18px}.lb-p{left:20px;top:50%;margin-top:-24px}.lb-n{right:20px;top:50%;margin-top:-24px}.lb.one .lb-p,.lb.one .lb-n,.lb.one .lb-c{display:none}'
          + '.lb-c{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:12.5px;font-variant-numeric:tabular-nums}.lb-t{position:absolute;left:24px;top:28px;max-width:60vw;color:rgba(255,255,255,.75);font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
          + '@media(max-width:600px){.lb-st{width:100vw;height:78vh}.lb-img{border-radius:0}.lb-p,.lb-n{top:auto;bottom:14px;margin:0}.lb-t{display:none}}'
          + '@media(prefers-reduced-motion:reduce){.lb,.lb-st,.lb-img{transition:none}}'
          + '.pd-next{width:min(460px,var(--sw));margin:28px calc((100% - var(--sw)) / 2) 56px auto;padding:10px 10px 10px 10px;gap:14px;border-radius:18px}'
          + '.pd-next .pd-next-m{width:84px;height:64px;aspect-ratio:auto;border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06);overflow:hidden}'
          + '.pd-next .pd-next-m.img>.fl{position:absolute!important;inset:0;left:0;top:0;transform:none;width:100%!important;height:100%!important;max-width:none;max-height:none;object-fit:cover;border-radius:0;box-shadow:none}'
          + '.pd-next .pd-next-m.img>.ytf{inset:0;left:0;top:0;transform:none;width:100%;height:100%;max-height:none;aspect-ratio:auto;border-radius:0;box-shadow:none}.pd-next .pd-next-m.art svg{width:100%;height:100%}'
          + '.pd-next-t{display:flex;flex-direction:column;align-items:flex-start;gap:2px}.pd-next-t small{flex-basis:auto;font-size:10.5px}.pd-next-t b{font-size:15.5px;line-height:1.3}.pd-next-t em{font-size:12px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
          + '.pd-next-a{flex:none;width:36px;height:36px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:15px;transition:transform .35s var(--ez)}.pd-next:hover .pd-next-a{transform:translateX(3px)}'
          + '@media(max-width:600px){.pd-next{width:var(--sw);margin:24px auto 48px}.pd-next .pd-next-m{width:72px;height:56px}}'
          + '.ps-f.f1{transform:translate3d(calc(var(--h1,0px) + (1 - var(--rp,1)) * 38%),calc(var(--pk,0) * 46px),0) rotate(calc(var(--r1,-8deg) * var(--rp,1)))}.ps-f.f3{transform:translate3d(calc(var(--h3,0px) - (1 - var(--rp,1)) * 38%),calc(var(--pk,0) * -46px),0) rotate(calc(var(--r3,8deg) * var(--rp,1)))}';
        var psRuntime = function () {
          "use strict";
          var body = document.body, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, studio = body.getAttribute("data-host") === "studio";
          var pd = document.querySelector(".pd"), pin = document.querySelector(".pd-in"), pno = document.querySelector(".pd-no");
          var order = [].slice.call(document.querySelectorAll("template[data-id]")), cur = -1, opener = null;
          var post = function (m) { try { if (window.parent && window.parent !== window) window.parent.postMessage(m, "*"); } catch (e) {} };
          var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" }) : null;
          [].slice.call(document.querySelectorAll(".ps-c")).forEach(function (el, k) { el.style.setProperty("--d", (k % 3 * 90) + "ms"); });
          [].slice.call(document.querySelectorAll(".rv")).forEach(function (el) { if (io && !body.hasAttribute("data-still")) io.observe(el); else el.classList.add("in"); });
          var pans = [].slice.call(document.querySelectorAll(".ps-p")), secs = [].slice.call(document.querySelectorAll(".ps-sec")), chips = [].slice.call(document.querySelectorAll(".ps-chip"));
          var prog = document.querySelector(".ps-prog"), pill = document.querySelector(".ps-pill"), still = body.hasAttribute("data-still"), fine = matchMedia("(hover: hover) and (pointer: fine)").matches, lastG = null;
          // 제목 단어 나누기: 가림 틀(.w) 안의 .wi가 아래에서 올라옴(강조·줄바꿈 유지, 개수 첨자 제외)
          var h1 = document.querySelector(".ps-h1"), wi = 0;
          if (h1 && !reduce && !body.hasAttribute("data-still")) (function split(n) { [].slice.call(n.childNodes).forEach(function (c) { if (c.nodeType === 3) { var f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(function (t) { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(t)); else { var sp = document.createElement("span"), si = document.createElement("span"); sp.className = "w"; si.className = "wi"; si.style.setProperty("--i", wi++); si.textContent = t; sp.appendChild(si); f.appendChild(sp); } }); n.replaceChild(f, c); } else if (c.nodeType === 1 && c.tagName !== "BR" && c.tagName !== "SUP") split(c); }); })(h1);
          var tick = function () {
            var vh = innerHeight, de = document.documentElement;
            if (prog) prog.style.setProperty("--p", Math.max(0, Math.min(1, scrollY / Math.max(1, de.scrollHeight - vh))).toFixed(4));
            if (!reduce) pans.forEach(function (p) { var r = p.getBoundingClientRect(); p.style.setProperty("--pk", Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh)).toFixed(3)); });
            if (!reduce) pans.forEach(function (p) { var r = p.getBoundingClientRect(), k = Math.max(0, Math.min(1, (vh - r.top) / (vh * .8))); p.style.setProperty("--ss", (0.92 + 0.08 * k).toFixed(4)); });
            var on = ""; secs.forEach(function (s) { if (s.getBoundingClientRect().top < vh * .5) on = s.getAttribute("data-g"); });
            chips.forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-goto") === on); });
            if (pill) { var ac = chips.filter(function (c) { return c.classList.contains("on"); })[0]; if (ac) { pill.style.width = ac.offsetWidth + "px"; pill.style.setProperty("--px", ac.offsetLeft + "px"); pill.classList.add("on"); } else pill.classList.remove("on"); }
            if (on !== lastG) { lastG = on; var sc = on && document.getElementById("g-" + on); body.style.setProperty("--tint", sc ? sc.getAttribute("data-c") : "var(--bg)"); }
          };
          var topB = document.querySelector(".ps-top-b"), pvs = [].slice.call(document.querySelectorAll(".ps-ipi")), pvOn = null;
          var showPv = function (i) { if (pvOn === i) return; pvOn = i; pvs.forEach(function (x) { x.classList.toggle("on", x.getAttribute("data-pvi") === i); }); };
          var firstRow = document.querySelector(".ps-ir"); if (firstRow) showPv(firstRow.getAttribute("data-pv"));
          document.addEventListener("pointerover", function (e) { var r = e.target.closest && e.target.closest(".ps-ir"); if (r) showPv(r.getAttribute("data-pv")); }, { passive: true });
          document.addEventListener("focusin", function (e) { var r = e.target.closest && e.target.closest(".ps-ir"); if (r) showPv(r.getAttribute("data-pv")); });
          var hero = document.querySelector(".ps-hero"), rows = [].slice.call(document.querySelectorAll(".ps-row")), cards = [].slice.call(document.querySelectorAll(".ps-grid .ps-c")), endP = document.querySelector(".ps-end"), mq = document.querySelector(".ps-mq");
          var lastY = scrollY, vel = 0, clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
          // 섹션 머리: 화면 아래 18% 선을 넘으면 한 번 .on(선 긋기 · 제목 올라옴 · 성과 칸) + 두 자리 이상 숫자는 0부터 올라감
          var rowOn = function (r) { r.classList.add("on"); setTimeout(function () { [].slice.call(r.querySelectorAll(".ps-kf b")).forEach(function (b) { if (parseFloat(String(b.textContent).replace(/[^\d.]/g, "")) >= 10) count(b); }); }, 480); };
          var rio = "IntersectionObserver" in window && !reduce && !still ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { rowOn(en.target); rio.unobserve(en.target); } }); }, { rootMargin: "0px 0px -18% 0px" }) : null;
          rows.forEach(function (r) { if (rio) rio.observe(r); else r.classList.add("on"); });
          var motion = function () {
            if (reduce || still) return;
            var vh = innerHeight, y = scrollY;
            body.style.setProperty("--hp", clamp01(y / (vh * .9)).toFixed(3));
            vel = vel * .82 + (y - lastY) * .18; lastY = y;
            if (mq) { mq.style.setProperty("--sk", Math.max(-8, Math.min(8, -vel * .12)).toFixed(2)); mq.style.setProperty("--sa", Math.min(30, Math.abs(vel) * .5).toFixed(1)); }
            pans.forEach(function (pn) { var t = pn.getBoundingClientRect().top; pn.style.setProperty("--rp", clamp01((vh - t) / (vh * .7)).toFixed(3)); });
            if (endP) { var et = endP.getBoundingClientRect().top; endP.style.setProperty("--ep", clamp01((vh - et) / (vh * .6)).toFixed(3)); }
          };
          (function loop() { motion(); if (Math.abs(vel) > .05) requestAnimationFrame(loop); else vel = 0; })();
          addEventListener("scroll", function () { [].slice.call(document.querySelectorAll(".ps-th")).forEach(function (el) { if (el.style.getPropertyValue("--tx")) { el.style.setProperty("--tx", 0); el.style.setProperty("--ty", 0); } }); if (!loopOn) { loopOn = true; requestAnimationFrame(function run() { motion(); if (Math.abs(vel) > .05 || Math.abs(scrollY - lastY) > .5) requestAnimationFrame(run); else { vel = 0; motion(); loopOn = false; } }); } }, { passive: true });
          var loopOn = false;
          var tick0 = tick; tick = function () { tick0(); if (topB) topB.classList.toggle("on", scrollY > innerHeight * 1.2); body.classList.toggle("at-hero", scrollY < innerHeight * .55); };
          addEventListener("scroll", tick, { passive: true }); addEventListener("resize", tick); tick();
          // 포인터: 오로라 따라오기 · 패널/카드 기울기 · 빛 · 자석 버튼
          var aura = document.querySelector(".ps-aura");
          if (fine && !reduce && !still) {
            document.addEventListener("pointermove", function (e) {
              if (aura) { aura.style.setProperty("--mx", (e.clientX / innerWidth - .5).toFixed(3)); aura.style.setProperty("--my", (e.clientY / innerHeight - .5).toFixed(3)); }
              var t = e.target;
              var p = t.closest && t.closest(".ps-p"), c = t.closest && t.closest(".ps-c"), el = p ? p.querySelector(".ps-fan") : c ? c.querySelector(".ps-th") : null, box = p || c;
              if (el) { var r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.setProperty("--tx", x.toFixed(3)); el.style.setProperty("--ty", y.toFixed(3)); if (p) { p.style.setProperty("--gx", ((x + .5) * 100).toFixed(1) + "%"); p.style.setProperty("--gy", ((y + .5) * 100).toFixed(1) + "%"); } }
              var m = t.closest && t.closest(".ps-go,.pd-x,.ps-back");
              [].slice.call(document.querySelectorAll(".mag")).forEach(function (g) { if (g !== m) { g.style.transform = ""; g.classList.remove("mag"); } });
              if (m) { var mr = m.getBoundingClientRect(); m.classList.add("mag"); m.style.transform = "translate(" + ((e.clientX - mr.left - mr.width / 2) * .22).toFixed(1) + "px," + ((e.clientY - mr.top - mr.height / 2) * .3).toFixed(1) + "px)"; }
            }, { passive: true });
            document.addEventListener("pointerout", function (e) { var b = e.target.closest && e.target.closest(".ps-p,.ps-c"); if (b && !b.contains(e.relatedTarget)) { var el = b.querySelector(".ps-fan,.ps-th"); if (el) { el.style.setProperty("--tx", 0); el.style.setProperty("--ty", 0); } } }, { passive: true });
          }
          // 상세 안: 패널 등장 · 숫자 올라가기
          var pio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); pio.unobserve(en.target); } }); }, { root: pd, rootMargin: "0px 0px -6% 0px" }) : null;
          var count = function (b) {
            var m = String(b.textContent).match(/^([^\d]*)([\d][\d,]*\.?\d*)(.*)$/); if (!m || reduce) return;
            var raw = m[2], comma = raw.indexOf(",") >= 0, dec = (raw.split(".")[1] || "").length, to = parseFloat(raw.replace(/,/g, "")), t0 = 0;
            var fmtN = function (v) { var s = v.toFixed(dec); if (comma) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); return m[1] + s + m[3]; };
            var st = function (ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1300), e = 1 - Math.pow(1 - k, 3); b.textContent = fmtN(to * e); if (k < 1) requestAnimationFrame(st); };
            b.textContent = fmtN(0); requestAnimationFrame(st);
          };
          var enhance = function () {
            [].slice.call(pin.querySelectorAll(".pd-stick>*")).forEach(function (x, k) { x.style.setProperty("--k", k); });
            [].slice.call(pin.querySelectorAll(".pr,.pd-kpis,.pd-card,.pd-next,.pd-gal .pd-p")).forEach(function (x) { x.classList.add("pr"); if (pio && !reduce) pio.observe(x); else x.classList.add("in"); });
            setTimeout(function () { [].slice.call(pin.querySelectorAll(".pd-kr b")).forEach(count); }, 350);
          };
          var pprog = document.querySelector(".pd-prog");
          pd.addEventListener("scroll", function () { var mx = Math.max(1, pd.scrollHeight - pd.clientHeight); if (pprog) pprog.style.setProperty("--pp", Math.min(1, pd.scrollTop / mx).toFixed(4)); pd.classList.toggle("sc", pd.scrollTop > 40); }, { passive: true });
          var vgo = function (vw, k) {
            var sl = [].slice.call(vw.querySelectorAll(".pd-sl")), n = sl.length, cur0 = +vw.getAttribute("data-k") || 0; if (n < 2) return;
            k = (k % n + n) % n; if (k === cur0) return; var dir = k > cur0 ? 1 : -1;
            sl.forEach(function (x, j) { x.style.setProperty("--dx", j === k ? dir : -dir); x.classList.toggle("on", j === k); if (j !== k) { var f = x.querySelector("iframe"); if (f) f.remove(); } });
            vw.setAttribute("data-k", k); var c = vw.querySelector(".pd-cnt b"); if (c) c.textContent = k + 1;
            [].slice.call(pin.querySelectorAll(".pd-tb")).forEach(function (x, j) { x.classList.toggle("on", j === k); if (j === k && x.scrollIntoView) try { x.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) {} });
          };
          var lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "이미지 크게 보기");
          lb.innerHTML = '<span class="lb-t"></span><div class="lb-st"><img class="lb-img" alt=""></div><button class="lb-b lb-x" type="button" aria-label="닫기">✕</button><button class="lb-b lb-p" type="button" aria-label="이전">‹</button><button class="lb-b lb-n" type="button" aria-label="다음">›</button><span class="lb-c"></span>';
          document.body.appendChild(lb);
          var lbImg = lb.querySelector(".lb-img"), lbSrc = [], lbK = 0, lbVw = null;
          var lbShow = function (k, anim) {
            var n = lbSrc.length; lbK = (k % n + n) % n; lb.classList.remove("z");
            var set = function () { lbImg.src = lbSrc[lbK].src; lbImg.alt = lbSrc[lbK].alt; lbImg.classList.remove("sw"); };
            if (anim) { lbImg.classList.add("sw"); setTimeout(set, 160); } else set();
            lb.querySelector(".lb-c").textContent = (lbK + 1) + " / " + n;
            if (lbVw) vgo(lbVw, lbSrc[lbK].k);
          };
          var lbOpen = function (vw, k) {
            lbVw = vw; lbSrc = [];
            [].slice.call(vw.querySelectorAll(".pd-sl")).forEach(function (sl, j) { var im = sl.querySelector(".pd-m.img:not(.yt) img"); if (im) lbSrc.push({ src: im.getAttribute("src"), alt: im.getAttribute("alt") || "", k: j }); });
            if (!lbSrc.length) return; var start = 0; lbSrc.forEach(function (x, j) { if (x.k === k) start = j; });
            var h1 = pin.querySelector(".pd-side h1"); lb.querySelector(".lb-t").textContent = h1 ? h1.textContent : "";
            lb.classList.toggle("one", lbSrc.length < 2); lbShow(start, false); lb.classList.add("on");
          };
          var lbClose = function () { lb.classList.remove("on", "z"); };
          lb.addEventListener("click", function (e) {
            var t = e.target;
            if (t.closest(".lb-x")) return lbClose();
            if (t.closest(".lb-p")) return lbShow(lbK - 1, true);
            if (t.closest(".lb-n")) return lbShow(lbK + 1, true);
            if (t === lbImg) { if (!lb.classList.contains("z")) { var r = lbImg.getBoundingClientRect(); lbImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100).toFixed(1) + "% " + ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%"; } lb.classList.toggle("z"); return; }
            if (!t.closest(".lb-b")) lbClose();
          });
          lb.addEventListener("pointermove", function (e) { if (!lb.classList.contains("z")) return; var r = lb.querySelector(".lb-st").getBoundingClientRect(); lbImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100).toFixed(1) + "% " + ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%"; });
          var lx = null; lb.addEventListener("pointerdown", function (e) { lx = e.clientX; }); lb.addEventListener("pointerup", function (e) { if (lx == null || lb.classList.contains("z")) return; var dx = e.clientX - lx; lx = null; if (Math.abs(dx) > 50 && lbSrc.length > 1) lbShow(lbK + (dx < 0 ? 1 : -1), true); });
          document.addEventListener("keydown", function (e) {
            if (!lb.classList.contains("on")) return;
            e.stopImmediatePropagation();
            if (e.key === "Escape") lbClose(); else if (e.key === "ArrowRight") lbShow(lbK + 1, true); else if (e.key === "ArrowLeft") lbShow(lbK - 1, true);
          }, true);
          var sx = null, swipeDx = 0;
          pd.addEventListener("pointerdown", function (e) { if (e.target.closest && e.target.closest(".pd-vw") && !e.target.closest(".pd-nav")) sx = e.clientX; }, { passive: true });
          pd.addEventListener("pointerup", function (e) { if (sx == null) return; var dx = e.clientX - sx; sx = null; swipeDx = dx; setTimeout(function () { swipeDx = 0; }, 0); var vw = pin.querySelector(".pd-vw"); if (vw && Math.abs(dx) > 40) vgo(vw, (+vw.getAttribute("data-k") || 0) + (dx < 0 ? 1 : -1)); }, { passive: true });
          var origin = function (e) { var x = e && e.clientX != null ? e.clientX : innerWidth / 2, y = e && e.clientY != null ? e.clientY : innerHeight / 2; pd.style.setProperty("--ox", x + "px"); pd.style.setProperty("--oy", y + "px"); };
          var pad = function (n) { return (n < 10 ? "0" : "") + n; };
          function open(i, keep) {
            var k = -1; for (var j = 0; j < order.length; j++) if (order[j].getAttribute("data-i") === String(i)) k = j;
            if (k < 0) return; cur = k;
            if (!keep && !pd.classList.contains("on")) opener = document.activeElement;
            pin.innerHTML = order[k].innerHTML; pd.scrollTop = 0; pd.classList.remove("sc"); if (pprog) pprog.style.setProperty("--pp", 0); if (pno) pno.textContent = pad(k + 1) + " / " + pad(order.length);
            pd.classList.add("on"); pd.setAttribute("aria-hidden", "false"); body.classList.add("pd-open"); enhance();
            var x = pd.querySelector(".pd-x"); if (x && !keep) try { x.focus({ preventScroll: true }); } catch (e) {}
            post({ klio: "card", id: order[k].getAttribute("data-id") });
          }
          function close() {
            if (!pd.classList.contains("on")) return;
            pd.classList.remove("on"); pd.setAttribute("aria-hidden", "true"); body.classList.remove("pd-open"); cur = -1; if (typeof lbClose === "function") lbClose();
            post({ klio: "card-close" }); post({ klio: "card", id: "" });
            if (opener && opener.focus) try { opener.focus({ preventScroll: true }); } catch (e) {}
            setTimeout(function () { if (!pd.classList.contains("on")) pin.innerHTML = ""; }, 600);
          }
          document.addEventListener("click", function (e) {
            var t = e.target, b;
            if ((b = t.closest("[data-open]"))) { e.preventDefault(); if (!pd.classList.contains("on")) origin(e); open(b.getAttribute("data-open"), pd.classList.contains("on")); return; }
            if ((b = t.closest("[data-close]"))) { origin(opener && opener.getBoundingClientRect ? (function (r) { return { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }; })(opener.getBoundingClientRect()) : null); close(); return; }
            if ((b = t.closest("[data-if]"))) { var fg = b.getAttribute("data-if"); [].slice.call(document.querySelectorAll(".ps-if-b")).forEach(function (x) { x.classList.toggle("on", x === b); }); var vis = null; [].slice.call(document.querySelectorAll(".ps-ir")).forEach(function (r) { var ok = fg === "*" || r.getAttribute("data-ig") === fg; r.parentNode.classList.toggle("hid", !ok); if (ok && !vis) vis = r; }); if (vis) showPv(vis.getAttribute("data-pv")); return; }
            if ((b = t.closest("[data-goto]"))) { var g = b.getAttribute("data-goto"), s = g === "*" ? null : document.getElementById("g-" + g); if (s) s.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); else scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return; }
            if ((b = t.closest(".pd-vw .pd-sl .pd-m.img")) && !b.classList.contains("yt") && Math.abs(swipeDx) < 8) { var vw0 = b.closest(".pd-vw"); lbOpen(vw0, +b.closest(".pd-sl").getAttribute("data-k")); return; }
            if ((b = t.closest("[data-vw]")) || (b = t.closest("[data-vk]"))) { var vw = pin.querySelector(".pd-vw"); if (vw) vgo(vw, b.hasAttribute("data-vk") ? +b.getAttribute("data-vk") : (+vw.getAttribute("data-k") || 0) + +b.getAttribute("data-vw")); return; }
            if ((b = t.closest(".pd-m.yt")) && !b.querySelector("iframe")) { var f = document.createElement("iframe"); f.src = "https://www.youtube-nocookie.com/embed/" + b.getAttribute("data-yt") + "?autoplay=1&rel=0"; f.allow = "autoplay; encrypted-media; picture-in-picture"; f.allowFullscreen = true; b.appendChild(f); return; }
            if (studio && (b = t.closest("a.ps-back"))) { e.preventDefault(); post({ klio: "pp-back" }); return; }
          });
          document.addEventListener("keydown", function (e) {
            if (!pd.classList.contains("on")) return;
            if (e.key === "Escape") close();
            else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !/input|textarea/i.test((e.target || {}).tagName || "")) { var n = (cur + (e.key === "ArrowRight" ? 1 : -1) + order.length) % order.length; open(order[n].getAttribute("data-i"), true); }
            else if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("yt")) { e.preventDefault(); e.target.click(); }
          });
          addEventListener("message", function (e) { var m = e.data; if (!m || m.klio !== "goto-card" || typeof m.id !== "string") return; for (var j = 0; j < order.length; j++) if (order[j].getAttribute("data-id") === m.id) { open(order[j].getAttribute("data-i"), false); return; } });
        };
        pdT = pdT.replace(/<template id="pd-(\d+)">/g, function (_, n) { var it = items.filter(function (q) { return String(q.i) === n; })[0]; return '<template id="pd-' + n + '" data-i="' + n + '" data-id="' + esc(it ? (it.w.id || String(it.i)) : n) + '">'; });
        // ── 테스트 페이지(/{slug}/projects-test · /{slug}/projects/test) — 토스플레이스식 구성 실험 (기존 /projects는 그대로)
        //    첫 화면(움직이는 썸네일 벽 · 문장) → 덱: '한눈에' 장 → 묶음마다 한 장(PPT 장처럼 둥근 카드, 보통 스크롤) → 연락
        //    카드 상세는 위 스크롤형의 전체 화면 상세(pdT · psRuntime) 그대로
        var tossPage = function () {
          var ea = function (s) { return esc(s).replace(/"/g, "&quot;"); };
          var score = function (it) { return (it.main ? 3 : 0) + Math.min(it.mets.length, 3) + ((it.sum || it.w.summary) ? .5 : 0); };
          var byScore = function (a, b) { return score(b) - score(a) || a.i - b.i; };
          // ── 프로젝트 분류(이 페이지 전용 · KILO 대시보드의 묶음 데이터와 기존 /projects는 그대로): 4가지 — AX / 퍼포먼스(지금) · 퍼포먼스 / CRM · 데이터 / 택소노미 · 콘텐츠 / 캠페인
          //    AX / 퍼포먼스 = 지금 다니는(가장 최근) 회사에서 한 일 전부 + AX. 나머지: 성과 → 데이터 / 택소노미 · 제목 '소재'·퍼포먼스·그로스·CRM → 퍼포먼스 / CRM · 콘텐츠·영상·브랜딩·커머스·제휴 → 콘텐츠 / 캠페인
          var coEnd = function (co) { return co.endDate ? String(co.endDate) : "9999-99"; };
          var nowCo = items.map(function (it) { return it.co; }).filter(function (co, k, a) { return co && a.indexOf(co) === k; })
            .sort(function (a, b) { return coEnd(b).localeCompare(coEnd(a)) || String(b.startDate || "").localeCompare(String(a.startDate || "")); })[0] || null;
          var nowCoName = nowCo ? dispName(nowCo) : "";
          var TAXO = [
            { id: "t-recent", bg: "#2d3038", ko: "NOW", en: "Now" },
            { id: "t-perf", bg: "#2f5f99", ko: "퍼포먼스 / CRM", en: "Performance & CRM" },
            { id: "t-data", bg: "#2b6a5f", ko: "데이터 / 택소노미", en: "Data & Taxonomy" },
            { id: "t-camp", bg: "#93503c", ko: "브랜드 · 세일즈 캠페인", en: "Brand & Sales Campaign" },
            { id: "t-cont", bg: "#6a4c93", ko: "콘텐츠 · 영상", en: "Content & Video" }
          ];
          // 프로젝트 배치(2026-10-04 사용자 확정 · 예전 PDF 포트폴리오 기준): id → [분류, 묶음] · 여기 없는 프로젝트는 아래 규칙(지금 회사 = NOW)
          var PLACE = {
            "0a3aea35-ccc9-4018-a7a6-e383c303f928": ["t-perf", "매체 · 캠페인 운영"], // UA & 리타게팅
            "3080bc75-d773-490f-9a02-35d83886b418": ["t-perf", "매체 · 캠페인 운영"], // 카탈로그 캠페인
            "b0aa1d32-82d9-44bc-897d-b558a425c98c": ["t-perf", "매체 · 캠페인 운영"], // CPI 캠페인 월 5억
            "aab659e9-be16-46dc-9730-18d845c1dc64": ["t-perf", "소재 · CRM"], // 멜리즈 광고소재
            "4b05d1fb-1cae-47af-a252-5b3d46902125": ["t-perf", "소재 · CRM"], // 앱 푸시 & 플친
            "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": ["t-data", "지표 · 리포팅 자동화"], // 전사 지표 대시보드
            "8fe4e187-9052-4737-9d1b-d0a158d9e156": ["t-data", "지표 · 리포팅 자동화"], // 슬랙 리포팅
            "199815d6-356c-4959-8219-6c9ea7615102": ["t-data", "지표 · 리포팅 자동화"], // 택소노미
            "4d333686-6daa-4c8e-9cd7-3e8309ef9900": ["t-data", "네이버쇼핑 · SEO"],
            "e5bb7edf-a48d-4752-a0b4-c05df7903051": ["t-data", "네이버쇼핑 · SEO"], // 사이트 SEO
            "574f26d3-1fff-49fb-a302-b8c12253df61": ["t-camp", "브랜드 캠페인"], // 대리수술 안심존
            "43ab6811-42cf-4a1f-afca-62bfd67b17f9": ["t-camp", "브랜드 캠페인"], // 부작용
            "53845c2b-3618-4e8d-968c-1edfabdf4912": ["t-camp", "브랜드 캠페인"], // 기부런
            "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": ["t-camp", "세일즈 캠페인 · 커머스"], // USJ
            "2380b3b4-8dba-4b9d-9f96-38568a79936b": ["t-camp", "세일즈 캠페인 · 커머스"], // 화장품 특가
            "5afefe01-835b-48eb-9568-e6f51f6650ce": ["t-camp", "세일즈 캠페인 · 커머스"], // 갈바닉
            "e68c8938-fbb0-4a88-a9a1-dbb3d8c71243": ["t-cont", "영상 · 채널"], // 영상 PD
            "ea1d35c1-b9f4-4420-8d35-b26ec4709a10": ["t-cont", "영상 · 채널"] // 쎄뷰리
          };
          // NOW(지금 회사) 순서: AX → 어반스테이(D2C) → 플라트라이프 → 그 밖(웨이브 등 새 프로젝트는 뒤에 자동으로)
          var NOWORDER = ["77afd48a-668b-4ab1-b385-32fa41400211", "dff32975-e504-47e3-8ee1-744f2267ac91", "60f3fcee-e8b2-4499-b7d1-71e4f91ad2f5"];
          var taxOf = function (it) {
            var c = it.w.category || "", t = String(it.w.title || "") + " " + String(it.title || "");
            if ((nowCo && it.co === nowCo) || c === "AX") return "t-recent";
            if (PLACE[it.w.id]) return PLACE[it.w.id][0];
            if (c === "성과") return "t-data";
            if (/소재/.test(t) || c === "퍼포먼스" || c === "그로스" || c === "CRM") return "t-perf";
            if (c === "영상" || (c === "콘텐츠" && /영상|유튜브|채널/.test(t))) return "t-cont";
            if (c === "콘텐츠" || c === "브랜딩" || c === "커머스" || c === "제휴") return "t-camp";
            return "t-perf";
          };
          // 카드 순서: 모든 분류 최신 회사순(재직 중 → 최근 퇴사) → 같은 회사 안에서 최근 프로젝트 먼저 · 이 페이지에서 빼는 프로젝트(소비자 조사)
          var wEnd = function (it) { return String(it.w.endDate || it.w.startDate || ""); };
          var byRecent = function (a, b) { return coEnd(b.co).localeCompare(coEnd(a.co)) || String(b.co.startDate || "").localeCompare(String(a.co.startDate || "")) || wEnd(b).localeCompare(wEnd(a)) || byScore(a, b); };
          var HIDE = /소비자\s*조사/;
          var vis = items.filter(function (it) { return !HIDE.test(String(it.w.title || "") + " " + String(it.title || "")); });
          // 합친 장(2026-10-05 사용자 요청 '6·7·8 합치기'): 같은 회사·시기의 일을 한 장으로 — 첫 id(CPI 캠페인)를 유지해 배치·판(PPT 14쪽)·기여도는 그대로
          //    parts = 소제목별 담당 / 성과(PPT·DB 원문을 줄여 씀) · mets = 장 성과 숫자 · extra = 판 아래 이미지 줄(합친 프로젝트의 DB 이미지)
          var MERGE = [{
            ids: ["b0aa1d32-82d9-44bc-897d-b558a425c98c", "aab659e9-be16-46dc-9730-18d845c1dc64", "4b05d1fb-1cae-47af-a252-5b3d46902125"],
            title: "앱 성장 퍼포먼스 — CPI 캠페인 · 광고 소재 · CRM",
            summary: "월 최대 5억 CPI 캠페인 운영과 퍼포먼스 소재 · 앱 푸시·플친 CRM으로 멜리즈 MAU +110% 성장을 견인",
            problem: "서비스·캠페인별 최적 CPI와 iOS 단가 기준 · MAU 성장을 이끌 소재 · 이탈 유저 활성화",
            mets: [["+110%", "MAU (12~3월)"], ["월 5억", "최대 매체 예산"], ["35만", "월 앱 유입"]],
            parts: [
              ["CPI 캠페인", ["앱 설치·인앱 액션 최대화 전략 수립, KPI 설정", "최대 월 5억 CPI 캠페인 집행 — Meta · Google · GFA 셀프 서브", "Android · 오가닉 · SKAN 데이터로 iOS 효율 근거 마련, 매체 통합 대시보드 운영"], ["평균 CPM 3% · CPC 4% · CPI 10% 감소", "서비스별 신규·재방문 주요 지표 효율화"]],
              ["광고 소재", ["영상 · 이미지 퍼포먼스 소재 기획·제작", "급상승 순위권 유지를 위한 소재 지속 공급"], ["12~3월 MAU 약 110% 상승 · 신규 설치 약 55만 건", "D-리텐션 평균 35% · 앱스토어 급상승 1·2위 유지"]],
              ["CRM", ["신규·활성·이탈위험·이탈 세그먼트별 메시지 차별화", "일별 앱 푸시·플친 세팅, 일·주 단위 A/B 테스트"], ["월 평균 앱 유입 약 35만 명 · 비활성 유저 6.5만 명 재유입", "약 2개월 만에 카카오 플친 3만 명"]]
            ],
            extra: [["광고 소재", "aab659e9-be16-46dc-9730-18d845c1dc64"], ["앱 푸시 · 플친 CRM", "4b05d1fb-1cae-47af-a252-5b3d46902125"]]
          }];
          MERGE.forEach(function (M) {
            var parts = M.ids.map(function (id) { return vis.filter(function (x) { return x.w.id === id; })[0]; }).filter(Boolean);
            if (parts.length < 2) return;
            var base = parts[0], dts = function (k) { return parts.map(function (x) { return String(x.w[k] || ""); }).filter(Boolean).sort(); };
            var sd = dts("startDate"), ed = dts("endDate"), w = {}; for (var k in base.w) w[k] = base.w[k];
            var mets = M.mets.map(function (m, q) { return { id: "mg" + q, value: m[0], label: m[1] }; });
            w.title = M.title; w.summary = M.summary; w.problem = M.problem; w.startDate = sd[0] || w.startDate; w.endDate = ed[ed.length - 1] || w.endDate; w.metrics = mets;
            w.links = [].concat.apply([], parts.map(function (x) { return x.w.links || []; }));
            var m2 = {}; for (var k2 in base) m2[k2] = base[k2];
            m2.w = w; m2.title = M.title; m2.mets = mets; m2.m0 = mets[0]; m2.parts = M.parts;
            m2.extra = M.extra.map(function (e) { var x = parts.filter(function (y) { return y.w.id === e[1]; })[0]; return x ? [e[0], x.md.filter(function (m) { return !m.yt; })] : null; }).filter(function (e) { return e && e[1].length; });
            vis = vis.filter(function (x) { return parts.indexOf(x) < 0 || x === base; }).map(function (x) { return x === base ? m2 : x; });
          });
          var TS = TAXO.map(function (g) { return { g: g, items: vis.filter(function (it) { return taxOf(it) === g.id; }).sort(byRecent) }; }).filter(function (s) { return s.items.length; });
          var gOf = {}; TS.forEach(function (s) { s.items.forEach(function (it) { gOf[it.i] = s.g; }); });
          var deep = function (it) { return (gOf[it.i] && gOf[it.i].bg) || "#4e5968"; }; // 카드 색 = 분류 색
          var ko = function (c) { return c === "성과" ? "데이터" : c; };
          var mail = P.email ? "mailto:" + P.email : homeUrl + "#contact";
          // ── 카드 = 언제 · 무슨 작업 · 왜 · 결과 (그 밖의 정보는 누르면 열리는 상세에)
          //    언제 = 프로젝트 기간(끝 없고 재직 중이면 '– 지금') · 회사 / 무슨 작업 = 제목 / 왜 = 카드별 klio.cards[id].why → 작업의 Problem → 아래 기본 문장
          var ym = function (s) { var m = String(s || "").match(/^(\d{4})-(\d{2})/); return m ? { y: m[1], m: m[2] } : null; };
          var when = function (it) {
            var a = ym(it.w.startDate), b = ym(it.w.endDate);
            if (!a) return b ? b.y + "." + b.m : "";
            var s = a.y + "." + a.m;
            if (!b) return it.co && !it.co.endDate ? s + " – 지금" : s;
            if (b.y === a.y && b.m === a.m) return s;
            return s + " – " + (b.y === a.y ? b.m : b.y + "." + b.m);
          };
          // 카드의 '왜' = 핵심 한 줄(긴 설명은 누르면 열리는 상세의 Problem에) · 우선순위: klio.cards[id].why → 아래 핵심 문구 → 작업의 Problem
          var WHY = {
            "77afd48a-668b-4ab1-b385-32fa41400211": "요청→개발 대기→수기 취합 병목",
            "dff32975-e504-47e3-8ee1-744f2267ac91": "ROAS 0.3~0.8 만성 저효율",
            "60f3fcee-e8b2-4499-b7d1-71e4f91ad2f5": "측정·채널이 전무한 신사업",
            "0a3aea35-ccc9-4018-a7a6-e383c303f928": "웹 트래킹·매체 플래닝 부재",
            "b0aa1d32-82d9-44bc-897d-b558a425c98c": "서비스별 CPI·iOS 단가 기준 부재",
            "4b05d1fb-1cae-47af-a252-5b3d46902125": "이탈 유저 재활성화",
            "c54a836e-546c-4355-b2ac-213c3d444be2": "UAC 채널 맞춤 소재 필요",
            "aab659e9-be16-46dc-9730-18d845c1dc64": "MAU 성장을 이끌 소재",
            "574f26d3-1fff-49fb-a302-b8c12253df61": "바비톡을 써야 할 이유 · 신뢰",
            "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": "팀마다 다른 숫자",
            "944ff76c-037e-4c72-92ac-81f4dcabb366": "성과를 볼 기준 지표 부재",
            "8fe4e187-9052-4737-9d1b-d0a158d9e156": "매번 수기로 공유하던 지표",
            "199815d6-356c-4959-8219-6c9ea7615102": "부서마다 다른 데이터 기준",
            "c90c1643-f38b-4f2d-a668-9e0f3c87094a": "퍼포먼스 소재 상시 필요",
            "ea1d35c1-b9f4-4420-8d35-b26ec4709a10": "뷰티 리뷰 채널 성장",
            "e68c8938-fbb0-4a88-a9a1-dbb3d8c71243": "퀄리티로 재계약·신규 확보",
            "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": "일회성으로 소모되는 프로모션",
            "53845c2b-3618-4e8d-968c-1edfabdf4912": "CSR로 브랜드 강화",
            "43ab6811-42cf-4a1f-afca-62bfd67b17f9": "부작용 경각심 · 앱 신뢰",
            "fd404ac5-7f46-420b-97dc-a2b8e89bc445": "경쟁사 대비 인지도 파악",
            "4d333686-6daa-4c8e-9cd7-3e8309ef9900": "클린 위반으로 노출 불안정",
            "2380b3b4-8dba-4b9d-9f96-38568a79936b": "혜택 콘텐츠로 유입 확대",
            "5afefe01-835b-48eb-9568-e6f51f6650ce": "재고 3,000개 소진",
            "3080bc75-d773-490f-9a02-35d83886b418": "많은 상품 · 부족한 운영 리소스",
            "e5bb7edf-a48d-4752-a0b4-c05df7903051": "부족한 검색 노출 커버리지"
          };
          var whyOf = function (it) { return it.why || WHY[it.w.id] || String(it.w.problem || "").trim() || ""; };
          // 결과 = 성과 지표 앞 2개(카드별 대표 지표 선택 순서 그대로) · 숫자 크게 + 이름
          var resOf = function (it) { return it.mets.slice(0, 2).map(function (m) { return '<span><b>' + esc(m.value) + '</b>' + esc(m.label || "") + '</span>'; }).join(""); };
          // 프로젝트 한 장 = PDF 장 구성 · 메인 포트폴리오 톤(폭 832 · 작은 글씨 · 얇은 테두리): 영문 분야 · 묶음 | 번호 → 제목 → 로고 · 회사 · 기간 · 기여도
          //    → 한 줄 요약 · 과제 한 줄 → 성과 숫자 칸 → 담당업무 | 성과 (칸 이름은 w.cols, 줄바꿈 = 글머리표) → 그림 줄(PPT 그림 먼저 · 전부, 4장 이상은 옆으로 넘김 · 잘림 없이 · 누르면 원본 새 탭 · 영상은 유튜브)
          var CONTRIB = { // PDF의 기여도
            "0a3aea35-ccc9-4018-a7a6-e383c303f928": 80, "3080bc75-d773-490f-9a02-35d83886b418": 100, "b0aa1d32-82d9-44bc-897d-b558a425c98c": 100,
            "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": 90, "43ab6811-42cf-4a1f-afca-62bfd67b17f9": 90, "574f26d3-1fff-49fb-a302-b8c12253df61": 90, "53845c2b-3618-4e8d-968c-1edfabdf4912": 60,
            "4d333686-6daa-4c8e-9cd7-3e8309ef9900": 100, "e5bb7edf-a48d-4752-a0b4-c05df7903051": 90, "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": 100, "8fe4e187-9052-4737-9d1b-d0a158d9e156": 100,
            "199815d6-356c-4959-8219-6c9ea7615102": 100, "e68c8938-fbb0-4a88-a9a1-dbb3d8c71243": 80
          };
          var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
          var bullets = function (v) {
            var a = String(v || "").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
            if (!a.length) return "";
            return a.length > 1 ? '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : '<p>' + esc(a[0]) + '</p>';
          };
          var col = function (k, v) { var h = bullets(v); return h ? '<div class="pj-c"><h4>' + k + '</h4>' + h + '</div>' : ''; };
          var isPdf = function (m) { return /\/pf-img\/(ppt|pdf)\//.test(m.src) ? 1 : 0; };
          // 판 = PPT 장의 이미지 배치 그대로(패널 · 이미지 · 캡션 위치) · 톤만 우리 것(회색 패널 · Pretendard 캡션 · 파란 머리) · 이미지 누르면 원본
          var bpos = function (r) { return 'left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%'; };
          var board = function (sn) {
            var b = PPT_BOARD[sn]; if (!b) return '';
            return '<div class="bd" style="aspect-ratio:' + b.ar + ';--fs:' + (130 / b.bw).toFixed(2) + 'cqw">'
              + b.p.map(function (r) { return '<i class="bd-p" style="' + bpos(r) + '"></i>'; }).join("")
              + b.i.map(function (r) { return '<a class="bd-i' + (r[5] ? ' vid' : '') + '" href="' + ea(r[5] || PPT_IMG + r[0] + '.jpg') + '" ' + (r[5] ? 'data-v="' + ea(r[5]) + '"' : 'data-zoom="' + PPT_IMG + r[0] + '.jpg"') + ' target="_blank" rel="noopener" aria-label="' + (r[5] ? '영상 보기' : '그림 크게 보기') + '" style="' + bpos(r.slice(1, 5)) + '"><img src="' + PPT_IMG + r[0] + '.jpg" alt="" loading="lazy" decoding="async">' + (r[5] ? '<i class="tp-play" aria-hidden="true"></i>' : '') + '</a>'; }).join("")
              + b.c.map(function (r) { return '<span class="bd-c" style="left:' + r[0] + '%;top:' + r[1] + '%">' + esc(r[4]) + '</span>'; }).join("")
              + b.h.map(function (r) { return '<span class="bd-h" style="left:' + r[0] + '%;top:' + r[1] + '%">' + esc(r[4]) + '</span>'; }).join("")
              + '</div>';
          };
          // PPT 판이 없는 프로젝트: DB 이미지를 같은 톤의 판(회색 패널 안 격자, 잘림 없이)으로 · 영상은 유튜브
          var autoBoard = function (it) {
            var md = it.md.slice().sort(function (a, b) { return (a.yt ? 1 : 0) - (b.yt ? 1 : 0); }).slice(0, 6);
            if (!md.length) return '';
            return '<div class="bd-auto" style="--n:' + Math.min(md.length, 2) + '">' + md.map(function (m) {
              var im = '<img src="' + ea(m.src) + '" alt="" loading="lazy" decoding="async">';
              var vu = m.url || "https://youtu.be/" + m.yt;
              return m.yt ? '<a class="bd-a yt" href="' + ea(vu) + '" data-v="' + ea(vu) + '" target="_blank" rel="noopener" aria-label="영상 보기">' + im + '<i class="tp-play" aria-hidden="true"></i></a>' : '<a class="bd-a" href="' + ea(m.src) + '" data-zoom="' + ea(m.src) + '" target="_blank" rel="noopener" aria-label="그림 크게 보기">' + im + '</a>';
            }).join("") + '</div>';
          };
          // 프로젝트 = 슬라이드 한 장 · PPT 장 구성 그대로 두 가지:
          //   아래형(판이 장 왼쪽부터 넓게) = 제목·메타·요약·과제 | 성과 숫자 → 담당 | 성과 2칸 → 판(전체 폭)
          //   오른쪽형(판이 장 오른쪽) = 왼쪽 글(제목 … 담당 · 성과) | 오른쪽 판 · 판이 더 있으면 아래 전체 폭
          //   판 없음 = 왼쪽 글 | 오른쪽 DB 이미지 판(없으면 성과 숫자 크게)
          var slide = function (it, g, ct, no, tot, id) {
            var co = it.co, mets = it.mets.slice(0, 3), cb = CONTRIB[it.w.id], sum = String(it.w.summary || "").trim();
            var prob = String(it.w.problem || "").trim().split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).join(" · ") || whyOf(it);
            var act = String(it.w.action || it.w.detail || "").trim(), res = String(it.w.result || "").trim();
            var CL = it.w.cols || [], cols = col(CL[0] || "담당업무", act) + col(CL[1] || "성과", res);
            var ul = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>'; };
            if (it.parts) cols = '<div class="pj-pt"><span></span><h4>담당업무</h4><h4>성과</h4>' + it.parts.map(function (pt) { return '<b>' + esc(pt[0]) + '</b><div class="pj-c">' + ul(pt[1]) + '</div><div class="pj-c">' + ul(pt[2]) + '</div>'; }).join("") + '</div>'; // 합친 장: 소제목 | 담당 | 성과 줄
            var extraH = (it.extra || []).length ? '<div class="mg-row" style="--n:' + it.extra.length + '">' + it.extra.map(function (e) { return '<div class="mg-p"><b>' + esc(e[0]) + '</b><div class="mg-im">' + e[1].map(function (m) { return '<a class="mg-i" href="' + ea(m.src) + '" data-zoom="' + ea(m.src) + '" target="_blank" rel="noopener" aria-label="그림 크게 보기"><img src="' + ea(m.src) + '" alt="" loading="lazy" decoding="async"></a>'; }).join("") + '</div></div>'; }).join("") + '</div>' : '';
            var kpis = mets.map(function (m) { return '<span><b>' + esc(m.value) + '</b><i>' + esc(m.label || "") + '</i></span>'; }).join("");
            var bs = (PPT_BOARDS_OF[it.w.id] || []).filter(function (n) { return PPT_BOARD[n]; }), b0 = bs.length ? PPT_BOARD[bs[0]] : null;
            var seen = {}, vids = [], lks = [];
            (it.w.links || []).forEach(function (l) { if (!l || !l.url) return; var id = ytW(l.url); if (id) { if (!seen[id]) { seen[id] = 1; vids.push({ id: id, u: l.url, t: l.label || "영상" }); } } else lks.push(l); });
            var vCards = vids.map(function (v) { return '<button class="pj-vd" type="button" data-v="' + ea(v.u) + '"><i style="background-image:url(&quot;https://img.youtube.com/vi/' + ea(v.id) + '/mqdefault.jpg&quot;)"><s class="tp-play" aria-hidden="true"></s></i><span>' + esc(v.t) + '</span></button>'; }).join("");
            var vidVis = !(PPT_BOARDS_OF[it.w.id] || []).length && vids.length >= 2; // 판 없고 영상 여러 편 = 오른쪽에 영상 목록
            if (vids.length && !vidVis) cols += '<div class="pj-vids"><b>영상 ' + vids.length + '편</b><div class="pj-vg">' + vCards + '</div></div>';
            if (lks.length) cols += '<div class="pj-lks"><b>링크</b>' + lks.map(function (l) { return '<a class="pj-lk" href="' + ea(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || "링크") + ' ↗</a>'; }).join("") + '</div>';
            var head = '<h3 class="pj-t">' + esc(it.title) + '</h3>'
              + '<div class="pj-meta">' + (co && co.logo ? '<img class="pj-lg" src="' + ea(co.logo) + '" alt="">' : '') + '<b>' + esc(co ? dispName(co) : "") + '</b><span>' + esc(when(it)) + '</span>' + (cb ? '<em>기여도 ' + cb + '%</em>' : '') + '</div>'
              + (sum ? '<p class="pj-s">' + esc(sum) + '</p>' : '') + (prob ? '<p class="pj-q"><b>과제</b>' + esc(prob) + '</p>' : '');
            var top = '<div class="sl-hd"><span class="sl-ey">' + esc(String(g.id === "t-recent" ? "Now · " + nowCoName : g.en || g.ko).toUpperCase()) + (g.id === "t-recent" ? '' : ' · ' + esc(ct)) + '</span><span class="sl-no">' + pad2(no) + '<i> / ' + pad2(tot) + '</i></span></div>';
            var body;
            if (b0 && b0.x < 40) {
              body = '<div class="sl-top"><div class="sl-tx">' + head + '</div>' + (kpis ? '<div class="pj-ms sl-kpi">' + kpis + '</div>' : '') + '</div>'
                + (cols ? '<div class="pj-cols two">' + cols + '</div>' : '')
                + '<div class="sl-bds">' + bs.map(board).join("") + extraH + '</div>';
            } else {
              var vis = b0 ? board(bs[0]) : vidVis ? '<div class="sl-vg"><b>영상 ' + vids.length + '편</b><div class="pj-vg">' + vCards + '</div></div>' : (autoBoard(it) || (kpis ? '<div class="sl-kb">' + kpis + '</div>' : '<div class="sl-kb art" style="--c:' + it.cm.c + '">' + coverArt(it.w, it.m0) + '</div>'));
              var kIn = (b0 || it.md.length) && kpis ? '<div class="pj-ms" style="--n:' + mets.length + '">' + kpis + '</div>' : '';
              body = '<div class="sl-grid"><div class="sl-tx">' + head + kIn + (cols ? '<div class="pj-cols">' + cols + '</div>' : '') + '</div>'
                + '<div class="sl-vis' + (b0 || vidVis ? ' bdv' : '') + '">' + vis + '</div></div>';
            }
            var more = b0 && b0.x >= 40 ? bs.slice(1) : [];
            return '<section class="tp-sd sl" id="' + id + '" data-m="' + ea(g.id) + '" data-pi="' + it.i + '" data-wid="' + ea(it.w.id || "") + '"><div class="sl-in">' + top + body + '</div></section>'
              + more.map(function (n, k) {
                return '<section class="tp-sd sl cont" data-m="' + ea(g.id) + '"><div class="sl-in">' + top.replace('</i></span></div>', ' · ' + (k + 2) + '/' + (more.length + 1) + '</i></span></div>')
                  + '<div class="sl-ct"><h3 class="pj-t">' + esc(it.title) + '</h3><span>이어서</span></div><div class="sl-bds">' + board(n) + '</div></div></section>';
              }).join("");
          };
          // ── 묶음(일의 종류) = 분류 안의 한 줄: 왼쪽 묶음 이름·개수·기간 | 오른쪽 세로 카드들
          //    규칙 순서대로 묶고(1개여도 그 이름으로), 규칙에 안 걸린 건 마지막 줄('AX / 퍼포먼스'는 회사 이름, 나머지는 '그 외')
          var BUN = {
            "t-perf": [
              { t: "매체 · 예산 · CRM 운영", m: function (it) { return /매체|예산|푸시|플친/.test(String(it.w.title || "")) || it.w.category === "CRM"; } },
              { t: "광고 소재 제작", m: function (it) { return /소재/.test(String(it.w.title || "")); } }
            ],
            "t-data": [
              { t: "지표 체계 세팅 · 운영", m: function (it) { return /지표/.test(String(it.w.title || "")); } },
              { t: "데이터 파이프라인 · 어트리뷰션", m: function (it) { return /파이프라인|어트리뷰션|택소노미|Amplitude|Airbridge/i.test(String(it.w.title || "")); } }
            ],
            "t-camp": [
              { t: "브랜드 · 제휴 캠페인", m: function (it) { var c = it.w.category; return c === "브랜딩" || c === "제휴"; } },
              { t: "특가 · 핫딜 커머스", m: function (it) { return it.w.category === "커머스"; } }
            ]
          };
          var CLORDER = { "t-perf": ["매체 · 캠페인 운영", "소재 · CRM"], "t-data": ["지표 · 리포팅 자동화", "네이버쇼핑 · SEO"], "t-camp": ["브랜드 캠페인", "세일즈 캠페인 · 커머스"], "t-cont": ["영상 · 채널"] };
          var clustersOf = function (s) {
            if (s.g.id === "t-recent") { var oi = function (it) { var k = NOWORDER.indexOf(it.w.id); return k < 0 ? 99 : k; }; return [{ t: nowCoName || "지금", its: s.items.slice().sort(function (a, b) { return oi(a) - oi(b); }) }]; }
            var rest = s.items.slice(), out = [];
            (CLORDER[s.g.id] || []).forEach(function (t) { var got = rest.filter(function (it) { return PLACE[it.w.id] && PLACE[it.w.id][1] === t; }); if (!got.length) return; rest = rest.filter(function (it) { return got.indexOf(it) < 0; }); out.push({ t: t, its: got }); });
            (BUN[s.g.id] || []).forEach(function (b) { var got = rest.filter(b.m); if (!got.length) return; rest = rest.filter(function (it) { return got.indexOf(it) < 0; }); out.push({ t: b.t, its: got }); });
            if (rest.length) out.push({ t: s.g.id === "t-recent" ? (nowCoName || "지금") : "그 외", its: rest });
            return out;
          };
          // 기간(연도): 시작 연도 – 끝 연도, 끝 없이 재직 중이면 '지금'
          var yr = function (d) { return String(d || "").slice(0, 4); };
          var yrsOf = function (its, byCo) {
            var a = [], b = [], open = false;
            its.forEach(function (it) { var s0 = yr(byCo ? it.co.startDate : (it.w.startDate || it.co.startDate)), e0 = yr(byCo ? it.co.endDate : (it.w.endDate || "")); if (s0) a.push(s0); if (e0) b.push(e0); else if (!it.co.endDate) open = true; else if (s0) b.push(s0); });
            a.sort(); b.sort(); var from = a[0] || "", to = open ? "지금" : (b[b.length - 1] || "");
            return from && to && from !== to ? from + " – " + to : (from || to);
          };
          // ── 분류마다 번호 머리글(메인 '02 Experience'처럼: 번호 · 시기 → 분류 이름 → 개수 · 묶음들) → 프로젝트마다 한 장(카드, PDF처럼) · 회색 바탕 위에 쭉
          //    (2026-10-05 사용자 선택 '목록 카드 + 크게 보기') 챕터 = 머리(번호 · 제목 · 한 줄 · 개수) + 카드(썸네일 · 제목 · 회사·기간 · 대표 숫자) → 카드 누르면 보기 창에 그 장(.sl)
          //    slideOf[프로젝트] = 슬라이드 id('한눈에' 숫자 누르면 그 장으로)
          //    제목 덮어쓰기: klio.text.tpH_{recent|perf|data|camp}
          var headOf = function (s) { return txt("tpH_" + s.g.id.slice(2), s.g.id === "t-recent" ? "AX / 퍼포먼스" : s.g.ko); };
          var spanG = function (s) { return yrsOf(s.items, s.g.id === "t-recent"); };
          var slideOf = {};
          // ── 분류 = 챕터: 표지 한 장(어두운 장 · 번호 · 제목 · 한 줄 · 대표 숫자 3 · 이 챕터 프로젝트 목록(묶음별, 누르면 그 장)) → 프로젝트 장들
          //    표지 id = tp-{분류}(상단 탭 이동) · 한 줄 덮어쓰기 klio.text.tpD_{recent|perf|data|camp}
          var CDESC = { "t-recent": "숙박·주거 플랫폼에서 AX · 퍼포먼스 · 그로스", "t-perf": "매체 운영 · 캠페인 최적화 · 광고 소재 · CRM", "t-data": "지표 체계 · 리포팅 자동화 · 어트리뷰션 · 검색 노출", "t-camp": "브랜드 캠페인 · 세일즈 프로모션 · 커머스", "t-cont": "영상 기획 · 촬영 · 편집 · 유튜브 채널 운영" };
          // 챕터 표지 운영 사이클(PPT 9쪽 '퍼포먼스 마케팅 운영 사이클') — [단계, 설명]
          var CYCLE = { "t-perf": [["KPI · 타겟 정의", "세그먼트 분류"], ["미디어 믹스", "예산 & 매체"], ["캠페인 구조", "웹&앱 · UA & 리타게팅"], ["소재 제작", "이미지 · 영상 · 텍스트"], ["세팅 · 운영", "A/B 테스트"], ["성과 모니터링", "자동화 대시보드"], ["분석", "인사이트 도출"], ["개선", "매체·캠페인 구조 · 소재"]] };
          var thumbOf = function (it) { var bs = PPT_BOARDS_OF[it.w.id] || [], b = bs.length && PPT_BOARD[bs[0]]; return b && b.i.length ? PPT_IMG + b.i[0][0] + ".jpg" : it.main ? it.main.src : (it.co && it.co.logo) || ""; }; // 판 첫 그림 → 대표 그림 → 회사 로고
          // 카드 썸네일 = 고른 PPT 그림(CARD_TH) → 판 첫 그림 → 대표 그림(영상은 썸네일) → 분야 일러스트
          var CARD_TH = { "0a3aea35-ccc9-4018-a7a6-e383c303f928": "s10_02", "3080bc75-d773-490f-9a02-35d83886b418": "s12_01", "b0aa1d32-82d9-44bc-897d-b558a425c98c": "s14_00", "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": "s16_01",
            "43ab6811-42cf-4a1f-afca-62bfd67b17f9": "s19_00", "574f26d3-1fff-49fb-a302-b8c12253df61": "s20_00", "53845c2b-3618-4e8d-968c-1edfabdf4912": "s21_00", "4d333686-6daa-4c8e-9cd7-3e8309ef9900": "s23_00", "e5bb7edf-a48d-4752-a0b4-c05df7903051": "s24_00",
            "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": "s26_01", "8fe4e187-9052-4737-9d1b-d0a158d9e156": "s27_01", "199815d6-356c-4959-8219-6c9ea7615102": "s28_02" }; // 카드 썸네일로 잘 보이는 PPT 그림(소재·배너 위주)
          var cardThumb = function (it) {
            var bs = PPT_BOARDS_OF[it.w.id] || [], b = bs.length && PPT_BOARD[bs[0]], f = CARD_TH[it.w.id] || (b && b.i.length ? b.i[0][0] : "");
            if (f) return '<img src="' + PPT_IMG + f + '.jpg" alt="" loading="lazy" decoding="async">';
            if (it.main) return '<img src="' + ea(it.main.src) + '" alt="" loading="lazy" decoding="async">';
            return '<i class="cd-art" style="--c:' + it.cm.c + '">' + coverArt(it.w, it.m0) + '</i>';
          };
          var NO = 0, TOT = TS.reduce(function (a, x) { return a + x.items.length; }, 0), vwPages = [], abItems = [];
          var slides = TS.map(function (s, si) {
            var g = s.g, now = g.id === "t-recent", cl = clustersOf(s), chL = (now ? "NOW · " + nowCoName : g.ko);
            var cards = cl.map(function (c) {
              return c.its.map(function (it) {
                NO++; var id = "tp-p" + it.i, k = vwPages.length, m0 = it.mets[0]; slideOf[it.i] = id;
                vwPages.push('<div class="vw-pg" data-k="' + k + '" data-wid="' + ea(it.w.id || "") + '" data-t="' + ea(it.title) + '" hidden>' + slide(it, g, c.t, NO, TOT, id) + '</div>');
                abItems.push({ k: k, it: it, g: g, ct: c.t });
                return '<button class="cd" type="button" data-vw="' + k + '" aria-label="' + ea(it.title) + ' 크게 보기"><span class="cd-th">' + cardThumb(it) + '</span>'
                  + '<span class="cd-b">' + (cl.length > 1 ? '<span class="cd-ey">' + esc(c.t) + '</span>' : '') + '<b class="cd-t">' + esc(it.title) + '</b><span class="cd-m">' + esc(it.co ? dispName(it.co) : "") + ' · ' + esc(when(it)) + '</span>'
                  + (m0 ? '<span class="cd-k"><b>' + esc(m0.value) + '</b>' + esc(m0.label || "") + '</span>' : '') + '</span></button>';
              }).join("");
            }).join("");
            return '<section class="ch" id="tp-' + ea(g.id) + '" data-m="' + ea(g.id) + '"><div class="ch-hd"><span class="ch-ey">CHAPTER ' + pad2(si + 1) + ' · ' + esc(String(now ? "Now · " + nowCoName : g.en || g.ko).toUpperCase()) + '</span>'
              + '<h2>' + esc(headOf(s)) + '</h2><p>' + esc(txt("tpD_" + g.id.slice(2), now ? txt("tpNowDesc", CDESC[g.id]) : CDESC[g.id] || "")) + '</p><span class="ch-n">' + s.items.length + '개 프로젝트 · ' + esc(spanG(s)) + '</span></div>'
              + (CYCLE[g.id] ? '<div class="ch-cy"><h4>운영 사이클</h4><ol>' + CYCLE[g.id].map(function (c, q) { return '<li><i>' + pad2(q + 1) + '</i><b>' + esc(c[0]) + '</b><span>' + esc(c[1]) + '</span></li>'; }).join("") + '</ol></div>' : '')
              + '<div class="ch-cards">' + cards + '</div></section>';
          }).join("");
          // 보기 창(카드 누르면): 장 하나씩 전체 화면 · 아래 '‹ 이전 · 04 / 19 · 다음 ›' · ✕ · ←/→ · Esc · 스와이프
          var viewer = '<div class="vw" hidden role="dialog" aria-modal="true" aria-label="프로젝트 크게 보기"><div class="vw-sc">' + vwPages.join("") + '</div>'
            + '<div class="vw-bar"><button class="vw-nav" type="button" data-vw-step="-1" aria-label="이전 프로젝트">‹<span></span></button><span class="vw-cnt"></span><button class="vw-nav nx" type="button" data-vw-step="1" aria-label="다음 프로젝트"><span></span>›</button><button class="vw-x" type="button" data-vw-x aria-label="닫기">✕</button></div></div>';
          // ── 한눈에(첫 화면 바로 다음) — 5분 안에 판단: 지금(AX · 퍼포먼스 + 지금 회사 숫자) → 해온 일(시간순 회사 줄 · 맡은 일 · 대표 숫자)
          //    숫자는 누르면 그 프로젝트가 있는 장으로 이동 · 문구 덮어쓰기: klio.text.tpNowT(지금 하는 일) · tpNowS(아래 한 줄)
          var FOCUS = {
            "880f2595-41db-43f8-8fc4-d7b2b7a82ed9": "AX · 퍼포먼스 · 그로스",
            "df04e065-83b0-4fe3-9d89-c08103b1f3fc": "데이터 · 퍼포먼스 · 제휴",
            "d6ac38d6-bc00-4f6f-8bce-2579cf6ce020": "광고 소재 · 지표 세팅",
            "9a240366-d8d0-47b3-a1fd-3259532182b3": "퍼포먼스 · CRM",
            "64000e6d-362f-4ed7-a9e6-e64be85cd95a": "콘텐츠 · 브랜딩 · 커머스",
            "6add97f4-49f2-44fe-b6bb-a70f6a0ee024": "영상 PD"
          };
          // 숫자 고르기: [프로젝트 id, 지표 순서] — 지금(위) · 회사별(해온 일 줄)
          var NOWPF = [["77afd48a-668b-4ab1-b385-32fa41400211", 0], ["dff32975-e504-47e3-8ee1-744f2267ac91", 0], ["dff32975-e504-47e3-8ee1-744f2267ac91", 1]];
          var COPF = {
            "df04e065-83b0-4fe3-9d89-c08103b1f3fc": [["0a3aea35-ccc9-4018-a7a6-e383c303f928", 0], ["2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731", 0]],
            "9a240366-d8d0-47b3-a1fd-3259532182b3": [["b0aa1d32-82d9-44bc-897d-b558a425c98c", 0], ["b0aa1d32-82d9-44bc-897d-b558a425c98c", 1]], // 합친 장(+110% MAU · 월 5억)
            "64000e6d-362f-4ed7-a9e6-e64be85cd95a": [["2380b3b4-8dba-4b9d-9f96-38568a79936b", 0], ["53845c2b-3618-4e8d-968c-1edfabdf4912", 0]]
          };
          var pick = function (L) { return (L || []).map(function (q) { var it = vis.filter(function (x) { return x.w.id === q[0]; })[0], m = it && (it.w.metrics || []).filter(function (mm) { return mm && mm.value; })[q[1]]; return m ? { it: it, m: m } : null; }).filter(Boolean); };
          var subOf = function (it) { var t = String(it.title).split(/\s+[—–]\s+/); return t[1] || t[0]; };
          var ymTxt = function (s) { var m = ym(s); return m ? m.y + "." + m.m : ""; };
          var cos = vis.map(function (it) { return it.co; }).filter(function (co, k, a) { return co && co.startDate && a.indexOf(co) === k; })
            .sort(function (a, b) { return String(a.startDate).localeCompare(String(b.startDate)); });
          var t0 = cos.length ? ym(cos[0].startDate) : null, nd = new Date();
          var yrs = t0 ? Math.floor(((nd.getFullYear() - +t0.y) * 12 + nd.getMonth() + 1 - +t0.m) / 12) : 0;
          var nowPf = pick(NOWPF).map(function (p, k) {
            return '<button class="tp-pf tp-rv" type="button" data-go="' + ea(slideOf[p.it.i] || "") + '" data-pi="' + p.it.i + '" style="--dl:' + (k * 80) + 'ms"><b>' + esc(p.m.value) + '</b><span>' + esc(p.m.label || "") + '</span><i>' + esc(subOf(p.it)) + '</i></button>';
          }).join("");
          var pathHtml = cos.map(function (co, k) {
            var now = !co.endDate, pk = now ? [] : pick(COPF[co.id]);
            return '<li class="tp-rv' + (now ? ' now' : '') + '" style="--dl:' + (k * 60) + 'ms"><span class="tp-py">' + esc(ymTxt(co.startDate).slice(0, 4)) + (now ? ' – 지금' : '') + '</span><b>' + esc(dispName(co)) + '</b><span class="tp-pw">' + esc(FOCUS[co.id] || co.role || "") + '</span>'
              + (pk.length ? '<span class="tp-pks">' + pk.map(function (p) { return '<button class="tp-pk" type="button" data-go="' + ea(slideOf[p.it.i] || "") + '" data-pi="' + p.it.i + '"><b>' + esc(p.m.value) + '</b>' + esc(p.m.label || "") + '</button>'; }).join("") + '</span>' : '') + '</li>';
          }).join("");
          var glance = '<section class="tp-sd tp-gl" id="tp-glance" data-m="glance"><div class="tp-sd-in">'
            + (nowCo ? '<div class="tp-now tp-rv"><span class="tp-ey">지금</span><h2>' + esc(txt("tpNowT", "AX · 퍼포먼스 마케팅")) + '</h2><p>' + esc(txt("tpNowS", nowCoName + " · " + ymTxt(nowCo.startDate) + " – 지금")) + '</p></div>' : '')
            + (nowPf ? '<div class="tp-pfs">' + nowPf + '</div>' : '')
            + (pathHtml ? '<div class="tp-path"><span class="tp-ey tp-rv">해온 일' + (yrs ? ' · ' + yrs + '년 · ' + cos.length + '개 회사' : '') + '</span><ol>' + pathHtml + '</ol></div>' : '')
            + '</div></section>';
          var tabsHtml = '<button class="tp-tab" type="button" data-sec="glance">한눈에</button>' + TS.map(function (s) { return '<button class="tp-tab" type="button" data-sec="' + ea(s.g.id) + '">' + esc(s.g.id === "t-recent" && nowCoName ? "NOW · " + nowCoName : s.g.ko) + '</button>'; }).join("");
          // 첫 화면 벽(배경) · 문장 슬롯 단어(분야별 많은 순으로 돌아가며)
          var wallIt = vis.filter(function (it) { return it.main; }).concat(vis.filter(function (it) { return !it.main; }));
          var tile = function (it) { return '<span class="tp-wt" style="--bg:' + deep(it) + ';--c:' + it.cm.c + '">' + (it.main ? '<img src="' + ea(it.main.src) + '" alt="" decoding="async">' : coverArt(it.w, it.m0)) + '</span>'; };
          var rowOf = function (off, n) { var r = []; for (var q = 0; q < n && wallIt.length; q++) r.push(wallIt[(off + q * 3) % wallIt.length]); var h = r.map(tile).join(""); return h + h; };
          var wall = '<div class="tp-wall" aria-hidden="true">' + [0, 1, 2].map(function (x) { return '<div class="tp-wrow' + (x % 2 ? ' rev' : '') + '" style="--dur:' + [90, 110, 80][x] + 's">' + rowOf(x, 9) + '</div>'; }).join("") + '</div>';
          var wordsBy = TS.map(function (s) { var cnt = {}; s.items.forEach(function (it) { var c = ko(it.w.category || ""); if (c) cnt[c] = (cnt[c] || 0) + 1; }); return Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; }); });
          var words = []; for (var rr = 0; rr < 3; rr++) wordsBy.forEach(function (L) { if (L[rr] && words.indexOf(L[rr]) < 0 && words.length < 8) words.push(L[rr]); });
          if (!words.length) words = ["마케팅"];
          // 첫 화면 문장 A(로딩): 윗줄 "콘텐츠·영상, 퍼포먼스부터 CRM·데이터까지"가 단어마다 차례로 올라오고 → 아랫줄 "AX로 자동화합니다"
          //   *단어* = 강조(윗줄 흰색 굵게 · 아랫줄 파란색) · klio.text.tpHeroA1 / tpHeroA2 로 덮어쓰기 → 그다음 문장 B(tpHeroB) + 케이스 흐름
          var heroA1 = String(txt("tpHeroA1", "*콘텐츠·영상*, *퍼포먼스*부터 *CRM·데이터*까지")), heroA2 = String(txt("tpHeroA2", "*AX*로 자동화합니다"));
          var heroB = String(txt("tpHeroB", "진단하고, 설계하고, 실행합니다")), bP = heroB.split("{w}");
          var emph = function (s, tag) { return esc(s).replace(/\*([^*]+)\*/g, "<" + tag + ">$1</" + tag + ">"); };
          var aWords = heroA1.split(/\s+/).filter(Boolean);
          var aHtml = '<span class="tp-al1">' + aWords.map(function (w, k) { return '<span class="tp-aw" style="--i:' + k + '">' + emph(w, "b") + '</span>'; }).join(" ") + '</span>'
            + '<span class="tp-al2" style="--i:' + aWords.length + '">' + emph(heroA2, "em") + '</span>';
          var aTxt = (heroA1 + " " + heroA2).replace(/\*/g, "");
          var nav = '<header class="tp-nav"><div class="tp-nav-in"><button class="tp-logo" type="button" data-tgo="tp-top">' + esc(nameEn || nameKo || "Portfolio") + '</button>'
            + gtabs("projects", secLinks(true)) + '</div><div class="tp-nav-sub"><nav class="tp-ntabs" aria-label="챕터">' + tabsHtml + '</nav></div></header>';
          var hero = '<section class="tp-hero" id="tp-top">' + wall
            + '<div class="tp-hc"><h1 class="tp-hh" aria-label="' + ea(aTxt) + '">'
            + '<span class="tp-hp a" aria-hidden="true">' + aHtml + '</span>'
            + '<span class="tp-hp b" aria-hidden="true">' + esc(bP[0]) + (bP.length > 1 ? '<span class="tp-slot" data-w="' + ea(JSON.stringify(words)) + '"><i>' + esc(words[0]) + '</i></span>' + esc(bP.slice(1).join("")) : '') + '</span></h1>'
            + '<div class="tp-hb"><button class="tp-b pri" type="button" data-tgo="tp-bento">프로젝트 보기</button></div></div>'
            + '<button class="tp-cue" type="button" data-tgo="tp-next" aria-label="아래로"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></section>';
          var bentoS = '<div class="tp-deck" id="tp-bento">' + glance + slides + '</div>';
          var me = PHOTOS[0];
          var cta = '<section class="tp-ctas"><div class="tp-ctas-in tp-rv"><div><p class="tp-ctat">' + esc(txt("tpCtaT", "더 궁금한 점이 있다면\n편하게 연락 주세요")).replace(/\n/g, "<br>") + '</p><div class="tp-ctab"><a class="tp-sb l" href="' + ea(mail) + '" target="_top">' + esc(P.email || "연락처 보기") + '</a><a class="tp-sb p" href="' + ea(homeUrl) + '" target="_top">포트폴리오 보기</a></div></div>'
            + (me ? '<img class="tp-me" src="' + ea(me) + '" alt="' + ea(nameKo || nameEn || "") + '">' : '') + '</div></section>';
          var foot = '<footer class="tp-foot"><div class="tp-foot-in"><span><b>' + esc(nameKo || nameEn) + '</b>' + (P.email ? ' · ' + esc(P.email) : '') + '</span></div></footer>';
          var TCSS = 'body.tp{--g9:#191f28;--g8:#333d4b;--g7:#4e5968;--g6:#6b7684;--g5:#8b95a1;--g4:#b0b8c1;--g2:#e5e8eb;--g1:#f2f4f6;--bl:#3182f6;--bl1:#e8f3ff;--te:cubic-bezier(.2,.8,.2,1);--tw:min(1080px,calc(100vw - 48px));--tw2:min(1200px,calc(100vw - 48px));--tw3:min(832px,calc(100vw - 48px));--tws:min(1440px,calc(100vw - 48px));background:#fff;color:var(--g9);font-family:' + SANS_KR + ';letter-spacing:-.01em}'
            + '.tp :focus-visible{outline:2px solid var(--bl);outline-offset:3px}'
                        // 상단 바(첫 화면 위 투명 → 지나면 흰 바탕)
            + '.tp-nav{position:fixed;left:0;right:0;top:0;z-index:50;transition:background .3s,box-shadow .3s}.tp-nav-in{width:min(832px,var(--tw));height:60px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px}'
            + '.tp-nav .gtabs{display:flex;align-items:stretch;gap:30px;height:100%}.tp-nav .gt{position:relative;display:flex;align-items:center;font-size:15.5px;font-weight:600;color:rgba(255,255,255,.62);white-space:nowrap;transition:color .2s}.tp-nav .gt:hover,.tp-nav .gt.on{color:#fff}.tp-nav .gt.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:currentColor}'
            + '.tp-nav .gt-w{position:relative;display:flex}.tp-nav .gdd{position:absolute;top:100%;left:50%;min-width:176px;padding:6px;border:1px solid var(--g2);border-radius:12px;background:#fff;box-shadow:0 12px 32px -12px rgba(0,0,0,.25);opacity:0;visibility:hidden;transform:translate(-50%,-4px);transition:opacity .18s,transform .18s,visibility .18s}.tp-nav .gt-w:hover .gdd,.tp-nav .gt-w:focus-within .gdd{opacity:1;visibility:visible;transform:translate(-50%,0)}.tp-nav .gdd a{display:block;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:500;color:var(--g7);white-space:nowrap}.tp-nav .gdd a:hover{background:var(--g1);color:var(--g9)}'
            + '.tp-nav.solid .gt{color:var(--g5)}.tp-nav.solid .gt:hover,.tp-nav.solid .gt.on{color:var(--g9)}'
            + '.tp-nav-sub{display:none;border-top:1px solid var(--g2)}.tp-nav.solid .tp-nav-sub{display:block}'
            + '.tp-logo{display:inline-flex;align-items:center;font-size:16px;font-weight:800;letter-spacing:-.03em;color:#fff;white-space:nowrap}.tp-logo small{margin-left:10px;padding-left:10px;border-left:1px solid currentColor;font-size:11px;font-weight:600;opacity:.7}'
            + '.tp-nback{display:inline-flex;align-items:center;height:40px;padding:0 12px;border-radius:8px;font-size:15px;font-weight:600;color:rgba(255,255,255,.85);transition:background .2s}.tp-nback:hover{background:rgba(255,255,255,.12)}.tp-nr{margin-left:auto;display:flex;align-items:center;gap:6px}'
            + '.tp-nav.solid{background:rgba(255,255,255,.96);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--g2)}.tp-nav.solid .tp-logo{color:var(--g9)}.tp-nav.solid .tp-nback{color:var(--g7)}.tp-nav.solid .tp-nback:hover{background:var(--g1)}'
            // 첫 화면: 어두운 배경 + 비스듬히 흐르는 썸네일 벽 · 문장 A → B
            + '.tp-hero{position:relative;height:100svh;min-height:600px;overflow:hidden;background:#0b0d10;color:#fff;display:grid;place-items:center;text-align:center}'
            + '.tp-wall{position:absolute;inset:-12% -10%;display:flex;flex-direction:column;justify-content:center;gap:clamp(12px,1.4vw,20px);opacity:0;transform:rotate(-8deg) scale(1.16);transition:opacity 1.6s var(--te),transform 2.6s var(--te)}.tp-hero.ld .tp-wall{opacity:.5;transform:rotate(-8deg) scale(1)}'
            + '.tp-wrow{display:flex;gap:clamp(12px,1.4vw,20px);width:max-content;animation:tpMq var(--dur,90s) linear infinite}.tp-wrow.rev{animation-direction:reverse}@keyframes tpMq{to{transform:translateX(-50%)}}'
            + '.tp-wt{flex:none;display:grid;place-items:center;width:clamp(200px,19vw,340px);aspect-ratio:4/3;border-radius:18px;overflow:hidden;background:var(--bg)}.tp-wt img{width:100%;height:100%;object-fit:cover}.tp-wt svg{width:88%;height:88%}'
            + '.tp-hero::after{content:"";position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse 62% 52% at 50% 50%,rgba(8,10,14,.74),rgba(8,10,14,.9)),linear-gradient(180deg,rgba(8,10,14,.55),transparent 30%,transparent 70%,rgba(8,10,14,.8))}'
            + '.tp-hc{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:40px;padding:0 20px}.js .tp-hc{animation:tpUp 1.1s var(--te) .15s backwards}@keyframes tpUp{from{opacity:0;transform:translateY(24px)}}'
            + '.tp-hh{display:grid;font-size:clamp(34px,3.9vw,64px);font-weight:700;line-height:1.3;letter-spacing:-.03em;text-wrap:balance}'
            + '.tp-hp{grid-area:1/1;align-self:center;transition:opacity .7s var(--te),transform .9s var(--te)}.tp-hp.b{opacity:0;transform:translateY(34px)}.tp-hh.sw .tp-hp.a{opacity:0;transform:translateY(-34px)}.tp-hh.sw .tp-hp.b{opacity:1;transform:none}'
            + '.tp-hp.a{display:flex;flex-direction:column;align-items:center;gap:.16em}.tp-al1{font-size:.5em;font-weight:600;line-height:1.5;letter-spacing:-.02em;color:rgba(255,255,255,.6)}.tp-al1 b{font-weight:700;color:#fff}.tp-aw{display:inline-block}.tp-al2{display:block}.tp-al2 em{font-style:normal;color:#7db7ff}'
            + '.js .tp-aw{animation:tpWord .8s var(--te) backwards;animation-delay:calc(.35s + var(--i) * .18s)}.js .tp-al2{animation:tpWord2 1s var(--te) backwards;animation-delay:calc(.6s + var(--i) * .18s)}'
            + '@keyframes tpWord{from{opacity:0;transform:translateY(70%)}}@keyframes tpWord2{from{opacity:0;transform:translateY(26px) scale(.97)}}body[data-still] .tp-aw,body[data-still] .tp-al2{animation:none}'
            + '.tp-slot{position:relative;display:inline-block;height:1.3em;overflow:hidden;vertical-align:top;text-align:left;color:#9ccaff;transition:width .55s var(--te)}.tp-slot>i{position:absolute;left:0;top:0;font-style:normal;white-space:nowrap;transition:transform .65s var(--te),opacity .5s}.tp-slot>i.nx{transform:translateY(100%);opacity:0}.tp-slot>i.out{transform:translateY(-100%);opacity:0}'
            + '.tp-hb{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;opacity:0;transform:translateY(12px);transition:opacity .8s var(--te) .2s,transform .9s var(--te) .2s}.tp-hero.ld .tp-hb{opacity:1;transform:none}'
            + '.tp-b{display:inline-flex;align-items:center;justify-content:center;height:56px;padding:0 26px;border-radius:16px;font-size:18px;font-weight:600;transition:transform .2s var(--te),filter .2s}.tp-b:active{transform:scale(.96)}.tp-b.pri{background:var(--bl);color:#fff}.tp-b.pri:hover{filter:brightness(1.08)}'
            + '.tp-cue{position:absolute;left:50%;bottom:28px;z-index:2;width:44px;height:44px;margin-left:-22px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;animation:tpBob 2.2s ease-in-out infinite}.tp-cue:hover{background:rgba(255,255,255,.24)}@keyframes tpBob{50%{transform:translateY(6px)}}'
            // 상단 바 안 분류 탭(첫 화면 지나면 보임) · 지금 보고 있는 장 = 진하게 + 밑줄
            + '.tp-ntabs{display:flex;justify-content:center;gap:2px;width:var(--tw);margin:0 auto;overflow-x:auto;scrollbar-width:none}.tp-ntabs::-webkit-scrollbar{display:none}'
            + '.tp-tab{position:relative;flex:none;height:46px;padding:0 12px;font-size:15px;font-weight:600;color:var(--g5);white-space:nowrap;transition:color .2s}.tp-tab:hover{color:var(--g8)}.tp-tab.on{color:var(--g9)}'
            + '.tp-tab::after{content:"";position:absolute;left:12px;right:12px;bottom:0;height:2px;border-radius:2px;background:var(--g9);transform:scaleX(0);transition:transform .35s var(--te)}.tp-tab.on::after{transform:none}'
            // 장(슬라이드) = PPT 한 장처럼 둥근 카드 · 회색 바탕 위에 간격을 두고 쭉 이어짐 (보통 스크롤 · 겹침·움직임 없음)
            + '.tp-deck{padding:clamp(110px,12vh,124px) 0 48px;background:var(--g1)}'
            + '.tp-sd{position:relative;width:var(--tws);margin:0 auto 28px;border:1px solid #e6e8eb;border-radius:28px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)}.tp-gl .tp-sd-in{width:100%;max-width:1080px;margin:0 auto}'
            + '.tp-sd-in{display:flex;flex-direction:column;padding:clamp(28px,3vw,40px)}'
            // 한눈에 장: 지금(큰 제목) → 지금 숫자 3칸(누르면 그 프로젝트) → 해온 일(가로 경력 줄 · 회사별 대표 숫자, 지금 = 파랑)
            + '.tp-ey{display:block;font-size:14px;font-weight:600;color:var(--bl);font-variant-numeric:tabular-nums}'
            + '.tp-now h2{margin-top:10px;font-size:clamp(24px,2.2vw,30px);font-weight:700;line-height:1.3;letter-spacing:-.03em;color:var(--g9);word-break:keep-all}.tp-now p{margin-top:8px;font-size:15px;color:var(--g6);font-variant-numeric:tabular-nums}'
            + '.tp-pfs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:28px}'
            + '.tp-pf{display:flex;flex-direction:column;align-items:flex-start;width:100%;min-width:0;text-align:left;white-space:normal}.tp-pf>*{max-width:100%}.tp-pf b{font-size:clamp(30px,2.6vw,36px);font-weight:700;line-height:1.1;letter-spacing:-.04em;color:var(--g9);font-variant-numeric:tabular-nums;transition:color .2s}.tp-pf:hover b{color:var(--bl)}'
            + '.tp-pf span{margin-top:8px;font-size:14px;font-weight:600;color:var(--g8)}.tp-pf i{margin-top:3px;font-style:normal;font-size:12.5px;color:var(--g5);word-break:keep-all}'
            + '.tp-path{margin-top:36px}.tp-path ol{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);margin:22px 0 0;padding:0;list-style:none}'
            + '.tp-path li{position:relative;padding:18px 10px 0 0;border-top:2px solid var(--g2)}.tp-path li::before{content:"";position:absolute;left:0;top:-6px;width:10px;height:10px;border-radius:50%;background:var(--g4)}.tp-path li.now{border-top-color:var(--bl)}.tp-path li.now::before{background:var(--bl)}'
            + '.tp-py{display:block;font-size:12.5px;font-weight:600;color:var(--g5);font-variant-numeric:tabular-nums}.tp-path li>b{display:block;margin-top:4px;font-size:15px;font-weight:700;color:var(--g9)}.tp-pw{display:block;margin-top:3px;font-size:12.5px;line-height:1.45;color:var(--g6);word-break:keep-all}.tp-path li.now>b,.tp-path li.now .tp-py{color:var(--bl)}'
            + '.tp-pks{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin-top:12px}.tp-pk{display:inline-flex;align-items:baseline;flex-wrap:wrap;gap:0 5px;text-align:left;font-size:12px;color:var(--g6);white-space:normal}.tp-pk b{font-size:15px;font-weight:700;letter-spacing:-.02em;color:var(--g9);transition:color .2s}.tp-pk:hover b{color:var(--bl)}'
            // 챕터: 머리(CHAPTER 번호 · 제목 · 한 줄 · 개수) · (퍼포먼스) 운영 사이클 · 카드 3열
            + '.ch{width:var(--tws);margin:0 auto;padding-top:clamp(64px,9vh,96px);scroll-margin-top:110px}.ch-hd{padding:0 6px}.ch-ey{display:block;font-size:13px;font-weight:600;letter-spacing:.08em;color:var(--g5)}.ch-hd h2{margin-top:10px;font-size:clamp(30px,3vw,44px);font-weight:700;line-height:1.2;letter-spacing:-.035em;color:var(--g9)}'
            + '.ch-hd p{margin-top:10px;font-size:18px;line-height:1.5;color:var(--g7);word-break:keep-all}.ch-n{display:block;margin-top:6px;font-size:14px;color:var(--g5);font-variant-numeric:tabular-nums}'
            + '.ch-cy{margin-top:24px;padding:0 6px}.ch-cy h4{font-size:13px;font-weight:600;color:var(--g5)}.ch-cy ol{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;margin:10px 0 0;padding:0;list-style:none}.ch-cy li{position:relative;display:flex;flex-direction:column;padding:12px 12px 14px;border:1px solid #e6e8eb;border-radius:12px;background:#fff}.ch-cy li:last-child{border-color:transparent;background:var(--bl1)}'
            + '.ch-cy li:not(:last-child)::after{content:"›";position:absolute;right:-8px;top:50%;z-index:1;width:16px;margin-top:-11px;font-size:17px;line-height:22px;text-align:center;color:var(--g4)}.ch-cy i{font-style:normal;font-size:11.5px;font-weight:700;color:var(--bl)}.ch-cy b{margin-top:6px;font-size:14px;font-weight:700;line-height:1.3;color:var(--g9);word-break:keep-all}.ch-cy span{margin-top:3px;font-size:12px;line-height:1.4;color:var(--g6);word-break:keep-all}'
            + '.ch-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:28px}'
            + '.cd{display:flex;flex-direction:column;min-width:0;border:1px solid #e6e8eb;border-radius:22px;overflow:hidden;background:#fff;text-align:left;transition:transform .25s var(--te),box-shadow .25s var(--te)}.cd:hover{transform:translateY(-4px);box-shadow:0 20px 40px -24px rgba(0,0,0,.3)}'
            + '.cd-th{position:relative;display:grid;place-items:center;aspect-ratio:16/10;background:#f2f4f6;overflow:hidden}.cd-th img{max-width:calc(100% - 36px);max-height:calc(100% - 32px);width:auto;height:auto;border-radius:8px;box-shadow:0 12px 28px -14px rgba(0,0,0,.35);transition:transform .35s var(--te)}.cd:hover .cd-th img{transform:scale(1.03)}'
            + '.cd-art{position:absolute;inset:0;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 80%,#fff)}.cd-art svg{width:72%;height:auto}'
            + '.cd-b{flex:1;display:flex;flex-direction:column;padding:18px 20px 20px}.cd-ey{font-size:12.5px;font-weight:600;color:var(--g5)}.cd-t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:6px;font-size:18px;font-weight:700;line-height:1.4;letter-spacing:-.02em;color:var(--g9);word-break:keep-all}.cd-ey+.cd-t{margin-top:4px}'
            + '.cd-m{margin-top:6px;font-size:13.5px;color:var(--g6);font-variant-numeric:tabular-nums}.cd-k{display:flex;align-items:baseline;gap:8px;margin-top:auto;padding-top:16px;font-size:13px;color:var(--g6)}.cd-k b{font-size:24px;font-weight:700;letter-spacing:-.03em;color:var(--bl);font-variant-numeric:tabular-nums}'
            // 보기 창: 회색 바탕 전체 화면 · 장 하나 · 아래 가운데 조작 막대(이전 · 번호 · 다음 · 닫기)
            + '.vw{position:fixed;inset:0;z-index:150;background:var(--g1);opacity:0;transition:opacity .2s}.vw[hidden]{display:none}.vw.on{opacity:1}.vw-sc{position:absolute;inset:0;overflow-y:auto;padding:24px 0 112px;overscroll-behavior:contain}.vw .tp-sd.sl{min-height:calc(100vh - 140px);margin-bottom:20px}'
            + '.vw-bar{position:fixed;left:50%;bottom:20px;z-index:3;display:flex;align-items:center;gap:4px;max-width:calc(100vw - 24px);padding:6px;border-radius:16px;background:rgba(25,31,40,.94);color:#fff;transform:translateX(-50%);box-shadow:0 18px 40px -16px rgba(0,0,0,.55)}'
            + '.vw-nav{display:inline-flex;align-items:center;gap:10px;min-width:0;max-width:300px;height:44px;padding:0 16px;border-radius:12px;font-size:18px;color:#fff;transition:background .2s}.vw-nav:hover,.vw-x:hover{background:rgba(255,255,255,.12)}.vw-nav span{overflow:hidden;font-size:14px;font-weight:600;white-space:nowrap;text-overflow:ellipsis}'
            + '.vw-cnt{flex:none;padding:0 8px;font-size:14px;font-weight:600;color:rgba(255,255,255,.6);font-variant-numeric:tabular-nums}.vw-x{flex:none;width:44px;height:44px;margin-left:4px;border-left:1px solid rgba(255,255,255,.14);border-radius:0 12px 12px 0;font-size:16px;color:#fff}'
            // 프로젝트 슬라이드: 흰 장 · 화면 높이 · 위 분야·묶음 | 장 번호(선 아래) → 왼쪽 글 5 : 오른쪽 갤러리 6
            + '.tp-sd.sl{display:flex;flex-direction:column;min-height:calc(100vh - 104px);padding:26px 44px 34px;scroll-margin-top:120px;transition:box-shadow .4s var(--te)}.tp-sd.sl.hl{box-shadow:0 0 0 2px var(--bl)}'
            + '.sl-in{flex:1;display:flex;flex-direction:column}.sl-hd{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-bottom:14px;border-bottom:1px solid var(--g2)}.sl-ey{font-size:13px;font-weight:600;letter-spacing:.08em;color:var(--g5);word-break:keep-all}.sl-no{flex:none;font-size:16px;font-weight:700;color:var(--g9);font-variant-numeric:tabular-nums}.sl-no i{font-style:normal;font-weight:500;color:var(--g4)}'
            + '.sl-grid{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,3.6vw,56px);padding-top:22px}.sl-tx{min-width:0}.sl-vis{position:sticky;top:124px;align-self:start;display:flex;flex-direction:column;min-width:0;height:clamp(420px,calc(100vh - 250px),680px)}'
            + '.pj-t{font-size:clamp(28px,2.4vw,36px);font-weight:700;line-height:1.3;letter-spacing:-.03em;color:var(--g9);word-break:keep-all}'
            + '.pj-meta{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:14px;font-size:15px;color:var(--g6);font-variant-numeric:tabular-nums}.pj-lg{flex:none;width:26px;height:26px;border-radius:6px;border:1px solid var(--g2);background:#fff;object-fit:contain}.pj-meta b{font-weight:600;color:var(--g8)}.pj-meta span::before{content:"·";margin-right:8px;color:var(--g4)}'
            + '.pj-meta em{margin-left:2px;padding:3px 9px;border-radius:7px;background:var(--bl1);font-style:normal;font-size:13px;font-weight:600;color:var(--bl)}'
            + '.pj-s{margin-top:18px;font-size:17.5px;line-height:1.6;color:var(--g8);word-break:keep-all}.pj-q{margin-top:10px;font-size:15px;line-height:1.6;color:var(--g6);word-break:keep-all}.pj-q b{margin-right:8px;font-weight:600;color:var(--g7)}'
            + '.pj-ms{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));gap:8px;margin-top:20px}.pj-ms span{display:flex;flex-direction:column;padding:16px 18px;border-radius:14px;background:#f5f6f8}.pj-ms b{font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-.03em;color:var(--g9);font-variant-numeric:tabular-nums}.pj-ms i{margin-top:5px;font-style:normal;font-size:14px;color:var(--g6);word-break:keep-all}'
            + '.pj-cols{display:grid;gap:16px;margin-top:18px;padding-top:16px;border-top:1px solid var(--g2)}.pj-c h4{font-size:14.5px;font-weight:700;color:var(--bl)}'
            + '.pj-c ul{margin:8px 0 0;padding:0;list-style:none}.pj-c li{position:relative;margin-top:7px;padding-left:14px;font-size:16.5px;line-height:1.6;color:var(--g8);word-break:keep-all}.pj-c li::before{content:"";position:absolute;left:1px;top:.72em;width:4px;height:4px;border-radius:50%;background:var(--g5)}.pj-c p{margin-top:9px;font-size:16.5px;line-height:1.6;color:var(--g8);word-break:keep-all}'
            // 판(PPT 배치 그대로): 패널 = 회색 둥근 상자 · 이미지 = 잘림 없이(그림자) · 캡션 = 장 폭의 1.3% 크기(10~14px) · 머리 = 파랑
            + '.bd{position:relative;width:100%;container-type:inline-size}.bd>*{position:absolute;margin:0}.bd-p{display:block;border-radius:1.4cqw;background:#f5f6f8}'
            + '.bd-i{display:block}.bd-i img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 .5cqw .9cqw rgba(0,0,0,.16));transition:transform .25s var(--te)}.bd-i:hover img{transform:scale(1.02)}'
            + '.bd-c,.bd-h{font-size:clamp(12px,var(--fs),16px);line-height:1.25;white-space:nowrap}.bd-c{font-weight:600;color:var(--g7)}.bd-h{font-weight:700;color:var(--bl)}'
            + '.bd-i.vid .tp-play{transform:scale(.85);transition:background .2s}.bd-i.vid:hover .tp-play{background:rgba(0,0,0,.72)}'
            + '.sl-vg{padding:20px;border-radius:20px;background:#f5f6f8}.sl-vg>b{font-size:14.5px;font-weight:700;color:var(--bl)}.sl-vg .pj-vg{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sl-vg .pj-vd{background:#fff}.sl-vg .pj-vd span{font-size:14.5px}'
            + '.pj-pt{grid-column:1/-1;display:grid;grid-template-columns:132px minmax(0,1fr) minmax(0,1fr);gap:0}.pj-pt>*{padding-right:28px}.pj-pt>h4{padding-bottom:6px;font-size:14.5px;font-weight:700;color:var(--bl)}.pj-pt>b,.pj-pt>.pj-c{padding:12px 0 14px;border-top:1px solid var(--g2)}.pj-pt>b{font-size:15px;font-weight:700;line-height:1.6;color:var(--g9)}.pj-pt .pj-c ul{margin:0}.pj-pt .pj-c li:first-child{margin-top:0}'
            + '.mg-row{display:grid;grid-template-columns:repeat(var(--n,2),minmax(0,1fr));gap:12px}.mg-p{padding:14px 16px 16px;border-radius:16px;background:#f5f6f8}.mg-p>b{font-size:14px;font-weight:600;color:var(--g7)}.mg-im{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}.mg-i{display:grid;place-items:center;height:150px;cursor:zoom-in}.mg-i img{max-width:100%;max-height:100%;border-radius:6px;box-shadow:0 8px 20px -12px rgba(0,0,0,.35)}'
            + '.pj-vids{grid-column:1/-1}.pj-vids>b{font-size:14.5px;font-weight:700;color:var(--bl)}.pj-vg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:10px}.pj-vd{display:flex;flex-direction:column;min-width:0;border-radius:12px;overflow:hidden;background:#f5f6f8;text-align:left;transition:background .2s}.pj-vd:hover{background:var(--g2)}'
            + '.pj-vd i{position:relative;display:block;aspect-ratio:16/9;background:#000 center/cover no-repeat}.pj-vd .tp-play{transform:scale(.62)}.pj-vd:hover .tp-play{background:rgba(0,0,0,.72)}.pj-vd span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:8px 10px 10px;font-size:13.5px;font-weight:600;line-height:1.4;color:var(--g8);word-break:keep-all}'
            + '.pj-lks{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:6px}.pj-lks b{margin-right:4px;font-size:14.5px;font-weight:700;color:var(--bl)}.pj-lk{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:9px;background:#f5f6f8;font-size:14px;font-weight:600;color:var(--g8);transition:background .2s}.pj-lk:hover{background:var(--g2)}'
            + '.bd-auto{flex:1;display:grid;grid-template-columns:repeat(var(--n,2),minmax(0,1fr));grid-auto-rows:minmax(0,1fr);gap:12px;padding:16px;border-radius:20px;background:#f5f6f8}.bd-a{position:relative;display:grid;place-items:center;min-height:160px;overflow:hidden;border-radius:12px}.bd-a img{position:absolute;inset:8px;margin:auto;max-width:calc(100% - 16px);max-height:calc(100% - 16px);width:auto;height:auto;border-radius:6px;box-shadow:0 10px 24px -14px rgba(0,0,0,.35)}.bd-a.yt{background:#000}'
            // 모달: 그림 확대(누르면 원본 크기 · 같은 장 그림끼리 ‹ ›) · 영상 재생(유튜브 16:9, 쇼츠 9:16) · 어두운 바탕
            + '.bd-i:not(.vid),.bd-a:not(.yt){cursor:zoom-in}.tp-md{position:fixed;inset:0;z-index:200;display:grid;place-items:center;opacity:0;transition:opacity .2s}.tp-md[hidden]{display:none}.tp-md.on{opacity:1}.tp-md-bg{position:absolute;inset:0;background:rgba(10,12,16,.86);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}'
            + '.tp-md-in{position:relative;z-index:1;display:grid;place-items:center;max-width:min(92vw,1440px);max-height:88vh;overflow:auto;border-radius:12px}.tp-md-im{display:block;max-width:min(92vw,1440px);max-height:88vh;width:auto;height:auto;border-radius:10px;background:#fff;cursor:zoom-in;box-shadow:0 30px 80px -20px rgba(0,0,0,.6)}.tp-md-im.big{max-width:none;max-height:none;cursor:zoom-out}'
            + '.tp-md-v{width:min(92vw,1280px);aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 30px 80px -20px rgba(0,0,0,.6)}.tp-md-v.sh{width:auto;height:min(86vh,860px)}.tp-md-v.sh{aspect-ratio:9/16}.tp-md-v iframe{display:block;width:100%;height:100%;border:0}'
            + '.tp-md-x,.tp-md-nav{position:absolute;z-index:2;display:grid;place-items:center;border-radius:14px;background:rgba(255,255,255,.14);color:#fff;transition:background .2s}.tp-md-x:hover,.tp-md-nav:hover{background:rgba(255,255,255,.26)}.tp-md-x{top:18px;right:20px;width:46px;height:46px;font-size:19px}'
            + '.tp-md-nav{top:50%;width:52px;height:52px;margin-top:-26px;font-size:30px;line-height:1;padding-bottom:4px;visibility:hidden}.tp-md.img.multi .tp-md-nav{visibility:visible}.tp-md-nav.prev{left:20px}.tp-md-nav.next{right:20px}.tp-md-cnt{position:absolute;bottom:20px;left:50%;z-index:2;font-size:14px;font-weight:600;color:rgba(255,255,255,.8);transform:translateX(-50%);font-variant-numeric:tabular-nums}'
            // 아래형: 위 글 | 성과 숫자 → 담당 | 성과 2칸 → 판(전체 폭) · 오른쪽 판은 자기 비율대로(따라오지 않음)
            + '.sl-top{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:20px 40px;padding-top:20px}.sl-ct{display:flex;align-items:baseline;gap:12px;padding-top:20px}.sl-ct .pj-t{font-size:22px}.sl-ct span{font-size:13px;font-weight:600;color:var(--g5)}.pj-ms.sl-kpi{display:flex;margin-top:0}.sl-kpi span{min-width:132px}'
            + '.pj-cols.two{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px 48px}.sl-bds{display:grid;gap:18px;margin-top:18px}.sl-vis.bdv{position:static;height:auto;align-self:start}'
            // 갤러리: 큰 그림(남는 높이 채움 · 잘림 없이 가운데) + 작은 그림 줄 / 그림 없으면 성과 숫자 크게
            + '.sl-g{flex:1;display:flex;flex-direction:column;gap:10px;min-height:0}.sl-main{position:relative;flex:1;min-height:0;border:1px solid #eceef1;border-radius:20px;background:#f5f6f8;overflow:hidden}'
            + '.sl-main img{position:absolute;inset:24px;margin:auto;max-width:calc(100% - 48px);max-height:calc(100% - 48px);width:auto;height:auto;border-radius:8px;box-shadow:0 14px 34px -16px rgba(0,0,0,.3)}.sl-main.yt{background:#000}.sl-main.yt img{inset:0;max-width:100%;max-height:100%;border-radius:0;box-shadow:none}.sl-main.yt:hover .tp-play{background:rgba(0,0,0,.7)}'
            + '.sl-ths{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}.sl-tb{position:relative;flex:none;height:76px;padding:6px;border:1px solid #e6e8eb;border-radius:12px;background:#f7f8fa;opacity:.65;transition:opacity .2s,border-color .2s}.sl-tb:hover{opacity:1}.sl-tb.on{opacity:1;border-color:var(--g9)}.sl-tb img{display:block;width:auto;height:100%;border-radius:5px}.sl-tb.yt{background:#000;opacity:1}.sl-tb .tp-play{transform:scale(.5)}'
            + '.sl-kb{flex:1;display:flex;flex-direction:column;justify-content:center;gap:30px;padding:clamp(28px,3vw,48px);border-radius:20px;background:#f5f6f8}.sl-kb span{display:flex;flex-direction:column}.sl-kb b{font-size:clamp(44px,4.4vw,68px);font-weight:700;line-height:1.05;letter-spacing:-.04em;color:var(--g9);font-variant-numeric:tabular-nums}.sl-kb i{margin-top:8px;font-style:normal;font-size:15px;color:var(--g6)}.sl-kb.art{display:grid;place-items:center;background:color-mix(in srgb,var(--c) 80%,#fff)}.sl-kb.art svg{width:80%;height:auto}'
            + '.tp-play{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:rgba(0,0,0,.5);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85)}.tp-play::after{content:"";position:absolute;left:19px;top:15px;border-left:14px solid #fff;border-top:9px solid transparent;border-bottom:9px solid transparent}'
            // 연락 · 바닥 (마지막 장 위로 올라옴)
            + '.tp-ctas{position:relative;z-index:1;padding:clamp(56px,8vh,80px) 0;background:#f6f6f6}.tp-ctas-in{display:flex;align-items:center;justify-content:space-between;gap:32px;width:var(--tw);max-width:1000px;margin:0 auto}'
            + '.tp-ctat{font-size:clamp(24px,2.3vw,32px);font-weight:700;line-height:1.45;letter-spacing:-.02em;color:var(--g8)}.tp-ctab{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}'
            + '.tp-sb{display:inline-flex;align-items:center;height:48px;padding:0 18px;border-radius:12px;font-size:17px;font-weight:600}.tp-sb.l{background:rgba(100,168,255,.15);color:var(--bl)!important}.tp-sb.p{background:var(--bl);color:#fff!important}'
            + '.tp-me{flex:none;width:clamp(140px,15vw,210px);aspect-ratio:1;border-radius:40px;object-fit:cover}'
            + '.tp-foot{position:relative;z-index:1;padding:44px 0 90px;background:var(--g8);color:#d1d6db;font-size:14px}.tp-foot-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 32px;width:var(--tw);max-width:1000px;margin:0 auto}.tp-foot b{margin-right:4px;font-size:16px;color:#fff}'
            + '@supports (corner-shape:squircle){.tp-sd,.tp-me{corner-shape:squircle}.tp-sd{border-radius:32px}.tp-me{border-radius:64px}}'
            // 화면 폭별: 1100 이하 = 탭 좁게 · 900 이하 = 상단 탭 숨김 · 760 이하 = 장 여백 줄이고 위아래로
            + '@media(max-width:1100px){.tp-tab{padding:0 9px;font-size:14px}}@media(max-width:1100px){.ch-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.ch-cy ol{grid-template-columns:repeat(4,minmax(0,1fr))}.ch-cy li:nth-child(4)::after{display:none}}@media(max-width:960px){.pj-pt{grid-template-columns:1fr}.pj-pt>h4,.pj-pt>span{display:none}.pj-pt>.pj-c{padding-top:4px;border-top:0}.cv-cy ol{grid-template-columns:repeat(4,minmax(0,1fr))}.cv-cy li:nth-child(4)::after{display:none}.sl-top{grid-template-columns:1fr}.pj-ms.sl-kpi{flex-wrap:wrap}.pj-cols.two{grid-template-columns:1fr}.sl-bds,.sl-vis.bdv{overflow-x:auto}.bd{min-width:680px}.sl-grid{grid-template-columns:1fr;gap:28px}.tp-sd.sl{min-height:0}.sl-vis{position:static;height:auto}.sl-main{flex:none;height:320px}.sl-kb{flex:none}}'
            + '@media(max-width:900px){.tp-ntabs{justify-content:flex-start}}@media(max-width:760px){.tp-nav .gtabs{gap:20px}.tp-nav .gt{font-size:15px}.tp-logo{font-size:16px}}'
            + '@media(max-width:760px){body.tp{--tw:calc(100vw - 32px);--tw2:calc(100vw - 32px);--tw3:calc(100vw - 32px);--tws:calc(100vw - 24px)}'
            + '.tp-deck{padding:116px 0 32px}.tp-sd{margin-bottom:16px;border-radius:20px}.tp-sd-in{padding:28px 20px}.tp-sd.sl{padding:20px 20px 24px}.sl-grid{padding-top:22px}.sl-main{height:240px}.sl-kb{gap:18px}.ch{padding-top:48px}.ch-cards{grid-template-columns:1fr;gap:14px}.pj-ms.sl-kpi{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.sl-kpi span{min-width:0}.ch-cy ol{grid-template-columns:repeat(2,minmax(0,1fr))}.ch-cy li::after{display:none}.vw-sc{padding:12px 0 96px}.vw-nav{max-width:none;padding:0 14px}.vw-nav span{display:none}.vw .tp-sd.sl{min-height:0}.cv-ix[style*="--c:1"] .cv-cl{grid-template-columns:1fr}.cv-cy ol{grid-template-columns:repeat(2,minmax(0,1fr))}.cv-cy li::after{display:none}.cv-ix{grid-template-columns:1fr}.cv-r{grid-template-columns:20px 56px minmax(0,1fr)}.cv-th{width:56px;height:40px}.cv-m{display:none}.cv-ks{gap:16px 28px}.pj-ms{gap:6px}.pj-ms span{padding:10px 12px}.pj-ms b{font-size:19px}.pj-shots{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.pj-shots::-webkit-scrollbar{display:none}.pj-sh,.pj-shots[style*="--n:1"] .pj-sh{flex:0 0 78%;height:150px;scroll-snap-align:start}.pj-shots[style*="--n:1"] .pj-sh{flex-basis:100%}'
            + '.tp-pfs{grid-template-columns:1fr;gap:22px}.tp-pf{display:grid;grid-template-columns:112px minmax(0,1fr);column-gap:12px;align-items:baseline}.tp-pf b{grid-row:span 2;font-size:34px}.tp-pf span{margin-top:0}.tp-pf i{margin-top:2px}.tp-path ol{grid-auto-flow:row;grid-template-columns:1fr}.tp-path li{padding:0 0 22px 22px;border-top:0;border-left:2px solid var(--g2)}.tp-path li::before{left:-6px;top:3px}.tp-path li.now{border-left-color:var(--bl)}.tp-path li>b{margin-top:2px}'
            + '.tp-ctas-in{flex-direction:column-reverse;align-items:flex-start}}'
            + '.tp-sd{}@media(prefers-reduced-motion:reduce){.tp-wrow,.tp-cue,.js .tp-hc,.js .tp-aw,.js .tp-al2{animation:none}.tp-wall,.tp-hb{transition:none}.tp-hb{opacity:1;transform:none}}';
          // ── /projects-airbridge (2026-10-05 사용자 요청: airbridge.io/ko/case-studies 그대로 — 상품 카드 · 필터 라벨) · 카드 누르면 같은 보기 창
          //    히어로(큰 제목 · 한 줄) → 필터 두 줄(분야 = 챕터 · 회사, 개수 · 로고) → 카드 3열(16:10 브랜드 색 커버 = 로고·회사 | 소재 이미지 · 제목 22 · 성과 숫자 2 · 자세히 보기 →) → 문의 블록
          if (d.page === "projects-airbridge") {
            var ABRAND = { "880f2595-41db-43f8-8fc4-d7b2b7a82ed9": ["#141a26", "#fff"], "df04e065-83b0-4fe3-9d89-c08103b1f3fc": ["#ffe4ec", "#191f28"], "9a240366-d8d0-47b3-a1fd-3259532182b3": ["#e8edf6", "#191f28"], "64000e6d-362f-4ed7-a9e6-e64be85cd95a": ["#6f4cf6", "#fff"], "6add97f4-49f2-44fe-b6bb-a70f6a0ee024": ["#fbeae3", "#191f28"] };
            // 카드 커버 색(Airbridge처럼 카드마다 다르게 · 진한 색과 파스텔 섞어서) — [바탕, 글자]
            var ACOVER = { "77afd48a-668b-4ab1-b385-32fa41400211": ["#141a26", "#fff"], "dff32975-e504-47e3-8ee1-744f2267ac91": ["#e6f3ee", "#191f28"], "60f3fcee-e8b2-4499-b7d1-71e4f91ad2f5": ["#fff0de", "#191f28"],
              "0a3aea35-ccc9-4018-a7a6-e383c303f928": ["#ffe4ec", "#191f28"], "3080bc75-d773-490f-9a02-35d83886b418": ["#e6edfc", "#191f28"], "b0aa1d32-82d9-44bc-897d-b558a425c98c": ["#111214", "#fff"],
              "731ea8fe-9bb7-41ce-8cc1-687f77f9c49c": ["#eef1f5", "#191f28"], "8fe4e187-9052-4737-9d1b-d0a158d9e156": ["#1d2030", "#fff"], "199815d6-356c-4959-8219-6c9ea7615102": ["#efe9ff", "#191f28"],
              "4d333686-6daa-4c8e-9cd7-3e8309ef9900": ["#e2f6e9", "#191f28"], "e5bb7edf-a48d-4752-a0b4-c05df7903051": ["#fff6d8", "#191f28"], "43ab6811-42cf-4a1f-afca-62bfd67b17f9": ["#f3efff", "#191f28"],
              "53845c2b-3618-4e8d-968c-1edfabdf4912": ["#6f4cf6", "#fff"], "574f26d3-1fff-49fb-a302-b8c12253df61": ["#e9e1ff", "#191f28"], "2c1ddb7a-e1a3-4adb-a18e-e1b43ad8f731": ["#0d4fd6", "#fff"],
              "2380b3b4-8dba-4b9d-9f96-38568a79936b": ["#2b1d22", "#fff"], "5afefe01-835b-48eb-9568-e6f51f6650ce": ["#fdeaf0", "#191f28"], "ea1d35c1-b9f4-4420-8d35-b26ec4709a10": ["#ffe8de", "#191f28"], "e68c8938-fbb0-4a88-a9a1-dbb3d8c71243": ["#17171a", "#fff"] };
            var abCos = []; abItems.forEach(function (a) { if (a.it.co && abCos.indexOf(a.it.co) < 0) abCos.push(a.it.co); });
            var cntBy = function (key, v) { return abItems.filter(function (a) { return key === "ch" ? a.g.id === v : a.it.co === v; }).length; };
            var chip = function (k, v, label, n, lg) { return '<button class="ab-chip' + (v === "*" ? ' on' : '') + '" type="button" data-k="' + k + '" data-v="' + ea(v) + '">' + (lg ? '<img src="' + ea(lg) + '" alt="">' : '') + '<span>' + esc(label) + '</span><i>' + n + '</i></button>'; };
            var filters = '<div class="ab-fl"><div class="ab-row"><span class="ab-rl">분야</span>' + chip("ch", "*", "전체", abItems.length) + TS.map(function (x) { return chip("ch", x.g.id, x.g.id === "t-recent" ? "NOW · " + nowCoName : x.g.ko, cntBy("ch", x.g.id)); }).join("") + '</div>'
              + '<div class="ab-row"><span class="ab-rl">회사</span>' + chip("co", "*", "전체", abItems.length) + abCos.map(function (co) { return chip("co", co.id, dispName(co), cntBy("co", co), co.logo); }).join("") + '</div></div>';
            var abCard = function (a) {
              var it = a.it, co = it.co || {}, br = ACOVER[it.w.id] || ABRAND[co.id] || ["#f2f4f6", "#191f28"], mets = it.mets.slice(0, 2);
              var bs = PPT_BOARDS_OF[it.w.id] || [], b = bs.length && PPT_BOARD[bs[0]], f = CARD_TH[it.w.id] || (b && b.i.length ? b.i[0][0] : ""), src = f ? PPT_IMG + f + ".jpg" : (it.main ? it.main.src : "");
              var shot = src ? '<span class="ab-shot"><img src="' + ea(src) + '" alt="" loading="lazy" decoding="async"></span>' : (it.m0 ? '<span class="ab-big"><b>' + esc(it.m0.value) + '</b>' + esc(it.m0.label || "") + '</span>' : '');
              return '<button class="ab-card" type="button" data-vw="' + a.k + '" data-ch="' + ea(a.g.id) + '" data-co="' + ea(co.id || "") + '" aria-label="' + ea(it.title) + ' 자세히 보기">'
                + '<span class="ab-cv" style="--bg:' + br[0] + ';--fg:' + br[1] + '"><span class="ab-br">' + (co.logo ? '<img src="' + ea(co.logo) + '" alt="">' : '') + '<b>' + esc(dispName(co)) + '</b><small>' + esc(a.g.id === "t-recent" ? "NOW" : a.g.ko) + '</small></span>' + shot + '</span>'
                + '<span class="ab-bd"><b class="ab-t">' + esc(it.title) + '</b>'
                + '<span class="ab-ms">' + mets.map(function (m) { return '<span><b>' + esc(m.value) + '</b>' + esc(m.label || "") + '</span>'; }).join("") + '</span>'
                + '<span class="ab-go">자세히 보기<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></button>';
            };
            var abNav = '<header class="tp-nav ab-nav"><div class="tp-nav-in"><button class="tp-logo" type="button" data-tgo="tp-top">' + esc(nameEn || nameKo || "Portfolio") + '</button>' + gtabs("projects", secLinks(true)) + '</div></header>';
            var abMain = '<section class="ab-hero" id="tp-top"><h1>' + esc(txt("abTitle", "프로젝트")) + '</h1><p>' + esc(txt("abSub", abCos.length + "개 회사 · " + abItems.length + "개 프로젝트의 성과")) + '</p></section>'
              + '<section class="ab-wrap">' + filters + '<div class="ab-cnt-r"><span class="ab-cnt">' + abItems.length + '개 프로젝트</span></div>'
              + '<div class="ab-grid">' + abItems.map(abCard).join("") + '</div><p class="ab-empty" hidden>조건에 맞는 프로젝트가 없어요.</p></section>'
              + '<section class="ab-cta"><div><h2>' + esc(txt("abCtaT", "함께 성과를 만들어 볼까요?")) + '</h2><p>' + esc(txt("abCtaS", "퍼포먼스 · CRM · 데이터 · AX까지, 편하게 연락 주세요.")) + '</p><div class="ab-cta-b"><a class="ab-btn pri" href="' + ea(mail) + '" target="_top">연락하기 →</a><a class="ab-btn" href="' + ea(homeUrl) + '" target="_top">이력서 보기</a></div></div></section>';
            var ABCSS = 'body.ab{background:#fff}.ab .tp-nav{background:rgba(255,255,255,.96);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--g2)}.ab .tp-logo{color:var(--g9)}.ab .tp-nav .gt{color:var(--g5)}.ab .tp-nav .gt:hover,.ab .tp-nav .gt.on{color:var(--g9)}'
              + '.ab-hero{padding:clamp(150px,18vh,190px) 24px clamp(64px,9vh,100px);text-align:center}.ab-hero h1{font-size:clamp(40px,4.4vw,60px);font-weight:700;line-height:1.2;letter-spacing:-.035em;color:#171716}.ab-hero p{margin-top:16px;font-size:clamp(17px,1.4vw,20px);color:#4b4b4a}'
              + '.ab-wrap{width:min(1216px,calc(100vw - 48px));margin:0 auto}'
              // 필터: 줄 이름(분야 · 회사) + 둥근 칩(개수 · 회사 로고) · 선택 = 진한 칩 / 회사 줄 선택 = 연한 파랑
              + '.ab-fl{display:flex;flex-direction:column;gap:10px}.ab-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.ab-rl{width:44px;font-size:13px;font-weight:600;color:var(--g5)}'
              + '.ab-chip{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 14px 0 16px;border:1px solid #ececec;border-radius:999px;background:rgba(0,0,0,.03);font-size:14px;font-weight:500;color:#171716;transition:background .2s,border-color .2s,color .2s,box-shadow .2s}.ab-chip:hover{background:rgba(0,0,0,.06)}'
              + '.ab-chip img{width:20px;height:20px;margin-left:-6px;border-radius:6px;background:#fff;object-fit:contain;box-shadow:0 0 0 1px rgba(0,0,0,.06)}.ab-chip i{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:rgba(0,0,0,.06);font-style:normal;font-size:11.5px;font-weight:600;line-height:20px;text-align:center;color:var(--g6);font-variant-numeric:tabular-nums}'
              + '.ab-chip[data-k="ch"].on{border-color:transparent;background:#191f28;color:#fff;box-shadow:0 6px 16px -8px rgba(25,31,40,.6)}.ab-chip[data-k="ch"].on i{background:rgba(255,255,255,.18);color:#fff}'
              + '.ab-chip[data-k="co"].on{border-color:rgba(49,130,246,.35);background:var(--bl1);color:var(--bl)}.ab-chip[data-k="co"].on i{background:rgba(49,130,246,.14);color:var(--bl)}'
              + '.ab-cnt-r{display:flex;justify-content:flex-end;margin:28px 0 14px}.ab-cnt{font-size:14px;font-weight:500;color:var(--g5);font-variant-numeric:tabular-nums}'
              // 카드: 테두리 · 둥근 18 · 연회색 바탕 · 16:10 커버(브랜드 색 · 왼쪽 로고·회사 | 오른쪽 소재) · 제목 22 · 숫자 2 · 자세히 보기 →
              + '.ab-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}.ab-card{display:flex;flex-direction:column;min-width:0;border:1px solid #e8e8e8;border-radius:18px;overflow:hidden;background:#f7f7f7;text-align:left;transition:box-shadow .3s}.ab-card:hover{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}.ab-card[hidden]{display:none}'
              + '.ab-cv{position:relative;display:block;aspect-ratio:16/10;overflow:hidden;background:var(--bg);color:var(--fg)}.ab-cv>*{transition:transform .3s}.ab-card:hover .ab-cv>*{transform:scale(1.05)}'
              + '.ab-br{position:absolute;left:8%;top:50%;z-index:1;display:flex;flex-direction:column;align-items:flex-start;gap:10px;max-width:44%;transform:translateY(-50%)}.ab-card:hover .ab-br{transform:translateY(-50%) scale(1.05)}.ab-br img{width:44px;height:44px;border-radius:12px;background:#fff;object-fit:contain;box-shadow:0 6px 16px -8px rgba(0,0,0,.35)}.ab-br b{font-size:22px;font-weight:800;line-height:1.2;letter-spacing:-.03em;word-break:keep-all}.ab-br small{font-size:12.5px;font-weight:600;opacity:.62;word-break:keep-all}'
              + '.ab-shot{position:absolute;right:6%;top:9%;bottom:9%;display:flex;align-items:center;justify-content:flex-end;width:48%}.ab-shot img{max-width:100%;max-height:100%;width:auto;height:auto;border-radius:10px;background:#fff;box-shadow:0 18px 36px -14px rgba(0,0,0,.45)}'
              + '.ab-big{position:absolute;right:8%;top:50%;display:flex;flex-direction:column;align-items:flex-end;max-width:46%;font-size:13px;font-weight:600;text-align:right;opacity:.8;transform:translateY(-50%)}.ab-card:hover .ab-big{transform:translateY(-50%) scale(1.05)}.ab-big b{font-size:clamp(40px,3.6vw,56px);font-weight:800;line-height:1;letter-spacing:-.04em}'
              + '.ab-bd{flex:1;display:flex;flex-direction:column;padding:24px}.ab-t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:22px;font-weight:700;line-height:1.5;letter-spacing:-.02em;color:#171716;text-wrap:balance;word-break:keep-all}'
              + '.ab-ms{display:flex;flex-wrap:wrap;gap:8px 24px;min-height:3.5rem;margin-top:12px}.ab-ms span{display:flex;flex-direction:column;max-width:46%;font-size:13px;line-height:1.35;color:#5f5f5e;word-break:keep-all}.ab-ms b{font-size:18px;font-weight:600;line-height:1.4;color:#171716;font-variant-numeric:tabular-nums}'
              + '.ab-go{display:inline-flex;align-items:center;gap:6px;margin-top:auto;padding-top:20px;font-size:14px;font-weight:500;color:var(--bl)}.ab-go svg{width:16px;height:16px;transition:transform .3s}.ab-card:hover .ab-go svg{transform:translateX(4px)}'
              + '.ab-empty{padding:80px 0;text-align:center;font-size:16px;color:var(--g5)}'
              + '.ab-cta{width:min(1216px,calc(100vw - 48px));margin:clamp(80px,12vh,128px) auto clamp(64px,8vh,96px);padding:clamp(56px,8vw,96px) 24px;border-radius:24px;background:linear-gradient(135deg,#f3f6fb,#eef1f6);text-align:center}.ab-cta h2{font-size:clamp(28px,3vw,44px);font-weight:700;letter-spacing:-.03em;color:#171716}.ab-cta p{margin-top:14px;font-size:18px;color:#4b4b4a}'
              + '.ab-cta-b{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:32px}.ab-btn{display:inline-flex;align-items:center;height:48px;padding:0 22px;border-radius:12px;background:#fff;font-size:16px;font-weight:600;color:var(--g8);box-shadow:inset 0 0 0 1px var(--g2)}.ab-btn.pri{background:var(--bl);color:#fff;box-shadow:none}'
              + '@media(max-width:1100px){.ab-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}}@media(max-width:680px){.ab-wrap,.ab-cta{width:calc(100vw - 32px)}.ab-grid{grid-template-columns:1fr;gap:18px}.ab-row{flex-wrap:nowrap;overflow-x:auto;margin:0 -16px;padding:0 16px;scrollbar-width:none}.ab-row::-webkit-scrollbar{display:none}.ab-chip{flex:none}.ab-rl{flex:none}.ab-hero{padding-top:120px}.ab-br b{font-size:20px}}';
            return '<!doctype html><html lang="ko"><head><script>document.documentElement.classList.add("js")<\/script><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>'
              + '<title>' + esc(nameKo || nameEn || "포트폴리오") + ' — Projects</title><link rel="icon" href="data:,"/>' + fontHead
              + '<style>' + PSCSS + fontVars + TCSS + ABCSS + '</style></head><body class="tp ab ft-' + FKEY + '"' + (d.hostStudio ? ' data-host="studio"' : '') + '>'
              + abNav + '<main>' + abMain + '</main>' + foot + viewer
              + '<div class="tp-md" hidden role="dialog" aria-modal="true" aria-label="크게 보기"><div class="tp-md-bg" data-md-x></div><div class="tp-md-in"></div><button class="tp-md-nav prev" type="button" aria-label="이전 그림">‹</button><button class="tp-md-nav next" type="button" aria-label="다음 그림">›</button><button class="tp-md-x" type="button" data-md-x aria-label="닫기">✕</button><span class="tp-md-cnt"></span></div>'
              + '<script>(' + tpRuntime.toString() + ')();<\/script></body></html>';
          }
          return '<!doctype html><html lang="ko"><head><script>document.documentElement.classList.add("js")<\/script><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>'
            + '<title>' + esc(nameKo || nameEn || "포트폴리오") + ' — Projects (test)</title><link rel="icon" href="data:,"/>' + fontHead
            + '<style>' + PSCSS + fontVars + TCSS + '</style></head><body class="tp ft-' + FKEY + '"' + (d.hostStudio ? ' data-host="studio"' : '') + '>'
            + nav + '<main>' + hero + bentoS + cta + '</main>' + foot + viewer
            + '<div class="tp-md" hidden role="dialog" aria-modal="true" aria-label="크게 보기"><div class="tp-md-bg" data-md-x></div><div class="tp-md-in"></div><button class="tp-md-nav prev" type="button" aria-label="이전 그림">‹</button><button class="tp-md-nav next" type="button" aria-label="다음 그림">›</button><button class="tp-md-x" type="button" data-md-x aria-label="닫기">✕</button><span class="tp-md-cnt"></span></div>'
            + '<button class="ps-top-b" type="button" data-goto="*" aria-label="맨 위로">↑</button><div class="pd" role="dialog" aria-modal="true" aria-label="프로젝트 상세" aria-hidden="true"><div class="pd-prog" aria-hidden="true"><i></i></div><div class="pd-top"><span class="pd-ttl">' + esc(txt("ppEyebrow", "Selected Projects")) + '</span><span><span class="pd-no"></span><button class="pd-x" type="button" data-close>← 목록으로</button></span></div><div class="pd-in"></div></div>'
            + '<script>(' + psRuntime.toString() + ')();(' + tpRuntime.toString() + ')();<\/script></body></html>';
        };
        // 테스트 페이지 동작: 상단 바 · 첫 화면 문장 전환(단어 슬롯) · 상단 분류 탭 표시·이동 · '한눈에' 숫자 → 그 프로젝트 장 (숨은 탭에서도 돌게 타이머 기반)
        var tpRuntime = function () {
          "use strict";
          var body = document.body, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, still = body.hasAttribute("data-still");
          var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
          var later = function (f, ms) { return setTimeout(f, ms || 0); };
          var show = function (el) { el.classList.add("in"); };
          var io = "IntersectionObserver" in window && !reduce && !still ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" }) : null;
          $$(".tp-rv").forEach(function (el) { if (io) io.observe(el); else show(el); });
          // 첫 화면: 문장 A → 4.2초 뒤 문장 B · B에 {w}가 있으면 단어 슬롯이 2초마다 위로 넘어감
          var slot = $(".tp-slot"), words = [], cur = slot ? slot.querySelector("i") : null, wk = 0;
          try { words = JSON.parse(slot ? (slot.getAttribute("data-w") || "[]") : "[]"); } catch (e) {}
          var fit = function (el) { if (slot && el) slot.style.width = Math.ceil(el.getBoundingClientRect().width) + "px"; };
          fit(cur); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(cur); });
          var swap = function () {
            if (!slot || !cur || words.length < 2) return;
            wk = (wk + 1) % words.length;
            var n = document.createElement("i"), old = cur; n.className = "nx"; n.textContent = words[wk]; slot.appendChild(n); fit(n); cur = n;
            later(function () { old.classList.add("out"); n.classList.remove("nx"); }, 30);
            later(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 800);
          };
          var hh = $(".tp-hh");
          later(function () { if (hh) hh.classList.add("sw"); if (!reduce && !still) setInterval(swap, 2000); }, reduce || still ? 0 : 4200);
          // 로딩: 벽(배경)이 크게에서 제자리로 나타나고 버튼이 올라옴
          var hero = $(".tp-hero"), ld = function () { if (hero) hero.classList.add("ld"); };
          if (reduce || still) ld(); else later(ld, 2300);
          // 스크롤: 상단 바(조금만 내려도 흰 바탕) · 지금 보고 있는 장의 분류 탭 표시 · 탭·버튼 누르면 그 장으로 (움직임·스크롤 가로채기 없음)
          var nav = $(".tp-nav"), tabs = $$(".tp-tab"), sds = $$(".tp-gl, .ch");
          var spy = function () {
            var lim = innerHeight * .4, m = "";
            sds.forEach(function (sd) { if (sd.getBoundingClientRect().top <= lim) m = sd.getAttribute("data-m"); });
            tabs.forEach(function (t) { t.classList.toggle("on", t.getAttribute("data-sec") === m); });
          };
          var onSc = function () { if (nav) nav.classList.toggle("solid", scrollY > 8); spy(); };
          addEventListener("scroll", onSc, { passive: true }); addEventListener("resize", onSc); onSc();
          // 장 맞춤: 넓은 화면(>960)에서 장 내용이 화면(상단 바 제외)보다 길면 .sl-in을 원래 폭 고정한 채 비율대로 줄임(zoom, 최소 .9 — 글씨가 너무 작아지지 않게, 가운데) — PPT 보기처럼 한 장이 한눈에
          var fit = function () {
            $$(".sl-in").forEach(function (x) {
              if (!x.offsetParent) return; // 보기 창에서 보이는 장만
              x.style.zoom = x.style.width = x.style.margin = ""; if (innerWidth <= 960) return;
              var sd = x.parentNode, cs = getComputedStyle(sd), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom), av = innerHeight - 140 - pad, h = x.scrollHeight, w = x.clientWidth;
              if (h > av + 4) { x.style.width = w + "px"; x.style.margin = "0 auto"; x.style.zoom = Math.max(.9, av / h).toFixed(3); } // 폭을 고정한 채 줄여 판·글이 같은 비율로(가운데)
            });
          };
          fit(); addEventListener("resize", fit); addEventListener("load", fit); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
          $$(".sl-in img").forEach(function (im) { if (!im.complete) im.addEventListener("load", function () { clearTimeout(fit.t); fit.t = setTimeout(fit, 120); }); });
          var go = function (id) {
            var el = id === "tp-top" ? null : document.getElementById(id === "tp-next" ? "tp-bento" : id);
            scrollTo({ top: el ? Math.round(el.getBoundingClientRect().top + scrollY - (el.id === "tp-bento" ? 0 : 120)) : 0, behavior: reduce ? "auto" : "smooth" });
          };
          // 모달: 그림 = 같은 장(.sl)의 그림끼리 넘기기 · 누르면 원본 크기 / 영상 = 유튜브 재생창(쇼츠는 세로), 유튜브가 아니면(노션 등) 새 탭 그대로 · Esc·바깥·✕ 닫기(재생 멈춤)
          // 보기 창: 카드·숫자·타일 해시(goto-card)로 열기 · 이전/다음(끝에서 처음으로) · 지금 장 주소(#p-작업 id)를 부모(view.html)에 알림
          var vw = $(".vw"), vsc = vw && vw.querySelector(".vw-sc"), pgs = $$(".vw-pg"), vk = -1;
          var post = function (m) { try { if (parent && parent !== window) parent.postMessage(m, "*"); } catch (e) {} };
          var vwShow = function (k) {
            var n = pgs.length; if (!n) return; vk = ((k % n) + n) % n;
            pgs.forEach(function (p, j) { p.hidden = j !== vk; }); vsc.scrollTop = 0;
            var tt = function (j) { return pgs[((j % n) + n) % n].getAttribute("data-t") || ""; };
            vw.querySelector(".vw-cnt").textContent = (vk < 9 ? "0" : "") + (vk + 1) + " / " + (n < 10 ? "0" : "") + n;
            var nb = vw.querySelectorAll(".vw-nav span"); nb[0].textContent = "이전 · " + tt(vk - 1).split(/\s+[—–]\s+/)[0]; nb[1].textContent = "다음 · " + tt(vk + 1).split(/\s+[—–]\s+/)[0];
            fit(); $$("img", pgs[vk]).forEach(function (im) { if (!im.complete) im.addEventListener("load", function () { clearTimeout(fit.t); fit.t = setTimeout(fit, 120); }); });
            post({ klio: "card", id: pgs[vk].getAttribute("data-wid") || "" });
          };
          var vwOpen = function (k) { if (!vw) return; vw.hidden = false; body.style.overflow = "hidden"; vwShow(k); later(function () { vw.classList.add("on"); }, 10); };
          var vwClose = function () { if (!vw || vw.hidden) return; vw.hidden = true; vw.classList.remove("on"); body.style.overflow = ""; post({ klio: "card", id: "" }); };
          var vwOf = function (el) { var p = el && el.closest && el.closest(".vw-pg"); return p ? +p.getAttribute("data-k") : -1; };
          addEventListener("keydown", function (e) { if (!vw || vw.hidden || (md && !md.hidden)) return; if (e.key === "Escape") vwClose(); else if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); vwShow(vk + (e.key === "ArrowRight" ? 1 : -1)); } });
          if (vsc) { var sx = null, sy = null; vsc.addEventListener("touchstart", function (e) { var p = e.touches[0]; sx = p.clientX; sy = p.clientY; }, { passive: true }); vsc.addEventListener("touchend", function (e) { if (sx == null) return; var p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy; sx = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && !(e.target.closest && e.target.closest(".sl-bds,.pj-vg,.bd"))) vwShow(vk + (dx < 0 ? 1 : -1)); }, { passive: true }); }
          var md = $(".tp-md"), mdIn = md && md.querySelector(".tp-md-in"), mdCnt = md && md.querySelector(".tp-md-cnt"), mdG = [], mdK = 0;
          var ytId = function (u) { var m = String(u || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/); return m ? m[1] : null; };
          var mdOpen = function () { md.hidden = false; body.style.overflow = "hidden"; later(function () { md.classList.add("on"); }, 10); };
          var mdClose = function () { if (!md || md.hidden) return; md.hidden = true; md.className = "tp-md"; mdIn.innerHTML = ""; body.style.overflow = vw && !vw.hidden ? "hidden" : ""; };
          var mdShow = function (k) { var n = mdG.length; mdK = ((k % n) + n) % n; mdIn.innerHTML = '<img class="tp-md-im" src="' + mdG[mdK] + '" alt="">'; mdIn.scrollTop = mdIn.scrollLeft = 0; mdCnt.textContent = n > 1 ? (mdK + 1) + " / " + n : ""; md.classList.toggle("multi", n > 1); };
          var zoomImg = function (el) { var sc = el.closest(".sl") || el.closest(".tp-sd") || document; mdG = $$("[data-zoom]", sc).map(function (x) { return x.getAttribute("data-zoom"); }); md.className = "tp-md img"; mdShow(Math.max(0, mdG.indexOf(el.getAttribute("data-zoom")))); mdOpen(); };
          var playVid = function (u) { var id = ytId(u); if (!id || !md) return false; md.className = "tp-md vid"; mdIn.innerHTML = '<div class="tp-md-v' + (/\/shorts\//.test(u) ? ' sh' : '') + '"><iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1" title="영상" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'; mdCnt.textContent = ""; mdOpen(); return true; };
          addEventListener("keydown", function (e) { if (!md || md.hidden) return; if (e.key === "Escape") { mdClose(); e.stopPropagation(); } else if (md.classList.contains("multi") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); mdShow(mdK + (e.key === "ArrowRight" ? 1 : -1)); } }, true);
          addEventListener("message", function (e) { var m = e.data; if (!m || m.klio !== "goto-card" || typeof m.id !== "string") return; var pg = pgs.filter(function (x) { return x.getAttribute("data-wid") === m.id; })[0]; if (pg) later(function () { vwOpen(+pg.getAttribute("data-k")); }, 120); });
          // /projects-airbridge 필터: 분야(챕터) · 회사 칩 — 둘 다 맞는 카드만 · 개수 · 없으면 안내
          var abF = { ch: "*", co: "*" }, abApply = function () {
            var n = 0; $$(".ab-card").forEach(function (c) { var ok = (abF.ch === "*" || c.getAttribute("data-ch") === abF.ch) && (abF.co === "*" || c.getAttribute("data-co") === abF.co); c.hidden = !ok; if (ok) n++; });
            var cn = $(".ab-cnt"); if (cn) cn.textContent = n + "개 프로젝트"; var em = $(".ab-empty"); if (em) em.hidden = n > 0;
            $$(".ab-chip").forEach(function (x) { x.classList.toggle("on", abF[x.getAttribute("data-k")] === x.getAttribute("data-v")); });
          };
          document.addEventListener("click", function (e) {
            var t = e.target, b;
            if (!t.closest) return;
            if ((b = t.closest(".ab-chip"))) { abF[b.getAttribute("data-k")] = b.getAttribute("data-v"); abApply(); return; }
            if (md && !md.hidden) {
              if (t.closest("[data-md-x]")) { mdClose(); return; }
              if ((b = t.closest(".tp-md-nav"))) { mdShow(mdK + (b.classList.contains("next") ? 1 : -1)); return; }
              if ((b = t.closest(".tp-md-im"))) { b.classList.toggle("big"); return; }
              if (t === mdIn) { mdClose(); return; }
            }
            if ((b = t.closest("[data-v]"))) { if (playVid(b.getAttribute("data-v"))) e.preventDefault(); return; }
            if ((b = t.closest("[data-vw]"))) { vwOpen(+b.getAttribute("data-vw")); return; }
            if ((b = t.closest("[data-vw-step]"))) { vwShow(vk + +b.getAttribute("data-vw-step")); return; }
            if (t.closest("[data-vw-x]")) { vwClose(); return; }
            if ((b = t.closest("[data-zoom]"))) { if (md) { e.preventDefault(); zoomImg(b); } return; }
            if ((b = t.closest("a[data-gx='projects']")) && !body.hasAttribute("data-host")) { e.preventDefault(); go("tp-top"); return; }
            if ((b = t.closest("[data-tgo]"))) { e.preventDefault(); go(b.getAttribute("data-tgo")); return; }
            if ((b = t.closest("[data-go]")) && vwOf(document.getElementById(b.getAttribute("data-go"))) >= 0) { e.preventDefault(); vwOpen(vwOf(document.getElementById(b.getAttribute("data-go")))); return; }
            if ((b = t.closest("[data-go]"))) { e.preventDefault(); go(b.getAttribute("data-go")); var pi = b.getAttribute("data-pi"), pe = pi != null && $('.sl[data-pi="' + pi + '"]'); if (pe) { pe.classList.remove("hl"); later(function () { pe.classList.add("hl"); }, reduce ? 0 : 700); later(function () { pe.classList.remove("hl"); }, 2600); } return; }
            if ((b = t.closest(".tp-tab"))) { go("tp-" + b.getAttribute("data-sec")); return; }
            if ((b = t.closest(".sl-tb[data-src]"))) { var g = b.closest(".sl-g"), mn = g && g.querySelector(".sl-main"), src = b.getAttribute("data-src"); if (mn) { mn.classList.remove("yt"); mn.href = src; var pl = mn.querySelector(".tp-play"); if (pl) pl.remove(); mn.querySelector("img").src = src; $$(".sl-tb", g).forEach(function (x) { x.classList.toggle("on", x === b); }); } return; }
          });
        };
        if (d.page === "projects-test" || d.page === "projects-airbridge") return tossPage();
        return '<!doctype html><html lang="ko"><head><script>document.documentElement.classList.add("js")<\/script><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>'
          + '<title>' + esc(nameKo || nameEn || "포트폴리오") + ' — Projects</title><link rel="icon" href="data:,"/>' + fontHead
          + '<style>' + PSCSS + fontVars + '</style></head><body' + (d.hostStudio ? ' data-host="studio"' : '') + ' class="ft-' + FKEY + '">'
          + '<header class="ps-top"><a class="ps-back" href="' + esc(homeUrl) + '#projects" target="_top" data-ext>← ' + esc(txt("ppBack", "포트폴리오")) + '</a></header>'
          + '<div class="ps-prog" aria-hidden="true"><i></i></div>'
          + '<main><section class="ps-hero"><div class="ps-hw"><p class="ps-meta"><span>' + esc(txt("ppEyebrow", "Selected Projects")) + '</span>' + (yrTxt ? '<span>' + esc(yrTxt) + '</span>' : '') + '</p>'
          + '<div class="ps-hh"><h1 class="ps-h1' + (shortHead ? ' big' : '') + '">' + headHtml + (shortHead ? '<sup>' + N + '</sup>' : '') + '</h1>' + (subTxt.trim() ? '<p class="ps-sub">' + esc(subTxt) + '</p>' : '') + '</div>'
          + gIndex + '</div>' + marquee + cue + '</section>'
          + body + idxList
          + '<div class="ps-end rv"><p>' + esc(txt("ppEnd", "더 궁금한 점이 있다면")) + '</p><a class="ps-go" href="' + esc(homeUrl) + '#contact" target="_top" data-ext>' + esc(txt("ppEndBtn", "연락하기")) + ' <i>→</i></a></div></main>'
          + (secs.length > 1 ? '<nav class="ps-chips" aria-label="분야로 이동"><span class="ps-pill" aria-hidden="true"></span><button class="ps-chip" type="button" data-goto="*">전체<i>' + N + '</i></button>' + gChipsS + '</nav>' : '')
          + '<button class="ps-top-b" type="button" data-goto="*" aria-label="맨 위로">↑</button><div class="pd" role="dialog" aria-modal="true" aria-label="프로젝트 상세" aria-hidden="true"><div class="pd-prog" aria-hidden="true"><i></i></div><div class="pd-top"><span class="pd-ttl">' + esc(txt("ppEyebrow", "Selected Projects")) + '</span><span><span class="pd-no"></span><button class="pd-x" type="button" data-close>← 목록으로</button></span></div><div class="pd-in"></div></div>'
          + pdT
          + '<script>(' + psRuntime.toString() + ')();<\/script></body></html>';
      }
      var WCSS = ':root{--ink:#1d1d1f;--ink60:rgba(29,29,31,.6);--gray:#86868b;--bd:rgba(29,29,31,.1);--mint:#abdcd1;--beige:#e6e1d5;--sand:#eae6da;--coral:#dd8e6e;--lav:#c3cde4;--font:"Figtree","Pretendard Variable",Pretendard,-apple-system,system-ui,"Apple SD Gothic Neo",sans-serif;--ez:cubic-bezier(.16,1,.3,1);--rc:20px;--rt:14px;--rs:26px;--rk:14px}'
        + '*,*::before,*::after{box-sizing:border-box}html,body{height:100%}body{margin:0;font-family:var(--font);color:var(--ink);background:#efeeea;-webkit-font-smoothing:antialiased;letter-spacing:-.015em;word-break:keep-all;overflow-wrap:break-word;overflow:hidden;transition:background-color 1.2s var(--ez)}a{color:inherit;text-decoration:none}button{font-family:inherit;color:inherit}'
        + '.wh{position:relative;height:100vh;height:100dvh;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;cursor:grab}.wh.grab{cursor:grabbing}'
        // 좌상단: 돌아가기 · 서명 · 번호 / 우상단: 큰 타이틀
        + '.wh-top{position:absolute;left:clamp(18px,3vw,44px);top:clamp(16px,3vh,32px);z-index:400;display:flex;flex-direction:column;align-items:flex-start;gap:16px;cursor:auto}'
        + '.wh-back{display:inline-flex;align-items:center;height:36px;padding:0 15px;border-radius:999px;background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);box-shadow:0 0 0 .5px var(--bd),0 1px 2px rgba(0,0,0,.04);font-size:13px;font-weight:600;transition:background .2s}.wh-back:hover{background:#fff}'
        + '.wh-id{display:flex;align-items:center;gap:14px}.wh-sig{font-family:var(--sgf);font-size:calc(var(--sgfs) * .74);font-weight:var(--sgw);line-height:1;white-space:nowrap}'
        + '.wh-cnt{display:flex;align-items:center;gap:10px;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--gray)}.wh-cnt b{color:var(--ink)}.wh-cnt i{width:32px;height:1px;background:currentColor}'
        + '.wh-head{position:absolute;left:50%;top:clamp(18px,3.2vh,40px);transform:translateX(-50%);z-index:350;width:min(760px,calc(100vw - 480px));text-align:center;pointer-events:none}'
        + '.wh-eye{display:flex;align-items:center;justify-content:center;gap:14px;margin:0;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gray)}.wh-eye i{width:36px;height:1px;background:currentColor;opacity:.55}'
        + '.wh-h1{margin:14px 0 0;font-family:var(--disp);font-size:clamp(30px,min(3.3vw,5.6vh),64px);font-weight:var(--dispw);line-height:1.04;letter-spacing:var(--displs);color:var(--ink);text-wrap:balance}.wh-h1 em{font-style:normal;color:var(--gray)}.ft-editorial .wh-h1{font-weight:400;font-variation-settings:"opsz" 72}.ft-editorial .wh-h1 em{font-style:italic;color:inherit}'
        // 에디토리얼(세리프) 글꼴: 큰 제목은 한 단계 크게 + 마지막 단어 이탤릭, 번호도 세리프
        + '.ft-editorial .wh-cnt{font-family:var(--disp);font-size:21px;font-weight:400;letter-spacing:0}.ft-editorial .wh-cnt b{font-weight:400}.ft-editorial .wh-cnt i{width:40px}'
        // 휠 카드
        + '.wh-ring{position:absolute;left:50%;top:0;width:0;height:0;z-index:2}'
        + '.wh-card{position:absolute;left:calc(var(--cw) / -2);top:calc(var(--ch) / -2);width:var(--cw);height:var(--ch);padding:0;border:0;background:none;cursor:inherit;will-change:transform;-webkit-tap-highlight-color:transparent;font:inherit;color:inherit;outline:none}.wh-card[hidden]{display:none}'
        // 휠 카드 = 상품카드: 흰 카드 안에 썸네일(동심 곡률) + 분야·제목·회사·대표 지표
        + '.wh-face{position:absolute;inset:0;display:flex;flex-direction:column;padding:calc(var(--cw) * .03);border-radius:var(--rc);overflow:hidden;background:#fff;text-align:left;box-shadow:0 0 0 .5px rgba(0,0,0,.07),0 18px 36px -22px rgba(0,0,0,.4),0 2px 6px rgba(0,0,0,.05);transition:box-shadow .5s var(--ez)}'
        + '.wh-card.on .wh-face{box-shadow:0 0 0 .5px rgba(0,0,0,.06),0 34px 60px -28px rgba(0,0,0,.5),0 6px 16px rgba(0,0,0,.08)}.wh-card:focus-visible .wh-face{box-shadow:0 0 0 3px #fff,0 0 0 5px var(--ink)}'
        + '.wh-th{position:relative;flex:none;aspect-ratio:4/3;border-radius:var(--rt);overflow:hidden;background:var(--c) center/cover no-repeat}.wh-th.img{background-color:#f1f0ec}.wh-th.img::before{content:"";position:absolute;inset:-14%;background:var(--img) center/cover no-repeat;filter:blur(18px) saturate(1.15);opacity:.5}.wh-th .th-img{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1}.wh-th .wh-play{z-index:3}.wh-th.img::after{content:"";position:absolute;inset:0;z-index:2;border-radius:inherit;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.08)}.wh-th .cv{position:absolute;inset:4px;width:calc(100% - 8px);height:calc(100% - 8px)}'
        + '.wh-big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.wh-big svg{display:block;width:calc(var(--cw) * .24);height:calc(var(--cw) * .24);stroke-width:1.3}'
        + '.wh-bd{flex:1;min-height:0;display:flex;flex-direction:column;padding:calc(var(--cw) * .05) calc(var(--cw) * .04) calc(var(--cw) * .035)}'
        + '.wh-cat{font-style:normal;font-size:max(9.5px,calc(var(--cw) * .044));font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
        + '.wh-t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:calc(var(--cw) * .018);font-size:max(12.5px,calc(var(--cw) * .07));font-weight:700;line-height:1.3;letter-spacing:-.025em;color:var(--ink)}'
        + '.wh-m{margin-top:calc(var(--cw) * .016);font-size:max(10.5px,calc(var(--cw) * .05));font-weight:500;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
        + '.wh-p{margin-top:auto;padding-top:calc(var(--cw) * .025);font-size:max(10.5px,calc(var(--cw) * .05));font-weight:600;color:var(--ink60);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wh-p b{margin-right:2px;font-size:max(12px,calc(var(--cw) * .076));font-weight:800;letter-spacing:-.035em;color:var(--ink)}'
        + '.wh-play{position:absolute;left:50%;top:50%;z-index:1;width:calc(var(--cw) * .17);height:calc(var(--cw) * .17);transform:translate(-50%,-50%);border-radius:50%;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.75)}.wh-play::after{content:"";position:absolute;left:55%;top:50%;transform:translate(-50%,-50%);border-left:calc(var(--cw) * .045) solid #fff;border-top:calc(var(--cw) * .028) solid transparent;border-bottom:calc(var(--cw) * .028) solid transparent}'
        // 선택 카드 정보 (휠 아치 안쪽)
        + '.wh-info{position:absolute;left:50%;top:var(--info,62vh);transform:translateX(-50%);z-index:360;width:min(560px,calc(100vw - 40px));text-align:center;cursor:auto;-webkit-user-select:text;user-select:text;touch-action:manipulation}'
        + '.wh-meta{margin:0;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink)}.wh-meta span{font-weight:600;letter-spacing:-.005em;text-transform:none;color:var(--gray)}'
        + '.wh-name{margin:10px 0 0;font-size:clamp(24px,min(2.9vw,4.6vh),42px);font-weight:800;line-height:1.14;letter-spacing:-.045em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}'
        + '.wh-kpis{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:16px}.wh-kpi{display:inline-flex;align-items:baseline;gap:7px;max-width:100%;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.7);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 0 0 .5px var(--bd);font-size:12px;font-weight:600;color:var(--ink60);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wh-kpi b{font-size:16px;font-weight:800;letter-spacing:-.03em;color:var(--ink)}'
        + '.wh-dyn.swap>*{animation:whIn .7s var(--ez) backwards}.wh-dyn.swap>:nth-child(2){animation-delay:.05s}.wh-dyn.swap>:nth-child(3){animation-delay:.1s}@keyframes whIn{from{opacity:0;transform:translateY(12px);filter:blur(5px)}}'
        + '.wh-acts{display:flex;justify-content:center;align-items:center;gap:16px;margin-top:18px}.wh-more{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 20px;border:0;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 10px 24px -12px rgba(0,0,0,.5);transition:transform .3s var(--ez)}.wh-more:hover{transform:scale(1.04)}.wh-more span{transition:transform .3s var(--ez)}.wh-more:hover span{transform:translateX(3px)}'
        // 선택 카드 설명 한 줄 · 이전/다음 버튼(무엇을 누르면 넘어가는지 분명하게) · 힌트는 한 줄 아래로
        + '.wh-sum{max-width:460px;margin:10px auto 0;font-size:14px;line-height:1.65;color:var(--ink60);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
        + '.wh-acts{flex-wrap:wrap;gap:10px}.wh-hint{flex-basis:100%;margin-top:2px}.wh-nav{width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 0 0 .5px var(--bd),0 6px 16px -10px rgba(0,0,0,.35);font-size:16px;color:var(--ink);cursor:pointer;transition:background .2s,transform .2s}.wh-nav:hover{background:#fff;transform:translateY(-1px)}.wh-nav:focus-visible{outline:2px solid var(--ink);outline-offset:2px}'
        + '@media(min-width:760px) and (max-height:860px){.wh-sum{display:none}}@media(max-width:759px){.wh-sum{font-size:13px}.wh-nav{width:40px;height:40px}}@media(min-width:1800px){.wh-sum{font-size:15px;max-width:560px}.wh-nav{width:50px;height:50px}}'
        + '.wh-hint{font-size:12px;font-weight:600;color:var(--gray)}.wh-hint .m{display:none}'
        // 카테고리: 하단 가운데 유리 캡슐
        + '.wh-chips{position:absolute;left:50%;bottom:clamp(14px,2.6vh,28px);transform:translateX(-50%);z-index:370;display:flex;gap:2px;max-width:calc(100vw - 32px);padding:4px;border-radius:999px;overflow-x:auto;scrollbar-width:none;background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(18px) saturate(170%);backdrop-filter:blur(18px) saturate(170%);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 0 0 .5px var(--bd),0 14px 34px -20px rgba(0,0,0,.3);cursor:auto;touch-action:pan-x}.wh-chips::-webkit-scrollbar{display:none}'
        + '.wh-chip{flex:none;height:32px;padding:0 13px;border:0;border-radius:999px;background:transparent;font-size:12.5px;font-weight:600;color:var(--ink60);cursor:pointer;white-space:nowrap;transition:background .25s,color .25s}.wh-chip:hover{color:var(--ink)}.wh-chip i{font-style:normal;font-weight:500;opacity:.55;margin-left:4px}.wh-chip.on{background:var(--ink);color:#fff}'
        // 상세 시트
        + '.wh-scrim{position:fixed;inset:0;z-index:900;background:rgba(18,18,20,.26);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:opacity .45s var(--ez),visibility .45s}.sheet-open .wh-scrim{opacity:1;visibility:visible}'
        + '.wh-sheet{position:fixed;top:12px;right:12px;bottom:12px;z-index:910;width:min(580px,calc(100vw - 24px));display:flex;flex-direction:column;overflow:hidden;border-radius:var(--rs);background:#fff;box-shadow:0 40px 90px -30px rgba(0,0,0,.5);transform:translateX(calc(100% + 30px));visibility:hidden;transition:transform .6s var(--ez),visibility .6s;outline:none}.sheet-open .wh-sheet{transform:none;visibility:visible}'
        + '.wh-x{position:absolute;top:14px;right:14px;z-index:3;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.82);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 0 0 .5px var(--bd),0 4px 12px -6px rgba(0,0,0,.3);font-size:14px;cursor:pointer}'
        + '.wh-sbody{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain}.wh-snav{flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-top:1px solid var(--bd)}'
        + '.wh-snav button{height:38px;padding:0 16px;border:0;border-radius:999px;background:#f2f2f4;font-size:13px;font-weight:600;cursor:pointer}.wh-snav button:hover{background:#e8e8ec}.wh-sno{font-size:12px;font-weight:700;color:var(--gray);font-variant-numeric:tabular-nums}'
        + '.wd-media{background:var(--c)}.wd-main{position:relative;aspect-ratio:16/10;background:var(--c) center/cover no-repeat}.wd-main.img{background-color:#f3f3f0;background-size:contain}.wd-main.yt{cursor:pointer}.wd-main iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000}'
        + '.wd-play{position:absolute;left:50%;top:50%;width:72px;height:72px;margin:-36px 0 0 -36px;border-radius:50%;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.8);transition:transform .35s var(--ez)}.wd-play::after{content:"";position:absolute;left:55%;top:50%;transform:translate(-50%,-50%);border-left:20px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent}.wd-main.yt:hover .wd-play{transform:scale(1.08)}'
        + '.wd-main.art{display:flex;flex-direction:column;justify-content:flex-end;padding:26px 28px}.wd-ic{position:absolute;left:26px;top:24px}.wd-ic svg{width:32px;height:32px}.wd-kv b{display:block;font-size:clamp(48px,9vw,76px);font-weight:800;letter-spacing:-.055em;line-height:.95}.wd-kv span{display:block;margin-top:10px;font-size:14px;font-weight:600;opacity:.62}.wd-media.dk .wd-kv{color:#fff}.wd-big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.wd-big svg{display:block;width:104px;height:104px;stroke-width:1.2}'
        + '.wd-ths{display:flex;gap:8px;padding:10px 14px;overflow-x:auto;scrollbar-width:none;background:rgba(0,0,0,.05)}.wd-th{flex:none;width:64px;height:44px;border:2px solid transparent;border-radius:10px;background:center/cover no-repeat;opacity:.6;cursor:pointer;transition:opacity .2s}.wd-th:hover{opacity:.9}.wd-th.on{opacity:1;border-color:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.16)}'
        + '.wd-body{display:flex;flex-direction:column;gap:14px;padding:22px 24px 28px}.wd-cat{align-self:flex-start;padding:6px 11px;border-radius:999px;background:var(--c);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.wd-cat.dk{color:#fff}'
        + '.wd-title{margin:0;font-size:clamp(22px,2.2vw,28px);font-weight:800;line-height:1.2;letter-spacing:-.04em}.wd-co{margin:-6px 0 0;font-size:13px;line-height:1.5;color:var(--ink60)}'
        + '.wd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:8px}.wd-kpi{padding:12px 14px;border-radius:var(--rk);background:#f4f4f1}.wd-kpi b{display:block;font-size:24px;font-weight:800;letter-spacing:-.04em;line-height:1.05}.wd-kpi span{display:block;margin-top:5px;font-size:11.5px;line-height:1.35;color:var(--ink60)}'
        + '.wd-desc{margin:0;font-size:14.5px;line-height:1.75;color:var(--ink60)}.wd-pars{display:grid;gap:8px}.wd-par{padding:12px 14px;border-radius:var(--rk);background:#f7f7f4}.wd-par em{font-style:normal;font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gray)}.wd-par p{margin:4px 0 0;font-size:13.5px;line-height:1.65}'
        + '.wd-tags{display:flex;flex-wrap:wrap;gap:6px}.wd-tags span{padding:5px 10px;border-radius:999px;background:#f1f0ec;font-size:11.5px;color:var(--ink60)}.wd-links{display:flex;flex-wrap:wrap;gap:8px}.wd-links a{padding:10px 15px;border-radius:999px;background:var(--ink);color:#fff;font-size:12.5px;font-weight:600;transition:opacity .2s}.wd-links a:hover{opacity:.85}'
        // 애플식 연속 곡률(지원 브라우저) — 같은 인상이 나도록 반경을 키움
        // 알약 대신 애플식 둥근 사각형(돌아가기·지표·자세히 보기·분류 바·상세 태그/링크/이전·다음)
        + '.wh-back{border-radius:11px}.wh-kpi{border-radius:10px}.wh-more{border-radius:13px}.wh-chips{border-radius:16px}.wh-chip{border-radius:11px}.wd-cat,.wd-tags span{border-radius:8px}.wd-links a,.wh-snav button{border-radius:11px}'
        + '@supports (corner-shape:squircle){:root{--rc:34px;--rt:25px;--rs:42px;--rk:22px}.wh-face,.wh-th,.wh-sheet,.wd-kpi,.wd-par,.wd-th,.wh-back,.wh-kpi,.wh-more,.wh-chips,.wh-chip,.wd-cat,.wd-tags span,.wd-links a,.wh-snav button,.wh-th.img::after{corner-shape:squircle}.wd-th{border-radius:15px}'
        + '.wh-back{border-radius:17px}.wh-kpi{border-radius:15px}.wh-more{border-radius:20px}.wh-chips{border-radius:25px}.wh-chip{border-radius:19px}.wd-cat,.wd-tags span{border-radius:12px}.wd-links a,.wh-snav button{border-radius:17px}}'
        // 낮은 화면(노트북): 정보 패널 간격을 줄여 아래 분류 버튼과 겹치지 않게
        // 큰 모니터(QHD 등): 카드에 맞춰 정보 패널·분류 버튼·머리글도 한 단계 크게
        + '@media(min-width:1800px){.wh-info{width:min(680px,calc(100vw - 40px))}.wh-meta{font-size:12.5px}.wh-name{font-size:clamp(34px,2.1vw,48px)}.wh-kpis{gap:9px;margin-top:18px}.wh-kpi{padding:9px 16px;font-size:13px}.wh-kpi b{font-size:18px}.wh-acts{margin-top:20px;gap:18px}.wh-more{height:50px;padding:0 24px;font-size:15px}.wh-hint{font-size:13px}.wh-h1{font-size:clamp(48px,2.9vw,72px)}'
        + '.wh-chips{padding:5px}.wh-chip{height:40px;padding:0 17px;font-size:15px}.wh-back{height:42px;padding:0 18px;font-size:14.5px}.wh-sig{font-size:calc(var(--sgfs) * .9)}.ft-editorial .wh-cnt{font-size:26px}.wh-eye{font-size:12.5px}}'
        // 낮은 화면(노트북): 카드를 크게 쓰는 대신 정보 패널은 제목을 빼고 간단히
        + '@media(min-width:760px) and (max-height:860px){.wh-name{display:none}.wh-kpis{margin-top:12px}.wh-acts{margin-top:14px}.wh-more{height:40px}}'
        // 모바일: 위에서부터 차례로(돌아가기·번호 → 타이틀 → 카테고리 → 휠 → 정보), 상세는 아래에서 올라오는 시트
        + '@media(max-width:759px){.wh-top{position:relative;left:auto;top:auto;flex-direction:row;align-items:center;justify-content:space-between;padding:14px 16px 0}.wh-sig{display:none}'
        + '.wh-head{position:relative;left:auto;top:auto;transform:none;width:auto;padding:14px 16px 0;text-align:left}.wh-eye{justify-content:flex-start}.wh-eye i:first-child{display:none}.wh-h1{margin-top:8px;font-size:clamp(28px,8.4vw,38px)}'
        + '.wh-chips{position:relative;left:auto;bottom:auto;transform:none;margin:14px 16px 0;width:fit-content;max-width:calc(100vw - 32px)}'
        + '.wh-info{width:calc(100vw - 32px)}.wh-name{font-size:clamp(22px,6.4vw,28px)}@media(max-height:720px){.wh-name{display:none}}.wh-kpi{padding:7px 12px}.wh-kpi b{font-size:15px}.wh-kpi:nth-child(n+3){display:none}.wh-hint .d{display:none}.wh-hint .m{display:inline}.wh-m{display:none}'
        + '.wh-sheet{top:auto;left:8px;right:8px;bottom:8px;width:auto;height:calc(100dvh - 48px);transform:translateY(calc(100% + 20px))}}'
        + '@media(prefers-reduced-motion:reduce){.wh-dyn.swap>*{animation:none}.wh-sheet,.wh-scrim,body{transition:none}}';
      return '<!doctype html><html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>'
        + '<title>' + esc(nameKo || nameEn || "포트폴리오") + ' — Projects</title><link rel="icon" href="data:,"/>'
        + fontHead
        + '<style>' + WCSS + fontVars + '</style></head><body' + (d.hostStudio ? ' data-host="studio"' : '') + ' class="ft-' + FKEY + '">'
        + '<main class="wh"' + (shown("pp", "autoplay", true) ? '' : ' data-auto="0"') + ' aria-label="프로젝트 휠 — 드래그·휠·←/→로 돌려보기">'
        + '<header class="wh-top"><a class="wh-back" href="' + esc(homeUrl) + '#projects" target="_top" data-ext>← ' + esc(txt("ppBack", "포트폴리오")) + '</a>'
        + '<div class="wh-id">' + (sigTxt ? '<span class="wh-sig">' + esc(sigTxt) + '</span>' : '') + '<span class="wh-cnt"><b data-cur>01</b><i></i><span data-tot>' + pad2(N) + '</span></span></div></header>'
        + '<header class="wh-head"><p class="wh-eye"><i></i>' + eyebrow + '<i></i></p><h1 class="wh-h1">' + headHtml + '</h1></header>'
        + '<nav class="wh-chips" aria-label="카테고리">' + chips + '</nav>'
        + '<div class="wh-ring">' + cardsHtml + '</div>'
        + '<section class="wh-info" aria-live="polite"><div class="wh-dyn"></div><div class="wh-acts"><button class="wh-nav" type="button" data-step="-1" aria-label="이전 프로젝트">←</button><button class="wh-more" type="button" data-open>' + esc(txt("ppMore", "자세히 보기")) + ' <span aria-hidden="true">→</span></button><button class="wh-nav" type="button" data-step="1" aria-label="다음 프로젝트">→</button>'
        + '<span class="wh-hint"><span class="d">' + esc(txt("ppHint", "드래그 · 휠 · ← →")) + '</span><span class="m">' + esc(txt("ppHintM", "좌우로 밀어서 돌리기")) + '</span></span></div></section>'
        + '</main>'
        + '<div class="wh-scrim" data-close></div>'
        + '<aside class="wh-sheet" role="dialog" aria-modal="true" aria-label="프로젝트 상세" aria-hidden="true" tabindex="-1"><button class="wh-x" type="button" data-close aria-label="닫기">✕</button><div class="wh-sbody"></div>'
        + '<div class="wh-snav"><button type="button" data-snav="-1">← 이전</button><span class="wh-sno"></span><button type="button" data-snav="1">다음 →</button></div></aside>'
        + tpls
        + '<script>(' + whRuntime.toString() + ')();<\/script></body></html>';
    }
    if (d.page === "projects" || d.page === "projects-test" || d.page === "projects-airbridge") return projectsPage();

    return '<!doctype html><html lang="ko"><head><script>document.documentElement.classList.add("js")<\/script>'
      + '<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>'
      + '<title>' + esc(nameKo || nameEn || "포트폴리오") + ' — Marketing Portfolio</title>'
      + '<meta name="description" content="' + esc((tagline || "").replace(/"/g, "")) + '"/><meta name="theme-color" content="#ffffff"/><link rel="icon" href="data:,"/>'
      + fontHead
      + '<style>' + KCSS + fontVars + '</style></head><body class="' + ["intro", "aura", "tilt", "progress"].filter(function (k) { return FX[k]; }).map(function (k) { return "fx-" + k; }).concat("ft-" + FKEY).join(" ") + '"' + (d.hostStudio ? ' data-host="studio"' : '') + '>'
      + dock + (FX.progress ? '<div class="prog" aria-hidden="true"><i></i></div>' : '')
      + '<div class="page">' + home + sectionsHtml
      + '<p class="foot">' + esc(txt("footer", "© " + new Date().getFullYear() + " — " + (nameEn || nameKo || "") + ", Marketing Portfolio")) + '</p></div>'
      + '<script>' + KJS + '<\/script>' + (multiPh ? '<script>(' + phRuntime.toString() + ')();<\/script>' : '') + '</body></html>';
  }

  /* ---------- doc wrapper ---------- */
  function doc(title, css, body) {
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${FONT}<style>${css}</style></head><body>${body}</body></html>`;
  }

  const TEMPLATES = {
    PPT_PATCH: PPT_PATCH, PPT_IMG: PPT_IMG, // 스튜디오 'PDF 내용 반영' 버튼이 같은 데이터를 씀
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
