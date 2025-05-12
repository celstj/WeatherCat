import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import pkg from 'aws-sdk';
import { MongoClient } from 'mongodb'; // Import MongoDB client

const { S3 } = pkg;
const app = express();

// S3 Configuration (for accessing the private S3 bucket)
const s3 = new S3();
const BUCKET_NAME = 'weathercat-2403'; 

// MongoDB configuration
// const mongoURI = process.env.MONGO_URI;
const dbName = 'weatherAttachments'; 
const collectionName = 'weather_cat'; 
// const client = new MongoClient(mongoURI, { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// });

console.log('MONGO_URI:', process.env.MONGO_URI); // DEBUG LINE
const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: { version: '1' } 
});

let isConnected = false;

// API endpoint to fetch the mascot image
app.get('/api/fetch-cat-mascot', async (req, res) => {
    const { weatherCondition, mode = 'dark_mode' } = req.query; 

    const conditionCode = Number(weatherCondition);

    if (isNaN(conditionCode)) {
        return res.status(400).send('Invalid weather condition code');
    }

    try {
        if (!isConnected) {
            await client.connect();
            isConnected = true;
        }
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch the mapping from MongoDB based on weather condition
        console.log(`weaherCondition: ${weatherCondition}, mode: ${mode}`);

        const condition = await collection.findOne({w_code: conditionCode });
        console.log('Matched condition:', condition);

        // make sure img_url and requested mode exist
        if (!condition || !condition.img_url || !condition.img_url[mode]) {
            console.warn('Mode not found or img_url malformed:', condition?.img_url);
            return res.status(404).send(`Image URL not found.`);
        }

        const imageKey = condition.img_url[mode];

        const s3Params = {
            Bucket: BUCKET_NAME,
            Key: imageKey
        };

        const data = await s3.getObject(s3Params).promise();

        res.set('Content-Type', data.ContentType || 'image/gif');
        res.send(data.Body);
    } catch (err) {
        console.error('Error fetching mascot image:', err);
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection');
    await client.close();
    process.exit(0);
});