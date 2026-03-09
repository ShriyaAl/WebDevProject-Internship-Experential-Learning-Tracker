// import React, { useState } from 'react';
// import { 
//   Plus, Calendar, FileText, Send, 
//   Clock, CheckCircle2, XCircle, ChevronRight, 
//   X, AlertCircle, Filter, Download 
// } from 'lucide-react';

// export default function Bonafide() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [requests, setRequests] = useState([
//     { id: 1, title: 'Summer Internship Permission', type: 'Verification', from: '2026-05-01', to: '2026-08-01', status: 'Approved' },
//     { id: 2, title: 'Industry Visit Request', type: 'Duty Leave', from: '2026-03-15', to: '2026-03-16', status: 'Pending' }
//   ]);

//   const [newRequest, setNewRequest] = useState({
//     title: '',
//     type: 'Verification',
//     fromDate: '',
//     toDate: '',
//     description: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const request = {
//       ...newRequest,
//       id: Date.now(),
//       status: 'Pending',
//       from: newRequest.fromDate,
//       to: newRequest.toDate
//     };
//     setRequests([request, ...requests]);
//     setIsModalOpen(false);
//     setNewRequest({ title: '', type: 'Verification', fromDate: '', toDate: '', description: '' });
//   };

//   const handleDownload = (reqTitle) => {
//     alert(`Downloading Bonafide Document for: ${reqTitle}`);
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <header className="flex justify-between items-end mb-10">
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonafide Requests</h1>
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-[#0047AB] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2 group"
//           >
//             <Plus size={20} strokeWidth={3} />
//             Create New Request
//           </button>
//         </header>

//         {/* Status Tracker List */}
//         <div className="space-y-4">
//           {requests.map((req) => (
//             <div key={req.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
//               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

//                 {/* Left Side: Info */}
//                 <div className="flex items-center gap-4">
//                   <div className={`p-3 rounded-2xl ${
//                     req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
//                   }`}>
//                     {req.status === 'Approved' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-slate-800">{req.title}</h3>
//                     <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{req.type} • {req.from} to {req.to}</p>
//                   </div>
//                 </div>

//                 {/* Right Side: Download (Now on Left of Timeline) + Stepper */}
//                 <div className="flex items-center gap-8">

//                   {/* Download Button - Positioned before the timeline */}
//                   <div className="w-32 flex justify-end">
//                     {req.status === 'Approved' ? (
//                       <button 
//                         onClick={() => handleDownload(req.title)}
//                         className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 animate-in slide-in-from-right-2"
//                       >
//                         <Download size={14} /> Download
//                       </button>
//                     ) : (
//                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic"></span>
//                     )}
//                   </div>

//                   {/* Micro-Stepper */}
//                   <div className="flex items-center gap-2">
//                     <StatusStep label="Submitted" completed={true} />
//                     <div className={`w-8 h-0.5 ${req.status === 'Approved' ? 'bg-emerald-500' : 'bg-slate-100'}`} />
//                     <StatusStep label="Review" completed={req.status === 'Approved'} active={req.status === 'Pending'} />
//                     <div className={`w-8 h-0.5 ${req.status === 'Approved' ? 'bg-emerald-500' : 'bg-slate-100'}`} />
//                     <StatusStep label="Finalized" completed={req.status === 'Approved'} />
//                   </div>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Request Form Modal (remains same) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-black text-slate-800">New Request</h2>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
//                 <X size={20} className="text-slate-400" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               <div>
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">Request Title</label>
//                 <input 
//                   required
//                   type="text" 
//                   placeholder="e.g. Summer Internship Permission"
//                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB] transition-all"
//                   value={newRequest.title}
//                   onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">From Date</label>
//                   <input 
//                     required
//                     type="date"
//                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB]"
//                     onChange={(e) => setNewRequest({...newRequest, fromDate: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">To Date</label>
//                   <input 
//                     required
//                     type="date"
//                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB]"
//                     onChange={(e) => setNewRequest({...newRequest, toDate: e.target.value})}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 tracking-widest ml-1">Detailed Reason</label>
//                 <textarea 
//                   rows="3"
//                   placeholder="Explain why this request is being made..."
//                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB] resize-none"
//                   onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
//                 ></textarea>
//               </div>

//               <button 
//                 type="submit"
//                 className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
//               >
//                 <Send size={18} /> Submit for Review
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const StatusStep = ({ label, completed, active }) => (
//   <div className="flex flex-col items-center">
//     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
//       completed ? 'bg-emerald-500 border-emerald-500' : 
//       active ? 'bg-white border-[#0047AB]' : 'bg-white border-slate-200'
//     }`}>
//       {completed && <CheckCircle2 size={12} className="text-white" />}
//     </div>
//     <span className={`text-[8px] mt-1 font-bold uppercase tracking-tighter ${
//       completed ? 'text-emerald-500' : active ? 'text-[#0047AB]' : 'text-slate-300'
//     }`}>
//       {label}
//     </span>
//   </div>
// );

import React, { useState, useEffect } from 'react';
import {
  Plus, Calendar, FileText, Send,
  Clock, CheckCircle2, XCircle, ChevronRight,
  X, AlertCircle, Download, RefreshCcw, Loader2
} from 'lucide-react';

export default function Bonafide() {
  const [requests, setRequests] = useState([]);
  const [myInternships, setMyInternships] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResubmitMode, setIsResubmitMode] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [payloadJson, setPayloadJson] = useState({});
  const [studentNote, setStudentNote] = useState('');
  const [inchargeComment, setInchargeComment] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // --- 1. Fetch Initial Data ---
  useEffect(() => {
    const initFetch = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [reqs, interns, types] = await Promise.all([
          fetch(`${API_BASE}/api/requests/my`, { headers }).then(res => res.json()),
          fetch(`${API_BASE}/api/internships/my`, { headers }).then(res => res.json()),
          fetch(`${API_BASE}/api/requests/types/all`, { headers }).then(res => res.json())
        ]);

        if (reqs.success) setRequests(reqs.data);
        if (interns.success) setMyInternships(interns.data);
        if (types.success) setRequestTypes(types.data);
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // --- 2. Handle POST (New) / PUT (Resubmit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isResubmitMode
      ? `${API_BASE}/api/requests/${selectedRequestId}/resubmit`
      : `${API_BASE}/api/requests`;

    const method = isResubmitMode ? 'PUT' : 'POST';
    const body = isResubmitMode
      ? { payload_json: payloadJson, student_note: studentNote }
      : { internship_id: selectedInternshipId, request_type_id: selectedTypeId, payload_json: payloadJson, student_note: studentNote };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const result = await res.json();

      if (result.success) {
        if (isResubmitMode) {
          setRequests(requests.map(r =>
            r.id === selectedRequestId ? { ...r, ...result.data } : r
          ));
        } else {
          setRequests([{
            ...result.data,
            request_types: requestTypes.find(t => t.id === selectedTypeId),
            internships: myInternships.find(i => i.id === selectedInternshipId)
          }, ...requests]);
        }
        closeModal();
      }
    } catch (err) {
      alert("Submission failed");
    }
  };

  const openResubmit = async (req) => {
    setSelectedRequestId(req.id);
    setIsResubmitMode(true);
    setInchargeComment(req.incharge_comment);

    // Fetch latest submission to populate fields
    const res = await fetch(`${API_BASE}/api/requests/${req.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      const latestSub = result.data.request_submissions[0];
      setPayloadJson(latestSub?.payload_json || {});
      setSelectedTypeId(result.data.request_types.id);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsResubmitMode(false);
    setPayloadJson({});
    setStudentNote('');
    setSelectedTypeId('');
  };

  const selectedTypeObj = requestTypes.find(t => t.id === selectedTypeId);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Requests & Permissions</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#0047AB] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
            <Plus size={20} strokeWidth={3} /> Create New Request
          </button>
        </header>

        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${getStatusStyles(req.status)}`}>
                    {req.status === 'APPROVED' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{req.request_types.name}</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{req.internships.company_name} • {req.internships.role_title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {req.status === 'APPROVED' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl">
                      <Download size={14} /> Download
                    </button>
                  )}
                  {req.status === 'ON_HOLD' && (
                    <button onClick={() => openResubmit(req)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl">
                      <RefreshCcw size={14} /> Resubmit
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <StatusStep label="Submitted" completed={true} />
                    <div className={`w-8 h-0.5 ${req.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    <StatusStep label="Review" completed={req.status === 'APPROVED'} active={['PENDING', 'ON_HOLD'].includes(req.status)} />
                    <div className={`w-8 h-0.5 ${req.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    <StatusStep label="Finalized" completed={req.status === 'APPROVED' || req.status === 'REJECTED'} />
                  </div>
                </div>
              </div>

              {req.status === 'ON_HOLD' && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="text-amber-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase">In-charge Feedback</p>
                    <p className="text-sm text-amber-800 font-medium">{req.incharge_comment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- Dynamic Request Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 my-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800">{isResubmitMode ? 'Fix & Resubmit' : 'New Request'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {isResubmitMode && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-4">
                  <p className="text-xs font-bold text-amber-700">Reason for Hold: {incharge_comment}</p>
                </div>
              )}

              {!isResubmitMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="Select Internship" value={selectedInternshipId} onChange={setSelectedInternshipId} options={myInternships.map(i => ({ id: i.id, label: `${i.company_name} - ${i.role_title}` }))} />
                  <SelectField label="Request Type" value={selectedTypeId} onChange={setSelectedTypeId} options={requestTypes.map(t => ({ id: t.id, label: t.name }))} />
                </div>
              )}

              {/* Dynamic JSON Schema Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                {selectedTypeObj?.form_schema_json?.fields?.map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}{field.required && ' *'}</label>
                    <input
                      type={field.type}
                      required={field.required}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
                      value={payloadJson[field.name] || ''}
                      onChange={e => setPayloadJson(prev => ({ ...prev, [field.name]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Note (Optional)</label>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0047AB] h-24" value={studentNote} onChange={e => setStudentNote(e.target.value)} />
              </div>

              <button type="submit" className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                <Send size={18} /> {isResubmitMode ? 'Update Submission' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helpers ---
const getStatusStyles = (status) => {
  const map = {
    APPROVED: 'bg-emerald-50 text-emerald-600',
    PENDING: 'bg-amber-50 text-amber-600',
    ON_HOLD: 'bg-orange-50 text-orange-600',
    REJECTED: 'bg-red-50 text-red-600'
  };
  return map[status] || 'bg-slate-50 text-slate-400';
};

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none">
      <option value="">Select...</option>
      {options.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
    </select>
  </div>
);

const StatusStep = ({ label, completed, active }) => (
  <div className="flex flex-col items-center">
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${completed ? 'bg-emerald-500 border-emerald-500' : active ? 'bg-white border-[#0047AB]' : 'bg-white border-slate-200'}`}>
      {completed && <CheckCircle2 size={12} className="text-white" />}
    </div>
    <span className={`text-[8px] mt-1 font-bold uppercase tracking-tighter ${completed ? 'text-emerald-500' : active ? 'text-[#0047AB]' : 'text-slate-300'}`}>{label}</span>
  </div>
);