import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Shield, Mail, Phone, Save, Building, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || user?.displayName || 'Administrator');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.admin?.phone || '');
  const [roleTier, setRoleTier] = useState(user?.roleTier || user?.admin?.roleTier || 'TNP_ADMIN');
  const [department, setDepartment] = useState(user?.department || user?.admin?.department || 'Training & Placement Cell');
  const [designation, setDesignation] = useState(user?.designation || user?.admin?.designation || 'Head of T&P / Governance');
  const [collegeName, setCollegeName] = useState(user?.collegeName || user?.admin?.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'admins', user.uid));
        if (docSnap.exists()) {
          const a = docSnap.data();
          if (a.name) setName(a.name);
          if (a.email) setEmail(a.email);
          if (a.phone) setPhone(a.phone);
          if (a.roleTier) setRoleTier(a.roleTier);
          if (a.department) setDepartment(a.department);
          if (a.designation) setDesignation(a.designation);
          if (a.collegeName) setCollegeName(a.collegeName);
        }
      } catch (err) {
        console.warn('Admin profile fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user?.uid]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error('User session not found.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        uid: user.uid,
        userId: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        roleTier,
        department: department.trim(),
        designation: designation.trim(),
        collegeName: collegeName.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'admins', user.uid), payload, { merge: true });
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await refreshUser().catch(() => {});
      toast.success('Administrator profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update administrator profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Administrator Profile"
        subtitle="Institutional governance credentials and security authorization clearance"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                <Shield size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {department} · {collegeName}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="info" size="sm">Clearance Tier: {roleTier}</Badge>
                  <span className="text-xs font-mono font-bold text-slate-700">Governance Clearance</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Administrator Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<Shield size={15} />}
                required
              />

              <Input
                label="Official Governance Email"
                value={email}
                disabled
                leftIcon={<Mail size={15} />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Contact Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
                placeholder="e.g. +91 80 2299 0001"
              />

              <Input
                label="Department / Unit"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                leftIcon={<Building size={15} />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Administrative Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />

              <Input
                label="Governance Institution"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-sky-600 hover:bg-sky-700"
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
