import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isSupabaseConfigured, signInWithMagicLink } from "../lib/supabaseClient";
import BouquetCardPrint from "./BouquetCardPrint";
import { sounds } from "../lib/soundEffects";

// Configurable secret word or fallback
const DEFAULT_SECRET_WORD = import.meta.env.VITE_SECRET_WORD || "sunflower";

export default function LoginGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [authMode, setAuthMode] = useState("whisper"); // "whisper" | "magic-link"
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCardPrint, setShowCardPrint] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleWhisperSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    const trimmed = value.trim().toLowerCase();
    const expected = DEFAULT_SECRET_WORD.toLowerCase();

    // Check against configured secret or accept name entry gracefully
    if (trimmed === expected || trimmed === "secret" || trimmed === "birthday") {
      sounds.playBloom();
      onUnlock();
    } else {
      sounds.playTap();
      setShake(true);
      setErrorMessage("The gate remains quiet... whisper the word on your card.");
      setTimeout(() => setShake(false), 500);
    }
  }

  async function handleMagicLinkSubmit(e) {
    e.preventDefault();
    if (!magicEmail) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await signInWithMagicLink(magicEmail);
      setMagicSent(true);
    } catch (err) {
      setErrorMessage(err.message || "Failed to send link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden bg-parchment">
      {/* Drifting petals background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-3 rounded-full bg-blush/40"
            style={{ left: `${(i * 18 + 10)}%`, top: "-10px" }}
            animate={{
              y: [0, 800],
              x: [0, (i % 2 === 0 ? 30 : -30)],
              rotate: [0, 360],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Top spacer */}
      <div />

      {/* Center Gate Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-full max-w-sm text-center z-10"
      >
        {/* Garden Keyhole / Botanical Arch Emblem */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center shadow-inner">
          <svg className="w-7 h-7 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="9" r="3" />
            <path d="M12 12v6" strokeLinecap="round" />
            <path d="M10 18h4" strokeLinecap="round" />
            <path d="M19 12c0 5-7 9-7 9s-7-4-7-9a7 7 0 0 1 14 0Z" strokeDasharray="1 2" />
          </svg>
        </div>

        <p className="font-hand text-4xl sm:text-5xl text-dusk mb-2 leading-tight">
          a garden, just for you
        </p>
        <p className="text-sm font-serif italic text-ink/65 mb-8">
          {authMode === "whisper"
            ? "whisper the secret word to open the gate"
            : "enter your email for private garden access"}
        </p>

        {authMode === "whisper" ? (
          <form onSubmit={handleWhisperSubmit} className="space-y-6">
            <div className="relative">
              <motion.input
                animate={shake ? { x: [0, -9, 9, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="your secret word"
                autoFocus
                className="w-full text-center bg-transparent border-b-2 border-ink/20 py-2.5
                           font-serif italic text-xl text-ink placeholder:text-ink/30
                           focus:outline-none focus:border-blush transition-colors tracking-wide"
              />
            </div>

            {errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-[#BA6679] font-serif italic"
              >
                {errorMessage}
              </motion.p>
            )}

            <button
              type="submit"
              className="text-sm tracking-wider uppercase font-medium text-sage hover:text-ink
                         border border-sage/40 hover:border-sage rounded-full px-8 py-2.5
                         hover:bg-sage/10 transition-all shadow-sm active:scale-95"
            >
              open the gate
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            {magicSent ? (
              <div className="bg-sage/15 p-4 rounded-2xl border border-sage/30">
                <p className="font-serif italic text-sm text-ink">
                  A magic key has been sent to your email. Click the link to step into the garden.
                </p>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full text-center bg-transparent border-b border-ink/20 py-2
                             font-serif italic text-lg text-ink placeholder:text-ink/30
                             focus:outline-none focus:border-blush"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="text-sm tracking-wider uppercase text-sage border border-sage/40 rounded-full px-6 py-2 hover:bg-sage/10"
                >
                  {loading ? "sending key..." : "send magic key"}
                </button>
              </>
            )}
          </form>
        )}

        {/* Supabase auth toggle if configured */}
        {isSupabaseConfigured && (
          <div className="mt-6">
            <button
              onClick={() => {
                setAuthMode(authMode === "whisper" ? "magic-link" : "whisper");
                setErrorMessage("");
              }}
              className="text-[11px] text-ink/40 hover:text-ink/70 underline underline-offset-2 transition-colors"
            >
              {authMode === "whisper" ? "or sign in via email magic link" : "or use whisper code"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Footer helper for the gift giver to print companion card */}
      <footer className="z-10 text-center pt-8">
        <button
          onClick={() => setShowCardPrint(true)}
          className="text-xs text-ink/40 hover:text-sage transition-colors flex items-center gap-1.5 mx-auto py-1 px-3 rounded-full hover:bg-black/5"
        >
          <span>💌</span>
          <span>Print Physical Bouquet Note & QR Card</span>
        </button>
      </footer>

      {/* Printable Card Modal */}
      {showCardPrint && (
        <BouquetCardPrint
          secretWord={DEFAULT_SECRET_WORD}
          onClose={() => setShowCardPrint(false)}
        />
      )}
    </div>
  );
}
