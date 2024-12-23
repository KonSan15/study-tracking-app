// components/SubjectManagement/SubjectManagement.jsx
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const SubjectManagement = ({ subjects, onAddSubject, onRemoveSubject }) => {
  const [newSubject, setNewSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      onAddSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Manage Subjects</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Add new subject"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {subjects.map(subject => (
          <div 
            key={subject}
            className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{subject}</span>
            <button
              onClick={() => onRemoveSubject(subject)}
              className="hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectManagement;