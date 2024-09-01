import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: (recipe: { url: string; difficulty: number }) => void;
}

export default function RecipeInput({ onClose, onSubmit }: Props) {
  const [url, setUrl] = useState('');
  const [difficulty, setDifficulty] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ url, difficulty });
    setUrl('');
    setDifficulty(1);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          max="10"
          value={difficulty}
          onChange={e => setDifficulty(Number(e.target.value))}
          required
        />
        <button type="submit">Add Recipe</button>
      </form>
      <div className="modal-footer">
        <button type="submit">Add Recipe</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}