'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Image as ImageIcon,
  Sparkles,
  Star,
  BookOpen,
  Mail,
  PartyPopper,
  Volume2,
  VolumeX,
  Sliders,
  Menu,
  X,
} from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

interface NavbarProps {
  recipientName: string;
  onOpenSettings: () => void;
  activeSection: string;
}

export default function Navbar({
  recipientName,
  onOpenSettings,
  activeSection,
}: NavbarProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!audioManager) return;
    const unsubscribe = audioManager.subscribe((playing: boolean) => {
      setIsPlayingMusic(playing);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Heart },
    { id: 'gallery', label: 'Her Gallery', icon: ImageIcon },
    { id: 'cartoon', label: 'Cartoon World', icon: Sparkles },
    { id: 'wishes', label: 'Wishes & Joy', icon: Star },
    { id: 'memories', label: 'Memories', icon: BookOpen },
    { id: 'letter', label: 'Birthday Letter', icon: Mail },
    { id: 'celebration', label: 'Celebration', icon: PartyPopper },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleMusic = () => {
    if (audioManager) {
      audioManager.toggleMusic();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 backdrop-blur-xl bg-white/75 shadow-sm border-b border-pink-100/60'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Name */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-purple-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-gray-800 tracking-tight group-hover:text-pink-600 transition-colors">
                For {recipientName}
              </span>
              <span className="hidden sm:block text-[11px] font-sans text-pink-500 font-medium tracking-wider uppercase">
                A Special Surprise
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-100 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Music & Settings & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Music Player Button */}
            <button
              onClick={handleToggleMusic}
              title={isPlayingMusic ? 'Mute Background Music' : 'Play Gentle Birthday Melody'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm ${
                isPlayingMusic
                  ? 'bg-rose-500 text-white animate-pulse-soft shadow-rose-200'
                  : 'bg-white/80 hover:bg-white text-gray-700 border border-pink-200'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span className="hidden md:inline">Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-gray-500" />
                  <span className="hidden md:inline">Play Melody</span>
                </>
              )}
            </button>

            {/* Quick Settings / Customization */}
            <button
              onClick={onOpenSettings}
              title="Personalize Name & Messages"
              className="p-2 rounded-full bg-white/80 hover:bg-pink-50 text-gray-700 hover:text-pink-600 border border-pink-200 shadow-sm transition-all hover:scale-105"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/80 text-gray-700 border border-pink-200 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-pink-100 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
                >
                  <Icon className="w-4 h-4 text-pink-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
