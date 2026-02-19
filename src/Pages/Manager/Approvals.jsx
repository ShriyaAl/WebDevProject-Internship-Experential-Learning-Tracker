import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';

const Approvals = () => {
  const [showCoursework, setShowCoursework] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Logs</h1>
        <button 
          onClick={() => setShowCoursework(!showCoursework)}
          className="flex items-center gap-2 text-sm text-[#0e4ea7] font-medium"
        >
          <Info size={16} /> {showCoursework ? "Hide Academic Background" : "View Academic Background"}
        </button>
      </div>

      {showCoursework && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in duration-300">
          <h3 className="font-bold text-blue-800 text-sm mb-2">Relevant Coursework Covered:</h3>
          <div className="flex gap-2 flex-wrap">
            {['Database Management', 'Cloud Computing', 'React Basics'].map(c => (
              <span key={c} className="bg-white px-2 py-1 rounded border border-blue-200 text-xs text-blue-700">{c}</span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold">John Doe - Week 4 Log</h2>
              <p className="text-sm text-gray-500">Submitted: Feb 18, 2026</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg italic">
            "This week I focused on setting up the Firebase Auth and creating the custom dashboard UI using Tailwind. I also attended the daily standups and documented the API endpoints."
          </p>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 bg-white hover:bg-red-50 hover:text-red-600 transition-colors">
            <X size={18} /> Request Changes
          </button>
          <button className="px-4 py-2 bg-[#0e4ea7] text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Check size={18} /> Approve Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Approvals;