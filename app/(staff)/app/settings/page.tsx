'use client';

import React from 'react';
import { PageContainer, PageSection } from '@/app/components/layout/PageContainer';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useAuth } from '@/app/context/AuthContext';

export default function StaffSettingsPage() {
  const { user } = useAuth();

  return (
    <PageContainer
      title="Settings"
      description="View your profile and update your password"
    >
      {/* Profile Section */}
      <PageSection title="Profile Information">
        <Card>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-semibold text-slate-600">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-sm text-slate-500 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700 capitalize">
                  {user?.role}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">
              Contact an administrator if you need to update your profile information.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <p className="px-3 py-2 bg-slate-50 rounded-md text-slate-900">
                  {user?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <p className="px-3 py-2 bg-slate-50 rounded-md text-slate-900">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <p className="px-3 py-2 bg-slate-50 rounded-md text-slate-900 capitalize">
                  {user?.role}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <p className="px-3 py-2 bg-slate-50 rounded-md text-slate-900 capitalize">
                  {user?.status}
                </p>
              </div>
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
              helperText="Password must be at least 8 characters"
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

      {/* Preferences */}
      <PageSection title="Preferences">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-500">
                  Receive email updates when your orders are processed
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Order Status Updates</p>
                <p className="text-sm text-slate-500">
                  Get notified when order status changes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
          </div>
        </Card>
      </PageSection>
    </PageContainer>
  );
}

