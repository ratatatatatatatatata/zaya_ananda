# Five-language translation

The public site supports Mongolian, English, Korean, Japanese and simplified Chinese. Built-in labels work without an external service. Automatic public content translation uses Azure Translator Text API v3.

## Production activation

1. In the organisation's Azure subscription, create a **single-service Translator** resource with the **Free F0** pricing tier. Do not select S1 or a paid multi-service resource. Microsoft currently allows 2 million translated characters per subscription month on F0; requests stop when its quota is exhausted. Verify the actual resource's pricing tier in Azure—the website cannot infer it from the key.
2. Under that resource's **Keys and Endpoint**, obtain its key and location. In Vercel → zaya-ananda → Settings → Environment Variables, securely add `AZURE_TRANSLATOR_KEY` and `AZURE_TRANSLATOR_REGION` for Production. Set the region to the displayed location (for example `eastasia`), or explicitly `global` for a Global resource. Never use a `NEXT_PUBLIC_` name, commit the key, paste it into chat, or save it in public site settings.
3. Redeploy the current main commit so the server receives the variable.
4. In Admin → Site settings → Five-language translation, select “Орчуулгын холболт шалгах”. A successful result confirms a real provider request, not merely the presence of a variable.
5. Select each language on an existing journey, gift, product and about page. Add a short new public CMS description, save it and verify that the selected language translates it. Switch back to Mongolian and check the original paragraphs.

The code uses only Azure and never switches to Google or another paid provider. The free quota applies to all translated characters across target languages, not per language or per visitor. A paid Azure resource's key would still be billable, so the F0 resource selection is essential. This setup uses the public global Azure endpoint; private-network-only resources require a separate network configuration.

## Behaviour

- Explicit CMS translations and built-in labels take precedence.
- Untranslated public CMS text, journey destinations/itineraries, teacher profiles, free media titles, public lesson titles, custom pages, settings and UI labels are allowlisted server-side.
- The provider detects the source language. Only the four non-Mongolian targets are requested automatically; Mongolian restores the authored original.
- Long descriptions are segmented consistently on the server and browser. Paragraphs, React nodes, form inputs and implicit option values are preserved.
- Successful provider results are stored in the Next Data Cache per exact source, target and text/HTML format, without scheduled expiry. Text shared by different pages or request batches reuses the same entry. Changed source text gets a new key. Concurrent identical requests on a server instance are coalesced, and provider concurrency is bounded per public batch. Evicted/cleared cache entries may need translation again. Browser session storage expires after one hour.
- Transient failures are retried up to three times per source. Azure rate limits wait 60 seconds; credential/access/quota failures pause automatic requests for the current observer. Built-in/manual and already loaded translations remain visible. Going online or a successful admin connection check enables another attempt. Ignored/private text is never sent to the provider.
- Published text is the provider boundary. Account data, user messages, bank fields and protected media paths are excluded.
- Images with embedded text, recorded speech, subtitles inside third-party players and cross-origin widgets require their own localization. The site does not claim to translate these media automatically.

## Verification

Run `node scripts/test-i18n.cjs`, `node scripts/test-azure-translation.cjs` and `npm run build`. Provider unit tests use mocked Azure responses; only the authenticated admin connection check verifies real credentials. The prebuild script regenerates the public source allowlist.

Official references:
- https://learn.microsoft.com/en-us/azure/ai-services/translator/how-to/create-translator-resource
- https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/reference/authentication
- https://www.microsoft.com/en-us/translator/business/faq/
