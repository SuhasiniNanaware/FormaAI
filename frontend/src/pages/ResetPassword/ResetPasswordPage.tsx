import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!token) {
      setError('Invalid password reset link.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await API.post('/reset-password', {
        token,
        newPassword: password,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);

      setError(
        err.response?.data?.message ||
        'Unable to reset password. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card glow className="w-full max-w-md p-8 text-center">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Password Reset Successful
          </h1>

          <p className="text-sm text-slate-400 mt-3">
            Your password has been updated successfully.
            You can now sign in with your new password.
          </p>

          <Button
            className="w-full mt-6"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>

        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        <Card glow className="p-8">

          <div className="text-center mb-6">

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Reset Password
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Create a new password for your Forma AI account.
            </p>

          </div>

          <form
            onSubmit={handleReset}
            className="space-y-5"
          >

            {/* New Password */}
            <div className="space-y-1.5">

              <label className="text-sm font-medium text-slate-300">
                New Password
              </label>

              <div className="relative">

                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">

              <label className="text-sm font-medium text-slate-300">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

          </form>

        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;