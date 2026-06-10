"use client";
// components/DeferredScene.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps any Three.js (or other heavy WebGL) scene so it only mounts AFTER
// the intro sequence finishes. This prevents the shader compilation spike
// (the X4122 HLSL warnings) from competing with the intro animation on the
// main thread at page load.
//
// Usage — replace your current scene mount:
//   Before: <MyThreeScene />
//   After:  <DeferredScene><MyThreeScene /></DeferredScene>
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useIntroActive } from "@/components/IntroProvider";

export default function DeferredScene({
  children,
  delayMs = 100,
}: {
  children: React.ReactNode;
  /** Extra ms to wait after intro ends before mounting. Default 100ms gives
   *  the browser one paint cycle to settle before starting shader compile. */
  delayMs?: number;
}) {
  const introActive = useIntroActive();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don't mount while intro is playing
    if (introActive) return;
    const t = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(t);
  }, [introActive, delayMs]);

  if (!ready) return null;
  return <>{children}</>;
}