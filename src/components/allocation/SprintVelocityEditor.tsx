import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sprint } from '../../types';

interface SprintVelocityEditorProps {
  sprint: Sprint;
}

export function SprintVelocityEditor({ sprint }: SprintVelocityEditorProps) {
  const { state, dispatch } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(sprint.velocity.toString());

  const isOverridden = sprint.velocity !== state.config.velocity;

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(sprint.velocity.toString());
  };

  const handleSave = () => {
    const newVelocity = parseInt(editValue, 10);
    if (!isNaN(newVelocity) && newVelocity > 0 && newVelocity !== sprint.velocity) {
      dispatch({
        type: 'UPDATE_SPRINT_VELOCITY',
        payload: { sprintId: sprint.id, velocity: newVelocity },
      });
    } else {
      setEditValue(sprint.velocity.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(sprint.velocity.toString());
      setIsEditing(false);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'UPDATE_SPRINT_VELOCITY',
      payload: { sprintId: sprint.id, velocity: state.config.velocity },
    });
  };

  return (
    <div className="flex flex-col items-center gap-1 min-w-[80px]">
      {isEditing ? (
        <input
          type="number"
          min="1"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
          className="w-16 px-2 py-1 text-xs text-center border-2 border-planner-blue rounded focus:outline-none focus:border-planner-blue-dark"
          autoFocus
        />
      ) : (
        <button
          onClick={handleClick}
          className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
            isOverridden
              ? 'bg-status-orange/10 text-status-orange hover:bg-status-orange/20'
              : 'bg-planner-gray-light text-planner-gray-text hover:bg-planner-gray-border'
          }`}
          title={
            isOverridden
              ? `Velocity overridden from default (${state.config.velocity}). Click to edit or reset.`
              : 'Click to override sprint velocity (for holidays/PTO)'
          }
        >
          {sprint.velocity} pts
          {isOverridden && (
            <svg
              className="w-3 h-3 inline-block ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </button>
      )}
      {isOverridden && !isEditing && (
        <button
          onClick={handleReset}
          className="text-xs text-planner-blue hover:text-planner-blue-dark underline"
          title={`Reset to default velocity (${state.config.velocity})`}
        >
          Reset
        </button>
      )}
    </div>
  );
}
