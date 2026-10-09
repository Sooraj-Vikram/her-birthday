import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealisticBouquet from "./RealisticBouquet";
import confetti from "canvas-confetti";
import { sounds } from "../lib/soundEffects";

export default function BouquetView({ flowers, onSelectFlower, onBackToGarden }) {
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    // Joyful celebration burst when entering bouquet view
    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#E8B4B8", "#C9A86A", "#8A9B7E", "#FAF1E8", "#D9B8D4"],
      });
    } catch { }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Drifting golden dust */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold/50 pointer-events-none"
          style={{ left: `${(i * 29) % 100}%`, top: `${(i * 23) % 100}%` }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Top Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-4"
      >
        <span className="text-[11px] font-sans uppercase tracking-widest text-[#d8d0d2]/70">
          Your Bouquet is Complete
        </span>
        <h1 className="font-hand text-5xl sm:text-6xl text-[#d9c8d7] mt-1">
          Seven Memories. One Us.
        </h1>
        <p className="text-xs font-serif italic text-[#d1c7c5]/70 max-w-xs mx-auto mt-1">
          Every blossom you opened has joined together into a bouquet made only for you.
        </p>
      </motion.div>

      {/* The Assembled Unified 3D Sculpted Clay Bouquet Scene */}
      <div className="relative w-full max-w-[440px] h-[640px] flex items-center justify-center my-2 select-none">
        <RealisticBouquet
          opened={new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}
          allRegularOpen={true}
          onOpenFlower={(id) => onSelectFlower(id)}
        />
      </div>

      <p className="text-[11px] font-sans tracking-wide text-[#d1c7c5]/50 mt-1 mb-4">
        (tap any flower in the 3D bouquet to revisit its chapter)
      </p>

      {/* Keepsake Letter Envelope */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <button
          onClick={() => {
            sounds.playTap();
            setLetterOpen(!letterOpen);
          }}
          className="w-full bg-[#FAF5ED] border border-ink/10 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-blush/30 text-ink flex items-center justify-center text-lg">
              💌
            </span>
            <div>
              <p className="font-hand text-xl text-dusk leading-tight">A note for your birthday</p>
              <p className="text-xs text-ink/50 font-serif italic">
                {letterOpen ? "Tap to tuck away" : "Tap to open the letter"}
              </p>
            </div>
          </div>
          <span className="text-sage text-sm font-medium">
            {letterOpen ? "fold" : "read"}
          </span>
        </button>

        <AnimatePresence>
          {letterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="bg-[#FAF5ED] border border-ink/10 border-t-0 rounded-b-2xl p-5 shadow-inner mt-[-4px]">
                <p className="font-hand text-2xl text-ink/80 mb-2">My favorite person,</p>
                <p className="font-serif italic text-base leading-relaxed text-ink/85 space-y-3">
                  Thank you for filling every day with warmth, humor, and quiet magic.
                  These seven flowers hold just a small glimpse of everything you mean to me,
                  and a physical bouquet is waiting in your arms right now to remind you that you are loved beyond words.
                </p>
                <p className="font-serif italic text-base leading-relaxed text-ink/85 mt-3">
                  Here's to the unwritten chapters, the upcoming adventures, and all the memories
                  we haven't made yet.
                </p>
                <p className="font-hand text-2xl text-dusk text-right mt-4">
                  Always & forever, with all my love ❤️
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Switch to Garden Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            sounds.playTap();
            onBackToGarden();
          }}
          className="text-xs tracking-wider uppercase font-medium text-sage hover:text-[#FAF5ED]
                     border border-sage/40 rounded-full px-5 py-2 hover:bg-sage/10 transition-colors"
        >
          ← return to garden view
        </button>
      </div>
    </motion.div>
  );
}
