"use client";
// components/sections/InstaFeed.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism — Instagram embed section.
// Ruled borders, Bebas Neue headline, amber accent. No gradients.
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
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "2rem" }}
        >
          <div>
            <span
              className="inline-flex items-center gap-3 mb-5"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(240,237,230,0.3)",
              }}
            >
              <span className="w-5 h-px" style={{ background: "var(--color-amber)", opacity: 0.7 }} />
              From the Cell
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 0.95, letterSpacing: "0.01em",
                color: "rgba(240,237,230,0.88)", textTransform: "uppercase",
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
              fontFamily: "var(--font-mono)", fontSize: "0.68rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(240,237,230,0.35)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-amber)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.35)")}
          >
            @ecell_iiserbhopal
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* ── Embed + info row ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Instagram embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5"
            style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
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
            className="md:col-span-7 flex flex-col justify-between p-10"
            style={{ background: "rgba(255,255,255,0.015)" }}
          >
            {/* Top: label + content */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(240,237,230,0.25)", display: "block", marginBottom: "2rem",
                }}
              >
                Latest Update
              </span>

              <div
                className="w-8 h-px mb-6"
                style={{ background: "var(--color-amber)", opacity: 0.6 }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-display)", fontSize: "1.8rem",
                  lineHeight: 1.05, letterSpacing: "0.02em",
                  color: "rgba(240,237,230,0.85)", textTransform: "uppercase",
                  marginBottom: "1.2rem",
                }}
              >
                Latest from E-Cell
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.78rem",
                  lineHeight: 1.7, color: "rgba(240,237,230,0.35)",
                  maxWidth: "380px",
                }}
              >
                Join E-Cell IISER Bhopal for the latest updates on upcoming pitch events,
                startup incubation programmes, and campus entrepreneurship news.
              </p>
            </div>

            {/* Bottom: follow CTA */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem", marginTop: "3rem" }}>
              <a
                href={instaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  border: "1px solid rgba(232,160,32,0.4)",
                  color: "var(--color-amber)",
                  padding: "10px 20px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-amber)";
                  (e.currentTarget as HTMLElement).style.color = "#0c0b09";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-amber)";
                }}
              >
                FOLLOW ON INSTAGRAM
                <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}