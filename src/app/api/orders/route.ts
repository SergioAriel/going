
import { uploadOrder } from '@/lib/ServerActions/orders';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
    req: NextRequest,
) => {
    try {
        const order = await req.json();
        const orderId = await uploadOrder(order)

        return NextResponse.json({ orderId: orderId }, { status: 201 });
    } catch (error) {
        console.error('Error in /api/orders endpoint:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}