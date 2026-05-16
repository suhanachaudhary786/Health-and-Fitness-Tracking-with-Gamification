// Forgot Password page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { authService } from '../services/auth.service';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: New password
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(''); // For demo purposes
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // Step 1: Request reset code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.forgotPassword(formData.email);

      if (result.success) {
        setSuccess('Reset code has been generated!');
        // For demo: show the reset token (in production, this would be sent via email)
        if (result.resetToken) {
          setResetToken(result.resetToken);
        }
        setStep(2);
      } else {
        setError(result.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }

    setLoading(false);
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.resetCode) {
      setError('Please enter the reset code');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.verifyResetToken(formData.email, formData.resetCode);

      if (result.success) {
        setSuccess('Code verified! Please enter your new password.');
        setStep(3);
      } else {
        setError(result.message || 'Invalid reset code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code');
    }

    setLoading(false);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.resetPassword(
        formData.email,
        formData.resetCode,
        formData.newPassword
      );

      if (result.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the reset code sent to your email'}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}>
              3
            </div>
          </div>
        </div>

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

        {/* Demo: Show reset token */}
        {resetToken && step === 2 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg">
            <p className="text-sm font-medium mb-1">Demo Mode - Reset Code:</p>
            <p className="text-2xl font-bold text-center tracking-widest">{resetToken}</p>
            <p className="text-xs mt-2 text-yellow-600">
              In production, this code would be sent to your email.
            </p>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleRequestCode}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mb-4"
            >
              {loading ? <Loading size="sm" /> : 'Send Reset Code'}
            </Button>
          </form>
        )}

        {/* Step 2: Verify Code Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <Input
              label="Reset Code"
              type="text"
              name="resetCode"
              value={formData.resetCode}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mb-4"
            >
              {loading ? <Loading size="sm" /> : 'Verify Code'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setStep(1);
                setResetToken('');
                setFormData({ ...formData, resetCode: '' });
              }}
              className="w-full"
            >
              Back to Email
            </Button>
          </form>
        )}

        {/* Step 3: New Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mb-4"
            >
              {loading ? <Loading size="sm" /> : 'Reset Password'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-primary hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
