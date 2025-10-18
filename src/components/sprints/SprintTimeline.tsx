import { useAppContext } from '../../context/AppContext';
import { SprintColumn } from './SprintColumn';

export function SprintTimeline() {
  const { state } = useAppContext();

  if (state.sprints.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">No sprints configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {state.sprints.map(sprint => (
        <SprintColumn key={sprint.id} sprint={sprint} />
      ))}
    </div>
  );
}
