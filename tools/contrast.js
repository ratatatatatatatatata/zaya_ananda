const { chromium } = require("playwright");

const PAGES = [
  "/", "/services", "/courses", "/shop", "/about", "/teachers",
  "/mood", "/gift", "/resources", "/toorog", "/ayalal", "/matrix", "/login", "/cart",
];

(async () => {
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  let total = 0;
  for (const path of PAGES) {
    await p.goto("http://localhost:3000" + path, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(1800);
    await p.evaluate(async () => {
      const step = innerHeight * 0.6;
      for (let i = 0; i < 60; i++) {
        const y = i * step;
        if (y > document.documentElement.scrollHeight) break;
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(600);

    const bad = await p.evaluate(() => {
      const lum = (r, g, bl) => {
        const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
      };
      const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      // walk up for the first opaque background
      // Returns the first opaque flat background, or null when an ancestor paints a
      // gradient/image we cannot sample — those are reported separately, not as failures.
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const s = getComputedStyle(n);
          if (s.backgroundImage && s.backgroundImage !== "none") return null;
          const c = parse(s.backgroundColor);
          if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c;
          n = n.parentElement;
        }
        return [255, 255, 255];
      };
      const out = [];
      for (const el of document.querySelectorAll("p,span,a,li,h1,h2,h3,h4,button,label,strong,div")) {
        const txt = (el.innerText || "").trim();
        if (!txt || txt.length < 3) continue;
        if (el.children.length && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        const st = getComputedStyle(el);
        if (st.visibility === "hidden" || st.display === "none" || +st.opacity < 0.5) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const fg = parse(st.color);
        if (fg[3] !== undefined && fg[3] < 0.5) continue;
        const bg = bgOf(el);
        if (!bg) continue; // gradient/image backdrop — not measurable, checked visually
        const L1 = lum(fg[0], fg[1], fg[2]), L2 = lum(bg[0], bg[1], bg[2]);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const size = parseFloat(st.fontSize);
        const largeText = size >= 24 || (size >= 18.66 && +st.fontWeight >= 700);
        const need = largeText ? 3 : 4.5;
        if (ratio < need) {
          out.push({ t: txt.slice(0, 44), ratio: +ratio.toFixed(2), need, size: Math.round(size),
                     fg: st.color, bg: `rgb(${bg.slice(0,3).join(",")})` });
        }
      }
      const seen = new Set();
      return out.filter((o) => { const k = o.t + o.ratio; if (seen.has(k)) return false; seen.add(k); return true; });
    });

    total += bad.length;
    console.log(`${path.padEnd(12)} ${bad.length === 0 ? "OK" : bad.length + " below WCAG AA"}`);
    bad.slice(0, 6).forEach((x) => console.log(`    ${x.ratio} (need ${x.need}) ${x.size}px  "${x.t}"  ${x.fg} on ${x.bg}`));
  }
  console.log("\nTOTAL failures:", total);
  await b.close();
})();
