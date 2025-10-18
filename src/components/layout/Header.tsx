import { useAppContext } from '../../context/AppContext';

export function Header() {
  const { state } = useAppContext();

  return (
    <header style={{ background: 'linear-gradient(to right, #6366F1, #8B5CF6, #EC4899)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <div className="max-w-full mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                <svg className="w-8 h-8" style={{ color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'white' }}>Epic Estimator</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(199, 210, 254, 1)' }}>
                  Sprint capacity planning and estimation tracking
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', borderRadius: '0.75rem', padding: '0.75rem 1rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}>
              <div className="text-xs font-medium" style={{ color: 'rgba(199, 210, 254, 1)' }}>Velocity</div>
              <div className="text-xl font-bold" style={{ color: 'white' }}>
                {state.config.velocity}
                <span className="text-sm font-normal ml-1" style={{ color: 'rgba(199, 210, 254, 1)' }}>pts/sprint</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', borderRadius: '0.75rem', padding: '0.75rem 1rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}>
              <div className="text-xs font-medium" style={{ color: 'rgba(199, 210, 254, 1)' }}>Sprints</div>
              <div className="text-xl font-bold" style={{ color: 'white' }}>{state.config.numSprints}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', borderRadius: '0.75rem', padding: '0.75rem 1rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}>
              <div className="text-xs font-medium" style={{ color: 'rgba(199, 210, 254, 1)' }}>Epics</div>
              <div className="text-xl font-bold" style={{ color: 'white' }}>{state.epics.length}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
