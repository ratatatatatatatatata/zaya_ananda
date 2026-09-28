const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
// Compile only these pure functions; no build output or browser state needed.
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const { computeChart, localToUtc, splitLon } = require('../lib/astro.ts');
const { natalAspects, angleDistance } = require('../lib/natal-analysis.ts');
const { isWealthReading, isNatalReading } = require('../lib/zurhai-cards.ts');
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS', name); }
const epoch = Date.UTC(2000, 0, 1, 12);

test('UTC conversion includes historical summer time and fractional offsets', () => {
  assert.equal(localToUtc(2020,1,1,12,0,'Asia/Ulaanbaatar'), Date.UTC(2020,0,1,4));
  assert.equal(localToUtc(2016,7,1,12,0,'Asia/Ulaanbaatar'), Date.UTC(2016,6,1,3));
  assert.equal(localToUtc(2020,1,1,12,0,'Asia/Kathmandu'), Date.UTC(2020,0,1,6,15));
});
test('invalid dates and zones fail instead of falling back to a different location', () => {
  assert.throws(() => localToUtc(2021,2,29,12,0,'UTC'));
  assert.throws(() => localToUtc(2020,1,1,12,0,'Invalid/Zone'));
  assert.throws(() => computeChart({utcMs:NaN,timeKnown:false}));
  assert.throws(() => computeChart({utcMs:epoch,lat:91,lon:0,timeKnown:true}));
});
test('nonexistent and repeated DST hours require valid user input', () => {
  assert.throws(() => localToUtc(2024,3,10,2,30,'America/New_York'), /алгассан/);
  assert.throws(() => localToUtc(2024,11,3,1,30,'America/New_York'), /давтагдсан/);
  assert.equal(localToUtc(2024,11,3,1,30,'America/New_York',-240), Date.UTC(2024,10,3,5,30));
  assert.equal(localToUtc(2024,11,3,1,30,'America/New_York',-300), Date.UTC(2024,10,3,6,30));
  assert.throws(() => localToUtc(2024,11,3,1,30,'America/New_York',480));
});
test('unknown time omits house, ascendant and uncertain lunar aspects', () => {
  const chart = computeChart({utcMs:epoch,timeKnown:false});
  assert.equal(chart.asc,null); assert.equal(chart.cusps,null);
  assert(chart.planets.every(p => p.house === null));
  assert(natalAspects(chart).every(a => a.a.key !== 'moon' && a.b.key !== 'moon'));
});
test('Whole Sign / Equal houses and polar fallback stay well-defined', () => {
  const opts={utcMs:epoch,lat:47.9077,lon:106.8832,timeKnown:true};
  const whole=computeChart({...opts,houseSystem:'whole'}), equal=computeChart({...opts,houseSystem:'equal'});
  assert.equal(whole.cusps[0]%30,0); assert.equal(equal.cusps[0],equal.asc);
  for (const chart of [whole,equal,computeChart({...opts,lat:80})]) {
    assert(chart.cusps.every(Number.isFinite));
    assert(chart.planets.every(p=>p.house>=1 && p.house<=12));
  }
  assert.equal(computeChart({...opts,lat:80}).houseSystem,'equal');
});
test('aspect wraparound and conjunction matching', () => {
  assert.equal(angleDistance(359,1),2);
  const chart=computeChart({utcMs:epoch,timeKnown:false});
  chart.planets=chart.planets.filter(p=>['sun','mercury'].includes(p.key)).map((p,i)=>({...p,lon:i ? 1 : 359}));
  const aspects=natalAspects(chart);assert.equal(aspects.length,1);assert.equal(aspects[0].key,'conjunction'); assert.equal(aspects[0].deviation,2);
});
test('position formatting never displays 30 degrees in a sign', () => {
  assert.equal(splitLon(29.9999).sign.key,'taurus'); assert.equal(splitLon(29.9999).deg,0);
  assert.equal(splitLon(359.9999).sign.key,'aries'); assert.equal(splitLon(359.9999).min,0);
});
test('legacy wealth cards removed; current astrology card routed to natal', () => {
  assert(isWealthReading({title:'Баялагийн зурхай',href:'/merge'}));
  assert(isWealthReading({title:'Баялгийн зурхай',href:'/merge'}));
  assert(!isWealthReading({title:'Пифагор тоон зурхай',href:'/merge'}));
  assert(isNatalReading({title:'Астрологи Одон орон зурхай',href:'/merge'}));
});
const fixturePath = path.join(__dirname,'fixtures/natal-reference.json');
  const fixtures=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
  test('independent Swiss Ephemeris reference positions and Placidus cusps', () => {
    for (const f of fixtures.cases) {
      const chart=computeChart({utcMs:Date.parse(f.utc),lat:f.lat,lon:f.lon,timeKnown:true});
      f.planets.forEach((longitude,i)=>assert(angleDistance(chart.planets[i].lon,longitude)<0.03, `${f.utc} ${chart.planets[i].key}`));
      f.cusps.forEach((longitude,i)=>assert(angleDistance(chart.cusps[i],longitude)<0.03, `${f.utc} cusp ${i+1}: ${chart.cusps[i]} vs ${longitude}`));
    }
  });
console.log(`${passed} natal checks passed`);
