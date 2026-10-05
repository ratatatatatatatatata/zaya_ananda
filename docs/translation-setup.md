# Five-language translation

The public site supports Mongolian, English, Korean, Japanese and simplified Chinese. Built-in labels work without an external service. New CMS text requires Google Cloud Translation Basic.

## Production activation

1. In the organisation's Google Cloud project, enable Cloud Translation API and its billing. Create an API key restricted to Cloud Translation API.
2. In Vercel → zaya-ananda → Settings → Environment Variables, securely add `GOOGLE_TRANSLATE_API_KEY` for Production. Never use a `NEXT_PUBLIC_` name, commit the key, paste it into chat, or save it in public site settings.
3. Redeploy the current main commit so the server receives the variable.
4. In Admin → Site settings → Five-language translation, select “Орчуулгын холболт шалгах”. A successful result confirms a real provider request, not merely the presence of a variable.
5. Select each language on an existing journey, gift, product and about page. Add a short new public CMS description, save it and verify that the selected language translates it. Switch back to Mongolian and check the original paragraphs.

API requests are billable according to the Google Cloud project's plan. Configure budget alerts and quotas in that project.

## Behaviour

- Explicit CMS translations and built-in labels take precedence.
- Untranslated public CMS text, journey destinations/itineraries, teacher profiles, free media titles, public lesson titles, custom pages, settings and UI labels are allowlisted server-side.
- The provider detects the source language. Only the four non-Mongolian targets are requested automatically; Mongolian restores the authored original.
- Long descriptions are segmented consistently on the server and browser. Paragraphs, React nodes, form inputs and implicit option values are preserved.
- Successful provider results are cached for 30 days by exact source and target. Changed source text gets a new key. Browser session storage expires after one hour.
- Transient failures are retried up to three times per source. Going online or a successful admin connection check enables another attempt. Ignored/private text is never sent to the provider.
- Published text is the provider boundary. Account data, user messages, bank fields and protected media paths are excluded.
- Images with embedded text, recorded speech, subtitles inside third-party players and cross-origin widgets require their own localization. The site does not claim to translate these media automatically.

## Verification

Run `node scripts/test-i18n.cjs` and `npm run build`. The prebuild script regenerates the public source allowlist.
