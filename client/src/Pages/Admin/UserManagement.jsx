import React from 'react';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: 1, name: "Alice V.", email: "alice@univ.edu", role: "Student", status: "Active" },
    { id: 2, name: "Dr. Robert Fox", email: "rfox@univ.edu", role: "Faculty", status: "Pending" },
    { id: 3, name: "TechCorp Manager", email: "hr@techcorp.com", role: "Manager", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-red-700 transition-colors">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <Search className="text-gray-400 mr-2" size={18} />
          <input type="text" placeholder="Search name, email, or role..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right"><MoreHorizontal className="text-gray-300 cursor-pointer" size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;