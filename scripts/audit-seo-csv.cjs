/*
 * audit-seo-csv.cjs —— 重新生成英文站技术 SEO 验收 CSV（2026-09-15 第一二轮修改后）。
 *
 * 用法：node scripts/audit-seo-csv.cjs
 * 输出：
 *   ../SEO诊断/legacy_en_tech_seo_after.csv   （80 个英文 URL 的技术 SEO 快照）
 *   ../SEO诊断/legacy_en_inlinks_after.csv    （80 个英文 URL 的入链统计）
 *
 * 口径说明：
 *  - 源页面集合 = 80 个英文 URL（77 guide 页 + /en + /en/privacy + /en/terms）
 *  - 模板入链 = Nav（含 14 章下拉）+ Footer + Logo，每页各贡献 1 次
 *  - home 入链 = /en 首页 JSX 中的链接（含 14 章节卡、收集卡、迷你卡等）
 *  - 内容入链 = en MDX 正文中的 ](/en/guide/...) 链接
 *  - related 入链 = lib/related.ts 映射渲染的 Related guides 块（本轮新增）
 *
 * ⚠️ 以下三组清单与代码手动同步，改动对应代码时需同步更新：
 *   NAV_TARGETS  ↔ components/Nav.tsx 的 NAV 结构
 *   HOME_TARGETS ↔ app/[locale]/page.tsx 的链接 JSX
 *   RELATED      ↔ lib/related.ts 的映射
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://legacy-azure-nine.vercel.app';
const EN_DIR = path.join(__dirname, '..', 'content', 'guides', 'en');
const ZH_DIR = path.join(__dirname, '..', 'content', 'guides', 'zh-CN');
const TW_DIR = path.join(__dirname, '..', 'content', 'guides', 'zh-TW');
const OUT_DIR = path.join(__dirname, '..', '..', 'SEO诊断');

// ——— 与 components/Nav.tsx 同步 ———
const NAV_TARGETS = new Set([
  // 直接链接
  'puzzles', 'achievements', 'skills',
  // 下拉 children
  'chapters', 'beginner', 'resonance-points', 'blades', 'artefacts', 'charms',
  'theseus-echoes', 'story', 'ending', 'sophia', 'faq', 'wiki', 'chinese',
  // 14 章 grand
  'chapter-1-blood-ties', 'chapter-2-felons', 'chapter-3-those-before-us',
  'chapter-4-from-hell-it-rose', 'chapter-5-desolation-it-wrought',
  'chapter-6-what-lies-beneath', 'chapter-7-death-it-sowed', 'chapter-8-resonance',
  'chapter-9-night-has-come', 'chapter-10-parallel-paths', 'chapter-11-patera',
  'chapter-12-fading-light', 'chapter-13-as-one', 'chapter-14-what-remains',
]);

// ——— 与 app/[locale]/page.tsx 同步（每张卡算 1 次，共 45 个链接）———
const HOME_LINKS = {
  chapters: 2, // hero cta + task-card
  collectibles: 2, // hero cta + task-card
  puzzles: 8, // hero-link + task-card + 6 张 puzzle 卡
  achievements: 5, // task-card + 4 张 trophy 卡
  'resonance-points': 2, // warning cta + collect 卡
  blades: 1, artefacts: 1, charms: 1, 'theseus-echoes': 1, // collect 卡
  ending: 1, sophia: 1, story: 1, // story 卡
  beginner: 1, faq: 1, // beginner 卡
  skills: 3, // 3 张 skills 卡
  // 14 章卡各 1
  'chapter-1-blood-ties': 1, 'chapter-2-felons': 1, 'chapter-3-those-before-us': 1,
  'chapter-4-from-hell-it-rose': 1, 'chapter-5-desolation-it-wrought': 1,
  'chapter-6-what-lies-beneath': 1, 'chapter-7-death-it-sowed': 1, 'chapter-8-resonance': 1,
  'chapter-9-night-has-come': 1, 'chapter-10-parallel-paths': 1, 'chapter-11-patera': 1,
  'chapter-12-fading-light': 1, 'chapter-13-as-one': 1, 'chapter-14-what-remains': 1,
};
const HOME_TARGETS = new Set(Object.keys(HOME_LINKS));

// ——— 章节 prev/next 链接（与 CHAPTERS 顺序同步）———
const CHAPTER_ORDER = [
  'chapter-1-blood-ties', 'chapter-2-felons', 'chapter-3-those-before-us',
  'chapter-4-from-hell-it-rose', 'chapter-5-desolation-it-wrought',
  'chapter-6-what-lies-beneath', 'chapter-7-death-it-sowed', 'chapter-8-resonance',
  'chapter-9-night-has-come', 'chapter-10-parallel-paths', 'chapter-11-patera',
  'chapter-12-fading-light', 'chapter-13-as-one', 'chapter-14-what-remains',
];
const PREV_NEXT_CNT = {};
CHAPTER_ORDER.forEach((s, i) => {
  if (i > 0) PREV_NEXT_CNT[s] = (PREV_NEXT_CNT[s] || 0) + 1; // 被上一章的 next 指向
  if (i < CHAPTER_ORDER.length - 1) PREV_NEXT_CNT[s] = (PREV_NEXT_CNT[s] || 0) + 1; // 被下一章的 prev 指向
});

// ——— 与 lib/related.ts 同步（slug → 相关 slugs）———
const RELATED = {
  puzzles: ['puzzle-skull-door', 'puzzle-three-symbol', 'puzzle-bull-mirror', 'puzzle-mirror-room', 'puzzle-statue-door', 'puzzle-door-pedestals', 'chapter-7-death-it-sowed', 'chapter-4-from-hell-it-rose', 'chapter-10-parallel-paths'],
  'chapter-7-death-it-sowed': ['puzzle-skull-door', 'khopesh', 'resonance-points-ch7', 'puzzles', 'bosses', 'chapter-8-resonance', 'chapter-6-what-lies-beneath'],
  'chapter-3-those-before-us': ['resonance-points-ch3', 'artefacts', 'charms', 'collectibles', 'chapter-4-from-hell-it-rose', 'chapter-2-felons'],
  sica: ['blades', 'chapter-6-what-lies-beneath', 'achievements', 'kopis'],
  blades: ['rusty-sword', 'falchion', 'kopis', 'greek-sword', 'sica', 'khopesh', 'broken-spear', 'xiphos'],
  kopis: ['blades', 'chapter-4-from-hell-it-rose', 'puzzle-three-symbol', 'achievements', 'sica'],
  bosses: ['combat', 'chapters', 'chapter-13-as-one', 'skills', 'achievements'],
  'rusty-sword': ['blades', 'chapter-1-blood-ties'],
  falchion: ['blades', 'chapter-2-felons'],
  'greek-sword': ['blades', 'chapter-5-desolation-it-wrought'],
  khopesh: ['blades', 'chapter-7-death-it-sowed', 'puzzle-skull-door'],
  'broken-spear': ['blades', 'chapter-9-night-has-come'],
  xiphos: ['blades', 'chapter-10-parallel-paths'],
  'puzzle-skull-door': ['puzzles', 'chapter-7-death-it-sowed'],
  'puzzle-three-symbol': ['puzzles', 'chapter-4-from-hell-it-rose'],
  'puzzle-bull-mirror': ['puzzles', 'chapter-4-from-hell-it-rose'],
  'puzzle-mirror-room': ['puzzles', 'chapter-5-desolation-it-wrought'],
  'puzzle-statue-door': ['puzzles', 'chapter-5-desolation-it-wrought'],
  'puzzle-door-pedestals': ['puzzles', 'chapter-10-parallel-paths'],
};

// ——— 基础读取 ———
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
const readMdx = (dir, slug) => {
  const p = path.join(dir, `${slug}.mdx`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
};

const slugs = fs.readdirSync(ZH_DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, '')).sort();
const enSlugs = fs.readdirSync(EN_DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, '')).sort();
const twSlugs = fs.readdirSync(TW_DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, '')).sort();

// ——— 入链计数 ———
// 对每个目标 slug：{ nav: n, home: n, content: {sourceSlug: count}, related: {sourceSlug: count} }
const targets = {};
const addTarget = (t) => { if (!targets[t]) targets[t] = { nav: 0, home: 0, content: {}, related: {} }; };

NAV_TARGETS.forEach(addTarget);
HOME_TARGETS.forEach(addTarget);
for (const slug of slugs) addTarget(slug);

// 内容链接（en MDX 内 /en/guide/<slug>）
for (const s of enSlugs) {
  const b = body(readMdx(EN_DIR, s));
  const re = /\]\(\/en\/guide\/([a-z0-9-]+)(?:#[^)]*)?\)/g;
  let m;
  while ((m = re.exec(b))) {
    const t = m[1];
    addTarget(t);
    targets[t].content[s] = (targets[t].content[s] || 0) + 1;
  }
}
// related 块（77 个 slug 页面渲染；en 有译文才渲染 en 页）
for (const s of slugs) {
  const list = RELATED[s] || [];
  for (const t of list) {
    addTarget(t);
    targets[t].related[s] = (targets[t].related[s] || 0) + 1;
  }
}

const TOTAL_SOURCE_PAGES = 80;

// Breadcrumb 父级规则（与 app/[locale]/guide/[slug]/page.tsx 的 breadcrumbParent 同步）
function bcParent(slug) {
  if (/^chapter-/.test(slug)) return 'chapters';
  if (['rusty-sword', 'falchion', 'kopis', 'greek-sword', 'sica', 'khopesh', 'broken-spear', 'xiphos'].includes(slug)) return 'blades';
  if (['charms', 'artefacts', 'theseus-echoes', 'resonance-points', 'collectibles'].includes(slug)) return 'collectibles';
  if (['story', 'ending', 'sophia', 'prequel', 'series', 'characters'].includes(slug)) return 'story';
  return null;
}
const BC_CNT = {}; // 父级 hub → 次数
for (const s of slugs) {
  const p = bcParent(s);
  if (p) BC_CNT[p] = (BC_CNT[p] || 0) + 1;
}

function statsFor(slug) {
  const t = targets[slug] || { nav: 0, home: 0, content: {}, related: {} };
  const nav = NAV_TARGETS.has(slug) ? TOTAL_SOURCE_PAGES : 0; // nav 模板：80 页各 1 次
  const home = HOME_LINKS[slug] || 0; // 首页卡片，按实际出现次数
  const breadcrumb = BC_CNT[slug] || 0; // 77 个 guide 页的父级链接
  const prevNext = PREV_NEXT_CNT[slug] || 0; // 章节 prev/next
  const contentN = Object.values(t.content).reduce((a, b) => a + b, 0);
  const relatedN = Object.keys(t.related).length;
  const instances = nav + home + breadcrumb + prevNext + contentN + relatedN;
  const unique = nav > 0 ? TOTAL_SOURCE_PAGES : 0;
  const extra = new Set([...Object.keys(t.content), ...Object.keys(t.related)]);
  if (home) extra.add('home');
  const uniqueN = Math.max(unique, extra.size);
  const types = [];
  if (nav > 0) types.push('footer+nav模板');
  if (contentN > 0 || relatedN > 0 || breadcrumb > 0 || prevNext > 0) types.push('guide页');
  if (home) types.push('home');
  return { instances, uniqueN, types: types.join('|') };
}

// ——— 生成 CSV ———
function esc(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// inlinks CSV
let inlinksCsv = 'url,inlink_instances,unique_source_pages,source_types\n';
const inlinkRows = [];
for (const slug of slugs) {
  const st = statsFor(slug);
  inlinkRows.push([`${SITE_URL}/en/guide/${slug}`, st.instances, st.uniqueN, st.types]);
}
// home：logo 80（每页 1 次）+ lang 切换器 80 + breadcrumb Home 77（77 个 guide 页）
inlinkRows.push([`${SITE_URL}/en`, 237, 80, 'footer+nav模板|guide页']);
// privacy / terms：footer 80
inlinkRows.push([`${SITE_URL}/en/privacy`, 80, 80, 'footer+nav模板']);
inlinkRows.push([`${SITE_URL}/en/terms`, 80, 80, 'footer+nav模板']);
inlinkRows.sort((a, b) => b[1] - a[1]);
for (const r of inlinkRows) inlinksCsv += r.map(esc).join(',') + '\n';

// tech SEO CSV
const TYPE_OF = () => 'guide'; // 与原 CSV 口径一致：77 个 guide 页统一 type=guide
let techCsv = 'url,type,title,published,indexable,canonical,hreflang_en,hreflang_zh-CN,hreflang_zh-TW,hreflang_x-default,in_sitemap,inlinks,inlink_sources\n';
const techRows = [];
for (const slug of slugs) {
  const raw = readMdx(EN_DIR, slug);
  const hasEn = raw !== null;
  const hasZh = readMdx(ZH_DIR, slug) !== null;
  const hasTw = readMdx(TW_DIR, slug) !== null;
  const st = statsFor(slug);
  const f = hasEn ? fm(raw) : {};
  const langs = {};
  if (hasEn) langs.en = `${SITE_URL}/en/guide/${slug}`;
  if (hasZh) langs['zh-CN'] = `${SITE_URL}/zh-CN/guide/${slug}`;
  if (hasTw) langs['zh-TW'] = `${SITE_URL}/zh-TW/guide/${slug}`;
  langs['x-default'] = `${SITE_URL}/zh-CN/guide/${slug}`;
  techRows.push([
    `${SITE_URL}/en/guide/${slug}`,
    TYPE_OF(slug),
    hasEn ? (f.title || '') : '(en无译文，fallback zh-CN)',
    hasEn ? String(f.published ?? '') : '',
    hasEn ? 'yes' : 'no(译文不存在，robots noindex)',
    hasEn ? `${SITE_URL}/en/guide/${slug}` : '-',
    langs.en || '-',
    langs['zh-CN'] || '-',
    langs['zh-TW'] || '-',
    langs['x-default'] || '-',
    hasEn ? 'yes' : 'NO',
    st.instances,
    st.uniqueN,
  ]);
}
techRows.push([
  `${SITE_URL}/en`, 'home',
  'Resonance: A Plague Tale Legacy Wiki | Walkthrough, Puzzles & Collectibles',
  '', 'yes', `${SITE_URL}/en`,
  `${SITE_URL}/en`, `${SITE_URL}/zh-CN`, `${SITE_URL}/zh-TW`, `${SITE_URL}/zh-CN`,
  'yes', 80, 80,
]);
for (const p of ['privacy', 'terms']) {
  techRows.push([
    `${SITE_URL}/en/${p}`, p,
    p === 'privacy' ? 'Privacy Policy' : 'Terms of Service',
    '', 'no(robots noindex)', `${SITE_URL}/en/${p}`,
    '-', '-', '-', '-',
    'NO', 80, 80,
  ]);
}
techRows.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
for (const r of techRows) techCsv += r.map(esc).join(',') + '\n';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'legacy_en_inlinks_after.csv'), inlinksCsv, 'utf8');
fs.writeFileSync(path.join(OUT_DIR, 'legacy_en_tech_seo_after.csv'), techCsv, 'utf8');
console.log(`生成完成：${techRows.length} 行 tech CSV / ${inlinkRows.length} 行 inlinks CSV → ${OUT_DIR}`);
console.log('en 译文页:', enSlugs.length, '| zh-CN:', slugs.length, '| zh-TW:', twSlugs.length);
console.log('related 映射页面数:', Object.keys(RELATED).length);
