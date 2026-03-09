import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RequestsTable } from './components/RequestsTable';
import { RequestSlideOver } from './components/RequestSlideOver';
import { apiFetch } from '../../lib/api';

const OdRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const location = useLocation();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/incharge/dashboard?status=ALL');
      if (res.success) {
        // Filter for OD or Duty Leave
        const odRequests = res.data.filter(req =>
          req.request_types?.name?.toLowerCase().includes('od') ||
          req.request_types?.name?.toLowerCase().includes('duty')
        );
        setRequests(odRequests);
      }
    } catch (err) {
      console.error("OD list error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.requestId) {
      setSelectedRequestId(location.state.requestId);
      window.history.replaceState({}, document.title);
    }
    fetchRequests();
  }, [location.state]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">On Duty (OD) Requests</h1>
          <p className="text-sm text-gray-500 font-medium">Manage student absence requests for internship exams or drives.</p>
        </div>
      </div>

      <RequestsTable
        requests={requests}
        loading={loading}
        onReview={(id) => setSelectedRequestId(id)}
      />

      <RequestSlideOver
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onRefresh={fetchRequests}
      />
    </div>
  );
};

export default OdRequests;