import React from "react";
import { motion } from "framer-motion";

/**
 * 3D Sculptural Wrapped Bouquet Background Component
 * Accurately models the conical paper wrap, origami folded collar,
 * gathered donut ring clasp, bottom pleated skirt, botanical stems, and rose leaves.
 */
export default function BouquetSculptedWrapper() {
  return (
    <svg
      viewBox="0 0 400 640"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible select-none z-0"
      aria-hidden="true"
    >
      {/* ── Layer 1: Soft Ambient Drop Shadow under Bouquet Wrap ── */}
      <ellipse
        cx="200"
        cy="585"
        rx="75"
        ry="20"
        fill="rgba(0, 0, 0, 0.45)"
        filter="blur(12px)"
      />
      <ellipse
        cx="200"
        cy="495"
        rx="105"
        ry="32"
        fill="rgba(0, 0, 0, 0.32)"
        filter="blur(18px)"
      />

      {/* ── Layer 2: Interior Cone Depth (Inside Paper Wrap behind stems) ── */}
      <path
        d="M 52 280 Q 115 425 182 466 L 218 466 Q 285 425 348 280 Q 200 230 52 280 Z"
        fill="url(#wrap-cone-interior)"
        opacity="0.95"
      />

      {/* ── Layer 3: Natural Botanical Rose Stems Rising from Waist Cinch ── */}
      <g opacity="0.95">
        {/* Stem to Flower 1: Top Center Crown */}
        <path
          d="M 200 466 Q 198 290 200 115"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stem to Flower 6: Mid-Upper Center */}
        <path
          d="M 200 466 Q 202 335 200 195"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stem to Flower 4: Upper Left */}
        <path
          d="M 196 466 Q 140 310 98 165"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stem to Flower 2: Upper Right */}
        <path
          d="M 204 466 Q 260 310 302 165"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stem to Flower 3: Lower Left */}
        <path
          d="M 194 466 Q 120 375 78 265"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stem to Flower 5: Lower Right */}
        <path
          d="M 206 466 Q 280 375 322 265"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stem to Flower 7: Front Centerpiece */}
        <path
          d="M 200 466 Q 200 365 200 275"
          stroke="url(#sculpted-stem-3d)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* ── Layer 4: Sculpted Rose Leaves & Greenery Foliage ── */}
      <g filter="url(#sculpted-petal-shadow)">
        {/* Left collar broad leaf cluster */}
        <g transform="translate(100, 330) rotate(-42)">
          <path
            d="M 0 0 C -16 -24 -10 -48 0 -62 C 10 -48 16 -24 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -24 8 -48 0 -62 C -8 -48 0 -24 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.88"
          />
          <path d="M 0 0 L 0 -58" stroke="#E1EED8" strokeWidth="1.2" opacity="0.65" />
        </g>
        <g transform="translate(70, 300) rotate(-68)">
          <path
            d="M 0 0 C -14 -20 -8 -40 0 -52 C 8 -40 14 -20 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -20 7 -40 0 -52 C -7 -40 0 -20 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.88"
          />
          <path d="M 0 0 L 0 -48" stroke="#E1EED8" strokeWidth="1" opacity="0.65" />
        </g>
        <g transform="translate(52, 260) rotate(-85)">
          <path
            d="M 0 0 C -12 -16 -6 -34 0 -44 C 6 -34 12 -16 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -16 6 -34 0 -44 C -6 -34 0 -16 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.9"
          />
        </g>

        {/* Right collar broad leaf cluster */}
        <g transform="translate(300, 330) rotate(42)">
          <path
            d="M 0 0 C 16 -24 10 -48 0 -62 C -10 -48 -16 -24 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -24 -8 -48 0 -62 C 8 -48 0 -24 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.88"
          />
          <path d="M 0 0 L 0 -58" stroke="#E1EED8" strokeWidth="1.2" opacity="0.65" />
        </g>
        <g transform="translate(330, 300) rotate(68)">
          <path
            d="M 0 0 C 14 -20 8 -40 0 -52 C -8 -40 -14 -20 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -20 -7 -40 0 -52 C 7 -40 0 -20 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.88"
          />
          <path d="M 0 0 L 0 -48" stroke="#E1EED8" strokeWidth="1" opacity="0.65" />
        </g>
        <g transform="translate(348, 260) rotate(85)">
          <path
            d="M 0 0 C 12 -16 6 -34 0 -44 C -6 -34 -12 -16 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -16 -6 -34 0 -44 C 6 -34 0 -16 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.9"
          />
        </g>

        {/* Center-mid filler leaves (behind centerpiece) */}
        <g transform="translate(142, 215) rotate(-26)">
          <path
            d="M 0 0 C -12 -18 -8 -36 0 -48 C 8 -36 12 -18 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -18 6 -36 0 -48 C -6 -36 0 -18 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.88"
          />
        </g>
        <g transform="translate(258, 215) rotate(26)">
          <path
            d="M 0 0 C 12 -18 8 -36 0 -48 C -8 -36 -12 -18 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -18 -6 -36 0 -48 C 6 -36 0 -18 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.88"
          />
        </g>

        {/* Top crown filler leaves */}
        <g transform="translate(140, 105) rotate(-38)">
          <path
            d="M 0 0 C -10 -15 -6 -30 0 -40 C 6 -30 10 -15 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -15 5 -30 0 -40 C -5 -30 0 -15 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.92"
          />
        </g>
        <g transform="translate(260, 105) rotate(38)">
          <path
            d="M 0 0 C 10 -15 6 -30 0 -40 C -6 -30 -10 -15 0 0 Z"
            fill="url(#sculpted-leaf-dark)"
          />
          <path
            d="M 0 0 C 0 -15 -5 -30 0 -40 C 5 -30 0 -15 0 0 Z"
            fill="url(#sculpted-leaf-light)"
            opacity="0.92"
          />
        </g>
      </g>

      {/* ── Layer 5: The Sculptural Conical Paper Wrapper ── */}
      <g filter="url(#sculpted-wrapper-shadow)">
        {/* Main Paper Cone Body (Left & Center Body) */}
        <path
          d="M 52 280 C 62 355 120 435 182 466 L 218 466 C 252 448 308 380 348 280 Q 200 355 52 280 Z"
          fill="url(#wrap-paper-body)"
        />

        {/* Inner shadow under the overlapping front collar flap */}
        <path
          d="M 348 280 Q 265 305 210 338 Q 160 375 175 428 Q 190 454 204 466 L 218 466 Q 198 435 220 385 Q 280 318 348 280 Z"
          fill="rgba(20, 15, 12, 0.45)"
          filter="blur(6px)"
        />

        {/* Front Sculptural Origami Fold: Overlapping Collar Lapel */}
        {/* Sweeps gracefully from right shoulder across center front to waist */}
        <path
          d="M 348 280 C 280 305 220 338 175 380 C 155 420 178 450 202 466 L 218 466 C 250 438 310 365 348 280 Z"
          fill="url(#wrap-paper-flap)"
          stroke="#D8C5B3"
          strokeWidth="0.8"
        />

        {/* Rolled sculptural rim highlight on the overlapping lapel edge */}
        <path
          d="M 348 280 C 280 305 220 338 175 380 C 155 420 178 450 202 466"
          stroke="url(#wrap-paper-rim-highlight)"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left shoulder folded collar edge */}
        <path
          d="M 52 280 C 90 320 135 345 182 365"
          stroke="url(#wrap-paper-rim-highlight)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </g>

      {/* ── Layer 6: Flared Pleated Skirt (Below the Ring Clasp) ── */}
      <g filter="url(#sculpted-wrapper-shadow)">
        {/* Left pleat fold */}
        <path
          d="M 184 470 Q 164 518 152 555 Q 168 580 190 572 Q 188 524 194 470 Z"
          fill="url(#wrap-skirt-left)"
          stroke="#C2B09F"
          strokeWidth="0.8"
        />
        {/* Right pleat fold */}
        <path
          d="M 216 470 Q 236 518 248 555 Q 232 580 210 572 Q 212 524 206 470 Z"
          fill="url(#wrap-skirt-right)"
          stroke="#C2B09F"
          strokeWidth="0.8"
        />
        {/* Center overlapping pleat / gathered hem */}
        <path
          d="M 192 470 Q 186 528 184 570 Q 200 582 216 570 Q 214 528 208 470 Z"
          fill="url(#wrap-skirt-center)"
          stroke="#D4C3B2"
          strokeWidth="0.9"
        />
        {/* Deep ambient shadow lines between pleats */}
        <path
          d="M 192 475 Q 186 524 184 570"
          stroke="rgba(28, 20, 14, 0.5)"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M 208 475 Q 214 524 216 570"
          stroke="rgba(28, 20, 14, 0.5)"
          strokeWidth="2.2"
          fill="none"
        />
      </g>

      {/* ── Layer 7: The Waist Tie Ribbon Band & Donut Ring Clasp ── */}
      <g filter="url(#sculpted-ring-shadow)">
        {/* Gathered tie belt strap wrapping around waist behind the ring */}
        <path
          d="M 170 462 Q 200 467 230 462 L 228 477 Q 200 481 172 477 Z"
          fill="url(#wrap-tie-band)"
          stroke="#705224"
          strokeWidth="0.6"
        />
        <path
          d="M 171 469 Q 200 473 229 469"
          stroke="#FFF2D6"
          strokeWidth="1.4"
          fill="none"
          opacity="0.65"
        />

        {/* 3D Torus / Donut Ring Buckle Clasp */}
        {/* Outer radius rx=25, ry=22 | Inner hole rx=12, ry=10 */}
        <path
          d="M 200 446 
             C 215 446 228 456 228 469 
             C 228 482 215 492 200 492 
             C 185 492 172 482 172 469 
             C 172 456 185 446 200 446 Z 
             M 200 457 
             C 193 457 187 462.5 187 469 
             C 187 475.5 193 481 200 481 
             C 207 481 213 475.5 213 469 
             C 213 462.5 207 457 200 457 Z"
          fillRule="evenodd"
          fill="url(#wrap-donut-ring)"
          stroke="#684D1F"
          strokeWidth="1"
        />

        {/* Specular Highlight Arc on Donut Ring (Top-Left) */}
        <path
          d="M 180 457 C 186 449 194 447 206 447"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Inner Hole Ambient Occlusion Shadow */}
        <path
          d="M 190 465 C 193 459 204 458 210 462"
          stroke="#36250E"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
