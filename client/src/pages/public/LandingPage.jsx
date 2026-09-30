import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  Clock,
  FileCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Search,
  ExternalLink,
  ChevronRight,
  Car,
  Landmark,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Activity,
  Users,
  Cpu,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../api/axios';

const departmentIcons = {
  TRANS: Car,
  REV: Landmark,
  EDU: GraduationCap,
  MUNI: Building2,
  EMP: Briefcase,
  SOC: HeartHandshake,
  HLTH: Activity,
};

const LandingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data.success) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load departments:', err.message);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gov-navy via-[#102d54] to-gov-blue text-white py-16 lg:py-24 border-b border-slate-800">
        {/* Background geometric accents */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-8 border-white/20"></div>
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full border-4 border-gov-saffron/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-gov-saffron mb-6">
              <span className="w-2 h-2 rounded-full bg-gov-saffron animate-ping" />
              Unified Citizen Service Delivery & Interoperability Gateway
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              MahaConnect
            </h1>
            <p className="mt-4 text-xl sm:text-2xl font-light text-slate-200">
              One Platform. Multiple Government Services.
            </p>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Access transport licences, revenue certificates, educational scholarships, and civil
              records through a single verified citizen identity. Eliminate repetitive paperwork
              with real-time inter-departmental API interoperability.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                to="/services"
                className="px-6 py-3.5 bg-gov-saffron hover:bg-gov-saffronDark text-gov-navy font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 group text-sm sm:text-base"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/login"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-sm transition flex items-center gap-2 text-sm sm:text-base"
              >
                <span>Citizen & Officer Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Statistics Strip */}
        <div className="mt-16 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">10+</p>
                <p className="text-xs text-slate-300 mt-1">Integrated Departments (Demo)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gov-saffron">50+</p>
                <p className="text-xs text-slate-300 mt-1">E-Services Available (Demo)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">10,000+</p>
                <p className="text-xs text-slate-300 mt-1">Applications Processed (Demo)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-300">99.8%</p>
                <p className="text-xs text-slate-300 mt-1">API Interop Uptime (Demo)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gov-navy">
              Architected for Frictionless Governance
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              MahaConnect establishes an interoperable REST gateway between independent government
              silos and citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-gov-blue flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">One Citizen Profile</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your demographic and identification details once. Automatically populate forms
                across Transport, Revenue, Education, and Municipal portals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Application Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transparent visual timelines show exact departmental movement, officer remarks,
                verification steps, and approval stages with zero ambiguity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Department Interoperability</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enterprise REST APIs connect MahaConnect to individual departmental legacy databases
                with audit logging, latency tracking, and automatic sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">
              Step-by-Step Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gov-navy mt-1">
              How MahaConnect Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              5 simple steps from digital submission to departmental delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Register & Verify',
                desc: 'Create your secure citizen account with verified contact details.',
              },
              {
                step: '02',
                title: 'Select Service',
                desc: 'Browse multi-department catalog and review requirements.',
              },
              {
                step: '03',
                title: 'Submit Application',
                desc: 'Complete dynamic fields and upload certified documents.',
              },
              {
                step: '04',
                title: 'Track Status',
                desc: 'Follow live department scrutiny with visual timeline updates.',
              },
              {
                step: '05',
                title: 'Receive Decision',
                desc: 'Get approved certificates and SMS/in-app notifications.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative flex flex-col justify-between"
              >
                <div className="text-3xl font-black text-gov-saffron/40 mb-3">{item.step}</div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participating Departments Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">
                Interconnected Systems
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gov-navy mt-1">
                Participating Departments
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Live simulated government departmental nodes currently integrated with MahaConnect.
              </p>
            </div>
            <Link
              to="/services"
              className="mt-4 md:mt-0 text-sm font-semibold text-gov-accent hover:underline inline-flex items-center gap-1"
            >
              Browse all services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((dept) => {
              const IconComp = departmentIcons[dept.code] || Building2;
              return (
                <div
                  key={dept._id}
                  className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200 p-5 transition hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-gov-navy text-white flex items-center justify-center mb-3">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{dept.name}</h4>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-gov-navy bg-blue-100 px-2 py-0.5 rounded uppercase">
                      Code: {dept.code}
                    </span>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {dept.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {dept.servicesCount || 0} Services Active
                    </span>
                    <Link
                      to={`/services?department=${dept._id}`}
                      className="text-gov-accent font-semibold hover:underline"
                    >
                      Apply →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gov-navy text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to access government services?</h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Experience next-generation governance with single sign-on citizen access.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-gov-saffron text-gov-navy font-bold rounded-xl shadow-md hover:bg-gov-saffronDark transition text-sm"
            >
              Register Citizen Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition text-sm"
            >
              Sign In with Demo Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
