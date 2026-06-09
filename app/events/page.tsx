export const metadata = {
  title: "Events | E-Cell IISER Bhopal",
  description: "Discover upcoming pitch days, hackathons, and speaker sessions hosted by E-Cell IISER Bhopal.",
};

export default function EventsPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-24 text-center relative">
      
      {/* Editorial top rule for structural consistency */}
      <div className="absolute top-0 w-full max-w-4xl rule-bottom opacity-50"></div>

      {/* Custom tag indicating system status */}
      <div className="tag mb-8 border-amber/30">
        <span className="text-amber">■</span> Calendar Sync
      </div>

      {/* Brutalist Heading: Utilizing Bebas Neue/Impact and Chalk/Amber colors */}
      <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-chalk uppercase leading-none tracking-normal mb-6">
        Upcoming <span className="text-amber">Events</span>.
      </h1>

      {/* Monospace body text with custom muted strong color */}
      <p className="font-mono text-muted-strong max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
        From ideation workshops to massive pitch events, find out where we are heading next.
      </p>

      {/* Sharp, geometric status box leveraging your hover-amber utility */}
      <div className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-8 py-4 hover-amber cursor-default">
        <p className="text-amber font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
          [ Scheduling ]
        </p>
      </div>
      
    </div>
  );
}