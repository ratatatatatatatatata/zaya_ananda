# AGENTS.md — Claude + ChatGPT хамтын ажиллагааны дүрэм

> Энэ файлыг **ChatGPT (Codex)** автоматаар уншдаг; **Claude Code** `CLAUDE.md`-ээр дамжуулан уншдаг.
> Хоёр AI нэг repo дээр ээлжилж ажиллана — ажил эхлэхээс өмнө энэ файл, дараа нь
> `docs/WORKLOG.md`-ийн сүүлийн бичлэгүүдийг заавал унш.
>
> This file is read automatically by ChatGPT Codex, and by Claude Code via `CLAUDE.md`.
> Both agents take turns on the same repo. Before starting, read this file and the latest entries in `docs/WORKLOG.md`.

## 1. Эхлэхийн өмнө / Before you start

1. `git fetch origin && git status` — сүүлийн өөрчлөлтийг татаж ав; өөр AI-ийн commit-ийг хэзээ ч дарж бичихгүй.
2. `docs/WORKLOG.md`-ийн хамгийн дээд 3–5 бичлэгийг унш (хэн юу хийсэн, юу дутуу үлдсэн).
3. Төслийн бүрэн context: `HANDOFF.md` (бүтэц, env, Supabase SQL, хийгдсэн боломжууд).
4. Дизайн өөрчлөх бол: `docs/DESIGN-SYSTEM.md` — өнгө зөвхөн `app/tokens.css`-ээр, түүхий hex хориотой.

## 2. Төсөл товчоор / Project at a glance

- Next.js 14 App Router + TypeScript + Tailwind, Vercel дээр deploy, Supabase (Postgres + Storage).
- 5 хэл: mn (өгөгдмөл) / en / ko / ja / zh. UI бичвэр `data/strings.ts`, контент `{ mn, en, ko, ja, zh }`.
- Өгөгдлийн давхарга: `lib/repo.ts` → `lib/supabase.ts` (өөрийн PostgREST client, supabase-js биш).
- Auth: `lib/auth.ts` (JWT cookie). Админ = `ADMIN_EMAIL`.
- Node 20 (`.nvmrc`).

## 3. Командууд / Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # .env.local шаардлагатай (build үед Supabase руу ханддаг)
npx tsc --noEmit     # type check — commit-оос өмнө заавал
node --test tests/*.test.cjs scripts/test-*.cjs   # тестүүд (azure тест env шаардана)
```

## 4. Ажлын дүрэм / Working rules

- **Нэг удаад нэг AI.** Нөгөө AI-ийн дуусаагүй ажил (WORKLOG дээр `🚧 in progress`) байвал түүнийг үргэлжлүүл эсвэл хэрэглэгчээс асуу — зэрэг өөр зүйл эхлүүлэхгүй.
- **Branch:** `main` руу шууд push хийхгүй. Branch нэр: `claude/<topic>` эсвэл `chatgpt/<topic>` (Codex-ийн өөрийн `codex/...` ч болно). PR-ээр merge.
- **Commit:** жижиг, нэг зорилготой; англи хэлээр, тушаах хэлбэрээр ("Fix cart total rounding"). Commit бүрийн доор `Agent: Claude` эсвэл `Agent: ChatGPT` мөр нэм.
- **Хамрах хүрээ:** хүссэн зүйлээ л өөрчил. Нөгөө AI-ийн бичсэн кодыг "сайжруулах" гэж дахин бичихгүй — санал байвал WORKLOG-ийн "Notes for next agent" хэсэгт бич.
- **Нууц мэдээлэл:** `.env*`, API key, `service_role` key-г хэзээ ч commit хийхгүй, чат/лог руу хуулахгүй.
- **i18n:** шинэ UI бичвэр нэмэх бол 5 хэлийг бүгдийг нь бөглө (`data/strings.ts`).
- **DB өөрчлөлт:** шинэ багана/хүснэгт нэмбэл `alter table ... if not exists` SQL-ийг `HANDOFF.md`-д нэм, WORKLOG-д "SQL шаардлагатай" гэж тэмдэглэ.
- **Устгахгүй:** `_backup-before-redesign/`, `_to_delete/` хавтсанд хэрэглэгчийн зөвшөөрөлгүй хүрэхгүй.

## 5. Ажил дуусгахдаа / When you finish

1. `npx tsc --noEmit` болон холбогдох тест ногоон байгаа эсэхийг шалга.
2. `docs/WORKLOG.md`-ийн **хамгийн дээр** шинэ бичлэг нэм (доорх загвараар).
3. Commit + push, PR линкээ хэрэглэгчид өг.
4. Том өөрчлөлт бол `HANDOFF.md`-ийн холбогдох хэсгийг шинэчил.
