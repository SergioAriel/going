'use server';

import { Order } from "@/interfaces";
import client from "../mongodb";

type OrderUpload = Omit<Order, '_id' | 'signature'>;

export const uploadOrder = async (order: OrderUpload) => {
    const db = client.db("going");
    const newOrderRecord = await db.collection<OrderUpload>("orders")
        .insertOne(order);
    return newOrderRecord.insertedId.toString();
}

export const updateOrder = async (order: Partial<Order> & { _id: string }) => {
    const db = client.db("going");
    const updatedOrder = await db.collection<Order>("orders").updateOne(
        { _id: order._id },
        { $set: { ...order } }
    );
    console.log("Order updated in database:", updatedOrder);
    return { status: true };
}

export const getOrders = async (find: { buyerID?: string | undefined, sellers: string | undefined}) => {
    const db = client.db("going");
    const orders = (await db.collection<Order>("orders")
        .find(find)
        .toArray()).map((order) => ({ ...order, _id: order._id.toString() }))
        console.log("orders", orders);
    return orders;
}