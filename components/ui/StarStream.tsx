"use client";
// components/StarStream.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Ambient particle field — recolored to amber/gold palette.
// Particles: warm amber. Mouse lines: pale chalk. Connection lines: amber dim.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

export default function StarStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let resizeTimeout: NodeJS.Timeout;
    let particles: Particle[] = [];

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseOut  = () => { mouse = { x: -1000, y: -1000 }; };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout",  handleMouseOut);

    class Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number;

      constructor() {
        this.x    = Math.random() * canvas!.width;
        this.y    = Math.random() * canvas!.height;
        this.vx   = (Math.random() - 0.5) * 0.5;
        this.vy   = (Math.random() - 0.5) * 0.5;
        // Mix of sizes: most tiny, a few slightly larger
        this.size = Math.random() < 0.85
          ? Math.random() * 0.9 + 0.3   // tiny: 0.3–1.2
          : Math.random() * 0.8 + 1.2;  // accent: 1.2–2.0
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height)  this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Amber particle — larger ones are brighter
        const alpha = this.size > 1.2 ? 0.75 : 0.45;
        ctx.fillStyle = `rgba(232, 160, 32, ${alpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 12000),
        55
      );
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      }, 200);
    };

    // Initial setup
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Particle–particle connection lines — amber, very faint
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(232, 160, 32, ${0.12 - dist / 900})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Mouse repulsion + connection line — chalk/warm white
        const dxM = particles[i].x - mouse.x;
        const dyM = particles[i].y - mouse.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < 120) {
          ctx.beginPath();
          // Warm white line toward cursor — subtle, not colored
          ctx.strokeStyle = `rgba(240, 237, 230, ${0.18 - distM / 800})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Gentle repulsion
          particles[i].x -= dxM * 0.012;
          particles[i].y -= dyM * 0.012;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout",  handleMouseOut);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55, transform: "translateZ(0)", willChange: "transform" }}
      aria-hidden="true"
    />
  );
}