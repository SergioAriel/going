import { User } from '@/interfaces';
import client from '@/lib/mongodb';
import { getProducts } from '@/lib/ServerActions/products';
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = async (_: Request) => {
    try {
        const products = await getProducts()
        return NextResponse.json({ results: products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching movies:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch movies" });
    }
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
    const data = await request.formData();
    const file = data.getAll("images");
    const images = file.map((entry) => entry instanceof File ? entry : null).filter((entry): entry is File => entry !== null)

    const uploadPromises = Array.from(images).map((image): Promise<string> => {
        return new Promise(async (resolve, reject)  => {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            cloudinary.uploader.upload_stream({}, async (error, result) => {
                if (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    reject(error);
                }    
                if (result) {
                    console.log("Image uploaded to Cloudinary:", result);
                    resolve(result.secure_url);
                }
            }).end(buffer);
        });
    });
    const imageUrls = await Promise.all(uploadPromises).catch(() => false);

    if(!imageUrls) {
        console.error("Failed to upload images to Cloudinary");
        return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
    }

    const productDb = {
        seller: data.get("seller") as string,
        name: data.get("name") as string,
        description: data.get("description") as string,
        category: data.get("category") as string,
        price: data.get("price") ? parseInt(data.get("price") as string) : 1,
        currency: data.get("currency") as string,
        stock: data.get("stock") ? parseInt(data.get("stock") as string) : 1,
        location: data.get("location") as string,
        condition: data.get("condition") as string,
        images: Array.isArray(imageUrls) ? [...imageUrls.slice(1)] : [],
        tags: data.get("tags") as string,
        isService: data.get("isService") === "true",
        addressWallet: data.get("addressWallet") as string,
        mainImage: Array.isArray(imageUrls) ? imageUrls[0] : ''
    };

    if (!file) {
        console.error("No file found in form data");
        return NextResponse.json({ error: "No file found" }, { status: 400 });
    }
    // upload multiple images on cloudinary

    


    const db = client.db("going");
    const product = await db.collection("products").insertOne({
        ...productDb,
        images: imageUrls,
    });

    //udate user
    
    await db.collection<User>("users").updateOne(
        { _id: productDb.seller  },
        { $push: { products: product.insertedId }}
    );
    console.log("Product added successfully:", product);
    // Return the result
    return NextResponse.json({ result: product }, { status: 200 });
};