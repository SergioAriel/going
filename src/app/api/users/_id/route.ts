import { getUser } from "@/lib/ServerActions/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams
    const _id = searchParams.get('_id')
    if (!_id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const user = await getUser(_id)
    if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
}
