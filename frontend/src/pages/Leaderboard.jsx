// Leaderboard page
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { leaderboardService } from '../services/leaderboard.service';
import { useAuth } from '../context/AuthContext';
import { formatNumber } from '../utils/helpers';
import Button from '../components/common/Button';

const Leaderboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('overall'); // overall, weekly, monthly
  const [category, setCategory] = useState('points'); // points, steps, calories, streak
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, [type, category]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [leaderboardRes, rankRes] = await Promise.all([
        type === 'overall'
          ? leaderboardService.getOverall(20)
          : type === 'weekly'
          ? leaderboardService.getWeekly(category, 20)
          : leaderboardService.getMonthly(category, 20),
        leaderboardService.getMyRank(type, category).catch(() => ({ success: false })),
      ]);

      if (leaderboardRes.success) {
        setLeaderboard(leaderboardRes.data);
      } else {
        setError(leaderboardRes.message || 'Failed to load leaderboard');
      }

      if (rankRes.success) {
        setMyRank(rankRes.data);
      }
    } catch (error) {
      setError('An error occurred while loading leaderboard');
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'points':
        return 'Points';
      case 'steps':
        return 'Steps';
      case 'calories':
        return 'Calories';
      case 'streak':
        return 'Streak Days';
      default:
        return category;
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'points':
        return '⭐';
      case 'steps':
        return '🚶';
      case 'calories':
        return '🔥';
      case 'streak':
        return '🔥';
      default:
        return '📊';
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Leaderboard
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Type Selection */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={type === 'overall' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setType('overall')}
            >
              Overall
            </Button>
            <Button
              variant={type === 'weekly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setType('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={type === 'monthly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setType('monthly')}
            >
              Monthly
            </Button>
          </div>

          {type !== 'overall' && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === 'points' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCategory('points')}
              >
                Points
              </Button>
              <Button
                variant={category === 'steps' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCategory('steps')}
              >
                Steps
              </Button>
              <Button
                variant={category === 'calories' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCategory('calories')}
              >
                Calories
              </Button>
              <Button
                variant={category === 'streak' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCategory('streak')}
              >
                Streak
              </Button>
            </div>
          )}
        </Card>

        {/* My Rank */}
        {myRank && myRank.rank && (
          <Card className="mb-6 bg-gradient-to-r from-primary-light to-secondary-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Rank</p>
                <p className="text-3xl font-bold text-primary">
                  #{myRank.rank}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">{getCategoryLabel()}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNumber(myRank.value || 0)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard Table */}
        <Card title={`${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard - ${getCategoryLabel()}`}>
          {leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {getCategoryLabel()}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={
                        user?.id === entry.userId?.toString()
                          ? 'bg-primary-light font-semibold'
                          : ''
                      }
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 && (
                            <span className="text-2xl mr-2">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                          <span className="text-lg font-bold text-gray-900">
                            #{entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.username}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-white">
                          Level {entry.level || 1}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-primary">
                          {getCategoryIcon()} {formatNumber(entry.value)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No leaderboard data available
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;

