import { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import { TShirtSize, Priority } from '../../types';

export function AddFeatureForm() {
  const { state, dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [size, setSize] = useState<TShirtSize>('M');
  const [priority, setPriority] = useState<Priority>('Medium');

  if (!state.selectedEpicId) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch({
      type: 'ADD_FEATURE',
      payload: {
        epicId: state.selectedEpicId,
        name: name.trim(),
        size,
        priority,
      },
    });

    setName('');
    setSize('M');
    setPriority('Medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border-t pt-4">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Feature name..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
      />
      <div className="flex gap-2">
        <select
          value={size}
          onChange={e => setSize(e.target.value as TShirtSize)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="S">Small (30pts)</option>
          <option value="M">Medium (60pts)</option>
          <option value="L">Large (90pts)</option>
        </select>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:outline-2 focus:outline-blue-500 transition-colors"
      >
        Add Feature
      </button>
    </form>
  );
}
