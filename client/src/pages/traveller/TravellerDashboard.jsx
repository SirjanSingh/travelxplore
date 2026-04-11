import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Package, Search, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import TypeBadge from '../../components/TypeBadge';
import api from '../../lib/api';
import { getUser, clearAuth } from '../../lib/auth';
import { formatPrice, formatDate, STATUS_CONFIG, getOfferingImage } from '../../lib/utils';

export default function TravellerDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.get('/bookings/mine').then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  async function cancelBooking(id) {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.error || 'Cancel failed');
    } finally {
      setCancelling(null);
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const stats = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">My Dashboard</h1>
            <p className="text-slate-400">Welcome back, {user?.name}</p>
          </div>
          <Link to="/explore" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Explore More
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className="font-bold text-2xl text-white">{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Profile card */}
        <div className="card p-5 mb-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-lg">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            {user?.phone && <p className="text-slate-400 text-sm">{user?.phone}</p>}
          </div>
          <span className="ml-auto badge bg-amber-500/20 text-amber-400 border border-amber-500/30">Traveller</span>
        </div>

        {/* Bookings */}
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-4">My Bookings & Orders</h2>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${
                  filter === s ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-4">
                {filter === 'all' ? "You haven't booked anything yet." : `No ${filter} bookings.`}
              </p>
              <Link to="/explore" className="btn-primary">Start Exploring</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(b => {
                const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                return (
                  <div key={b.id} className="card p-5">
                    <div className="flex flex-wrap gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={b.offering_images?.[0] || getOfferingImage({ type: b.offering_type, images: b.offering_images })}
                          alt={b.offering_title}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80'; }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <TypeBadge type={b.offering_type} />
                          <span className={`badge border ${sc.color}`}>{sc.label}</span>
                        </div>
                        <h3 className="font-semibold text-white text-lg">{b.offering_title}</h3>
                        <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{b.offering_location}</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">Host: {b.host_name}</p>

                        {(b.check_in || b.check_out) && (
                          <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{formatDate(b.check_in)} — {formatDate(b.check_out)}</span>
                          </div>
                        )}

                        {b.customization_request && (
                          <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-sm">
                            <span className="text-amber-400 font-medium">Your request: </span>
                            <span className="text-slate-300">{b.customization_request}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-amber-400 text-xl">{formatPrice(b.total_price)}</span>
                        <span className="text-slate-500 text-xs">{b.guests} × item · {formatDate(b.created_at)}</span>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(b.id)}
                            disabled={cancelling === b.id}
                            className="btn-secondary text-sm py-1.5 px-4 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                          >
                            {cancelling === b.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
