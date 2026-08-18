import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, GraduationCap, Globe, ExternalLink, Save, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@college.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [bio, setBio] = useState('3rd Year Computer Science student passionate about distributed systems, React, and cloud microservices.');
  const [github, setGithub] = useState('https://github.com/priyasharma');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/priyasharma');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile dossier updated successfully!');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Student Profile"
        subtitle="Manage academic profile details, verified skill tags, and contact information"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar name="Priya Sharma" size="xl" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Roll: 20CS101 · Dept. of Computer Science & Engineering
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success" size="sm">Active Intern</Badge>
                  <span className="text-xs font-mono font-bold text-slate-700">CGPA: 8.9</span>
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
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />

              <Input
                label="Department & Specialization"
                defaultValue="Computer Science & Engineering (Tier-1)"
                disabled
                leftIcon={<GraduationCap size={15} />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub Profile URL"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                leftIcon={<Globe size={15} />}
              />

              <Input
                label="LinkedIn Profile URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                leftIcon={<Globe size={15} />}
              />
            </div>

            <Textarea
              label="Bio / Technical Statement"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" leftIcon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
