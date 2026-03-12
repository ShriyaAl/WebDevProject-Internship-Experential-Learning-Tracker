import React, { useState, useEffect } from 'react';
import { 
  User, Mail, GraduationCap, ShieldCheck, Lock, 
  Camera, Save, X, ChevronRight, Edit3, Phone, Linkedin, Loader2
} from 'lucide-react';

export default function StudentProfile() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    dept: "",
    year: 1,
    reg_no: "",
    gender: "Male",
    phone: "",
    linkedin_url: ""
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const email = user.email || 'N/A';
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/students/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (res.ok && result.success && result.data) {
        setProfile({
          ...result.data,        
          ...result.data.profile  
        });
      } else if (res.status === 404) {
        console.log("Profile not found, proceeding with empty state.");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
};

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/students/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profile)
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#0047AB]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="h-32 bg-[#0047AB] relative" />
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative group">
                <div className="w-28 h-28 bg-slate-200 border-4 border-white rounded-[24px] overflow-hidden shadow-md flex items-center justify-center text-slate-400">
                   <User size={48} />
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-[#0047AB] hover:scale-110 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-[#0047AB] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900">{profile.full_name || "New Student"}</h1>
              <p className="text-slate-500 font-medium text-sm italic">{profile.dept || "Department not set"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
              <InfoItem icon={<GraduationCap size={18} />} label="Academic Year" value={profile.year ? `Year ${profile.year}` : "N/A"} />
              <InfoItem icon={<ShieldCheck size={18} />} label="Student ID" value={profile.reg_no || "N/A"} />
              <InfoItem icon={<Mail size={18} />} label="Email Address" value={email} />
              <InfoItem icon={<Phone size={18} />} label="Phone" value={profile.phone || "N/A"} />
              
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group md:col-span-2"
              >
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-[#0047AB]" />
                  <span className="text-sm font-bold text-slate-700">Update Security Password</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* --- Modals --- */}

        {/* 4. Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-[28px] shadow-2xl animate-in zoom-in-95 duration-300 p-8 my-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Edit Profile Info</h2>
                <button onClick={() => setIsEditingProfile(false)} className="text-slate-300"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ProfileInput label="Student ID / Reg No" value={profile.reg_no} onChange={(v) => setProfile({...profile, reg_no: v})} />
                  <ProfileInput label="Full Name" value={profile.full_name} onChange={(v) => setProfile({...profile, full_name: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ProfileInput label="Department" value={profile.dept} onChange={(v) => setProfile({...profile, dept: v})} />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                    <input type="number" min="1" max="5" value={profile.year} onChange={(e) => setProfile({...profile, year: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-[#0047AB]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-[#0047AB]">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <ProfileInput label="Phone" value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} />
                <ProfileInput label="LinkedIn Profile URL" type="url" value={profile.linkedin_url} onChange={(v) => setProfile({...profile, linkedin_url: v})} />

                <button 
                  disabled={saving}
                  className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Profile Details
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Password Modal (Kept as is per instructions) */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl animate-in zoom-in-95 duration-300 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Update Security</h2>
                <button onClick={() => setIsChangingPassword(false)} className="text-slate-300"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <PasswordInput label="Current Password" placeholder="••••••••" />
                <PasswordInput label="New Password" placeholder="••••••••" />
                <button onClick={() => setIsChangingPassword(false)} className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 mt-2">
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
    <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const ProfileInput = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-[#0047AB]" />
  </div>
);

const PasswordInput = ({ label, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input type="password" placeholder={placeholder} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-[#0047AB]" />
  </div>
);