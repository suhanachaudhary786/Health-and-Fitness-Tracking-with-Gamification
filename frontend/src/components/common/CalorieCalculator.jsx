// Calorie Calculator component
// Calculates calorie deficit/surplus based on activity and goals
import React, { useState, useEffect } from 'react';
import Card from './Card';

const CalorieCalculator = ({ userProfile, dailyCalories }) => {
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [deficit, setDeficit] = useState(0);
  const [surplus, setSurplus] = useState(0);
  const [weeklyDeficit, setWeeklyDeficit] = useState(0);
  const [estimatedWeightLoss, setEstimatedWeightLoss] = useState(0);

  useEffect(() => {
    if (userProfile?.weight && userProfile?.height && userProfile?.age) {
      calculateCalories();
    }
  }, [userProfile, dailyCalories]);

  const calculateCalories = () => {
    // Calculate BMR using Mifflin-St Jeor Equation
    // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5 (for men)
    // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161 (for women)
    // Using average (assuming male for calculation, can be improved with gender field)
    const weight = userProfile.weight;
    const height = userProfile.height;
    const age = userProfile.age;

    const calculatedBMR = 10 * weight + 6.25 * height - 5 * age + 5;
    setBmr(Math.round(calculatedBMR));

    // Calculate TDEE (Total Daily Energy Expenditure)
    // Using moderate activity level (1.55 multiplier)
    const activityMultiplier = 1.55; // Moderate activity
    const calculatedTDEE = calculatedBMR * activityMultiplier;
    setTdee(Math.round(calculatedTDEE));

    // Calculate deficit/surplus
    const consumed = dailyCalories || 0;
    const deficitValue = calculatedTDEE - consumed;
    setDeficit(deficitValue > 0 ? deficitValue : 0);
    setSurplus(deficitValue < 0 ? Math.abs(deficitValue) : 0);

    // Calculate weekly deficit
    const weeklyDeficitValue = deficitValue * 7;
    setWeeklyDeficit(weeklyDeficitValue);

    // Estimate weight loss (1 kg = ~7700 calories)
    const estimatedLoss = weeklyDeficitValue > 0 ? (weeklyDeficitValue / 7700).toFixed(2) : 0;
    setEstimatedWeightLoss(parseFloat(estimatedLoss));
  };

  if (!userProfile?.weight || !userProfile?.height || !userProfile?.age) {
    return (
      <Card title="Calorie Calculator">
        <p className="text-sm text-gray-600">
          Please update your weight, height, and age in your Profile to use the calorie calculator.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Calorie Calculator">
      <div className="space-y-4">
        {/* BMR and TDEE */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">BMR (Basal Metabolic Rate)</p>
            <p className="text-2xl font-bold text-blue-600">{bmr}</p>
            <p className="text-xs text-gray-500 mt-1">calories/day</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">TDEE (Total Daily Energy Expenditure)</p>
            <p className="text-2xl font-bold text-green-600">{tdee}</p>
            <p className="text-xs text-gray-500 mt-1">calories/day</p>
          </div>
        </div>

        {/* Deficit/Surplus */}
        {dailyCalories > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {deficit > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-xs text-gray-600 mb-1">Calorie Deficit</p>
                <p className="text-2xl font-bold text-green-600">-{deficit}</p>
                <p className="text-xs text-gray-500 mt-1">calories/day</p>
                <p className="text-xs text-green-700 mt-2 font-semibold">
                  ✓ On track for weight loss
                </p>
              </div>
            )}
            {surplus > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <p className="text-xs text-gray-600 mb-1">Calorie Surplus</p>
                <p className="text-2xl font-bold text-red-600">+{surplus}</p>
                <p className="text-xs text-gray-500 mt-1">calories/day</p>
                <p className="text-xs text-red-700 mt-2 font-semibold">
                  ⚠ May lead to weight gain
                </p>
              </div>
            )}
          </div>
        )}

        {/* Weekly Projection */}
        {weeklyDeficit > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Weekly Projection</p>
            <p className="text-xl font-bold text-purple-600">
              {weeklyDeficit > 0 ? '-' : '+'}
              {Math.abs(weeklyDeficit).toLocaleString()} calories
            </p>
            {estimatedWeightLoss > 0 && (
              <p className="text-sm text-purple-700 mt-2 font-semibold">
                Estimated weight loss: ~{estimatedWeightLoss} kg/week
              </p>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> These calculations are estimates. Individual results may vary.
            For accurate tracking, log your daily calorie intake.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CalorieCalculator;

