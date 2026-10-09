import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sounds } from "../lib/soundEffects";

/**
 * Procedural ambient garden lullaby synthesizer using Web Audio API.
 * Plays a warm, meditative chord progression (Fmaj7 - Cmaj7 - Dm7 - Bbmaj7)
 * using soft sine/triangle tones with gentle breathing envelopes.
 * Completely self-contained — no external mp3 or network asset needed!
 */
class AmbientLullaby {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;

    // Peaceful garden arpeggios (in Hz)
    const chords = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [130.81, 196.0, 261.63, 329.63], // Cmaj7
      [146.83, 220.0, 261.63, 349.23], // Dm7
      [116.54, 174.61, 233.08, 293.66], // Bbmaj7
    ];

    let step = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[step % chords.length];
      const now = this.ctx.currentTime;

      currentChord.forEach((freq, noteIdx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + noteIdx * 0.45);

        // Very soft, dreamy envelope
        gain.gain.setValueAtTime(0.0001, now + noteIdx * 0.45);
        gain.gain.linearRampToValueAtTime(0.02, now + noteIdx * 0.45 + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + noteIdx * 0.45 + 4.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + noteIdx * 0.45);
        osc.stop(now + noteIdx * 0.45 + 4.5);
      });

      step++;
      this.timer = setTimeout(playChordStep, 4600);
    };

    playChordStep();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timer);
  }
}

const lullaby = new AmbientLullaby();

export default function AudioPlayer({ autoPrompt = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already made a music choice in this session
    const chosen = sessionStorage.getItem("garden_music_choice");
    if (!chosen && autoPrompt) {
      const timer = setTimeout(() => setShowPrompt(true), 1200);
      return () => clearTimeout(timer);
    } else if (chosen === "playing") {
      lullaby.start();
      setIsPlaying(true);
    }
  }, [autoPrompt]);

  const toggleMusic = () => {
    sounds.playTap();
    if (isPlaying) {
      lullaby.stop();
      setIsPlaying(false);
      sessionStorage.setItem("garden_music_choice", "paused");
    } else {
      lullaby.start();
      setIsPlaying(true);
      sessionStorage.setItem("garden_music_choice", "playing");
    }
  };

  const handleAcceptPrompt = () => {
    sounds.playTap();
    setShowPrompt(false);
    lullaby.start();
    setIsPlaying(true);
    sessionStorage.setItem("garden_music_choice", "playing");
  };

  const handleDeclinePrompt = () => {
    sounds.playTap();
    setShowPrompt(false);
    sessionStorage.setItem("garden_music_choice", "declined");
  };

  return (
    <>
      {/* Floating corner button */}
      <div className="fixed top-4 right-4 z-40">
        <motion.button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment/80 backdrop-blur-md border border-ink/10 shadow-sm text-ink/70 hover:text-ink transition-all text-xs font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Mute garden melody" : "Play garden melody"}
          title={isPlaying ? "Mute garden melody" : "Play garden melody"}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5 h-3 w-3">
              {[0.4, 0.8, 0.6].map((scale, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-sage rounded-full"
                  animate={{ height: ["4px", "12px", "4px"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <span className="text-ink/40">♫</span>
          )}
          <span className="text-[11px] hidden sm:inline">
            {isPlaying ? "melody on" : "melody off"}
          </span>
        </motion.button>
      </div>

      {/* Gentle Opt-In Prompt banner on first entry */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs bg-[#FAF5ED] border border-ink/10 rounded-2xl p-4 shadow-xl text-center"
          >
            <p className="font-hand text-xl text-dusk mb-1">would you like garden music?</p>
            <p className="text-xs text-ink/60 font-serif italic mb-3">
              A quiet, gentle melody to accompany your stroll.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleAcceptPrompt}
                className="text-xs bg-sage text-white px-4 py-1.5 rounded-full font-medium shadow-sm hover:bg-sage/90 transition-colors"
              >
                Yes, play ♫
              </button>
              <button
                onClick={handleDeclinePrompt}
                className="text-xs text-ink/60 hover:text-ink px-3 py-1.5 rounded-full transition-colors"
              >
                Keep it quiet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
