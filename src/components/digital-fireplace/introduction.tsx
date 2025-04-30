"use client";

import { useEffect, useState } from "react";

export default function Introduction() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 10秒后自动隐藏介绍
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-1/4 left-0 right-0 mx-auto z-20 bg-black/70 rounded-lg p-4 max-w-md backdrop-blur-sm">
      <div className="flex items-start">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-orange-400 mb-2">数字壁炉</h2>
          <p className="text-white/90 mb-4">
            将文件拖入火焰中，让它们在数字壁炉中燃烧殆尽，伴随着令人放松的火焰噼啪声。
          </p>
          <ul className="space-y-1 text-white/80 text-sm">
            <li className="flex items-start">
              <span className="inline-block bg-orange-500/30 px-1 rounded mr-1 mt-0.5">提示</span>
              <span>可以同时拖入多个文件，看着它们逐一燃烧</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-orange-500/30 px-1 rounded mr-1 mt-0.5">声音</span>
              <span>左上角按钮可以控制壁炉声音</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-orange-500/30 px-1 rounded mr-1 mt-0.5">放松</span>
              <span>投入更多文件，火焰将变得更加明亮</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white ml-2"
          aria-label="关闭介绍"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
