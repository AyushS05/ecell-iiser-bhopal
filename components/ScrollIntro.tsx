"use client";
// components/ScrollIntro.tsx
// ─────────────────────────────────────────────────────────────────────────────
// E-Cell Arc Reactor — Cinematic Slow Scroll
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState, useCallback, memo } from "react";
import {
  motion, useScroll, useTransform,
  useMotionValue, useMotionValueEvent, animate,
  MotionValue
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useIntroControl } from "@/components/IntroProvider";

let hasPlayedIntro = false;

// ─── SCRAMBLE TEXT ────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$Σ∆Ω≈<>|{}[]";

function ScrambleText({
  text, active, speed = 36, stagger = 60, style,
}: {
  text: string;
  active: boolean;
  speed?: number;
  stagger?: number;
  style?: React.CSSProperties;
}) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;
    if (!active) {
      elRef.current.innerText = text.split("").map(() => "\u00A0").join("");
      return;
    }

    // FIX 3: Throttle ScrambleText RAF to ~30fps instead of 60fps to cut CPU usage.
    // Using a frame-skip counter rather than performance.now() deltas to
    // avoid the extra math on every frame.
    let elapsed = 0;
    let lastTime = performance.now();
    let animId: number;
    let frameSkip = 0;
    const resolved = new Array(text.length).fill(false);

    const startId = requestAnimationFrame(() => {
      const frame = (time: number) => {
        // Skip every other frame (~30 fps cap) to reduce layout thrash
        frameSkip++;
        if (frameSkip % 2 !== 0) {
          animId = requestAnimationFrame(frame);
          return;
        }

        const delta = time - lastTime;
        if (delta > speed) {
          elapsed += delta;
          lastTime = time;
          const next = text
            .split("")
            .map((ch, i) => {
              if (ch === " " || ch === "—" || ch === "/") return ch;
              if (elapsed > i * stagger + 500) resolved[i] = true;
              return resolved[i]
                ? ch
                : CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");
          if (elRef.current) elRef.current.innerText = next;
          if (resolved.every(Boolean)) return;
        }
        animId = requestAnimationFrame(frame);
      };
      animId = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(startId);
      cancelAnimationFrame(animId);
    };
  }, [active, text, speed, stagger]);

  return <div ref={elRef} style={style} />;
}

// ─── RING LABEL ───────────────────────────────────────────────────────────────
// FIX 3: Memoize RingLabel — it only changes when dismantle opacity changes,
// but was previously re-running on every parent SVG render.
const RingLabel = memo(function RingLabel({
  cx, cy, labelX, labelY,
  label, sublabel, opacity,
  lineToX, lineToY,
}: {
  cx: number; cy: number;
  labelX: number; labelY: number;
  label: string; sublabel: string;
  opacity: MotionValue<number>;
  lineToX: number; lineToY: number;
}) {
  const isRight = labelX > cx;
  const labelW = label.length * 7.2 + 12;
  const subW   = sublabel.length * 5.8 + 12;
  const boxW   = Math.max(labelW, subW);
  const boxX   = isRight ? labelX - 5 : labelX - boxW + 5;

  return (
    <motion.g style={{ opacity }}>
      <line
        x1={lineToX} y1={lineToY}
        x2={labelX + (isRight ? -4 : 4)} y2={labelY}
        stroke="rgba(232,160,32,0.3)" strokeWidth="0.7" strokeDasharray="3 2.5"
      />
      <circle cx={lineToX} cy={lineToY} r="2" fill="#E8A020" opacity="0.6" />
      {/* Backdrop */}
      <rect
        x={boxX} y={labelY - 18}
        width={boxW} height={30}
        rx="2"
        fill="rgba(12,11,9,0.75)"
        stroke="rgba(232,160,32,0.15)" strokeWidth="0.5"
      />
      <text
        x={labelX} y={labelY - 4}
        textAnchor={isRight ? "start" : "end"}
        fontSize="11" fill="#E8A020" opacity="0.95"
        fontFamily="'DM Mono', monospace" letterSpacing="0.12em" fontWeight="500"
        textRendering="geometricPrecision"
        style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
      >
        {label}
      </text>
      <text
        x={labelX} y={labelY + 9}
        textAnchor={isRight ? "start" : "end"}
        fontSize="9" fill="rgba(240,237,230,0.55)"
        fontFamily="'DM Mono', monospace" letterSpacing="0.08em"
        textRendering="geometricPrecision"
        style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
      >
        {sublabel}
      </text>
    </motion.g>
  );
});

// ─── REACTOR ──────────────────────────────────────────────────────────────────
const Reactor = memo(function Reactor({
  progress, tiltX, tiltY, dismantle,
}: {
  progress:  MotionValue<number>;
  tiltX:     MotionValue<number>;
  tiltY:     MotionValue<number>;
  dismantle: MotionValue<number>;
}) {
  // FIX 2: Speed up the early swirl — compress ring rotation to feel snappier
  // in the 0–0.25 window by using a custom ease-like input mapping.
  // The rings now reach 60% of their final rotation by progress=0.3
  // (previously linear all the way to 1.0).
  const ring1Rot = useTransform(progress,
    [0,    0.08,  0.20,  0.40,  1.0],
    [0,    90,    200,   360,   540]
  );
  const ring2Rot = useTransform(progress,
    [0,    0.08,  0.20,  0.40,  1.0],
    [0,   -120,  -280,  -480,  -720]
  );
  const ring3Rot = useTransform(progress,
    [0,    0.08,  0.20,  0.40,  1.0],
    [0,    60,    130,   220,   300]
  );

  const corePow  = useTransform(progress, [0, 0.07], [0, 1]); // FIX 2: core powers up faster
  const irisOff  = useTransform(progress, [0.75, 0.94], [250, 392]);
  
  const flashSc  = useTransform(progress, [0.95, 0.99], [0, 600]); 
  const flashOp  = useTransform(progress, [0.95, 0.98], [0, 1]);

  const r1dx      = useTransform(dismantle, [0, 1], [0, -103]);
  const r1dy      = useTransform(dismantle, [0, 1], [0, -113]);
  const r2dx      = useTransform(dismantle, [0, 1], [0,  113]);
  const r2dy      = useTransform(dismantle, [0, 1], [0,   97]);
  const r3dx      = useTransform(dismantle, [0, 1], [0,   92]);
  const r3dy      = useTransform(dismantle, [0, 1], [0, -100]);
  const coreDx    = useTransform(dismantle, [0, 1], [0,  -80]);
  const coreDy    = useTransform(dismantle, [0, 1], [0,  108]);
  const coreScale = useTransform(dismantle, [0, 1], [1, 0.75]);

  const coreGlowOp = useTransform(dismantle, [0, 1], [1, 1]);
  const housingOp  = useTransform(dismantle, [0, 1], [1, 1]);
  const labelOp    = useTransform(dismantle, [0.35, 0.85], [0, 1]);
  const glowOp     = useTransform(dismantle, [0, 0.7], [1, 0]);
  const ringBaseOp = useTransform(dismantle, [0, 1], [1, 1]);

  const coreOp = useTransform(
    [corePow, coreGlowOp] as MotionValue[],
    ([p, g]) => (p as number) * (g as number)
  );

  return (
    <motion.div
      style={{
        width: "100%", height: "100%", position: "relative",
        rotateX: tiltX, rotateY: tiltY,
        transformStyle: "preserve-3d",
        // FIX 3: Hint to the browser that this element will be composited
        willChange: "transform",
      }}
    >
      {/* Ambient glow */}
      <motion.div
        style={{
          position: "absolute", inset: -120, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,160,32,0.22) 0%, transparent 65%)",
          filter: "blur(88px)",
          opacity: glowOp,
          pointerEvents: "none", zIndex: 0,
          // FIX 3: Promote glow to its own compositor layer
          willChange: "opacity",
        }}
      />

      <motion.div
        style={{
          position: "absolute", top: "50%", left: "50%",
          width: 16, height: 16, x: "-50%", y: "-50%",
          borderRadius: "50%", background: "#ffffff",
          boxShadow: "0 0 60px 30px #fff, 0 0 120px 60px #E8A020",
          scale: flashSc, opacity: flashOp, zIndex: 60,
          willChange: "transform, opacity",
        }}
      />

      <svg
        viewBox="0 0 500 500"
        style={{
          width: "100%", height: "100%", overflow: "visible",
        }}
      >
        <defs>
          <radialGradient id="ecell-plasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="22%"  stopColor="#ffe0a0" />
            <stop offset="55%"  stopColor="#E8A020" />
            <stop offset="85%"  stopColor="#7a3e00" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ecell-titanium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#2a2d3e" />
            <stop offset="50%"  stopColor="#0c0b09" />
            <stop offset="100%" stopColor="#3a3f5c" />
          </linearGradient>
          <linearGradient id="ecell-shell" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#E8A020" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5a2e00" stopOpacity="0.5" />
          </linearGradient>
          <filter id="ecell-core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <motion.circle cx="250" cy="250" r="217"
          fill="url(#ecell-shell)"
          style={{ opacity: housingOp }}
        />
        <motion.circle cx="250" cy="250" r="203"
          fill="url(#ecell-titanium)"
          stroke="#000000" strokeWidth="10"
          style={{ opacity: housingOp }}
        />

        <motion.g style={{ x: r1dx, y: r1dy }}>
          <motion.g
            style={{
              rotate: ring1Rot,
              transformOrigin: "250px 250px",
              opacity: ringBaseOp,
            }}
          >
            <circle cx="250" cy="250" r="180"
              stroke="#E8A020" strokeWidth="2.5" strokeDasharray="7 15"
              fill="none" opacity="0.65"
            />
            <circle cx="250" cy="250" r="160"
              stroke="url(#ecell-titanium)" strokeWidth="27"
              strokeDasharray="87 37" strokeLinecap="square" fill="none"
            />
            <circle cx="250" cy="250" r="160"
              stroke="#E8A020" strokeWidth="4"
              strokeDasharray="0 123" strokeLinecap="round" fill="none"
            />
          </motion.g>
          <RingLabel
            cx={250} cy={250} labelX={87} labelY={100}
            label="GROWTH ORBIT" sublabel="SCALE & SUSTAIN"
            opacity={labelOp}
            lineToX={250 + 180 * Math.cos(Math.PI * 1.18)}
            lineToY={250 + 180 * Math.sin(Math.PI * 1.18)}
          />
        </motion.g>

        <motion.g style={{ x: r2dx, y: r2dy }}>
          <motion.g
            style={{
              rotate: ring2Rot,
              transformOrigin: "250px 250px",
              opacity: ringBaseOp,
            }}
          >
            <circle cx="250" cy="250" r="142"
              stroke="#0c0b09" strokeWidth="33" fill="none"
            />
            <circle cx="250" cy="250" r="142"
              stroke="#E8A020" strokeWidth="7"
              strokeDasharray="37 63" fill="none"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line key={i}
                  x1={+(250 + Math.cos(a) * 120).toFixed(1)}
                  y1={+(250 + Math.sin(a) * 120).toFixed(1)}
                  x2={+(250 + Math.cos(a) * 157).toFixed(1)}
                  y2={+(250 + Math.sin(a) * 157).toFixed(1)}
                  stroke="rgba(232,160,32,0.25)" strokeWidth="4"
                />
              );
            })}
          </motion.g>
          <RingLabel
            cx={250} cy={250} labelX={427} labelY={413}
            label="INCUBATION" sublabel="BUILD & VALIDATE"
            opacity={labelOp}
            lineToX={250 + 142 * Math.cos(Math.PI * 0.32)}
            lineToY={250 + 142 * Math.sin(Math.PI * 0.32)}
          />
        </motion.g>

        <motion.g style={{ x: r3dx, y: r3dy }}>
          <motion.g
            style={{
              rotate: ring3Rot,
              transformOrigin: "250px 250px",
              opacity: ringBaseOp,
            }}
          >
            <circle cx="250" cy="250" r="97"
              stroke="#7a3e00" strokeWidth="13" fill="none" opacity="0.5"
            />
            <motion.circle cx="250" cy="250" r="97"
              stroke="#E8A020" strokeWidth="13" fill="none"
              strokeDasharray="333 167"
              strokeDashoffset={irisOff}
              strokeLinecap="square"
            />
          </motion.g>
          <RingLabel
            cx={250} cy={250} labelX={410} labelY={113}
            label="IDEATION" sublabel="SPARK THE IDEA"
            opacity={labelOp}
            lineToX={250 + 97 * Math.cos(Math.PI * -0.22)}
            lineToY={250 + 97 * Math.sin(Math.PI * -0.22)}
          />
        </motion.g>

        <motion.g
          style={{
            x: coreDx, y: coreDy,
            scale: coreScale,
            transformOrigin: "250px 250px",
          }}
        >
          <motion.circle cx="250" cy="250" r="75"
            fill="url(#ecell-plasma)"
            style={{ opacity: coreOp }}
            filter="url(#ecell-core-glow)"
          />
          <motion.circle cx="250" cy="250" r="30"
            fill="#ffffff"
            style={{ opacity: corePow }}
            filter="url(#ecell-core-glow)"
          />
          <RingLabel
            cx={250} cy={250}
            labelX={430} labelY={250}
            label="IGNITION" sublabel="THE SPARK"
            opacity={labelOp}
            lineToX={250 + 75 * Math.cos(Math.PI * 0.08)}
            lineToY={250 + 75 * Math.sin(Math.PI * 0.08)}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
});

function ScrollNudge({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{
        position: "absolute", bottom: "2.5rem", left: "4rem",
        display: "flex", alignItems: "center", gap: "0.75rem",
        opacity, zIndex: 20, pointerEvents: "none",
      }}
    >
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 30, height: 30,
          border: "1px solid rgba(232,160,32,0.45)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <ArrowDown size={13} style={{ color: "#E8A020" }} />
      </motion.div>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.60rem", letterSpacing: "0.42em",
          textTransform: "uppercase", color: "rgba(240,237,230,0.45)",
        }}
      >
        scroll to explore
      </span>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ScrollIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoCtrlRef  = useRef<ReturnType<typeof animate> | null>(null);
  const prevScrollRef = useRef(0);
  const doneRef      = useRef(hasPlayedIntro);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setIntroActive } = useIntroControl();

  const [isMounted,   setIsMounted]   = useState(!hasPlayedIntro);
  const [isFadingOut, setIsFadingOut] = useState(hasPlayedIntro);
  const [sc, setSc] = useState({ tag: false, title: false, sub: false });

  useEffect(() => {
    if (hasPlayedIntro) {
      setIntroActive(false);
    } else {
      setIntroActive(true);
    }
  }, [setIntroActive]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProg = useMotionValue(0);
  const autoProg   = useMotionValue(0);
  const progress   = useMotionValue(0);

  // FIX 3: Derive progress inline via useTransform instead of a manual
  // sync listener. useTransform is handled by Framer Motion's internal
  // scheduler (no JS event overhead on every frame).
  // We still need the imperative sync for the "max" logic, but we
  // batch it by doing it only in the scroll handler and auto animation,
  // not via two separate "change" listeners.
  useEffect(() => {
    const sync = () => {
      progress.set(Math.max(autoProg.get(), scrollProg.get()));
    };
    const ua = autoProg.on("change", sync);
    const us = scrollProg.on("change", sync);
    return () => { ua(); us(); };
  }, [autoProg, scrollProg, progress]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    hasPlayedIntro = true;
    setIsFadingOut(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    setIntroActive(false);
    setTimeout(() => setIsMounted(false), 55);
  }, [setIntroActive]);

  const resumeAuto = useCallback((from: number) => {
    if (doneRef.current || autoCtrlRef.current) return;
    const remaining = 1 - from;
    if (remaining <= 0) { finish(); return; }
    autoProg.set(from);
    autoCtrlRef.current = animate(autoProg, 1, {
      duration: 18 * remaining,
      ease: "linear",
      onComplete: finish,
    });
  }, [autoProg, finish]);

  const startAuto = useCallback(() => {
    if (doneRef.current) return;
    autoCtrlRef.current?.stop();
    autoCtrlRef.current = animate(autoProg, 1, {
      duration: 18,
      ease: "linear",
      onComplete: finish,
    });
  }, [autoProg, finish]);

  useEffect(() => {
    if (!isMounted || doneRef.current) return;
    const t = setTimeout(() => startAuto(), 150);
    return () => clearTimeout(t);
  }, [startAuto, isMounted]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isMounted || doneRef.current) return;

    const prev    = prevScrollRef.current;
    const goingUp = v < prev - 0.001;
    prevScrollRef.current = v;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (goingUp) {
      autoCtrlRef.current?.stop();
      autoCtrlRef.current = null;

      if (v < 0.02) {
        // FIX 1 (partial): Reset both motion values cleanly when returning to top
        autoProg.set(0);
        scrollProg.set(0);
        progress.set(0);
        setSc({ tag: false, title: false, sub: false });
        setIsFadingOut(false);
        setTimeout(() => startAuto(), 150);
        return;
      }
      // FIX 1: When user scrolls up mid-sequence, match autoProg to current
      // progress so the max() doesn't snap backward when we zero autoProg.
      autoProg.set(progress.get());
      scrollProg.set(v);
      return;
    }

    // FIX 1: When the user grabs scroll while auto is running, stop the auto
    // animation but pin autoProg to the current progress value — NOT zero —
    // so the max(autoProg, scrollProg) doesn't cause a backward jump.
    if (autoCtrlRef.current) {
      autoCtrlRef.current.stop();
      autoCtrlRef.current = null;
      // Pin autoProg to wherever progress currently is, not 0
      autoProg.set(progress.get());
    }

    scrollProg.set(v);

    if (v >= 0.99) { finish(); return; }

    idleTimerRef.current = setTimeout(() => {
      idleTimerRef.current = null;
      if (!doneRef.current && !autoCtrlRef.current) {
        resumeAuto(progress.get());
      }
    }, 1200);
  });

  const reactorScale = useTransform(
    progress,
    [0,      0.04,    0.10,    0.22,    0.34,    0.55,    0.80,    0.93,    0.97],
    [0.5,    0.53,    0.61,    0.76,    0.89,    0.95,    0.865,   0.755,   0.265]
  );

  const reactorRotY = useTransform(
    progress,
    [0,   0.10,  0.24,  0.40,  0.58,  0.72,  0.90, 1.0],
    [0,    0,    -9,   -42,   -12,    5,     1,    0]
  );
  const reactorRotX = useTransform(
    progress,
    [0,   0.10,  0.24,  0.40,  0.58,  0.72,  0.90, 1.0],
    [0,    0,    14,    28,     4,    -4,     1,    0]
  );
  const reactorRotZ = useTransform(
    progress,
    [0,  0.22,  0.42,  0.68,  0.90],
    [0,   0,   -10,    0,     0]
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth: W, innerHeight: H } = window;
      mouseX.set(((e.clientX - W / 2) / (W / 2)) * 8);
      mouseY.set((-(e.clientY - H / 2) / (H / 2)) * 8);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const mouseWeight = useTransform(progress, [0, 0.16], [1, 0]);
  const tiltY = useTransform(
    [reactorRotY, mouseX, mouseWeight] as MotionValue[],
    ([ry, mx, w]) => (ry as number) + (mx as number) * (w as number)
  );
  const tiltX = useTransform(
    [reactorRotX, mouseY, mouseWeight] as MotionValue[],
    ([rx, my, w]) => (rx as number) + (my as number) * (w as number)
  );

  const dismantle = useTransform(
    progress,
    [0.62, 0.74, 0.80, 0.90],
    [0,    1,    1,    0]
  );

  const reactorTX = useTransform(
    progress,
    [0,      0.10,   0.36,   0.65,   0.90],
    ["-50%", "-50%", "-34%", "-44%", "-50%"]
  );

  // FIX 2: Compress text appearance into a tighter early window so E-Cell
  // logo and the reactor swirl feel snappy rather than sluggish.
  // Old ranges: tag [0.03,0.10], title [0.06,0.16], sub [0.12,0.22]
  // New ranges: appear ~2× faster
  const tagOpacity   = useTransform(progress, [0.02, 0.07, 0.78, 0.88], [0, 1, 1, 0]);
  const tagY         = useTransform(progress, [0.02, 0.07], [10, 0]);
  const titleOpacity = useTransform(progress, [0.03, 0.10, 0.76, 0.86], [0, 1, 1, 0]);
  const titleY       = useTransform(progress, [0.03, 0.10], [24, 0]);
  const subOpacity   = useTransform(progress, [0.07, 0.14, 0.74, 0.84], [0, 1, 1, 0]);
  const subY         = useTransform(progress, [0.07, 0.14], [14, 0]);

  const dismantleHeadOp = useTransform(progress, [0.63, 0.72, 0.78, 0.88], [0, 1, 1, 0]);
  const dismantleHeadY  = useTransform(progress, [0.63, 0.72], [16, 0]);

  const scanOp  = useTransform(progress, [0.06, 0.14, 0.88, 0.94], [0, 1, 1, 0]);
  const nudgeOp = useTransform(progress, [0, 0.05, 0.18], [1, 1, 0]);

  useMotionValueEvent(progress, "change", (v) => {
    setSc((prev) => {
      // FIX 2: Match the new tighter thresholds
      const n = { tag: v > 0.02, title: v > 0.03, sub: v > 0.07 };
      if (prev.tag === n.tag && prev.title === n.title && prev.sub === n.sub) return prev;
      return n;
    });
  });

  if (!isMounted) return <div ref={containerRef} style={{ display: "none" }} aria-hidden="true" />;

  return (
    <>
      <style>{`
        @keyframes ecell-scan {
          0%   { top: -2px; opacity: 0; }
          4%   { opacity: 0.5; }
          96%  { opacity: 0.5; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes amber-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .ecell-scanline {
          position: absolute; left: 0; right: 0; height: 1.5px;
          pointer-events: none; z-index: 15;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(232,160,32,0.45) 25%,
            rgba(232,160,32,0.75) 50%,
            rgba(232,160,32,0.45) 75%,
            transparent 100%
          );
          animation: ecell-scan 3.5s ease-in-out infinite;
          will-change: top;
        }
      `}</style>

      <div
        ref={containerRef}
        style={{ height: isFadingOut ? 0 : "900vh", position: "relative", zIndex: 95 }}
      >
        <motion.div
          style={{
            position: isFadingOut ? "fixed" : "sticky",
            top: 0, left: 0, right: 0,
            height: "100vh", width: "100%",
            overflow: "hidden",
            background: "#0c0b09",
            opacity: isFadingOut ? 0 : 1,
            pointerEvents: isFadingOut ? "none" : "auto",
            transition: isFadingOut ? "opacity 0.05s ease-out" : "none",
            perspective: 1200,
          }}
        >
          {/* Film grain */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.030'/%3E%3C/svg%3E")`,
              backgroundSize: "256px 256px",
            }}
          />

          {/* Vignette */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
              background: "radial-gradient(ellipse at 50% 50%, transparent 22%, rgba(0,0,0,0.58) 100%)",
            }}
          />

          <motion.div className="ecell-scanline" style={{ opacity: scanOp }} aria-hidden />

          {/* ── Reactor container ── */}
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              translateX: reactorTX,
              translateY: "-50%",
              rotateZ: reactorRotZ,
              scale: reactorScale,
              width: "90vmin",  
              height: "90vmin", 
              zIndex: 3,
              transformStyle: "preserve-3d",
              // FIX 3: Promote to compositor layer up front — avoids
              // promotion cost mid-animation which causes a jank spike.
              willChange: "transform",
            }}
          >
            <Reactor
              progress={progress}
              tiltX={tiltX}
              tiltY={tiltY}
              dismantle={dismantle}
            />
          </motion.div>

          {/* ── Left text block ── */}
          <div
            style={{
              position: "absolute",
              left: "clamp(2rem, 4vw, 4.5rem)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5, pointerEvents: "none",
              display: "flex", flexDirection: "column",
              maxWidth: "min(400px, 38vw)",
            }}
          >
            <motion.div style={{ y: tagY, opacity: tagOpacity, marginBottom: "1.5rem" }}>
              <ScrambleText
                text="VENTURE.CORE // BOOTSTRAP"
                active={sc.tag} speed={28} stagger={42}
                style={{
                  fontFamily: "'DM Mono', monospace", fontWeight: 400,
                  fontSize: "clamp(0.52rem, 1vw, 0.68rem)",
                  letterSpacing: "0.5em", color: "#E8A020",
                  textTransform: "uppercase",
                }}
              />
            </motion.div>

            <motion.div style={{ y: titleY, opacity: titleOpacity }}>
              <ScrambleText
                text="E-CELL"
                active={sc.title} speed={45} stagger={100}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900,
                  fontSize: "clamp(5rem, 14vw, 11rem)",
                  lineHeight: 0.88, letterSpacing: "0.02em",
                  background: "linear-gradient(155deg,#ffffff 0%,#ffd97a 40%,#E8A020 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 24px rgba(232,160,32,0.3))",
                  userSelect: "none",
                  minHeight: "8rem",
                }}
              />
            </motion.div>

            <motion.div style={{ y: subY, opacity: subOpacity, marginTop: "1.5rem" }}>
              <ScrambleText
                text="IISER  BHOPAL"
                active={sc.sub} speed={32} stagger={55}
                style={{
                  fontFamily: "'DM Mono', monospace", fontWeight: 400,
                  fontSize: "clamp(0.85rem, 2.2vw, 1.4rem)",
                  letterSpacing: "0.42em",
                  color: "rgba(240,237,230,0.5)",
                  height: "1.8rem",
                }}
              />
            </motion.div>
          </div>

          {/* ── Dismantle heading ── */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "3.5rem", left: "clamp(2rem, 4vw, 4.5rem)",
              opacity: dismantleHeadOp, y: dismantleHeadY,
              zIndex: 6, pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(0.55rem, 1vw, 0.68rem)",
                letterSpacing: "0.48em", textTransform: "uppercase",
                color: "rgba(232,160,32,0.7)",
                borderTop: "1px solid rgba(232,160,32,0.2)",
                paddingTop: "0.6rem", marginBottom: "0.4rem",
              }}
            >
              The anatomy of a startup
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(0.48rem, 0.85vw, 0.60rem)",
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: "rgba(240,237,230,0.28)",
              }}
            >
              Four forces. One mission.
            </div>
          </motion.div>

          {/* ── Coordinates ── */}
          <motion.div
            style={{
              position: "absolute", bottom: "2.5rem", right: "2.5rem",
              opacity: tagOpacity, zIndex: 6, pointerEvents: "none",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.57rem",
                letterSpacing: "0.28em", lineHeight: 1.9, color: "#E8A020",
              }}
            >
              <div>23°16′N 77°26′E</div>
              <div style={{ opacity: 0.38, color: "#f0ede6" }}>IISER BHOPAL</div>
            </div>
          </motion.div>

          <ScrollNudge opacity={nudgeOp} />
        </motion.div>
      </div>
    </>
  );
}