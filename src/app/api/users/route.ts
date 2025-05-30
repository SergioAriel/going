import { User } from "@/interfaces";
import client from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const POST = async (request: NextRequest) => {
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
    const user: User = await request.json();

    const db = client.db("going");
    const updatedUser = await db.collection<User>("users").updateOne(
        { _id: user._id },
        { $set: { ...user } }
    );
    console.log("User updated in database:", updatedUser);
    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
}