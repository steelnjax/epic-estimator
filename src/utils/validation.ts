import { Allocation, Feature } from '../types';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates if a new allocation would exceed sprint capacity
 * @param sprintId - The sprint to validate
 * @param newPoints - Points to allocate
 * @param currentAllocations - Existing allocations
 * @param velocity - Sprint velocity
 * @param excludeFeatureId - Optional feature ID to exclude (for updates)
 * @returns Validation result with message if invalid
 */
export function validateAllocation(
  sprintId: string,
  newPoints: number,
  currentAllocations: Allocation[],
  velocity: number,
  excludeFeatureId?: string
): ValidationResult {
  const existingPoints = currentAllocations
    .filter(a => a.sprintId === sprintId && (!excludeFeatureId || a.featureId !== excludeFeatureId))
    .reduce((sum, a) => sum + a.points, 0);

  const newTotal = existingPoints + newPoints;

  if (newTotal > velocity) {
    return {
      valid: false,
      message: `Sprint capacity exceeded: ${newTotal}/${velocity} points`,
    };
  }

  return { valid: true };
}

/**
 * Validates if allocation points don't exceed feature's remaining points
 * @param feature - The feature to allocate
 * @param newPoints - Points to allocate
 * @param currentAllocations - Existing allocations for this feature
 * @param excludeSprintId - Optional sprint ID to exclude (for updates)
 * @returns Validation result with message if invalid
 */
export function validateFeatureAllocation(
  feature: Feature,
  newPoints: number,
  currentAllocations: Allocation[],
  excludeSprintId?: string
): ValidationResult {
  const allocatedPoints = currentAllocations
    .filter(a => a.featureId === feature.id && (!excludeSprintId || a.sprintId !== excludeSprintId))
    .reduce((sum, a) => sum + a.points, 0);

  const newTotal = allocatedPoints + newPoints;

  if (newTotal > feature.points) {
    return {
      valid: false,
      message: `Feature capacity exceeded: ${newTotal}/${feature.points} points`,
    };
  }

  return { valid: true };
}

/**
 * Validates that points are a positive number
 * @param points - Points to validate
 * @returns Validation result
 */
export function validatePoints(points: number): ValidationResult {
  if (isNaN(points) || points < 0) {
    return {
      valid: false,
      message: 'Points must be a positive number',
    };
  }

  if (!Number.isInteger(points)) {
    return {
      valid: false,
      message: 'Points must be a whole number',
    };
  }

  return { valid: true };
}
