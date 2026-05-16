// Password strength indicator component
import React from 'react';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const getStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  };

  const strength = getStrength(password);
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password Strength:</span>
        <span className={`text-xs font-semibold ${
          strength === 0 ? 'text-red-500' :
          strength === 1 ? 'text-orange-500' :
          strength === 2 ? 'text-yellow-500' :
          strength === 3 ? 'text-blue-500' :
          'text-green-500'
        }`}>
          {labels[strength]}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colors[strength] || 'bg-gray-300'}`}
          style={{ width: `${((strength + 1) / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrength;

