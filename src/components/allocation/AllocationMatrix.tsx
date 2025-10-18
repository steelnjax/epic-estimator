import { useAppContext } from '../../context/AppContext';
import { AllocationCell } from './AllocationCell';
import { SprintVelocityEditor } from './SprintVelocityEditor';
import { formatSprintDateRange } from '../../utils/dateUtils';

export function AllocationMatrix() {
  const { state, getEpicFeatures, getFeatureAllocations } = useAppContext();

  // Group features by epic (sorted by epic sortOrder)
  const epicsWithFeatures = state.epics
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(epic => ({
      epic,
      features: getEpicFeatures(epic.id),
    }))
    .filter(group => group.features.length > 0);

  if (epicsWithFeatures.length === 0) {
    return (
      <div className="bg-white rounded shadow-sm border border-planner-gray-border p-8 flex items-center justify-center">
        <div className="text-center text-planner-gray-text">
          <svg
            className="mx-auto h-12 w-12 text-planner-gray-text-light mb-4"
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
          <p className="text-lg font-semibold text-gray-800">No features yet</p>
          <p className="text-sm mt-2 text-planner-gray-text-light">Add epics and features to start allocating</p>
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
    <div className="bg-white rounded shadow-sm border border-planner-gray-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-planner-blue p-2.5 rounded">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Sprint Allocation Matrix
          </h2>
          <p className="text-sm text-planner-gray-text mt-0.5">All Epics ({epicsWithFeatures.length})</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-planner-gray-border">
        <table className="min-w-full divide-y divide-planner-gray-border">
          <thead className="bg-planner-gray-light">
            <tr>
              <th className="sticky left-0 z-10 bg-planner-gray-light px-4 py-3 text-left text-xs font-semibold text-planner-gray-text uppercase tracking-wider border-b border-planner-gray-border">
                Feature
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold text-planner-gray-text uppercase tracking-wider border-b border-planner-gray-border">
                Size
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold text-planner-gray-text uppercase tracking-wider border-b border-planner-gray-border">
                Total
              </th>
              {state.sprints.map(sprint => (
                <th
                  key={sprint.id}
                  className="px-2 py-3 text-center text-xs font-semibold text-planner-gray-text border-b border-planner-gray-border"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="font-semibold text-planner-blue">Sprint {sprint.number}</div>
                    <div className="text-xs font-normal text-planner-gray-text-light whitespace-nowrap">
                      {formatSprintDateRange(sprint.startDate, sprint.endDate)}
                    </div>
                    <SprintVelocityEditor sprint={sprint} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold text-planner-gray-text uppercase tracking-wider border-b border-planner-gray-border">
                Completion
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-planner-gray-border">
            {epicsWithFeatures.map((group) => (
              <>
                {/* Epic Header Row */}
                <tr key={`epic-${group.epic.id}`} className="bg-planner-blue/5 border-t-2 border-planner-blue/20">
                  <td
                    colSpan={3 + state.sprints.length + 1}
                    className="sticky left-0 z-10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-planner-blue p-1.5 rounded">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-800 text-base">{group.epic.name}</span>
                      <span className="text-xs font-medium text-planner-gray-text px-2 py-0.5 bg-white rounded border border-planner-gray-border">
                        {group.features.length} {group.features.length === 1 ? 'feature' : 'features'}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        group.epic.priority === 'High'
                          ? 'bg-status-red/10 text-status-red'
                          : group.epic.priority === 'Medium'
                          ? 'bg-status-orange/10 text-status-orange'
                          : 'bg-planner-gray-light text-planner-gray-text'
                      }`}>
                        {group.epic.priority}
                      </span>
                    </div>
                  </td>
                </tr>
                {/* Feature Rows */}
                {group.features.map((feature, idx) => {
                  const totalAllocated = getFeatureTotal(feature.id);
                  const isOverallocated = totalAllocated > feature.points;
                  const isFullyAllocated = totalAllocated === feature.points;
                  const completionSprint = feature.estimatedCompletionSprint;

                  return (
                    <tr key={feature.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-planner-gray-bg'}>
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm font-medium text-gray-800 border-r border-planner-gray-border">
                        <div className="max-w-xs truncate pl-8" title={feature.name}>
                          {feature.name}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center text-sm text-gray-800 border-r border-planner-gray-border">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-planner-blue/10 text-planner-blue">
                          {feature.size}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center text-sm border-r border-planner-gray-border">
                        <span
                          className={`font-semibold ${
                            isOverallocated
                              ? 'text-status-red'
                              : isFullyAllocated
                              ? 'text-status-green'
                              : 'text-gray-800'
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-green/10 text-status-green">
                            Sprint {completionSprint}
                          </span>
                        ) : (
                          <span className="text-planner-gray-text-light text-xs">Not allocated</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-planner-gray-light border-t-2 border-planner-gray-border">
              <td className="sticky left-0 z-10 bg-planner-gray-light px-4 py-3 text-sm font-semibold text-gray-800">
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
                          isOverallocated ? 'text-status-red' : 'text-gray-800'
                        }`}
                      >
                        {total}/{sprint.velocity}
                      </span>
                      <span
                        className={`text-xs ${
                          isOverallocated
                            ? 'text-status-red'
                            : utilizationPercent >= 90
                            ? 'text-status-orange'
                            : 'text-planner-gray-text'
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
      <div className="mt-6 flex items-center gap-6 text-sm text-planner-gray-text bg-planner-gray-light rounded p-4 border border-planner-gray-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-planner-blue/10 border-2 border-planner-blue rounded"></div>
          <span className="font-medium">Allocated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-status-orange/10 border-2 border-status-orange rounded"></div>
          <span className="font-medium">Over-allocated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-planner-gray-border rounded"></div>
          <span className="font-medium">Empty</span>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-6 p-5 bg-planner-blue/5 rounded border border-planner-blue/20">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded border border-planner-gray-border">
            <svg className="w-5 h-5 text-planner-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">How to use the Allocation Matrix</h3>
            <ul className="text-sm text-planner-gray-text space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-planner-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Click any cell to allocate story points from a feature to a sprint</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-planner-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>The matrix prevents over-allocation of sprint capacity and feature points</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-planner-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Feature totals show allocated/total points for each feature</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-planner-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Sprint totals show allocated/capacity points for each sprint</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-planner-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
