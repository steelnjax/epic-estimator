import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { startOfNextTuesday } from '../../utils/dateUtils';

export function SettingsPanel() {
  const { state, dispatch } = useAppContext();
  const [velocity, setVelocity] = useState(state.config.velocity.toString());
  const [numSprints, setNumSprints] = useState(state.config.numSprints.toString());
  const [startDate, setStartDate] = useState(
    state.config.firstSprintStart.toISOString().split('T')[0]
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleVelocityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVelocity(e.target.value);
    setHasChanges(true);
  };

  const handleNumSprintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumSprints(e.target.value);
    setHasChanges(true);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    const velocityNum = parseInt(velocity, 10);
    const numSprintsNum = parseInt(numSprints, 10);
    const startDateObj = new Date(startDate);

    if (isNaN(velocityNum) || velocityNum <= 0) {
      alert('Velocity must be a positive number');
      return;
    }

    if (isNaN(numSprintsNum) || numSprintsNum <= 0 || numSprintsNum > 52) {
      alert('Number of sprints must be between 1 and 52');
      return;
    }

    if (isNaN(startDateObj.getTime())) {
      alert('Invalid start date');
      return;
    }

    // Ensure start date is a Tuesday
    const tuesday = startOfNextTuesday(startDateObj);

    // Update config
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: {
        velocity: velocityNum,
        numSprints: numSprintsNum,
        firstSprintStart: tuesday,
      },
    });

    // Regenerate sprints with new configuration
    dispatch({ type: 'REGENERATE_SPRINTS' });

    setHasChanges(false);
  };

  const handleReset = () => {
    setVelocity(state.config.velocity.toString());
    setNumSprints(state.config.numSprints.toString());
    setStartDate(state.config.firstSprintStart.toISOString().split('T')[0]);
    setHasChanges(false);
  };

  const handleResetToDefaults = () => {
    const tuesday = startOfNextTuesday(new Date());
    setVelocity('100');
    setNumSprints('10');
    setStartDate(tuesday.toISOString().split('T')[0]);
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded shadow-sm border border-planner-gray-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-planner-blue p-2.5 rounded">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Project Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Sprint Configuration */}
        <div className="bg-planner-gray-light rounded p-5 border border-planner-gray-border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-planner-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Sprint Configuration
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Velocity (Story Points per Sprint)
              </label>
              <input
                type="number"
                min="1"
                value={velocity}
                onChange={handleVelocityChange}
                className="w-full px-3 py-2 bg-white border border-planner-gray-border rounded focus:outline-none focus:border-planner-blue transition-all"
              />
              <p className="mt-2 text-xs text-planner-gray-text-light flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total story points the team can complete in a 10-day sprint
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Sprints
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={numSprints}
                onChange={handleNumSprintsChange}
                className="w-full px-3 py-2 bg-white border border-planner-gray-border rounded focus:outline-none focus:border-planner-blue transition-all"
              />
              <p className="mt-2 text-xs text-planner-gray-text-light flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How many sprints to plan (typically 6-12 for a quarter)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Sprint Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 bg-white border border-planner-gray-border rounded focus:outline-none focus:border-planner-blue transition-all"
              />
              <p className="mt-2 text-xs text-planner-gray-text-light flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Will be adjusted to the next Tuesday if not already a Tuesday
              </p>
            </div>
          </div>
        </div>

        {/* Current Sprint Info */}
        <div className="bg-planner-blue/5 rounded p-5 border border-planner-blue/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-planner-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Current Configuration
          </h3>
          <div className="bg-white rounded p-4 space-y-2.5 text-sm border border-planner-gray-border">
            <div className="flex justify-between">
              <span className="text-planner-gray-text">Total Sprints:</span>
              <span className="font-medium text-gray-800">{state.sprints.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-planner-gray-text">Sprint Velocity:</span>
              <span className="font-medium text-gray-800">{state.config.velocity} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-planner-gray-text">Total Capacity:</span>
              <span className="font-medium text-gray-800">
                {state.sprints.length * state.config.velocity} pts
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-planner-gray-text">Sprint 1 Start:</span>
              <span className="font-medium text-gray-800">
                {state.config.firstSprintStart.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-planner-gray-text">Last Sprint End:</span>
              <span className="font-medium text-gray-800">
                {state.sprints.length > 0
                  ? state.sprints[state.sprints.length - 1].endDate.toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-1 px-6 py-2.5 rounded font-semibold transition-all ${
              hasChanges
                ? 'bg-planner-blue text-white hover:bg-planner-blue-hover'
                : 'bg-planner-gray-light text-planner-gray-text-light cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </div>
          </button>
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className={`px-6 py-2.5 rounded font-semibold transition-all ${
              hasChanges
                ? 'bg-planner-gray-light text-planner-gray-text hover:bg-planner-gray-border'
                : 'bg-planner-gray-bg text-planner-gray-text-light cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleResetToDefaults}
            className="px-6 py-2.5 rounded font-semibold bg-planner-gray-light text-planner-gray-text hover:bg-planner-gray-border transition-all"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Warning about changes */}
        {hasChanges && (
          <div className="bg-status-orange/10 border border-status-orange rounded p-4">
            <div className="flex items-start gap-3">
              <div className="bg-status-orange p-2 rounded">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Warning: Changing these settings will regenerate all sprints
                </h4>
                <p className="text-sm text-planner-gray-text mt-1">
                  Existing allocations will be preserved, but feature completion sprints may change
                  if sprint dates are modified.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
