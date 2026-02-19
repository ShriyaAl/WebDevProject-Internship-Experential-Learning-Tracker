import React, { useState } from 'react';
import { 
  Plus, FileText, ExternalLink, Github, Linkedin, 
  Globe, Download, CheckCircle2, Upload, Trash2, 
  Settings, Award, Briefcase 
} from 'lucide-react';

export default function ProfileSkillHub() {
  const [techSkills, setTechSkills] = useState(['React', 'Node.js', 'PostgreSQL', 'AWS', 'Python']);
  const [softSkills] = useState(['Leadership', 'Public Speaking', 'Problem Solving']);
  const [tools] = useState(['Figma', 'Docker', 'Git', 'Jira']);

  const certificates = [
    { id: 1, name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: "Jan 2026" },
    { id: 2, name: "Full-Stack Development", issuer: "Meta (Coursera)", date: "Dec 2025" },
    { id: 3, name: "Advanced UI Design", issuer: "Figma Academy", date: "Nov 2025" },
  ];

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto animate-in fade-in duration-500 bg-[#F8FAFC]">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile & Skill Hub</h1>
          <p className="text-slate-500 text-sm italic">Manage your digital identity and verified competencies.</p>
        </div>
        <button className="bg-[#0047AB] text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all">
          <Download size={16} /> Export Professional Profile
        </button>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT SECTION (70%) --- */}
        <div className="col-span-8 space-y-8">
          
          {/* 1. SKILL INVENTORY */}
          <section className="bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Settings size={18} className="text-indigo-600" /> Competency Inventory
              </h3>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Technical Skills */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Technical Skills</h4>
                  <button className="p-1 hover:bg-slate-50 rounded text-indigo-600 transition-colors"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techSkills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-[#0047AB] text-[11px] font-black rounded-lg border border-indigo-100 shadow-sm">#{skill}</span>
                  ))}
                </div>
              </div>

              {/* Soft Skills & Tools Grid */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {softSkills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-100 italic">#{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Workflow Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {tools.map(tool => (
                      <span key={tool} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-[11px] font-bold rounded-lg border border-teal-100">#{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. CERTIFICATIONS GALLERY */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Verified Evidence</h3>
            <div className="grid grid-cols-3 gap-6">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white p-5 rounded-[12px] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={14} className="text-slate-400 hover:text-indigo-600 cursor-pointer" />
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Award size={24} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 leading-tight mb-1">{cert.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mb-4 italic">{cert.issuer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                    <span className="text-[9px] text-slate-300 font-bold uppercase">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT SECTION (30%) --- */}
        <div className="col-span-4 space-y-6">
          
          {/* Resume Management */}
          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Resume Management</h3>
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all text-center group cursor-pointer">
              <Upload className="mx-auto text-slate-300 mb-2 group-hover:text-indigo-600 transition-colors" size={20} />
              <p className="text-[11px] font-bold text-slate-500 mb-1">Justin_Mason_Resume.pdf</p>
              <p className="text-[9px] text-slate-300 uppercase font-black">Updated Feb 19, 2026</p>
            </div>
            <button className="w-full mt-4 py-2 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 transition-colors">
              Replace Resume
            </button>
          </div>

          {/* Career Links Integration */}
          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Professional Assets</h3>
            <div className="space-y-4">
              {[
                { label: 'LinkedIn', icon: Linkedin, url: 'linkedin.com/in/justin' },
                { label: 'GitHub', icon: Github, url: 'github.com/justin' },
                { label: 'Portfolio', icon: Globe, url: 'justin.dev' }
              ].map(link => (
                <div key={link.label}>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{link.label}</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <link.icon className="absolute left-3 top-2.5 text-slate-300" size={14} />
                      <input 
                        type="text" 
                        readOnly 
                        value={link.url}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-600 outline-none"
                      />
                    </div>
                    <button className="p-2 border border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-indigo-600 p-6 rounded-[12px] text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Public Profile Impact</h4>
            <div className="flex gap-4 relative z-10">
              <div className="flex-1">
                <p className="text-2xl font-black">12</p>
                <p className="text-[9px] font-bold opacity-60 uppercase">Faculty Views</p>
              </div>
              <div className="flex-1 border-l border-white/10 pl-4">
                <p className="text-2xl font-black text-emerald-300">03</p>
                <p className="text-[9px] font-bold opacity-60 uppercase">Interview Invitations</p>
              </div>
            </div>
            <Briefcase size={80} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
          </div>

        </div>
      </div>
    </div>
  );
}