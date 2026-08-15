/* =========================================================================
   cloud.js — Supabase 연동 레이어 (인증 + 라이브러리/문서 동기화 + 공개 조회)
   supabase-js(CDN)와 config.js가 먼저 로드되어 있어야 합니다.
   설정이 없으면 CLOUD.enabled() === false 로, 앱은 오프라인 모드로 동작.
   ========================================================================= */
(function () {
  const cfg = window.APP_CONFIG || {};
  let sb = null, user = null;
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(user); } catch (e) {} });

  function client() {
    if (!sb && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase) {
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    }
    return sb;
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
        c.auth.onAuthStateChange((_e, session) => { user = session ? session.user : null; emit(); });
      } catch (e) { console.warn("[cloud] init", e); }
      return true;
    },

    async signUp(email, pw) {
      const { data, error } = await client().auth.signUp({ email, password: pw });
      if (error) throw error;
      user = data.session ? data.user : user;
      return data; // session이 null이면 이메일 확인 필요 상태
    },
    async signIn(email, pw) {
      const { data, error } = await client().auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      user = data.user; emit(); return data;
    },
    async signOut() { await client().auth.signOut(); user = null; emit(); },

    // 클라우드에서 전체 끌어오기 → {library|null, docs[]}
    async pull() {
      if (!user) return null;
      const c = client();
      const lib = await c.from("library").select("data").eq("user_id", user.id).maybeSingle();
      const docs = await c.from("documents").select("config").eq("user_id", user.id).order("updated_at", { ascending: false });
      const libData = lib.data && lib.data.data;
      return {
        library: (libData && Object.keys(libData).length) ? libData : null,
        docs: (docs.data || []).map(r => r.config).filter(Boolean)
      };
    },

    async pushLibrary(libObj) {
      if (!user) return;
      const { error } = await client().from("library")
        .upsert({ user_id: user.id, data: libObj, updated_at: new Date().toISOString() });
      if (error) console.warn("[cloud] pushLibrary", error);
    },

    async pushDoc(docObj, snapshot) {
      if (!user) return;
      const { error } = await client().from("documents").upsert({
        user_id: user.id, slug: docObj.slug, title: docObj.title, template: docObj.template,
        config: docObj, snapshot: snapshot, visibility: docObj.visibility || "unlisted",
        updated_at: new Date().toISOString()
      }, { onConflict: "slug" });
      if (error) console.warn("[cloud] pushDoc", error);
    },

    async deleteDoc(slug) {
      if (!user) return;
      await client().from("documents").delete().eq("user_id", user.id).eq("slug", slug);
    },

    // 공개 뷰용: 로그인 없이 slug로 스냅샷 조회 (RLS: visibility <> 'private' 허용)
    async fetchPublic(slug) {
      const c = client();
      if (!c) return null;
      const { data, error } = await c.from("documents")
        .select("snapshot,title,template").eq("slug", slug).neq("visibility", "private").maybeSingle();
      if (error) throw error;
      return data;
    }
  };

  window.CLOUD = CLOUD;
})();
