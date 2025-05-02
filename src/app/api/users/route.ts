import client from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

interface UserData {
    _id: string;
    name: string;
    addresses: Array<string>;
    email: string;
    avatar: string;
    joined: string;
    location: string;
    bio: string;
    website: string;
    twitter: string;
    x: string;
    instagram: string;
    telegram: string;
    facebook: string;
}


export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams
    const _id= searchParams.get('_id')
    const db = client.db("going");
    if (!_id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const user = await db.collection("users").findOne({ '_id': _id });
    if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData: UserData = {
        _id: user._id.toString(),
        name: user.name,
        addresses: user.addresses,
        email: user.email,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        website: user.website,
        twitter: user.twitter,
        x: user.x,
        instagram: user.instagram,
        telegram: user.telegram,
        facebook: user.facebook,
        joined: user.joined,
    }
    
    return NextResponse.json(userData, { status: 200 });
}

export const POST = async (request: Request) => {
    const user = await request.json();

    const resultUpload = new Promise(async (resolve) => {

        const db = client.db("going");
        const newUser = await db.collection("users").insertOne(user);
        console.log("Product added to database:", newUser);
        resolve(newUser);
        return

    });

    const result = await resultUpload;
    return NextResponse.json({ message: "User added successfully", result }, { status: 200 });
}

export const PUT = async (request: Request) => {
    const body = await request.formData();

    const userData: UserData = {
        _id: body.get("id") as string,
        name: body.get("name") as string,
        addresses: body.get("addresses") ? (body.get("addresses") as string).split(",") : [],
        email: body.get("email") as string,
        avatar: body.get("image") as string,
        location: body.get("location") as string,
        bio: body.get("bio") as string,
        website: body.get("website") as string,
        twitter: body.get("twitter") as string,
        instagram: body.get("instagram") as string,
        telegram: body.get("telegram") as string,
        facebook: body.get("facebook") as string,
        x: body.get("x") as string,
        joined: new Date().toISOString(),
    }
    const db = client.db("going");

    const updatedUser = await db.collection("users").updateOne(
        { _id: ObjectId.createFromHexString(userData._id) },
        { $set: { ...userData } }
    );
    console.log("User updated in database:", updatedUser);
    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
}