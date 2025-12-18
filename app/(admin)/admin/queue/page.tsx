'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Table, TableCard } from '@/app/components/ui/Table';
import { Badge, getStatusBadgeVariant, formatStatus } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { mockOrders } from '@/app/data/mock';
import { Order, ProcessingStep } from '@/app/types';
import { RefreshIcon } from '@/app/components/icons';

const stepLabels: Record<ProcessingStep, string> = {
  ocr: 'OCR',
  extraction: 'Extraction',
  formatting: 'Formatting',
  email: 'Email',
};

export default function ProcessingQueuePage() {
  const [orders, setOrders] = useState(mockOrders.filter(o => 
    o.status === 'processing' || o.status === 'failed'
  ));

  const handleRetry = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'processing' as const, currentStep: 'ocr' as const }
          : order
      )
    );
  };

  const columns = [
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
      key: 'groupOrderNumber',
      header: 'Group Order #',
      render: (order: Order) => (
        <span className="text-slate-600 font-mono text-sm">{order.groupOrderNumber}</span>
      ),
    },
    {
      key: 'currentStep',
      header: 'Current Step',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(['ocr', 'extraction', 'formatting', 'email'] as ProcessingStep[]).map((step, idx) => {
              const stepIndex = ['ocr', 'extraction', 'formatting', 'email'].indexOf(order.currentStep);
              const currentStepIndex = idx;
              const isCompleted = currentStepIndex < stepIndex;
              const isCurrent = currentStepIndex === stepIndex;
              
              return (
                <div
                  key={step}
                  className={`
                    w-2 h-2 rounded-full
                    ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-violet-500' : 'bg-slate-200'}
                  `}
                  title={stepLabels[step]}
                />
              );
            })}
          </div>
          <span className="text-sm text-slate-600">{stepLabels[order.currentStep]}</span>
        </div>
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
        order.status === 'failed' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleRetry(order.id)}
            leftIcon={<RefreshIcon className="w-4 h-4" />}
          >
            Retry
          </Button>
        )
      ),
    },
  ];

  return (
    <PageContainer
      title="Processing Queue"
      description="Monitor and manage orders in the processing pipeline"
    >
      {/* Processing Steps Legend */}
      <div className="mb-6 p-4 bg-white rounded-md border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Processing Pipeline</h3>
        <div className="flex flex-wrap gap-6">
          {(['ocr', 'extraction', 'formatting', 'email'] as ProcessingStep[]).map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                {idx + 1}
              </div>
              <span className="text-sm text-slate-700">{stepLabels[step]}</span>
            </div>
          ))}
        </div>
      </div>

      <TableCard
        title="Active Queue"
        description={`${orders.length} orders in queue`}
      >
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(order) => order.id}
          emptyMessage="No orders currently in queue"
        />
      </TableCard>
    </PageContainer>
  );
}

