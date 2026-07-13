import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  FolderGit2, 
  ListTodo, 
  Bot, 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Bell,
  Sparkles
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Tasks (Kanban)', path: '/tasks', icon: ListTodo },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, highlight: true },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#09090b] text-[#f4f4f5]' : 'bg-[#f4f4f5] text-[#09090b]'}`}>
      
      {/* Sidebar for Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-[#27272a]/20 md:border-border/10
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${theme === 'dark' ? 'bg-[#09090b]' : 'bg-white'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#27272a]/10 md:border-border/10">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wider" onClick={() => setSidebarOpen(false)}>
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>AI WORKSPACE</span>
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : theme === 'dark' 
                      ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#f4f4f5]' 
                      : 'text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#09090b]'
                  }
                  ${item.highlight && !isActive ? 'border border-indigo-600/20 bg-indigo-600/5' : ''}
                `}
              >
                <Icon className={`w-4 h-4 ${item.highlight && !isActive ? 'text-indigo-500' : ''}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-[#27272a]/10 md:border-border/10">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#a1a1aa] truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-6 border-b border-[#27272a]/10 md:border-border/10 sticky top-0 z-30 backdrop-blur-md ${theme === 'dark' ? 'bg-[#09090b]/80' : 'bg-white/80'}`}>
          <div className="flex items-center gap-4">
            <button className="md:hidden p-1.5 rounded-lg border border-border/10" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold hidden md:block">
              {menuItems.find(item => item.path === location.pathname)?.name || 'AI Workspace'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Limit Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-indigo-600/10 border border-indigo-600/20 px-3 py-1 rounded-full text-indigo-400 font-medium">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Runs: {user?.aiUsageCount || 0} / {user?.aiUsageLimit || 20}</span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors border border-[#27272a]/10 md:border-border/10 ${theme === 'dark' ? 'hover:bg-[#18181b]' : 'hover:bg-[#f4f4f5]'}`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
            </button>

            {/* Notification bell */}
            <button className={`p-2 rounded-lg relative border border-[#27272a]/10 md:border-border/10 ${theme === 'dark' ? 'hover:bg-[#18181b]' : 'hover:bg-[#f4f4f5]'}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
