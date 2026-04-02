import React, { useState } from 'react';
import { Brain, TrendingUp, Activity, Zap, Target, Award, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function BehavioralEngine() {
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Brain className="text-purple-500" size={32} />
            Behavioral Engine
          </h1>
          <p className="text-slate-400 mt-2">Learning your routines, optimizing your workflow, and providing positive reinforcement.</p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
          {['insights', 'routines', 'rewards'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" size={20} />
                Productivity Patterns
              </h3>
              <div className="h-48 flex items-end gap-2">
                {[40, 65, 80, 45, 90, 75, 60].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative group">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000"
                      style={{ height: `${h}%` }}
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded font-bold transition-opacity">
                      {h}% Focus
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Peak Performance Time</h3>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-amber-500/20 rounded-xl">
                    <Clock className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">10:00 AM</div>
                    <div className="text-xs text-amber-400 font-bold">High Cognitive Load</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Task Completion Rate</h3>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500/20 rounded-xl">
                    <Target className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">87%</div>
                    <div className="text-xs text-emerald-400 font-bold">+12% this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-purple-400" size={20} />
                AI Behavioral Teaching
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "I noticed you tend to schedule deep work sessions right after lunch, but your focus metrics are 30% lower during that time. Let's try moving those to your peak time at 10:00 AM tomorrow."
                  </p>
                  <button className="mt-4 w-full py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                    Optimize Schedule
                  </button>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "You've been checking emails 14 times a day. Batching this into 3 specific times could save you approximately 4.5 hours this week."
                  </p>
                  <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                    Set Email Boundaries
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'routines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Learned Routines</h3>
            <div className="space-y-4">
              {[
                { time: '08:30 AM', task: 'Morning Triage', context: 'Reviewing overnight high-priority items.' },
                { time: '11:00 AM', task: 'Team Sync', context: 'Usually followed by 3-4 action item creations.' },
                { time: '04:00 PM', task: 'Deep Work', context: 'Uninterrupted focus time for strategic planning.' }
              ].map((routine, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/5">
                  <div className="text-sm font-black text-blue-400 w-20 shrink-0">{routine.time}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{routine.task}</div>
                    <div className="text-xs text-slate-400 mt-1">{routine.context}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Suggested Automations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
                <h4 className="font-bold text-emerald-400 text-sm mb-2">Automate Morning Triage</h4>
                <p className="text-xs text-slate-300 mb-4">I can automatically categorize and prioritize overnight emails and Slack messages before you log in.</p>
                <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-colors">
                  Enable Automation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-8 text-center">
            <Award className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">Current Streak: 12 Days</h2>
            <p className="text-amber-200/80 max-w-lg mx-auto">You've consistently hit your top 3 daily priorities. This is your longest streak this quarter!</p>
          </div>
          
          {[
            { title: 'Inbox Zero Hero', desc: 'Cleared all high-priority messages before noon.', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
            { title: 'Deep Work Master', desc: 'Completed 4 hours of uninterrupted focus time.', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/20' },
            { title: 'Delegation Pro', desc: 'Successfully assigned 5 tasks to the right team members.', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
          ].map((badge, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full ${badge.bg} flex items-center justify-center mb-4`}>
                <badge.icon className={`w-8 h-8 ${badge.color}`} />
              </div>
              <h3 className="font-bold text-white mb-2">{badge.title}</h3>
              <p className="text-xs text-slate-400">{badge.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
