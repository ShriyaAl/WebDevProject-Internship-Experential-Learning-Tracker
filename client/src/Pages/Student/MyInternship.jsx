import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Plus, Building2, Briefcase, Calendar,
  ArrowRight, X, CheckCircle2, ChevronRight,
  Edit3, Upload, ClipboardList, Loader2, MapPin, DollarSign, Globe
} from 'lucide-react';

export default function MyInternship() {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [internships, setInternships] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    role_title: '',
    expected_start_date: '',
    expected_end_date: '',
    mode: 'ONSITE',
    location: '',
    stipend: '',
    company_linkedin: '',
    supporting_documents: []
  });

  const [documentName, setDocumentName] = useState('Offer Letter');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // --- 1. Fetch Internships on Mount ---
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/internships/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setInternships(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Handle File Upload to Supabase ---
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!documentName.trim()) {
      alert("Please provide a name for this document before uploading.");
      return;
    }

    setUploading(true);
    try {
      const userStr = localStorage.getItem('user');
      const userId = JSON.parse(userStr).id;
      const path = `supporting-docs/${userId}/${Date.now()}_${file.name}`;

      const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from('documents').getPublicUrl(path);

      // Append new document to the array
      setFormData(prev => ({
        ...prev,
        supporting_documents: [...prev.supporting_documents, { name: documentName, url: data.publicUrl }]
      }));
      setDocumentName(''); // Reset the input field
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 3. Handle Form Submit (POST) ---
  const handleAddInternship = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      supporting_documents: formData.offer_letter_url ? [formData.offer_letter_url] : []
    };

    try {
      const res = await fetch(`${API_BASE}/api/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload) 
      });
      
      const result = await res.json();
    
      if (result.success) {
        setInternships([...internships, result.data]);
        setView('list');
        // Reset form
        setFormData({ company_name: '', role_title: '', expected_start_date: '', expected_end_date: '', mode: 'ONSITE', location: '', stipend: '', company_linkedin: '', offer_letter_url: '' });
      }
    } catch (err) {
      alert("Post failed: " + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // --- LIST VIEW ---
  if (view === 'list' && !selectedIntern) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Internships</h1>
            <button onClick={() => setView('form')} className="bg-[#0047AB] text-white p-3 rounded-2xl hover:bg-blue-800 transition-all flex items-center gap-2">
              <Plus size={24} strokeWidth={2.5} />
              <span className="pr-2 font-bold text-sm">Add New</span>
            </button>
          </header>

          {internships.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[32px]">
              <p className="text-slate-400 font-medium">No internships added yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {internships.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center"><Building2 size={24} /></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-800 text-lg">{item.company_name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.verification_status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                            item.verification_status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                              'bg-amber-50 text-amber-600'
                          }`}>
                          {item.verification_status || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{item.role_title} • {item.mode}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedIntern(item)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ChevronRight size={28} className="text-slate-300 group-hover:text-[#0047AB]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DETAIL WORKSPACE ---
  if (selectedIntern) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Internship Workspace</h2>
            <button onClick={() => setSelectedIntern(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} className="text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6 border-r pr-8">
              <h4 className="text-xs font-black uppercase text-[#0047AB]">Display Details</h4>
              <InfoRow label="Company" value={selectedIntern.company_name} />
              <InfoRow label="Role" value={selectedIntern.role_title} />
              <InfoRow label="Mode" value={selectedIntern.mode} />
              <InfoRow label="Location" value={selectedIntern.location || 'Remote'} />
              <InfoRow label="Stipend" value={selectedIntern.stipend || 'Unpaid'} />
            </div>

            <div className="space-y-6 border-r pr-8 text-center">
              <h4 className="text-xs font-black uppercase text-[#0047AB]">Duration</h4>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm font-bold">{selectedIntern.expected_start_date} <ArrowRight className="inline mx-2" size={14} /> {selectedIntern.expected_end_date}</p>
              </div>
              <button
                onClick={() => navigate('/bonafide-student')}
                className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <ClipboardList size={18} /> Request Document
              </button>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase text-[#0047AB]">Documents</h4>
              {selectedIntern.supporting_documents && selectedIntern.supporting_documents.length > 0 ? (
                <div className="space-y-3">
                  {selectedIntern.supporting_documents.map((doc, idx) => (
                    <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 border rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50">
                      <CheckCircle2 className="text-emerald-500" /> View {doc.name}
                    </a>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-400">No document uploaded.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ADD FORM ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[32px] border shadow-xl relative">
        <button onClick={() => setView('list')} className="absolute right-8 top-8 text-slate-300"><X size={24} /></button>
        <h2 className="text-2xl font-black text-slate-900 mb-8">New Internship Application</h2>

        <form onSubmit={handleAddInternship} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailInput label="Company Name*" value={formData.company_name} onChange={(v) => setFormData({ ...formData, company_name: v })} required />
            <DetailInput label="Role Title*" value={formData.role_title} onChange={(v) => setFormData({ ...formData, role_title: v })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailInput label="Expected Start Date*" type="date" value={formData.expected_start_date} onChange={(v) => setFormData({ ...formData, expected_start_date: v })} required />
            <DetailInput label="Expected End Date*" type="date" value={formData.expected_end_date} onChange={(v) => setFormData({ ...formData, expected_end_date: v })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Mode*</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
              >
                <option value="ONSITE">ONSITE</option>
                <option value="REMOTE">REMOTE</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
            <DetailInput label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailInput label="Stipend (e.g. 20,000)" value={formData.stipend} onChange={(v) => setFormData({ ...formData, stipend: v })} />
            <DetailInput label="Company LinkedIn" type="url" value={formData.company_linkedin} onChange={(v) => setFormData({ ...formData, company_linkedin: v })} />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#0047AB]">Supporting Documents</h3>
            {formData.supporting_documents.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.supporting_documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-bold">
                    <span className="flex items-center gap-2"><CheckCircle2 size={16} /> {doc.name}</span>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs underline hover:text-emerald-800">View</a>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Name (e.g., Offer Letter, NOC)*</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={e => setDocumentName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div className="col-span-1 space-y-1.5 flex flex-col justify-end">
                <div className="relative border-2 border-dashed border-slate-200 h-[46px] rounded-xl flex items-center justify-center group hover:border-[#0047AB] bg-slate-50 cursor-pointer overflow-hidden">
                  {uploading ? <Loader2 className="animate-spin text-[#0047AB]" /> : <span className="text-xs font-bold text-slate-500 group-hover:text-[#0047AB] flex items-center gap-2"><Upload size={14} /> Upload File</span>}
                  <input type="file" onChange={handleDocumentUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">Please provide a document name before clicking upload. You can upload multiple files.</p>
          </div>

          <button type="submit" className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg mt-8">
            Confirm & Add <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Helper components
const InfoRow = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value}</p>
  </div>
);

const DetailInput = ({ label, value, onChange, type = "text", required }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none transition-all"
    />
  </div>
);