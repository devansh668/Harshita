'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, ArrowDown } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

interface LandingHeroProps {
  recipientName: string;
  nickname: string;
  heroMessage: string;
  onOpenSurprise: () => void;
  isUnlocked: boolean;
}

export default function LandingHero({
  recipientName,
  nickname,
  heroMessage,
  onOpenSurprise,
  isUnlocked,
}: LandingHeroProps) {
  const handleOpen = () => {
    if (audioManager) {
      audioManager.playCelebrationChimes();
      // Start background melody on explicit user interaction
      audioManager.startMusic();
    }
    onOpenSurprise();
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden"
    >
      {/* Background Soft Pastel Orbs */}
      <div className="absolute top-1/4 left-1/10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/10 w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full bg-purple-200/45 blur-3xl pointer-events-none -z-10 animate-float-medium" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-100/60 blur-2xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-20">
        {/* Floating Greeting Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 shadow-sm text-pink-600 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6"
        >
          <Sparkles className="w-4 h-4 text-pink-500 fill-pink-200 animate-spin" style={{ animationDuration: '6s' }} />
          <span>A Magical Surprise Made Just For You</span>
          <Sparkles className="w-4 h-4 text-pink-500 fill-pink-200 animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>

        {/* Recipient's Name in Luxe Serif Calligraphy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative inline-block mb-3"
        >
          <span className="block text-2xl sm:text-3xl text-pink-500 font-script font-normal mb-1">
            Dearest
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm pb-2">
            {recipientName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-[1px] w-12 bg-pink-300" />
            <Heart className="w-4 h-4 text-rose-400 fill-rose-300" />
            <div className="h-[1px] w-12 bg-pink-300" />
          </div>
        </motion.div>

        {/* Heading: Happy Birthday, Beautiful! */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4"
        >
          Happy Birthday,{' '}
          <span className="italic font-normal text-pink-500">
            {nickname || 'Beautiful'}!
          </span>
        </motion.h2>

        {/* Emotional Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed mb-8 px-4"
        >
          {heroMessage}
        </motion.p>

        {/* Animated Birthday Cake Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-block relative mb-10 group"
        >
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-glass hover:shadow-glass-hover transition-all duration-300">
            {/* Cake Graphic */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
              {/* Soft glow halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-300 to-amber-200 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

              {/* Multi-tier Cake SVG with animated flickering flame */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full relative z-10 drop-shadow-md"
              >
                {/* Cake Stand */}
                <ellipse cx="100" cy="180" rx="80" ry="12" fill="#E2E8F0" />
                <path d="M 85 180 L 115 180 L 110 192 L 90 192 Z" fill="#CBD5E1" />
                <ellipse cx="100" cy="192" rx="45" ry="5" fill="#94A3B8" />

                {/* Bottom Tier */}
                <rect x="35" y="115" width="130" height="60" rx="14" fill="#FCE7F3" />
                {/* Strawberry cream drip */}
                <path
                  d="M 35 125 C 45 138, 55 120, 65 132 C 75 140, 85 124, 95 136 C 105 142, 115 122, 125 134 C 135 140, 145 120, 165 125 L 165 115 L 35 115 Z"
                  fill="#F472B6"
                />
                <circle cx="50" cy="155" r="4" fill="#EC4899" />
                <circle cx="80" cy="160" r="4" fill="#A855F7" />
                <circle cx="110" cy="155" r="4" fill="#EC4899" />
                <circle cx="140" cy="160" r="4" fill="#A855F7" />

                {/* Top Tier */}
                <rect x="60" y="70" width="80" height="50" rx="10" fill="#FFF1F2" />
                <path
                  d="M 60 78 C 70 88, 80 74, 90 85 C 100 90, 110 76, 120 86 C 130 90, 135 76, 140 78 L 140 70 L 60 70 Z"
                  fill="#FDA4AF"
                />

                {/* Frosting rosettes */}
                <circle cx="70" cy="70" r="6" fill="#F43F5E" />
                <circle cx="100" cy="68" r="7" fill="#F43F5E" />
                <circle cx="130" cy="70" r="6" fill="#F43F5E" />

                {/* Candle */}
                <rect x="96" y="38" width="8" height="30" rx="3" fill="#FEF08A" />
                {/* Spiral stripes on candle */}
                <line x1="96" y1="45" x2="104" y2="48" stroke="#F59E0B" strokeWidth="2" />
                <line x1="96" y1="55" x2="104" y2="58" stroke="#F59E0B" strokeWidth="2" />

                {/* Candle Wick */}
                <line x1="100" y1="38" x2="100" y2="30" stroke="#475569" strokeWidth="2" />

                {/* Animated Candle Flame */}
                <motion.path
                  d="M 100 12 C 94 22, 95 28, 100 30 C 105 28, 106 22, 100 12 Z"
                  fill="url(#flameGradient)"
                  animate={{
                    scale: [1, 1.15, 0.95, 1.1, 1],
                    skewX: [-2, 3, -1, 2, -2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: 'easeInOut',
                  }}
                />
                <circle cx="100" cy="24" r="3" fill="#FFFFFF" opacity="0.9" />

                <defs>
                  <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="45%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="mt-2 text-xs font-semibold text-pink-600 tracking-wide uppercase">
              Make A Wish ✨
            </p>
          </div>
        </motion.div>

        {/* Action Button: "Open Your Surprise" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={handleOpen}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-pink-300/60 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Open Your Surprise</span>
            <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform duration-300 text-yellow-200" />
            {/* Shimmer reflection */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="w-1/2 h-full bg-white/25 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-1000" />
            </div>
          </button>

          {isUnlocked && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                const el = document.getElementById('gallery');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-3 flex items-center gap-1.5 text-xs text-pink-600 font-medium hover:text-pink-700 animate-bounce"
            >
              <span>Scroll down to explore</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
