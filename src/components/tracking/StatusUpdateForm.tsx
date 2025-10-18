import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Feature, FeatureStatus } from '../../types';

interface StatusUpdateFormProps {
  feature: Feature;
  onClose: () => void;
}

const STATUS_OPTIONS: FeatureStatus[] = ['Not Started', 'In Progress', 'Blocked', 'Complete'];

const STATUS_COLORS = {
  'Not Started': 'bg-gray-100 text-gray-800 border-gray-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'Blocked': 'bg-red-100 text-red-800 border-red-300',
  'Complete': 'bg-green-100 text-green-800 border-green-300',
};

const STATUS_ICONS = {
  'Not Started': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'In Progress': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'Blocked': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  'Complete': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function StatusUpdateForm({ feature, onClose }: StatusUpdateFormProps) {
  const { dispatch } = useAppContext();
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus>(feature.status);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If marking as complete, we'll need the completion form instead
    if (selectedStatus === 'Complete' && feature.status !== 'Complete') {
      // This will be handled by the CompletionForm component
      alert('Please use the Complete button to mark this feature as complete and record actual sprint/points.');
      return;
    }

    dispatch({
      type: 'UPDATE_FEATURE_STATUS',
      payload: {
        featureId: feature.id,
        status: selectedStatus,
        notes: notes.trim() || undefined,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
              <p className="text-sm text-gray-600">{feature.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedStatus === status
                      ? STATUS_COLORS[status] + ' shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {STATUS_ICONS[status]}
                  <span className="font-medium text-sm">{status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any relevant notes about this status change..."
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Status History Preview */}
          {feature.statusHistory.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Status</h3>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${STATUS_COLORS[feature.status]}`}>
                  {STATUS_ICONS[feature.status]}
                  {feature.status}
                </span>
                <span className="text-xs text-gray-500">
                  Updated {new Date(feature.statusHistory[feature.statusHistory.length - 1].timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={selectedStatus === feature.status && !notes.trim()}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedStatus === feature.status && !notes.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              Update Status
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
