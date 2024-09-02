import React, { useState, useEffect } from 'react';
import { MealTime } from '../hooks/useRecipes';
import { exportData, importData } from '../utils/dataUtils';

interface Props {
  enabledMeals: MealTime[];
  onToggleMeal: (meal: MealTime) => void;
  onClose: () => void;
  allowReset: boolean;
  onAllowResetChange: (allow: boolean) => void;
  onDataImport: () => void;
}

export default function Settings({ enabledMeals, onToggleMeal, onClose, allowReset, onAllowResetChange, onDataImport }: Props) {
  const allMeals: MealTime[] = ['breakfast', 'lunch', 'dinner'];

  const handleSave = () => {
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
                  checked={enabledMeals.includes(meal)}
                  onChange={() => onToggleMeal(meal)}
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
                checked={allowReset}
                onChange={(e) => onAllowResetChange(e.target.checked)}
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
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="modal-button primary-button">save</button>
          <button onClick={onClose} className="modal-button secondary-button">cancel</button>
        </div>
      </div>
    </div>
  );
}