// components/Tasks/TaskMenu.jsx
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, BookOpen } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { useTaskManager } from '../../hooks/useTaskManager';
import { useSubjectManager } from '../../hooks/useSubjectManager';

export const TaskMenu = ({ task }) => {
  const { updateTask, deleteTask } = useTaskManager();
  const { subjects } = useSubjectManager();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.text);
  const [newSubject, setNewSubject] = useState(task.subject);
  const [error, setError] = useState('');

  const handleRename = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTaskName.trim()) {
      setError('Task name cannot be empty');
      return;
    }

    try {
      await updateTask(task.id, { text: newTaskName.trim() });
      setShowRenameDialog(false);
      
    } catch (err) {
      setError('Failed to rename task');
    }
  };

  const handleSubjectChange = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await updateTask(task.id, { subject: newSubject });
      setShowSubjectDialog(false);
    } catch (err) {
      setError('Failed to update subject');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="focus:outline-none">
            <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="min-w-[220px] bg-white rounded-md p-1 shadow-lg border border-gray-200 z-50"
            sideOffset={5}
            align="end"
          >
            <DropdownMenu.Item 
              className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer outline-none"
              onSelect={() => setShowRenameDialog(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenu.Item>

            <DropdownMenu.Item 
              className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer outline-none"
              onSelect={() => setShowSubjectDialog(true)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Change Subject
            </DropdownMenu.Item>

            <DropdownMenu.Item 
              className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer outline-none"
              onSelect={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Rename Dialog */}
      <Dialog.Root open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl z-50">
            <Dialog.Title className="text-lg font-medium mb-4">
              Rename Task
            </Dialog.Title>
            
            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
                  Task Name
                </label>
                <input
                  type="text"
                  id="taskName"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRenameDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Change Subject Dialog */}
      <Dialog.Root open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl z-50">
            <Dialog.Title className="text-lg font-medium mb-4">
              Change Subject
            </Dialog.Title>
            
            <form onSubmit={handleSubjectChange} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {subjects.map(subject => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};