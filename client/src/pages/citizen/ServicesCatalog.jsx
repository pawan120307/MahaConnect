import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Layers,
  Clock,
  FileCheck2,
  Building2,
  ArrowRight,
  IndianRupee,
  Car,
  Landmark,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Activity,
  CheckCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

const categoryList = [
  'All',
  'Licences',
  'Certificates',
  'Education',
  'Property',
  'Employment',
  'Welfare',
  'Health',
];

const ServicesCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const deptRes = await api.get('/departments');
        if (deptRes.data.success) {
          setDepartments(deptRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchMeta();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedDept && selectedDept !== 'all') params.department = selectedDept;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;

      const res = await api.get('/services', { params });
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchServices();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [search, selectedDept, selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    if (deptId === 'all') {
      searchParams.delete('department');
    } else {
      searchParams.set('department', deptId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gov-navy">
          Government Services Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore and apply for standardized e-services across all Maharashtra state departments
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services by keyword, code or description..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-gov-blue focus:bg-white transition"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-gov-blue focus:bg-white"
            >
              <option value="all">All Participating Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-full font-medium transition flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Department Tag & Fee */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-100 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    {svc.department?.name || 'Department'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 flex-shrink-0">
                    {svc.fee > 0 ? `₹${svc.fee}` : 'Free / Exempted'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {svc.name}
                </h3>
                <span className="inline-block text-[10px] font-mono text-slate-400 mb-2">
                  Code: {svc.code}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {svc.description}
                </p>

                {/* Required Documents Checklist */}
                {svc.requiredDocuments?.length > 0 && (
                  <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Required Documents:
                    </span>
                    <ul className="space-y-1">
                      {svc.requiredDocuments.slice(0, 3).map((doc, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-700 flex items-center gap-1.5 truncate"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                      {svc.requiredDocuments.length > 3 && (
                        <li className="text-[10px] text-slate-400 font-medium">
                          +{svc.requiredDocuments.length - 3} more document(s)
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom footer: SLA + Apply Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>SLA: {svc.processingTime}</span>
                </div>

                <Link
                  to={`/services/${svc._id}/apply`}
                  className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No services match your filters"
          description="Try modifying your keyword search or selecting another department category."
          action={
            <button
              onClick={() => {
                setSearch('');
                setSelectedDept('all');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
            >
              Reset Filters
            </button>
          }
        />
      )}
    </div>
  );
};

export default ServicesCatalog;
