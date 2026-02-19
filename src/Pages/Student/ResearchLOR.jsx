import React, { useState } from 'react';
import { 
  Plus, Search, Filter, FileCheck, Clock, 
  Download, Tag, User, Beaker, GraduationCap, X 
} from 'lucide-react';

export default function ResearchLOR() {
  const [tags, setTags] = useState(['#MachineLearning', '#NLP', '#CyberSecurity']);
  const [inputValue, setInputValue] = useState('');

  const researchProjects = [
    { id: 1, mentor: "Dr. Aris", field: "NLP", title: "Optimizing Transformer Latency", duration: "4 Months", status: "Admin Approved" },
    { id: 2, mentor: "Prof. Sarah", field: "CyberSecurity", title: "Zero-Trust Protocol Analysis", duration: "6 Months", status: "Admin Approved" },
  ];

  const lorRequests = [
    { id: 1, faculty: "Dr. Aris", project: "ReMotion UI", date: "Oct 12, 2025", status: "Signed" },
    { id: 2, faculty: "Prof. Sarah", project: "Cloud Security", date: "Feb 10, 2026", status: "Drafting" },
    { id: 3, faculty: "Dr. Aris", project: "NLP Research", date: "Feb 18, 2026", status: "Awaiting Signature" },
  ];

  const addTag = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newTag = inputValue.startsWith('#') ? inputValue.trim() : `#${inputValue.trim()}`;
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto animate-in fade-in duration-500 bg-[#F8FAFC]">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Research & LOR Center</h1>
        <p className="text-slate-500 text-sm italic">Manage academic credentials and discovery internal research projects.</p>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT SECTION (70%) --- */}
        <div className="col-span-8 space-y-8">
          
          {/* 1. INTERNAL RESEARCH FEED */}
          <section className="bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Beaker size={18} className="text-indigo-600" /> Matched Research Postings
              </h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Smart Feed Active</span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {researchProjects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{project.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                        Mentor: {project.mentor} • {project.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded">#{project.field}</span>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded flex items-center gap-1 border border-emerald-100">
                      <FileCheck size={12} /> {project.status}
                    </span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. LOR WORKSPACE TABLE */}
          <section className="bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={18} className="text-indigo-600" /> Academic Recommendations
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-4 font-black">Faculty Name</th>
                    <th className="px-8 py-4 font-black">Project Context</th>
                    <th className="px-8 py-4 font-black text-center">Date Requested</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {lorRequests.map((lor) => (
                    <tr key={lor.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-slate-800 italic">{lor.faculty}</td>
                      <td className="px-8 py-5 text-xs text-slate-500 font-medium">{lor.project}</td>
                      <td className="px-8 py-5 text-xs text-slate-400 text-center font-medium">{lor.date}</td>
                      <td className="px-8 py-5 text-right">
                        <StatusBadge status={lor.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* --- RIGHT SECTION (30%) --- */}
        <div className="col-span-4 space-y-6">
          
          {/* Interest Tag Sidebar */}
          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-indigo-600" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Interest Identity</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
              Updating your tags instantly refreshes the Smart Research Feed to prioritize relevant projects.
            </p>

            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-100">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-rose-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tag..."
                className="bg-transparent text-[10px] font-bold outline-none w-20 text-slate-600"
              />
            </div>
          </div>

          {/* Primary Action Widget */}
          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Academic Actions</h4>
            <button className="w-full bg-[#0047AB] text-white p-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all active:scale-95">
              <Plus size={16} /> Request New Recommendation
            </button>
            <p className="text-[9px] text-slate-400 text-center font-medium italic">
              *Only available for verified past internship supervisors.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    'Signed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Awaiting Signature': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Drafting': 'bg-slate-50 text-slate-400 border-slate-100',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status === 'Signed' && <Download size={10} className="animate-bounce" />}
      {status === 'Awaiting Signature' && <Clock size={10} />}
      {status}
    </div>
  );
};

// Simple Chevron for the list
const ChevronRight = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);