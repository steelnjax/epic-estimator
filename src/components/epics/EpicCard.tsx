import { useState } from 'react';
import { Epic, Priority } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface EpicCardProps {
  epic: Epic;
}

export function EpicCard({ epic }: EpicCardProps) {
  const { state, dispatch, computeEpicData } = useAppContext();
  const isSelected = state.selectedEpicId === epic.id;
  const epicData = computeEpicData(epic.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(epic.name);

  const handleSelect = () => {
    if (!isEditing) {
      dispatch({ type: 'SELECT_EPIC', payload: { epicId: epic.id } });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete epic "${epic.name}" and all its features?`)) {
      dispatch({ type: 'DELETE_EPIC', payload: { id: epic.id } });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(epic.name);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== epic.name) {
      dispatch({ type: 'UPDATE_EPIC', payload: { id: epic.id, name: trimmed } });
    } else {
      setEditValue(epic.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(epic.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`
        p-3 rounded bg-white cursor-pointer transition-all border-l-4
        ${
          isSelected
            ? 'border-l-planner-blue shadow-md ring-1 ring-planner-blue/20'
            : 'border-l-planner-gray-border hover:shadow-sm hover:border-l-planner-blue-light'
        }
      `}
      style={{ boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              onClick={e => e.stopPropagation()}
              className="font-semibold text-gray-800 px-2 py-1 border-2 border-planner-blue rounded focus:outline-none focus:border-planner-blue-dark w-full"
              autoFocus
            />
          ) : (
            <h3
              className="font-semibold text-gray-800 truncate cursor-text hover:text-planner-blue transition-colors"
              onClick={handleEdit}
              title="Click to edit"
            >
              {epic.name}
            </h3>
          )}
          {/* Priority dropdown - only show when not editing name */}
          {!isEditing && (
            <div className="mt-2">
              <select
                value={epic.priority}
                onChange={e => {
                  e.stopPropagation();
                  dispatch({
                    type: 'UPDATE_EPIC_PRIORITY',
                    payload: { id: epic.id, priority: e.target.value as Priority }
                  });
                }}
                onClick={e => e.stopPropagation()}
                className="text-xs px-2 py-1 border border-planner-gray-border rounded bg-white text-planner-gray-text hover:border-planner-blue focus:outline-none focus:border-planner-blue"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-planner-gray-text">
            <span>{epicData?.featureCount || 0} features</span>
            <span>{epicData?.totalPoints || 0} pts</span>
          </div>
          {epicData && epicData.completionSprint && (
            <div className="mt-2 text-xs text-planner-gray-text-light">
              Est. Sprint {epicData.completionSprint}
            </div>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="ml-2 text-planner-gray-text-light hover:text-status-red transition-colors"
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
