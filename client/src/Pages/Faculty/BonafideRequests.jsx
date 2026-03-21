import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RequestsTable } from './components/RequestsTable';
import { RequestSlideOver } from './components/RequestSlideOver';
import { apiFetch } from '../../lib/api';

const BonafideRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const location = useLocation();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('status', statusFilter);
      params.set('type', 'BONAFIDE');
      if (search.trim()) params.set('q', search.trim());
      if (deptFilter !== 'ALL') params.set('dept', deptFilter);

      const res = await apiFetch(`/api/incharge/dashboard?${params.toString()}`);
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error("Bonafide list error:", err);
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
  }, [location.state, search, statusFilter, deptFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Bonafide & Verification Requests</h1>
          <p className="text-sm text-gray-500 font-medium">Manage academic verification documents requested by students.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student, reg no, company..."
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0e4ea7]">
          <option value="ALL">All Departments</option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
        </select>
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

export default BonafideRequests;
