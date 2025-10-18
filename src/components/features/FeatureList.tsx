import { useAppContext } from '../../context/AppContext';
import { FeatureRow } from './FeatureRow';

export function FeatureList() {
  const { state, getEpicFeatures } = useAppContext();

  if (!state.selectedEpicId) {
    return null;
  }

  const features = getEpicFeatures(state.selectedEpicId);

  if (features.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">No features yet</p>
        <p className="text-xs mt-1">Add your first feature below</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {features.map(feature => (
        <FeatureRow key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
