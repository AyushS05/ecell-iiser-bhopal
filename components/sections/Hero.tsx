"use client";
// components/sections/Hero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism Hero — Shatter & Rebuild Edition
//
// Improvements over previous version:
//   1. Emissive flash — cubies burst amber on shatter, fade out as they fall
//   2. Web Audio crack/crunch on shatter + soft "whoosh" on rebuild (no assets)
//   3. Spark trails on rebuild — tiny amber particles follow each cubie home
//   4. Hint text auto-hides after first shatter, never reappears
//   5. Double-click / double-tap anywhere on cube also triggers shatter
//   6. Jerk threshold lowered slightly — feels more responsive
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { motion, Variants, useAnimation } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";
import { siteConfig } from "@/config/site";

// ─── Web Audio — synthesised shatter + rebuild sounds ─────────────────────────
function playShatterSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Noise burst
    const bufLen = ctx.sampleRate * 0.18;
    const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++)
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2.5);

    const src  = ctx.createBufferSource();
    src.buffer = buf;

    // Band-pass to make it crunchy
    const bp      = ctx.createBiquadFilter();
    bp.type       = "bandpass";
    bp.frequency.value  = 1800;
    bp.Q.value          = 0.6;

    const gain        = ctx.createGain();
    gain.gain.value   = 0.55;

    src.connect(bp); bp.connect(gain); gain.connect(ctx.destination);
    src.start();

    // Low thud
    const osc        = ctx.createOscillator();
    osc.type         = "sine";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);
    const thudGain   = ctx.createGain();
    thudGain.gain.setValueAtTime(0.4, ctx.currentTime);
    thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(thudGain); thudGain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.25);

    setTimeout(() => ctx.close(), 500);
  } catch (_) {}
}

function playRebuildSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Rising shimmer
    const osc        = ctx.createOscillator();
    osc.type         = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + REBUILD_DUR);

    const gain       = ctx.createGain();
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.0,  ctx.currentTime + REBUILD_DUR);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + REBUILD_DUR + 0.1);

    setTimeout(() => ctx.close(), (REBUILD_DUR + 0.5) * 1000);
  } catch (_) {}
}

// ─── Procedural Textures ──────────────────────────────────────────────────────
const createTextures = () => {
  if (typeof document === "undefined") return { mapHoney1: null, mapHoney2: null };
  const draw = (ctx: CanvasRenderingContext2D, hexR: number, lw: number, bg: string, line: string) => {
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
    const matDark = new THREE.MeshPhysicalMaterial({ color: "#1a1208", metalness: 0.55, roughness: 0.3,  clearcoat: 0.25, clearcoatRoughness: 0.15, envMapIntensity: 1.0 });
    const matMid  = new THREE.MeshPhysicalMaterial({ color: "#2e1f08", metalness: 0.45, roughness: 0.38, clearcoat: 0.15, clearcoatRoughness: 0.25, envMapIntensity: 0.8 });
    const matH1   = new THREE.MeshPhysicalMaterial({ map: mapHoney1, bumpMap: mapHoney1, bumpScale: 0.015, metalness: 0.4, roughness: 0.5, clearcoat: 0.2, envMapIntensity: 0.6 });
    const matH2   = new THREE.MeshPhysicalMaterial({ map: mapHoney2, bumpMap: mapHoney2, bumpScale: 0.025, metalness: 0.3, roughness: 0.5, clearcoat: 0.1, envMapIntensity: 0.5 });
    return { matSmoothDark: matDark, matSmoothLight: matMid, matHollowHoney1: matH1, matHollowHoney2: matH2 };
  }, []);

type Mat = ReturnType<typeof useCubeMaterials>;

// ─── Physics constants ────────────────────────────────────────────────────────
const GRAVITY     = -11.0;
const FLOOR_Y     = -5.2;
const BOUNCE      = 0.30;
const FRICTION    = 0.86;
const ANG_DAMP    = 0.91;
const JERK_THRESH = 0.016;   // slightly more sensitive than before
const REBUILD_DUR = 1.9;

// ─── Easing ───────────────────────────────────────────────────────────────────
function easeOutBack(t: number): number {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ─── Rubik idle sequence ──────────────────────────────────────────────────────
type Axis = "x" | "y" | "z";
const SEQ: { axis: Axis; layer: -1 | 0 | 1; dir: 1 | -1 }[] = [
  { axis: "y", layer:  1, dir:  1 }, { axis: "x", layer: -1, dir: -1 },
  { axis: "z", layer:  1, dir:  1 }, { axis: "y", layer:  1, dir: -1 },
  { axis: "x", layer:  1, dir:  1 }, { axis: "z", layer: -1, dir: -1 },
  { axis: "y", layer:  0, dir:  1 }, { axis: "x", layer:  1, dir: -1 },
  { axis: "y", layer: -1, dir: -1 }, { axis: "z", layer:  0, dir:  1 },
  { axis: "x", layer: -1, dir: -1 }, { axis: "y", layer: -1, dir:  1 },
];

// ─── Cubie physics data ───────────────────────────────────────────────────────
interface CubiePhysics {
  home:          THREE.Vector3;
  homeQuat:      THREE.Quaternion;
  vel:           THREE.Vector3;
  angVel:        THREE.Vector3;
  onFloor:       boolean;
  rebuildFrom?:  THREE.Vector3;
  rebuildFromQ?: THREE.Quaternion;
  rebuildDelay:  number;
  // emissive flash
  flashTimer:    number;
}

type CubeState = "IDLE" | "SHATTERING" | "FALLEN" | "REBUILDING";

// ─── Spark particle ───────────────────────────────────────────────────────────
interface Spark {
  mesh:     THREE.Mesh;
  vel:      THREE.Vector3;
  life:     number;
  maxLife:  number;
}

// ─── RubikGroup ───────────────────────────────────────────────────────────────
function RubikGroup({ materials, onShatter, onRebuildStart }: {
  materials:      Mat;
  onShatter:      () => void;
  onRebuildStart: () => void;
}) {
  const outerRef = useRef<THREE.Group>(null!);
  const sceneRef = useRef<THREE.Group>(null!);
  const { mouse, gl, scene: threeScene } = useThree();

  const cubieRefs = useRef<(THREE.Mesh | null)[]>([]);

  const cubieData = useMemo(() => {
    const list: { pos: [number, number, number] }[] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++)
          list.push({ pos: [x, y, z] });
    return list;
  }, []);

  const facePool = useMemo(() => [
    materials.matSmoothDark, materials.matSmoothLight,
    materials.matHollowHoney1, materials.matHollowHoney1, materials.matHollowHoney1,
    materials.matHollowHoney2, materials.matHollowHoney2, materials.matHollowHoney2,
  ], [materials]);

  const cubieFaces: THREE.Material[][] = useMemo(() => {
    return cubieData.map(() => [
      materials.matSmoothDark,
      facePool[Math.floor(Math.random() * facePool.length)],
      facePool[Math.floor(Math.random() * facePool.length)],
      facePool[Math.floor(Math.random() * facePool.length)],
      facePool[Math.floor(Math.random() * facePool.length)],
      facePool[Math.floor(Math.random() * facePool.length)],
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Emissive materials — one clone per cubie face array so we can tween independently
  const emissiveMats = useRef<THREE.MeshPhysicalMaterial[][]>([]);
  useEffect(() => {
    emissiveMats.current = cubieFaces.map(faces =>
      faces.map(f => {
        const m = (f as THREE.MeshPhysicalMaterial).clone();
        m.emissive    = new THREE.Color("#e8a020");
        m.emissiveIntensity = 0;
        return m;
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sparks pool
  const sparks = useRef<Spark[]>([]);
  const sparkGeo = useMemo(() => new THREE.SphereGeometry(0.04, 4, 4), []);
  const sparkMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#e8a020", transparent: true }), []);

  // State
  const stateRef     = useRef<CubeState>("IDLE");
  const shatterTimer = useRef(0);
  const fallenTimer  = useRef(0);
  const rebuildTimer = useRef(0);

  const outerRot = useRef({ x: 0.35, y: -0.4 });
  const curRot   = useRef({ x: 0.35, y: -0.4 });
  const idleSpin = useRef(0);

  const isDragging  = useRef(false);
  const prevMouse   = useRef({ x: 0, y: 0 });
  const velHistory  = useRef<{ vx: number; vy: number; t: number }[]>([]);
  const lastTapTime = useRef(0);

  const seqIdx       = useRef(0);
  const moveProgress = useRef(0);
  const movePause    = useRef(1.5);
  const moveDur      = useRef(0.5);
  const pivot        = useRef<THREE.Group | null>(null);
  const activeMeshes = useRef<THREE.Mesh[]>([]);
  const activeAxis   = useRef<Axis>("y");
  const activeDir    = useRef<1 | -1>(1);

  // ── Switch cubie materials to/from emissive clones ──────────────────────────
  const applyEmissiveMats = useCallback((on: boolean) => {
    cubieRefs.current.forEach((m, i) => {
      if (!m) return;
      m.material = on
        ? emissiveMats.current[i] ?? cubieFaces[i]
        : cubieFaces[i];
    });
  }, [cubieFaces]);

  // ── Spawn sparks around a world position ─────────────────────────────────────
  const spawnSparks = useCallback((pos: THREE.Vector3, count: number) => {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(sparkGeo, sparkMat.clone());
      mesh.position.copy(pos).addScaledVector(
        new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
        0.3 + Math.random() * 0.4
      );
      threeScene.add(mesh);
      sparks.current.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random()-0.5) * 2,
          Math.random() * 3 + 1,
          (Math.random()-0.5) * 2
        ),
        life:    0,
        maxLife: 0.4 + Math.random() * 0.3,
      });
    }
  }, [threeScene, sparkGeo, sparkMat]);

  // ── Pointer events ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;
    const normXY = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 };
    };

    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current  = normXY(e);
      velHistory.current = [];

      // Double-tap / double-click to shatter
      const now = performance.now();
      if (now - lastTapTime.current < 350 && stateRef.current === "IDLE") {
        triggerShatter([{ vx: 0.05, vy: 0.05, t: now }]);
      }
      lastTapTime.current = now;
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const n  = normXY(e);
      const vx = n.x - prevMouse.current.x;
      const vy = n.y - prevMouse.current.y;
      velHistory.current.push({ vx, vy, t: performance.now() });
      if (velHistory.current.length > 10) velHistory.current.shift();
      if (stateRef.current === "IDLE") {
        outerRot.current.y += vx * 3.5;
        outerRot.current.x -= vy * 3.5;
      }
      prevMouse.current = n;
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (stateRef.current !== "IDLE") { velHistory.current = []; return; }
      const now    = performance.now();
      const recent = velHistory.current.filter(v => now - v.t < 130);
      if (recent.length > 1) {
        let sumSq = 0;
        for (const v of recent) sumSq += v.vx * v.vx + v.vy * v.vy;
        if (Math.sqrt(sumSq / recent.length) > JERK_THRESH) triggerShatter(recent);
      }
      velHistory.current = [];
    };

    canvas.addEventListener("pointerdown",  onDown);
    canvas.addEventListener("pointermove",  onMove);
    canvas.addEventListener("pointerup",    onUp);
    canvas.addEventListener("pointerleave", onUp);
    return () => {
      canvas.removeEventListener("pointerdown",  onDown);
      canvas.removeEventListener("pointermove",  onMove);
      canvas.removeEventListener("pointerup",    onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  // ── Shatter ──────────────────────────────────────────────────────────────────
  const triggerShatter = useCallback((recentVels: { vx: number; vy: number; t: number }[]) => {
    if (!sceneRef.current) return;
    stateRef.current     = "SHATTERING";
    shatterTimer.current = 0;
    onShatter();
    playShatterSound();

    // Switch to emissive clones for the flash
    applyEmissiveMats(true);

    let jx = 0, jy = 0;
    for (const v of recentVels) { jx += v.vx; jy += v.vy; }
    jx /= recentVels.length; jy /= recentVels.length;

    if (pivot.current) {
      pivot.current.updateMatrixWorld(true);
      activeMeshes.current.forEach(m => {
        sceneRef.current.attach(m);
        m.position.x = Math.round(m.position.x);
        m.position.y = Math.round(m.position.y);
        m.position.z = Math.round(m.position.z);
        m.scale.set(1, 1, 1);
      });
      sceneRef.current.remove(pivot.current);
      pivot.current        = null;
      activeMeshes.current = [];
    }

    cubieRefs.current.forEach(m => {
      if (!m) return;
      const phys = m.userData as CubiePhysics;
      m.removeFromParent();
      sceneRef.current.parent!.add(m);

      const spread = m.position.clone().normalize().multiplyScalar(0.4 + Math.random() * 0.6);
      const speed  = 3.5 + Math.random() * 4.5;
      phys.vel.set(
        spread.x * speed + jx * 10 + (Math.random() - 0.5) * 3,
        spread.y * speed + (-jy * 7) + Math.random() * 3 + 2,
        spread.z * speed + (Math.random() - 0.5) * 3
      );
      phys.angVel.set((Math.random()-0.5)*14, (Math.random()-0.5)*14, (Math.random()-0.5)*14);
      phys.onFloor   = false;
      phys.flashTimer = 0;

      // Spawn burst sparks at each cubie's world position
      spawnSparks(m.position, 3);
    });
  }, [onShatter, applyEmissiveMats, spawnSparks]);

  // ── Rebuild ───────────────────────────────────────────────────────────────────
  const triggerRebuild = useCallback(() => {
    stateRef.current     = "REBUILDING";
    rebuildTimer.current = 0;
    onRebuildStart();
    playRebuildSound();
    cubieRefs.current.forEach(m => {
      if (!m) return;
      const phys        = m.userData as CubiePhysics;
      phys.rebuildFrom  = m.position.clone();
      phys.rebuildFromQ = m.quaternion.clone();
      phys.rebuildDelay = Math.random() * 0.5;
    });
  }, [onRebuildStart]);

  // ── Frame loop ────────────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Tick sparks every frame regardless of cube state
    for (let i = sparks.current.length - 1; i >= 0; i--) {
      const s = sparks.current[i];
      s.life += dt;
      s.vel.y -= 6 * dt;
      s.mesh.position.addScaledVector(s.vel, dt);
      const prog = s.life / s.maxLife;
      const mat  = s.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 1 - prog;
      s.mesh.scale.setScalar(1 - prog * 0.8);
      if (s.life >= s.maxLife) {
        threeScene.remove(s.mesh);
        sparks.current.splice(i, 1);
      }
    }

    // IDLE
    if (stateRef.current === "IDLE") {
      idleSpin.current += dt * 0.045;
      if (!isDragging.current) {
        outerRot.current.y = mouse.x * 1.2 + idleSpin.current;
        outerRot.current.x = -mouse.y * 1.2 + 0.35;
      }
      curRot.current.x = THREE.MathUtils.lerp(curRot.current.x, outerRot.current.x, 0.03);
      curRot.current.y = THREE.MathUtils.lerp(curRot.current.y, outerRot.current.y, 0.03);
      if (outerRef.current) {
        outerRef.current.rotation.x = curRot.current.x;
        outerRef.current.rotation.y = curRot.current.y;
      }
      rubiTick(dt);
      return;
    }

    // SHATTERING
    if (stateRef.current === "SHATTERING") {
      shatterTimer.current += dt;
      let allSettled = true;

      cubieRefs.current.forEach((m, idx) => {
        if (!m) return;
        const phys = m.userData as CubiePhysics;
        if (phys.onFloor && Math.abs(phys.vel.y) < 0.05) {
          // Fade flash even when settled
          phys.flashTimer += dt;
          const eMats = emissiveMats.current[idx];
          if (eMats) eMats.forEach(em => { em.emissiveIntensity = Math.max(0, 1.2 - phys.flashTimer * 4); });
          return;
        }
        allSettled = false;

        phys.vel.y += GRAVITY * dt;
        m.position.addScaledVector(phys.vel, dt);
        m.rotation.x += phys.angVel.x * dt;
        m.rotation.y += phys.angVel.y * dt;
        m.rotation.z += phys.angVel.z * dt;
        phys.angVel.multiplyScalar(ANG_DAMP);

        // Fade emissive flash
        phys.flashTimer += dt;
        const eMats = emissiveMats.current[idx];
        if (eMats) eMats.forEach(em => { em.emissiveIntensity = Math.max(0, 1.2 - phys.flashTimer * 3.5); });

        if (m.position.y < FLOOR_Y) {
          m.position.y = FLOOR_Y;
          phys.vel.y  *= -BOUNCE;
          phys.vel.x  *= FRICTION;
          phys.vel.z  *= FRICTION;
          phys.angVel.multiplyScalar(0.55);
          if (Math.abs(phys.vel.y) < 0.15) { phys.vel.y = 0; phys.onFloor = true; }
        }
      });

      if (allSettled || shatterTimer.current > 2.8) {
        stateRef.current    = "FALLEN";
        fallenTimer.current = 0;
      }
      return;
    }

    // FALLEN
    if (stateRef.current === "FALLEN") {
      fallenTimer.current += dt;
      if (fallenTimer.current > 0.65) triggerRebuild();
      return;
    }

    // REBUILDING
    if (stateRef.current === "REBUILDING") {
      rebuildTimer.current += dt;
      let allDone = true;

      cubieRefs.current.forEach((m, idx) => {
        if (!m) return;
        const phys  = m.userData as CubiePhysics;
        const delay = phys.rebuildDelay;
        const t     = Math.max(0, Math.min(1, (rebuildTimer.current - delay) / (REBUILD_DUR - delay)));
        const ease  = easeOutBack(t);

        const homeWorld = phys.home.clone();
        sceneRef.current.localToWorld(homeWorld);

        m.position.lerpVectors(phys.rebuildFrom!, homeWorld, ease);
        m.quaternion.slerpQuaternions(phys.rebuildFromQ!, phys.homeQuat, Math.min(1, ease));

        // Spark trail as cubies fly home (only in first half of rebuild)
        if (t > 0.05 && t < 0.6 && Math.random() < 0.15) spawnSparks(m.position, 1);

        // Re-brighten emissive as they approach home, then fade
        const eMats = emissiveMats.current[idx];
        if (eMats) {
          const glow = t < 0.5 ? t * 2 * 0.4 : (1 - t) * 2 * 0.4;
          eMats.forEach(em => { em.emissiveIntensity = glow; });
        }

        if (t < 1) allDone = false;
      });

      if (allDone) {
        cubieRefs.current.forEach(m => {
          if (!m) return;
          const phys = m.userData as CubiePhysics;
          sceneRef.current.attach(m);
          m.position.copy(phys.home);
          m.quaternion.copy(phys.homeQuat);
          // Restore original non-emissive materials
        });
        applyEmissiveMats(false);
        outerRot.current = { x: 0.35, y: idleSpin.current - 0.4 };
        curRot.current   = { ...outerRot.current };
        if (outerRef.current) {
          outerRef.current.rotation.x = curRot.current.x;
          outerRef.current.rotation.y = curRot.current.y;
        }
        stateRef.current  = "IDLE";
        movePause.current = 0.8;
      }
      return;
    }
  });

  // ── Rubik idle tick ───────────────────────────────────────────────────────────
  function rubiTick(dt: number) {
    if (!sceneRef.current) return;
    if (pivot.current) {
      moveProgress.current += dt;
      const p    = Math.min(moveProgress.current / moveDur.current, 1);
      const ease = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
      pivot.current.rotation[activeAxis.current] = ease * (Math.PI/2) * activeDir.current;
      if (p >= 1) {
        pivot.current.rotation[activeAxis.current] = (Math.PI/2) * activeDir.current;
        pivot.current.updateMatrixWorld(true);
        activeMeshes.current.forEach(m => {
          sceneRef.current.attach(m);
          m.position.x = Math.round(m.position.x);
          m.position.y = Math.round(m.position.y);
          m.position.z = Math.round(m.position.z);
          m.rotation.x = Math.round(m.rotation.x/(Math.PI/2))*(Math.PI/2);
          m.rotation.y = Math.round(m.rotation.y/(Math.PI/2))*(Math.PI/2);
          m.rotation.z = Math.round(m.rotation.z/(Math.PI/2))*(Math.PI/2);
          m.scale.set(1,1,1); m.updateMatrix();
        });
        sceneRef.current.remove(pivot.current!);
        pivot.current = null; activeMeshes.current = [];
        seqIdx.current    = (seqIdx.current + 1) % SEQ.length;
        movePause.current = 0.2 + Math.random() * 0.4;
      }
      return;
    }
    movePause.current -= dt;
    if (movePause.current > 0) return;
    const mv = SEQ[seqIdx.current];
    const newPivot = new THREE.Group();
    sceneRef.current.add(newPivot);
    pivot.current = newPivot; activeAxis.current = mv.axis; activeDir.current = mv.dir;
    activeMeshes.current = [];
    cubieRefs.current.forEach(m => {
      if (!m) return;
      const t = new THREE.Vector3(); m.getWorldPosition(t); sceneRef.current.worldToLocal(t);
      const lc = mv.axis==="x"?t.x:mv.axis==="y"?t.y:t.z;
      if (Math.round(lc) === mv.layer) { activeMeshes.current.push(m); newPivot.attach(m); }
    });
    moveProgress.current = 0;
    moveDur.current = 0.5 + Math.random() * 0.3;
  }

  return (
    <group ref={outerRef}>
      <group ref={sceneRef}>
        {cubieData.map((d, i) => (
          <mesh
            key={i}
            ref={el => {
              cubieRefs.current[i] = el;
              if (!el) return;
              if (!el.userData.home) {
                const phys: CubiePhysics = {
                  home: new THREE.Vector3(...d.pos), homeQuat: new THREE.Quaternion(),
                  vel: new THREE.Vector3(), angVel: new THREE.Vector3(),
                  onFloor: false, rebuildDelay: 0, flashTimer: 0,
                };
                el.userData = phys;
              }
            }}
            position={d.pos}
            castShadow
            receiveShadow
          >
            <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.04} smoothness={4} material={cubieFaces[i]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Cube Scene ───────────────────────────────────────────────────────────────
function CubeScene({ onShatter, onRebuildStart }: { onShatter: () => void; onRebuildStart: () => void }) {
  const materials = useCubeMaterials();
  return (
    <Canvas
      camera={{ position: [0, -0.2, 8.5], fov: 36 }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      resize={{ debounce: 0 }}
    >
      <Environment preset="warehouse" />
      <ambientLight intensity={0.5} color="#c8a060" />
      <spotLight position={[12,14,10]}  angle={0.25} penumbra={1} intensity={2.2} color="#f5c87a" castShadow />
      <spotLight position={[-8,-10,-6]} angle={0.5}  penumbra={1} intensity={0.9} color="#a06030" />
      <pointLight position={[0,0,8]} intensity={0.4} color="#e8a020" />
      <RubikGroup materials={materials} onShatter={onShatter} onRebuildStart={onRebuildStart} />
    </Canvas>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER = [
  "ENTREPRENEURSHIP CELL", "IISER BHOPAL", "DEEP TECH INCUBATOR",
  "STUDENT FOUNDERS", "PITCH YOUR IDEA", "BUILD THE FUTURE",
  "SCIENCE × BUSINESS", "IDEATE — INCUBATE — IMPACT",
];
function TickerTape() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="w-full overflow-hidden py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
      <div className="flex gap-8 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)" }}>{item}</span>
            <span style={{ color: "#e8a020", fontSize: "0.6rem", opacity: 0.8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const shakeControls  = useAnimation();
  const [hasShattered, setHasShattered] = useState(false);

  const handleShatter = useCallback(() => {
    setHasShattered(true);
    shakeControls.start({
      x: [0, 7, -6, 5, -3, 2, -1, 0],
      y: [0, -4, 4, -3, 2, -1, 1, 0],
      transition: { duration: 0.55, ease: "easeOut" },
    });
  }, [shakeControls]);

  // No-op — sound handled inside RubikGroup, nothing extra needed in parent
  const handleRebuildStart = useCallback(() => {}, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const line: Variants = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
  };
  const fade: Variants = {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-transparent overflow-hidden">
      <h1 className="sr-only">Entrepreneurship Cell at IISER Bhopal — Student Startup Incubator</h1>

      {/* ── Top editorial bar ── */}
      <div className="relative z-10 w-full" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between"
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
            Est. 2024 — IISER Bhopal
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }} className="hidden md:block">
            Deep Tech Incubator ◆ Student Startup Hub
          </span>
        </motion.div>
      </div>

      {/* ── Main split layout ── */}
      <div className="relative z-10 flex-grow w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-6 md:px-12 pt-16 pb-8 items-center">

        {/* LEFT: Headline */}
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="lg:col-span-7 flex flex-col items-start text-left min-w-0 w-full py-8 lg:py-16 z-20"
        >
          <motion.div variants={fade} className="mb-8">
            <span className="inline-flex items-center gap-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              <span className="w-5 h-px" style={{ background: "#e8a020", animation: "amber-pulse 2s ease-in-out infinite" }} />
              Entrepreneurship Cell
            </span>
          </motion.div>

          <div className="overflow-hidden w-full">
            <motion.h2 variants={line} style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.92, letterSpacing: "0.01em", color: "#ffffff" }} className="text-[clamp(2.8rem,6.2vw,6rem)] xl:text-[6.5rem] block w-full whitespace-nowrap">TURN</motion.h2>
          </div>
          <div className="overflow-hidden w-full">
            <motion.h2 variants={line} style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.92, letterSpacing: "0.01em" }} className="text-[clamp(2.8rem,6.2vw,6rem)] xl:text-[6.5rem] block w-full whitespace-nowrap">
              <span style={{ color: "#e8a020" }}>BREAK</span><span style={{ color: "#ffffff" }}>THROUGHS</span>
            </motion.h2>
          </div>
          <div className="overflow-hidden w-full">
            <motion.h2 variants={line} style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.92, letterSpacing: "0.01em", color: "#ffffff" }} className="text-[clamp(2.8rem,6.2vw,6rem)] xl:text-[6.5rem] block w-full whitespace-nowrap">
              INTO BUSI<span style={{ color: "#e8a020" }}>NESSES.</span>
            </motion.h2>
          </div>

          <motion.div variants={fade} className="mt-10 w-full flex flex-col items-start gap-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", lineHeight: 1.75, color: "rgba(255,255,255,0.7)", maxWidth: "640px" }}>
              {(siteConfig as any).hero?.subheadline ??
                "Welcome to the Entrepreneurship Cell at IISER Bhopal. As the premier student startup incubator on campus, we provide the resources, mentorship, and platform to help visionary minds translate academic excellence into real-world impact. Stop waiting. Start building your startup today."}
            </p>
            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
              <a href="#pitch">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 transition-all duration-200"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", background: "#e8a020", color: "#0c0b09", fontWeight: 700 }}
                >
                  Pitch Your Idea
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.button>
              </a>
              <a href="#vision">
                <button
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "14px 24px", fontWeight: 600 }}
                  className="hover:bg-white/5 transition-all duration-200"
                >
                  OUR VISION
                </button>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Cube */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1,    filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          className="lg:col-span-5 relative w-full aspect-square max-w-[600px] mx-auto lg:ml-auto lg:mr-0 z-30 mt-8 lg:mt-0"
        >
          <motion.div animate={shakeControls} className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto">
            {/* Amber glow */}
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,160,32,0.15) 0%, transparent 65%)", filter: "blur(20px)", borderRadius: "50%" }} />

            {/* Canvas */}
            <div className="absolute inset-0">
              <CubeScene onShatter={handleShatter} onRebuildStart={handleRebuildStart} />
            </div>

            {/* Hint — fades out permanently after first shatter */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: hasShattered ? 0 : 1 }}
              transition={hasShattered
                ? { duration: 0.6, ease: "easeOut" }
                : { delay: 2.5, duration: 1 }
              }
              style={{ position: "absolute", bottom: "-28px", left: "50%", transform: "translateX(-50%)", fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", textTransform: "uppercase", pointerEvents: "none" }}
            >
              Double-click or jerk to shatter ◆
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative z-10 w-full"
        style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {((siteConfig as any).hero?.stats ?? [
              { value: "2024",  label: "Founded"        },
              { value: "100+",  label: "Students"       },
              { value: "∞",     label: "Ideas"          },
              { value: "IISER", label: "Research-First" },
            ]).map((stat: any, i: number) => (
              <div key={i} className="py-6 px-6 flex flex-col gap-1" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", lineHeight: 1, color: "#e8a020" }}>{stat.value}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Ticker tape ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="relative z-10">
        <TickerTape />
      </motion.div>
    </section>
  );
}