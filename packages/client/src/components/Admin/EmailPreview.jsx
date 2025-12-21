export default function EmailPreview({ subject, htmlContent }) {
    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black/80 mb-4">Email Preview</h3>

            {/* Subject Preview */}
            <div className="mb-4">
                <p className="text-sm font-medium text-black/60 mb-2">Subject:</p>
                <div className="border border-black/10 rounded-lg p-3 bg-black/5">
                    <p className="text-black/80 font-medium">{subject || "(No subject)"}</p>
                </div>
            </div>

            {/* HTML Content Preview */}
            <div>
                <p className="text-sm font-medium text-black/60 mb-2">Content:</p>
                <div className="border border-black/10 rounded-lg p-4 bg-white">
                    {htmlContent ? (
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    ) : (
                        <p className="text-black/40 italic">(No content)</p>
                    )}
                </div>
            </div>
        </div>
    );
}
