// Profile page
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { userService } from '../services/user.service';
import { activityService } from '../services/activity.service';
import { GOAL_OPTIONS } from '../utils/constants';
import { getGoalLabel } from '../utils/helpers';
import { calculateBMI, getBMICategory, formatNumber } from '../utils/helpers';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'general_fitness',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bmiHistory, setBmiHistory] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData({
          age: response.data.age || '',
          weight: response.data.weight || '',
          height: response.data.height || '',
          goal: response.data.goal || 'general_fitness',
        });

        // Calculate current BMI if weight and height are available
        if (response.data.weight && response.data.height) {
          const currentBMI = calculateBMI(response.data.weight, response.data.height);
          if (currentBMI) {
            setBmiHistory([
              { date: new Date(), bmi: parseFloat(currentBMI) },
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updateData = {
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        goal: formData.goal,
      };

      const response = await userService.updateProfile(updateData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        await loadProfile();
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setSaving(false);
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

  const bmi = profile?.weight && profile?.height
    ? calculateBMI(profile.weight, profile.height)
    : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <Layout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card title="Personal Information">
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile?.username || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="13"
                    max="120"
                  />

                  <Input
                    label="Weight (kg)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="20"
                    max="300"
                    step="0.1"
                  />
                </div>

                <Input
                  label="Height (cm)"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  step="0.1"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {GOAL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? <Loading size="sm" /> : 'Update Profile'}
                </Button>
              </form>
            </Card>
          </div>

          <div>
            <Card title="Statistics">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatNumber(profile?.totalPoints || 0)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-secondary">
                    Level {profile?.currentLevel || 1}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Streak Days</p>
                  <p className="text-2xl font-bold text-accent">
                    {profile?.streakDays || 0} days
                  </p>
                </div>

                {bmi && (
                  <div>
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-2xl font-bold text-gray-800">{bmi}</p>
                    <p className="text-sm text-gray-500">{bmiCategory}</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            bmi < 18.5
                              ? 'bg-blue-500'
                              : bmi < 25
                              ? 'bg-green-500'
                              : bmi < 30
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${Math.min((parseFloat(bmi) / 40) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Normal range: 18.5 - 24.9
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Goal</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {getGoalLabel(profile?.goal || 'general_fitness')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

