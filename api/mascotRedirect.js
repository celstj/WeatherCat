export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const { searchParams } = new URL(req.url);
    const imageKey = searchParams.get('key');

    if (!imageKey) {
        return new Response('Missing image key', { status: 400 });
    }

    const publicS3Url = `https://weathercat-2403.s3.ap-southeast-2.amazonaws.com/${imageKey}`;

    return Response.redirect(publicS3Url, 302);
}
