import { useState } from 'react';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';
import { AllocationMatrix } from '../allocation/AllocationMatrix';
import { SettingsPanel } from '../settings/SettingsPanel';
import { TrackingView } from '../tracking/TrackingView';

type ViewMode = 'overview' | 'allocation' | 'tracking' | 'settings';

export function MainLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  return (
    <div className="flex-1 flex flex-col">
      {/* View Toggle */}
      <div className="px-6 pt-6 pb-4">
        <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(229, 231, 235, 0.5)', padding: '0.375rem', display: 'inline-flex', gap: '0.25rem' }}>
          <button
            onClick={() => setViewMode('overview')}
            className="px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
            style={viewMode === 'overview' ? {
              background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.05)'
            } : {
              color: '#374151'
            }}
            onMouseEnter={(e) => { if (viewMode !== 'overview') e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { if (viewMode !== 'overview') e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
              </svg>
              Overview
            </div>
          </button>
          <button
            onClick={() => setViewMode('allocation')}
            className="px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
            style={viewMode === 'allocation' ? {
              background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.05)'
            } : {
              color: '#374151'
            }}
            onMouseEnter={(e) => { if (viewMode !== 'allocation') e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { if (viewMode !== 'allocation') e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Allocation Matrix
            </div>
          </button>
          <button
            onClick={() => setViewMode('tracking')}
            className="px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
            style={viewMode === 'tracking' ? {
              background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.05)'
            } : {
              color: '#374151'
            }}
            onMouseEnter={(e) => { if (viewMode !== 'tracking') e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { if (viewMode !== 'tracking') e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Tracking
            </div>
          </button>
          <button
            onClick={() => setViewMode('settings')}
            className="px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
            style={viewMode === 'settings' ? {
              background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.05)'
            } : {
              color: '#374151'
            }}
            onMouseEnter={(e) => { if (viewMode !== 'settings') e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { if (viewMode !== 'settings') e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'overview' ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 pb-6">
          {/* Left Panel - Epic List */}
          <div className="lg:col-span-3">
            <LeftPanel />
          </div>

          {/* Center Panel - Feature List */}
          <div className="lg:col-span-5">
            <CenterPanel />
          </div>

          {/* Right Panel - Sprint Timeline */}
          <div className="lg:col-span-4">
            <RightPanel />
          </div>
        </div>
      ) : viewMode === 'allocation' ? (
        <div className="flex-1 px-6 pb-6">
          <AllocationMatrix />
        </div>
      ) : viewMode === 'tracking' ? (
        <div className="flex-1 px-6 pb-6">
          <TrackingView />
        </div>
      ) : (
        <div className="flex-1 px-6 pb-6 max-w-4xl">
          <SettingsPanel />
        </div>
      )}
    </div>
  );
}
