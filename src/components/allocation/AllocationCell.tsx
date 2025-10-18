import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { validateAllocation, validateFeatureAllocation, validatePoints } from '../../utils/validation';
import { Feature, Sprint } from '../../types';

interface AllocationCellProps {
  feature: Feature;
  sprint: Sprint;
  currentValue: number;
}

export function AllocationCell({ feature, sprint, currentValue }: AllocationCellProps) {
  const { state, dispatch, getFeatureAllocations } = useAppContext();
  const [inputValue, setInputValue] = useState(currentValue.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update input value when current value changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(currentValue > 0 ? currentValue.toString() : '');
    }
  }, [currentValue, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setInputValue(currentValue > 0 ? currentValue.toString() : '');
      setError(null);
      e.currentTarget.blur();
    }
  };

  const handleSave = () => {
    const trimmed = inputValue.trim();

    // Empty input means clear allocation
    if (trimmed === '') {
      dispatch({
        type: 'SET_ALLOCATION',
        payload: { featureId: feature.id, sprintId: sprint.id, points: 0 },
      });
      return;
    }

    const points = parseInt(trimmed, 10);

    // Validate points format
    const pointsValidation = validatePoints(points);
    if (!pointsValidation.valid) {
      setError(pointsValidation.message || 'Invalid points');
      setInputValue(currentValue > 0 ? currentValue.toString() : '');
      return;
    }

    // Validate feature capacity
    const featureAllocations = getFeatureAllocations(feature.id);
    const featureValidation = validateFeatureAllocation(
      feature,
      points,
      featureAllocations,
      sprint.id
    );

    if (!featureValidation.valid) {
      setError(featureValidation.message || 'Feature capacity exceeded');
      setInputValue(currentValue > 0 ? currentValue.toString() : '');
      return;
    }

    // Validate sprint capacity
    const sprintValidation = validateAllocation(
      sprint.id,
      points,
      state.allocations,
      sprint.velocity,
      feature.id
    );

    if (!sprintValidation.valid) {
      setError(sprintValidation.message || 'Sprint capacity exceeded');
      setInputValue(currentValue > 0 ? currentValue.toString() : '');
      return;
    }

    // All validations passed - save allocation
    dispatch({
      type: 'SET_ALLOCATION',
      payload: { featureId: feature.id, sprintId: sprint.id, points },
    });
  };

  // Calculate computed data for styling
  const featureAllocations = getFeatureAllocations(feature.id);
  const totalAllocated = featureAllocations.reduce((sum, a) => sum + a.points, 0);
  const isFeatureOverallocated = totalAllocated > feature.points;

  const sprintData = state.allocations.filter(a => a.sprintId === sprint.id);
  const sprintTotal = sprintData.reduce((sum, a) => sum + a.points, 0);
  const isSprintOverallocated = sprintTotal > sprint.velocity;

  // Determine cell styling
  const getCellClass = () => {
    const baseClass = 'w-20 px-2 py-1.5 text-sm text-center border-2 rounded transition-colors';

    if (error) {
      return `${baseClass} border-status-red bg-status-red/10`;
    }

    if (currentValue > 0) {
      if (isFeatureOverallocated || isSprintOverallocated) {
        return `${baseClass} border-status-orange bg-status-orange/10 text-status-orange font-medium`;
      }
      return `${baseClass} border-planner-blue bg-planner-blue/10 text-planner-blue font-medium`;
    }

    if (isEditing) {
      return `${baseClass} border-planner-blue bg-white`;
    }

    return `${baseClass} border-planner-gray-border bg-white text-planner-gray-text hover:border-planner-blue/50`;
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={getCellClass()}
        placeholder="0"
        title={error || `Allocate points from ${feature.name} to Sprint ${sprint.number}`}
      />
      {error && (
        <div className="absolute z-10 mt-1 px-2 py-1 bg-red-600 text-white text-xs rounded shadow-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
