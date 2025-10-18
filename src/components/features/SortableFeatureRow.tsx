import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Feature } from '../../types';
import { FeatureRow } from './FeatureRow';

interface SortableFeatureRowProps {
  feature: Feature;
}

export function SortableFeatureRow({ feature }: SortableFeatureRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        {/* Drag handle - small area on the left side */}
        <div
          ref={setActivatorNodeRef}
          {...listeners}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-grab active:cursor-grabbing hover:bg-planner-blue/30 transition-colors z-10"
          title="Drag to reorder"
        />
        <FeatureRow feature={feature} />
      </div>
    </div>
  );
}
