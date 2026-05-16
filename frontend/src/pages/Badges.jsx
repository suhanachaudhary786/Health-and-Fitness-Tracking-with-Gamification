// Badges page
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import BadgeCard from '../components/gamification/BadgeCard';
import Loading from '../components/common/Loading';
import { gamificationService } from '../services/gamification.service';
import Button from '../components/common/Button';

const Badges = () => {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await gamificationService.getAvailableBadges();
      if (response.success) {
        setBadges(response.data);
      } else {
        setError(response.message || 'Failed to load badges');
      }
    } catch (error) {
      setError('An error occurred while loading badges');
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges =
    filter === 'all'
      ? badges
      : badges.filter((badge) => badge.category === filter);

  const earnedCount = badges.filter((badge) => badge.earned).length;
  const totalCount = badges.length;

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Badges</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Progress Card */}
        <Card className="mb-6 animate-fadeIn">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-5xl mr-3">🏆</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                  {earnedCount} / {totalCount}
                </h2>
                <p className="text-sm text-gray-600">Badges Earned</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-6 max-w-md mx-auto overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-primary via-secondary to-accent h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              >
                {earnedCount > 0 && (
                  <span className="text-xs font-semibold text-white">
                    {Math.round((earnedCount / totalCount) * 100)}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {earnedCount === totalCount ? (
                <span className="text-accent font-semibold">🎉 All badges earned! You're a champion!</span>
              ) : (
                <>
                  {totalCount - earnedCount} more badge{totalCount - earnedCount !== 1 ? 's' : ''} to unlock
                </>
              )}
            </p>
          </div>
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-1 sm:flex-initial"
          >
            All
          </Button>
          <Button
            variant={filter === 'activity' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('activity')}
            className="flex-1 sm:flex-initial"
          >
            Activity
          </Button>
          <Button
            variant={filter === 'streak' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('streak')}
            className="flex-1 sm:flex-initial"
          >
            Streak
          </Button>
          <Button
            variant={filter === 'milestone' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('milestone')}
            className="flex-1 sm:flex-initial"
          >
            Milestone
          </Button>
        </div>

        {/* Badges Grid */}
        {filteredBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map((badge, index) => (
              <div
                key={badge._id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BadgeCard badge={badge} earned={badge.earned} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="animate-fadeIn">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg">
                No badges found for this category
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Badges;

