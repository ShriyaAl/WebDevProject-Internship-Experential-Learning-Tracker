import React from 'react';
// Update this line at the top of FacultyHome.jsx
import { Bell, Clock, CheckCircle, Plus, FileText, Users } from 'lucide-react';

const FacultyHome = () => {
  return (
    <div className="space-y-8">
      {/* Action Required Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-[#0e4ea7] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-800">12</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-[#0e4ea7]"><CheckCircle size={20}/></div>
          </div>
          <p className="text-xs text-gray-400 mt-4">4 reports, 8 credit maps</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-orange-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Expiring Internships</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-800">05</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><Clock size={20}/></div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Ending within 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Students</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-800">142</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-500"><Users size={20}/></div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Across 12 departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Activity</h3>
            <button className="text-[#0e4ea7] text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="p-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border-b border-gray-50 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0e4ea7] font-bold text-xs">JD</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800"><span className="font-semibold">John Doe</span> uploaded <span className="text-[#0e4ea7]">Week 4 Report</span></p>
                  <p className="text-xs text-gray-400">2 hours ago • Google Cloud Internship</p>
                </div>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-white">Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 px-1">Quick Actions</h3>
          <button className="w-full flex items-center gap-3 p-4 bg-[#0e4ea7] text-white rounded-xl hover:bg-[#0c438f] transition-all shadow-md">
            <Plus size={20}/>
            <span className="font-medium">Post New Research</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-[#0e4ea7] hover:text-[#0e4ea7] transition-all shadow-sm">
            <FileText size={20}/>
            <span className="font-medium">Export Monthly Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyHome