'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { Button } from '@/app/components/ui/Button';
import { RefreshIcon } from '@/app/components/icons';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function MyUploadsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (!user?.id) return;
    if (showLoading) setLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await fetch(`/api/orders?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch uploads');
      const data = await response.json();

      // Flatten orders into individual PDFs
      const flattenedPdfs: any[] = [];
      (data.orders || []).forEach((order: any) => {
        const files = (order.data as any)?.originalFiles || [];
        if (files.length > 0) {
          files.forEach((filename: string) => {
            flattenedPdfs.push({
              id: `${order.id}-${filename}`,
              orderId: order.id,
              filename,
              platform: order.platform,
              status: order.status,
              manuallyEdited: order.manuallyEdited,
              createdAt: order.createdAt,
              orderData: order.data
            });
          });
        } else {
          // Fallback if no files listed
          flattenedPdfs.push({
            id: order.id,
            orderId: order.id,
            filename: 'Unknown PDF',
            platform: order.platform,
            status: order.status,
            manuallyEdited: order.manuallyEdited,
            createdAt: order.createdAt,
            orderData: order.data
          });
        }
      });

      setOrders(flattenedPdfs);
    } catch (error: any) {
      console.error('Fetch uploads error:', error);
      toast.error(error.message || 'Failed to load uploads');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(pdf => {
    const matchesSearch =
      pdf.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.platform?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || pdf.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'filename',
      header: 'PDF Filename',
      render: (pdf: any) => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-50 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">{pdf.filename}</span>
        </div>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      render: (pdf: any) => (
        <span className="text-slate-600">{pdf.platform?.name}</span>
      ),
    },
    {
      key: 'groupState',
      header: 'Group State',
      render: (pdf: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Process:</span>
            {pdf.manuallyEdited ? (
              <Badge variant="warning">Manual</Badge>
            ) : (
              <Badge variant="info">Auto</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Final:</span>
            {pdf.status === 'CONFIRMED' ? (
              <Badge variant="success">Confirmed</Badge>
            ) : (
              <Badge variant="default">Pending</Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'uploadedAt',
      header: 'Upload Date',
      render: (pdf: any) => (
        <span className="text-slate-600">
          {new Date(pdf.createdAt).toLocaleDateString()} {new Date(pdf.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (pdf: any) => (
        <Badge variant={getStatusBadgeVariant(pdf.status)}>
          {formatStatus(pdf.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (pdf: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/app/orders/${pdf.orderId}`)}
        >
          View Order
        </Button>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'NEEDS_MANUAL_REVIEW', label: 'Needs Review' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'FAILED', label: 'Failed' },
  ];

  return (
    <PageContainer
      title="My Uploads"
      description="View and track your uploaded PDF files and their processing state"
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchOrders(false)}
          disabled={isRefreshing}
          leftIcon={<RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by file name or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <TableCard>
        <Table
          columns={columns}
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          emptyMessage={loading ? 'Loading uploads...' : 'No uploads found'}
        />
      </TableCard>
    </PageContainer>
  );
}

