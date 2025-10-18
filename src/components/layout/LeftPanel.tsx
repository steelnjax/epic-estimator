import { EpicList } from '../epics/EpicList';
import { AddEpicForm } from '../epics/AddEpicForm';

export function LeftPanel() {
  return (
    <div className="bg-white rounded shadow-sm border border-planner-gray-border p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-planner-blue p-2 rounded">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Epics</h2>
      </div>
      <AddEpicForm />
      <div className="flex-1 overflow-y-auto mt-4 pr-2">
        <EpicList />
      </div>
    </div>
  );
}
