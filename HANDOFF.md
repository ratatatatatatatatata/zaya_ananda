# Zaya's Ananda — Project Handoff / Гардуулах баримт

> Энэ баримт бол төслийн бүрэн context. Шинэ сессион (жишээ нь Claude Fable 5) дээр энэ фолдерыг холбоод эхэнд нь **энэ файлыг уншуул** — бүх ажил, бүтэц, дутуу тохиргоо энд байгаа.
>
> This is the full project context. In a new session (e.g. Claude Fable 5), connect this folder and read this file first — everything built, the architecture, and remaining setup steps are captured here.

---

## 1. Товч танилцуулга / Overview

**Zaya's Ananda (Заяа-гийн Ананда)** — Монгол хэл дээрх далд ухамсар / энерги / бясалгал / эрүүл мэндийн төвийн вэбсайт. Production Next.js апп, **Vercel** дээр deploy хийгддэг, **Supabase** (Postgres + Storage) ашигладаг. 5 хэлтэй (mn/en/ko/ja/zh), өгөгдмөл хэл нь монгол.

Админ нэг л имэйлээр удирддаг (`ADMIN_EMAIL`), бүх контентоо CMS-ээр нэмж/засаж/устгадаг.

## 2. Технологи / Stack

- **Next.js 14.2** App Router, **TypeScript**, **Tailwind CSS**.
- **Supabase Postgres** — `@supabase/supabase-js` ашиглаагүй; өөрийн хөнгөн **PostgREST fetch client** (`lib/supabase.ts`). camelCase↔snake_case дээд түвшний key mapping.
- **Auth** — өөрийн JWT session (`lib/auth.ts`, `getSessionUserId`, `createSession`, `AUTH_SECRET`), scrypt password hashing.
- **i18n** — `lib/i18n.tsx` (`useI18n()` → `{ lang, setLang, t, tr }`), `data/strings.ts`, `lib/i18n-core.ts` (`pick`, defaultLocale = "mn"). Inline `Lx(mn,en,ko,ja,zh)` + `tr()`.
- **Supabase Storage** — видеонд зориулсан хаалттай bucket `lesson-videos`, signed upload/download URL.
- **Зураг** — client талд canvas-аар JPEG base64 болгож шахаж (max ~1200px), DB-ийн text баганад хадгална.

## 3. Орчны хувьсагч / Environment variables

`.env.local` (локал) болон **Vercel → Settings → Environment Variables** дээр байх ёстой:

| Нэр | Тайлбар |
|---|---|
| `AUTH_SECRET` | JWT session secret (санамсаргүй урт мөр) |
| `ADMIN_EMAIL` | Админы имэйл (энэ имэйлээр нэвтэрсэн хүн л `/admin`-д ханддаг). Одоогийн: `turuu.naranbaatar0711@gmail.com` |
| `SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Мөн адил (browser талд) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser талд видео байршуулахад хэрэглэнэ) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (зөвхөн сервер тал) |
| `RESEND_API_KEY` | Resend.com имэйл API key — нууц үг сэргээх код илгээхэд (үнэгүй багц 100 имэйл/өдөр) |
| `RESEND_FROM` | Илгээгч хаяг, жишээ: `Zaya's Ananda <no-reply@tanii-domain.mn>` (домэйн баталгаажуулаагүй үед `onboarding@resend.dev` — зөвхөн өөрийн имэйл рүү тест илгээнэ) |

> ⚠️ **Аюулгүй байдал:** `service_role` key-г урьд нь чат дээр буулгаж байсан тул **Supabase дээр reset/rotate хийхийг зөвлөж байна**. Хэзээ ч git-д commit хийхгүй, зөвхөн env-ээр.

## 4. Supabase бүрэн тохиргоо / Full DB + Storage setup

Supabase **SQL Editor** дээр дараах бүхнийг ажиллуулбал бүрэн бэлэн болно (аль хэдийн ажиллуулсан бол `if not exists` тул давхардахгүй):

```sql
-- Core tables
create table if not exists users (
  id text primary key,
  name text,
  email text,
  phone text,
  password_hash text,
  created_at timestamptz default now()
);
create table if not exists cms_items (
  id text primary key,
  kind text,
  title text,
  summary text,
  body text,
  price integer,
  category text,
  mode text,
  created_at timestamptz default now()
);
create table if not exists orders (
  id text primary key,
  user_id text,
  items jsonb,
  total integer,
  status text,
  customer jsonb,
  created_at timestamptz default now()
);
create table if not exists messages (
  id text primary key,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  created_at timestamptz default now()
);

-- cms_items rich fields
alter table cms_items add column if not exists image         text;
alter table cms_items add column if not exists video_lessons integer;
alter table cms_items add column if not exists students      integer;
alter table cms_items add column if not exists views         integer;
alter table cms_items add column if not exists teacher_name  text;
alter table cms_items add column if not exists teacher_image text;
alter table cms_items add column if not exists teacher_info  text;
alter table cms_items add column if not exists access_days   integer;
alter table cms_items add column if not exists lessons       jsonb;
alter table cms_items add column if not exists link          text;

-- orders access expiry
alter table orders add column if not exists expires_at timestamptz;

-- editable site settings (About / logo / social)
create table if not exists site_settings (
  id text primary key,
  logo text,
  about_title text,
  about_body text,
  facebook text,
  instagram text,
  youtube text,
  updated_at timestamptz default now()
);
```

**RLS:** RLS-г enable хийсэн ч болно — `service_role` key нь RLS-г тойрдог тул сервер тал ажиллана.

**Storage:** `lesson-videos` bucket анх видео байршуулахад автоматаар (private) үүснэ. Гэхдээ:
- Supabase **үнэгүй багц дээр нэг файл дээд тал нь ~50MB**, нийт хадгалалт ~1GB. Жинхэнэ хичээлийн видеонд **Supabase Pro ($25/сар)** авч, Storage → Settings дээр "Upload file size limit"-ээ ихэсгэх шаардлагатай.

## 5. Хийгдсэн бүх боломж / Features built

**Нүүр ба ерөнхий**
- Кино маягийн видео hero (`components/CinematicHero.tsx`) — нүүр хуудас зөвхөн энэ hero-той.
- 5 хэл (mn/en/ko/ja/zh), хэл солигч, өгөгдмөл монгол.
- Header (хайлтгүй, нэг мөр nav), Footer (холбоо барих мэдээлэл, засварладаг лого/сошиал). "Админ удирдлага" линк зөвхөн админд.
- Холбоо барих хуудас (имэйл ЭСВЭЛ утас), Google map embed, хаяг/утас(tel:)/имэйл(mailto:).
  - Хаяг: "Улаанбаатар хот, Хан-Уул дүүрэг, Намуун төгөл хотхон, 8Б", plus code `WW49+4X3`. Утас: 72022002. Имэйл: zayasanandacentre@gmail.com.

**Төөрөг (`/toorog`)** — ирээдүйн календарь, төрсөн огноогоор өдрийн уншлага, төлбөртэй сар/жилийн дэлгэрэнгүй (тусдаа үнэ, 5 хэлээр).

**Бүртгэл / Нэвтрэлт**
- Бүртгэл: имэйл заавал биш (имэйл ЭСВЭЛ утас шаардлагатай), нууц үг.
- Нэвтрэлт: имэйл эсвэл утсаар. Facebook (demo) нэвтрэлт. `isAdmin` талбар (сервер тал тооцоолж буцаана).

**CMS (админ)** — `services / courses / products / resources / promos`
- Нэмэх / **Засах** / Устгах. Зураг байршуулах (шахсан base64).
- Ангилал сонголт: үйлчилгээ → *Оношилгоо / Эмчилгээ*; зөвлөгөө → *Зөвлөгөө / Видео зөвлөгөө*.
- Сургалт: суралцагч/үзсэн тоо, багшийн мэдээлэл, хандах хугацаа (хоног).
- **Видео**: бүх контентод (промоос бусад) видео файл folder-оос байршуулна + чанарын шошго (480p–4K) + English хадмал (.vtt/.srt, srt→vtt автомат).
  - Сургалтын видео — зөвхөн **төлбөр төлсөн** хэрэглэгчид (signed URL, `/api/lessons`).
  - Үйлчилгээ/бүтээгдэхүүн/зөвлөгөөний видео — дэлгэрэнгүй хуудсанд **нээлттэй** (`components/ItemVideos.tsx`).

**Дэлгэрэнгүй хуудас (`/item/[id]`)** — зураг, мэдээлэл, худалдан авах хайрцаг, багш, видеонууд.

**Худалдан авалт**
- "Худалдаж авах" → **QPay** эсвэл **банкны шилжүүлэг**. Банк: Хаан банк, данс **5304611250**, хүлээн авагч **Заяа Бат-Эрдэнэ**. Гүйлгээний утга = худалдан авагчийн бүртгэлтэй имэйл/утас (хуулж авах).
- Захиалга **pending** болж үүснэ → админ шалгаад баталгаажуулна (автоматаар биш).

**Захиалга (админ)**
- Баталгаажуулахдаа **хандах хоногоо сонгоно** → үлдсэн хоног буурч, дуусахад "Эрх дууслаа".
- Баталгаажсан захиалгыг ч **цуцлах** боломжтой. Захиалга/зурвасыг **устгах**.

**Хуудсууд**
- Үйлчилгээ: дээр талд **сурталчилгааны banner** (олон бол эргэлддэг) + ангилал таб.
- Зөвлөгөө: ангилал таб.

**Админ Тохиргоо таб** — Бидний тухай (гарчиг/дэлгэрэнгүй), лого зураг, сошиал холбоос (Facebook/Instagram/YouTube) засварлах.

**Админ табууд:** overview, users, orders, services, courses, products, Зөвлөгөө, Сурталчилгаа, reviews, messages, Тохиргоо.

## 6. Гол файлууд / Key files

- `lib/supabase.ts` — PostgREST client (`sbSelect/sbInsert/sbUpdate/sbDelete`, `toRow/fromRow`) + Storage helpers (`ensureBucket`, `signedUploadUrl`, `signedDownloadUrl`).
- `lib/repo.ts` — бүх өгөгдлийн үйлдэл (users, orders, messages, cms `createCmsItem/updateCmsItem/deleteCmsItem`, `getSettings/updateSettings`, `adminStats`, `isAdminEmail`).
- `lib/auth.ts` — session/JWT.
- `lib/types.ts` — `CmsItem`, `Order`, `SiteSettings`, `PublicUser` г.м.
- `lib/i18n.tsx`, `lib/i18n-core.ts`, `data/strings.ts` — олон хэл.
- `components/AdminContentManager.tsx` — CMS нэмэх/засах форм (видео/хадмал upload-той).
- `components/AdminSettings.tsx` — сайтын тохиргооны форм.
- `components/PurchaseBox.tsx` — худалдан авах урсгал.
- `components/CourseLessons.tsx` / `components/ItemVideos.tsx` — видео тоглуулагч (гатлагатай / нээлттэй).
- `components/PromoBanner.tsx`, `components/CmsFilterGrid.tsx` — сурталчилгаа + ангилал таб.
- `app/admin/page.tsx` — админ самбар.
- `app/api/**` — route handlers (auth, admin/content, admin/orders, admin/messages, settings, lessons, access, pay/notify, video-upload-url, contact).
- `app/item/[id]/page.tsx`, `app/services|courses|shop|resources|about|contact|toorog/page.tsx`.

## 7. Локал ажиллуулах / Run locally

```bash
npm install
# .env.local-оо бөглөнө (дээрх env хүснэгт)
npm run dev      # http://localhost:3000
npm run build    # production build шалгах
```

## 8. Deploy

GitHub repo → **Vercel** (push хийхэд автоматаар deploy). Env хувьсагчдыг Vercel дээр нэмнэ.

```bash
git add . && git commit -m "..." && git push
```

## 9. Дутуу/дараагийн ажил / Standing & next

- **Заавал:** дээрх Supabase SQL-ийг ажиллуулах; том видеонд Supabase Pro; `service_role` key-г rotate хийх.
- QPay нь одоогоор mock (жинхэнэ QPay интеграци хийгээгүй). Facebook нэвтрэлт demo.
- Хүсвэл жинхэнэ олон-чанар (1080p/4K adaptive) видеонд Mux эсвэл Cloudflare Stream интеграци (тусдаа акаунт/төлбөр).
- ✅ **Хурд сайжруулалт хийгдсэн (2026-07):** нийтийн хуудсууд (`/services`, `/courses`, `/shop`, `/resources`, `/about`, `/item/[id]`) одоо `force-dynamic` биш — ISR (`revalidate = 300`) + `unstable_cache` (таг: `cms`, `settings`, `lib/repo.ts`-ийн `listCmsCached/getCmsByIdCached/getSettingsCached`). Админ CMS нэмэх/засах/устгах болон Тохиргоо хадгалахад `revalidateTag`+`revalidatePath` дуудагдаж өөрчлөлт шууд харагдана. `/api/settings` GET мөн кэштэй. Анхаар: `npm run build` одоо build үед Supabase-руу ханддаг тул `.env.local` шаардлагатай.

---

## 10. 2026-07 нэмэлтүүд (Fable сессион)

**Заавал ажиллуулах SQL (Supabase SQL Editor):**

```sql
-- Бүтээгдэхүүний олон зураг
alter table cms_items add column if not exists images jsonb;

-- Тохиргоо: видео, хамт олон, багш нар, данс
alter table site_settings add column if not exists about_video text;
alter table site_settings add column if not exists team jsonb;
alter table site_settings add column if not exists teachers jsonb;
alter table site_settings add column if not exists bank jsonb;

-- Админ өөрөө үүсгэдэг цэсний хуудсууд
create table if not exists pages (
  id text primary key,
  title text,
  nav_label text,
  body text,
  image text,
  video text,
  position integer default 0,
  created_at timestamptz default now()
);

-- Нууц үг сэргээх код
alter table users add column if not exists reset_code_hash text;
alter table users add column if not exists reset_expires timestamptz;
```

**Хийгдсэн боломжууд:**
- Админ контент нэмэхэд зурагны хажууд видео хэсэг зэрэгцээ; ангилал болон товч тайлбар талбар хасагдсан; "Дэлгэрэнгүй мэдээлэл" нь Word маягийн rich text editor (фонт, хэмжээ, тод/доогуур, өнгө, байрлал, `components/RichTextEditor.tsx`) — HTML болж хадгалагдаад `RichBody`-оор харагдана.
- Бүтээгдэхүүн 1–3 зурагтай (`images` багана); дэлгэрэнгүйд галерей + дарахад томруулах lightbox (`components/ImageGallery.tsx`); бүх картын зураг томорсон; дэлгүүрийн карт: зураг → нэр → үнэ.
- Бүтээгдэхүүний дэлгэрэнгүйд тоо ширхэгтэй "Сагсанд нэмэх" + "Худалдаж авах" (`components/ProductBuyBox.tsx`), доор нь "Санал болгох бүтээгдэхүүн". `/api/orders` CMS бүтээгдэхүүнийг ID-гаар нь таньдаг болсон.
- Багшийн мэдээлэл `site_settings.teachers`-д автоматаар хадгалагдаж, формд "Өмнөх багш сонгох" dropdown-оор бөглөгдөнө.
- Тохиргоо: "Бидний тухай" видео, "Хамт олон" (зураг/нэр/албан тушаал/дэлгэрэнгүй — about хуудсанд гарна), дансны мэдээлэл (PurchaseBox үүнийг уншина).
- "Ерөнхий тохиргоо (Цэс)" админ таб: шинэ хуудас үүсгэвэл Header цэсэнд автоматаар мөр нэмэгдэнэ (`/p/[id]`, `pages` хүснэгт, `components/AdminPages.tsx`).
- Нууц үг: админ хэрэглэгчийн нууц үгийг шинэчилнэ (users таб); нэвтрэх хуудсанд "Нууц үг мартсан?" → `/reset` — имэйлээр 6 оронтой код (Resend, `lib/email.ts`). **RESEND_API_KEY тохируулаагүй бол код илгээгдэхгүй.**

---

*Энэ баримтыг шинэ сессион дээр эхэнд уншуулбал ажлаа тасралтгүй үргэлжлүүлж болно.*
