import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Shield, User, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'Citizen',
      email: 'citizen@demo.com',
      password: 'Password123!',
      badge: 'bg-blue-100 text-blue-800',
      description: 'Apply for services & track status',
    },
    {
      role: 'Transport Officer',
      email: 'officer@demo.com',
      password: 'Password123!',
      badge: 'bg-amber-100 text-amber-800',
      description: 'Review & approve applications',
    },
    {
      role: 'State Administrator',
      email: 'admin@demo.com',
      password: 'Password123!',
      badge: 'bg-purple-100 text-purple-800',
      description: 'System control & API logs',
    },
  ];

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    toast.info(`Filled credentials for ${acc.role}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.name}!`);

      // Determine redirect path
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedInUser.role === 'officer') {
        navigate('/officer/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 bg-gov-navy text-white rounded-xl flex items-center justify-center mx-auto shadow-md">
              <LogIn className="w-6 h-6 text-gov-saffron" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gov-navy">
              MahaConnect Single Sign-On
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Enter your credentials to access the government service gateway
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                Demo Accounts for Viva & Evaluation
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                1-Click Autofill
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mb-3">
              Click any account below to autofill its demo credentials instantly:
            </p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow transition flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${acc.badge}`}>
                        {acc.role}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{acc.email}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{acc.description}</p>
                  </div>
                  <span className="text-xs text-amber-700 font-semibold opacity-0 group-hover:opacity-100 transition">
                    Use →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., citizen@demo.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-gov-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gov-blue hover:bg-gov-navy text-white text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to register */}
          <div className="text-center text-xs text-slate-600">
            Don't have a citizen account?{' '}
            <Link to="/register" className="font-semibold text-gov-accent hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
