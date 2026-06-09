"use client";

import { useRef, MouseEvent as ReactMouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Mail } from "lucide-react";
import StarStream from "@/components/ui/StarStream";

// --- CUSTOM ICONS ---
const Github = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// --- TEAM DATA ---
const coordinators = [
  {
    name: "Dishank. K",
    image: "/team/dishank.jpg",
    role: "Coordinator",
    department: "BS engineering 3rd Year",
    bio: "You miss 100% of the shots you don't take - Wayne Gretzky - Michael Scott",
    socials: { email: "mailto:dishank24@iiserb.ac.in" }
  },
  {
    name: "Madhav Basatia",
    image: "/team/madhav.jpg",
    role: "Coordinator",
    department: "BS Economics 3rd Year",
    bio: "Decoding the unseen.",
    socials: { email: "mailto:madhav24@iiserb.ac.in" },
  },
];

const team = [
  {
    name: "Ayush Sarkar",
    image: "/team/ayush.jpg",
    role: "Junior Associate",
    department: "BTech · 2nd Year",
    bio: "Trying to keep ahead of the merge conflicts.",
    socials: {
      linkedin: "https://www.linkedin.com/in/ayush-sarkar-04b7b5371",
      github: "https://github.com/AyushS05",
      email: "mailto:ayushsarkar052006@gmail.com",
    },
  },
  {
    name: "Sarvesh Shamkuwar",
    image: "/team/sarvesh.jpg",
    role: "Junior Associate",
    department: "BS Economics · 2nd Year",
    bio: "I'm like an index fund: highly diversified across every single department.",
    socials: {
      linkedin: "https://www.linkedin.com/in/sarvesh-shamkuwar-b5b1062b4",
      email: "mailto:sarvesh25@iiserb.ac.in",
    },
  },
  {
    name: "Aarushi Bhattacharya",
    image: "/team/aarushi.jpg",
    role: "Social Media Head",
    department: "Economics · 2nd Year",
    bio: "THE PURPOSE OF LIFE IS LIFE OF PURPOSE",
    socials: { email: "mailto:aarushi25@iiserb.ac.in" },
  },
  {
    name: "Gyan Deepika Gandepalli",
    image: "/team/gyan.jpg",
    role: "Social Media Team",
    department: "BS Economics · 2nd Year",
    bio: "Hotel (I panicked)",
    socials: {
      linkedin: "https://www.linkedin.com/in/gyan-deepika-gandepalli-23820b2a4",
      email: "mailto:gyan25@iiserb.ac.in",
    },
  },
  {
    name: "Lekhraj Sawner",
    image: "/team/lekhraj.jpg",
    role: "Junior Associate",
    department: "BTech (Engineering Science) · 2nd Year",
    bio: "Tech logic. Business magic",
    socials: {
      linkedin: "https://www.linkedin.com/in/lekhraj-sawner-32767a378",
      email: "mailto:lekhraj25@iiserb.ac.in",
    },
  },
  {
    name: "Ayush Bhoi",
    image: "/team/ayush_b.jpg",
    role: "Event Management",
    department: "BTech · 2nd Year",
    bio: "A Cool Techy Person who likes talking with people ;)",
    socials: { email: "mailto:ayushb25@iiserb.ac.in" },
  },
  {
    name: "Smruti Ranjan Sethy",
    image: "/team/smruti.jpg",
    role: "Junior Associate",
    department: "BS Economics · 2nd Year",
    bio: "I read half of a business book once, so I'm basically an industry expert.",
    socials: { linkedin: "https://www.linkedin.com/in/smruti-ranjan-sethy-056807268" },
  },
  {
    name: "Shrinivas Manoj Ingawale",
    image: "/team/shrinivas.jpg",
    role: "PR Team",
    department: "BS-MS · 2nd Year",
    bio: "Curious about startups, entrepreneurship, and discovering new business ideas.",
    socials: { email: "mailto:ingawale25@iiserb.ac.in" },
  },
];

// --- ANIMATED SECTION HEADING (BRUTALIST) ---
function SectionHeading({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mb-12 border-b border-white/[0.15] pb-4 flex items-end justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="inline-flex items-center gap-3 mb-2"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}
        >
          <span className="w-5 h-px" style={{ background: "#e8a020" }} />
          Directory
        </span>
        <h2
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", lineHeight: 0.9, letterSpacing: "0.02em", color: "#ffffff", textTransform: "uppercase" }}
        >
          {label}
        </h2>
      </motion.div>
    </div>
  );
}

// --- MEET THE TEAM HERO (BRUTALIST) ---
function MeetTheTeamHero() {
  return (
    <div className="max-w-7xl mx-auto mb-24 mt-12 border-l-4 pl-6 md:pl-10" style={{ borderColor: "#e8a020" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.18em", color: "#e8a020", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}
        >
          The Core Network
        </span>
        <h1
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.85, letterSpacing: "0.01em", color: "#ffffff", textTransform: "uppercase", wordBreak: "break-word" }}
        >
          MEET THE <br />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>TEAM.</span>
        </h1>
        <p
          className="mt-8 max-w-xl"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}
        >
          The innovators, builders, and thinkers driving the entrepreneurship ecosystem at IISER Bhopal. No fluff, just impact.
        </p>
      </motion.div>
    </div>
  );
}

// --- TILT CARD (SPLIT LAYOUT) ---
function TiltCard({ member, isCoordinator = false }: { member: any; isCoordinator?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !sheenRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (x - rect.width / 2) / (rect.width / 2);
    const dy = (y - rect.height / 2) / (rect.height / 2);
    cardRef.current.style.transform = `perspective(900px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale3d(1.02,1.02,1.02)`;
    sheenRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 65%)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !sheenRef.current) return;
    cardRef.current.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    sheenRef.current.style.background = "transparent";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border transition-all duration-300 ease-out flex flex-col h-full"
      style={{
        transformStyle: "preserve-3d",
        borderColor: "rgba(255,255,255,0.15)",
        background: "#0c0b09",
      }}
    >
      <div ref={sheenRef} className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300" />

      {/* TOP HALF: Image Box */}
      <div 
        className={`relative w-full shrink-0 border-b border-white/[0.15] overflow-hidden bg-[#111008] ${isCoordinator ? "h-[320px]" : "h-[250px]"}`}
      >
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            // object-[center_20%] ensures faces (upper portion) don't get cropped
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "8rem", color: "rgba(232,160,32,0.1)" }}>
              {member.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Social Overlay (Only covers the image, not the text) */}
        {member.socials && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {member.socials.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noreferrer"
                  className="w-11 h-11 flex items-center justify-center text-[#e8a020] border border-[#e8a020] hover:bg-[#e8a020] hover:text-black transition-colors duration-200 pointer-events-auto">
                  <Linkedin size={18} />
                </a>
              )}
              {member.socials.github && (
                <a href={member.socials.github} target="_blank" rel="noreferrer"
                  className="w-11 h-11 flex items-center justify-center text-[#e8a020] border border-[#e8a020] hover:bg-[#e8a020] hover:text-black transition-colors duration-200 pointer-events-auto">
                  <Github size={18} />
                </a>
              )}
              {member.socials.email && (
                <a href={member.socials.email}
                  className="w-11 h-11 flex items-center justify-center text-[#e8a020] border border-[#e8a020] hover:bg-[#e8a020] hover:text-black transition-colors duration-200 pointer-events-auto">
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM HALF: Text Content Block */}
      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-7 bg-[#0c0b09] pointer-events-none">
        
        {/* Name & Role */}
        <div className="mb-4">
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", lineHeight: 1, letterSpacing: "0.02em", color: "#ffffff" }}>
            {member.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block w-1.5 h-1.5 bg-[#e8a020]" />
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#e8a020", textTransform: "uppercase" }}>
              {member.role}
            </p>
          </div>
        </div>

        {/* Department & Bio */}
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          {member.department}
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
          "{member.bio}"
        </p>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---
export default function TeamPage() {
  return (
    <>
      <StarStream />

      <main className="relative z-10 min-h-screen bg-transparent pt-32 pb-28 px-6 md:px-12">
        {/* ── Hero ── */}
        <MeetTheTeamHero />

        {/* ── Coordinators ── */}
        <section className="max-w-7xl mx-auto mb-24">
          <SectionHeading label="Coordinators" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coordinators.map((coord) => (
              <TiltCard key={coord.name} member={coord} isCoordinator />
            ))}
          </div>
        </section>

        {/* ── Core Team ── */}
        <section className="max-w-7xl mx-auto">
          <SectionHeading label="Core Team" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member) => (
              <TiltCard key={member.name} member={member} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}