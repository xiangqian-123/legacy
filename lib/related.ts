// 上下文相关内链映射（2026-09-15 GSC 诊断后第一轮内链实验）。
//
// 范围（Codex 第二批指令）：只覆盖 GSC 已有信号的 7 个页面
//   /puzzles /chapter-7-death-it-sowed /chapter-3-those-before-us
//   /sica /blades /kopis /bosses
// 加上它们指向的具体页（8 把刀剑、puzzle 单页）的回链，
// 让 Hub → 具体页 → 章节形成簇。渲染在 guide 页正文之后（Related guides 区块），
// 不修改正文与 URL。下一轮按 GSC 数据再扩展。
//
// label 用游戏内通用英文术语（与 Nav 章节名做法一致，全语言通用）。

export type RelatedLink = { slug: string; label: string };

export const RELATED: Record<string, RelatedLink[]> = {
  // ——— GSC 信号页 ———
  puzzles: [
    { slug: "puzzle-skull-door", label: "Black Temple Skull Door (Ch. 7)" },
    { slug: "puzzle-three-symbol", label: "Three-Symbol Puzzle (Ch. 4)" },
    { slug: "puzzle-bull-mirror", label: "Bull Mirror Puzzle (Ch. 4)" },
    { slug: "puzzle-mirror-room", label: "Mirror Room Puzzle (Ch. 5)" },
    { slug: "puzzle-statue-door", label: "Statue Door Puzzle (Ch. 5)" },
    { slug: "puzzle-door-pedestals", label: "Door Puzzle — Three Pedestals (Ch. 10)" },
    { slug: "chapter-7-death-it-sowed", label: "Chapter 7: Death It Sowed" },
    { slug: "chapter-4-from-hell-it-rose", label: "Chapter 4: From Hell It Rose" },
    { slug: "chapter-10-parallel-paths", label: "Chapter 10: Parallel Paths" },
  ],
  "chapter-7-death-it-sowed": [
    { slug: "puzzle-skull-door", label: "Black Temple Skull Door Solution" },
    { slug: "khopesh", label: "Khopesh (Ch. 7 Hero Tomb)" },
    { slug: "resonance-points-ch7", label: "Chapter 7 Resonance Points" },
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "bosses", label: "Bosses & Elite Enemies" },
    { slug: "chapter-8-resonance", label: "Chapter 8: Resonance" },
    { slug: "chapter-6-what-lies-beneath", label: "Chapter 6: What Lies Beneath" },
  ],
  "chapter-3-those-before-us": [
    { slug: "resonance-points-ch3", label: "Chapter 3 Resonance Points" },
    { slug: "artefacts", label: "All Artefacts" },
    { slug: "charms", label: "All Charms" },
    { slug: "collectibles", label: "Collectibles Hub" },
    { slug: "chapter-4-from-hell-it-rose", label: "Chapter 4: From Hell It Rose" },
    { slug: "chapter-2-felons", label: "Chapter 2: Felons" },
  ],
  sica: [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-6-what-lies-beneath", label: "Chapter 6: What Lies Beneath" },
    { slug: "achievements", label: "Trophies & Achievements" },
    { slug: "kopis", label: "Kopis (Ch. 4 Hero Tomb)" },
  ],
  blades: [
    { slug: "rusty-sword", label: "Rusty Sword (Ch. 1)" },
    { slug: "falchion", label: "Falchion (Ch. 2)" },
    { slug: "kopis", label: "Kopis (Ch. 4)" },
    { slug: "greek-sword", label: "Greek Sword (Ch. 5)" },
    { slug: "sica", label: "Sica (Ch. 6)" },
    { slug: "khopesh", label: "Khopesh (Ch. 7)" },
    { slug: "broken-spear", label: "Broken Spear (Ch. 9)" },
    { slug: "xiphos", label: "Xiphos (Ch. 10)" },
  ],
  kopis: [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-4-from-hell-it-rose", label: "Chapter 4: From Hell It Rose" },
    { slug: "puzzle-three-symbol", label: "Three-Symbol Puzzle (Ch. 4)" },
    { slug: "achievements", label: "Trophies & Achievements" },
    { slug: "sica", label: "Sica (Ch. 6 Hero Tomb)" },
  ],
  bosses: [
    { slug: "combat", label: "Combat Guide" },
    { slug: "chapters", label: "Full Walkthrough" },
    { slug: "chapter-13-as-one", label: "Chapter 13: As One" },
    { slug: "skills", label: "Skills & Builds" },
    { slug: "achievements", label: "Trophies & Achievements" },
  ],

  // ——— 刀剑单页回链（Blade → Blades Hub / 对应 Chapter / Trophy）———
  "rusty-sword": [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-1-blood-ties", label: "Chapter 1: Blood Ties" },
  ],
  falchion: [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-2-felons", label: "Chapter 2: Felons" },
  ],
  "greek-sword": [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-5-desolation-it-wrought", label: "Chapter 5: Desolation It Wrought" },
  ],
  khopesh: [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-7-death-it-sowed", label: "Chapter 7: Death It Sowed" },
    { slug: "puzzle-skull-door", label: "Black Temple Skull Door Solution" },
  ],
  "broken-spear": [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-9-night-has-come", label: "Chapter 9: Night Has Come" },
  ],
  xiphos: [
    { slug: "blades", label: "All Blades Hub" },
    { slug: "chapter-10-parallel-paths", label: "Chapter 10: Parallel Paths" },
  ],

  // ——— Puzzle 单页回链（Puzzle → Puzzles Hub / 对应 Chapter）———
  "puzzle-skull-door": [
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "chapter-7-death-it-sowed", label: "Chapter 7: Death It Sowed" },
  ],
  "puzzle-three-symbol": [
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "chapter-4-from-hell-it-rose", label: "Chapter 4: From Hell It Rose" },
  ],
  "puzzle-bull-mirror": [
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "chapter-4-from-hell-it-rose", label: "Chapter 4: From Hell It Rose" },
  ],
  "puzzle-mirror-room": [
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "chapter-5-desolation-it-wrought", label: "Chapter 5: Desolation It Wrought" },
  ],
  "puzzle-statue-door": [
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "chapter-5-desolation-it-wrought", label: "Chapter 5: Desolation It Wrought" },
  ],
  "puzzle-door-pedestals": [
    { slug: "puzzles", label: "All Puzzle Solutions" },
    { slug: "chapter-10-parallel-paths", label: "Chapter 10: Parallel Paths" },
  ],
};

export function getRelated(slug: string): RelatedLink[] {
  return RELATED[slug] ?? [];
}
