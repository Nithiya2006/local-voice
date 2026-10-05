import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `issue-${cleanBaseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter: accept only JPG, JPEG, PNG, WebP
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/i;
  const allowedMimeTypes = /image\/(jpeg|jpg|png|webp)/i;

  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedMimeTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only JPG, JPEG, PNG, and WebP images are allowed."
      ),
      false
    );
  }
};

// Multer instance with 5MB file limit
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Megabytes
  },
  fileFilter
});

// Middleware wrapper to handle multer errors gracefully
export const handleImageUpload = (req, res, next) => {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Uploaded image exceeds the 5MB file size limit."
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload Error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};
