import React, { useState } from 'react';
import { 
  Menu, 
  ChevronLeft, 
  LayoutDashboard, 
  Search, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  UserCircle, 
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function StudentNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Unified Student Route Paths
  const navItems = [
    { id: 'Home', icon: LayoutDashboard, label: 'Home', path: '/home-student' },
    { id: 'Explore', icon: Search, label: 'Explore', path: '/explore-student' },
    { id: 'Apps', icon: FileText, label: 'My Applications', path: '/apps-student' },
    { id: 'Internship', icon: Briefcase, label: 'My Internship', path: '/internship-student' },
    { id: 'Research', icon: GraduationCap, label: 'Research & LOR', path: '/research-student' },
    { id: 'Profile', icon: UserCircle, label: 'Profile', path: '/profile-student' },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0 h-screen sticky top-0 z-50 shadow-sm`}
    >
      {/* 1. Header with NEXUS Branding */}
      <div className="p-4 flex items-center justify-between h-16 border-b border-slate-50">
        {!isCollapsed && (
          <span className="font-black text-xl tracking-tighter text-slate-800 px-2 italic">
            NEXUS
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* 2. Navigation Section */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          // Check for active route to apply Indigo styling
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
              />
              
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              )}

              {/* Active Indicator Pulse */}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              )}

              {/* Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Footer Section (Logout) */}
      <div className="p-3 border-t border-slate-100">
        <button 
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && (
            <span className="text-sm font-bold">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}