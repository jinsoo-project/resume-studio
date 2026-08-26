-- =========================================================================
-- Resume Studio v3 — AX 포트폴리오 확장 스키마 (델타)
-- AX Marketer Portfolio.dc 화면(프론트)이 소비하는 데이터를 어드민/DB(백엔드)가
-- 공급할 수 있도록 기존 v3 스키마에 "추가"만 함. 기존 데이터/컬럼은 건드리지 않음.
-- 사용법: Supabase → SQL Editor → New query → 전체 붙여넣기 → Run  (재실행 안전)
-- =========================================================================
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) 기존 테이블 컬럼 확장 (add column if not exists — 비파괴적)
-- ---------------------------------------------------------------------------
-- works: 프로젝트 코드(A-01), 태그(역량칩 매핑), 상세 3단(문제/실행/결과)
alter table public.works add column if not exists code       text;
alter table public.works add column if not exists tags       jsonb not null default '[]';
alter table public.works add column if not exists problem    text;   -- DETAILS.problem
alter table public.works add column if not exists action     text;   -- DETAILS.action
alter table public.works add column if not exists result     text;   -- DETAILS.result

-- companies: 회사 단위 지표 카드([{v,k}]), 표시용 기간 텍스트("2023 — 현재")
alter table public.companies add column if not exists metrics     jsonb not null default '[]';
alter table public.companies add column if not exists period_text text;

-- profile: Hero 회전문구, 스택칩, Hero 헤드라인
alter table public.profile add column if not exists rot_words     jsonb not null default '[]';
alter table public.profile add column if not exists stack         jsonb not null default '[]';
alter table public.profile add column if not exists hero_headline text;

-- 참고: Hero 지표 3개(예산/ROAS/자동화)는 기존 public.highlights(value,label)를 그대로 사용.

-- ---------------------------------------------------------------------------
-- 2) 신규 테이블 (AX 화면 전용 섹션들)
-- ---------------------------------------------------------------------------
-- 역량칩 + 설명 (CHIPS + CHIP_DESC)
create table if not exists public.capabilities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text, description text,
  sort int not null default 0,
  visible boolean not null default true
);
create index if not exists capabilities_user_idx on public.capabilities(user_id);

-- AX 파이프라인 (PIPELINE: step/title/desc/tools[])
create table if not exists public.pipeline_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  step_label text,            -- "STEP 01"
  title text, description text,
  tools jsonb not null default '[]',
  sort int not null default 0,
  visible boolean not null default true
);
create index if not exists pipeline_steps_user_idx on public.pipeline_steps(user_id);

-- 역량 플로우 (FLOW: num/title/sub/caption)
create table if not exists public.flow_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  num text, title text, sub text, caption text,
  sort int not null default 0,
  visible boolean not null default true
);
create index if not exists flow_items_user_idx on public.flow_items(user_id);

-- ---------------------------------------------------------------------------
-- 3) RLS — 소유자 전체 권한 (신규 테이블에만 적용; 기존 테이블 정책은 유지)
-- ---------------------------------------------------------------------------
do $$ declare t text;
begin
  foreach t in array array['capabilities','pipeline_steps','flow_items']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists owner_all on public.%I;', t);
    execute format('create policy owner_all on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 참고: 섹션 순서/노출/제목(확장성 레이어)은 portfolio_pages.config(jsonb)에
--       sections[] 로 저장 → 신규 테이블 없이 코드 수정 없이 섹션 추가·토글·재정렬.
--       일회성 커스텀 섹션은 기존 portfolio_blocks(type,content) 사용.
-- =========================================================================
