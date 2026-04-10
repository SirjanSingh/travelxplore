export const TYPE_CONFIG = {
  stay: {
    label: 'Stay',
    badge: 'badge-stay',
    icon: 'home',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  experience: {
    label: 'Experience',
    badge: 'badge-experience',
    icon: 'star',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  cuisine: {
    label: 'Cuisine',
    badge: 'badge-cuisine',
    icon: 'utensils',
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
  },
  product: {
    label: 'Product',
    badge: 'badge-product',
    icon: 'package',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
  },
};

export const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' },
  confirmed: { label: 'Confirmed', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/20 border-red-500/30' },
  completed: { label: 'Completed', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
};

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Curated Unsplash images by category
export const PLACEHOLDER_IMAGES = {
  stay: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  ],
  experience: [
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
  ],
  cuisine: [
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=800&q=80',
  ],
  product: [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    'https://images.unsplash.com/photo-1519682577862-22b62b24cb12?w=800&q=80',
  ],
};

export function getPlaceholderImage(type, index = 0) {
  const imgs = PLACEHOLDER_IMAGES[type] || PLACEHOLDER_IMAGES.experience;
  return imgs[index % imgs.length];
}

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const backendUrl = 'https://travelxplore.onrender.com';
  return `${backendUrl}${url}`;
}

export function getOfferingImage(offering) {
  if (offering.images && offering.images.length > 0) {
    return resolveImageUrl(offering.images[0]);
  }
  return getPlaceholderImage(offering.type);
}
