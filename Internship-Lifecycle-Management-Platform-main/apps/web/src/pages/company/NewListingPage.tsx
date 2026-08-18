import React, { useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ArrowLeft, Plus, Briefcase, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NewListingPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const navigate = useNavigate();

  const [roleTitle, setRoleTitle] = useState('');
  const [domain, setDomain] = useState('Software');
  const [type, setType] = useState('Hybrid');
  const [stipend, setStipend] = useState('₹20,000/mo');
  const [duration, setDuration] = useState('12 weeks');
  const [openings, setOpenings] = useState('4');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('React, TypeScript, Go, PostgreSQL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    toast.success(`Internship listing "${roleTitle}" created and submitted for university approval!`);
    navigate('/company/listings');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Post New Internship Listing"
        subtitle="Create verified internship opportunity for accredited university students"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <Link
            to="/company/listings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Listings</span>
          </Link>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Role Title / Specialization"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Full Stack Cloud Developer"
                required
              />

              <Select
                label="Domain Track"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                options={[
                  { label: 'Software & Web Development', value: 'Software' },
                  { label: 'Data Science & Generative AI', value: 'Data & AI' },
                  { label: 'Cloud Infrastructure & DevOps', value: 'Cloud & DevOps' },
                  { label: 'Cyber Security & Systems', value: 'Security' },
                  { label: 'UI/UX Product Design', value: 'Design' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Work Mode"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { label: 'Hybrid (Bangalore)', value: 'Hybrid' },
                  { label: 'Remote', value: 'Remote' },
                  { label: 'On-site (Bangalore Campus)', value: 'On-site' },
                ]}
              />

              <Input
                label="Monthly Stipend"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. ₹20,000/mo"
                required
              />

              <Input
                label="Openings (Seats)"
                type="number"
                min="1"
                max="20"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                required
              />
            </div>

            <Input
              label="Required Skills (Comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
              required
            />

            <Textarea
              label="Role Overview & Key Responsibilities"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the sprint deliverables, team structure, and project objectives..."
              required
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Link to="/company/listings">
                <Button variant="secondary" size="md">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md" className="bg-indigo-600 hover:bg-indigo-700" leftIcon={<Save size={14} />}>
                Post Listing
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
