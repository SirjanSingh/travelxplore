import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { TYPE_CONFIG, formatPrice, getOfferingImage } from '../lib/utils';

export default function OfferingCard({ offering }) {
  const config = TYPE_CONFIG[offering.type] || TYPE_CONFIG.experience;
  const imgSrc = getOfferingImage(offering);

  return (
    <Link to={`/offering/${offering.id}`} className="card group block cursor-pointer">
      <div className="relative overflow-hidden h-52">
        <img
          src={imgSrc}
          alt={offering.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <span className={`badge ${config.badge} absolute top-3 left-3`}>
          {config.label}
        </span>
        {offering.is_customizable ? (
          <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 absolute top-3 right-3 text-[10px]">
            Custom Order
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-amber-400 transition-colors line-clamp-1">
          {offering.title}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-slate-400 text-sm">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{offering.location}</span>
        </div>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{offering.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-amber-400 font-bold text-lg">{formatPrice(offering.price)}</span>
            <span className="text-slate-500 text-sm ml-1">
              {offering.type === 'stay' ? '/night' : '/person'}
            </span>
          </div>
          {offering.host_name && (
            <span className="text-xs text-slate-500">by {offering.host_name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
