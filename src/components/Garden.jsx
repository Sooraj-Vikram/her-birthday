import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flowers } from "../data/flowers";
import Flower from "./Flower";
import MemoryCard from "./MemoryCard";
import AudioPlayer from "./AudioPlayer";
import WatercolorPetalFilters from "./WatercolorPetalFilters";
import BouquetCardPrint from "./BouquetCardPrint";
import RealisticBouquet from "./RealisticBouquet";
import { sounds } from "../lib/soundEffects";
import confetti from "canvas-confetti";

export default function Garden() {
  const [opened, setOpened] = useState(new Set());
  const [activeCard, setActiveCard] = useState(null);
  const [justUnlockedFinal, setJustUnlockedFinal] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [showCardPrint, setShowCardPrint] = useState(false);

  const regular = flowers.filter((f) => !f.isFinal);
  const finalFlower = flowers.find((f) => f.isFinal);

  const allRegularOpen = regular.every((f) => opened.has(f.id));
  const allOpen = flowers.every((f) => opened.has(f.id));

  // Audio/visual celebration when flower 7 unlocks
  useEffect(() => {
    if (allRegularOpen && !opened.has(finalFlower?.id) && !justUnlockedFinal) {
      setJustUnlockedFinal(true);
      sounds.playBloom(true);
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#C9A86A", "#FCE48B", "#FFFFFF"],
        });
      } catch { }
    }
  }, [allRegularOpen, opened, finalFlower, justUnlockedFinal]);

  // When all 7 bloom, auto-unfold letter after short delay
  useEffect(() => {
    if (allOpen) {
      const timer = setTimeout(() => {
        setLetterOpen(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [allOpen]);

  function handleOpen(id) {
    setOpened((prev) => {
      const next = new Set(prev).add(id);
      return next;
    });
    const flower = flowers.find((f) => f.id === id);
    setActiveCard(flower);
  }

  // Get flower by key
  const getFlower = (key) => flowers.find((f) => f.key === key);

  const flowerSeed = getFlower("seed");
  const flowerLittleThings = getFlower("little-things");
  const flowerLaugh = getFlower("the-laugh");
  const flowerAdventure = getFlower("the-adventure");
  const flowerStorm = getFlower("the-storm");
  const flowerWhoYouAre = getFlower("who-you-are");
  const flowerWhatsNext = getFlower("whats-next");

  return (
    <div className="min-h-screen bg-[#060606] text-ink relative overflow-x-hidden selection:bg-blush/30 pb-16">
      {/* Global SVG Watercolor Filters & Gradients */}
      <WatercolorPetalFilters />

      {/* Floating Garden Melody Toggle */}
      <AudioPlayer autoPrompt={true} />

      {/* Ambient drifting pollen/petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: Math.max(6, opened.size * 2) }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: i % 2 === 0 ? "6px" : "4px",
              height: i % 2 === 0 ? "8px" : "4px",
              backgroundColor: i % 3 === 0 ? "#C9A86A" : "#E8B4B8",
              left: `${(i * 21 + 5) % 100}%`,
              bottom: "-10px",
              opacity: 0.35,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -900],
              x: [0, (i % 2 === 0 ? 35 : -35)],
              rotate: [0, 360],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 12 + (i % 5) * 2,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
        {/* Bouquet Header */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <span className="text-[10px] font-sans uppercase tracking-[0.38em] text-[#d8d0d2]/70">
            A Bouquet of Memories
          </span>
          <h1 className="font-hand text-5xl sm:text-6xl text-[#d9c8d7] mt-1 leading-none">
            Happy Birthday Thangaponne ❤️
          </h1>
          <p className="text-xs font-serif italic text-[#d1c7c5]/70 mt-2">
            {opened.size === 0
              ? "tap any blossom in your bouquet to bloom its memory"
              : opened.size < flowers.length - 1
                ? `${opened.size} of ${flowers.length} blossoms bloomed in your bouquet`
                : !opened.has(finalFlower?.id || 7)
                  ? "the central blossom is ready to awaken ✨"
                  : "your bouquet is in full, radiant bloom 💐"}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {flowers.map((f) => (
              <span
                key={f.id}
                className={`h-1.5 rounded-full transition-all duration-500 ${opened.has(f.id)
                    ? f.isFinal
                      ? "w-5 bg-gold"
                      : "w-3.5 bg-sage"
                    : "w-1.5 bg-ink/15"
                  }`}
              />
            ))}
          </div>
        </motion.div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* THE MAIN BOUQUET CANVAS                                  */}
        {/* ───────────────────────────────────────────────────────── */}
        {/* ───────────────────────────────────────────────────────── */}
        {/* THE MAIN 3D SCULPTED WRAPPED BOUQUET HERO SCENE           */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-[460px] h-[660px] my-2 select-none">
          <RealisticBouquet
            opened={opened}
            allRegularOpen={allRegularOpen}
            onOpenFlower={handleOpen}
          />
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* BELOW BOUQUET: INSTRUCTIONS OR CELEBRATORY LOVE LETTER    */}
        {/* ───────────────────────────────────────────────────────── */}

        {/* Climax prompt if 1-6 are done and 7 is ready */}
        {allRegularOpen && !opened.has(finalFlower?.id) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-3 px-4 py-2 rounded-full bg-gold/15 border border-gold/40 text-center"
          >
            <p className="font-hand text-xl text-gold font-bold">
              ✨ The central rose has unlocked in your bouquet!
            </p>
          </motion.div>
        )}

        {/* Keepsake Letter (unfolds when all 7 are bloomed) */}
        {allOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-sm my-4"
          >
            <button
              onClick={() => {
                sounds.playTap();
                setLetterOpen(!letterOpen);
              }}
              className="w-full bg-[#FAF5ED] border border-gold/30 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-gold/20 text-ink flex items-center justify-center text-xl shadow-xs">
                  💌
                </span>
                <div>
                  <p className="font-hand text-2xl text-dusk leading-tight">
                    a note tucked in your bouquet
                  </p>
                  <p className="text-xs text-ink/50 font-serif italic">
                    {letterOpen ? "tap to fold away" : "tap to open your letter"}
                  </p>
                </div>
              </div>
              <span className="text-sage text-sm font-medium pr-1">
                {letterOpen ? "close" : "open"}
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
                  <div className="bg-[#FAF5ED] border border-gold/20 border-t-0 rounded-b-2xl p-6 shadow-inner mt-[-4px]">
                    <p className="font-hand text-2xl text-ink/80 mb-2">My favorite person,</p>
                    <p className="font-serif italic text-base leading-relaxed text-ink/85 space-y-3">
                      Thank you for filling every single day with warmth, laughter, and quiet magic.
                      Each of these seven flowers holds just a small glimpse of everything you mean to me,
                      and the physical bouquet in your hands right now is there to remind you that you are loved beyond words.
                    </p>
                    <p className="font-serif italic text-base leading-relaxed text-ink/85 mt-3">
                      Here's to all the unwritten chapters, the upcoming adventures, and every memory
                      we haven't made yet.
                    </p>
                    <p className="font-hand text-2xl text-dusk text-right mt-5">
                      Always & forever, Happy Birthday ❤️
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <button
            onClick={() => setShowCardPrint(true)}
            className="text-xs text-ink/40 hover:text-sage transition-colors flex items-center gap-1.5 mx-auto py-1 px-3 rounded-full hover:bg-black/5"
          >
            <span>💌</span>
            <span>Print Physical Bouquet Companion Card</span>
          </button>
          <p className="text-[11px] font-sans text-ink/30">
            made with all my love
          </p>
        </div>
      </div>

      {/* Pop-up Memory Card for the active flower */}
      <AnimatePresence>
        {activeCard && (
          <MemoryCard
            flower={activeCard}
            onClose={() => setActiveCard(null)}
          />
        )}
      </AnimatePresence>

      {/* Printable Card Modal if clicked */}
      {showCardPrint && (
        <BouquetCardPrint
          secretWord={import.meta.env.VITE_SECRET_WORD || "sunflower"}
          onClose={() => setShowCardPrint(false)}
        />
      )}
    </div>
  );
}
