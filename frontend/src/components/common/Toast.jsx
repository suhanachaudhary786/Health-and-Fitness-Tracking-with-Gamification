// Toast notification component
// Supports regular notifications and achievement notifications with special styling
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000, badge = null }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Achievement notification styling
  if (type === 'achievement' && badge) {
    return (
      <div
        className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-5 rounded-lg shadow-2xl mb-4 flex items-center justify-between animate-slideIn min-w-[350px] max-w-md border-2 border-yellow-300 transform hover:scale-105 transition-transform"
        role="alert"
      >
        <div className="flex items-center flex-1">
          <div className="text-4xl mr-4 animate-bounce">{badge.icon || '🏆'}</div>
          <div className="flex-1">
            <p className="font-bold text-lg mb-1">Achievement Unlocked!</p>
            <p className="font-semibold">{badge.name}</p>
            {badge.description && (
              <p className="text-sm opacity-90 mt-1">{badge.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <span className="text-xl">&times;</span>
        </button>
      </div>
    );
  }

  // Regular notification styling
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center justify-between animate-slideIn min-w-[300px] max-w-md`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icons[type]}</span>
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <span className="text-xl">&times;</span>
      </button>
    </div>
  );
};

export default Toast;

