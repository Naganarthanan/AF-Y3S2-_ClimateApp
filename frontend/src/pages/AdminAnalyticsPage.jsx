// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/AdminAnalyticsPage.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { endpoints } from "../api/endpoints";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Award, 
  Activity,
  Calendar,
  Map,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    endpoints.analytics()
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 rounded-full border-emerald-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const regionData = data?.topRegions?.map((x, index) => ({ 
    name: String(x._id).slice(-8), 
    fullName: x._id,
    count: x.count,
    color: `hsl(${index * 45}, 70%, 50%)`
  })) || [];

  const pieData = [
    { name: 'Active Users', value: data?.totalUsers || 0, color: '#10b981' },
    { name: 'New Users (7d)', value: data?.newUsersLast7Days || 0, color: '#f59e0b' },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

  // Calculate trends
  const quizScore = Number(data?.averageQuizScore || 0);
  const alertViewRate = data?.totalUsers ? ((data?.alertsViewed || 0) / data.totalUsers).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-purple-700 uppercase bg-purple-100 rounded-lg">
                  Admin Analytics
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Platform Insights
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Operational signals and engagement trends at a glance
              </h1>
              <p className="text-gray-600">
                Track platform activity, new user growth, and region-level engagement from a cleaner monitoring workspace.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {data?.totalUsers || 0} Total Users
              </div>
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {data?.topRegions?.length || 0} Active Regions
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="w-3 h-3" />
                <span>+{data?.newUsersLast7Days || 0}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data?.totalUsers?.toLocaleString() || 0}</h3>
            <p className="mt-1 text-sm text-gray-500">Total Users</p>
            <p className="mt-2 text-xs text-gray-400">New users last 7 days</p>
          </div>
          
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xs text-gray-500">
                {alertViewRate} per user
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data?.alertsViewed?.toLocaleString() || 0}</h3>
            <p className="mt-1 text-sm text-gray-500">Alerts Viewed</p>
            <p className="mt-2 text-xs text-gray-400">Total alert interactions</p>
          </div>
          
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${quizScore >= 70 ? 'text-green-600' : quizScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {quizScore >= 70 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{quizScore}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{quizScore.toFixed(1)}%</h3>
            <p className="mt-1 text-sm text-gray-500">Avg Quiz Score</p>
            <p className="mt-2 text-xs text-gray-400">User preparedness knowledge</p>
          </div>
          
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data?.topRegions?.length || 0}</h3>
            <p className="mt-1 text-sm text-gray-500">Active Regions</p>
            <p className="mt-2 text-xs text-gray-400">With user engagement</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          {/* Top Regions Bar Chart */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Top Regions by Activity</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                User engagement across different regions
              </p>
            </div>
            <div className="p-6">
              {regionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'Activity Count', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        padding: '8px 12px'
                      }}
                      labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                      formatter={(value) => [`${value} activities`, 'Count']}
                      labelFormatter={(label) => `Region: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#10b981" 
                      radius={[8, 8, 0, 0]}
                      barSize={40}
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-12 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No region data available</p>
                </div>
              )}
            </div>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">User Distribution</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                New vs existing user breakdown
              </p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} users`, 'Count']}
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div className="grid gap-6 mb-8 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Engagement Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {data?.totalUsers ? ((data?.alertsViewed / data.totalUsers / 7) * 100).toFixed(1) : 0}%
            </p>
            <p className="mt-2 text-sm text-gray-500">Daily active user rate</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 rounded-full h-1.5 transition-all"
                style={{ width: `${data?.totalUsers ? ((data?.alertsViewed / data.totalUsers / 7) * 100) : 0}%` }}
              />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Growth Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {data?.totalUsers ? ((data?.newUsersLast7Days / data.totalUsers) * 100).toFixed(1) : 0}%
            </p>
            <p className="mt-2 text-sm text-gray-500">New user growth rate</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span>+{data?.newUsersLast7Days || 0} new users this week</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Quiz Performance</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {quizScore > 70 ? 'Good' : quizScore > 50 ? 'Average' : 'Needs Improvement'}
            </p>
            <p className="mt-2 text-sm text-gray-500">Average score {quizScore.toFixed(1)}%</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`rounded-full h-1.5 transition-all ${
                  quizScore >= 70 ? 'bg-green-500' : quizScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${quizScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Analytics Overview</h4>
              <p className="text-sm text-blue-800">
                Track key performance indicators to understand platform engagement. Use these insights to improve 
                content, alerts, and user education. Data updates in real-time as users interact with the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}