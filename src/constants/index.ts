import { TShirtSize } from '../types';

// T-shirt size to story points mapping
export const SIZE_TO_POINTS: Record<TShirtSize, number> = {
  S: 30,
  M: 60,
  L: 90,
};

// Default project configuration
export const DEFAULT_VELOCITY = 100;
export const DEFAULT_NUM_SPRINTS = 10;
export const SPRINT_DURATION_DAYS = 10;
export const SPRINT_START_DAY = 2; // Tuesday (0 = Sunday, 1 = Monday, 2 = Tuesday)

// localStorage key
export const STORAGE_KEY = 'epic-estimator-state';

// Color scheme constants - Microsoft Planner style
export const PRIORITY_COLORS = {
  High: 'text-status-red bg-status-red/10',
  Medium: 'text-status-orange bg-status-orange/10',
  Low: 'text-status-green bg-status-green/10',
};

export const STATUS_COLORS = {
  'Not Started': 'text-planner-gray-text bg-planner-gray-light',
  'In Progress': 'text-planner-blue bg-planner-blue/10',
  Blocked: 'text-status-red bg-status-red/10',
  Complete: 'text-status-green bg-status-green/10',
};

export const SIZE_COLORS = {
  S: 'text-status-green bg-status-green/10',
  M: 'text-status-orange bg-status-orange/10',
  L: 'text-planner-blue bg-planner-blue/10',
};
