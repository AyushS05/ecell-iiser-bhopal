"use client";
// components/sections/Footer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism Footer.
// Ruled borders, DM Mono, single amber accent. No glass, no gradients.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ExternalLink, ArrowUpRight } from "lucide-react";
import { FaLinkedin, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";
import { siteConfig } from "@/config/site";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Linkedin:  FaLinkedin,
  Instagram: FaInstagram,
  Twitter:   FaXTwitter,
  Github:    FaGithub,
};

export default function Footer() {
  const { footer, name, shortName } = siteConfig as any;

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      window.location.href = `mailto:${footer.email}`;
    } else {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${footer.email}`;
      const newTab = window.open(gmailUrl, "_blank", "noopener,noreferrer");
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        window.location.href = gmailUrl;
      }
    }
  };

  return (
    <footer
      id="contact"
      className="relative"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Top amber rule accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(232,160,32,0.4) 40%, rgba(232,160,32,0.4) 60%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Upper block: brand + columns ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-4 py-14"
            style={{ borderRight: "1px solid rgba(255,255,255,0.07)", paddingRight: "3rem" }}
          >
            {/* Wordmark */}
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="E-Cell Logo"
                width={32}
                height={32}
                className="object-contain"
                style={{ width: "auto", height: "auto", opacity: 0.8 }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.3rem",
                    letterSpacing: "0.06em",
                    color: "#f0ede6",
                    lineHeight: 1,
                  }}
                >
                  E-CELL
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.12em",
                    color: "rgba(240,237,230,0.28)",
                    textTransform: "uppercase",
                  }}
                >
                  IISER Bhopal
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                lineHeight: 1.7,
                color: "rgba(240,237,230,0.35)",
                marginBottom: "2rem",
              }}
            >
              {footer.tagline}
            </p>

            {/* Socials row */}
            <div className="flex items-center gap-2">
              {footer.socials.map((social: any) => {
                const Icon = SOCIAL_ICONS[social.icon] ?? ExternalLink;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8 transition-all duration-200"
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(240,237,230,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,160,32,0.5)";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-amber)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.35)";
                    }}
                  >
                    <Icon size={13} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="md:col-span-4 py-14 flex flex-col gap-5"
            style={{
              paddingLeft: "3rem",
              paddingRight: "3rem",
              borderRight: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(240,237,230,0.28)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Contact
            </span>

            {/* Email */}
            <a
              href={`mailto:${footer.email}`}
              onClick={handleEmailClick}
              className="group flex items-start gap-3 transition-colors duration-200"
              style={{ color: "rgba(240,237,230,0.4)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-amber)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.4)")}
            >
              <Mail size={13} className="mt-0.5 shrink-0" />
              <span
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
              >
                {footer.email}
              </span>
            </a>

            {/* Address */}
            <div
              className="flex items-start gap-3"
              style={{ color: "rgba(240,237,230,0.35)" }}
            >
              <MapPin size={13} className="mt-0.5 shrink-0" />
              <div>
                <div
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(240,237,230,0.45)" }}
                >
                  {footer.institution}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", marginTop: "3px", color: "rgba(240,237,230,0.28)" }}
                >
                  {footer.address}
                </div>
              </div>
            </div>

            {/* IISER link */}
            <a
              href="https://www.iiserb.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "rgba(240,237,230,0.28)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-amber)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.28)")}
            >
              <span
                className="transition-all duration-300 group-hover:w-5"
                style={{ display: "inline-block", width: "12px", height: "1px", background: "currentColor" }}
              />
              IISER Bhopal Official Site
              <ArrowUpRight size={10} style={{ opacity: 0.6 }} />
            </a>
          </motion.div>

          {/* Quick Links column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="md:col-span-4 py-14"
            style={{ paddingLeft: "3rem" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(240,237,230,0.28)",
                display: "block",
                marginBottom: "1.2rem",
              }}
            >
              Quick Links
            </span>
            <ul className="flex flex-col gap-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {footer.footerLinks.map((link: any) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <li
                    key={link.href}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <Link
                      href={link.href as any}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between py-3 transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.06em",
                        color: "rgba(240,237,230,0.35)",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.8)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,230,0.35)")}
                    >
                      {link.label}
                      <ArrowUpRight
                        size={11}
                        style={{ opacity: 0, transition: "opacity 0.2s" }}
                        className="group-hover:opacity-60"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              color: "rgba(240,237,230,0.18)",
            }}
          >
            {footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            {footer.legalLinks.map((link: { href: string; label: string }) => (
              <Link
                key={link.href}
                href={link.href as any}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                  color: "rgba(240,237,230,0.18)",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(240,237,230,0.5)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(240,237,230,0.18)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}