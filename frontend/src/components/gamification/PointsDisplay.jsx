// Points display component
import React from 'react';
import { formatNumber } from '../../utils/helpers';

const PointsDisplay = ({ totalPoints, levelProgress }) => {
  const progressPercentage = levelProgress?.progress || 0;
  const nextLevel = levelProgress?.nextLevel;
  const currentLevel = levelProgress?.currentLevel;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {formatNumber(totalPoints)}
        </h2>
        <p className="text-gray-600">Total Points</p>
      </div>

      {currentLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Level {currentLevel.levelNumber}</span>
            {nextLevel && (
              <span>Level {nextLevel.levelNumber}</span>
            )}
          </div>
          <div className="bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {nextLevel && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {formatNumber(levelProgress.pointsNeeded)} points to next level
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;

