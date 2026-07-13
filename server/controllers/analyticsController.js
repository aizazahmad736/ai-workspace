import Activity from '../models/Activity.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getDashboardData = async (req, res) => {
  const userId = req.user.id || req.user._id;

  try {
    // 1. Fetch real recent activities for the user
    const activities = await Activity.find({ userId });
    // Sort activities by date descending (latest first)
    const recentActivities = activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // 2. Fetch projects and tasks count
    const projects = await Project.find({ ownerId: userId });
    const projectIds = projects.map(p => p.id || p._id);
    const allTasks = await Task.find({});
    const userTasks = allTasks.filter(t => projectIds.includes(t.projectId));
    const completedTasksCount = userTasks.filter(t => t.status === 'Done').length;

    // 3. User Specific Stat Customization
    const userPlan = req.user.plan || 'Free';
    let baseRevenue = 0;
    if (userPlan === 'Pro') baseRevenue = 49;
    if (userPlan === 'Enterprise') baseRevenue = 499;

    // 4. Generate visual metrics
    const stats = {
      revenue: {
        value: `$${(baseRevenue + 12450).toLocaleString()}`,
        growth: '+18.4%',
        label: 'Monthly Recurring Revenue'
      },
      activeUsers: {
        value: '1,482',
        growth: '+12.1%',
        label: 'Active Users'
      },
      subscriptions: {
        value: (userPlan === 'Free' ? '124' : '125'),
        growth: '+4.8%',
        label: 'Total Subscriptions'
      },
      growth: {
        value: '24.6%',
        growth: '+2.4%',
        label: 'Month-over-Month Growth'
      },
      tasksCompletion: {
        value: `${completedTasksCount}/${userTasks.length}`,
        label: 'Tasks Completed'
      },
      projectsCount: {
        value: projects.length,
        label: 'Total Active Projects'
      }
    };

    res.json({
      stats,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsCharts = async (req, res) => {
  try {
    // Revenue Chart (6 months)
    const revenueData = [
      { month: 'Jan', revenue: 8400, subscriptions: 80 },
      { month: 'Feb', revenue: 9300, subscriptions: 92 },
      { month: 'Mar', revenue: 10200, subscriptions: 104 },
      { month: 'Apr', revenue: 11500, subscriptions: 112 },
      { month: 'May', revenue: 12100, subscriptions: 118 },
      { month: 'Jun', revenue: 12499, subscriptions: 125 }
    ];

    // User Growth (6 months)
    const growthData = [
      { month: 'Jan', activeUsers: 850, newSignups: 120 },
      { month: 'Feb', activeUsers: 980, newSignups: 160 },
      { month: 'Mar', activeUsers: 1120, newSignups: 190 },
      { month: 'Apr', activeUsers: 1290, newSignups: 220 },
      { month: 'May', activeUsers: 1380, newSignups: 150 },
      { month: 'Jun', activeUsers: 1482, newSignups: 210 }
    ];

    // AI Features Usage distribution
    const aiUsageDistribution = [
      { name: 'Resume Reviewer', value: 35 },
      { name: 'Interview Simulator', value: 25 },
      { name: 'Code Explainer', value: 20 },
      { name: 'Text Summarizer', value: 12 },
      { name: 'Email Generator', value: 8 }
    ];

    res.json({
      revenueData,
      growthData,
      aiUsageDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
