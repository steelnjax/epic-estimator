import { useAppContext } from '../../context/AppContext';
import { FeatureList } from '../features/FeatureList';
import { AddFeatureForm } from '../features/AddFeatureForm';

export function CenterPanel() {
  const { state } = useAppContext();

  if (!state.selectedEpicId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex items-center justify-center">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-medium">No epic selected</p>
          <p className="text-sm mt-2">Select an epic from the left to view its features</p>
        </div>
      </div>
    );
  }

  const selectedEpic = state.epics.find(e => e.id === state.selectedEpicId);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 h-full flex flex-col hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Features - {selectedEpic?.name}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <FeatureList />
      </div>
      <AddFeatureForm />
    </div>
  );
}
