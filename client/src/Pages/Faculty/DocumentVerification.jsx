import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InternshipsTable } from './components/InternshipsTable';
import { InternshipSlideOver } from './components/InternshipSlideOver';
import { apiFetch } from '../../lib/api';

const DocumentVerification = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [activityFilter, setActivityFilter] = useState('ALL');
  const [creditFilter, setCreditFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [regNoStart, setRegNoStart] = useState('');
  const [regNoEnd, setRegNoEnd] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [internshipTypeFilter, setInternshipTypeFilter] = useState('ALL');
  const [techStackFilter, setTechStackFilter] = useState('');
  const [stipendMin, setStipendMin] = useState('');
  const [stipendMax, setStipendMax] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [modeFilter, setModeFilter] = useState('ALL');
  const location = useLocation();

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (verificationFilter !== 'ALL') params.set('verification_status', verificationFilter);
      if (activityFilter !== 'ALL') params.set('activity_status', activityFilter);
      if (creditFilter !== 'ALL') params.set('map_for_credits', creditFilter);
      if (yearFilter !== 'ALL') params.set('year', yearFilter);
      if (deptFilter !== 'ALL') params.set('dept', deptFilter);
      if (sectionFilter !== 'ALL') params.set('section', sectionFilter);
      if (regNoStart.trim()) params.set('reg_no_start', regNoStart.trim());
      if (regNoEnd.trim()) params.set('reg_no_end', regNoEnd.trim());
      if (companyName.trim()) params.set('company_name', companyName.trim());
      if (internshipTypeFilter !== 'ALL') params.set('internship_type', internshipTypeFilter);
      if (techStackFilter.trim()) params.set('tech_stack', techStackFilter.trim());
      if (stipendMin.trim()) params.set('stipend_min', stipendMin.trim());
      if (stipendMax.trim()) params.set('stipend_max', stipendMax.trim());
      if (modeFilter !== 'ALL') params.set('mode', modeFilter);

      const query = params.toString();
      const res = await apiFetch(`/api/incharge/internships${query ? `?${query}` : ''}`);
      if (res.success) {
        setInternships(res.data);
      }
    } catch (err) {
      console.error("Dashboard list error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If navigated from FacultyHome with a specific request ID (or in this case, internship ID, if updated)
    if (location.state?.internshipId) {
      // Note: To automatically open, we need to map id to the actual object if available, 
      // but for now we just fetch.
      window.history.replaceState({}, document.title); // clear state so it doesn't reopen on refresh
    }
    fetchInternships();
  }, [
    location.state,
    search,
    verificationFilter,
    activityFilter,
    creditFilter,
    yearFilter,
    deptFilter,
    sectionFilter,
    regNoStart,
    regNoEnd,
    companyName,
    internshipTypeFilter,
    techStackFilter,
    stipendMin,
    stipendMax,
    modeFilter
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Internship Verification</h1>
          <p className="text-sm text-gray-500 font-medium">Master list of all student internships requiring document verification.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setVerificationFilter('PENDING')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${verificationFilter === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setVerificationFilter('VERIFIED')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${verificationFilter === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            Verified
          </button>
          <button
            onClick={() => setVerificationFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${verificationFilter === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            Rejected
          </button>
          <button
            onClick={() => setActivityFilter(activityFilter === 'Ongoing' ? 'ALL' : 'Ongoing')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${activityFilter === 'Ongoing' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActivityFilter(activityFilter === 'Completed' ? 'ALL' : 'Completed')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${activityFilter === 'Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setCreditFilter(creditFilter === 'true' ? 'ALL' : 'true')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${creditFilter === 'true' ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            Academic Credit Only
          </button>
          <button
            onClick={() => {
              setVerificationFilter('ALL');
              setActivityFilter('ALL');
              setCreditFilter('ALL');
            }}
            className="px-3 py-1.5 rounded-full text-xs font-bold border bg-white text-gray-500 border-gray-200"
          >
            Clear Quick Toggles
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Global search: student, reg no, company, role..."
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
          />
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
            <option value="ALL">Batch / Year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
            <option value="5">Year 5</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
            <option value="ALL">Department / Branch</option>
            <option value="IT">IT</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
            <option value="ALL">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={regNoStart}
            onChange={(e) => setRegNoStart(e.target.value)}
            placeholder="Roll No Start (numeric)"
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
          />
          <input
            value={regNoEnd}
            onChange={(e) => setRegNoEnd(e.target.value)}
            placeholder="Roll No End (numeric)"
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
          />
          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
            <option value="ALL">All Modes</option>
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:text-[#0e4ea7]"
          >
            {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name (Google, Microsoft...)"
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
            />
            <select value={internshipTypeFilter} onChange={(e) => setInternshipTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
              <option value="ALL">Internship Type</option>
              <option value="CDC">Product Based (CDC)</option>
              <option value="Off Campus">Service / Off Campus</option>
              <option value="Research">Research / NGO</option>
            </select>
            <input
              value={techStackFilter}
              onChange={(e) => setTechStackFilter(e.target.value)}
              placeholder="Tech Stack (comma separated, e.g. React,Python)"
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
            />
            <input
              value={stipendMin}
              onChange={(e) => setStipendMin(e.target.value)}
              placeholder="Stipend Min"
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
            />
            <input
              value={stipendMax}
              onChange={(e) => setStipendMax(e.target.value)}
              placeholder="Stipend Max"
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
            />
            <button
              type="button"
              onClick={() => {
                setCompanyName('');
                setInternshipTypeFilter('ALL');
                setTechStackFilter('');
                setStipendMin('');
                setStipendMax('');
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500"
            >
              Clear Advanced
            </button>
          </div>
        )}

      </div>

      <InternshipsTable
        internships={internships}
        loading={loading}
        onReview={(internship) => setSelectedInternship(internship)}
      />

      <InternshipSlideOver
        internship={selectedInternship}
        onClose={() => setSelectedInternship(null)}
        onRefresh={fetchInternships}
      />
    </div>
  );
};

export default DocumentVerification;
