"use client";

import { useEffect, useRef } from "react";

/**
 * 广告位组件（2026-09-20 接入两个 CPM 广告网络）。
 *
 * 注入方式：useEffect 里动态创建 script 标签挂进 DOM
 * （React 通过 dangerouslySetInnerHTML/innerHTML 写入的 <script> 不会被浏览器执行，
 * 必须用 document.createElement 注入）。
 * 防重复：每个广告脚本一页只注入一次（window 全局标记），StrictMode 双跑 effect 也不会重复。
 */

const LEADERBOARD_KEY = "2801b64f15f53db82dd64a1026745cba";
const LEADERBOARD_SRC =
  "https://www.highrevenueformat.com/2801b64f15f53db82dd64a1026745cba/invoke.js";
const CPM_CONTAINER_ID = "container-d8661b7bd840defcfb94be5f137c595f";
const CPM_SRC =
  "https://pl31411318.profitableratecpmnetwork.com/d8661b7bd840defcfb94be5f137c595f/invoke.js";

declare global {
  interface Window {
    atOptions?: Record<string, unknown>;
    __adLeaderboardLoaded?: boolean;
    __adCpmContainerLoaded?: boolean;
  }
}

/**
 * 横幅广告（highrevenueformat，728x90 iframe）。
 * 仅桌面端（>=768px）注入：728px 宽 iframe 在手机上会撑破布局，
 * 移动端直接跳过（省流量，也不产生空占位）。
 * 脚本锚定当前所在位置写入 iframe，所以把 script 挂进宿主 div。
 */
export function LeaderboardAd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.__adLeaderboardLoaded) return;
    if (window.innerWidth < 768) return;
    const host = ref.current;
    if (!host) return;
    window.__adLeaderboardLoaded = true;
    window.atOptions = {
      key: LEADERBOARD_KEY,
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = LEADERBOARD_SRC;
    host.appendChild(s);
  }, []);

  return <div ref={ref} className="ad-slot ad-leaderboard" aria-hidden="true" />;
}

/**
 * Container 广告（profitableratecpm）：脚本按容器 div 的 id 自动填充，
 * 全端展示（网络侧自适应尺寸）。div 由 React 渲染、脚本在 hydration 后注入，
 * 第三方内容写入发生在 hydration 之后，不会触发 hydration mismatch。
 */
export function CpmContainerAd() {
  useEffect(() => {
    if (window.__adCpmContainerLoaded) return;
    window.__adCpmContainerLoaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = CPM_SRC;
    document.body.appendChild(s);
  }, []);

  return (
    <div id={CPM_CONTAINER_ID} className="ad-slot ad-container" aria-hidden="true" />
  );
}
