import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, BookOpen, Save, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function FacultyProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || user?.displayName || 'Faculty Member');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.faculty?.phone || '');
  const [department, setDepartment] = useState(user?.department || user?.faculty?.department || 'Computer Science & Engineering');
  const [designation, setDesignation] = useState(user?.designation || user?.faculty?.designation || 'Associate Professor & Guide');
  const [facultyId, setFacultyId] = useState(user?.faculty?.facultyId || user?.faculty?.employeeId || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || user?.faculty?.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadFacultyProfile = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'faculty', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) setName(data.name);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
          if (data.department) setDepartment(data.department);
          if (data.designation) setDesignation(data.designation);
          if (data.facultyId || data.employeeId) setFacultyId(data.facultyId || data.employeeId);
          if (data.collegeName) setCollegeName(data.collegeName);
        }
      } catch (err) {
        console.warn('Faculty profile load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFacultyProfile();
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
        department: department.trim(),
        designation: designation.trim(),
        facultyId: facultyId.trim(),
        collegeName: collegeName.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'faculty', user.uid), payload, { merge: true });
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await refreshUser().catch(() => {});
      toast.success('Faculty profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update faculty profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Faculty Profile"
        subtitle="Manage academic credentials, department affiliations, and contact information"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar name={name} size="xl" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Dept. of {department} · {collegeName}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success" size="sm">Academic Guide</Badge>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    ID: {facultyId || 'FAC-GUIDE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={15} />}
                required
              />

              <Input
                label="University Email"
                value={email}
                disabled
                leftIcon={<Mail size={15} />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
                placeholder="e.g. +91 98765 43210"
              />

              <Input
                label="Faculty Employee ID / Code"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                leftIcon={<BookOpen size={15} />}
                placeholder="e.g. FAC-CSE-102"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                leftIcon={<BookOpen size={15} />}
                required
              />

              <Input
                label="Academic Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                leftIcon={<BookOpen size={15} />}
                required
              />
            </div>

            <Input
              label="College / Institute Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              leftIcon={<Building size={15} />}
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700"
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
