import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  PlusCircle,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import api from '../../api/axios';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, servicesRes, notifRes] = await Promise.all([
          api.get('/analytics/citizen'),
          api.get('/services?limit=4'),
          api.get('/notifications?limit=3'),
        ]);

        if (statsRes.data.success) {
          setAnalytics(statsRes.data.data);
        }
        if (servicesRes.data.success) {
          setFeaturedServices(servicesRes.data.data.slice(0, 4));
        }
        if (notifRes.data.success) {
          setNotifications(notifRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load citizen dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
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
      count: analytics?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    {
      title: 'Under Processing',
      count: analytics?.pending || 0,
      icon: Clock,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50 border-amber-200 text-amber-800',
    },
    {
      title: 'Approved',
      count: analytics?.approved || 0,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
    {
      title: 'Rejected',
      count: analytics?.rejected || 0,
      icon: XCircle,
      color: 'bg-rose-500',
      lightBg: 'bg-rose-50 border-rose-200 text-rose-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-2xl p-6 sm:p-8 shadow-gov flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-gov-saffron text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Citizen Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaskar, {user?.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-200 max-w-xl">
            Welcome to your unified MahaConnect dashboard. Access all departmental services, track
            live verification stages, and download approved certificates.
          </p>
        </div>

        <Link
          to="/services"
          className="px-5 py-3 bg-gov-saffron hover:bg-gov-saffronDark text-gov-navy font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for New Service</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition hover:shadow-md ${stat.lightBg}`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-extrabold mt-1">{stat.count}</h3>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center shadow`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Recent Applications & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gov-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-gov-blue" />
              Recently Submitted Applications
            </h2>
            <Link
              to="/applications"
              className="text-xs font-semibold text-gov-accent hover:underline flex items-center gap-1"
            >
              View all ({analytics?.total || 0}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {analytics?.recentApplications?.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gov-navy bg-slate-100 px-2 py-0.5 rounded">
                        {app.applicationId}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {app.service?.name || 'Government Service'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Department: {app.department?.name || 'Department System'} • Submitted:{' '}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    to={`/applications/${app.applicationId}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-gov-blue hover:text-white border border-gov-blue hover:bg-gov-blue rounded-lg transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No applications submitted yet"
              description="You haven't submitted any service applications through MahaConnect yet."
              action={
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gov-blue text-white text-xs font-semibold rounded-lg hover:bg-gov-navy transition shadow"
                >
                  <PlusCircle className="w-4 h-4" /> Browse Catalog & Apply
                </Link>
              }
            />
          )}
        </div>

        {/* Right 1 Col: Recent In-App Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gov-navy flex items-center gap-2">
              <Bell className="w-5 h-5 text-gov-saffron" />
              Recent Updates
            </h2>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-gov-accent hover:underline"
            >
              All Alerts
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 divide-y divide-slate-100 shadow-sm">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif._id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="inline-block text-[11px] font-semibold text-gov-accent hover:underline mt-1.5"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent alerts</p>
            )}
          </div>

          {/* Quick Help Card */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-gov-navy font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Interoperability Guarantee</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Applications submitted on MahaConnect are cryptographically logged and securely
              forwarded to departmental processing queues via authenticated REST pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access to Government Services */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gov-navy">
              Quick Launch: Popular Citizen Services
            </h2>
            <p className="text-xs text-slate-500">
              Frequently requested e-services available with instant dynamic forms
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-semibold text-gov-accent hover:underline"
          >
            Explore all services →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredServices.map((svc) => (
            <div
              key={svc._id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded uppercase">
                  {svc.category || 'General'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
                  {svc.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {svc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{svc.processingTime}</span>
                <Link
                  to={`/services/${svc._id}/apply`}
                  className="font-bold text-gov-blue hover:text-gov-navy hover:underline"
                >
                  Apply →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
