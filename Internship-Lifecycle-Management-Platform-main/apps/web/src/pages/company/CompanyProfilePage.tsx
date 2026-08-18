import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Building2, Mail, Phone, MapPin, Globe, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanyProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [companyName, setCompanyName] = useState('TechCorp Solutions Pvt. Ltd.');
  const [mentorName, setMentorName] = useState('Siddharth Nambiar');
  const [email, setEmail] = useState('siddharth@techcorp.com');
  const [phone, setPhone] = useState('+91 80 4123 4567');
  const [website, setWebsite] = useState('https://techcorp.com');
  const [address, setAddress] = useState('Tech Park, Outer Ring Road, Bangalore, KA - 560103');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Company profile updated successfully!');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Company Profile"
        subtitle="Manage organization details, primary mentor contact, and university MoU status"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                TC
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{companyName}</h1>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Lead Supervisor: {mentorName} · MoU Active (2025–2028)
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success" size="sm">Accredited Partner</Badge>
                  <span className="text-xs font-mono font-bold text-slate-700">16 Supervised Interns</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building2 size={15} />}
                required
              />

              <Input
                label="Lead Mentor / Supervisor"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
                required
              />

              <Input
                label="Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                leftIcon={<Globe size={15} />}
              />

              <Input
                label="Office Location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                leftIcon={<MapPin size={15} />}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="bg-indigo-600 hover:bg-indigo-700" leftIcon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
