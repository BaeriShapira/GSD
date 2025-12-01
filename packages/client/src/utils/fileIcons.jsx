import { FileText, Image, File } from "lucide-react";

/**
 * מחזיר את האייקון המתאים לסוג הקובץ
 */
export function getFileIcon(filename, size = 14) {
    if (!filename) return <File size={size} />;

    const ext = filename.split(".").pop()?.toLowerCase();

    // תמונות
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
        return <Image size={size} className="text-blue-600" />;
    }

    // PDF
    if (ext === "pdf") {
        return <FileText size={size} className="text-red-600" />;
    }

    // קובץ כללי
    return <File size={size} className="text-gray-600" />;
}
