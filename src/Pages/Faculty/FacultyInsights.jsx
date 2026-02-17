import React from 'react';
import { 
  Download, 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  ArrowUpRight, 
  Briefcase,
  Layers
} from 'lucide-react';

const FacultyInsights = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Placement & Conversion Analytics</h2>
          <p className="text-sm text-gray-500 font-medium">Tracking internship-to-placement success metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            <Calendar size={16}/> 2025-26 Cycle
          </button>
        </div>
      </div>

      {/* Conversion & Overall Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Placement', value: '84%', sub: '+4.2% from last year', icon: <Briefcase size={20}/>, color: '#0e4ea7' },
          { label: 'App-to-Offer Rate', value: '62%', sub: 'Conversion Ratio', icon: <Target size={20}/>, color: '#10b981' },
          { label: 'Total Placements', value: '1,240', sub: 'Active Interns', icon: <Users size={20}/>, color: '#8b5cf6' },
          { label: 'Avg. Package', value: '₹12.4L', sub: 'Highest: ₹44L', icon: <TrendingUp size={20}/>, color: '#f59e0b' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ArrowUpRight size={10}/> {stat.sub.split(' ')[0]}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Placement Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Layers size={18} className="text-[#0e4ea7]"/>
            <h3 className="font-bold text-gray-800">Department Performance Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-center">Placed</th>
                  <th className="px-6 py-4 text-center">Conversion %</th>
                  <th className="px-6 py-4">Bench Strength</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { dept: 'Computer Science', placed: 420, rate: 94, total: 450 },
                  { dept: 'Information Tech', placed: 310, rate: 88, total: 350 },
                  { dept: 'Electronics (ECE)', placed: 245, rate: 72, total: 340 },
                  { dept: 'Mechanical', placed: 165, rate: 54, total: 305 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-700 text-sm">{row.dept}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{row.placed}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex-1 max-w-[100px] h-1.5 bg-gray-100 rounded-full">
                          <div 
                            className="h-full bg-[#0e4ea7] rounded-full" 
                            style={{ width: `${row.rate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{row.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 font-medium">{row.total - row.placed} seeking opportunities</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Funnel Visualization */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <h4 className="font-bold text-gray-800 text-sm mb-6">Conversion Funnel</h4>
          <div className="flex-1 flex flex-col justify-around py-4">
            {[
              { step: 'Applied', val: '100%', color: '#0e4ea7' },
              { step: 'Interviewed', val: '45%', color: '#3b82f6' },
              { step: 'Offered', val: '28%', color: '#60a5fa' },
              { step: 'Accepted', val: '24%', color: '#93c5fd' }
            ].map((f, idx) => (
              <div key={idx} className="relative group cursor-help">
                <div 
                  className="h-12 flex items-center justify-center text-[10px] font-bold text-white rounded-lg shadow-sm transition-all group-hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: f.color, 
                    width: f.val,
                    margin: '0 auto'
                  }}
                >
                  {f.val}
                </div>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase mt-1">{f.step}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-6 text-center italic">Calculated based on verified student offer letters.</p>
        </div>
      </div>

      {/* Analytics Footer Action */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <TrendingUp size={24} className="text-[#0e4ea7]"/>
          </div>
          <div>
            <h4 className="font-bold">Predictive Hiring Insights</h4>
            <p className="text-xs text-gray-400">AI suggests a 12% increase in Cloud roles for the next quarter.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-[#0e4ea7] text-sm font-bold rounded-xl hover:bg-[#0c438f] transition-all">
          View Forecast
        </button>
      </div>
    </div>
  );
};

export default FacultyInsights;