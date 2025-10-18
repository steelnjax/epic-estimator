import { ReactElement } from 'react';
import { Feature, FeatureStatus } from '../../types';

interface StatusHistoryTimelineProps {
  feature: Feature;
}

const STATUS_COLORS = {
  'Not Started': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    dot: 'bg-gray-400',
  },
  'In Progress': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
  'Blocked': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot: 'bg-red-500',
  },
  'Complete': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    dot: 'bg-green-500',
  },
};

const STATUS_ICONS: Record<FeatureStatus, ReactElement> = {
  'Not Started': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'In Progress': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'Blocked': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  'Complete': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function StatusHistoryTimeline({ feature }: StatusHistoryTimelineProps) {
  const history = [...feature.statusHistory].reverse(); // Most recent first

  if (history.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
        <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-gray-600">No status history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-700">Status History</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-purple-200" />

        {/* Timeline items */}
        <div className="space-y-4">
          {history.map((entry, index) => {
            const isLatest = index === 0;
            const colors = STATUS_COLORS[entry.status];

            return (
              <div key={entry.timestamp} className="relative pl-14">
                {/* Timeline dot */}
                <div className={`absolute left-4 top-2 w-5 h-5 rounded-full border-2 border-white shadow-md ${colors.dot} ${isLatest ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`} />

                {/* Content card */}
                <div className={`p-3 rounded-xl border-2 ${isLatest ? 'shadow-md' : 'bg-white/50'} ${colors.border} ${colors.bg}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${colors.text}`}>
                        {STATUS_ICONS[entry.status]}
                        {entry.status}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-600 text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-gray-500 font-medium">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>

                  {entry.notes && (
                    <p className="text-sm text-gray-700 mt-2 pl-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{history.length} status change{history.length > 1 ? 's' : ''}</span>
        </div>
        <div>
          Created {new Date(feature.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}
