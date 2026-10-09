import { motion } from "framer-motion";
import MemoryContent from "./MemoryContent";
import { sounds } from "../lib/soundEffects";
import { flowers } from "../data/flowers";

export default function MemoryCard({ flower, onClose }) {
  const handleClose = () => {
    sounds.playTap();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-md px-4 pb-6 sm:pb-4 pt-12 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#FAF5ED] rounded-3xl shadow-2xl p-6 sm:p-7
                   border border-ink/10 overflow-hidden my-auto"
        style={{
          boxShadow: "0 20px 45px -10px rgba(61, 50, 38, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
        }}
      >
        {/* Subtle watercolor paper bleed background decoration */}
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-20 pointer-events-none blur-xl"
          style={{ backgroundColor: flower.bloomColor || "#E8B4B8" }}
        />

        {/* Top close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/60 flex items-center justify-center transition-colors"
          aria-label="Close memory card"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Chapter Header */}
        <div className="text-center mb-5 pr-4">
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-ink/40 mb-1">
            Chapter {flower.id} of {flowers.length} • {flower.botanicalName || "Blossom"}
          </p>
          <h2 className={`font-hand text-3xl sm:text-4xl ${flower.isFinal ? "text-gold" : "text-dusk"}`}>
            {flower.title}
          </h2>
          <p className="text-xs font-serif italic text-ink/50 mt-0.5">
            {flower.subtitle}
          </p>
        </div>

        {/* Dynamic Memory Content */}
        <div className="my-2">
          <MemoryContent memory={flower.memory} />
        </div>

        {/* Bottom Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
            className="text-xs tracking-wider uppercase font-medium text-sage hover:text-ink
                       border border-sage/40 hover:border-sage rounded-full px-6 py-2
                       bg-white/50 hover:bg-sage/10 transition-all shadow-sm"
          >
            return to garden
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
