import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '../../../lib/api';

export const InternshipSlideOver = ({ internship, onClose, onRefresh }) => {
    const [actionLoading, setActionLoading] = useState(false);

    const handleAction = async (status) => {
        try {
            setActionLoading(true);
            const res = await apiFetch(`/api/incharge/internships/${internship.id}/verify`, {
                method: 'PUT',
                body: JSON.stringify({ verification_status: status })
            });
            if (res.success) {
                onRefresh();
                onClose();
            }
        } catch (err) {
            alert(err.message || 'Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (!internship) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            {/* Slide Panel */}
            <div className="relative w-full max-w-lg bg-[#F8FAFC] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="bg-white p-6 border-b flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Verify Internship</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{internship.id.slice(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Student Profile Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center font-bold text-[#0e4ea7] text-lg border border-blue-100">
                            {internship.student_profiles?.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{internship.student_profiles?.full_name}</h3>
                            <p className="text-sm font-medium text-gray-500">{internship.student_profiles?.reg_no} • {internship.student_profiles?.dept} Year {internship.student_profiles?.year}</p>
                        </div>
                    </div>

                    {/* Internship Details */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={16} className="text-[#0e4ea7]" />
                            <h4 className="font-bold text-slate-800">Work Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</p>
                                <p className="font-semibold text-sm text-gray-800">{internship.company_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</p>
                                <p className="font-semibold text-sm text-gray-800">{internship.role_title}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</p>
                                <p className="font-semibold text-[#0e4ea7] text-sm">{internship.expected_start_date} <br />to {internship.expected_end_date}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stipend & Mode</p>
                                <p className="font-semibold text-slate-800 text-sm">{internship.stipend || 'Unpaid'} • {internship.mode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Supporting Documents */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Supporting Documents</h4>
                        <div className="space-y-4">
                            {internship.supporting_documents && internship.supporting_documents.length > 0 ? (
                                internship.supporting_documents.map((doc, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 border rounded-xl flex items-center justify-between">
                                        <span className="font-bold text-sm text-slate-700">{doc.name}</span>
                                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0e4ea7] hover:underline bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                                            Open PDF
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No supporting documents uploaded.</p>
                            )}
                        </div>
                    </div>

                    {/* Action Area */}
                    {internship.verification_status === 'PENDING' ? (
                        <div className="bg-white p-5 rounded-2xl border-t-4 border-[#0e4ea7] shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-3">Verification Action</h4>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleAction('VERIFIED')}
                                    className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all">
                                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Verify
                                </button>
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleAction('REJECTED')}
                                    className="flex items-center justify-center gap-1 bg-red-50 text-red-700 py-3 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all">
                                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />} Reject
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${internship.verification_status === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                            <AlertCircle size={20} />
                            <div>
                                <p className="font-bold text-sm uppercase tracking-wider">This Internship is {internship.verification_status}</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
