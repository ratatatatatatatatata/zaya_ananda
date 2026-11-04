# WORKLOG — Claude ↔ ChatGPT ажлын тэмдэглэл

> Шинэ бичлэгийг **хамгийн дээр** нэм. AI бүр ажил эхлэхээсээ өмнө дээд 3–5 бичлэгийг уншина.
> Add new entries at the **top**. Each agent reads the latest 3–5 entries before starting.

## Загвар / Template

```md
### YYYY-MM-DD — <Claude | ChatGPT> — <товч гарчиг>
- **Status:** ✅ done | 🚧 in progress | ⛔ blocked
- **Branch / PR:** <branch> / <PR link>
- **Changed:** <гол файлууд, юу хийсэн>
- **SQL / env needed:** <байхгүй бол "none">
- **Checks:** <tsc / test / build үр дүн>
- **Notes for next agent:** <дутуу зүйл, анхааруулга, санал>
```

---

### 2026-11-04 — Claude — T-001 Нүүр хуудасны hero шинэчлэл
- **Status:** ✅ done
- **Branch / PR:** `claude/sleepy-heisenberg-glw4pz`
- **Changed:** `components/cinematic/CinematicLanding.tsx` (шинэ бүтэц: текст + зураг, 2 CTA, framer-motion scroll parallax хасагдсан), `app/home-hero.css` (шинэ, `zh-hero*` классууд), `app/tokens.css` (`--hero-*` 13 токен), `app/layout.tsx` (CSS import).
- **SQL / env needed:** none
- **Checks:** `tsc` OK; `next build` OK (mock backend); тест 36/37 — `upload signing …` тест өмнөөс нь унасан, энэ өөрчлөлттэй холбоогүй. 320–1920px хэвтээ overflow байхгүй, 5 хэл шалгасан.
- **Notes for next agent:** `app/cinematic.css`, `app/classic.css`, `app/responsive.css` доторх хуучин `.discovery-hero*` дүрмүүд одоо ашиглагдахгүй (`.discovery-hero-stats`, `.discovery-kicker` бусад хэсэгт ашиглагдсаар байгаа тул тэдгээрийг бүү устга). Цэвэрлэх бол тусдаа TASK болго. Унасан тест: `tests/reel-media.test.cjs` #37.

### 2026-11-04 — Claude — Үүрэг: ChatGPT удирдагч (20%), Claude гүйцэтгэгч (80%)
- **Status:** ✅ done
- **Branch / PR:** `claude/sleepy-heisenberg-glw4pz`
- **Changed:** `AGENTS.md` — §0 үүрэг хуваарь, §6 TASK формат, §7 REPORT формат; `docs/CHATGPT-START.md` — ChatGPT-д өгөх удирдагчийн prompt болон TASK↔REPORT урсгал.
- **SQL / env needed:** none
- **Checks:** зөвхөн баримт бичиг.
- **Notes for next agent:** Цаашид ажил ChatGPT-ийн `=== TASK for Claude ===` блокоор ирнэ; Claude дуусгаад `=== REPORT from Claude ===` өгнө.

### 2026-11-04 — Claude — Хамтын ажиллагааны тохиргоо
- **Status:** ✅ done
- **Branch / PR:** `claude/sleepy-heisenberg-glw4pz`
- **Changed:** `AGENTS.md` (хамтын дүрэм, ChatGPT Codex автоматаар уншдаг), `CLAUDE.md` (AGENTS.md-г импортлоно), `docs/WORKLOG.md` (энэ файл), `docs/CHATGPT-START.md` (ChatGPT вэб чатад хуулж өгөх эхлэлийн prompt).
- **SQL / env needed:** none
- **Checks:** зөвхөн баримт бичиг, код өөрчлөгдөөгүй.
- **Notes for next agent:** Төслийн бүрэн context `HANDOFF.md`-д. Сүүлийн кодын ажил: podcast/Gift мөрийн inline тоглуулалт, хуудасны байрлал хадгалах (commit `249618b`).
