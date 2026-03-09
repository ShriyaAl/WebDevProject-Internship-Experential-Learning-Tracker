import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '../../../lib/api';

export const RequestSlideOver = ({ requestId, onClose, onRefresh }) => {
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setLoading(true);
                const res = await apiFetch(`/api/requests/${requestId}`);
                if (res.success) setRequest(res.data);
            } catch (err) {
                console.error("Fetch detail error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (requestId) fetchRequest();
    }, [requestId]);

    const handleAction = async (status) => {
        if ((status === 'REJECTED' || status === 'ON_HOLD') && !comment.trim()) {
            alert("Please provide a comment for this action.");
            return;
        }
        try {
            setActionLoading(true);
            const res = await apiFetch(`/api/incharge/requests/${requestId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status, incharge_comment: comment })
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

    if (!requestId) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            {/* Slide Panel */}
            <div className="relative w-full max-w-lg bg-[#F8FAFC] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="bg-white p-6 border-b flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Review Request</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{requestId.slice(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                            <p className="text-gray-500 font-medium">Loading details...</p>
                        </div>
                    ) : request ? (
                        <>
                            {/* Student Profile Card */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center font-bold text-[#0e4ea7] text-lg border border-blue-100">
                                    {request.student_profiles?.full_name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{request.student_profiles?.full_name}</h3>
                                    <p className="text-sm font-medium text-gray-500">{request.student_profiles?.reg_no} • {request.student_profiles?.dept} Year {request.student_profiles?.year}</p>
                                </div>
                            </div>

                            {/* Request Context */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={16} className="text-[#0e4ea7]" />
                                    <h4 className="font-bold text-slate-800">Internship Details</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</p>
                                        <p className="font-semibold text-sm text-gray-800">{request.internships?.company_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</p>
                                        <p className="font-semibold text-sm text-gray-800">{request.internships?.role_title}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request Type</p>
                                        <p className="font-semibold text-[#0e4ea7]">{request.request_types?.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted Form Fields / Payload */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Student Submission</h4>
                                <div className="space-y-4">
                                    {Object.entries(request.request_submissions[0]?.payload_json || {}).map(([key, value]) => (
                                        <div key={key}>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key.replace(/_/g, ' ')}</p>
                                            <p className="text-sm font-medium text-gray-800 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">{value}</p>
                                        </div>
                                    ))}
                                    {request.student_note && (
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Note</p>
                                            <p className="text-sm font-medium text-gray-800 mt-1 italic">"{request.student_note}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Area */}
                            {request.status === 'PENDING' || request.status === 'ON_HOLD' ? (
                                <div className="bg-white p-5 rounded-2xl border-t-4 border-[#0e4ea7] shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-3">Faculty Action</h4>
                                    <textarea
                                        placeholder="Add comments before taking action..."
                                        className="w-full text-sm p-3 border rounded-xl mb-4 outline-none focus:border-[#0e4ea7] bg-gray-50"
                                        rows="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleAction('APPROVED')}
                                            className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all">
                                            <CheckCircle2 size={16} /> Approve
                                        </button>
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleAction('ON_HOLD')}
                                            className="flex items-center justify-center gap-1 bg-amber-50 text-amber-700 py-3 rounded-xl font-bold text-xs hover:bg-amber-500 hover:text-white transition-all">
                                            <Clock size={16} /> On Hold
                                        </button>
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleAction('REJECTED')}
                                            className="flex items-center justify-center gap-1 bg-red-50 text-red-700 py-3 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all">
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${request.status === 'APPROVED' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                                    <AlertCircle size={20} />
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-wider">This request is {request.status}</p>
                                        {request.incharge_comment && <p className="text-xs mt-1">Comment: {request.incharge_comment}</p>}
                                    </div>
                                </div>
                            )}

                        </>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">Request not found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
