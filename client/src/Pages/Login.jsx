import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ChevronRight, GraduationCap, UserCog, Building2, Loader2 } from 'lucide-react';

const Login = () => {
  // 1. Added State for Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Visual role selector state (kept for UI purposes as requested)
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // 1. Get the role from backend
      const backendRole = data.data.user.role; // e.g., "STUDENT", "INCHARGE", "ADMIN"

      // 2. Map UI Role to Backend Role for comparison
      // UI State 'role' is currently 'student', 'faculty', or 'admin'
      const roleMapping = {
        student: 'STUDENT',
        faculty: 'INCHARGE',
        admin: 'ADMIN'
      };

      // 3. Validation Gate: Check if UI selection matches Backend data
      if (backendRole !== roleMapping[role]) {
        // We clear the session data if it was set (optional, depends on your API)
        throw new Error(`Unauthorized: This account is not registered as ${role.charAt(0).toUpperCase() + role.slice(1)}.`);
      }

      // 4. If match, proceed to Session Storage
      localStorage.setItem('access_token', data.data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // 5. Redirect
      if (backendRole === 'STUDENT') navigate('/internship-student');
      else if (backendRole === 'INCHARGE') navigate('/home-faculty');
      else if (backendRole === 'ADMIN') navigate('/dashboard-admin');
      else navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        
        {/* Left Side: Branding (Same as before) */}
        <div className="hidden md:flex bg-[#0e4ea7] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/30 text-white">
              <Building2 size={28} />
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
            {/* Visual Role Selector */}
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
                  {r.icon}
                  <span className="text-xs font-bold uppercase tracking-wider">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0e4ea7] transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0e4ea7] transition-all font-medium"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0e4ea7] transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0e4ea7] transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-[#0e4ea7] text-white rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0c438f] hover:shadow-blue-900/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper for the error icon since it wasn't in the original imports
const AlertCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default Login;