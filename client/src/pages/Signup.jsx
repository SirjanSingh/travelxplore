import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { setAuth } from '../lib/auth';

export default function Signup() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('type') || 'traveller');
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '', location: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const endpoint = role === 'host' ? '/auth/register/host' : '/auth/register/traveller';
      const { data } = await api.post(endpoint, form);
      setAuth(data.token, data.user);
      navigate(role === 'host' ? '/host/dashboard' : '/traveller/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-white">TravelXplore</span>
        </Link>
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            {role === 'host' ? 'Share your world.' : 'Discover theirs.'}
          </h2>
          <p className="text-blue-200/70 text-lg">
            {role === 'host'
              ? 'List your offerings, meet travellers, and earn from your local knowledge.'
              : 'Book authentic stays, experiences, cuisine, and one-of-a-kind products.'}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-slide-up">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white">TravelXplore</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-slate-400 mb-6">Join as a traveller or local host</p>

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
                {r === 'host' ? 'Local Host' : 'Traveller'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Min. 6 characters"
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
            {role === 'host' && (
              <>
                <div>
                  <label className="label">Your Location</label>
                  <input className="input" placeholder="e.g. Jaipur, Rajasthan" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label className="label">Bio <span className="text-slate-500">(optional)</span></label>
                  <textarea className="input resize-none h-20" placeholder="Tell travellers a bit about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                </div>
              </>
            )}
            {role === 'traveller' && (
              <div>
                <label className="label">Phone <span className="text-slate-500">(optional)</span></label>
                <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Already have an account?{' '}
            <Link to={`/login?type=${role}`} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
