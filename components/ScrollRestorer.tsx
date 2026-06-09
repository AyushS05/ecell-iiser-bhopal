//scroll restorer
"use client";
import { useEffect } from "react";
import { useIntroActive } from "@/components/IntroProvider";

export default function ScrollRestorer() {
  const introActive = useIntroActive();

  useEffect(() => {
    // 1. Pause execution if the intro sequence is still running
    if (introActive) return;

    const target = sessionStorage.getItem("ecell_scroll_to");
    if (!target) return;

    // 2. Poll for the element instead of guessing the load time.
    // This guarantees the scroll fires even if the page takes a second to render.
    let attempts = 0;
    const interval = setInterval(() => {
      const element = document.getElementById(target);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        sessionStorage.removeItem("ecell_scroll_to");
        clearInterval(interval);
      }
      
      attempts++;
      if (attempts > 20) { 
        // Failsafe: Give up after 2 seconds so it doesn't poll forever
        sessionStorage.removeItem("ecell_scroll_to");
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [introActive]);

  return null;
}