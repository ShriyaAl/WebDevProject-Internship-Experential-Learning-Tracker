import React from 'react';
import { Star } from 'lucide-react';

const Evaluation = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Final Internship Evaluation</h1>
      <p className="text-gray-500 mb-8">Please provide a final assessment for John Doe</p>

      <div className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technical Ability (1-5 Stars)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => <Star key={star} className="text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend them for a full-time role?</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2"><input type="radio" name="rec" className="w-4 h-4" /> Yes</label>
            <label className="flex items-center gap-2"><input type="radio" name="rec" className="w-4 h-4" /> No</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Final Comments & Success Stories</label>
          <textarea className="w-full border border-gray-200 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none" placeholder="How did the intern perform overall?"></textarea>
        </div>

        <button className="w-full bg-[#0e4ea7] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">
          Submit Final Assessment
        </button>
      </div>
    </div>
  );
};

export default Evaluation;