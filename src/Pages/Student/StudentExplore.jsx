import React, { useState } from 'react';
import { 
  Search, Filter, Clock, ExternalLink, PencilLine, 
  Target, Zap, Send, TrendingUp, Info, AlertCircle 
} from 'lucide-react';

// --- Sub-Components ---

const IntensityLabel = ({ level }) => {
  const colors = {
    Beginner: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Intermediate: 'bg-amber-50 text-amber-600 border-amber-100',
    Advanced: 'bg-rose-50 text-rose-600 border-rose-100'
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-tighter ${colors[level]}`}>
      {level}
    </span>
  );
};

const CourseLink = ({ name, provider }) => (
  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-teal-50 transition-all border border-slate-100 mb-2">
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-700 leading-none mb-1 group-hover:text-teal-800 transition-colors">{name}</span>
      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{provider}</span>
    </div>
    <ExternalLink size={12} className="text-teal-500 opacity-50 group-hover:opacity-100" />
  </a>
);

export default function StudentExplore() {
  const [selectedJob, setSelectedJob] = useState(0);

  const jobs = [
    { 
      id: 0, role: "Full-Stack Developer", company: "Stripe", deadline: "2h", match: 8, intensity: "Intermediate",
      missing: ["Docker", "AWS"], projectedMatch: 10,
      quickWins: [{ name: "Docker for Devs", provider: "Udemy" }],
      deepDives: [{ name: "AWS Solutions Architect", provider: "Coursera" }]
    },
    { 
      id: 1, role: "Frontend Intern", company: "Linear", deadline: "5d", match: 9, intensity: "Beginner",
      missing: ["Tailwind CSS"], projectedMatch: 10,
      quickWins: [{ name: "Modern Tailwind UI", provider: "Vercel" }],
      deepDives: []
    }
  ];

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto animate-in fade-in duration-500 bg-[#F8FAFC]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Open Opportunities</h1>
        <p className="text-slate-500 text-sm italic">Targeted roles matching your current mastery level.</p>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* 📋 MAIN SECTION (70%) - OPPORTUNITIES GRID */}
        <div className="col-span-8 bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Job List</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:border-indigo-300 w-48 font-medium" />
              </div>
              <button className="p-2 border border-slate-100 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Role & Company</th>
                  <th className="px-8 py-4 text-center">Intensity</th>
                  <th className="px-8 py-4">Deadline</th>
                  <th className="px-8 py-4 text-center">Match</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => setSelectedJob(job.id)}
                    className={`cursor-pointer transition-all ${selectedJob === job.id ? 'bg-indigo-50/40 shadow-inner' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-[#0047AB]">{job.role}</p>
                      <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <IntensityLabel level={job.intensity} />
                    </td>
                    <td className={`px-8 py-5 text-xs font-bold ${job.deadline === '2h' ? 'text-rose-500' : 'text-slate-400'}`}>
                      <div className="flex items-center gap-2">
                        <Clock size={14} /> {job.deadline}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        {job.match}/10
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="bg-[#0047AB] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition-all flex items-center gap-2 ml-auto shadow-sm">
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🛠️ SIDEBAR WIDGETS (30%) */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm space-y-3">
            <button className="w-full bg-[#0047AB] text-white p-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-50 hover:bg-blue-800 transition-all">
              <PencilLine size={16} /> Edit Skill Profile
            </button>
            <button className="w-full bg-white border-2 border-[#0047AB] text-[#0047AB] p-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
              <Target size={16} /> Change Ideal Job
            </button>
          </div>

          <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={18} className="text-amber-500" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Evolution</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Projected Match</span>
                <TrendingUp size={14} className="text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-800 tracking-tight leading-none">
                Reach <span className="text-emerald-600 underline decoration-emerald-200 decoration-2">{jobs[selectedJob].projectedMatch}/10 Match</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Complete courses below to hit full eligibility.</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                  Needs Development <AlertCircle size={10} />
                </p>
                <div className="flex flex-wrap gap-2">
                  {jobs[selectedJob].missing.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded border border-rose-100">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {jobs[selectedJob].quickWins.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Quick Win (90% Close)</p>
                    {jobs[selectedJob].quickWins.map(link => (
                      <CourseLink key={link.name} {...link} />
                    ))}
                  </div>
                )}
                {jobs[selectedJob].deepDives.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Deep Dive (Specialization)</p>
                    {jobs[selectedJob].deepDives.map(link => (
                      <CourseLink key={link.name} {...link} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}