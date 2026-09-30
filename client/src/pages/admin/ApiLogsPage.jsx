import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Code,
  X,
  Server,
  Zap,
  Cpu,
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

const ApiLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const toast = useToast();

  const fetchLogsAndStats = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      if (methodFilter !== 'all') params.method = methodFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const [logsRes, statsRes] = await Promise.all([
        api.get('/api-logs', { params }),
        api.get('/api-logs/stats'),
      ]);

      if (logsRes.data.success) {
        setLogs(logsRes.data.data);
        setTotalPages(logsRes.data.pages || 1);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to load API activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndStats();
  }, [search, methodFilter, statusFilter, page]);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear API audit logs?')) return;
    try {
      const res = await api.delete('/api-logs');
      if (res.data.success) {
        toast.success('API logs cleared');
        fetchLogsAndStats();
      }
    } catch (err) {
      toast.error('Failed to clear logs');
    }
  };

  const getMethodBadge = (method) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-800 border-blue-200',
      POST: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      PATCH: 'bg-amber-100 text-amber-800 border-amber-200',
      PUT: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      DELETE: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return (
      <span
        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
          colors[method] || 'bg-slate-100 text-slate-800'
        }`}
      >
        {method}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            Core Academic Interoperability Layer
          </div>
          <h1 className="text-2xl font-bold text-gov-navy flex items-center gap-2">
            <Activity className="w-6 h-6 text-gov-saffron" />
            Government API Interoperability & Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time audit log of REST messages exchanged between MahaConnect and Departmental
            Systems
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchLogsAndStats}
            className="p-2 bg-white border border-slate-300 text-slate-700 hover:text-gov-navy rounded-xl shadow-sm transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearLogs}
            className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Academic Demonstration Architecture Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-gov border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gov-saffron flex items-center gap-2">
            <Server className="w-4 h-4" />
            FSDM Interoperability Flow Architecture
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Protocol: REST / JSON / HTTP 2.0</span>
        </div>

        {/* Visual Flow diagram */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-blue-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Citizen Client
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <div className="flex items-center gap-1.5 text-gov-saffron font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-gov-saffron"></span> MahaConnect Gateway
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Transport API
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <div className="flex items-center gap-1.5 text-purple-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Revenue API
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Education API
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Every citizen application, document verification request, and status change triggers a
          simulated secure external REST call to the target department engine with response latency
          calculation, status validation, and audit recording.
        </p>
      </div>

      {/* Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Gateway Calls
            </span>
            <span className="text-2xl font-black text-gov-navy mt-1 block">
              {stats.totalCalls}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Success Delivery Rate
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {stats.successRate}%
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Average Network Latency
            </span>
            <span className="text-2xl font-black text-gov-saffron mt-1 block">
              {stats.latency?.avg || 45} ms
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Min / Max Hop Time
            </span>
            <span className="text-2xl font-black text-slate-700 mt-1 block font-mono">
              {stats.latency?.min || 20}ms / {stats.latency?.max || 110}ms
            </span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by endpoint, department, or application ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-44">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All HTTP Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : logs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Interop Route</th>
                  <th className="py-3 px-4">Method & Endpoint</th>
                  <th className="py-3 px-4">Status Code</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600">{log.source}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-gov-blue font-bold">{log.destination}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getMethodBadge(log.method)}
                        <span className="font-mono text-slate-700 text-[11px]">{log.endpoint}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          log.statusCode >= 200 && log.statusCode < 300
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          log.responseTime < 60 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {log.responseTime}ms
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPayload(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-gov-navy hover:text-white rounded-lg text-[11px] font-semibold text-slate-700 transition"
                      >
                        <Code className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No API transactions recorded yet"
          description="Submit an application or update application status to see live interoperability log dispatches."
        />
      )}

      {/* JSON Payload Inspection Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-fade-in border border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-gov-saffron" />
                <h3 className="text-sm font-bold">Interoperability Transaction Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedPayload(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 text-slate-300 font-mono bg-white/5 p-3 rounded-xl">
              <div>
                Route: <span className="text-white font-bold">{selectedPayload.source}</span> →{' '}
                <span className="text-gov-saffron font-bold">{selectedPayload.destination}</span>
              </div>
              <div>
                Endpoint: {selectedPayload.method} {selectedPayload.endpoint}
              </div>
              <div>Status: {selectedPayload.statusCode} • Latency: {selectedPayload.responseTime}ms</div>
              {selectedPayload.applicationId && (
                <div>Application ID: {selectedPayload.applicationId}</div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Request Payload:
              </h4>
              <pre className="p-3 bg-black/60 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-white/10">
                {JSON.stringify(selectedPayload.requestPayload, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Department Response Payload:
              </h4>
              <pre className="p-3 bg-black/60 rounded-xl text-xs font-mono text-sky-400 overflow-x-auto border border-white/10">
                {JSON.stringify(selectedPayload.responsePayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiLogsPage;
