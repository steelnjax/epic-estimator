import { AppState, Action, Feature } from '../types';
import { SIZE_TO_POINTS } from '../constants';
import { generateSprints } from '../utils/dateUtils';
import { calculateCompletionSprint } from '../utils/calculations';

/**
 * Main reducer for application state management
 */
export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // Epic actions
    case 'ADD_EPIC': {
      const newEpic = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        ...state,
        epics: [...state.epics, newEpic],
      };
    }

    case 'UPDATE_EPIC': {
      return {
        ...state,
        epics: state.epics.map(epic =>
          epic.id === action.payload.id
            ? { ...epic, name: action.payload.name, updatedAt: Date.now() }
            : epic
        ),
      };
    }

    case 'DELETE_EPIC': {
      // Also delete all features belonging to this epic
      const featureIds = state.features
        .filter(f => f.epicId === action.payload.id)
        .map(f => f.id);

      return {
        ...state,
        epics: state.epics.filter(epic => epic.id !== action.payload.id),
        features: state.features.filter(f => f.epicId !== action.payload.id),
        allocations: state.allocations.filter(a => !featureIds.includes(a.featureId)),
        selectedEpicId: state.selectedEpicId === action.payload.id ? null : state.selectedEpicId,
      };
    }

    // Feature actions
    case 'ADD_FEATURE': {
      const newFeature: Feature = {
        id: crypto.randomUUID(),
        epicId: action.payload.epicId,
        name: action.payload.name,
        size: action.payload.size,
        points: SIZE_TO_POINTS[action.payload.size],
        priority: action.payload.priority,
        status: 'Not Started',
        estimatedCompletionSprint: null,
        actualCompletionSprint: null,
        actualPoints: null,
        notes: '',
        blockers: [],
        statusHistory: [
          {
            status: 'Not Started',
            timestamp: Date.now(),
            notes: 'Feature created',
          },
        ],
        createdAt: Date.now(),
      };

      return {
        ...state,
        features: [...state.features, newFeature],
        epics: state.epics.map(epic =>
          epic.id === action.payload.epicId
            ? { ...epic, updatedAt: Date.now() }
            : epic
        ),
      };
    }

    case 'UPDATE_FEATURE': {
      return {
        ...state,
        features: state.features.map(feature =>
          feature.id === action.payload.id
            ? { ...feature, ...action.payload.updates }
            : feature
        ),
      };
    }

    case 'DELETE_FEATURE': {
      return {
        ...state,
        features: state.features.filter(f => f.id !== action.payload.id),
        allocations: state.allocations.filter(a => a.featureId !== action.payload.id),
      };
    }

    case 'REORDER_FEATURES': {
      // This is a simplified reorder - in a real app, you might want to add a sortOrder field
      return state;
    }

    // Allocation actions
    case 'SET_ALLOCATION': {
      const { featureId, sprintId, points } = action.payload;

      // Check if allocation already exists
      const existingIndex = state.allocations.findIndex(
        a => a.featureId === featureId && a.sprintId === sprintId
      );

      let newAllocations;
      if (points === 0) {
        // Remove allocation if points is 0
        newAllocations = state.allocations.filter(
          a => !(a.featureId === featureId && a.sprintId === sprintId)
        );
      } else if (existingIndex >= 0) {
        // Update existing allocation
        newAllocations = state.allocations.map((a, index) =>
          index === existingIndex ? { ...a, points } : a
        );
      } else {
        // Add new allocation
        newAllocations = [...state.allocations, { featureId, sprintId, points }];
      }

      // Recalculate completion sprint for the feature
      const feature = state.features.find(f => f.id === featureId);
      const featureAllocations = newAllocations.filter(a => a.featureId === featureId);
      const completionSprint = feature
        ? calculateCompletionSprint(feature, featureAllocations, state.sprints)
        : null;

      return {
        ...state,
        allocations: newAllocations,
        features: state.features.map(f =>
          f.id === featureId
            ? { ...f, estimatedCompletionSprint: completionSprint }
            : f
        ),
      };
    }

    case 'CLEAR_ALLOCATION': {
      return {
        ...state,
        allocations: state.allocations.filter(
          a => !(a.featureId === action.payload.featureId && a.sprintId === action.payload.sprintId)
        ),
      };
    }

    case 'CLEAR_FEATURE_ALLOCATIONS': {
      return {
        ...state,
        allocations: state.allocations.filter(a => a.featureId !== action.payload.featureId),
        features: state.features.map(f =>
          f.id === action.payload.featureId
            ? { ...f, estimatedCompletionSprint: null }
            : f
        ),
      };
    }

    // Sprint configuration
    case 'UPDATE_CONFIG': {
      const newConfig = { ...state.config, ...action.payload };
      return {
        ...state,
        config: newConfig,
      };
    }

    case 'REGENERATE_SPRINTS': {
      const newSprints = generateSprints(
        state.config.numSprints,
        state.config.firstSprintStart,
        state.config.velocity
      );

      // Recalculate all feature completion sprints
      const updatedFeatures = state.features.map(feature => {
        const featureAllocations = state.allocations.filter(a => a.featureId === feature.id);
        const completionSprint = calculateCompletionSprint(feature, featureAllocations, newSprints);
        return { ...feature, estimatedCompletionSprint: completionSprint };
      });

      return {
        ...state,
        sprints: newSprints,
        features: updatedFeatures,
      };
    }

    // Tracking actions
    case 'UPDATE_FEATURE_STATUS': {
      const { featureId, status, notes = '' } = action.payload;

      return {
        ...state,
        features: state.features.map(feature =>
          feature.id === featureId
            ? {
                ...feature,
                status,
                statusHistory: [
                  ...feature.statusHistory,
                  {
                    status,
                    timestamp: Date.now(),
                    notes,
                  },
                ],
              }
            : feature
        ),
      };
    }

    case 'MARK_FEATURE_COMPLETE': {
      const { featureId, actualSprint, actualPoints, notes = '' } = action.payload;

      return {
        ...state,
        features: state.features.map(feature =>
          feature.id === featureId
            ? {
                ...feature,
                status: 'Complete',
                actualCompletionSprint: actualSprint,
                actualPoints: actualPoints ?? feature.points,
                notes: notes,
                statusHistory: [
                  ...feature.statusHistory,
                  {
                    status: 'Complete',
                    timestamp: Date.now(),
                    notes: `Completed in Sprint ${actualSprint}. ${notes}`,
                  },
                ],
              }
            : feature
        ),
      };
    }

    // UI actions
    case 'SELECT_EPIC': {
      return {
        ...state,
        selectedEpicId: action.payload.epicId,
      };
    }

    // Data management
    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'RESET_STATE': {
      // Will be implemented in AppProvider with initial state
      return state;
    }

    case 'IMPORT_DATA': {
      return action.payload;
    }

    default:
      return state;
  }
}
