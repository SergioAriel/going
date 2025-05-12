'use server';

import client from "../mongodb";

export const uploadOrder = async (order: {
    buyerID: string;
    sellers: string[];
    signature: string,
    items: {
        _id: string;
        price: number;
        quantity: number;
    }[];
}) => {
    const db = client.db("going");
    const newOrderRecord = await db.collection("orders")
        .insertOne(order);
    return newOrderRecord.insertedId.toString();
}