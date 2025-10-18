import { SprintTimeline } from '../sprints/SprintTimeline';

export function RightPanel() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 h-full flex flex-col hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Sprint Timeline</h2>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <SprintTimeline />
      </div>
    </div>
  );
}
