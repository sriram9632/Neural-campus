import { useEffect, useState } from "react";
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  UserCircle,
} from "lucide-react";
import StatCard from "../components/StatCard";
import PortalCard from "../components/ui/PortalCard";
import PageHeader from "../components/ui/PageHeader";
import ErrorAlert from "../components/ui/ErrorAlert";
import GlassPanel from "../components/ui/GlassPanel";
import { getLoginLogs, getPortalStats } from "../api";

function formatLogTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loginLogs, setLoginLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getPortalStats()
      .then(setStats)
      .catch(() =>
        setError("Could not reach the backend. Make sure it is running on port 8000.")
      );

    getLoginLogs()
      .then(setLoginLogs)
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader
        tag="Welcome back"
        title="Neural Campus Portal"
        subtitle="Your unified gateway to colleges, departments, students, courses, and faculty — all connected to the live campus database."
      />

      <ErrorAlert message={error} />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Colleges" value={stats ? stats.colleges : "…"} icon={Building2} />
        <StatCard title="Departments" value={stats ? stats.departments : "…"} icon={GraduationCap} />
        <StatCard title="Students" value={stats ? stats.students : "…"} icon={Users} />
        <StatCard title="Courses" value={stats ? stats.courses : "…"} icon={BookOpen} />
        <StatCard title="Faculty" value={stats ? stats.faculty : "…"} icon={UserCircle} />
      </div>

      <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
        Explore modules
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <PortalCard
          to="/colleges"
          icon={Building2}
          title="Colleges"
          description="Browse and register campus locations across the network."
          accent="cyan"
        />
        <PortalCard
          to="/departments"
          icon={GraduationCap}
          title="Departments"
          description="View academic departments organized by college."
          accent="violet"
        />
        <PortalCard
          to="/students"
          icon={Users}
          title="Students"
          description="Manage student records, enrollment, and academic year."
          accent="emerald"
        />
        <PortalCard
          to="/courses"
          icon={BookOpen}
          title="Courses"
          description="Explore course catalog with codes and credit units."
          accent="amber"
        />
        <PortalCard
          to="/faculty"
          icon={UserCircle}
          title="Faculty"
          description="Faculty directory with designations and contact info."
          accent="rose"
        />
      </div>

      <div className="mt-10">
        <GlassPanel title="Your Login Activity">
          {loginLogs.length === 0 ? (
            <p className="text-slate-400">No login activity recorded yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-700/50">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700 bg-slate-950/80 font-mono text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">When</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">IP</th>
                    <th className="px-4 py-3">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {loginLogs.map((log) => (
                    <tr key={log._id} className="border-b border-slate-800/80 text-slate-200">
                      <td className="px-4 py-3 whitespace-nowrap">{formatLogTime(log.logged_at)}</td>
                      <td className="px-4 py-3 capitalize">{log.event?.replace("_", " ")}</td>
                      <td className="px-4 py-3 capitalize">{log.auth_type}</td>
                      <td className="px-4 py-3 font-mono text-xs text-cyan-400">{log.ip_address || "—"}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-400" title={log.user_agent}>
                        {log.user_agent || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
