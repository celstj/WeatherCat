import { MongoClient } from 'mongodb';

export const config = {
    runtime: 'edge',
    };

    let cachedDb = null;

    async function connectToMongo() {
    if (cachedDb) return cachedDb;
    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: { version: '1' },
    });
    await client.connect();
    cachedDb = client.db('weatherAttachments');
    return cachedDb;
    }

    export default async function handler(req) {
    const { searchParams } = new URL(req.url);
    const weatherCondition = searchParams.get('weatherCondition');
    const mode = searchParams.get('mode') || 'dark_mode';
    const conditionCode = Number(weatherCondition);

    if (isNaN(conditionCode)) {
        return new Response('Invalid weather condition code', { status: 400 });
    }

    try {
        const db = await connectToMongo();
        const collection = db.collection('weather_cat');

        const result = await Promise.race([
        collection.findOne({ w_code: conditionCode }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 9000)),
        ]);

        if (!result?.img_url?.[mode]) {
        return new Response('Image key not found', { status: 404 });
        }

        return new Response(JSON.stringify({ key: result.img_url[mode] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[MongoDB Error]', err.stack || err.message || err);
        return new Response('Internal server error', { status: 500 });
    }
}