import { Epic, Feature, Priority } from '../types';

/**
 * Priority ranking for sorting (High = 0, Medium = 1, Low = 2)
 */
const PRIORITY_RANK: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

/**
 * Infer priority based on position in list
 * Top 1/3 = High, Middle 1/3 = Medium, Bottom 1/3 = Low
 */
export function inferPriorityFromPosition(index: number, totalCount: number): Priority {
  if (totalCount === 0) return 'Medium';

  const position = index / totalCount;

  if (position < 1 / 3) {
    return 'High';
  } else if (position < 2 / 3) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

/**
 * Sort epics by sortOrder (drag-and-drop position), then by priority, then by creation date
 */
export function sortEpics(epics: Epic[]): Epic[] {
  return [...epics].sort((a, b) => {
    // Primary: sort by sortOrder
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    // Secondary: sort by priority
    const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Tertiary: sort by creation date (oldest first)
    return a.createdAt - b.createdAt;
  });
}

/**
 * Sort features by sortOrder (drag-and-drop position), then by priority, then by creation date
 */
export function sortFeatures(features: Feature[]): Feature[] {
  return [...features].sort((a, b) => {
    // Primary: sort by sortOrder
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    // Secondary: sort by priority
    const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Tertiary: sort by creation date (oldest first)
    return a.createdAt - b.createdAt;
  });
}

/**
 * Sort features by priority within their epic
 * Returns a map of epicId → sorted features
 */
export function sortFeaturesWithinEpics(
  epics: Epic[],
  features: Feature[]
): Map<string, Feature[]> {
  const featuresByEpic = new Map<string, Feature[]>();

  // Group features by epic
  features.forEach(feature => {
    const existing = featuresByEpic.get(feature.epicId) || [];
    featuresByEpic.set(feature.epicId, [...existing, feature]);
  });

  // Sort features within each epic
  featuresByEpic.forEach((epicFeatures, epicId) => {
    epicFeatures.sort((a, b) => {
      // Primary: sort by sortOrder
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      // Secondary: sort by priority
      const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Tertiary: sort by creation date
      return a.createdAt - b.createdAt;
    });
  });

  return featuresByEpic;
}

/**
 * Get hierarchically sorted features for matrix view
 * Epics sorted by priority, features sorted by priority within epic
 */
export function getHierarchicallySortedFeatures(
  epics: Epic[],
  features: Feature[]
): Array<{ epic: Epic; feature: Feature }> {
  const sortedEpics = sortEpics(epics);
  const sortedFeaturesByEpic = sortFeaturesWithinEpics(epics, features);

  const result: Array<{ epic: Epic; feature: Feature }> = [];

  sortedEpics.forEach(epic => {
    const epicFeatures = sortedFeaturesByEpic.get(epic.id) || [];
    epicFeatures.forEach(feature => {
      result.push({ epic, feature });
    });
  });

  return result;
}
