import React from 'react';
import { Building, Mail, MapPin } from 'lucide-react';

const ManagerProfile = () => {
  return (
    <div className="p-8 max-w-4xl">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-[#0e4ea7]"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-gray-200 border-4 border-white rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-400">JD</div>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium">Edit Profile</button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">James Wilson</h2>
          <p className="text-gray-500 mb-6">Senior Software Architect</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="space-y-4">
              <ProfileItem icon={<Building size={18} />} label="Company" value="Tech Solutions Inc." />
              <ProfileItem icon={<Mail size={18} />} label="Work Email" value="james.w@techsolutions.com" />
              <ProfileItem icon={<MapPin size={18} />} label="Location" value="New York, NY" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-bold mb-2">Notification Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600">Email me when interns submit logs</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);

export default ManagerProfile;