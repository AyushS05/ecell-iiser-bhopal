"use client";
// components/sections/Footer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism Footer.
// FIXED: High contrast text, structured borders, hardcoded fonts and hex colors.
// FIXED: Duplicate React key error on legal links mapping.
// ADDED: Subtle "developed by Ayush Sarkar" credit in bottom bar.
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
  const { footer } = siteConfig as any;

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
      style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
    >
      {/* Top amber rule accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(232,160,32,0.8) 40%, rgba(232,160,32,0.8) 60%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Upper block: brand + columns ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
        >
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-4 py-14 flex flex-col"
            style={{ borderRight: "1px solid rgba(255,255,255,0.15)", paddingRight: "3rem" }}
          >
            {/* Wordmark */}
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="E-Cell Logo"
                width={32}
                height={32}
                className="object-contain"
                style={{ width: "auto", height: "auto", opacity: 0.9 }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.06em",
                    color: "#ffffff",
                    lineHeight: 1,
                  }}
                >
                  E-CELL
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  IISER Bhopal
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)",
                marginBottom: "2rem",
              }}
            >
              {footer.tagline}
            </p>

            {/* Socials row */}
            <div className="flex items-center gap-3">
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
                    className="flex items-center justify-center w-9 h-9 transition-all duration-200"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.6)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#e8a020";
                      (e.currentTarget as HTMLElement).style.color = "#e8a020";
                      (e.currentTarget as HTMLElement).style.background = "rgba(232,160,32,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <Icon size={14} />
                  </motion.a>
                );
              })}
            </div>

            {/* Legal links — anchored to bottom of brand column */}
            <div className="flex items-center gap-5 mt-auto pt-10">
              {footer.legalLinks.map((link: { href: string; label: string }) => (
                <Link
                  key={link.label}
                  href={link.href as any}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.3)",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="md:col-span-4 py-14 flex flex-col gap-6"
            style={{
              paddingLeft: "3rem",
              paddingRight: "3rem",
              borderRight: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
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
              style={{ color: "rgba(255,255,255,0.6)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e8a020")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
            >
              <Mail size={14} className="mt-0.5 shrink-0" />
              <span
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}
              >
                {footer.email}
              </span>
            </a>

            {/* Address */}
            <div
              className="flex items-start gap-3"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <div>
                <div
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}
                >
                  {footer.institution}
                </div>
                <div
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", marginTop: "4px", color: "rgba(255,255,255,0.4)" }}
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
              className="group inline-flex items-center gap-2 transition-all duration-200 mt-2"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e8a020")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
            >
              <span
                className="transition-all duration-300 group-hover:w-5"
                style={{ display: "inline-block", width: "12px", height: "1px", background: "currentColor" }}
              />
              IISER Bhopal Official Site
              <ArrowUpRight size={11} style={{ opacity: 0.8 }} />
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
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                display: "block",
                marginBottom: "1.5rem",
              }}
            >
              Quick Links
            </span>
            <ul className="flex flex-col gap-0" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              {footer.footerLinks.map((link: any) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <li
                    key={link.href}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <Link
                      href={link.href as any}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between py-3 transition-all duration-200"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        color: "rgba(255,255,255,0.6)",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        style={{ opacity: 0, transition: "opacity 0.2s", color: "#e8a020" }}
                        className="group-hover:opacity-100"
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

          {/* Left: copyright only */}
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {footer.copyright}
          </p>

          {/* Right corner: developer credit linked to LinkedIn */}
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/ayush-sarkar-04b7b5371"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(232,160,32,0.45)", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e8a020")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(232,160,32,0.45)")}
            >
              Ayush Sarkar
            </a>
          </p>

        </div>

      </div>
    </footer>
  );
}