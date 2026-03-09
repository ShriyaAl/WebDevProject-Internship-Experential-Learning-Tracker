import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardCheck, Clock, Users, AlertCircle,
  ArrowRight, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../lib/api';

const FacultyHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({ metrics: {}, data: [] });
  const [filter, setFilter] = useState('ALL');

  const fetchDashboard = async (status) => {
    try {
      setLoading(true);
      const result = await apiFetch(`/api/incharge/dashboard?status=${status}`);
      if (result.success) {
        setDashboardData(result);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUserAndFetch = async () => {
      try {
        await fetchDashboard('ALL');
      } catch (err) {
        console.error("Init error:", err);
      }
    };
    checkUserAndFetch();
  }, []);

  const handleFilterChange = (newStatus) => {
    setFilter(newStatus);
    fetchDashboard(newStatus);
  };

  const { metrics, data } = dashboardData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          {['ALL', 'PENDING', 'ON_HOLD', 'APPROVED'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === status
                ? 'bg-[#0e4ea7] text-white shadow-md'
                : 'text-gray-500 hover:text-[#0e4ea7]'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<ClipboardCheck className="text-orange-600" />}
          label="Pending Approvals"
          value={metrics?.pending || 0}
          color="border-orange-200"
        />
        <StatCard
          icon={<Clock className="text-blue-600" />}
          label="Expiring Internships"
          value={metrics?.on_hold || 0}
          subtext="Next 7 Days"
          color="border-blue-200"
        />
        <StatCard
          icon={<Users className="text-green-600" />}
          label="Active Students"
          value={metrics?.total || data?.length || 0}
          color="border-green-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h2 className="font-bold text-gray-800">Recent Activity Feed</h2>
            <Link to="/document-faculty" className="text-sm text-blue-600 font-semibold hover:underline">Verify Internships</Link>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-10 text-center flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400">Fetching requests...</p>
              </div>
            ) : data && data.length > 0 ? (
              data.slice(0, 4).map((req) => (
                <div key={req.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-[#0e4ea7] border border-blue-100">
                      {req.student_profiles?.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 leading-tight">{req.student_profiles?.full_name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="text-[#0e4ea7] font-semibold">{req.request_types?.name}</span> • {req.internships?.company_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      onClick={() => navigate('/document-faculty', { state: { requestId: req.id } })}
                      className="p-2 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-lg transition-all shadow-sm"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <p className="text-gray-400 text-sm">No activity found for this status.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0e4ea7] to-blue-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Documentation</h3>
              <p className="text-blue-100 text-xs mb-4 leading-relaxed">Download guidelines for course credit mapping and rubric evaluations.</p>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/20 transition-all">
                Download PDF
              </button>
            </div>
            <CheckCircle2 size={100} className="absolute -bottom-4 -right-4 text-white opacity-10 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em]">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickLink label="Verify Internships" to="/document-faculty" />
              <QuickLink label="OD Requests" to="/od-faculty" />
              <QuickLink label="Bonafides" to="/bonafide-faculty" />
              <QuickLink label="Profile Setup" to="/profile-faculty" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, subtext }) => (
  <div className={`bg-white p-6 rounded-2xl border-b-4 ${color} shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1`}>
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{value}</h3>
      {subtext && <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase">{subtext}</p>}
    </div>
  </div>
);

const QuickLink = ({ label, to }) => (
  <Link to={to} className="flex items-center justify-center p-3 bg-gray-50 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-[#0e4ea7] hover:text-white transition-all text-center">
    {label}
  </Link>
);

export default FacultyHome;