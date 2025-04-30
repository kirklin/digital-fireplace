"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import BurningFiles from "./burning-files";
import FireplaceSound from "./fireplace-sound";
import Introduction from "./introduction";
import FireParticles from "./particles";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

export default function DigitalFireplace() {
  const [burningFiles, setBurningFiles] = useState<FileWithPreview[]>([]);
  const [isFireBig, setIsFireBig] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // 为每个文件添加唯一ID和预览URL
      const filesWithPreview = acceptedFiles.map(file =>
        Object.assign(file, {
          id: Math.random().toString(36).substring(2, 11),
          preview: URL.createObjectURL(file),
        }),
      );

      // 火焰变大
      setIsFireBig(true);

      // 添加文件到燃烧列表
      setBurningFiles(prev => [...prev, ...filesWithPreview]);
    }
  };

  // 文件燃烧完毕后的回调
  const handleFileBurned = (fileId: string) => {
    setBurningFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // 当所有文件燃烧完毕后，火焰恢复正常大小
  useEffect(() => {
    if (burningFiles.length === 0 && isFireBig) {
      // 延迟一段时间后恢复火焰大小
      const timeout = setTimeout(() => {
        setIsFireBig(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [burningFiles.length, isFireBig]);

  // 清理预览URL
  useEffect(() => {
    return () => {
      burningFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [burningFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* 音频控制 */}
      <FireplaceSound />

      {/* 介绍提示 */}
      <Introduction />

      {/* 火焰区域 - 支持拖放 */}
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full max-w-md cursor-pointer transition-all duration-500 ${
          isDragActive ? "scale-110" : ""
        }`}
      >
        <input {...getInputProps()} />

        {/* 火焰动画 */}
        <div className="relative w-64 h-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`fireplace transition-all duration-1000 ${isFireBig ? "scale-125" : ""}`}>
              <div className="fire-base"></div>
              <div className={`flames transition-all duration-1000 ${isFireBig ? "scale-125 h-[250px]" : ""}`}>
                <div className="flame"></div>
                <div className="flame"></div>
                <div className="flame"></div>
                <div className="flame"></div>
                <div className="flame"></div>
              </div>
              {isDragActive && (
                <div className="burning-target animate-pulse"></div>
              )}
              <FireParticles isFireBig={isFireBig} />

              {/* 燃烧的文件区域 */}
              {burningFiles.length > 0 && (
                <BurningFiles files={burningFiles} onFileBurned={handleFileBurned} />
              )}
            </div>
          </div>
        </div>

        {/* 提示文字 */}
        <p className="mt-8 text-white/80 text-lg text-center max-w-xs">
          {isDragActive
            ? "松开鼠标，将文件扔进火中..."
            : "拖拽文件到火焰中，让烦恼随之燃烧殆尽..."}
        </p>
      </div>
    </div>
  );
}
