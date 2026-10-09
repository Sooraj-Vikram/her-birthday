import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Palette colors with soft clay / porcelain shading
 */
export const ROSE_3D_THEMES = {
  seed: {
    color: "#E59EA8",
    innerColor: "#B54D5D",
    rimColor: "#FFF5F7",
    glowColor: "#FFB5C2",
    emissive: "#2A0A10",
  },
  "little-things": {
    color: "#729BCB",
    innerColor: "#325A8F",
    rimColor: "#EFF5FC",
    glowColor: "#93BDEE",
    emissive: "#0A1728",
  },
  "the-laugh": {
    color: "#EAA036",
    innerColor: "#9E5308",
    rimColor: "#FFFCE6",
    glowColor: "#FFC76E",
    emissive: "#301502",
  },
  "the-adventure": {
    color: "#CF6078",
    innerColor: "#802438",
    rimColor: "#FFF0F4",
    glowColor: "#EB859C",
    emissive: "#2D0A12",
  },
  "the-storm": {
    color: "#6F7AC2",
    innerColor: "#30397A",
    rimColor: "#F2F4FD",
    glowColor: "#929CE8",
    emissive: "#0D112E",
  },
  "who-you-are": {
    color: "#BB4057",
    innerColor: "#610E1F",
    rimColor: "#FFF0F4",
    glowColor: "#E2627A",
    emissive: "#28030A",
  },
  "whats-next": {
    color: "#E8B028",
    innerColor: "#8E6007",
    rimColor: "#FFFFEB",
    glowColor: "#FFDC6F",
    emissive: "#382302",
  },
};

/**
 * Builds a volumetric 3D sculpted clay petal with a thick rounded rolled lip
 */
function createSculptedClayPetal(width = 1.3, height = 1.5, cupDepth = 0.45, rimRadius = 0.12) {
  // 1. Curved Cupped Dish Shell
  const geom = new THREE.PlaneGeometry(width, height, 18, 18);
  const pos = geom.attributes.position;
  geom.translate(0, height / 2, 0); // Pivot at the base

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const ny = y / height; // 0 to 1
    const nx = x / (width / 2); // -1 to 1

    // Plump rounded petal silhouette
    const widthFactor = Math.sin(ny * Math.PI);
    pos.setX(i, x * Math.max(0.3, widthFactor));

    // Deep volumetric clay cupping
    const cup = -Math.sin(ny * Math.PI) * (1 - nx * nx * 0.4) * cupDepth;

    // Rolled outer rim lip
    const rolledLip = ny > 0.75 ? Math.sin((ny - 0.75) / 0.25 * Math.PI) * 0.15 : 0;

    pos.setZ(i, cup + rolledLip);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * Builds a pointed calyx sepal leaflet
 */
function createSepalGeometry(width = 0.55, height = 1.6) {
  const geom = new THREE.PlaneGeometry(width, height, 12, 12);
  const pos = geom.attributes.position;
  geom.translate(0, height / 2, 0);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const ny = y / height;
    // Taper to sharp tip
    const taper = 1 - ny;
    pos.setX(i, x * Math.max(0.05, taper));
    // Gentle curve
    pos.setZ(i, -Math.sin(ny * Math.PI) * 0.2);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * Thick Rolled Tubular Rim Lip along the top edge of a petal (matches reference photo)
 */
function SculptedPetalRimLip({ width = 1.2, height = 1.4, material, rotZ = 0, bloomProgress, delay = 0, closedAngle, targetAngle }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;
    const effective = THREE.MathUtils.clamp((bloomProgress - delay) / 0.55, 0, 1);
    const t = 1 - Math.pow(1 - effective, 3);
    const currentAngle = THREE.MathUtils.lerp(closedAngle, targetAngle, t);
    meshRef.current.rotation.x = currentAngle;
  });

  return (
    <group rotation={[0, 0, rotZ]}>
      <group ref={meshRef}>
        <mesh position={[0, height * 0.94, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[width * 0.38, 0.09, 12, 24, Math.PI]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Interactive 3D Petal with realistic smooth unfolding spring physics
 */
function Sculpted3DPetal({
  geometry,
  material,
  closedAngle,
  targetAngle,
  closedScale = [0.75, 0.95, 0.75],
  targetScale = [1, 1, 1],
  rotZ = 0,
  bloomProgress,
  delay = 0,
}) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;
    const effective = THREE.MathUtils.clamp((bloomProgress - delay) / 0.55, 0, 1);
    const t = 1 - Math.pow(1 - effective, 3);

    const currentAngle = THREE.MathUtils.lerp(closedAngle, targetAngle, t);
    meshRef.current.rotation.x = currentAngle;

    const sx = THREE.MathUtils.lerp(closedScale[0], targetScale[0], t);
    const sy = THREE.MathUtils.lerp(closedScale[1], targetScale[1], t);
    const sz = THREE.MathUtils.lerp(closedScale[2], targetScale[2], t);
    meshRef.current.scale.set(sx, sy, sz);
  });

  return (
    <group rotation={[0, 0, rotZ]}>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );
}

/**
 * Exact 3D Sculpted Clay Cabbage Rose matching the reference photo
 */
function SculptedRoseModel({ themeKey, isOpen, isLocked, isFinal }) {
  const groupRef = useRef();
  const theme = ROSE_3D_THEMES[themeKey] || ROSE_3D_THEMES["who-you-are"];
  const bloomProgressRef = useRef(isOpen ? 1 : 0);

  // Smooth frame interpolation for bloom progress & subtle natural sway
  useFrame((state, delta) => {
    const target = isOpen ? 1 : 0;
    bloomProgressRef.current = THREE.MathUtils.damp(bloomProgressRef.current, target, 4.2, delta);

    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.7) * 0.05;
      groupRef.current.rotation.x = 0.28 + Math.cos(time * 0.6) * 0.03;
    }
  });

  // Petal geometries
  const outerGeom = useMemo(() => createSculptedClayPetal(1.45, 1.7, 0.5, 0.16), []);
  const midGeom = useMemo(() => createSculptedClayPetal(1.2, 1.45, 0.42, 0.12), []);
  const innerGeom = useMemo(() => createSculptedClayPetal(0.9, 1.2, 0.35, 0.08), []);
  const coreGeom = useMemo(() => createSculptedClayPetal(0.65, 0.95, 0.28, 0.06), []);
  const sepalGeom = useMemo(() => createSepalGeometry(0.55, 1.8), []);

  // Sculpted Clay PBR Materials (smooth matte clay with soft rim sheen)
  const outerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(isLocked ? "#756E68" : theme.color),
      roughness: 0.35,
      metalness: 0.04,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(isLocked ? "#201E1C" : theme.emissive),
      emissiveIntensity: isFinal ? 0.35 : 0.12,
    });
  }, [theme, isLocked, isFinal]);

  const innerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(isLocked ? "#544D48" : theme.innerColor),
      roughness: 0.3,
      metalness: 0.06,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(isLocked ? "#151311" : theme.emissive),
      emissiveIntensity: 0.22,
    });
  }, [theme, isLocked]);

  const sepalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(isLocked ? "#4A4540" : "#567049"),
      roughness: 0.45,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
  }, [isLocked]);

  const stemMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(isLocked ? "#3B3632" : "#3B5232"),
      roughness: 0.5,
      metalness: 0.02,
    });
  }, [isLocked]);

  return (
    <group ref={groupRef} scale={1.22} position={[0, -0.22, 0]}>
      {/* ── Calyx Receptacle & Botanical Stem Base ── */}
      <mesh position={[0, -0.3, 0]} material={stemMaterial} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 1.4, 16]} />
      </mesh>
      <mesh position={[0, -0.02, 0]} material={sepalMaterial}>
        <sphereGeometry args={[0.34, 18, 14]} />
      </mesh>

      {/* ── 5 Pointed Calyx Sepals (peel back on bloom) ── */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <Sculpted3DPetal
          key={`sepal-${i}`}
          geometry={sepalGeom}
          material={sepalMaterial}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.12} // Closed bud: hugging upright
          targetAngle={1.65}  // Bloomed: flared out
          closedScale={[0.7, 0.9, 0.7]}
          targetScale={[1, 1, 1]}
          bloomProgress={bloomProgressRef.current}
          delay={0}
        />
      ))}

      {/* ── Layer 1: Outermost Heavy Rolled Petals (6 cabbage petals) ── */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <React.Fragment key={`outer-group-${i}`}>
          <Sculpted3DPetal
            geometry={outerGeom}
            material={outerMaterial}
            rotZ={(deg * Math.PI) / 180}
            closedAngle={-0.28} // Closed bud: folded tight inward
            targetAngle={1.18}  // Bloomed: wide open cabbage cup
            closedScale={[0.65, 0.95, 0.65]}
            targetScale={[1, 1, 1]}
            bloomProgress={bloomProgressRef.current}
            delay={i * 0.025}
          />
          {/* Thick Sculpted Rolled Lip */}
          <SculptedPetalRimLip
            width={1.45}
            height={1.7}
            material={outerMaterial}
            rotZ={(deg * Math.PI) / 180}
            closedAngle={-0.28}
            targetAngle={1.18}
            bloomProgress={bloomProgressRef.current}
            delay={i * 0.025}
          />
        </React.Fragment>
      ))}

      {/* ── Layer 2: Intermediate Concentric Cup Petals (6 petals offset by 30 deg) ── */}
      {[30, 90, 150, 210, 270, 330].map((deg, j) => (
        <React.Fragment key={`mid-group-${j}`}>
          <Sculpted3DPetal
            geometry={midGeom}
            material={outerMaterial}
            rotZ={(deg * Math.PI) / 180}
            closedAngle={-0.22}
            targetAngle={0.82}
            closedScale={[0.68, 0.92, 0.68]}
            targetScale={[1, 1, 1]}
            bloomProgress={bloomProgressRef.current}
            delay={0.1 + j * 0.02}
          />
          <SculptedPetalRimLip
            width={1.2}
            height={1.45}
            material={outerMaterial}
            rotZ={(deg * Math.PI) / 180}
            closedAngle={-0.22}
            targetAngle={0.82}
            bloomProgress={bloomProgressRef.current}
            delay={0.1 + j * 0.02}
          />
        </React.Fragment>
      ))}

      {/* ── Layer 3: Inner Rosette Layer (5 tightly cupped petals) ── */}
      {[0, 72, 144, 216, 288].map((deg, k) => (
        <Sculpted3DPetal
          key={`inner-${k}`}
          geometry={innerGeom}
          material={innerMaterial}
          rotZ={((deg + 18) * Math.PI) / 180}
          closedAngle={-0.15}
          targetAngle={0.52}
          closedScale={[0.7, 0.9, 0.7]}
          targetScale={[1, 1, 1]}
          bloomProgress={bloomProgressRef.current}
          delay={0.2 + k * 0.02}
        />
      ))}

      {/* ── Layer 4: Spiral Center Rosette Core (4 spiraling petals) ── */}
      {[45, 135, 225, 315].map((deg, m) => (
        <Sculpted3DPetal
          key={`core-${m}`}
          geometry={coreGeom}
          material={innerMaterial}
          rotZ={(deg * Math.PI) / 180}
          closedAngle={-0.08}
          targetAngle={0.28}
          closedScale={[0.75, 0.88, 0.75]}
          targetScale={[1, 1, 1]}
          bloomProgress={bloomProgressRef.current}
          delay={0.3 + m * 0.015}
        />
      ))}

      {/* Central Spiral Rose Heart Cone / Sphere */}
      <mesh position={[0, 0.22, 0]} material={innerMaterial}>
        <sphereGeometry args={[0.26, 18, 18]} />
      </mesh>
    </group>
  );
}

/**
 * Real 3D Sculpted Clay Rose Canvas
 */
export default function Real3DRose({
  flowerKey = "who-you-are",
  isOpen = false,
  isLocked = false,
  isFinal = false,
}) {
  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 2.1, 3.6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        {/* Studio Clay Lighting Rig (Soft shadows & specular rolled rim highlights) */}
        <ambientLight intensity={1.1} />
        {/* Key Light from upper right */}
        <directionalLight position={[4, 6, 4]} intensity={2.0} />
        {/* Fill Light from upper left */}
        <directionalLight position={[-4, 4, 3]} intensity={1.0} color="#FFF0F2" />
        {/* Back Rim Light */}
        <directionalLight position={[0, 3, -4]} intensity={0.9} color="#FFFFFF" />
        {/* Bottom Ambient Bounce */}
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#FAF0E6" />
        {/* Climax Glow for Flower 7 */}
        {isFinal && <pointLight position={[0, 1.2, 0]} intensity={2.5} color="#FFE680" />}

        <SculptedRoseModel
          themeKey={flowerKey}
          isOpen={isOpen}
          isLocked={isLocked}
          isFinal={isFinal}
        />
      </Canvas>
    </div>
  );
}
