import React, { useState } from 'react';
import { FilePlus, UserCheck, MessageSquare, Search, FileText, Send } from 'lucide-react';

const Research = () => {
  const [activeTab, setActiveTab] = useState('research'); // 'research' or 'lor'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Research & Recommendations</h3>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
        {/* Custom Tab Headers */}
        <div className="flex border-b border-gray-200 px-6">
          <button 
            onClick={() => setActiveTab('research')}
            className={`px-6 py-4 font-semibold transition-all border-b-2 ${
              activeTab === 'research' 
              ? 'border-[#0e4ea7] text-[#0e4ea7]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Research Postings
          </button>
          <button 
            onClick={() => setActiveTab('lor')}
            className={`px-6 py-4 font-semibold transition-all border-b-2 ${
              activeTab === 'lor' 
              ? 'border-[#0e4ea7] text-[#0e4ea7]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            LOR Workspace
          </button>
        </div>
        
        <div className="p-6 flex-1">
          {activeTab === 'research' ? (
            /* Research Content */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-700">Active Opportunities</h4>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0e4ea7] text-white rounded-lg text-sm font-medium hover:bg-[#0c438f] transition-all">
                  <FilePlus size={16}/> New Research Post
                </button>
              </div>
              
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-5 border border-gray-100 rounded-xl flex items-center justify-between hover:border-[#0e4ea750] transition-all bg-gray-50/30">
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-800">Advanced NLP for Healthcare Diagnostics</h5>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        Applied: 14 students • <span className="flex items-center gap-1 text-green-600 font-medium"><UserCheck size={14}/> Approved by Admin</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-[#0e4ea7] hover:border-[#0e4ea7] transition-all">
                        <MessageSquare size={18}/>
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                        View Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* LOR Workspace Content */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-700">Recommendation Requests</h4>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input type="text" placeholder="Search students..." className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#0e4ea7]"/>
                </div>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-[#0e4ea7] rounded-full flex items-center justify-center font-bold">RK</div>
                      <div>
                        <p className="font-bold text-gray-800">Rohan Kapoor</p>
                        <p className="text-xs text-gray-400">Internship Score: 9.8/10 • Google Cloud</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#0e4ea7] bg-[#0e4ea710] rounded hover:bg-[#0e4ea720]">
                         <FileText size={14}/> GENERATE LOR
                       </button>
                       <button className="p-1.5 text-gray-400 hover:text-gray-600"><Send size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;