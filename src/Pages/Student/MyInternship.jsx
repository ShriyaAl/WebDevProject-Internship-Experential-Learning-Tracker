import React, { useState } from 'react';
import { 
  Plus, Building2, Briefcase, Calendar, 
  ArrowRight, X, CheckCircle2, ChevronRight,
  Edit3, Upload, ClipboardList, Save
} from 'lucide-react';

export default function MyInternship() {
  const [view, setView] = useState('list'); 
  const [internships, setInternships] = useState([]); 
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [formData, setFormData] = useState({ company: '', role: '', duration: '' });

  const handleAddInternship = () => {
    if (formData.company && formData.role) {
      setInternships([...internships, { ...formData, id: Date.now(), status: 'Pending Verification' }]);
      setFormData({ company: '', role: '', duration: '' });
      setView('list');
    }
  };

  const updateInternDetails = (id, field, value) => {
    setInternships(internships.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  if (view === 'list' && !selectedIntern) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Internships</h1>
            </div>
            <button onClick={() => setView('form')} className="bg-[#0047AB] text-white p-3 rounded-2xl hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2 group">
              <Plus size={24} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" />
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
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{item.company}</h3>
                      <p className="text-sm text-slate-500 font-medium">{item.role}</p>
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

  if (selectedIntern) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Close Header */}
          <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Internship Workspace</h2>
            <button onClick={() => setSelectedIntern(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Editable Details */}
            <div className="space-y-6 border-r border-slate-100 pr-8">
              <div className="flex items-center gap-2 text-[#0047AB] mb-2">
                <Edit3 size={18} /> <span className="text-xs font-black uppercase tracking-widest">General Info</span>
              </div>
              <div className="space-y-4">
                <DetailInput label="Company Name" value={selectedIntern.company} onChange={(v) => updateInternDetails(selectedIntern.id, 'company', v)} />
                <DetailInput label="Job Role" value={selectedIntern.role} onChange={(v) => updateInternDetails(selectedIntern.id, 'role', v)} />
                <DetailInput label="Duration (Months)" value={selectedIntern.duration} onChange={(v) => updateInternDetails(selectedIntern.id, 'duration', v)} type="number" />
              </div>
            </div>

            {/* Middle: Request Form / Calendar */}
            <div className="space-y-6 border-r border-slate-100 pr-8">
              <div className="flex items-center gap-2 text-[#0047AB] mb-2">
                <Calendar size={18} /> <span className="text-xs font-black uppercase tracking-widest">Internship Period</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Start Date</label>
                  <input type="date" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0047AB]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">End Date</label>
                  <input type="date" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0047AB]" />
                </div>
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black transition-all">Request Update</button>
              </div>
            </div>

            {/* Right: Documents & Survey */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#0047AB] mb-2">
                <Upload size={18} /> <span className="text-xs font-black uppercase tracking-widest">Compliance</span>
              </div>
              <div className="space-y-3">
                <UploadZone label="Signed Offer Letter" />
                <UploadZone label="Completion Certificate" />
              </div>
              <button 
                onClick={() => setShowSurvey(true)}
                className="w-full mt-6 bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between group hover:bg-emerald-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={20} />
                  <span className="font-bold text-sm text-left">Internal Performance Survey</span>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Survey Modal (Nested) */}
        {showSurvey && (
          <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-[28px] relative animate-in zoom-in-95">
              <button onClick={() => setShowSurvey(false)} className="absolute right-6 top-6 text-slate-300"><X size={20} /></button>
              <h3 className="text-xl font-black mb-4">Internship Survey</h3>
              <p className="text-sm text-slate-500 mb-6">Briefly rate your experience so far.</p>
              <div className="space-y-4">
                <textarea placeholder="Your feedback..." className="w-full p-4 bg-slate-50 border rounded-2xl h-32 outline-none text-sm" />
                <button onClick={() => setShowSurvey(false)} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold">Submit Survey</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 animate-in zoom-in-95">
      <div className="w-full max-w-md bg-white p-8 rounded-[24px] border shadow-xl relative">
        <button onClick={() => setView('list')} className="absolute right-6 top-6 text-slate-300"><X size={20} /></button>
        <h2 className="text-2xl font-black text-slate-900 mb-8">Internship Details</h2>
        <div className="space-y-6">
          <DetailInput label="Company Name" value={formData.company} onChange={(v) => setFormData({...formData, company: v})} />
          <DetailInput label="Job Role" value={formData.role} onChange={(v) => setFormData({...formData, role: v})} />
          <DetailInput label="Duration" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} type="number" />
          <button onClick={handleAddInternship} className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">Confirm & Add <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}


const DetailInput = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] focus:bg-white transition-all outline-none" 
    />
  </div>
);

const UploadZone = ({ label }) => (
  <div className="border-2 border-dashed border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center group cursor-pointer hover:border-blue-400 transition-colors">
    <Upload size={20} className="text-slate-300 group-hover:text-blue-500 mb-1" />
    <span className="text-[10px] font-bold text-slate-400">{label}</span>
  </div>
);