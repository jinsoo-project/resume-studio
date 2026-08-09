# Resume Studio — 이력서 빌더 대시보드

콘텐츠를 한 번 입력해두고 → 블록을 조립해 → 원티드/리멤버/웹 템플릿을 입혀 → **URL로 발행**하는 개인 이력서·포트폴리오 빌더.

- **프론트**: 빌드 없는 정적 앱 (HTML/CSS/JS) — Node 불필요
- **데이터·인증**: Supabase (Postgres + Auth + RLS)
- **소스**: GitHub · **호스팅**: Vercel

## 파일 구조

| 파일 | 역할 |
|---|---|
| `studio.html` | 대시보드 본체 (라이브러리 편집 · 빌더 · 발행) |
| `templates.js` | 공용 렌더 엔진 (원티드/리멤버/웹) |
| `view.html` | 발행 URL 공개 뷰 (+ PDF 저장) |
| `resume.data.js` | 최초 시드 데이터 |
| `config.js` | **Supabase 키를 넣는 곳** |
| `supabase/schema.sql` | DB 스키마 (SQL Editor에 붙여넣기) |
| `vercel.json` | 배포 설정 (`/r/:slug` 라우팅) |

---

# 세팅 런북 (순서대로)

> 계정 생성·로그인·키 발급은 **본인만** 할 수 있습니다. 아래 순서대로 진행하면 됩니다.

## ① Supabase (데이터 + 로그인)

1. https://supabase.com → **Sign in** (GitHub 계정으로 로그인 추천)
2. **New project** → 이름(예: `resume-studio`) · DB 비밀번호 설정 · Region: **Northeast Asia (Seoul)** → Create
3. 프로젝트 생성되면(1~2분) → 좌측 **SQL Editor** → **New query** → `supabase/schema.sql` 내용 전체 붙여넣기 → **Run**
   - "Success. No rows returned" 나오면 성공
4. 좌측 **Project Settings → API** 에서 두 값 복사:
   - **Project URL**
   - **Project API keys → `anon` `public`**
5. `config.js` 열어서 두 값 붙여넣기 → 저장
6. (인증) **Authentication → Providers → Email** 이 켜져 있는지 확인 (기본 ON, 매직링크 로그인)

> ✅ 여기까지 하면 저(클로드)에게 알려주세요. 그럼 앱에 로그인·저장·발행을 연결하고 검증합니다.

## ② GitHub (소스 저장)

로컬은 이미 `git` 저장소로 초기화되어 있습니다. 원격만 연결하면 됩니다.

1. https://github.com/new → 레포 이름(예: `resume-studio`) → **Private** 추천 → Create (README/gitignore 추가 체크 **해제**)
2. 터미널에서 (이 폴더):
   ```bash
   git remote add origin https://github.com/<your-id>/resume-studio.git
   git push -u origin main
   ```

## ③ Vercel (배포)

1. https://vercel.com → **Sign in with GitHub**
2. **Add New → Project** → 방금 만든 레포 **Import**
3. Framework Preset: **Other** (빌드 없음) → **Deploy**
4. 배포 완료되면 `https://<프로젝트>.vercel.app` 발급
   - 대시보드: `.../studio.html`
   - 발행된 이력서: `.../r/<slug>`
5. (선택) **Settings → Domains** 에서 커스텀 도메인 연결

---

## 보안 메모

- `config.js`의 `anon` 키는 공개용이라 커밋해도 됩니다 (RLS가 데이터를 보호).
- **`service_role` 키는 절대 커밋/클라이언트 노출 금지.**
- 모든 테이블 RLS ON — 내 데이터는 나만, 발행(public/unlisted)한 문서만 공개 뷰에서 읽힘.

## 현재 상태 / 다음 단계

- [x] 정적 빌더(오프라인 localStorage) 동작
- [x] 3종 템플릿 렌더 + URL 발행(인코딩)
- [x] Supabase 스키마 / 배포 설정 / 런북
- [ ] **①까지 완료 후** → 앱에 Supabase 로그인·클라우드 저장·`/r/slug` 발행 연결
- [ ] 노션 상세 콘텐츠(이미지·URL) 반영 ← 노션 **공개 링크** 또는 **Markdown 내보내기** 필요
