'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Heart,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Feather,
  Stamp,
} from 'lucide-react';
import { BirthdayConfig } from '@/types';
import { saveStoredConfig, DEFAULT_CONFIG } from '@/lib/birthdayData';
import { audioManager } from '@/lib/audioManager';

interface BirthdayLetterProps {
  config: BirthdayConfig;
  onUpdateConfig: (newConfig: BirthdayConfig) => void;
}

export default function BirthdayLetter({
  config,
  onUpdateConfig,
}: BirthdayLetterProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form states for editing
  const [greeting, setGreeting] = useState(config.letterGreeting);
  const [body, setBody] = useState(config.letterBody);
  const [closing, setClosing] = useState(config.letterClosing);
  const [sender, setSender] = useState(config.letterSender);

  const handleOpenEnvelope = () => {
    if (audioManager) {
      audioManager.playMagicSparkle();
    }
    setIsOpen(true);
  };

  const handleSaveLetter = () => {
    const updated = {
      ...config,
      letterGreeting: greeting,
      letterBody: body,
      letterClosing: closing,
      letterSender: sender,
    };
    onUpdateConfig(updated);
    saveStoredConfig(updated);
    setIsEditing(false);
  };

  const handleResetLetter = () => {
    setGreeting(DEFAULT_CONFIG.letterGreeting);
    setBody(DEFAULT_CONFIG.letterBody);
    setClosing(DEFAULT_CONFIG.letterClosing);
    setSender(DEFAULT_CONFIG.letterSender);
  };

  return (
    <section id="letter" className="py-20 px-4 relative z-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 border border-pink-200 text-pink-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Feather className="w-3.5 h-3.5 text-pink-500" />
            <span>Handwritten With Love</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
            A Letter For You
          </h2>
          <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed">
            Some feelings are best expressed from the heart. Unseal this letter written especially for you on your special day.
          </p>
        </div>

        {/* Envelope & Letter Container */}
        <div className="relative flex flex-col items-center justify-center">
          {!isOpen ? (
            /* Closed Envelope with Wax Seal */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleOpenEnvelope}
              className="relative w-full max-w-lg aspect-[16/10] bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 rounded-3xl border-2 border-pink-200/80 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer group hover:scale-102 hover:shadow-pink-300/40 transition-all duration-300 select-none overflow-hidden"
            >
              {/* Envelope flap lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 500 320"
                  preserveAspectRatio="none"
                >
                  {/* Top V Flap */}
                  <path
                    d="M 0 0 L 250 170 L 500 0"
                    fill="rgba(255, 241, 242, 0.7)"
                    stroke="rgba(244, 114, 182, 0.3)"
                    strokeWidth="2"
                  />
                  {/* Bottom Triangular Folds */}
                  <path
                    d="M 0 320 L 250 150 L 500 320"
                    fill="rgba(253, 242, 248, 0.5)"
                    stroke="rgba(244, 114, 182, 0.25)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Envelope Callout Badge */}
              <div className="relative z-10 text-center mb-4">
                <span className="text-xs font-semibold text-pink-500 uppercase tracking-widest block mb-1">
                  Private & Confidential
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
                  For {config.recipientName}
                </p>
              </div>

              {/* Wax Seal Button in Center */}
              <div className="relative z-20 group-hover:scale-110 transition-transform duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-pink-500 shadow-xl border-2 border-rose-300 flex items-center justify-center text-white relative">
                  {/* Wax Seal Texture */}
                  <div className="absolute inset-1.5 rounded-full border border-rose-400/50 flex items-center justify-center">
                    <Heart className="w-8 h-8 fill-rose-100 text-rose-200 animate-pulse" />
                  </div>
                </div>
                {/* Glow behind wax seal */}
                <div className="absolute -inset-2 rounded-full bg-rose-400/30 blur-md -z-10 group-hover:bg-rose-400/50 transition-colors" />
              </div>

              <div className="relative z-10 mt-5 flex items-center gap-2 text-xs font-bold text-rose-600 bg-white/80 px-4 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Click Wax Seal to Unfold Letter</span>
              </div>
            </motion.div>
          ) : (
            /* Open Handwritten Letter */
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-100/80 overflow-hidden"
              style={{
                backgroundImage:
                  'radial-gradient(#E2D9C8 0.75px, transparent 0.75px), radial-gradient(#E2D9C8 0.75px, #FFFDF9 0.75px)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px',
              }}
            >
              {/* Paper Decorative Corner Flourishes */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-pink-300/60 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-pink-300/60 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-pink-300/60 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-pink-300/60 rounded-br-xl pointer-events-none" />

              {/* Action buttons (Edit / Fold Back) */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-500 hover:text-pink-600 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Fold Back Into Envelope</span>
                </button>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleResetLetter}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 text-xs flex items-center gap-1"
                        title="Reset to default text"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                      <button
                        onClick={handleSaveLetter}
                        className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Letter</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-semibold border border-pink-200 transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Letter</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Letter Content: Read Mode vs In-Place Edit Mode */}
              {isEditing ? (
                <div className="space-y-4 font-sans text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Salutation
                    </label>
                    <input
                      type="text"
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Letter Message
                    </label>
                    <textarea
                      rows={8}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Sign-Off
                      </label>
                      <input
                        type="text"
                        value={closing}
                        onChange={(e) => setClosing(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Sender Signature
                      </label>
                      <input
                        type="text"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative font-serif text-gray-800">
                  {/* Salutation */}
                  <h3 className="text-2xl sm:text-3xl font-script font-bold text-pink-600 mb-6">
                    {config.letterGreeting}
                  </h3>

                  {/* Body Paragraphs */}
                  <div className="space-y-4 text-base sm:text-lg leading-relaxed sm:leading-loose text-gray-700 whitespace-pre-line font-serif">
                    {config.letterBody}
                  </div>

                  {/* Sign-Off */}
                  <div className="mt-8 pt-4">
                    <p className="text-sm sm:text-base italic text-gray-600">
                      {config.letterClosing}
                    </p>
                    <p className="text-xl sm:text-2xl font-script font-bold text-pink-600 mt-1">
                      {config.letterSender}
                    </p>
                  </div>

                  {/* Cute Golden Stamp in Bottom Right */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full border-2 border-dashed border-rose-300/70 rotate-12 flex items-center justify-center text-rose-400 pointer-events-none">
                    <div className="text-center">
                      <span className="text-[9px] uppercase tracking-widest font-sans font-bold block">
                        Birthday
                      </span>
                      <Heart className="w-4 h-4 fill-rose-300 text-rose-400 mx-auto" />
                      <span className="text-[9px] font-sans font-bold block">Special</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
