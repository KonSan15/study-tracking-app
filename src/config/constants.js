// src/config/constants.js

// Default is 12 hours in seconds (12 * 60 * 60)
// 43200 seconds in 12 hours
export const REWARD_DELAY_SECONDS = 43200;

export const calculateRewardProgress = (completedAt) => {
  if (!completedAt) return 0;
  
  const elapsed = Date.now() - completedAt;
  const totalDelay = REWARD_DELAY_SECONDS * 1000; // Convert seconds to milliseconds
  const progress = (elapsed / totalDelay) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
};

export const getTimeRemaining = (completedAt) => {
  if (!completedAt) return null;
  
  const elapsed = Date.now() - completedAt;
  const totalDelay = REWARD_DELAY_SECONDS * 1000; // Convert seconds to milliseconds
  const remaining = totalDelay - elapsed;
  
  if (remaining <= 0) return "Ready to collect!";
  
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s remaining`;
  } else {
    return `${seconds}s remaining`;
  }
};