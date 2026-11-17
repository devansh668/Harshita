'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  type: 'heart' | 'star' | 'circle';
  rotation: number;
  rotSpeed: number;
  color: string;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 114, 182, 0.6)', // pink
      'rgba(216, 180, 254, 0.6)', // lavender
      'rgba(253, 164, 175, 0.5)', // rose
      'rgba(254, 240, 138, 0.6)', // soft gold
      'rgba(255, 255, 255, 0.7)', // white sparkle
    ];

    const types: ('heart' | 'star' | 'circle')[] = ['heart', 'star', 'circle'];

    const particleCount = Math.min(45, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];

    const createParticle = (initialRandomY = false): Particle => ({
      x: Math.random() * width,
      y: initialRandomY ? Math.random() * height : height + 20,
      size: 8 + Math.random() * 14,
      speedY: -(0.4 + Math.random() * 0.8),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.1 + Math.random() * 0.7,
      fadeSpeed: (Math.random() - 0.5) * 0.005,
      type: types[Math.floor(Math.random() * types.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      const topCurveHeight = size * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(
        -size / 2,
        -size / 2,
        -size,
        topCurveHeight / 2,
        0,
        size
      );
      // top right curve
      ctx.bezierCurveTo(
        size,
        topCurveHeight / 2,
        size / 2,
        -size / 2,
        0,
        topCurveHeight
      );
      ctx.fill();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      const spikes = 4;
      const outerRadius = size * 0.6;
      const innerRadius = size * 0.25;
      let rot = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.8 || p.opacity < 0.15) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[idx] = createParticle(false);
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, p.opacity));

        if (p.type === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.type === 'star') {
          drawStar(ctx, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.85 }}
    />
  );
}
