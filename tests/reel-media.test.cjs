// Run: node --test tests/reel-media.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function load(relative, mocks = {}, cache = new Map()) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const req = name => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('@/') || name.startsWith('.')) {
      const target = name.startsWith('@/') ? path.join(root, name.slice(2)) : path.resolve(path.dirname(file), name);
      return load(path.relative(root, target + '.ts'), mocks, cache);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', js)(req, module, module.exports);
  return module.exports;
}
const { collectPublicMedia } = load('lib/public-media.ts');
const { reelUploadError, REEL_MAX_BYTES } = load('lib/reel-upload.ts');
const base = { id: 'test-id', title: 'Reel', kind: 'free', category: 'reel:ayalal' };
test('links, uploaded URLs, legacy paths and image-only Reels are visible', () => {
  const result = collectPublicMedia([
    {...base, link: 'https://youtu.be/5XNhlb7vYWY'},
    {...base, id: 'upload', lessons: [{title: 'Upload', url: 'https://example.com/video.mp4'}]},
    {...base, id: 'legacy', lessons: [{title: 'Legacy', path: '2026/private.mp4'}]},
    {...base, id: 'image', image: 'https://example.com/cover.jpg'},
  ]);
  assert.equal(result.length, 4);
  assert.equal(result[2].url, '/api/public-media?itemId=legacy&index=0');
  assert.equal(result[3].mediaType, 'image');
});
test('paid lessons and paid resources never become public media', () => {
  for (const item of [{...base, kind:'course'}, {...base, price: 100}, {...base, kind:'resource',price:100}]) {
    assert.equal(collectPublicMedia([{...item, lessons:[{path:'paid.mp4'}]}]).length, 0);
  }
});
test('uploads reject active content, empty files and oversized files', () => {
  assert.equal(reelUploadError('video/mp4', REEL_MAX_BYTES), null);
  assert.ok(reelUploadError('video/mp4', REEL_MAX_BYTES + 1));
  assert.ok(reelUploadError('image/jpeg', 11 * 1024 * 1024));
  assert.ok(reelUploadError('image/svg+xml', 100));
  assert.ok(reelUploadError('video/mp4', 0));
});
test('private legacy playback signs only a free record’s own path', async () => {
  let item = {...base, lessons:[{path:'legacy.mp4'}]};
  let signed = [];
  const route = load('app/api/public-media/route.ts', {
    '@/lib/repo': { getCmsById: async () => item },
    '@/lib/supabase': { signedDownloadUrl: async (...args) => { signed.push(args); return 'https://example.com/signed'; } },
  });
  const request = new Request('https://site.test/api/public-media?itemId=test&index=0&path=paid.mp4');
  assert.equal((await route.GET(request)).status, 307);
  assert.deepEqual(signed[0], ['lesson-videos','legacy.mp4',3600]);
  for (const patch of [{kind:'course'}, {kind:'resource',price:100}, {kind:'free',price:100}]) {
    item = {...base,...patch,lessons:[{path:'paid.mp4'}]};
    assert.equal((await route.GET(request)).status, 404);
  }
  assert.equal(signed.length, 1);
  assert.equal((await route.GET(new Request('https://site.test/api/public-media?itemId=test&index=-1'))).status, 400);
});
test('upload signing requires admin and uses only the dedicated public media bucket', async () => {
  let uid = null, admin = false, calls = [];
  const route = load('app/api/admin/reel-upload-url/route.ts', {
    '@/lib/auth': { getSessionUserId: async () => uid },
    '@/lib/repo': { checkAdmin: async () => ({ok:admin}) },
    '@/lib/supabase': {
      ensureBucket: async (...args) => calls.push(args),
      signedUploadUrl: async (bucket, path) => `https://storage.test/${bucket}/${path}?token=signed`,
      publicStorageUrl: (bucket, path) => `https://storage.test/${bucket}/${path}`,
    },
  });
  const req = (mime='video/mp4',size=100) => new Request('https://site.test/api/admin/reel-upload-url',{method:'POST',body:JSON.stringify({mime,size})});
  assert.equal((await route.POST(req())).status,401);
  uid='admin-test'; assert.equal((await route.POST(req())).status,403);
  admin=true; assert.equal((await route.POST(req('text/html'))).status,400);
  assert.equal(calls.length,0);
  const response=await route.POST(req()); assert.equal(response.status,200);
  const body=await response.json(); assert.match(body.url,/\/reel-media\/\d{4}\/[\w-]+\.mp4$/);
  assert.equal(calls[0][0],'reel-media'); assert.equal(calls[0][1].fileSizeLimit,REEL_MAX_BYTES);
});
