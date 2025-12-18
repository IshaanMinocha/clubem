'use client';

import React, { useState } from 'react';
import { PageContainer, PageSection } from '@/app/components/layout/PageContainer';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    senderEmail: 'orders@clubem.com',
    senderName: 'Clubem Orders',
    replyTo: 'support@clubem.com',
  });
  const [generalSettings, setGeneralSettings] = useState({
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    autoSend: false,
  });

  const handleSaveEmail = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    alert('Email settings saved!');
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    alert('General settings saved!');
  };

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  return (
    <PageContainer
      title="Settings"
      description="Configure system preferences and options"
    >
      {/* Profile Section */}
      <PageSection title="Profile Information">
        <Card>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-semibold text-slate-600">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-sm text-slate-500 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 capitalize">
                  {user?.role}
                </span>
              </p>
            </div>
          </div>
        </Card>
      </PageSection>

      {/* Change Password */}
      <PageSection title="Change Password">
        <Card>
          <div className="max-w-md space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
            />
            <Button>Update Password</Button>
          </div>
        </Card>
      </PageSection>

      {/* Email Settings */}
      <PageSection title="Email Settings">
        <Card>
          <div className="max-w-md space-y-4">
            <Input
              label="Sender Email"
              type="email"
              value={emailSettings.senderEmail}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
            />
            <Input
              label="Sender Name"
              value={emailSettings.senderName}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, senderName: e.target.value }))}
            />
            <Input
              label="Reply-To Email"
              type="email"
              value={emailSettings.replyTo}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, replyTo: e.target.value }))}
            />
            <Button onClick={handleSaveEmail} isLoading={isSaving}>
              Save Email Settings
            </Button>
          </div>
        </Card>
      </PageSection>

      {/* General Settings */}
      <PageSection title="General Settings">
        <Card>
          <div className="max-w-md space-y-4">
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
            />
            <Select
              label="Date Format"
              options={dateFormatOptions}
              value={generalSettings.dateFormat}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSend"
                checked={generalSettings.autoSend}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoSend: e.target.checked }))}
                className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
              />
              <label htmlFor="autoSend" className="text-sm text-slate-700">
                Auto-send orders when processing completes
              </label>
            </div>
            <Button onClick={handleSaveGeneral} isLoading={isSaving}>
              Save General Settings
            </Button>
          </div>
        </Card>
      </PageSection>

      {/* Danger Zone */}
      <PageSection title="Danger Zone">
        <Card className="border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Clear All Data</h4>
              <p className="text-sm text-slate-500">
                This will permanently delete all orders and uploads. This action cannot be undone.
              </p>
            </div>
            <Button variant="danger">
              Clear Data
            </Button>
          </div>
        </Card>
      </PageSection>
    </PageContainer>
  );
}

