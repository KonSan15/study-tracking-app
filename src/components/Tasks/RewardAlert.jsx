import React from 'react';
import { Trophy, Coins, X } from 'lucide-react';

const RewardAlert = ({ task, xp, coins, onClose }) => {
  return (
    <div className="relative bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Rewards Collected!
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <span>
                Earned {xp} XP for {task.subject}
              </span>
              <span className="flex items-center mt-1 sm:mt-0">
                <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                {coins} coins
              </span>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4"
          >
            <X className="w-4 h-4 text-yellow-500 hover:text-yellow-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardAlert;