/**
 * Audio Manager using Web Audio API synthesis and optional HTMLAudioElement.
 * Zero external audio dependencies required for guaranteed playback,
 * plus support for custom MP3 uploads and sound effects.
 */

class BirthdayAudioManager {
  private audioCtx: AudioContext | null = null;
  private isPlayingMusic = false;
  private melodyInterval: any = null;
  private customAudio: HTMLAudioElement | null = null;
  private listeners: ((playing: boolean) => void)[] = [];

  private ensureAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlayingMusic));
  }

  public isPlaying(): boolean {
    return this.isPlayingMusic;
  }

  /**
   * Synthesize a gentle music box / celesta tone
   */
  private playNote(frequency: number, duration: number, timeOffset = 0, gainLevel = 0.12) {
    try {
      const ctx = this.ensureAudioContext();
      const startTime = ctx.currentTime + timeOffset;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft music box timbre: blend sine and soft triangle
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Play a peaceful, slow music box version of Happy Birthday
   */
  public playSynthesizedMelody() {
    this.stopSynthesizedMelody();
    const ctx = this.ensureAudioContext();

    // Notes frequencies (Hz) in C Major / G
    const notes: Record<string, number> = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25,
      F5: 698.46,
      G5: 783.99,
    };

    // Melody: [note, duration in seconds, delay from previous note]
    const melody: [string, number, number][] = [
      ['G4', 0.4, 0.0],
      ['G4', 0.3, 0.45],
      ['A4', 0.8, 0.85],
      ['G4', 0.8, 1.7],
      ['C5', 0.8, 2.55],
      ['B4', 1.4, 3.4],

      ['G4', 0.4, 5.0],
      ['G4', 0.3, 5.45],
      ['A4', 0.8, 5.85],
      ['G4', 0.8, 6.7],
      ['D5', 0.8, 7.55],
      ['C5', 1.4, 8.4],

      ['G4', 0.4, 10.0],
      ['G4', 0.3, 10.45],
      ['G5', 0.8, 10.85],
      ['E5', 0.8, 11.7],
      ['C5', 0.8, 12.55],
      ['B4', 0.8, 13.4],
      ['A4', 1.2, 14.25],

      ['F5', 0.4, 15.8],
      ['F5', 0.3, 16.25],
      ['E5', 0.8, 16.65],
      ['C5', 0.8, 17.5],
      ['D5', 0.8, 18.35],
      ['C5', 1.8, 19.2],
    ];

    const totalDuration = 22.0;

    const playSequence = () => {
      melody.forEach(([note, dur, delay]) => {
        const freq = notes[note];
        if (freq) {
          this.playNote(freq, dur, delay, 0.14);
          // Add gentle sub-harmonic bell warmth
          this.playNote(freq * 0.5, dur * 0.8, delay + 0.01, 0.04);
        }
      });
    };

    playSequence();
    this.melodyInterval = setInterval(() => {
      if (this.isPlayingMusic) {
        playSequence();
      }
    }, totalDuration * 1000);
  }

  public stopSynthesizedMelody() {
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
  }

  public toggleMusic() {
    if (this.isPlayingMusic) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
  }

  public startMusic() {
    this.isPlayingMusic = true;
    if (this.customAudio) {
      this.customAudio.play().catch(() => {
        this.playSynthesizedMelody();
      });
    } else {
      this.playSynthesizedMelody();
    }
    this.notify();
  }

  public pauseMusic() {
    this.isPlayingMusic = false;
    this.stopSynthesizedMelody();
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.notify();
  }

  public setCustomAudio(url: string) {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.customAudio = new Audio(url);
    this.customAudio.loop = true;
    if (this.isPlayingMusic) {
      this.stopSynthesizedMelody();
      this.customAudio.play().catch(console.warn);
    }
  }

  /**
   * Sound Effect: Blow out candle swoosh
   */
  public playCandleBlowSound() {
    try {
      const ctx = this.ensureAudioContext();
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Sound Effect: Celebration Chime Fanfare
   */
  public playCelebrationChimes() {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        this.playNote(freq, 0.9, idx * 0.12, 0.15);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Sound Effect: Magic sparkle ping
   */
  public playMagicSparkle() {
    try {
      const notes = [880, 1174.66, 1760];
      notes.forEach((freq, idx) => {
        this.playNote(freq, 0.4, idx * 0.08, 0.08);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export const audioManager = typeof window !== 'undefined' ? new BirthdayAudioManager() : (null as any);
