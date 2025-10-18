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
 * Migrate entire app state
 */
export function migrateAppState(state: any): AppState {
  const defaultVelocity = state.config?.velocity || 100;

  return {
    ...state,
    epics: migrateEpics(state.epics || []),
    features: migrateFeatures(state.features || []),
    sprints: migrateSprints(state.sprints || [], defaultVelocity),
  };
}
