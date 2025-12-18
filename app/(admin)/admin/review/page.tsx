'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { mockOrders } from '@/app/data/mock';
import { Order, GuestItem } from '@/app/types';
import { CheckIcon, SendIcon } from '@/app/components/icons';

export default function ManualReviewPage() {
  const ordersNeedingReview = mockOrders.filter(o => o.status === 'needs_review');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    ordersNeedingReview[0] || null
  );
  const [editedItems, setEditedItems] = useState<GuestItem[]>(
    selectedOrder?.items || []
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditedItems([...order.items]);
  };

  const handleItemChange = (itemId: string, field: keyof GuestItem, value: string) => {
    setEditedItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveCorrections = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Corrections saved successfully!');
  };

  const handleApproveAndSend = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Order approved and sent!');
  };

  const orderColumns = [
    {
      key: 'id',
      header: 'Order',
      render: (order: Order) => (
        <span className="font-medium text-slate-900">{order.id}</span>
      ),
    },
    {
      key: 'businessClient',
      header: 'Client',
    },
    {
      key: 'numberOfGuests',
      header: 'Guests',
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
  ];

  return (
    <PageContainer
      title="Manual Review"
      description="Review and correct orders that need human verification"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-1">
          <TableCard
            title="Orders Needing Review"
            description={`${ordersNeedingReview.length} orders`}
          >
            <Table
              columns={orderColumns}
              data={ordersNeedingReview}
              keyExtractor={(order) => order.id}
              onRowClick={handleSelectOrder}
              emptyMessage="No orders need review"
            />
          </TableCard>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <Card>
              <CardHeader
                title={`Review Order ${selectedOrder.id}`}
                description={`${selectedOrder.businessClient} - ${selectedOrder.requestedDate}`}
              />

              {/* Order Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-md">
                <div>
                  <p className="text-xs text-slate-500">Client</p>
                  <p className="font-medium text-slate-900">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pickup Time</p>
                  <p className="font-medium text-slate-900">{selectedOrder.pickupTime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Guests</p>
                  <p className="font-medium text-slate-900">{selectedOrder.numberOfGuests}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Delivery</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedOrder.deliveryMode}</p>
                </div>
              </div>

              {/* Editable Items Table */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                  Guest Items ({editedItems.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">
                          Guest Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">
                          Item
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">
                          Modifications
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editedItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-3 py-2">
                            <Input
                              value={item.guestName}
                              onChange={(e) => handleItemChange(item.id, 'guestName', e.target.value)}
                              className="text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.itemName}
                              onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                              className="text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.modifications}
                              onChange={(e) => handleItemChange(item.id, 'modifications', e.target.value)}
                              className="text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.comments}
                              onChange={(e) => handleItemChange(item.id, 'comments', e.target.value)}
                              className="text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="secondary"
                  onClick={handleSaveCorrections}
                  isLoading={isSaving}
                  leftIcon={<CheckIcon className="w-4 h-4" />}
                >
                  Save Corrections
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApproveAndSend}
                  isLoading={isSaving}
                  leftIcon={<SendIcon className="w-4 h-4" />}
                >
                  Approve & Send
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-slate-500">
                  Select an order from the list to review
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

