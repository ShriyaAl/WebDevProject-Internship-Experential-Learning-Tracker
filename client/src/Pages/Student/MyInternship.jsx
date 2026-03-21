// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import {
//   Plus, Building2, Briefcase, Calendar,
//   ArrowRight, X, CheckCircle2, ChevronRight,
//   Edit3, Upload, ClipboardList, Loader2, MapPin, DollarSign, Globe,
//   AlertCircle, Trash2, Lock, Unlock, Star, BookOpen, Users, Brain,
//   ChevronDown, FileText, Eye, GraduationCap, Award, BarChart2, Zap
// } from 'lucide-react';


// const DOCUMENT_CATEGORIES = [
//   'Offer Letter',
//   'Completion Certificate',
//   'Internship Report'
// ];

// const INTERNSHIP_TYPES = ['CDC', 'Off Campus', 'Research'];

// const TECH_STACK_OPTIONS = [
//   'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
//   'FastAPI', 'Flask', 'Java', 'Spring Boot', 'Go', 'Rust', 'TypeScript',
//   'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
//   'Machine Learning', 'Data Analysis', 'Figma / Design', 'Other',
// ];


// const InfoRow = ({ label, value }) => (
//   <div className="mb-4">
//     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//     <p className="text-sm font-bold text-slate-700">{value || '—'}</p>
//   </div>
// );

// const DetailInput = ({ label, value, onChange, type = 'text', required }) => (
//   <div className="space-y-1.5 w-full">
//     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       required={required}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none transition-all"
//     />
//   </div>
// );


// export default function MyInternship() {
//   const navigate = useNavigate();
//   const [view, setView] = useState('list'); // 'list' | 'form' | 'survey'
//   const [internships, setInternships] = useState([]);
//   const [selectedIntern, setSelectedIntern] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [workspaceUploading, setWorkspaceUploading] = useState(false);
//   const [surveyStep, setSurveyStep] = useState(1);

//   // Form state
//   const [formData, setFormData] = useState({
//     company_name: '',
//     role_title: '',
//     expected_start_date: '',
//     expected_end_date: '',
//     mode: 'ONSITE',
//     location: '',
//     stipend: '',
//     company_linkedin: '',
//     supporting_documents: [],
//     internship_type: 'Product Based',
//     map_for_credits: false,
//   });
//   const [documentName, setDocumentName] = useState('Offer Letter');


//   const [workspaceDocCategory, setWorkspaceDocCategory] = useState('');
//   const [workspaceUploaded, setWorkspaceUploaded] = useState(false);


//   const [survey, setSurvey] = useState({
//     tech_stack: [],
//     project_summary: '',
//     roles_skills: '',
//     industry_mentors: '',
//     learning_rating: 7,
//   });

//   const API_BASE = import.meta.env.VITE_API_BASE_URL;
//   const token = localStorage.getItem('access_token');

//   useEffect(() => { fetchInternships(); }, []);

//   const fetchInternships = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/internships/my`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await res.json();
//       if (result.success) setInternships(result.data);
//     } catch (err) {
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uploadToSupabase = async (file) => {
//     const userStr = localStorage.getItem('user');
//     const userId = JSON.parse(userStr).id;
//     const path = `supporting-docs/${userId}/${Date.now()}_${file.name}`;
//     const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
//     if (error) throw error;
//     const { data } = supabase.storage.from('documents').getPublicUrl(path);
//     return data.publicUrl;
//   };

//   // ── In-form document upload ────────────────────────────────────────────────
//   const handleDocumentUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!documentName.trim()) { alert('Please provide a document name before uploading.'); return; }
//     setUploading(true);
//     try {
//       const publicUrl = await uploadToSupabase(file);
//       setFormData(prev => ({
//         ...prev,
//         supporting_documents: [...prev.supporting_documents, { name: documentName, url: publicUrl }],
//       }));
//       setDocumentName('');
//     } catch (err) {
//       alert('Upload failed: ' + err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleWorkspaceUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!workspaceDocCategory) { alert('Please select a document category first.'); return; }
//     setWorkspaceUploading(true);
//     try {
//       const publicUrl = await uploadToSupabase(file);
//       const newDoc = { name: workspaceDocCategory, url: publicUrl };
//       const updatedDocs = [...(selectedIntern.supporting_documents || []), newDoc];
//       const updated = { ...selectedIntern, supporting_documents: updatedDocs };
//       setSelectedIntern(updated);
//       setInternships(prev => prev.map(i => i.id === updated.id ? updated : i));
//       setWorkspaceDocCategory('');
//       setWorkspaceUploaded(true);
//     } catch (err) {
//       alert('Upload failed: ' + err.message);
//     } finally {
//       setWorkspaceUploading(false);
//     }
//   };

//   const handleAddInternship = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       supporting_documents: formData.supporting_documents,
//     };
//     try {
//       const res = await fetch(`${API_BASE}/api/internships`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const result = await res.json();
//       if (result.success) {
//         setInternships([...internships, result.data]);
//         setView('list');
//         setFormData({
//           company_name: '', role_title: '', expected_start_date: '', expected_end_date: '',
//           mode: 'ONSITE', location: '', stipend: '', company_linkedin: '',
//           supporting_documents: [], internship_type: 'Product Based', map_for_credits: false,
//         });
//       }
//     } catch (err) {
//       alert('Post failed: ' + err.message);
//     }
//   };

//   const handleDelete = (id) => {
//     setInternships(prev => prev.filter(i => i.id !== id));
//   };

//   const handleSurveySubmit = () => {
//     const updated = { ...selectedIntern, activity_status: 'Completed', survey };
//     setSelectedIntern(updated);
//     setInternships(prev => prev.map(i => i.id === updated.id ? updated : i));
//     setView('list');
//     setSelectedIntern(null);
//     setSurveyStep(1);
//     setSurvey({ tech_stack: [], project_summary: '', roles_skills: '', industry_mentors: '', learning_rating: 7 });
//   };

//   const toggleTech = (tech) => {
//     setSurvey(prev => ({
//       ...prev,
//       tech_stack: prev.tech_stack.includes(tech)
//         ? prev.tech_stack.filter(t => t !== tech)
//         : [...prev.tech_stack, tech],
//     }));
//   };

//   // ── Credit lock logic ──────────────────────────────────────────────────────
//   const isCreditLocked = (intern) => {
//     if (!intern?.map_for_credits) return false;
//     const docs = intern.supporting_documents || [];
//     const hasOffer = docs.some(d => d.name === 'Offer Letter');
//     const hasCert = docs.some(d => d.name === 'Completion Certificate');
//     const isVerified = intern.verification_status === 'VERIFIED';
//     return !(hasOffer && hasCert && isVerified);
//   };


//   const isFormValid = () => {
//     const { company_name, role_title, expected_start_date, expected_end_date, mode, internship_type } = formData;
//     const allFilled = company_name && role_title && expected_start_date && expected_end_date && mode && internship_type;
//     const hasDocs = formData.supporting_documents.length > 0;
//     return allFilled && hasDocs;
//   };


//   const availableWorkspaceCategories = () => {
//     const uploaded = new Set((selectedIntern?.supporting_documents || []).map(d => d.name));
//     return DOCUMENT_CATEGORIES.filter(c => c === 'Other' || !uploaded.has(c));
//   };


//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Loader2 className="animate-spin text-[#0047AB]" size={32} />
//     </div>
//   );

//   if (view === 'survey' && selectedIntern) {
//     return (
//       <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
//           {/* Header */}
//           <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-[#0047AB]/5 to-transparent">
//             <div>
//               <h2 className="text-xl font-black text-slate-800">Exit Survey</h2>
//               <p className="text-xs text-slate-400 mt-0.5">{selectedIntern.company_name} · {selectedIntern.role_title}</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-xs font-bold text-slate-400">Step {surveyStep} / 3</span>
//               <button onClick={() => { setView('list'); setSurveyStep(1); }} className="p-2 hover:bg-slate-100 rounded-full">
//                 <X size={20} className="text-slate-400" />
//               </button>
//             </div>
//           </div>

//           {/* Progress bar */}
//           <div className="h-1 bg-slate-100">
//             <div className="h-1 bg-[#0047AB] transition-all duration-500" style={{ width: `${(surveyStep / 3) * 100}%` }} />
//           </div>

//           <div className="p-8 overflow-y-auto max-h-[70vh]">
//             {/* Step 1: Tech & Project */}
//             {surveyStep === 1 && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-2"><Zap size={16} className="text-[#0047AB]" /> Tech Stack Used</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {TECH_STACK_OPTIONS.map(tech => (
//                       <button
//                         key={tech}
//                         type="button"
//                         onClick={() => toggleTech(tech)}
//                         className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${survey.tech_stack.includes(tech) ? 'bg-[#0047AB] text-white border-[#0047AB]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0047AB]'}`}
//                       >{tech}</button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Summary*</label>
//                   <textarea
//                     value={survey.project_summary}
//                     onChange={e => setSurvey(s => ({ ...s, project_summary: e.target.value }))}
//                     rows={4}
//                     placeholder="What did you build? Describe your main project or contribution..."
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none resize-none"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Roles, Mentors */}
//             {surveyStep === 2 && (
//               <div className="space-y-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Users size={12} /> Roles & Skills Demonstrated</label>
//                   <textarea
//                     value={survey.roles_skills}
//                     onChange={e => setSurvey(s => ({ ...s, roles_skills: e.target.value }))}
//                     rows={3}
//                     placeholder="e.g. Led sprint planning, mentored interns, presented to stakeholders..."
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none resize-none"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Rating */}
//             {surveyStep === 3 && (
//               <div className="space-y-8">
//                 <div>
//                   <h3 className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2"><BarChart2 size={16} className="text-[#0047AB]" /> Learning Value Rating</h3>
//                   <p className="text-xs text-slate-400 mb-6">How valuable was this internship to your professional growth?</p>
//                   <div className="relative">
//                     <input
//                       type="range" min="1" max="10" value={survey.learning_rating}
//                       onChange={e => setSurvey(s => ({ ...s, learning_rating: parseInt(e.target.value) }))}
//                       className="w-full accent-[#0047AB] h-2 cursor-pointer"
//                     />
//                     <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
//                       <span>1 – Not helpful</span><span>10 – Life changing</span>
//                     </div>
//                     <div className="mt-4 text-center">
//                       <span className="text-5xl font-black text-[#0047AB]">{survey.learning_rating}</span>
//                       <span className="text-slate-400 text-sm font-bold"> / 10</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
//                   <p className="text-xs font-bold text-amber-700 flex items-center gap-2">
//                     <AlertCircle size={14} /> Submitting this survey will mark your internship as <strong>Completed</strong>.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="p-6 border-t flex justify-between">
//             <button
//               type="button"
//               onClick={() => surveyStep > 1 ? setSurveyStep(s => s - 1) : setView('list')}
//               className="px-6 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
//             >Back</button>
//             {surveyStep < 3 ? (
//               <button
//                 type="button"
//                 onClick={() => setSurveyStep(s => s + 1)}
//                 className="px-8 py-3 bg-[#0047AB] text-white rounded-2xl font-bold flex items-center gap-2 text-sm"
//               >Next <ArrowRight size={16} /></button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleSurveySubmit}
//                 className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 text-sm"
//               ><CheckCircle2 size={16} /> Submit & Complete</button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (view === 'list' && !selectedIntern) {
//     return (
//       <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
//         <div className="max-w-4xl mx-auto">
//           <header className="flex justify-between items-center mb-10">
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Internships</h1>
//             <button
//               onClick={() => setView('form')}
//               className="bg-[#0047AB] text-white p-3 rounded-2xl hover:bg-blue-800 transition-all flex items-center gap-2"
//             >
//               <Plus size={24} strokeWidth={2.5} />
//               <span className="pr-2 font-bold text-sm">Add New</span>
//             </button>
//           </header>

//           {internships.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[32px]">
//               <p className="text-slate-400 font-medium">No internships added yet.</p>
//             </div>
//           ) : (
//             <div className="grid gap-4">
//               {internships.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
//                 >
//                   <div className="flex items-center gap-5">
//                     <div className="w-12 h-12 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center">
//                       <Building2 size={24} />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2 mb-1 flex-wrap">
//                         <h3 className="font-bold text-slate-800 text-lg">{item.company_name}</h3>
//                         {/* Verification badge */}
//                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
//                           item.verification_status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
//                           item.verification_status === 'REJECTED' ? 'bg-red-50 text-red-600' :
//                           'bg-amber-50 text-amber-600'
//                         }`}>
//                           {item.verification_status || 'PENDING'}
//                         </span>
//                         {/* Activity badge */}
//                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
//                           item.activity_status === 'Completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
//                         }`}>
//                           {item.activity_status || 'Ongoing'}
//                         </span>
//                       </div>
//                       <p className="text-sm text-slate-500 font-medium">
//                         {item.role_title} · {item.mode}
//                         {item.internship_type && <span className="ml-2 text-xs text-slate-400">({item.internship_type})</span>}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {/* Delete (UI-only, shows on hover) */}
//                     <button
//                       onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
//                       className="p-2 rounded-full text-slate-200 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                     <button
//                       onClick={() => setSelectedIntern(item)}
//                       className="p-2 hover:bg-slate-50 rounded-full transition-colors"
//                     >
//                       <ChevronRight size={28} className="text-slate-300 group-hover:text-[#0047AB]" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (selectedIntern) {
//     const locked = isCreditLocked(selectedIntern);
//     const availableCats = availableWorkspaceCategories();

//     return (
//       <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8">
//           <div className="p-6 border-b flex justify-between items-center">
//             <div>
//               <h2 className="text-xl font-black text-slate-800 tracking-tight">Internship Workspace</h2>
//               {selectedIntern.map_for_credits && (
//                 <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1">
//                   <GraduationCap size={10} /> Mapped for Academic Credits
//                 </span>
//               )}
//             </div>
//             <button onClick={() => setSelectedIntern(null)} className="p-2 hover:bg-slate-100 rounded-full">
//               <X size={24} className="text-slate-400" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Col 1: Details */}
//             <div className="space-y-6 border-r pr-8">
//               <h4 className="text-xs font-black uppercase text-[#0047AB]">Details</h4>
//               <InfoRow label="Company" value={selectedIntern.company_name} />
//               <InfoRow label="Role" value={selectedIntern.role_title} />
//               <InfoRow label="Type" value={selectedIntern.internship_type} />
//               <InfoRow label="Mode" value={selectedIntern.mode} />
//               <InfoRow label="Location" value={selectedIntern.location || 'Remote'} />
//               <InfoRow label="Stipend" value={selectedIntern.stipend || 'Unpaid'} />
//             </div>

//             {/* Col 2: Actions */}
//             <div className="space-y-6 border-r pr-8">
//               <h4 className="text-xs font-black uppercase text-[#0047AB]">Duration & Actions</h4>
//               <div className="p-4 bg-slate-50 rounded-2xl">
//                 <p className="text-sm font-bold text-center">
//                   {selectedIntern.expected_start_date} <ArrowRight className="inline mx-2" size={14} /> {selectedIntern.expected_end_date}
//                 </p>
//               </div>

//               <button
//                 onClick={() => navigate('/bonafide-student')}
//                 className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
//               >
//                 <ClipboardList size={18} /> Request Document
//               </button>

//               {/* Exit Survey Button with credit lock logic */}
//               {locked ? (
//                 <div className="w-full p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 flex items-start gap-3">
//                   <Lock size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm font-bold text-amber-700">Exit Survey Locked</p>
//                     <p className="text-xs text-amber-600 mt-0.5">
//                       Requires: Offer Letter + Completion Certificate uploaded & verification approved.
//                     </p>
//                   </div>
//                 </div>
//               ) : selectedIntern.activity_status === 'Completed' ? (
//                 <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
//                   <CheckCircle2 size={18} className="text-emerald-500" />
//                   <p className="text-sm font-bold text-emerald-700">Survey Completed</p>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setView('survey')}
//                   className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
//                 >
//                   <Edit3 size={18} /> Fill Exit Survey
//                 </button>
//               )}
//             </div>

//             {/* Col 3: Documents */}
//             <div className="space-y-5">
//               <h4 className="text-xs font-black uppercase text-[#0047AB]">Documents</h4>

//               {selectedIntern.supporting_documents && selectedIntern.supporting_documents.length > 0 ? (
//                 <div className="space-y-3">
//                   {selectedIntern.supporting_documents.map((doc, idx) => (
//                     <a
//                       key={idx}
//                       href={doc.url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center justify-between p-4 border rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all group/doc"
//                     >
//                       <span className="flex items-center gap-3">
//                         <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
//                         {doc.name}
//                       </span>
//                       <span className="flex items-center gap-1 text-xs text-[#0047AB] group-hover/doc:underline">
//                         <Eye size={12} /> View PDF
//                       </span>
//                     </a>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-xs text-slate-400">No documents uploaded.</p>
//               )}

//               {/* Add Missing Document */}
//               {availableCats.length > 0 && (
//                 <div className="pt-4 border-t border-slate-100 space-y-3">
//                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Missing Document</h5>
//                   <select
//                     value={workspaceDocCategory}
//                     onChange={e => { setWorkspaceDocCategory(e.target.value); setWorkspaceUploaded(false); }}
//                     className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#0047AB] outline-none"
//                   >
//                     <option value="">Select category…</option>
//                     {availableCats.map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>

//                   {workspaceDocCategory && (
//                     <div className="relative border-2 border-dashed border-slate-200 h-[44px] rounded-xl flex items-center justify-center group hover:border-[#0047AB] bg-slate-50 cursor-pointer overflow-hidden">
//                       {workspaceUploading
//                         ? <Loader2 className="animate-spin text-[#0047AB]" size={18} />
//                         : workspaceUploaded
//                           ? <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14} /> Uploaded!</span>
//                           : <span className="text-xs font-bold text-slate-500 group-hover:text-[#0047AB] flex items-center gap-2"><Upload size={13} /> Upload File</span>
//                       }
//                       <input type="file" onChange={handleWorkspaceUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={workspaceUploading} />
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const formValid = isFormValid();

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 overflow-y-auto">
//       <div className="max-w-2xl mx-auto bg-white p-10 rounded-[32px] border shadow-xl relative">
//         <button onClick={() => setView('list')} className="absolute right-8 top-8 text-slate-300">
//           <X size={24} />
//         </button>
//         <h2 className="text-2xl font-black text-slate-900 mb-8">New Internship Application</h2>

//         <form onSubmit={handleAddInternship} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <DetailInput label="Company Name*" value={formData.company_name} onChange={(v) => setFormData({ ...formData, company_name: v })} required />
//             <DetailInput label="Role Title*" value={formData.role_title} onChange={(v) => setFormData({ ...formData, role_title: v })} required />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <DetailInput label="Expected Start Date*" type="date" value={formData.expected_start_date} onChange={(v) => setFormData({ ...formData, expected_start_date: v })} required />
//             <DetailInput label="Expected End Date*" type="date" value={formData.expected_end_date} onChange={(v) => setFormData({ ...formData, expected_end_date: v })} required />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Mode*</label>
//               <select
//                 value={formData.mode}
//                 onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
//               >
//                 <option value="ONSITE">ONSITE</option>
//                 <option value="REMOTE">REMOTE</option>
//                 <option value="HYBRID">HYBRID</option>
//               </select>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internship Type*</label>
//               <select
//                 value={formData.internship_type}
//                 onChange={(e) => setFormData({ ...formData, internship_type: e.target.value })}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
//               >
//                 {INTERNSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <DetailInput label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
//             <DetailInput label="Stipend (e.g. 20,000)" value={formData.stipend} onChange={(v) => setFormData({ ...formData, stipend: v })} />
//           </div>

//           <DetailInput label="Company LinkedIn" type="url" value={formData.company_linkedin} onChange={(v) => setFormData({ ...formData, company_linkedin: v })} />

//           {/* Reporting Authority */}
//           <div className="space-y-3 pt-4 border-t border-slate-100">
//             <h3 className="text-sm font-black uppercase tracking-widest text-[#0047AB]">Reporting Authority</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <DetailInput label="Name" value={formData.reporting_xx1 || ''} onChange={(v) => setFormData({ ...formData, reporting_xx1: v })} />
//               <DetailInput label="Designation" value={formData.reporting_xx2 || ''} onChange={(v) => setFormData({ ...formData, reporting_xx2: v })} />
//               <DetailInput label="Email" value={formData.reporting_xx3 || ''} onChange={(v) => setFormData({ ...formData, reporting_xx3: v })} />
//               <DetailInput label="Phone Number" value={formData.reporting_xx4 || ''} onChange={(v) => setFormData({ ...formData, reporting_xx4: v })} />
//             </div>
//           </div>

//           {/* Offer Letter Received */}
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PPO Received?</label>
//             <select
//               value={formData.offer_letter_received || ''}
//               onChange={(e) => setFormData({ ...formData, offer_letter_received: e.target.value })}
//               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
//             >
//               <option value="">Select…</option>
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>
//           </div>

//           {/* Academic Credits Toggle */}
//           <button
//             type="button"
//             onClick={() => setFormData(prev => ({ ...prev, map_for_credits: !prev.map_for_credits }))}
//             className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
//               formData.map_for_credits
//                 ? 'bg-purple-50 border-purple-300'
//                 : 'bg-slate-50 border-slate-200 hover:border-purple-200'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <GraduationCap size={20} className={formData.map_for_credits ? 'text-purple-600' : 'text-slate-400'} />
//               <div className="text-left">
//                 <p className={`text-sm font-bold ${formData.map_for_credits ? 'text-purple-700' : 'text-slate-600'}`}>
//                   Map for Academic Credits
//                 </p>
//                 <p className="text-xs text-slate-400 mt-0.5">Requires Offer Letter + Completion Certificate + Verification</p>
//               </div>
//             </div>
//             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
//               formData.map_for_credits ? 'bg-purple-600 border-purple-600' : 'border-slate-300'
//             }`}>
//               {formData.map_for_credits && <CheckCircle2 size={12} className="text-white" />}
//             </div>
//           </button>

//           {/* Supporting Documents */}
//           <div className="space-y-4 pt-4 border-t border-slate-100">
//             <h3 className="text-sm font-black uppercase tracking-widest text-[#0047AB]">
//               Supporting Documents <span className="text-red-400">*</span>
//             </h3>

//             {formData.supporting_documents.length > 0 && (
//               <div className="space-y-2 mb-4">
//                 {formData.supporting_documents.map((doc, idx) => (
//                   <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-bold">
//                     <span className="flex items-center gap-2"><CheckCircle2 size={16} /> {doc.name}</span>
//                     <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 underline hover:text-emerald-800">
//                       <Eye size={12} /> View PDF
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="grid grid-cols-3 gap-4">
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Category</label>
//                 <select
//                   value={documentName}
//                   onChange={e => setDocumentName(e.target.value)}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
//                 >
//                   {DOCUMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div className="col-span-1 space-y-1.5 flex flex-col justify-end">
//                 <div className="relative border-2 border-dashed border-slate-200 h-[46px] rounded-xl flex items-center justify-center group hover:border-[#0047AB] bg-slate-50 cursor-pointer overflow-hidden">
//                   {uploading
//                     ? <Loader2 className="animate-spin text-[#0047AB]" />
//                     : <span className="text-xs font-bold text-slate-500 group-hover:text-[#0047AB] flex items-center gap-2"><Upload size={14} /> Upload File</span>
//                   }
//                   <input type="file" onChange={handleDocumentUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
//                 </div>
//               </div>
//             </div>
//             <p className="text-xs text-slate-400 italic">At least one document is required to submit. You can upload multiple files.</p>
//           </div>

//           {/* Submit button with validation state */}
//           <div className="space-y-2 mt-8">
//             {!formValid && (
//               <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
//                 <AlertCircle size={14} className="flex-shrink-0" />
//                 <span>
//                   {!formData.supporting_documents.length
//                     ? 'Please upload at least one supporting document.'
//                     : 'Please fill all required (*) fields.'}
//                 </span>
//               </div>
//             )}
//             <button
//               type="submit"
//               disabled={!formValid}
//               className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
//                 formValid
//                   ? 'bg-[#0047AB] text-white hover:bg-blue-800 cursor-pointer'
//                   : 'bg-slate-200 text-slate-400 cursor-not-allowed'
//               }`}
//             >
//               Confirm & Add <ArrowRight size={18} />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Plus, Building2, Briefcase, Calendar,
  ArrowRight, X, CheckCircle2, ChevronRight,
  Edit3, Upload, ClipboardList, Loader2, MapPin, DollarSign, Globe,
  AlertCircle, Trash2, Lock, Unlock, Star, BookOpen, Users, Brain,
  ChevronDown, FileText, Eye, GraduationCap, Award, BarChart2, Zap, Pencil
} from 'lucide-react';

const DOCUMENT_CATEGORIES = [
  'Offer Letter',
  'Completion Certificate',
  'Internship Report'
];

const INTERNSHIP_TYPES = ['CDC', 'Off Campus', 'Research'];

const TECH_STACK_OPTIONS = [
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
  'FastAPI', 'Flask', 'Java', 'Spring Boot', 'Go', 'Rust', 'TypeScript',
  'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'Machine Learning', 'Data Analysis', 'Figma / Design', 'Other',
];

// ─── Validation helpers ────────────────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v) => /^[0-9]{10}$/.test(v.replace(/\s+/g, ''));

// ─── Helper Components ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value || '—'}</p>
  </div>
);

const DetailInput = ({ label, value, onChange, type = 'text', required, error }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
        error ? 'border-red-300 focus:border-red-400 bg-red-50' : 'border-slate-100 focus:border-[#0047AB]'
      }`}
    />
    {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MyInternship() {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [internships, setInternships] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [workspaceUploading, setWorkspaceUploading] = useState(false);
  const [surveyStep, setSurveyStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    role_title: '',
    expected_start_date: '',
    expected_end_date: '',
    mode: 'ONSITE',
    location: '',
    stipend: '',
    company_linkedin: '',
    supporting_documents: [],
    internship_type: 'Product Based',
    map_for_credits: false,
    reporting_xx1: '',
    reporting_xx2: '',
    reporting_xx3: '',
    reporting_xx4: '',
  });
  const [documentName, setDocumentName] = useState(DOCUMENT_CATEGORIES[0]);

  // Inline validation errors
  const [fieldErrors, setFieldErrors] = useState({ reporting_xx3: '', reporting_xx4: '' });

  // Edit doc state
  const [editingDocIdx, setEditingDocIdx] = useState(null);
  const [editingDocName, setEditingDocName] = useState('');

  // Workspace add-doc state
  const [workspaceDocCategory, setWorkspaceDocCategory] = useState('');
  const [workspaceUploaded, setWorkspaceUploaded] = useState(false);

  // Exit survey state — ppo_received moved here from form
  const [survey, setSurvey] = useState({
    tech_stack: [],
    project_summary: '',
    roles_skills: '',
    industry_mentors: '',
    learning_rating: 7,
    ppo_received: '',
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => { fetchInternships(); }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/internships/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setInternships(result.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadToSupabase = async (file) => {
    const userStr = localStorage.getItem('user');
    const userId = JSON.parse(userStr).id;
    const path = `supporting-docs/${userId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    return data.publicUrl;
  };

  // ── In-form document upload ────────────────────────────────────────────────
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!documentName.trim()) { alert('Please provide a document name before uploading.'); return; }
    setUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file);
      setFormData(prev => ({
        ...prev,
        supporting_documents: [...prev.supporting_documents, { name: documentName, url: publicUrl }],
      }));
      setDocumentName(DOCUMENT_CATEGORIES[0]);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Edit document name inline ──────────────────────────────────────────────
  const handleDocNameSave = (idx) => {
    if (!editingDocName.trim()) return;
    setFormData(prev => {
      const docs = [...prev.supporting_documents];
      docs[idx] = { ...docs[idx], name: editingDocName.trim() };
      return { ...prev, supporting_documents: docs };
    });
    setEditingDocIdx(null);
    setEditingDocName('');
  };

  // ── Remove document ────────────────────────────────────────────────────────
  const handleDocRemove = (idx) => {
    setFormData(prev => ({
      ...prev,
      supporting_documents: prev.supporting_documents.filter((_, i) => i !== idx),
    }));
  };

  const handleWorkspaceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!workspaceDocCategory) { alert('Please select a document category first.'); return; }
    setWorkspaceUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file);
      const newDoc = { name: workspaceDocCategory, url: publicUrl };
      const updatedDocs = [...(selectedIntern.supporting_documents || []), newDoc];
      const updated = { ...selectedIntern, supporting_documents: updatedDocs };
      setSelectedIntern(updated);
      setInternships(prev => prev.map(i => i.id === updated.id ? updated : i));
      setWorkspaceDocCategory('');
      setWorkspaceUploaded(true);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setWorkspaceUploading(false);
    }
  };

  // ── Inline field validation ────────────────────────────────────────────────
  const validateField = (key, value) => {
    if (key === 'reporting_xx3') {
      setFieldErrors(prev => ({
        ...prev,
        reporting_xx3: value && !isValidEmail(value) ? 'Enter a valid email address' : '',
      }));
    }
    if (key === 'reporting_xx4') {
      setFieldErrors(prev => ({
        ...prev,
        reporting_xx4: value && !isValidPhone(value) ? 'Enter a valid 10-digit phone number' : '',
      }));
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    if (fieldErrors.reporting_xx3 || fieldErrors.reporting_xx4) return;
    const payload = { ...formData, supporting_documents: formData.supporting_documents };
    try {
      const res = await fetch(`${API_BASE}/api/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setInternships([...internships, result.data]);
        setView('list');
        setFormData({
          company_name: '', role_title: '', expected_start_date: '', expected_end_date: '',
          mode: 'ONSITE', location: '', stipend: '', company_linkedin: '',
          supporting_documents: [], internship_type: 'Product Based', map_for_credits: false,
          reporting_xx1: '', reporting_xx2: '', reporting_xx3: '', reporting_xx4: '',
        });
        setFieldErrors({ reporting_xx3: '', reporting_xx4: '' });
      }
    } catch (err) {
      alert('Post failed: ' + err.message);
    }
  };

  const handleDelete = (id) => {
    setInternships(prev => prev.filter(i => i.id !== id));
  };

  const handleSurveySubmit = () => {
    const updated = { ...selectedIntern, activity_status: 'Completed', survey };
    setSelectedIntern(updated);
    setInternships(prev => prev.map(i => i.id === updated.id ? updated : i));
    setView('list');
    setSelectedIntern(null);
    setSurveyStep(1);
    setSurvey({ tech_stack: [], project_summary: '', roles_skills: '', industry_mentors: '', learning_rating: 7, ppo_received: '' });
  };

  const toggleTech = (tech) => {
    setSurvey(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(tech)
        ? prev.tech_stack.filter(t => t !== tech)
        : [...prev.tech_stack, tech],
    }));
  };

  const isCreditLocked = (intern) => {
    if (!intern?.map_for_credits) return false;
    const docs = intern.supporting_documents || [];
    const hasOffer = docs.some(d => d.name === 'Offer Letter');
    const hasCert = docs.some(d => d.name === 'Completion Certificate');
    const isVerified = intern.verification_status === 'VERIFIED';
    return !(hasOffer && hasCert && isVerified);
  };

  const today = new Date().toISOString().split('T')[0];

  const dateError = formData.expected_start_date && formData.expected_end_date &&
    new Date(formData.expected_end_date) <= new Date(formData.expected_start_date)
    ? 'End date must be after start date'
    : '';

  const isFormValid = () => {
    const { company_name, role_title, expected_start_date, expected_end_date, mode, internship_type } = formData;
    const allFilled = company_name && role_title && expected_start_date && expected_end_date && mode && internship_type;
    const hasDocs = formData.supporting_documents.length > 0;
    const noErrors = !fieldErrors.reporting_xx3 && !fieldErrors.reporting_xx4;
    const datesOk = !dateError;
    return allFilled && hasDocs && noErrors && datesOk;
  };

  const availableWorkspaceCategories = () => {
    const uploaded = new Set((selectedIntern?.supporting_documents || []).map(d => d.name));
    return DOCUMENT_CATEGORIES.filter(c => c === 'Other' || !uploaded.has(c));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[#0047AB]" size={32} />
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // EXIT SURVEY VIEW
  // ══════════════════════════════════════════════════════════════════════════════
  if (view === 'survey' && selectedIntern) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
          <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-[#0047AB]/5 to-transparent">
            <div>
              <h2 className="text-xl font-black text-slate-800">Exit Survey</h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedIntern.company_name} · {selectedIntern.role_title}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Step {surveyStep} / 3</span>
              <button onClick={() => { setView('list'); setSurveyStep(1); }} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="h-1 bg-slate-100">
            <div className="h-1 bg-[#0047AB] transition-all duration-500" style={{ width: `${(surveyStep / 3) * 100}%` }} />
          </div>

          <div className="p-8 overflow-y-auto max-h-[70vh]">
            {surveyStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-2"><Zap size={16} className="text-[#0047AB]" /> Tech Stack Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.map(tech => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${survey.tech_stack.includes(tech) ? 'bg-[#0047AB] text-white border-[#0047AB]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0047AB]'}`}
                      >{tech}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Summary*</label>
                  <textarea
                    value={survey.project_summary}
                    onChange={e => setSurvey(s => ({ ...s, project_summary: e.target.value }))}
                    rows={4}
                    placeholder="What did you build? Describe your main project or contribution..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {surveyStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Users size={12} /> Roles & Skills Demonstrated</label>
                  <textarea
                    value={survey.roles_skills}
                    onChange={e => setSurvey(s => ({ ...s, roles_skills: e.target.value }))}
                    rows={3}
                    placeholder="e.g. Led sprint planning, mentored interns, presented to stakeholders..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Rating + PPO Received */}
            {surveyStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2"><BarChart2 size={16} className="text-[#0047AB]" /> Learning Value Rating</h3>
                  <p className="text-xs text-slate-400 mb-6">How valuable was this internship to your professional growth?</p>
                  <div className="relative">
                    <input
                      type="range" min="1" max="10" value={survey.learning_rating}
                      onChange={e => setSurvey(s => ({ ...s, learning_rating: parseInt(e.target.value) }))}
                      className="w-full accent-[#0047AB] h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
                      <span>1 – Not helpful</span><span>10 – Life changing</span>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-5xl font-black text-[#0047AB]">{survey.learning_rating}</span>
                      <span className="text-slate-400 text-sm font-bold"> / 10</span>
                    </div>
                  </div>
                </div>

                {/* PPO Received — only shown for type a and b, not c */}
                {selectedIntern.internship_type !== 'Research' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PPO Received?</label>
                    <select
                      value={survey.ppo_received}
                      onChange={e => setSurvey(s => ({ ...s, ppo_received: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
                    >
                      <option value="">Select…</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                )}

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-2">
                    <AlertCircle size={14} /> Submitting this survey will mark your internship as <strong>Completed</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-between">
            <button
              type="button"
              onClick={() => surveyStep > 1 ? setSurveyStep(s => s - 1) : setView('list')}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >Back</button>
            {surveyStep < 3 ? (
              <button
                type="button"
                onClick={() => setSurveyStep(s => s + 1)}
                className="px-8 py-3 bg-[#0047AB] text-white rounded-2xl font-bold flex items-center gap-2 text-sm"
              >Next <ArrowRight size={16} /></button>
            ) : (
              <button
                type="button"
                onClick={handleSurveySubmit}
                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 text-sm"
              ><CheckCircle2 size={16} /> Submit & Complete</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════════════════
  if (view === 'list' && !selectedIntern) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Internships</h1>
            <button
              onClick={() => setView('form')}
              className="bg-[#0047AB] text-white p-3 rounded-2xl hover:bg-blue-800 transition-all flex items-center gap-2"
            >
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
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-lg">{item.company_name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.verification_status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                          item.verification_status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {item.verification_status || 'PENDING'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.activity_status === 'Completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.activity_status || 'Ongoing'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        {item.role_title} · {item.mode}
                        {item.internship_type && <span className="ml-2 text-xs text-slate-400">({item.internship_type})</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-2 rounded-full text-slate-200 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => setSelectedIntern(item)}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <ChevronRight size={28} className="text-slate-300 group-hover:text-[#0047AB]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // DETAIL WORKSPACE
  // ══════════════════════════════════════════════════════════════════════════════
  if (selectedIntern) {
    const locked = isCreditLocked(selectedIntern);
    const availableCats = availableWorkspaceCategories();

    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Internship Workspace</h2>
              {selectedIntern.map_for_credits && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1">
                  <GraduationCap size={10} /> Mapped for Academic Credits
                </span>
              )}
            </div>
            <button onClick={() => setSelectedIntern(null)} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6 border-r pr-8">
              <h4 className="text-xs font-black uppercase text-[#0047AB]">Details</h4>
              <InfoRow label="Company" value={selectedIntern.company_name} />
              <InfoRow label="Role" value={selectedIntern.role_title} />
              <InfoRow label="Type" value={selectedIntern.internship_type} />
              <InfoRow label="Mode" value={selectedIntern.mode} />
              <InfoRow label="Location" value={selectedIntern.location || 'Remote'} />
              <InfoRow label="Stipend" value={selectedIntern.stipend || 'Unpaid'} />
            </div>

            <div className="space-y-6 border-r pr-8">
              <h4 className="text-xs font-black uppercase text-[#0047AB]">Duration & Actions</h4>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm font-bold text-center">
                  {selectedIntern.expected_start_date} <ArrowRight className="inline mx-2" size={14} /> {selectedIntern.expected_end_date}
                </p>
              </div>

              <button
                onClick={() => navigate('/bonafide-student')}
                className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <ClipboardList size={18} /> Request Document
              </button>

              {locked ? (
                <div className="w-full p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 flex items-start gap-3">
                  <Lock size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Exit Survey Locked</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Requires: Offer Letter + Completion Certificate uploaded & verification approved.
                    </p>
                  </div>
                </div>
              ) : selectedIntern.activity_status === 'Completed' ? (
                <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <p className="text-sm font-bold text-emerald-700">Survey Completed</p>
                </div>
              ) : (
                <button
                  onClick={() => setView('survey')}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <Edit3 size={18} /> Fill Exit Survey
                </button>
              )}
            </div>

            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase text-[#0047AB]">Documents</h4>

              {selectedIntern.supporting_documents && selectedIntern.supporting_documents.length > 0 ? (
                <div className="space-y-3">
                  {selectedIntern.supporting_documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 border rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all group/doc"
                    >
                      <span className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        {doc.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#0047AB] group-hover/doc:underline">
                        <Eye size={12} /> View PDF
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No documents uploaded.</p>
              )}

              {availableCats.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Missing Document</h5>
                  <select
                    value={workspaceDocCategory}
                    onChange={e => { setWorkspaceDocCategory(e.target.value); setWorkspaceUploaded(false); }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#0047AB] outline-none"
                  >
                    <option value="">Select category…</option>
                    {availableCats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {workspaceDocCategory && (
                    <div className="relative border-2 border-dashed border-slate-200 h-[44px] rounded-xl flex items-center justify-center group hover:border-[#0047AB] bg-slate-50 cursor-pointer overflow-hidden">
                      {workspaceUploading
                        ? <Loader2 className="animate-spin text-[#0047AB]" size={18} />
                        : workspaceUploaded
                          ? <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14} /> Uploaded!</span>
                          : <span className="text-xs font-bold text-slate-500 group-hover:text-[#0047AB] flex items-center gap-2"><Upload size={13} /> Upload File</span>
                      }
                      <input type="file" onChange={handleWorkspaceUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={workspaceUploading} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // ADD FORM VIEW
  // ══════════════════════════════════════════════════════════════════════════════
  const formValid = isFormValid();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[32px] border shadow-xl relative">
        <button onClick={() => setView('list')} className="absolute right-8 top-8 text-slate-300">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black text-slate-900 mb-8">New Internship Application</h2>

        <form onSubmit={handleAddInternship} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailInput label="Company Name*" value={formData.company_name} onChange={(v) => setFormData({ ...formData, company_name: v })} required />
            <DetailInput label="Role Title*" value={formData.role_title} onChange={(v) => setFormData({ ...formData, role_title: v })} required />
          </div>

          {/* Dates — start can't be in the past, end can't be before start */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Start Date*</label>
              <input
                type="date"
                value={formData.expected_start_date}
                min={today}
                onChange={(e) => setFormData({ ...formData, expected_start_date: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected End Date*</label>
              <input
                type="date"
                value={formData.expected_end_date}
                min={formData.expected_start_date || today}
                onChange={(e) => setFormData({ ...formData, expected_end_date: e.target.value })}
                required
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${dateError ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-[#0047AB]'}`}
              />
              {dateError && <p className="text-[10px] text-red-500 font-bold ml-1">{dateError}</p>}
            </div>
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
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internship Type*</label>
              <select
                value={formData.internship_type}
                onChange={(e) => setFormData({ ...formData, internship_type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
              >
                {INTERNSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailInput label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
            <DetailInput label="Stipend (e.g. 20,000)" value={formData.stipend} onChange={(v) => setFormData({ ...formData, stipend: v })} />
          </div>

          <DetailInput label="Company LinkedIn" type="url" value={formData.company_linkedin} onChange={(v) => setFormData({ ...formData, company_linkedin: v })} />

          {/* Reporting Authority */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#0047AB]">Reporting Authority</h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailInput
                label="Name"
                value={formData.reporting_xx1 || ''}
                onChange={(v) => setFormData({ ...formData, reporting_xx1: v })}
              />
              <DetailInput
                label="Designation"
                value={formData.reporting_xx2 || ''}
                onChange={(v) => setFormData({ ...formData, reporting_xx2: v })}
              />
              {/* Email with validation */}
              <DetailInput
                label="Email"
                type="email"
                value={formData.reporting_xx3 || ''}
                error={fieldErrors.reporting_xx3}
                onChange={(v) => {
                  setFormData({ ...formData, reporting_xx3: v });
                  validateField('reporting_xx3', v);
                }}
              />
              {/* Phone with validation */}
              <DetailInput
                label="Phone Number"
                value={formData.reporting_xx4 || ''}
                error={fieldErrors.reporting_xx4}
                onChange={(v) => {
                  setFormData({ ...formData, reporting_xx4: v });
                  validateField('reporting_xx4', v);
                }}
              />
            </div>
          </div>

          {/* Academic Credits Toggle */}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, map_for_credits: !prev.map_for_credits }))}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
              formData.map_for_credits
                ? 'bg-purple-50 border-purple-300'
                : 'bg-slate-50 border-slate-200 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={20} className={formData.map_for_credits ? 'text-purple-600' : 'text-slate-400'} />
              <div className="text-left">
                <p className={`text-sm font-bold ${formData.map_for_credits ? 'text-purple-700' : 'text-slate-600'}`}>
                  Map for Academic Credits
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Requires Offer Letter + Completion Certificate + Verification</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              formData.map_for_credits ? 'bg-purple-600 border-purple-600' : 'border-slate-300'
            }`}>
              {formData.map_for_credits && <CheckCircle2 size={12} className="text-white" />}
            </div>
          </button>

          {/* Supporting Documents */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#0047AB]">
              Supporting Documents <span className="text-red-400">*</span>
            </h3>

            {formData.supporting_documents.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.supporting_documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-bold">
                    {editingDocIdx === idx ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          autoFocus
                          type="text"
                          value={editingDocName}
                          onChange={e => setEditingDocName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleDocNameSave(idx);
                            if (e.key === 'Escape') setEditingDocIdx(null);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg border border-emerald-300 bg-white text-slate-700 outline-none focus:border-[#0047AB]"
                        />
                        <button type="button" onClick={() => handleDocNameSave(idx)} className="text-xs text-emerald-700 font-black hover:text-emerald-900">Save</button>
                        <button type="button" onClick={() => setEditingDocIdx(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2 flex-1">
                        <CheckCircle2 size={16} /> {doc.name}
                      </span>
                    )}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 underline hover:text-emerald-800">
                        <Eye size={12} /> View
                      </a>
                      {editingDocIdx !== idx && (
                        <button
                          type="button"
                          onClick={() => { setEditingDocIdx(idx); setEditingDocName(doc.name); }}
                          className="p-1 hover:bg-emerald-100 rounded-md transition-colors"
                          title="Rename document"
                        >
                          <Pencil size={12} className="text-emerald-600" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDocRemove(idx)}
                        className="p-1 hover:bg-red-100 rounded-md transition-colors"
                        title="Remove document"
                      >
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Category</label>
                <select
                  value={documentName}
                  onChange={e => setDocumentName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-[#0047AB] outline-none"
                >
                  {DOCUMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-1 space-y-1.5 flex flex-col justify-end">
                <div className="relative border-2 border-dashed border-slate-200 h-[46px] rounded-xl flex items-center justify-center group hover:border-[#0047AB] bg-slate-50 cursor-pointer overflow-hidden">
                  {uploading
                    ? <Loader2 className="animate-spin text-[#0047AB]" />
                    : <span className="text-xs font-bold text-slate-500 group-hover:text-[#0047AB] flex items-center gap-2"><Upload size={14} /> Upload File</span>
                  }
                  <input type="file" onChange={handleDocumentUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">At least one document is required to submit. You can upload multiple files.</p>
          </div>

          {/* Submit */}
          <div className="space-y-2 mt-8">
            {!formValid && (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>
                  {!formData.supporting_documents.length
                    ? 'Please upload at least one supporting document.'
                    : dateError
                    ? dateError
                    : 'Please fill all required (*) fields.'}
                </span>
              </div>
            )}
            <button
              type="submit"
              disabled={!formValid}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                formValid
                  ? 'bg-[#0047AB] text-white hover:bg-blue-800 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm & Add <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}