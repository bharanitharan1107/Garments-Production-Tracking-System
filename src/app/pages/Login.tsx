import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  Eye, EyeOff, Scissors, Mail, Lock, ArrowRight,
  Package, CheckCircle, Users, Shield, Factory
} from 'lucide-react';

const features = [
  { icon: Factory, title: 'Production Tracking', desc: 'Monitor every production stage in real time.' },
  { icon: Package, title: 'Inventory Management', desc: 'Track stock levels and material movement.' },
  { icon: CheckCircle, title: 'Quality Control', desc: 'Ensure every garment meets quality standards.' },
  { icon: Users, title: 'Workforce Management', desc: 'Monitor operator performance and attendance.' },
];

const securityBadges = [
  'Secure Authentication',
  'Role-Based Access',
  'Real-Time Monitoring',
  'AI Powered Analytics',
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Login failed');
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* ==================== LEFT PANEL ==================== */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden bg-card border-r border-border">
        {/* Abstract Background pattern and gradients */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-primary/10 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-primary/10 animate-pulse" style={{ animationDuration: '6s' }} />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 shadow-inner">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-foreground font-bold text-xl tracking-tight">Akash Garments</div>
              <div className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">Garments</div>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-[480px]">
            <h1 className="text-foreground text-[42px] xl:text-[52px] font-extrabold leading-[1.1] tracking-tight mb-6">
              Empowering your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">factory floor.</span>
            </h1>
            <p className="text-muted-foreground text-[16px] leading-relaxed mb-12">
              Digitize garment production with real-time monitoring, inventory management, quality control, workforce tracking, and shipment analytics.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title}
                  className="p-5 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 transform hover:-translate-y-1 group shadow-sm hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-background border border-border group-hover:border-primary/20 group-hover:bg-primary/10 transition-colors">
                      <f.icon className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="text-foreground text-[14px] font-bold mb-1">{f.title}</div>
                      <div className="text-muted-foreground text-[12px] leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security badges */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {securityBadges.map(b => (
              <div key={b} className="flex items-center gap-2 text-muted-foreground text-[13px] font-semibold">
                <Shield className="w-3.5 h-3.5 text-primary" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== RIGHT PANEL ==================== */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative bg-background">
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight text-foreground">Akash Garments</div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Garments</div>
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-[28px] border border-border p-8 sm:p-10 bg-card shadow-2xl shadow-black/5 dark:shadow-black/20 backdrop-blur-xl relative overflow-hidden">
            {/* Subtle glow inside card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />

            {/* Header */}
            <div className="mb-10 relative">
              <h2 className="text-[28px] font-extrabold tracking-tight mb-2 text-foreground">
                Welcome Back
              </h2>
              <p className="text-[15px] text-muted-foreground font-medium">
                Sign in to continue managing your factory.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl text-[13px] font-bold flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-destructive/20">
                  <span className="text-[12px] font-black text-destructive">!</span>
                </div>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative">
              {/* Email */}
              <div>
                <label className="block text-[13px] font-bold mb-2 text-foreground">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@factory.com"
                    required
                    className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-[14px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none bg-background border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[13px] font-bold text-foreground">Password</label>
                  <button type="button" className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl pl-11 pr-12 py-3.5 text-[14px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none bg-background border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-lg hover:bg-muted"
                  >
                    {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    rememberMe ? 'bg-primary border-primary' : 'bg-transparent border-muted-foreground/30 hover:border-primary/50'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="text-[13.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Remember Me
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl mt-4 py-3.5 text-[15px] font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Test Credentials */}
          <div className="mt-8 p-6 rounded-[24px] border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
                Demo Accounts
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'Admin', email: 'admin@akashgarments.com', pass: 'admin123' },
                { role: 'Production Mgr', email: 'mchen@akashgarments.com', pass: 'mike123' },
                { role: 'Worker', email: 'jwilson@akashgarments.com', pass: 'james123' },
                { role: 'QC Inspector', email: 'dpark@akashgarments.com', pass: 'david123' },
              ].map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); setError(''); }}
                  className="text-left p-3.5 rounded-2xl border border-border transition-all duration-200 cursor-pointer bg-background hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm group"
                >
                  <div className="text-[12px] font-bold mb-1 text-foreground group-hover:text-primary transition-colors">{acc.role}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">{acc.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center pb-8">
            <p className="text-[13px] font-medium text-muted-foreground/60">
              Version 1.0 &middot; &copy; 2026 Akash Garments
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
