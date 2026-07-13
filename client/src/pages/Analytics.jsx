import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Loader2, TrendingUp, Users, PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#10b981', '#f59e0b'];

const Analytics = () => {
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const { data } = await api.get('/analytics/charts');
        setChartsData(data);
      } catch (error) {
        console.error('Failed to load charts data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharts();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const { revenueData, growthData, aiUsageDistribution } = chartsData || {};

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue Over Time */}
        <div className="p-6 rounded-2xl glass border border-[#27272a]/20">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Revenue & Subscriptions</h4>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="month" stroke="#a1a1aa" />
                <YAxis yAxisId="left" stroke="#a1a1aa" />
                <YAxis yAxisId="right" orientation="right" stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a',
                    borderRadius: '12px'
                  }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="subscriptions" stroke="#10b981" strokeWidth={2} name="Active Subscribers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Active Users */}
        <div className="p-6 rounded-2xl glass border border-[#27272a]/20">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Active Users & New Signups</h4>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="month" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a',
                    borderRadius: '12px'
                  }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="activeUsers" fill="#6366f1" radius={[4, 4, 0, 0]} name="Active Users" />
                <Bar dataKey="newSignups" fill="#ec4899" radius={[4, 4, 0, 0]} name="New Signups" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart 3: AI Distribution pie */}
      <div className="p-6 rounded-2xl glass border border-[#27272a]/20 max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <PieIcon className="w-4 h-4 text-pink-400" />
          <h4 className="text-sm font-semibold uppercase tracking-wider">AI Operations Distribution</h4>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="h-64 w-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiUsageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aiUsageDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a',
                    borderRadius: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {aiUsageDistribution?.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3 text-xs">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="font-medium text-[#f4f4f5]">{entry.name}</span>
                <span className="text-[#a1a1aa]">({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
