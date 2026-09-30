import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileCheck2,
  User,
  Clock,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Send,
  Building2,
  FileText,
  ShieldCheck,
  History,
  FileCheck,
} from 'lucide-react';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const OfficerReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decision Form
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/applications/${id}`);
      if (res.data.success) {
        setApplication(res.data.data);
        setStatus(res.data.data.status);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch application');
      navigate('/officer/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleUpdateStatus = async (overrideStatus = null) => {
    const targetStatus = overrideStatus || status;

    if (!targetStatus) {
      toast.warning('Please select a valid status.');
      return;
    }

    if (
      (targetStatus === 'Rejected' || targetStatus === 'Additional Information Required') &&
      !remarks.trim()
    ) {
      toast.warning('Please provide remarks/reason for this decision.');
      return;
    }

    try {
      setUpdating(true);
      const res = await api.patch(`/applications/${id}/status`, {
        status: targetStatus,
        remarks: remarks.trim(),
      });

      if (res.data.success) {
        setApplication(res.data.data);
        setStatus(res.data.data.status);
        setRemarks('');
        toast.success(
          `Status updated to "${targetStatus}" & synced through Department Interop Gateway`
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-sm text-slate-600">Loading scrutiny dossier...</p>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/officer/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Application Queue</span>
        </Link>
      </div>

      {/* Main Dossier Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-sm font-black text-gov-navy bg-slate-100 px-2.5 py-1 rounded">
                {application.applicationId}
              </span>
              <StatusBadge status={application.status} size="md" />
            </div>

            <h1 className="text-xl font-bold text-slate-900">{application.service?.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Citizen: <strong>{application.formData?.personalInfo?.fullName || application.user?.name}</strong> •
              Submitted: {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right sm:text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Department External Ref
            </span>
            <span className="font-mono text-xs font-bold text-gov-blue">
              {application.interopReferenceId || 'SYNCED-ON-GATEWAY'}
            </span>
          </div>
        </div>
      </div>

      {/* Scrutiny Action Decision Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-gov-navy text-white rounded-2xl p-6 shadow-gov space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-gov-saffron" />
            Officer Decision & Interoperability Sync
          </h2>
          <span className="text-xs text-slate-300">
            Assigned Officer: <span className="font-semibold text-white">{user?.name}</span>
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Decisions taken here will append an immutable timestamped log entry into the citizen's
          timeline, dispatch an in-app alert, and update the state department ledger over REST.
        </p>

        {/* Quick Action Decision Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleUpdateStatus('Under Review')}
            disabled={updating}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Mark Under Review</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('Additional Information Required')}
            disabled={updating}
            className="px-3 py-1.5 bg-orange-600/80 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Request Additional Info</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('Approved')}
            disabled={updating}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Application</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('Rejected')}
            disabled={updating}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Application</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('Completed')}
            disabled={updating}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mark Completed</span>
          </button>
        </div>

        {/* Remarks Form */}
        <div className="pt-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Officer Remarks / Scrutiny Justification:
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            placeholder="Add detailed scrutiny notes, missing document instructions, or approval certification reference..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-saffron focus:bg-white/15"
          />
        </div>
      </div>

      {/* Grid: Applicant Details & Attached Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicant Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-gov-blue" />
            Citizen Profile & Identity
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Applicant Name</span>
              <span className="font-semibold text-slate-800">
                {application.formData?.personalInfo?.fullName || application.user?.name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile</span>
              <span className="font-semibold text-slate-800">
                {application.formData?.personalInfo?.mobile || application.user?.phone || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Email</span>
              <span className="font-semibold text-slate-800 truncate block">
                {application.formData?.personalInfo?.email || application.user?.email}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">City, State</span>
              <span className="font-semibold text-slate-800">
                {application.formData?.personalInfo?.city},{' '}
                {application.formData?.personalInfo?.state}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[11px]">Address</span>
              <span className="font-medium text-slate-700">
                {application.formData?.personalInfo?.address || 'N/A'} -{' '}
                {application.formData?.personalInfo?.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Service Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-gov-saffron" />
            Submitted Service Parameters
          </h3>

          {application.formData?.serviceDetails &&
          Object.keys(application.formData.serviceDetails).length > 0 ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(application.formData.serviceDetails).map(([key, val]) => (
                <div key={key}>
                  <span className="text-slate-400 block text-[11px] capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-semibold text-slate-800">{String(val)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No custom fields filled.</p>
          )}
        </div>
      </div>

      {/* Uploaded Documents Scrutiny */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          Uploaded Verification Documents ({application.documents?.length || 0})
        </h3>

        {application.documents?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {application.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <div className="truncate mr-2">
                  <p className="font-bold text-slate-800 truncate">{doc.documentType}</p>
                  <p className="text-[11px] text-slate-500 truncate">{doc.originalName}</p>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-gov-blue hover:border-gov-blue rounded-lg transition flex items-center gap-1 flex-shrink-0 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Inspect & Download</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No files attached to this application.</p>
        )}
      </div>

      {/* Historical Audit Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <History className="w-4 h-4 text-gov-blue" />
          Application Audit Trail & Timeline History
        </h3>

        <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 my-2 ml-2 text-xs">
          {application.timeline?.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-white" />
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{step.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(step.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Actor: {step.performedByName} • Node: {step.department}
                </div>
                {step.remarks && (
                  <p className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 mt-1">
                    {step.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficerReview;
