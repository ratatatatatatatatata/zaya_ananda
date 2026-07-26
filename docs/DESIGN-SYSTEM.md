# Zaya's Ananda — Design System

> **Энэ баримт бол кодын үнэн эх сурвалж.** Өнгө нэмэх/өөрчлөх бол эхлээд
> `app/tokens.css`-ийг засна — `tailwind.config.ts` нь зөвхөн тэр хувьсагчид рүү
> заадаг. Компонент дотор түүхий hex (`bg-[#1A2742]`) бичихийг хориглоно.

## Brand

Calm, clean energy, trust, wisdom, inner balance, professional education.
**Гэрэлтэй, тансаг** — агуулгын хуудсууд цайван; **гүн кино мөчүүд** нь зориуд
тусгаарлагдсан (hero, 3D аялал, хуудасны толгой).

## Хоёр хүрээ / Two scopes

| Scope | Хаана | Хэрхэн |
|---|---|---|
| `:root` (light) | Бүх агуулгын хуудас — үйлчилгээ, сургалт, дэлгүүр, тухай, сагс, админ | Өгөгдмөл |
| `.night` (dark) | `PageHeader`, `Journey3D`, `AnandaCinematic`, Сүнслэг аяллын карт | Тухайн section дээр `night` класс нэмнэ |

`.night` дотор орсон бүх токен (`bg-surface-1`, `text-ink`, `border-line`,
`text-primary-700` …) автоматаар гүн хувилбар руу шилжинэ. Тиймээс компонентод
theme-aware класс бичих шаардлагагүй.

```tsx
<section className="night relative overflow-hidden bg-[#131D3B]">
  <p className="text-muted">…</p>   {/* .night дотор цайвар саарал болно */}
</section>
```

## Colors

Бүх өнгө `app/tokens.css` дотор **RGB channel triplet** хэлбэрээр — ингэснээр
Tailwind-ийн тунгалаг байдлын модификатор (`bg-primary-500/15`) ажиллана.

- Primary turquoise: `#16AFA4` (лого) — `primary.50–900`
- Accent gold: `#846821` текстэд, `#E3C26B → #C9A03A` градиентэд
- Jade (success): `#14806C`
- Ink `#15302C`, muted `#5C726E`, line `#E2EEEB`
- Surfaces: `surface.1` цагаан → `surface.5` хамгийн гүн цайвар; хуудасны дэвсгэр warm ivory `#FAF7F0`
- Decorative (хоёр сэдэвт ижил): `blue`, `grape`, `lavender`, `blush`

### Хүртээмжийн дүрэм (WCAG 2.1 AA)

Эдгээрийг **зөрчиж болохгүй** — `node contrast.js` шалгана:

- Жижиг текст ≥ **4.5:1**, том текст (≥24px, эсвэл ≥18.66px bold) ≥ **3:1**
- `primary.600/700/800` нь цайвар дэвсгэр дээр текстэд аюулгүй (4.73 / 5.63 / 8.56)
- `primary.300/400/500` бол **текстийн өнгө биш** — зөвхөн хүрээ, дүрс, дэвсгэр
- Товчны градиент цагаан текстээ давуулна: `--grad-primary` хамгийн цайвар цэг = 5.06:1
- Алтан товч (`btn-gold`) нь **гүн бэхэн текстээр** (7.13:1), цагаанаар биш
- Зураг дээрх шошго: `bg-[#15302C]/80` (хамгийн муу тохиолдолд 7.48:1)

## Typography

- Display: **Lora** — кирилл бүрэн дэмждэг
- Body / UI: **Manrope** — кирилл бүрэн дэмждэг
- CJK fallback: Noto Sans/Serif KR·JP·SC (mn/en/ko/ja/zh)
- ⚠️ **Instrument Serif-д кирилл үсэг байхгүй.** `.font-instrument` нь одоо Lora руу
  заадаг — монгол гарчигт Instrument Serif ашиглавал fallback болж, харагдац эвдэрнэ.
- Фонт нь `public/fonts`-оос өөрсдийн сервер дээрээс ачаалагдана (`app/fonts.css`).
  Google Fonts руу гуравдагч талын render-blocking хүсэлт **байхгүй**.

## Radius & elevation

- Cards `rounded-3xl` (24px), panels `rounded-4xl`–`rounded-5xl`
- Shadows: `shadow-card`, `shadow-soft`, `shadow-lift` — `--shadow-tint`-ээр өнгөрдөг
  тул `.night` дотор автоматаар гүнзгийрнэ

## Components

- Buttons `.btn` + `.btn-primary` / `.btn-gold` / `.btn-magic` / `.btn-outline` / `.btn-ghost`,
  хэмжээ sm/md/lg, бүгд pill хэлбэртэй, **хамгийн багадаа 44px өндөр** (WCAG 2.5.5)
- `.card`, `.card-lux`, `.chip`, `.eyebrow`, `.input` / `.textarea`, `.field-label`, `.nav-link`
- Decorative: `CosmicBackdrop` (зөөлөн аура + оч), `EnergyWaves`, `MeditationFigure`, `Logo`, `Icon`
- Motion: `fadeUp`, `floaty`, `ripple`, `driftUp` — тайван, багассан хөдөлгөөнийг хүндэтгэнэ

## Layout & responsive

- Container max 1240px; section padding `py-14 → py-24`
- Mobile-first: том уншигдахуйц текст, энгийн төлбөр, тод нэг CTA, наалдамхай толгой
- Хэвтээ гүйлт хориотой — чимэглэлийн blur-ууд `overflow-hidden` эцэгтэй байх
- Хүртээмж: өндөр контраст, ахмад хэрэглэгчдэд том хүрэх талбай

## Шалгах / Verify

```bash
npm run build          # TypeScript + production build
node contrast.js       # WCAG AA сканнер (бүх хуудсаар)
node shots.js          # desktop + mobile скриншот, хэвтээ гүйлт илрүүлэлт
```
