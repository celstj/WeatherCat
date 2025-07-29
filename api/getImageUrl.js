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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'Missing image key' });
        }

        const cachedUrl = getCache(key);
        if (cachedUrl) {
            res.setHeader('Cache-Control', 'public, max-age=60');
            return res.status(200).json({ url: cachedUrl });
        }

        const command = new GetObjectCommand({
            Bucket: 'weathercat-2403',
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
        setCache(key, signedUrl);

        res.setHeader('Cache-Control', 'public, max-age=60');
        return res.status(200).json({ url: signedUrl });
    } catch (err) {
        console.error('[S3 Error]', err.stack || err.message || err);
        return res.status(500).json({ error: 'Failed to generate signed URL' });
    }
}
