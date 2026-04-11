import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Shield, Package, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import OfferingCard from '../components/OfferingCard';
import api from '../lib/api';

const HERO_STATS = [
  { value: '500+', label: 'Local Hosts' },
  { value: '50+', label: 'Destinations' },
  { value: '2000+', label: 'Experiences' },
];

const FEATURES = [
  {
    icon: MapPin,
    title: 'Authentic Stays',
    desc: 'Sleep where locals live — guesthouses, heritage homes, and unique retreats.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Star,
    title: 'Cultural Experiences',
    desc: 'Join guided tours, cooking classes, craft workshops led by genuine locals.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Shield,
    title: 'Trusted & Safe',
    desc: 'Verified hosts, secure payments, and a community built on trust.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

const DESTINATIONS = [
  { name: 'Rajasthan', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', count: 48 },
  { name: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', count: 35 },
  { name: 'Himachal Pradesh', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', count: 29 },
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', count: 52 },
];

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    api.get('/offerings?').then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    window.location.href = `/explore?location=${encodeURIComponent(searchLocation)}`;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-6 inline-flex">
            Discover Authentic India
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Travel Beyond
            <span className="text-amber-400 block">the Tourist Trail</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with local hosts for genuine cultural experiences — stays, activities, and cuisine you won't find anywhere else.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by location..."
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                className="input pl-12 h-14 text-base rounded-2xl"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 h-14 px-8 rounded-2xl text-base">
              <Search className="w-5 h-5" />
              Explore
            </button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {HERO_STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-amber-400">{s.value}</p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 text-xs animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-500" />
          Scroll
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Why LocalExplore?</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">More than a booking platform — a bridge between travellers and the soul of a place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Popular Destinations</h2>
              <p className="text-slate-400">Explore handpicked locations across India</p>
            </div>
            <Link to="/explore" className="btn-ghost flex items-center gap-1 text-amber-400 hover:text-amber-300">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DESTINATIONS.map(d => (
              <Link
                key={d.name}
                to={`/explore?location=${encodeURIComponent(d.name)}`}
                className="relative group overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
              >
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display font-semibold text-white text-lg">{d.name}</h3>
                  <p className="text-amber-400 text-sm">{d.count} experiences</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offerings */}
      {featured.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="section-title mb-2">Featured Experiences</h2>
                <p className="text-slate-400">Curated by our community of locals</p>
              </div>
              <Link to="/explore" className="btn-ghost flex items-center gap-1 text-amber-400 hover:text-amber-300">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(o => <OfferingCard key={o.id} offering={o} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #92400e 0%, #78350f 50%, #1c1917 100%)' }}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold text-white mb-4">Are you a local host?</h2>
              <p className="text-amber-200/80 text-lg mb-8 max-w-xl mx-auto">
                Share your culture, earn income, and meet travellers from around the world. Listing is free.
              </p>
              <Link to="/signup?type=host" className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2">
                Start Hosting <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white">LocalExplore</span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 LocalExplore. Built for authentic travel experiences.</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link to="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
            <Link to="/signup?type=host" className="hover:text-slate-300 transition-colors">Host</Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
