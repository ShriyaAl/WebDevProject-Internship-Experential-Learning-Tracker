import React, { useState } from 'react';
import { 
  Upload, Mail, CheckCircle2, MessageSquare, 
  Send, Clock, FileText, User, ChevronRight, AlertCircle 
} from 'lucide-react';

// --- Sub-Components ---

const TimelineNode = ({ status, title, date, onAction }) => {
  const configs = {
    Approved: { color: 'bg-[#22C55E]', icon: CheckCircle2, label: 'Approved' },
    Amber: { color: 'bg-[#F59E0B]', icon: AlertCircle, label: 'Changes Needed' },
    Locked: { color: 'bg-[#94A3B8]', icon: Clock, label: 'Upcoming' }
  };
  const config = configs[status];

  return (
    <div className="relative pl-8 pb-10 last:pb-0 group">
      {/* Vertical Line */}
      <div className="absolute left-[11px] top-0 h-full w-0.5 bg-slate-100 group-last:hidden" />
      
      {/* Circular Node */}
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${config.color}`} />
      
      <div className="bg-white p-5 rounded-[12px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                status === 'Amber' ? 'bg-amber-50 text-amber-600' : 
                status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
              }`}>
                {config.label}
              </span>
              <span className="text-[10px] font-medium text-slate-400">{date}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          </div>
          {status === 'Amber' ? (
            <button 
              onClick={onAction}
              className="px-4 py-2 bg-white border border-amber-200 text-amber-600 text-xs font-bold rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={14} /> View Feedback
            </button>
          ) : status === 'Locked' ? (
            <button className="px-4 py-2 bg-[#0047AB] text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-all flex items-center gap-2">
              <Upload size={14} /> Upload Report
            </button>
          ) : (
            <div className="p-2 text-emerald-500"><CheckCircle2 size={20} /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MyInternship() {
  const [isVerified, setIsVerified] = useState(false);
  const [activeStep, setActiveStep] = useState(2); // Starting at Offer Letter for demo
  const [showFeedback, setShowFeedback] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // --- State 1: Onboarding Portal ---
  if (!isVerified) {
    return (
      <div className="p-10 w-full max-w-[1200px] mx-auto animate-in fade-in duration-700 bg-[#F8FAFC]">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Internship Verification</h1>
          <p className="text-slate-500 mt-2 italic">Authenticate your position to unlock the reporting timeline.</p>
        </header>

        {/* Multi-Step Stepper */}
        <div className="flex items-center justify-center mb-12 max-w-2xl mx-auto">
          {['Company Details', 'Offer Letter', 'Manager Assignment'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-4 border-[#F8FAFC] transition-all shadow-sm ${
                  activeStep > idx + 1 ? 'bg-[#22C55E] text-white' : 
                  activeStep === idx + 1 ? 'bg-[#0047AB] text-white' : 'bg-white text-slate-300'
                }`}>
                  {activeStep > idx + 1 ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-2 font-black uppercase tracking-widest ${activeStep === idx + 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
              {idx < 2 && <div className={`w-32 h-0.5 mx-[-10px] mt-[-20px] ${activeStep > idx + 1 ? 'bg-[#22C55E]' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="max-w-xl mx-auto space-y-6">
          {/* Offer Letter Uploader */}
          <div className="bg-white p-12 rounded-[16px] border-2 border-dashed border-slate-200 hover:border-[#0047AB] transition-all text-center group cursor-pointer shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-[#0047AB]" size={28} />
            </div>
            <h3 className="font-bold text-slate-800">Upload Signed Offer Letter</h3>
            <p className="text-xs text-slate-400 mt-1">Drag and drop PDF (Max 5MB)</p>
          </div>

          {/* Manager Assignment */}
          <div className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Manager's Professional Email</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input type="email" placeholder="hr.manager@company.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-[#0047AB] transition-all" />
              </div>
              <button 
                onClick={() => {
                  setMagicLinkSent(true);
                  setTimeout(() => setIsVerified(true), 1500);
                }}
                className="bg-[#0047AB] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center gap-2"
              >
                {magicLinkSent ? 'Sent!' : 'Invite Manager'}
              </button>
            </div>
            {magicLinkSent && (
              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#0047AB] bg-indigo-50 p-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 size={14} /> Magic Link Sent! Waiting for Manager verification.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- State 2: Reporting Timeline (Active Mode) ---
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      {/* Main Section (70%) */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Internship Lifecycle</h1>
            <p className="text-sm text-slate-500 italic">Google Cloud Internship • Week 4 of 12</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 size={12} /> Active Status
          </div>
        </header>

        <div className="max-w-3xl">
          <TimelineNode status="Approved" title="Week 1: System Architecture & Onboarding" date="Oct 01 - Oct 07" />
          <TimelineNode status="Approved" title="Week 2: Backend API Integration" date="Oct 08 - Oct 14" />
          <TimelineNode 
            status="Amber" 
            title="Week 3: Database Schema Migration" 
            date="Oct 15 - Oct 21" 
            onAction={() => setShowFeedback(true)}
          />
          <TimelineNode status="Locked" title="Week 4: Frontend Component Library" date="Oct 22 - Oct 28" />
        </div>
      </main>

      {/* Sidebar (30%): Feedback Loop */}
      <aside className={`w-full lg:w-[400px] border-l border-slate-200 bg-white flex flex-col transition-all duration-500 ease-in-out ${showFeedback ? 'translate-x-0' : 'translate-x-4 opacity-50 blur-sm pointer-events-none'}`}>
        {/* Manager Card */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm text-slate-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-500 font-medium italic">Project Manager • Google</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-[9px] font-black text-[#0047AB] bg-indigo-50 px-2 py-1 rounded">Verified Expert</span>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Fast Responder</span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
          <div className="flex justify-center mb-6">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Thread: Week 3 Report</span>
          </div>
          
          {/* Manager Message */}
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-slate-100 text-slate-700 p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed">
              Hey! The migration plan looks solid, but we need to see the rollback strategy for the PostgreSQL clusters. Can you add that section?
            </div>
            <span className="text-[9px] text-slate-400 mt-1 ml-2">10:15 AM • Manager</span>
          </div>

          {/* Student Message */}
          <div className="flex flex-col items-end ml-auto max-w-[85%]">
            <div className="bg-[#0047AB] text-white p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed">
              Understood, Sarah. I'll include the pg_dump rollback procedures and the point-in-time recovery steps. Re-uploading shortly!
            </div>
            <span className="text-[9px] text-slate-400 mt-1 mr-2">10:42 AM • You</span>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-slate-50">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-xs outline-none focus:border-indigo-400" 
            />
            <button className="absolute right-2 top-2 p-1.5 bg-[#0047AB] text-white rounded-lg hover:bg-blue-800 transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}