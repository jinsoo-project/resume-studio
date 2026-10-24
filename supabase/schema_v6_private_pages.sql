-- =========================================================================
-- schema_v6_private_pages.sql — 비밀번호로 여는 페이지 (스튜디오 '과제' 탭)
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요. (여러 번 실행해도 안전)
--
-- · private_pages : 스튜디오에서 쓰는 페이지(본문 HTML · 주소 · 비밀번호). 주인만 읽고 쓸 수 있음.
-- · open_private_page : 공개 주소(/a/<slug>)에서 비밀번호가 맞을 때만 제목 · 본문을 돌려줌.
--   표 자체는 익명(anon)에게 막혀 있어서, 비밀번호 없이는 본문을 받을 방법이 없습니다.
-- =========================================================================

create table if not exists public.private_pages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  slug       text not null unique check (slug ~ '^[a-z0-9-]{3,64}$'),
  title      text not null default '',
  label      text not null default '',
  pass       text not null check (length(pass) between 4 and 64),
  html       text not null default '',
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.private_pages enable row level security;

-- 주인만 읽기 · 쓰기 (익명 정책 없음)
drop policy if exists "private_pages_owner" on public.private_pages;
create policy "private_pages_owner" on public.private_pages
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 비밀번호 확인 후 본문 돌려주기 (틀리면 null + 잠깐 대기해서 대입 시도를 느리게)
create or replace function public.open_private_page(p_slug text, p_pass text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare r json;
begin
  select json_build_object('title', title, 'html', html) into r
  from public.private_pages
  where slug = p_slug and published and pass = p_pass
  limit 1;
  if r is null then perform pg_sleep(0.6); end if;
  return r;
end;
$$;

revoke all on function public.open_private_page(text, text) from public;
grant execute on function public.open_private_page(text, text) to anon, authenticated;
