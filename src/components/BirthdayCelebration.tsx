'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  PartyPopper,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Heart,
  Wind,
} from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

interface BirthdayCelebrationProps {
  recipientName: string;
}

export default function BirthdayCelebration({ recipientName }: BirthdayCelebrationProps) {
  // 5 candles on the cake: true = lit, false = blown out
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!audioManager) return;
    const unsub = audioManager.subscribe((playing: boolean) => {
      setIsPlayingMusic(playing);
    });
    return unsub;
  }, []);

  // When all candles are blown out, trigger big celebration!
  useEffect(() => {
    const allBlown = candles.every((c) => !c);
    if (allBlown && !isCelebrated) {
      triggerBigCelebration();
    }
  }, [candles, isCelebrated]);

  const blowSingleCandle = (index: number) => {
    if (!candles[index]) return;
    if (audioManager) audioManager.playCandleBlowSound();
    const updated = [...candles];
    updated[index] = false;
    setCandles(updated);
  };

  const blowAllCandles = () => {
    if (audioManager) audioManager.playCandleBlowSound();
    setCandles([false, false, false, false, false]);
  };

  const relightCandles = () => {
    setCandles([true, true, true, true, true]);
    setIsCelebrated(false);
  };

  const triggerBigCelebration = () => {
    setIsCelebrated(true);
    if (audioManager) {
      audioManager.playCelebrationChimes();
      // Also start birthday melody if not already playing
      if (!audioManager.isPlaying()) {
        audioManager.startMusic();
      }
    }

    // Canvas Confetti Multi-Burst Fireworks
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#F472B6', '#EC4899', '#DDD6FE', '#A855F7', '#FEF08A', '#FDA4AF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center star burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.55 },
      colors: colors,
    });
  };

  // Fireworks canvas animation when isCelebrated
  useEffect(() => {
    if (!isCelebrated) return;
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 450);

    interface FireworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }

    let particles: FireworkParticle[] = [];
    let animId: number;

    const fireColors = ['#FF69B4', '#BA55D3', '#FFD700', '#FF1493', '#00FFFF', '#FFA07A'];

    const spawnFirework = () => {
      const cx = width * (0.2 + Math.random() * 0.6);
      const cy = height * (0.2 + Math.random() * 0.4);
      const color = fireColors[Math.floor(Math.random() * fireColors.length)];
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 2 + Math.random() * 2.5,
        });
      }
    };

    let spawnTimer = setInterval(spawnFirework, 600);
    spawnFirework();

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      particles = particles.filter((p) => p.alpha > 0.02);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha *= 0.96;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animId);
    };
  }, [isCelebrated]);

  return (
    <section id="celebration" className="py-20 px-4 relative z-20 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
            <span>Grand Celebration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
            Blow the Candles & Make a Wish!
          </h2>
          <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed">
            Close your eyes, make your deepest birthday wish, and blow out the candles to launch fireworks, confetti, and celebratory joy!
          </p>
        </div>

        {/* Floating Balloons Animation (When Celebrated) */}
        <AnimatePresence>
          {isCelebrated && (
            <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
              {[...Array(14)].map((_, i) => {
                const balloonColors = [
                  'bg-pink-400',
                  'bg-purple-400',
                  'bg-rose-400',
                  'bg-yellow-300',
                  'bg-violet-400',
                  'bg-amber-300',
                ];
                const col = balloonColors[i % balloonColors.length];
                const leftPos = (i * 7) + 5;
                const delay = (i * 0.25);
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '110vh', x: `${leftPos}vw`, opacity: 0.9 }}
                    animate={{ y: '-20vh', opacity: 1 }}
                    transition={{
                      duration: 8 + (i % 4) * 2,
                      delay,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute"
                  >
                    <div className="relative">
                      {/* Balloon Body */}
                      <div className={`w-12 h-16 rounded-[50%] ${col} shadow-lg relative flex items-center justify-center`}>
                        <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full rotate-[-20deg]" />
                      </div>
                      {/* Balloon Tie */}
                      <div className="w-2 h-1.5 bg-gray-600 mx-auto" />
                      {/* String */}
                      <div className="w-0.5 h-16 bg-gray-400/60 mx-auto" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Celebration Cake Stage */}
        <div className="relative max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/60 shadow-glass overflow-hidden">
          {/* Fireworks Canvas overlay inside stage */}
          {isCelebrated && (
            <canvas
              ref={fireworksCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />
          )}

          {/* Interactive Cake Illustration */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center mb-6">
            <svg viewBox="0 0 300 280" className="w-full h-full drop-shadow-xl">
              {/* Stand */}
              <ellipse cx="150" cy="245" rx="120" ry="16" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M 130 245 L 170 245 L 165 265 L 135 265 Z" fill="#CBD5E1" />
              <ellipse cx="150" cy="265" rx="60" ry="8" fill="#94A3B8" />

              {/* Bottom Tier */}
              <rect x="50" y="160" width="200" height="85" rx="18" fill="#FDF2F8" />
              {/* Strawberry Drips */}
              <path
                d="M 50 175 C 65 195, 80 165, 95 185 C 110 200, 125 170, 140 190 C 155 205, 170 170, 185 190 C 200 205, 215 170, 230 190 C 240 180, 245 175, 250 175 L 250 160 L 50 160 Z"
                fill="#F472B6"
              />
              {/* Decorative Pearls */}
              {[70, 100, 130, 160, 190, 220].map((cx, i) => (
                <circle key={i} cx={cx} cy="215" r="5" fill="#EC4899" />
              ))}

              {/* Middle Tier */}
              <rect x="80" y="105" width="140" height="60" rx="14" fill="#FAF5FF" />
              <path
                d="M 80 115 C 95 130, 110 110, 125 125 C 140 135, 155 110, 170 128 C 185 135, 205 110, 220 115 L 220 105 L 80 105 Z"
                fill="#C084FC"
              />
              {[105, 135, 165, 195].map((cx, i) => (
                <circle key={i} cx={cx} cy="142" r="4" fill="#A855F7" />
              ))}

              {/* Rosettes */}
              {[95, 125, 150, 175, 205].map((cx, i) => (
                <circle key={i} cx={cx} cy="105" r="7" fill="#F43F5E" />
              ))}

              {/* 5 Candles */}
              {[100, 125, 150, 175, 200].map((cx, idx) => {
                const isLit = candles[idx];
                return (
                  <g key={idx} className="cursor-pointer" onClick={() => blowSingleCandle(idx)}>
                    {/* Candle Body */}
                    <rect x={cx - 4} y="60" width="8" height="45" rx="3" fill="#FEF08A" />
                    {/* Wick */}
                    <line x1={cx} y1="60" x2={cx} y2="50" stroke="#475569" strokeWidth="2" />

                    {/* Flame (if lit) */}
                    {isLit ? (
                      <g>
                        <ellipse cx={cx} cy="36" rx="6" ry="12" fill="#F59E0B" />
                        <ellipse cx={cx} cy="34" rx="3.5" ry="8" fill="#FEF08A" />
                        <ellipse cx={cx} cy="38" rx="1.5" ry="3" fill="#3B82F6" />
                      </g>
                    ) : (
                      /* Smoke puff (when blown out) */
                      <g>
                        <circle cx={cx} cy="46" r="3" fill="#94A3B8" opacity="0.6" />
                        <circle cx={cx + 2} cy="38" r="4.5" fill="#94A3B8" opacity="0.4" />
                        <circle cx={cx - 1} cy="30" r="6" fill="#CBD5E1" opacity="0.25" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Candle Status & Blowing Buttons */}
          <div className="relative z-20 flex flex-col items-center gap-4">
            {candles.some((c) => c) ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={blowAllCandles}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-pink-300/60 hover:scale-105 active:scale-95 transition-all"
                >
                  <Wind className="w-5 h-5 animate-pulse" />
                  <span>Blow Out All Candles! 🎂</span>
                </button>
                <p className="text-xs text-gray-500">
                  (Or click individual candle flames to blow them out one by one!)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 border border-pink-200"
                >
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-pink-600 mb-1">
                    🎉 Happy Birthday, {recipientName}! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 font-sans">
                    May every single candle you blew bring a dream to life this year!
                  </p>
                </motion.div>

                <button
                  onClick={relightCandles}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-pink-50 text-pink-600 font-semibold text-xs border border-pink-200 shadow-sm transition-all hover:scale-105"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Relight The Candles</span>
                </button>
              </div>
            )}

            {/* Music Player Bar (Requirement: Explicit start/pause) */}
            <div className="mt-6 pt-6 border-t border-pink-100/70 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Volume2 className="w-4 h-4 text-pink-500" />
                <span>
                  {isPlayingMusic
                    ? 'Playing Birthday Melody (Acoustic Celesta / Music Box)'
                    : 'Background Melody is paused'}
                </span>
              </div>

              <button
                onClick={() => {
                  if (audioManager) audioManager.toggleMusic();
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                  isPlayingMusic
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-white border border-pink-200 text-gray-700 hover:bg-pink-50'
                }`}
              >
                {isPlayingMusic ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Pause Music</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Start Birthday Melody</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
