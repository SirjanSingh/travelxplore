import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Package, BookOpen, TrendingUp, MapPin } from 'lucide-react';
import HostSidebar from '../../components/HostSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import TypeBadge from '../../components/TypeBadge';
import api from '../../lib/api';
import { getUser } from '../../lib/auth';
import { formatPrice, formatDate, STATUS_CONFIG } from '../../lib/utils';

export default function HostDashboard() {
  const user = getUser();
  const [offerings, setOfferings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/offerings/host/mine'),
      api.get('/bookings/host'),
    ]).then(([o, b]) => {
      setOfferings(o.data);
      setBookings(b.data);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: Package, label: 'Total Offerings', value: offerings.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: BookOpen, label: 'Total Bookings', value: bookings.length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: TrendingUp, label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: MapPin, label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <HostSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Host Dashboard</h1>
            <p className="text-slate-400">Welcome back, {user?.name}</p>
          </div>
          <Link to="/host/offerings/new" className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Offering
          </Link>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="card p-5">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white text-lg">Recent Bookings</h2>
                <Link to="/host/bookings" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">View all</Link>
              </div>
              {bookings.length === 0 ? (
                <p className="text-slate-500 text-sm">No bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => {
                    const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white truncate">{b.offering_title}</p>
                          <p className="text-slate-400 text-sm">{b.traveller_name} · {formatDate(b.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="font-semibold text-amber-400">{formatPrice(b.total_price)}</span>
                          <span className={`badge border ${sc.color} text-xs`}>{sc.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Offerings */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white text-lg">My Offerings</h2>
                <Link to="/host/offerings" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">Manage all</Link>
              </div>
              {offerings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No offerings yet.</p>
                  <Link to="/host/offerings/new" className="btn-primary">Create your first offering</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {offerings.slice(0, 4).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <TypeBadge type={o.type} />
                        <p className="font-medium text-white truncate">{o.title}</p>
                      </div>
                      <span className="text-amber-400 font-semibold ml-4">{formatPrice(o.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
