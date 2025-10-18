import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppContext } from '../../context/AppContext';
import { SortableFeatureRow } from './SortableFeatureRow';
import { sortFeatures } from '../../utils/sorting';

export function FeatureList() {
  const { state, getEpicFeatures, dispatch } = useAppContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const sortedFeatures = sortFeatures(features);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedFeatures.findIndex(feature => feature.id === active.id);
      const newIndex = sortedFeatures.findIndex(feature => feature.id === over.id);

      const reorderedFeatures = arrayMove(sortedFeatures, oldIndex, newIndex);
      const featureIds = reorderedFeatures.map(feature => feature.id);

      dispatch({
        type: 'REORDER_FEATURES',
        payload: { epicId: state.selectedEpicId!, featureIds }
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedFeatures.map(feature => feature.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sortedFeatures.map(feature => (
            <SortableFeatureRow key={feature.id} feature={feature} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
