import client from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const expectedSecret = process.env.API_KEY_COINMARKETCAP;
    const providedSecret = searchParams.get('secret');

    if (!providedSecret || providedSecret !== expectedSecret) {
        return new Response(JSON.stringify({ error: 'Acceso no autorizado' }), { status: 401 });
    }

    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
            {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY_COINMARKETCAP || "",
                },
            }
        );
        const { data } = await response.json();
        const list = data.map(({ symbol, name, quote: { USD: { price } } }: { symbol: string; name: string; quote: { USD: { price: number } } }) => {
            return {
                symbol,
                name,
                price,
            };
        });
        console.log(list);
        client.db("cryptocurrencies").collection("cryptocurrencies").insertOne({
            list,
            createdAt: new Date(),
        });

        return NextResponse.json(list, { status: 200 });
    } catch (error) {
        console.error("Error fetching currency:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch currency" });
    }
}