'use client';

import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';

interface FooterProps {
  recipientName: string;
}

export default function Footer({ recipientName }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-14 px-4 bg-gradient-to-b from-transparent via-pink-50/50 to-pink-100/60 border-t border-pink-100/80 z-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heart Icon Cluster */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-300 animate-pulse" />
          <div className="w-12 h-0.5 bg-pink-300/60" />
          <Sparkles className="w-5 h-5 text-rose-500" />
          <div className="w-12 h-0.5 bg-pink-300/60" />
          <Heart className="w-4 h-4 text-pink-400 fill-pink-300 animate-pulse" />
        </div>

        <h3 className="font-serif font-bold text-2xl text-gray-800 mb-2">
          Happy Birthday, {recipientName}!
        </h3>

        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-6 font-sans">
          May the year ahead bring you pure happiness, boundless inspiration, true laughter, and dreams realized beyond your wildest imagination.
        </p>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 hover:bg-white text-pink-600 font-semibold text-xs border border-pink-200 shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>

        <p className="text-[11px] text-gray-400 mt-8">
          Crafted with heartfelt love and imagination for {recipientName} ✨
        </p>
      </div>
    </footer>
  );
}
