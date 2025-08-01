import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
    await dbConnect();
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        await Notification.updateMany(
            { user: decoded.id, isRead: false },
            { $set: { isRead: true } }
        );
        
        return NextResponse.json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating notifications' }, { status: 500 });
    }
}