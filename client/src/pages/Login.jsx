import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { setAuth } from '../lib/auth';

export default function Login() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('type') || 'traveller');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { ...form, role });
      setAuth(data.token, data.user);
      navigate(data.user.role === 'host' ? '/host/dashboard' : '/traveller/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #92400e, #1c1917)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-white">TravelXplore</span>
        </Link>
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Welcome back, explorer.
          </h2>
          <p className="text-amber-200/70 text-lg">
            Pick up where you left off and continue your cultural journey.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white">TravelXplore</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Sign in</h1>
          <p className="text-slate-400 mb-8">Log in to your account to continue</p>

          {/* Role toggle */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
            {['traveller', 'host'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${
                  role === r ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'host' ? 'Host' : 'Traveller'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to={`/signup?type=${role}`} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
