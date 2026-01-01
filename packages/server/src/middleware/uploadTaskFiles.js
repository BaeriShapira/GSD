import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/tasks");

// אם התיקייה לא קיימת — ליצור
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    },
});

// מגבלות (שומרים על כמה שפחות מקום כרגע)
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB לקובץ
        files: 5,
    },
    fileFilter(req, file, cb) {
        const allowed = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "application/pdf",
        ];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Unsupported file type"), false);
        }
        cb(null, true);
    },
});

// אותו שם בדיוק כמו formData.append("files", file)
export const uploadTaskFiles = upload.array("files", 5);

// Middleware לטיפול בשגיאות העלאה
export function handleUploadErrors(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // שגיאות של multer
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size exceeds 5MB limit" });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ error: "Maximum 5 files allowed" });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }

    if (err) {
        // שגיאות אחרות (כמו fileFilter)
        if (err.message === "Unsupported file type") {
            return res.status(400).json({
                error: "Only images (PNG, JPEG, WEBP) and PDF files are allowed"
            });
        }
        return res.status(400).json({ error: err.message });
    }

    next();
}
