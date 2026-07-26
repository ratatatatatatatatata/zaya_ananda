const { chromium } = require("playwright");
const fs = require("fs");

const PAGES = process.env.PAGES
  ? JSON.parse(process.env.PAGES)
  : [
      ["home", "/"],
      ["services", "/services"],
      ["courses", "/courses"],
      ["shop", "/shop"],
      ["about", "/about"],
      ["teachers", "/teachers"],
      ["mood", "/mood"],
      ["gift", "/gift"],
      ["resources", "/resources"],
      ["contact", "/contact"],
    ];
const OUT = process.env.OUT || "/root/zaya/before";
const BASE = process.env.BASE || "http://localhost:3000";
const FONTCSS = fs.readFileSync("/root/zaya/src/app/fonts.css", "utf8");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });
  const report = [];
  for (const [name, path] of PAGES) {
    for (const [w, h, tag] of [
      [1440, 900, "desktop"],
      [390, 844, "mobile"],
    ]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      const p = await ctx.newPage();
      const errs = [];
      p.on("pageerror", (e) => errs.push("JS: " + e.message.slice(0, 120)));
      try {
        await p.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 });
        await p.addStyleTag({ content: FONTCSS });
        // Scroll-reveal wrappers stay at opacity:0 during full-page capture — force their
        // settled (post-reveal) state so the screenshot shows what a real visitor sees.
        await p.addStyleTag({
          content: `div[style*="transition-delay"]{opacity:1 !important;transform:none !important;transition:none !important;}`,
        });
        await p.waitForTimeout(1200);
        // scroll through the whole page so IntersectionObserver reveals fire
        await p.evaluate(async () => {
          const step = window.innerHeight * 0.5;
          for (let i = 0; i < 400; i++) {
            const y = i * step;
            if (y > document.documentElement.scrollHeight) break;
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 70));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 400));
        });
        await p.waitForTimeout(1200);
        await p.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: true });
        const m = await p.evaluate(() => {
          const de = document.documentElement;
          const over = [...document.querySelectorAll("*")]
            .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 2)
            .slice(0, 3)
            .map((el) => el.tagName.toLowerCase() + "." + String(el.className).slice(0, 40));
          const hiddenReveals = [...document.querySelectorAll('div[style*="transition-delay"]')].filter(
            (r) => getComputedStyle(r).opacity === "0"
          ).length;
          return { scrollW: de.scrollWidth, clientW: de.clientWidth, h: de.scrollHeight, over, hiddenReveals };
        });
        const overflow = m.scrollW > m.clientW + 1 ? `H-OVERFLOW+${m.scrollW - m.clientW}px ${m.over.join(",")}` : "";
        const line = `${name}-${tag} h=${m.h} ${overflow}${m.hiddenReveals ? " hidden=" + m.hiddenReveals : ""}${
          errs.length ? " " + errs[0] : ""
        }`;
        console.log(line);
        report.push(line);
      } catch (e) {
        console.log(`${name}-${tag} FAIL ${e.message.slice(0, 120)}`);
      }
      await ctx.close();
    }
  }
  await b.close();
  fs.writeFileSync(`${OUT}/_report.txt`, report.join("\n"));
})();
