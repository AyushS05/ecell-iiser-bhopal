"use client";
// components/ui/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bulletproof HMR-resistant Navbar.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useIntroActive } from "@/components/IntroProvider";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const introActive = useIntroActive();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.substring(2);

      if (pathname === "/") {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      } else {
        sessionStorage.setItem("ecell_scroll_to", targetId);
        router.push(`/#${targetId}`); 
      }
    }
    setMobileOpen(false);
  };

  // ── HMR FAILSAFE ────────────────────────────────────────────────────────
  const isHidden = introActive;

  // Render nothing ONLY during SSR to prevent hydration errors.
  if (!isMounted) return null;

  return (
    <>
      <motion.header
        key="ecell-main-navbar"
        // initial={false} prevents Framer Motion from resetting to 0 opacity on hot-reload
        initial={false} 
        animate={{ 
          y: isHidden ? -20 : 0, 
          opacity: isHidden ? 0 : 1 
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(12,11,9,0.94)",
          backdropFilter: "blur(12px)",
          // Turn off pointer events when hidden so it doesn't block clicks invisibly
          pointerEvents: isHidden ? "none" : "auto", 
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">

          {/* ── Wordmark ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="E-Cell Logo"
              width={28} height={28}
              className="object-contain"
              style={{ width: "auto", height: "auto", opacity: 0.85 }}
            />
            <div className="flex items-baseline gap-2">
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.35rem", letterSpacing: "0.06em",
                color: "#f0ede6", lineHeight: 1,
              }}>
                E-CELL
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem", letterSpacing: "0.12em",
                color: "rgba(240,237,230,0.28)", textTransform: "uppercase",
              }} className="hidden sm:block">
                IISER Bhopal
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <ul className="hidden md:flex items-center">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as any}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-2 transition-all duration-200 relative group"
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(240,237,230,0.38)",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.85)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.38)")}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "var(--color-amber)" }}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center">
            <Link href="/#pitch" onClick={(e) => handleNavClick(e, "/#pitch")} aria-label="Pitch your idea">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-4 py-2 transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  background: "var(--color-amber)", color: "#0c0b09", fontWeight: 600,
                }}
              >
                Pitch Your Idea
                <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 transition-colors duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(240,237,230,0.5)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: 56, left: 0, right: 0,
              zIndex: 99,
              background: "rgba(12,11,9,0.97)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "1rem 1.5rem",
            }}
          >
            <ul className="flex flex-col">
              {siteConfig.nav.map((link) => (
                <li key={link.href} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <Link
                    href={link.href as any}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block py-3.5 transition-colors duration-150"
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "rgba(240,237,230,0.4)",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(240,237,230,0.85)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(240,237,230,0.4)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/#pitch" onClick={(e) => handleNavClick(e, "/#pitch")} aria-label="Submit pitch">
              <button
                className="w-full mt-5 py-3.5 flex items-center justify-center gap-2"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  background: "var(--color-amber)", color: "#0c0b09", fontWeight: 600,
                }}
              >
                PITCH YOUR IDEA <ArrowUpRight size={12} />
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}