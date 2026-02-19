import React from 'react';
import { Users, Clock, AlertCircle } from 'lucide-react';

const ManagerHome = () => {
  const interns = [
    { id: 1, name: "John Doe", role: "Frontend Intern", progress: 65, status: "On Track" },
    { id: 2, name: "Jane Smith", role: "Python Dev", progress: 30, status: "Action Required" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Interns" value="4" />
        <StatCard icon={<AlertCircle className="text-red-600" />} label="Pending Reviews" value="2" />
        <StatCard icon={<Clock className="text-green-600" />} label="Active Weeks" value="12" />
      </div>

      <h2 className="text-xl font-semibold mb-4">Current Interns</h2>
      <div className="grid grid-cols-1 gap-4">
        {interns.map(intern => (
          <div key={intern.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{intern.name}</h3>
              <p className="text-gray-500 text-sm">{intern.role}</p>
            </div>
            <div className="w-1/3 px-4">
              <div className="flex justify-between mb-1 text-xs text-gray-400">
                <span>Progress</span>
                <span>{intern.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${intern.status === 'On Track' ? 'bg-blue-600' : 'bg-red-500'}`} style={{ width: `${intern.progress}%` }}></div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${intern.status === 'On Track' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {intern.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default ManagerHome;