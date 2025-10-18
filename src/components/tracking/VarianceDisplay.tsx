import { Feature } from '../../types';

interface VarianceDisplayProps {
  feature: Feature;
  compact?: boolean;
}

export function VarianceDisplay({ feature, compact = false }: VarianceDisplayProps) {
  // Calculate variance
  const estimatedSprint = feature.estimatedCompletionSprint;
  const actualSprint = feature.actualCompletionSprint;
  const variance = estimatedSprint && actualSprint ? actualSprint - estimatedSprint : null;

  // If feature is not complete, show nothing
  if (!actualSprint) {
    return null;
  }

  // Get variance styling
  const getVarianceStyle = () => {
    if (variance === null) {
      return {
        text: 'No estimate',
        icon: '?',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
      };
    }
    if (variance === 0) {
      return {
        text: 'On time',
        icon: '✓',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
      };
    }
    if (variance > 0) {
      return {
        text: `${variance} sprint${variance > 1 ? 's' : ''} late`,
        icon: '↑',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
      };
    }
    return {
      text: `${Math.abs(variance)} sprint${Math.abs(variance) > 1 ? 's' : ''} early`,
      icon: '↓',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
    };
  };

  const style = getVarianceStyle();

  // Points variance
  const hasPointsVariance = feature.actualPoints !== null && feature.actualPoints !== feature.points;
  const pointsVariance = hasPointsVariance ? (feature.actualPoints! - feature.points) : 0;

  // Compact view (for tables/lists)
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${style.bgColor} ${style.textColor} ${style.borderColor}`}>
          <span className="font-bold">{style.icon}</span>
          <span>{style.text}</span>
        </span>
        {hasPointsVariance && (
          <span className="text-xs text-gray-500" title={`Actual: ${feature.actualPoints} pts, Estimated: ${feature.points} pts`}>
            ({pointsVariance > 0 ? '+' : ''}{pointsVariance} pts)
          </span>
        )}
      </div>
    );
  }

  // Full view (for detail cards)
  return (
    <div className={`p-4 rounded-xl border-2 ${style.borderColor} ${style.bgColor}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${style.textColor} bg-white/50 font-bold text-xl`}>
          {style.icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Estimation Accuracy</h3>
          <p className={`text-lg font-bold ${style.textColor}`}>
            {style.text}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-xs text-gray-600 mb-1">Estimated Sprint</div>
          <div className="text-sm font-semibold text-gray-900">
            {estimatedSprint ? `Sprint ${estimatedSprint}` : 'Not estimated'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Actual Sprint</div>
          <div className="text-sm font-semibold text-gray-900">
            Sprint {actualSprint}
          </div>
        </div>
      </div>

      {hasPointsVariance && (
        <div className="pt-3 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Estimated Points</div>
              <div className="text-sm font-semibold text-gray-900">{feature.points}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Actual Points</div>
              <div className="text-sm font-semibold text-gray-900">
                {feature.actualPoints}
                <span className={`ml-2 text-xs ${pointsVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ({pointsVariance > 0 ? '+' : ''}{pointsVariance})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accuracy percentage */}
      {variance !== null && estimatedSprint && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Accuracy</span>
            <span className={`text-sm font-bold ${variance === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {variance === 0 ? '100%' : `${Math.round((estimatedSprint / actualSprint) * 100)}%`}
            </span>
          </div>
          {variance !== 0 && (
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${variance > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, Math.abs((estimatedSprint / actualSprint) * 100))}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
