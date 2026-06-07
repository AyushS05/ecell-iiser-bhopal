"use client";
// components/sections/BentoGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism — E-Cell Pillars section.
// Cards are magazine-style tiles: large index number, ruled border, sparse text.
// No glass. No gradient blobs. No rainbow icon colors.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

// ── Status badge variants ─────────────────────────────────────────────────────
// We map the comingSoon string to a display label and style.
// Everything uses a single amber accent or pure white — no per-card color.
function StatusBadge({ text }: { text: string }) {
  const isLive = /live|active|open/i.test(text);
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.6rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: isLive ? "var(--color-amber)" : "rgba(240,237,230,0.28)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: isLive ? "var(--color-amber)" : "rgba(240,237,230,0.2)",
          animation: isLive ? "amber-pulse 1.8s ease-in-out infinite" : undefined,
        }}
      />
      {text}
    </span>
  );
}

// ── Editorial Pillar Card ─────────────────────────────────────────────────────
interface PillarCardProps {
  id: string;
  icon: string;       // kept in props but we won't use it — replaced by large index number
  title: string;
  description: string;
  accent: string;     // kept for API compatibility
  size: string;
  comingSoon: string;
  index: number;
}

function PillarCard({ title, description, comingSoon, size, index }: PillarCardProps) {
  const shouldReduce = useReducedMotion();
  const isLarge = size === "large";
  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={isLarge ? "md:col-span-2" : ""}
    >
      <div
        className="group relative h-full flex flex-col justify-between p-7 md:p-8 transition-all duration-400 cursor-default"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.015)",
          minHeight: isLarge ? "260px" : "220px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232, 160, 32, 0.25)";
          (e.currentTarget as HTMLDivElement).style.background = "rgba(232, 160, 32, 0.03)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.015)";
        }}
      >
        {/* Top row: index + status */}
        <div className="flex items-start justify-between mb-6">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3.5rem",
              lineHeight: 1,
              color: "rgba(232, 160, 32, 0.18)",
              letterSpacing: "0.02em",
              transition: "color 0.3s ease",
            }}
            className="group-hover:!text-[rgba(232,160,32,0.35)]"
          >
            {displayIndex}
          </span>
          <StatusBadge text={comingSoon} />
        </div>

        {/* Title */}
        <div className="flex-1 flex flex-col justify-end">
          <div
            className="w-8 h-px mb-5 transition-all duration-300 group-hover:w-14"
            style={{ background: "var(--color-amber)", opacity: 0.5 }}
          />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isLarge ? "1.9rem" : "1.5rem",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              color: "rgba(240,237,230,0.85)",
            }}
            className="mb-3 uppercase"
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              lineHeight: 1.65,
              color: "rgba(240,237,230,0.35)",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Pillars config shape ───────────────────────────────────────────────────────
interface PillarsConfig {
  sectionLabel: string;
  headline: string;
  description: string;
  items: PillarCardProps[];
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BentoGrid() {
  const pillars = siteConfig.pillars as unknown as PillarsConfig;
  const { sectionLabel, headline, description, items } = pillars;

  return (
    <section id="vision" className="relative py-28 px-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-white/[0.07] pb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left: label + headline */}
            <div className="flex-1 max-w-2xl">
              <span
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em" }}
                className="inline-flex items-center gap-3 text-white/30 uppercase mb-5"
              >
                <span className="w-5 h-px" style={{ background: "var(--color-amber)", opacity: 0.7 }} />
                {sectionLabel}
              </span>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "0.01em",
                  color: "rgba(240,237,230,0.9)",
                }}
                className="uppercase"
              >
                {headline}
              </h2>
            </div>

            {/* Right: description */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "rgba(240,237,230,0.35)",
                maxWidth: "340px",
              }}
              className="md:text-right"
            >
              {description}
            </p>
          </div>
        </motion.div>

        {/* ── Pillar Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.07]">
          {items.map((item, i) => (
            <PillarCard key={item.id} {...item} index={i} />
          ))}
        </div>

        {/* ── Bottom CTA Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-8 py-7"
          style={{ border: "1px solid rgba(255,255,255,0.07)", borderTop: "none" }}
        >
          <div>
            <p
              style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.04em" }}
              className="text-white/75 uppercase mb-1"
            >
              Want to shape what we build?
            </p>
            <p
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
              className="text-white/30 uppercase"
            >
              Members get early access to every program.
            </p>
          </div>
          <Link href="#pitch">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group shrink-0 inline-flex items-center gap-2.5 px-6 py-3 transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                border: "1px solid var(--color-amber)",
                color: "var(--color-amber)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--color-amber)";
                (e.currentTarget as HTMLButtonElement).style.color = "#0c0b09";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-amber)";
              }}
            >
              JOIN AS A MEMBER
              <ArrowUpRight size={13} />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}