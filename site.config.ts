/**
 * 站点级配置中心 —— 批量化模板化的核心。
 *
 * 复制一个新游戏站时，只需改这一个文件（以及替换 content/ 目录的 MDX），
 * 代码其余部分全部读这里的值，无需改动。
 */
export interface SiteConfig {
  /** 站点名（用于标题、OpenGraph、JSON-LD）。 */
  siteName: string;
  /** 站点根网址（用于 canonical、hreflang、sitemap、robots）。 */
  siteUrl: string;
  /** 游戏名（用于默认标题/描述等文案）。 */
  gameName: string;
  /** Google Analytics 4 衡量 ID（G- 开头）。 */
  gaId: string;
  /** 默认页面标题（各页面未单独定义 metadata 时使用）。 */
  defaultTitle: string;
  /** 默认页面描述。 */
  defaultDescription: string;
  /** OpenGraph 的备选语言（除默认 locale 外）。 */
  ogLocales: string[];
}

export const siteConfig: SiteConfig = {
  siteName: 'Resonance Plague Tale Wiki',
  siteUrl: 'https://legacy-azure-nine.vercel.app',
  gameName: 'Resonance: A Plague Tale Legacy',
  gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-SZ5JQSBED1',
  defaultTitle: 'Resonance: A Plague Tale Legacy Wiki — 攻略与全收集指南',
  defaultDescription:
    'Resonance: A Plague Tale Legacy（《瘟疫传说：共鸣》）粉丝攻略站：新手指南、技能加点、全刀剑与护符收集、章节列表、结局解析与中文支持说明。',
  ogLocales: ['fr', 'es', 'pl', 'tr', 'ru', 'uk', 'ja', 'ko', 'zh-CN', 'zh-TW', 'th', 'vi', 'id'],
};
