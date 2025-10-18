import { useAppContext } from '../../context/AppContext';
import { FeatureRow } from '../features/FeatureRow';

export function TrackingView() {
  const { state, getEpicFeatures } = useAppContext();

  // Get all features if an epic is selected
  const features = state.selectedEpicId
    ? getEpicFeatures(state.selectedEpicId)
    : state.features;

  const selectedEpic = state.epics.find(e => e.id === state.selectedEpicId);

  // Group features by status
  const featuresByStatus = {
    'In Progress': features.filter(f => f.status === 'In Progress'),
    'Blocked': features.filter(f => f.status === 'Blocked'),
    'Complete': features.filter(f => f.status === 'Complete'),
    'Not Started': features.filter(f => f.status === 'Not Started'),
  };

  // Calculate statistics
  const totalFeatures = features.length;
  const completedFeatures = features.filter(f => f.status === 'Complete').length;
  const inProgressFeatures = features.filter(f => f.status === 'In Progress').length;
  const blockedFeatures = features.filter(f => f.status === 'Blocked').length;

  // Calculate variance statistics for completed features
  const completedWithVariance = features.filter(
    f => f.status === 'Complete' && f.actualCompletionSprint !== null && f.estimatedCompletionSprint !== null
  );
  const onTimeCount = completedWithVariance.filter(
    f => f.actualCompletionSprint === f.estimatedCompletionSprint
  ).length;
  const earlyCount = completedWithVariance.filter(
    f => f.actualCompletionSprint! < f.estimatedCompletionSprint!
  ).length;
  const lateCount = completedWithVariance.filter(
    f => f.actualCompletionSprint! > f.estimatedCompletionSprint!
  ).length;

  if (!state.selectedEpicId) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-8 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No epic selected</p>
          <p className="text-sm mt-2">Select an epic to track feature progress</p>
        </div>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-8 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="text-lg font-medium">No features yet</p>
          <p className="text-sm mt-2">Add features to {selectedEpic?.name} to start tracking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Feature Tracking
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">{selectedEpic?.name}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="text-xs text-blue-600 font-semibold uppercase mb-1">Total Features</div>
          <div className="text-3xl font-bold text-blue-900">{totalFeatures}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="text-xs text-green-600 font-semibold uppercase mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-900">{completedFeatures}</div>
          {totalFeatures > 0 && (
            <div className="text-xs text-green-600 mt-1">
              {Math.round((completedFeatures / totalFeatures) * 100)}% done
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="text-xs text-amber-600 font-semibold uppercase mb-1">In Progress</div>
          <div className="text-3xl font-bold text-amber-900">{inProgressFeatures}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
          <div className="text-xs text-red-600 font-semibold uppercase mb-1">Blocked</div>
          <div className="text-3xl font-bold text-red-900">{blockedFeatures}</div>
        </div>
      </div>

      {/* Variance Statistics (only if there are completed features) */}
      {completedWithVariance.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">Estimation Accuracy</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">{onTimeCount}</div>
              <div className="text-sm text-gray-600 mt-1">On Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">{earlyCount}</div>
              <div className="text-sm text-gray-600 mt-1">Early</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">{lateCount}</div>
              <div className="text-sm text-gray-600 mt-1">Late</div>
            </div>
          </div>
          {completedWithVariance.length > 0 && (
            <div className="mt-4 pt-4 border-t border-indigo-200 text-center text-sm text-gray-600">
              Overall accuracy: {Math.round((onTimeCount / completedWithVariance.length) * 100)}% on time
            </div>
          )}
        </div>
      )}

      {/* Features grouped by status */}
      <div className="space-y-6">
        {(['In Progress', 'Blocked', 'Not Started', 'Complete'] as const).map((status) => {
          const statusFeatures = featuresByStatus[status];
          if (statusFeatures.length === 0) return null;

          return (
            <div key={status}>
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                {status === 'In Progress' && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
                {status === 'Blocked' && (
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                )}
                {status === 'Complete' && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
                {status === 'Not Started' && (
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                )}
                {status} ({statusFeatures.length})
              </h3>
              <div className="space-y-3">
                {statusFeatures.map((feature) => (
                  <FeatureRow key={feature.id} feature={feature} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
