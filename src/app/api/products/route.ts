
import client from '@/lib/mongodb';
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';


// export async function GET() {
// try {
//   // Read the db.json file from the root directory
//   const dbPath = path.join(process.cwd(), 'public/db.json');
//   const fileContents = fs.readFileSync(dbPath, 'utf8');
//   const data = JSON.parse(fileContents);

//   // Return the data as JSON
//   return NextResponse.json(data);
// } catch (error) {
//   console.error('Error reading db.json:', error);
//   return NextResponse.json(
//     { error: 'Failed to load database' },
//     { status: 500 }
//   );
// }
// }

export const GET = async () => {
    try {
        const db = client.db("going");
        const products = await db
            .collection("products")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        console.log("Products:", products);
        return NextResponse.json({ results: products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching movies:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch movies" });
    }
}


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

interface ProductDb {
    userID: string;
    name: string;
    description: string;
    category: string;
    price: string;
    stock?: number;
    location?: string;
    condition?: string;
    currency: string;
    images: Array<File>;
    tags?: string;
    isService?: boolean;
    acceptSolana?: boolean;
    acceptCredit?: boolean;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
    const data = await request.formData();
    const file = data.get("images") as File;

    const productDb: ProductDb = {
        userID: data.get("userID") as string,
        name: data.get("name") as string,
        description: data.get("description") as string,
        category: data.get("category") as string,
        price: data.get("price") as string,
        currency: data.get("currency") as string,
        images: [file],
        tags: data.get("tags") as string,
        isService: data.get("isService") === "true",
        acceptSolana: data.get("acceptSolana") === "true",
        acceptCredit: data.get("acceptCredit") === "true",
    };

    console.log("Product data:", productDb);

    if (!file) {
        console.error("No file found in form data");
        return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    // Check if the file is a valid image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Buffer:", buffer);

    // Upload the image to Cloudinary
    // const result = {}

    const resultUpload = new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream({}, async (error, result) => {
            if (error) {
                console.error("Error uploading image to Cloudinary:", error);
                reject(error);
            }
            if (result) {
                console.log("Image uploaded to Cloudinary:", result);
                const db = client.db("going");
                const products = await db.collection("products").insertOne({
                    ...productDb,
                    image: result.secure_url,
                });
                //udate user

                await db.collection("users").updateOne(
                    { _id: new ObjectId(productDb.userID) },
                    { $set: { products: products.insertedId } }
                );

                console.log("Product added to database:", products);
                resolve(products);
            }
        }).end(buffer);
    });

    const result = await resultUpload;
    if (!result) {
        console.error("Failed to upload image and add product to database");
        return NextResponse.json({ error: "Failed to upload image and add product" }, { status: 500 });
    }
    console.log("Product added successfully:", result);
    // Return the result

    return NextResponse.json({ result }, { status: 200 });
};