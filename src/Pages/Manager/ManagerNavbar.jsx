import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Star, 
  UserCircle, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react';

const ManagerNavbar = () => {
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
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 tracking-tight">Manager</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-md border border-gray-200 text-gray-500 transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {/* 1. Dashboard: See current interns */}
        <NavItem to="/home-manager" icon={<LayoutDashboard size={22} />} label="Dashboard" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        
        {/* 2. Pending Approvals: The weekly/monthly work logs */}
        <NavItem to="/approvals-manager" icon={<CheckSquare size={22} />} label="Pending Approvals" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        
        {/* 3. Final Evaluations: End of internship sign-off */}
        <NavItem to="/evaluations-manager" icon={<Star size={22} />} label="Final Evaluations" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        
        {/* Profile: Company/Personal info */}
        <NavItem to="/profile-manager" icon={<UserCircle size={22} />} label="Profile" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
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

// Helper component remains the same
const NavItem = ({ to, icon, label, isCollapsed, classNameFunc }) => (
  <NavLink title={isCollapsed ? label : ""} to={to} className={classNameFunc}>
    <div className="flex-shrink-0">{icon}</div>
    {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden transition-opacity duration-300">{label}</span>}
  </NavLink>
);

export default ManagerNavbar;