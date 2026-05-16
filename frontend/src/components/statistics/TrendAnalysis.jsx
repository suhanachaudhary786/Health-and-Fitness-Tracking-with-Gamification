// Trend Analysis component
// Displays insights about activity patterns, best days, and trends
import React from 'react';
import Card from '../common/Card';

const TrendAnalysis = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <Card title="Trend Analysis">
        <p className="text-center text-gray-500 py-4">No activity data available for analysis</p>
      </Card>
    );
  }

  // Calculate best day for each metric
  const bestStepsDay = [...activities].sort((a, b) => b.steps - a.steps)[0];
  const bestDistanceDay = [...activities].sort((a, b) => b.distance - a.distance)[0];
  const bestCaloriesDay = [...activities].sort((a, b) => b.calories - a.calories)[0];
  const bestExerciseTimeDay = [...activities].sort((a, b) => b.exerciseTime - a.exerciseTime)[0];

  // Calculate day of week patterns
  const dayOfWeekStats = {
    Monday: { steps: 0, count: 0 },
    Tuesday: { steps: 0, count: 0 },
    Wednesday: { steps: 0, count: 0 },
    Thursday: { steps: 0, count: 0 },
    Friday: { steps: 0, count: 0 },
    Saturday: { steps: 0, count: 0 },
    Sunday: { steps: 0, count: 0 },
  };

  activities.forEach((activity) => {
    const date = new Date(activity.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (dayOfWeekStats[dayName]) {
      dayOfWeekStats[dayName].steps += activity.steps;
      dayOfWeekStats[dayName].count += 1;
    }
  });

  // Find best day of week
  const bestDayOfWeek = Object.entries(dayOfWeekStats)
    .map(([day, stats]) => ({
      day,
      avgSteps: stats.count > 0 ? stats.steps / stats.count : 0,
    }))
    .sort((a, b) => b.avgSteps - a.avgSteps)[0];

  // Calculate trend (comparing first half vs second half)
  const midPoint = Math.floor(activities.length / 2);
  const firstHalf = activities.slice(0, midPoint);
  const secondHalf = activities.slice(midPoint);

  const firstHalfAvg = {
    steps: firstHalf.reduce((sum, a) => sum + a.steps, 0) / firstHalf.length || 0,
    calories: firstHalf.reduce((sum, a) => sum + a.calories, 0) / firstHalf.length || 0,
    distance: firstHalf.reduce((sum, a) => sum + a.distance, 0) / firstHalf.length || 0,
  };

  const secondHalfAvg = {
    steps: secondHalf.reduce((sum, a) => sum + a.steps, 0) / secondHalf.length || 0,
    calories: secondHalf.reduce((sum, a) => sum + a.calories, 0) / secondHalf.length || 0,
    distance: secondHalf.reduce((sum, a) => sum + a.distance, 0) / secondHalf.length || 0,
  };

  const trendSteps = secondHalfAvg.steps > firstHalfAvg.steps ? 'up' : secondHalfAvg.steps < firstHalfAvg.steps ? 'down' : 'stable';
  const trendCalories = secondHalfAvg.calories > firstHalfAvg.calories ? 'up' : secondHalfAvg.calories < firstHalfAvg.calories ? 'down' : 'stable';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card title="Trend Analysis & Insights">
      <div className="space-y-6">
        {/* Best Days */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">🏆 Best Days</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Most Steps</div>
              <div className="text-lg font-bold text-blue-700">{bestStepsDay?.steps.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-500">{bestStepsDay ? formatDate(bestStepsDay.date) : 'N/A'}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Most Distance</div>
              <div className="text-lg font-bold text-green-700">{bestDistanceDay?.distance.toFixed(1) || 0} km</div>
              <div className="text-xs text-gray-500">{bestDistanceDay ? formatDate(bestDistanceDay.date) : 'N/A'}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Most Calories</div>
              <div className="text-lg font-bold text-orange-700">{bestCaloriesDay?.calories.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-500">{bestCaloriesDay ? formatDate(bestCaloriesDay.date) : 'N/A'}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Most Exercise Time</div>
              <div className="text-lg font-bold text-purple-700">{bestExerciseTimeDay?.exerciseTime || 0} min</div>
              <div className="text-xs text-gray-500">{bestExerciseTimeDay ? formatDate(bestExerciseTimeDay.date) : 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Day of Week Pattern */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">📅 Weekly Pattern</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center mb-2">
              <span className="text-sm text-gray-600">Most active day: </span>
              <span className="font-bold text-gray-800">{bestDayOfWeek?.day || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500">
                Average {bestDayOfWeek?.avgSteps.toLocaleString() || 0} steps on {bestDayOfWeek?.day || ''}
              </span>
            </div>
          </div>
        </div>

        {/* Trends */}
        {activities.length >= 4 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">📊 Trend Direction</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTrendIcon(trendSteps)}</span>
                  <span className="text-sm text-gray-700">Steps Trend</span>
                </div>
                <span className={`text-sm font-semibold ${getTrendColor(trendSteps)}`}>
                  {trendSteps === 'up' ? 'Improving' : trendSteps === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTrendIcon(trendCalories)}</span>
                  <span className="text-sm text-gray-700">Calories Trend</span>
                </div>
                <span className={`text-sm font-semibold ${getTrendColor(trendCalories)}`}>
                  {trendCalories === 'up' ? 'Improving' : trendCalories === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendAnalysis;

