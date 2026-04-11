import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, clearAuth, isLoggedIn } from '../lib/auth';
import { MapPin, LogOut, User, LayoutDashboard, Compass } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const loggedIn = isLoggedIn();

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 glass rounded-2xl px-5 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
          LocalExplore
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          to="/explore"
          className={`btn-ghost flex items-center gap-1.5 text-sm ${isActive('/explore') ? 'text-amber-400' : ''}`}
        >
          <Compass className="w-4 h-4" />
          Explore
        </Link>

        {loggedIn && user ? (
          <>
            {user.role === 'host' ? (
              <Link
                to="/host/dashboard"
                className={`btn-ghost flex items-center gap-1.5 text-sm ${isActive('/host') ? 'text-amber-400' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/traveller/dashboard"
                className={`btn-ghost flex items-center gap-1.5 text-sm ${isActive('/traveller') ? 'text-amber-400' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-sm text-slate-300 max-w-[100px] truncate">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost p-2" aria-label="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Login</Link>
            <Link to="/signup" className="btn-primary text-sm py-2">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
