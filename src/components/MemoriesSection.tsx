'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Camera,
  Coffee,
  Flower2,
  Star,
  Plus,
  Calendar,
  MapPin,
  Clock,
  LayoutGrid,
  GitCommitVertical,
  X,
  Upload,
} from 'lucide-react';
import { SAMPLE_MEMORIES } from '@/lib/birthdayData';
import { MemoryItem } from '@/types';

interface MemoriesSectionProps {
  recipientName: string;
}

export default function MemoriesSection({ recipientName }: MemoriesSectionProps) {
  const [memories, setMemories] = useState<MemoryItem[]>(SAMPLE_MEMORIES);
  const [viewMode, setViewMode] = useState<'timeline' | 'scrapbook'>('timeline');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newSticker, setNewSticker] = useState<MemoryItem['sticker']>('heart');
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stickerIcons: Record<string, any> = {
    heart: Heart,
    sparkle: Sparkles,
    camera: Camera,
    coffee: Coffee,
    flower: Flower2,
    star: Star,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setNewImageUrl(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: MemoryItem = {
      id: 'mem-' + Date.now(),
      title: newTitle,
      date: newDate || 'Cherished Day',
      location: newLocation || 'Sweet Memory',
      caption: newCaption || 'A moment we will never forget.',
      imageUrl: newImageUrl || '/images/friend/friend1.jpg',
      sticker: newSticker,
      rotation: (Math.random() - 0.5) * 6,
    };

    setMemories([item, ...memories]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewCaption('');
    setNewImageUrl('');
  };

  return (
    <section id="memories" className="py-20 px-4 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-300" />
            <span>Cherished Scrapbook</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
            Unforgettable Memories With {recipientName}
          </h2>
          <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed">
            From late-night laughter to spontaneous road trips, every moment spent with you is a treasure tucked safely in the pages of this scrapbook.
          </p>
        </div>

        {/* Action Bar: View Switcher & Add Memory Button */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 rounded-full bg-white/80 border border-pink-200 shadow-sm">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <GitCommitVertical className="w-3.5 h-3.5" />
              <span>Timeline Journey</span>
            </button>
            <button
              onClick={() => setViewMode('scrapbook')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'scrapbook'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Scrapbook Polaroid Wall</span>
            </button>
          </div>

          {/* Add Memory Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-pink-600 border border-pink-200 font-semibold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add A New Memory</span>
          </button>
        </div>

        {/* View 1: Timeline Journey */}
        {viewMode === 'timeline' ? (
          <div className="relative max-w-4xl mx-auto">
            {/* Center Vertical Timeline Line */}
            <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-pink-300 via-rose-300 to-purple-300 -translate-x-1/2" />

            <div className="space-y-12">
              {memories.map((mem, idx) => {
                const isEven = idx % 2 === 0;
                const StickerIcon = stickerIcons[mem.sticker] || Heart;

                return (
                  <div
                    key={mem.id}
                    className={`relative flex flex-col sm:flex-row items-center ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline Node Icon in Center */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-pink-400 shadow-md flex items-center justify-center text-pink-500 z-10">
                      <StickerIcon className="w-4 h-4 fill-pink-100" />
                    </div>

                    {/* Content Card (Half width on desktop) */}
                    <div
                      className={`w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 ${
                        isEven ? 'sm:pr-4' : 'sm:pl-4'
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="relative bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-pink-100 shadow-glass hover:shadow-glass-hover transition-all duration-300"
                        style={{ transform: `rotate(${mem.rotation * 0.5}deg)` }}
                      >
                        {/* Washi Tape Graphic */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-200/60 backdrop-blur-xs border border-white/40 shadow-xs -rotate-2 pointer-events-none rounded-xs" />

                        {/* Photo */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mem.imageUrl}
                            alt={mem.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-pink-500 shadow-sm">
                            <StickerIcon className="w-3.5 h-3.5 fill-pink-100" />
                          </div>
                        </div>

                        {/* Text Metadata */}
                        <div className="flex items-center gap-3 text-xs text-pink-600 font-medium mb-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{mem.date}</span>
                          </span>
                          {mem.location && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{mem.location}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">
                          {mem.title}
                        </h3>

                        <p className="text-gray-600 font-sans text-xs sm:text-sm leading-relaxed">
                          {mem.caption}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View 2: Scrapbook Polaroid Wall */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {memories.map((mem, idx) => {
              const StickerIcon = stickerIcons[mem.sticker] || Heart;
              return (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="relative p-4 pb-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-pink-100 group"
                  style={{ transform: `rotate(${mem.rotation}deg)` }}
                >
                  {/* Washi Tape Strip */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/70 border border-white/40 shadow-xs rotate-1 pointer-events-none rounded-xs" />

                  {/* Polaroid Photo Box */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 shadow text-pink-500">
                      <StickerIcon className="w-3.5 h-3.5 fill-pink-100" />
                    </div>
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <div className="px-1 text-center">
                    <p className="font-serif font-bold text-base text-gray-800 mb-1">
                      {mem.title}
                    </p>
                    <p className="text-xs text-gray-600 font-sans line-clamp-3 leading-relaxed mb-2">
                      {mem.caption}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-pink-500 font-medium">
                      <span>{mem.date}</span>
                      {mem.location && <span>• {mem.location}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add Memory Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-gray-800">
                    Add A New Memory
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-4">
                {/* Photo Upload / Preview */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Memory Photograph
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/50 hover:bg-pink-100/50 cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-all relative"
                  >
                    {newImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={newImageUrl}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-pink-500 mb-1" />
                        <span className="text-xs font-semibold text-pink-600">
                          Click to upload photo
                        </span>
                        <span className="text-[10px] text-gray-400">
                          JPG, PNG, WebP supported
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Memory Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Rainy Day Bookstore Trip"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* Date & Location Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Summer 2024"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Seaside Cafe"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                </div>

                {/* Caption / Story */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Story / Caption
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What made this memory so unforgettable?"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                  />
                </div>

                {/* Sticker Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Scrapbook Sticker
                  </label>
                  <div className="flex gap-2">
                    {(['heart', 'sparkle', 'camera', 'coffee', 'flower', 'star'] as const).map(
                      (stk) => {
                        const Icon = stickerIcons[stk];
                        const isSelected = newSticker === stk;
                        return (
                          <button
                            key={stk}
                            type="button"
                            onClick={() => setNewSticker(stk)}
                            className={`p-2 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-pink-500 text-white border-pink-500 shadow'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-pink-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold shadow hover:scale-105 active:scale-95 transition-all"
                  >
                    Save Memory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
