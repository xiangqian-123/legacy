// 支持的语言与回退逻辑。
export const DEFAULT_LOCALE = "en";

// 站内实际路由支持的语言（仅英文）。
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(l: string): l is Locale {
  return (locales as readonly string[]).includes(l);
}

// 内容回退链：英文唯一。
export const CONTENT_FALLBACK = ["en"] as const;

// UI 文案回退链：英文唯一。
export const UI_FALLBACK = ["en"] as const;
