import React, { useState } from 'react';
import { 
  Search, Filter, Send, Eye, X, 
  FileText, Briefcase, User, MapPin, 
  ExternalLink, CheckCircle2, Code2, 
  Trophy, Link as LinkIcon, Clock 
} from 'lucide-react';

const StudentTracker = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handlePing = (name) => {
    alert(`Nudge sent to ${name}. They will receive a notification to update their pending reports.`);
  };

  return (
    <div className="relative">
      {/* Main Grid Container */}
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${selectedStudent ? 'mr-[450px]' : ''}`}>
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Intern Oversight Command Center</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600 shadow-sm">
              <Filter size={16}/> Filter
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student, skills, or company..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4ea715] focus:border-[#0e4ea7]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student & ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company & Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Skills</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className={`hover:bg-blue-50/30 transition-colors ${selectedStudent?.id === i ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-sm">Amit Kumar</p>
                    <p className="text-[11px] text-gray-400 font-medium">2024CS00{i}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 font-semibold">Microsoft</p>
                    <p className="text-[11px] text-[#0e4ea7] font-bold uppercase tracking-tighter">Backend Intern</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {['Node.js', 'Azure'].map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md font-medium">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setSelectedStudent({ id: i, name: 'Amit Kumar', company: 'Microsoft', skills: ['Node.js', 'Azure', 'PostgreSQL', 'Docker'] })}
                        className="p-2 text-gray-400 hover:text-[#0e4ea7] hover:bg-white rounded-md transition-all"
                      >
                        <Eye size={18}/>
                      </button>
                      <button 
                        onClick={() => handlePing('Amit Kumar')}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-md transition-all"
                      >
                        <Send size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Student Details Slide-over */}
      {selectedStudent && (
        <div className="fixed top-0 right-0 w-[450px] h-screen bg-white shadow-2xl border-l border-gray-200 z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#0e4ea7]"/>
                <h4 className="font-bold text-gray-800">Internship Dossier</h4>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X size={20}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Profile Overview */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#0e4ea7] to-blue-400 rounded-3xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">AK</div>
                <div>
                  <h5 className="font-bold text-xl text-gray-800">{selectedStudent.name}</h5>
                  <p className="text-sm text-gray-500 font-medium">B.Tech Computer Science • Year 4</p>
                </div>
              </div>

              {/* Skills & Tech Stack */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Code2 size={14}/>
                  <span>Core Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-[#0e4ea7] border border-blue-100 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Weekly Reports</p>
                  <p className="text-lg font-black text-gray-800">08/12</p>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                    <div className="bg-[#0e4ea7] h-full rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Manager Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-black text-gray-800">4.8</p>
                    <Trophy size={14} className="text-yellow-500"/>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Top 5% of Cohort</p>
                </div>
              </div>

              {/* Manager & Company Details */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Briefcase size={14}/> Corporate Mentor
                </p>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Satya Nadella</p>
                      <p className="text-xs text-gray-500">VP Engineering, {selectedStudent.company}</p>
                    </div>
                    <button className="text-gray-400 hover:text-[#0e4ea7]"><LinkIcon size={14}/></button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="text-[#0e4ea7]"/>
                    <span>Building 42, Microsoft Campus, WA</span>
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={14}/> Timeline & Docs
                </p>
                <div className="space-y-2">
                  {[
                    { name: 'Offer Letter', status: 'verified', type: 'PDF' },
                    { name: 'Internship Logbook', status: 'pending', type: 'Sheet' },
                    { name: 'Manager Evaluation', status: 'verified', type: 'Form' }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-white hover:border-[#0e4ea750] transition-all group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${doc.status === 'verified' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          <FileText size={16}/>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">{doc.name}</p>
                          <p className="text-[10px] text-gray-400">{doc.type} • Last sync 2h ago</p>
                        </div>
                      </div>
                      {doc.status === 'verified' ? <CheckCircle2 size={16} className="text-green-500"/> : <ExternalLink size={16} className="text-gray-300 group-hover:text-[#0e4ea7] cursor-pointer"/>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex gap-3">
              <button className="flex-1 py-3 bg-[#0e4ea7] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:bg-[#0c438f] transition-all">
                Approve Portfolio
              </button>
              <button className="p-3 border border-gray-200 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTracker;