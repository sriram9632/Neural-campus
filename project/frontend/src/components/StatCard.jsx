export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="glass-panel group p-6 transition-transform hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">{title}</p>
          <p className="mt-3 text-4xl font-bold text-cyan-300">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-400">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
