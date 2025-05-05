import client from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';


export const POST = async (
    req: NextRequest,
) => {
    try {

        const { buyer, sellers, signature } = await req.json();
        const db = client.db("going");
        const newOrderRecord = await db.collection("orders")
            .insertOne({
                buyerId: buyer,
                signature,
                sellers,
            });


        return NextResponse.json({ orderID: newOrderRecord.insertedId }, {status: 201}); // Código 201: Created

        // --- 4. Respuesta Exitosa ---
        // Responder al frontend con el ID de la orden creada.

    } catch (error) {
        // 5. Manejo de Errores
        console.error('Error in /api/orders endpoint:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });

    }
}