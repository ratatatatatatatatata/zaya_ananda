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

### 2026-11-04 — Claude — Хамтын ажиллагааны тохиргоо
- **Status:** ✅ done
- **Branch / PR:** `claude/sleepy-heisenberg-glw4pz`
- **Changed:** `AGENTS.md` (хамтын дүрэм, ChatGPT Codex автоматаар уншдаг), `CLAUDE.md` (AGENTS.md-г импортлоно), `docs/WORKLOG.md` (энэ файл), `docs/CHATGPT-START.md` (ChatGPT вэб чатад хуулж өгөх эхлэлийн prompt).
- **SQL / env needed:** none
- **Checks:** зөвхөн баримт бичиг, код өөрчлөгдөөгүй.
- **Notes for next agent:** Төслийн бүрэн context `HANDOFF.md`-д. Сүүлийн кодын ажил: podcast/Gift мөрийн inline тоглуулалт, хуудасны байрлал хадгалах (commit `249618b`).
