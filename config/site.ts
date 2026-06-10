// config/site.ts

export const siteConfig = {
  name: "E-Cell IISER Bhopal",
  shortName: "E-Cell",
  tagline: "Student Startup Incubator & Pitch Portal",
  
  description:
    "E-Cell IISER Bhopal empowers students to build science-backed startups. Join our deep-tech incubator, pitch programs, and global mentorship network.",
    
  url: "https://iice.iiserbhopal.ac.in",
  ogImage: "/og.png",

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { label: "Vision", href: "/#vision" },
    { label: "Team", href: "/team" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Pitch Portal", href: "/#pitch" },
    { label: "Contact", href: "/#contact" },
  ],

  // ── Hero Section ─────────────────────────────────────────────────────────
  hero: {
    badge: "From Lab to Launchpad ",
    headline: ["Turn Breakthroughs", "Into Businesses", "at IISER Bhopal"],
    subheadline:
      "Welcome to the Entrepreneurship Cell at IISER Bhopal. As the premier student startup incubator on campus, we provide the resources, mentorship, and platform to help visionary minds translate academic excellence into real-world impact. Stop waiting. Start building your startup today.",
    ctaPrimary: { label: "Pitch Your Idea", href: "/#pitch" },
    ctaSecondary: { label: "Our Vision", href: "/#vision" },
    stats: [
      { value: "∞", label: "Ideas Welcome" },
      { value: "2024", label: "Founding Year" },
      { value: "100+", label: "Students Ready" },
      { value: "IISER", label: "World-Class Research" },
    ],
  },

  // ── Bento Grid / Pillars ─────────────────────────────────────────────────
  pillars: {
    sectionLabel: "What We're Building",
    headline: " Pillars of the Entrepreneurial Ecosystem",
    description: 
      "Our student startup incubator bridges the gap between scientific research at IISER Bhopal and commercial enterprise. The Entrepreneurship Cell fosters a culture of innovation, nurturing student founders from ideation to execution. Whether you are developing deep-tech software, hardware prototypes, or sustainable business models, our ecosystem provides the comprehensive support needed to launch successful ventures.",
    items: [
      {
        id: "incubation",
        icon: "Rocket",
        title: "Incubation Lab",
        description:
          "A dedicated physical and virtual space for student ventures. We provide mentorship, rapid prototyping resources, and a structured incubation program to take your startup idea from a whiteboard concept to a fully functional Minimum Viable Product (MVP).",
        accent: "cyan",
        size: "large",
        comingSoon: "Fingers Crossed",
      },
      {
        id: "hackathons",
        icon: "Zap",
        title: "Hackathons & Sprints",
        description:
          "Join our intensive annual hackathons and design sprints to build innovative solutions, meet potential co-founders, and compete for seed funding. These events are the heartbeat of student entrepreneurship at IISER Bhopal.",
        accent: "violet",
        size: "small",
        comingSoon: "First Hackathon: Aug 2026(Hopefully!!!)",
      },
      {
        id: "mentorship",
        icon: "Users",
        title: "Mentorship Network",
        description:
          "Direct access to alumni founders, investors, and domain experts who have successfully built and scaled companies. Get actionable advice through office hours, not just passive inspiration.",
        accent: "green",
        size: "small",
        comingSoon: "Launching Soon",
      },
      {
        id: "alumni",
        icon: "Globe",
        title: "Alumni Network",
        description:
          "Tap into the global network of IISER alumni across top startups, research institutions, and venture capital firms. Your unfair advantage in the business world starts here.",
        accent: "amber",
        size: "medium",
        comingSoon: "Building Now",
      },
      {
        id: "funding",
        icon: "TrendingUp",
        title: "Seed Funding Access",
        description:
          "Strategic partnerships with angel networks and early-stage venture funds specifically aligned with deep-tech, sustainable, and science-driven student startups.",
        accent: "rose",
        size: "medium",
        comingSoon: "In Progress",
      },
    ],
  },

  // ── Pitch Portal Form ────────────────────────────────────────────────────
  pitchPortal: {
    sectionLabel: "Pitch Portal",
    headline: "Your Idea Deserves a Stage",
    subheadline:
      "Every massive enterprise started as a simple idea. Fill out the form below to submit your venture to our student startup incubator. Every submission is rigorously reviewed by the Entrepreneurship Cell founding team, and top applicants receive 1:1 mentorship sessions.",
    successMessage:
      "Your pitch has been received. We'll review it and reach out within 5 business days. The future is being built — and you're part of it.",
    stages: [
      { value: "idea", label: "Just an Idea" },
      { value: "prototype", label: "Working Prototype" },
      { value: "mvp", label: "MVP / Early Traction" },
      { value: "revenue", label: "Revenue Stage" },
    ],
  },

 // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    tagline: "Building tomorrow's founders, today.",
    institution: "Indian Institute of Science Education and Research, Bhopal",
    address: "Bhauri, Bhopal Bypass Road, Bhopal - 462066, Madhya Pradesh",
    email: "ecell@iiserb.ac.in",
    footerLinks: [
      { label: "Explore Our Vision", href: "/#vision" },
      { label: "Meet the Team", href: "/team" },
      { label: "Upcoming Events", href: "/events" },
      { label: "Read Our Blog", href: "/blog" },
      { label: "Submit a Pitch", href: "/#pitch" },
      { label: "IICE(Innovation and Incubation Center for Entrepreneurship )IISER Bhopal", href: "https://iice.iiserb.ac.in/" },
    ],
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/ecell-sdc-iiser-bhopal/", icon: "Linkedin" },
      { label: "Instagram", href: "https://www.instagram.com/ecell_iiserb?igsh=c2U2c3F4YTM5ejZs", icon: "Instagram" },
      { label: "Twitter / X", href: "#", icon: "Twitter" },
      { label: "GitHub", href: "#", icon: "Github" },
    ],
    copyright: `© ${new Date().getFullYear()} E-Cell IISER Bhopal. All rights reserved.`,
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;