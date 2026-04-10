import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, LayoutDashboard, PlusCircle, BookOpen, LogOut, User } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

const NAV = [
  { to: '/host/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/host/offerings', icon: BookOpen, label: 'My Offerings' },
  { to: '/host/offerings/new', icon: PlusCircle, label: 'Add Offering' },
  { to: '/host/bookings', icon: BookOpen, label: 'Bookings' },
];

export default function HostSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex flex-col z-40">
      <div className="p-5 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-white">TravelXplore</span>
        </Link>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white text-sm truncate">{user?.name}</p>
            <p className="text-xs text-amber-400">Host</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/host/dashboard' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-amber-500/15 text-amber-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
