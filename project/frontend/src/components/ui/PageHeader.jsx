export default function PageHeader({ tag, title, subtitle }) {
  return (
    <div className="mb-10">
      {tag && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-400/80">
          {tag}
        </p>
      )}
      <h1 className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 max-w-2xl text-slate-400">{subtitle}</p>}
    </div>
  );
}
