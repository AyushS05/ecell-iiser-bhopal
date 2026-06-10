// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import StarStream from "@/components/ui/StarStream";
import { IntroProvider } from "@/components/IntroProvider";
import DeferredScene from "@/components/DeferredScene"; // <-- 1. Import it here

// (metadata export stays here)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0b09] text-white antialiased overflow-x-hidden relative min-h-screen">
        <IntroProvider>
          {/* 2. Wrap your 3D component (StarStream) so it waits for the intro to finish */}
          <DeferredScene>
            <StarStream />
          </DeferredScene>
          
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
        </IntroProvider>
      </body>
    </html>
  );
}