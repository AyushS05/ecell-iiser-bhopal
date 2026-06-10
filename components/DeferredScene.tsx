"use client";
// components/DeferredScene.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps any Three.js (or other heavy WebGL) scene so it only mounts AFTER
// the intro sequence finishes AND the browser has fully painted the post-intro
// frame. This prevents shader compilation (X4122 warnings) from janking the
// intro animation.
//
// FIX: Previously, setIntroActive(false) was called inside finish() while the
// flash/fade animation was still running (~55ms). DeferredScene would unmount
// and start Three.js shader compile mid-animation, causing visible stutter.
// Now we wait for introActive=false AND two rAF ticks + delayMs before mount.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { useIntroActive } from "@/components/IntroProvider";

export default function DeferredScene({
  children,
  delayMs = 300,
}: {
  children: React.ReactNode;
  /**
   * Extra ms to wait after intro ends before mounting.
   * Default 300ms: gives the browser time to paint the post-intro frame
   * and settle before starting shader compilation.
   * Increase if you still see jank on slower machines.
   */
  delayMs?: number;
}) {
  const introActive = useIntroActive();
  const [ready, setReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf1Ref  = useRef<number | null>(null);
  const raf2Ref  = useRef<number | null>(null);

  useEffect(() => {
    // Don't mount while intro is playing
    if (introActive) return;

    // Wait for TWO rAF cycles (guarantees the browser has painted the
    // post-intro frame) then add delayMs on top before mounting WebGL.
    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(() => {
        timerRef.current = setTimeout(() => setReady(true), delayMs);
      });
    });

    return () => {
      if (raf1Ref.current)  cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current)  cancelAnimationFrame(raf2Ref.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [introActive, delayMs]);

  if (!ready) return null;
  return <>{children}</>;
}