const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { File } = require('node:buffer');
const ts = require('typescript');

let request, sent, headers, uploadStatus = 200, signingStatus = 200;
const cache = new Map();
function load(relative) {
  const filename = path.resolve(__dirname, '..', relative);
  if (cache.has(filename)) return cache.get(filename);
  const module = { exports: {} };
  cache.set(filename, module.exports);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: id => load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(filename), id + '.ts'))),
    fetch: async (url, options) => {
      request = { url, ...JSON.parse(options.body) };
      return { ok: signingStatus === 200, json: async () => signingStatus === 200
        ? { uploadUrl: 'https://storage.example/signed', url: 'https://storage.example/original' }
        : { error: 'Upload authorization failed' } };
    },
    XMLHttpRequest: class {
      upload = {};
      status = uploadStatus;
      open(method, url) { assert.equal(method, 'PUT'); assert.equal(url, 'https://storage.example/signed'); }
      setRequestHeader(key, value) { (headers ||= {})[key] = value; }
      send(file) { sent = file; this.onload(); }
    },
  }, { filename });
  return module.exports;
}

(async () => {
  const { uploadImage } = load('lib/image-upload.ts');
  // An image larger than the former 1200px cap; PNG header and alpha bytes must stay intact.
  const png = Buffer.alloc(40);
  Buffer.from([137,80,78,71,13,10,26,10]).copy(png);
  png.writeUInt32BE(4032,16); png.writeUInt32BE(3024,20); png[25] = 6;
  for (const [type, bytes] of [
    ['image/png', png],
    ['image/gif', Buffer.from('GIF89a\x01\x00\x01\x00animation-frame-data')],
    ['image/jpeg', Buffer.from([255,216,255,225,0,6,69,120,105,102,255,217])],
    ['image/webp', Buffer.from('RIFForiginalWEBPbytes')],
  ]) {
    const file = new File([bytes], 'original', { type });
    assert.equal(await uploadImage(file), 'https://storage.example/original');
    assert.equal(sent, file, 'Upload must send the exact original File object');
    assert.deepEqual(Buffer.from(await sent.arrayBuffer()), bytes);
    assert.equal(headers['Content-Type'], type);
    assert.equal(request.size, bytes.length);
    assert.equal(request.mime, type);
  }
  const lastRequest = request;
  await assert.rejects(uploadImage(new File(['video'], 'video.mp4', { type:'video/mp4' })));
  await assert.rejects(uploadImage(new File(['<svg/>'], 'image.svg', { type:'image/svg+xml' })));
  await assert.rejects(uploadImage(new File([], 'empty.png', { type:'image/png' })));
  await assert.rejects(uploadImage(new File([new Uint8Array(10*1024*1024+1)], 'large.png', { type:'image/png' })));
  assert.equal(request, lastRequest, 'Invalid files must not request storage access');
  signingStatus = 403;
  await assert.rejects(uploadImage(new File(['png'], 'image.png', { type:'image/png' })), /authorization failed/);
  signingStatus = 200; uploadStatus = 413;
  await assert.rejects(uploadImage(new File(['png'], 'image.png', { type:'image/png' })), /413/);
  console.log('Original image bytes, MIME, size validation and upload failure tests passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
