import { useState } from 'react';
import { Feature, Priority } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { SizeBadge } from './SizeBadge';
import { StatusBadge } from './StatusBadge';
import { StatusUpdateForm } from '../tracking/StatusUpdateForm';
import { CompletionForm } from '../tracking/CompletionForm';
import { VarianceDisplay } from '../tracking/VarianceDisplay';
import { StatusHistoryTimeline } from '../tracking/StatusHistoryTimeline';

interface FeatureRowProps {
  feature: Feature;
}

export function FeatureRow({ feature }: FeatureRowProps) {
  const { dispatch, computeFeatureData } = useAppContext();
  const featureData = computeFeatureData(feature.id);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(feature.name);

  const handleDelete = () => {
    if (confirm(`Delete feature "${feature.name}"?`)) {
      dispatch({ type: 'DELETE_FEATURE', payload: { id: feature.id } });
    }
  };

  const handleEditName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
    setNameValue(feature.name);
  };

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== feature.name) {
      dispatch({ type: 'UPDATE_FEATURE', payload: { id: feature.id, updates: { name: trimmed } } });
    } else {
      setNameValue(feature.name);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === 'Escape') {
      setNameValue(feature.name);
      setIsEditingName(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded border-l-4 border-l-planner-blue-light hover:shadow-md transition-all" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="font-semibold text-gray-800 px-2 py-1 border-2 border-planner-blue rounded focus:outline-none focus:border-planner-blue-dark flex-1"
                  autoFocus
                />
              ) : (
                <h4
                  className="font-semibold text-gray-800 truncate cursor-text hover:text-planner-blue transition-colors"
                  onClick={handleEditName}
                  title="Click to edit"
                >
                  {feature.name}
                </h4>
              )}
              <SizeBadge size={feature.size} points={feature.points} />
            </div>
            <div className="flex items-center gap-3 text-xs text-planner-gray-text">
              <StatusBadge status={feature.status} />
              <select
                value={feature.priority}
                onChange={e => {
                  dispatch({
                    type: 'UPDATE_FEATURE',
                    payload: { id: feature.id, updates: { priority: e.target.value as Priority } }
                  });
                }}
                className="text-xs px-2 py-1 border border-planner-gray-border rounded bg-white text-planner-gray-text hover:border-planner-blue focus:outline-none focus:border-planner-blue"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {featureData && (
                <>
                  <span className="font-medium">
                    Allocated: <span className={featureData.totalAllocated === feature.points ? 'text-status-green' : 'text-gray-800'}>{featureData.totalAllocated}/{feature.points}</span>
                  </span>
                  {featureData.completionSprint && (
                    <span className="px-2 py-0.5 bg-planner-blue/10 text-planner-blue rounded font-semibold">
                      Est: Sprint {featureData.completionSprint}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Action buttons */}
            {feature.status !== 'Complete' && (
              <>
                <button
                  onClick={() => setShowStatusForm(true)}
                  className="p-1.5 text-planner-blue hover:bg-planner-blue/10 rounded transition-colors"
                  title="Update status"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className="p-1.5 text-status-green hover:bg-status-green/10 rounded transition-colors"
                  title="Mark as complete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-1.5 rounded transition-colors ${showHistory ? 'bg-primary-teal/10 text-primary-teal' : 'text-primary-teal hover:bg-primary-teal/10'}`}
              title="Show history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-planner-gray-text-light hover:text-status-red hover:bg-status-red/10 rounded transition-colors"
              title="Delete feature"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Variance Display (if completed) */}
        {feature.status === 'Complete' && (
          <div className="mt-3 pt-3 border-t border-planner-gray-border">
            <VarianceDisplay feature={feature} compact />
          </div>
        )}

        {/* Expandable History Section */}
        {showHistory && (
          <div className="mt-3 pt-3 border-t border-planner-gray-border">
            <StatusHistoryTimeline feature={feature} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showStatusForm && (
        <StatusUpdateForm feature={feature} onClose={() => setShowStatusForm(false)} />
      )}
      {showCompletionForm && (
        <CompletionForm feature={feature} onClose={() => setShowCompletionForm(false)} />
      )}
    </>
  );
}
