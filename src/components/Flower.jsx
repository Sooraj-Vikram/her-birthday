import React from "react";
import { motion } from "framer-motion";
import Real3DRose from "./Real3DRose";
import { sounds } from "../lib/soundEffects";
import confetti from "canvas-confetti";

export default function Flower({ flower, isOpen, isLocked, onOpen }) {
  function handleClick() {
    if (isLocked) return;

    if (!isOpen) {
      sounds.playBloom(flower.isFinal);

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([35, 45, 75]);
        } catch {}
      }

      if (flower.isFinal) {
        try {
          confetti({
            particleCount: 65,
            spread: 85,
            origin: { y: 0.6 },
            colors: ["#C9A86A", "#FCE48B", "#FFFFFF", "#E8B4B8"],
            ticks: 200,
          });
        } catch {}
      }

      onOpen(flower.id);
    } else {
      sounds.playTap();
      onOpen(flower.id);
    }
  }

  // Large volumetric flower heads matching reference bouquet photo
  const baseSize = flower.isFinal ? 138 : 118;

  return (
    <div className="relative flex flex-col items-center select-none group touch-manipulation">
      <div className="relative flex items-center justify-center">
        {/* Flower 7 ambient golden aura in the bouquet */}
        {flower.isFinal && !isLocked && (
          <motion.div
            className="absolute rounded-full pointer-events-none z-0"
            style={{
              width: baseSize + 48,
              height: baseSize + 48,
              background:
                "radial-gradient(circle, rgba(245, 217, 138, 0.5) 0%, rgba(201, 168, 106, 0.2) 50%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.75, 1, 0.75],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Bloomed delicate halo */}
        {isOpen && (
          <svg
            className="absolute pointer-events-none overflow-visible z-20"
            width={baseSize + 20}
            height={baseSize + 20}
            viewBox={`0 0 ${baseSize + 20} ${baseSize + 20}`}
          >
            <circle
              cx={(baseSize + 20) / 2}
              cy={(baseSize + 20) / 2}
              r={baseSize / 2 + 3}
              fill="none"
              stroke={
                flower.isFinal
                  ? "rgba(201, 168, 106, 0.45)"
                  : "rgba(138, 155, 126, 0.35)"
              }
              strokeWidth="1.2"
              strokeDasharray="2 4"
            />
          </svg>
        )}

        <motion.button
          onClick={handleClick}
          disabled={isLocked}
          aria-label={
            isOpen
              ? `${flower.title} — bloomed. Tap to view memory.`
              : isLocked
              ? `${flower.title} — locked.`
              : `Tap to bloom ${flower.title}`
          }
          className={`relative z-10 flex items-center justify-center rounded-full outline-none transition-transform ${
            isLocked
              ? "cursor-not-allowed opacity-40 grayscale"
              : "cursor-pointer"
          }`}
          style={{ width: baseSize, height: baseSize }}
          whileHover={!isLocked ? { scale: 1.08 } : {}}
          whileTap={!isLocked ? { scale: 0.94 } : {}}
        >
          {/* Real 3D WebGL Rose with Organic Petal Physics */}
          <Real3DRose
            flowerKey={flower.key}
            isOpen={isOpen}
            isLocked={isLocked}
            isFinal={flower.isFinal}
          />

          {/* Pulse dot hint on unbloomed buds */}
          {!isOpen && !isLocked && (
            <motion.span
              className="absolute bottom-2 w-2.5 h-2.5 rounded-full bg-blush shadow-sm ring-2 ring-white/50 pointer-events-none"
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>

      {/* Bouquet Pill Tag Label */}
      <div className="absolute -bottom-2.5 z-20 pointer-events-none text-center">
        <span
          className={`font-hand text-xs sm:text-sm leading-tight px-2.5 py-0.5 rounded-full shadow-sm border transition-all inline-block whitespace-nowrap ${
            isOpen
              ? flower.isFinal
                ? "text-gold font-bold bg-[#FAF5ED] border-gold/50 shadow-md"
                : "text-ink font-semibold bg-[#FAF5ED]/95 border-ink/15"
              : isLocked
              ? "text-ink/35 bg-[#FAF5ED]/70 border-transparent"
              : "text-ink/85 bg-[#FAF5ED]/95 border-ink/15"
          }`}
        >
          {flower.title}
        </span>
      </div>
    </div>
  );
}
