import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("admin@portfolio.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100 px-4 py-10">
      {/* Animated background orbs */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-secondary/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-accent/5 blur-3xl" />
      </div> */}

      {/* Decorative rings */}
      <div className="absolute inset-8 rounded-[3rem] border border-primary/10 pointer-events-none" />
      <div className="absolute inset-20 rounded-[3rem] border border-secondary/10 pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative overflow-hidden rounded-4xl border border-base-200 bg-base-100/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-primary/10">
          {/* Top accent gradient */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-primary via-secondary to-primary" />

          <div className="px-8 pt-10 text-center">
            {/* Logo / Icon */}
            <div className="relative mx-auto mb-6 w-fit">
              <div className="absolute inset-0 rounded-3xl bg-primary/40 blur-2xl animate-pulse" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-primary to-secondary shadow-xl transition-transform hover:scale-105 duration-300">
                <Code2 size={40} className="text-white" />
              </div>
            </div>

            {/* Security badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm shadow-sm">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Secure Admin Access
              </span>
            </div>

            <h1 className="mb-3 text-4xl font-black leading-tight bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mx-auto max-w-sm leading-relaxed text-base-content/60">
              Sign in to manage your portfolio, projects, experience, skills,
              and website settings.
            </p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-semibold">
                    Email Address
                  </span>
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 transition-all group-focus-within:text-primary"
                  />
                  <input
                    type="email"
                    // value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@portfolio.com"
                    className="input input-bordered h-14 w-full rounded-xl border-base-200 bg-base-200/50 pl-12 text-sm transition-all focus:border-primary focus:bg-base-100 focus:shadow-md"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-semibold">
                    Password
                  </span>
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 transition-all group-focus-within:text-primary"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    // value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered h-14 w-full rounded-xl border-base-200 bg-base-200/50 pl-12 pr-14 text-sm transition-all focus:border-primary focus:bg-base-100 focus:shadow-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="btn mt-4 h-14 w-full rounded-xl border-none text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:scale-100"
                style={{
                  background:
                    "linear-gradient(135deg,var(--color-primary),var(--color-secondary))",
                }}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Access Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            {/* <p className="mt-6 text-center text-xs text-base-content/40">
              Demo credentials pre-filled
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
