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

// Color scheme constants
export const PRIORITY_COLORS = {
  High: 'text-red-600 bg-red-50',
  Medium: 'text-yellow-600 bg-yellow-50',
  Low: 'text-green-600 bg-green-50',
};

export const STATUS_COLORS = {
  'Not Started': 'text-gray-600 bg-gray-50',
  'In Progress': 'text-blue-600 bg-blue-50',
  Blocked: 'text-red-600 bg-red-50',
  Complete: 'text-green-600 bg-green-50',
};

export const SIZE_COLORS = {
  S: 'text-blue-700 bg-blue-100',
  M: 'text-teal-700 bg-teal-100',
  L: 'text-indigo-700 bg-indigo-100',
};
