import { createContext, useContext } from 'react';
import { AppState, Action, Feature, Allocation, ComputedFeatureData, ComputedSprintData, ComputedEpicData } from '../types';

export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;

  // Selector functions (computed values)
  getEpicFeatures: (epicId: string) => Feature[];
  getFeatureAllocations: (featureId: string) => Allocation[];
  getSprintAllocations: (sprintId: string) => Allocation[];
  computeFeatureData: (featureId: string) => ComputedFeatureData | null;
  computeSprintData: (sprintId: string) => ComputedSprintData | null;
  computeEpicData: (epicId: string) => ComputedEpicData | null;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Hook to access the app context
 * Must be used within AppProvider
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
