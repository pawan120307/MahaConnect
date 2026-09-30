import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Building2,
  Trash2,
  FileCheck,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ApplyService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Step 1: Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dob: '1998-01-01',
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '',
  });

  // Step 2: Dynamic Service Details
  const [serviceDetails, setServiceDetails] = useState({});

  // Step 3: Documents
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');

  // Load service & prepopulate personal info
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/${id}`);
        if (res.data.success) {
          setService(res.data.data);
          if (res.data.data.requiredDocuments?.length > 0) {
            setSelectedDocType(res.data.data.requiredDocuments[0]);
          }
        }
      } catch (err) {
        toast.error('Failed to load service details');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();

    if (user) {
      setPersonalInfo({
        fullName: user.name || '',
        dob: '1998-05-14',
        gender: 'Male',
        mobile: user.phone || '9876543210',
        email: user.email || '',
        address: user.address?.street || '',
        city: user.address?.city || 'Pune',
        state: user.address?.state || 'Maharashtra',
        pincode: user.address?.pincode || '',
      });
    }
  }, [id, user]);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleServiceDetailChange = (fieldName, value) => {
    setServiceDetails((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Document Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    try {
      setUploadingDoc(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', selectedDocType || 'Supporting Document');

      const res = await api.post('/applications/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setDocuments((prev) => [...prev, res.data.data]);
        toast.success(`Uploaded ${file.name}`);
        // Reset file input
        e.target.value = null;
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleRemoveDoc = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Application
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        serviceId: service._id,
        formData: {
          personalInfo,
          serviceDetails,
        },
        documents,
      };

      const res = await api.post('/applications', payload);
      if (res.data.success) {
        setSubmittedApp(res.data.data);
        setCurrentStep(5); // Confirmation Step
        toast.success(`Application ${res.data.data.applicationId} successfully submitted!`);
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-sm text-slate-600">Loading service workflow...</p>
      </div>
    );
  }

  const steps = [
    { num: 1, name: 'Personal Details' },
    { num: 2, name: 'Service Info' },
    { num: 3, name: 'Upload Documents' },
    { num: 4, name: 'Review & Confirm' },
    { num: 5, name: 'Complete' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Service Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded uppercase">
              {service?.department?.name || 'Department'}
            </span>
            <h1 className="text-xl font-bold text-gov-navy mt-1">{service?.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{service?.description}</p>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-xs text-slate-400 block">Standard SLA</span>
            <span className="text-xs font-semibold text-slate-700">{service?.processingTime}</span>
          </div>
        </div>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-5 gap-2 text-center">
          {steps.map((st) => (
            <div key={st.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  currentStep === st.num
                    ? 'bg-gov-blue text-white shadow-md'
                    : currentStep > st.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > st.num ? '✓' : st.num}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1.5 font-medium truncate max-w-full ${
                  currentStep === st.num
                    ? 'text-gov-blue font-bold'
                    : currentStep > st.num
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                {st.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-gov-navy">Step 1 — Personal Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify your applicant demographic details retrieved from your citizen profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name (as per ID Proof) *
              </label>
              <input
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={personalInfo.dob}
                onChange={handlePersonalInfoChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={personalInfo.gender}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={personalInfo.mobile}
                onChange={handlePersonalInfoChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                required
                placeholder="Door No, Street Name, Landmark"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / District *</label>
              <input
                type="text"
                name="city"
                value={personalInfo.city}
                onChange={handlePersonalInfoChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={personalInfo.state}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={personalInfo.pincode}
                onChange={handlePersonalInfoChange}
                placeholder="411001"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (!personalInfo.fullName || !personalInfo.mobile || !personalInfo.email) {
                  toast.warning('Please fill all mandatory personal fields.');
                  return;
                }
                setCurrentStep(2);
              }}
              className="px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>Next: Service Information</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dynamic Service-Specific Fields */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-gov-navy">Step 2 — Service Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific parameters required by {service.department?.name} for this service.
            </p>
          </div>

          {service.dynamicFields && service.dynamicFields.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.dynamicFields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {field.label} {field.required && '*'}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={serviceDetails[field.name] || ''}
                      onChange={(e) => handleServiceDetailChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
                    >
                      <option value="">-- Choose Option --</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={serviceDetails[field.name] || ''}
                      onChange={(e) => handleServiceDetailChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={serviceDetails[field.name] || ''}
                      onChange={(e) => handleServiceDetailChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
                    />
                  )}

                  {field.helpText && (
                    <p className="text-[10px] text-slate-400 mt-1">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4">
              No additional service-specific parameters required. Click Next to proceed to document
              upload.
            </p>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>Next: Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Upload */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-gov-navy">Step 3 — Document Upload</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload clear copies of required documents in PDF, PNG, or JPG format (Max 10MB each).
            </p>
          </div>

          {/* Upload Control Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Type:
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  {service.requiredDocuments?.map((doc, idx) => (
                    <option key={idx} value={doc}>
                      {doc}
                    </option>
                  ))}
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Address Proof">Address Proof</option>
                  <option value="Passport Photograph">Passport Photograph</option>
                  <option value="Supporting Document">Other Supporting Document</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select File to Upload:
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadingDoc}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gov-blue file:text-white hover:file:bg-gov-navy cursor-pointer"
                />
              </div>
            </div>

            {uploadingDoc && (
              <div className="flex items-center gap-2 text-xs font-semibold text-gov-blue">
                <div className="w-3.5 h-3.5 border-2 border-gov-blue border-t-transparent rounded-full animate-spin" />
                <span>Uploading file to secure server storage...</span>
              </div>
            )}
          </div>

          {/* Uploaded Documents List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Attached Documents ({documents.length})
            </h4>

            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-gov-blue flex items-center justify-center font-bold text-xs">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{doc.documentType}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.originalName} • {(doc.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No documents uploaded yet. You can attach proofs now or upload during review if
                requested.
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>Next: Review Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review and Verify */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-gov-navy">Step 4 — Review & Verification</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify all entered information before submitting to the Department Interoperability
              Gateway.
            </p>
          </div>

          {/* Review Summary */}
          <div className="space-y-4">
            {/* Personal Details Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Personal Information
                </h4>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-gov-accent hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-slate-800">{personalInfo.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile</span>
                  <span className="font-semibold text-slate-800">{personalInfo.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {personalInfo.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">City, State</span>
                  <span className="font-semibold text-slate-800">
                    {personalInfo.city}, {personalInfo.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Details Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Service Specific Parameters
                </h4>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-gov-accent hover:underline"
                >
                  Edit
                </button>
              </div>

              {Object.keys(serviceDetails).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(serviceDetails).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-400 block text-[11px] capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Standard service form details apply.</p>
              )}
            </div>

            {/* Attached Documents */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Uploaded Documents ({documents.length})
                </h4>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-gov-accent hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {documents.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {d.documentType} ({d.originalName})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Citizen Declaration */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs text-slate-700 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-gov-blue flex-shrink-0 mt-0.5" />
            <p>
              I hereby declare that all information furnished is true and accurate to the best of
              my knowledge. I authorize MahaConnect to route my request through the State
              Departmental API Gateway.
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-gov-green hover:bg-gov-greenDark text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching to Department Gateway...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Submission Confirmation */}
      {currentStep === 5 && submittedApp && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Dispatched to Department Gateway
            </span>
            <h2 className="text-2xl font-extrabold text-gov-navy mt-3">
              Application Successfully Submitted!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
              Your application has been logged on the state ledger and acknowledged by{' '}
              <strong className="text-slate-800">{submittedApp.department?.name}</strong>.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="max-w-md mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              MahaConnect Unified Application ID
            </span>
            <div className="text-2xl font-mono font-black text-gov-navy tracking-wider select-all">
              {submittedApp.applicationId}
            </div>
            {submittedApp.interopReferenceId && (
              <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                Department Gateway Ref:{' '}
                <span className="font-mono font-bold text-gov-blue">
                  {submittedApp.interopReferenceId}
                </span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to={`/applications/${submittedApp.applicationId}`}
              className="px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <span>View Tracking Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgement</span>
            </button>

            <Link
              to="/dashboard"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyService;
