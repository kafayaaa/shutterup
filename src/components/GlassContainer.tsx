export default function GlassContainer({
  className = "p-5 rounded-lg",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`p-5 bg-zinc-50/5 border border-white/10 shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.35)] inset-shadow-sm inset-shadow-white/50 backdrop-blur-lg ${className}`}
    >
      {children}
    </div>
  );
}
