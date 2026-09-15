import fs from "fs";
import path from "path";
import { UI_FALLBACK } from "@/lib/locales";

const MESSAGES_DIR = path.join(process.cwd(), "i18n", "messages");

// 按回退链读取 UI 文案（本语言 → en 兜底）。
export function getMessages(locale: string): Record<string, unknown> {
  const chain = [locale, ...UI_FALLBACK];
  for (const loc of chain) {
    const file = path.join(MESSAGES_DIR, `${loc}.json`);
    if (fs.existsSync(file)) {
      try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {
        continue;
      }
    }
  }
  return {};
}

// 支持嵌套 key（"guide.lastVerified" → messages.guide.lastVerified）。
export function pick(
  messages: Record<string, unknown>,
  key: string,
  fallback = ""
): string {
  let v: unknown = messages;
  for (const part of key.split(".")) {
    if (v && typeof v === "object") {
      v = (v as Record<string, unknown>)[part];
    } else {
      v = undefined;
      break;
    }
  }
  return typeof v === "string" ? v : fallback;
}
