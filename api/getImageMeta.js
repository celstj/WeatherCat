import { MongoClient } from 'mongodb';

let cachedDb = null;
const metaCache = new Map();

async function connectToMongo() {
    if (cachedDb) return cachedDb;

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: { version: '1' },
    });
    await client.connect();

    cachedDb = client.db('weatherAttachments');
    return cachedDb;
}

function setCache(key, value, ttl = 3600) {
metaCache.set(key, { value, expires: Date.now() + ttl * 1000 });
}

function getCache(key) {
const cached = metaCache.get(key);

if (!cached) return null;
if (Date.now() > cached.expires) {
    metaCache.delete(key);
    return null;
}
return cached.value;
}

export default async function handler(req, res) {
    const { weatherCondition, mode = 'dark_mode' } = req.query;
    console.log('[DEBUG] Query:', { weatherCondition, mode });

    const conditionCode = Number(weatherCondition);
    if (isNaN(conditionCode)) {
        console.error('[DEBUG] Invalid weather condition code:', weatherCondition);
        return res.status(400).end('Invalid weather condition code');
    }

    const cacheKey = `${conditionCode}_${mode}`;
    const cached = getCache(cacheKey);
    if (cached) {
        console.log('[DEBUG] Cache hit for', cacheKey);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json({ key: cached });
    }

    try {
        console.log('[DEBUG] Connecting to MongoDB');
        const db = await connectToMongo();
        const collection = db.collection('weather_cat');

        console.log('[DEBUG] Querying MongoDB for code:', conditionCode);
        const result = await Promise.race([
            collection.findOne({ w_code: conditionCode }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 9000)),
        ]);

        console.log('[DEBUG] MongoDB result:', result);

        const imageKey = result?.img_url?.[mode];
        console.log('[DEBUG] Extracted imageKey:', imageKey);

        if (!imageKey) {
            console.warn('[DEBUG] No image key found for mode:', mode);
            return res.status(404).end('Image key not found');
        }

        setCache(cacheKey, imageKey);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json({ key: imageKey });
    } catch (err) {
        console.error('[MongoDB Error]', err.stack || err.message || err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}
