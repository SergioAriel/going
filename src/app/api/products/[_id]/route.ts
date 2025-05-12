
import { getOneProduct } from "@/lib/ServerActions/products";
import { NextResponse } from "next/server";

export const GET = async (_: Request, { params }: { params: Promise<{ _id: string }> }) => {
    const _id = (await params)._id;
    try {
        const product = getOneProduct({_id});
        return NextResponse.json({ product: product, seller: {}}, { status: 200 });
    } catch (error) {
        console.error("Error fetching movies:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch movies" });
    }
}
