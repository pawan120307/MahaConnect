import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2,
  ArrowRight,
  Eye,
  Filter,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import api from '../../api/axios';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficerStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/officer');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load officer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficerStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Applications',
      count: stats?.total || 0,
      icon: FileCheck2,
      color: 'bg-blue-600',
      lightBg: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      title: 'Pending Review',
      count: stats?.pending || 0,
      icon: Clock,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      title: 'Action / Clarification Needed',
      count: stats?.requiringAction || 0,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      lightBg: 'bg-orange-50 border-orange-200 text-orange-900',
    },
    {
      title: 'Approved / Completed',
      count: stats?.approved || 0,
      icon: CheckCircle,
      color: 'bg-emerald-600',
      lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Department Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-[#163a69] to-gov-blue text-white rounded-2xl p-6 sm:p-8 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gov-saffron text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              {user?.department?.name || 'Department Desk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Officer Scrutiny Console
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              Welcome, Officer {user?.name}. Review submissions, verify uploaded certificates, and
              sync state ledger decisions.
            </p>
          </div>

          <Link
            to="/officer/applications"
            className="px-5 py-3 bg-gov-saffron hover:bg-gov-saffronDark text-gov-navy font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm flex-shrink-0"
          >
            <span>Review Scrutiny Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition hover:shadow-md ${card.lightBg}`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{card.title}</p>
                <h3 className="text-3xl font-extrabold mt-1">{card.count}</h3>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center shadow`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applications in Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gov-navy flex items-center gap-2">
            <Clock className="w-5 h-5 text-gov-blue" />
            Recent Applications Requiring Action
          </h2>
          <Link
            to="/officer/applications"
            className="text-xs font-semibold text-gov-accent hover:underline flex items-center gap-1"
          >
            Open Full Queue →
          </Link>
        </div>

        {stats?.recentApplications?.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Citizen Name</th>
                    <th className="py-3 px-4">Requested Service</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Scrutiny Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-gov-navy whitespace-nowrap">
                        {app.applicationId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {app.user?.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{app.service?.name}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/officer/applications/${app.applicationId}`}
                          className="px-3.5 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Scrutinize</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="Queue is all clear!"
            description="There are currently no pending applications in your department queue."
          />
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
