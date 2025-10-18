import { useAppContext } from '../../context/AppContext';
import { FeatureList } from '../features/FeatureList';
import { AddFeatureForm } from '../features/AddFeatureForm';

export function CenterPanel() {
  const { state } = useAppContext();

  if (!state.selectedEpicId) {
    return (
      <div className="bg-white rounded shadow-sm border border-planner-gray-border p-4 h-full flex items-center justify-center">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-800">No epic selected</p>
          <p className="text-sm mt-2 text-planner-gray-text-light">Select an epic from the left to view its features</p>
        </div>
      </div>
    );
  }

  const selectedEpic = state.epics.find(e => e.id === state.selectedEpicId);

  return (
    <div className="bg-white rounded shadow-sm border border-planner-gray-border p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-planner-blue p-2 rounded">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Features - {selectedEpic?.name}
        </h2>
      </div>
      <AddFeatureForm />
      <div className="flex-1 overflow-y-auto mt-4 pr-2">
        <FeatureList />
      </div>
    </div>
  );
}
