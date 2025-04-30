"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  color: string;
  glow: number;
}

interface FireParticlesProps {
  isFireBig?: boolean;
}

export default function FireParticles({ isFireBig = false }: FireParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // 设置画布大小
    const updateCanvasSize = () => {
      canvas.width = 300;
      canvas.height = 300;
    };

    updateCanvasSize();

    // 创建粒子数组
    const particles: Particle[] = [];

    // 创建新粒子
    const createParticle = () => {
      // 火焰底部的范围（-40到40之间）
      const x = Math.random() * 80 - 40;

      // 火焰变大时，粒子颜色更亮更多
      const baseColors = [
        "rgba(255, 102, 0, 0.8)",
        "rgba(255, 153, 0, 0.8)",
        "rgba(255, 204, 0, 0.6)",
        "rgba(255, 102, 0, 0.4)",
      ];

      const bigFireColors = [
        "rgba(255, 102, 0, 0.9)",
        "rgba(255, 153, 0, 0.9)",
        "rgba(255, 204, 0, 0.8)",
        "rgba(255, 50, 0, 0.7)",
        "rgba(255, 255, 0, 0.6)",
        "rgba(255, 220, 50, 0.7)", // 新增更亮的黄色粒子
      ];

      const colors = isFireBig ? bigFireColors : baseColors;

      const particle: Particle = {
        x: canvas.width / 2 + x, // 从中心点发散
        y: canvas.height / 2 + 50, // 火焰底部
        size: Math.random() * (isFireBig ? 6 : 4) + 2, // 火焰变大时，粒子也变大
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * (isFireBig ? -4 : -3) - 1, // 火焰变大时，粒子上升更快
        life: 0,
        maxLife: Math.random() * 60 + (isFireBig ? 90 : 60), // 火焰变大时，粒子寿命更长
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: Math.random() * 5 + 3, // 粒子发光半径
      };

      particles.push(particle);
    };

    // 动画循环
    const animate = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 火焰变大时，产生更多粒子
      const particleCreationThreshold = isFireBig ? 0.5 : 0.3;

      // 添加新粒子
      if (Math.random() < particleCreationThreshold) {
        createParticle();
      }

      // 更新和绘制粒子
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 更新粒子位置
        p.x += p.speedX;
        p.y += p.speedY;

        // 粒子变小
        p.size *= 0.98;

        // 粒子变淡
        p.life++;

        // 发光效果 - 先绘制光晕
        const alpha = 1 - p.life / p.maxLife;
        if (p.glow > 0) {
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.glow,
          );

          const color = p.color.replace(/[\d.]+\)$/, `${alpha * 0.5})`);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, "rgba(255, 165, 0, 0)");

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glow, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // 画粒子主体
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fill();

        // 如果粒子寿命结束或太小，从数组中移除
        if (p.life >= p.maxLife || p.size < 0.5) {
          particles.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // 清理不需要，因为组件卸载时动画帧会自动取消
    };
  }, [isFireBig]); // 添加isFireBig作为依赖项，当其变化时重新创建效果

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-10 pointer-events-none ${
        isFireBig ? "opacity-90 scale-125" : "opacity-70"
      }`}
    />
  );
}
