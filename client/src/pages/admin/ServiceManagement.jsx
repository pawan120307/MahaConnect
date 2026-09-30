import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Search,
  Building2,
  Clock,
  IndianRupee,
  CheckCircle,
  X,
  PlusCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    description: '',
    category: 'General',
    requiredDocumentsStr: '',
    processingTime: '7 Working Days',
    fee: 0,
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  const fetchServicesAndDepts = async () => {
    try {
      setLoading(true);
      const [svcRes, deptRes] = await Promise.all([
        api.get('/services?status=all'),
        api.get('/departments'),
      ]);

      if (svcRes.data.success) setServices(svcRes.data.data);
      if (deptRes.data.success) setDepartments(deptRes.data.data);
    } catch (err) {
      toast.error('Failed to load services or departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndDepts();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      code: '',
      department: departments[0]?._id || '',
      description: '',
      category: 'Licences',
      requiredDocumentsStr: 'Aadhaar Card, Address Proof, Passport Photograph',
      processingTime: '7 Working Days',
      fee: 100,
      status: 'active',
    });
    setShowModal(true);
  };

  const openEditModal = (svc) => {
    setEditingService(svc);
    setFormData({
      name: svc.name,
      code: svc.code,
      department: svc.department?._id || svc.department,
      description: svc.description || '',
      category: svc.category || 'General',
      requiredDocumentsStr: svc.requiredDocuments?.join(', ') || '',
      processingTime: svc.processingTime || '7 Working Days',
      fee: svc.fee || 0,
      status: svc.status || 'active',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const docsArray = formData.requiredDocumentsStr
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        code: formData.code,
        department: formData.department,
        description: formData.description,
        category: formData.category,
        requiredDocuments: docsArray,
        processingTime: formData.processingTime,
        fee: Number(formData.fee),
        status: formData.status,
      };

      if (editingService) {
        const res = await api.put(`/services/${editingService._id}`, payload);
        if (res.data.success) toast.success('Service updated successfully');
      } else {
        const res = await api.post('/services', payload);
        if (res.data.success) toast.success('Service created successfully');
      }

      setShowModal(false);
      fetchServicesAndDepts();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (svc) => {
    try {
      const res = await api.delete(`/services/${svc._id}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Service status toggled');
        fetchServicesAndDepts();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-navy flex items-center gap-2">
            <Layers className="w-6 h-6 text-gov-blue" />
            Service Management Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Define e-services, associate state departments, configure document checklists, and set
            statutory SLAs
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title or code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white"
          />
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Service Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SLA</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((svc) => (
                  <tr key={svc._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gov-navy whitespace-nowrap">
                      {svc.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div>{svc.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                        {svc.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {svc.department?.name || 'Department'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {svc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {svc.processingTime}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {svc.fee > 0 ? `₹${svc.fee}` : 'Free'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          svc.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {svc.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 text-slate-600 hover:text-gov-blue hover:bg-slate-100 rounded-lg transition"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(svc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                          title="Toggle Status"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-gov-navy">
                {editingService ? 'Edit Service' : 'Add New Government Service'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. New Driving Licence Application"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Service Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. TRANS_DL_NEW"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="">-- Assign Department --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Service Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Licences">Licences</option>
                    <option value="Certificates">Certificates</option>
                    <option value="Education">Education</option>
                    <option value="Property">Property</option>
                    <option value="Employment">Employment</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Health">Health</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Processing SLA</label>
                  <input
                    type="text"
                    value={formData.processingTime}
                    onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                    placeholder="7 Working Days"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee (INR)</label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Documents (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.requiredDocumentsStr}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredDocumentsStr: e.target.value })
                  }
                  placeholder="e.g. Aadhaar Card, PAN Card, Salary Slip"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Comma-separated list of document names required from applicant.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl shadow"
                >
                  {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
