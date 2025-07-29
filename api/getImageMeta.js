import { MongoClient } from 'mongodb';

let cachedDb = null;

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: { version: '1' },
    });

    async function connectToMongo() {
    if (cachedDb) return cachedDb;

    if (!client.topology?.isConnected?.()) {
        await client.connect();
    }

    cachedDb = client.db('weatherAttachments');
    return cachedDb;
    }

    export default async function handler(req, res) {
    const { weatherCondition, mode = 'dark_mode' } = req.query;
    const conditionCode = Number(weatherCondition);

    if (isNaN(conditionCode)) {
        return res.status(400).send('Invalid weather condition code');
    }

    try {
        const db = await connectToMongo();
        const collection = db.collection('weather_cat');

        const condition = await Promise.race([
        collection.findOne({ w_code: conditionCode }),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 9000)
        )
        ]);

        if (!condition?.img_url?.[mode]) {
        return res.status(404).send('Image key not found');
        }

        return res.status(200).json({ key: condition.img_url[mode] });

    } catch (err) {
        console.error('Image lookup error:', err.stack || err.message || err);
        return res.status(500).send('Internal server error');
    }
}