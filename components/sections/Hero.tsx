"use client";
// components/sections/Hero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism Hero — STRICT GRID LAYOUT.
// FIXED: Increased Cube size, adjusted 3D camera zoom, right-aligned cube container.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";
import { siteConfig } from "@/config/site";

// ─── Procedural Textures ──────────────────────────────────────────────────────
const createTextures = () => {
  if (typeof document === "undefined") return { mapHoney1: null, mapHoney2: null };
  const draw = (
    ctx: CanvasRenderingContext2D,
    hexR: number, lw: number, bg: string, line: string
  ) => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.lineJoin = "round";
    const hS = hexR * Math.sqrt(3), vS = hexR * 1.5;
    for (let y = 0; y < 512 + vS; y += vS) {
      const off = Math.round(y / vS) % 2 !== 0;
      for (let x = 0; x < 512 + hS; x += hS) {
        const xp = off ? x + hS / 2 : x;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = xp + hexR * Math.cos(a), py = y + hexR * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  };
  const c1 = document.createElement("canvas"); c1.width = c1.height = 512;
  const cx1 = c1.getContext("2d"); if (cx1) draw(cx1, 12, 1, "#1a1208", "#2a1e0855");
  const c2 = document.createElement("canvas"); c2.width = c2.height = 512;
  const cx2 = c2.getContext("2d"); if (cx2) draw(cx2, 20, 1.5, "#261a06", "#1a1208");

  const t1 = new THREE.CanvasTexture(c1);
  t1.wrapS = t1.wrapT = THREE.RepeatWrapping; t1.repeat.set(1.5, 1.5);
  const t2 = new THREE.CanvasTexture(c2);
  t2.wrapS = t2.wrapT = THREE.RepeatWrapping; t2.repeat.set(1, 1);
  return { mapHoney1: t1, mapHoney2: t2 };
};

// ─── Materials ────────────────────────────────────────────────────────────────
const useCubeMaterials = () =>
  useMemo(() => {
    const { mapHoney1, mapHoney2 } = createTextures();
    const matDark = new THREE.MeshPhysicalMaterial({
      color: "#1a1208", metalness: 0.55, roughness: 0.3,
      clearcoat: 0.25, clearcoatRoughness: 0.15, envMapIntensity: 1.0,
    });
    const matMid = new THREE.MeshPhysicalMaterial({
      color: "#2e1f08", metalness: 0.45, roughness: 0.38,
      clearcoat: 0.15, clearcoatRoughness: 0.25, envMapIntensity: 0.8,
    });
    const matH1 = new THREE.MeshPhysicalMaterial({
      map: mapHoney1, bumpMap: mapHoney1, bumpScale: 0.015,
      metalness: 0.4, roughness: 0.5, clearcoat: 0.2, envMapIntensity: 0.6,
    });
    const matH2 = new THREE.MeshPhysicalMaterial({
      map: mapHoney2, bumpMap: mapHoney2, bumpScale: 0.025,
      metalness: 0.3, roughness: 0.5, clearcoat: 0.1, envMapIntensity: 0.5,
    });
    return { matSmoothDark: matDark, matSmoothLight: matMid, matHollowHoney1: matH1, matHollowHoney2: matH2 };
  }, []);

// ─── Cubie ────────────────────────────────────────────────────────────────────
type Mat = ReturnType<typeof useCubeMaterials>;
const Cubie = React.forwardRef<THREE.Mesh, {
  initPos: [number,number,number]; materials: Mat; onHover: (m: THREE.Mesh|null)=>void;
}>(({ initPos, materials, onHover }, ref) => {
  const faces = useMemo(() => {
    // Increased the frequency of honey materials in the pool to generate more honeybee faces
    const pool = [
      materials.matSmoothDark, 
      materials.matSmoothLight, 
      materials.matHollowHoney1, materials.matHollowHoney1, materials.matHollowHoney1, 
      materials.matHollowHoney2, materials.matHollowHoney2, materials.matHollowHoney2
    ];
    const r = () => pool[Math.floor(Math.random() * pool.length)];
    return [materials.matSmoothDark, r(), r(), r(), r(), r()];
  }, [materials]);
  return (
    <mesh ref={ref} position={initPos} castShadow receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); onHover(e.eventObject as THREE.Mesh); }}
      onPointerMove={(e) => { e.stopPropagation(); onHover(e.eventObject as THREE.Mesh); }}
      onPointerOut={(e)  => { e.stopPropagation(); onHover(null); }}
    >
      <RoundedBox args={[0.96,0.96,0.96]} radius={0.04} smoothness={4} material={faces} />
    </mesh>
  );
});
Cubie.displayName = "Cubie";

// ─── Rubik Engine ─────────────────────────────────────────────────────────────
type Axis = "x"|"y"|"z"; type Layer = -1|0|1; type Dir = 1|-1;
interface RMove { axis: Axis; moves: { layer: Layer; dir: Dir }[]; }
interface APivot { group: THREE.Group; axis: Axis; dir: Dir; cubies: THREE.Mesh[]; }

const TIMING = { minSpeed: 0.85, maxSpeed: 1.3, minPause: 0.2, maxPause: 0.6, userSpeed: 0.5 };
const SEQ: RMove[] = [
  { axis:"y", moves:[{layer:1,dir:1},{layer:-1,dir:-1}] },
  { axis:"x", moves:[{layer:-1,dir:-1}] },
  { axis:"z", moves:[{layer:1,dir:1},{layer:0,dir:1}] },
  { axis:"y", moves:[{layer:1,dir:-1}] },
  { axis:"x", moves:[{layer:1,dir:1},{layer:-1,dir:-1}] },
  { axis:"z", moves:[{layer:-1,dir:-1}] },
  { axis:"y", moves:[{layer:0,dir:1},{layer:1,dir:1}] },
  { axis:"x", moves:[{layer:1,dir:-1}] },
  { axis:"y", moves:[{layer:-1,dir:-1},{layer:1,dir:-1}] },
  { axis:"z", moves:[{layer:0,dir:1}] },
  { axis:"x", moves:[{layer:-1,dir:-1},{layer:1,dir:1}] },
  { axis:"y", moves:[{layer:-1,dir:1}] },
];

function RubikGroup() {
  const outerRef = useRef<THREE.Group>(null!);
  const sceneRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();
  const cubieRefs = useRef<(THREE.Mesh|null)[]>([]);
  const materials = useCubeMaterials();

  const tgtRot = useRef({ x: 0.35, y: -0.4 });
  const curRot = useRef({ x: 0.35, y: -0.4 });
  const idleSpin = useRef(0);
  const moveIdx = useRef(0), moveTimer = useRef(0), movePause = useRef(1.5), moveDur = useRef(0.35);
  const hoveredCubie = useRef<THREE.Mesh|null>(null);
  const lastMouse = useRef({ x:0, y:0 });
  const userQ = useRef<RMove[]>([]);
  const interTimer = useRef(0);
  const isUser = useRef(false);
  const pivots = useRef<APivot[]>([]);

  const cubieData = useMemo(() => {
    const list: { initPos:[number,number,number] }[] = [];
    for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++)
      list.push({ initPos:[x,y,z] });
    return list;
  }, []);

  const startMove = (move: RMove, user=false) => {
    if (!sceneRef.current) return;
    const newP: APivot[] = [];
    move.moves.forEach((lm) => {
      const pivot = new THREE.Group(); sceneRef.current!.add(pivot);
      const sel: THREE.Mesh[] = [];
      cubieRefs.current.forEach((mesh) => {
        if (!mesh) return;
        const t = new THREE.Vector3(); mesh.getWorldPosition(t); sceneRef.current!.worldToLocal(t);
        const lc = move.axis==="x" ? t.x : move.axis==="y" ? t.y : t.z;
        if (Math.round(lc) === lm.layer) { sel.push(mesh); pivot.attach(mesh); }
      });
      newP.push({ group:pivot, axis:move.axis, dir:lm.dir, cubies:sel });
    });
    pivots.current = newP; moveTimer.current = 0; isUser.current = user;
    moveDur.current = user ? TIMING.userSpeed : TIMING.minSpeed + Math.random()*(TIMING.maxSpeed-TIMING.minSpeed);
  };

  const finishMove = () => {
    if (!pivots.current.length || !sceneRef.current) return;
    pivots.current.forEach((p) => {
      p.group.rotation[p.axis] = (Math.PI/2)*p.dir; p.group.updateMatrixWorld(true);
      p.cubies.forEach((m) => {
        sceneRef.current!.attach(m);
        m.position.x=Math.round(m.position.x); m.position.y=Math.round(m.position.y); m.position.z=Math.round(m.position.z);
        m.rotation.x=Math.round(m.rotation.x/(Math.PI/2))*(Math.PI/2);
        m.rotation.y=Math.round(m.rotation.y/(Math.PI/2))*(Math.PI/2);
        m.rotation.z=Math.round(m.rotation.z/(Math.PI/2))*(Math.PI/2);
        m.scale.set(1,1,1); m.updateMatrix();
      });
      sceneRef.current!.remove(p.group);
    });
    pivots.current = [];
    if (!isUser.current) moveIdx.current = (moveIdx.current+1)%SEQ.length;
    movePause.current = TIMING.minPause + Math.random()*(TIMING.maxPause-TIMING.minPause);
  };

  useFrame((_,delta) => {
    idleSpin.current += delta*0.045;
    tgtRot.current.y = mouse.x*1.2 + idleSpin.current;
    tgtRot.current.x = -mouse.y*1.2 + 0.35;
    curRot.current.x = THREE.MathUtils.lerp(curRot.current.x, tgtRot.current.x, 0.03);
    curRot.current.y = THREE.MathUtils.lerp(curRot.current.y, tgtRot.current.y, 0.03);
    if (outerRef.current) { outerRef.current.rotation.x=curRot.current.x; outerRef.current.rotation.y=curRot.current.y; }

    const dx=mouse.x-lastMouse.current.x, dy=mouse.y-lastMouse.current.y;
    lastMouse.current.x=mouse.x; lastMouse.current.y=mouse.y;
    const vel=Math.sqrt(dx*dx+dy*dy);
    if (vel>0.008 && hoveredCubie.current) {
      interTimer.current=1.0;
      if (!userQ.current.length && !pivots.current.length) {
        const isH=Math.abs(dx)>Math.abs(dy);
        const t=new THREE.Vector3(); hoveredCubie.current.getWorldPosition(t); sceneRef.current.worldToLocal(t);
        const axis:Axis=isH?"y":"x";
        const layer=Math.round(isH?t.y:t.x);
        const dir:Dir=isH?(dx>0?1:-1):(dy>0?-1:1);
        userQ.current.push({ axis, moves:[{layer:layer as Layer,dir}] });
      }
    }
    if (pivots.current.length) {
      moveTimer.current+=delta;
      const p=Math.min(moveTimer.current/moveDur.current,1);
      const ease=p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
      pivots.current.forEach((pv) => { pv.group.rotation[pv.axis]=ease*(Math.PI/2)*pv.dir; });
      if (p>=1) finishMove(); return;
    }
    if (userQ.current.length) { startMove(userQ.current.shift()!,true); return; }
    if (interTimer.current>0) { interTimer.current-=delta; return; }
    if (movePause.current>0) { movePause.current-=delta; return; }
    startMove(SEQ[moveIdx.current]);
  });

  return (
    <group ref={outerRef}>
      <group ref={sceneRef}>
        {cubieData.map((d,i)=>(
          <Cubie key={i}
            ref={(el)=>{ cubieRefs.current[i]=el; }}
            initPos={d.initPos} materials={materials}
            onHover={(m)=>{ hoveredCubie.current=m; }}
          />
        ))}
      </group>
    </group>
  );
}

// ─── Cube Scene — amber lighting ──────────────────────────────────────────────
function CubeScene() {
  return (
    <Canvas
      // FIX: Zoomed in the camera (Z from 9.5 to 8.5) and adjusted Y to center the larger cube perfectly
      camera={{ position:[0, -0.2, 8.5], fov: 36 }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias:true, alpha:true }}
      style={{ background:"transparent" }}
      resize={{ debounce:0 }}
    >
      <Environment preset="warehouse" />
      <ambientLight intensity={0.5} color="#c8a060" />
      <spotLight position={[12,14,10]} angle={0.25} penumbra={1} intensity={2.2} color="#f5c87a" castShadow />
      <spotLight position={[-8,-10,-6]} angle={0.5} penumbra={1} intensity={0.9} color="#a06030" />
      <pointLight position={[0,0,8]} intensity={0.4} color="#e8a020" />
      <RubikGroup />
    </Canvas>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER = [
  "ENTREPRENEURSHIP CELL","IISER BHOPAL","DEEP TECH INCUBATOR",
  "STUDENT FOUNDERS","PITCH YOUR IDEA","BUILD THE FUTURE",
  "SCIENCE × BUSINESS","IDEATE — INCUBATE — IMPACT",
];
function TickerTape() {
  const items = [...TICKER,...TICKER];
  return (
    <div className="w-full overflow-hidden py-3" style={{ borderTop:"1px solid rgba(255,255,255,0.15)", borderBottom:"1px solid rgba(255,255,255,0.15)" }}>
      <div className="flex gap-8 whitespace-nowrap" style={{ animation:"ticker 30s linear infinite", width:"max-content" }}>
        {items.map((item,i)=>(
          <span key={i} className="inline-flex items-center gap-8">
            <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"0.78rem", letterSpacing:"0.12em", color:"rgba(255,255,255,0.5)" }}>
              {item}
            </span>
            <span style={{ color:"#e8a020", fontSize:"0.6rem", opacity: 0.8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const container: Variants = {
    hidden: { opacity:0 },
    show: { opacity:1, transition:{ staggerChildren:0.08, delayChildren:0.05 } },
  };
  const line: Variants = {
    hidden: { opacity:0, y:32 },
    show: { opacity:1, y:0, transition:{ duration:0.75, ease:[0.16,1,0.3,1] } },
  };
  const fade: Variants = {
    hidden: { opacity:0, y:10 },
    show: { opacity:1, y:0, transition:{ duration:0.6, ease:"easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-transparent overflow-hidden">
      <h1 className="sr-only">Entrepreneurship Cell at IISER Bhopal — Student Startup Incubator</h1>

      {/* ── Top editorial bar ── */}
      <div className="relative z-10 w-full" style={{ borderBottom:"1px solid rgba(255,255,255,0.15)" }}>
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.3, duration:0.8 }}
          className="max-w-7xl mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between"
        >
          <span style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.58rem", letterSpacing:"0.16em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>
            Est. 2024 — IISER Bhopal
          </span>
          <span style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.58rem", letterSpacing:"0.16em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }} className="hidden md:block">
            Deep Tech Incubator ◆ Student Startup Hub
          </span>
        </motion.div>
      </div>

      {/* ── Main split layout (Strict CSS Grid) ── */}
      <div className="relative z-10 flex-grow w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-6 md:px-12 pt-16 pb-8 items-center">

        {/* LEFT: Headline - 7 Columns */}
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="lg:col-span-7 flex flex-col items-start text-left min-w-0 w-full py-8 lg:py-16 z-20"
        >
          {/* Eyebrow */}
          <motion.div variants={fade} className="mb-8">
            <span className="inline-flex items-center gap-3" style={{
              fontFamily:"'DM Mono', monospace", fontSize:"0.62rem",
              letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)",
            }}>
              <span className="w-5 h-px" style={{ background:"#e8a020", animation:"amber-pulse 2s ease-in-out infinite" }} />
              Entrepreneurship Cell
            </span>
          </motion.div>

          {/* Headline — 3 lines with adjusted sizing to prevent clipping */}
          <div className="overflow-hidden w-full">
            <motion.h2 variants={line}
              style={{ fontFamily:"'Bebas Neue', sans-serif", lineHeight:0.92, letterSpacing:"0.01em", color:"#ffffff" }}
              className="text-[clamp(2.8rem,6.2vw,6rem)] xl:text-[6.5rem] block w-full whitespace-nowrap"
            >TURN</motion.h2>
          </div>
          <div className="overflow-hidden w-full">
            <motion.h2 variants={line}
              style={{ fontFamily:"'Bebas Neue', sans-serif", lineHeight:0.92, letterSpacing:"0.01em" }}
              className="text-[clamp(2.8rem,6.2vw,6rem)] xl:text-[6.5rem] block w-full whitespace-nowrap"
            >
              <span style={{ color:"#e8a020" }}>BREAK</span>
              <span style={{ color:"#ffffff" }}>THROUGHS</span>
            </motion.h2>
          </div>
          <div className="overflow-hidden w-full">
            <motion.h2 variants={line}
              style={{ fontFamily:"'Bebas Neue', sans-serif", lineHeight:0.92, letterSpacing:"0.01em", color:"#ffffff" }}
              className="text-[clamp(2.8rem,6.2vw,6rem)] xl:text-[6.5rem] block w-full whitespace-nowrap"
            >INTO BUSI<span style={{ color:"#e8a020" }}>NESSES.</span></motion.h2>
          </div>

          {/* Divider + sub-copy + CTAs */}
          <motion.div variants={fade}
            className="mt-10 w-full flex flex-col items-start gap-8 pt-8"
            style={{ borderTop:"1px solid rgba(255,255,255,0.15)" }}
          >
            <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.85rem", lineHeight:1.75, color:"rgba(255,255,255,0.7)", maxWidth:"640px" }}>
              {(siteConfig as any).hero?.subheadline ?? "Welcome to the Entrepreneurship Cell at IISER Bhopal. As the premier student startup incubator on campus, we provide the resources, mentorship, and platform to help visionary minds translate academic excellence into real-world impact. Stop waiting. Start building your startup today."}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
              <Link href="#pitch">
                <motion.button
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 transition-all duration-200"
                  style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase", background:"#e8a020", color:"#0c0b09", fontWeight:700 }}
                >
                  Pitch Your Idea
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.button>
              </Link>
              <Link href="#vision">
                <button
                  style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.3)", color:"#ffffff", padding:"14px 24px", fontWeight: 600 }}
                  className="hover:bg-white/5 transition-all duration-200"
                >
                  OUR VISION
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Interactive Rubik's Cube - 5 Columns */}
        <motion.div
          initial={{ opacity:0, scale:0.88, filter:"blur(12px)" }}
          animate={{ opacity:1, scale:1, filter:"blur(0px)" }}
          transition={{ duration:1.4, ease:"easeOut", delay:0.3 }}
          // FIX: Bumped max-w to 600px and pushed to the right using lg:ml-auto lg:mr-0 for better balance
          className="lg:col-span-5 relative w-full aspect-square max-w-[600px] mx-auto lg:ml-auto lg:mr-0 z-30 cursor-grab active:cursor-grabbing pointer-events-auto mt-8 lg:mt-0"
        >
          {/* Subtle amber glow behind cube */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:"radial-gradient(circle at 50% 50%, rgba(232,160,32,0.15) 0%, transparent 65%)",
              filter:"blur(20px)", borderRadius:"50%",
            }}
          />
          <CubeScene />
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, delay:0.6 }}
        className="relative z-10 w-full" style={{ borderTop:"1px solid rgba(255,255,255,0.15)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {((siteConfig as any).hero?.stats ?? [
              { value:"2024", label:"Founded" },
              { value:"100+", label:"Students" },
              { value:"∞",    label:"Ideas" },
              { value:"IISER",label:"Research-First" },
            ]).map((stat: any, i: number) => (
              <div key={i} className="py-6 px-6 flex flex-col gap-1"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none" }}
              >
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"2.2rem", lineHeight:1, color:"#e8a020" }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.58rem", letterSpacing:"0.16em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", marginTop:4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Ticker tape ── */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ duration:0.8, delay:0.8 }}
        className="relative z-10"
      >
        <TickerTape />
      </motion.div>
    </section>
  );
}