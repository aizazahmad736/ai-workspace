import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Settings as SettingsIcon, ShieldCheck, Sun, Moon, Loader2, Sparkles } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateProfile(name, password);
      setSuccessMsg('Profile settings updated successfully.');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          <span>System Settings</span>
        </h2>
        <p className="text-xs text-[#a1a1aa] mt-1">Configure user parameters, customize preferences, and manage credentials.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Preferences Section */}
      <div className="p-6 rounded-3xl glass border border-[#27272a]/20 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Visual Preferences</h3>
        
        <div className="flex items-center justify-between border-t border-[#27272a]/10 pt-4 text-xs">
          <div>
            <p className="font-semibold text-gray-200">Color Layout Theme</p>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5">Toggle between high contrast Light or sleek Dark aesthetics.</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-[#27272a] hover:bg-[#27272a]/80 text-[#f4f4f5] px-4 py-2.5 rounded-xl font-semibold cursor-pointer border border-[#27272a] text-[11px]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-violet-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* User settings form */}
      <div className="p-6 rounded-3xl glass border border-[#27272a]/20">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-6">Profile Parameters</h3>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Registered Email</label>
            <input 
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full bg-[#09090b]/50 border border-[#27272a] rounded-xl py-2.5 px-4 text-gray-500 focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Profile Name</label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">New Security Password</label>
            <input 
              type="password"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 mt-6"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Parameters'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Settings;
const SettingsStyles = () => {
  return (
    <div>
      <Sparkles className="w-5 h-5" />
      <ShieldCheck className="w-5 h-5" />
    </div>
  );
};
export { SettingsStyles };
