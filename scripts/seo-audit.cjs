const fs = require('fs');
const path = require('path');
const dir = 'content/guides/zh-CN';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();

function fm(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const o = {};
  if (!m) return o;
  for (const l of m[1].split(/\r?\n/)) {
    const k = l.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (k) o[k[1]] = k[2].trim().replace(/^["']|["']$/g, '');
  }
  return o;
}
function body(raw) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
}
function type(slug) {
  if (/^chapter-/.test(slug)) return '章节';
  if (['rusty-sword','falchion','kopis','greek-sword','sica','khopesh','broken-spear','xiphos'].includes(slug)) return '刀剑实体';
  if (['blades','charms','artefacts','collectibles','resonance-points','theseus-echoes'].includes(slug)) return '收集Hub';
  if (['puzzles','achievements','skills','bosses','characters','combat','beginner','ending','story','sophia','faq','wiki'].includes(slug)) return '攻略';
  if (['chapters'].includes(slug)) return '章节Hub';
  return '信息页';
}

const rows = [];
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = fm(raw);
  const b = body(raw);
  const internal = (b.match(/\]\((\/zh-CN\/guide[^)]*)\)/g) || []).length;
  const external = (b.match(/\]\((https?:\/\/[^)]*)\)/g) || []).length;
  const words = (b.replace(/[#|*>\-`\n]/g, ' ').match(/[\u4e00-\u9fff]|[A-Za-z0-9]+/g) || []).length;
  rows.push({
    slug: f.replace('.mdx', ''),
    type: type(f.replace('.mdx', '')),
    words,
    internal,
    external,
    descLen: (m.description || '').length,
    order: parseInt(m.order) || 0,
  });
}
rows.sort((a, b) => a.order - b.order);

console.log('总页面数:', rows.length);
console.log('类型分布:', JSON.stringify(rows.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {})));
console.log('');
console.log('order | slug | 类型 | 字数 | 内链 | 外链 | desc长');
for (const r of rows) {
  console.log(String(r.order).padStart(3) + ' | ' + r.slug.padEnd(28) + ' | ' + r.type.padEnd(5) + ' | ' + String(r.words).padStart(4) + ' | ' + String(r.internal).padStart(2) + ' | ' + String(r.external).padStart(2) + ' | ' + String(r.descLen).padStart(3));
}
console.log('');
console.log('内链为0的页面:', rows.filter((r) => r.internal === 0).map((r) => r.slug).join(', ') || '无');
console.log('字数<150的页面:', rows.filter((r) => r.words < 150).map((r) => r.slug + '(' + r.words + ')').join(', ') || '无');
