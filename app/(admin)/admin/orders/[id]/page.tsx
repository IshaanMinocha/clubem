'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { mockOrders } from '@/app/data/mock';
import { GuestItem } from '@/app/types';
import { SendIcon, ReviewIcon, DownloadIcon, SheetIcon } from '@/app/components/icons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const order = mockOrders.find(o => o.id === id);
  const [isSending, setIsSending] = useState(false);

  if (!order) {
    return (
      <PageContainer title="Order Not Found">
        <Card>
          <p className="text-slate-600">The requested order could not be found.</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.push('/admin/orders')}
          >
            Back to Orders
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const handleConfirmAndSend = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    // In real app, this would trigger API call
    alert('Order sent successfully!');
  };

  const handleSendToReview = () => {
    router.push(`/admin/review?order=${order.id}`);
  };

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
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push('/admin/orders')}
          >
            Back
          </Button>
        </div>
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
          <CardHeader title="Status & Actions" />
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-2">Current Status</p>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm">
                {formatStatus(order.status)}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Uploaded By</p>
              <p className="font-medium text-slate-900">{order.uploadedBy}</p>
              <p className="text-xs text-slate-500">{order.createdAt}</p>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <Button
                variant="primary"
                className="w-full"
                leftIcon={<SendIcon className="w-4 h-4" />}
                onClick={handleConfirmAndSend}
                isLoading={isSending}
                disabled={order.status === 'sent'}
              >
                Confirm & Send
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                leftIcon={<ReviewIcon className="w-4 h-4" />}
                onClick={handleSendToReview}
              >
                Send to Manual Review
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Options */}
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

