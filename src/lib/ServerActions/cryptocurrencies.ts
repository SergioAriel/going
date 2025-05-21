'use server'

import { Currency } from "@/interfaces";
import client from "../mongodb";
import { ObjectId } from "mongodb";

export const getCurrencies =async ():  Promise<Currency[]> => {
    const db = client.db('cryptocurrencies')
    const currencies = await db.collection<{_id: ObjectId, list: Currency[], createdAt: Date}>('cryptocurrencies').findOne()

    return currencies?.list || []
}