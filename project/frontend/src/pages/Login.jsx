import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  UserCircle,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  signUp,
  signIn,
  guestLogin,
  sendGmailOtp,
  verifyGmailOtp,
} from "../api";

const features = [
  { icon: Building2, label: "Colleges" },
  { icon: GraduationCap, label: "Departments" },
  { icon: Users, label: "Students" },
  { icon: BookOpen, label: "Courses" },
  { icon: UserCircle, label: "Faculty" },
];

const MODES = {
  SIGNIN: "signin",
  SIGNUP: "signup",
  GMAIL: "gmail",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.6 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.5 3.7 14.4 2.8 12 2.8 6.9 2.8 2.7 7 2.7 12.1S6.9 21.4 12 21.4c6.9 0 8.5-4.8 8.5-7.2 0-.5 0-.9-.1-1.3H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.5l3 2.2C7.7 8 9.7 6.8 12 6.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.5 3.7 14.4 2.8 12 2.8 8.5 2.8 5.5 5.4 4.2 8.9l-.3-.4z"
      />
      <path
        fill="#4A90E2"
        d="M12 21.4c3.2 0 5.9-1.1 7.9-2.9l-3.7-3c-1 .7-2.4 1.2-4.2 1.2-3.1 0-5.6-2.5-5.6-5.6 0-.6.1-1.2.3-1.7l-6.9 5.3C3.1 18.2 7.1 21.4 12 21.4z"
      />
      <path
        fill="#FBBC05"
        d="M20.8 13.8c.2-.7.3-1.4.3-2.1 0-.7-.1-1.4-.3-2.1H12v4.2h8.8z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [mode, setMode] = useState(MODES.SIGNIN);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const resetForm = (nextMode) => {
    setMode(nextMode);
    setError("");
    setOtp("");
    setOtpSent(false);
    setOtpMessage("");
  };

  const handleSuccess = (data) => {
    login(data);
    navigate("/dashboard");
  };

  const getErrorMessage = (err) =>
    err.response?.data?.detail || "Something went wrong. Please try again.";

  const handleCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === MODES.SIGNUP
          ? await signUp({ name, email, password })
          : await signIn({ email, password });
      handleSuccess(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await guestLogin();
      handleSuccess(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await sendGmailOtp(email);
      setOtpSent(true);
      setOtpMessage(data.message || "OTP sent to your Gmail. Check your inbox.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyGmailOtp(email, otp);
      handleSuccess(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-violet-600/20 blur-[120px] [animation-delay:1s]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg animate-[fadeInUp_0.6s_ease-out] px-6">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

          <div className="mb-6 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-400/80">
              Neural Campus
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Student Portal
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Sign in, sign up, or continue as guest
            </p>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-950/50 px-3 py-1.5 text-xs text-slate-400"
              >
                <Icon size={12} className="text-cyan-500" />
                {label}
              </span>
            ))}
          </div>

          {mode !== MODES.GMAIL && (
            <div className="mb-6 flex rounded-xl border border-slate-700/60 bg-slate-950/50 p-1">
              <button
                type="button"
                onClick={() => resetForm(MODES.SIGNIN)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  mode === MODES.SIGNIN
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => resetForm(MODES.SIGNUP)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  mode === MODES.SIGNUP
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {mode === MODES.GMAIL ? (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div className="mb-2 flex items-center gap-2">
                <GoogleIcon />
                <p className="text-sm font-medium text-slate-300">Gmail Sign In</p>
              </div>

              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={otpSent}
                  className={inputClass}
                />
              </div>

              {otpSent && (
                <>
                  <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                    {otpMessage}
                  </p>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      maxLength={6}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-violet-500/10 px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-all duration-300 hover:border-cyan-300/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] disabled:opacity-50"
              >
                {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
              </button>

              <button
                type="button"
                onClick={() => resetForm(MODES.SIGNIN)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleCredentials} className="space-y-4">
              {mode === MODES.SIGNUP && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-violet-500/10 px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-all duration-300 hover:border-cyan-300/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : mode === MODES.SIGNUP
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>
          )}

          {mode !== MODES.GMAIL && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-700/60" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
                  or
                </span>
                <div className="h-px flex-1 bg-slate-700/60" />
              </div>

              <button
                type="button"
                onClick={() => resetForm(MODES.GMAIL)}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700/60 bg-slate-950/50 px-6 py-3 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-900/80"
              >
                <GoogleIcon />
                Continue with Gmail
              </button>

              <button
                type="button"
                onClick={handleGuest}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-slate-700/40 px-6 py-3 text-sm text-slate-500 transition hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-violet-300 disabled:opacity-50"
              >
                Continue as Guest
              </button>
            </>
          )}

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
            v2.0 · Encrypted channel
          </p>
        </div>
      </div>
    </div>
  );
}
