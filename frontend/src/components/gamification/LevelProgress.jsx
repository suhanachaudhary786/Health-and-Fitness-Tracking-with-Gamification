// Level progress component
import React from 'react';
import { formatNumber } from '../../utils/helpers';

const LevelProgress = ({ levelProgress }) => {
  if (!levelProgress) return null;

  const { currentLevel, nextLevel, progress, pointsNeeded } = levelProgress;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Level Progress</h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-2xl font-bold text-primary">
              Level {currentLevel?.levelNumber || 1}
            </p>
            <p className="text-sm text-gray-600">{currentLevel?.title || 'Beginner'}</p>
          </div>
          {nextLevel && (
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary">
                Level {nextLevel.levelNumber}
              </p>
              <p className="text-sm text-gray-600">{nextLevel.title}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-200 rounded-full h-6 mb-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-6 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && (
              <span className="text-white text-xs font-semibold">{progress}%</span>
            )}
          </div>
        </div>

        {nextLevel ? (
          <p className="text-sm text-gray-600 text-center">
            {formatNumber(pointsNeeded)} points needed to reach Level{' '}
            {nextLevel.levelNumber}
          </p>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            You've reached the maximum level! 🎉
          </p>
        )}
      </div>
    </div>
  );
};

export default LevelProgress;

