import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToMongo() {
    if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: { version: '1' },
    });
    await client.connect();

    const db = client.db('weatherAttachments');
    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

export default async function handler(req, res) {
    const { weatherCondition, mode = 'dark_mode' } = req.query;

    const conditionCode = Number(weatherCondition);
    if (isNaN(conditionCode)) {
        return res.status(400).send('Invalid weather condition code');
    }

    try {
        const { db } = await connectToMongo();
        const collection = db.collection('weather_cat');

        const condition = await collection.findOne({ w_code: conditionCode });

        if (!condition || !condition.img_url || !condition.img_url[mode]) {
        return res.status(404).send('Image key not found');
        }

        const imageKey = condition.img_url[mode];
        return res.status(200).json({ key: imageKey });
    } catch (err) {
        console.error('MongoDB error:', err);
        return res.status(500).send('Internal server error');
    }
}
