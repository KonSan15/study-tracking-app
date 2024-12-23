// components/Progress/SubjectProgress.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SubjectForm } from './SubjectForm';
import { useSubjectManager } from '../../hooks/useSubjectManager';

export const SubjectProgressView = () => {
  const { subjects, loading, error, getSubjectStats } = useSubjectManager();
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Subject Progress</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Subject
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <SubjectForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject.name);
          return (
            <div
              key={subject.name}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">{subject.name}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Level {stats.level}</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {stats.experienceToNextLevel} XP to next level
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No subjects added yet</p>
        </div>
      )}
    </div>
  );
};