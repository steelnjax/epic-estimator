import { useState } from 'react';
import { Feature } from '../../types';
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

  const handleDelete = () => {
    if (confirm(`Delete feature "${feature.name}"?`)) {
      dispatch({ type: 'DELETE_FEATURE', payload: { id: feature.id } });
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 truncate">{feature.name}</h4>
              <SizeBadge size={feature.size} points={feature.points} />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <StatusBadge status={feature.status} />
              <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 font-medium">
                {feature.priority}
              </span>
              {featureData && (
                <>
                  <span className="font-medium">
                    Allocated: <span className={featureData.totalAllocated === feature.points ? 'text-green-600' : 'text-gray-900'}>{featureData.totalAllocated}/{feature.points}</span>
                  </span>
                  {featureData.completionSprint && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold">
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
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Update status"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
              className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'bg-purple-100 text-purple-600' : 'text-purple-600 hover:bg-purple-50'}`}
              title="Show history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="mt-3 pt-3 border-t border-gray-200">
            <VarianceDisplay feature={feature} compact />
          </div>
        )}

        {/* Expandable History Section */}
        {showHistory && (
          <div className="mt-3 pt-3 border-t border-gray-200">
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
