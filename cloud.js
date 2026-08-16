/* =========================================================================
   cloud.js — Supabase 연동 (인증 + 정규화 테이블 행 단위 동기화 + 공개 조회)
   회사→작업→미디어를 각각 테이블 행으로 저장. supabase-js(CDN)+config.js 선행 로드.
   ========================================================================= */
(function () {
  const cfg = window.APP_CONFIG || {};
  let sb = null, user = null;
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(user); } catch (e) {} });

  function client() {
    if (!sb && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase) {
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY,
        { auth: { persistSession: true, autoRefreshToken: true } });
    }
    return sb;
  }

  // 현재 상태를 테이블에 반영: rows upsert(id 기준) + 제거된 행 삭제
  async function upsertPrune(table, rows) {
    const c = client(), uidv = user.id;
    if (rows.length) {
      const { error } = await c.from(table).upsert(rows, { onConflict: "id" });
      if (error) console.warn("[cloud] upsert " + table, error.message);
    }
    const ids = rows.map(r => r.id);
    let del = c.from(table).delete().eq("user_id", uidv);
    if (ids.length) del = del.not("id", "in", "(" + ids.join(",") + ")");
    const { error } = await del;
    if (error) console.warn("[cloud] prune " + table, error.message);
  }

  const CLOUD = {
    enabled() { return !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase); },
    user() { return user; },
    onAuth(cb) { listeners.push(cb); },

    async init() {
      if (!this.enabled()) return false;
      const c = client();
      try {
        const { data } = await c.auth.getSession();
        user = data.session ? data.session.user : null;
        c.auth.onAuthStateChange((_e, s) => { user = s ? s.user : null; emit(); });
      } catch (e) { console.warn("[cloud] init", e); }
      return true;
    },
    async signUp(email, pw) { const { data, error } = await client().auth.signUp({ email, password: pw }); if (error) throw error; user = data.session ? data.user : user; return data; },
    async signIn(email, pw) { const { data, error } = await client().auth.signInWithPassword({ email, password: pw }); if (error) throw error; user = data.user; emit(); return data; },
    async signOut() { await client().auth.signOut(); user = null; emit(); },

    /* ---------- 전체 읽기 → {library, docs} ---------- */
    async pull() {
      if (!user) return null;
      const c = client(), uidv = user.id;
      const [pf, cos, wks, med, sk, ed, aw, rd, pp] = await Promise.all([
        c.from("profile").select("*").eq("user_id", uidv).maybeSingle(),
        c.from("companies").select("*").eq("user_id", uidv).order("sort"),
        c.from("works").select("*").eq("user_id", uidv).order("sort"),
        c.from("media").select("*").eq("user_id", uidv).order("sort"),
        c.from("skills").select("*").eq("user_id", uidv).order("sort"),
        c.from("education").select("*").eq("user_id", uidv).order("sort"),
        c.from("awards").select("*").eq("user_id", uidv).order("sort"),
        c.from("resume_docs").select("*").eq("user_id", uidv).order("updated_at", { ascending: false }),
        c.from("portfolio_pages").select("*").eq("user_id", uidv).order("updated_at", { ascending: false })
      ]);
      const W = wks.data || [], M = med.data || [];
      const companies = (cos.data || []).map(co => ({
        id: co.id, name: co.name, role: co.role, period: co.period, summary: co.summary, logo: co.logo_url,
        works: W.filter(w => w.company_id === co.id).map(w => ({
          id: w.id, title: w.title, category: w.category, period: w.period, summary: w.summary, detail: w.detail,
          featured: w.featured, icon: w.icon, cover: w.cover_url,
          metrics: w.metrics || [], stack: w.stack || [], links: w.links || [],
          media: M.filter(m => m.work_id === w.id).map(m => ({ id: m.id, type: m.type, url: m.url, title: m.title, alt: m.alt }))
        }))
      }));
      const p = pf.data;
      const lib = {
        profile: p ? { nameKo: p.name_ko, nameEn: p.name_en, title: p.title, tagline: p.tagline, totalYears: p.total_years,
          email: p.email, phone: p.phone, location: p.location, avatar: p.avatar_url, summary: p.summary, links: p.links || [] } : null,
        companies,
        skills: (sk.data || []).map(s => ({ id: s.id, group: s.group_name, items: s.items || [] })),
        education: (ed.data || []).map(e => ({ id: e.id, school: e.school, degree: e.degree, period: e.period })),
        awards: (aw.data || []).map(a => ({ id: a.id, title: a.title, org: a.org, date: a.date_text })),
        ax: p ? (p.ax || []) : [], highlights: p ? (p.highlights || []) : [], roleTags: p ? (p.role_tags || []) : []
      };
      const docs = [
        ...(rd.data || []).map(r => Object.assign({}, r.config, { id: r.id, slug: r.slug, title: r.title, template: r.template, visibility: r.visibility })),
        ...(pp.data || []).map(r => Object.assign({}, r.config, { id: r.id, slug: r.slug, title: r.title, visibility: r.visibility, kind: "portfolio" }))
      ];
      return { library: companies.length > 0 ? lib : null, docs };
    },

    /* ---------- 전체 쓰기 (행 단위 upsert + 제거행 삭제) ---------- */
    async pushAll(lib, docs, resolveFn) {
      if (!user) return;
      const c = client(), uidv = user.id, now = new Date().toISOString();
      if (lib.profile) {
        const p = lib.profile;
        const { error } = await c.from("profile").upsert({
          user_id: uidv, name_ko: p.nameKo, name_en: p.nameEn, title: p.title, tagline: p.tagline, total_years: p.totalYears,
          email: p.email, phone: p.phone, location: p.location, avatar_url: p.avatar, summary: p.summary,
          links: p.links || [], role_tags: lib.roleTags || [], ax: lib.ax || [], highlights: lib.highlights || [], updated_at: now
        });
        if (error) console.warn("[cloud] profile", error.message);
      }
      const coRows = [], wkRows = [], medRows = [];
      (lib.companies || []).forEach((co, ci) => {
        coRows.push({ id: co.id, user_id: uidv, name: co.name, role: co.role, period: co.period, summary: co.summary, logo_url: co.logo || null, sort: ci, updated_at: now });
        (co.works || []).forEach((w, wi) => {
          wkRows.push({ id: w.id, user_id: uidv, company_id: co.id, title: w.title, category: w.category, period: w.period,
            summary: w.summary, detail: w.detail, featured: !!w.featured, icon: w.icon || null, cover_url: w.cover || null,
            metrics: w.metrics || [], stack: w.stack || [], links: w.links || [], sort: wi });
          (w.media || []).forEach((m, mi) => medRows.push({ id: m.id, user_id: uidv, work_id: w.id, type: m.type || "image", url: m.url, title: m.title || null, alt: m.alt || null, sort: mi }));
        });
      });
      await upsertPrune("companies", coRows);
      await upsertPrune("works", wkRows);
      await upsertPrune("media", medRows);
      await upsertPrune("skills", (lib.skills || []).map((s, i) => ({ id: s.id, user_id: uidv, group_name: s.group, items: s.items || [], sort: i })));
      await upsertPrune("education", (lib.education || []).map((e, i) => ({ id: e.id, user_id: uidv, school: e.school, degree: e.degree, period: e.period, sort: i })));
      await upsertPrune("awards", (lib.awards || []).map((a, i) => ({ id: a.id, user_id: uidv, title: a.title, org: a.org, date_text: a.date, sort: i })));
      const resumes = (docs || []).filter(d => d.kind !== "portfolio");
      const pfs = (docs || []).filter(d => d.kind === "portfolio");
      await upsertPrune("resume_docs", resumes.map(d => ({ id: d.id, user_id: uidv, slug: d.slug, title: d.title, template: d.template, config: d, snapshot: resolveFn ? resolveFn(d) : null, visibility: d.visibility || "unlisted", updated_at: now })));
      await upsertPrune("portfolio_pages", pfs.map(d => ({ id: d.id, user_id: uidv, slug: d.slug, title: d.title, subtitle: d.subtitle, intro: d.intro, cover_url: d.cover, config: d, snapshot: resolveFn ? resolveFn(d) : null, visibility: d.visibility || "unlisted", updated_at: now })));
    },

    /* ---------- 공개 조회 (slug) ---------- */
    async fetchPublic(slug) {
      const c = client(); if (!c) return null;
      let r = await c.from("resume_docs").select("snapshot,title,template").eq("slug", slug).neq("visibility", "private").maybeSingle();
      if (r.data && r.data.snapshot) return r.data;
      let p = await c.from("portfolio_pages").select("snapshot,title,template").eq("slug", slug).neq("visibility", "private").maybeSingle();
      if (p.data && p.data.snapshot) return p.data;
      return null;
    }
  };
  window.CLOUD = CLOUD;
})();
