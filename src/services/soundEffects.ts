// Web Audio API procedural sound engine for ambient harp chords and tactile wedding UI feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // Play sparkling celestial chime (wax seal break)
  public playWaxSealCrack() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Gentle parchment crackle
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(160, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // 2. Rising magical chime frequencies
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const noteOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const startTime = now + idx * 0.05;

      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

      noteOsc.connect(noteGain);
      noteGain.connect(ctx.destination);

      noteOsc.start(startTime);
      noteOsc.stop(startTime + 0.95);
    });
  }

  // Soft card reveal swoosh / harp strum
  public playCardSlide(pitchMultiplier = 1) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const arpeggio = [440, 554.37, 659.25, 880].map(f => f * pitchMultiplier);

    arpeggio.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  // Soft button click chime
  public playChime(freq = 880) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Procedural ambient fantasy harp generator
  public toggleBgm(forceState?: boolean): boolean {
    const target = forceState !== undefined ? forceState : !this.isBgmPlaying;
    if (target) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.isBgmPlaying;
  }

  private startBgm() {
    if (this.isBgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C Major
      [220.0, 261.63, 329.63, 440.0],  // A Minor
      [174.61, 220.0, 261.63, 349.23], // F Major
      [196.0, 246.94, 293.66, 392.0],  // G Major
    ];

    let chordIndex = 0;

    const playChordStep = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      const currentCtx = this.getContext();
      if (!currentCtx) return;

      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      const baseNow = currentCtx.currentTime;
      currentChord.forEach((f, i) => {
        const osc = currentCtx.createOscillator();
        const gain = currentCtx.createGain();
        const noteTime = baseNow + i * 0.45;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.04, noteTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.2);

        osc.connect(gain);
        gain.connect(currentCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 2.3);
      });
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, 3600);
  }

  private stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundEngine();
