import React, { useState, useEffect } from 'react';
import { MealTime } from '../hooks/useRecipes';
import { exportData, importData } from '../utils/dataUtils';
import { getCategories, saveCategories } from '../utils/ingredientCategories';

interface Props {
  enabledMeals: MealTime[];
  onSaveSettings: (newEnabledMeals: MealTime[], newAllowReset: boolean) => void;
  onClose: () => void;
  allowReset: boolean;
  onDataImport: () => void;
}

export default function Settings({ enabledMeals, onSaveSettings, onClose, allowReset, onDataImport }: Props) {
  const allMeals: MealTime[] = ['breakfast', 'lunch', 'dinner'];
  const [tempEnabledMeals, setTempEnabledMeals] = useState<MealTime[]>(enabledMeals);
  const [tempAllowReset, setTempAllowReset] = useState(allowReset);
  const [categories, setCategories] = useState<Record<string, string[]>>(getCategories());
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const handleToggleMeal = (meal: MealTime) => {
    setTempEnabledMeals(prev =>
      prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]
    );
  };

  const handleSave = () => {
    onSaveSettings(tempEnabledMeals, tempAllowReset);
    saveCategories(categories);
    onClose();
  };

  const handleExport = async () => {
    await exportData();
  };

  const handleImport = async () => {
    const confirmImport = window.confirm(
      "Importing data will overwrite all existing recipes and weekly ingredients. Are you sure you want to proceed?"
    );
    if (confirmImport) {
      const success = await importData();
      if (success) {
        onDataImport();
        onClose();
      }
    }
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && !categories[newCategory]) {
      setCategories({ ...categories, [newCategory]: [] });
    }
  };

  const handleRemoveCategory = (category: string) => {
    if (window.confirm(`Are you sure you want to remove the "${category}" category?`)) {
      const { [category]: _, ...rest } = categories;
      setCategories(rest);
    }
  };

  const handleAddKeyword = (category: string) => {
    const newKeyword = prompt(`Enter new keyword for ${category}:`);
    if (newKeyword) {
      setCategories({
        ...categories,
        [category]: [...categories[category], newKeyword],
      });
    }
  };

  const handleRemoveKeyword = (category: string, keyword: string) => {
    setCategories({
      ...categories,
      [category]: categories[category].filter((k) => k !== keyword),
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="modal settings-modal">
      <div className="modal-content settings-content">
        <div className="modal-header">
          <h2>settings</h2>
        </div>
        <div className="modal-body">
          <h3>meal preferences</h3>
          <div className="meal-time-checkboxes two-column">
            {allMeals.map((meal) => (
              <label key={meal} className="meal-time-filter">
                <input
                  type="checkbox"
                  checked={tempEnabledMeals.includes(meal)}
                  onChange={() => handleToggleMeal(meal)}
                />
                {meal}
              </label>
            ))}
          </div>
          <h3>misc. settings</h3>
          <div className="allow-reset-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={tempAllowReset}
                onChange={(e) => setTempAllowReset(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span>allow reset to default recipes</span>
          </div>
          <div className="data-management">
            <h3>data management</h3>
            <button onClick={handleExport} className="modal-button secondary-button">export data</button>
            <button onClick={handleImport} className="modal-button secondary-button">import data</button>
          </div>
          <h3>ingredient categories</h3>
          <div className="category-management">
            {Object.entries(categories).map(([category, keywords]) => (
              <div key={category} className="category-item">
                <div className="category-header" onClick={() => toggleCategory(category)}>
                  <h4>{category}</h4>
                  <span>{expandedCategories[category] ? '▼' : '▶'}</span>
                </div>
                {expandedCategories[category] && (
                  <>
                    <button onClick={() => handleRemoveCategory(category)}>Remove Category</button>
                    <ul>
                      {keywords.map((keyword) => (
                        <li key={keyword}>
                          {keyword}
                          <button onClick={() => handleRemoveKeyword(category, keyword)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleAddKeyword(category)}>Add Keyword</button>
                  </>
                )}
              </div>
            ))}
            <button className='modal-button secondary-button' onClick={handleAddCategory}>Add Category</button>
          </div>
        </div>
        <div>
            <h3>credits</h3>
            <p>Created with <a href="https://cursor.com">Cursor</a></p>
            <p>Inspired by Mary Walsh, Monica Walsh, and the <a href="https://www.youtube.com/@AIForHumansShow">AI4Humans Podcast</a></p>
        </div>
        <div>
          <p>Version 1.1</p>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="modal-button primary-button">save</button>
          <button onClick={onClose} className="modal-button secondary-button">cancel</button>
        </div>
      </div>
    </div>
  );
}