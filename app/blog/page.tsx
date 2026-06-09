export const metadata = {
  title: "Blog | E-Cell IISER Bhopal",
  description: "Read the latest articles, startup insights, and entrepreneurship news from E-Cell IISER Bhopal.",
};

export default function BlogPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-24 text-center relative">
      
      {/* Editorial top rule to match the theme's structural feel */}
      <div className="absolute top-0 w-full max-w-4xl rule-bottom opacity-50"></div>

      {/* Using your custom .tag class from globals.css */}
      <div className="tag mb-8 border-amber/30">
        <span className="text-amber">■</span> Transmission Pending
      </div>

      {/* Brutalist Heading: Replaced soft gradient with stark Amber/Chalk contrast */}
      <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-chalk uppercase leading-none tracking-normal mb-6">
        The <span className="text-amber">Blog</span>.
      </h1>

      {/* Monospace body text using your custom muted colors */}
      <p className="font-mono text-muted-strong max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
        Insights, stories, and updates from the world of entrepreneurship. We are currently curating our first posts.
      </p>

      {/* Sharp, geometric "Coming Soon" box instead of a blurred rounded pill */}
      <div className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-8 py-4 hover-amber cursor-default">
        <p className="text-amber font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
          [ Launching Soon ]
        </p>
      </div>
      
    </div>
  );
}