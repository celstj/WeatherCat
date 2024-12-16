import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config();

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Connect to MongoDB client once when the server starts
let db;

const connectDb = async () => {
    if (!db) {
    await client.connect();
    db = client.db("weatherAttachments");
    }
};

// Get weather image for a condition
const getWeatherImage = async (condition) => {
    try {
    await connectDb(); // Ensure DB connection
    const collection = db.collection("images");  // Your collection name

    const image = await collection.findOne({ condition });

    return image ? image.url : null;
    } catch (error) {
    console.error("Error fetching weather image:", error);
    return null;
    }
};

export { getWeatherImage };
