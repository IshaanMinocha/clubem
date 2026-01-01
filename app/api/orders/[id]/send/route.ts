import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/utils/prisma';
import nodemailer from 'nodemailer';
import * as XLSX from 'xlsx';
import { prepareExportData } from '@/src/utils/export';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { emails, message, format = 'excel', userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: 'At least one email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: { platform: true },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const fullSheetData = prepareExportData(order);
        let attachment: Buffer;
        let filename: string;
        let contentType: string;

        if (format === 'csv') {
            const csv = fullSheetData.map(row => 
                row.map(cell => {
                    const s = String(cell ?? '');
                    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                        return `"${s.replace(/"/g, '""')}"`;
                    }
                    return s;
                }).join(',')
            ).join('\n');
            attachment = Buffer.from(csv);
            filename = `order_${order.groupOrderNumber}.csv`;
            contentType = 'text/csv';
        } else {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(fullSheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Order Export');
            attachment = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            filename = `order_${order.groupOrderNumber}.xlsx`;
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }

        // Configure transporter
        // NOTE: In a real app, these should be in environment variables
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails.join(', '),
            subject: `Order Export: ${order.groupOrderNumber}`,
            text: message || 'Please find the attached order export.',
            attachments: [
                {
                    filename,
                    content: attachment,
                    contentType,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Send export error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
