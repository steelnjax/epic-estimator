import { useAppContext } from '../../context/AppContext';

export function Header() {
  const { state } = useAppContext();

  return (
    <header className="bg-white border-b border-planner-gray-border shadow-sm">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-planner-blue rounded">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Epic Estimator</h1>
                <p className="text-xs text-planner-gray-text-light">
                  Sprint capacity planning and estimation tracking
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-planner-gray-light rounded px-4 py-2 border border-planner-gray-border">
              <div className="text-xs font-medium text-planner-gray-text-light">Velocity</div>
              <div className="text-lg font-semibold text-gray-800">
                {state.config.velocity}
                <span className="text-sm font-normal ml-1 text-planner-gray-text">pts/sprint</span>
              </div>
            </div>
            <div className="bg-planner-gray-light rounded px-4 py-2 border border-planner-gray-border">
              <div className="text-xs font-medium text-planner-gray-text-light">Sprints</div>
              <div className="text-lg font-semibold text-gray-800">{state.config.numSprints}</div>
            </div>
            <div className="bg-planner-gray-light rounded px-4 py-2 border border-planner-gray-border">
              <div className="text-xs font-medium text-planner-gray-text-light">Epics</div>
              <div className="text-lg font-semibold text-gray-800">{state.epics.length}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
