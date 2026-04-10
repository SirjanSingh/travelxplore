import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, MapPin } from 'lucide-react';
import HostSidebar from '../../components/HostSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import TypeBadge from '../../components/TypeBadge';
import api from '../../lib/api';
import { formatPrice, getOfferingImage } from '../../lib/utils';

export default function HostOfferings() {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/offerings/host/mine').then(r => setOfferings(r.data)).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this offering? All bookings will be removed.')) return;
    setDeleting(id);
    try {
      await api.delete(`/offerings/${id}`);
      setOfferings(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <HostSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">My Offerings</h1>
            <p className="text-slate-400">Manage everything you're offering to travellers</p>
          </div>
          <Link to="/host/offerings/new" className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Offering
          </Link>
        </div>

        {loading ? <LoadingSpinner /> : offerings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg mb-4">You haven't listed anything yet.</p>
            <Link to="/host/offerings/new" className="btn-primary">Create your first offering</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {offerings.map(o => (
              <div key={o.id} className="card group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={getOfferingImage(o)}
                    alt={o.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <span className="absolute top-3 left-3"><TypeBadge type={o.type} /></span>
                  {o.is_customizable && (
                    <span className="absolute top-3 right-3 badge bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">Custom</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{o.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{o.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">{formatPrice(o.price)}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/host/offerings/${o.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                        aria-label="Edit offering"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(o.id)}
                        disabled={deleting === o.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50"
                        aria-label="Delete offering"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
