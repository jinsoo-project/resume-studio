-- =========================================================================
-- schema_v5_views.sql — 포트폴리오 조회수 (누적 · 오늘)
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요. (여러 번 실행해도 안전)
--
-- · page_views : 슬러그별·날짜(서울 기준)별 방문 수. 숫자만 담겨 있어 공개 읽기 허용.
-- · track_view : 방문 +1. 로그인 없이(anon) 호출 가능한 함수 — 테이블 직접 쓰기는 막아 둠.
-- · 표시 숫자 보정(내 테스트 방문 빼기 등)은 KILO 대시보드에서 하고, 원본 집계는 그대로 둡니다.
-- =========================================================================

create table if not exists public.page_views (
  slug  text   not null,
  day   date   not null,
  count bigint not null default 0,
  primary key (slug, day)
);

alter table public.page_views enable row level security;

-- 누구나 읽기 (집계 숫자만 있음)
drop policy if exists "page_views_read" on public.page_views;
create policy "page_views_read" on public.page_views for select using (true);

-- 방문 +1 (서울 날짜 기준 · 슬러그 1~64자만 허용)
create or replace function public.track_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.page_views (slug, day, count)
  select p_slug, (now() at time zone 'Asia/Seoul')::date, 1
  where p_slug is not null and length(p_slug) between 1 and 64
  on conflict (slug, day) do update set count = public.page_views.count + 1;
$$;

revoke all on function public.track_view(text) from public;
grant execute on function public.track_view(text) to anon, authenticated;
