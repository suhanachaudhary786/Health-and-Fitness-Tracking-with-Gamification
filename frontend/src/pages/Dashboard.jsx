// Dashboard page
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { userService } from '../services/user.service';
import { gamificationService } from '../services/gamification.service';
import { activityService } from '../services/activity.service';
import { challengeService } from '../services/challenge.service';
import { formatNumber } from '../utils/helpers';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import BadgeCard from '../components/gamification/BadgeCard';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [todayActivity, setTodayActivity] = useState(null);
  const [recentBadges, setRecentBadges] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const { showSuccess } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        gamificationRes,
        todayRes,
        badgesRes,
        weeklyRes,
        challengesRes,
      ] = await Promise.all([
        userService.getStats(),
        gamificationService.getPoints(),
        activityService.getTodayActivity(),
        gamificationService.getBadges(),
        activityService.getActivityStats('weekly'),
        challengeService.getActiveChallenges().catch(() => ({ success: false })),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (gamificationRes.success) setGamification(gamificationRes.data);
      if (todayRes.success) setTodayActivity(todayRes.data);
      if (badgesRes.success) {
        // Get last 4 badges
        const badges = badgesRes.data || [];
        setRecentBadges(badges.slice(-4).reverse());
      }
      if (weeklyRes.success) setWeeklyStats(weeklyRes.data);
      if (challengesRes.success) {
        setChallenges(challengesRes.data || []);
      } else {
        // Create default challenges if none exist
        try {
          await challengeService.createDefaultChallenges();
          const newChallengesRes = await challengeService.getActiveChallenges();
          if (newChallengesRes.success) {
            setChallenges(newChallengesRes.data || []);
          }
        } catch (err) {
          console.error('Error creating challenges:', err);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get motivational message based on streak
  const getMotivationalMessage = () => {
    const streak = stats?.userStats?.streakDays || 0;
    if (streak === 0) return "Start your fitness journey today! 💪";
    if (streak < 7) return `Great start! ${streak} days in a row! 🔥`;
    if (streak < 14) return `Amazing! ${streak} days streak! Keep going! ⭐`;
    if (streak < 30) return `Incredible dedication! ${streak} days! 🏆`;
    return `You're a fitness champion! ${streak} days! 👑`;
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

  const levelProgress = gamification?.levelProgress || {};
  const progressPercentage = levelProgress.progress || 0;

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500">Welcome back!</p>
            <p className="text-base sm:text-lg font-semibold text-primary">{getMotivationalMessage()}</p>
          </div>
        </div>

        {/* Points and Level Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="transform transition-all hover:scale-105 hover:shadow-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl mr-2">⭐</span>
                <h2 className="text-3xl font-bold text-primary">
                  {formatNumber(gamification?.totalPoints || 0)}
                </h2>
              </div>
              <p className="text-gray-600 mb-4 font-medium">Total Points</p>
              <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary-dark h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Level {gamification?.currentLevel || 1}</span>
                {levelProgress.nextLevel && (
                  <>
                    {' - '}
                    <span className="text-primary">
                      {formatNumber(levelProgress.pointsNeeded)} points to Level {levelProgress.nextLevel.levelNumber}
                    </span>
                  </>
                )}
                {!levelProgress.nextLevel && <span className="text-accent"> - Max Level! 🎉</span>}
              </p>
            </div>
          </Card>

          <Card className="transform transition-all hover:scale-105 hover:shadow-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl mr-2">🔥</span>
                <h2 className="text-3xl font-bold text-secondary">
                  {stats?.userStats?.streakDays || 0}
                </h2>
              </div>
              <p className="text-gray-600 font-medium">Day Streak</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats?.userStats?.streakDays >= 7 ? '🔥 Amazing streak!' : 'Keep it up!'}
              </p>
            </div>
          </Card>
        </div>

        {/* Today's Activity */}
        <Card 
          title={
            <div className="flex items-center justify-between">
              <span>Today's Activity</span>
              {todayActivity?.activityCount > 1 && (
                <span className="text-sm font-normal text-gray-500">
                  ({todayActivity.activityCount} activities)
                </span>
              )}
            </div>
          } 
          className="mb-6"
        >
          {todayActivity ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg transform transition-all hover:scale-105">
                <p className="text-sm text-gray-600 mb-1">🚶 Steps</p>
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(todayActivity.steps || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg transform transition-all hover:scale-105">
                <p className="text-sm text-gray-600 mb-1">📍 Distance</p>
                <p className="text-2xl font-bold text-secondary">
                  {(todayActivity.distance || 0).toFixed(1)} km
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg transform transition-all hover:scale-105">
                <p className="text-sm text-gray-600 mb-1">⏱️ Exercise Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {todayActivity.exerciseTime || 0} min
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg transform transition-all hover:scale-105">
                <p className="text-sm text-gray-600 mb-1">🔥 Calories</p>
                <p className="text-2xl font-bold text-accent">
                  {formatNumber(todayActivity.calories || 0)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 mb-4 text-lg">No activity logged for today</p>
              <Link to="/activity">
                <Button variant="primary" size="lg">Add Activity</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Weekly Progress Summary */}
        {weeklyStats && weeklyStats.daysCount > 0 && (
          <Card title="This Week's Progress" className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Steps</p>
                <p className="text-xl font-bold text-primary">
                  {formatNumber(weeklyStats.totals.steps)}
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {formatNumber(weeklyStats.averages.avgSteps)}/day
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-xl font-bold text-secondary">
                  {weeklyStats.totals.distance.toFixed(1)} km
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {parseFloat(weeklyStats.averages.avgDistance).toFixed(1)} km/day
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Exercise Time</p>
                <p className="text-xl font-bold text-purple-600">
                  {weeklyStats.totals.exerciseTime} min
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {weeklyStats.averages.avgExerciseTime} min/day
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Calories</p>
                <p className="text-xl font-bold text-accent">
                  {formatNumber(weeklyStats.totals.calories)}
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {formatNumber(weeklyStats.averages.avgCalories)}/day
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Active days this week: <span className="font-semibold text-primary">{weeklyStats.daysCount} / 7</span>
              </p>
            </div>
          </Card>
        )}

        {/* Daily Challenges */}
        {challenges.length > 0 && (
          <Card title="Daily Challenges" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Card>
        )}

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <Card title="Recent Badges" className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentBadges.map((badge) => (
                <BadgeCard key={badge._id} badge={badge} earned={true} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/badges">
                <Button variant="outline" size="sm">
                  View All Badges →
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="transform transition-all hover:scale-105 hover:shadow-lg border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Activities
                </h3>
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(stats?.totalActivities || 0)}
                </p>
              </div>
              <div className="text-4xl opacity-20">📊</div>
            </div>
          </Card>

          <Card className="transform transition-all hover:scale-105 hover:shadow-lg border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Steps
                </h3>
                <p className="text-3xl font-bold text-secondary">
                  {formatNumber(stats?.totals?.totalSteps || 0)}
                </p>
              </div>
              <div className="text-4xl opacity-20">👣</div>
            </div>
          </Card>

          <Card className="transform transition-all hover:scale-105 hover:shadow-lg border-l-4 border-accent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Calories
                </h3>
                <p className="text-3xl font-bold text-accent">
                  {formatNumber(stats?.totals?.totalCalories || 0)}
                </p>
              </div>
              <div className="text-4xl opacity-20">🔥</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Link to="/activity" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Add Today's Activity
            </Button>
          </Link>
          <Link to="/statistics" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              View Statistics
            </Button>
          </Link>
          <Link to="/badges" className="w-full sm:w-auto">
            <Button variant="accent" size="lg" className="w-full sm:w-auto">
              View Badges
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

