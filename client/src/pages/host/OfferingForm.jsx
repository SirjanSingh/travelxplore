import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Info } from 'lucide-react';
import HostSidebar from '../../components/HostSidebar';
import api from '../../lib/api';
import { PLACEHOLDER_IMAGES, resolveImageUrl } from '../../lib/utils';

const TYPES = ['stay', 'experience', 'cuisine'];

const EMPTY = {
  title: '', description: '', type: 'stay', price: '',
  location: '', images: [], available_from: '', available_to: '',
  max_guests: 1, is_customizable: false, customization_note: '',
};

export default function OfferingForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/offerings/${id}`).then(r => {
        const o = r.data;
        setForm({
          title: o.title || '', description: o.description || '',
          type: o.type || 'stay', price: o.price || '',
          location: o.location || '', images: o.images || [],
          available_from: o.available_from || '', available_to: o.available_to || '',
          max_guests: o.max_guests || 1,
          is_customizable: !!o.is_customizable, customization_note: o.customization_note || '',
        });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('images', f));
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl() {
    if (!imageUrl.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl('');
  }

  function removeImage(i) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  }

  function addPlaceholder() {
    const imgs = PLACEHOLDER_IMAGES[form.type] || PLACEHOLDER_IMAGES.experience;
    const next = imgs.find(img => !form.images.includes(img));
    if (next) setForm(prev => ({ ...prev, images: [...prev.images, next] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.price || !form.location) {
      setError('Please fill all required fields.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/offerings/${id}`, form);
      } else {
        await api.post('/offerings', form);
      }
      navigate('/host/offerings');
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-screen bg-slate-950"><HostSidebar /><main className="ml-60 flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin" /></main></div>;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <HostSidebar />
      <main className="ml-60 flex-1 p-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {isEdit ? 'Edit Offering' : 'New Offering'}
        </h1>
        <p className="text-slate-400 mb-8">{isEdit ? 'Update your listing details' : 'List something amazing for travellers'}</p>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          {/* Type */}
          <div>
            <label className="label">Offering Type *</label>
            <div className="grid grid-cols-4 gap-3">
              {TYPES.map(t => {
                const icons = { stay: '🏠', experience: '🎭', cuisine: '🍲' };
                const labels = { stay: 'Stay', experience: 'Experience', cuisine: 'Cuisine' };
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      form.type === t ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl" role="img" aria-label={labels[t]}>{icons[t]}</span>
                    <span className="text-xs font-medium capitalize">{labels[t]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">Title *</label>
            <input className="input" placeholder="e.g. Sunrise Yoga by the Lake" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea className="input resize-none h-28" placeholder="Describe the experience in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Location *</label>
              <input className="input" placeholder="e.g. Udaipur, Rajasthan" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="label">Price (₹) *</label>
              <input type="number" min="0" step="50" className="input" placeholder="e.g. 1500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Available From</label>
              <input type="date" className="input" value={form.available_from} onChange={e => setForm({ ...form, available_from: e.target.value })} />
            </div>
            <div>
              <label className="label">Available To</label>
              <input type="date" className="input" value={form.available_to} onChange={e => setForm({ ...form, available_to: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">Max Guests / Quantity</label>
            <input type="number" min="1" max="100" className="input" value={form.max_guests} onChange={e => setForm({ ...form, max_guests: e.target.value })} />
          </div>

          {/* Images */}
          <div>
            <label className="label">Images</label>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={resolveImageUrl(img)} alt="" className="w-20 h-20 object-cover rounded-xl border border-slate-700" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80'; }} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }}
                />
                <button type="button" onClick={addImageUrl} className="btn-secondary px-4 text-sm">Add URL</button>
                <button type="button" onClick={addPlaceholder} className="btn-secondary px-4 text-sm">Use Sample</button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <span className={`flex items-center gap-2 btn-secondary text-sm ${uploading ? 'opacity-50' : ''}`}>
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload File'}
                </span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>



          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving} className="btn-primary px-8 h-12">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Offering'}
            </button>
            <button type="button" onClick={() => navigate('/host/offerings')} className="btn-secondary h-12">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
