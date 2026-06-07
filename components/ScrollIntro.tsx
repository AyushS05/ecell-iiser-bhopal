"use client";
// components/ScrollIntro.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Arc Reactor recolored: cyan (#00f5ff) → amber (#E8A020), blue (#0044ff) → 
// dark amber (#7a3e00). All animation logic unchanged from original.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState, useCallback, memo } from "react";
import {
  motion, useScroll, useTransform,
  useMotionValue, useMotionValueEvent, animate,
  MotionValue
} from "framer-motion";
import { ChevronsDown } from "lucide-react";

// Global memory so it only plays once per session.
let hasPlayedIntro = false;

// ─────────────────────────────────────────────────────────────────────────────
// SCRAMBLE TEXT (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$Σ∆Ω≈<>?/\\|{}[]*&%";

function ScrambleText({ text, active, speed = 36, stagger = 60, style }: {
  text: string; active: boolean; speed?: number; stagger?: number;
  style?: React.CSSProperties;
}) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;
    if (!active) {
      elRef.current.innerText = text.split("").map(() => "\u00A0").join("");
      return;
    }

    let elapsed = 0;
    let lastTime = performance.now();
    let animationId: number;
    const resolved = new Array(text.length).fill(false);

    const frame = (time: number) => {
      const delta = time - lastTime;
      if (delta > speed) {
        elapsed += delta;
        lastTime = time;
        const next = text.split("").map((ch, i) => {
          if (ch === " " || ch === "—") return ch;
          if (elapsed > i * stagger + 600) resolved[i] = true;
          return resolved[i] ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("");
        if (elRef.current) elRef.current.innerText = next;
        if (resolved.every(Boolean)) return;
      }
      animationId = requestAnimationFrame(frame);
    };

    animationId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationId);
  }, [active, text, speed, stagger]);

  return <div ref={elRef} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARC REACTOR — recolored to amber palette
// #00f5ff → #E8A020 (amber)
// #0044ff → #7a3e00 (dark amber / bronze)
// White core stays white (it's the plasma burst)
// ─────────────────────────────────────────────────────────────────────────────
const ArcReactor = memo(function ArcReactor({ progress }: { progress: MotionValue<number> }) {
  const ring1Rotate  = useTransform(progress, [0, 1], [0, 360]);
  const ring2Rotate  = useTransform(progress, [0, 1], [0, -420]);
  const ring3Rotate  = useTransform(progress, [0, 1], [0, 180]);
  const corePower    = useTransform(progress, [0, 0.3], [0, 1]);
  const irisOpen     = useTransform(progress, [0.75, 0.96], [150, 240]);
  const flashScale   = useTransform(progress, [0.96, 0.99], [0, 250]);
  const flashOpacity = useTransform(progress, [0.96, 0.98], [0, 1]);

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
      {/* Central Flash — stays white (it's the burst moment) */}
      <motion.div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 20, height: 20, x: "-50%", y: "-50%",
        borderRadius: "50%", background: "#ffffff",
        // Amber glow instead of cyan
        boxShadow: "0 0 60px 30px #ffffff, 0 0 100px 50px #E8A020",
        scale: flashScale, opacity: flashOpacity, zIndex: 50,
        willChange: "transform,opacity",
      }} />

      {/* Background Glow — amber instead of cyan */}
      <motion.div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle, #E8A020 0%, transparent 70%)",
        filter: "blur(40px)", opacity: corePower, zIndex: -1,
        willChange: "opacity",
      }} />

      <svg width="300" height="300" viewBox="0 0 300 300" fill="none" style={{ overflow: "visible", willChange: "transform" }}>
        <defs>
          {/* Titanium/dark frame — unchanged, it's structural */}
          <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#2a2d3e" />
            <stop offset="50%"  stopColor="#0a0b10" />
            <stop offset="100%" stopColor="#3d435c" />
          </linearGradient>

          {/* Outer ring accent — amber instead of cyan */}
          <linearGradient id="copper-accent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#E8A020" stopOpacity="0.25" />
            <stop offset="50%"  stopColor="#050508" />
            <stop offset="100%" stopColor="#7a3e00" stopOpacity="0.4" />
          </linearGradient>

          {/* Core plasma — amber/gold burst */}
          <radialGradient id="plasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="25%"  stopColor="#ffd97a" />
            <stop offset="55%"  stopColor="#E8A020" />
            <stop offset="85%"  stopColor="#7a3e00" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer shell */}
        <circle cx="150" cy="150" r="140" fill="url(#copper-accent)" stroke="#1a1d2e" strokeWidth="2" />
        <circle cx="150" cy="150" r="130" fill="url(#titanium)"      stroke="#000"   strokeWidth="6" />

        {/* Ring 1 — amber tick marks */}
        <motion.g style={{ rotate: ring1Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="115" stroke="#E8A020" strokeWidth="1"   strokeDasharray="2 12" opacity="0.45" />
          <circle cx="150" cy="150" r="105" stroke="url(#titanium)" strokeWidth="12" strokeDasharray="60 20" strokeLinecap="round" />
          <circle cx="150" cy="150" r="105" stroke="#E8A020" strokeWidth="2"   strokeDasharray="0 80" strokeLinecap="round" />
        </motion.g>

        {/* Ring 2 — amber segments + spoke dividers */}
        <motion.g style={{ rotate: ring2Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="85" stroke="#0a0b10" strokeWidth="16" />
          <circle cx="150" cy="150" r="85" stroke="#E8A020" strokeWidth="4"  strokeDasharray="15 45" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line key={i}
                x1={+(150 + Math.cos(a) * 75).toFixed(2)} y1={+(150 + Math.sin(a) * 75).toFixed(2)}
                x2={+(150 + Math.cos(a) * 95).toFixed(2)} y2={+(150 + Math.sin(a) * 95).toFixed(2)}
                stroke="#1a1d2e" strokeWidth="4"
              />
            );
          })}
        </motion.g>

        {/* Ring 3 — iris / aperture — amber */}
        <motion.g style={{ rotate: ring3Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="60" stroke="#7a3e00" strokeWidth="8" opacity="0.35" />
          <motion.circle
            cx="150" cy="150" r="60"
            stroke="#E8A020" strokeWidth="8"
            strokeDasharray="200 100"
            strokeDashoffset={irisOpen}
            strokeLinecap="round"
          />
        </motion.g>

        {/* Core plasma burst */}
        <motion.circle cx="150" cy="150" r="45" fill="url(#plasma)" style={{ opacity: corePower }} />
        {/* Bright center point */}
        <motion.circle cx="150" cy="150" r="20" fill="#ffffff"        style={{ opacity: corePower }} />
      </svg>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL NUDGE — amber instead of cyan
// ─────────────────────────────────────────────────────────────────────────────
function ScrollNudge({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div style={{
      position: "absolute", bottom: "2rem", left: 0, right: 0,
      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
      opacity, zIndex: 20, pointerEvents: "none",
    }}>
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        style={{
          position: "absolute", bottom: "0.5rem",
          width: 48, height: 48, borderRadius: "50%",
          // Amber ring instead of cyan
          border: "1px solid rgba(232, 160, 32, 0.5)",
        }}
      />
      <span style={{
        fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        // Amber text instead of cyan
        color: "rgba(232, 160, 32, 0.8)",
        textShadow: "0 0 12px rgba(232, 160, 32, 0.5)",
      }}>
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronsDown
          size={24}
          style={{ color: "#E8A020", filter: "drop-shadow(0 0 8px rgba(232,160,32,0.7))" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — all logic identical to original; only style strings changed above
// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollIntro() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const autoCtrlRef     = useRef<ReturnType<typeof animate> | null>(null);
  const prevScrollRef   = useRef(0);
  const handedOffRef    = useRef(false);
  const doneRef         = useRef(hasPlayedIntro);

  const [isMounted,   setIsMounted]   = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [sc, setSc] = useState({ sys: false, ecell: false, sub: false });

  useEffect(() => {
    if (hasPlayedIntro) setIsMounted(false);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProg = useMotionValue<number>(0);
  const autoProg   = useMotionValue<number>(0);
  const progress   = useMotionValue<number>(0);

  useEffect(() => {
    const sync = () => progress.set(Math.max(autoProg.get(), scrollProg.get()));
    const ua = autoProg.on("change", sync);
    const us = scrollProg.on("change", sync);
    return () => { ua(); us(); };
  }, [autoProg, scrollProg, progress]);

  const reset = useCallback(() => {
    autoCtrlRef.current?.stop();
    autoCtrlRef.current = null;
    autoProg.set(0);
    scrollProg.set(0);
    progress.set(0);
    handedOffRef.current = false;
    setIsFadingOut(false);
    setSc({ sys: false, ecell: false, sub: false });
  }, [autoProg, scrollProg, progress]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    hasPlayedIntro  = true;
    setIsFadingOut(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => setIsMounted(false), 50);
  }, []);

  const startAuto = useCallback(() => {
    if (!isMounted || doneRef.current) return;
    autoCtrlRef.current?.stop();
    autoCtrlRef.current = animate(autoProg, 1, {
      duration: 8,
      ease: [0.42, 0, 0.48, 1],
      onComplete: finish,
    });
  }, [autoProg, finish, isMounted]);

  useEffect(() => {
    if (!isMounted || doneRef.current) return;
    const t = setTimeout(() => startAuto(), 300);
    return () => clearTimeout(t);
  }, [startAuto, isMounted]);

  useMotionValueEvent(scrollYProgress, "change", (v: number) => {
    if (!isMounted || doneRef.current) return;

    const prev    = prevScrollRef.current;
    const goingUp = v < prev - 0.001;
    prevScrollRef.current = v;

    if (goingUp) {
      if (autoCtrlRef.current && !handedOffRef.current) {
        handedOffRef.current = true;
        autoCtrlRef.current.stop();
        autoCtrlRef.current = null;
        autoProg.set(0);
      }
      if (v < 0.03) {
        reset();
        setTimeout(() => startAuto(), 400);
        return;
      }
    }

    if (!goingUp && handedOffRef.current && !autoCtrlRef.current && v > 0.03) {
      handedOffRef.current = false;
      autoProg.set(v);
      autoCtrlRef.current = animate(autoProg, 1, {
        duration: 8 * (1 - v),
        ease: "linear",
        onComplete: finish,
      });
    }

    if (v >= 0.99) finish();
    scrollProg.set(v);
  });

  // Derived transforms (unchanged)
  const textY        = useTransform(progress, [0.22, 0.40], [80, 0]);
  const textOpacity  = useTransform(progress, [0.22, 0.36, 0.80, 0.92], [0, 1, 1, 0]);
  const textScale    = useTransform(progress, [0.80, 0.93], [1, 2]);
  const subOpacity   = useTransform(progress, [0.34, 0.46, 0.78, 0.91], [0, 1, 1, 0]);
  const subY         = useTransform(progress, [0.34, 0.46], [20, 0]);
  const reactorScale = useTransform(progress, [0.74, 0.95], [1, 4]);
  const scanOpacity  = useTransform(progress, [0.20, 0.25, 0.82, 0.87], [0, 1, 1, 0]);
  const nudgeOpacity = useTransform(progress, [0, 0.04, 0.18], [1, 1, 0]);

  useMotionValueEvent(progress, "change", (v: number) => {
    setSc(prev => {
      const next = { sys: v > 0.22, ecell: v > 0.25, sub: v > 0.34 };
      if (prev.sys === next.sys && prev.ecell === next.ecell && prev.sub === next.sub) return prev;
      return next;
    });
  });

  if (!isMounted) {
    return <div ref={containerRef} style={{ display: "none" }} aria-hidden="true" />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,200;0,900;1,200&family=DM+Mono:wght@300;400&display=swap');
        @keyframes scan {
          0%   { top:-2px; opacity:0 }
          5%   { opacity:.5 }
          95%  { opacity:.5 }
          100% { top:100vh; opacity:0 }
        }
        .scanline {
          position:absolute; left:0; right:0; height:2px;
          pointer-events:none; z-index:10;
          /* Amber scan line instead of cyan */
          background:linear-gradient(90deg,transparent,rgba(232,160,32,0.35),transparent);
          animation:scan 4s ease-in-out infinite;
        }
      `}</style>

      <div ref={containerRef} style={{ height: isFadingOut ? 0 : "400vh", position: "relative", zIndex: 50 }}>
        <motion.div style={{
          position: isFadingOut ? "fixed" : "sticky",
          top: 0, left: 0, right: 0,
          height: "100vh", width: "100%",
          overflow: "hidden", background: "#050508",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: isFadingOut ? 0 : 1,
          pointerEvents: isFadingOut ? "none" : "auto",
          transition: isFadingOut ? "opacity 0.05s ease-out" : "none",
          willChange: "opacity, transform",
        }}>

          <motion.div className="scanline" style={{ opacity: scanOpacity }} aria-hidden />

          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "radial-gradient(ellipse at 50% 42%, transparent 10%, #050508 80%)",
          }} aria-hidden />

          <motion.div style={{
            position: "absolute", zIndex: 3,
            display: "flex", alignItems: "center", justifyContent: "center",
            scale: reactorScale, willChange: "transform",
          }}>
            <ArcReactor progress={progress} />
          </motion.div>

          <motion.div style={{
            position: "absolute", zIndex: 4, pointerEvents: "none",
            y: textY, opacity: textOpacity, scale: textScale,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            {/* System label — amber instead of cyan */}
            <ScrambleText
              text="VENTURE.CORE // BOOTSTRAP SEQUENCE"
              active={sc.sys} speed={30} stagger={50}
              style={{
                fontFamily: "'DM Mono', monospace", fontWeight: 300,
                fontSize: "clamp(0.5rem,1.4vw,0.72rem)", letterSpacing: "0.55em",
                color: "rgba(232, 160, 32, 0.65)", textTransform: "uppercase",
                marginBottom: "2.2rem", height: "1rem",
              }}
            />

            {/* Main wordmark — keep the purple→amber gradient for drama */}
            <ScrambleText
              text="E-CELL"
              active={sc.ecell} speed={42} stagger={90}
              style={{
                fontFamily: "'Exo 2',sans-serif", fontWeight: 900,
                fontSize: "clamp(5.5rem,18vw,14rem)", lineHeight: 1,
                letterSpacing: "-0.02em",
                // Amber-to-white gradient — warm, not cyan
                background: "linear-gradient(158deg,#ffffff 0%,#ffd97a 42%,#E8A020 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(232,160,32,0.35))",
                userSelect: "none", textAlign: "center", minHeight: "14rem",
              }}
            />

            <motion.div style={{ y: subY, opacity: subOpacity, marginTop: "1.6rem" }}>
              <ScrambleText
                text="IISER  BHOPAL"
                active={sc.sub} speed={36} stagger={60}
                style={{
                  fontFamily: "'Exo 2',sans-serif", fontWeight: 200, fontStyle: "italic",
                  fontSize: "clamp(0.9rem,3.2vw,1.9rem)", letterSpacing: "0.30em",
                  color: "rgba(255,255,255,0.55)", height: "2rem", textAlign: "center",
                }}
              />
            </motion.div>
          </motion.div>

          <ScrollNudge opacity={nudgeOpacity} />

        </motion.div>
      </div>
    </>
  );
}