import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/utils/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
