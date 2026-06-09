"use client";
// components/sections/BentoGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism — E-Cell Pillars section.
// FIXED: High contrast grid lines, vivid hover states, hardcoded fonts/colors.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

// ── Status badge variants ─────────────────────────────────────────────────────
function StatusBadge({ text }: { text: string }) {
  const isLive = /live|active|open/i.test(text);
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: isLive ? "#e8a020" : "rgba(255,255,255,0.4)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: isLive ? "#e8a020" : "rgba(255,255,255,0.2)",
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
        className="group relative h-full flex flex-col justify-between p-7 md:p-10 transition-all duration-300 cursor-default"
        style={{
          background: "rgba(12,11,9,0.95)", // Solid dark background for the card
          minHeight: isLarge ? "280px" : "240px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "rgba(232, 160, 32, 0.04)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "rgba(12,11,9,0.95)";
        }}
      >
        {/* Top row: index + status */}
        <div className="flex items-start justify-between mb-6">
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "4rem",
              lineHeight: 1,
              color: "rgba(232, 160, 32, 0.3)", // Much brighter resting state
              letterSpacing: "0.02em",
              transition: "color 0.3s ease",
            }}
            className="group-hover:!text-[#e8a020]" // Illuminates fully on hover
          >
            {displayIndex}
          </span>
          <StatusBadge text={comingSoon} />
        </div>

        {/* Title */}
        <div className="flex-1 flex flex-col justify-end">
          <div
            className="w-8 h-[2px] mb-6 transition-all duration-300 group-hover:w-16"
            style={{ background: "#e8a020", opacity: 0.8 }}
          />
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isLarge ? "2.2rem" : "1.8rem",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              color: "#ffffff",
            }}
            className="mb-4 uppercase"
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.85rem",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.6)", // Highly readable description
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
          className="mb-16 border-b pb-10"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left: label + headline */}
            <div className="flex-1 max-w-2xl">
              <span
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)" }}
                className="inline-flex items-center gap-3 uppercase mb-5"
              >
                <span className="w-5 h-px" style={{ background: "#e8a020", opacity: 0.9 }} />
                {sectionLabel}
              </span>

              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "0.02em",
                  color: "#ffffff",
                }}
                className="uppercase"
              >
                {headline}
              </h2>
            </div>

            {/* Right: description */}
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)",
                maxWidth: "380px",
              }}
              className="md:text-right"
            >
              {description}
            </p>
          </div>
        </motion.div>

        {/* ── Pillar Grid ── */}
        {/* FIX: bg-white/[0.15] makes the gap lines sharply visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.15] border border-white/[0.15]">
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
          className="mt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-8 py-8"
          style={{ border: "1px solid rgba(255,255,255,0.15)", borderTop: "none" }}
        >
          <div>
            <p
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.04em", color: "#ffffff" }}
              className="uppercase mb-1"
            >
              Want to shape what we build?
            </p>
            <p
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)" }}
              className="uppercase"
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
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                border: "1px solid #e8a020",
                color: "#e8a020",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#e8a020";
                (e.currentTarget as HTMLButtonElement).style.color = "#0c0b09";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#e8a020";
              }}
            >
              JOIN AS A MEMBER
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}