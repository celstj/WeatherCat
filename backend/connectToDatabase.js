import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error('MONGO_URI is not defined. Check your .env file.');
}

const client = new MongoClient(uri);

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);

    } finally {
        await client.close();
    }
};

connectToDatabase();
