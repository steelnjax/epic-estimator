import { FeatureStatus } from '../../types';
import { STATUS_COLORS } from '../../constants';

interface StatusBadgeProps {
  status: FeatureStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}
