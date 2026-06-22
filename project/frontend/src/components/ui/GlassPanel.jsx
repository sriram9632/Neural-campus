export default function GlassPanel({ title, children, className = "" }) {
  return (
    <div className={`glass-panel relative overflow-hidden p-6 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      {title && (
        <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400/70">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
