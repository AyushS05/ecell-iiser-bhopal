"use client";
// components/sections/Hero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism Hero.
// Rubik's cube: full-bleed centered background, faded to depth.
// Typography: Bebas Neue oversized stacked headline. Single amber accent.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";
import { siteConfig } from "@/config/site";

// ─────────────────────────────────────────────────────────────────────────────
// Procedural Texture Generator (kept from original)
// ─────────────────────────────────────────────────────────────────────────────
const createTextures = () => {
  if (typeof document === "undefined") return { mapHoney1: null, mapHoney2: null };

  const drawHollowHoneycomb = (
    ctx: CanvasRenderingContext2D,
    hexRadius: number,
    lineWidth: number,
    bgCol: string,
    lineCol: string
  ) => {
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    const hSpacing = hexRadius * Math.sqrt(3);
    const vSpacing = hexRadius * 1.5;
    for (let y = 0; y < 512 + vSpacing; y += vSpacing) {
      const isOffset = Math.round(y / vSpacing) % 2 !== 0;
      for (let x = 0; x < 512 + hSpacing; x += hSpacing) {
        const xPos = isOffset ? x + hSpacing / 2 : x;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = xPos + hexRadius * Math.cos(angle);
          const py = y + hexRadius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  const canvasH1 = document.createElement("canvas");
  canvasH1.width = 512; canvasH1.height = 512;
  const ctxH1 = canvasH1.getContext("2d");
  if (ctxH1) drawHollowHoneycomb(ctxH1, 12, 1, "#1a1208", "#2a1e0866");

  const canvasH2 = document.createElement("canvas");
  canvasH2.width = 512; canvasH2.height = 512;
  const ctxH2 = canvasH2.getContext("2d");
  if (ctxH2) drawHollowHoneycomb(ctxH2, 20, 1.5, "#261a06", "#1a1208");

  const mapHoney1 = new THREE.CanvasTexture(canvasH1);
  mapHoney1.wrapS = mapHoney1.wrapT = THREE.RepeatWrapping;
  mapHoney1.repeat.set(1.5, 1.5);

  const mapHoney2 = new THREE.CanvasTexture(canvasH2);
  mapHoney2.wrapS = mapHoney2.wrapT = THREE.RepeatWrapping;
  mapHoney2.repeat.set(1, 1);

  return { mapHoney1, mapHoney2 };
};

// ─────────────────────────────────────────────────────────────────────────────
// Rubik Engine types & config (kept from original)
// ─────────────────────────────────────────────────────────────────────────────
type Axis  = "x" | "y" | "z";
type Layer = -1 | 0 | 1;
type Dir   =  1 | -1;

interface LayerMove { layer: Layer; dir: Dir; }
interface RubikMove { axis: Axis; moves: LayerMove[]; }

const TIMING_CONFIG = {
  minMoveSpeed: 0.85, maxMoveSpeed: 1.3,
  minPause: 0.2, maxPause: 0.6,
  userFlickSpeed: 0.5,
};

const SOLVE_SEQUENCE: RubikMove[] = [
  { axis: "y", moves: [{ layer: 1, dir: 1 }, { layer: -1, dir: -1 }] },
  { axis: "x", moves: [{ layer: -1, dir: -1 }] },
  { axis: "z", moves: [{ layer: 1, dir: 1 }, { layer: 0, dir: 1 }] },
  { axis: "y", moves: [{ layer: 1, dir: -1 }] },
  { axis: "x", moves: [{ layer: 1, dir: 1 }, { layer: -1, dir: -1 }] },
  { axis: "z", moves: [{ layer: -1, dir: -1 }] },
  { axis: "y", moves: [{ layer: 0, dir: 1 }, { layer: 1, dir: 1 }] },
  { axis: "x", moves: [{ layer: 1, dir: -1 }] },
  { axis: "y", moves: [{ layer: -1, dir: -1 }, { layer: 1, dir: -1 }] },
  { axis: "z", moves: [{ layer: 0, dir: 1 }] },
  { axis: "x", moves: [{ layer: -1, dir: -1 }, { layer: 1, dir: 1 }] },
  { axis: "y", moves: [{ layer: -1, dir: 1 }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Materials — recolored to amber/bronze palette
// ─────────────────────────────────────────────────────────────────────────────
const useCubeMaterials = () => {
  return useMemo(() => {
    const { mapHoney1, mapHoney2 } = createTextures();

    const matDark = new THREE.MeshPhysicalMaterial({
      color: "#1a1208", metalness: 0.5, roughness: 0.3,
      clearcoat: 0.2, clearcoatRoughness: 0.2, envMapIntensity: 0.8,
    });

    const matMid = new THREE.MeshPhysicalMaterial({
      color: "#2e1f08", metalness: 0.4, roughness: 0.4,
      clearcoat: 0.1, clearcoatRoughness: 0.3, envMapIntensity: 0.6,
    });

    const matHoney1 = new THREE.MeshPhysicalMaterial({
      map: mapHoney1, bumpMap: mapHoney1, bumpScale: 0.01,
      metalness: 0.4, roughness: 0.5, clearcoat: 0.15,
      clearcoatRoughness: 0.4, envMapIntensity: 0.5,
    });

    const matHoney2 = new THREE.MeshPhysicalMaterial({
      map: mapHoney2, bumpMap: mapHoney2, bumpScale: 0.02,
      metalness: 0.3, roughness: 0.5, clearcoat: 0.08,
      clearcoatRoughness: 0.5, envMapIntensity: 0.4,
    });

    return { matSmoothDark: matDark, matSmoothLight: matMid, matHollowHoney1: matHoney1, matHollowHoney2: matHoney2 };
  }, []);
};

// ─────────────────────────────────────────────────────────────────────────────
// Cubie Component (unchanged logic)
// ─────────────────────────────────────────────────────────────────────────────
interface CubieProps {
  initPos: [number, number, number];
  materials: ReturnType<typeof useCubeMaterials>;
  onHover: (mesh: THREE.Mesh | null) => void;
}

const Cubie = React.forwardRef<THREE.Mesh, CubieProps>(({ initPos, materials, onHover }, ref) => {
  const faceMaterials = useMemo(() => {
    const pool = [materials.matSmoothDark, materials.matSmoothLight, materials.matHollowHoney1, materials.matHollowHoney2];
    const getRandom = () => pool[Math.floor(Math.random() * pool.length)];
    return [materials.matSmoothDark, getRandom(), getRandom(), getRandom(), getRandom(), getRandom()];
  }, [materials]);

  return (
    <mesh
      ref={ref} position={initPos} castShadow receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); onHover(e.eventObject as THREE.Mesh); }}
      onPointerMove={(e) => { e.stopPropagation(); onHover(e.eventObject as THREE.Mesh); }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
    >
      <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.04} smoothness={4} material={faceMaterials} />
    </mesh>
  );
});
Cubie.displayName = "Cubie";

// ─────────────────────────────────────────────────────────────────────────────
// Rubik Engine (unchanged logic)
// ─────────────────────────────────────────────────────────────────────────────
interface ActivePivot { group: THREE.Group; axis: Axis; dir: Dir; cubies: THREE.Mesh[]; }

function RubikGroup() {
  const outerRef = useRef<THREE.Group>(null!);
  const sceneRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();
  const cubieRefs = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useCubeMaterials();

  const targetRot  = useRef({ x: 0.35, y: -0.4 });
  const currentRot = useRef({ x: 0.35, y: -0.4 });
  const idleSpin   = useRef(0);
  const moveIdx             = useRef(0);
  const moveTimer           = useRef(0);
  const movePause           = useRef(1.5);
  const currentMoveDuration = useRef(0.35);
  const hoveredCubie     = useRef<THREE.Mesh | null>(null);
  const lastMousePos     = useRef({ x: 0, y: 0 });
  const userQueue        = useRef<RubikMove[]>([]);
  const interactionTimer = useRef(0);
  const isUserMove       = useRef(false);
  const activePivots = useRef<ActivePivot[]>([]);

  const cubieData = useMemo(() => {
    const list: { initPos: [number, number, number] }[] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++)
          list.push({ initPos: [x, y, z] });
    return list;
  }, []);

  const startMove = (move: RubikMove, userInitiated = false) => {
    if (!sceneRef.current) return;
    const newPivots: ActivePivot[] = [];
    move.moves.forEach((layerMove) => {
      const pivot = new THREE.Group();
      sceneRef.current!.add(pivot);
      const selected: THREE.Mesh[] = [];
      cubieRefs.current.forEach((mesh) => {
        if (!mesh) return;
        const target = new THREE.Vector3();
        mesh.getWorldPosition(target);
        sceneRef.current!.worldToLocal(target);
        const layerCoord = move.axis === "x" ? target.x : move.axis === "y" ? target.y : target.z;
        if (Math.round(layerCoord) === layerMove.layer) {
          selected.push(mesh);
          pivot.attach(mesh);
        }
      });
      newPivots.push({ group: pivot, axis: move.axis, dir: layerMove.dir, cubies: selected });
    });
    activePivots.current = newPivots;
    moveTimer.current    = 0;
    isUserMove.current   = userInitiated;
    currentMoveDuration.current = userInitiated
      ? TIMING_CONFIG.userFlickSpeed
      : TIMING_CONFIG.minMoveSpeed + Math.random() * (TIMING_CONFIG.maxMoveSpeed - TIMING_CONFIG.minMoveSpeed);
  };

  const finishMove = () => {
    if (activePivots.current.length === 0 || !sceneRef.current) return;
    activePivots.current.forEach((pivotObj) => {
      pivotObj.group.rotation[pivotObj.axis] = (Math.PI / 2) * pivotObj.dir;
      pivotObj.group.updateMatrixWorld(true);
      pivotObj.cubies.forEach((mesh) => {
        sceneRef.current!.attach(mesh);
        mesh.position.x = Math.round(mesh.position.x);
        mesh.position.y = Math.round(mesh.position.y);
        mesh.position.z = Math.round(mesh.position.z);
        mesh.rotation.x = Math.round(mesh.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
        mesh.rotation.y = Math.round(mesh.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
        mesh.rotation.z = Math.round(mesh.rotation.z / (Math.PI / 2)) * (Math.PI / 2);
        mesh.scale.set(1, 1, 1);
        mesh.updateMatrix();
      });
      sceneRef.current!.remove(pivotObj.group);
    });
    activePivots.current = [];
    if (!isUserMove.current) moveIdx.current = (moveIdx.current + 1) % SOLVE_SEQUENCE.length;
    movePause.current = TIMING_CONFIG.minPause + Math.random() * (TIMING_CONFIG.maxPause - TIMING_CONFIG.minPause);
  };

  useFrame((_, delta) => {
    idleSpin.current    += delta * 0.04;
    targetRot.current.y  = mouse.x * 1.0 + idleSpin.current;
    targetRot.current.x  = -mouse.y * 1.0 + 0.35;
    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.current.x, 0.025);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.current.y, 0.025);
    if (outerRef.current) {
      outerRef.current.rotation.x = currentRot.current.x;
      outerRef.current.rotation.y = currentRot.current.y;
    }
    const deltaX = mouse.x - lastMousePos.current.x;
    const deltaY = mouse.y - lastMousePos.current.y;
    lastMousePos.current.x = mouse.x;
    lastMousePos.current.y = mouse.y;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (velocity > 0.008 && hoveredCubie.current) {
      interactionTimer.current = 1.0;
      if (userQueue.current.length === 0 && activePivots.current.length === 0) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        const target = new THREE.Vector3();
        hoveredCubie.current.getWorldPosition(target);
        sceneRef.current.worldToLocal(target);
        const axis: Axis = isHorizontal ? "y" : "x";
        const layer = Math.round(isHorizontal ? target.y : target.x);
        const dir: Dir = isHorizontal ? (deltaX > 0 ? 1 : -1) : (deltaY > 0 ? -1 : 1);
        userQueue.current.push({ axis, moves: [{ layer: layer as Layer, dir }] });
      }
    }
    if (activePivots.current.length > 0) {
      moveTimer.current += delta;
      const progress = Math.min(moveTimer.current / currentMoveDuration.current, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      activePivots.current.forEach((pivotObj) => {
        pivotObj.group.rotation[pivotObj.axis] = ease * (Math.PI / 2) * pivotObj.dir;
      });
      if (progress >= 1) finishMove();
      return;
    }
    if (userQueue.current.length > 0) { startMove(userQueue.current.shift()!, true); return; }
    if (interactionTimer.current > 0) { interactionTimer.current -= delta; return; }
    if (movePause.current > 0) { movePause.current -= delta; return; }
    startMove(SOLVE_SEQUENCE[moveIdx.current], false);
  });

  return (
    <group ref={outerRef}>
      <group ref={sceneRef}>
        {cubieData.map((d, i) => (
          <Cubie
            key={i}
            ref={(el) => { cubieRefs.current[i] = el; }}
            initPos={d.initPos}
            materials={materials}
            onHover={(mesh) => { hoveredCubie.current = mesh; }}
          />
        ))}
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cube Scene — amber-toned lighting
// ─────────────────────────────────────────────────────────────────────────────
function CubeScene() {
  return (
    <Canvas
      camera={{ position: [0, -0.5, 8.5], fov: 38 }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      resize={{ debounce: 0 }}
    >
      <Environment preset="warehouse" />
      <ambientLight intensity={0.4} color="#c8a060" />
      <spotLight position={[12, 14, 10]} angle={0.25} penumbra={1} intensity={2.0} color="#f5c87a" castShadow />
      <spotLight position={[-8, -10, -6]} angle={0.5} penumbra={1} intensity={0.8} color="#a06030" />
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#e8a020" />
      <RubikGroup />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ticker Tape — runs across bottom of hero
// ─────────────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "ENTREPRENEURSHIP CELL", "IISER BHOPAL", "DEEP TECH INCUBATOR",
  "STUDENT FOUNDERS", "PITCH YOUR IDEA", "BUILD THE FUTURE",
  "SCIENCE × BUSINESS", "IISER BHOPAL", "IDEATE — INCUBATE — IMPACT",
];

function TickerTape() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full overflow-hidden border-t border-b border-white/[0.08] py-3 select-none">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "ticker 28s linear infinite", width: "max-content" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span
              style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.12em" }}
              className="text-white/30"
            >
              {item}
            </span>
            <span className="text-amber-500/40 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const fadeVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-transparent overflow-hidden">
      {/* Hidden SEO H1 */}
      <h1 className="sr-only">Entrepreneurship Cell at IISER Bhopal — Student Startup Incubator</h1>

      {/* ── Rubik's Cube: full-bleed centered background ── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        {/* Cube itself — large, centered, faded */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          className="w-[520px] h-[520px] md:w-[680px] md:h-[680px] pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ opacity: 0.22 }}
        >
          <CubeScene />
        </motion.div>

        {/* Vignette to fade cube into text */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, #0c0b09 80%),
              linear-gradient(to bottom, #0c0b09 0%, transparent 15%, transparent 80%, #0c0b09 100%)
            `,
          }}
        />
      </div>

      {/* Horizontal rule — header separator */}
      <div className="relative z-10 w-full border-b border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between"
        >
          <span
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em" }}
            className="text-white/25 uppercase"
          >
            Est. 2024 — IISER Bhopal
          </span>
          <span
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em" }}
            className="text-white/25 uppercase hidden md:block"
          >
            Deep Tech Incubator ◆ Student Startup Hub
          </span>
        </motion.div>
      </div>

      {/* ── Main Headline Block ── */}
      <div className="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-12 pt-12 pb-8 max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          {/* Eyebrow tag */}
          <motion.div variants={fadeVariants} className="mb-6">
            <span
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em" }}
              className="inline-flex items-center gap-3 text-white/35 uppercase"
            >
              <span
                className="w-5 h-px"
                style={{ background: "var(--color-amber)", animation: "amber-pulse 2s ease-in-out infinite" }}
              />
              Entrepreneurship Cell
            </span>
          </motion.div>

          {/* Main display headline */}
          <div className="overflow-hidden">
            <motion.h2
              variants={lineVariants}
              style={{ fontFamily: "var(--font-display)", lineHeight: 0.92, letterSpacing: "0.01em" }}
              className="text-[clamp(5rem,14vw,11rem)] text-white/90 block"
            >
              TURN
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              variants={lineVariants}
              style={{ fontFamily: "var(--font-display)", lineHeight: 0.92, letterSpacing: "0.01em" }}
              className="text-[clamp(5rem,14vw,11rem)] block"
              // Amber accent on this line
            >
              <span style={{ color: "var(--color-amber)" }}>BREAK</span>
              <span className="text-white/90">THROUGHS</span>
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              variants={lineVariants}
              style={{ fontFamily: "var(--font-display)", lineHeight: 0.92, letterSpacing: "0.01em" }}
              className="text-[clamp(5rem,14vw,11rem)] text-white/90 block"
            >
              INTO BUSINESSES.
            </motion.h2>
          </div>

          {/* Sub-copy + CTAs row */}
          <motion.div
            variants={fadeVariants}
            className="mt-10 flex flex-col md:flex-row items-start md:items-end gap-8 border-t border-white/[0.08] pt-8"
          >
            {/* Sub-copy */}
            <p
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: 1.7 }}
              className="text-white/40 max-w-sm flex-1"
            >
              {siteConfig.hero?.subheadline ?? "The Entrepreneurship Cell at IISER Bhopal — empowering student founders to build science-backed ventures."}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="#pitch">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    background: "var(--color-amber)",
                    color: "#0c0b09",
                  }}
                >
                  PITCH YOUR IDEA
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.button>
              </Link>

              <Link href="#vision">
                <button
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(240,237,230,0.55)",
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 hover:border-white/30 hover:text-white/80 transition-all duration-200"
                >
                  OUR VISION
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Stats Strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative z-10 w-full border-t border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {(siteConfig.hero?.stats ?? [
              { value: "2024", label: "Founded" },
              { value: "100+", label: "Students" },
              { value: "∞", label: "Ideas" },
              { value: "IISER", label: "Research-First" },
            ]).map((stat, i) => (
              <div
                key={i}
                className="py-6 px-6 flex flex-col gap-1"
                style={{
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div
                  style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", lineHeight: 1, color: "var(--color-amber)" }}
                >
                  {stat.value}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em" }}
                  className="text-white/30 uppercase mt-1"
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Ticker Tape ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10"
      >
        <TickerTape />
      </motion.div>
    </section>
  );
}