import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { UserX, Search, ShieldCheck, MapPin, Clock, Phone, AlertCircle, PlusCircle, CheckCircle2 } from 'lucide-react';

export const LostAndFoundSection = () => {
  const { lostReports, setActiveModal, addToast } = useYatra();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredReports = lostReports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lastSeen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'person') return matchesSearch && report.type === 'person';
    if (filterType === 'item') return matchesSearch && report.type === 'item';
    return matchesSearch;
  });

  const handleContactHelpDesk = (report) => {
    addToast(
      `Connecting to ${report.matchedBooth}`,
      `Case ID ${report.id} opened. Police Volunteer Hotline: 112 / Duty Officer dispatched.`,
      'info'
    );
  };

  return (
    <section id="lost-found" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
              <UserX className="w-3.5 h-3.5" /> Rapid Lost & Found Directory
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
              Helping Lost Pilgrims Find Their Way Home.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              Every year, thousands of devotees get temporarily separated. TirthSaathi connects temple PA systems, police booths, and volunteers into one instant discovery network.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal('report-missing')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Missing Person</span>
            </button>
          </div>
        </div>

        {/* Demo Disclaimer Alert */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Interactive Prototype Notice:</strong> All cases shown below contain fictional sample data for system demonstration. In live yatras, records synchronize directly with District Police & Temple Trust command stations.
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, location, or Case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 text-navy-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'person', label: 'Missing Persons' },
              { id: 'item', label: 'Found Belongings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === tab.id
                    ? 'bg-yatra-blue text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredReports.map((report) => {
            const isResolved = report.statusCode === 'resolved' || report.statusCode === 'reunited';
            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Case Badge */}
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {report.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isResolved ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                      {report.badge}
                    </span>
                  </div>

                  {/* Person Avatar & Basic Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-blue-50 border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                      {report.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm leading-tight">{report.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {report.age} • {report.gender}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-yatra-blue flex-shrink-0 mt-0.5" />
                      <span className="leading-tight font-medium text-slate-800">{report.lastSeen}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{report.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 leading-normal">
                      <strong>Attire:</strong> {report.wearing}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleContactHelpDesk(report)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-yatra-light text-navy-900 hover:text-yatra-blue text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Booth / Verify</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
