import { useMemo } from "react";

const AnimatedBackground = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${8 + Math.random() * 12}s`,
        size: `${2 + Math.random() * 3}px`,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient mesh */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, hsl(200 100% 35% / 0.12), transparent), radial-gradient(ellipse 60% 80% at 80% 60%, hsl(195 100% 43% / 0.08), transparent), radial-gradient(ellipse 90% 50% at 50% 90%, hsl(212 100% 4%), transparent)",
        }}
      />
      {/* Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-blob" />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-primary-glow/5 blur-3xl animate-blob-2" />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-accent/4 blur-3xl animate-blob-3" />
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary-glow/30 animate-particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      {/* Noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
};

export default AnimatedBackground;
