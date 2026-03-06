import React, { useState } from 'react';
import { 
  Plus, Calendar, FileText, Send, 
  Clock, CheckCircle2, XCircle, ChevronRight, 
  X, AlertCircle, Filter, Download 
} from 'lucide-react';

export default function Bonafide() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, title: 'Summer Internship Permission', type: 'Verification', from: '2026-05-01', to: '2026-08-01', status: 'Approved' },
    { id: 2, title: 'Industry Visit Request', type: 'Duty Leave', from: '2026-03-15', to: '2026-03-16', status: 'Pending' }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: '',
    type: 'Verification',
    fromDate: '',
    toDate: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = {
      ...newRequest,
      id: Date.now(),
      status: 'Pending',
      from: newRequest.fromDate,
      to: newRequest.toDate
    };
    setRequests([request, ...requests]);
    setIsModalOpen(false);
    setNewRequest({ title: '', type: 'Verification', fromDate: '', toDate: '', description: '' });
  };

  const handleDownload = (reqTitle) => {
    alert(`Downloading Bonafide Document for: ${reqTitle}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonafide Requests</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0047AB] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2 group"
          >
            <Plus size={20} strokeWidth={3} />
            Create New Request
          </button>
        </header>

        {/* Status Tracker List */}
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Side: Info */}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {req.status === 'Approved' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{req.title}</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{req.type} • {req.from} to {req.to}</p>
                  </div>
                </div>

                {/* Right Side: Download (Now on Left of Timeline) + Stepper */}
                <div className="flex items-center gap-8">
                  
                  {/* Download Button - Positioned before the timeline */}
                  <div className="w-32 flex justify-end">
                    {req.status === 'Approved' ? (
                      <button 
                        onClick={() => handleDownload(req.title)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 animate-in slide-in-from-right-2"
                      >
                        <Download size={14} /> Download
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic"></span>
                    )}
                  </div>

                  {/* Micro-Stepper */}
                  <div className="flex items-center gap-2">
                    <StatusStep label="Submitted" completed={true} />
                    <div className={`w-8 h-0.5 ${req.status === 'Approved' ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    <StatusStep label="Review" completed={req.status === 'Approved'} active={req.status === 'Pending'} />
                    <div className={`w-8 h-0.5 ${req.status === 'Approved' ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    <StatusStep label="Finalized" completed={req.status === 'Approved'} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Form Modal (remains same) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800">New Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">Request Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Summer Internship Permission"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB] transition-all"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">From Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB]"
                    onChange={(e) => setNewRequest({...newRequest, fromDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">To Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB]"
                    onChange={(e) => setNewRequest({...newRequest, toDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">Detailed Reason</label>
                <textarea 
                  rows="3"
                  placeholder="Explain why this request is being made..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB] resize-none"
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
              >
                <Send size={18} /> Submit for Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatusStep = ({ label, completed, active }) => (
  <div className="flex flex-col items-center">
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
      completed ? 'bg-emerald-500 border-emerald-500' : 
      active ? 'bg-white border-[#0047AB]' : 'bg-white border-slate-200'
    }`}>
      {completed && <CheckCircle2 size={12} className="text-white" />}
    </div>
    <span className={`text-[8px] mt-1 font-bold uppercase tracking-tighter ${
      completed ? 'text-emerald-500' : active ? 'text-[#0047AB]' : 'text-slate-300'
    }`}>
      {label}
    </span>
  </div>
);