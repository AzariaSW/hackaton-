export class VoiceManager {
  constructor(locale = 'en', audioBase = null) {
    this.locale = locale;
    this.audioBase = audioBase ? audioBase.replace(/\/+$/, '') : null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.currentAudio = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.enabled = true;
    this.rate = 0.95;
    this.recognition = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.voices = [];
    this._highlightTimer = null;
  }

  async init() {
    if (this.synth) {
      await this.loadVoices();
    } else {
      this.enabled = Boolean(this.audioBase);
    }
    this.initSpeechRecognition();
  }

  async loadVoices() {
    if (!this.synth) return;
    this.voices = await new Promise((resolve) => {
      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      const timer = setTimeout(() => resolve(this.synth.getVoices()), 250);
      this.synth.onvoiceschanged = () => {
        clearTimeout(timer);
        resolve(this.synth.getVoices());
      };
    });
  }

  /**
   * Returns an exact language match only. Never uses an English voice to read Amharic.
   */
  getExactVoiceForLocale(lang = this.locale) {
    if (!this.voices || this.voices.length === 0) return null;
    const prefix = lang === 'am' ? 'am' : 'en';
    const matches = this.voices.filter((v) => v.lang?.toLowerCase().startsWith(prefix));
    if (matches.length === 0) return null;
    // Prefer local/natural voices when available
    return matches.find((v) => v.localService) || matches[0];
  }

  hasNativeVoiceForLocale(lang = this.locale) {
    return Boolean(this.getExactVoiceForLocale(lang));
  }

  hasSpeechRecognition() {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  hasVoiceNoteSupport() {
    return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
  }

  setRate(rate) {
    this.rate = Math.max(0.7, Math.min(1.4, Number(rate) || 0.95));
  }

  /**
   * 3-tier playback:
   * 1) Pre-recorded audio clip if audioBase + clipKey is configured and reachable
   * 2) Native speechSynthesis ONLY if a matching language voice is installed
   * 3) Graceful silent completion (never reads Amharic with an English voice)
   */
  async speak(text, { clipKey = null, onWord, onEnd, onNoNativeVoice, rate = this.rate, pitch = 1.0 } = {}) {
    if (!this.enabled || !text) {
      onEnd?.();
      return;
    }

    this.stop();

    if (this.audioBase && clipKey && typeof Audio !== 'undefined') {
      const played = await this._tryAudioClip(`${this.audioBase}/${this.locale}/${clipKey}.mp3`, text, { onWord, onEnd, rate });
      if (played) return;
    }

    const voice = this.getExactVoiceForLocale(this.locale);
    if (!this.synth || !voice) {
      onNoNativeVoice?.(this.locale);
      onEnd?.();
      return;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = this.locale === 'am' ? 'am-ET' : 'en-US';

      let gotNativeBoundary = false;
      const words = text.split(/\s+/).filter(Boolean);
      let fallbackIdx = 0;

      const clearTimers = () => {
        if (this._highlightTimer) {
          clearInterval(this._highlightTimer);
          this._highlightTimer = null;
        }
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        this.currentUtterance = utterance;
        onWord?.(0, words[0] || '');

        const msPerWord = Math.round(400 / Math.max(0.7, rate));
        this._highlightTimer = setInterval(() => {
          if (gotNativeBoundary || this.isPaused) return;
          fallbackIdx += 1;
          if (fallbackIdx < words.length) {
            onWord?.(fallbackIdx, words[fallbackIdx]);
          } else {
            clearTimers();
          }
        }, msPerWord);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          gotNativeBoundary = true;
          clearTimers();
          const prefix = text.slice(0, event.charIndex).trim();
          const idx = prefix ? prefix.split(/\s+/).length : 0;
          onWord?.(idx, words[idx] || '');
        }
      };

      const finish = () => {
        clearTimers();
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      this.synth.speak(utterance);
    });
  }

  _tryAudioClip(url, text, { onWord, onEnd, rate }) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.playbackRate = rate;
      const words = text.split(/\s+/).filter(Boolean);
      let idx = 0;

      const cleanup = () => {
        if (this._highlightTimer) {
          clearInterval(this._highlightTimer);
          this._highlightTimer = null;
        }
        this.currentAudio = null;
        this.isSpeaking = false;
      };

      audio.oncanplaythrough = () => {
        this.currentAudio = audio;
        this.isSpeaking = true;
        onWord?.(0, words[0] || '');
        const stepMs = audio.duration && words.length
          ? Math.max(180, Math.round((audio.duration * 1000) / words.length / rate))
          : 400;
        this._highlightTimer = setInterval(() => {
          idx += 1;
          if (idx < words.length) onWord?.(idx, words[idx]);
        }, stepMs);
        audio.play().catch(() => {
          cleanup();
          resolve(false);
        });
      };

      audio.onended = () => {
        cleanup();
        onEnd?.();
        resolve(true);
      };

      audio.onerror = () => {
        cleanup();
        resolve(false);
      };
    });
  }

  pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPaused = true;
      return;
    }
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play().catch(() => {});
      this.isPaused = false;
      return;
    }
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this._highlightTimer) {
      clearInterval(this._highlightTimer);
      this._highlightTimer = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 3;
  }

  startListening(locale = 'en-US') {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      this.recognition.lang = locale;
      this.recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        resolve(transcript);
      };
      this.recognition.onerror = (event) => reject(new Error(event.error || 'recognition_error'));
      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore if not active
      }
    }
  }

  async startVoiceNote() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    const donePromise = new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        const previewUrl = typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(blob) : null;
        resolve({
          mimeType: blob.type || 'audio/webm',
          sizeBytes: blob.size,
          recordedAt: new Date().toISOString(),
          previewUrl
        });
      };
    });

    this.mediaRecorder.start();
    return donePromise;
  }

  stopVoiceNote() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}
