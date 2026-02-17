import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, 
  Search, BarChart3, UserCircle, 
  LogOut, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';

const FacultyNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group ${
      isActive 
        ? 'bg-[#0e4ea715] text-[#0e4ea7] font-semibold' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-[#0e4ea7]'
    } ${isCollapsed ? 'justify-center' : ''}`;

  return (
    <aside className={`transition-all duration-300 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Sidebar Header */}
      <div className={`p-4 flex items-center border-b border-gray-100 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 tracking-tight">Logo</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-md border border-gray-200 text-gray-500 transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <NavItem to="/home-faculty" icon={<LayoutDashboard size={22} />} label="Home" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        <NavItem to="/tracker-faculty" icon={<Users size={22} />} label="Student Tracker" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        <NavItem to="/academic-faculty" icon={<GraduationCap size={22} />} label="Academic Hub" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        <NavItem to="/research-faculty" icon={<Search size={22} />} label="Research & LOR" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        <NavItem to="/insights-faculty" icon={<BarChart3 size={22} />} label="Insights" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        <NavItem to="/profile-faculty" icon={<UserCircle size={22} />} label="Profile" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-gray-100">
        <button className={`flex items-center w-full px-3 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

// Helper component for cleaner NavLink rendering
const NavItem = ({ to, icon, label, isCollapsed, classNameFunc }) => (
  <NavLink title={isCollapsed ? label : ""} to={to} className={classNameFunc}>
    <div className="flex-shrink-0">{icon}</div>
    {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden transition-opacity duration-300">{label}</span>}
  </NavLink>
);

export default FacultyNavbar;