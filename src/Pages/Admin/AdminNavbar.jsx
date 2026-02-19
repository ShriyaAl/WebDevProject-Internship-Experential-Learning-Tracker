import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen,
  ClipboardList
} from 'lucide-react';

const AdminNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group ${
      isActive 
        ? 'bg-red-50 text-red-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-red-700'
    } ${isCollapsed ? 'justify-center' : ''}`;

  return (
    <aside className={`transition-all duration-300 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Sidebar Header */}
      <div className={`p-4 flex items-center border-b border-gray-100 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-red-700" size={24} />
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin</h1>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-md border border-gray-200 text-gray-500 transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {/* Dashboard */}
        <NavItem to="/home-admin" icon={<LayoutDashboard size={22} />} label="System Overview" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        
        {/* User Management */}
        <NavItem to="/users-admin" icon={<Users size={22} />} label="User Management" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        
        {/* Research Approvals (The critical bridge) */}
        <NavItem to="/approvals-admin" icon={<ClipboardList size={22} />} label="Research Requests" isCollapsed={isCollapsed} classNameFunc={navItemClass} />
        
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

const NavItem = ({ to, icon, label, isCollapsed, classNameFunc }) => (
  <NavLink title={isCollapsed ? label : ""} to={to} className={classNameFunc}>
    <div className="flex-shrink-0">{icon}</div>
    {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden transition-opacity duration-300">{label}</span>}
  </NavLink>
);

export default AdminNavbar;