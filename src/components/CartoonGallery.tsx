'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Crown,
  PenTool,
  Palette,
  Sun,
  Smile,
  Camera,
  Download,
  Upload,
  Info,
  CheckCircle2,
  Columns,
  Split,
  Wand2,
  Sliders,
} from 'lucide-react';
import { TRANSFORMATION_STYLES, SAMPLE_GALLERY_PHOTOS } from '@/lib/birthdayData';
import { TransformationStyle, StyleOption, GalleryPhoto } from '@/types';
import { applyArtisticTransformation } from '@/lib/cartoonShader';
import { renderEnhancedPhoto, PRESET_FILTERS } from '@/lib/photoEnhancer';

interface CartoonGalleryProps {
  recipientName: string;
}

export default function CartoonGallery({ recipientName }: CartoonGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto>(SAMPLE_GALLERY_PHOTOS[0]);
  const [activeStyle, setActiveStyle] = useState<TransformationStyle>('manhwa-webtoon');
  const [transformedUrl, setTransformedUrl] = useState<string>('');
  const [enhancedUrl, setEnhancedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'trio'>('split');
  const [showApiInfo, setShowApiInfo] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 5);
  const [sharpness, setSharpness] = useState<number>(0.75);
  const [inkStrength, setInkStrength] = useState<number>(0.45);
  const [vibrance, setVibrance] = useState<number>(0.6);
  const [showTuning, setShowTuning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const convertedFileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute natural aspect ratio of the selected photo so container fits perfectly
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

  // Map icon names to Lucide icons
  const iconMap: Record<string, any> = {
    Sparkles,
    Heart,
    Crown,
    PenTool,
    Palette,
    Sun,
    Smile,
    Camera,
  };

  // Perform transformation whenever selectedPhoto, activeStyle, or tuning options change
  useEffect(() => {
    let isCurrent = true;
    const executeTransform = async () => {
      if (!selectedPhoto) return;
      setIsProcessing(true);
      try {
        // 1. If photo has a dedicated converted artwork and activeStyle is manhwa-webtoon, show authentic AI artwork!
        let cartoonResult = '';
        if (selectedPhoto.convertedUrl && activeStyle === 'manhwa-webtoon') {
          cartoonResult = selectedPhoto.convertedUrl;
        } else {
          cartoonResult = await applyArtisticTransformation(
            selectedPhoto.originalUrl,
            activeStyle,
            { sharpness, inkStrength, vibrance }
          );
        }

        // 2. Generate Pro Enhanced version
        const enhancedResult = await renderEnhancedPhoto(
          selectedPhoto.originalUrl,
          PRESET_FILTERS['Golden Hour']
        );

        if (isCurrent) {
          setTransformedUrl(cartoonResult);
          setEnhancedUrl(enhancedResult);
        }
      } catch (err) {
        console.error('Error generating transformation:', err);
      } finally {
        if (isCurrent) setIsProcessing(false);
      }
    };

    const timeout = setTimeout(executeTransform, 50);
    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [selectedPhoto, activeStyle, sharpness, inkStrength, vibrance]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const uploaded: GalleryPhoto = {
        id: 'uploaded-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: 'Custom photo uploaded for cartoon transformation',
        originalUrl: url,
        date: 'Custom Upload',
      };
      setSelectedPhoto(uploaded);
    };
    reader.readAsDataURL(file);
  };

  const handleConvertedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const updated = {
        ...selectedPhoto,
        convertedUrl: url,
      };
      setSelectedPhoto(updated);
      setTransformedUrl(url);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!transformedUrl) return;
    const link = document.createElement('a');
    link.href = transformedUrl;
    link.download = `${recipientName}-${activeStyle}-artwork.jpg`;
    link.click();
  };

  const currentStyleConfig =
    TRANSFORMATION_STYLES.find((s) => s.id === activeStyle) || TRANSFORMATION_STYLES[0];

  return (
    <section id="cartoon" className="py-20 px-4 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Identity-Preserving Artistic Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
            {recipientName} in the Cartoon Universe
          </h2>
          <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed">
            See {recipientName} transformed into Disney storybook art, vibrant anime, 3D Pixar character, watercolor painting, and elegant pencil sketches — all while keeping her authentic facial features, hairstyle, and smile!
          </p>
        </div>

        {/* Engine Transparency Notice Pill */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-purple-100 shadow-sm text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-800">Engine:</span>
              <span>Facial-Preserving Mathematical Canvas Shader</span>
            </div>
            <button
              onClick={() => setShowApiInfo(!showApiInfo)}
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showApiInfo ? 'Hide Details' : 'Cloud AI Info'}</span>
            </button>
          </div>

          {showApiInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3.5 rounded-xl bg-purple-50/90 border border-purple-200 text-xs text-purple-900 leading-relaxed"
            >
              <p className="font-semibold mb-1">Authentic Transformation Guarantee:</p>
              <p>
                Unlike basic templates that swap in stock photos of strangers, this transformation pipeline directly processes <strong>{recipientName}&apos;s actual pixels</strong>. Her contours, smile, eyes, and hair shape are mathematically preserved.
              </p>
              <p className="mt-1 text-purple-700">
                To connect an external cloud generative model (e.g. Replicate SDXL / InstantID), simply set <code className="bg-purple-200/70 px-1 py-0.5 rounded font-mono">REPLICATE_API_TOKEN</code> in <code className="bg-purple-200/70 px-1 py-0.5 rounded font-mono">.env.local</code>. The modular backend endpoint is fully wired at <code className="bg-purple-200/70 px-1 py-0.5 rounded font-mono">/api/ai-cartoon</code>.
              </p>
            </motion.div>
          )}
        </div>

        {/* Featured Showcase: Modern Anime / Manhwa Conversion (Requested Style) */}
        <div className="max-w-4xl mx-auto mb-10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-rose-500/10 rounded-3xl p-6 sm:p-8 border border-pink-200/80 backdrop-blur-md shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/placeholders/portrait-1.svg"
                alt="Modern Anime & Manhwa Illustration Style"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-pink-600/90 text-white text-[10px] font-bold">
                Target Style
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs uppercase tracking-wider mb-2">
                ✨ Featured: Modern Anime &amp; Manhwa Transformation
              </span>
              <h3 className="font-serif font-bold text-2xl text-gray-800 mb-2">
                Convert Her Real Photos Into This Anime Artwork
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                Upload any photograph of {recipientName} below. The engine transforms her photo into this exact aesthetic: clean inked outlines, smooth cel-shaded skin, stylized hair with rim light, and rich saturated colors!
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow hover:scale-105 active:scale-95 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>1. Upload Original Photo</span>
                </button>
                <button
                  onClick={() => convertedFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-rose-500 text-white text-xs font-bold shadow hover:scale-105 active:scale-95 transition-all"
                  title="Upload the AI-converted anime illustration for this photo"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>2. Upload Converted AI Artwork</span>
                </button>
                <input
                  type="file"
                  ref={convertedFileInputRef}
                  onChange={handleConvertedUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => setActiveStyle('manhwa-webtoon')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 text-xs font-semibold shadow-xs transition-all"
                >
                  Select &quot;Modern Anime&quot; Style
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Style Selector Grid (8 Styles) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-10">
          {TRANSFORMATION_STYLES.map((style) => {
            const Icon = iconMap[style.iconName] || Sparkles;
            const isActive = activeStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setActiveStyle(style.id)}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-b from-purple-500 to-pink-500 text-white shadow-md border-transparent scale-105'
                    : 'bg-white/80 hover:bg-white text-gray-700 border-pink-100 hover:border-pink-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight mb-1">{style.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/30 text-white' : 'bg-pink-100/80 text-pink-600'
                  }`}
                >
                  {style.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Style Header Tagline */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold text-pink-600 uppercase tracking-wider">
            Active Art Style:
          </span>{' '}
          <span className="font-serif font-bold text-gray-800 text-base">
            {currentStyleConfig.name}
          </span>
          <p className="text-xs text-gray-500 max-w-lg mx-auto mt-0.5">
            {currentStyleConfig.description}
          </p>
        </div>

        {/* View Mode Switcher (Split Slider vs Side-by-Side Trio) */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="inline-flex p-1 rounded-full bg-white/80 border border-pink-200 shadow-sm">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Interactive Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode('trio')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'trio'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Trio (Original, Enhanced, Cartoon)</span>
            </button>
          </div>
        </div>

        {/* Main Display Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass p-6 sm:p-8">
          {viewMode === 'split' ? (
            /* Split Comparison View */
            <div className="flex flex-col items-center">
              <div
                className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl select-none group border-2 border-white bg-slate-900/10 transition-all duration-300"
                style={{
                  aspectRatio: aspectRatio,
                  maxHeight: '68vh',
                }}
              >
                {/* Transformed Art Layer (Background) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={transformedUrl || selectedPhoto.originalUrl}
                  alt="Transformed Cartoon Artwork"
                  className={`absolute inset-0 w-full h-full ${
                    fitMode === 'contain' ? 'object-contain' : 'object-cover'
                  }`}
                />

                {/* Original Photo Layer (Exact 1:1 match in size and position, clipped cleanly via CSS clipPath) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto.originalUrl}
                  alt="Original Photo"
                  className={`absolute inset-0 w-full h-full pointer-events-none ${
                    fitMode === 'contain' ? 'object-contain' : 'object-cover'
                  }`}
                  style={{
                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  }}
                />

                {/* Vertical Divider Bar */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-purple-600 font-bold text-sm border-2 border-purple-200">
                    ↔
                  </div>
                </div>

                {/* Interactive Drag Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  aria-label="Before and after split slider"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                  Original Photograph
                </div>
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{currentStyleConfig.name}</span>
                </div>

                {/* Processing State */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold text-purple-700">
                      <div className="w-5 h-5 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span>Stylizing {recipientName}&apos;s Portrait...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Slider Instructions & Actions */}
              <div className="w-full max-w-xl mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span>Slide to reveal before and after</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 shadow-xs transition-all"
                    title={fitMode === 'contain' ? 'Switch to Fill Box' : 'Switch to Fit Entire Photo'}
                  >
                    {fitMode === 'contain' ? '🔍 Full Photo' : '📐 Fill Box'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Ultra-HD Clarity & Fine Tuning Bar */}
              <div className="w-full max-w-xl mt-5 p-4 rounded-2xl bg-white/70 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-gray-800">
                      Crystal Clarity &amp; Line Tuning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSharpness(0.75);
                        setInkStrength(0.45);
                        setVibrance(0.6);
                      }}
                      className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition-all flex items-center gap-1"
                      title="Set to Ultra-HD Clarity"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Ultra-HD Preset</span>
                    </button>
                    <button
                      onClick={() => setShowTuning(!showTuning)}
                      className="text-[11px] text-gray-500 hover:text-purple-600 font-medium"
                    >
                      {showTuning ? 'Hide Sliders' : 'Fine-Tune'}
                    </button>
                  </div>
                </div>

                {showTuning && (
                  <div className="space-y-3 pt-3 mt-2 border-t border-purple-100/60">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
                        <span>Sharpness &amp; Clarity</span>
                        <span>{Math.round(sharpness * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.2"
                        step="0.05"
                        value={sharpness}
                        onChange={(e) => setSharpness(Number(e.target.value))}
                        className="w-full accent-purple-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
                        <span>Inked Contour Strength</span>
                        <span>{Math.round(inkStrength * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.05"
                        value={inkStrength}
                        onChange={(e) => setInkStrength(Number(e.target.value))}
                        className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
                        <span>Color Vibrance &amp; Deep Blacks</span>
                        <span>{Math.round(vibrance * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={vibrance}
                        onChange={(e) => setVibrance(Number(e.target.value))}
                        className="w-full accent-rose-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Trio View: Original, Enhanced, Cartoon */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Original */}
                <div className="rounded-2xl overflow-hidden bg-white shadow-md border border-pink-100 flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedPhoto.originalUrl}
                      alt="Original Photograph"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                      1. Original Photograph
                    </span>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-semibold text-gray-700">Natural Portrait</p>
                    <p className="text-[11px] text-gray-500">Unfiltered authentic capture</p>
                  </div>
                </div>

                {/* 2. Enhanced */}
                <div className="rounded-2xl overflow-hidden bg-white shadow-md border border-pink-100 flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={enhancedUrl || selectedPhoto.originalUrl}
                      alt="Enhanced Photograph"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>2. Pro Enhanced</span>
                    </span>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-semibold text-gray-700">Studio Polish</p>
                    <p className="text-[11px] text-gray-500">Warm dynamic range & clarity</p>
                  </div>
                </div>

                {/* 3. Cartoon Transformation */}
                <div className="rounded-2xl overflow-hidden bg-white shadow-md border-2 border-purple-300 flex flex-col relative">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={transformedUrl || selectedPhoto.originalUrl}
                      alt="Cartoon Version"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3 text-yellow-200" />
                      <span>3. {currentStyleConfig.name}</span>
                    </span>
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center">
                        <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-purple-700">
                        {currentStyleConfig.name}
                      </p>
                      <p className="text-[11px] text-gray-500">Identity-preserving artwork</p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow hover:scale-105 active:scale-95 transition-all text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transformed Image ({currentStyleConfig.name})</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Photo Switcher Bar Below Gallery */}
          <div className="mt-8 pt-6 border-t border-pink-100/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Select Photo To Transform:
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Another Photo</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {SAMPLE_GALLERY_PHOTOS.map((photo) => {
                const isSelected = selectedPhoto.id === photo.id;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all ${
                      isSelected
                        ? 'ring-3 ring-purple-500 ring-offset-2 scale-105 shadow-md'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.originalUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
