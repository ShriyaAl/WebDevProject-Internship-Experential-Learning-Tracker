import React from 'react';
import { Check, X, ExternalLink } from 'lucide-react';

const ResearchApprovals = () => {
  const requests = [
    { id: 1, faculty: "Dr. Aris", title: "ML in Bio-metrics", dept: "Computer Science", date: "Feb 19" },
    { id: 2, faculty: "Prof. Sarah", title: "Smart Cities IoT", dept: "Engineering", date: "Feb 18" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Research Requests</h1>
      <p className="text-gray-500 text-sm mb-8">Review and publish Faculty research openings to the Student portal.</p>

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-xl border-l-4 border-red-600 border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{req.dept}</span>
              <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
              <p className="text-xs text-gray-500 italic">Submitted by {req.faculty} on {req.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                <ExternalLink size={20} />
              </button>
              <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                <X size={20} />
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-md">
                <Check size={18} /> Publish to Portal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchApprovals;