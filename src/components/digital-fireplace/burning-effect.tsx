"use client";

import { useEffect, useState } from "react";

interface BurningEffectProps {
  fileName: string;
  onComplete: () => void;
}

export default function BurningEffect({ fileName, onComplete }: BurningEffectProps) {
  const [stage, setStage] = useState<"initial" | "burning" | "ashes">("initial");

  useEffect(() => {
    // 开始燃烧阶段
    const burningTimeout = setTimeout(() => {
      setStage("burning");
    }, 100);

    // 燃烧结束，变成灰烬
    const ashesTimeout = setTimeout(() => {
      setStage("ashes");
    }, 2000);

    // 完成整个过程，移除组件
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(burningTimeout);
      clearTimeout(ashesTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="mt-4 px-4 py-2 bg-orange-500/20 rounded-md text-orange-200">
      <div className={`
        transition-all duration-300
        ${stage === "initial" ? "opacity-100" : ""}
        ${stage === "burning" ? "opacity-80 text-orange-400" : ""}
        ${stage === "ashes" ? "opacity-30 text-gray-400" : ""}
      `}
      >
        {stage === "initial" && (
          <span>
            正在燃烧:
            {fileName}
          </span>
        )}
        {stage === "burning" && (
          <span className="flex items-center">
            <span className="animate-pulse">燃烧中</span>
            <span className="ml-2 animate-flicker">
              {fileName.split("").map((char, i) => (
                <span key={i} className="inline-block" style={{ animationDelay: `${i * 50}ms` }}>
                  {Math.random() > 0.5 ? char : "✨"}
                </span>
              ))}
            </span>
          </span>
        )}
        {stage === "ashes" && <span>已化为灰烬...</span>}
      </div>
    </div>
  );
}
