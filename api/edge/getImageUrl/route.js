// /app/api/edge/getImageUrl/route.js
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const runtime = 'edge';

const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    });

    export async function POST(req) {
    try {
        const { key } = await req.json();

        if (!key) {
        return new Response(JSON.stringify({ error: 'Missing image key' }), { status: 400 });
        }

        const command = new GetObjectCommand({
        Bucket: 'weathercat-2403',
        Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        return new Response(JSON.stringify({ url: signedUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[S3 Error]', err.stack || err.message || err);
        return new Response(JSON.stringify({ error: 'Failed to generate signed URL' }), { status: 500 });
    }
}
