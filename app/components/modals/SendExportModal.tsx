'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { toast } from 'react-hot-toast';

interface SendExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    userId: string;
    groupOrderNumber: string;
}

export function SendExportModal({ isOpen, onClose, orderId, userId, groupOrderNumber }: SendExportModalProps) {
    const [emails, setEmails] = useState<any[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [format, setFormat] = useState<'excel' | 'csv'>('excel');
    const [loading, setLoading] = useState(false);
    const [fetchingEmails, setFetchingEmails] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchEmails();
        }
    }, [isOpen]);

    const fetchEmails = async () => {
        setFetchingEmails(true);
        try {
            // Staff can fetch emails too, but we need a way to authorize it.
            // For now, we'll use a slightly different API or allow staff to see this.
            const response = await fetch(`/api/admin/emails?adminId=${userId}`);
            // If the above fails because of role check, we might need to adjust the API.
            // Let's assume for now we'll allow staff to fetch valid emails too.
            const data = await response.json();
            if (response.ok) {
                setEmails(data.emails || []);
            } else {
                // If unauthorized as admin, maybe try a staff-friendly endpoint
                const staffResponse = await fetch(`/api/emails?userId=${userId}`);
                const staffData = await staffResponse.json();
                setEmails(staffData.emails || []);
            }
        } catch (error) {
            console.error('Fetch emails error:', error);
        } finally {
            setFetchingEmails(false);
        }
    };

    const handleSend = async () => {
        if (selectedEmails.length === 0) {
            toast.error('Please select at least one email');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/orders/${orderId}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emails: selectedEmails,
                    message,
                    format,
                    userId
                }),
            });

            if (!response.ok) throw new Error('Failed to send export');

            toast.success('Export sent successfully!');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to send export');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Send Export - {groupOrderNumber}</h2>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Select Recipients</label>
                    <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 p-2">
                        {fetchingEmails ? (
                            <p className="text-sm text-slate-500">Loading emails...</p>
                        ) : emails.length === 0 ? (
                            <p className="text-sm text-slate-500">No valid emails configured.</p>
                        ) : (
                            emails.map((e) => (
                                <div key={e.id} className="flex items-center gap-2 py-1">
                                    <input
                                        type="checkbox"
                                        id={e.id}
                                        checked={selectedEmails.includes(e.email)}
                                        onChange={(ev) => {
                                            if (ev.target.checked) {
                                                setSelectedEmails([...selectedEmails, e.email]);
                                            } else {
                                                setSelectedEmails(selectedEmails.filter(email => email !== e.email));
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <label htmlFor={e.id} className="text-sm text-slate-700">
                                        {e.name ? `${e.name} (${e.email})` : e.email}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Format</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="excel"
                                checked={format === 'excel'}
                                onChange={() => setFormat('excel')}
                                className="text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-sm text-slate-700">Excel</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="csv"
                                checked={format === 'csv'}
                                onChange={() => setFormat('csv')}
                                className="text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-sm text-slate-700">CSV</span>
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Message (Optional)</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a message to the email..."
                        className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} isLoading={loading} disabled={loading || selectedEmails.length === 0}>
                        Send Export
                    </Button>
                </div>
            </Card>
        </div>
    );
}
