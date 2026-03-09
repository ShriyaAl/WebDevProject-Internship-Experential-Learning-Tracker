import React, { useState, useEffect } from 'react';
import { Tag, History, Mail, Briefcase, Edit2, CheckCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api';

const FacultyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    designation: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const meRes = await apiFetch('/api/auth/me');
        if (meRes.success) {
          setAuthData(meRes.data);

          if (meRes.data?.user?.profile_setup) {
            // we could fetch from dashboard to see if profile details exist, but typically 
            // since we don't have a GET /api/incharge/profile endpoint, we just assume `data.user` has it or we just present an empty view.
            // As a short cut for this schema, we will just present form data to upsert. 
          }
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      const res = await apiFetch('/api/incharge/profile', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        setProfile(res.data);
        setIsEditing(false);
      }
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-10 text-center flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-400">Loading profile...</p>
    </div>;
  }

  const displayName = profile?.full_name || 'Incharge Faculty';
  const displayDesignation = profile?.designation || 'Academic Staff';
  const initials = displayName.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 font-sans">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-6 right-6 flex items-center gap-2 text-sm font-bold text-[#0e4ea7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit2 size={16} /> Edit Profile
            </button>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0e4ea7] to-blue-400 flex items-center justify-center text-white text-3xl font-bold uppercase">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
                <p className="text-gray-500 font-medium">{displayDesignation}</p>
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded"><Mail size={14} /> {authData?.email}</span>
                  {profile?.phone && <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded"><Briefcase size={14} /> {profile.phone}</span>}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4">Update Profile Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#0e4ea7] outline-none"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Dr. Alan Turing"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Designation</label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#0e4ea7] outline-none"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Senior Professor"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone</label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#0e4ea7] outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-800">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-[#0e4ea7] text-white rounded-lg hover:bg-blue-800">
                <CheckCircle size={16} /> Save Profile
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-60">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Tag size={18} className="text-[#0e4ea7]" /> Expertise Tags</h4>
        <div className="flex flex-wrap gap-2">
          {['NLP', 'Computer Vision', 'Embedded Systems', 'React', 'Cloud Architecture'].map(tag => (
            <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-[#0e4ea7] hover:text-white transition-colors cursor-pointer">{tag}</span>
          ))}
          <button className="px-4 py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-full text-sm hover:border-[#0e4ea7] hover:text-[#0e4ea7]">+ Add Tag</button>
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">Note: These tags help students find you for research mentorship. (Static UI Preview)</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-60">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><History size={18} className="text-[#0e4ea7]" /> Mentorship Archive</h4>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-700">Batch of 202{i + 3} Students</span>
              <span className="text-sm font-bold text-[#0e4ea7]">48 Students Mentored</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
