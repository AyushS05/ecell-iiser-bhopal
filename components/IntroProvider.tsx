"use client";
// components/IntroProvider.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Lifts introActive state to a layout-level provider so that:
//   • Navbar (sibling of main) can read it and stay hidden during the intro
//   • ScrollIntro (inside main) can call onIntroEnd to signal completion
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState } from "react";

interface IntroContextValue {
  introActive: boolean;
  setIntroActive: (v: boolean) => void;
}

export const IntroContext = createContext<IntroContextValue>({
  introActive: false,        // safe default: don't hide navbar on non-intro pages
  setIntroActive: () => {},
});

export function useIntroActive()  { return useContext(IntroContext).introActive; }
export function useIntroControl() { return useContext(IntroContext); }

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window === "undefined") return false; // SSR: don't hide
    // Always start active if we are loading the root page directly.
    // The ScrollIntro component will immediately turn this off if the 
    // user just navigated back from another page.
    return window.location.pathname === "/";
  });

  return (
    <IntroContext.Provider value={{ introActive, setIntroActive }}>
      {children}
    </IntroContext.Provider>
  );
}