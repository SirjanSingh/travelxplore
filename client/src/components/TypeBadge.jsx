import { TYPE_CONFIG } from '../lib/utils';

export default function TypeBadge({ type, className = '' }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.experience;
  return (
    <span className={`badge ${config.badge} ${className}`}>
      {config.label}
    </span>
  );
}
