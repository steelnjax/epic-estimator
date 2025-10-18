import { useAppContext } from '../../context/AppContext';
import { EpicCard } from './EpicCard';

export function EpicList() {
  const { state } = useAppContext();

  if (state.epics.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">No epics yet</p>
        <p className="text-xs mt-1">Add your first epic below</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {state.epics.map(epic => (
        <EpicCard key={epic.id} epic={epic} />
      ))}
    </div>
  );
}
