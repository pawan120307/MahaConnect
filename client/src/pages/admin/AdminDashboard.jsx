import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Layers,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  ArrowRight,
  TrendingUp,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';
import api from '../../api/axios';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/admin');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const statusMap = data?.statusBreakdown || {};
  const deptDist = data?.departmentDistribution || [];
  const topServices = data?.topServices || [];
  const interop = data?.interopHealth || {};

  const statCards = [
    {
      title: 'Total Citizens',
      count: summary.totalCitizens || 0,
      icon: Users,
      color: 'bg-blue-600',
      lightBg: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      title: 'Active Departments',
      count: summary.totalDepartments || 0,
      icon: Building2,
      color: 'bg-indigo-600',
      lightBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    },
    {
      title: 'Integrated Services',
      count: summary.totalServices || 0,
      icon: Layers,
      color: 'bg-purple-600',
      lightBg: 'bg-purple-50 border-purple-200 text-purple-900',
    },
    {
      title: 'Total Applications',
      count: summary.totalApplications || 0,
      icon: FileText,
      color: 'bg-slate-800',
      lightBg: 'bg-slate-100 border-slate-300 text-slate-900',
    },
    {
      title: 'Pending Processing',
      count: summary.pendingApplications || 0,
      icon: Clock,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      title: 'Approved / Completed',
      count: summary.approvedApplications || 0,
      icon: CheckCircle,
      color: 'bg-emerald-600',
      lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      title: 'Rejected',
      count: summary.rejectedApplications || 0,
      icon: XCircle,
      color: 'bg-rose-600',
      lightBg: 'bg-rose-50 border-rose-200 text-rose-900',
    },
    {
      title: 'Assigned Officers',
      count: summary.totalOfficers || 0,
      icon: Users,
      color: 'bg-teal-600',
      lightBg: 'bg-teal-50 border-teal-200 text-teal-900',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gov-navy text-white rounded-2xl p-6 sm:p-8 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gov-saffron text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            MahaConnect State Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Overview & Gateway Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Real-time monitoring of cross-departmental transactions, service utilization, and
            interoperability health.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            to="/admin/api-logs"
            className="px-4 py-2.5 bg-gov-saffron hover:bg-gov-saffronDark text-gov-navy font-bold rounded-xl shadow transition text-xs flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Monitor API Logs</span>
          </Link>
          <Link
            to="/admin/services"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition text-xs"
          >
            Manage Services
          </Link>
        </div>
      </div>

      {/* Interoperability Gateway Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-900 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
              <Zap className="w-6 h-6 text-gov-saffron" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Government API Interoperability Engine</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Operational
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-Department REST Gateway actively syncing Transport, Revenue, Education, and
                Municipal nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center border-t sm:border-t-0 sm:border-l border-indigo-900/60 pt-3 sm:pt-0 sm:pl-6">
            <div>
              <p className="text-xl font-black text-white">{interop.totalCalls || 0}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Gateway Calls</p>
            </div>
            <div>
              <p className="text-xl font-black text-emerald-400">{interop.successRate || 100}%</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Success Rate</p>
            </div>
            <div>
              <p className="text-xl font-black text-gov-saffron">{interop.avgLatencyMs || 45}ms</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Latency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary 8 Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between transition hover:shadow-md ${card.lightBg}`}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  {card.title}
                </p>
                <h3 className="text-2xl font-black mt-1">{card.count}</h3>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm flex-shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gov-blue" />
              Applications by Department
            </h3>
            <span className="text-xs text-slate-400">Total: {summary.totalApplications}</span>
          </div>

          <div className="space-y-3 pt-2">
            {deptDist.length > 0 ? (
              deptDist.map((dept, idx) => {
                const total = summary.totalApplications || 1;
                const percentage = Math.round((dept.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800">{dept.departmentName}</span>
                      <span className="text-slate-500 font-mono">
                        {dept.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gov-blue h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">No departmental distribution yet</p>
            )}
          </div>
        </div>

        {/* Status Breakdown Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <Activity className="w-4 h-4 text-gov-saffron" />
              Application Lifecycle Distribution
            </h3>
            <span className="text-xs text-slate-400">Status Workflow</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Submitted', count: statusMap['Submitted'] || 0, color: 'bg-blue-500' },
              {
                label: 'Under Review',
                count: statusMap['Under Review'] || 0,
                color: 'bg-amber-500',
              },
              {
                label: 'Action Required',
                count: statusMap['Additional Information Required'] || 0,
                color: 'bg-orange-500',
              },
              { label: 'Approved', count: statusMap['Approved'] || 0, color: 'bg-emerald-500' },
              { label: 'Completed', count: statusMap['Completed'] || 0, color: 'bg-teal-500' },
              { label: 'Rejected', count: statusMap['Rejected'] || 0, color: 'bg-rose-500' },
            ].map((st, i) => {
              const total = summary.totalApplications || 1;
              const percentage = Math.round((st.count / total) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{st.label}</span>
                    <span className="text-slate-500 font-mono">
                      {st.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${st.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Utilized Services */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Most Utilized Government Services
          </h3>
          <Link to="/admin/services" className="text-xs font-semibold text-gov-accent hover:underline">
            View All Services →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {topServices.map((svc, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rank #{idx + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-0.5">{svc.serviceName}</h4>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-gov-blue">{svc.count}</span>
                <span className="text-[10px] text-slate-500 block">applications</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
