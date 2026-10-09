import React from "react";

export default function WatercolorPetalFilters() {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none overflow-hidden"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft watercolor bleed and organic feathered edge filter */}
        <filter id="watercolor-wash" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
            <feMergeNode in="SourceGraphic" opacity="0.6" />
          </feMerge>
        </filter>

        {/* Luminous stardust glow filter for Flower 7 */}
        <filter id="golden-aura" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow" />
          <feColorMatrix
            in="glow"
            type="matrix"
            values="1 0 0 0 0.95
                    0 0.85 0 0 0.8
                    0 0 0.5 0 0.45
                    0 0 0 1.5 0"
            result="goldGlow"
          />
          <feMerge>
            <feMergeNode in="goldGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Petal gradients for rich watercolor depth */}
        <radialGradient id="grad-seed" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FBD5D6" />
          <stop offset="85%" stopColor="#EEA6AC" />
          <stop offset="100%" stopColor="#D9828B" />
        </radialGradient>

        <radialGradient id="grad-forgetmenot" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#C9DCF4" />
          <stop offset="80%" stopColor="#87A9D6" />
          <stop offset="100%" stopColor="#6C8BB8" />
        </radialGradient>

        <radialGradient id="grad-poppy" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF9E0" />
          <stop offset="30%" stopColor="#FEE48C" />
          <stop offset="75%" stopColor="#F5B942" />
          <stop offset="100%" stopColor="#E28D2B" />
        </radialGradient>

        <radialGradient id="grad-peony" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FDF0F3" />
          <stop offset="35%" stopColor="#F4BFCA" />
          <stop offset="75%" stopColor="#DF8FA0" />
          <stop offset="100%" stopColor="#BA6679" />
        </radialGradient>

        <radialGradient id="grad-iris" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#EAEBF8" />
          <stop offset="30%" stopColor="#B3B8E6" />
          <stop offset="70%" stopColor="#7B83C7" />
          <stop offset="100%" stopColor="#555C9C" />
        </radialGradient>

        <radialGradient id="grad-rose" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FDF2E9" />
          <stop offset="30%" stopColor="#E9B7BD" />
          <stop offset="70%" stopColor="#C67D89" />
          <stop offset="100%" stopColor="#9B4B58" />
        </radialGradient>

        <radialGradient id="grad-gold" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFEE8" />
          <stop offset="25%" stopColor="#FCE48B" />
          <stop offset="65%" stopColor="#E5B84B" />
          <stop offset="90%" stopColor="#B88A2D" />
          <stop offset="100%" stopColor="#8C631B" />
        </radialGradient>

        <radialGradient id="grad-center-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="60%" stopColor="#F39C12" />
          <stop offset="100%" stopColor="#D35400" />
        </radialGradient>

        <linearGradient id="grad-stem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ADC49F" />
          <stop offset="60%" stopColor="#7E9672" />
          <stop offset="100%" stopColor="#5B7250" />
        </linearGradient>

        {/* ── 3D Sculpted Lighting & Shading Filters ── */}
        <filter id="sculpted-petal-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1F1512" floodOpacity="0.32" />
        </filter>

        <filter id="sculpted-wrapper-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
        </filter>

        <filter id="sculpted-ring-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="4.5" floodColor="#18100C" floodOpacity="0.55" />
        </filter>

        {/* ── 3D Botanical Stems & Foliage Gradients ── */}
        <linearGradient id="sculpted-stem-3d" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#84A177" />
          <stop offset="35%" stopColor="#A4C296" />
          <stop offset="70%" stopColor="#5B774E" />
          <stop offset="100%" stopColor="#364E2D" />
        </linearGradient>

        <linearGradient id="sculpted-leaf-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B3CAA5" />
          <stop offset="45%" stopColor="#8CA67E" />
          <stop offset="100%" stopColor="#5D7650" />
        </linearGradient>

        <linearGradient id="sculpted-leaf-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#859F77" />
          <stop offset="55%" stopColor="#58714A" />
          <stop offset="100%" stopColor="#3A4D30" />
        </linearGradient>

        <linearGradient id="sculpted-calyx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A2BD94" />
          <stop offset="50%" stopColor="#718B63" />
          <stop offset="100%" stopColor="#435B37" />
        </linearGradient>

        {/* ── 3D Bouquet Wrapping Paper & Origami Collar Folds ── */}
        {/* Interior deep concave shadow inside the cone */}
        <radialGradient id="wrap-cone-interior" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#3B322B" />
          <stop offset="60%" stopColor="#251F1B" />
          <stop offset="100%" stopColor="#14110E" />
        </radialGradient>

        {/* Main conical paper body with curved cylindrical lighting */}
        <linearGradient id="wrap-paper-body" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#EFE5DB" />
          <stop offset="25%" stopColor="#E2D4C5" />
          <stop offset="65%" stopColor="#CBB8A5" />
          <stop offset="100%" stopColor="#9C8775" />
        </linearGradient>

        {/* Front overlapping sculptural collar lapel */}
        <linearGradient id="wrap-paper-flap" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#FAF4EE" />
          <stop offset="30%" stopColor="#EBDDCF" />
          <stop offset="70%" stopColor="#D5C2B0" />
          <stop offset="100%" stopColor="#AC9783" />
        </linearGradient>

        {/* Highlight along the folded collar edge */}
        <linearGradient id="wrap-paper-rim-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#FFF7F0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D8C8B8" stopOpacity="0.5" />
        </linearGradient>

        {/* Sculptural Donut Ring Clasp / Torus Buckle */}
        <radialGradient id="wrap-donut-ring" cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFF9E6" />
          <stop offset="22%" stopColor="#EED29A" />
          <stop offset="58%" stopColor="#B89454" />
          <stop offset="85%" stopColor="#7E602A" />
          <stop offset="100%" stopColor="#4A3614" />
        </radialGradient>

        {/* Ribbon strap gathered through the ring */}
        <linearGradient id="wrap-tie-band" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8C6E3D" />
          <stop offset="35%" stopColor="#D9B775" />
          <stop offset="70%" stopColor="#F5DFAB" />
          <stop offset="100%" stopColor="#7B5F30" />
        </linearGradient>

        {/* Bottom pleated skirt folds */}
        <linearGradient id="wrap-skirt-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B09E" />
          <stop offset="50%" stopColor="#E0D2C4" />
          <stop offset="100%" stopColor="#A89482" />
        </linearGradient>

        <linearGradient id="wrap-skirt-center" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#EFE5DC" />
          <stop offset="45%" stopColor="#E2D4C6" />
          <stop offset="85%" stopColor="#B5A18F" />
          <stop offset="100%" stopColor="#877463" />
        </linearGradient>

        <linearGradient id="wrap-skirt-right" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#CDBEB0" />
          <stop offset="50%" stopColor="#DFCFC0" />
          <stop offset="100%" stopColor="#9B8876" />
        </linearGradient>

        {/* ── 3D Sculpted Rose Petal Rim Highlights ── */}
        <linearGradient id="petal-rim-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}
