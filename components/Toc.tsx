'use client';

import { useState } from "react";

export type Heading = { id: string; text: string };

export default function Toc({
  headings,
  title,
  summary,
}: {
  headings: Heading[];
  title: string;
  summary: string;
}) {
  const [open, setOpen] = useState(false);
  // 少于 3 个标题不显示目录（无意义）
  if (headings.length < 3) return null;

  const list = (
    <ul>
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* 桌面端：右侧 sticky 目录 */}
      <nav className="toc" aria-label={title}>
        <span className="toc-title">{title}</span>
        {list}
      </nav>
      {/* 移动端：折叠目录 */}
      <details
        className="toc-mobile"
        open={open}
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        <summary>{summary}</summary>
        {list}
      </details>
    </>
  );
}
