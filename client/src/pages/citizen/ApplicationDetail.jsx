import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ArrowLeft,
  ShieldCheck,
  User,
  ExternalLink,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

const standardTimelineSteps = [
  'Submitted',
  'Department Received',
  'Under Review',
  'Approved',
  'Completed',
];

const ApplicationDetail = () => {
  const { id } = useParams();
  const toast = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/applications/${id}`);
        if (res.data.success) {
          setApplication(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-sm text-slate-600">Retrieving application history from gateway...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Application Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested application ID does not exist or you lack permission to view it.
        </p>
        <Link
          to="/applications"
          className="px-4 py-2 bg-gov-blue text-white text-xs font-semibold rounded-lg hover:bg-gov-navy transition"
        >
          Back to My Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Back Link + Print Button */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Status Receipt</span>
        </button>
      </div>

      {/* Main Header Card */}
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
              Department: {application.department?.name}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right sm:text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Department Ledger Ref
            </span>
            <span className="font-mono text-xs font-bold text-gov-blue">
              {application.interopReferenceId || 'GATEWAY-DISPATCHED'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Submitted: {new Date(application.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Status Notice if Additional Information is Required */}
      {application.status === 'Additional Information Required' && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Action Required from Citizen:</strong>
            <p className="mt-0.5">{application.remarks || 'Please provide clarified documentation as requested by the department officer.'}</p>
          </div>
        </div>
      )}

      {/* Visual Tracking Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gov-navy mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gov-saffron" />
          Application Processing Lifecycle Timeline
        </h2>

        {/* Chronological Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 my-4 ml-3 sm:ml-4">
          {application.timeline?.map((step, index) => {
            const isApproved = step.status === 'Approved' || step.status === 'Completed';
            const isRejected = step.status === 'Rejected';
            const isWarning = step.status === 'Additional Information Required';

            const dotColor = isApproved
              ? 'bg-emerald-500 ring-4 ring-emerald-100'
              : isRejected
              ? 'bg-rose-500 ring-4 ring-rose-100'
              : isWarning
              ? 'bg-amber-500 ring-4 ring-amber-100'
              : 'bg-gov-blue ring-4 ring-blue-100';

            return (
              <div key={index} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full ${dotColor}`}
                />

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 transition group-hover:border-slate-300 group-hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{step.action}</span>
                      <StatusBadge status={step.status} size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(step.timestamp).toLocaleDateString()} at{' '}
                      {new Date(step.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">Node:</span> {step.department} •{' '}
                    <span className="font-semibold text-slate-700">Actor:</span>{' '}
                    {step.performedByName || 'System Gateway'}
                  </div>

                  {step.remarks && (
                    <div className="mt-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                      <span className="font-semibold text-slate-900 block text-[11px] mb-0.5">
                        Officer Remarks / Details:
                      </span>
                      {step.remarks}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Applicant & Service Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-gov-blue" />
            Applicant Profile Data
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Full Name</span>
              <span className="font-semibold text-slate-800">
                {application.formData?.personalInfo?.fullName || application.user?.name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile Number</span>
              <span className="font-semibold text-slate-800">
                {application.formData?.personalInfo?.mobile || application.user?.phone || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Email Address</span>
              <span className="font-semibold text-slate-800 truncate block">
                {application.formData?.personalInfo?.email || application.user?.email}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">City / State</span>
              <span className="font-semibold text-slate-800">
                {application.formData?.personalInfo?.city},{' '}
                {application.formData?.personalInfo?.state}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[11px]">Residential Address</span>
              <span className="font-medium text-slate-700">
                {application.formData?.personalInfo?.address || 'N/A'} -{' '}
                {application.formData?.personalInfo?.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* Service-Specific Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-gov-saffron" />
            Service Parameters
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
            <p className="text-xs text-slate-500 italic">Standard service submission</p>
          )}
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          Attached Verification Documents ({application.documents?.length || 0})
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
                  <span>View</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No external document files attached.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
