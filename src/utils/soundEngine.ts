/**
 * Typlix Sound Engine
 * Procedural mechanical keyboard sound synthesis using Web Audio API.
 * Each profile uses layered oscillators, noise bursts, and envelope shaping
 * to create unique, realistic keystroke sounds — no audio files needed.
 */

import { secureStorage } from './secureStorage';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SoundProfileId =
  | 'cherry-mx-blue'
  | 'cherry-mx-red'
  | 'cherry-mx-brown'
  | 'creamy-thock'
  | 'typewriter';

export interface SoundProfileMeta {
  id: SoundProfileId;
  name: string;
  description: string;
  icon: string;
}

interface OscLayer {
  type: OscillatorType;
  freq: number;
  freqEnd?: number;
  gain: number;
  attack: number;
  decay: number;
  duration: number;
  detune?: number;
}

interface NoiseLayer {
  gain: number;
  attack: number;
  decay: number;
  duration: number;
  filterFreq: number;
  filterQ: number;
  filterType: BiquadFilterType;
}

interface SoundProfileConfig {
  keydown: {
    oscillators: OscLayer[];
    noise?: NoiseLayer;
  };
  error: {
    oscillators: OscLayer[];
    noise?: NoiseLayer;
  };
}

// ─── Profile Metadata ────────────────────────────────────────────────────────

export const SOUND_PROFILES: SoundProfileMeta[] = [
  {
    id: 'cherry-mx-blue',
    name: 'Cherry MX Blue',
    description: 'Clicky & tactile',
    icon: '🔵',
  },
  {
    id: 'cherry-mx-red',
    name: 'Cherry MX Red',
    description: 'Linear & smooth',
    icon: '🔴',
  },
  {
    id: 'cherry-mx-brown',
    name: 'Cherry MX Brown',
    description: 'Tactile bump',
    icon: '🟤',
  },
  {
    id: 'creamy-thock',
    name: 'Creamy Thock',
    description: 'Deep & satisfying',
    icon: '🧈',
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    description: 'Classic vintage',
    icon: '⌨️',
  },
];

// ─── Profile Synthesis Configs ───────────────────────────────────────────────

const PROFILE_CONFIGS: Record<SoundProfileId, SoundProfileConfig> = {
  'cherry-mx-blue': {
    keydown: {
      oscillators: [
        // Sharp click — high-pitched spike
        { type: 'square', freq: 4200, freqEnd: 1800, gain: 0.18, attack: 0.001, decay: 0.015, duration: 0.025 },
        // Body resonance
        { type: 'sine', freq: 1400, freqEnd: 600, gain: 0.12, attack: 0.001, decay: 0.025, duration: 0.04 },
        // Bottom-out thump
        { type: 'sine', freq: 180, freqEnd: 80, gain: 0.10, attack: 0.002, decay: 0.03, duration: 0.045 },
      ],
      noise: { gain: 0.08, attack: 0.001, decay: 0.02, duration: 0.03, filterFreq: 6000, filterQ: 1.5, filterType: 'bandpass' },
    },
    error: {
      oscillators: [
        { type: 'sawtooth', freq: 280, freqEnd: 150, gain: 0.12, attack: 0.002, decay: 0.06, duration: 0.08 },
        { type: 'sine', freq: 140, freqEnd: 80, gain: 0.08, attack: 0.003, decay: 0.08, duration: 0.10 },
      ],
      noise: { gain: 0.05, attack: 0.002, decay: 0.05, duration: 0.07, filterFreq: 800, filterQ: 2, filterType: 'lowpass' },
    },
  },

  'cherry-mx-red': {
    keydown: {
      oscillators: [
        // Soft linear bottom-out
        { type: 'sine', freq: 600, freqEnd: 200, gain: 0.10, attack: 0.003, decay: 0.025, duration: 0.035 },
        // Low body thud
        { type: 'sine', freq: 120, freqEnd: 60, gain: 0.12, attack: 0.002, decay: 0.04, duration: 0.05 },
      ],
      noise: { gain: 0.04, attack: 0.002, decay: 0.018, duration: 0.025, filterFreq: 3000, filterQ: 0.8, filterType: 'lowpass' },
    },
    error: {
      oscillators: [
        { type: 'triangle', freq: 220, freqEnd: 120, gain: 0.10, attack: 0.003, decay: 0.06, duration: 0.08 },
        { type: 'sine', freq: 100, freqEnd: 60, gain: 0.07, attack: 0.004, decay: 0.07, duration: 0.09 },
      ],
      noise: { gain: 0.03, attack: 0.003, decay: 0.04, duration: 0.06, filterFreq: 600, filterQ: 1.5, filterType: 'lowpass' },
    },
  },

  'cherry-mx-brown': {
    keydown: {
      oscillators: [
        // Tactile bump — mid-freq pulse
        { type: 'square', freq: 2800, freqEnd: 1200, gain: 0.10, attack: 0.001, decay: 0.012, duration: 0.02 },
        // Warm body
        { type: 'sine', freq: 800, freqEnd: 350, gain: 0.12, attack: 0.002, decay: 0.03, duration: 0.04 },
        // Subtle bottom-out
        { type: 'sine', freq: 150, freqEnd: 70, gain: 0.09, attack: 0.003, decay: 0.035, duration: 0.045 },
      ],
      noise: { gain: 0.05, attack: 0.001, decay: 0.015, duration: 0.025, filterFreq: 4500, filterQ: 1.2, filterType: 'bandpass' },
    },
    error: {
      oscillators: [
        { type: 'sawtooth', freq: 250, freqEnd: 140, gain: 0.10, attack: 0.002, decay: 0.06, duration: 0.08 },
        { type: 'sine', freq: 120, freqEnd: 70, gain: 0.07, attack: 0.003, decay: 0.07, duration: 0.09 },
      ],
      noise: { gain: 0.04, attack: 0.002, decay: 0.04, duration: 0.06, filterFreq: 700, filterQ: 1.8, filterType: 'lowpass' },
    },
  },

  'creamy-thock': {
    keydown: {
      oscillators: [
        // Deep thock — low and heavy
        { type: 'sine', freq: 250, freqEnd: 80, gain: 0.18, attack: 0.002, decay: 0.06, duration: 0.08 },
        // Body resonance — warm mid
        { type: 'sine', freq: 500, freqEnd: 180, gain: 0.10, attack: 0.003, decay: 0.05, duration: 0.07, detune: -15 },
        // Sub bass
        { type: 'sine', freq: 80, freqEnd: 40, gain: 0.14, attack: 0.003, decay: 0.07, duration: 0.09 },
      ],
      noise: { gain: 0.06, attack: 0.002, decay: 0.04, duration: 0.06, filterFreq: 1800, filterQ: 0.7, filterType: 'lowpass' },
    },
    error: {
      oscillators: [
        { type: 'triangle', freq: 200, freqEnd: 100, gain: 0.12, attack: 0.003, decay: 0.07, duration: 0.09 },
        { type: 'sine', freq: 80, freqEnd: 45, gain: 0.09, attack: 0.004, decay: 0.08, duration: 0.10 },
      ],
      noise: { gain: 0.04, attack: 0.003, decay: 0.05, duration: 0.07, filterFreq: 500, filterQ: 1, filterType: 'lowpass' },
    },
  },

  typewriter: {
    keydown: {
      oscillators: [
        // Metallic clack — bright and sharp
        { type: 'square', freq: 5500, freqEnd: 2200, gain: 0.12, attack: 0.0005, decay: 0.01, duration: 0.018 },
        // Hammer strike — percussive mid
        { type: 'sawtooth', freq: 1800, freqEnd: 600, gain: 0.10, attack: 0.001, decay: 0.02, duration: 0.03 },
        // Mechanical linkage rattle
        { type: 'square', freq: 3200, freqEnd: 1000, gain: 0.06, attack: 0.001, decay: 0.015, duration: 0.025, detune: 25 },
        // Platen thud
        { type: 'sine', freq: 200, freqEnd: 80, gain: 0.10, attack: 0.002, decay: 0.04, duration: 0.05 },
      ],
      noise: { gain: 0.10, attack: 0.0005, decay: 0.025, duration: 0.035, filterFreq: 8000, filterQ: 0.5, filterType: 'highpass' },
    },
    error: {
      oscillators: [
        { type: 'sawtooth', freq: 320, freqEnd: 160, gain: 0.10, attack: 0.002, decay: 0.05, duration: 0.07 },
        { type: 'sine', freq: 160, freqEnd: 90, gain: 0.07, attack: 0.003, decay: 0.06, duration: 0.08 },
      ],
      noise: { gain: 0.06, attack: 0.002, decay: 0.04, duration: 0.06, filterFreq: 900, filterQ: 1.5, filterType: 'lowpass' },
    },
  },
};

// ─── Sound Engine ────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getAudioContext(): { ctx: AudioContext; master: GainNode } | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return { ctx: audioCtx, master: masterGain! };
  } catch {
    return null;
  }
}

/**
 * Create a short noise burst via an AudioBuffer filled with random samples.
 */
function createNoiseSource(ctx: AudioContext, duration: number): AudioBufferSourceNode {
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

/**
 * Synthesize a keystroke sound based on the given profile config.
 * Uses layered oscillators + optional filtered noise burst.
 */
function synthesize(
  config: SoundProfileConfig['keydown'],
  volumeMultiplier: number
): void {
  const audio = getAudioContext();
  if (!audio) return;

  const { ctx, master } = audio;
  const now = ctx.currentTime;

  // Update master volume
  master.gain.setValueAtTime(volumeMultiplier, now);

  // Add slight random variation for realism
  const freqVariation = 1 + (Math.random() - 0.5) * 0.04; // ±2%
  const gainVariation = 1 + (Math.random() - 0.5) * 0.1;  // ±5%

  // --- Oscillator layers ---
  for (const layer of config.oscillators) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = layer.type;
    osc.frequency.setValueAtTime(layer.freq * freqVariation, now);
    if (layer.freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(layer.freqEnd * freqVariation, 20),
        now + layer.duration
      );
    }
    if (layer.detune) {
      osc.detune.setValueAtTime(layer.detune, now);
    }

    const peakGain = layer.gain * gainVariation;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + layer.attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + layer.attack + layer.decay);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + layer.duration + 0.01);
  }

  // --- Noise layer ---
  if (config.noise) {
    const nl = config.noise;
    const noise = createNoiseSource(ctx, nl.duration);
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseFilter.type = nl.filterType;
    noiseFilter.frequency.setValueAtTime(nl.filterFreq, now);
    noiseFilter.Q.setValueAtTime(nl.filterQ, now);

    const noisePeakGain = nl.gain * gainVariation;
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(noisePeakGain, now + nl.attack);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + nl.attack + nl.decay);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    noise.start(now);
    noise.stop(now + nl.duration + 0.01);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Play a keystroke sound using the user's selected profile and volume.
 * Reads settings from secureStorage for consistency with the Settings page.
 */
export function playKeystrokeSound(type: 'correct' | 'error'): void {
  if (typeof window === 'undefined') return;

  // Check if sound is enabled
  const soundEnabled = secureStorage.getItem<boolean>('sound', true);
  if (!soundEnabled) return;

  // Get user preferences
  const profileId = secureStorage.getItem<SoundProfileId>('soundProfile', 'cherry-mx-blue');
  const volume = secureStorage.getItem<number>('soundVolume', 70);

  const config = PROFILE_CONFIGS[profileId];
  if (!config) return;

  const volumeMultiplier = Math.max(0, Math.min(volume, 100)) / 100;
  if (volumeMultiplier <= 0) return;

  const soundConfig = type === 'correct' ? config.keydown : config.error;
  synthesize(soundConfig, volumeMultiplier);
}

/**
 * Play a preview sound for a specific profile (used in Settings UI).
 * Ignores the sound-enabled toggle so the user can always preview.
 */
export function previewProfileSound(profileId: SoundProfileId): void {
  if (typeof window === 'undefined') return;

  const config = PROFILE_CONFIGS[profileId];
  if (!config) return;

  const volume = secureStorage.getItem<number>('soundVolume', 70);
  const volumeMultiplier = Math.max(0, Math.min(volume, 100)) / 100;

  synthesize(config.keydown, Math.max(volumeMultiplier, 0.3)); // Minimum preview volume
}
