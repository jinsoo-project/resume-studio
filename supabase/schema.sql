-- =========================================================================
-- Resume Studio — Supabase 스키마
-- 사용법: Supabase 대시보드 → SQL Editor → 새 쿼리 → 전체 붙여넣기 → Run
-- (한 번만 실행하면 됩니다. 재실행해도 안전하도록 IF NOT EXISTS 사용)
-- =========================================================================

-- 1) 라이브러리 : 사용자당 1행. 모든 콘텐츠(경력·프로젝트·스킬…)를 jsonb로 보관
create table if not exists public.library (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) 문서(조립본) : 발행하는 이력서들
create table if not exists public.documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  slug       text not null unique,                 -- 공개 URL 주소 (/r/<slug>)
  title      text,
  template   text,                                 -- wanted | remember | web ...
  config     jsonb not null default '{}'::jsonb,   -- 빌더 설정(블록 토글/순서)
  snapshot   jsonb,                                -- 렌더용 확정본(공개 뷰가 읽음)
  visibility text not null default 'unlisted',     -- private | unlisted | public
  updated_at timestamptz not null default now()
);

create index if not exists documents_user_idx on public.documents(user_id);

-- 3) 행 수준 보안(RLS) 켜기
alter table public.library   enable row level security;
alter table public.documents enable row level security;

-- 4) 정책
-- 내 라이브러리만 읽고 쓰기
drop policy if exists "own library" on public.library;
create policy "own library" on public.library
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 내 문서: 전체 권한
drop policy if exists "own documents" on public.documents;
create policy "own documents" on public.documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 발행된 문서(비공개 아님): 누구나 읽기 (공개 뷰용)
drop policy if exists "read published" on public.documents;
create policy "read published" on public.documents
  for select
  using (visibility <> 'private');

-- 5) 라이브러리 자동 생성 트리거 (회원가입 시 빈 라이브러리 1행)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.library (user_id, data) values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6) updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists library_touch on public.library;
create trigger library_touch before update on public.library
  for each row execute function public.touch_updated_at();

drop trigger if exists documents_touch on public.documents;
create trigger documents_touch before update on public.documents
  for each row execute function public.touch_updated_at();
