import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { sounds } from "../lib/soundEffects";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────────────────────
// NATURAL ROSE COLOR PALETTE
// Soft blush pinks — warm daylight / studio photography aesthetic
// Each rose is slightly different so the bouquet feels hand-arranged
// ─────────────────────────────────────────────────────────────

const ROSE_PALETTES = {
  1: { // soft blush pink
    outer: "#E8B4B8", outerDark: "#C07A82",
    inner: "#B05A65", innerDark: "#7A3540",
    center: "#58202A", sepal: "#5A7A4E",
    emissive: "#2A0A10",
  },
  2: { // pale dusty rose
    outer: "#DEB0B8", outerDark: "#B87882",
    inner: "#A86070", innerDark: "#7A3E4C",
    center: "#5A2030", sepal: "#527248",
    emissive: "#2C0C18",
  },
  3: { // cream blush
    outer: "#F0C4BC", outerDark: "#CC8880",
    inner: "#B06860", innerDark: "#8A4240",
    center: "#663030", sepal: "#5B7A4C",
    emissive: "#2E1010",
  },
  4: { // deeper rose
    outer: "#D49098", outerDark: "#A86070",
    inner: "#9E5060", innerDark: "#743040",
    center: "#561A28", sepal: "#4E6E42",
    emissive: "#280C14",
  },
  5: { // warm blush
    outer: "#EABCBC", outerDark: "#C27878",
    inner: "#AA5858", innerDark: "#824040",
    center: "#622828", sepal: "#567248",
    emissive: "#300E0E",
  },
  6: { // muted mauve
    outer: "#D9ACBA", outerDark: "#B07080",
    inner: "#A85870", innerDark: "#7A3848",
    center: "#5E1E32", sepal: "#547048",
    emissive: "#2A0E18",
  },
  7: { // golden finale rose
    outer: "#E8C090", outerDark: "#C09050",
    inner: "#B07030", innerDark: "#7A4810",
    center: "#4A2A05", sepal: "#527040",
    emissive: "#281200",
  },
};

// ─────────────────────────────────────────────────────────────
// BOUQUET LAYOUT — organic fan, back→front depth layers
// ─────────────────────────────────────────────────────────────

const ROSE_CONFIGS = [
  // BACK ROW — slightly smaller, angled back
  { id: 4, key: "the-adventure",  position: [-1.08, 1.60, -0.58], rotation: [-0.16, 0.44, -0.24], scale: 0.80, depthLayer: 0 },
  { id: 1, key: "seed",           position: [ 0.06, 1.95, -0.65], rotation: [-0.30, -0.06,  0.04], scale: 0.84, depthLayer: 0 },
  { id: 2, key: "little-things",  position: [ 1.12, 1.58, -0.52], rotation: [-0.18, -0.42,  0.20], scale: 0.81, depthLayer: 0 },
  // MIDDLE ROW
  { id: 3, key: "the-laugh",      position: [-1.42, 0.62,  0.08], rotation: [0.14,  0.52, -0.20], scale: 0.90, depthLayer: 1 },
  { id: 6, key: "who-you-are",    position: [ 0.02, 0.98, -0.08], rotation: [0.06,  0.04,  0.00], scale: 0.95, depthLayer: 1 },
  { id: 5, key: "the-storm",      position: [ 1.42, 0.62,  0.08], rotation: [0.14, -0.52,  0.20], scale: 0.90, depthLayer: 1 },
  // FRONT CENTER — hero flower
  { id: 7, key: "whats-next",     position: [ 0.04,-0.05,  0.74], rotation: [0.30,  0.04,  0.00], scale: 1.10, depthLayer: 2, isFinal: true },
];

const GATHER_Y = -0.78; // stem convergence point y
const GATHER_POINT = new THREE.Vector3(0, GATHER_Y, 0);

// ─────────────────────────────────────────────────────────────
// GEOMETRY FACTORIES
// ─────────────────────────────────────────────────────────────

function makePetalGeom(width, height, cupDepth, seed = 0) {
  const segs = 22;
  const geom = new THREE.PlaneGeometry(width, height, segs, segs);
  const pos = geom.attributes.position;

  // Deterministic "noise" per petal so each one is unique but predictable
  const twist = ((seed % 7) - 3) * 0.018;
  const asymX = ((seed % 5) - 2) * 0.024;
  const curlBias = ((seed % 3) - 1) * 0.016;

  geom.translate(0, height / 2, 0);

  for (let i = 0; i < pos.count; i++) {
    const x  = pos.getX(i);
    const y  = pos.getY(i);
    const ny = y / height;           // 0 = base, 1 = tip
    const nx = x / (width / 2);     // -1 to 1

    // Organic petal silhouette — slightly irregular sine, not perfectly symmetric
    const wf  = Math.sin(ny * Math.PI) * (1 + twist * Math.cos(ny * 2.8));
    const asym = nx * asymX * Math.sin(ny * Math.PI);
    pos.setX(i, x * Math.max(0.22, wf) + asym * width * 0.25);

    // Cupping: concave dish shape, deepest in midpetal
    const cup  = -Math.sin(ny * Math.PI) * (1 - nx * nx * 0.32) * cupDepth;
    // Natural petal tip rolls back slightly
    const tip  = ny > 0.70 ? Math.sin(((ny - 0.70) / 0.30) * Math.PI) * 0.20 : 0;
    // Side curl
    const side = nx * nx * ny * (0.05 + curlBias);

    pos.setZ(i, cup + tip + side);
  }

  geom.computeVertexNormals();
  return geom;
}

function makeLeafGeom(width = 0.80, height = 1.80, seed = 0) {
  const geom = new THREE.PlaneGeometry(width, height, 14, 14);
  const pos  = geom.attributes.position;
  geom.translate(0, height / 2, 0);

  const waviness = ((seed % 4) - 1.5) * 0.06;

  for (let i = 0; i < pos.count; i++) {
    const x  = pos.getX(i);
    const y  = pos.getY(i);
    const ny = y / height;

    // Pointed oval silhouette with slight asymmetry
    const wf = Math.sin(ny * Math.PI) * (1 - ny * 0.25) * (1 + waviness * Math.sin(ny * 4));
    pos.setX(i, x * Math.max(0.04, wf));

    // Leaf mid-rib curve
    const curve = Math.sin(ny * Math.PI) * 0.10;
    const edge  = -x * x * 0.35;
    pos.setZ(i, curve + edge);
  }

  geom.computeVertexNormals();
  return geom;
}

function makeSepalGeom() {
  const geom = new THREE.PlaneGeometry(0.48, 1.55, 10, 10);
  const pos  = geom.attributes.position;
  geom.translate(0, 0.775, 0);

  for (let i = 0; i < pos.count; i++) {
    const x  = pos.getX(i);
    const y  = pos.getY(i);
    const ny = (y + 0.775) / 1.55;
    pos.setX(i, x * Math.max(0.04, 1 - ny));
    pos.setZ(i, -Math.sin(ny * Math.PI) * 0.16);
  }
  geom.computeVertexNormals();
  return geom;
}

// ─────────────────────────────────────────────────────────────
// SINGLE ANIMATED PETAL
// ─────────────────────────────────────────────────────────────

function RosePetal({ geometry, material, rotZ, closedAngle, targetAngle, bloomRef, delay = 0, closedSX = 0.65 }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;
    const eff = THREE.MathUtils.clamp((bloomRef.current - delay) / 0.62, 0, 1);
    const t   = 1 - Math.pow(1 - eff, 2.6);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(closedAngle, targetAngle, t);
    const s  = THREE.MathUtils.lerp(closedSX, 1.0, t);
    const sy = THREE.MathUtils.lerp(0.93, 1.0, t);
    meshRef.current.scale.set(s, sy, s);
  });

  return (
    <group rotation={[0, 0, rotZ]}>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// REALISTIC ROSE
// ─────────────────────────────────────────────────────────────

function RealisticRose({ flowerId, isOpen, isLocked, isFinal, position, rotation, scale = 1, onFlowerClick }) {
  const groupRef  = useRef();
  const [hovered, setHovered] = useState(false);
  const bloomRef  = useRef(isOpen ? 1 : 0);

  const pal = ROSE_PALETTES[flowerId] || ROSE_PALETTES[1];

  useFrame((_, delta) => {
    const target = isOpen ? 1 : 0;
    bloomRef.current = THREE.MathUtils.damp(bloomRef.current, target, 3.6, delta);

    if (groupRef.current) {
      const ts = hovered && !isLocked ? scale * 1.07 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.11);
    }
  });

  // Petal geometries — 7 outer, 6 mid, 5 inner, 4 core — each unique
  const outerGeoms = useMemo(() => [0, 1, 2, 3, 4, 5, 6].map(i => makePetalGeom(1.36 + (i % 3) * 0.05, 1.62 + (i % 4) * 0.06, 0.50 + (i % 3) * 0.03, i * flowerId)), [flowerId]);
  const midGeoms   = useMemo(() => [0, 1, 2, 3, 4, 5].map(i => makePetalGeom(1.10 + (i % 3) * 0.04, 1.36 + (i % 3) * 0.05, 0.42 + (i % 2) * 0.03, 10 + i * flowerId)), [flowerId]);
  const innerGeoms = useMemo(() => [0, 1, 2, 3, 4].map(i => makePetalGeom(0.80 + (i % 2) * 0.04, 1.10 + (i % 3) * 0.04, 0.34 + (i % 2) * 0.02, 20 + i * flowerId)), [flowerId]);
  const coreGeoms  = useMemo(() => [0, 1, 2, 3].map(i => makePetalGeom(0.56 + (i % 2) * 0.03, 0.86 + (i % 2) * 0.04, 0.25 + i * 0.01, 30 + i * flowerId)), [flowerId]);
  const sepalGeom  = useMemo(() => makeSepalGeom(), []);

  // PBR materials — warm matte satin
  const c = (hex) => new THREE.Color(hex);
  const matOuter    = useMemo(() => new THREE.MeshStandardMaterial({ color: c(isLocked ? "#7A6A6A" : pal.outer),     roughness: 0.62, metalness: 0, side: THREE.DoubleSide, emissive: c(pal.emissive), emissiveIntensity: 0.04 }), [pal, isLocked]);
  const matOutDark  = useMemo(() => new THREE.MeshStandardMaterial({ color: c(isLocked ? "#604A4A" : pal.outerDark), roughness: 0.65, metalness: 0, side: THREE.DoubleSide, emissive: c(pal.emissive), emissiveIntensity: 0.06 }), [pal, isLocked]);
  const matInner    = useMemo(() => new THREE.MeshStandardMaterial({ color: c(isLocked ? "#4A3535" : pal.inner),     roughness: 0.60, metalness: 0, side: THREE.DoubleSide, emissive: c(pal.emissive), emissiveIntensity: 0.09 }), [pal, isLocked]);
  const matInDark   = useMemo(() => new THREE.MeshStandardMaterial({ color: c(isLocked ? "#341E1E" : pal.innerDark), roughness: 0.58, metalness: 0, side: THREE.DoubleSide, emissive: c(pal.emissive), emissiveIntensity: 0.14 }), [pal, isLocked]);
  const matCenter   = useMemo(() => new THREE.MeshStandardMaterial({ color: c(isLocked ? "#201010" : pal.center),    roughness: 0.55, metalness: 0,                          emissive: c(pal.emissive), emissiveIntensity: 0.20 }), [pal, isLocked]);
  const matSepal    = useMemo(() => new THREE.MeshStandardMaterial({ color: c(isLocked ? "#38482C" : pal.sepal),     roughness: 0.74, metalness: 0, side: THREE.DoubleSide }), [pal, isLocked]);

  // Outer petal ring — 7 petals at organic angles (not perfect 360/7)
  const outerAngles = [0, 52, 108, 164, 218, 274, 330];
  // Alternate outer/dark materials for visual variation
  const outerMats   = [matOuter, matOutDark, matOuter, matOutDark, matOuter, matOutDark, matOuter];

  // Mid — 6 petals, slightly offset from outer
  const midAngles   = [24, 80, 138, 196, 254, 312];
  const midMats     = [matOutDark, matInner, matOutDark, matInner, matOutDark, matInner];

  // Inner — 5 petals
  const innerAngles = [6, 78, 150, 222, 294];
  const innerMats   = [matInner, matInDark, matInner, matInDark, matInner];

  // Core — 4 tight spiral petals
  const coreAngles  = [40, 130, 220, 310];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (!isLocked && onFlowerClick) onFlowerClick(flowerId, isOpen, isFinal);
      }}
      onPointerOver={(e) => { e.stopPropagation(); if (!isLocked) { setHovered(true); document.body.style.cursor = "pointer"; } }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Invisible wider hitbox for easier tapping on mobile */}
      <mesh visible={false}>
        <sphereGeometry args={[1.3, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Receptacle */}
      <mesh position={[0, -0.04, 0]} material={matSepal}>
        <sphereGeometry args={[0.28, 12, 10]} />
      </mesh>

      {/* Calyx sepals */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <RosePetal key={`sp${i}`} geometry={sepalGeom} material={matSepal}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.08} targetAngle={1.52}
          bloomRef={bloomRef} delay={0} closedSX={0.62} />
      ))}

      {/* Layer 1: Outer petals */}
      {outerAngles.map((deg, i) => (
        <RosePetal key={`o${i}`} geometry={outerGeoms[i]} material={outerMats[i]}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.28} targetAngle={1.12}
          bloomRef={bloomRef} delay={i * 0.020} closedSX={0.60} />
      ))}

      {/* Layer 2: Mid petals */}
      {midAngles.map((deg, j) => (
        <RosePetal key={`m${j}`} geometry={midGeoms[j]} material={midMats[j]}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.22} targetAngle={0.74}
          bloomRef={bloomRef} delay={0.14 + j * 0.018} closedSX={0.63} />
      ))}

      {/* Layer 3: Inner petals */}
      {innerAngles.map((deg, k) => (
        <RosePetal key={`i${k}`} geometry={innerGeoms[k]} material={innerMats[k]}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.16} targetAngle={0.46}
          bloomRef={bloomRef} delay={0.24 + k * 0.020} closedSX={0.66} />
      ))}

      {/* Layer 4: Core spiral */}
      {coreAngles.map((deg, m) => (
        <RosePetal key={`c${m}`} geometry={coreGeoms[m]} material={matInDark}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.10} targetAngle={0.25}
          bloomRef={bloomRef} delay={0.34 + m * 0.014} closedSX={0.70} />
      ))}

      {/* Center sphere — deep rose heart */}
      <mesh position={[0, 0.18, 0]} material={matCenter}>
        <sphereGeometry args={[0.20, 12, 12]} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// LEAF
// ─────────────────────────────────────────────────────────────

function BouquetLeaf({ position, rotation, scale = 1, seed = 0 }) {
  const geom = useMemo(() => makeLeafGeom(0.76, 1.72, seed), [seed]);
  const mat  = useMemo(() => new THREE.MeshStandardMaterial({
    color: seed % 2 === 0 ? new THREE.Color("#68905A") : new THREE.Color("#4E6E40"),
    roughness: 0.72,
    metalness: 0,
    side: THREE.DoubleSide,
    emissive: new THREE.Color("#182210"),
    emissiveIntensity: 0.04,
  }), [seed]);

  return <mesh position={position} rotation={rotation} scale={scale} geometry={geom} material={mat} castShadow receiveShadow />;
}

// ─────────────────────────────────────────────────────────────
// BABY'S BREATH
// ─────────────────────────────────────────────────────────────

function BabysBreath({ position, scale = 1, seed = 0 }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#F5F0EA"),
    roughness: 0.82, metalness: 0,
    emissive: new THREE.Color("#F0E8DC"),
    emissiveIntensity: 0.10,
  }), []);

  const dots = useMemo(() => {
    const pts = [];
    const n   = 12 + (seed % 5);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (seed % 7) * 0.3 + i * 0.15;
      const r = 0.14 + (i % 5) * 0.08;
      pts.push({
        p: [Math.cos(a) * r + ((i % 3) - 1) * 0.05, Math.sin(a) * r * 0.55 + (i % 4) * 0.05, (i % 4) * 0.05 - 0.04],
        r: 0.045 + (i % 4) * 0.012,
      });
    }
    return pts;
  }, [seed]);

  return (
    <group position={position} scale={scale}>
      {dots.map((d, i) => (
        <mesh key={i} position={d.p} material={mat}>
          <sphereGeometry args={[d.r, 5, 5]} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// STEM — tapered cylinder aligned between two world points
// ─────────────────────────────────────────────────────────────

function Stem({ from, to, topR = 0.048, botR = 0.060 }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#4A6A3A"), roughness: 0.74, metalness: 0,
    emissive: new THREE.Color("#141E0A"), emissiveIntensity: 0.04,
  }), []);

  const { center, quat, length } = useMemo(() => {
    const a    = new THREE.Vector3(...from);
    const b    = new THREE.Vector3(...to);
    const dir  = new THREE.Vector3().subVectors(b, a);
    const len  = dir.length();
    const mid  = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const q    = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { center: mid.toArray(), quat: q, length: len };
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  return (
    <mesh position={center} quaternion={quat} material={mat} castShadow>
      <cylinderGeometry args={[topR, botR, length, 8]} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────
// BOUQUET WRAPPER — kraft paper + ribbon
// ─────────────────────────────────────────────────────────────

function BouquetWrapper() {
  const mkMat = (hex, rough = 0.88) => new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex), roughness: rough, metalness: 0,
    side: THREE.DoubleSide,
    emissive: new THREE.Color("#100808"), emissiveIntensity: 0.03,
  });

  // Warm kraft/blush paper tones
  const matMain   = useMemo(() => mkMat("#D6C0A4"), []);
  const matFlap1  = useMemo(() => mkMat("#E8D8C0"), []);
  const matFlap2  = useMemo(() => mkMat("#DEC8A8"), []);
  const matShad   = useMemo(() => mkMat("#BCA888"), []);
  const matCrease = useMemo(() => mkMat("#C4B090", 0.92), []);
  // Dusty rose ribbon
  const matRibbon = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#C49090"), roughness: 0.40, metalness: 0.05,
    emissive: new THREE.Color("#1C0808"), emissiveIntensity: 0.07,
  }), []);

  return (
    <group position={[0, -0.72, 0]}>
      {/* Main conical paper body */}
      <mesh position={[0, -0.62, 0]} material={matMain} castShadow receiveShadow>
        <cylinderGeometry args={[1.95, 0.52, 2.15, 26, 1, true]} />
      </mesh>

      {/* Shadow side of cone — gives it cylindrical depth */}
      <mesh position={[0, -0.62, 0.01]} material={matShad}>
        <cylinderGeometry args={[1.80, 0.46, 2.13, 20, 1, true, Math.PI * 0.5, Math.PI * 0.85]} />
      </mesh>

      {/* Left wrap flap — overlapping paper fold */}
      <mesh position={[-0.50, -0.46, 0.44]} rotation={[0.10, 0.32, -0.38]} material={matFlap1} castShadow>
        <boxGeometry args={[1.35, 1.95, 0.035]} />
      </mesh>

      {/* Right wrap flap */}
      <mesh position={[ 0.52, -0.44, 0.40]} rotation={[0.08, -0.30, 0.35]} material={matFlap2} castShadow>
        <boxGeometry args={[1.28, 1.88, 0.035]} />
      </mesh>

      {/* Fold crease — left */}
      <mesh position={[-0.24, -0.78, 0.54]} rotation={[0.04, 0.18, -0.44]} material={matCrease}>
        <boxGeometry args={[0.04, 1.75, 0.025]} />
      </mesh>

      {/* Fold crease — right */}
      <mesh position={[ 0.28, -0.74, 0.50]} rotation={[0.04, -0.14, 0.40]} material={matCrease}>
        <boxGeometry args={[0.04, 1.68, 0.025]} />
      </mesh>

      {/* Ribbon band */}
      <mesh position={[0, -1.75, 0.04]} rotation={[0.06, 0, 0]} material={matRibbon} castShadow>
        <cylinderGeometry args={[0.60, 0.58, 0.20, 20]} />
      </mesh>

      {/* Bow — left loop */}
      <mesh position={[-0.36, -1.60, 0.20]} rotation={[0.08, 0.18, -0.52]} material={matRibbon} castShadow>
        <torusGeometry args={[0.20, 0.055, 8, 22, Math.PI * 1.45]} />
      </mesh>

      {/* Bow — right loop */}
      <mesh position={[ 0.36, -1.60, 0.20]} rotation={[0.08, -0.18, 0.52]} material={matRibbon} castShadow>
        <torusGeometry args={[0.20, 0.055, 8, 22, Math.PI * 1.45]} />
      </mesh>

      {/* Ribbon knot center */}
      <mesh position={[0, -1.60, 0.24]} material={matRibbon}>
        <sphereGeometry args={[0.075, 8, 8]} />
      </mesh>

      {/* Tail left */}
      <mesh position={[-0.15, -1.98, 0.14]} rotation={[0, 0.08, 0.20]} material={matRibbon}>
        <boxGeometry args={[0.085, 0.50, 0.032]} />
      </mesh>
      {/* Tail right */}
      <mesh position={[ 0.16, -2.02, 0.14]} rotation={[0, -0.08, -0.18]} material={matRibbon}>
        <boxGeometry args={[0.085, 0.55, 0.032]} />
      </mesh>

      {/* Paper bottom cap */}
      <mesh position={[0, -1.71, 0]} material={matMain}>
        <cylinderGeometry args={[0.55, 0.36, 0.28, 18]} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// ASSEMBLED BOUQUET — stems + leaves + filler + roses + wrapper
// ─────────────────────────────────────────────────────────────

function FullBouquet({ opened, allRegularOpen, onFlowerClick }) {
  // Stem base points (below each rose, angled toward gather)
  const stemBases = ROSE_CONFIGS.map(cfg => [
    cfg.position[0] * 0.32,
    cfg.position[1] - 0.50,
    cfg.position[2] * 0.38,
  ]);

  return (
    <group>
      {/* STEMS */}
      {ROSE_CONFIGS.map((cfg, i) => (
        <Stem
          key={`stem-${cfg.id}`}
          from={stemBases[i]}
          to={[0, GATHER_Y, 0]}
          topR={0.042}
          botR={0.055 + (cfg.depthLayer * 0.005)}
        />
      ))}

      {/* LEAVES */}
      <BouquetLeaf position={[-1.48, 0.22, 0.12]} rotation={[0.24, 0.58, -0.80]} scale={0.94} seed={0} />
      <BouquetLeaf position={[ 1.52, 0.20, 0.10]} rotation={[0.22, -0.55, 0.75]} scale={0.88} seed={1} />
      <BouquetLeaf position={[-1.12, 0.88, -0.28]} rotation={[0.08, 0.40, -0.58]} scale={0.76} seed={2} />
      <BouquetLeaf position={[ 1.08, 0.86, -0.24]} rotation={[0.10, -0.38, 0.54]} scale={0.72} seed={3} />
      <BouquetLeaf position={[-0.82, -0.12, 0.30]} rotation={[0.34, 0.64, -0.44]} scale={0.66} seed={4} />
      <BouquetLeaf position={[ 0.84, -0.10, 0.26]} rotation={[0.30, -0.62, 0.42]} scale={0.63} seed={5} />
      <BouquetLeaf position={[ 0.16,  1.38, -0.40]} rotation={[-0.20, 0.12, 0.14]} scale={0.70} seed={6} />

      {/* BABY'S BREATH — scattered filler */}
      <BabysBreath position={[-1.28, 0.52, -0.18]} scale={0.90} seed={0} />
      <BabysBreath position={[ 1.22, 0.50, -0.14]} scale={0.85} seed={1} />
      <BabysBreath position={[-0.52, 1.38, -0.32]} scale={0.78} seed={2} />
      <BabysBreath position={[ 0.58, 1.32, -0.28]} scale={0.80} seed={3} />
      <BabysBreath position={[-0.88, -0.04, 0.22]} scale={0.72} seed={4} />
      <BabysBreath position={[ 0.90, -0.06, 0.20]} scale={0.68} seed={5} />
      <BabysBreath position={[ 0.02,  0.58, 0.32]} scale={0.62} seed={6} />
      <BabysBreath position={[-0.30,  0.22, 0.48]} scale={0.58} seed={7} />

      {/* ROSES */}
      {ROSE_CONFIGS.map((cfg) => {
        const isOpen   = opened.has(cfg.id);
        const isLocked = cfg.id === 7 && !allRegularOpen && !isOpen;
        return (
          <RealisticRose
            key={cfg.key}
            flowerId={cfg.id}
            isOpen={isOpen}
            isLocked={isLocked}
            isFinal={cfg.isFinal || false}
            position={cfg.position}
            rotation={cfg.rotation}
            scale={cfg.scale}
            onFlowerClick={onFlowerClick}
          />
        );
      })}

      {/* WRAPPER */}
      <BouquetWrapper />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPORTED SCENE
// ─────────────────────────────────────────────────────────────

export default function Real3DBouquetScene({ opened = new Set(), allRegularOpen = false, onOpenFlower }) {
  function handleFlowerClick(id, isOpen, isFinal) {
    if (!isOpen) {
      sounds.playBloom(isFinal);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try { navigator.vibrate([28, 38, 60]); } catch {}
      }
      if (isFinal) {
        try {
          confetti({
            particleCount: 70, spread: 82,
            origin: { y: 0.6 },
            colors: ["#C9A86A", "#FCE48B", "#FFFFFF", "#E8B4B8"],
            ticks: 200,
          });
        } catch {}
      }
      onOpenFlower(id);
    } else {
      sounds.playTap();
      onOpenFlower(id);
    }
  }

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0.95, 7.30], fov: 41 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
        shadows
      >
        {/* ── WARM SOFT DAYLIGHT LIGHTING ── */}

        {/* Broad warm ambient fill */}
        <ambientLight intensity={0.68} color="#FFF4EC" />

        {/* Primary key — upper left warm daylight */}
        <directionalLight
          position={[-3.2, 6.5, 5.8]}
          intensity={1.90}
          color="#FFF6EC"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.00018}
        />

        {/* Secondary fill — cooler from right, reduces harsh shadows */}
        <directionalLight
          position={[5.5, 3.0, 3.5]}
          intensity={0.60}
          color="#EEE8F6"
        />

        {/* Subtle warm backlight — separates from dark bg */}
        <directionalLight
          position={[0.5, 2.5, -6.0]}
          intensity={0.22}
          color="#FFE0C8"
        />

        {/* Low warm bounce — simulates studio floor / table reflect */}
        <pointLight position={[0, -3.5, 3.0]} intensity={0.20} color="#FFE8CC" />

        {/* Final flower warm glow — only when flower 7 is opened */}
        {opened.has(7) && (
          <pointLight position={[0.04, -0.05, 1.8]} intensity={0.55} color="#FFD080" />
        )}

        {/* Grounded contact shadow */}
        <ContactShadows
          position={[0, -3.45, 0]}
          opacity={0.50}
          scale={9.5}
          blur={2.6}
          far={4.5}
          color="#1E1008"
        />

        {/* Gentle living float */}
        <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.16}>
          <group position={[0, -0.04, 0]}>
            <FullBouquet
              opened={opened}
              allRegularOpen={allRegularOpen}
              onFlowerClick={handleFlowerClick}
            />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
