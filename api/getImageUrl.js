import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const urlCache = new Map();

function setCache(key, value, ttl = 60) {
    urlCache.set(key, { value, expires: Date.now() + ttl * 1000 });
}

function getCache(key) {
    const cached = urlCache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expires) {
        urlCache.delete(key);
        return null;
    }
    return cached.value;
}

export default async function handler(req, res) {
    console.log('[API] /api/getImageUrl invoked');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key } = req.body;
        console.log('[API] Received key:', key);

        if (!key || typeof key !== 'string' || !key.trim()) {
            console.error('[Validation Error] Invalid or empty key:', key);
            return res.status(400).json({ error: 'Missing or invalid image key' });
        }


        const cachedUrl = getCache(key);
        if (cachedUrl) {
            console.log('[Cache] Returning cached S3 URL for key:', key);
            res.setHeader('Cache-Control', 'public, max-age=60');
            return res.status(200).json({ url: cachedUrl });
        }

        const command = new GetObjectCommand({
            Bucket: 'weathercat-2403',
            Key: key,
        });

        console.log('[S3] Getting signed URL for:', key);

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        setCache(key, signedUrl);

        console.log('[S3] Signed URL generated:', signedUrl);

        res.setHeader('Cache-Control', 'public, max-age=60');
        return res.status(200).json({ url: signedUrl });
    } catch (err) {
        console.error('[S3 Error - Full Dump]');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Full error object:', JSON.stringify(err, null, 2));

        return res.status(500).json({ error: 'Failed to generate signed URL', details: err.message });
    }

}
