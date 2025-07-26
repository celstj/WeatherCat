import { S3 } from 'aws-sdk';
import { MongoClient } from 'mongodb';

const s3 = new S3();
const BUCKET_NAME = 'weathercat-2403';

const dbName = 'weatherAttachments';
const collectionName = 'weather_cat';

let cachedClient = null;

async function connectToMongo() {
    if(cachedClient && cachedClient.isConnected()) {
        return cachedClient;
    }

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: { version: '1' },
    });

    await client.connect();
    cachedClient = client;
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
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // fetch doc
        const condition = await collection.findOne({ w_code: conditionCode });

        if (!condition || !condition.img_url || !condition.img_url[mode]) {
        console.warn('Mode not found or img_url malformed:', condition?.img_url);
        return res.status(404).send('Image URL not found.');
        }

        const imageKey = condition.img_url[mode];

        const s3Params = {
        Bucket: BUCKET_NAME,
        Key: imageKey,
        };

        const data = await s3.getObject(s3Params).promise();

        res.setHeader('Content-Type', data.ContentType || 'image/gif');
        res.send(data.Body);
    } catch (err) {
        console.error('Error fetching mascot image:', err);
        res.status(500).send('Internal server error');
    }
}
