import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Search,
  Filter,
  Eye,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

const statusList = [
  'all',
  'Submitted',
  'Under Review',
  'Additional Information Required',
  'Approved',
  'Rejected',
  'Completed',
];

const OfficerApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchDepartmentApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;

      const res = await api.get('/applications/department', { params });
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDepartmentApplications();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded uppercase">
            {user?.department?.name || 'Department'} Queue
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gov-navy mt-1">Application Management Queue</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Scrutinize citizen submissions, inspect uploaded identity documents, and assign
          department decisions
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Application ID or Citizen Name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-gov-blue focus:bg-white"
          >
            <option value="all">All Department Statuses</option>
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

      {/* Applications Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Citizen Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gov-navy whitespace-nowrap">
                      {app.applicationId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {app.user?.name || app.formData?.personalInfo?.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {app.user?.phone || app.formData?.personalInfo?.mobile || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{app.service?.name}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/officer/applications/${app.applicationId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg shadow-sm transition"
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
          icon={FileCheck2}
          title="No applications in queue"
          description="There are no applications matching your current filter criteria."
        />
      )}
    </div>
  );
};

export default OfficerApplications;
