import { useEffect, useState } from 'react';
import { Calendar, User, Phone, Mail } from 'lucide-react';
import HostSidebar from '../../components/HostSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import TypeBadge from '../../components/TypeBadge';
import api from '../../lib/api';
import { formatPrice, formatDate, STATUS_CONFIG } from '../../lib/utils';

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings/host').then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <HostSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Bookings</h1>
          <p className="text-slate-400">Manage all incoming bookings and orders</p>
        </div>

        {/* Filter tabs */}
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
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No bookings {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => {
              const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
              return (
                <div key={b.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <TypeBadge type={b.offering_type} />
                        <h3 className="font-semibold text-white">{b.offering_title}</h3>
                        <span className={`badge border ${sc.color}`}>{sc.label}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <User className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{b.traveller_name}</span>
                        </div>
                        {b.traveller_email && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{b.traveller_email}</span>
                          </div>
                        )}
                        {b.traveller_phone && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{b.traveller_phone}</span>
                          </div>
                        )}
                        {(b.check_in || b.check_out) && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{formatDate(b.check_in)} — {formatDate(b.check_out)}</span>
                          </div>
                        )}
                      </div>

                      {b.customization_request && (
                        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-sm">
                          <span className="text-amber-400 font-medium">Custom request: </span>
                          <span className="text-slate-300">{b.customization_request}</span>
                        </div>
                      )}
                      {b.special_notes && (
                        <p className="mt-2 text-slate-400 text-sm">Notes: {b.special_notes}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className="font-bold text-amber-400 text-lg">{formatPrice(b.total_price)}</span>
                      <span className="text-slate-500 text-xs">{b.guests} guest(s) · {formatDate(b.created_at)}</span>
                      {b.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-primary text-sm py-1.5 px-4">Confirm</button>
                          <button onClick={() => updateStatus(b.id, 'cancelled')} className="btn-secondary text-sm py-1.5 px-4">Decline</button>
                        </div>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateStatus(b.id, 'completed')} className="btn-secondary text-sm py-1.5 px-4">Mark Complete</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
