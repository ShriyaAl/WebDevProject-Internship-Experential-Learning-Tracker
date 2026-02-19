import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Calendar, 
  MoreVertical, CheckCircle2, TrendingUp, 
  Clock, XCircle, Briefcase 
} from 'lucide-react';

// --- Sub-Components ---

const KanbanCard = ({ app, onMarkAsHired }) => {
  // Only changing the color values here to match the new theme
  const statusColors = {
    Applied: 'bg-blue-50 text-blue-600',
    Interviewing: 'bg-amber-50 text-amber-600',
    Offered: 'bg-emerald-50 text-emerald-600',
    Rejected: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className="bg-white p-4 rounded-[12px] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-400 text-[10px]">
          {app.company[0]}
        </div>
        <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
      </div>
      
      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">{app.role}</h4>
      <p className="text-[11px] text-slate-500 font-medium mb-3">{app.company}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${statusColors[app.status]}`}>
          {app.status}
        </span>
        {app.nextStep && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 italic">
            <Clock size={10} /> {app.nextStep}
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
        <span className="text-[9px] font-medium text-slate-400 italic">Applied {app.date}</span>
        {app.status === 'Offered' && (
          <button 
            onClick={() => onMarkAsHired(app)}
            className="bg-[#4F46E5] text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
          >
            Mark as Hired
          </button>
        )}
      </div>
    </div>
  );
};

export default function MyApplications() {
  const [filter, setFilter] = useState('Active');
  
  const applications = [
    { id: 1, role: "Full-Stack Intern", company: "Stripe", status: "Offered", date: "Oct 12", nextStep: "Sign Offer" },
    { id: 2, role: "Frontend Dev", company: "Linear", status: "Interviewing", date: "Oct 15", nextStep: "Tech Interview" },
    { id: 3, role: "UI Intern", company: "Airbnb", status: "Applied", date: "Oct 18", nextStep: "Follow up" },
    { id: 4, role: "Backend Intern", company: "Vercel", status: "Rejected", date: "Oct 10", nextStep: null },
  ];

  const columns = [
    { name: 'Applied', color: 'text-blue-600' },
    { name: 'Interviewing', color: 'text-amber-600' },
    { name: 'Offered', color: 'text-emerald-600' },
    { name: 'Rejected', color: 'text-rose-600' }
  ];

  const handleMarkAsHired = (app) => {
    const confirm = window.confirm(`Confirm Hired at ${app.company}? This will transition your profile to 'Verifying'.`);
    if (confirm) console.log("Profile state changed to: VERIFYING");
  };

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto animate-in fade-in duration-500 bg-[#F8FAFC]">
      
      {/* 1. TOP BAR */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Application Tracker</h1>
          <p className="text-slate-500 text-sm italic">Manage your journey from application to hire.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input type="text" placeholder="Search companies..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400 w-64 shadow-sm" />
          </div>
          <div className="bg-white p-1 border border-slate-200 rounded-xl flex gap-1 shadow-sm">
            {['Active', 'Archived'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT (70/30) */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Kanban Board (70%) */}
        <div className="col-span-8 grid grid-cols-4 gap-4">
          {columns.map(col => (
            <div key={col.name} className="flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${col.color}`}>{col.name}</h3>
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">
                  {applications.filter(a => a.status === col.name).length}
                </span>
              </div>
              <div className="bg-slate-100/30 rounded-[16px] p-3 flex-1 border border-dashed border-slate-200">
                {applications
                  .filter(app => app.status === col.name)
                  .map(app => <KanbanCard key={app.id} app={app} onMarkAsHired={handleMarkAsHired} />)
                }
                <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-[12px] text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Add Role</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Career Stats (30%) */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-500" /> Conversion Funnel
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Applied', val: 10, color: 'bg-blue-500' },
                { label: 'Interviews', val: 3, color: 'bg-amber-500' },
                { label: 'Offers', val: 1, color: 'bg-emerald-500' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                    <span>{stat.label}</span>
                    <span>{stat.val}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${(stat.val / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#4F46E5] p-6 rounded-[12px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-80">Upcoming Interviews</h3>
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/20 transition-all">
                <p className="text-xs font-bold mb-1">Technical Interview</p>
                <div className="flex items-center gap-4 text-[10px] opacity-80 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12} /> Oct 24</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> 10:00 AM</span>
                </div>
              </div>
            </div>
            <Briefcase size={80} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}