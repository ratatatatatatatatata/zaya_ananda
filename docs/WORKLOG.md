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

### 2026-11-04 — Claude — Нүүр хуудсанд хөдөлгөөнт, загварлаг хэсгүүд (хэрэглэгчийн шууд хүсэлт)
- **Status:** ✅ done
- **Branch / PR:** `claude/sleepy-heisenberg-glw4pz`
- **Changed:** Хэрэглэгчийн өгсөн 2 гадны prompt-оос (Halloween scroll, 3D portfolio) зөвхөн техникийг авсан; тэдний asset/контентыг ашиглаагүй.
  - Hero: гарчиг үг үгээр маскнаас дээш гарна (`CinematicLanding.tsx`), зурган дээр гэрлийн бөөмс (`components/home/HeroMotes.tsx`, canvas), үндсэн CTA соронзон эффект (`components/motion/Magnet.tsx`).
  - Курсорыг дагах дулаан гэрэл (`components/home/LanternCursor.tsx`, зөвхөн нарийн заагч).
  - Шинэ "Бидний зорилго" хэсэг — scroll-оор тэмдэгт бүр тодорно (`components/home/HomeManifesto.tsx`).
  - Шинэ scroll-marquee — CMS-ийн үйлчилгээ/сургалт/бүтээгдэхүүний зургууд 2 мөрөөр эсрэг чиглэлд, `/item/[id]` рүү холбоостой (`components/home/HomeMarquee.tsx`; 4-өөс цөөн зурагтай бол харагдахгүй).
  - `app/page.tsx` (products татах, шинэ хэсгүүд), `app/home-hero.css`, `app/tokens.css` (`--hero-mote/lantern/faint`), `data/strings.ts` (4 шинэ түлхүүр × 5 хэл).
- **SQL / env needed:** none
- **Checks:** `tsc` OK; `next build` OK; тест 36/37 (өмнөх reel-media #37). 320–1920px overflow 0, 5 хэл (CJK мөр таслалт засагдсан), reduced-motion үед бүх хөдөлгөөн унтарна.
- **Notes for next agent:** Дараалал: Hero → Бидний зорилго → Marquee → Танилцуулга видео → бусад. Manifesto бичвэр `home.manifesto` түлхүүрт.

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
