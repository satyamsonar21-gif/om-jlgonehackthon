import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Shield, Mail, Phone, Lock, Save, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [name, setName] = useState('Super Administrator');
  const [email, setEmail] = useState('admin.root@institution.edu');
  const [phone, setPhone] = useState('+91 80 2299 0001');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Administrator profile updated successfully!');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Administrator Profile"
        subtitle="Institutional governance credentials and security authorization level"
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
                  Institutional Master Governance · Full System Authority
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="info" size="sm">Master Root Key Authorized</Badge>
                  <span className="text-xs font-mono font-bold text-slate-700">Audit Level 4</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Administrator Account Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<Shield size={15} />}
                required
              />

              <Input
                label="Institutional Governance Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Emergency Hotline Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />

              <Input
                label="Master Signing Key Hash"
                defaultValue="ed25519:9f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"
                disabled
                leftIcon={<Key size={15} />}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="bg-sky-600 hover:bg-sky-700" leftIcon={<Save size={14} />}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
