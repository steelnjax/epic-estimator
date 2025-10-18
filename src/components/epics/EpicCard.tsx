import { Epic } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface EpicCardProps {
  epic: Epic;
}

export function EpicCard({ epic }: EpicCardProps) {
  const { state, dispatch, computeEpicData } = useAppContext();
  const isSelected = state.selectedEpicId === epic.id;
  const epicData = computeEpicData(epic.id);

  const handleSelect = () => {
    dispatch({ type: 'SELECT_EPIC', payload: { epicId: epic.id } });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete epic "${epic.name}" and all its features?`)) {
      dispatch({ type: 'DELETE_EPIC', payload: { id: epic.id } });
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`
        p-3 rounded-lg border-2 cursor-pointer transition-all
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{epic.name}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
            <span>{epicData?.featureCount || 0} features</span>
            <span>{epicData?.totalPoints || 0} pts</span>
          </div>
          {epicData && epicData.completionSprint && (
            <div className="mt-2 text-xs text-gray-600">
              Est. Sprint {epicData.completionSprint}
            </div>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete epic"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
