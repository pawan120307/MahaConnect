import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setResetToken(res.data.resetToken);
        toast.success('Password reset token generated.');
      }
    } catch (err) {
      setError(err.message || 'Failed to process password reset request.');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gov-navy text-white rounded-xl flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-6 h-6 text-gov-saffron" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gov-navy">
              Reset Your Password
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Enter your registered citizen or officer email to generate a reset token
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetToken ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">Reset Token Generated</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                In production, an automated email verification link is sent. For local evaluation,
                your secure reset token is ready:
              </p>
              <div className="p-2.5 bg-white border border-emerald-300 rounded-lg font-mono text-xs text-slate-800 break-all select-all">
                {resetToken}
              </div>
              <button
                onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                Proceed to Set New Password →
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. citizen@demo.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'Generate Reset Token'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
