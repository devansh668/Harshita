'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Sliders,
  Download,
  RotateCcw,
  Upload,
  Eye,
  Check,
  Wand2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  EnhancementParams,
  DEFAULT_ENHANCEMENT,
  PRESET_FILTERS,
  renderEnhancedPhoto,
} from '@/lib/photoEnhancer';
import { SAMPLE_GALLERY_PHOTOS } from '@/lib/birthdayData';
import { GalleryPhoto } from '@/types';

interface HerGalleryProps {
  recipientName: string;
}

export default function HerGallery({ recipientName }: HerGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(SAMPLE_GALLERY_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto>(SAMPLE_GALLERY_PHOTOS[0]);
  const [params, setParams] = useState<EnhancementParams>(DEFAULT_ENHANCEMENT);
  const [activePreset, setActivePreset] = useState<string>('Natural Original');
  const [enhancedDataUrl, setEnhancedDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(50); // percentage for split slider
  const [showStudio, setShowStudio] = useState<boolean>(true);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 5);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute natural aspect ratio of the selected photo
  useEffect(() => {
    if (!selectedPhoto?.originalUrl) return;
    const img = new Image();
    img.src = selectedPhoto.originalUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [selectedPhoto]);

  // Trigger real-time enhancement rendering
  useEffect(() => {
    let isCurrent = true;
    const process = async () => {
      if (!selectedPhoto) return;
      setIsProcessing(true);
      try {
        const result = await renderEnhancedPhoto(selectedPhoto.originalUrl, params);
        if (isCurrent) {
          setEnhancedDataUrl(result);
        }
      } catch (e) {
        console.error('Enhancement error:', e);
      } finally {
        if (isCurrent) setIsProcessing(false);
      }
    };

    const timeout = setTimeout(process, 80);
    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [selectedPhoto, params]);

  const handlePresetSelect = (name: string, presetParams: EnhancementParams) => {
    setActivePreset(name);
    setParams(presetParams);
  };

  const handleReset = () => {
    setActivePreset('Natural Original');
    setParams(DEFAULT_ENHANCEMENT);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newPhoto: GalleryPhoto = {
        id: 'uploaded-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: 'Uploaded by you with love ❤️',
        originalUrl: url,
        date: 'Just Added',
        location: 'Personal Keepsake',
      };
      setPhotos([newPhoto, ...photos]);
      setSelectedPhoto(newPhoto);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!enhancedDataUrl) return;
    const link = document.createElement('a');
    link.href = enhancedDataUrl;
    link.download = `${recipientName}-enhanced-${activePreset.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  return (
    <section id="gallery" className="py-20 px-4 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-600 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Her Radiance In Every Frame</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
            {recipientName}&apos;s Photo Studio & Gallery
          </h2>
          <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed">
            Every photograph tells the story of her grace and warmth. Explore her curated portraits or upload your favorite photo to enhance and style with studio-grade filters!
          </p>
        </div>

        {/* Thumbnail Selector Row + Upload Button */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/50 hover:bg-pink-100/50 text-pink-600 transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-semibold">Upload Photo</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </button>

          {/* Photo Thumbnails */}
          {photos.map((photo) => {
            const isSelected = selectedPhoto.id === photo.id;
            return (
              <button
                key={photo.id}
                onClick={() => {
                  setSelectedPhoto(photo);
                }}
                className={`flex-shrink-0 relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-pink-500 ring-offset-2 scale-105 shadow-md'
                    : 'opacity-70 hover:opacity-100 hover:scale-102'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.originalUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium truncate w-full">
                    {photo.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Photo Studio Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Interactive Split View / Display Area (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-b from-rose-50/30 to-purple-50/20 border-b lg:border-b-0 lg:border-r border-pink-100/60">
            {/* Split Comparison Viewer */}
            <div
              className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl select-none group border-2 border-white/80 bg-slate-900/10 transition-all duration-300"
              style={{
                aspectRatio: aspectRatio,
                maxHeight: '68vh',
              }}
            >
              {/* Layer 1: Enhanced Version (Background) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enhancedDataUrl || selectedPhoto.originalUrl}
                alt="Enhanced Preview"
                className={`absolute inset-0 w-full h-full ${
                  fitMode === 'contain' ? 'object-contain' : 'object-cover'
                }`}
              />

              {/* Layer 2: Original Version (Clipped cleanly via CSS clipPath for exact 1:1 pixel alignment) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.originalUrl}
                alt="Original Preview"
                className={`absolute inset-0 w-full h-full pointer-events-none ${
                  fitMode === 'contain' ? 'object-contain' : 'object-cover'
                }`}
                style={{
                  clipPath: `inset(0 ${100 - compareSplit}% 0 0)`,
                }}
              />

              {/* Split Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${compareSplit}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-pink-600 text-xs font-bold border border-pink-200">
                  ↔
                </div>
              </div>

              {/* Range Input for Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={compareSplit}
                onChange={(e) => setCompareSplit(Number(e.target.value))}
                aria-label="Before and after split comparison"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />

              {/* Badges: Original vs Enhanced */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide">
                Original
              </div>
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-pink-600/90 backdrop-blur-md text-white text-xs font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Enhanced</span>
              </div>

              {/* Processing Spinner */}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-30 flex items-center justify-center">
                  <div className="bg-white/95 px-4 py-2.5 rounded-2xl text-xs font-semibold text-pink-600 flex items-center gap-2 shadow-lg">
                    <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <span>Applying Studio Polish...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Split Slider Hint & Actions */}
            <div className="w-full max-w-md mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Drag slider left / right to compare</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-pink-50 text-pink-600 text-xs font-semibold border border-pink-200 shadow-xs transition-all"
                  title={fitMode === 'contain' ? 'Switch to Fill Frame' : 'Switch to Fit Entire Photo'}
                >
                  {fitMode === 'contain' ? '🔍 Full Photo' : '📐 Fill Box'}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow hover:scale-105 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Enhanced</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Adjustment Sliders (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-pink-500" />
                  <h3 className="font-serif font-bold text-xl text-gray-800">
                    Artistic Studio Controls
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-pink-600 transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Preset Filter Pills */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Signature Aesthetics
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(PRESET_FILTERS).map(([name, pParams]) => {
                    const isActive = activePreset === name;
                    return (
                      <button
                        key={name}
                        onClick={() => handlePresetSelect(name, pParams)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-pink-500 text-white shadow-sm'
                            : 'bg-pink-50/80 text-gray-700 hover:bg-pink-100 border border-pink-200/60'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Effect Sliders */}
              <div className="space-y-4">
                {/* Brightness */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Brightness</span>
                    <span>{params.brightness > 0 ? `+${params.brightness}` : params.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={params.brightness}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, brightness: Number(e.target.value) });
                    }}
                    className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Contrast</span>
                    <span>{params.contrast > 0 ? `+${params.contrast}` : params.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={params.contrast}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, contrast: Number(e.target.value) });
                    }}
                    className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Saturation</span>
                    <span>{params.saturation > 0 ? `+${params.saturation}` : params.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={params.saturation}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, saturation: Number(e.target.value) });
                    }}
                    className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Warm & Cool Filter (Temperature) */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Warmth / Coolness</span>
                    <span className="text-[11px] text-pink-600">
                      {params.temperature > 0 ? 'Warm Golden' : params.temperature < 0 ? 'Cool Breeze' : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={params.temperature}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, temperature: Number(e.target.value) });
                    }}
                    className="w-full accent-rose-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Soft Glow Effect (Dreamy Bloom) */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Soft Glow (Dreamy Bloom)</span>
                    <span>{params.softGlow}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.softGlow}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, softGlow: Number(e.target.value) });
                    }}
                    className="w-full accent-purple-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Background Blur */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Background Blur (Depth of Field)</span>
                    <span>{params.bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={params.bgBlur}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, bgBlur: Number(e.target.value) });
                    }}
                    className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Vintage Sepia Effect */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Vintage Film Tone</span>
                    <span>{params.vintage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.vintage}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, vintage: Number(e.target.value) });
                    }}
                    className="w-full accent-amber-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Black & White Effect */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Black & White (Monochrome)</span>
                    <span>{params.blackWhite}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.blackWhite}
                    onChange={(e) => {
                      setActivePreset('Custom');
                      setParams({ ...params, blackWhite: Number(e.target.value) });
                    }}
                    className="w-full accent-gray-800 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Photo Metadata Footer */}
            <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between text-xs text-gray-500">
              <div>
                <p className="font-semibold text-gray-700">{selectedPhoto.title}</p>
                <p>{selectedPhoto.location || 'Curated portrait'}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 font-medium">
                {selectedPhoto.date || 'Special Memory'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
