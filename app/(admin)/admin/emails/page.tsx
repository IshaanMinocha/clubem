'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { PlusIcon, TrashIcon } from '@/app/components/icons';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function AdminEmailsPage() {
    const { user } = useAuth();
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchEmails();
        }
    }, [user?.id]);

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/emails?adminId=${user?.id}`);
            const data = await response.json();
            if (response.ok) {
                setEmails(data.emails || []);
            } else {
                toast.error(data.error || 'Failed to fetch emails');
            }
        } catch (error) {
            console.error('Fetch emails error:', error);
            toast.error('An error occurred while fetching emails');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;

        try {
            const response = await fetch('/api/admin/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    name: newName,
                    adminId: user?.id
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Email added successfully');
                setNewEmail('');
                setNewName('');
                setIsAdding(false);
                fetchEmails();
            } else {
                toast.error(data.error || 'Failed to add email');
            }
        } catch (error) {
            console.error('Add email error:', error);
            toast.error('An error occurred while adding email');
        }
    };

    const handleDeleteEmail = async (id: string) => {
        if (!confirm('Are you sure you want to delete this email?')) return;

        try {
            const response = await fetch(`/api/admin/emails/${id}?adminId=${user?.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Email deleted successfully');
                fetchEmails();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete email');
            }
        } catch (error) {
            console.error('Delete email error:', error);
            toast.error('An error occurred while deleting email');
        }
    };

    return (
        <PageContainer
            title="Email Configuration"
            description="Manage valid emails for order exports"
            action={
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                    {isAdding ? 'Cancel' : 'Add Email'}
                </Button>
            }
        >
            {isAdding && (
                <Card className="mb-6">
                    <form onSubmit={handleAddEmail} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                placeholder="example@domain.com"
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name (Optional)</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                placeholder="Recipient Name"
                            />
                        </div>
                        <Button type="submit">Save Email</Button>
                    </form>
                </Card>
            )}

            <Card>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                    </div>
                ) : emails.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        No emails configured yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 font-semibold text-slate-900">Name</th>
                                    <th className="pb-3 font-semibold text-slate-900">Email</th>
                                    <th className="pb-3 font-semibold text-slate-900 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.map((email) => (
                                    <tr key={email.id} className="border-b border-slate-50 last:border-0">
                                        <td className="py-3 text-slate-700">{email.name || '—'}</td>
                                        <td className="py-3 text-slate-700">{email.email}</td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => handleDeleteEmail(email.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </PageContainer>
    );
}
