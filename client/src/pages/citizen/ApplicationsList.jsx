import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Clock,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const statusList = [
  'all',
  'Submitted',
  'Under Review',
  'Additional Information Required',
  'Approved',
  'Rejected',
  'Completed',
];

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;

      const res = await api.get('/applications/my', { params });
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-navy">My Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track status, scrutinies, and decision timelines of your submitted government service
            requests
          </p>
        </div>

        <Link
          to="/services"
          className="px-4 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          + New Application
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Application ID (e.g. MC-2026-000101)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-gov-blue focus:bg-white"
          >
            <option value="all">All Application Statuses</option>
            {statusList
              .filter((s) => s !== 'all')
              .map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gov-navy whitespace-nowrap">
                      {app.applicationId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {app.service?.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {app.department?.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/applications/${app.applicationId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track</span>
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
          icon={FileText}
          title="No applications found"
          description="There are no applications matching your search query or status filter."
          action={
            <Link
              to="/services"
              className="px-4 py-2 bg-gov-blue text-white text-xs font-semibold rounded-lg shadow hover:bg-gov-navy transition inline-block"
            >
              Browse Services
            </Link>
          }
        />
      )}
    </div>
  );
};

export default ApplicationsList;
