import { SprintTimeline } from '../sprints/SprintTimeline';

export function RightPanel() {
  return (
    <div className="bg-white rounded shadow-sm border border-planner-gray-border p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-planner-blue p-2 rounded">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Sprint Timeline</h2>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <SprintTimeline />
      </div>
    </div>
  );
}
