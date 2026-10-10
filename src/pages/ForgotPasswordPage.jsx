import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import FormField from '../components/common/FormField';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      if (res.data?.resetToken) {
        setDevToken(res.data.resetToken);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not initiate password reset.');
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
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-dark">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-beige text-brand-caramel p-2.5 mx-auto flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Account Recovery</h1>
          <p className="text-xs text-brand-muted">
            Enter your registered email address to generate a secure reset token.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-950">Password Reset Requested</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If an account with that email exists, password reset instructions have been generated.
            </p>
            {devToken && (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-left space-y-1">
                <span className="text-[10px] font-bold text-amber-900 uppercase">Development Reset Link</span>
                <p className="text-xs text-amber-950 font-mono break-all">{`/reset-password?token=${devToken}`}</p>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="inline-block pt-1 text-xs font-bold text-amber-900 underline"
                >
                  Click here to proceed to Reset Form →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email Address"
              id="email"
              type="email"
              required
              icon={Mail}
              placeholder="you@domain.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-brand-dark text-white font-bold text-sm shadow-md hover:bg-brand-secondary transform active:scale-95 transition-all"
            >
              {submitting ? 'Generating Token...' : 'Request Password Reset'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
