// Activity Entry page
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { activityService } from '../services/activity.service';
import { getTodayDate, formatNumber } from '../utils/helpers';
import { POINTS_RULES } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import { ACTIVITY_TEMPLATES, QUICK_PRESETS } from '../utils/activityTemplates';
import Confetti from '../components/common/Confetti';

const ActivityEntry = () => {
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    steps: '',
    distance: '',
    exerciseTime: '',
    calories: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  const [todayActivity, setTodayActivity] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { showSuccess, showError, showAchievement } = useToast();

  useEffect(() => {
    loadTodayActivity();
  }, []);

  useEffect(() => {
    calculateEstimatedPoints();
  }, [formData]);

  const loadTodayActivity = async () => {
    try {
      const response = await activityService.getTodayActivity();
      if (response.success && response.data) {
        // Store today's aggregated activity for display only
        // Don't pre-fill form to allow adding new activities
        setTodayActivity(response.data);
        // Reset form to empty values to allow adding new activity
        setFormData({
          date: getTodayDate(),
          steps: '',
          distance: '',
          exerciseTime: '',
          calories: '',
        });
      }
    } catch (error) {
      console.error('Error loading today activity:', error);
    }
  };

  const calculateEstimatedPoints = () => {
    const steps = parseFloat(formData.steps) || 0;
    const distance = parseFloat(formData.distance) || 0;
    const exerciseTime = parseFloat(formData.exerciseTime) || 0;
    const calories = parseFloat(formData.calories) || 0;

    let points = 0;

    // Steps: 1 point per 100 steps (max 100)
    points += Math.min(Math.floor(steps / 100), POINTS_RULES.steps.max);

    // Distance: 10 points per km (max 50)
    points += Math.min(Math.floor(distance * 10), POINTS_RULES.distance.max);

    // Exercise Time: 2 points per minute (max 60)
    points += Math.min(Math.floor(exerciseTime * 2), POINTS_RULES.exerciseTime.max);

    // Calories: 1 point per 10 calories (max 50)
    points += Math.min(Math.floor(calories / 10), POINTS_RULES.calories.max);

    // Activity Bonus: +10 for 2+ types, additional +10 if all 4 types
    const activeTypes = [
      steps > 0,
      distance > 0,
      exerciseTime > 0,
      calories > 0,
    ].filter(Boolean).length;

    if (activeTypes >= 2) {
      points += POINTS_RULES.activityBonus;
      if (activeTypes === 4) {
        points += POINTS_RULES.allTypesBonus;
      }
    }

    setEstimatedPoints(points);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const steps = parseFloat(formData.steps) || 0;
      const distance = parseFloat(formData.distance) || 0;
      const exerciseTime = parseFloat(formData.exerciseTime) || 0;
      const calories = parseFloat(formData.calories) || 0;

      // Validate: At least one field must have a value
      if (steps === 0 && distance === 0 && exerciseTime === 0 && calories === 0) {
        setError('Please enter at least one activity value (steps, distance, exercise time, or calories)');
        setLoading(false);
        return;
      }

      const activityData = {
        date: formData.date,
        steps,
        distance,
        exerciseTime,
        calories,
      };

      // Always create a new activity entry
      // Multiple activities per day are allowed and will be aggregated
      const response = await activityService.createActivity(activityData);

      if (response.success) {
        const successMessage = 'Activity logged successfully!';
        
        setSuccess(successMessage);
        showSuccess(successMessage);

        // Show achievement notifications for new badges
        if (response.data.newBadges && response.data.newBadges.length > 0) {
          const badgeMessage = `🎉 Congratulations! You earned ${response.data.newBadges.length} new badge${response.data.newBadges.length > 1 ? 's' : ''}!`;
          setSuccess(badgeMessage);
          
          // Show confetti for major achievements (multiple badges or special badges)
          if (response.data.newBadges.length >= 2) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
          
          // Show individual achievement notifications with special styling
          response.data.newBadges.forEach((badge, index) => {
            setTimeout(() => {
              showAchievement(badge, 6000); // Show for 6 seconds
            }, index * 1500); // Stagger notifications by 1.5 seconds
          });
        }

        // Show challenge completion notifications
        if (response.data.completedChallenges && response.data.completedChallenges.length > 0) {
          response.data.completedChallenges.forEach((challenge, index) => {
            setTimeout(() => {
              const challengeType = challenge.target.type === 'steps' ? 'Steps' :
                                   challenge.target.type === 'calories' ? 'Calories' :
                                   challenge.target.type === 'distance' ? 'Distance' :
                                   challenge.target.type === 'exerciseTime' ? 'Exercise Time' : 'Points';
              showSuccess(
                `🎯 Challenge Complete! ${challengeType} challenge (+${challenge.pointsReward} points)`,
                5000
              );
            }, (response.data.newBadges?.length || 0) * 1000 + index * 1000);
          });
        }

        // Show streak milestone bonus notification with special celebration
        if (response.data.streakMilestoneBonus && response.data.streakMilestoneBonus > 0) {
          setTimeout(() => {
            // Show confetti for major milestones
            if (response.data.streakMilestoneBonus >= 200) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }
            
            // Determine milestone message
            let milestoneMessage = '';
            if (response.data.streakMilestoneBonus >= 500) {
              milestoneMessage = '🎉 100 Day Streak! LEGENDARY!';
            } else if (response.data.streakMilestoneBonus >= 300) {
              milestoneMessage = '🏆 60 Day Streak! INCREDIBLE!';
            } else if (response.data.streakMilestoneBonus >= 200) {
              milestoneMessage = '⭐ 30 Day Streak! AMAZING!';
            } else if (response.data.streakMilestoneBonus >= 100) {
              milestoneMessage = '🔥 14 Day Streak! GREAT JOB!';
            } else {
              milestoneMessage = '💪 7 Day Streak! KEEP IT UP!';
            }
            
            showSuccess(
              `${milestoneMessage} +${response.data.streakMilestoneBonus} bonus points!`,
              6000
            );
          }, ((response.data.newBadges?.length || 0) + (response.data.completedChallenges?.length || 0)) * 1000);
        }
        
        await loadTodayActivity();
      } else {
        const errorMessage = response.message || 'Failed to save activity';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Confetti active={showConfetti} duration={3000} />
      <div className="animate-fadeIn">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Log Activity
          </h1>
          {todayActivity && todayActivity.activityCount > 0 && (
            <p className="text-sm text-gray-600">
              Today's total: {formatNumber(todayActivity.steps)} steps, {todayActivity.distance.toFixed(1)} km, {todayActivity.exerciseTime} min, {formatNumber(todayActivity.calories)} cal
              {todayActivity.activityCount > 1 && ` (${todayActivity.activityCount} activities)`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            {/* Activity Templates */}
            <Card title="Quick Templates" className="mb-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Choose a template to fill the form:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACTIVITY_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          steps: template.steps.toString(),
                          distance: template.distance.toString(),
                          exerciseTime: template.exerciseTime.toString(),
                          calories: template.calories.toString(),
                        });
                        showSuccess(`${template.name} template applied!`);
                      }}
                      className="p-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-all text-left"
                    >
                      <div className="text-2xl mb-1">{template.icon}</div>
                      <div className="text-sm font-semibold text-gray-800">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick Presets:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          steps: preset.steps.toString(),
                          distance: preset.distance.toString(),
                          exerciseTime: preset.exerciseTime.toString(),
                          calories: preset.calories.toString(),
                        });
                        showSuccess(`${preset.name} preset applied!`);
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {success}
                  </div>
                )}

                <Input
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Steps"
                    type="number"
                    name="steps"
                    value={formData.steps}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />

                  <Input
                    label="Distance (km)"
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Exercise Time (minutes)"
                    type="number"
                    name="exerciseTime"
                    value={formData.exerciseTime}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />

                  <Input
                    label="Calories"
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loading size="sm" /> : 'Add Activity'}
                </Button>
              </form>
            </Card>
          </div>

          <div>
            <Card title="Estimated Points" className="lg:sticky lg:top-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2 animate-pulse-slow">
                  {estimatedPoints}
                </div>
                <p className="text-gray-600 font-medium mb-4">Points you'll earn</p>
                <div className="mt-4 text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>🚶 Steps:</span>
                    <span className="font-semibold">
                      {Math.min(Math.floor((parseFloat(formData.steps) || 0) / 100), POINTS_RULES.steps.max)} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>📍 Distance:</span>
                    <span className="font-semibold">
                      {Math.min(Math.floor((parseFloat(formData.distance) || 0) * 10), POINTS_RULES.distance.max)} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>⏱️ Exercise:</span>
                    <span className="font-semibold">
                      {Math.min(Math.floor((parseFloat(formData.exerciseTime) || 0) * 2), POINTS_RULES.exerciseTime.max)} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🔥 Calories:</span>
                    <span className="font-semibold">
                      {Math.min(Math.floor((parseFloat(formData.calories) || 0) / 10), POINTS_RULES.calories.max)} pts
                    </span>
                  </div>
                  {(() => {
                    const activeTypes = [
                      parseFloat(formData.steps) > 0,
                      parseFloat(formData.distance) > 0,
                      parseFloat(formData.exerciseTime) > 0,
                      parseFloat(formData.calories) > 0,
                    ].filter(Boolean).length;
                    
                    if (activeTypes >= 2) {
                      return (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-accent font-semibold">⭐ Activity Bonus ({activeTypes} types):</span>
                            <span className="text-accent font-bold">
                              +{POINTS_RULES.activityBonus + (activeTypes === 4 ? POINTS_RULES.allTypesBonus : 0)} pts
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                {estimatedPoints > 0 && (
                  <div className="mt-4 p-3 bg-primary-light rounded-lg">
                    <p className="text-xs text-gray-700">
                      💡 Tip: Complete 2+ activity types to earn bonus points! (e.g., Swimming doesn't need steps, Yoga doesn't need distance)
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivityEntry;

