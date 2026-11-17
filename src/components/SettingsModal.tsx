'use client';

import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw, Sparkles, FolderOpen } from 'lucide-react';
import { BirthdayConfig } from '@/types';
import { DEFAULT_CONFIG, saveStoredConfig } from '@/lib/birthdayData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onUpdateConfig: (config: BirthdayConfig) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<BirthdayConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    saveStoredConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setFormData(DEFAULT_CONFIG);
    onUpdateConfig(DEFAULT_CONFIG);
    saveStoredConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-gray-800">
                Personalize This Surprise
              </h3>
              <p className="text-xs text-gray-500">
                Customize her name, messages, and dates in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Her Name *
              </label>
              <input
                type="text"
                required
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                placeholder="e.g. Harshita"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nickname / Complement
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                placeholder="e.g. Beautiful, Sunshine"
              />
            </div>
          </div>

          {/* Birthday Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Birthday Date
            </label>
            <input
              type="text"
              value={formData.birthdayDate}
              onChange={(e) =>
                setFormData({ ...formData, birthdayDate: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              placeholder="e.g. November 17"
            />
          </div>

          {/* Hero Opening Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Landing Page Hero Message
            </label>
            <textarea
              rows={3}
              value={formData.heroMessage}
              onChange={(e) =>
                setFormData({ ...formData, heroMessage: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white leading-relaxed resize-none"
            />
          </div>

          {/* Quick Helper on Photos */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 flex items-start gap-2.5">
            <FolderOpen className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Tip for Replacing All Photos:</p>
              <p className="text-[11px] text-purple-700">
                You can easily upload photos directly in the gallery and pet section, or replace files inside the <code className="bg-purple-200/60 px-1 py-0.5 rounded font-mono">public/images/friend/</code> folder!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-pink-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
