import React from 'react';
import { Activity, Users, Briefcase, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Users" value="1,240" />
        <StatCard icon={<Briefcase className="text-red-600" />} label="Active Internships" value="86" />
        <StatCard icon={<Activity className="text-orange-600" />} label="Pending Research" value="12" />
        <StatCard icon={<ShieldCheck className="text-green-600" />} label="System Health" value="100%" />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold mb-4 text-gray-700">Recent Activity Log</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 text-sm border-b border-gray-50 pb-3 last:border-0">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <p className="text-gray-600">Faculty <span className="font-semibold text-gray-900">Dr. Aris</span> submitted a research request: "Neural Networks in Robotics"</p>
              <span className="ml-auto text-xs text-gray-400">10 mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;