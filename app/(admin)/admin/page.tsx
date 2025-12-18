'use client';

import React from 'react';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { StatCard, Card } from '@/app/components/ui/Card';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { mockDashboardStats, mockOrders } from '@/app/data/mock';
import { UploadIcon, OrdersIcon, ReviewIcon, ProcessIcon } from '@/app/components/icons';
import { Order } from '@/app/types';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const recentOrders = mockOrders.slice(0, 5);

  const orderColumns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order: Order) => (
        <span className="font-medium text-slate-900">{order.id}</span>
      ),
    },
    {
      key: 'businessClient',
      header: 'Business Client',
    },
    {
      key: 'requestedDate',
      header: 'Date',
    },
    {
      key: 'numberOfGuests',
      header: 'Guests',
      render: (order: Order) => (
        <span>{order.numberOfGuests}</span>
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
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="Overview of your group order processing"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Uploads"
          value={mockDashboardStats.totalUploads}
          icon={<UploadIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Processed Today"
          value={mockDashboardStats.ordersProcessedToday}
          icon={<OrdersIcon className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Failed Orders"
          value={mockDashboardStats.failedOrders}
          icon={<ProcessIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Pending Review"
          value={mockDashboardStats.pendingReview}
          icon={<ReviewIcon className="w-6 h-6" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/admin/queue"
              className="block px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 transition-colors"
            >
              View Processing Queue
            </Link>
            <Link
              href="/admin/review"
              className="block px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 transition-colors"
            >
              Manual Review ({mockDashboardStats.pendingReview} pending)
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 transition-colors"
            >
              Manage Users
            </Link>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Processing Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-violet-50 rounded-md">
              <p className="text-2xl font-semibold text-violet-700">
                {mockOrders.filter(o => o.status === 'processing').length}
              </p>
              <p className="text-xs text-violet-600 mt-1">Processing</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-md">
              <p className="text-2xl font-semibold text-amber-700">
                {mockOrders.filter(o => o.status === 'needs_review').length}
              </p>
              <p className="text-xs text-amber-600 mt-1">Needs Review</p>
            </div>
            <div className="text-center p-4 bg-sky-50 rounded-md">
              <p className="text-2xl font-semibold text-sky-700">
                {mockOrders.filter(o => o.status === 'ready_to_send').length}
              </p>
              <p className="text-xs text-sky-600 mt-1">Ready to Send</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-md">
              <p className="text-2xl font-semibold text-emerald-700">
                {mockOrders.filter(o => o.status === 'sent').length}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Sent</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <TableCard
        title="Recent Orders"
        action={
          <Link
            href="/admin/orders"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            View All
          </Link>
        }
      >
        <Table
          columns={orderColumns}
          data={recentOrders}
          keyExtractor={(order) => order.id}
        />
      </TableCard>
    </PageContainer>
  );
}

