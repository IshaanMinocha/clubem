import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/utils/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const adminId = searchParams.get('adminId');

        if (!adminId) {
            return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await prisma.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role.toLowerCase() !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.emailConfig.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
