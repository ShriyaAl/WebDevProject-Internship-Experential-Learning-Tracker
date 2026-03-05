import React, { useState } from 'react';
import { 
  User, Mail, GraduationCap, 
  ShieldCheck, Lock, Camera, 
  Save, X, ChevronRight 
} from 'lucide-react';

export default function StudentProfile() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const student = {
    name: "John Doe",
    class: "B.Tech - Computer Science",
    year: "3rd Year, Section B",
    rollNo: "22CS1045",
    email: "john.doe@university.edu"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 flex justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mb-6">
          {/* Cover Header */}
          <div className="h-32 bg-[#0047AB] relative" />
          
          <div className="px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative group">
                <div className="w-28 h-28 bg-slate-200 border-4 border-white rounded-[24px] overflow-hidden shadow-md flex items-center justify-center text-slate-400">
                   <User size={48} />
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-[#0047AB] hover:scale-110 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  Active
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900">{student.name}</h1>
              <p className="text-slate-500 font-medium text-sm italic">{student.class}</p>
            </div>

            {/* Grid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
              <InfoItem icon={<GraduationCap size={18} />} label="Academic Year" value={student.year} />
              <InfoItem icon={<ShieldCheck size={18} />} label="Student ID" value={student.rollNo} />
              <InfoItem icon={<Mail size={18} />} label="Email Address" value={student.email} />
              
              {/* Change Password Trigger */}
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-[#0047AB]" />
                  <span className="text-sm font-bold text-slate-700">Change Password</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Update Security</h2>
                <button onClick={() => setIsChangingPassword(false)} className="text-slate-300 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <PasswordInput label="Current Password" placeholder="••••••••" />
                <PasswordInput label="New Password" placeholder="••••••••" />
                <button 
                  onClick={() => setIsChangingPassword(false)}
                  className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Save size={18} /> Save New Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helper Components ---
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const PasswordInput = ({ label, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="password" 
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-[#0047AB] transition-all" 
    />
  </div>
);