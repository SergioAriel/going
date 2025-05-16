import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
            {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY || "",
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

        return NextResponse.json(list, { status: 200 });
    } catch (error) {
        console.error("Error fetching currency:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch currency" });
    }
}