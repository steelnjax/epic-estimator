import { Sprint } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatSprintDateRange } from '../../utils/dateUtils';

interface SprintColumnProps {
  sprint: Sprint;
}

export function SprintColumn({ sprint }: SprintColumnProps) {
  const { computeSprintData } = useAppContext();
  const sprintData = computeSprintData(sprint.id);

  if (!sprintData) {
    return null;
  }

  const utilizationColor =
    sprintData.utilizationPercent > 100
      ? 'bg-red-500'
      : sprintData.utilizationPercent > 90
      ? 'bg-orange-500'
      : 'bg-green-500';

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Sprint Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Sprint {sprint.number}</h3>
          <span className="text-xs text-gray-600">
            {Math.round(sprintData.utilizationPercent)}%
          </span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {formatSprintDateRange(sprint.startDate, sprint.endDate)}
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Capacity</span>
          <span>
            {sprintData.totalAllocated} / {sprint.velocity} pts
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${utilizationColor}`}
            style={{
              width: `${Math.min(100, sprintData.utilizationPercent)}%`,
            }}
          />
        </div>
        {sprintData.isOverallocated && (
          <p className="text-xs text-red-600 mt-1">Over capacity!</p>
        )}
      </div>

      {/* Completing Features */}
      {sprintData.completingFeatures.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Completing:</p>
          <div className="space-y-1">
            {sprintData.completingFeatures.map(feature => (
              <div key={feature.id} className="text-xs text-gray-700 truncate">
                • {feature.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
