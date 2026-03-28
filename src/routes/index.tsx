import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

// Inline SVG icons to avoid dependency issues
const Icons = {
  LayoutDashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  CheckCircle2: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>,
  BarChart3: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Rocket: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
}

export const Route = createFileRoute('/')({
  component: Home,
})

// Mock data for the dashboard
const stats = [
  { label: 'Active Projects', value: 12, change: '+3', icon: Icons.Target, status: 'on-track' },
  { label: 'Team Velocity', value: '94%', change: '+8%', icon: Icons.TrendingUp, status: 'completed' },
  { label: 'Tasks Done', value: 156, change: '+24', icon: Icons.CheckCircle2, status: 'completed' },
  { label: 'Pending Review', value: 8, change: '-2', icon: Icons.Clock, status: 'attention' },
]

const initiatives = [
  { id: 1, name: 'Q1 Strategy Rollout', progress: 78, status: 'on-track', due: 'Mar 30' },
  { id: 2, name: 'Team Expansion', progress: 45, status: 'attention', due: 'Apr 15' },
  { id: 3, name: 'Process Automation', progress: 92, status: 'completed', due: 'Mar 25' },
  { id: 4, name: 'Customer Migration', progress: 23, status: 'delayed', due: 'May 1' },
]

const recentActivity = [
  { id: 1, action: 'Project milestone completed', target: 'API Integration', time: '2h ago', type: 'success' },
  { id: 2, action: 'New team member joined', target: 'Sarah Chen', time: '4h ago', type: 'info' },
  { id: 3, action: 'Budget alert triggered', target: 'Marketing Q1', time: '6h ago', type: 'warning' },
  { id: 4, action: 'Report generated', target: 'Weekly Summary', time: '8h ago', type: 'info' },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-500'
    case 'on-track': return 'bg-amber-500'
    case 'attention': return 'bg-orange-500'
    case 'delayed': return 'bg-purple-500'
    case 'blocked': return 'bg-rose-500'
    default: return 'bg-gray-400'
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'on-track': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    case 'attention': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    case 'delayed': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  if (h < 21) return 'evening'
  return 'night'
}

function Home() {
  const [mounted, setMounted] = useState(false)
  const timeOfDay = getTimeOfDay()
  
  const greetings = {
    morning: { text: 'Good morning', subtext: 'Your command center is ready for the day ahead.' },
    afternoon: { text: 'Good afternoon', subtext: 'Stay focused. Here\'s your operational pulse.' },
    evening: { text: 'Good evening', subtext: 'Wrapping up the day. Here\'s where things stand.' },
    night: { text: 'Good evening', subtext: 'The engine continues monitoring while you rest.' }
  }
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Icons.LayoutDashboard />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Martin OS
                </h1>
                <p className="text-xs text-slate-500">Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/react"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Icons.Rocket />
                React Setup
              </Link>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
                <Icons.Bell />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Icons.Settings />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium text-sm">
                ME
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Greeting */}
        <div className={`mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {greetings[timeOfDay].text},
            </h1>
            <span className="text-3xl font-light text-slate-500">Martin</span>
          </div>
          <p className="text-slate-500">{greetings[timeOfDay].subtext}</p>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <stat.icon />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {stat.change.startsWith('+') ? '+' : ''}{stat.change}
                  <Icons.ArrowRight />
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(stat.status)}`} />
                <span className="text-xs text-slate-400 capitalize">{stat.status.replace('-', ' ')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Initiatives Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Icons.Zap />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Active Initiatives</h2>
                    <p className="text-sm text-slate-500">4 projects in progress</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors text-sm">
                  View All
                  <Icons.ArrowRight />
                </button>
              </div>
              
              <div className="space-y-4">
                {initiatives.map((initiative) => (
                  <div key={initiative.id} className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-slate-900">{initiative.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadgeColor(initiative.status)} capitalize`}>
                          {initiative.status.replace('-', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">{initiative.due}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                          style={{ width: `${initiative.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900 w-10 text-right">{initiative.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Icons.Sparkles />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Icons.Target, label: 'New Project', color: 'blue' },
                  { icon: Icons.Users, label: 'Add Member', color: 'amber' },
                  { icon: Icons.BarChart3, label: 'Reports', color: 'indigo' },
                  { icon: Icons.Activity, label: 'Analytics', color: 'emerald' },
                ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
                    <div className={`p-3 rounded-lg bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                      <action.icon />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <Icons.Activity />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 group cursor-pointer">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.type === 'success' ? 'bg-emerald-500' :
                      activity.type === 'warning' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.target}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Score */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Icons.BarChart3 />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">System Health</h2>
              </div>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${0.87 * 264} 264`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">87</span>
                    <span className="text-xs text-slate-500">Score</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-slate-500">
                All systems operational
              </p>
            </div>

            {/* AI Assistant Card */}
            <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <Icons.Sparkles />
                </div>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <p className="text-sm text-white/70 mb-4">
                I can help you analyze data, generate reports, or answer questions about your projects.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium flex items-center justify-center gap-2">
                <Icons.Zap />
                Ask anything
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
