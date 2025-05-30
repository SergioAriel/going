'use server'

import { Product } from "@/interfaces";
import client from "../mongodb";
import { ObjectId, SortDirection } from "mongodb";

export const getOneProduct = async (_id: string ): Promise<Product> => {
    const db = client.db("going");
    return (await db
        .collection<Product>("products")
        .find({ _id: new ObjectId(_id) })
        .sort({ metacritic: -1 })
        .limit(10)
        .toArray()
    ).map((product) => ({ ...product, _id: product._id.toString() }))[0]
}

export const getProducts = async (find = {}, sort: { [key: string]: SortDirection } = { metacritic: -1 }) => {
    const db = client.db("going");
    return (await db
        .collection<Product>("products")
        .find(find)
        .sort(sort)
        .limit(10)
        .toArray()).map((product) => ({ ...product, _id: product._id.toString() })
        )
}