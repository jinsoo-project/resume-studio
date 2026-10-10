/* =========================================================================
   cloud.js — Supabase 연동 (v3 정규화: 회사→작업→성과수치/링크/미디어, AX·하이라이트 분리)
   ========================================================================= */
(function () {
  const cfg = window.APP_CONFIG || {};
  let sb = null, user = null;
  // ⚠️ 2026-10-10: 오래 열어 둔 탭이 옛 데이터를 통째로 저장해 최신 내용을 덮어쓴 사고가 반복됨(3회)
  //    → 저장 버전(portfolio_pages.config._rev). 불러온(채택한) 버전 = rev. 저장 직전 클라우드 버전이 다르면 어떤 표에도 쓰지 않고 멈춤(STALE)
  let rev = null;
  const revOf = rows => (rows || []).reduce((m, r) => Math.max(m, +(((r && r.config) || {})._rev) || 0), 0);
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
  // ⚠️ 2026-10-09 사고: 조회 실패로 문서 목록이 빈 채 저장되자 이력서 · 포트폴리오 문서가 전부 지워짐
  //    → 문서 표는 '빈 목록이면 지우지 않음' + 한 번에 절반 넘게 지우는 저장은 막음(실수 방지)
  const DOC_TABLES = { resume_docs: 1, portfolio_pages: 1 };
  async function upsertPrune(table, rows) {
    const c = client(), uidv = user.id;
    if (DOC_TABLES[table]) {
      if (!rows.length) { console.warn("[cloud] skip prune " + table + " (빈 목록)"); return; }
      const cur = await c.from(table).select("id").eq("user_id", uidv);
      const keep = {}; rows.forEach(r => { keep[r.id] = 1; });
      const gone = (cur.data || []).filter(r => !keep[r.id]);
      if (cur.error || gone.length > Math.max(1, Math.floor((cur.data || []).length / 2))) {
        const { error } = await c.from(table).upsert(rows, { onConflict: "id" }); if (error) console.warn("[cloud] upsert " + table, error.message);
        console.warn("[cloud] skip prune " + table + " (지울 문서 " + gone.length + "개 — 안전을 위해 보류)"); return;
      }
    }
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
      const [pf, cos, wks, wm, wl, med, axr, hl, sk, ed, aw, rd, pp, cap, pipe, flow, axl, axs, axn] = await Promise.all([
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
        c.from("portfolio_pages").select("*").eq("user_id", u).order("updated_at", { ascending: false }),
        c.from("capabilities").select("*").eq("user_id", u).order("sort"),
        c.from("pipeline_steps").select("*").eq("user_id", u).order("sort"),
        c.from("flow_items").select("*").eq("user_id", u).order("sort"),
        c.from("ax_loop").select("*").eq("user_id", u).order("sort"),
        c.from("ax_screens").select("*").eq("user_id", u).order("sort"),
        c.from("ax_notes").select("*").eq("user_id", u).order("sort")
      ]);
      const failed = [pf, cos, wks, wm, wl, med, axr, hl, sk, ed, aw, rd, pp, cap, pipe, flow, axl, axs, axn].filter(x => x && x.error);
      if (failed.length) throw new Error("클라우드 불러오기 실패(" + failed.length + "개 표) — 잠시 후 새로고침해 주세요: " + failed[0].error.message);
      const W = wks.data || [], WM = wm.data || [], WL = wl.data || [], MED = med.data || [];
      const companies = (cos.data || []).map(co => ({
        id: co.id, nameKo: co.name_ko, nameEn: co.name_en, role: co.role, startDate: fromDate(co.start_date), endDate: fromDate(co.end_date), summary: co.summary, logo: co.logo_url,
        periodText: co.period_text || "", metrics: co.metrics || [], serviceKo: co.service_ko || "", serviceEn: co.service_en || "", useService: co.use_service === true,
        works: W.filter(w => w.company_id === co.id).map(w => ({
          id: w.id, title: w.title, category: w.category, startDate: fromDate(w.start_date), endDate: fromDate(w.end_date), summary: w.summary, detail: w.detail, featured: w.featured, stack: w.stack || [],
          code: w.code || "", tags: w.tags || [], problem: w.problem || "", action: w.action || "", result: w.result || "",
          metrics: WM.filter(m => m.work_id === w.id).map(m => ({ id: m.id, value: m.value, label: m.label })),
          links: WL.filter(l => l.work_id === w.id).map(l => ({ id: l.id, label: l.label, url: l.url })),
          media: MED.filter(m => m.work_id === w.id).map(m => ({ id: m.id, type: m.type, url: m.url, title: m.title, alt: m.alt }))
        }))
      }));
      const p = pf.data;
      const lib = {
        profile: p ? { nameKo: p.name_ko, nameEn: p.name_en, title: p.title, tagline: p.tagline, summary: p.summary, email: p.email, phone: p.phone, location: p.location, avatar: p.avatar_url, links: p.links || [], rotWords: p.rot_words || [], stack: p.stack || [], heroHeadline: p.hero_headline || "", navOrder: p.nav_order || [] } : null,
        companies,
        ax: (axr.data || []).map(a => ({ id: a.id, companyId: a.company_id, title: a.title, description: a.description })),
        highlights: (hl.data || []).map(h => ({ id: h.id, value: h.value, label: h.label })),
        skills: (sk.data || []).map(s => ({ id: s.id, group: s.group_name, items: s.items || [] })),
        education: (ed.data || []).map(e => ({ id: e.id, school: e.school, degree: e.degree, field: e.field, startDate: fromDate(e.start_date), endDate: fromDate(e.end_date) })),
        awards: (aw.data || []).map(a => ({ id: a.id, title: a.title, org: a.org, date: fromDate(a.award_date) })),
        capabilities: (cap.data || []).map(x => ({ id: x.id, label: x.label, description: x.description, visible: x.visible !== false })),
        pipeline: (pipe.data || []).map(x => ({ id: x.id, step: x.step_label, title: x.title, description: x.description, tools: x.tools || [], visible: x.visible !== false })),
        flow: (flow.data || []).map(x => ({ id: x.id, num: x.num, title: x.title, sub: x.sub, caption: x.caption, visible: x.visible !== false })),
        axLoop: (axl.data || []).map(x => ({ id: x.id, num: x.num, title: x.title, items: x.items || [], visible: x.visible !== false })),
        axScreens: (axs.data || []).map(x => ({ id: x.id, category: x.category, name: x.name, code: x.code, badge: x.badge, description: x.description, source: x.source, chips: x.chips || [], visible: x.visible !== false })),
        axNotes: (axn.data || []).map(x => ({ id: x.id, section: x.section, title: x.title, body: x.body, visible: x.visible !== false })),
        roleTags: p ? (p.role_tags || []) : []
      };
      const docs = [
        ...(rd.data || []).map(r => Object.assign({}, r.config, { id: r.id, slug: r.slug, title: r.title, template: r.template, visibility: r.visibility })),
        ...(pp.data || []).map(r => Object.assign({}, r.config, { id: r.id, slug: r.slug, title: r.title, visibility: r.visibility, kind: "portfolio" }))
      ];
      return { library: companies.length > 0 ? lib : null, docs, rev: revOf(pp.data) };
    },

    // 화면에 실제로 불러온(채택한) 데이터의 버전 — 스튜디오 syncFromCloud에서만 부름(조회만 하는 pull로는 바뀌지 않음)
    setRev(n) { rev = (typeof n === "number" && n >= 0) ? n : null; },
    rev() { return rev; },
    async pushAll(lib, docs, resolveFn) {
      if (!user) return;
      const c = client(), u = user.id, now = new Date().toISOString();
      // 저장 전 버전 확인 — 다른 탭·기기가 그 사이 저장했으면 이 탭의 데이터는 옛 것 → 아무것도 쓰지 않음
      if (rev === null) { const e = new Error("클라우드에서 불러오기 전이라 저장하지 않았어요 — 새로고침(⌘R)해 주세요"); e.code = "STALE"; throw e; }
      const cur = await c.from("portfolio_pages").select("config").eq("user_id", u);
      if (cur.error) throw new Error("저장 전 버전 확인 실패 — 저장하지 않았어요: " + cur.error.message);
      const cloudRev = revOf(cur.data);
      if (cloudRev !== rev) { const e = new Error("다른 탭·기기에서 더 최신 내용이 저장돼 있어요(버전 " + cloudRev + " ≠ 이 탭 " + rev + ") — 이 탭은 저장하지 않았어요. 새로고침(⌘R) 후 다시 편집해 주세요"); e.code = "STALE"; throw e; }
      const next = rev + 1;
      if (lib.profile) {
        const p = lib.profile;
        const { error } = await c.from("profile").upsert({ user_id: u, name_ko: p.nameKo, name_en: p.nameEn, title: p.title, tagline: p.tagline, summary: p.summary, email: p.email, phone: p.phone, location: p.location, avatar_url: p.avatar, links: p.links || [], role_tags: lib.roleTags || [], rot_words: p.rotWords || [], stack: p.stack || [], hero_headline: p.heroHeadline || null, nav_order: p.navOrder || [], updated_at: now });
        if (error) console.warn("[cloud] profile", error.message);
      }
      const coRows = [], wkRows = [], wmRows = [], wlRows = [], medRows = [], axRows = [], hlRows = [];
      (lib.companies || []).forEach((co, ci) => {
        coRows.push({ id: co.id, user_id: u, name_ko: co.nameKo, name_en: co.nameEn, role: co.role, start_date: toDate(co.startDate), end_date: toDate(co.endDate), summary: co.summary, logo_url: co.logo || null, period_text: co.periodText || null, metrics: co.metrics || [], service_ko: co.serviceKo || null, service_en: co.serviceEn || null, use_service: !!co.useService, sort: ci, updated_at: now });
        (co.works || []).forEach((w, wi) => {
          wkRows.push({ id: w.id, user_id: u, company_id: co.id, title: w.title, category: w.category, start_date: toDate(w.startDate), end_date: toDate(w.endDate), summary: w.summary, detail: w.detail, featured: !!w.featured, stack: w.stack || [], code: w.code || null, tags: w.tags || [], problem: w.problem || null, action: w.action || null, result: w.result || null, sort: wi, updated_at: now });
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
      await upsertPrune("capabilities", (lib.capabilities || []).map((x, i) => ({ id: x.id, user_id: u, label: x.label, description: x.description, visible: x.visible !== false, sort: i })));
      await upsertPrune("pipeline_steps", (lib.pipeline || []).map((x, i) => ({ id: x.id, user_id: u, step_label: x.step, title: x.title, description: x.description, tools: x.tools || [], visible: x.visible !== false, sort: i })));
      await upsertPrune("flow_items", (lib.flow || []).map((x, i) => ({ id: x.id, user_id: u, num: x.num, title: x.title, sub: x.sub, caption: x.caption, visible: x.visible !== false, sort: i })));
      await upsertPrune("ax_loop", (lib.axLoop || []).map((x, i) => ({ id: x.id, user_id: u, num: x.num, title: x.title, items: x.items || [], visible: x.visible !== false, sort: i })));
      await upsertPrune("ax_screens", (lib.axScreens || []).map((x, i) => ({ id: x.id, user_id: u, category: x.category, name: x.name, code: x.code, badge: x.badge, description: x.description, source: x.source, chips: x.chips || [], visible: x.visible !== false, sort: i })));
      await upsertPrune("ax_notes", (lib.axNotes || []).map((x, i) => ({ id: x.id, user_id: u, section: x.section, title: x.title, body: x.body, visible: x.visible !== false, sort: i })));
      const resumes = (docs || []).filter(d => d.kind !== "portfolio"), pfs = (docs || []).filter(d => d.kind === "portfolio");
      await upsertPrune("resume_docs", resumes.map(d => ({ id: d.id, user_id: u, slug: d.slug, title: d.title, template: d.template, config: d, snapshot: resolveFn ? resolveFn(d) : null, visibility: d.visibility || "unlisted", updated_at: now })));
      await upsertPrune("portfolio_pages", pfs.map(d => ({ id: d.id, user_id: u, slug: d.slug, title: d.title, subtitle: d.subtitle, intro: d.intro, cover_url: d.cover, config: Object.assign({}, d, { _rev: next }), snapshot: resolveFn ? resolveFn(d) : null, visibility: d.visibility || "unlisted", updated_at: now })));
      if (pfs.length) { rev = next; pfs.forEach(d => { d._rev = next; }); } // 저장 성공 → 이 탭이 최신
    },

    async fetchPublic(slug) {
      const c = client(); if (!c) return null;
      // 주인 계정(config OWNER_ID) 문서만 — 가입한 다른 계정이 같은 slug로 만든 문서가 공개 주소에 대신 뜨는 것 방지
      const own = (window.APP_CONFIG || {}).OWNER_ID, mine = q => own ? q.eq("user_id", own) : q;
      let r = await mine(c.from("resume_docs").select("snapshot,title,template").eq("slug", slug).neq("visibility", "private")).maybeSingle();
      if (r.data && r.data.snapshot) return r.data;
      let p = await mine(c.from("portfolio_pages").select("snapshot,title").eq("slug", slug).neq("visibility", "private")).maybeSingle();
      if (p.data && p.data.snapshot) return p.data;
      return null;
    },
    async uploadFile(file) {
      const c = client(); if (!c || !user) throw new Error("로그인 필요");
      const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = user.id + "/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
      const { error } = await c.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = c.storage.from("media").getPublicUrl(path);
      return data.publicUrl;
    },
    // 조회수 (page_views: slug·day(서울 날짜)·count) — 방문 +1은 track_view RPC(익명 가능), 읽기는 공개
    kstDay() { return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); },
    async trackView(slug) {
      const c = client(); if (!c) throw new Error("클라이언트 없음");
      const { error } = await c.rpc("track_view", { p_slug: slug });
      if (error) throw error;
      return true;
    },
    async getViews(slug) {
      const c = client(); if (!c) throw new Error("클라이언트 없음");
      const { data, error } = await c.from("page_views").select("day,count").eq("slug", slug);
      if (error) throw error;
      const today = this.kstDay(); let total = 0, t = 0;
      (data || []).forEach(r => { const n = Number(r.count) || 0; total += n; if (String(r.day).slice(0, 10) === today) t = n; });
      return { total, today: t };
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
