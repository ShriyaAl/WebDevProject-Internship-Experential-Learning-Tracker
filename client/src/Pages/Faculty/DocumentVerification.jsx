import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InternshipsTable } from './components/InternshipsTable';
import { InternshipSlideOver } from './components/InternshipSlideOver';
import { apiFetch } from '../../lib/api';

const DocumentVerification = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const location = useLocation();

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/incharge/internships');
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
  }, [location.state]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Internship Verification</h1>
          <p className="text-sm text-gray-500 font-medium">Master list of all student internships requiring document verification.</p>
        </div>
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