import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function QuickCaptureInput({ onAdd }) {
    const [value, setValue] = useState("");
    const [files, setFiles] = useState([]);

    function handleFileChange(e) {
        const selected = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selected]);
    }

    function removeFile(fileToRemove) {
        setFiles(prev => prev.filter(f => f !== fileToRemove));
    }

    function handleSubmit() {
        const text = value.trim();
        if (!text && files.length === 0) return;

        onAdd(text, files);
        setValue("");
        setFiles([]);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <div className="w-full quick-capture-input">
            <div className="relative w-full">
                <input
                    className="input w-full pr-32"   // 👈 שורה חשובה
                    placeholder="Quick capture..."
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <div
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               flex items-center gap-3 text-sm text-black/50"
                >
                    <label className="cursor-pointer p-1 rounded hover:bg-black/5 transition-colors">
                        <Upload size={16} className="text-black/50" />
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <div className="pl-2 text-sm text-black/50 border-l border-black/10">
                        Enter ↵
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/60">
                    {files.map(file => (
                        <span
                            key={file.name + file.lastModified}
                            className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 bg-black/5"
                        >
                            <span className="max-w-[200px] truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeFile(file)}
                                className="hover:text-red-600 transition-colors cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
