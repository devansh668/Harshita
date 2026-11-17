'use client';

import React, { useState, useEffect } from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';
import Navbar from '@/components/Navbar';
import LandingHero from '@/components/LandingHero';
import HerGallery from '@/components/HerGallery';
import CartoonGallery from '@/components/CartoonGallery';
import WishVaultSection from '@/components/WishVaultSection';
import MemoriesSection from '@/components/MemoriesSection';
import BirthdayLetter from '@/components/BirthdayLetter';
import BirthdayCelebration from '@/components/BirthdayCelebration';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import { BirthdayConfig } from '@/types';
import { getStoredConfig, DEFAULT_CONFIG } from '@/lib/birthdayData';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [config, setConfig] = useState<BirthdayConfig>(DEFAULT_CONFIG);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Load user-customized config from localStorage on mount
  useEffect(() => {
    setConfig(getStoredConfig());
  }, []);

  // Intersection observer to track active section for navbar
  useEffect(() => {
    const sectionIds = [
      'hero',
      'gallery',
      'cartoon',
      'wishes',
      'memories',
      'letter',
      'celebration',
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenSurprise = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      const galleryEl = document.getElementById('gallery');
      if (galleryEl) {
        galleryEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  };

  return (
    <main className="relative min-h-screen">
      {/* Floating Ambient Heart & Sparkle Canvas */}
      <ParticleCanvas />

      {/* Floating Navbar */}
      <Navbar
        recipientName={config.recipientName}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeSection={activeSection}
      />

      {/* 1. Landing Hero: Birthday Surprise */}
      <LandingHero
        recipientName={config.recipientName}
        nickname={config.nickname}
        heroMessage={config.heroMessage}
        onOpenSurprise={handleOpenSurprise}
        isUnlocked={isUnlocked}
      />

      {/* Unlocked Main Content with Smooth Transition */}
      <div
        className={`transition-opacity duration-1000 ${
          isUnlocked ? 'opacity-100' : 'opacity-90'
        }`}
      >
        {/* 2. Her Gallery & Photo Studio */}
        <HerGallery recipientName={config.recipientName} />

        {/* 3. AI Cartoon World Gallery */}
        <CartoonGallery recipientName={config.recipientName} />

        {/* 4. The Joy Jar & Sky Lantern Sanctuary */}
        <WishVaultSection recipientName={config.recipientName} />

        {/* 5. Scrapbook Memories Section */}
        <MemoriesSection recipientName={config.recipientName} />

        {/* 6. Special Handwritten Birthday Letter */}
        <BirthdayLetter
          config={config}
          onUpdateConfig={(newCfg) => setConfig(newCfg)}
        />

        {/* 7. Interactive Birthday Celebration (Candles, Confetti, Fireworks, Balloons) */}
        <BirthdayCelebration recipientName={config.recipientName} />

        {/* Footer */}
        <Footer recipientName={config.recipientName} />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={(newCfg) => setConfig(newCfg)}
      />
    </main>
  );
}
