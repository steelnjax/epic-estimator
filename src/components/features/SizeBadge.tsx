import { TShirtSize } from '../../types';
import { SIZE_COLORS } from '../../constants';

interface SizeBadgeProps {
  size: TShirtSize;
  points: number;
}

export function SizeBadge({ size, points }: SizeBadgeProps) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${SIZE_COLORS[size]}`}>
      {size} ({points}pts)
    </span>
  );
}
