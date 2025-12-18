'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { mockOrders } from '@/app/data/mock';
import { Order } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';
import { EyeIcon, DownloadIcon } from '@/app/components/icons';

export default function StaffOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter orders to only show current user's orders
  // In real app, this would be filtered by backend
  const userOrders = mockOrders.filter(order => 
    order.uploadedBy === user?.name || order.uploadedBy === 'Sarah Johnson'
  );

  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = 
      order.businessClient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'clientName',
      header: 'Client',
      render: (order: Order) => (
        <div>
          <p className="font-medium text-slate-900">{order.clientName}</p>
          <p className="text-sm text-slate-500">{order.businessClient}</p>
        </div>
      ),
    },
    {
      key: 'requestedDate',
      header: 'Requested Date',
    },
    {
      key: 'numberOfGuests',
      header: 'Guests',
      render: (order: Order) => (
        <span className="font-medium">{order.numberOfGuests}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => (
        <Badge variant={getStatusBadgeVariant(order.status)}>
          {formatStatus(order.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (order: Order) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/app/orders/${order.id}`)}
            leftIcon={<EyeIcon className="w-4 h-4" />}
          >
            View
          </Button>
          {order.status === 'sent' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('Downloading...')}
              leftIcon={<DownloadIcon className="w-4 h-4" />}
            >
              Export
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'processing', label: 'Processing' },
    { value: 'needs_review', label: 'Needs Review' },
    { value: 'ready_to_send', label: 'Ready to Send' },
    { value: 'sent', label: 'Sent' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <PageContainer
      title="My Orders"
      description="View and track orders from your uploads"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by client or order ID..."
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
          keyExtractor={(order) => order.id}
          emptyMessage="No orders found"
        />
      </TableCard>
    </PageContainer>
  );
}

