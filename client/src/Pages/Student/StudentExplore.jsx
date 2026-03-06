import React, { useState } from 'react';
import { BookOpen, Briefcase, ChevronDown, HelpCircle } from 'lucide-react'; // Assuming Lucide-React for icons

const StudentExplore = () => {
  const [openFaq, setOpenFaq] = useState(-1);

  const processes = [
    {
      title: "Academic Enrollment",
      description: "A streamlined path to getting your semester started without the paperwork headache.",
      steps: ["Select your core modules", "Consult with academic advisor", "Confirm your timetable"],
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      accent: "bg-blue-600",
      lightAccent: "bg-blue-50",
      textColor: "text-blue-900"
    },
    {
      title: "Career Placement",
      description: "Bridging the gap between graduation and your first day at a top-tier firm.",
      steps: ["Optimize your digital portfolio", "Attend mock interview sessions", "Submit to partner firms"],
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      accent: "bg-indigo-600",
      lightAccent: "bg-indigo-50",
      textColor: "text-indigo-900"
    }
  ];

  const faqs = [
    { q: "How long does the enrollment process take?", a: "Typically, enrollment is finalized within 3-5 business days after submission." },
    { q: "Can I change my career path later?", a: "Yes, you can schedule a pivot consultation at any time during the first two phases." },
    { q: "Are the interview sessions mandatory?", a: "They are highly recommended for the placement guarantee, but optional for self-placed students." }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4">
      <div className="max-w-6xl mx-auto font-sans">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Major Processes</h2>
        </div>

        {/* 2-Column Process Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          {processes.map((proc, idx) => (
            <div key={idx} className="group relative bg-white p-10 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className={`inline-flex p-3 rounded-2xl mb-6 ${proc.lightAccent} group-hover:scale-110 transition-transform`}>
                {proc.icon}
              </div>
              
              <h3 className={`text-2xl font-bold mb-4 ${proc.textColor}`}>{proc.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-8">{proc.description}</p>
              
              <div className="space-y-5">
                {proc.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center group/step">
                    <div className={`w-8 h-8 rounded-full ${proc.accent} text-white text-xs flex items-center justify-center font-bold mr-4 shrink-0 shadow-lg shadow-blue-200`}>
                      {sIdx + 1}
                    </div>
                    <span className="text-gray-700 font-medium group-hover/step:text-black transition-colors">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-10">
            <HelpCircle className="w-6 h-6 text-gray-400" />
            <h2 className="text-3xl font-bold text-gray-900">Common Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 rounded-2xl border ${
                  openFaq === index ? 'border-blue-200 bg-white shadow-md' : 'border-gray-200 bg-white/50'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full flex justify-between items-center p-5 text-left transition-colors"
                >
                  <span className={`font-semibold ${openFaq === index ? 'text-blue-700' : 'text-gray-700'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 pt-0 text-gray-500 leading-relaxed border-t border-gray-50 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default StudentExplore;