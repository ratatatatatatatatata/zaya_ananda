---
name: zaya-ananda-content
description: Prepare recurring Mongolian Zaya’s Ananda Center topic posts, source-based captions, and posters using one fixed official-logo template. Use for Ananda daily themes, spiritual course-linked content, typography and branded post production. Do not use for unrelated brands or automatic publishing.
---

# Zaya’s Ananda Center content

Find `content-studio/` in the current repository. If working from the parent research project, use its `ananda-content-studio/content-studio/` checkout. Read its README and `references/editorial-guide.md` before drafting. The repository contains public software and brand assets, not the private class archive.

## Topic to source to post

1. Treat the user's topic as a subject, not a verified claim. In Codex, run `scripts/prepare_topic.py --topic '…' --out .local/brief-<new-version>.json` from `content-studio/`. Read the shortlisted notes and relevant surrounding source. The lexical score is retrieval only. If no source genuinely covers the topic, state the exact gap; never invent a course connection.
2. Keep private notes, source briefs, recordings, analysis and source ledgers on the Mac. Do not put them in GitHub, a prompt for Claude, another external service, or a public deliverable. A previous private-content consultation was rejected by automatic review; do not retry through another route. Claude must use public/sanitized material only. This skill does not authorize external transfer of private course excerpts.
3. Record source indices, source hash, what the source supports, and limits in `.local/` only. Notes are a secondary analysis, not a verified teacher quotation. Do not claim complete listening or quote the teacher unless checked against the actual recording. Remove students' identities and private stories from public copy.
4. Write a complete natural Mongolian caption from one supported idea. Address people with Та/Таны/Танд. Explain spiritual concepts as the centre's teaching perspective, not medical/scientific proof. Do not invent prices, timetables, dates, outcomes, enrolment offers, rituals or practice sequences.
5. Distil the idea into at most two short headline lines and one optional support line. Read it aloud. Prefer concrete expressions related to the picture. No English-like literal syntax, repeated abstract nouns, generic moral slogan or invented inspirational quotation. Put explanations in the caption.
6. Select a relevant authorized picture. Never represent generated people as the teacher or students. Preserve photo provenance locally. Use built-in image generation only for supporting art when needed; typeset all final Mongolian text deterministically.
7. Use **only** `brand/template-v1.json` with `scripts/render_post.py`. The full official PNG logo stays at the top. Lora headline + Manrope body, positions, size, colour and margins stay fixed. Change the picture and words. Do not silently shrink overflowing text: edit the wording instead. The template is a studio recommendation pending user aesthetic feedback, not an approved brand lock.
8. Write a new draft JSON and render into a new versioned output folder. Deliver PNG, editable SVG, caption TXT and a local source ledger. Inspect actual PNG at full and phone size; verify Ө/Ү, crop and logo fidelity. Editable SVG requires the bundled fonts. Preserve previous versions.

## Repeated requests

For “өнөөдрийн сэдэв …” or “... сэдвээр пост бэлд”, perform the entire flow without asking the user to repeat the brand, font, logo or template. For batches, use `content-studio/themes-14-days.json` as a provisional sequence; validate each theme against the actual local sources before drafting. User feedback updates a new template version, never an existing approved asset.

The workflow prepares drafts for review. Scheduling and publishing require the user's explicit platform instruction. Never claim Facebook analytics, engagement improvement, Claude connectivity or publishing without direct evidence.
