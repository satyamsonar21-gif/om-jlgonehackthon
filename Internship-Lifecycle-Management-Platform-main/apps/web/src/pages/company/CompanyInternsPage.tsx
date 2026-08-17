import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Plus, User, Send, ChevronRight, CheckCircle2, Building2 } from 'lucide-react';

export default function CompanyInternsPage() {
  const interns = [
    { id: 1, name: 'Rahul Sharma', roll: '20CS101', role: 'Frontend Developer', attendance: 92, tasks: '4 / 5', lastLog: 'Today, 04:30 PM', reports: '4 Approved' },
    { id: 2, name: 'Priya Patel', roll: '20CS102', role: 'UI/UX Designer', attendance: 88, tasks: '3 / 4', lastLog: 'Today, 02:15 PM', reports: '4 Approved' },
    { id: 3, name: 'Amit Kumar', roll: '20CS105', role: 'Backend Developer', attendance: 95, tasks: '6 / 6', lastLog: 'Today, 05:00 PM', reports: '3 Approved' },
    { id: 4, name: 'Sneha Gupta', roll: '20CS106', role: 'Data Analyst', attendance: 89, tasks: '2 / 4', lastLog: 'Yesterday', reports: '5 Approved' },
    { id: 5, name: 'Vikram Singh', roll: '20CS103', role: 'DevOps Intern', attendance: 75, tasks: '2 / 5', lastLog: '2 days ago', reports: '2 Approved' },
  ];

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Active Supervised Interns" subtitle="5 interns currently deployed on TechCorp project teams" />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Deployed Interns Roster</h3>
            <span className="text-xs font-mono text-slate-400">Term Terminus: Sep 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Assigned Track</th>
                  <th className="pb-3 font-semibold">Attendance</th>
                  <th className="pb-3 font-semibold">Task Progress</th>
                  <th className="pb-3 font-semibold">Last Log</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] font-bold flex items-center justify-center border border-sky-200">
                          {intern.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{intern.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{intern.roll}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600 font-medium">{intern.role}</td>
                    <td className="py-4 font-mono font-bold text-emerald-700">{intern.attendance}%</td>
                    <td className="py-4 font-mono text-slate-700">{intern.tasks} Completed</td>
                    <td className="py-4 text-slate-500 font-mono">{intern.lastLog}</td>
                    <td className="py-4 text-right">
                      <Link 
                        to={`/company/interns/${intern.id}`} 
                        className="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>Inspect</span>
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
