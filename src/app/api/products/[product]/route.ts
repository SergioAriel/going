import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ product: string }> }) => {
    const productID = (await params).product;
    try {
        const db = client.db("going");
        const product = await db
            .collection("products")
            .find({ _id: new ObjectId(productID)})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        return NextResponse.json({ product: product[0], seller: {}}, { status: 200 });
    } catch (error) {
        console.error("Error fetching movies:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch movies" });
    }
}
