export const BackgroundGlow = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden gpu-accelerated">
      {/* Primary glow - CSS animation for better performance */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-glow-float-primary"
        style={{
          background: "radial-gradient(circle, hsl(38 92% 50% / 0.08) 0%, transparent 70%)",
          top: "10%",
          left: "20%",
          willChange: "transform",
        }}
      />
      
      {/* Secondary glow - CSS animation for better performance */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-glow-float-secondary"
        style={{
          background: "radial-gradient(circle, hsl(38 92% 50% / 0.05) 0%, transparent 70%)",
          bottom: "20%",
          right: "10%",
          willChange: "transform",
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};