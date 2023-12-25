// pages/api/images.tsx

import type { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk';

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (!process.env.BUCKET_NAME || !process.env.PREFIX) {
            res.status(500).json({ error: 'Environment variables BUCKET_NAME and PREFIX are required' });
            return;
        }
    
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: process.env.PREFIX
        };
    
        try {
            const data = await new Promise((resolve, reject) => {
                s3.listObjectsV2(params, (err, data) => {
                    if (err) {
                        console.log('Error in s3.listObjectsV2:', err);
                        reject(err);
                    } else {
                        console.log('Data from s3.listObjectsV2:', data);
                        resolve(data);
                    }
                });
            });
    
            if ((data as AWS.S3.ListObjectsV2Output).Contents) {
                const images = (data as AWS.S3.ListObjectsV2Output | undefined)?.Contents?.map(
                    item => item.Key && item.Key.endsWith('/') ? null : `https://${params.Bucket}.${spacesEndpoint.hostname}/${item.Key}`
                ).filter(item => item !== null);
                    console.log('Images:', images);
                    res.status(200).json(images);
                } else {
                    console.log('No images found');
                    res.status(404).json({ error: 'No images found' });
            }
        } catch (err) {
            console.log('Error in try-catch block:', err, err.stack);
            res.status(500).json({ error: 'Failed to fetch images' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}