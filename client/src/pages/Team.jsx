import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Plus, Mail, ShieldAlert, Loader2, X } from 'lucide-react';

const initialMembers = [
  { id: 1, name: 'Aizaz Ahmad', email: 'aizaz@workspace.ai', role: 'Owner', avatar: 'AA', status: 'Active' },
  { id: 2, name: 'Sarah Connor', email: 'sarah.c@workspace.ai', role: 'Manager', avatar: 'SC', status: 'Active' },
  { id: 3, name: 'John Doe', email: 'john@workspace.ai', role: 'Developer', avatar: 'JD', status: 'Pending' }
];

const Team = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [loading, setLoading] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newMember = {
        id: members.length + 1,
        name,
        email,
        role,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        status: 'Pending'
      };
      setMembers([...members, newMember]);
      setName('');
      setEmail('');
      setRole('Developer');
      setLoading(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Team Management</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">Assign roles, manage access configurations, and invite members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team table grid */}
      <div className="border border-[#27272a]/20 glass rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#27272a]/15 text-[#a1a1aa] uppercase font-bold tracking-widest text-[9px] bg-[#18181b]/15">
              <th className="p-4 pl-6">Member</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 pr-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/10">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-[#18181b]/10 transition">
                <td className="p-4 pl-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                    {member.avatar}
                  </div>
                  <span className="font-semibold text-[#f4f4f5]">{member.name}</span>
                </td>
                <td className="p-4 text-[#a1a1aa]">{member.email}</td>
                <td className="p-4">
                  <span className="bg-[#27272a]/40 text-[#f4f4f5] border border-border/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {member.role}
                  </span>
                </td>
                <td className="p-4 pr-6">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                    member.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                  }`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              className="absolute top-4 right-4 text-[#a1a1aa] hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold mb-4">Invite Team Member</h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@workspace.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Access Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                >
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send Invite'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Team;
