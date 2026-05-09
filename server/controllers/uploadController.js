const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const urls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'borrvio' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });
      urls.push(result.secure_url);
    }

    res.status(200).json({ urls });

  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };

/*const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'borrvio' },
        (error, result) => {
          if (error) {
            console.log('Cloudinary Error:', error);
            reject(error);
          }
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.log('Upload Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };*/