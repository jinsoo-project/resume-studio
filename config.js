/* =========================================================================
   config.js — Supabase 연결 설정
   Supabase 프로젝트를 만든 뒤, 아래 두 값을 채우세요.
   위치: Supabase 대시보드 → Project Settings → API
     - Project URL           → SUPABASE_URL
     - Project API keys (anon, public) → SUPABASE_ANON_KEY

   ⚠️ anon key는 "공개용"이라 클라이언트에 넣어도 안전합니다 (RLS로 보호됨).
   ⚠️ 절대 service_role 키는 여기 넣지 마세요 (서버 전용, 노출 금지).

   두 값이 비어 있으면 앱은 자동으로 오프라인(localStorage) 모드로 동작합니다.
   ========================================================================= */
window.APP_CONFIG = {
  SUPABASE_URL: "",       // 예: https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: ""   // 예: eyJhbGciOiJIUzI1NiIsInR5cCI6...
};
