import { EpicList } from '../epics/EpicList';
import { AddEpicForm } from '../epics/AddEpicForm';

export function LeftPanel() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 h-full flex flex-col hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Epics</h2>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <EpicList />
      </div>
      <AddEpicForm />
    </div>
  );
}
