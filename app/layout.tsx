// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Replace your existing layout.tsx with this.
// Google Fonts are loaded via <link> in <head>, NOT via @import in globals.css.
// This is required because Tailwind v4 / Turbopack requires @import "tailwindcss"
// to be the very first statement in the CSS file.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // ... your existing metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*
          Load Google Fonts here — NEVER via @import in globals.css when using
          Tailwind v4 / Turbopack, because @import must be the very first line
          and @import "tailwindcss" must precede all other @import rules.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}