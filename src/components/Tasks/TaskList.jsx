// components/Tasks/TaskList.jsx
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskMenu } from './TaskMenu';
import { useTaskManager } from '../../hooks/useTaskManager';

export const TaskList = ({ onDataChange }) => {
  const {
    tasks,
    loading,
    error,
    completeTask,
    collectReward,
    updateTaskReview,
    refreshTasks
  } = useTaskManager();

  const [filter, setFilter] = useState('all');

  // Add effect to refresh tasks when component mounts
  useEffect(() => {
    console.log('TaskList mounted, refreshing tasks');
    refreshTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'review':
        return task.requiresReview && 
               task.nextReviewDate && 
               task.nextReviewDate <= Date.now();
      default:
        return true;
    }
  });

  const canCollectReward = (task) => {
    if (!task.completed || task.rewarded) return false;
    const hoursSinceCompletion = (Date.now() - task.completedAt) / (1000 * 60 * 60);
    return hoursSinceCompletion >= 12;
  };

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
    <div className="flex gap-6">
      {/* Task List Section */}
      <div className="flex-1">
        {/* Filter tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {['all', 'active', 'completed', 'review'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === filterType 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <h3 className="font-medium text-gray-900 mb-1">{task.text}</h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {task.subject}
                    </span>
                    {task.requiresReview && (
                      <div className="flex items-center text-blue-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          Next review: {new Date(task.nextReviewDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TaskMenu task={task} onDataChange={onDataChange} />
                  {!task.completed ? (
                    <button
                      onClick={() => {
                        completeTask(task.id);
                        onDataChange?.();
                      }}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                    >
                      Complete
                    </button>
                  ) : !task.rewarded ? (
                    <button
                      onClick={() => {
                        collectReward(task.id);
                        onDataChange?.();
                      }}
                      disabled={!canCollectReward(task)}
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        canCollectReward(task)
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-1.5" />
                      {canCollectReward(task) ? 'Collect Reward' : 'Wait 12h'}
                    </button>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  
                  {task.requiresReview && task.nextReviewDate <= Date.now() && (
                    <button
                      onClick={() => {
                        updateTaskReview(task.id);
                        onDataChange?.();
                      }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tasks found</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Form Section */}
      <div className="w-96">
        <TaskForm onDataChange={onDataChange} />
      </div>
    </div>
  );
};