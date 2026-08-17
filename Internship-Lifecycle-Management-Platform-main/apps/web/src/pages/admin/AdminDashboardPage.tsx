import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { 
  Users, 
  Building2, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Server, 
  Database, 
  Mail, 
  ShieldCheck,
  Shield,
  FileCheck
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Enrolled Students', value: '1,284', icon: Users, change: '+12%', up: true, desc: 'Across 6 Engineering branches' },
    { label: 'Active Internships', value: '386', icon: Building2, change: '+5%', up: true, desc: 'Verified MoU partner programs' },
    { label: 'Partner Companies', value: '142', icon: Activity, change: '+8%', up: true, desc: '12 added this semester' },
    { label: 'Verified Certificates', value: '923', icon: Award, change: '+18%', up: true, desc: 'Cryptographically issued' },
  ];

  const activities = [
    { id: 1, text: 'Priya Sharma submitted Week 4 Synthesis Report for TechCorp', time: '10 mins ago', type: 'report' },
    { id: 2, text: 'TechCorp Solutions approved 5 new full-time conversion offers', time: '1 hour ago', type: 'offer' },
    { id: 3, text: 'Dr. Rajesh Kumar conducted midterm audit for 18 CSE students', time: '2 hours ago', type: 'faculty' },
    { id: 4, text: 'Institutional database automated backup completed successfully', time: '4 hours ago', type: 'system' },
    { id: 5, text: 'New Tamper-Proof Certificate issued to Amit Kumar (CERT-2026-089)', time: '5 hours ago', type: 'cert' },
  ];

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="Institution Governance Control" subtitle="University System Administrator Oversight" />
      
      <motion.main 
        className="max-w-7xl mx-auto p-6 md:p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Hero Banner */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border shadow-md p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)'
          }}
        >
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 border"
              style={{
                backgroundColor: 'var(--badge-bg, rgba(224, 170, 255, 0.2))',
                borderColor: 'var(--border)',
                color: 'var(--highlights)'
              }}
            >
              <Shield size={13} />
              MASTER AUDIT NODE ACTIVE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              Campus-Wide Internship Governance
            </h1>
            <p className="text-xs mt-1 max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Monitor institutional compliance, verify cryptographic credentials, and manage multi-department academic partnerships.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/admin/certificates"
              className="px-5 py-3 rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 hover:scale-105"
              style={{
                backgroundColor: 'var(--cta)',
                color: 'var(--cta-text)'
              }}
            >
              <Award size={15} />
              <span>Issue Certificates</span>
            </Link>
          </div>
        </motion.div>

        {/* 4 Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl border shadow-sm space-y-3"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--highlights)' }}
                >
                  <stat.icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>
                {stat.value}
              </div>
              <span className="text-[11px] font-mono block" style={{ color: 'var(--text-muted)' }}>
                {stat.desc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Live Event Ledger Feed */}
        <motion.div 
          variants={itemVariants} 
          className="rounded-2xl border shadow-sm p-6 space-y-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Live Institutional Event Ledger</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Real-time tamper-proof audit trail</p>
            </div>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--highlights)' }}>
              ● Stream Active
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {activities.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0"
                    style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--highlights)' }}
                  >
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>{item.text}</span>
                </div>
                <span className="font-mono text-[11px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
