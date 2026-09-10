'use client';

import { useState } from "react";

// 预告片：先显示缩略图 + 播放按钮，点击后才加载 YouTube iframe（第54步，避免首屏自动加载视频）。
export default function VideoThumb({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="video-thumb"
      onClick={() => setPlaying(true)}
      aria-label={`播放：${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        loading="lazy"
        decoding="async"
      />
      <span className="play-btn" aria-hidden>
        ▶
      </span>
    </button>
  );
}
