// components/Tasks/TaskForm.jsx
import React, { useState } from 'react';
import { useTaskManager } from '../../hooks/useTaskManager';
import { useSubjectManager } from '../../hooks/useSubjectManager';

export const TaskForm = () => {
  const { addTask } = useTaskManager();
  const { subjects } = useSubjectManager();
  const [taskData, setTaskData] = useState({
    text: '',
    subject: '',
    requiresReview: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!taskData.text.trim()) {
      setError('Task description is required');
      return;
    }

    if (!taskData.subject) {
      setError('Please select a subject');
      return;
    }

    try {
      await addTask(taskData);
      setTaskData({
        text: '',
        subject: '',
        requiresReview: false
      });
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-gray-50 rounded-lg px-4 py-5 sm:p-6 mb-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Task</h3>
          <p className="mt-1 text-sm text-gray-600">
            Create a new study task with optional review.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">
                    {error}
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                  Task Description
                </label>
                <input
                  id="text"
                  name="text"
                  type="text"
                  value={taskData.text}
                  onChange={handleChange}
                  placeholder="What do you need to study?"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={taskData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.name} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="requiresReview"
                  name="requiresReview"
                  type="checkbox"
                  checked={taskData.requiresReview}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="requiresReview" className="ml-2 block text-sm text-gray-700">
                  Requires review
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};