// Statistics page
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import StepsChart from '../components/charts/StepsChart';
import CaloriesChart from '../components/charts/CaloriesChart';
import DistanceChart from '../components/charts/DistanceChart';
import ExerciseTimeChart from '../components/charts/ExerciseTimeChart';
import ComparisonChart from '../components/charts/ComparisonChart';
import CalorieCalculator from '../components/common/CalorieCalculator';
import TrendAnalysis from '../components/statistics/TrendAnalysis';
import BMITrackingChart from '../components/charts/BMITrackingChart';
import { activityService } from '../services/activity.service';
import { userService } from '../services/user.service';
import { formatNumber, calculateBMI } from '../utils/helpers';
import Button from '../components/common/Button';

const Statistics = () => {
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [previousWeekStats, setPreviousWeekStats] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadStatistics();
    loadUserProfile();
  }, [period]);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await activityService.getActivityStats(period);
      if (response.success) {
        setStats(response.data);
        
        // Load previous week for comparison if current period is weekly
        if (period === 'weekly') {
          try {
            const now = new Date();
            const previousWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const previousWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const prevResponse = await activityService.getActivities({
              startDate: previousWeekStart.toISOString(),
              endDate: previousWeekEnd.toISOString(),
            });
            
            if (prevResponse.success && prevResponse.data) {
              setPreviousWeekStats(prevResponse.data);
            }
          } catch (err) {
            console.error('Error loading previous week:', err);
          }
        }
      } else {
        setError(response.message || 'Failed to load statistics');
      }
    } catch (error) {
      setError('An error occurred while loading statistics');
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Statistics</h1>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={period === 'daily' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod('daily')}
              className="flex-1 sm:flex-initial"
            >
              Daily
            </Button>
            <Button
              variant={period === 'weekly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod('weekly')}
              className="flex-1 sm:flex-initial"
            >
              Weekly
            </Button>
            <Button
              variant={period === 'monthly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod('monthly')}
              className="flex-1 sm:flex-initial"
            >
              Monthly
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Steps
                </h3>
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(stats.totals.steps)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: {formatNumber(stats.averages.avgSteps)}/day
                </p>
              </Card>

              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Distance
                </h3>
                <p className="text-2xl font-bold text-secondary">
                  {stats.totals.distance.toFixed(1)} km
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: {parseFloat(stats.averages.avgDistance).toFixed(1)} km/day
                </p>
              </Card>

              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Exercise Time
                </h3>
                <p className="text-2xl font-bold text-accent">
                  {stats.totals.exerciseTime} min
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: {stats.averages.avgExerciseTime} min/day
                </p>
              </Card>

              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Calories
                </h3>
                <p className="text-2xl font-bold text-red-500">
                  {formatNumber(stats.totals.calories)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: {formatNumber(stats.averages.avgCalories)}/day
                </p>
              </Card>
            </div>

            {/* Comparison Toggle */}
            {period === 'weekly' && (
              <Card className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      Week Comparison
                    </h3>
                    <p className="text-sm text-gray-600">
                      Compare this week with last week
                    </p>
                  </div>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      showComparison
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                  </button>
                </div>
              </Card>
            )}

            {/* Comparison Charts */}
            {showComparison && period === 'weekly' && previousWeekStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card title="Steps Comparison" className="animate-fadeIn">
                  <ComparisonChart
                    currentWeekData={stats.activities}
                    previousWeekData={previousWeekStats}
                    metric="steps"
                  />
                </Card>
                <Card title="Calories Comparison" className="animate-fadeIn">
                  <ComparisonChart
                    currentWeekData={stats.activities}
                    previousWeekData={previousWeekStats}
                    metric="calories"
                  />
                </Card>
                <Card title="Distance Comparison" className="animate-fadeIn">
                  <ComparisonChart
                    currentWeekData={stats.activities}
                    previousWeekData={previousWeekStats}
                    metric="distance"
                  />
                </Card>
                <Card title="Exercise Time Comparison" className="animate-fadeIn">
                  <ComparisonChart
                    currentWeekData={stats.activities}
                    previousWeekData={previousWeekStats}
                    metric="exerciseTime"
                  />
                </Card>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card title="Steps Over Time" className="animate-fadeIn">
                <StepsChart data={stats.activities} type="line" />
              </Card>

              <Card title="Calories Over Time" className="animate-fadeIn">
                <CaloriesChart data={stats.activities} type="line" />
              </Card>

              <Card title="Distance Over Time" className="animate-fadeIn">
                <DistanceChart data={stats.activities} type="line" />
              </Card>

              <Card title="Exercise Time Over Time" className="animate-fadeIn">
                <ExerciseTimeChart data={stats.activities} type="line" />
              </Card>
            </div>

            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CalorieCalculator
                userProfile={userProfile}
                dailyCalories={stats.averages.avgCalories}
              />
              <TrendAnalysis activities={stats.activities} />
            </div>

            {/* BMI Tracking */}
            {userProfile && userProfile.weight && userProfile.height && (
              <div className="mb-6">
                <Card title="BMI Tracking">
                  <BMITrackingChart
                    bmiHistory={[
                      {
                        date: new Date(),
                        bmi: parseFloat(calculateBMI(userProfile.weight, userProfile.height)),
                      },
                    ]}
                  />
                </Card>
              </div>
            )}

            {/* Activity Table */}
            <Card title={`Activity Details (${stats.daysCount} days)`}>
              {/* Mobile View - Cards */}
              <div className="block md:hidden space-y-3">
                {stats.activities.length > 0 ? (
                  stats.activities.map((activity, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="font-semibold text-gray-900 border-b pb-2">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Steps:</span>
                          <span className="ml-2 font-semibold">{formatNumber(activity.steps)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Distance:</span>
                          <span className="ml-2 font-semibold">{activity.distance.toFixed(1)} km</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Exercise:</span>
                          <span className="ml-2 font-semibold">{activity.exerciseTime} min</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Calories:</span>
                          <span className="ml-2 font-semibold">{formatNumber(activity.calories)}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-gray-600 text-sm">Points: </span>
                        <span className="text-primary font-bold">{activity.points}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 py-4">
                    No activities found for this period
                  </p>
                )}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Steps
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distance
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exercise Time
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calories
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.activities.length > 0 ? (
                      stats.activities.map((activity, index) => (
                        <tr key={index}>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(activity.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(activity.steps)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {activity.distance.toFixed(1)} km
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {activity.exerciseTime} min
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(activity.calories)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                            {activity.points}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No activities found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Statistics;

