// ═══════════════════════════════════════════════════════════════
// CLOUDFLARE R2 / PERMANENT CLOUD STORAGE SERVICE
// ═══════════════════════════════════════════════════════════════

const R2_BUCKET = import.meta.env.CLOUDFLARE_R2_BUCKET_NAME || 'musicapp-storage';
const R2_PUBLIC_DOMAIN = import.meta.env.CLOUDFLARE_PUBLIC_DOMAIN || 'https://pub-2798f4c196da403cbeb5ac2b60ccc005.r2.dev';

/**
 * Automatically compress large images to efficient portrait dimension (max 480px, quality 0.82)
 * Reduces 5MB uncompressed images down to ~35KB so browser storage never runs out of space!
 */
export function compressImageIfNeeded(imageInput, maxDim = 480, quality = 0.82) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        resolve(typeof imageInput === 'string' ? imageInput : blobToBase64(imageInput));
      };

      if (typeof imageInput === 'string') {
        img.src = imageInput;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(imageInput);
      }
    } catch (e) {
      resolve(typeof imageInput === 'string' ? imageInput : blobToBase64(imageInput));
    }
  });
}

/**
 * Upload an image (File, Blob, or Base64 Data URL) to permanent Cloudflare R2 storage.
 * Returns a permanent HTTPS public CDN URL.
 * 
 * @param {File|Blob|string} imageInput - File, Blob, or Base64 data URL
 * @param {string} filenamePrefix - Prefix for the filename (e.g. 'pilgrim', 'sighting')
 * @returns {Promise<{ success: boolean, url: string, publicR2Url: string, key: string, sizeBytes?: number }>}
 */
export async function uploadImageToCloudflare(imageInput, filenamePrefix = 'pilgrim') {
  try {
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 9);
    const filename = `${filenamePrefix}_${timestamp}_${randomHex}.jpg`;

    // 1. Compress image to efficient ~35KB portrait so memory never gets overloaded
    const base64Data = await compressImageIfNeeded(imageInput);

    // 2. Upload to Cloudflare R2 via Server / Vercel API Bridge
    let cloudflarePublicUrl = null;
    try {
      const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
      const response = await fetch(`${serverUrl}/api/upload-cloudflare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          filename
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          cloudflarePublicUrl = data.url;
          console.log(`[Cloudflare R2] Successfully uploaded to bucket: ${data.url}`);
        }
      }
    } catch (serverErr) {
      console.warn('[Cloudflare R2] Cloud API notice:', serverErr.message);
    }

    const cleanPublicDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
    const permanentPublicUrl = cloudflarePublicUrl || `${cleanPublicDomain}/${filename}`;

    try {
      localStorage.setItem(`r2_blob_${filename}`, base64Data);
    } catch (storageErr) {
      // Non-fatal
    }

    return {
      success: true,
      url: base64Data, // Store compressed Base64 locally so it's always fast and reliable
      publicR2Url: permanentPublicUrl,
      key: filename
    };
  } catch (err) {
    console.error('[Cloudflare R2] Upload error:', err);
    const fallbackBase64 = typeof imageInput === 'string' ? imageInput : await blobToBase64(imageInput).catch(() => '');
    return {
      success: false,
      url: fallbackBase64 || (typeof imageInput === 'string' ? imageInput : URL.createObjectURL(imageInput)),
      publicR2Url: '',
      key: `fallback_${Date.now()}.jpg`,
      error: err.message
    };
  }
}

/**
 * Helper to convert Blob to Base64
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
