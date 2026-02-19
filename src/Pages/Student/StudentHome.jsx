import React from 'react';
import { 
  Zap, Clock, AlertCircle, CheckCircle2, 
  Plus, Send, Calendar, ArrowUpRight 
} from 'lucide-react';

export default function StudentHome() {
  // Logic: Set to true for interns to see Hackathons instead of Job Postings
  const isCurrentlyInterning = false; 

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
      <div className="max-w-[1440px] mx-auto p-8">
        
        {/* 1. HERO SECTION: Target Role */}
        <header className="mb-8 px-1">
          <p className="text-indigo-600 text-xs font-bold uppercase tracking-[0.2em] mb-2">Personal Growth Engine</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Aspiring Full-Stack Developer
          </h1>
        </header>

        {/* 2. BENTO GRID: 70/30 Split Architecture */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (70%) - Progression & Discovery */}
          <div className="col-span-8 space-y-8">
            
            {/* KPI Row: Top Utility */}
            <div className="grid grid-cols-2 gap-6">
              {/* Skill Match: Indigo Progress Ring */}
              <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm flex items-center gap-6 h-32">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * 75) / 100} className="text-[#0047AB]" />
                  </svg>
                  <span className="absolute text-lg font-black text-slate-800">75%</span>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Skill Match Score</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium italic">Ready for Junior Roles</p>
                </div>
              </div>

              {/* Urgent Actions: Alert Coral */}
              <div className="bg-white p-6 rounded-[12px] border-t-4 border-[#F87171] shadow-sm h-32 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#F87171] text-[10px] font-bold uppercase tracking-widest">Urgent Actions</p>
                    <h2 className="text-3xl font-black text-slate-900 mt-1 leading-none">02</h2>
                    <p className="text-slate-500 text-[11px] mt-2 font-medium italic">Report Due: 12h • Offer Pending</p>
                  </div>
                  <div className="p-2 bg-red-50 text-[#F87171] rounded-lg">
                    <AlertCircle size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Path Component: Navigation Stepper */}
            <section className="bg-white p-8 rounded-[12px] border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Current Lifecycle Stage</h3>
              <div className="flex items-center justify-between relative">
                {['Discovery', 'Applied', 'Verifying', 'Active', 'Credits'].map((stage, idx) => (
                  <div key={stage} className="flex flex-col items-center z-10 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      idx < 2 ? 'bg-[#22C55E] border-[#22C55E] text-white' : 
                      idx === 2 ? 'bg-[#0047AB] border-[#0047AB] text-white' : 
                      'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {idx < 2 ? <CheckCircle2 size={18} /> : <span>{idx + 1}</span>}
                    </div>
                    <span className={`text-[10px] mt-3 font-bold uppercase tracking-widest ${idx === 2 ? 'text-[#0047AB]' : 'text-slate-400'}`}>{stage}</span>
                  </div>
                ))}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
              </div>
            </section>

            {/* Conditional Opportunity Feed: Horizontal Scrolling */}
            <section>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  {isCurrentlyInterning ? 'Growth: Hackathons & Events' : 'Marketplace: Latest Roles'}
                </h3>
                <button className="text-[#0047AB] text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {[1, 2, 3].map(i => (
                  <div key={i} className="min-w-[320px] bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group shrink-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs tracking-tighter">LOGO</div>
                      <span className="text-[9px] font-black text-[#22C55E] uppercase bg-emerald-50 px-2 py-0.5 rounded tracking-widest">92% Match</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base leading-tight">Frontend Intern</h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium italic mb-6">Stripe • Posted 2h ago</p>
                    <button className="w-full py-2.5 border border-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500 group-hover:bg-[#0047AB] group-hover:text-white group-hover:border-[#0047AB] transition-all">
                      Details & Apply
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (30%) - Activity & Quick Actions */}
          <div className="col-span-4 space-y-6">
            {/* Recent Activity: Matches Faculty Feed */}
            <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm min-h-[400px]">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Recent System Updates</h3>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-start group relative">
                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400">FH</div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-800 leading-tight">
                        <span className="font-bold">Faculty Hub</span> approved your <span className="text-[#0047AB] font-bold">Week 3 Report</span>
                      </p>
                      <button className="text-[9px] font-bold text-slate-400 mt-1.5 flex items-center gap-1 hover:text-[#0047AB]">
                        Review Details <ArrowUpRight size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button className="w-full bg-[#0047AB] text-white p-4 rounded-[12px] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all">
                <Plus size={16} /> Log Application
              </button>
              <button className="w-full bg-white border border-slate-200 text-slate-800 p-4 rounded-[12px] font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <Send size={16} /> Submit Weekly Report
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}