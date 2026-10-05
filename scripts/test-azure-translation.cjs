const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function fixture() {
  const modules = new Map();
  function load(relative) {
    const file = path.resolve(root, relative);
    if (modules.has(file)) return modules.get(file).exports;
    const mod = { exports: {} }; modules.set(file, mod);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    function req(name) {
      // Test the caching boundary with a success-only implementation of Next's contract.
      if (name === 'next/cache') return { unstable_cache(fn) {
        const cache = new Map();
        return async (...args) => {
          const key = JSON.stringify(args);
          if (cache.has(key)) return cache.get(key);
          const value = await fn(...args); cache.set(key, value); return value;
        };
      }};
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name + '.ts'));
      return require(name);
    }
    new Function('require', 'module', 'exports', code)(req, mod, mod.exports);
    return mod.exports;
  }
  process.env.AZURE_TRANSLATOR_KEY = 'test-only';
  process.env.AZURE_TRANSLATOR_REGION = 'eastasia';
  return { service: load('lib/translation-service.ts'), cms: load('lib/translate.ts') };
}
function successfulFetch(calls) {
  return async (url, options) => {
    const query = new URL(url).searchParams;
    const body = JSON.parse(options.body);
    calls.push({ url, options, body, query });
    return Response.json(body.map(item => ({ translations: [{ text: 'Translated ' + item.Text, to: query.get('to') }] })));
  };
}

test('regional keys use headers, all four targets work, and secrets never enter URLs', async () => {
  const { service } = fixture(); const calls = []; global.fetch = successfulFetch(calls);
  for (const locale of ['en', 'ko', 'ja', 'zh']) assert.deepEqual(await service.translateBatch(['Монгол'], locale), ['Translated Монгол']);
  assert.deepEqual(calls.map(call => call.query.get('to')), ['en', 'ko', 'ja', 'zh-Hans']);
  for (const { options, url, query } of calls) {
    assert.equal(options.headers['Ocp-Apim-Subscription-Region'], 'eastasia');
    assert.equal(options.headers['Ocp-Apim-Subscription-Key'], 'test-only');
    assert.equal(query.has('from'), false); assert.equal(url.includes('test-only'), false);
  }
  delete process.env.AZURE_TRANSLATOR_REGION;
  assert.equal(service.translationReady(), false);
  await assert.rejects(service.translateBatch(['Монгол'], 'en'), { issue: 'not_configured' });
});

test('same text reuses results across batches, while language, edited text and HTML remain distinct', async () => {
  const { service } = fixture(); const calls = []; global.fetch = successfulFetch(calls);
  await service.cachedTranslations(['Нэг', 'Хоёр'], 'en');
  await service.cachedTranslations(['Гурав', 'Нэг'], 'en');
  assert.equal(calls.length, 3);
  await service.cachedTranslation('Нэг', 'ko');
  await service.cachedTranslation('Нэг зассан', 'en');
  await service.cachedTranslation('Нэг', 'en', 'html');
  assert.equal(calls.length, 6); assert.equal(calls[5].query.get('textType'), 'html');
});

test('simultaneous cache misses are coalesced, and failed requests can be retried', async () => {
  const { service } = fixture(); const calls = []; global.fetch = successfulFetch(calls);
  await Promise.all([service.cachedTranslation('Ижил', 'en'), service.cachedTranslation('Ижил', 'en')]);
  assert.equal(calls.length, 1);
  global.fetch = async () => new Response('', { status: 429 });
  await assert.rejects(service.cachedTranslation('Дахин', 'en'), { issue: 'rate_limited' });
  global.fetch = successfulFetch(calls);
  assert.equal(await service.cachedTranslation('Дахин', 'en'), 'Translated Дахин');
});

test('quota, credentials and malformed responses fail safely without another provider', async () => {
  const { service } = fixture();
  for (const [status, issue] of [[401, 'credentials'], [403, 'quota_or_access'], [429, 'rate_limited'], [503, 'provider_unavailable']]) {
    let calls = 0;
    global.fetch = async url => { calls++; assert.equal(new URL(url).hostname, 'api.cognitive.microsofttranslator.com'); return new Response('private provider details', { status }); };
    await assert.rejects(service.translateBatch(['Текст'], 'en'), { issue }); assert.equal(calls, 1);
  }
  for (const payload of [[], [{}], [{ translations: [{ text: 'Wrong target', to: 'ja' }] }]]) {
    global.fetch = async () => Response.json(payload);
    await assert.rejects(service.translateBatch(['Текст'], 'en'), { issue: 'incomplete' });
  }
});

test('CMS preserves manual translations, uses HTML mode, and keeps existing content when F0 stops', async () => {
  const { cms } = fixture(); const calls = []; global.fetch = successfulFetch(calls);
  const existing = { en: { title: 'Hand-written' } };
  const result = await cms.autoTranslate({ title: 'Гарчиг', body: '<p>Агуулга</p>' }, existing);
  assert.equal(result.en.title, 'Hand-written'); assert.deepEqual(existing, { en: { title: 'Hand-written' } });
  assert.equal(calls.filter(call => call.query.get('textType') === 'html').length, 4);
  assert.equal(calls.some(call => call.query.get('to') === 'en' && call.body[0].Text === 'Гарчиг'), false);
  global.fetch = async () => new Response('', { status: 403 });
  assert.deepEqual(await cms.autoTranslate({ title: 'Өөр гарчиг' }, existing), existing);
});
