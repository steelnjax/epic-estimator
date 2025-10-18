import { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';

export function AddEpicForm() {
  const { dispatch } = useAppContext();
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch({ type: 'ADD_EPIC', payload: { name: name.trim() } });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="New epic name..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:outline-2 focus:outline-blue-500 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
