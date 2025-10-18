import { Feature, Sprint, Allocation, ComputedFeatureData, ComputedSprintData, ComputedEpicData } from '../types';

/**
 * Calculates which sprint a feature will complete in based on allocations
 * @param feature - The feature to check
 * @param allocations - All allocations for this feature
 * @param sprints - All sprints (sorted by number)
 * @returns Sprint number where feature reaches 100%, or null if not fully allocated
 */
export function calculateCompletionSprint(
  feature: Feature,
  allocations: Allocation[],
  sprints: Sprint[]
): number | null {
  const sortedSprints = [...sprints].sort((a, b) => a.number - b.number);
  let cumulativePoints = 0;

  for (const sprint of sortedSprints) {
    const allocation = allocations.find(
      a => a.featureId === feature.id && a.sprintId === sprint.id
    );

    if (allocation) {
      cumulativePoints += allocation.points;
    }

    if (cumulativePoints >= feature.points) {
      return sprint.number;
    }
  }

  return null; // Feature not fully allocated
}

/**
 * Calculates variance between actual and estimated completion
 * @param feature - The feature to check
 * @returns Positive = late, Negative = early, null if incomplete
 */
export function calculateVariance(feature: Feature): number | null {
  if (!feature.actualCompletionSprint || !feature.estimatedCompletionSprint) {
    return null;
  }

  return feature.actualCompletionSprint - feature.estimatedCompletionSprint;
}

/**
 * Computes data for a feature based on allocations
 * @param feature - The feature to compute
 * @param allocations - All allocations for this feature
 * @param sprints - All sprints
 * @returns Computed feature data
 */
export function computeFeatureData(
  feature: Feature,
  allocations: Allocation[],
  sprints: Sprint[]
): ComputedFeatureData {
  const totalAllocated = allocations
    .filter(a => a.featureId === feature.id)
    .reduce((sum, a) => sum + a.points, 0);

  const remainingPoints = Math.max(0, feature.points - totalAllocated);
  const completionSprint = calculateCompletionSprint(feature, allocations, sprints);
  const variance = calculateVariance(feature);

  return {
    totalAllocated,
    remainingPoints,
    completionSprint,
    variance,
  };
}

/**
 * Computes data for a sprint based on allocations
 * @param sprint - The sprint to compute
 * @param allocations - All allocations for this sprint
 * @param features - All features
 * @param allAllocations - All allocations (to determine completing features)
 * @param sprints - All sprints
 * @returns Computed sprint data
 */
export function computeSprintData(
  sprint: Sprint,
  allocations: Allocation[],
  features: Feature[],
  allAllocations: Allocation[],
  sprints: Sprint[]
): ComputedSprintData {
  const totalAllocated = allocations
    .filter(a => a.sprintId === sprint.id)
    .reduce((sum, a) => sum + a.points, 0);

  const remainingCapacity = Math.max(0, sprint.velocity - totalAllocated);
  const utilizationPercent = (totalAllocated / sprint.velocity) * 100;
  const isOverallocated = totalAllocated > sprint.velocity;

  // Find features that complete in this sprint
  const completingFeatures = features.filter(feature => {
    const featureAllocations = allAllocations.filter(a => a.featureId === feature.id);
    const completionSprint = calculateCompletionSprint(feature, featureAllocations, sprints);
    return completionSprint === sprint.number;
  });

  return {
    totalAllocated,
    remainingCapacity,
    utilizationPercent,
    completingFeatures,
    isOverallocated,
  };
}

/**
 * Computes data for an epic based on its features
 * @param epic - The epic to compute
 * @param features - All features belonging to this epic
 * @param allocations - All allocations
 * @param sprints - All sprints
 * @returns Computed epic data
 */
export function computeEpicData(
  epicId: string,
  features: Feature[],
  allocations: Allocation[],
  sprints: Sprint[]
): ComputedEpicData {
  const epicFeatures = features.filter(f => f.epicId === epicId);

  const totalPoints = epicFeatures.reduce((sum, f) => sum + f.points, 0);
  const featureCount = epicFeatures.length;
  const completedFeatureCount = epicFeatures.filter(f => f.status === 'Complete').length;
  const progressPercent = featureCount > 0 ? (completedFeatureCount / featureCount) * 100 : 0;

  // Find the maximum completion sprint across all features
  let completionSprint: number | null = null;
  for (const feature of epicFeatures) {
    const featureAllocations = allocations.filter(a => a.featureId === feature.id);
    const sprint = calculateCompletionSprint(feature, featureAllocations, sprints);
    if (sprint !== null && (completionSprint === null || sprint > completionSprint)) {
      completionSprint = sprint;
    }
  }

  // Calculate overall variance for completed epics
  let overallVariance: number | null = null;
  const completedFeatures = epicFeatures.filter(f => f.status === 'Complete');
  if (completedFeatures.length > 0) {
    const totalVariance = completedFeatures.reduce((sum, f) => {
      const variance = calculateVariance(f);
      return sum + (variance || 0);
    }, 0);
    overallVariance = totalVariance / completedFeatures.length;
  }

  return {
    totalPoints,
    featureCount,
    completionSprint,
    completedFeatureCount,
    progressPercent,
    overallVariance,
  };
}
