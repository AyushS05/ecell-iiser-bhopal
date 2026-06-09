// app/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ScrollIntro from "@/components/ScrollIntro"; 
import Hero from "@/components/sections/Hero";
import BentoGrid from "@/components/sections/BentoGrid";
import PitchPortal from "@/components/sections/PitchPortal";
import Footer from "@/components/sections/Footer";
import InstaFeed from "@/components/sections/InstaFeed";
import ScrollRestorer from "@/components/ScrollRestorer"; 

export const metadata: Metadata = {
  title: "E-Cell IISER Bhopal | Student Startup Incubator",
  
  description: "E-Cell IISER Bhopal empowers students to turn scientific breakthroughs into scalable startups. Join our deep-tech incubator and mentorship network.",
  keywords: [
    "E-Cell", "IISER Bhopal", "Entrepreneurship Cell", "Startup",
    "Student Entrepreneurs", "Deep Tech", "Science Startup",
    "India", "Incubation", "Hackathon",
  ],
  authors: [{ name: "E-Cell IISER Bhopal" }],
  creator: "E-Cell IISER Bhopal",
  openGraph: {
    type: "website", locale: "en_IN", url: siteConfig.url,
    title: "E-Cell IISER Bhopal | Student Startup Incubator", 
    description: "The Entrepreneurship Cell at IISER Bhopal empowers students to turn scientific breakthroughs into scalable businesses.",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image", title: siteConfig.name,
    description: siteConfig.description, images: [siteConfig.ogImage],
    creator: "@ecell_iiserbh",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: "/favicon.ico", shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(siteConfig.url),
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ScrollRestorer />
      <ScrollIntro />
      <Hero />
      <BentoGrid />
      <InstaFeed />
      <PitchPortal />
      <Footer />
    </main>
  );
}