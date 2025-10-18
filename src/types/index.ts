// Core type definitions for Epic Estimator

export type TShirtSize = 'S' | 'M' | 'L';
export type Priority = 'High' | 'Medium' | 'Low';
export type FeatureStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Complete';

export interface Epic {
  id: string;
  name: string;
  priority: Priority;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface StatusHistoryEntry {
  status: FeatureStatus;
  timestamp: number;
  notes: string;
}

export interface Feature {
  id: string;
  epicId: string;
  name: string;
  size: TShirtSize;
  points: number; // Derived from size, but stored for consistency
  priority: Priority;
  sortOrder: number;
  status: FeatureStatus;

  // Tracking fields
  estimatedCompletionSprint: number | null; // Calculated from allocations
  actualCompletionSprint: number | null;
  actualPoints: number | null; // null = use estimated points
  notes: string;
  blockers: string[];

  statusHistory: StatusHistoryEntry[];
  createdAt: number;
}

export interface Sprint {
  id: string;
  number: number; // 1-indexed
  startDate: Date; // Always Tuesday
  endDate: Date;   // Always Monday (10 days later)
  velocity: number; // Story points capacity
}

export interface Allocation {
  featureId: string;
  sprintId: string;
  points: number; // Portion of feature allocated to this sprint
}

export interface ProjectConfig {
  velocity: number;        // Default: 100 points per sprint
  numSprints: number;      // Default: 10
  firstSprintStart: Date;  // Default: next Tuesday
}

export interface AppState {
  config: ProjectConfig;
  epics: Epic[];
  features: Feature[];
  sprints: Sprint[];
  allocations: Allocation[];
  selectedEpicId: string | null;
}

// Computed values (calculated on-the-fly, not stored)
export interface ComputedFeatureData {
  totalAllocated: number;
  remainingPoints: number;
  completionSprint: number | null; // Sprint where feature reaches 100%
  variance: number | null; // actualCompletionSprint - estimatedCompletionSprint
}

export interface ComputedSprintData {
  totalAllocated: number;
  remainingCapacity: number;
  utilizationPercent: number;
  completingFeatures: Feature[]; // Features that finish in this sprint
  isOverallocated: boolean;
}

export interface ComputedEpicData {
  totalPoints: number;
  featureCount: number;
  completionSprint: number | null; // Max of all feature completion sprints
  completedFeatureCount: number;
  progressPercent: number;
  overallVariance: number | null; // For completed epics
}

// Reducer actions
export type Action =
  // Epic actions
  | { type: 'ADD_EPIC'; payload: { name: string; priority?: Priority } }
  | { type: 'UPDATE_EPIC'; payload: { id: string; name: string } }
  | { type: 'UPDATE_EPIC_PRIORITY'; payload: { id: string; priority: Priority } }
  | { type: 'DELETE_EPIC'; payload: { id: string } }
  | { type: 'REORDER_EPICS'; payload: { epicIds: string[] } }

  // Feature actions
  | { type: 'ADD_FEATURE'; payload: { epicId: string; name: string; size: TShirtSize; priority: Priority } }
  | { type: 'UPDATE_FEATURE'; payload: { id: string; updates: Partial<Feature> } }
  | { type: 'DELETE_FEATURE'; payload: { id: string } }
  | { type: 'REORDER_FEATURES'; payload: { epicId: string; featureIds: string[] } }

  // Allocation actions
  | { type: 'SET_ALLOCATION'; payload: { featureId: string; sprintId: string; points: number } }
  | { type: 'CLEAR_ALLOCATION'; payload: { featureId: string; sprintId: string } }
  | { type: 'CLEAR_FEATURE_ALLOCATIONS'; payload: { featureId: string } }

  // Sprint configuration
  | { type: 'UPDATE_CONFIG'; payload: Partial<ProjectConfig> }
  | { type: 'REGENERATE_SPRINTS' } // Recalculate all sprint dates
  | { type: 'UPDATE_SPRINT_VELOCITY'; payload: { sprintId: string; velocity: number } }

  // Tracking actions
  | { type: 'UPDATE_FEATURE_STATUS'; payload: { featureId: string; status: FeatureStatus; notes?: string } }
  | { type: 'MARK_FEATURE_COMPLETE'; payload: { featureId: string; actualSprint: number; actualPoints?: number; notes?: string } }

  // UI actions
  | { type: 'SELECT_EPIC'; payload: { epicId: string | null } }

  // Data management
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_STATE' }
  | { type: 'IMPORT_DATA'; payload: AppState };
