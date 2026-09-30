import React from 'react';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gov-navy text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-6 h-6 rounded bg-gov-saffron flex items-center justify-center text-gov-navy font-black text-xs">
                MC
              </div>
              <span>MahaConnect State Gateway</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              MahaConnect is an academic prototype of an Integrated Government Service Delivery &
              Interoperability Gateway, connecting citizen requests directly with state departmental
              REST engines across Maharashtra.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Interoperability Standards Compliant (e-Gov Draft 2.0)</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Participating Departments
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>Motor Vehicles (Transport)</li>
              <li>Revenue & Land Records</li>
              <li>Higher & Technical Education</li>
              <li>Urban Local Bodies (Municipal)</li>
              <li>Skill & Employment Exchange</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              System Support & Viva
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>BSc IT FSDM Capstone Project</li>
              <li>Simulated Multi-Department REST APIs</li>
              <li>Toll Free Citizen Help: 1800-120-8040</li>
              <li>Email: support@mahaconnect.gov.in</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} MahaConnect Platform. Designed for Academic Demonstration & Viva Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Hyperlinking Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
