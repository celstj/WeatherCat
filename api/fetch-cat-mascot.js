import pkg from 'aws-sdk';
const { S3 } = pkg;
import { MongoClient } from 'mongodb';

const s3 = new S3({
    region: 'ap-southeast-2', // or your actual region
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


// const BUCKET_NAME = 'weathercat-2403';

// const dbName = 'weatherAttachments';
// const collectionName = 'weather_cat';

let cachedClient = null;

async function connectToMongo() {
    if(cachedClient) return cachedClient;

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: { version: '1' },
    });
    await client.connect();
    cachedDb = client.db('weatherAttachments'); 
    return client;
}

export default async function handler(req, res) {
    const { weatherCondition, mode = 'dark_mode' } = req.query;

    const conditionCode = Number(weatherCondition);
    if (isNaN(conditionCode)) {
        return res.status(400).send('Invalid weather condition code');
    }

    try {
        // mongodb connection
        const client = await connectToMongo();
        const db = client.db('weatherAttachments');
        const collection = db.collection('weather_cat');

        // fetch doc
        const condition = await collection.findOne({ w_code: conditionCode });

        if (!condition || !condition.img_url || !condition.img_url[mode]) {
        console.warn('Mode not found or img_url malformed:', condition?.img_url);
        return res.status(404).send('Image URL not found.');
        }

        const imageKey = condition.img_url[mode];

        res.status(200).json({ message: "S3 fetch success", key: imageKey });
        return;

        const s3Params = { Bucket: 'weathercat-2403', Key: imageKey };
        // const s3Params = {
        // Bucket: BUCKET_NAME,
        // Key: imageKey,
        // };
        console.time("s3-fetch");
        const data = await s3.getObject(s3Params).promise();

        console.timeEnd("s3-fetch");

        res.setHeader('Content-Type', data.ContentType || 'image/gif');
        res.send(data.Body);
        
    } catch (err) {
        console.error('Error fetching mascot image:', err);
        res.status(500).send('Internal server error');
    }
}
