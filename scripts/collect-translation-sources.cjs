// Public UI source strings for the server's translation allowlist.
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const sources = new Set();
const normalize = value => value.replace(/\s+/gu, ' ').trim();
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!/\.tsx?$/.test(file)) continue;
    const tree = ts.createSourceFile(file, fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
    function visit(node) {
      if (ts.isJsxText(node) || ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
        const value=normalize(node.text);
        if (/[А-Яа-яӨөҮүЁё]/u.test(value)) sources.add(value);
      }
      ts.forEachChild(node,visit);
    }
    visit(tree);
  }
}
for(const dir of ['app','components','data']) walk(dir);
fs.writeFileSync('data/translation-sources.json', JSON.stringify([...sources].sort(),null,2)+'\n');
console.log(`Collected ${sources.size} translatable source strings`);
