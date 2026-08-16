/* =========================================================================
   cloud.js — Supabase 연동 (v3 정규화: 회사→작업→성과수치/링크/미디어, AX·하이라이트 분리)
   ========================================================================= */
(function () {
  const cfg = window.APP_CONFIG || {};
  let sb = null, user = null;
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(user); } catch (e) {} });
  const toDate = s => s ? (String(s).length === 7 ? s + "-01" : String(s).slice(0, 10)) : null; // "2019-06"→"2019-06-01"
  const fromDate = s => s ? String(s).slice(0, 7) : "";                                          // "2019-06-01"→"2019-06"

  function client() {
    if (!sb && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase) {
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
    }
    return sb;
  }
  async function upsertPrune(table, rows) {
    const c = client(), uidv = user.id;
    if (rows.length) { const { error } = await c.from(table).upsert(rows, { onConflict: "id" }); if (error) console.warn("[cloud] upsert " + table, error.message); }
    const ids = rows.map(r => r.id);
    let del = c.from(table).delete().eq("user_id", uidv);
    if (ids.length) del = del.not("id", "in", "(" + ids.join(",") + ")");
    const { error } = await del; if (error) console.warn("[cloud] prune " + table, error.message);
  }

  const CLOUD = {
    enabled() { return !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase); },
    user() { return user; },
    onAuth(cb) { listeners.push(cb); },
    async init() { if (!this.enabled()) return false; const c = client(); try { const { data } = await c.auth.getSession(); user = data.session ? data.session.user : null; c.auth.onAuthStateChange((_e, s) => { user = s ? s.user : null; emit(); }); } catch (e) { console.warn(e); } return true; },
    async signUp(email, pw) { const { data, error } = await client().auth.signUp({ email, password: pw }); if (error) throw error; user = data.session ? data.user : user; return data; },
    async signIn(email, pw) { const { data, error } = await client().auth.signInWithPassword({ email, password: pw }); if (error) throw error; user = data.user; emit(); return data; },
    async signOut() { await client().auth.signOut(); user = null; emit(); },

    async pull() {
      if (!user) return null;
      const c = client(), u = user.id;
      const [pf, cos, wks, wm, wl, med, axr, hl, sk, ed, aw, rd, pp] = await Promise.all([
        c.from("profile").select("*").eq("user_id", u).maybeSingle(),
        c.from("companies").select("*").eq("user_id", u).order("sort"),
        c.from("works").select("*").eq("user_id", u).order("sort"),
        c.from("work_metrics").select("*").eq("user_id", u).order("sort"),
        c.from("work_links").select("*").eq("user_id", u).order("sort"),
        c.from("media").select("*").eq("user_id", u).order("sort"),
        c.from("ax_experiences").select("*").eq("user_id", u).order("sort"),
        c.from("highlights").select("*").eq("user_id", u).order("sort"),
        c.from("skills").select("*").eq("user_id", u).order("sort"),
        c.from("education").select("*").eq("user_id", u).order("sort"),
        c.from("awards").select("*").eq("user_id", u).order("sort"),
        c.from("resume_docs").select("*").eq("user_id", u).order("updated_at", { ascending: false }),
        c.from("portfolio_pages").select("*").eq("user_id", u).order("updated_at", { ascending: false })
      ]);
      const W = wks.data || [], WM = wm.data || [], WL = wl.data || [], MED = med.data || [];
      const companies = (cos.data || []).map(co => ({
        id: co.id, nameKo: co.name_ko, nameEn: co.name_en, role: co.role, startDate: fromDate(co.start_date), endDate: fromDate(co.end_date), summary: co.summary, logo: co.logo_url,
        works: W.filter(w => w.company_id === co.id).map(w => ({
          id: w.id, title: w.title, category: w.category, startDate: fromDate(w.start_date), endDate: fromDate(w.end_date), summary: w.summary, detail: w.detail, featured: w.featured, stack: w.stack || [],
          metrics: WM.filter(m => m.work_id === w.id).map(m => ({ id: m.id, value: m.value, label: m.label })),
          links: WL.filter(l => l.work_id === w.id).map(l => ({ id: l.id, label: l.label, url: l.url })),
          media: MED.filter(m => m.work_id === w.id).map(m => ({ id: m.id, type: m.type, url: m.url, title: m.title, alt: m.alt }))
        }))
      }));
      const p = pf.data;
      const lib = {
        profile: p ? { nameKo: p.name_ko, nameEn: p.name_en, title: p.title, tagline: p.tagline, summary: p.summary, email: p.email, phone: p.phone, location: p.location, avatar: p.avatar_url, links: p.links || [] } : null,
        companies,
        ax: (axr.data || []).map(a => ({ id: a.id, companyId: a.company_id, title: a.title, description: a.description })),
        highlights: (hl.data || []).map(h => ({ id: h.id, value: h.value, label: h.label })),
        skills: (sk.data || []).map(s => ({ id: s.id, group: s.group_name, items: s.items || [] })),
        education: (ed.data || []).map(e => ({ id: e.id, school: e.school, degree: e.degree, field: e.field, startDate: fromDate(e.start_date), endDate: fromDate(e.end_date) })),
        awards: (aw.data || []).map(a => ({ id: a.id, title: a.title, org: a.org, date: fromDate(a.award_date) })),
        roleTags: p ? (p.role_tags || []) : []
      };
      const docs = [
        ...(rd.data || []).map(r => Object.assign({}, r.config, { id: r.id, slug: r.slug, title: r.title, template: r.template, visibility: r.visibility })),
        ...(pp.data || []).map(r => Object.assign({}, r.config, { id: r.id, slug: r.slug, title: r.title, visibility: r.visibility, kind: "portfolio" }))
      ];
      return { library: companies.length > 0 ? lib : null, docs };
    },

    async pushAll(lib, docs, resolveFn) {
      if (!user) return;
      const c = client(), u = user.id, now = new Date().toISOString();
      if (lib.profile) {
        const p = lib.profile;
        const { error } = await c.from("profile").upsert({ user_id: u, name_ko: p.nameKo, name_en: p.nameEn, title: p.title, tagline: p.tagline, summary: p.summary, email: p.email, phone: p.phone, location: p.location, avatar_url: p.avatar, links: p.links || [], role_tags: lib.roleTags || [], updated_at: now });
        if (error) console.warn("[cloud] profile", error.message);
      }
      const coRows = [], wkRows = [], wmRows = [], wlRows = [], medRows = [], axRows = [], hlRows = [];
      (lib.companies || []).forEach((co, ci) => {
        coRows.push({ id: co.id, user_id: u, name_ko: co.nameKo, name_en: co.nameEn, role: co.role, start_date: toDate(co.startDate), end_date: toDate(co.endDate), summary: co.summary, logo_url: co.logo || null, sort: ci, updated_at: now });
        (co.works || []).forEach((w, wi) => {
          wkRows.push({ id: w.id, user_id: u, company_id: co.id, title: w.title, category: w.category, start_date: toDate(w.startDate), end_date: toDate(w.endDate), summary: w.summary, detail: w.detail, featured: !!w.featured, stack: w.stack || [], sort: wi, updated_at: now });
          (w.metrics || []).forEach((m, mi) => wmRows.push({ id: m.id, user_id: u, work_id: w.id, value: m.value, label: m.label, sort: mi }));
          (w.links || []).forEach((l, li) => wlRows.push({ id: l.id, user_id: u, work_id: w.id, label: l.label, url: l.url, sort: li }));
          (w.media || []).forEach((m, mi) => medRows.push({ id: m.id, user_id: u, work_id: w.id, type: m.type || "image", url: m.url, title: m.title || null, alt: m.alt || null, sort: mi }));
        });
      });
      (lib.ax || []).forEach((a, i) => axRows.push({ id: a.id, user_id: u, company_id: a.companyId || null, title: a.title, description: a.description, sort: i }));
      (lib.highlights || []).forEach((h, i) => hlRows.push({ id: h.id, user_id: u, value: h.value, label: h.label, sort: i }));
      await upsertPrune("companies", coRows);
      await upsertPrune("works", wkRows);
      await upsertPrune("work_metrics", wmRows);
      await upsertPrune("work_links", wlRows);
      await upsertPrune("media", medRows);
      await upsertPrune("ax_experiences", axRows);
      await upsertPrune("highlights", hlRows);
      await upsertPrune("skills", (lib.skills || []).map((s, i) => ({ id: s.id, user_id: u, group_name: s.group, items: s.items || [], sort: i })));
      await upsertPrune("education", (lib.education || []).map((e, i) => ({ id: e.id, user_id: u, school: e.school, degree: e.degree, field: e.field, start_date: toDate(e.startDate), end_date: toDate(e.endDate), sort: i })));
      await upsertPrune("awards", (lib.awards || []).map((a, i) => ({ id: a.id, user_id: u, title: a.title, org: a.org, award_date: toDate(a.date), sort: i })));
      const resumes = (docs || []).filter(d => d.kind !== "portfolio"), pfs = (docs || []).filter(d => d.kind === "portfolio");
      await upsertPrune("resume_docs", resumes.map(d => ({ id: d.id, user_id: u, slug: d.slug, title: d.title, template: d.template, config: d, snapshot: resolveFn ? resolveFn(d) : null, visibility: d.visibility || "unlisted", updated_at: now })));
      await upsertPrune("portfolio_pages", pfs.map(d => ({ id: d.id, user_id: u, slug: d.slug, title: d.title, subtitle: d.subtitle, intro: d.intro, cover_url: d.cover, config: d, snapshot: resolveFn ? resolveFn(d) : null, visibility: d.visibility || "unlisted", updated_at: now })));
    },

    async fetchPublic(slug) {
      const c = client(); if (!c) return null;
      let r = await c.from("resume_docs").select("snapshot,title,template").eq("slug", slug).neq("visibility", "private").maybeSingle();
      if (r.data && r.data.snapshot) return r.data;
      let p = await c.from("portfolio_pages").select("snapshot,title,template").eq("slug", slug).neq("visibility", "private").maybeSingle();
      if (p.data && p.data.snapshot) return p.data;
      return null;
    },
    async tableRows(table, limit) {
      const c = client(); if (!c || !user) return null;
      const { data, error } = await c.from(table).select("*").limit(limit || 200);
      if (error) return { error: error.message };
      return data || [];
    }
  };
  window.CLOUD = CLOUD;
})();
