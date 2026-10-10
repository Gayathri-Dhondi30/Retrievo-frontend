import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import FormField from '../components/common/FormField';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required.';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (res.success) {
        showToast('Account created successfully! Welcome to Retrievo.', 'success');
        navigate('/dashboard');
      } else {
        setErrors({ general: res.message });
      }
    } catch (err) {
      setErrors({ general: 'Registration failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-brand-cream border border-brand-caramel/20 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark p-2.5 mx-auto shadow-md flex items-center justify-center">
            <img src="/logo.svg" alt="Retrievo Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Create Retrievo Account</h1>
          <p className="text-xs text-brand-muted">
            Register with any valid email address (Gmail, Yahoo, Outlook, work, or student email).
          </p>
        </div>

        {errors.general && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            id="fullName"
            required
            icon={User}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Email Address"
              id="email"
              type="email"
              required
              icon={Mail}
              placeholder="you@example.com"
              helpText="Any valid email address format is accepted."
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <FormField
              label="Phone Number (Optional)"
              id="phone"
              type="tel"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Password"
              id="password"
              type="password"
              required
              icon={Lock}
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <FormField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              required
              icon={Lock}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-brand-caramel text-white font-bold text-sm shadow-md hover:bg-brand-secondary transform active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-brand-muted pt-4 border-t border-brand-beige">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-dark hover:text-brand-caramel">
            Sign in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
