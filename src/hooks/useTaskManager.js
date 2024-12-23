// hooks/useTaskManager.js
import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { REWARD_DELAY_SECONDS } from '../config/constants';

const REWARD_XP = 5;
const REWARD_COINS = 5;

export const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await db.getTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const task = {
        id: Date.now(),
        text: taskData.text,
        subject: taskData.subject,
        completed: false,
        completedAt: null,
        rewarded: false,
        requiresReview: taskData.requiresReview,
        createdAt: Date.now(),
        nextReviewDate: taskData.requiresReview ? Date.now() + (7 * 24 * 60 * 60 * 1000) : null
      };

      await db.addTask(task);
      setTasks(prevTasks => [...prevTasks, task]);
      return task;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    }
  };

  const completeTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        completed: true,
        completedAt: Date.now()
      };

      await db.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to complete task');
      console.error(err);
      throw err;
    }
  };

  const collectReward = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.rewarded) return;

      const secondsSinceCompletion = (Date.now() - task.completedAt) / 1000;
      if (secondsSinceCompletion < REWARD_DELAY_SECONDS) return;

      // Get current user data
      const userData = await db.getUserData();
      const currentCoins = userData?.coins || 0;

      // Update user coins
      await db.updateUserData({
        ...userData,
        coins: currentCoins + REWARD_COINS
      });

      // Get subject data and update XP
      const subjects = await db.getSubjects();
      const subject = subjects.find(s => s.name === task.subject);
      
      if (subject) {
        await db.updateSubject({
          ...subject,
          experience: (subject.experience || 0) + REWARD_XP
        });
      }

      // Mark task as rewarded
      const updatedTask = {
        ...task,
        rewarded: true
      };

      await db.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );

      return {
        task: updatedTask,
        rewardedCoins: REWARD_COINS,
        rewardedXP: REWARD_XP
      };
    } catch (err) {
      setError('Failed to collect reward');
      console.error(err);
      throw err;
    }
  };

  const updateTaskReview = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.requiresReview) return;

      const updatedTask = {
        ...task,
        nextReviewDate: Date.now() + (7 * 24 * 60 * 60 * 1000)
      };

      await db.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to update task review');
      console.error(err);
      throw err;
    }
  };

  const getTasksDueForReview = () => {
    return tasks.filter(task => 
      task.requiresReview && 
      task.nextReviewDate && 
      task.nextReviewDate <= Date.now()
    );
  };

  const updateTask = async (taskId, updates) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
  
      const updatedTask = {
        ...task,
        ...updates
      };
  
      await db.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      await db.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    completeTask,
    collectReward,
    updateTaskReview,
    getTasksDueForReview,
    refreshTasks: loadTasks,
    updateTask,
    deleteTask
  };
};