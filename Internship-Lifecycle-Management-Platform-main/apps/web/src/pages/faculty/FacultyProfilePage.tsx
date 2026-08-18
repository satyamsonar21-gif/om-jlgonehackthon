import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { User, Mail, Phone, BookOpen, Save, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [name, setName] = useState('Dr. Rajesh Kumar');
  const [email, setEmail] = useState('rajesh.kumar@university.edu');
  const [phone, setPhone] = useState('+91 98111 22334');
  const [designation, setDesignation] = useState('Associate Professor & Academic Internship Coordinator');
  const [office, setOffice] = useState('Academic Block B, Room 402');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Faculty profile updated successfully!');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Faculty Profile"
        subtitle="Manage academic credentials, office hours, and department contact information"
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
                  Dept. of Computer Science & Engineering · University Guide
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success" size="sm">Active Supervisor</Badge>
                  <span className="text-xs font-mono font-bold text-slate-700">42 Supervised Cohort</span>
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
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />

              <Input
                label="Designation & Role"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                leftIcon={<BookOpen size={15} />}
              />
            </div>

            <Input
              label="Office Location & Consultation Hours"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              placeholder="e.g. Block B, Room 402 (Mon, Wed 2-4 PM)"
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-700" leftIcon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
