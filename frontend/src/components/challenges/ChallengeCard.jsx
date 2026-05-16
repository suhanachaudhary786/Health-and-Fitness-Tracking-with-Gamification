// Challenge card component
import React from 'react';

const ChallengeCard = ({ challenge }) => {
  const getTargetLabel = () => {
    switch (challenge.target.type) {
      case 'steps':
        return 'Steps';
      case 'distance':
        return 'Distance (km)';
      case 'calories':
        return 'Calories';
      case 'exerciseTime':
        return 'Exercise Time (min)';
      case 'points':
        return 'Points';
      default:
        return challenge.target.type;
    }
  };

  const getIcon = () => {
    switch (challenge.target.type) {
      case 'steps':
        return '🚶';
      case 'distance':
        return '📍';
      case 'calories':
        return '🔥';
      case 'exerciseTime':
        return '⏱️';
      case 'points':
        return '⭐';
      default:
        return '🎯';
    }
  };

  const formatValue = (value, type) => {
    if (type === 'distance') {
      return value.toFixed(1);
    }
    return Math.round(value).toLocaleString();
  };

  const progress = challenge.progress || 0;
  const currentValue = challenge.currentValue || 0;
  const targetValue = challenge.target.value;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-2 ${
      challenge.completed 
        ? 'border-green-400 bg-green-50' 
        : 'border-primary-light'
    } transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-3xl mr-2">{getIcon()}</span>
          <div>
            <h3 className="font-semibold text-gray-800">
              {challenge.type === 'daily' ? 'Daily Challenge' : 'Weekly Challenge'}
            </h3>
            <p className="text-sm text-gray-600">{getTargetLabel()}</p>
          </div>
        </div>
        {challenge.completed && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            {formatValue(challenge.currentValue || 0, challenge.target.type)} /{' '}
            {formatValue(challenge.target.value, challenge.target.type)}
          </span>
          <span className="font-semibold text-primary">
            {challenge.progress || 0}%
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              challenge.completed
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-primary to-secondary'
            }`}
            style={{ width: `${Math.min(challenge.progress || 0, 100)}%` }}
          ></div>
        </div>
      </div>

      {challenge.pointsReward > 0 && (
        <div className="text-xs text-gray-500">
          Reward: <span className="font-semibold text-accent">+{challenge.pointsReward} points</span>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;

