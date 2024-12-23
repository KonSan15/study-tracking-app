// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, BarChart2, ShoppingBag, Coins } from 'lucide-react';
import { TaskList } from './components/Tasks/TaskList';
import { SubjectProgressView } from './components/Progress/SubjectProgress';
import { db } from './services/db';
import { useTaskManager } from './hooks/useTaskManager';
import { useSubjectManager } from './hooks/useSubjectManager';

const Navigation = ({ currentPage, setCurrentPage, coins }) => (
  <div className="py-4">
    {/* Header with coins */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Study Tracker</h1>
      <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
        <Coins className="w-5 h-5 text-yellow-500 mr-1.5" />
        <span className="font-medium text-yellow-700">{coins} coins</span>
      </div>
    </div>

    {/* Navigation buttons */}
    <div className="flex">
      <button
        onClick={() => setCurrentPage('tasks')}
        className={`mr-2 px-4 py-2 -mb-px flex items-center font-medium border-b-2 transition-colors ${
          currentPage === 'tasks'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Tasks
      </button>
      <button
        onClick={() => setCurrentPage('progress')}
        className={`mr-2 px-4 py-2 -mb-px flex items-center font-medium border-b-2 transition-colors ${
          currentPage === 'progress'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        <BarChart2 className="w-4 h-4 mr-2" />
        Progress
      </button>
      <button
        onClick={() => setCurrentPage('shop')}
        className={`px-4 py-2 -mb-px flex items-center font-medium border-b-2 transition-colors ${
          currentPage === 'shop'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        Shop
      </button>
    </div>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('tasks');
  const [userData, setUserData] = useState({ coins: 0 });
  const { subjects } = useSubjectManager();
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await db.getUserData();
        if (data) {
          setUserData(data);
        } else {
          const initialData = { coins: 0, id: 'user' };
          await db.updateUserData(initialData);
          setUserData(initialData);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'tasks':
        return <TaskList />;
      case 'progress':
        return <SubjectProgressView subjects={subjects} />;
      case 'shop':
        return (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Shop Coming Soon!</h2>
            <p className="text-gray-600">
              The shop feature is currently under development.
            </p>
          </div>
        );
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            coins={userData.coins}
          />
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default App;