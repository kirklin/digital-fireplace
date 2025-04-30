"use client";

import { useEffect, useRef, useState } from "react";

export default function FireplaceSound() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 音频控制
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // 初始化时自动播放
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("自动播放失败:", error);
      }
    };

    playAudio();

    // 循环播放
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play().catch(error => console.error("重播失败:", error));
    });

    return () => {
      audio.pause();
      audio.removeEventListener("ended", () => {});
    };
  }, []);

  // 切换音频
  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => console.error("播放失败:", error));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="absolute top-4 left-4 z-20">
      {/* 音频 */}
      <audio
        ref={audioRef}
        src="https://freesound.org/data/previews/26/26808_119689-lq.mp3"
        preload="auto"
      >
        {/* 正确使用track元素，使用src={null}而不是空字符串 */}
        {/* @ts-expect-error track元素的src属性预期是字符串，但我们需要使用null避免警告 */}
        <track kind="captions" src={null} label="字幕不可用" />
        您的浏览器不支持音频元素。
      </audio>

      {/* 音频控制按钮 */}
      <button
        onClick={toggleAudio}
        className="p-2 rounded-full bg-black/50 text-white"
        aria-label={isPlaying ? "静音" : "播放声音"}
      >
        {isPlaying
          ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )
          : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
      </button>
    </div>
  );
}
