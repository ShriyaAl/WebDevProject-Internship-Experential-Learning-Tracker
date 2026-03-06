import React from 'react';
import { Tag, History, Mail, Briefcase } from 'lucide-react';

const FacultyProfile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0e4ea7] to-blue-400 flex items-center justify-center text-white text-3xl font-bold">FA</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Dr. Alan Turing</h2>
          <p className="text-gray-500 font-medium">Senior Professor • Computer Science</p>
          <div className="flex gap-4 mt-3">
             <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={14}/> alan.t@university.edu</span>
             <span className="flex items-center gap-1 text-xs text-gray-400"><Briefcase size={14}/> Room 402, Block C</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Tag size={18} className="text-[#0e4ea7]"/> Expertise Tags</h4>
        <div className="flex flex-wrap gap-2">
          {['NLP', 'Computer Vision', 'Embedded Systems', 'React', 'Cloud Architecture'].map(tag => (
            <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-[#0e4ea7] hover:text-white transition-colors cursor-pointer">{tag}</span>
          ))}
          <button className="px-4 py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-full text-sm hover:border-[#0e4ea7] hover:text-[#0e4ea7]">+ Add Tag</button>
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">Note: These tags help students find you for research mentorship.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><History size={18} className="text-[#0e4ea7]"/> Mentorship Archive</h4>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-700">Batch of 202{i+3} Students</span>
              <span className="text-sm font-bold text-[#0e4ea7]">48 Students Mentored</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
