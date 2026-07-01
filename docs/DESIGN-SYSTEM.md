# Zaya's Ananda — Design System

## Brand
Calm, clean energy, trust, wisdom, inner balance, professional education. Light & premium — never dark-mystical, neon or cluttered.

## Colors
- Primary turquoise/teal: `#16AFA4` (scale `primary.50–900`), from the circular logo
- Deep teal: `#0C5C57` (`deep`)
- Muted gold accent: `#B8912F` (`accent`)
- Charcoal blue-green text: `#15302C` (`ink`); muted `#5C726E`
- Surfaces: white `#FFFFFF`, warm ivory `#FAF6EC` (`cream`), light aqua `#EFFAF8` (`aqua`)
- Borders/lines: `#E2EEEB` (`line`)
- Success / in-stock: `#1B9E86` (`jade`)
- Backgrounds: clean white with subtle aqua radial gradients (`bg-aurora`, body tint)

## Typography
- Display (titles): **Playfair Display** serif — supports Cyrillic
- Body / UI: **Manrope** sans — supports Cyrillic
- CJK fallback: Noto Sans/Serif KR·JP·SC (for the 5-language system mn/en/ko/ja/zh)

## Radius & elevation
- Cards: `rounded-3xl` (≈24px) / panels `rounded-4xl`–`rounded-5xl`
- Shadows: `shadow-card`, `shadow-soft`, `shadow-lift` (teal-tinted, soft)

## Components
- Buttons: `.btn` + `.btn-primary` (teal gradient), `.btn-gold`, `.btn-outline`, `.btn-ghost`; sizes sm/md/lg, pill-shaped
- Cards `.card`, chips `.chip`, eyebrow `.eyebrow`, inputs `.input`/`.textarea`, `.field-label`
- Decorative: `EnergyWaves` (soft concentric ripples, flowing lines, light particles), `MeditationFigure` (elegant lotus silhouette), `Logo` (turquoise circular emblem), line `Icon` set
- Motion: gentle — `fadeUp`, `floaty`, `ripple`, `drift`; reduced, calm

## Layout & responsive
- Container max 1240px; section padding `py-16 → py-24`
- Mobile-first: large readable text, simple checkout, clear single CTA, sticky header with hamburger
- Accessibility: high contrast charcoal-on-light, large tap targets for older users
