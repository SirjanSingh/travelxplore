import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import OfferingCard from '../components/OfferingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'stay', label: 'Stays' },
  { value: 'cuisine', label: 'Cuisine' },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [search, setSearch] = useState('');

  async function fetchOfferings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (type !== 'all') params.set('type', type);
      if (search) params.set('search', search);
      const { data } = await api.get(`/offerings?${params}`);
      setOfferings(data);
    } catch {
      setOfferings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOfferings(); }, [location, type]);

  function handleSearch(e) {
    e.preventDefault();
    fetchOfferings();
  }

  function clearFilters() {
    setLocation('');
    setType('all');
    setSearch('');
    setSearchParams({});
  }

  const hasFilters = location || type !== 'all' || search;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Explore</h1>
          <p className="text-slate-400">Find authentic local experiences across India</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search experiences, cuisine..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Location (e.g. Goa, Kerala...)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button type="submit" className="btn-primary px-6 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Type filter tabs */}
          <div className="flex flex-wrap gap-2 items-center">
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  type === t.value
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                <X className="w-4 h-4" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Finding experiences..." />
        ) : offerings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-white mb-2">No experiences found</h3>
            <p className="text-slate-400 mb-6">Try a different location or category</p>
            <button onClick={clearFilters} className="btn-secondary">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-6">{offerings.length} experience{offerings.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerings.map(o => <OfferingCard key={o.id} offering={o} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
