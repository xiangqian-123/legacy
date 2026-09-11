// 给 14 个章节页批量插入「Chapter Checklist」块（中英双语），幂等：先清理旧块再插入。
const fs = require('fs');
const path = require('path');

const DATA = {
  'chapter-1-blood-ties': {
    zh: { points: '0', blade: '1（Rusty Sword 锈剑，剧情自动）', artefact: '1', charm: '0', puzzle: '无', missable: '无' },
    en: { points: '0', blade: '1 (Rusty Sword, automatic)', artefact: '1', charm: '0', puzzle: 'none', missable: 'none' },
  },
  'chapter-2-felons': {
    zh: { points: '5（全剧情自动）', blade: '1（Falchion 弯刀）', artefact: '2', charm: '2', puzzle: '无', missable: 'Theater Enthusiast 木偶剧' },
    en: { points: '5 (all automatic)', blade: '1 (Falchion)', artefact: '2', charm: '2', puzzle: 'none', missable: 'Theater Enthusiast (puppet show)' },
  },
  'chapter-3-those-before-us': {
    zh: { points: '9（散落）', blade: '0', artefact: '6', charm: '4', puzzle: '无', missable: 'Sea You Later 乌龟' },
    en: { points: '9 (scattered)', blade: '0', artefact: '6', charm: '4', puzzle: 'none', missable: 'Sea You Later (turtle)' },
  },
  'chapter-4-from-hell-it-rose': {
    zh: { points: '17（3 处战斗自动）', blade: '1（Kopis 反刃刀）', artefact: '3', charm: '2', puzzle: '5 个（三符号/反射镜/迷宫/尖刺/公牛镜）', missable: 'Returning the Favor（杠杆房扔刀）' },
    en: { points: '17 (3 auto)', blade: '1 (Kopis)', artefact: '3', charm: '2', puzzle: '5 (three-symbol/mirror/maze/spikes/bull mirror)', missable: 'Returning the Favor (throw knife)' },
  },
  'chapter-5-desolation-it-wrought': {
    zh: { points: '29（全游戏最多）', blade: '1（Greek Sword 希腊剑）', artefact: '5', charm: '5', puzzle: '4 个（门/圣甲虫地板/雕像门/镜房）', missable: '无（四符号试炼插完不能回头）' },
    en: { points: '29 (most in game)', blade: '1 (Greek Sword)', artefact: '5', charm: '5', puzzle: '4 (door/scarab floor/statue door/mirror room)', missable: 'none (four-symbol trials lock after inserting)' },
  },
  'chapter-6-what-lies-beneath': {
    zh: { points: '22（追逐段 2 个易漏）', blade: '1（Sica 短剑）', artefact: '2', charm: '3', puzzle: '无', missable: '无' },
    en: { points: '22 (2 easy to miss in chase)', blade: '1 (Sica)', artefact: '2', charm: '3', puzzle: 'none', missable: 'none' },
  },
  'chapter-7-death-it-sowed': {
    zh: { points: '22', blade: '1（Khopesh 镰状剑）', artefact: '4', charm: '5', puzzle: '2 个（黑神庙颅骨门/光谜题）', missable: '无' },
    en: { points: '22', blade: '1 (Khopesh)', artefact: '4', charm: '5', puzzle: '2 (Black Temple skull door/light)', missable: 'none' },
  },
  'chapter-8-resonance': {
    zh: { points: '0', blade: '0', artefact: '0', charm: '0', puzzle: '无', missable: '无（纯剧情章）' },
    en: { points: '0', blade: '0', artefact: '0', charm: '0', puzzle: 'none', missable: 'none (story only)' },
  },
  'chapter-9-night-has-come': {
    zh: { points: '25', blade: '1（Broken Spear 折矛）', artefact: '3', charm: '2', puzzle: '无', missable: '无' },
    en: { points: '25', blade: '1 (Broken Spear)', artefact: '3', charm: '2', puzzle: 'none', missable: 'none' },
  },
  'chapter-10-parallel-paths': {
    zh: { points: '25', blade: '1（Xiphos 双刃剑）', artefact: '4', charm: '3', puzzle: '1 个（门谜题·三基座）', missable: '无' },
    en: { points: '25', blade: '1 (Xiphos)', artefact: '4', charm: '3', puzzle: '1 (door puzzle, three pedestals)', missable: 'none' },
  },
  'chapter-11-patera': {
    zh: { points: '23', blade: '0', artefact: '3', charm: '2', puzzle: '3 个（光束/曲柄/透镜）', missable: '无' },
    en: { points: '23', blade: '0', artefact: '3', charm: '2', puzzle: '3 (beam/crank/lens)', missable: 'none' },
  },
  'chapter-12-fading-light': {
    zh: { points: '8', blade: '0', artefact: '2', charm: '1', puzzle: '无', missable: '无' },
    en: { points: '8', blade: '0', artefact: '2', charm: '1', puzzle: 'none', missable: 'none' },
  },
  'chapter-13-as-one': {
    zh: { points: '8', blade: '0', artefact: '2', charm: '1', puzzle: '无', missable: 'Superstitious（护符集齐时弹出）' },
    en: { points: '8', blade: '0', artefact: '2', charm: '1', puzzle: 'none', missable: 'Superstitious (pops if all charms found)' },
  },
  'chapter-14-what-remains': {
    zh: { points: '0', blade: '0', artefact: '0', charm: '0', puzzle: '无', missable: '无（尾声）' },
    en: { points: '0', blade: '0', artefact: '0', charm: '0', puzzle: 'none', missable: 'none (epilogue)' },
  },
};

function zhChecklist(d) {
  return `## 本章 Checklist\n\n- [ ] 共鸣点数 ×${d.points}\n- [ ] 刀剑 ×${d.blade}\n- [ ] 文物 ×${d.artefact}\n- [ ] 护符 ×${d.charm}\n- [ ] 谜题：${d.puzzle}\n- [ ] 易漏：${d.missable}\n\n`;
}
function enChecklist(d) {
  return `## Chapter Checklist\n\n- [ ] Resonance Points ×${d.points}\n- [ ] Blade ×${d.blade}\n- [ ] Artefacts ×${d.artefact}\n- [ ] Charms ×${d.charm}\n- [ ] Puzzles: ${d.puzzle}\n- [ ] Missable: ${d.missable}\n\n`;
}

// 清理旧 checklist 块（含 undefined 版）
const zhClean = (raw) => raw.replace(/\n## 本章 Checklist[\s\S]*?\n## 相关阅读/, '\n## 相关阅读');
const enClean = (raw) => raw.replace(/\n## Chapter Checklist[\s\S]*?\n## Related/, '\n## Related');

let zhDone = 0, enDone = 0;

for (const [slug, d] of Object.entries(DATA)) {
  const zhFile = path.join('input/zh-CN', `${slug}.mdx`);
  if (fs.existsSync(zhFile)) {
    let raw = fs.readFileSync(zhFile, 'utf8');
    raw = zhClean(raw);
    raw = raw.replace('## 相关阅读', zhChecklist(d.zh) + '## 相关阅读');
    fs.writeFileSync(zhFile, raw, 'utf8');
    zhDone++;
  }
  const enFile = path.join('content/guides/en', `${slug}.mdx`);
  if (fs.existsSync(enFile)) {
    let raw = fs.readFileSync(enFile, 'utf8');
    raw = enClean(raw);
    raw = raw.replace('## Related', enChecklist(d.en) + '## Related');
    fs.writeFileSync(enFile, raw, 'utf8');
    enDone++;
  }
}

console.log(`中文插入: ${zhDone} 章`);
console.log(`英文插入: ${enDone} 章`);
