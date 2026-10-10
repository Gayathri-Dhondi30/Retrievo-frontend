import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import FormField from '../components/common/FormField';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user?.fullName}!`, 'success');
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-brand-cream border border-brand-caramel/20 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark p-2.5 mx-auto shadow-md flex items-center justify-center">
            <img src="/logo.svg" alt="Retrievo Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Sign in to Retrievo</h1>
          <p className="text-xs text-brand-muted">
            Access your lost reports, active matches, and secure messages.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email Address"
            id="email"
            type="email"
            required
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            required
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-brand-muted cursor-pointer">
              <input type="checkbox" className="rounded-md text-brand-caramel border-brand-caramel/30" />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="font-bold text-brand-caramel hover:text-brand-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-brand-dark text-white font-bold text-sm shadow-md hover:bg-brand-secondary transform active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4 text-brand-caramel" />
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-brand-muted pt-4 border-t border-brand-beige">
          Don’t have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-caramel hover:text-brand-dark">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
