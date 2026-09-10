// 14 章章节数据（slug + 英文名 + 中文名），供导航、章节卡、章节导航复用。
export type Chapter = { slug: string; en: string; zh: string };

export const CHAPTERS: Chapter[] = [
  { slug: "chapter-1-blood-ties", en: "Blood Ties", zh: "血缘" },
  { slug: "chapter-2-felons", en: "Felons", zh: "罪徒" },
  { slug: "chapter-3-those-before-us", en: "Those Before Us", zh: "先民" },
  { slug: "chapter-4-from-hell-it-rose", en: "From Hell It Rose", zh: "出自地狱" },
  { slug: "chapter-5-desolation-it-wrought", en: "Desolation It Wrought", zh: "荒芜" },
  { slug: "chapter-6-what-lies-beneath", en: "What Lies Beneath", zh: "深藏之物" },
  { slug: "chapter-7-death-it-sowed", en: "Death It Sowed", zh: "死亡播种" },
  { slug: "chapter-8-resonance", en: "Resonance", zh: "共鸣" },
  { slug: "chapter-9-night-has-come", en: "Night Has Come", zh: "黑夜降临" },
  { slug: "chapter-10-parallel-paths", en: "Parallel Paths", zh: "平行之路" },
  { slug: "chapter-11-patera", en: "Patera", zh: "帕特拉" },
  { slug: "chapter-12-fading-light", en: "Fading Light", zh: "消逝之光" },
  { slug: "chapter-13-as-one", en: "As One", zh: "合而为一" },
  { slug: "chapter-14-what-remains", en: "What Remains", zh: "余存" },
];
