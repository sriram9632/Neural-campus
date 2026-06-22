import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/colleges", label: "Colleges", icon: Building2 },
  { to: "/departments", label: "Departments", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/faculty", label: "Faculty", icon: UserCircle },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const authLabel =
    user?.auth_type === "guest"
      ? "Guest"
      : user?.auth_type === "gmail"
        ? "Gmail"
        : "Member";

  return (
    <aside className="relative flex min-h-screen w-72 flex-col border-r border-cyan-500/20 bg-slate-950/80 p-6 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="mb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-500/60">
          Neural
        </p>
        <h1 className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-2xl font-bold text-transparent">
          CAMPUS
        </h1>
        <p className="mt-1 text-xs text-slate-500">Student Portal v2.0</p>
      </div>

      <nav className="mt-10 flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all ${
                isActive
                  ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mb-6 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-3">
        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
        <p className="truncate text-xs text-slate-500">{user?.email || "No email"}</p>
        <span className="mt-1 inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
          {authLabel}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}
