// components/Progress/SubjectForm.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSubjectManager } from '../../hooks/useSubjectManager';

export const SubjectForm = ({ onClose }) => {
  const { addSubject } = useSubjectManager();
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subjectName.trim()) {
      setError('Subject name is required');
      return;
    }

    try {
      await addSubject(subjectName.trim());
      setSubjectName('');
      onClose();
    } catch (err) {
      setError('Failed to add subject. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">
            Subject Name
          </label>
          <input
            type="text"
            id="subjectName"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter subject name"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Subject
          </button>
        </div>
      </form>
    </div>
  );
};