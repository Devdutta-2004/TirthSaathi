import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '6644bbf132e15283de9de0000020a428';
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'musicapp-storage';
    const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '35d3a19b63b58aea7d9a65d5b4b4c5c2';
    const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '0c3d9dd88187989ccaf47eb570d33c35ffddd089e6958c9ca4e3ebf64d957ac9';
    const publicDomain = (process.env.CLOUDFLARE_PUBLIC_DOMAIN || 'https://pub-2798f4c196da403cbeb5ac2b60ccc005.r2.dev').replace(/\/$/, '');

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    const { base64Data, filename: requestedName } = req.body || {};
    const filename = requestedName || `pilgrim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;

    let buffer;
    if (base64Data) {
      const pureBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(pureBase64, 'base64');
    } else {
      buffer = Buffer.from('');
    }

    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: 'image/jpeg'
    }));

    const publicUrl = `${publicDomain}/${filename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      key: filename,
      sizeBytes: buffer.length,
      storageProvider: `Cloudflare R2 Bucket: ${bucketName}`
    });
  } catch (err) {
    console.error('Vercel Cloudflare R2 Upload error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
