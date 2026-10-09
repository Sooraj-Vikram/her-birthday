/**
 * RealisticBouquet.jsx — v5 · Illustrated Cartoon Bouquet
 *
 * Matches reference image:
 *  - Cartoon heart-petal roses (hot pink / crimson / light pink)
 *  - Pink folded-paper cone wrapper with crease lines
 *  - Red ribbon bow
 *  - Green stems + leaves
 *  - Bloom animation with delay before popup opens
 *  - 10 individually clickable flowers
 */

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sounds } from "../lib/soundEffects";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const VBW = 340;
const VBH = 500;
const CX  = 170; // horizontal center

// Bloom animation delay before the popup opens (ms)
const BLOOM_DELAY_MS = 650;

// Rose palette per ID — Coordinated Romantic Pastel Palette
// Blush pink: #F6B8CF, Soft rose pink: #EFA0BD, Dusty rose: #D98BAA
// Pale peach: #F7C9B5, Soft lavender: #D7C8EB, Light cream: #FFF1E8
// Sage green leaves: #9DBB91, Dark sage stems: #65845A, Muted rose outlines: #9D526F
const ROSE_PALETTE = {
  // 1: Soft rose pink dominant with darker inner petals and soft spiral centre
  1:  { outer: "#EFA0BD", inner: "#D98BAA", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
  // 2: Outer accent — pale peach with blush pink inner
  2:  { outer: "#F7C9B5", inner: "#F6B8CF", mid: "#EFA0BD", center: "#D98BAA", outline: "#9D526F" },
  // 3: Blush pink with soft rose pink inner
  3:  { outer: "#F6B8CF", inner: "#EFA0BD", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
  // 4: Blush pink with soft rose pink inner
  4:  { outer: "#F6B8CF", inner: "#EFA0BD", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
  // 5: Soft rose pink dominant with dusty rose inner
  5:  { outer: "#EFA0BD", inner: "#D98BAA", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
  // 6: Soft rose pink dominant
  6:  { outer: "#EFA0BD", inner: "#D98BAA", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
  // 7: CENTRE ROSE — EXACT SPECIFICATIONS:
  // Blush pink (#F6B8CF) for main petals, soft rose pink (#EFA0BD) for inner petals,
  // dusty rose (#D98BAA) for spiral and outlines. Slightly more prominent size.
  7:  { outer: "#F6B8CF", inner: "#EFA0BD", mid: "#D98BAA", center: "#D98BAA", outline: "#D98BAA" },
  // 8: Outer accent — soft lavender with blush pink inner
  8:  { outer: "#D7C8EB", inner: "#F6B8CF", mid: "#C9B8E3", center: "#B8A2D4", outline: "#9D526F" },
  // 9: Blush pink with soft rose pink inner
  9:  { outer: "#F6B8CF", inner: "#EFA0BD", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
  // 10: Blush pink with soft rose pink inner
  10: { outer: "#F6B8CF", inner: "#EFA0BD", mid: "#D98BAA", center: "#C87595", outline: "#9D526F" },
};

// ─────────────────────────────────────────────────────────────
// BOUQUET LAYOUT — 10 flowers in cluster, back→front order
// ─────────────────────────────────────────────────────────────
// layer: 0=back 1=mid 2=front

const LAYOUT = [
  // Back row — 4 roses
  { id: 8,  cx:  60, cy:  84, rot: -22, r: 32, layer: 0 },
  { id: 4,  cx: 125, cy:  55, rot: -10, r: 34, layer: 0 },
  { id: 1,  cx: 210, cy:  55, rot:   8, r: 34, layer: 0 },
  { id: 2,  cx: 278, cy:  84, rot:  20, r: 32, layer: 0 },
  // Mid row — 3 roses
  { id: 9,  cx:  95, cy: 130, rot: -30, r: 36, layer: 1 },
  { id: 6,  cx: 170, cy: 110, rot:   0, r: 38, layer: 1 },
  { id: 3,  cx: 245, cy: 130, rot:  28, r: 36, layer: 1 },
  // Front flanks — 2 roses
  { id: 5,  cx: 122, cy: 172, rot: -18, r: 37, layer: 1 },
  { id: 10, cx: 218, cy: 172, rot:  16, r: 37, layer: 1 },
  // Finale — centrepiece (slightly more prominent size)
  { id: 7,  cx: 170, cy: 214, rot:   2, r: 44, layer: 2, isFinal: true },
];

// ─────────────────────────────────────────────────────────────
// CARTOON ROSE — one SVG group, centred at (0,0)
// r ≈ 1 unit. Actual scale applied via transform.
// ─────────────────────────────────────────────────────────────

function CartoonRose({ pal, isOpen, bloomProgress = 1 }) {
  // bloomProgress 0→1 is used during the bloom animation
  const scale = isOpen ? 1 : 0.7 + bloomProgress * 0.3;

  if (!isOpen) {
    // ── BUD ──
    return (
      <g>
        {/* Sepal base — sage green */}
        <ellipse cx="0" cy="8" rx="14" ry="7" fill="#9DBB91" stroke="#65845A" strokeWidth="1.5" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <path key={i}
            d={`M 0 8 C ${Math.cos((a * Math.PI) / 180) * 12} ${8 + Math.sin((a * Math.PI) / 180) * 12}
               ${Math.cos((a * Math.PI) / 180) * 8} ${8 + Math.sin((a * Math.PI) / 180) * 20} 0 8`}
            fill="#9DBB91" stroke="#65845A" strokeWidth="0.8" />
        ))}

        {/* Outer guard petals */}
        {[-24, 4, 30].map((rot, i) => (
          <path key={i}
            d="M 0 5 C -14 0 -16 -22 -10 -40 C -5 -54 0 -58 0 -58 C 0 -58 5 -54 10 -40 C 16 -22 14 0 0 5 Z"
            fill={pal.outer}
            stroke={pal.outline} strokeWidth="1.8"
            transform={`rotate(${rot}) scale(0.50, 0.60)`}
            style={{ transformOrigin: "0px 0px" }} />
        ))}

        {/* Inner petals starting to show */}
        {[-14, 18].map((rot, i) => (
          <path key={i}
            d="M 0 4 C -10 0 -12 -18 -7 -32 C -3 -42 0 -46 0 -46 C 0 -46 3 -42 7 -32 C 12 -18 10 0 0 4 Z"
            fill={pal.inner}
            stroke={pal.outline} strokeWidth="1.4"
            transform={`rotate(${rot}) scale(0.45, 0.55)`}
            style={{ transformOrigin: "0px 0px" }} />
        ))}

        {/* Bud tip */}
        <ellipse cx="0" cy="-15" rx="6" ry="10" fill={pal.center}
          transform="scale(0.46, 0.52)" style={{ transformOrigin: "0px 0px" }} />
      </g>
    );
  }

  // ── FULL BLOOM — cartoon style matching reference ──
  return (
    <g>
      {/* ─── LEFT side petal (behind main body) ─── */}
      <path
        d="M -28 -12 C -54 -24 -58 -8 -50 8 C -44 20 -28 18 -22 12 Z"
        fill={pal.outer} stroke={pal.outline} strokeWidth="2" />

      {/* ─── RIGHT side petal ─── */}
      <path
        d="M 28 -12 C 54 -24 58 -8 50 8 C 44 20 28 18 22 12 Z"
        fill={pal.outer} stroke={pal.outline} strokeWidth="2" />

      {/* ─── BOTTOM petal ─── */}
      <path
        d="M -18 12 C -22 28 -12 38 0 38 C 12 38 22 28 18 12 Z"
        fill={pal.outer} stroke={pal.outline} strokeWidth="2" />

      {/* ─── MAIN BODY (heart-petal silhouette) ─── */}
      <path
        d="M 0 -36
           C 9 -52 36 -52 36 -28
           C 36 -10 18 6 0 20
           C -18 6 -36 -10 -36 -28
           C -36 -52 -9 -52 0 -36 Z"
        fill={pal.outer} stroke={pal.outline} strokeWidth="2.5" />

      {/* ─── INNER LIGHTER PETAL LAYER ─── */}
      <path
        d="M 0 -24
           C 6 -36 24 -36 24 -20
           C 24 -8 12 4 0 14
           C -12 4 -24 -8 -24 -20
           C -24 -36 -6 -36 0 -24 Z"
        fill={pal.inner} stroke={pal.outline} strokeWidth="1.8" />

      {/* ─── PETAL DETAIL LINES on outer body ─── */}
      <path d="M -36 -28 Q -18 -4 -22 12" fill="none" stroke={pal.outline} strokeWidth="1.0" strokeOpacity="0.50" strokeLinecap="round" />
      <path d="M 36 -28 Q 18 -4 22 12"   fill="none" stroke={pal.outline} strokeWidth="1.0" strokeOpacity="0.50" strokeLinecap="round" />
      <path d="M 0 -36 Q 4 -12 0 20"     fill="none" stroke={pal.outline} strokeWidth="0.8" strokeOpacity="0.35" strokeLinecap="round" />

      {/* ─── CENTER SPIRAL ─── */}
      {/* Spiral base circle */}
      <circle cx="0" cy="-8" r="13" fill={pal.mid} stroke={pal.outline} strokeWidth="1.6" />
      {/* Spiral lines */}
      <path
        d="M 0 -8 C 6 -16 14 -12 12 -4 C 10 4 2 6 -2 2 C -6 -2 -4 -10 2 -12"
        fill="none" stroke={pal.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M 2 -12 C 6 -14 10 -11 9 -6"
        fill="none" stroke={pal.outline} strokeWidth="1.4" strokeLinecap="round" />
      {/* Inner dot */}
      <circle cx="1" cy="-7" r="3.5" fill={pal.center} stroke={pal.outline} strokeWidth="1.2" />

      {/* ─── SOFT CREAM HIGHLIGHT on upper-left ─── */}
      <ellipse cx="-12" cy="-28" rx="6" ry="4" fill="#FFF1E8" opacity="0.38" transform="rotate(-30, -12, -28)" />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// WRAPPER — pink folded-paper cone matching reference image
// ─────────────────────────────────────────────────────────────

function PaperConeWrapper() {
  // Cone vertices (wide at top, narrows to near-point at bottom)
  const topY  = 242;
  const botY  = 490;
  const topL  =  16; // left x at top
  const topR  = 324; // right x at top
  const botCx = 170; // centre x at bottom

  // The cone has 3 "panels" visible: left/centre/right, separated by fold lines
  // Panel division points at top edge
  const foldLx = 90;  // left fold x at top
  const foldRx = 250; // right fold x at top

  // Fold convergence — where fold lines meet at bottom area
  const foldBotL = { x: 142, y: 452 };
  const foldBotR = { x: 198, y: 452 };
  const botPoint = { x: botCx, y: botY };

  // Computed edge points
  const botL = { x: botCx - 20, y: botY - 8 };
  const botR = { x: botCx + 20, y: botY - 8 };

  return (
    <g>
      {/* ── CENTRE PANEL (light cream, front face) ── */}
      <polygon
        points={`${foldLx},${topY} ${foldRx},${topY} ${foldBotR.x},${foldBotR.y} ${botPoint.x},${botPoint.y} ${foldBotL.x},${foldBotL.y}`}
        fill="#FFF1E8"
        stroke="#D98BAA"
        strokeWidth="1.5"
      />

      {/* ── LEFT PANEL (pale blush pink) ── */}
      <polygon
        points={`${topL},${topY} ${foldLx},${topY} ${foldBotL.x},${foldBotL.y} ${botPoint.x},${botPoint.y} ${botL.x},${botL.y}`}
        fill="#FDECF3"
        stroke="#D98BAA"
        strokeWidth="1.5"
      />

      {/* ── RIGHT PANEL (pale blush pink) ── */}
      <polygon
        points={`${foldRx},${topY} ${topR},${topY} ${botR.x},${botR.y} ${botPoint.x},${botPoint.y} ${foldBotR.x},${foldBotR.y}`}
        fill="#FDECF3"
        stroke="#D98BAA"
        strokeWidth="1.5"
      />

      {/* ── FOLD CREASE — LEFT ── */}
      <line x1={foldLx} y1={topY} x2={foldBotL.x} y2={foldBotL.y}
        stroke="#D98BAA" strokeWidth="1.6" strokeLinecap="round" />
      <line x1={foldBotL.x} y1={foldBotL.y} x2={botPoint.x} y2={botPoint.y}
        stroke="#D98BAA" strokeWidth="1.3" strokeLinecap="round" />

      {/* ── FOLD CREASE — RIGHT ── */}
      <line x1={foldRx} y1={topY} x2={foldBotR.x} y2={foldBotR.y}
        stroke="#D98BAA" strokeWidth="1.6" strokeLinecap="round" />
      <line x1={foldBotR.x} y1={foldBotR.y} x2={botPoint.x} y2={botPoint.y}
        stroke="#D98BAA" strokeWidth="1.3" strokeLinecap="round" />

      {/* ── OUTER EDGE OUTLINES ── */}
      <line x1={topL} y1={topY} x2={botL.x} y2={botL.y}
        stroke="#D98BAA" strokeWidth="1.8" strokeLinecap="round" />
      <line x1={topR} y1={topY} x2={botR.x} y2={botR.y}
        stroke="#D98BAA" strokeWidth="1.8" strokeLinecap="round" />
      <line x1={botL.x} y1={botL.y} x2={botPoint.x} y2={botPoint.y}
        stroke="#D98BAA" strokeWidth="1.8" strokeLinecap="round" />
      <line x1={botR.x} y1={botR.y} x2={botPoint.x} y2={botPoint.y}
        stroke="#D98BAA" strokeWidth="1.8" strokeLinecap="round" />

      {/* ── TOP EDGE (behind roses) ── */}
      <line x1={topL} y1={topY} x2={topR} y2={topY}
        stroke="#D98BAA" strokeWidth="1.8" />

      {/* ── SUBTLE HORIZONTAL SHADING BANDS ── */}
      {[0.25, 0.50, 0.72].map((t, i) => {
        const y = topY + (botY - topY) * t;
        const lx = topL + (botCx - 20 - topL) * t;
        const rx = topR - (topR - botCx - 20) * t;
        return (
          <line key={i} x1={lx} y1={y} x2={rx} y2={y}
            stroke="#D98BAA" strokeWidth="0.8" strokeOpacity="0.32" />
        );
      })}

      {/* ── RIBBON BAND (dusty rose with muted outline) ── */}
      <rect x="124" y="386" width="92" height="18" rx="4"
        fill="#D98BAA" stroke="#9D526F" strokeWidth="1.4" />
      {/* Soft pastel highlight on ribbon */}
      <rect x="124" y="386" width="92" height="6" rx="4"
        fill="#F6B8CF" opacity="0.55" />

      {/* ── BOW ── */}
      {/* Left loop */}
      <path
        d="M 170 395 C 155 382 132 378 134 390 C 136 402 158 403 170 395 Z"
        fill="#D98BAA" stroke="#9D526F" strokeWidth="1.4" />
      <path
        d="M 170 395 C 155 382 132 378 134 390 C 136 402 158 403 170 395 Z"
        fill="#F6B8CF" opacity="0.35" />
      {/* Right loop */}
      <path
        d="M 170 395 C 185 382 208 378 206 390 C 204 402 182 403 170 395 Z"
        fill="#D98BAA" stroke="#9D526F" strokeWidth="1.4" />
      <path
        d="M 170 395 C 185 382 208 378 206 390 C 204 402 182 403 170 395 Z"
        fill="#F6B8CF" opacity="0.35" />
      {/* Bow knot */}
      <ellipse cx="170" cy="395" rx="9" ry="7"
        fill="#C47595" stroke="#9D526F" strokeWidth="1.4" />
      {/* Ribbon tails */}
      <path d="M 165 400 Q 152 416 148 432"
        fill="none" stroke="#D98BAA" strokeWidth="6" strokeLinecap="round" />
      <path d="M 175 400 Q 188 418 192 434"
        fill="none" stroke="#D98BAA" strokeWidth="6" strokeLinecap="round" />
      {/* Tail outlines */}
      <path d="M 165 400 Q 152 416 148 432"
        fill="none" stroke="#9D526F" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 175 400 Q 188 418 192 434"
        fill="none" stroke="#9D526F" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// STEMS — thin green lines from each rose to the wrapper
// ─────────────────────────────────────────────────────────────

function BouquetStems() {
  const gatherX = 170;
  const gatherY = 250;

  // Slight variation in stem curves per flower
  const STEM_OFFSETS = {
    8:  [-14, 0.35], 4:  [-6, 0.28], 1:  [5, 0.28],  2:  [14, 0.35],
    9:  [-8, 0.30],  6:  [0, 0.22],  3:  [8, 0.30],
    5:  [-5, 0.26],  10: [5, 0.26],  7:  [0, 0.18],
  };

  return (
    <g>
      {LAYOUT.map(cfg => {
        const [cpOff, cpFrac] = STEM_OFFSETS[cfg.id] || [0, 0.25];
        const topX = cfg.cx;
        const topY = cfg.cy + cfg.r * 0.85;
        const dy   = gatherY - topY;
        const cp1x = topX + cpOff;
        const cp1y = topY + dy * cpFrac;
        const cp2x = gatherX + cpOff * 0.3;
        const cp2y = gatherY - dy * 0.15;
        return (
          <React.Fragment key={cfg.id}>
            <path
              d={`M ${topX} ${topY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${gatherX} ${gatherY}`}
              fill="none" stroke="#65845A" strokeWidth="2.8" strokeLinecap="round"
            />
            {/* Subtle sage highlight on stem */}
            <path
              d={`M ${topX - 0.4} ${topY} C ${cp1x - 0.8} ${cp1y} ${cp2x - 0.4} ${cp2y} ${gatherX - 0.4} ${gatherY}`}
              fill="none" stroke="#9DBB91" strokeWidth="1.0" strokeOpacity="0.55" strokeLinecap="round"
            />
          </React.Fragment>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// LEAVES — sage green leaves #9DBB91 with dark sage #65845A veins
// ─────────────────────────────────────────────────────────────

function BouquetLeaves() {
  const LEAF = "M 0 -28 C 14 -26 20 -12 18 0 C 16 10 8 16 0 18 C -8 16 -16 10 -18 0 C -20 -12 -14 -26 0 -28 Z";
  const VEIN = "M 0 -24 Q 4 -6 0 16";
  const leaves = [
    { cx:  82, cy: 222, rot: -58, sx: 1.10, sy: 1.28 },
    { cx: 258, cy: 224, rot:  60, sx: 1.08, sy: 1.24 },
    { cx: 118, cy: 246, rot: -30, sx: 0.90, sy: 1.05 },
    { cx: 222, cy: 248, rot:  32, sx: 0.88, sy: 1.02 },
    { cx:  56, cy: 268, rot: -72, sx: 0.78, sy: 0.92 },
    { cx: 284, cy: 270, rot:  74, sx: 0.76, sy: 0.90 },
  ];
  return (
    <g>
      {leaves.map((lf, i) => (
        <g key={i} transform={`translate(${lf.cx},${lf.cy}) rotate(${lf.rot}) scale(${lf.sx},${lf.sy})`}>
          <path d={LEAF} fill="#9DBB91" stroke="#65845A" strokeWidth="1.5" />
          <path d={VEIN} fill="none" stroke="#65845A" strokeWidth="1.0" strokeOpacity="0.60" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// INTERACTIVE FLOWER — handles click + bloom delay
// ─────────────────────────────────────────────────────────────

function InteractiveFlower({ config, opened, allRegularOpen, onOpen }) {
  const { id, cx, cy, rot, r, layer, isFinal } = config;

  const [blooming, setBlooming] = useState(false); // mid-bloom animation
  const [bloomProgress, setBloomProgress] = useState(0);

  const [shake, setShake] = useState(false);

  const isOpen   = opened.has(id);
  const isLocked = isFinal && !allRegularOpen && !isOpen;

  const pal = ROSE_PALETTE[id] || ROSE_PALETTE[1];

  const layerScale = layer === 0 ? 0.84 : layer === 1 ? 0.92 : 1.0;
  const finalScale = r / 38 * layerScale;

  // Depth-based desaturation for back-layer flowers
  const depthFilter = layer === 0 ? "brightness(0.88) saturate(0.90)" : undefined;

  function handleClick() {
    if (isLocked) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      sounds.playTap?.();
      return;
    }
    if (blooming) return;

    if (isOpen) {
      // Already open — just re-open the popup immediately
      sounds.playTap?.();
      onOpen(id);
      return;
    }

    // Play sound
    sounds.playBloom?.(isFinal);

    // Haptic
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate([25, 35, 55]); } catch {}
    }

    // Start bloom animation
    setBlooming(true);
    setBloomProgress(0);

    let start = null;
    function animFrame(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / BLOOM_DELAY_MS, 1);
      setBloomProgress(progress);
      if (progress < 1) {
        requestAnimationFrame(animFrame);
      } else {
        setBlooming(false);
        // Fire confetti for final flower
        if (isFinal) {
          try {
            confetti({
              particleCount: 80, spread: 85,
              origin: { y: 0.6 },
              colors: ["#FF1976", "#F75A9D", "#FFB8D8", "#FFFFFF", "#FFD060"],
              ticks: 220,
            });
          } catch {}
        }
        onOpen(id);
      }
    }
    requestAnimationFrame(animFrame);
  }

  // Scale during bloom animation
  const bloomScale = blooming
    ? 1.0 + Math.sin(bloomProgress * Math.PI) * 0.18
    : isOpen ? 1.0 : 1.0;

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
      onClick={handleClick}
      role="button"
      aria-label={`Rose ${id}${isLocked ? " (locked)" : isOpen ? " (bloomed)" : " (tap to bloom)"}`}
    >
      {/* Drop shadow */}
      <ellipse cx="0" cy={r * layerScale * 0.80}
        rx={r * layerScale * 0.65} ry={r * layerScale * 0.14}
        fill="#000000" opacity={layer === 0 ? 0.08 : layer === 1 ? 0.11 : 0.15}
      />

      {/* Rose group — scaled and rotated */}
      <motion.g
        transform={`rotate(${rot}) scale(${finalScale * bloomScale})`}
        style={{
          transformOrigin: "0px 0px",
          filter: depthFilter,
        }}
        animate={blooming ? {
          scale: [1, 1.15, 0.95, 1.20, 1.0],
        } : shake ? {
          x: [-4, 4, -3, 3, -1, 1, 0],
        } : {}}
        transition={shake ? { duration: 0.4 } : { duration: BLOOM_DELAY_MS / 1000, ease: "easeInOut" }}
      >
        <CartoonRose
          pal={pal}
          isOpen={isOpen || blooming}
          bloomProgress={bloomProgress}
        />
      </motion.g>

      {/* Soft pulse dot on un-bloomed buds */}
      {!isOpen && !isLocked && !blooming && (
        <motion.circle
          cx="0" cy={r * layerScale * 0.75}
          r="4.5"
          fill="#F6B8CF"
          stroke="#FFF1E8" strokeWidth="1.4"
          animate={{ scale: [1, 1.6, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `0px ${r * layerScale * 0.75}px` }}
        />
      )}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// BABY'S BREATH — small white filler clusters
// ─────────────────────────────────────────────────────────────

function BabysBreath() {
  const clusters = [
    { cx: 52,  cy: 102, n: 6, r: 11, s: 2 },
    { cx: 290, cy: 106, n: 6, r: 10, s: 5 },
    { cx: 70,  cy: 156, n: 5, r:  9, s: 8 },
    { cx: 270, cy: 158, n: 5, r:  9, s: 3 },
    { cx: 105, cy: 200, n: 4, r:  8, s: 7 },
    { cx: 235, cy: 202, n: 4, r:  8, s: 4 },
  ];
  return (
    <g>
      {clusters.map((cl, ci) => {
        const dots = [];
        for (let i = 0; i < cl.n; i++) {
          const a  = (i / cl.n) * Math.PI * 2 + cl.s * 0.4;
          const rr = cl.r * (0.4 + ((i * cl.s + 2) % 5) / 8);
          dots.push({ px: cl.cx + Math.cos(a) * rr, py: cl.cy + Math.sin(a) * rr * 0.7, pr: 2.2 + (i % 3) * 0.5 });
        }
        return (
          <g key={ci}>
            {dots.map((d, di) => (
              <circle key={di} cx={d.px} cy={d.py} r={d.pr}
                fill="#FFF1E8" stroke="#F6B8CF" strokeWidth="0.5" opacity="0.88" />
            ))}
          </g>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────

export default function RealisticBouquet({ opened = new Set(), allRegularOpen = false, onOpenFlower }) {

  const handleOpen = useCallback((id) => {
    onOpenFlower(id);
  }, [onOpenFlower]);

  const sortedFlowers = useMemo(() =>
    [...LAYOUT].sort((a, b) => a.layer - b.layer),
  []);

  return (
    <div className="w-full h-full relative select-none">
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ overflow: "visible" }}
        aria-label="Interactive pink rose bouquet"
      >
        {/* ── FLOATING ANIMATION on whole bouquet ── */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${CX}px 250px` }}
        >
          {/* Render order: stems → leaves → wrapper → baby's breath → roses */}
          <BouquetStems />
          <BouquetLeaves />
          <PaperConeWrapper />
          <BabysBreath />

          {sortedFlowers.map(cfg => (
            <InteractiveFlower
              key={cfg.id}
              config={cfg}
              opened={opened}
              allRegularOpen={allRegularOpen}
              onOpen={handleOpen}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
