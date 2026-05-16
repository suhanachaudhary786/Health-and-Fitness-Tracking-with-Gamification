// Badge card component
import React from 'react';

const BadgeCard = ({ badge, earned = false }) => {
  return (
    <div
      className={`relative rounded-lg p-4 border-2 transition-all duration-300 transform hover:scale-105 ${
        earned
          ? 'bg-gradient-to-br from-accent-light to-accent border-accent shadow-lg animate-scaleIn'
          : 'bg-gray-100 border-gray-300 opacity-60 hover:opacity-80'
      }`}
    >
      <div className="text-center">
        <div className={`text-5xl mb-2 transition-transform duration-300 ${earned ? 'animate-pulse-slow' : 'grayscale'}`}>
          {badge.icon}
        </div>
        <h3 className={`font-semibold mb-1 ${earned ? 'text-gray-800' : 'text-gray-500'}`}>
          {badge.name}
        </h3>
        <p className={`text-xs ${earned ? 'text-gray-700' : 'text-gray-500'}`}>
          {badge.description}
        </p>
        {earned && (
          <div className="absolute top-2 right-2 animate-scaleIn">
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full shadow-md">
              ✓ Earned
            </span>
          </div>
        )}
        {!earned && badge.requirement && (
          <div className="mt-2 text-xs text-gray-400">
            {badge.requirement.type === 'steps' && `Need ${badge.requirement.value} steps`}
            {badge.requirement.type === 'distance' && `Need ${badge.requirement.value} km`}
            {badge.requirement.type === 'calories' && `Need ${badge.requirement.value} calories`}
            {badge.requirement.type === 'streak' && `Need ${badge.requirement.value} day streak`}
            {badge.requirement.type === 'points' && `Need ${badge.requirement.value} points`}
            {badge.requirement.type === 'total_activities' && `Need ${badge.requirement.value} activities`}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;

