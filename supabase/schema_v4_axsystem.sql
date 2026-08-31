-- =========================================================================
-- Resume Studio v4 — AX 운영 체계(마케팅 콘솔 구조) 테이블
-- AX 탭 딥다이브용: 운영 루프 / 화면 카탈로그 / 사상·정의.
-- Supabase → SQL Editor → 붙여넣기 → Run (재실행 안전)
-- =========================================================================
create extension if not exists pgcrypto;

-- 운영 루프 (수집→적재→측정→실행→영업 등 단계별 + bullet)
create table if not exists public.ax_loop (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  num text, title text,
  items jsonb not null default '[]',
  sort int not null default 0, visible boolean not null default true
);
create index if not exists ax_loop_user_idx on public.ax_loop(user_id);

-- 화면 카탈로그 (카테고리별 대시보드/화면)
create table if not exists public.ax_screens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text, name text, code text, badge text, description text, source text,
  chips jsonb not null default '[]',
  sort int not null default 0, visible boolean not null default true
);
create index if not exists ax_screens_user_idx on public.ax_screens(user_id);

-- 사상(principle) · 공통 정의(definition) — section으로 구분
create table if not exists public.ax_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text, title text, body text,
  sort int not null default 0, visible boolean not null default true
);
create index if not exists ax_notes_user_idx on public.ax_notes(user_id);

-- RLS
do $$ declare t text;
begin
  foreach t in array array['ax_loop','ax_screens','ax_notes']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists owner_all on public.%I;', t);
    execute format('create policy owner_all on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;
