'use server'

import { User } from "@/interfaces";
import client from "../mongodb";

export const getUser = async(_id: string): Promise<User | null>  => {
    const db = client.db("going");
    return await db
        .collection<User>("users")
        .findOne<User>({ '_id': _id });
}

export const updateUser = async(user: Partial<User> & { _id: string }) => {
    const db = client.db("going");
    try {
        const updatedUser = await db.collection<User>("users").updateOne(
            { _id: user._id },
            { $set: { ...user } }
        );
        console.log("User updated in database:", updatedUser);
        return {status: true};
    } catch (error) {
        return {status: false, error: error};
    }
}

export const uploadUser = async(user: User) => {
    const db = client.db("going");
    try {
        const newUser = await db.collection<User>("users").insertOne(
            { ...user }
        );
        console.log("User created in database:", newUser);
        return {status: true, user: newUser};
    } catch (error) {
        return {status: false, error: error};
    }
}