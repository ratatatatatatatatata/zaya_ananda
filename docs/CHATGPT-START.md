# ChatGPT-г ажилд оруулах / Getting ChatGPT started

## A. ChatGPT Codex (GitHub-тэй холбогдсон) — санал болгох

1. chatgpt.com/codex → GitHub-ээ холбож `ratatatatatatatatata/zaya_ananda` repo-г сонго.
2. Codex `AGENTS.md`-г автоматаар уншина. Даалгавраа шууд бич, жишээ нь:
   > `docs/WORKLOG.md`-ийн сүүлийн бичлэгүүдийг уншаад, дараа нь: <таны даалгавар>
3. Codex PR нээнэ → та шалгаад merge хийнэ. Дараа нь Claude-д "main-ээс үргэлжлүүл" гэхэд Claude WORKLOG-оос уншаад үргэлжлүүлнэ.

## B. Энгийн ChatGPT чат (repo-д хандалтгүй)

Доорх текстийг ChatGPT-д эхэнд нь хуулж өг, дараа нь холбогдох файлуудын агуулгыг хамт буулга:

```
Чи "Zaya's Ananda" вэбсайт дээр Claude-тэй хамтарч ажиллаж байна.
Stack: Next.js 14 App Router, TypeScript, Tailwind, Supabase (өөрийн PostgREST client lib/supabase.ts), Vercel.
5 хэл (mn өгөгдмөл, en, ko, ja, zh) — UI бичвэр data/strings.ts, шинэ бичвэрт 5 хэлийг бүгдийг бөглө.
Өнгө зөвхөн app/tokens.css токеноор, түүхий hex бүү ашигла.
Дүрэм:
- Зөвхөн хүссэн зүйлийг өөрчил, бусад кодыг дахин бүү бич.
- Өөрчлөлтийг бүтэн файлаар эсвэл тодорхой diff-ээр өг, файлын замыг заа.
- Нууц key хэзээ ч бүү оруул.
- Төгсгөлд нь docs/WORKLOG.md-д нэмэх бичлэгийг энэ загвараар бич:
  ### YYYY-MM-DD — ChatGPT — <гарчиг>
  - Status / Changed / SQL-env needed / Checks / Notes for next agent
Даалгавар: <энд бичнэ>
```

ChatGPT-ийн өгсөн кодыг Claude-д "энэ өөрчлөлтийг хэрэгжүүлж, шалгаад commit хий" гэж өгвөл Claude type check хийж, WORKLOG-д бичээд push хийнэ.

## Ээлжийн урсгал / Hand-off loop

```
Хэрэглэгч → AI #1 ажиллана → WORKLOG + commit/PR → merge
          → AI #2: "WORKLOG уншаад үргэлжлүүл" → ...
```
