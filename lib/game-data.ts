// 游戏核心数据中央配置 —— 全站统一调用，避免组件里硬编码数字。
// 任何组件（首页数据 chips、章节卡、收集卡、Hub 页）需要「章节数/收集品数/平台」等，
// 都从这里 import，别写死。数据来源：Steam / PowerPyx / 官方 FAQ 交叉验证。

export const GAME_DATA = {
  // 基础信息
  gameName: "Resonance: A Plague Tale Legacy",
  gameNameZh: "瘟疫传说：共鸣",
  releaseDate: "2026-08-27",
  developer: "Asobo Studio",
  publisher: "Focus Entertainment",
  platforms: "PS5 / Xbox Series X|S / PC",

  // 结构数据（收集品/章节规模）
  chapters: 14,
  resonancePointsTotal: 200, // 共鸣点数总数
  resonancePointsRequired: 165, // 点满全部技能所需（missable 关键目标）
  blades: 8, // 刀剑（另有预购 Hero's Blade 第 9 把不计入）
  artefacts: 37, // 文物（Relic of Present/Past）
  charms: 30, // 护符
  theseusEchoes: 5, // 忒修斯回声（= 5 个穿孔钱币碗，同时计入 30 护符）
} as const;

// 收集物总数（PowerPyx 口径：8 + 37 + 30 + 200 = 275，Theseus Echoes 含在 Charms 里）
export const COLLECTIBLE_TOTAL =
  GAME_DATA.blades +
  GAME_DATA.artefacts +
  GAME_DATA.charms +
  GAME_DATA.resonancePointsTotal;
