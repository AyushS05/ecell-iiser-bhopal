// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import StarStream from "@/components/ui/StarStream";
import { IntroProvider } from "@/components/IntroProvider";

// (metadata export stays here, in the Server Component layout)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0b09] text-white antialiased overflow-x-hidden relative min-h-screen">
        {/*
          IntroProvider lifts the introActive boolean to layout level.
          Both Navbar and ScrollIntro read/write this shared state,
          even though they're siblings in the tree.
        */}
        <IntroProvider>
          <StarStream />
          {/* Navbar reads introActive → renders null while intro plays */}
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
        </IntroProvider>
      </body>
    </html>
  );
}