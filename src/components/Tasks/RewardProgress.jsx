import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { calculateRewardProgress, getTimeRemaining } from '../../config/constants';

const RewardProgress = ({ completedAt }) => {
  const [progress, setProgress] = useState(calculateRewardProgress(completedAt));
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(completedAt));

  useEffect(() => {
    if (!completedAt) return;

    const updateProgress = () => {
      setProgress(calculateRewardProgress(completedAt));
      setTimeLeft(getTimeRemaining(completedAt));
    };

    const timer = setInterval(updateProgress, 1000);
    updateProgress();

    return () => clearInterval(timer);
  }, [completedAt]);

  return (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-blue-500" />
      <div className="flex-1 min-w-0">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">{timeLeft}</p>
      </div>
    </div>
  );
};

export default RewardProgress;