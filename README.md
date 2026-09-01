# 网站骨架 · 通用模板（复制新站用它）

这是一个**通用化改造后**的 Next.js 游戏攻略站骨架。Palworld 专属内容已全部替换成 `{{占位符}}`，复制新站时照着替换即可。

## 复制一个新站，总共 3 步

### 第 1 步：整份复制
把本目录（`网站骨架/`）整个复制成新站目录，比如 `D:/你的项目/新游戏名/`。

### 第 2 步：全局替换占位符
在编辑器里全局搜索 `{{`，把所有 `{{占位符}}` 替换成新游戏的真实值。重点文件：

| 文件 | 要改什么 |
|---|---|
| `site.config.ts` | 站名、网址、游戏名、GA ID、标题描述（**唯一配置入口，改这一个就够大半**） |
| `i18n/messages/zh-CN.json` | 首页全部中文文案（用占位符标注了） |
| `i18n/messages/en.json` | 首页全部英文文案（英文是兜底语言，务必填） |
| `app/[locale]/page.tsx` | 卡片配图路径、主视觉图、视频 ID、Steam 链接 |
| `components/Footer.tsx` | Steam/官网/社区/Reddit 链接 |
| `app/globals.css` | 主题色（改 `--nav-theme` 三行，贴近游戏调性） |
| `package.json` | `name` 字段 |

### 第 3 步：装依赖 + 放内容 + 部署
1. `npm install`（装依赖）
2. 把生成好的 MDX 放进 `content/guides/zh-CN/`（或用 `scripts/generate-site.cjs` 生成）
3. 图片放 `public/images/guides/`
4. `npm run build` 本地验证
5. 推 GitHub → Vercel 上线

## 依赖版本（已锁定，勿乱改）

- next 14.2.5 + react 18.3.1
- next-mdx-remote 6.0.0（内部 @mdx-js/mdx@3，unified@11）
- remark-gfm 4.0.1（配 mdx@3，别降到 3.x 会报 `this.setData is not a function`）
- gray-matter 4.0.3 + opencc-js 1.0.5

## 多语言说明

- zh-CN 默认，zh-TW 由脚本自动繁简转换生成
- en 是兜底语言（小语种回退 en）
- ja/ru/de 已清空为 `{}`，需要时再填翻译（不填就回退 en，不影响运行）

## 目录结构

```
网站骨架/
├── app/            # 路由（[locale] + guide/[slug] 渲染 + 首页 + privacy/terms + sitemap/robots）
├── components/     # Nav / Footer / GoogleAnalytics
├── lib/            # locales / posts / i18n / site（读配置）
├── i18n/messages/  # 多语言文案（zh-CN + en 必填，其余可选）
├── scripts/        # generate-site.cjs（部署脚本）
├── site.config.ts  # ★ 唯一配置入口
├── package.json
├── tsconfig.json
└── next.config.mjs
```
