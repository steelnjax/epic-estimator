import { useAppContext } from '../../context/AppContext';
import { AllocationCell } from './AllocationCell';
import { formatSprintDateRange } from '../../utils/dateUtils';

export function AllocationMatrix() {
  const { state, getEpicFeatures, getFeatureAllocations } = useAppContext();

  if (!state.selectedEpicId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <p className="text-lg font-medium">No epic selected</p>
          <p className="text-sm mt-2">Select an epic to allocate features to sprints</p>
        </div>
      </div>
    );
  }

  const features = getEpicFeatures(state.selectedEpicId);
  const selectedEpic = state.epics.find(e => e.id === state.selectedEpicId);

  if (features.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p className="text-lg font-medium">No features yet</p>
          <p className="text-sm mt-2">Add features to {selectedEpic?.name} to start allocating</p>
        </div>
      </div>
    );
  }

  // Calculate sprint totals
  const getSprintTotal = (sprintId: string) => {
    return state.allocations
      .filter(a => a.sprintId === sprintId)
      .reduce((sum, a) => sum + a.points, 0);
  };

  // Calculate feature totals
  const getFeatureTotal = (featureId: string) => {
    return getFeatureAllocations(featureId).reduce((sum, a) => sum + a.points, 0);
  };

  // Get allocation value for a feature-sprint pair
  const getAllocationValue = (featureId: string, sprintId: string) => {
    const allocation = state.allocations.find(
      a => a.featureId === featureId && a.sprintId === sprintId
    );
    return allocation?.points || 0;
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sprint Allocation Matrix
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">{selectedEpic?.name}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200/50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="sticky left-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-indigo-200">
                Feature
              </th>
              <th className="px-2 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-indigo-200">
                Size
              </th>
              <th className="px-2 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-indigo-200">
                Total
              </th>
              {state.sprints.map(sprint => (
                <th
                  key={sprint.id}
                  className="px-2 py-4 text-center text-xs font-bold text-gray-700 border-b-2 border-indigo-200"
                >
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-indigo-700">Sprint {sprint.number}</div>
                    <div className="text-xs font-normal text-gray-500 whitespace-nowrap mt-1">
                      {formatSprintDateRange(sprint.startDate, sprint.endDate)}
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-indigo-200">
                Completion
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {features.map((feature, idx) => {
              const totalAllocated = getFeatureTotal(feature.id);
              const isOverallocated = totalAllocated > feature.points;
              const isFullyAllocated = totalAllocated === feature.points;
              const completionSprint = feature.estimatedCompletionSprint;

              return (
                <tr key={feature.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                    <div className="max-w-xs truncate" title={feature.name}>
                      {feature.name}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {feature.size}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center text-sm border-r border-gray-200">
                    <span
                      className={`font-semibold ${
                        isOverallocated
                          ? 'text-red-600'
                          : isFullyAllocated
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {totalAllocated}/{feature.points}
                    </span>
                  </td>
                  {state.sprints.map(sprint => (
                    <td key={sprint.id} className="px-2 py-3 text-center">
                      <AllocationCell
                        feature={feature}
                        sprint={sprint}
                        currentValue={getAllocationValue(feature.id, sprint.id)}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center text-sm">
                    {completionSprint ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sprint {completionSprint}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not allocated</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-300">
              <td className="sticky left-0 z-10 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-4 text-sm font-bold text-indigo-900">
                Sprint Total
              </td>
              <td className="px-2 py-3"></td>
              <td className="px-2 py-3"></td>
              {state.sprints.map(sprint => {
                const total = getSprintTotal(sprint.id);
                const isOverallocated = total > sprint.velocity;
                const utilizationPercent = Math.round((total / sprint.velocity) * 100);

                return (
                  <td key={sprint.id} className="px-2 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-sm font-semibold ${
                          isOverallocated ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {total}/{sprint.velocity}
                      </span>
                      <span
                        className={`text-xs ${
                          isOverallocated
                            ? 'text-red-600'
                            : utilizationPercent >= 90
                            ? 'text-orange-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {utilizationPercent}%
                      </span>
                    </div>
                  </td>
                );
              })}
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center gap-8 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200/50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm"></div>
          <span className="font-medium">Allocated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-50 border-2 border-orange-400 rounded-lg shadow-sm"></div>
          <span className="font-medium">Over-allocated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm"></div>
          <span className="font-medium">Empty</span>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200/50 shadow-inner">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-900 mb-3">How to use the Allocation Matrix</h3>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Click any cell to allocate story points from a feature to a sprint</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>The matrix prevents over-allocation of sprint capacity and feature points</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Feature totals show allocated/total points for each feature</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Sprint totals show allocated/capacity points for each sprint</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Completion sprint is calculated automatically when a feature reaches 100%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
