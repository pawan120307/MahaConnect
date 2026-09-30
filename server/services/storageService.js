const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[StorageService] Initialized with Cloudinary storage');
} else {
  console.log('[StorageService] Cloudinary credentials not configured; using local disk storage in server/uploads');
}

/**
 * Upload a file to storage (Cloudinary or Local disk)
 * @param {Object} file - Multer file object
 * @returns {Promise<{ fileUrl: string, fileKey: string }>}
 */
const uploadFile = async (file) => {
  if (!file) throw new Error('No file provided for upload');

  if (hasCloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mahaconnect_docs',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            fileUrl: result.secure_url,
            fileKey: result.public_id,
          });
        }
      );

      // If buffer is available (memory storage) or file on disk
      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else if (file.path) {
        fs.createReadStream(file.path).pipe(uploadStream);
      } else {
        reject(new Error('Invalid file structure'));
      }
    });
  }

  // Local Storage fallback: Multer diskStorage saves to server/uploads
  const filename = file.filename || path.basename(file.path);
  const fileUrl = `/uploads/${filename}`;
  return {
    fileUrl,
    fileKey: filename,
  };
};

module.exports = {
  uploadFile,
  isCloudinaryActive: hasCloudinary,
};
