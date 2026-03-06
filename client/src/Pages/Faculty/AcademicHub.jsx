import React from 'react';
import { Calculator, ArrowRight, Save } from 'lucide-react';

const AcademicHub = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calculator className="text-[#0e4ea7]" size={22}/> Credit Logic Builder
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Internship Type</label>
            <select className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#0e4ea7]">
              <option>Full-stack Development</option>
              <option>Data Science</option>
              <option>UI/UX Design</option>
            </select>
          </div>
          <div className="flex items-center justify-center py-2">
            <ArrowRight className="text-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Map to Course</label>
            <select className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#0e4ea7]">
              <option>CS302 - Web Technologies</option>
              <option>CS401 - Machine Learning</option>
            </select>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg mt-4 text-sm text-[#0e4ea7]">
            <strong>Formula:</strong> 40 Hours = 1 Academic Credit
          </div>
          <button className="w-full py-2 bg-[#0e4ea7] text-white rounded-lg font-medium hover:bg-[#0c438f] mt-4">Save Mapping</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Awaiting Credit Approval</h3>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-[#0e4ea750]">
              <div>
                <p className="font-semibold text-gray-800">Sara Williams</p>
                <p className="text-xs text-gray-400">Completed 160 Hours</p>
              </div>
              <button className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100">MAP TO TRANSCRIPT</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicHub
