-- =========================================================================
-- Resume Studio v2 — 정규화 스키마 (회사→작업 행 단위) + 미디어(이미지/영상/첨부) + Storage
-- 사용법: Supabase → SQL Editor → New query → 전체 붙여넣기 → Run  (한 번만)
-- 재실행 안전(IF NOT EXISTS / on conflict). RLS 전면 적용.
-- =========================================================================
create extension if not exists pgcrypto;

-- ---------- 콘텐츠(원본) ----------
create table if not exists public.profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name_ko text, name_en text, title text, tagline text, total_years text,
  email text, phone text, location text, avatar_url text,
  summary text, links jsonb not null default '[]', role_tags jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text, role text, period text, summary text,
  logo_url text,                              -- 회사 로고/앱 아이콘
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists companies_user_idx on public.companies(user_id);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text, category text, period text,
  summary text, detail text, featured boolean not null default false,
  icon text,                                  -- 이모지/심볼(선택)
  cover_url text,                             -- 대표 이미지/썸네일
  metrics jsonb not null default '[]',
  stack   jsonb not null default '[]',
  links   jsonb not null default '[]',        -- 외부 URL들
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists works_company_idx on public.works(company_id);
create index if not exists works_user_idx on public.works(user_id);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references public.works(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'image',         -- image | video | file
  url text not null, title text, alt text,
  sort int not null default 0
);
create index if not exists media_work_idx on public.media(work_id);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_name text, items jsonb not null default '[]', sort int not null default 0
);
create index if not exists skills_user_idx on public.skills(user_id);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school text, degree text, period text, sort int not null default 0
);
create index if not exists education_user_idx on public.education(user_id);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text, org text, date_text text, sort int not null default 0
);
create index if not exists awards_user_idx on public.awards(user_id);

-- ---------- 출력물 ----------
create table if not exists public.resume_docs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique, title text, template text,
  config jsonb not null default '{}', snapshot jsonb,
  visibility text not null default 'unlisted',
  updated_at timestamptz not null default now()
);
create index if not exists resume_user_idx on public.resume_docs(user_id);

create table if not exists public.portfolio_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique, title text, subtitle text, intro text, cover_url text,
  config jsonb not null default '{}', snapshot jsonb,
  visibility text not null default 'unlisted',
  updated_at timestamptz not null default now()
);
create index if not exists pf_user_idx on public.portfolio_pages(user_id);

create table if not exists public.portfolio_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.portfolio_pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, content jsonb not null default '{}', sort int not null default 0
);
create index if not exists pfblocks_page_idx on public.portfolio_blocks(page_id);

-- ---------- RLS ----------
do $$ declare t text;
begin
  foreach t in array array['profile','companies','works','media','skills','education','awards','resume_docs','portfolio_pages','portfolio_blocks']
  loop execute format('alter table public.%I enable row level security;', t); end loop;
end $$;

-- 소유자 전체 권한 (모든 콘텐츠·출력 테이블)
do $$ declare t text;
begin
  foreach t in array array['profile','companies','works','media','skills','education','awards','resume_docs','portfolio_pages','portfolio_blocks']
  loop
    execute format('drop policy if exists owner_all on public.%I;', t);
    execute format('create policy owner_all on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;

-- 발행물(비공개 아님)은 누구나 읽기 — 공개 뷰가 snapshot을 읽음
drop policy if exists resume_public_read on public.resume_docs;
create policy resume_public_read on public.resume_docs for select using (visibility <> 'private');
drop policy if exists pf_public_read on public.portfolio_pages;
create policy pf_public_read on public.portfolio_pages for select using (visibility <> 'private');

-- ---------- 회원가입 시 빈 프로필 자동 생성 ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profile (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- updated_at 자동 갱신 ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
do $$ declare t text;
begin
  foreach t in array array['profile','companies','works','resume_docs','portfolio_pages']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s;', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- ---------- Storage 버킷(이미지/영상썸네일/첨부) + 정책 ----------
insert into storage.buckets (id, name, public) values ('media','media', true)
  on conflict (id) do nothing;
drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists media_write_own on storage.objects;
create policy media_write_own on storage.objects for insert to authenticated with check (bucket_id = 'media' and owner = auth.uid());
drop policy if exists media_update_own on storage.objects;
create policy media_update_own on storage.objects for update to authenticated using (bucket_id = 'media' and owner = auth.uid());
drop policy if exists media_delete_own on storage.objects;
create policy media_delete_own on storage.objects for delete to authenticated using (bucket_id = 'media' and owner = auth.uid());
