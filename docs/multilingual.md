# Five-language website translation

Supported locales: Mongolian (`mn`), English (`en`), Korean (`ko`), Japanese (`ja`), simplified Chinese (`zh`).

Built-in UI translations and saved CMS translations work without external credentials. To translate missing public content automatically, set the server-only `GOOGLE_TRANSLATE_API_KEY` in Vercel Production and redeploy. Enable Cloud Translation API in the key's Google Cloud project and restrict the key to that API. Never use a `NEXT_PUBLIC_` variable for this key.

`GET /api/translations` reports whether the server is configured, without exposing the key. It does not guarantee that the provider's billing or API restrictions are valid; verify by changing language on a published page with new content.

The translation endpoint accepts only supported languages and text found in the generated UI source list or published CMS, journey, teacher, and settings content. It never reads user accounts, private messages, orders, bank details, or protected lessons. Requests are bounded and successful results are cached by exact text and target language. CMS translations entered by an administrator take priority. Failed translations retain the original text.

`npm run build` regenerates `data/translation-sources.json`. Run `node --test scripts/test-i18n.cjs` for language round-trips, manual overrides, allowlist enforcement, missing configuration, provider failures, and preservation of text nodes/form content.

The translation applies to website text. Uploaded image lettering and recorded video/audio remain their original media.
