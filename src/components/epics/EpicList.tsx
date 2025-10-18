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
import { SortableEpicCard } from './SortableEpicCard';
import { sortEpics } from '../../utils/sorting';

export function EpicList() {
  const { state, dispatch } = useAppContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (state.epics.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">No epics yet</p>
        <p className="text-xs mt-1">Add your first epic below</p>
      </div>
    );
  }

  const sortedEpics = sortEpics(state.epics);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedEpics.findIndex(epic => epic.id === active.id);
      const newIndex = sortedEpics.findIndex(epic => epic.id === over.id);

      const reorderedEpics = arrayMove(sortedEpics, oldIndex, newIndex);
      const epicIds = reorderedEpics.map(epic => epic.id);

      dispatch({ type: 'REORDER_EPICS', payload: { epicIds } });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedEpics.map(epic => epic.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sortedEpics.map(epic => (
            <SortableEpicCard key={epic.id} epic={epic} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
