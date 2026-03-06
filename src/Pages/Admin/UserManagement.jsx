import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, MoreVertical, 
  Trash2, Edit3, X, Check, ChevronDown 
} from 'lucide-react';

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Functional State ---
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Aris', email: 'aris@univ.edu', type: 'Faculty', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john.d@univ.edu', type: 'Student', status: 'Active' },
  ]);

  const [formData, setFormData] = useState({ id: null, name: '', email: '', type: 'Student' });
  const [isEditing, setIsEditing] = useState(false);

  // --- Handlers ---

  const handleOpenModal = (user = null) => {
    if (user) {
      setFormData(user);
      setIsEditing(true);
    } else {
      setFormData({ id: null, name: '', email: '', type: 'Student' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) return alert("Please fill all fields");

    if (isEditing) {
      // Update existing
      setUsers(users.map(u => u.id === formData.id ? { ...formData } : u));
    } else {
      // Add new
      const newUser = { ...formData, id: Date.now(), status: 'Active' };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 bg-[#F8FAFC] min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg flex items-center gap-2"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </header>

      {/* Search Bar */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <Search className="text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-4">User Details</th>
              <th className="px-8 py-4">Account Type</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${user.type === 'Faculty' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                    {user.type}
                  </span>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(user)}
                    className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="px-8 py-10 text-center text-slate-400 italic text-sm">No users found...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900">{isEditing ? 'Edit User' : 'Add User'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-600"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Account Type</label>
                  <div className="relative">
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none outline-none focus:border-red-500"
                    >
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      placeholder="e.g. John Doe"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-red-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      placeholder="name@university.edu"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-red-500 transition-all" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveUser}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 mt-4"
                >
                  {isEditing ? 'Save Changes' : 'Confirm & Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}