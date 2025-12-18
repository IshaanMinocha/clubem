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
import { Order, OrderStatus } from '@/app/types';
import { EyeIcon } from '@/app/components/icons';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.businessClient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'businessClient',
      header: 'Business Client',
      render: (order: Order) => (
        <div>
          <p className="font-medium text-slate-900">{order.businessClient}</p>
          <p className="text-sm text-slate-500">{order.id}</p>
        </div>
      ),
    },
    {
      key: 'clientName',
      header: 'Client Name',
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
      key: 'deliveryMode',
      header: 'Delivery',
      render: (order: Order) => (
        <span className="capitalize">{order.deliveryMode}</span>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/orders/${order.id}`)}
          leftIcon={<EyeIcon className="w-4 h-4" />}
        >
          View
        </Button>
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
      title="All Orders"
      description="View and manage all group orders"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by client, business, or order ID..."
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

