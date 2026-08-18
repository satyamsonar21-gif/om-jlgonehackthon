import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox } from '@/components/ui/Input';
import { Settings, Shield, Lock, Save, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [termName, setTermName] = useState('Academic Term Fall 2026');
  const [minAttendance, setMinAttendance] = useState('75');
  const [autoFlagAtRisk, setAutoFlagAtRisk] = useState(true);
  const [requireFacultyNOC, setRequireFacultyNOC] = useState(true);
  const [certKeyRotation, setCertKeyRotation] = useState('Annual');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Institutional compliance settings updated successfully!');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="System Governance Settings"
        subtitle="Configure institutional compliance rules, term parameters, and cryptographic keys"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Academic Term Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Active Term Name"
                  value={termName}
                  onChange={(e) => setTermName(e.target.value)}
                  required
                />

                <Input
                  label="Minimum Mandatory Attendance (%)"
                  type="number"
                  min="50"
                  max="100"
                  value={minAttendance}
                  onChange={(e) => setMinAttendance(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Automated Compliance Rules
              </h3>

              <Checkbox
                label="Automatically flag students on supervisor watchlist when attendance drops below threshold"
                checked={autoFlagAtRisk}
                onChange={(e) => setAutoFlagAtRisk(e.target.checked)}
              />

              <Checkbox
                label="Require verified Faculty Guide NOC before issuing candidate selection letters"
                checked={requireFacultyNOC}
                onChange={(e) => setRequireFacultyNOC(e.target.checked)}
              />
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Cryptographic Key & Security
              </h3>

              <Select
                label="Ed25519 Certificate Signing Key Rotation Schedule"
                value={certKeyRotation}
                onChange={(e) => setCertKeyRotation(e.target.value)}
                options={[
                  { label: 'Annual (Academic Year End)', value: 'Annual' },
                  { label: 'Per Semester', value: 'Semester' },
                  { label: 'Manual Key Rotation Only', value: 'Manual' },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="bg-sky-600 hover:bg-sky-700" leftIcon={<Save size={14} />}>
                Save Institutional Settings
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
