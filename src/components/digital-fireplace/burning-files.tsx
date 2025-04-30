"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

interface BurningFilesProps {
  files: FileWithPreview[];
  onFileBurned: (fileId: string) => void;
}

// 不同文件类型的图标
function getFileIcon(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  // 为常见文件类型返回图标
  switch (extension) {
    case "pdf":
      return "📕";
    case "doc":
    case "docx":
      return "📘";
    case "xls":
    case "xlsx":
      return "📗";
    case "ppt":
    case "pptx":
      return "📙";
    case "txt":
      return "📄";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "webp":
      return "🖼️";
    case "mp3":
    case "wav":
    case "ogg":
      return "🎵";
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return "🎬";
    case "zip":
    case "rar":
    case "7z":
      return "📦";
    default:
      return "📃";
  }
}

export default function BurningFiles({ files, onFileBurned }: BurningFilesProps) {
  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full">
      {files.map(file => (
        <BurningFile
          key={file.id}
          file={file}
          onComplete={() => onFileBurned(file.id)}
        />
      ))}
    </div>
  );
}

interface BurningFileProps {
  file: FileWithPreview;
  onComplete: () => void;
}

function BurningFile({ file, onComplete }: BurningFileProps) {
  const [burnStage, setBurnStage] = useState<"initial" | "burning" | "ashes">("initial");

  useEffect(() => {
    // 开始燃烧
    const startTimeout = setTimeout(() => {
      setBurnStage("burning");
    }, 500);

    // 变成灰烬
    const ashesTimeout = setTimeout(() => {
      setBurnStage("ashes");
    }, 3000);

    // 完成燃烧过程
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(ashesTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  // 显示图片预览或图标
  const renderFilePreview = () => {
    if (file.type.startsWith("image/") && file.preview) {
      return (
        <div className="relative w-10 h-10 overflow-hidden rounded">
          <Image
            src={file.preview}
            alt={file.name}
            fill
            className="object-cover"
            style={{
              filter: burnStage === "burning"
                ? "brightness(1.5) sepia(0.5)"
                : burnStage === "ashes" ? "brightness(0.2) grayscale(1)" : "none",
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="text-2xl" style={{ opacity: burnStage === "ashes" ? 0.3 : 1 }}>
          {getFileIcon(file)}
        </div>
      );
    }
  };

  return (
    <div
      className={`
        mb-2 flex items-center justify-center
        transition-all duration-1000 transform
        ${burnStage === "initial" ? "translate-y-0 opacity-100" : ""}
        ${burnStage === "burning" ? "translate-y-[-20px] scale-90" : ""}
        ${burnStage === "ashes" ? "translate-y-[-5px] scale-75 opacity-30" : ""}
      `}
      style={{
        filter: burnStage === "burning" ? "drop-shadow(0 0 5px #ff6600)" : "none",
      }}
    >
      <div
        className={`
          relative px-2 py-1 rounded bg-white/10 backdrop-blur-sm 
          flex items-center gap-2 max-w-[150px]
          ${burnStage === "burning" ? "burning-edges" : ""}
          ${burnStage === "ashes" ? "ashes-effect" : ""}
        `}
      >
        {renderFilePreview()}
        <div className="text-sm text-white truncate" style={{ maxWidth: "100px" }}>
          {file.name}
        </div>
      </div>
    </div>
  );
}
