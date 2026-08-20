import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { VerifiedCompanyBadge } from '@/components/company/VerifiedCompanyBadge';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function CompanyProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.companyName || user?.company?.companyName || 'TechCorp Solutions');
  const [domain, setDomain] = useState(user?.domain || user?.company?.domain || 'Cloud Infrastructure');
  const [website, setWebsite] = useState(user?.website || user?.company?.website || 'https://techcorp.io');
  const [description, setDescription] = useState(
    user?.company?.description ||
    'Leading provider of cloud infrastructure automation, scalable microservices, and AI-driven devops tooling.'
  );
  const [contactPerson, setContactPerson] = useState(user?.name || user?.company?.contactPerson || 'Vikram Nair');
  const [contactEmail, setContactEmail] = useState(user?.email || user?.company?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || user?.company?.contactPhone || '');
  const [location, setLocation] = useState(user?.location || user?.company?.location || 'Pune, India');
  const [isVerified, setIsVerified] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('VERIFIED');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'companies', user.uid));
        if (docSnap.exists()) {
          const c = docSnap.data();
          if (c.companyName) setName(c.companyName);
          if (c.domain) setDomain(c.domain);
          if (c.website) setWebsite(c.website);
          if (c.description) setDescription(c.description);
          if (c.contactPerson) setContactPerson(c.contactPerson);
          if (c.contactEmail) setContactEmail(c.contactEmail);
          if (c.contactPhone) setContactPhone(c.contactPhone);
          if (c.location) setLocation(c.location);
          if (c.status) setVerificationStatus(c.status === 'ACTIVE' ? 'VERIFIED' : c.status);
        }
      } catch (err) {
        console.warn('Company profile fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
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
        companyName: name.trim(),
        domain: domain.trim(),
        website: website.trim(),
        description: description.trim(),
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim(),
        location: location.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'companies', user.uid), payload, { merge: true });
      await setDoc(doc(db, 'users', user.uid), {
        name: contactPerson.trim(),
        companyName: name.trim(),
        domain: domain.trim(),
        website: website.trim(),
        phone: contactPhone.trim(),
        location: location.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      api.updateCompany(user.uid, payload).catch(() => {});
      await refreshUser().catch(() => {});
      toast.success('Corporate partner profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save company profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Corporate Partner Profile"
        subtitle="Manage enterprise details, contact person, and institutional accreditation status"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-xs flex-shrink-0">
                {name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-slate-900">{name}</h1>
                  <VerifiedCompanyBadge isVerified={isVerified} status={verificationStatus} size="md" />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{domain}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">{location}</span>
                  {website && (
                    <>
                      <span>•</span>
                      <a href={website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        {website}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Enterprise Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<Building2 size={15} />}
                required
              />

              <Input
                label="Industry Domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                leftIcon={<Briefcase size={15} />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                leftIcon={<Globe size={15} />}
              />

              <Input
                label="Operating Headquarters / Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                leftIcon={<MapPin size={15} />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <Input
                label="Authorized Contact Person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />

              <Input
                label="Official Contact Email"
                value={contactEmail}
                disabled
                leftIcon={<Mail size={15} />}
              />

              <Input
                label="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />
            </div>

            <Textarea
              label="Company Overview & Mission"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-indigo-600 hover:bg-indigo-700"
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
