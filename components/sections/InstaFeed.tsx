"use client";
// components/sections/InstaFeed.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism — Instagram embed section.
// FIXED: High contrast text, hardcoded fonts, corrected flex alignment.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function InstaFeed() {
  const POST_ID = "DUvA99MAQaC";
  const instaHref =
    (siteConfig as any).footer?.socials?.find((s: any) => s.label === "Instagram")?.href ?? "#";

  return (
    <section
      className="relative py-24 px-0"
      style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "2rem" }}
        >
          <div>
            <span
              className="inline-flex items-center gap-3 mb-5"
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)", // Much brighter
              }}
            >
              <span className="w-5 h-px" style={{ background: "#e8a020", opacity: 0.9 }} />
              From the Cell
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 6vw, 4.5rem)",
                lineHeight: 0.95, letterSpacing: "0.02em",
                color: "#ffffff", textTransform: "uppercase",
              }}
            >
              Latest on Instagram
            </h2>
          </div>

          <a
            href={instaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 transition-all duration-200 flex-shrink-0"
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e8a020")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          >
            @ecell_iiserbhopal
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* ── Embed + info row ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>

          {/* Instagram embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5"
            style={{ borderRight: "1px solid rgba(255,255,255,0.15)" }}
          >
            <iframe
              src={`https://www.instagram.com/p/${POST_ID}/embed`}
              className="w-full"
              style={{ aspectRatio: "4/5", display: "block", border: "none", background: "#0c0b09" }}
              allow="encrypted-media"
              title="Instagram Post from E-Cell IISER Bhopal"
            />
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            // Changed justify-between to justify-center with a solid gap to fix awkward spacing
            className="md:col-span-7 flex flex-col justify-center gap-10 p-10 md:p-14"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* Top: label + content */}
            <div>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "2rem",
                }}
              >
                Latest Update
              </span>

              <div
                className="w-8 h-px mb-6"
                style={{ background: "#e8a020", opacity: 0.8 }}
              />

              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem",
                  lineHeight: 1.05, letterSpacing: "0.02em",
                  color: "#ffffff", textTransform: "uppercase",
                  marginBottom: "1.2rem",
                }}
              >
                Latest from E-Cell
              </h3>

              <p
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.85rem",
                  lineHeight: 1.7, color: "rgba(255,255,255,0.6)",
                  maxWidth: "420px",
                }}
              >
                Join E-Cell IISER Bhopal for the latest updates on upcoming pitch events,
                startup incubation programmes, and campus entrepreneurship news.
              </p>
            </div>

            {/* Bottom: follow CTA */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "2.5rem" }}>
              <a
                href={instaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 transition-all duration-200"
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  border: "1px solid rgba(232,160,32,0.6)",
                  color: "#e8a020",
                  padding: "12px 24px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#e8a020";
                  (e.currentTarget as HTMLElement).style.color = "#000000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#e8a020";
                }}
              >
                FOLLOW ON INSTAGRAM
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}