// components/Navigation/Navigation.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Coins, BookOpen, BarChart2, ShoppingBag } from 'lucide-react';

/**
 * Main navigation component for the Study Tracker application
 * @param {Object} props - Component props
 * @param {string} props.currentPage - Currently active page
 * @param {Function} props.setCurrentPage - Function to update current page
 * @param {number} props.coins - User's current coin balance
 */
export const Navigation = ({ currentPage, setCurrentPage, coins }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Study Tracker</h1>
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" aria-hidden="true" />
          <span className="font-medium">{coins} coins</span>
        </div>
      </div>
      
      <nav className="flex gap-2 mb-6">
        <button
          onClick={() => setCurrentPage('tasks')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            currentPage === 'tasks'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-current={currentPage === 'tasks' ? 'page' : undefined}
        >
          <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
          <span>Tasks</span>
        </button>
        <button
          onClick={() => setCurrentPage('progress')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            currentPage === 'progress'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-current={currentPage === 'progress' ? 'page' : undefined}
        >
          <BarChart2 className="w-4 h-4 mr-2" aria-hidden="true" />
          <span>Progress</span>
        </button>
        <button
          onClick={() => setCurrentPage('shop')}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            currentPage === 'shop'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-current={currentPage === 'shop' ? 'page' : undefined}
        >
          <ShoppingBag className="w-4 h-4 mr-2" aria-hidden="true" />
          <span>Shop</span>
        </button>
      </nav>
    </div>
  );
};

Navigation.propTypes = {
  currentPage: PropTypes.oneOf(['tasks', 'progress', 'shop']).isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  coins: PropTypes.number.isRequired,
};

export default Navigation;