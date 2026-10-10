import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import FormField from '../components/common/FormField';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!token) {
      setErrorMsg('Missing password reset token.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await api.post('/auth/reset-password', { token, newPassword: password });
      showToast('Password reset successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset token expired or invalid.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-brand-cream border border-brand-caramel/20 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-beige text-brand-caramel p-2.5 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Set New Password</h1>
          <p className="text-xs text-brand-muted">
            Enter a strong new password for your Retrievo account.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="New Password"
            id="password"
            type="password"
            required
            icon={Lock}
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormField
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            required
            icon={Lock}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-brand-caramel text-white font-bold text-sm shadow-md hover:bg-brand-secondary transform active:scale-95 transition-all"
          >
            {submitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center text-xs text-brand-muted pt-4 border-t border-brand-beige">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-brand-dark hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
