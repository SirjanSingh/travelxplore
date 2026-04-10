import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowLeft, ShoppingBag, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import TypeBadge from '../components/TypeBadge';
import api from '../lib/api';
import { getUser, isLoggedIn } from '../lib/auth';
import { formatPrice, formatDate, getOfferingImage } from '../lib/utils';

export default function OfferingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ check_in: '', check_out: '', guests: 1, customization_request: '', special_notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const user = getUser();

  useEffect(() => {
    api.get(`/offerings/${id}`).then(r => setOffering(r.data)).catch(() => navigate('/explore')).finally(() => setLoading(false));
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    if (!isLoggedIn()) { navigate('/login?type=traveller'); return; }
    if (user?.role !== 'traveller') { setError('Only travellers can book.'); return; }
    setError('');
    setBookingLoading(true);
    try {
      await api.post('/bookings', { offering_id: id, ...booking });
      setBookingDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Try again.');
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><LoadingSpinner /></div>;
  if (!offering) return null;

  const images = offering.images?.length > 0 ? offering.images : [getOfferingImage(offering)];
  const isProduct = offering.type === 'product';

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <Link to="/explore" className="btn-ghost flex items-center gap-2 mb-6 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={images[activeImg]?.startsWith('http') ? images[activeImg] : images[activeImg]}
                alt={offering.title}
                className="w-full h-80 object-cover"
                onError={e => { e.target.src = getOfferingImage(offering); }}
              />
              {images.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-1 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${i === activeImg ? 'border-amber-500' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = getOfferingImage(offering); }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <TypeBadge type={offering.type} />
              {offering.is_customizable && (
                <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30">Custom Orders Available</span>
              )}
            </div>

            <h1 className="font-display text-4xl font-bold text-white mb-3">{offering.title}</h1>

            <div className="flex items-center gap-2 text-slate-400 mb-6">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{offering.location}</span>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg mb-8">{offering.description}</p>

            {offering.is_customizable && offering.customization_note && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                  <ShoppingBag className="w-4 h-4" />
                  Custom Orders
                </div>
                <p className="text-slate-300 text-sm">{offering.customization_note}</p>
              </div>
            )}

            {/* Host info */}
            <div className="card p-5">
              <h3 className="font-semibold text-white mb-3">About the Host</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{offering.host_name}</p>
                  {offering.host_location && <p className="text-slate-400 text-sm"><MapPin className="w-3 h-3 inline mr-1" />{offering.host_location}</p>}
                  {offering.host_bio && <p className="text-slate-400 text-sm mt-1">{offering.host_bio}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="mb-4">
                <span className="font-display text-3xl font-bold text-amber-400">{formatPrice(offering.price)}</span>
                <span className="text-slate-400 text-sm ml-1">
                  {isProduct ? '/item' : offering.type === 'stay' ? '/night' : '/person'}
                </span>
              </div>

              {bookingDone ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {isProduct ? 'Order Placed!' : 'Booking Confirmed!'}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">Check your dashboard for details.</p>
                  <Link to="/traveller/dashboard" className="btn-primary w-full text-center block">
                    View Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  {!isProduct && (
                    <>
                      <div>
                        <label className="label flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-in</label>
                        <input type="date" className="input" value={booking.check_in} onChange={e => setBooking({ ...booking, check_in: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div>
                        <label className="label flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-out</label>
                        <input type="date" className="input" value={booking.check_out} onChange={e => setBooking({ ...booking, check_out: e.target.value })} min={booking.check_in || new Date().toISOString().split('T')[0]} />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="label flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {isProduct ? 'Quantity' : 'Guests'}
                    </label>
                    <input type="number" min="1" max={offering.max_guests || 20} className="input" value={booking.guests} onChange={e => setBooking({ ...booking, guests: e.target.value })} />
                  </div>
                  {offering.is_customizable && (
                    <div>
                      <label className="label">Customization Request</label>
                      <textarea className="input resize-none h-20" placeholder="Describe your custom order or preferences..." value={booking.customization_request} onChange={e => setBooking({ ...booking, customization_request: e.target.value })} />
                    </div>
                  )}
                  <div>
                    <label className="label">Special Notes</label>
                    <textarea className="input resize-none h-16" placeholder="Any special requirements..." value={booking.special_notes} onChange={e => setBooking({ ...booking, special_notes: e.target.value })} />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  {!isLoggedIn() ? (
                    <Link to="/login?type=traveller" className="btn-primary w-full text-center block">
                      Sign in to Book
                    </Link>
                  ) : user?.role === 'host' ? (
                    <p className="text-slate-400 text-sm text-center">Hosts cannot book offerings.</p>
                  ) : (
                    <button type="submit" disabled={bookingLoading} className="btn-primary w-full h-12">
                      {bookingLoading ? 'Processing...' : isProduct ? 'Place Pre-Order' : 'Book Now'}
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
