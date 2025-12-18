'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { mockOrders } from '@/app/data/mock';
import { GuestItem } from '@/app/types';
import { DownloadIcon, SheetIcon } from '@/app/components/icons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StaffOrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const order = mockOrders.find(o => o.id === id);

  if (!order) {
    return (
      <PageContainer title="Order Not Found">
        <Card>
          <p className="text-slate-600">The requested order could not be found.</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.push('/app/orders')}
          >
            Back to Orders
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const guestColumns = [
    {
      key: 'guestName',
      header: 'Guest Name',
      render: (item: GuestItem) => (
        <span className="font-medium text-slate-900">{item.guestName}</span>
      ),
    },
    {
      key: 'itemName',
      header: 'Item',
    },
    {
      key: 'modifications',
      header: 'Modifications',
      render: (item: GuestItem) => (
        <span className="text-slate-600">{item.modifications || '—'}</span>
      ),
    },
    {
      key: 'comments',
      header: 'Comments',
      render: (item: GuestItem) => (
        <span className="text-slate-600">{item.comments || '—'}</span>
      ),
    },
  ];

  return (
    <PageContainer
      title={`Order ${order.id}`}
      description={`${order.businessClient} - ${order.requestedDate}`}
      action={
        <Button
          variant="secondary"
          onClick={() => router.push('/app/orders')}
        >
          Back to Orders
        </Button>
      }
    >
      {/* Order Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Order Information" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Business Client</p>
              <p className="font-medium text-slate-900">{order.businessClient}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Client Name</p>
              <p className="font-medium text-slate-900">{order.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Group Order Number</p>
              <p className="font-mono text-slate-900">{order.groupOrderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Requested Date</p>
              <p className="font-medium text-slate-900">{order.requestedDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Pickup Time</p>
              <p className="font-medium text-slate-900">{order.pickupTime}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Delivery Mode</p>
              <p className="font-medium text-slate-900 capitalize">{order.deliveryMode}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Number of Guests</p>
              <p className="font-medium text-slate-900">{order.numberOfGuests}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Order Subtotal</p>
              <p className="font-medium text-slate-900">${order.orderSubtotal.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Client Information</p>
              <p className="font-medium text-slate-900">{order.clientInfo}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Status" />
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-2">Current Status</p>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm">
                {formatStatus(order.status)}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Created</p>
              <p className="font-medium text-slate-900">{order.createdAt}</p>
            </div>

            {order.status === 'processing' && (
              <div className="p-3 bg-violet-50 rounded-md">
                <p className="text-sm text-violet-700">
                  Your order is currently being processed. You will be notified when it&apos;s ready.
                </p>
              </div>
            )}

            {order.status === 'needs_review' && (
              <div className="p-3 bg-amber-50 rounded-md">
                <p className="text-sm text-amber-700">
                  This order needs manual review. An admin will review it shortly.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Export Options - Only show when order is ready or sent */}
      {(order.status === 'ready_to_send' || order.status === 'sent') && (
        <Card className="mb-6">
          <CardHeader title="Export Options" />
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              leftIcon={<SheetIcon className="w-4 h-4" />}
              onClick={() => alert('Opening Google Sheets...')}
            >
              Open in Google Sheets
            </Button>
            <Button
              variant="secondary"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => alert('Downloading Excel file...')}
            >
              Export to Excel
            </Button>
            <Button
              variant="secondary"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => alert('Downloading CSV file...')}
            >
              Export to CSV
            </Button>
            <Button
              variant="secondary"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => alert('Downloading PDF file...')}
            >
              Export to PDF
            </Button>
          </div>
        </Card>
      )}

      {/* Guest Items */}
      <TableCard
        title="Guest Items"
        description={`${order.items.length} items in this order`}
      >
        <Table
          columns={guestColumns}
          data={order.items}
          keyExtractor={(item) => item.id}
          emptyMessage="No items in this order"
        />
      </TableCard>
    </PageContainer>
  );
}

