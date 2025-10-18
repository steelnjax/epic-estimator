import { AppState, Epic, Feature, Sprint } from '../types';

/**
 * Migrate legacy epics to include priority and sortOrder fields
 */
export function migrateEpics(epics: any[]): Epic[] {
  return epics.map((epic, index) => {
    const migrated: any = { ...epic };

    if (!('priority' in migrated)) {
      migrated.priority = 'Medium' as const;
    }

    if (!('sortOrder' in migrated)) {
      migrated.sortOrder = index;
    }

    return migrated;
  });
}

/**
 * Migrate legacy sprints to include velocity field
 */
export function migrateSprints(sprints: any[], defaultVelocity: number): Sprint[] {
  return sprints.map(sprint => {
    const migrated: any = { ...sprint };

    // Add velocity field if missing (for backward compatibility with old data)
    if (!('velocity' in migrated)) {
      migrated.velocity = defaultVelocity;
    }

    return migrated;
  });
}

/**
 * Migrate legacy features to include sortOrder field
 */
export function migrateFeatures(features: any[]): Feature[] {
  // Group features by epic to assign sortOrder within each epic
  const featuresByEpic = new Map<string, any[]>();

  features.forEach(feature => {
    const epicFeatures = featuresByEpic.get(feature.epicId) || [];
    epicFeatures.push(feature);
    featuresByEpic.set(feature.epicId, epicFeatures);
  });

  // Assign sortOrder within each epic
  const migratedFeatures: any[] = [];
  featuresByEpic.forEach(epicFeatures => {
    epicFeatures.forEach((feature, index) => {
      const migrated: any = { ...feature };

      if (!('sortOrder' in migrated)) {
        migrated.sortOrder = index;
      }

      migratedFeatures.push(migrated);
    });
  });

  return migratedFeatures;
}

/**
 * Clean up allocations that reference non-existent sprints or features
 */
export function cleanupAllocations(allocations: any[], sprints: any[], features: any[]): any[] {
  const validSprintIds = new Set(sprints.map((s: any) => s.id));
  const validFeatureIds = new Set(features.map((f: any) => f.id));

  return allocations.filter(allocation => {
    const hasValidSprint = validSprintIds.has(allocation.sprintId);
    const hasValidFeature = validFeatureIds.has(allocation.featureId);

    if (!hasValidSprint || !hasValidFeature) {
      console.warn('Removing orphaned allocation:', allocation);
    }

    return hasValidSprint && hasValidFeature;
  });
}

/**
 * Migrate entire app state
 */
export function migrateAppState(state: any): AppState {
  const defaultVelocity = state.config?.velocity || 100;

  const migratedEpics = migrateEpics(state.epics || []);
  const migratedFeatures = migrateFeatures(state.features || []);
  const migratedSprints = migrateSprints(state.sprints || [], defaultVelocity);
  const cleanedAllocations = cleanupAllocations(
    state.allocations || [],
    migratedSprints,
    migratedFeatures
  );

  return {
    ...state,
    epics: migratedEpics,
    features: migratedFeatures,
    sprints: migratedSprints,
    allocations: cleanedAllocations,
  };
}
