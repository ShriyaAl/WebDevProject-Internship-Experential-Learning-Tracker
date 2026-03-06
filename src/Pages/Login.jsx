import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ChevronRight, GraduationCap, UserCog, Building2 } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    switch (role) {
      case 'student':
        navigate('/explore-student'); 
        break;
      case 'faculty':
        navigate('/home-faculty'); 
        break;
      case 'admin':
        navigate('/home-admin'); 
        break;
      default:
        navigate('/'); 
    }
  };

  const roles = [
    { id: 'student', label: 'Student', icon: <GraduationCap size={20}/> },
    { id: 'faculty', label: 'Faculty', icon: <User size={20}/> },
    { id: 'admin', label: 'Admin', icon: <UserCog size={20}/> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex bg-[#0e4ea7] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <Building2 className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">Internship <br/>Management <br/>Portal</h1>
            <p className="text-blue-100 mt-6 text-lg max-w-xs">Connecting classroom learning with real-world experience.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">Select your portal to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection - Adjusted to 3 Columns */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border transition-all duration-200 ${
                    role === r.id 
                    ? 'border-[#0e4ea7] bg-[#0e4ea708] text-[#0e4ea7] ring-2 ring-[#0e4ea720]' 
                    : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`${role === r.id ? 'text-[#0e4ea7]' : 'text-gray-400'}`}>
                    {r.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0e4ea7] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="University ID / Email" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0e4ea7] focus:ring-4 focus:ring-[#0e4ea70a] transition-all font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0e4ea7] transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0e4ea7] focus:ring-4 focus:ring-[#0e4ea70a] transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#0e4ea7] text-white rounded-2xl font-bold text-lg hover:bg-[#0c438f] shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-4">
              Sign In <ChevronRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;