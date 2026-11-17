'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Star,
  Send,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Smile,
  Check,
  RotateCcw,
  Gift,
  Flame,
} from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

interface WishVaultSectionProps {
  recipientName: string;
}

interface ReasonNote {
  id: string;
  category: 'sweet' | 'fun' | 'inspiring' | 'memory';
  text: string;
  author?: string;
}

interface SavedWish {
  id: string;
  wish: string;
  timestamp: string;
}

const DEFAULT_REASONS: ReasonNote[] = [
  {
    id: 'r1',
    category: 'sweet',
    text: 'Your genuine warmth and the way you make every person feel seen and valued.',
  },
  {
    id: 'r2',
    category: 'inspiring',
    text: 'How fiercely determined you are when you set your mind to something you care about.',
  },
  {
    id: 'r3',
    category: 'fun',
    text: 'Your contagious laugh that can instantly turn any stressful day into pure joy.',
  },
  {
    id: 'r4',
    category: 'sweet',
    text: 'Your effortless elegance and grace — you light up every room you walk into.',
  },
  {
    id: 'r5',
    category: 'memory',
    text: 'All those endless spontaneous conversations where hours felt like mere minutes.',
  },
  {
    id: 'r6',
    category: 'inspiring',
    text: 'How you stay true to yourself no matter what, with a heart of gold.',
  },
  {
    id: 'r7',
    category: 'sweet',
    text: 'The thoughtful little ways you show you care, even without saying a word.',
  },
  {
    id: 'r8',
    category: 'fun',
    text: 'Your sense of humor and all our silly inside jokes that never get old.',
  },
  {
    id: 'r9',
    category: 'sweet',
    text: 'Your gentle patience and the quiet strength you carry so gracefully.',
  },
  {
    id: 'r10',
    category: 'inspiring',
    text: 'Watching you grow, pursue your passions, and become more incredible every year.',
  },
];

export default function WishVaultSection({ recipientName }: WishVaultSectionProps) {
  // Joy Jar States
  const [reasons, setReasons] = useState<ReasonNote[]>(DEFAULT_REASONS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newReasonText, setNewReasonText] = useState<string>('');
  const [newReasonCategory, setNewReasonCategory] = useState<'sweet' | 'fun' | 'inspiring' | 'memory'>('sweet');

  // Wish Lantern States
  const [wishInput, setWishInput] = useState<string>('');
  const [isLanternReleased, setIsLanternReleased] = useState<boolean>(false);
  const [savedWishes, setSavedWishes] = useState<SavedWish[]>([]);
  const [showWishVault, setShowWishVault] = useState<boolean>(false);

  // Load persisted reasons and wishes from localStorage
  useEffect(() => {
    try {
      const storedReasons = localStorage.getItem('harshita_joy_reasons');
      if (storedReasons) {
        setReasons(JSON.parse(storedReasons));
      }
      const storedWishes = localStorage.getItem('harshita_wish_vault');
      if (storedWishes) {
        setSavedWishes(JSON.parse(storedWishes));
      }
    } catch (e) {
      console.warn('Could not load stored wishes/reasons', e);
    }
  }, []);

  const filteredReasons = reasons.filter((r) =>
    activeCategory === 'all' ? true : r.category === activeCategory
  );

  const handleDrawNote = () => {
    if (audioManager) {
      audioManager.playSparkleSound();
    }
    const nextIdx = (currentNoteIndex + 1) % (filteredReasons.length || 1);
    setCurrentNoteIndex(nextIdx);
    setIsNoteOpen(true);
  };

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReasonText.trim()) return;

    const newReason: ReasonNote = {
      id: 'custom-' + Date.now(),
      category: newReasonCategory,
      text: newReasonText.trim(),
    };

    const updated = [newReason, ...reasons];
    setReasons(updated);
    try {
      localStorage.setItem('harshita_joy_reasons', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    setNewReasonText('');
    setShowAddModal(false);
    setCurrentNoteIndex(0);
    setIsNoteOpen(true);
  };

  const handleReleaseWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;

    if (audioManager) {
      audioManager.playSparkleSound();
      setTimeout(() => audioManager.playCelebrationSound(), 600);
    }

    const newWish: SavedWish = {
      id: 'wish-' + Date.now(),
      wish: wishInput.trim(),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const updated = [newWish, ...savedWishes];
    setSavedWishes(updated);
    try {
      localStorage.setItem('harshita_wish_vault', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    setIsLanternReleased(true);
    setWishInput('');

    setTimeout(() => {
      setIsLanternReleased(false);
    }, 6500);
  };

  return (
    <section id="wishes" className="py-20 px-4 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Cherished Wishes &amp; Daily Joy</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
            The Joy Jar &amp; Sky Lantern Sanctuary
          </h2>
          <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed">
            Every day with you is a gift. Unfold sweet reasons why you are deeply cherished, and release your secret birthday wish into the starry heavens!
          </p>
        </div>

        {/* Two-Column Interactive Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: The Interactive Joy Jar (6 Cols) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-white/90 via-pink-50/40 to-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-gray-800">
                      Jar of Joy &amp; Appreciation
                    </h3>
                    <p className="text-xs text-gray-500">
                      Folded stars filled with reasons you are loved
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-100/80 hover:bg-pink-200/80 text-pink-700 text-xs font-semibold transition-all hover:scale-105"
                  title="Add your own custom compliment"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {[
                  { id: 'all', label: 'All Notes' },
                  { id: 'sweet', label: '💖 Sweet Words' },
                  { id: 'inspiring', label: '✨ Inspiring' },
                  { id: 'fun', label: '😄 Fun & Silly' },
                  { id: 'memory', label: '📸 Memories' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentNoteIndex(0);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                        : 'bg-white/80 text-gray-600 hover:bg-white border border-pink-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 3D-Styled Joy Jar Display */}
              <div className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl bg-gradient-to-b from-amber-50/50 via-pink-50/30 to-purple-50/40 border-2 border-white/80 p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden group">
                {/* Floating Starlight Background */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <div className="absolute top-12 right-10 w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
                  <div className="absolute bottom-10 left-12 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                </div>

                {/* Animated Glass Jar Graphic */}
                <div className="relative w-40 h-52 sm:w-44 sm:h-56 rounded-t-3xl rounded-b-2xl border-4 border-white/90 bg-gradient-to-b from-white/30 via-white/10 to-amber-100/20 backdrop-blur-md shadow-2xl flex flex-col items-center justify-between p-3">
                  {/* Jar Wooden / Gold Lid */}
                  <div className="w-28 h-5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-md border-b-2 border-amber-700/50 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-amber-950 uppercase tracking-widest">
                      Joy Jar
                    </span>
                  </div>

                  {/* Origami Stars & Notes Cluster */}
                  <div className="relative w-full flex-1 flex items-center justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-2 p-2">
                      {['⭐', '✨', '💌', '🌸', '💖', '🌟', '🕊️', '💐'].map((emoji, i) => (
                        <motion.span
                          key={i}
                          animate={{
                            y: [0, -6, 0],
                            rotate: [0, (i % 2 === 0 ? 8 : -8), 0],
                          }}
                          transition={{
                            duration: 2.5 + (i % 3) * 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.2,
                          }}
                          className="text-xl sm:text-2xl filter drop-shadow select-none cursor-pointer hover:scale-125 transition-transform"
                          onClick={handleDrawNote}
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Jar Base Ribbon */}
                  <div className="w-full text-center py-1 bg-pink-500/80 rounded-lg text-[10px] text-white font-bold tracking-wide shadow-xs">
                    Tap to Pick a Note
                  </div>
                </div>
              </div>

              {/* Revealed Note Card / Paper Slip */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {isNoteOpen && filteredReasons.length > 0 ? (
                    <motion.div
                      key={filteredReasons[currentNoteIndex]?.id || 'note'}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-pink-50/80 to-rose-50/90 border border-amber-200/80 shadow-md relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                          Reason #{currentNoteIndex + 1} of {filteredReasons.length}
                        </span>
                        <span className="text-xs text-pink-500 font-serif italic">
                          For {recipientName} ❤️
                        </span>
                      </div>

                      <p className="font-serif text-base sm:text-lg text-gray-800 leading-relaxed italic mb-3">
                        &quot;{filteredReasons[currentNoteIndex]?.text}&quot;
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-amber-200/50">
                        <span>Tap &apos;Pick Another Note&apos; to reveal more</span>
                        <button
                          onClick={handleDrawNote}
                          className="text-pink-600 font-semibold hover:text-pink-700 flex items-center gap-1"
                        >
                          <span>Next Note</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/60 border border-pink-100 text-center text-xs text-gray-500">
                      Tap the Joy Jar or press &apos;Pick a Note&apos; below to open a warm thought!
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Joy Jar Action Button */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handleDrawNote}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Pick Another Note</span>
              </button>
            </div>
          </div>

          {/* Right Column: The Magical Birthday Sky Lantern (6 Cols) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 border-indigo-900/60">
            {/* Ambient Starfield Canvas Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div className="absolute top-10 left-14 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <div className="absolute top-28 right-20 w-2 h-2 rounded-full bg-amber-200 animate-pulse" />
              <div className="absolute top-48 left-36 w-1 h-1 rounded-full bg-blue-200" />
              <div className="absolute top-72 right-12 w-1.5 h-1.5 rounded-full bg-pink-200 animate-pulse" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shadow-xs border border-amber-400/30">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">
                      Make a Secret Birthday Wish
                    </h3>
                    <p className="text-xs text-indigo-200">
                      Release a glowing paper sky lantern into the night
                    </p>
                  </div>
                </div>

                {savedWishes.length > 0 && (
                  <button
                    onClick={() => setShowWishVault(!showWishVault)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-800/60 hover:bg-indigo-700/60 text-indigo-200 text-xs font-semibold border border-indigo-700/50 transition-all"
                  >
                    {showWishVault ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>Wish Vault ({savedWishes.length})</span>
                  </button>
                )}
              </div>

              {/* Lantern Flight Stage */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-indigo-950/80 via-slate-950/90 to-black/90 border border-indigo-800/40 p-4 flex flex-col items-center justify-end overflow-hidden shadow-inner my-4">
                <AnimatePresence>
                  {isLanternReleased ? (
                    /* Ascending Sky Lantern with realistic flame & smoke glow */
                    <motion.div
                      key="lantern-flight"
                      initial={{ y: 80, scale: 0.8, opacity: 0 }}
                      animate={{
                        y: [-20, -180],
                        x: [0, 15, -10, 20],
                        scale: [1, 0.45],
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 6, ease: 'easeOut' }}
                      className="absolute flex flex-col items-center select-none"
                    >
                      {/* Paper Lantern Body */}
                      <div className="relative w-24 h-32 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 shadow-[0_0_40px_rgba(251,191,36,0.9)] flex items-center justify-center border border-amber-300">
                        {/* Internal Candle Glow */}
                        <div className="w-8 h-8 rounded-full bg-white/90 shadow-[0_0_20px_#fff] animate-pulse" />
                        <span className="absolute bottom-2 text-[8px] font-bold text-amber-950 uppercase tracking-widest">
                          {recipientName}
                        </span>
                      </div>
                      {/* Trailing golden sparkles */}
                      <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-transparent blur-xs mt-1" />
                    </motion.div>
                  ) : (
                    /* Resting Lantern Ready to Light */
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-20 h-28 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-amber-100/90 via-amber-300/80 to-amber-500/90 shadow-[0_0_25px_rgba(251,191,36,0.4)] flex items-center justify-center border border-amber-200/80">
                        <Flame className="w-6 h-6 text-amber-700 animate-bounce" />
                        <span className="absolute bottom-1.5 text-[8px] font-bold text-amber-950 uppercase tracking-widest">
                          Wish
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/90 mt-3 font-medium">
                        Your lantern is ready. Write your wish below!
                      </p>
                    </div>
                  )}
                </AnimatePresence>

                {isLanternReleased && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 text-center"
                  >
                    <div>
                      <Sparkles className="w-7 h-7 text-yellow-300 mx-auto mb-2 animate-spin" />
                      <p className="font-serif font-bold text-lg text-amber-200">
                        Your Birthday Wish Is Ascending to the Stars!
                      </p>
                      <p className="text-xs text-indigo-200 mt-1 max-w-xs mx-auto">
                        May every word of your wish manifest with happiness and magic this year.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Saved Wishes Drawer */}
              {showWishVault && savedWishes.length > 0 && (
                <div className="mb-4 p-4 rounded-2xl bg-indigo-900/60 border border-indigo-700/60 max-h-48 overflow-y-auto no-scrollbar">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-2">
                    🔒 Private Wish Vault ({savedWishes.length})
                  </span>
                  <div className="space-y-2">
                    {savedWishes.map((w) => (
                      <div
                        key={w.id}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-800/50 text-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="text-amber-100 font-serif italic">&quot;{w.wish}&quot;</p>
                          <span className="text-[10px] text-indigo-400 mt-0.5 block">
                            Released on {w.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wish Input Form */}
              <form onSubmit={handleReleaseWish} className="relative mt-2">
                <input
                  type="text"
                  value={wishInput}
                  onChange={(e) => setWishInput(e.target.value)}
                  placeholder={`What is your heartfelt birthday wish, ${recipientName}?`}
                  disabled={isLanternReleased}
                  className="w-full py-3.5 pl-4 pr-32 rounded-2xl bg-white/10 border border-indigo-500/40 focus:border-amber-400 focus:outline-none text-xs sm:text-sm text-white placeholder-indigo-300/60 backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={!wishInput.trim() || isLanternReleased}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Release</span>
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-800/40 flex items-center justify-between text-[11px] text-indigo-300/80">
              <span>Wishes are stored safely in her private vault</span>
              <span className="text-amber-300 font-semibold">✨ 100% Magical &amp; Private</span>
            </div>
          </div>
        </div>

        {/* Milestone Badges: Fun Celebrating Her */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
          {[
            { label: '365 New Days Ahead', sub: 'Infinite possibilities to shine', icon: '🌅' },
            { label: 'Countless Smiles', sub: 'That light up every room', icon: '✨' },
            { label: 'Unstoppable Grace', sub: 'Kindness, warmth & intelligence', icon: '👑' },
            { label: 'Deeply Cherished', sub: 'Today, tomorrow & always', icon: '💖' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-pink-100 shadow-sm text-center hover:scale-105 transition-all"
            >
              <span className="text-2xl mb-1 block select-none">{item.icon}</span>
              <p className="font-serif font-bold text-gray-800 text-sm">{item.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Reason Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif font-bold text-xl text-gray-800 mb-1">
              Add a Reason Why She&apos;s Special
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Write a personal compliment, shared joke, or sweet memory for {recipientName}.
            </p>

            <form onSubmit={handleAddReason} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sweet', label: '💖 Sweet Words' },
                    { id: 'inspiring', label: '✨ Inspiring' },
                    { id: 'fun', label: '😄 Fun Inside Joke' },
                    { id: 'memory', label: '📸 Cherished Memory' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewReasonCategory(cat.id as any)}
                      className={`p-2 rounded-xl text-xs font-semibold text-center transition-all ${
                        newReasonCategory === cat.id
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Your Compliment / Message
                </label>
                <textarea
                  rows={3}
                  value={newReasonText}
                  onChange={(e) => setNewReasonText(e.target.value)}
                  placeholder={`e.g. How you always know how to make me laugh even on tough days...`}
                  className="w-full p-3 rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs text-gray-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Save Note to Joy Jar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
