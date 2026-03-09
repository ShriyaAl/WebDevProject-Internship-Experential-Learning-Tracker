import React from 'react';
import { Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const RequestsTable = ({ requests, onReview, loading }) => {

    if (loading) {
        return (
            <div className="p-10 text-center flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400">Fetching requests...</p>
            </div>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="p-20 text-center bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">No requests found.</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Approved</span>;
            case 'ON_HOLD': return <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><Clock size={12} /> On Hold</span>;
            case 'REJECTED': return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
            default: return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Internship</th>
                            <th className="px-6 py-4">Request Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <h4 className="font-bold text-gray-800 text-sm">{req.student_profiles?.full_name}</h4>
                                    <p className="text-xs text-gray-400">{req.student_profiles?.reg_no}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <h4 className="font-bold text-gray-800 text-sm">{req.internships?.company_name}</h4>
                                    <p className="text-xs text-gray-400">{req.internships?.role_title}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-sm text-[#0e4ea7]">{req.request_types?.name}</span>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="px-6 py-4 flex items-center h-full">
                                    {getStatusBadge(req.status)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onReview(req.id)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0e4ea7] text-xs font-bold rounded-lg hover:bg-[#0e4ea7] hover:text-white transition-colors"
                                    >
                                        Review <ArrowRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
