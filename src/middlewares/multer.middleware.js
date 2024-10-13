import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        // Use absolute path for the assets folder
        cb(null, path.join(__dirname, '../assets/'));  // Ensure the folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);  // Get the file extension
        const basename = path.basename(file.originalname, ext);  // File name without extension
        cb(null, basename + '-' + uniqueSuffix + ext);  // Add unique suffix to file name
    }
});

const upload = multer({
    storage: storage
});

export default upload;
