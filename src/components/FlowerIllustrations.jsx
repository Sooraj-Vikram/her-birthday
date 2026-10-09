import React from "react";
import { motion } from "framer-motion";

/**
 * 3D Sculpted Botanical Rose Illustrations
 * Modeled after the 3D clay wrapped rose bouquet with thick concentric cabbage petals,
 * calyx sepals, volumetric rim lighting, and chapter-specific color themes.
 */

export const ROSE_THEMES = {
  seed: {
    key: "seed",
    name: "Sakura Rose",
    gradId: "grad-seed",
    rimColor: "#FFF2F4",
    strokeColor: "#D9828B",
    heartColor: "#8E2B3C",
    centerAccent: "#FFDDE2",
    hasGoldenAura: false,
  },
  "little-things": {
    key: "little-things",
    name: "Forget-Me-Not Rose",
    gradId: "grad-forgetmenot",
    rimColor: "#F2F7FF",
    strokeColor: "#587FB5",
    heartColor: "#224472",
    centerAccent: "#E1EEFF",
    hasGoldenAura: false,
  },
  "the-laugh": {
    key: "the-laugh",
    name: "Golden Buttercup Rose",
    gradId: "grad-poppy",
    rimColor: "#FFFEE8",
    strokeColor: "#D37D1E",
    heartColor: "#753802",
    centerAccent: "#FFF5C0",
    hasGoldenAura: false,
  },
  "the-adventure": {
    key: "the-adventure",
    name: "Wild Peony Rose",
    gradId: "grad-peony",
    rimColor: "#FFF0F4",
    strokeColor: "#B55369",
    heartColor: "#6B1A2A",
    centerAccent: "#FFDCE4",
    hasGoldenAura: false,
  },
  "the-storm": {
    key: "the-storm",
    name: "Rain Iris Rose",
    gradId: "grad-iris",
    rimColor: "#F4F5FC",
    strokeColor: "#4E569B",
    heartColor: "#202657",
    centerAccent: "#E5E7FC",
    hasDewdrops: true,
  },
  "who-you-are": {
    key: "who-you-are",
    name: "English Heritage Velvet Rose",
    gradId: "grad-rose",
    rimColor: "#FFF0F2",
    strokeColor: "#9B384A",
    heartColor: "#540C1B",
    centerAccent: "#FFDEE4",
    hasGoldenAura: false,
  },
  "whats-next": {
    key: "whats-next",
    name: "Golden Starlight Camellia Rose",
    gradId: "grad-gold",
    rimColor: "#FFFFEB",
    strokeColor: "#C99414",
    heartColor: "#613F02",
    centerAccent: "#FFFDE0",
    hasGoldenAura: true,
  },
};

/**
 * 3D Sculpted Rose Bud Base (Sepals and Calyx)
 */
function SculptedBudBase({ isLocked = false }) {
  return (
    <g className="sculpted-bud-base">
      {/* Stem base */}
      <path
        d="M 50 68 Q 50 84 52 96"
        stroke="url(#sculpted-stem-3d)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left calyx sepal hugging bud */}
      <path
        d="M 50 70 C 28 60 24 38 34 22 C 40 40 44 58 50 70 Z"
        fill="url(#sculpted-calyx-grad)"
        opacity={isLocked ? "0.6" : "0.95"}
        filter="url(#sculpted-petal-shadow)"
      />
      {/* Right calyx sepal hugging bud */}
      <path
        d="M 50 70 C 72 60 76 38 66 22 C 60 40 56 58 50 70 Z"
        fill="url(#sculpted-calyx-grad)"
        opacity={isLocked ? "0.6" : "0.95"}
        filter="url(#sculpted-petal-shadow)"
      />
      {/* Rear calyx sepal tip */}
      <path
        d="M 50 60 C 47 40 44 20 50 8 C 56 20 53 40 50 60 Z"
        fill="url(#sculpted-calyx-grad)"
        opacity={isLocked ? "0.5" : "0.85"}
      />
      {/* Center calyx receptacle */}
      <ellipse cx="50" cy="70" rx="10" ry="6" fill="url(#sculpted-calyx-grad)" />
    </g>
  );
}

/**
 * 3D Sculpted Rose Flower Component
 * Renders both the substantial tight bud state and the grand, lush, multi-layered 3D cabbage rose.
 */
export function SculptedRoseFlower({
  themeKey = "who-you-are",
  isOpen = false,
  isLocked = false,
  isFinal = false,
}) {
  const theme = ROSE_THEMES[themeKey] || ROSE_THEMES["who-you-are"];
  const filterGlow = isFinal && !isLocked ? "url(#golden-aura)" : "none";

  return (
    <g filter={filterGlow}>
      {!isOpen ? (
        /* ── Substantial Plump Sculpted Rose Bud ── */
        <g>
          <SculptedBudBase isLocked={isLocked} />

          {/* Central folded bud petals */}
          <motion.g
            animate={
              isLocked
                ? {}
                : {
                    scale: [1, 1.04, 1],
                  }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 50px" }}
          >
            {/* Outer large bud petal body */}
            <path
              d="M 50 16 C 30 30 26 56 50 70 C 74 56 70 30 50 16 Z"
              fill={isLocked ? "#7D7570" : `url(#${theme.gradId})`}
              stroke={isLocked ? "#544D48" : theme.strokeColor}
              strokeWidth="1.2"
              filter="url(#sculpted-petal-shadow)"
            />
            {/* Left overlapping bud cup fold */}
            <path
              d="M 32 44 C 36 28 46 22 56 26 C 48 38 42 54 50 68 C 36 60 30 50 32 44 Z"
              fill={isLocked ? "#8F8782" : `url(#${theme.gradId})`}
              stroke={isLocked ? "#635C57" : theme.strokeColor}
              strokeWidth="0.8"
            />
            {/* Right overlapping bud cup fold */}
            <path
              d="M 68 44 C 64 28 54 22 44 26 C 52 38 58 54 50 68 C 64 60 70 50 68 44 Z"
              fill={isLocked ? "#99918B" : `url(#${theme.gradId})`}
              stroke={isLocked ? "#635C57" : theme.strokeColor}
              strokeWidth="0.8"
            />
            {/* Bud spiral petal tip fold */}
            <path
              d="M 43 28 Q 50 20 57 28 Q 53 38 45 36"
              stroke={isLocked ? "#B3ABA5" : "#FFFFFF"}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            {/* Inner rose heart hint */}
            <circle
              cx="50"
              cy="28"
              r="4.5"
              fill={isLocked ? "#4A433F" : theme.heartColor}
              opacity="0.95"
            />
            {/* Delicate rolled highlight on outer bud rim */}
            <path
              d="M 36 34 C 42 22 58 22 64 34"
              stroke="url(#petal-rim-highlight)"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>
        </g>
      ) : (
        /* ── Fully Bloomed 3D Sculpted Cabbage Rose (Volumetric & Large) ── */
        <g>
          {/* Calyx sepals peeking underneath the bloom */}
          <g>
            {[0, 60, 120, 180, 240, 300].map((angle, k) => (
              <g key={`sepal-${k}`} transform={`rotate(${angle + 30} 50 50)`}>
                <motion.path
                  d="M 50 50 C 42 34 38 10 50 -1 C 62 10 58 34 50 50 Z"
                  fill="url(#sculpted-calyx-grad)"
                  stroke="#3E5832"
                  strokeWidth="0.6"
                  initial={{ scale: 0.3 }}
                  animate={{ scale: 1 }}
                  style={{ transformOrigin: "50px 50px" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </g>
            ))}
          </g>

          {/* ── Layer 1: Outermost Broad Cupped Petals (6 large petals fanned in full 360 circle) ── */}
          <g filter="url(#sculpted-petal-shadow)">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <g key={`out-${i}`} transform={`rotate(${angle} 50 50)`}>
                <motion.g
                  initial={{ scale: 0.15, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ transformOrigin: "50px 50px" }}
                  transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
                >
                  {/* Thick rounded broad petal body */}
                  <path
                    d="M 50 50 C 18 46 8 22 30 6 C 42 -3 58 -3 70 6 C 92 22 82 46 50 50 Z"
                    fill={`url(#${theme.gradId})`}
                    stroke={theme.strokeColor}
                    strokeWidth="0.8"
                    opacity="0.96"
                  />
                  {/* Volumetric rolled rim highlight */}
                  <path
                    d="M 30 6 C 42 -3 58 -3 70 6"
                    stroke="url(#petal-rim-highlight)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Inner petal crease shadow */}
                  <path
                    d="M 36 20 C 44 14 56 14 64 20"
                    stroke={theme.heartColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.45"
                  />
                </motion.g>
              </g>
            ))}
          </g>

          {/* ── Layer 2: Intermediate Concentric Cup Petals (6 petals offset by 30 deg) ── */}
          <g filter="url(#sculpted-petal-shadow)">
            {[30, 90, 150, 210, 270, 330].map((angle, j) => (
              <g key={`mid-${j}`} transform={`rotate(${angle} 50 50)`}>
                <motion.g
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ transformOrigin: "50px 50px" }}
                  transition={{ delay: 0.12 + j * 0.03, duration: 0.45, ease: "easeOut" }}
                >
                  {/* Mid petal body */}
                  <path
                    d="M 50 50 C 25 45 18 28 32 15 C 42 7 58 7 68 15 C 82 28 75 45 50 50 Z"
                    fill={`url(#${theme.gradId})`}
                    stroke={theme.strokeColor}
                    strokeWidth="0.7"
                    opacity="0.98"
                  />
                  {/* Mid petal rim highlight */}
                  <path
                    d="M 32 15 C 42 7 58 7 68 15"
                    stroke="url(#petal-rim-highlight)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Ambient shadow between petals */}
                  <path
                    d="M 38 27 C 45 22 55 22 62 27"
                    stroke={theme.heartColor}
                    strokeWidth="1"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </motion.g>
              </g>
            ))}
          </g>

          {/* ── Layer 3: Inner Rosette Petals (5 petals offset) ── */}
          <g filter="url(#sculpted-petal-shadow)">
            {[0, 72, 144, 216, 288].map((angle, k) => (
              <g key={`in-${k}`} transform={`rotate(${angle + 18} 50 50)`}>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ transformOrigin: "50px 50px" }}
                  transition={{ delay: 0.25 + k * 0.03, duration: 0.4 }}
                >
                  <path
                    d="M 50 50 C 32 46 26 34 38 23 C 45 17 55 17 62 23 C 74 34 68 46 50 50 Z"
                    fill={`url(#${theme.gradId})`}
                    stroke={theme.strokeColor}
                    strokeWidth="0.6"
                  />
                  <path
                    d="M 38 23 C 45 17 55 17 62 23"
                    stroke="url(#petal-rim-highlight)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.g>
              </g>
            ))}
          </g>

          {/* ── Layer 4: Central Interlocking Swirl Petals & Velvety Core ── */}
          <g filter="url(#sculpted-petal-shadow)">
            {/* Left curved overlapping swirl petal */}
            <motion.path
              d="M 50 50 C 34 46 28 32 40 24 C 48 18 60 20 64 30 C 66 40 56 48 50 50 Z"
              fill={`url(#${theme.gradId})`}
              stroke={theme.strokeColor}
              strokeWidth="0.7"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ transformOrigin: "50px 50px" }}
              transition={{ delay: 0.35, duration: 0.4 }}
            />
            <path
              d="M 40 24 C 48 18 60 20 64 30"
              stroke="url(#petal-rim-highlight)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right curved interlocking swirl petal */}
            <motion.path
              d="M 50 50 C 66 46 72 32 60 24 C 52 18 40 20 36 30 C 34 40 44 48 50 50 Z"
              fill={`url(#${theme.gradId})`}
              stroke={theme.strokeColor}
              strokeWidth="0.7"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ transformOrigin: "50px 50px" }}
              transition={{ delay: 0.4, duration: 0.4 }}
            />
            <path
              d="M 60 24 C 52 18 40 20 36 30"
              stroke="url(#petal-rim-highlight)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Center Rose Eye: Deep Velvety Heart */}
            <motion.ellipse
              cx="50"
              cy="44"
              rx="8.5"
              ry="7"
              fill={theme.heartColor}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ transformOrigin: "50px 50px" }}
              transition={{ delay: 0.45, duration: 0.35 }}
            />

            {/* Tight spiral swirl inside the rose eye */}
            <path
              d="M 45 43 Q 50 38 55 42 Q 54 48 48 47 Q 45 45 49 44"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <circle cx="50" cy="44" r="3" fill={theme.heartColor} />
          </g>

          {/* Optional Chapter Accents: Dewdrops for The Storm */}
          {theme.hasDewdrops && (
            <g>
              <circle cx="34" cy="20" r="2.2" fill="#FFFFFF" opacity="0.95" />
              <circle cx="34" cy="20" r="1.2" fill="#7D86CE" opacity="0.4" />
              <circle cx="66" cy="36" r="1.8" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}

          {/* Optional Chapter Accents: Radiating Golden Stardust for Centerpiece */}
          {isFinal && (
            <g>
              {Array.from({ length: 10 }).map((_, s) => {
                const angle = (s * 36 * Math.PI) / 180;
                const dist = 44;
                const sx = 50 + Math.cos(angle) * dist;
                const sy = 50 + Math.sin(angle) * dist;
                return (
                  <motion.circle
                    key={`star-${s}`}
                    cx={sx}
                    cy={sy}
                    r="2.2"
                    fill="#FFFEE8"
                    animate={{
                      scale: [0.8, 1.5, 0.8],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      delay: s * 0.12,
                      duration: 2.2,
                      repeat: Infinity,
                    }}
                  />
                );
              })}
            </g>
          )}
        </g>
      )}
    </g>
  );
}

// Backwards-compatible flower wrappers
export function SakuraFlower({ isOpen }) {
  return <SculptedRoseFlower themeKey="seed" isOpen={isOpen} />;
}
export function ForgetMeNotFlower({ isOpen }) {
  return <SculptedRoseFlower themeKey="little-things" isOpen={isOpen} />;
}
export function PoppyFlower({ isOpen }) {
  return <SculptedRoseFlower themeKey="the-laugh" isOpen={isOpen} />;
}
export function PeonyFlower({ isOpen }) {
  return <SculptedRoseFlower themeKey="the-adventure" isOpen={isOpen} />;
}
export function IrisFlower({ isOpen }) {
  return <SculptedRoseFlower themeKey="the-storm" isOpen={isOpen} />;
}
export function RoseFlower({ isOpen }) {
  return <SculptedRoseFlower themeKey="who-you-are" isOpen={isOpen} />;
}
export function GoldenCamelliaFlower({ isOpen, isLocked }) {
  return <SculptedRoseFlower themeKey="whats-next" isOpen={isOpen} isLocked={isLocked} isFinal={true} />;
}

// Master component dispatching the correct 3D botanical rose illustration
export default function FlowerIllustration({ flowerKey, isOpen, isLocked, isFinal }) {
  return (
    <SculptedRoseFlower
      themeKey={flowerKey}
      isOpen={isOpen}
      isLocked={isLocked}
      isFinal={isFinal}
    />
  );
}
