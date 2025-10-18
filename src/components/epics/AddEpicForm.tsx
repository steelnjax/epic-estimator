import { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Priority } from '../../types';

export function AddEpicForm() {
  const { dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch({ type: 'ADD_EPIC', payload: { name: name.trim(), priority } });
    setName('');
    setPriority('Medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 pb-4 border-b border-planner-gray-border">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="New epic name..."
        className="w-full px-3 py-2 border border-planner-gray-border rounded text-sm focus:outline-none focus:border-planner-blue"
      />
      <div className="flex gap-2">
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          className="flex-1 px-3 py-2 border border-planner-gray-border rounded text-sm focus:outline-none focus:border-planner-blue"
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-planner-blue text-white text-sm font-medium rounded hover:bg-planner-blue-hover focus:outline-none focus:ring-2 focus:ring-planner-blue/50 transition-colors"
        >
          Add Epic
        </button>
      </div>
    </form>
  );
}
