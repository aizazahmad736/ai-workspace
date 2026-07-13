import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Percent, 
  Calendar, 
  ClipboardList, 
  Bot, 
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setData(data);
      } catch (error) {
        console.error('Error fetching dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const { stats, recentActivities } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent border border-indigo-500/10 p-8">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-violet-600/10 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Welcome back, {user?.name || 'Developer'}! <span className="animate-bounce">👋</span>
            </h2>
            <p className="text-sm text-[#a1a1aa] mt-1.5 max-w-xl">
              Track project milestones, run diagnostic AI reviews, and manage your workflows all in one centralized hub.
            </p>
          </div>
          <Link 
            to="/ai-assistant" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-600/25 transition-all w-fit"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="p-6 rounded-2xl glass hover-lift border border-[#27272a]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">{stats?.revenue?.label}</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.revenue?.value}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
            <span>{stats?.revenue?.growth}</span>
            <span className="text-[#a1a1aa]">since last month</span>
          </p>
        </div>

        {/* Card 2: Active Users */}
        <div className="p-6 rounded-2xl glass hover-lift border border-[#27272a]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">{stats?.activeUsers?.label}</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.activeUsers?.value}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
            <span>{stats?.activeUsers?.growth}</span>
            <span className="text-[#a1a1aa]">since last week</span>
          </p>
        </div>

        {/* Card 3: Subscriptions */}
        <div className="p-6 rounded-2xl glass hover-lift border border-[#27272a]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">{stats?.subscriptions?.label}</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.subscriptions?.value}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
            <span>{stats?.subscriptions?.growth}</span>
            <span className="text-[#a1a1aa]">since last month</span>
          </p>
        </div>

        {/* Card 4: MoM Growth */}
        <div className="p-6 rounded-2xl glass hover-lift border border-[#27272a]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">{stats?.growth?.label}</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.growth?.value}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
            <span>{stats?.growth?.growth}</span>
            <span className="text-[#a1a1aa]">above threshold</span>
          </p>
        </div>

      </div>

      {/* Grid: Tasks overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tasks Summary Widget */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#27272a]/20 glass flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-violet-400" />
              <h4 className="text-sm font-semibold uppercase tracking-wider">Project Milestones</h4>
            </div>
            <p className="text-xs text-[#a1a1aa]">Quick snapshot of tasks progress across your active project boards.</p>
            
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">{stats?.tasksCompletion?.value?.split('/')[0] || 0}</span>
              <span className="text-xl text-[#a1a1aa]">/ {stats?.tasksCompletion?.value?.split('/')[1] || 0} tasks completed</span>
            </div>

            {/* Custom progress bar */}
            <div className="w-full bg-[#27272a]/40 h-2.5 rounded-full mt-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${
                    (Number(stats?.tasksCompletion?.value?.split('/')[0]) / 
                     Math.max(Number(stats?.tasksCompletion?.value?.split('/')[1]), 1)) * 100
                  }%` 
                }}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#27272a]/10 pt-4">
            <span className="text-xs text-[#a1a1aa]">Current Workspace Plan: <strong>{user?.plan || 'Free'}</strong></span>
            <Link to="/tasks" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
              <span>View Kanban Board</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="p-6 rounded-2xl border border-[#27272a]/20 glass">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Activity History</h4>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id || act._id} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#f4f4f5] truncate">{act.action}</p>
                    <p className="text-[#a1a1aa] text-[10px] mt-0.5">{act.details}</p>
                    <span className="text-[9px] text-[#71717a] mt-1 block">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#a1a1aa]">
                <p>No recent actions logged yet.</p>
                <p className="text-[10px] mt-1 text-[#71717a]">Interact with projects or AI features to build logs.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
