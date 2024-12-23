// components/Tasks/TaskList.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Coins } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskMenu } from './TaskMenu';
import RewardProgress from './RewardProgress';
import RewardAlert from './RewardAlert';
import { useTaskManager } from '../../hooks/useTaskManager';
import { calculateRewardProgress } from '../../config/constants';

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
  const [rewardAlert, setRewardAlert] = useState(null);

  // Organize tasks into categories
  const organizedTasks = tasks.reduce((acc, task) => {
    if (!task.completed) {
      acc.notCompleted.push(task);
    } else if (!task.rewarded) {
      const progress = calculateRewardProgress(task.completedAt);
      if (progress >= 100) {
        acc.readyToCollect.push(task);
      } else {
        acc.waitingForReward.push(task);
      }
    } else {
      acc.fullyCompleted.push(task);
    }
    return acc;
  }, {
    readyToCollect: [],
    notCompleted: [],
    waitingForReward: [],
    fullyCompleted: []
  });

  // Sort each category by most recent first
  organizedTasks.readyToCollect.sort((a, b) => b.completedAt - a.completedAt);
  organizedTasks.notCompleted.sort((a, b) => b.createdAt - a.createdAt);
  organizedTasks.waitingForReward.sort((a, b) => b.completedAt - a.completedAt);
  organizedTasks.fullyCompleted.sort((a, b) => b.completedAt - a.completedAt);

  // Filter tasks based on current filter
  const filterTasks = (taskList) => {
    return taskList.filter(task => {
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
  };

  const handleCollectReward = async (taskId) => {
    try {
      const result = await collectReward(taskId);
      if (result) {
        setRewardAlert({
          task: result.task,
          coins: result.rewardedCoins,
          xp: result.rewardedXP
        });
        
        setTimeout(() => setRewardAlert(null), 3000);
        onDataChange?.();
      }
    } catch (err) {
      console.error('Failed to collect reward:', err);
    }
  };

  const renderTaskGroup = (tasks, groupTitle) => {
    if (tasks.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-3">{groupTitle}</h2>
        <div className="space-y-3">
          {tasks.map(task => (
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
                      onClick={() => completeTask(task.id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                    >
                      Complete
                    </button>
                  ) : !task.rewarded ? (
                    <div className="min-w-[200px]">
                      {calculateRewardProgress(task.completedAt) < 100 ? (
                        <RewardProgress completedAt={task.completedAt} />
                      ) : (
                        <button
                          onClick={() => handleCollectReward(task.id)}
                          className="w-full flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                        >
                          <Coins className="w-4 h-4 mr-1.5" />
                          Collect Reward
                        </button>
                      )}
                    </div>
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
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-6">
      {/* Task List Section */}
      <div className="flex-1">
        {rewardAlert && (
          <RewardAlert
            task={rewardAlert.task}
            xp={rewardAlert.xp}
            coins={rewardAlert.coins}
            onClose={() => setRewardAlert(null)}
          />
        )}

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

        {/* Organized task groups */}
        {renderTaskGroup(filterTasks(organizedTasks.readyToCollect), "Ready to Collect")}
        {renderTaskGroup(filterTasks(organizedTasks.notCompleted), "In Progress")}
        {renderTaskGroup(filterTasks(organizedTasks.waitingForReward), "Waiting for Reward")}
        {renderTaskGroup(filterTasks(organizedTasks.fullyCompleted), "Completed")}

        {/* Empty state */}
        {Object.values(organizedTasks).every(group => filterTasks(group).length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>

      {/* Task Form Section */}
      <div className="w-96">
        <TaskForm onDataChange={onDataChange} />
      </div>
    </div>
  );
};