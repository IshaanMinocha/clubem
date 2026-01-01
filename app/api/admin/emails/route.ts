import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/utils/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const adminId = searchParams.get('adminId');

        if (!adminId) {
            return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await prisma.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role.toLowerCase() !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const emails = await prisma.emailConfig.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ emails });
    } catch (error) {
        console.error('Fetch emails error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, adminId } = body;

        if (!adminId) {
            return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await prisma.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role.toLowerCase() !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const existing = await prisma.emailConfig.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const newEmail = await prisma.emailConfig.create({
            data: { email, name }
        });

        return NextResponse.json({ email: newEmail });
    } catch (error) {
        console.error('Create email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
