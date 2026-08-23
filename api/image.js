import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
  try {
    const key = req.query.key;
    if (!key) {
      return res.status(400).send('Missing key parameter');
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '6644bbf132e15283de9de0000020a428';
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'musicapp-storage';
    const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '35d3a19b63b58aea7d9a65d5b4b4c5c2';
    const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '0c3d9dd88187989ccaf47eb570d33c35ffddd089e6958c9ca4e3ebf64d957ac9';

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey }
    });

    const s3Obj = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    res.setHeader('Content-Type', s3Obj.ContentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const byteArray = await s3Obj.Body.transformToByteArray();
    return res.status(200).send(Buffer.from(byteArray));
  } catch (err) {
    console.error('Image proxy error:', err);
    return res.status(404).send('Image not found');
  }
}
