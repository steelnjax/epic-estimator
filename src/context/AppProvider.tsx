import { ReactNode, useReducer, useMemo, useEffect, useCallback } from 'react';
import { AppContext } from './AppContext';
import { appReducer } from './AppReducer';
import { AppState } from '../types';
import { DEFAULT_VELOCITY, DEFAULT_NUM_SPRINTS, STORAGE_KEY } from '../constants';
import { generateSprints } from '../utils/dateUtils';
import { computeFeatureData as calcFeatureData, computeSprintData as calcSprintData, computeEpicData as calcEpicData } from '../utils/calculations';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Creates the initial application state
 */
function createInitialState(): AppState {
  const firstSprintStart = new Date();

  return {
    config: {
      velocity: DEFAULT_VELOCITY,
      numSprints: DEFAULT_NUM_SPRINTS,
      firstSprintStart,
    },
    epics: [],
    features: [],
    sprints: generateSprints(DEFAULT_NUM_SPRINTS, firstSprintStart, DEFAULT_VELOCITY),
    allocations: [],
    selectedEpicId: null,
  };
}

/**
 * Loads state from localStorage
 */
function loadState(): AppState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Convert date strings back to Date objects
    return {
      ...parsed,
      config: {
        ...parsed.config,
        firstSprintStart: new Date(parsed.config.firstSprintStart),
      },
      sprints: parsed.sprints.map((sprint: any) => ({
        ...sprint,
        startDate: new Date(sprint.startDate),
        endDate: new Date(sprint.endDate),
      })),
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Saves state to localStorage
 */
function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * App state provider with context and localStorage persistence
 */
export function AppProvider({ children }: AppProviderProps) {
  // Load initial state from localStorage or create new
  const initialState = useMemo(() => loadState() || createInitialState(), []);
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Selector functions (memoized)
  const getEpicFeatures = useCallback(
    (epicId: string) => state.features.filter(f => f.epicId === epicId),
    [state.features]
  );

  const getFeatureAllocations = useCallback(
    (featureId: string) => state.allocations.filter(a => a.featureId === featureId),
    [state.allocations]
  );

  const getSprintAllocations = useCallback(
    (sprintId: string) => state.allocations.filter(a => a.sprintId === sprintId),
    [state.allocations]
  );

  const computeFeatureData = useCallback(
    (featureId: string) => {
      const feature = state.features.find(f => f.id === featureId);
      if (!feature) return null;

      const allocations = getFeatureAllocations(featureId);
      return calcFeatureData(feature, allocations, state.sprints);
    },
    [state.features, state.sprints, getFeatureAllocations]
  );

  const computeSprintData = useCallback(
    (sprintId: string) => {
      const sprint = state.sprints.find(s => s.id === sprintId);
      if (!sprint) return null;

      const allocations = getSprintAllocations(sprintId);
      return calcSprintData(sprint, allocations, state.features, state.allocations, state.sprints);
    },
    [state.sprints, state.features, state.allocations, getSprintAllocations]
  );

  const computeEpicData = useCallback(
    (epicId: string) => {
      return calcEpicData(epicId, state.features, state.allocations, state.sprints);
    },
    [state.features, state.allocations, state.sprints]
  );

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      getEpicFeatures,
      getFeatureAllocations,
      getSprintAllocations,
      computeFeatureData,
      computeSprintData,
      computeEpicData,
    }),
    [
      state,
      dispatch,
      getEpicFeatures,
      getFeatureAllocations,
      getSprintAllocations,
      computeFeatureData,
      computeSprintData,
      computeEpicData,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
