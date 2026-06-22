import { Link } from "react-router-dom";

export default function PortalCard({ to, icon: Icon, title, description, accent = "cyan" }) {
  const accents = {
    cyan: "group-hover:border-cyan-400/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] text-cyan-400",
    violet: "group-hover:border-violet-400/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] text-violet-400",
    emerald: "group-hover:border-emerald-400/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] text-emerald-400",
    amber: "group-hover:border-amber-400/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] text-amber-400",
    rose: "group-hover:border-rose-400/50 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] text-rose-400",
    sky: "group-hover:border-sky-400/50 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] text-sky-400",
  };

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 transition-all duration-300 hover:-translate-y-1 ${accents[accent]}`}
    >
      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
      <div className="relative">
        <Icon size={28} className="mb-4" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-500 group-hover:text-cyan-300/80">
          Enter →
        </p>
      </div>
    </Link>
  );
}
