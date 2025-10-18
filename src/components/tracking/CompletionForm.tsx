import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Feature } from '../../types';

interface CompletionFormProps {
  feature: Feature;
  onClose: () => void;
}

export function CompletionForm({ feature, onClose }: CompletionFormProps) {
  const { state, dispatch } = useAppContext();
  const [actualSprint, setActualSprint] = useState<number>(
    feature.estimatedCompletionSprint || state.sprints[0]?.number || 1
  );
  const [useActualPoints, setUseActualPoints] = useState(false);
  const [actualPoints, setActualPoints] = useState(feature.points.toString());
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actualPointsValue = useActualPoints ? parseInt(actualPoints, 10) : undefined;

    // Validate actual points if provided
    if (useActualPoints && (isNaN(actualPointsValue!) || actualPointsValue! <= 0)) {
      alert('Please enter valid actual points');
      return;
    }

    dispatch({
      type: 'MARK_FEATURE_COMPLETE',
      payload: {
        featureId: feature.id,
        actualSprint,
        actualPoints: actualPointsValue,
        notes: notes.trim() || undefined,
      },
    });

    onClose();
  };

  // Calculate variance
  const estimatedSprint = feature.estimatedCompletionSprint;
  const variance = estimatedSprint ? actualSprint - estimatedSprint : null;

  // Get variance display
  const getVarianceDisplay = () => {
    if (variance === null) {
      return { text: 'No estimate', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    if (variance === 0) {
      return { text: 'On time', color: 'text-green-700', bgColor: 'bg-green-100' };
    }
    if (variance > 0) {
      return {
        text: `${variance} sprint${variance > 1 ? 's' : ''} late`,
        color: 'text-red-700',
        bgColor: 'bg-red-100',
      };
    }
    return {
      text: `${Math.abs(variance)} sprint${Math.abs(variance) > 1 ? 's' : ''} early`,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
    };
  };

  const varianceDisplay = getVarianceDisplay();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mark as Complete</h2>
              <p className="text-sm text-gray-600">{feature.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Estimation vs Actual Summary */}
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estimation Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Estimated Completion</div>
                <div className="text-lg font-bold text-gray-900">
                  {estimatedSprint ? (
                    <>Sprint {estimatedSprint}</>
                  ) : (
                    <span className="text-gray-400">Not estimated</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Estimated Points</div>
                <div className="text-lg font-bold text-gray-900">{feature.points}</div>
              </div>
            </div>
          </div>

          {/* Actual Completion Sprint */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Actual Completion Sprint *
            </label>
            <select
              value={actualSprint}
              onChange={(e) => setActualSprint(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
              required
            >
              {state.sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.number}>
                  Sprint {sprint.number} ({new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Variance Display */}
          {variance !== null && (
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Variance Analysis</h3>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${varianceDisplay.bgColor} ${varianceDisplay.color}`}>
                  {variance === 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : variance > 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {varianceDisplay.text}
                </span>
                {variance !== 0 && (
                  <span className="text-xs text-gray-600">
                    {variance > 0 ? 'Took longer than estimated' : 'Completed ahead of schedule'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actual Points (Optional) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useActualPoints"
                checked={useActualPoints}
                onChange={(e) => setUseActualPoints(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:outline-indigo-500"
              />
              <label htmlFor="useActualPoints" className="text-sm font-semibold text-gray-700">
                Record actual story points (different from estimate)
              </label>
            </div>
            {useActualPoints && (
              <input
                type="number"
                value={actualPoints}
                onChange={(e) => setActualPoints(e.target.value)}
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="Enter actual story points"
              />
            )}
            <p className="text-xs text-gray-500 mt-2">
              Leave unchecked if the actual effort matched the estimate ({feature.points} points)
            </p>
          </div>

          {/* Completion Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Completion Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any lessons learned, challenges faced, or insights about the estimation accuracy..."
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Mark Complete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
