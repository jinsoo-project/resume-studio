/* =========================================================================
   config.js — Supabase 연결 설정
   anon key는 공개용이라 클라이언트에 넣어도 안전합니다 (RLS로 보호됨).
   service_role 키는 절대 여기 넣지 마세요.
   두 값이 비어 있으면 앱은 자동으로 오프라인(localStorage) 모드로 동작합니다.
   ========================================================================= */
window.APP_CONFIG = {
  SUPABASE_URL: "https://qmabsrqpzbqvledywxtl.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYWJzcnFwemJxdmxlZHl3eHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODg0MTEsImV4cCI6MjEwMjM2NDQxMX0.QUi1vXBW_v5ai0tTnmLbKLJf4LPCE46DBbfhoHvCNrM",
  // 공개 화면(/portfolio · /p · /r)은 이 계정이 만든 문서만 불러옴 — 다른 계정이 같은 주소(slug)로 문서를 만들어도 대신 뜨지 않게
  OWNER_ID: "12ca909a-d9ae-4796-89af-57467df61a48"
};
